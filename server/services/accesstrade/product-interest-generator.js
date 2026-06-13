import { createHash } from 'node:crypto';
import { accessTradeFetch } from './client.js';
import { ensureCloakedLink } from './deeplink.js';
import { getPrisma } from '../prisma.js';
import { getSiteSettingValue, upsertSiteSettingRawValue } from '../site-setting-service.js';

const GENERATOR_STATE_KEY = 'interest_product_generator:shopee';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 20;
const DATAFEED_PAGE_SIZE = 100;
const MAX_DATAFEED_PAGES_PER_RUN = 6;
const FINGERPRINT_HISTORY_LIMIT = 5000;

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
      .replace(/&#39;/g, "'"),
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

  return normalized || 'san-pham';
}

function shortHash(value, length = 10) {
  return createHash('sha1').update(String(value || '')).digest('hex').slice(0, length);
}

function clampLimit(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

function normalizeGeneratorState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      version: 1,
      datafeedPage: 1,
      fingerprints: [],
      updatedAt: null,
    };
  }

  return {
    version: 1,
    datafeedPage: Math.max(1, Number.parseInt(value.datafeedPage, 10) || 1),
    fingerprints: Array.isArray(value.fingerprints)
      ? value.fingerprints.map((item) => String(item || '').trim()).filter(Boolean).slice(-FINGERPRINT_HISTORY_LIMIT)
      : [],
    updatedAt: value.updatedAt || null,
  };
}

