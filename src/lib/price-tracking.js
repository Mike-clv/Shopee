export const TRACKED_PRODUCT_PLATFORM_OPTIONS = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiki', label: 'Tiki' },
  { value: 'tiktok-shop', label: 'TikTok Shop' },
  { value: 'other', label: 'Khác' },
];

export function getTrackedProductPlatformLabel(platform) {
  return TRACKED_PRODUCT_PLATFORM_OPTIONS.find((item) => item.value === platform)?.label || 'Khác';
}

export function formatTrackedPrice(value, currency = 'VND') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 'Chưa có dữ liệu';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(amount);
}

export function formatCompactTrackedPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '';
  }

  return new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatTrackedDateTime(value) {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
  return date.toLocaleString('vi-VN');
}

export function formatTrackedDateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });
}
