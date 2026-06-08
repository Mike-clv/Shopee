import { createHash } from 'node:crypto';
import { getPrisma } from '../prisma.js';
import { accessTradeFetch, isAccessTradeConfigured } from './client.js';

const DEFAULT_PAGE_SIZE = Math.min(Number.parseInt(process.env.ACCESSTRADE_SYNC_PAGE_SIZE || '50', 10), 50);
const MAX_PAGES = Number.parseInt(process.env.ACCESSTRADE_SYNC_MAX_PAGES || '0', 10);
const MAX_ITEMS = Number.parseInt(process.env.ACCESSTRADE_SYNC_MAX_ITEMS || '0', 10);
const STALE_SYNC_WINDOW_MS = Number.parseInt(process.env.ACCESSTRADE_SYNC_STALE_MS || `${15 * 60 * 1000}`, 10);

const platformNames = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiki: 'Tiki',
  tiktok_shop: 'TikTok Shop',
  sendo: 'Sendo',
  other: 'Khác',
};

const platformLogos = {
  shopee: 'https://cdn.simpleicons.org/shopee/EE4D2D',
  tiki: 'https://logo.clearbit.com/tiki.vn',
  lazada: 'https://logo.clearbit.com/lazada.vn',
  tiktok_shop: 'https://cdn.simpleicons.org/tiktok/111111',
};

const platformWebsites = {
  shopee: 'https://shopee.vn',
  lazada: 'https://www.lazada.vn',
  tiki: 'https://tiki.vn',
  tiktok_shop: 'https://shop.tiktok.com',
};

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function stripHtml(value) {
  return compact(
    String(value || '')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  );
}

