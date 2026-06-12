import crypto from 'node:crypto';

const DEFAULT_PUBLIC_MAX_LIMIT = 100;
const rateLimitStore = new Map();
const analyticsReplayStore = new Map();

const publicReadPolicies = {
  vouchers: {
    enforcedFilters: { status: 'active' },
    allowedFilterFields: ['id', 'slug', 'platform', 'brand_id', 'brand_name', 'category_id', 'category_name', 'is_hot', 'is_featured'],
    allowedSortFields: ['sort_order', 'created_date', 'updated_date', 'click_count', 'copy_count'],
    maxLimit: 100,
  },
  brands: {
    enforcedFilters: { is_active: true },
    allowedFilterFields: ['id', 'slug', 'platform', 'is_featured'],
    allowedSortFields: ['sort_order', 'created_date', 'updated_date', 'click_count', 'voucher_count'],
    maxLimit: 100,
  },
  categories: {
    enforcedFilters: { is_active: true },
    allowedFilterFields: ['id', 'slug'],
    allowedSortFields: ['sort_order', 'created_date', 'updated_date', 'voucher_count'],
    maxLimit: 100,
  },
  'blog-posts': {
    enforcedFilters: { status: 'published' },
    allowedFilterFields: ['id', 'slug', 'category'],
    allowedSortFields: ['sort_order', 'published_at', 'created_date', 'updated_date'],
    maxLimit: 100,
  },
  'interest-posts': {
    enforcedFilters: { status: 'published' },
    allowedFilterFields: ['id', 'slug'],
    allowedSortFields: ['sort_order', 'published_at', 'created_date', 'updated_date'],
    maxLimit: 100,
  },
  banners: {
    enforcedFilters: { is_active: true },
    allowedFilterFields: ['id', 'placement'],
    allowedSortFields: ['sort_order', 'created_date', 'updated_date'],
    maxLimit: 20,
  },
  'tracked-products': {
    enforcedFilters: { is_active: true },
    allowedFilterFields: ['id', 'slug', 'platform'],
    allowedSortFields: ['sort_order', 'last_checked_at', 'created_date', 'updated_date'],
    maxLimit: 50,
  },
};

