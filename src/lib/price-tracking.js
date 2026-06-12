export const TRACKED_PRODUCT_PLATFORM_OPTIONS = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiki', label: 'Tiki' },
  { value: 'tiktok-shop', label: 'TikTok Shop' },
  { value: 'other', label: 'Khac' },
];

export function getTrackedProductPlatformLabel(platform) {
  return TRACKED_PRODUCT_PLATFORM_OPTIONS.find((item) => item.value === platform)?.label || 'Khac';
}

export function formatTrackedPrice(value, currency = 'VND') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 'Chua co du lieu';
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
  if (!value) return 'Chua cap nhat';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chua cap nhat';
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
