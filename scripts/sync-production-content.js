import 'dotenv/config';

const LOCAL_API_URL = (process.env.LOCAL_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
const PRODUCTION_SITE_URL = (process.env.PRODUCTION_SITE_URL || process.env.SITE_URL || 'https://sansale247.io.vn').replace(/\/+$/, '');
const PRODUCTION_ADMIN_EMAIL = process.env.PRODUCTION_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const PRODUCTION_ADMIN_PASSWORD = process.env.PRODUCTION_ADMIN_PASSWORD;

if (!PRODUCTION_ADMIN_EMAIL || !PRODUCTION_ADMIN_PASSWORD) {
  throw new Error('Thiếu PRODUCTION_ADMIN_EMAIL hoặc PRODUCTION_ADMIN_PASSWORD để sync dữ liệu production.');
}

const cookieJar = new Map();

const resources = [
  {
    label: 'Category',
    path: 'categories',
    preserveSourceOrder: true,
    archiveExtra: (row) => (row.is_active ? { is_active: false } : null),
  },
  {
    label: 'Brand',
    path: 'brands',
    preserveSourceOrder: true,
    archiveExtra: (row) => ((row.is_active || row.is_featured)
      ? { is_active: false, is_featured: false, sort_order: 999 }
      : null),
  },
  {
    label: 'BlogPost',
    path: 'blog-posts',
    preserveSourceOrder: true,
    archiveExtra: (row) => (row.status === 'published' ? { status: 'draft' } : null),
  },
  {
    label: 'InterestPost',
    path: 'interest-posts',
    preserveSourceOrder: true,
    archiveExtra: (row) => (row.status === 'published' ? { status: 'draft' } : null),
  },
  {
    label: 'Banner',
    path: 'banners',
    preserveSourceOrder: true,
    archiveExtra: (row) => (row.is_active ? { is_active: false, sort_order: 999 } : null),
  },
];

function updateCookieJar(response) {
  const setCookies = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [];

  for (const rawCookie of setCookies) {
    const [pair] = rawCookie.split(';');
    const [name] = pair.split('=');
    if (name) {
      cookieJar.set(name.trim(), pair.trim());
    }
  }
}

function getCookieHeader() {
  return Array.from(cookieJar.values()).join('; ');
}

async function requestJson(baseUrl, path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.withOrigin) {
    headers.Origin = baseUrl;
    headers.Referer = `${baseUrl}/`;
  }

  const cookieHeader = getCookieHeader();
  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.json === undefined ? undefined : JSON.stringify(options.json),
    redirect: 'follow',
  });

  updateCookieJar(response);

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.message
      ? payload.message
      : String(payload);
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return payload;
}

async function loginProduction() {
  await requestJson(PRODUCTION_SITE_URL, '/api/auth/login', {
    method: 'POST',
    withOrigin: true,
    json: {
      email: PRODUCTION_ADMIN_EMAIL,
      password: PRODUCTION_ADMIN_PASSWORD,
    },
  });
}

function sanitizeRow(row) {
  const clone = { ...row };
  delete clone.created_date;
  delete clone.updated_date;
  delete clone.analytics_token;
  return clone;
}

async function syncResource(config) {
  const sourceRows = await requestJson(
    LOCAL_API_URL,
    `/api/${config.path}?sort=sort_order&limit=500`,
  );

  const targetRows = await requestJson(
    PRODUCTION_SITE_URL,
    `/api/${config.path}?sort=sort_order&limit=500`,
  );

  const sourceById = new Map(sourceRows.map((row) => [row.id, row]));
  const targetById = new Map(targetRows.map((row) => [row.id, row]));

  let created = 0;
  let updated = 0;
  let archived = 0;

  for (const [index, row] of sourceRows.entries()) {
    const payload = sanitizeRow(row);
    if (config.preserveSourceOrder) {
      payload.sort_order = index + 1;
    }
    if (targetById.has(row.id)) {
      await requestJson(PRODUCTION_SITE_URL, `/api/${config.path}/${encodeURIComponent(row.id)}`, {
        method: 'PUT',
        withOrigin: true,
        json: payload,
      });
      updated += 1;
    } else {
      await requestJson(PRODUCTION_SITE_URL, `/api/${config.path}`, {
        method: 'POST',
        withOrigin: true,
        json: payload,
      });
      created += 1;
    }
  }

  for (const row of targetRows) {
    if (sourceById.has(row.id)) continue;
    const archivePatch = config.archiveExtra(row);
    if (!archivePatch) continue;
    await requestJson(PRODUCTION_SITE_URL, `/api/${config.path}/${encodeURIComponent(row.id)}`, {
      method: 'PUT',
      withOrigin: true,
      json: archivePatch,
    });
    archived += 1;
  }

  return {
    label: config.label,
    source: sourceRows.length,
    target: targetRows.length,
    created,
    updated,
    archived,
  };
}

async function main() {
  console.log(`Dang dang nhap production: ${PRODUCTION_SITE_URL}`);
  await loginProduction();

  const results = [];
  for (const resource of resources) {
    console.log(`Sync ${resource.label}...`);
    results.push(await syncResource(resource));
  }

  console.table(results);
  console.log('Hoan tat dong bo local -> production.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