function normalizeAbsoluteUrl(value) {
  if (!value) return '';

  try {
    const parsed = new URL(String(value).trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizeImageUrl(value) {
  return normalizeAbsoluteUrl(value);
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value) {
  const amount = toNumber(value);
  if (!amount) return '';
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
}

function dateParam(date) {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('-');
}

function buildQuery(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const queryText = query.toString();
  return queryText ? `${path}?${queryText}` : path;
}

async function fetchTopProducts(limit) {
  const toDate = new Date();
  const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const body = await accessTradeFetch(buildQuery('/top_products', {
    merchant: 'shopee',
    date_from: dateParam(fromDate),
    date_to: dateParam(toDate),
    limit,
  }), { timeoutMs: 30000 });

  return {
    rows: Array.isArray(body?.data) ? body.data : [],
    total: Number.parseInt(body?.total, 10) || 0,
  };
}

async function fetchDatafeedsPage(page, { discountedOnly = true } = {}) {
  const body = await accessTradeFetch(buildQuery('/datafeeds', {
    domain: 'shopee.vn',
    page,
    limit: DATAFEED_PAGE_SIZE,
    status_discount: discountedOnly ? 1 : '',
  }), { timeoutMs: 30000 });

  const total = Number.parseInt(body?.total, 10) || 0;
  return {
    rows: Array.isArray(body?.data) ? body.data : [],
    total,
    totalPage: total ? Math.max(1, Math.ceil(total / DATAFEED_PAGE_SIZE)) : null,
  };
}

function normalizeProductRow(row = {}) {
  const name = stripHtml(row.name || row.title);
  const image = normalizeImageUrl(row.image || row.image_url || row.thumbnail);
  const productUrl = normalizeAbsoluteUrl(row.link || row.url || row.product_url);
  const affiliateUrl = normalizeAbsoluteUrl(row.aff_link || row.affiliate_url || row.tracking_url);
  const productId = compact(row.product_id || row.sku || row.id || productUrl);

  if (!name || !image || !productUrl || !productId) {
    return null;
  }

  const price = toNumber(row.price);
  const salePrice = toNumber(row.discount);
  const discountAmount = toNumber(row.discount_amount);
  const discountRate = toNumber(row.discount_rate);
  const categoryName = compact(row.category_name || row.cate || row.product_category || 'Shopee');
  const fingerprint = `shopee:${productId}`;

  return {
    name: name.slice(0, 180),
    image,
    productUrl,
    affiliateUrl,
    categoryName,
    price,
    salePrice,
    discountAmount,
    discountRate,
    fingerprint,
    slug: `san-pham-${slugify(name).slice(0, 62)}-${shortHash(fingerprint)}`,
  };
}

function buildExcerpt(product) {
  const priceText = product.salePrice || product.price
    ? ` Giá tham khảo: ${formatMoney(product.salePrice || product.price)}.`
    : '';
  const discountText = product.discountRate
    ? ` Đang có mức giảm khoảng ${product.discountRate}%.`
    : product.discountAmount
      ? ` Đang có ưu đãi giảm khoảng ${formatMoney(product.discountAmount)}.`
      : '';

  return compact(`Gợi ý sản phẩm Shopee từ AccessTrade.${priceText}${discountText} Bấm xem chi tiết để lưu ưu đãi trước khi mua.`);
}

function buildContent(product, cloakedUrl) {
  const priceLine = product.salePrice || product.price
    ? `- Giá tham khảo: **${formatMoney(product.salePrice || product.price)}**`
    : '- Giá bán có thể thay đổi theo từng thời điểm.';
  const originalPriceLine = product.salePrice && product.price && product.salePrice !== product.price
    ? `- Giá gốc tham khảo: **${formatMoney(product.price)}**`
    : '';
  const discountLine = product.discountRate
    ? `- Mức giảm tham khảo: **${product.discountRate}%**`
    : product.discountAmount
      ? `- Ưu đãi giảm tham khảo: **${formatMoney(product.discountAmount)}**`
      : '';

  return [
    `## ${product.name}`,
    'Sản phẩm này được gợi ý từ nguồn Shopee trên AccessTrade, phù hợp để anh/chị tham khảo khi săn deal và lưu ưu đãi trong ngày.',
    [
      `- Danh mục: **${product.categoryName || 'Shopee'}**`,
      priceLine,
      originalPriceLine,
      discountLine,
    ].filter(Boolean).join('\n'),
    `[Xem ưu đãi trên Shopee](${cloakedUrl})`,
    'Lưu ý: Giá bán, tồn kho và điều kiện ưu đãi có thể thay đổi theo thời gian. Anh/chị nên kiểm tra lại trên trang Shopee trước khi đặt hàng.',
  ].join('\n\n');
}

async function saveGeneratorState(state) {
  await upsertSiteSettingRawValue(GENERATOR_STATE_KEY, {
    version: 1,
    datafeedPage: Math.max(1, Number.parseInt(state.datafeedPage, 10) || 1),
    fingerprints: Array.from(new Set(state.fingerprints || [])).slice(-FINGERPRINT_HISTORY_LIMIT),
    updatedAt: new Date().toISOString(),
  });
}

async function createInterestPostFromProduct(prisma, product, sortOrder) {
  const target = product.affiliateUrl || product.productUrl;
  const cloaked = await ensureCloakedLink(target, { slug: `interest-${shortHash(product.fingerprint, 16)}` });
  const cloakedUrl = cloaked.cloakedUrl || target;

  return prisma.interestPost.create({
    data: {
      title: product.name,
      slug: product.slug,
      excerpt: buildExcerpt(product),
      content: buildContent(product, cloakedUrl),
      thumbnail_image: product.image,
      target_url: cloakedUrl,
      status: 'draft',
      sort_order: sortOrder,
      published_at: null,
    },
  });
}

export async function generateShopeeInterestPostsFromAccessTrade({ limit } = {}) {
  const createLimit = clampLimit(limit);
  const prisma = getPrisma();
  const storedState = await getSiteSettingValue(GENERATOR_STATE_KEY, null);
  const state = normalizeGeneratorState(storedState);
  const knownFingerprints = new Set(state.fingerprints);
  const existingPosts = await prisma.interestPost.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(existingPosts.map((post) => post.slug).filter(Boolean));
  const maxSort = await prisma.interestPost.aggregate({ _max: { sort_order: true } });
  let nextSortOrder = (maxSort._max.sort_order || 0) + 1;

  const createdPosts = [];
  const createdFingerprints = [];
  const skipped = {
    duplicate: 0,
    invalid: 0,
    create_error: 0,
  };
  const sources = {
    top_products: 0,
    datafeeds: 0,
  };

  async function consumeRows(rows, source) {
    for (const row of rows) {
      if (createdPosts.length >= createLimit) return;
      sources[source] += 1;
      const product = normalizeProductRow(row);
      if (!product) {
        skipped.invalid += 1;
        continue;
      }

      if (knownFingerprints.has(product.fingerprint) || existingSlugs.has(product.slug)) {
        skipped.duplicate += 1;
        continue;
      }

      try {
        const post = await createInterestPostFromProduct(prisma, product, nextSortOrder);
        nextSortOrder += 1;
        createdPosts.push(post);
        createdFingerprints.push(product.fingerprint);
        knownFingerprints.add(product.fingerprint);
        existingSlugs.add(product.slug);
      } catch (error) {
        if (error?.code === 'P2002') {
          skipped.duplicate += 1;
          existingSlugs.add(product.slug);
        } else {
          skipped.create_error += 1;
          console.warn('[interest-generator] Cannot create post from AccessTrade product:', error.message);
        }
      }
    }
  }

  const topProducts = await fetchTopProducts(createLimit);
  await consumeRows(topProducts.rows, 'top_products');

  let datafeedPage = state.datafeedPage;
  let datafeedTotalPage = null;
  let datafeedPagesScanned = 0;
  let usedDiscountedDatafeed = true;

  while (createdPosts.length < createLimit && datafeedPagesScanned < MAX_DATAFEED_PAGES_PER_RUN) {
    let page = await fetchDatafeedsPage(datafeedPage, { discountedOnly: usedDiscountedDatafeed });
    if (!page.rows.length && usedDiscountedDatafeed) {
      usedDiscountedDatafeed = false;
      datafeedPage = 1;
      page = await fetchDatafeedsPage(datafeedPage, { discountedOnly: false });
    }

    datafeedPagesScanned += 1;
    datafeedTotalPage = page.totalPage || datafeedTotalPage;
    await consumeRows(page.rows, 'datafeeds');

    if (!page.rows.length) {
      datafeedPage = 1;
      break;
    }

    datafeedPage += 1;
    if (datafeedTotalPage && datafeedPage > datafeedTotalPage) {
      datafeedPage = 1;
      break;
    }
  }

  state.datafeedPage = datafeedPage;
  state.fingerprints = Array.from(new Set([
    ...state.fingerprints,
    ...createdFingerprints,
  ])).slice(-FINGERPRINT_HISTORY_LIMIT);
  await saveGeneratorState(state);

  return {
    success: true,
    requestedLimit: createLimit,
    createdCount: createdPosts.length,
    skippedCount: skipped.duplicate + skipped.invalid + skipped.create_error,
    skipped,
    scannedCount: sources.top_products + sources.datafeeds,
    sources,
    nextDatafeedPage: datafeedPage,
    createdPosts: createdPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      target_url: post.target_url,
    })),
    message: createdPosts.length
      ? `Đã tạo ${createdPosts.length} bài nháp từ sản phẩm Shopee AccessTrade.`
      : 'Chưa tạo được bài mới vì dữ liệu hiện tại bị trùng hoặc thiếu ảnh/link sản phẩm.',
  };
}
