import { createHash } from 'node:crypto';
import { getPrisma } from '../prisma.js';
import { accessTradeFetch, isAccessTradeConfigured } from './client.js';
import { deleteSiteSettingValue, getSiteSettingValue, upsertSiteSettingRawValue } from '../site-setting-service.js';

const DEFAULT_PAGE_SIZE = Math.min(Number.parseInt(process.env.ACCESSTRADE_SYNC_PAGE_SIZE || '50', 10), 50);
const MAX_PAGES = Number.parseInt(process.env.ACCESSTRADE_SYNC_MAX_PAGES || '0', 10);
const MAX_ITEMS = Number.parseInt(process.env.ACCESSTRADE_SYNC_MAX_ITEMS || '0', 10);
const SYNC_RUNTIME_BUDGET_MS = Math.max(
  15000,
  Number.parseInt(process.env.ACCESSTRADE_SYNC_RUNTIME_MS || `${45 * 1000}`, 10),
);
const SYNC_RUNTIME_SAFETY_MS = Math.max(
  3000,
  Number.parseInt(process.env.ACCESSTRADE_SYNC_RUNTIME_SAFETY_MS || '6000', 10),
);
const STALE_SYNC_WINDOW_MS = Number.parseInt(process.env.ACCESSTRADE_SYNC_STALE_MS || `${15 * 60 * 1000}`, 10);
const ACCESS_TRADE_SYNC_STATE_PREFIX = 'accesstrade_sync_state:';

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

function getSyncStateKey(syncType) {
  return `${ACCESS_TRADE_SYNC_STATE_PREFIX}${syncType}`;
}

function uniqueIdList(values = []) {
  return Array.from(new Set(
    values
      .map(value => String(value || '').trim())
      .filter(Boolean)
  ));
}

function normalizeSyncState(value, syncType) {
  const base = {
    version: 1,
    syncType,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nextPage: 1,
    totalPage: null,
    scannedCount: 0,
    itemsSynced: 0,
    activeBrandIds: [],
    activeCategoryIds: [],
    completed: false,
  };

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return base;
  }

  return {
    ...base,
    ...value,
    syncType,
    startedAt: value.startedAt || base.startedAt,
    updatedAt: value.updatedAt || base.updatedAt,
    nextPage: Math.max(1, Number.parseInt(value.nextPage, 10) || 1),
    totalPage: value.totalPage ? Math.max(1, Number.parseInt(value.totalPage, 10) || 1) : null,
    scannedCount: Math.max(0, Number.parseInt(value.scannedCount, 10) || 0),
    itemsSynced: Math.max(0, Number.parseInt(value.itemsSynced, 10) || 0),
    activeBrandIds: uniqueIdList(Array.isArray(value.activeBrandIds) ? value.activeBrandIds : []),
    activeCategoryIds: uniqueIdList(Array.isArray(value.activeCategoryIds) ? value.activeCategoryIds : []),
    completed: Boolean(value.completed),
  };
}

async function saveSyncState(syncType, state) {
  await upsertSiteSettingRawValue(getSyncStateKey(syncType), normalizeSyncState(state, syncType));
}

async function clearSyncState(syncType) {
  await deleteSiteSettingValue(getSyncStateKey(syncType));
}

function createBatchSummaryMessage({
  label,
  itemsSynced,
  scannedCount,
  nextPage,
  totalPage,
  completed,
}) {
  const progress = totalPage ? `Trang ${Math.min(nextPage - 1, totalPage)}/${totalPage}` : `Đang ở trang ${nextPage}`;
  const stateLabel = completed ? 'đã hoàn tất' : 'tạm dừng để tiếp tục ở lần chạy sau';
  return `${label} ${stateLabel}. Đã xử lý ${itemsSynced} mục từ ${scannedCount} bản ghi gốc. ${progress}.`;
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
    is_featured: platform !== 'other',
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

function isWholeSiteShopeeVoucher(item = {}) {
  const haystack = [
    item.name,
    item.content,
    item.time_left,
    item.campaign_name,
    item.merchant,
    item.domain,
    ...(Array.isArray(item.coupons) ? item.coupons.flatMap((coupon) => [coupon?.coupon_code, coupon?.coupon_desc]) : []),
  ]
    .map((value) => String(value || '').toLowerCase())
    .join(' ');

  const positiveSignals = [
    'toàn sàn',
    'toan san',
    'mã sàn',
    'ma san',
    'voucher sàn',
    'voucher san',
    'áp dụng toàn sàn',
    'ap dung toan san',
    'shopee',
    'freeship',
    'miễn phí vận chuyển',
    'mien phi van chuyen',
  ];

  const negativeSignals = [
    '[',
    ']',
    'shop yêu thích',
    'shop yeu thich',
    'shop thường',
    'shop thuong',
    'áp dụng cho shop',
    'ap dung cho shop',
    'áp dụng tại shop',
    'ap dung tai shop',
    'nhà bán',
    'nha ban',
    'gian hàng',
    'gian hang',
    'seller',
    'cửa hàng',
    'cua hang',
    'store',
  ];

  if (negativeSignals.some((signal) => haystack.includes(signal))) {
    return false;
  }

  return positiveSignals.some((signal) => haystack.includes(signal));
}

function shouldSyncVoucher(item = {}) {
  const platform = inferPlatform(item);
  if (platform !== 'shopee') {
    return true;
  }

  return isWholeSiteShopeeVoucher(item);
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
    status: isExpired ? 'expired' : 'draft',
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
    is_featured: campaign.platform !== 'other',
    is_active: campaign.is_active,
    sort_order: campaign.platform === 'other' ? 50 : 10,
  };
}