function slugify(value) {
  const normalized = String(value || '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'item';
}

function shortHash(value) {
  return createHash('sha1').update(String(value || '')).digest('hex').slice(0, 10);
}

function safeId(prefix, value) {
  return `${prefix}_${slugify(value).slice(0, 80)}_${shortHash(value)}`;
}

function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'object' && value.$date) return parseDate(value.$date);
  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const text = String(value).trim();
  const normalized = /^\d{4}\/\d{2}\/\d{2}/.test(text)
    ? text.replace(/\//g, '-').replace(' ', 'T')
    : text;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const parsed = Number.parseFloat(String(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value) {
  const amount = toNumber(value);
  if (!amount) return null;
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes'].includes(String(value || '').toLowerCase());
}

function inferPlatform(item = {}) {
  const haystack = [
    item.merchant,
    item.domain,
    item.campaign_name,
    item.name,
    item.url,
  ].map(value => String(value || '').toLowerCase()).join(' ');

  if (haystack.includes('tiktok')) return 'tiktok_shop';
  if (haystack.includes('shopee')) return 'shopee';
  if (haystack.includes('lazada')) return 'lazada';
  if (haystack.includes('tikivn') || haystack.includes('tiki.vn') || haystack.includes(' tiki')) return 'tiki';
  if (haystack.includes('sendo')) return 'sendo';
  return 'other';
}

function isMarketplaceWideVoucher(item = {}) {
  const platform = inferPlatform(item);
  if (!['shopee', 'lazada', 'tiki', 'tiktok_shop'].includes(platform)) return false;

  const shopId = item.shop_id === undefined || item.shop_id === null || item.shop_id === ''
    ? null
    : Number(item.shop_id);
  if (shopId !== null && Number.isFinite(shopId) && shopId !== 0) return false;

  const title = compact(item.name || '');
  const bracketMatch = title.match(/^\[([^\]]+)]/);
  if (bracketMatch) {
    const bracketText = slugify(bracketMatch[1]);
    const platformTokens = {
      shopee: ['shopee'],
      lazada: ['lazada'],
      tiki: ['tiki'],
      tiktok_shop: ['tiktok', 'tik-tok', 'tiktok-shop'],
    }[platform];
    if (!platformTokens.some(token => bracketText.includes(token))) return false;
  }

  const merchant = String(item.merchant || '').toLowerCase();
  const campaignName = String(item.campaign_name || '').toLowerCase();
  const domain = String(item.domain || '').toLowerCase();
  const platformSignals = {
    shopee: ['shopee'],
    lazada: ['lazada'],
    tiki: ['tiki', 'tikivn'],
    tiktok_shop: ['tiktok'],
  }[platform];

  return platformSignals.some(signal => (
    merchant.includes(signal) ||
    campaignName.includes(signal) ||
    domain.includes(signal)
  ));
}

function getCategoryFromVoucher(item = {}) {
  const first = Array.isArray(item.categories) ? item.categories[0] : null;
  const name = compact(first?.category_name_show || first?.category_name || item.keyword?.[0] || 'Khác');
  const slug = slugify(name);

  return {
    id: safeId('cat_at', slug),
    name,
    slug,
    icon: 'ShoppingBag',
    description: `Danh mục khuyến mại AccessTrade: ${name}`,
    is_active: true,
    sort_order: 100,
  };
}

function getBrandFromVoucher(item = {}) {
  const platform = inferPlatform(item);
  const displayName = platform !== 'other'
    ? platformNames[platform]
    : compact(item.campaign_name || item.merchant || item.domain || 'AccessTrade');
  const slug = slugify(displayName);

  return {
    id: safeId('brand_at', slug),
    name: displayName,
    slug,
    logo: platformLogos[platform] || item.image || null,
    platform,
    description: compact(`Khuyến mại ${displayName} đồng bộ từ AccessTrade.`),
    website_url: item.link || null,
    accesstrade_campaign_id: item.campaign_id ? String(item.campaign_id) : null,
    is_featured: true,
    is_active: true,
    sort_order: platform === 'other' ? 50 : 10,
  };
}

function getCanonicalPlatformBrands() {
  return ['shopee', 'lazada', 'tiki', 'tiktok_shop'].map((platform, index) => {
    const name = platformNames[platform];
    const slug = slugify(name);

    return {
      id: safeId('brand_at', slug),
      name,
      slug,
      logo: platformLogos[platform],
      platform,
      description: compact(`Logo sàn ${name} dùng cho khu vực thương hiệu nổi bật.`),
      website_url: platformWebsites[platform],
      accesstrade_campaign_id: null,
      is_featured: true,
      is_active: true,
      sort_order: index + 1,
    };
  });
}

function getCanonicalCategories() {
  return [
    ['Thời Trang', 'thoi-trang', 'Shirt'],
    ['Mỹ Phẩm', 'my-pham', 'Sparkles'],
    ['Mẹ & Bé', 'me-va-be', 'Baby'],
    ['Điện Tử', 'dien-tu', 'Smartphone'],
    ['Nhà Cửa', 'nha-cua', 'Home'],
    ['Sức Khỏe', 'suc-khoe', 'Heart'],
    ['Du Lịch', 'du-lich', 'Plane'],
    ['Đồ Ăn', 'do-an', 'UtensilsCrossed'],
    ['Sách', 'sach', 'BookOpen'],
    ['Công Nghệ', 'cong-nghe', 'Wifi'],
    ['Bách Hóa', 'bach-hoa', 'ShoppingBag'],
    ['Siêu Thị', 'sieu-thi', 'Store'],
  ].map(([name, slug, icon], index) => ({
    id: safeId('cat_at', slug),
    name,
    slug,
    icon,
    description: `Danh mục mua sắm ${name}.`,
    is_active: true,
    sort_order: index + 1,
  }));
}

function getCouponCode(item = {}) {
  const coupons = Array.isArray(item.coupons) ? item.coupons : [];
  const coupon = coupons.find(entry => compact(entry?.coupon_code));
  return coupon?.coupon_code ? compact(coupon.coupon_code) : null;
}

function inferDiscount(item = {}, code) {
  const text = `${item.name || ''} ${item.content || ''} ${code || ''}`.toLowerCase();
  const discountPercentage = toNumber(item.discount_percentage || item.coin_percentage);
  const discountValue = toNumber(item.discount_value || item.max_value || item.coin_cap);
  const minSpend = formatMoney(item.min_spend);
  const maxDiscount = formatMoney(item.max_value || item.coin_cap);

  if (text.includes('free') || text.includes('freeship') || text.includes('phí vận chuyển') || text.includes('van chuyen')) {
    return {
      discount_type: 'freeship',
      discount_value: 'Miễn phí vận chuyển',
      min_order_value: minSpend,
      max_discount: maxDiscount,
      voucher_type: 'freeship',
    };
  }

  if (discountPercentage > 0) {
    return {
      discount_type: 'percent',
      discount_value: `${discountPercentage}%`,
      min_order_value: minSpend,
      max_discount: maxDiscount,
      voucher_type: code ? 'coupon' : 'deal',
    };
  }

  if (discountValue > 0) {
    return {
      discount_type: 'fixed',
      discount_value: formatMoney(discountValue),
      min_order_value: minSpend,
      max_discount: maxDiscount,
      voucher_type: code ? 'coupon' : 'deal',
    };
  }

  return {
    discount_type: code ? 'fixed' : 'deal',
    discount_value: null,
    min_order_value: minSpend,
    max_discount: maxDiscount,
    voucher_type: code ? 'coupon' : 'deal',
  };
}

function mapVoucher(item, brandBySlug, categoryBySlug) {
  const externalId = compact(item.id || item._id || `${item.campaign_id}-${item.name}`);
  if (!externalId) return null;

  const code = getCouponCode(item);
  const title = compact(item.name || item.coupons?.[0]?.coupon_desc || item.campaign_name || `Khuyến mại ${externalId}`);
  if (!title) return null;

  const brand = getBrandFromVoucher(item);
  const category = getCategoryFromVoucher(item);
  const platform = brand.platform || inferPlatform(item);
  const startDate = parseDate(item.start_time || item.start_date);
  const endDate = parseDate(item.end_time || item.end_date);
  const now = new Date();
  const isExpired = endDate && endDate < now;
  const isHot = parseBoolean(item.is_hot);
  const discount = inferDiscount(item, code);
  const description = stripHtml(item.content || item.coupons?.[0]?.coupon_desc || item.time_left || '');

  return {
    id: safeId('voucher_at', externalId),
    title,
    slug: `${slugify(title).slice(0, 70)}-${shortHash(externalId)}`,
    code,
    description: description || null,
    terms: item.time_left ? compact(item.time_left) : null,
    ...discount,
    start_date: startDate,
    end_date: endDate,
    status: !isExpired && (item.status === undefined || Number(item.status) === 1) ? 'active' : 'expired',
    platform,
    brand_id: brandBySlug.get(brand.slug)?.id || null,
    brand_name: brandBySlug.get(brand.slug)?.name || brand.name,
    brand_logo: brandBySlug.get(brand.slug)?.logo || brand.logo,
    category_id: categoryBySlug.get(category.slug)?.id || null,
    category_name: categoryBySlug.get(category.slug)?.name || category.name,
    original_url: item.link || null,
    tracking_url: item.prod_link || item.aff_link || item.aff_link_campaign_tag || item.link || null,
    image: item.image || null,
    is_hot: isHot,
    is_verified: true,
    is_exclusive: false,
    is_featured: isHot,
    sort_order: (isHot ? 1000 : 0) + (code ? 100 : 0),
    accesstrade_id: externalId,
    last_synced_at: now,
  };
}

function mapCampaign(item) {
  const externalId = compact(item.id || item.campaign_id);
  if (!externalId) return null;
  const platform = inferPlatform(item);
  const name = compact(item.name || item.merchant || `Campaign ${externalId}`);

  return {
    id: safeId('campaign_at', externalId),
    name,
    platform,
    external_id: externalId,
    tracking_url: item.url || null,
    is_active: Number(item.status) === 1 && (!item.approval || item.approval === 'successful'),
  };
}

function mapBrandFromCampaign(item) {
  const campaign = mapCampaign(item);
  if (!campaign) return null;
  const platformName = campaign.platform !== 'other' ? platformNames[campaign.platform] : null;
  const name = platformName || compact(item.merchant || item.name);
  const slug = slugify(name);

  return {
    id: safeId('brand_at', slug),
    name,
    slug,
    logo: platformLogos[campaign.platform] || item.logo || null,
    platform: campaign.platform,
    description: stripHtml(item.description?.introduction || item.description?.action_point || `Campaign AccessTrade: ${campaign.name}`),
    website_url: item.url || null,
    accesstrade_campaign_id: campaign.external_id,
    is_featured: true,
    is_active: campaign.is_active,
    sort_order: campaign.platform === 'other' ? 50 : 10,
  };
}

async function fetchCampaigns() {
  const pageSize = DEFAULT_PAGE_SIZE || 100;
  const items = [];
  let page = 1;

  while (true) {
    const response = await accessTradeFetch(`/campaigns?limit=${pageSize}&page=${page}&approval=successful`, { timeoutMs: 45000 });
    const rows = Array.isArray(response.data) ? response.data : [];
    items.push(...rows);

    if (!rows.length) break;
    if (MAX_ITEMS && items.length >= MAX_ITEMS) break;
    if (MAX_PAGES && page >= MAX_PAGES) break;
    if (response.total_page && page >= Number(response.total_page)) break;
    if (rows.length < pageSize) break;
    page += 1;
  }

  return MAX_ITEMS ? items.slice(0, MAX_ITEMS) : items;
}

async function fetchVouchers() {
  const pageSize = DEFAULT_PAGE_SIZE || 100;
  const items = [];
  let page = 1;

  while (true) {
    const response = await accessTradeFetch(`/offers_informations/coupon?limit=${pageSize}&page=${page}`, { timeoutMs: 45000 });
    const rows = Array.isArray(response.data) ? response.data : [];
    items.push(...rows);

    if (!rows.length) break;
    if (MAX_ITEMS && items.length >= MAX_ITEMS) break;
    if (MAX_PAGES && page >= MAX_PAGES) break;
    if (response.count && items.length >= Number(response.count)) break;
    if (rows.length < pageSize) break;
    page += 1;
  }

  return MAX_ITEMS ? items.slice(0, MAX_ITEMS) : items;
}

async function upsertBrands(prisma, brandInputs) {
  const brandsBySlug = new Map();
  for (const input of brandInputs) {
    if (!input?.slug) continue;
    brandsBySlug.set(input.slug, input);
  }

  const saved = new Map();
  for (const brand of brandsBySlug.values()) {
    const row = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        logo: brand.logo,
        platform: brand.platform,
        description: brand.description,
        website_url: brand.website_url,
        accesstrade_campaign_id: brand.accesstrade_campaign_id,
        is_featured: brand.is_featured,
        is_active: brand.is_active,
        sort_order: brand.sort_order,
      },
      create: brand,
    });
    saved.set(row.slug, row);
  }
  return saved;
}

