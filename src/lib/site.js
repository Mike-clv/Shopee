export const SITE_NAME = 'Mã Giảm Giá Pro';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://sansaleshopee.vercel.app').replace(/\/+$/, '');
export const DEFAULT_DESCRIPTION =
  'Tổng hợp mã giảm giá, voucher, coupon và deal hot từ Shopee, Lazada, Tiki, TikTok Shop và nhiều thương hiệu uy tín.';
export const DEFAULT_IMAGE = `${SITE_URL}/uploads/66.jpg`;

export const BASE_KEYWORDS = [
  'mã giảm giá',
  'ma giam gia',
  'voucher',
  'deal hot',
  'mã giảm giá hôm nay',
  'ma giam gia hom nay',
  'voucher hôm nay',
  'voucher hom nay',
  'mã giảm giá shopee',
  'ma giam gia shopee',
  'mã giảm giá lazada',
  'ma giam gia lazada',
  'mã giảm giá tiki',
  'ma giam gia tiki',
  'mã giảm giá tiktok shop',
  'ma giam gia tiktok shop',
];

export const HOME_KEYWORDS = [
  'mã giảm giá shopee hôm nay',
  'ma giam gia shopee hom nay',
  'voucher shopee hôm nay',
  'voucher shopee hom nay',
  'voucher lazada hôm nay',
  'voucher lazada hom nay',
  'voucher tiki hôm nay',
  'voucher tiki hom nay',
  'voucher tiktok shop hôm nay',
  'voucher tiktok shop hom nay',
  'mã freeship shopee',
  'ma freeship shopee',
];

export const VOUCHER_PAGE_KEYWORDS = [
  'tổng hợp mã giảm giá',
  'tong hop ma giam gia',
  'coupon shopee',
  'coupon lazada',
  'coupon tiki',
  'coupon tiktok shop',
  'voucher toàn sàn',
  'voucher toan san',
];

export const BLOG_KEYWORDS = [
  'mẹo săn sale',
  'meo san sale',
  'mẹo săn mã giảm giá',
  'meo san ma giam gia',
  'cách áp mã giảm giá',
  'cach ap ma giam gia',
  'kinh nghiệm mua sắm online',
  'kinh nghiem mua sam online',
];

export const BRAND_KEYWORDS = [
  'thương hiệu giảm giá',
  'thuong hieu giam gia',
  'voucher thương hiệu',
  'voucher thuong hieu',
];

export const CATEGORY_KEYWORDS = [
  'mã giảm giá theo danh mục',
  'ma giam gia theo danh muc',
  'voucher ngành hàng',
  'voucher nganh hang',
];

export const PLATFORM_KEYWORDS = {
  shopee: [
    'mã giảm giá shopee hôm nay',
    'ma giam gia shopee hom nay',
    'voucher shopee hôm nay',
    'voucher shopee hom nay',
    'mã freeship shopee',
    'ma freeship shopee',
    'mã shopee mới nhất',
    'ma shopee moi nhat',
  ],
  lazada: [
    'mã giảm giá lazada hôm nay',
    'ma giam gia lazada hom nay',
    'voucher lazada hôm nay',
    'voucher lazada hom nay',
    'mã freeship lazada',
    'ma freeship lazada',
    'voucher max lazada',
  ],
  tiki: [
    'mã giảm giá tiki hôm nay',
    'ma giam gia tiki hom nay',
    'voucher tiki hôm nay',
    'voucher tiki hom nay',
    'coupon tiki',
    'mã freeship tiki',
    'ma freeship tiki',
  ],
  'tiktok-shop': [
    'mã giảm giá tiktok shop hôm nay',
    'ma giam gia tiktok shop hom nay',
    'voucher tiktok shop hôm nay',
    'voucher tiktok shop hom nay',
    'deal live tiktok shop',
    'mã tiktok shop mới nhất',
    'ma tiktok shop moi nhat',
  ],
};

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

export function mergeKeywords(...groups) {
  const values = groups
    .flatMap((group) => (Array.isArray(group) ? group : [group]))
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return [...new Set(values)].join(', ');
}
