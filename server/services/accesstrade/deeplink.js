import crypto from 'node:crypto';
import { getPrisma } from '../prisma.js';

const DEFAULT_DEEPLINK_BASE = 'https://go.isclix.com/deep_link/6041223145843920598/4751584435713464237?sub4=oneatweb';
const DEFAULT_SUPPORTED_HOSTS = [
  'go.isclix.com',
  'shopee.vn',
  'shp.ee',
  'lazada.vn',
  'tiki.vn',
  'tiktok.com',
  'tiktokshop.com',
  'vt.tiktok.com',
];

function getSiteUrl() {
  return (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://sansale247.io.vn').replace(/\/+$/, '');
}

function getDeepLinkBase() {
  return (process.env.ACCESSTRADE_DEEPLINK_BASE || DEFAULT_DEEPLINK_BASE).trim();
}

function getSupportedHosts() {
  const extraHosts = String(process.env.ACCESSTRADE_CLOAK_HOSTS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set([...DEFAULT_SUPPORTED_HOSTS, ...extraHosts])];
}

function normalizeAbsoluteUrl(value) {
  if (!value) return '';

  try {
    const parsed = new URL(String(value).trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

function hostMatches(hostname, expectedHost) {
  return hostname === expectedHost || hostname.endsWith(`.${expectedHost}`);
}

function isOwnCloakedUrl(url, siteUrl = getSiteUrl()) {
  const normalized = normalizeAbsoluteUrl(url);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    const currentSite = new URL(siteUrl);
    return parsed.hostname === currentSite.hostname && parsed.pathname.startsWith('/go/');
  } catch {
    return false;
  }
}

function isAccessTradeDeepLink(url) {
  const normalized = normalizeAbsoluteUrl(url);
  if (!normalized) return false;

  try {
    return new URL(normalized).hostname === 'go.isclix.com';
  } catch {
    return false;
  }
}

export function shouldCloakUrl(url, { siteUrl = getSiteUrl() } = {}) {
  const normalized = normalizeAbsoluteUrl(url);
  if (!normalized) return false;
  if (isOwnCloakedUrl(normalized, siteUrl)) return false;

  try {
    const parsed = new URL(normalized);
    const siteHost = new URL(siteUrl).hostname;
    if (parsed.hostname === siteHost) return false;

    return getSupportedHosts().some((host) => hostMatches(parsed.hostname, host));
  } catch {
    return false;
  }
}

function createCloakedSlug(url) {
  const normalized = normalizeAbsoluteUrl(url);
  if (!normalized) return '';

  const parsed = new URL(normalized);
  const hostLabel = parsed.hostname
    .replace(/^www\./, '')
    .split('.')
    .slice(0, 2)
    .join('-')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const hash = crypto.createHash('sha1').update(normalized).digest('hex').slice(0, 12);

  return `${hostLabel || 'link'}-${hash}`;
}

function buildSettingKey(slug) {
  return `cloaked_link:${slug}`;
}

export function buildAccessTradeDeepLink(originalUrl, baseDeepLink = getDeepLinkBase()) {
  const normalized = normalizeAbsoluteUrl(originalUrl);
  if (!normalized) return originalUrl || '';

  if (isAccessTradeDeepLink(normalized)) {
    return normalized;
  }

  const separator = baseDeepLink.includes('?') ? '&' : '?';
  return `${baseDeepLink}${separator}url=${encodeURIComponent(normalized)}`;
}

export async function createDeepLink(originalUrl) {
  return buildAccessTradeDeepLink(originalUrl);
}

export async function ensureCloakedLink(inputUrl, { siteUrl = getSiteUrl() } = {}) {
  const normalized = normalizeAbsoluteUrl(inputUrl);
  if (!normalized) {
    return {
      slug: '',
      originalUrl: inputUrl || '',
      deepLink: inputUrl || '',
      cloakedUrl: inputUrl || '',
      wasCloaked: false,
    };
  }

  if (isOwnCloakedUrl(normalized, siteUrl)) {
    const parsed = new URL(normalized);
    return {
      slug: parsed.pathname.replace(/^\/go\//, ''),
      originalUrl: normalized,
      deepLink: normalized,
      cloakedUrl: normalized,
      wasCloaked: false,
    };
  }

  if (!shouldCloakUrl(normalized, { siteUrl }) && !isAccessTradeDeepLink(normalized)) {
    return {
      slug: '',
      originalUrl: normalized,
      deepLink: normalized,
      cloakedUrl: normalized,
      wasCloaked: false,
    };
  }

  const deepLink = buildAccessTradeDeepLink(normalized);
  const slug = createCloakedSlug(normalized);
  const cloakedUrl = `${siteUrl}/go/${slug}`;
  const prisma = getPrisma();

  await prisma.siteSetting.upsert({
    where: { key: buildSettingKey(slug) },
    update: {
      value: {
        slug,
        originalUrl: normalized,
        deepLink,
        cloakedUrl,
        updatedAt: new Date().toISOString(),
      },
    },
    create: {
      key: buildSettingKey(slug),
      value: {
        slug,
        originalUrl: normalized,
        deepLink,
        cloakedUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });

  return {
    slug,
    originalUrl: normalized,
    deepLink,
    cloakedUrl,
    wasCloaked: cloakedUrl !== normalized,
  };
}

export async function findCloakedLinkBySlug(slug) {
  if (!slug) return null;

  const prisma = getPrisma();
  const record = await prisma.siteSetting.findUnique({
    where: { key: buildSettingKey(slug) },
  });

  const value = record?.value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return {
    slug,
    originalUrl: typeof value.originalUrl === 'string' ? value.originalUrl : '',
    deepLink: typeof value.deepLink === 'string' ? value.deepLink : '',
    cloakedUrl: typeof value.cloakedUrl === 'string' ? value.cloakedUrl : '',
  };
}

async function replaceMarkdownLinkTargets(content, pattern, transformTarget) {
  const matches = [...String(content || '').matchAll(pattern)];
  if (matches.length === 0) {
    return String(content || '');
  }

  let output = String(content || '');

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index];
    const targetUrl = match[1];
    const replacementUrl = await transformTarget(targetUrl);
    if (!replacementUrl || replacementUrl === targetUrl) {
      continue;
    }

    const fullMatch = match[0];
    const replacement = fullMatch.replace(targetUrl, replacementUrl);
    output = `${output.slice(0, match.index)}${replacement}${output.slice(match.index + fullMatch.length)}`;
  }

  return output;
}

export async function cloakMarkdownAffiliateLinks(content, options = {}) {
  if (!content) return content;

  const cache = new Map();
  const resolveTarget = async (url) => {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const result = await ensureCloakedLink(url, options);
    cache.set(url, result.cloakedUrl || url);
    return cache.get(url);
  };

  let nextContent = String(content);
  nextContent = await replaceMarkdownLinkTargets(
    nextContent,
    /\[\!\[[^\]]*?\]\([^)]+\)\]\((https?:\/\/[^\s)]+)\)/g,
    resolveTarget,
  );
  nextContent = await replaceMarkdownLinkTargets(
    nextContent,
    /(?<!!)\[[^\]]*?\]\((https?:\/\/[^\s)]+)\)/g,
    resolveTarget,
  );

  return nextContent;
}

export async function cloakAffiliateFields(resource, input, options = {}) {
  if (!input || typeof input !== 'object') {
    return input;
  }

  const payload = { ...input };

  if (resource === 'blog-posts') {
    if (payload.cover_target_url) {
      const result = await ensureCloakedLink(payload.cover_target_url, options);
      payload.cover_target_url = result.cloakedUrl;
    }
    if (payload.content) {
      payload.content = await cloakMarkdownAffiliateLinks(payload.content, options);
    }
  }

  if (resource === 'interest-posts') {
    if (payload.target_url) {
      const result = await ensureCloakedLink(payload.target_url, options);
      payload.target_url = result.cloakedUrl;
    }
    if (payload.content) {
      payload.content = await cloakMarkdownAffiliateLinks(payload.content, options);
    }
  }

  return payload;
}