async function upsertCategories(prisma, categoryInputs) {
  const categoriesBySlug = new Map();
  for (const input of categoryInputs) {
    if (!input?.slug) continue;
    categoriesBySlug.set(input.slug, input);
  }

  const saved = new Map();
  for (const category of categoriesBySlug.values()) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        description: category.description,
        is_active: true,
        sort_order: category.sort_order,
      },
      create: category,
    });
    saved.set(row.slug, row);
  }
  return saved;
}

async function upsertVouchers(prisma, vouchers) {
  let count = 0;
  for (const voucher of vouchers) {
    await prisma.voucher.upsert({
      where: { id: voucher.id },
      update: voucher,
      create: voucher,
    });
    count += 1;
  }
  return count;
}

async function refreshCounts(prisma) {
  const brandCounts = await prisma.voucher.groupBy({
    by: ['brand_id'],
    where: { status: 'active', brand_id: { not: null } },
    _count: { _all: true },
  });
  const categoryCounts = await prisma.voucher.groupBy({
    by: ['category_id'],
    where: { status: 'active', category_id: { not: null } },
    _count: { _all: true },
  });

  await prisma.brand.updateMany({ data: { voucher_count: 0 } });
  await prisma.category.updateMany({ data: { voucher_count: 0 } });

  for (const item of brandCounts) {
    await prisma.brand.update({
      where: { id: item.brand_id },
      data: { voucher_count: item._count._all, is_active: true },
    });
  }
  for (const item of categoryCounts) {
    await prisma.category.update({
      where: { id: item.category_id },
      data: { voucher_count: item._count._all, is_active: true },
    });
  }
}

