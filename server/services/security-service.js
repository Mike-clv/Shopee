const DEFAULT_PUBLIC_MAX_LIMIT = 100;
const rateLimitStore = new Map();

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
};

function parseIntSafe(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
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
  if (!origin) {
    next();
    return;
  }

  const originHost = normalizeOriginHost(origin);
  const requestHost = req.headers.host;
  if (!originHost || !requestHost || originHost !== requestHost) {
    res.status(403).json({ message: 'Origin không hợp lệ.' });
    return;
  }

  next();
}

export function applySecurityHeaders(_req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
}

export function assertProductionSecurityConfig() {
  const isProductionLike = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  if (!isProductionLike) return [];

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

export function canRunCronWithoutSecret() {
  return !(process.env.NODE_ENV === 'production' || process.env.VERCEL);
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
  };

  if (normalized.source_page && !normalized.source_page.startsWith('/')) {
    normalized.source_page = undefined;
  }

  return normalized;
}
