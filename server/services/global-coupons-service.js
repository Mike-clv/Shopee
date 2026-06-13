import crypto from 'node:crypto';
import { saveCloakedLink, removeCloakedLinkBySlug } from './accesstrade/deeplink.js';
import { getPrisma } from './prisma.js';
import { getSiteSettingValue, upsertSiteSettingRawValue } from './site-setting-service.js';

export const GLOBAL_COUPONS_KEY = 'global_coupons';

const ALLOWED_PLATFORMS = new Set(['shopee', 'lazada', 'tiki', 'tiktok_shop', 'other']);
const ALLOWED_TYPES = new Set(['all_site', 'freeship', 'category']);

function createValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function sanitizeString(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function createCouponId() {
  return `gc-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}

function normalizeCouponId(value) {
  const normalized = sanitizeString(value, 80)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || createCouponId();
}

function normalizePlatform(value) {
  const normalized = sanitizeString(value, 20).toLowerCase();
  if (!ALLOWED_PLATFORMS.has(normalized)) {
    return 'other';
  }
  return normalized;
}

function normalizeType(value) {
  const normalized = sanitizeString(value, 20).toLowerCase();
  if (!ALLOWED_TYPES.has(normalized)) {
    throw createValidationError('Loại coupon không hợp lệ. Chỉ hỗ trợ all_site, freeship hoặc category.');
  }
  return normalized;
}

function normalizeExpiresAt(value) {
  const raw = sanitizeString(value, 80);
  if (!raw) return null;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function coerceStoredCoupon(input = {}, index = 0) {
  const platform = sanitizeString(input.platform, 20).toLowerCase();
  const type = sanitizeString(input.type, 20).toLowerCase();

  return {
    id: normalizeCouponId(input.id || `coupon-${index + 1}`),
    platform: ALLOWED_PLATFORMS.has(platform) ? platform : 'other',
    brand_id: sanitizeString(input.brand_id, 160),
    brand_name: sanitizeString(input.brand_name, 160),
    title: sanitizeString(input.title, 180) || `Coupon #${index + 1}`,
    description: sanitizeString(input.description, 600),
    coupon_code: sanitizeString(input.coupon_code, 120),
    affiliate_url: sanitizeString(input.affiliate_url, 2000),
    type: ALLOWED_TYPES.has(type) ? type : 'all_site',
    is_evergreen: Boolean(input.is_evergreen),
    expires_at: normalizeExpiresAt(input.expires_at),
  };
}

async function resolveBrandSelection(input = {}) {
  const prisma = getPrisma();
  const brandId = sanitizeString(input.brand_id, 160);
  const brandName = sanitizeString(input.brand_name, 160);

  if (!brandId && !brandName) {
    return null;
  }

  if (brandId) {
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        platform: true,
      },
    });

    if (!brand) {
      throw createValidationError('Thương hiệu đã chọn không còn khả dụng hoặc đang bị ẩn.');
    }

    return brand;
  }

  const brand = await prisma.brand.findFirst({
    where: {
      name: brandName,
      is_active: true,
    },
    select: {
      id: true,
      name: true,
      platform: true,
    },
  });

  if (!brand) {
    throw createValidationError('Không tìm thấy thương hiệu hợp lệ cho coupon này.');
  }

  return brand;
}

async function normalizeCouponInput(input = {}, seenIds = new Set()) {
  const id = normalizeCouponId(input.id);
  if (seenIds.has(id)) {
    throw createValidationError(`ID coupon bị trùng: ${id}`);
  }
  seenIds.add(id);

  const title = sanitizeString(input.title, 180);
  if (!title) {
    throw createValidationError('Tiêu đề coupon không được để trống.');
  }

  const affiliateUrl = sanitizeString(input.affiliate_url, 2000);
  if (!affiliateUrl) {
    throw createValidationError(`Coupon "${title}" đang thiếu affiliate_url.`);
  }

  const brand = await resolveBrandSelection(input);

  return {
    id,
    platform: normalizePlatform(brand?.platform || input.platform),
    brand_id: brand?.id || '',
    brand_name: brand?.name || sanitizeString(input.brand_name, 160),
    title,
    description: sanitizeString(input.description, 600),
    coupon_code: sanitizeString(input.coupon_code, 120),
    affiliate_url: affiliateUrl,
    type: normalizeType(input.type),
    is_evergreen: Boolean(input.is_evergreen),
    expires_at: normalizeExpiresAt(input.expires_at),
  };
}

export function buildGlobalCouponSlug(id) {
  return `coupon-${id}`;
}

export function buildGlobalCouponRedirectPath(id) {
  return `/go/${buildGlobalCouponSlug(id)}`;
}

export async function getGlobalCouponsSetting() {
  const value = await getSiteSettingValue(GLOBAL_COUPONS_KEY, []);
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => coerceStoredCoupon(item, index));
}

export function mapGlobalCouponToPublic(coupon) {
  return {
    id: coupon.id,
    platform: coupon.platform,
    brand_name: coupon.brand_name,
    title: coupon.title,
    description: coupon.description,
    coupon_code: coupon.coupon_code,
    type: coupon.type,
    is_evergreen: coupon.is_evergreen,
    expires_at: coupon.expires_at,
    redirect_path: buildGlobalCouponRedirectPath(coupon.id),
  };
}

export async function getPublicGlobalCoupons() {
  const coupons = await getGlobalCouponsSetting();
  return coupons.map(mapGlobalCouponToPublic);
}

export async function saveGlobalCouponsSetting(input = []) {
  if (!Array.isArray(input)) {
    throw createValidationError('Dữ liệu global_coupons phải là một mảng JSON.');
  }

  const existingCoupons = await getGlobalCouponsSetting();
  const nextCoupons = [];
  const seenIds = new Set();

  for (const item of input) {
    const normalized = await normalizeCouponInput(item, seenIds);
    const cloaked = await saveCloakedLink(buildGlobalCouponSlug(normalized.id), normalized.affiliate_url);

    nextCoupons.push({
      ...normalized,
      affiliate_url: cloaked.cloakedUrl || cloaked.deepLink || normalized.affiliate_url,
    });
  }

  const nextIds = new Set(nextCoupons.map((coupon) => coupon.id));
  const removedCoupons = existingCoupons.filter((coupon) => !nextIds.has(coupon.id));
  for (const removedCoupon of removedCoupons) {
    await removeCloakedLinkBySlug(buildGlobalCouponSlug(removedCoupon.id));
  }

  await upsertSiteSettingRawValue(GLOBAL_COUPONS_KEY, nextCoupons);
  return nextCoupons;
}