async function hideNonAccessTradeSampleData(prisma, activeBrandIds = [], activeCategoryIds = []) {
  await prisma.voucher.updateMany({
    where: { accesstrade_id: null },
    data: { status: 'draft', is_hot: false, is_featured: false },
  });

  if (activeBrandIds.length) {
    await prisma.brand.updateMany({
      where: { id: { notIn: activeBrandIds } },
      data: { is_active: false, is_featured: false, voucher_count: 0 },
    });
  }

  if (activeCategoryIds.length) {
    await prisma.category.updateMany({
      where: { id: { notIn: activeCategoryIds } },
      data: { is_active: false, voucher_count: 0 },
    });
  }
}

async function syncCampaigns(prisma) {
  const rawCampaigns = await fetchCampaigns();
  const campaigns = rawCampaigns.map(mapCampaign).filter(Boolean);
  const brands = rawCampaigns.map(mapBrandFromCampaign).filter(Boolean);

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: campaign,
      create: campaign,
    });
  }

  await upsertBrands(prisma, brands);
  return { items: campaigns.length, message: `Đã đồng bộ ${campaigns.length} campaigns từ AccessTrade.` };
}

async function syncVouchers(prisma) {
  const rawVouchers = await fetchVouchers();
  const marketplaceWideVouchers = rawVouchers.filter(isMarketplaceWideVoucher);
  const brandInputs = [
    ...marketplaceWideVouchers.map(getBrandFromVoucher),
    ...getCanonicalPlatformBrands(),
  ];
  const categoryInputs = [
    ...marketplaceWideVouchers.map(getCategoryFromVoucher),
    ...getCanonicalCategories(),
  ];
  const brandsBySlug = await upsertBrands(prisma, brandInputs);
  const categoriesBySlug = await upsertCategories(prisma, categoryInputs);
  const vouchers = marketplaceWideVouchers.map(item => mapVoucher(item, brandsBySlug, categoriesBySlug)).filter(Boolean);

  await prisma.voucher.updateMany({
    where: { accesstrade_id: { not: null } },
    data: { status: 'draft', is_hot: false, is_featured: false },
  });
  const items = await upsertVouchers(prisma, vouchers);
  await hideNonAccessTradeSampleData(
    prisma,
    Array.from(brandsBySlug.values()).map(brand => brand.id),
    Array.from(categoriesBySlug.values()).map(category => category.id)
  );
  await refreshCounts(prisma);

  return {
    items,
    message: `Đã lọc và đồng bộ ${items}/${rawVouchers.length} vouchers toàn sàn từ AccessTrade.`,
  };
}