async function fetchCampaignsPage(page, pageSize = DEFAULT_PAGE_SIZE || 50) {
  return accessTradeFetch(`/campaigns?limit=${pageSize}&page=${page}&approval=successful`, { timeoutMs: SYNC_RUNTIME_BUDGET_MS });
}

async function fetchVouchersPage(page, pageSize = DEFAULT_PAGE_SIZE || 50) {
  return accessTradeFetch(`/offers_informations/coupon?limit=${pageSize}&page=${page}`, { timeoutMs: SYNC_RUNTIME_BUDGET_MS });
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
        is_active: brand.is_active,
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
  const existingRows = await prisma.voucher.findMany({
    where: { id: { in: vouchers.map((voucher) => voucher.id) } },
    select: {
      id: true,
      status: true,
      is_hot: true,
      is_exclusive: true,
      is_featured: true,
      sort_order: true,
    },
  });
  const existingById = new Map(existingRows.map((row) => [row.id, row]));
  let count = 0;
  for (const voucher of vouchers) {
    const existing = existingById.get(voucher.id);
    const nextVoucher = {
      ...voucher,
      status: voucher.status === 'expired'
        ? 'expired'
        : existing?.status && existing.status !== 'expired'
          ? existing.status
          : 'draft',
      is_hot: existing?.is_hot ?? voucher.is_hot,
      is_exclusive: existing?.is_exclusive ?? voucher.is_exclusive,
      is_featured: existing?.is_featured ?? voucher.is_featured,
      sort_order: Number.isFinite(Number(existing?.sort_order)) ? Number(existing.sort_order) : voucher.sort_order,
    };

    await prisma.voucher.upsert({
      where: { id: voucher.id },
      update: nextVoucher,
      create: nextVoucher,
    });
    count += 1;
  }
  return count;
}

async function runCheckpointedPagedSync(prisma, {
  syncType,
  label,
  pageSize = DEFAULT_PAGE_SIZE || 50,
  fetchPage,
  processRows,
  finalize,
}) {
  const stateKey = getSyncStateKey(syncType);
  const storedState = await getSiteSettingValue(stateKey, null);
  let checkpoint = normalizeSyncState(storedState, syncType);

  if (storedState && checkpoint.completed) {
    await clearSyncState(syncType);
    checkpoint = normalizeSyncState(null, syncType);
  }

  const startedAt = parseDate(checkpoint.startedAt) || new Date();
  const batchStartedAt = Date.now();
  let pageToFetch = Math.max(1, checkpoint.nextPage || 1);
  let scannedCount = Math.max(0, checkpoint.scannedCount || 0);
  let cumulativeItemsSynced = Math.max(0, checkpoint.itemsSynced || 0);
  let totalPage = checkpoint.totalPage || null;
  const activeBrandIds = new Set(checkpoint.activeBrandIds || []);
  const activeCategoryIds = new Set(checkpoint.activeCategoryIds || []);

  while (true) {
    const elapsed = Date.now() - batchStartedAt;
    if (elapsed >= SYNC_RUNTIME_BUDGET_MS - SYNC_RUNTIME_SAFETY_MS) {
      break;
    }

    if ((MAX_PAGES && pageToFetch > MAX_PAGES) || (MAX_ITEMS && cumulativeItemsSynced >= MAX_ITEMS)) {
      break;
    }

    const response = await fetchPage(pageToFetch, pageSize);
    const rows = Array.isArray(response.data) ? response.data : [];
    scannedCount += rows.length;

    if (response.total_page) {
      totalPage = Math.max(totalPage || 1, Number.parseInt(response.total_page, 10) || 1);
    }

    const pageResult = await processRows(rows, {
      page: pageToFetch,
      response,
      startedAt,
      activeBrandIds,
      activeCategoryIds,
    });

    cumulativeItemsSynced += Math.max(0, Number.parseInt(pageResult?.itemsSynced, 10) || 0);
    uniqueIdList(pageResult?.activeBrandIds || []).forEach((id) => activeBrandIds.add(id));
    uniqueIdList(pageResult?.activeCategoryIds || []).forEach((id) => activeCategoryIds.add(id));

    const reachedEnd = !rows.length
      || (totalPage && pageToFetch >= totalPage)
      || rows.length < pageSize;

    pageToFetch += 1;

    checkpoint = {
      ...checkpoint,
      startedAt: checkpoint.startedAt || startedAt.toISOString(),
      updatedAt: new Date().toISOString(),
      nextPage: pageToFetch,
      totalPage,
      scannedCount,
      itemsSynced: cumulativeItemsSynced,
      activeBrandIds: Array.from(activeBrandIds),
      activeCategoryIds: Array.from(activeCategoryIds),
      completed: reachedEnd,
    };

    if (reachedEnd) {
      break;
    }

    await saveSyncState(syncType, checkpoint);
  }

  if (!checkpoint.completed) {
    await saveSyncState(syncType, checkpoint);
    return {
      completed: false,
      items_synced: cumulativeItemsSynced,
      scanned_count: scannedCount,
      checkpoint,
      message: createBatchSummaryMessage({
        label,
        itemsSynced: cumulativeItemsSynced,
        scannedCount,
        nextPage: checkpoint.nextPage,
        totalPage,
        completed: false,
      }),
    };
  }

  if (typeof finalize === 'function') {
    await finalize({
      startedAt,
      checkpoint,
      cumulativeItemsSynced,
      scannedCount,
      totalPage,
    });
  }

  await clearSyncState(syncType);

  return {
    completed: true,
    items_synced: cumulativeItemsSynced,
    scanned_count: scannedCount,
    checkpoint: null,
    message: createBatchSummaryMessage({
      label,
      itemsSynced: cumulativeItemsSynced,
      scannedCount,
      nextPage: checkpoint.nextPage,
      totalPage,
      completed: true,
    }),
  };
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
  return runCheckpointedPagedSync(prisma, {
    syncType: 'campaigns',
    label: 'Chiến dịch',
    fetchPage: fetchCampaignsPage,
    processRows: async (rows) => {
      const campaigns = rows.map(mapCampaign).filter(Boolean);
      const brands = rows.map(mapBrandFromCampaign).filter(Boolean);
      const savedBrands = await upsertBrands(prisma, brands);

      for (const campaign of campaigns) {
        await prisma.campaign.upsert({
          where: { id: campaign.id },
          update: campaign,
          create: campaign,
        });
      }

      return {
        itemsSynced: campaigns.length,
        activeBrandIds: Array.from(savedBrands.values()).map((brand) => brand.id),
      };
    },
  });
}

