const localBrandLogos = {
  concung: '/brand-logos/concung.svg',
  grab: '/brand-logos/grab.svg',
  lazada: '/brand-logos/lazada.svg',
  loreal: '/brand-logos/loreal.svg',
  nike: '/brand-logos/nike.svg',
  samsung: '/brand-logos/samsung.svg',
  shopee: '/brand-logos/shopee.svg',
  'the-coffee-house': '/brand-logos/the-coffee-house.svg',
  tiki: '/brand-logos/tiki.svg',
  'tiktok-shop': '/brand-logos/tiktok-shop.svg',
  unilever: '/brand-logos/unilever.svg',
};

const platformLogoByKey = {
  lazada: localBrandLogos.lazada,
  shopee: localBrandLogos.shopee,
  tiki: localBrandLogos.tiki,
  tiktok_shop: localBrandLogos['tiktok-shop'],
};

const aliasByName = {
  "l'oréal": 'loreal',
  'loreal': 'loreal',
  'the coffee house': 'the-coffee-house',
  'tiktok shop': 'tiktok-shop',
};

function normalizeToken(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function unique(values) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

export function sanitizeImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('/')) return url;

  try {
    return encodeURI(url);
  } catch {
    return url;
  }
}

export function getBrandSlugKey(brand = {}) {
  const slug = normalizeToken(brand.slug);
  if (slug) return slug;

  const byName = normalizeToken(brand.name || brand.brand_name);
  return aliasByName[byName] || byName;
}

export function getBrandWebsiteDomain(brand = {}) {
  const raw = brand.website_url || brand.websiteUrl || brand.original_url || brand.target_url;
  if (!raw) return '';

  try {
    return new URL(raw).hostname.replace(/^www\./, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export function getBrandLogoCandidates(brand = {}) {
  const slug = getBrandSlugKey(brand);
  const byName = aliasByName[normalizeToken(brand.name || brand.brand_name)];
  const platformLogo = platformLogoByKey[brand.platform];
  const domain = getBrandWebsiteDomain(brand);
  const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';

  return unique([
    localBrandLogos[slug],
    localBrandLogos[byName],
    sanitizeImageUrl(brand.logo || brand.brand_logo),
    platformLogo,
    favicon,
  ]);
}

export function getBrandInitial(brand = {}) {
  return (brand.name || brand.brand_name || brand.title || '?').trim().charAt(0).toUpperCase() || '?';
}
