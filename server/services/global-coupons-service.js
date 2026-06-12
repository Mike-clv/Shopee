import crypto from 'node:crypto';
import { saveCloakedLink, removeCloakedLinkBySlug } from './accesstrade/deeplink.js';
import { getSiteSettingValue, upsertSiteSettingRawValue } from './site-setting-service.js';

export const GLOBAL_COUPONS_KEY = 'global_coupons';

const ALLOWED_PLATFORMS = new Set(['shopee', 'lazada', 'tiki']);
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
    throw createValidationError('Platform coupon khong hop le. Chi ho tro shopee, lazada hoac tiki.');
  }
  return normalized;
}

function normalizeType(value) {
  const normalized = sanitizeString(value, 20).toLowerCase();
  if (!ALLOWED_TYPES.has(normalized)) {
    throw createValidationError('Loai coupon khong hop le. Chi ho tro all_site, freeship hoac category.');
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
    platform: ALLOWED_PLATFORMS.has(platform) ? platform : 'shopee',
    title: sanitizeString(input.title, 180) || `Coupon #${index + 1}`,
    description: sanitizeString(input.description, 600),
    coupon_code: sanitizeString(input.coupon_code, 120),
    affiliate_url: sanitizeString(input.affiliate_url, 2000),
    type: ALLOWED_TYPES.has(type) ? type : 'all_site',
    is_evergreen: Boolean(input.is_evergreen),
    expires_at: normalizeExpiresAt(input.expires_at),
  };
}

function normalizeCouponInput(input = {}, seenIds = new Set()) {
  const id = normalizeCouponId(input.id);
  if (seenIds.has(id)) {
    throw createValidationError(`ID coupon bi trung: ${id}`);
  }
  seenIds.add(id);

  const title = sanitizeString(input.title, 180);
  if (!title) {
    throw createValidationError('Tieu de coupon khong duoc de trong.');
  }

  const affiliateUrl = sanitizeString(input.affiliate_url, 2000);
  if (!affiliateUrl) {
    throw createValidationError(`Coupon "${title}" dang thieu affiliate_url.`);
  }

  return {
    id,
    platform: normalizePlatform(input.platform),
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
    throw createValidationError('Du lieu global_coupons phai la mot mang JSON.');
  }

  const existingCoupons = await getGlobalCouponsSetting();
  const nextCoupons = [];
  const seenIds = new Set();

  for (const item of input) {
    const normalized = normalizeCouponInput(item, seenIds);
    const cloaked = await saveCloakedLink(buildGlobalCouponSlug(normalized.id), normalized.affiliate_url);
    nextCoupons.push({
      ...normalized,
      affiliate_url: cloaked.deepLink || normalized.affiliate_url,
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