async function syncVouchers(prisma) {
  return runCheckpointedPagedSync(prisma, {
    syncType: 'vouchers',
    label: 'Voucher',
    fetchPage: fetchVouchersPage,
    processRows: async (rows) => {
      const filteredRows = rows.filter(shouldSyncVoucher);
      const brandInputs = [
        ...filteredRows.map(getBrandFromVoucher),
        ...getCanonicalPlatformBrands(),
      ];
      const categoryInputs = [
        ...filteredRows.map(getCategoryFromVoucher),
        ...getCanonicalCategories(),
      ];
      const brandsBySlug = await upsertBrands(prisma, brandInputs);
      const categoriesBySlug = await upsertCategories(prisma, categoryInputs);
      const vouchers = filteredRows.map((item) => mapVoucher(item, brandsBySlug, categoriesBySlug)).filter(Boolean);
      const items = await upsertVouchers(prisma, vouchers);

      return {
        itemsSynced: items,
        activeBrandIds: Array.from(brandsBySlug.values()).map((brand) => brand.id),
        activeCategoryIds: Array.from(categoriesBySlug.values()).map((category) => category.id),
      };
    },
    finalize: async ({ startedAt, checkpoint }) => {
      await prisma.voucher.updateMany({
        where: {
          accesstrade_id: { not: null },
          last_synced_at: { lt: startedAt },
        },
        data: { status: 'draft', is_hot: false, is_featured: false },
      });

      await hideNonAccessTradeSampleData(
        prisma,
        Array.from(new Set(checkpoint.activeBrandIds || [])),
        Array.from(new Set(checkpoint.activeCategoryIds || [])),
      );
      await refreshCounts(prisma);
    },
  });
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
      if (!campaigns.completed) {
        result = campaigns;
      } else {
        const vouchers = await syncVouchers(prisma);
        result = {
          completed: vouchers.completed,
          items_synced: (campaigns.items_synced || 0) + (vouchers.items_synced || 0),
          scanned_count: (campaigns.scanned_count || 0) + (vouchers.scanned_count || 0),
          message: `${campaigns.message} ${vouchers.message}`.trim(),
          checkpoint: vouchers.checkpoint || null,
        };
      }
    } else if (normalizedType === 'transactions') {
      result = {
        completed: true,
        items_synced: 0,
        scanned_count: 0,
        message: 'Sync transactions chưa bật vì cần chọn đúng report window theo tài khoản AccessTrade.',
      };
    } else {
      throw new Error(`Sync type không hỗ trợ: ${syncType}`);
    }

    const updatedLog = await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: result.completed === false ? 'partial' : 'success',
        message: result.message,
        items_synced: result.items_synced || 0,
        finished_at: new Date(),
      },
    });

    return {
      success: true,
      completed: result.completed !== false,
      message: result.message,
      items_synced: result.items_synced || 0,
      scanned_count: result.scanned_count || 0,
      checkpoint: result.checkpoint || null,
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