function parseIntSafe(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function isProductionLike() {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

export function clampLimit(limit, maxLimit = DEFAULT_PUBLIC_MAX_LIMIT) {
  if (limit === undefined || limit === null || limit === '') return maxLimit;
  return Math.max(1, Math.min(parseIntSafe(limit, maxLimit), maxLimit));
}

export function getPublicReadPolicy(resource) {
  return publicReadPolicies[resource] || null;
}

export function buildPublicQuery(resource, filters = {}, sort, limit) {
  const policy = getPublicReadPolicy(resource);
  if (!policy) {
    const error = new Error('Resource is not available publicly.');
    error.status = 403;
    throw error;
  }

  const safeFilters = {};
  for (const field of policy.allowedFilterFields || []) {
    if (filters[field] !== undefined) {
      safeFilters[field] = filters[field];
    }
  }

  const normalizedSort = sort
    && policy.allowedSortFields.includes(String(sort).replace(/^-/, ''))
    ? String(sort)
    : policy.allowedSortFields[0];

  return {
    filters: {
      ...safeFilters,
      ...policy.enforcedFilters,
    },
    sort: normalizedSort,
    limit: clampLimit(limit, policy.maxLimit || DEFAULT_PUBLIC_MAX_LIMIT),
  };
}

export function getClientIp(req) {
  if (typeof req.ip === 'string' && req.ip.trim()) {
    return req.ip.trim();
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.headers['x-real-ip'] || req.ip || req.socket?.remoteAddress || 'unknown';
}

function cleanupRateLimitStore(now) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (!entry || entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function createRateLimitMiddleware({
  keyPrefix,
  max,
  windowMs,
  message,
  keyBuilder,
}) {
  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    cleanupRateLimitStore(now);

    const rawKey = keyBuilder ? keyBuilder(req) : getClientIp(req);
    const key = `${keyPrefix}:${rawKey}`;
    const current = rateLimitStore.get(key);

    if (!current || current.resetAt <= now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= max) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({ message });
      return;
    }

    current.count += 1;
    rateLimitStore.set(key, current);
    next();
  };
}

function truncateLogValue(value, maxLength = 180) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
}

export function createSecurityEventLogger({
  slowRequestMs = Number.parseInt(process.env.SECURITY_SLOW_REQUEST_MS || '1500', 10),
} = {}) {
  return function securityEventLogger(req, res, next) {
    const startedAt = process.hrtime.bigint();
    const ip = getClientIp(req);

    res.on('finish', () => {
      const durationMs = Number((process.hrtime.bigint() - startedAt) / 1000000n);
      const path = req.originalUrl || req.url || '';
      const isApiRequest = path.startsWith('/api/');
      if (!isApiRequest) return;

      const shouldLog = res.statusCode >= 500
        || res.statusCode === 429
        || durationMs >= slowRequestMs
        || (path.startsWith('/api/auth/') && res.statusCode >= 400)
        || (path.startsWith('/api/uploads/') && res.statusCode >= 400)
        || (path.startsWith('/api/accesstrade/') && res.statusCode >= 400);

      if (!shouldLog) return;

      const payload = {
        type: 'security_event',
        ts: new Date().toISOString(),
        ip,
        method: req.method,
        path,
        status: res.statusCode,
        duration_ms: durationMs,
        referer: truncateLogValue(req.headers.referer || req.headers.referrer || ''),
        user_agent: truncateLogValue(req.headers['user-agent'] || ''),
      };

      console.warn('[security-event]', JSON.stringify(payload));
    });

    next();
  };
}

function normalizeOriginHost(value) {
  if (!value) return null;

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

export function requireSameOrigin(req, res, next) {
  const origin = req.headers.origin;
  const requestHost = req.headers.host;
  const refererHost = normalizeOriginHost(req.headers.referer || req.headers.referrer);
  const originHost = normalizeOriginHost(origin);
  const sourceHost = originHost || refererHost;

  if (!sourceHost || !requestHost || sourceHost !== requestHost) {
    // Cho phép localhost cross-port trong development mode
    // (Vite dev server chạy port khác API server)
    if (!isProductionLike()) {
      const extractHostname = (host) => host?.split(':')[0] || null;
      const sourceHostname = extractHostname(sourceHost);
      const requestHostname = extractHostname(requestHost);
      const isLocalhost = (h) => h === 'localhost' || h === '127.0.0.1';
      if (sourceHostname && requestHostname && isLocalhost(sourceHostname) && isLocalhost(requestHostname)) {
        next();
        return;
      }
    }
    res.status(403).json({ message: 'Origin không hợp lệ.' });
    return;
  }

  next();
}

export function applySecurityHeaders(_req, res, next) {
  // Keep CSP strict enough to reduce XSS blast radius while still allowing
  // the current production integrations (fonts, AccessTrade, Vercel telemetry).
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "script-src 'self' 'unsafe-inline' https://static.accesstrade.vn https://cdnjs.cloudflare.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "connect-src 'self' https://api.accesstrade.vn https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src 'self' https://static.accesstrade.vn",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy', csp);
  if (isProductionLike()) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
}

export function assertProductionSecurityConfig() {
  if (!isProductionLike()) return [];

  const issues = [];
  const authSecret = process.env.AUTH_SECRET || '';
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const adminEmail = process.env.ADMIN_EMAIL || '';

  if (!authSecret || authSecret === 'change-me' || authSecret.length < 32) {
    issues.push('AUTH_SECRET phải khác mặc định và dài tối thiểu 32 ký tự.');
  }

  if (!adminPassword || adminPassword === 'change-me' || adminPassword.length < 12) {
    issues.push('ADMIN_PASSWORD phải khác mặc định và đủ mạnh (tối thiểu 12 ký tự).');
  }

  if (!adminEmail || adminEmail === 'admin@example.com') {
    issues.push('ADMIN_EMAIL phải được cấu hình bằng email admin thật.');
  }

  return issues;
}

export function enforceProductionSecurityConfig() {
  const issues = assertProductionSecurityConfig();
  if (issues.length > 0) {
    const error = new Error(`Production security configuration is invalid: ${issues.join(' ')}`);
    error.status = 500;
    throw error;
  }
}

export function canRunCronWithoutSecret() {
  return !isProductionLike();
}

export function validateAnalyticsPayload(input = {}) {
  const voucherId = typeof input.voucher_id === 'string' ? input.voucher_id.trim() : '';
  if (!voucherId || voucherId.length > 160) {
    const error = new Error('voucher_id không hợp lệ.');
    error.status = 400;
    throw error;
  }

  const normalized = {
    voucher_id: voucherId,
    brand_id: typeof input.brand_id === 'string' ? input.brand_id.trim().slice(0, 160) : undefined,
    event_type: input.event_type === 'copy' ? 'copy' : 'click',
    source_page: typeof input.source_page === 'string' ? input.source_page.trim().slice(0, 300) : undefined,
    voucher_title: typeof input.voucher_title === 'string' ? input.voucher_title.trim().slice(0, 300) : undefined,
    brand_name: typeof input.brand_name === 'string' ? input.brand_name.trim().slice(0, 160) : undefined,
    analytics_token: typeof input.analytics_token === 'string' ? input.analytics_token.trim().slice(0, 1000) : '',
  };

  if (normalized.source_page && !normalized.source_page.startsWith('/')) {
    normalized.source_page = undefined;
  }

  if (!normalized.analytics_token) {
    const error = new Error('Thiếu analytics_token hợp lệ.');
    error.status = 403;
    throw error;
  }

  return normalized;
}

function getAnalyticsSecret() {
  return process.env.ANALYTICS_TOKEN_SECRET || process.env.AUTH_SECRET || 'change-me';
}

function hashContext(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex').slice(0, 32);
}

function signTokenPayload(payload) {
  return crypto.createHmac('sha256', getAnalyticsSecret()).update(payload).digest('base64url');
}

function cleanupReplayStore(now = Date.now()) {
  for (const [key, expiresAt] of analyticsReplayStore.entries()) {
    if (!expiresAt || expiresAt <= now) {
      analyticsReplayStore.delete(key);
    }
  }
}

export function createAnalyticsToken(req, voucher) {
  cleanupReplayStore();

  // Bind a short-lived, single-use analytics token to the current client context
  // so public event writes cannot be forged with arbitrary voucher ids.
  const payload = {
    nonce: crypto.randomUUID(),
    voucher_id: voucher.id,
    brand_id: voucher.brand_id || '',
    ip_hash: hashContext(getClientIp(req)),
    ua_hash: hashContext(req.headers['user-agent'] || ''),
    exp: Date.now() + (Number.parseInt(process.env.ANALYTICS_TOKEN_TTL_MS || '600000', 10) || 600000),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signTokenPayload(encodedPayload);

  analyticsReplayStore.set(payload.nonce, payload.exp);
  return `${encodedPayload}.${signature}`;
}

export function attachPublicResourceMetadata(resource, rows, req) {
  if (!Array.isArray(rows)) return rows;
  if (resource !== 'vouchers') return rows;

  return rows.map((row) => ({
    ...row,
    analytics_token: createAnalyticsToken(req, row),
  }));
}

export function verifyAnalyticsToken(req, payload) {
  cleanupReplayStore();

  const [encodedPayload, signature] = String(payload.analytics_token || '').split('.');
  if (!encodedPayload || !signature) {
    const error = new Error('analytics_token không hợp lệ.');
    error.status = 403;
    throw error;
  }

  const expectedSignature = signTokenPayload(encodedPayload);
  const left = Buffer.from(signature, 'utf8');
  const right = Buffer.from(expectedSignature, 'utf8');
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    const error = new Error('analytics_token không hợp lệ.');
    error.status = 403;
    throw error;
  }

  let tokenData;
  try {
    tokenData = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    const error = new Error('analytics_token không hợp lệ.');
    error.status = 403;
    throw error;
  }

  if (!tokenData?.nonce || !tokenData?.voucher_id || !tokenData?.exp) {
    const error = new Error('analytics_token không hợp lệ.');
    error.status = 403;
    throw error;
  }

  if (tokenData.exp <= Date.now()) {
    analyticsReplayStore.delete(tokenData.nonce);
    const error = new Error('analytics_token đã hết hạn.');
    error.status = 403;
    throw error;
  }

  if (tokenData.voucher_id !== payload.voucher_id) {
    const error = new Error('analytics_token không khớp voucher.');
    error.status = 403;
    throw error;
  }

  const expectedIpHash = hashContext(getClientIp(req));
  const expectedUaHash = hashContext(req.headers['user-agent'] || '');
  if (tokenData.ip_hash !== expectedIpHash || tokenData.ua_hash !== expectedUaHash) {
    const error = new Error('analytics_token không khớp ngữ cảnh truy cập.');
    error.status = 403;
    throw error;
  }

  const reservedNonce = analyticsReplayStore.get(tokenData.nonce);
  if (!reservedNonce) {
    const error = new Error('analytics_token đã được sử dụng hoặc không tồn tại.');
    error.status = 409;
    throw error;
  }

  analyticsReplayStore.delete(tokenData.nonce);
  return tokenData;
}
