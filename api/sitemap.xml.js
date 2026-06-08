import { listResource } from '../server/services/entity-service.js';

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://sansaleshopee.vercel.app').replace(/\/+$/, '');

function xmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatSitemapUrl(pathname, lastmod, priority = '0.7') {
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return [
    '<url>',
    `<loc>${xmlEscape(`${siteUrl}${cleanPath}`)}</loc>`,
    lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
    `<priority>${priority}</priority>`,
    '</url>',
  ].filter(Boolean).join('');
}

export default async function handler(_req, res) {
  const [blogPosts, interestPosts, brands, categories, vouchers] = await Promise.all([
    listResource('blog-posts', { status: 'published' }, '-published_at', 500),
    listResource('interest-posts', { status: 'published' }, '-published_at', 500),
    listResource('brands', { is_active: true }, 'sort_order', 500),
    listResource('categories', { is_active: true }, 'sort_order', 500),
    listResource('vouchers', { status: 'active' }, '-updated_date', 1000),
  ]);

  const staticUrls = [
    formatSitemapUrl('/', new Date(), '1.0'),
    formatSitemapUrl('/ma-giam-gia', new Date(), '0.9'),
    formatSitemapUrl('/thuong-hieu', new Date(), '0.8'),
    formatSitemapUrl('/danh-muc', new Date(), '0.8'),
    formatSitemapUrl('/blog', new Date(), '0.8'),
    formatSitemapUrl('/gioi-thieu', new Date(), '0.5'),
    formatSitemapUrl('/chinh-sach', new Date(), '0.4'),
    formatSitemapUrl('/san/shopee', new Date(), '0.8'),
    formatSitemapUrl('/san/lazada', new Date(), '0.8'),
    formatSitemapUrl('/san/tiki', new Date(), '0.8'),
    formatSitemapUrl('/san/tiktok-shop', new Date(), '0.8'),
  ];

  const dynamicUrls = [
    ...blogPosts.map((post) => formatSitemapUrl(`/blog/${post.slug || post.id}`, post.updated_date || post.published_at, '0.7')),
    ...interestPosts.map((post) => formatSitemapUrl(`/quan-tam/${post.slug || post.id}`, post.updated_date || post.published_at, '0.7')),
    ...brands.map((brand) => formatSitemapUrl(`/thuong-hieu/${brand.slug || brand.id}`, brand.updated_date, '0.7')),
    ...categories.map((category) => formatSitemapUrl(`/danh-muc/${category.slug || category.id}`, category.updated_date, '0.7')),
    ...vouchers.map((voucher) => formatSitemapUrl(`/ma-giam-gia/${voucher.slug || voucher.id}`, voucher.updated_date || voucher.created_date, '0.6')),
  ];

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res
    .status(200)
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
        [...staticUrls, ...dynamicUrls].join('') +
        `</urlset>`,
    );
}
