import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import {
  bulkUpdateVoucherStatus,
  bulkUpdateVouchersByIds,
  bulkDeleteVouchersByIds,
  createResource,
  deleteResource,
  listResource,
  listResourcePaginated,
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
import { cleanupStaleAccessTradeSyncLogs, syncAccessTrade } from './services/accesstrade/sync.js';
import { ensureCloakedLink } from './services/accesstrade/deeplink.js';
import { generateShopeeInterestPostsFromAccessTrade } from './services/accesstrade/product-interest-generator.js';
import { createAffiliateRouter } from './routes/affiliate-router.js';
import { createPriceTrackingRouter } from './routes/price-tracking-router.js';
import { getGlobalCouponsSetting, getPublicGlobalCoupons, saveGlobalCouponsSetting } from './services/global-coupons-service.js';
import { publishScheduledContent } from './services/publish-service.js';
import { getExitIntentPopupSetting, saveExitIntentPopupSetting } from './services/site-setting-service.js';
import { saveImageUpload } from './services/upload-service.js';
import {
  applySecurityHeaders,
  attachPublicResourceMetadata,
  assertProductionSecurityConfig,
  buildPublicQuery,
  canRunCronWithoutSecret,
  clampLimit,
  createRateLimitMiddleware,
  createSecurityEventLogger,
  enforceProductionSecurityConfig,
  requireSameOrigin,
  validateAnalyticsPayload,
  verifyAnalyticsToken,
} from './services/security-service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
enforceProductionSecurityConfig();
const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 3001;
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://sansale247.io.vn').replace(/\/+$/, '');

const productionSecurityWarnings = assertProductionSecurityConfig();
if (productionSecurityWarnings.length > 0) {
  console.warn('[security] Production config warnings:', productionSecurityWarnings.join(' '));
}

app.disable('x-powered-by');
// Trust the first upstream proxy in production so req.ip reflects Cloudflare/Nginx.
app.set('trust proxy', process.env.TRUST_PROXY || process.env.VERCEL ? 1 : false);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number.parseInt(process.env.MAX_UPLOAD_IMAGE_SIZE || '4194304', 10),
  },
});

const loginRateLimit = createRateLimitMiddleware({
  keyPrefix: 'login',
  max: Number.parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '8', 10),
  windowMs: Number.parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || `${15 * 60 * 1000}`, 10),
  message: 'Bạn thử đăng nhập quá nhiều lần. Vui lòng chờ một chút rồi thử lại.',
});

const analyticsRateLimit = createRateLimitMiddleware({
  keyPrefix: 'analytics',
  max: Number.parseInt(process.env.ANALYTICS_RATE_LIMIT_MAX || '15', 10),
  windowMs: Number.parseInt(process.env.ANALYTICS_RATE_LIMIT_WINDOW_MS || `${10 * 60 * 1000}`, 10),
  message: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
  keyBuilder: (req) => `${req.ip || 'unknown'}:${req.body?.voucher_id || 'unknown'}`,
});

const publicReadRateLimit = createRateLimitMiddleware({
  keyPrefix: 'public-read',
  max: Number.parseInt(process.env.PUBLIC_READ_RATE_LIMIT_MAX || '120', 10),
  windowMs: Number.parseInt(process.env.PUBLIC_READ_RATE_LIMIT_WINDOW_MS || `${60 * 1000}`, 10),
  message: 'Ban dang tai du lieu qua nhanh. Vui long cho it giay roi thu lai.',
});

const adminMutationRateLimit = createRateLimitMiddleware({
  keyPrefix: 'admin-mutation',
  max: Number.parseInt(process.env.ADMIN_MUTATION_RATE_LIMIT_MAX || '60', 10),
  windowMs: Number.parseInt(process.env.ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS || `${60 * 1000}`, 10),
  message: 'Thao tac admin qua nhanh. Vui long cho it giay roi thu lai.',
});

const uploadRateLimit = createRateLimitMiddleware({
  keyPrefix: 'upload',
  max: Number.parseInt(process.env.UPLOAD_RATE_LIMIT_MAX || '20', 10),
  windowMs: Number.parseInt(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || `${10 * 60 * 1000}`, 10),
  message: 'Ban upload qua nhieu anh trong thoi gian ngan. Vui long thu lai sau.',
});

function maybeRateLimitPublicRead(req, res, next) {
  const user = getSessionUser(req);
  if (user?.role === 'admin') {
    next();
    return;
  }

  publicReadRateLimit(req, res, next);
}

