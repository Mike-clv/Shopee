export const GLOBAL_COUPON_PLATFORM_OPTIONS = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiki', label: 'Tiki' },
];

export const GLOBAL_COUPON_TYPE_OPTIONS = [
  { value: 'all_site', label: 'Mã toàn sàn' },
  { value: 'freeship', label: 'Miễn phí vận chuyển' },
  { value: 'category', label: 'Ngành hàng' },
];

export const GLOBAL_COUPON_PLATFORM_LABELS = Object.fromEntries(
  GLOBAL_COUPON_PLATFORM_OPTIONS.map((item) => [item.value, item.label]),
);

export const GLOBAL_COUPON_TYPE_LABELS = Object.fromEntries(
  GLOBAL_COUPON_TYPE_OPTIONS.map((item) => [item.value, item.label]),
);

export function isGlobalCouponExpired(expiresAt, now = Date.now()) {
  if (!expiresAt) return false;
  const timestamp = new Date(expiresAt).getTime();
  if (!Number.isFinite(timestamp)) return false;
  return timestamp < now;
}

export function formatGlobalCouponExpiry(expiresAt) {
  if (!expiresAt) return '';

  const timestamp = new Date(expiresAt);
  if (Number.isNaN(timestamp.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

export function buildGlobalCouponRedirectPath(id) {
  return `/go/coupon-${id}`;
}