export async function cleanupStaleAccessTradeSyncLogs(prisma = getPrisma()) {
  const staleBefore = new Date(Date.now() - STALE_SYNC_WINDOW_MS);
  return prisma.syncLog.updateMany({
    where: {
      status: 'running',
      started_at: { lt: staleBefore },
      finished_at: null,
    },
    data: {
      status: 'failed',
      message: 'Phiên sync trước đã bị gián đoạn hoặc quá thời gian chờ.',
      error_detail: 'Tự động đóng log running quá lâu để tránh hiển thị treo.',
      finished_at: new Date(),
    },
  });
}

export async function syncAccessTrade(syncType = 'campaigns') {
  const prisma = getPrisma();
  const startedAt = new Date();
  const normalizedType = String(syncType || 'campaigns').toLowerCase();

  await cleanupStaleAccessTradeSyncLogs(prisma);

  const existingRunningLog = await prisma.syncLog.findFirst({
    where: {
      sync_type: normalizedType,
      status: 'running',
      finished_at: null,
    },
    orderBy: { created_date: 'desc' },
  });

  if (existingRunningLog) {
    return {
      success: false,
      message: 'Đang có một phiên sync cùng loại đang chạy. Anh chờ xong rồi bấm lại giúp em nhé.',
      items_synced: 0,
      log: existingRunningLog,
    };
  }

  const log = await prisma.syncLog.create({
    data: {
      sync_type: normalizedType,
      status: 'running',
      message: 'Đang đồng bộ AccessTrade...',
      items_synced: 0,
      started_at: startedAt,
    },
  });

  if (!isAccessTradeConfigured()) {
    const message = 'AccessTrade chưa cấu hình API key hoặc chưa bật ACCESSTRADE_SYNC_ENABLED=true.';
    const updatedLog = await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: 'failed',
        message,
        error_detail: message,
        finished_at: new Date(),
      },
    });

    return {
      success: false,
      message,
      items_synced: 0,
      log: updatedLog,
    };
  }

  try {
    let result;
    if (normalizedType === 'campaigns') {
      result = await syncCampaigns(prisma);
    } else if (normalizedType === 'vouchers') {
      result = await syncVouchers(prisma);
    } else if (normalizedType === 'all') {
      const campaigns = await syncCampaigns(prisma);
      const vouchers = await syncVouchers(prisma);
      result = {
        items: campaigns.items + vouchers.items,
        message: `${campaigns.message} ${vouchers.message}`,
      };
    } else if (normalizedType === 'transactions') {
      result = {
        items: 0,
        message: 'Sync transactions chưa bật vì cần chọn đúng report window theo tài khoản AccessTrade.',
      };
    } else {
      throw new Error(`Sync type không hỗ trợ: ${syncType}`);
    }

    const updatedLog = await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: 'success',
        message: result.message,
        items_synced: result.items,
        finished_at: new Date(),
      },
    });

    return {
      success: true,
      message: result.message,
      items_synced: result.items,
      log: updatedLog,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const updatedLog = await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: 'failed',
        message: 'Sync AccessTrade thất bại.',
        items_synced: 0,
        error_detail: message,
        finished_at: new Date(),
      },
    });

    return {
      success: false,
      message: 'Sync AccessTrade thất bại.',
      error: message,
      items_synced: 0,
      log: updatedLog,
    };
  }
}