app.use(applySecurityHeaders);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(createSecurityEventLogger());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use('/api/auth', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
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
    const [blogPosts, interestPosts, brands, categories, vouchers, trackedProducts] = await Promise.all([
      listResource('blog-posts', { status: 'published' }, 'sort_order', 500),
      listResource('interest-posts', { status: 'published' }, 'sort_order', 500),
      listResource('brands', { is_active: true }, 'sort_order', 500),
      listResource('categories', { is_active: true }, 'sort_order', 500),
      listResource('vouchers', { status: 'active' }, '-updated_date', 1000),
      listResource('tracked-products', { is_active: true }, 'sort_order', 500),
    ]);

    const staticUrls = [
      formatSitemapUrl('/', new Date(), '1.0'),
      formatSitemapUrl('/ma-giam-gia', new Date(), '0.9'),
      formatSitemapUrl('/thuong-hieu', new Date(), '0.8'),
      formatSitemapUrl('/danh-muc', new Date(), '0.8'),
      formatSitemapUrl('/blog', new Date(), '0.8'),
      formatSitemapUrl('/quan-tam', new Date(), '0.75'),
      formatSitemapUrl('/theo-doi-gia', new Date(), '0.7'),
      formatSitemapUrl('/tinh-tra-gop', new Date(), '0.7'),
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
      ...trackedProducts.map((product) => formatSitemapUrl(`/theo-doi-gia/${product.slug || product.id}`, product.updated_date || product.created_date, '0.6')),
    ];

    res.type('application/xml');
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>`
      + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
      + [...staticUrls, ...dynamicUrls].join('')
      + `</urlset>`,
    );
  } catch (error) {
    next(error);
  }
});

app.get('/api/homepage', maybeRateLimitPublicRead, async (_req, res, next) => {
  try {
    await publishScheduledContent();

    const [
      hotVouchers,
      newVouchers,
      categories,
      brands,
      topBanners,
      hotEmptyBanners,
      globalCoupons,
      blogPosts,
      interestPosts,
    ] = await Promise.all([
      listResource('vouchers', { is_hot: true, status: 'active' }, '-sort_order', 6),
      listResource('vouchers', { status: 'active' }, '-created_date', 6),
      listResource('categories', { is_active: true }, 'sort_order', 50),
      listResource('brands', { is_featured: true, is_active: true }, 'sort_order', 12),
      listResource('banners', { is_active: true, placement: 'homepage_top' }, 'sort_order', 4),
      listResource('banners', { is_active: true, placement: 'hot_empty' }, 'sort_order', 4),
      getPublicGlobalCoupons(),
      listResource('blog-posts', { status: 'published' }, 'sort_order', 100),
      listResource('interest-posts', { status: 'published' }, 'sort_order', 12),
    ]);

    res.json({
      hotVouchers: attachPublicResourceMetadata('vouchers', hotVouchers, _req),
      newVouchers: attachPublicResourceMetadata('vouchers', newVouchers, _req),
      categories,
      brands,
      topBanners,
      hotEmptyBanners,
      globalCoupons,
      blogPosts,
      interestPosts,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', requireSameOrigin, loginRateLimit, async (req, res) => {
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

app.post('/api/auth/logout', requireSameOrigin, (_req, res) => {
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

app.post('/api/accesstrade/sync', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const result = await syncAccessTrade(req.body?.sync_type || 'campaigns');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/cron/accesstrade-sync', async (req, res, next) => {
  try {
    if (process.env.CRON_SECRET) {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        res.status(401).json({ message: 'Unauthorized cron request.' });
        return;
      }
    } else if (!canRunCronWithoutSecret()) {
      res.status(503).json({ message: 'CRON_SECRET chưa được cấu hình trên production.' });
      return;
    }

    const result = await syncAccessTrade('vouchers');
    res.json({
      ok: true,
      ...result,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

app.use(createAffiliateRouter({
  requireAdmin,
  requireSameOrigin,
  adminMutationRateLimit,
}));

app.use(createPriceTrackingRouter({
  adminMutationRateLimit,
  canRunCronWithoutSecret,
  getSessionUser,
  maybeRateLimitPublicRead,
  requireAdmin,
  requireSameOrigin,
}));

app.post('/api/uploads/image', requireSameOrigin, requireAdmin, uploadRateLimit, upload.single('file'), async (req, res, next) => {
  try {
    const result = await saveImageUpload(req.file);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/exit-intent-popup', maybeRateLimitPublicRead, async (_req, res, next) => {
  try {
    const value = await getExitIntentPopupSetting();
    res.json(value);
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/exit-intent-popup', requireAdmin, async (_req, res, next) => {
  try {
    const value = await getExitIntentPopupSetting();
    res.json(value);
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/exit-intent-popup', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const payload = { ...(req.body || {}) };
    if (payload.buttonUrl) {
      const result = await ensureCloakedLink(payload.buttonUrl);
      payload.buttonUrl = result.cloakedUrl || payload.buttonUrl;
    }
    const value = await saveExitIntentPopupSetting(payload);
    res.json(value);
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/global-coupons', requireAdmin, async (_req, res, next) => {
  try {
    const value = await getGlobalCouponsSetting();
    res.json(value);
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/global-coupons', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const value = await saveGlobalCouponsSetting(req.body || []);
    res.json(value);
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/interest-posts/generate-from-accesstrade', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const result = await generateShopeeInterestPostsFromAccessTrade({
      limit: req.body?.limit,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/api/vouchers/bulk-status', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const result = await bulkUpdateVoucherStatus(req.body?.filters || {}, req.body?.status);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/api/vouchers/bulk-update', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const result = await bulkUpdateVouchersByIds(req.body?.ids || [], req.body?.data || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/api/vouchers/bulk-delete', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const result = await bulkDeleteVouchersByIds(req.body?.ids || []);
    res.json(result);
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
    } else if (!canRunCronWithoutSecret()) {
      res.status(503).json({ message: 'CRON_SECRET chưa được cấu hình trên production.' });
      return;
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

app.get('/api/:resource', maybeRateLimitPublicRead, async (req, res, next) => {
  try {
    const { resource } = req.params;
    if (resource === 'blog-posts' || resource === 'interest-posts') {
      await publishScheduledContent();
    }
    if (resource === 'sync-logs') {
      const user = getSessionUser(req);
      if (user?.role === 'admin') {
        await cleanupStaleAccessTradeSyncLogs();
      }
    }

    const { sort, limit, page, ...filters } = req.query;
    const user = getSessionUser(req);

    if (user?.role === 'admin') {
      // Hỗ trợ phân trang khi có tham số page
      if (page) {
        const result = await listResourcePaginated(resource, filters, sort, clampLimit(limit, 500), page);
        res.json(result);
        return;
      }
      const rows = await listResource(resource, filters, sort, clampLimit(limit, 500));
      res.json(rows);
      return;
    }

    const publicQuery = buildPublicQuery(resource, filters, sort, limit);
    const rows = await listResource(resource, publicQuery.filters, publicQuery.sort, publicQuery.limit);
    res.json(attachPublicResourceMetadata(resource, rows, req));
  } catch (error) {
    next(error);
  }
});

app.post('/api/:resource', requireSameOrigin, async (req, res, next) => {
  try {
    const { resource } = req.params;

    if (resource === 'click-events' || resource === 'copy-events') {
      analyticsRateLimit(req, res, async () => {
        try {
          const payload = validateAnalyticsPayload({
            ...(req.body || {}),
            event_type: resource === 'copy-events' ? 'copy' : req.body?.event_type,
          });
          verifyAnalyticsToken(req, payload);
          const event = await trackEvent(payload);
          res.status(201).json(event);
        } catch (error) {
          next(error);
        }
      });
      return;
    }

    adminMutationRateLimit(req, res, () => requireAdmin(req, res, async () => {
      try {
        const row = await createResource(resource, req.body || {});
        res.status(201).json(row);
      } catch (error) {
        next(error);
      }
    }));
  } catch (error) {
    next(error);
  }
});

app.put('/api/:resource/:id', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const row = await updateResource(req.params.resource, req.params.id, req.body || {});
    res.json(row);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/:resource/:id', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
  try {
    const result = await deleteResource(req.params.resource, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use('/uploads', express.static(path.join(rootDir, process.env.UPLOAD_DIR || 'public/uploads')));

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
  const server = http.createServer(app);
  // Bound idle/slow client behavior to reduce connection-hoarding attacks.
  server.requestTimeout = Number.parseInt(process.env.HTTP_REQUEST_TIMEOUT_MS || '15000', 10);
  server.headersTimeout = Number.parseInt(process.env.HTTP_HEADERS_TIMEOUT_MS || '10000', 10);
  server.keepAliveTimeout = Number.parseInt(process.env.HTTP_KEEPALIVE_TIMEOUT_MS || '5000', 10);
  server.maxRequestsPerSocket = Number.parseInt(process.env.HTTP_MAX_REQUESTS_PER_SOCKET || '100', 10);

  server.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

export default app;
