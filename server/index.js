import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import {
  createResource,
  deleteResource,
  listResource,
  trackEvent,
  updateResource,
} from './services/entity-service.js';
import {
  clearSessionCookie,
  createSessionCookie,
  getSessionUser,
  requireAdmin,
  setSessionCookie,
  validateAdminCredentials,
} from './services/auth-service.js';
import { syncAccessTrade } from './services/accesstrade/sync.js';
import { publishScheduledContent } from './services/publish-service.js';
import { saveImageUpload } from './services/upload-service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 3001;
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://shopee-six-zeta.vercel.app').replace(/\/+$/, '');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number.parseInt(process.env.MAX_UPLOAD_IMAGE_SIZE || '4194304', 10),
  },
});

app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ma-giam-gia-api' });
});

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

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',
    'Disallow: /tim-kiem',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n'));
});

app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const [blogPosts, brands, categories, vouchers] = await Promise.all([
      listResource('blog-posts', { status: 'published' }, '-published_at', 500),
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
      ...brands.map((brand) => formatSitemapUrl(`/thuong-hieu/${brand.slug || brand.id}`, brand.updated_date, '0.7')),
      ...categories.map((category) => formatSitemapUrl(`/danh-muc/${category.slug || category.id}`, category.updated_date, '0.7')),
      ...vouchers.map((voucher) => formatSitemapUrl(`/ma-giam-gia/${voucher.slug || voucher.id}`, voucher.updated_date || voucher.created_date, '0.6')),
    ];

    res.type('application/xml');
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
        [...staticUrls, ...dynamicUrls].join('') +
        `</urlset>`,
    );
  } catch (error) {
    next(error);
  }
});

app.get('/api/homepage', async (_req, res, next) => {
  try {
    await publishScheduledContent();

    const [
      hotVouchers,
      newVouchers,
      categories,
      brands,
      topBanners,
      hotEmptyBanners,
      blogPosts,
      interestPosts,
    ] = await Promise.all([
      listResource('vouchers', { is_hot: true, status: 'active' }, '-sort_order', 6),
      listResource('vouchers', { status: 'active' }, '-created_date', 6),
      listResource('categories', { is_active: true }, 'sort_order', 12),
      listResource('brands', { is_featured: true, is_active: true }, 'sort_order', 12),
      listResource('banners', { is_active: true, placement: 'homepage_top' }, 'sort_order', 4),
      listResource('banners', { is_active: true, placement: 'hot_empty' }, 'sort_order', 4),
      listResource('blog-posts', { status: 'published' }, '-published_at', 100),
      listResource('interest-posts', { status: 'published' }, 'sort_order', 12),
    ]);

    res.json({
      hotVouchers,
      newVouchers,
      categories,
      brands,
      topBanners,
      hotEmptyBanners,
      blogPosts,
      interestPosts,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!validateAdminCredentials(email, password)) {
    res.status(401).json({ message: 'Email hoặc mật khẩu admin không đúng.' });
    return;
  }

  const user = {
    id: email,
    email,
    role: 'admin',
    name: 'Local Admin',
  };
  setSessionCookie(res, createSessionCookie(user));
  res.json(user);
});

app.get('/api/auth/me', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ message: 'Chưa đăng nhập.' });
    return;
  }

  res.json(user);
});

app.post('/api/auth/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.post('/api/auth/register', (_req, res) => {
  res.status(501).json({ message: 'Bản local chỉ bật đăng nhập admin bằng ADMIN_EMAIL/ADMIN_PASSWORD trong .env.' });
});

app.post('/api/auth/forgot-password', (_req, res) => {
  res.status(501).json({ message: 'Reset mật khẩu self-service chưa bật trong bản local. Hãy đổi ADMIN_PASSWORD trong .env.' });
});

app.post('/api/auth/reset-password', (_req, res) => {
  res.status(501).json({ message: 'Reset mật khẩu self-service chưa bật trong bản local. Hãy đổi ADMIN_PASSWORD trong .env.' });
});

app.post('/api/accesstrade/sync', requireAdmin, async (req, res, next) => {
  try {
    const result = await syncAccessTrade(req.body?.sync_type || 'campaigns');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/api/uploads/image', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    const result = await saveImageUpload(req.file);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/cron/publish', async (req, res, next) => {
  try {
    if (process.env.CRON_SECRET) {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        res.status(401).json({ message: 'Unauthorized cron request.' });
        return;
      }
    }

    const publishedCount = await publishScheduledContent();
    res.json({
      ok: true,
      publishedCount,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/:resource', async (req, res, next) => {
  try {
    const { resource } = req.params;
    if (resource === 'blog-posts' || resource === 'interest-posts') {
      await publishScheduledContent();
    }
    const { sort, limit, ...filters } = req.query;
    const rows = await listResource(resource, filters, sort, limit);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/:resource', async (req, res, next) => {
  try {
    const { resource } = req.params;

    if (resource === 'click-events') {
      try {
        const event = await trackEvent(req.body || {});
        res.status(201).json(event);
      } catch {
        res.status(202).json({
          id: `fallback_${Date.now()}`,
          ...(req.body || {}),
          created_date: new Date().toISOString(),
        });
      }
      return;
    }

    if (resource === 'copy-events') {
      const event = await createResource(resource, req.body || {});
      res.status(201).json(event);
      return;
    }

    requireAdmin(req, res, async () => {
      try {
        const row = await createResource(resource, req.body || {});
        res.status(201).json(row);
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/:resource/:id', requireAdmin, async (req, res, next) => {
  try {
    const row = await updateResource(req.params.resource, req.params.id, req.body || {});
    res.json(row);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/:resource/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteResource(req.params.resource, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use('/uploads', express.static(path.join(rootDir, process.env.UPLOAD_DIR || 'public/uploads')));

const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Lỗi server nội bộ.',
  });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

export default app;
