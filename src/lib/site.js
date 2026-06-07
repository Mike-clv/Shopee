export const SITE_NAME = 'Mã Giảm Giá Pro';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://shopee-six-zeta.vercel.app').replace(/\/+$/, '');
export const DEFAULT_DESCRIPTION =
  'Tổng hợp mã giảm giá, voucher, coupon và deal hot từ Shopee, Lazada, Tiki, TikTok Shop và nhiều thương hiệu uy tín.';
export const DEFAULT_IMAGE = `${SITE_URL}/uploads/66.jpg`;

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateText(value, max = 160) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}
