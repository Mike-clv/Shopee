import crypto from 'node:crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.AUTH_SECRET || 'change-me';
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
}

function parseCookies(req) {
  const cookies = {};
  const header = req.headers.cookie;
  if (!header) return cookies;

  for (const part of header.split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    cookies[rawKey] = decodeURIComponent(rawValue.join('='));
  }

  return cookies;
}

export function createSessionCookie(user) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = base64url(JSON.stringify({
    sub: user.id || user.email,
    email: user.email,
    role: user.role || 'admin',
    exp: expiresAt,
  }));
  const signature = sign(payload);

  return {
    value: `${payload}.${signature}`,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function setSessionCookie(res, session) {
  res.cookie(COOKIE_NAME, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: session.maxAge * 1000,
    path: '/',
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

export function getSessionUser(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      id: data.sub,
      email: data.email,
      role: data.role || 'admin',
    };
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, next) {
  const user = getSessionUser(req);
  if (!user || user.role !== 'admin') {
    res.status(401).json({ message: 'Bạn cần đăng nhập admin để thực hiện thao tác này.' });
    return;
  }

  req.user = user;
  next();
}

export function validateAdminCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me';
  return email === adminEmail && password === adminPassword;
}
