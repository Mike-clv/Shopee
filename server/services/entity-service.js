import { getPrisma } from './prisma.js';
import { mockData } from './mock-data.js';

const commonFields = ['id', 'created_date', 'updated_date'];

export const resources = {
  vouchers: {
    model: 'voucher',
    fallback: mockData.vouchers,
    fields: [
      ...commonFields,
      'title', 'slug', 'code', 'description', 'terms', 'discount_type', 'discount_value',
      'min_order_value', 'max_discount', 'start_date', 'end_date', 'status', 'voucher_type',
      'platform', 'brand_id', 'brand_name', 'brand_logo', 'category_id', 'category_name',
      'original_url', 'tracking_url', 'image', 'is_hot', 'is_verified', 'is_exclusive',
      'is_featured', 'click_count', 'copy_count', 'sort_order', 'accesstrade_id', 'last_synced_at',
    ],
    boolFields: ['is_hot', 'is_verified', 'is_exclusive', 'is_featured'],
    intFields: ['click_count', 'copy_count', 'sort_order'],
    dateFields: ['start_date', 'end_date', 'last_synced_at', 'created_date', 'updated_date'],
  },
  brands: {
    model: 'brand',
    fallback: mockData.brands,
    fields: [
      ...commonFields,
      'name', 'slug', 'logo', 'banner', 'platform', 'description', 'website_url',
      'accesstrade_campaign_id', 'seo_title', 'seo_description', 'is_featured',
      'is_active', 'voucher_count', 'click_count', 'sort_order',
    ],
    boolFields: ['is_featured', 'is_active'],
    intFields: ['voucher_count', 'click_count', 'sort_order'],
    dateFields: ['created_date', 'updated_date'],
  },
  categories: {
    model: 'category',
    fallback: mockData.categories,
    fields: [
      ...commonFields,
      'name', 'slug', 'icon', 'description', 'seo_title', 'seo_description',
      'banner', 'is_active', 'sort_order', 'voucher_count',
    ],
    boolFields: ['is_active'],
    intFields: ['sort_order', 'voucher_count'],
    dateFields: ['created_date', 'updated_date'],
  },
  'blog-posts': {
    model: 'blogPost',
    fallback: mockData.blogPosts,
    fields: [
      ...commonFields,
      'title', 'slug', 'excerpt', 'content', 'cover_image', 'cover_target_url', 'category',
      'seo_title', 'seo_description', 'status', 'sort_order', 'published_at', 'view_count',
    ],
    intFields: ['sort_order', 'view_count'],
    dateFields: ['published_at', 'created_date', 'updated_date'],
  },
  'interest-posts': {
    model: 'interestPost',
    fallback: mockData.interestPosts || [],
    fields: [
      ...commonFields,
      'title', 'slug', 'excerpt', 'content', 'thumbnail_image', 'target_url',
      'status', 'sort_order', 'published_at', 'view_count',
    ],
    intFields: ['sort_order', 'view_count'],
    dateFields: ['published_at', 'created_date', 'updated_date'],
  },
  'click-events': {
    model: 'clickEvent',
    fallback: mockData.clickEvents,
    fields: ['id', 'voucher_id', 'brand_id', 'event_type', 'source_page', 'voucher_title', 'brand_name', 'created_date'],
    dateFields: ['created_date'],
  },
  'copy-events': {
    model: 'copyEvent',
    fallback: mockData.copyEvents,
    fields: ['id', 'voucher_id', 'brand_id', 'source_page', 'voucher_title', 'brand_name', 'created_date'],
    dateFields: ['created_date'],
  },
  'sync-logs': {
    model: 'syncLog',
    fallback: mockData.syncLogs,
    fields: [
      ...commonFields,
      'sync_type', 'status', 'message', 'items_synced', 'error_detail', 'started_at', 'finished_at',
    ],
    intFields: ['items_synced'],
    dateFields: ['started_at', 'finished_at', 'created_date', 'updated_date'],
  },
  banners: {
    model: 'banner',
    fallback: mockData.banners || [],
    fields: [
      ...commonFields,
      'title', 'image_url', 'target_url', 'placement', 'is_active', 'sort_order',
    ],
    boolFields: ['is_active'],
    intFields: ['sort_order'],
    dateFields: ['created_date', 'updated_date'],
  },
};

function getConfig(resource) {
  const config = resources[resource];
  if (!config) {
    const error = new Error(`Unknown resource: ${resource}`);
    error.status = 404;
    throw error;
  }
  return config;
}

function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  return value;
}

function sanitizeInput(config, input, { includeId = false } = {}) {
  const output = {};
  const boolFields = new Set(config.boolFields || []);
  const intFields = new Set(config.intFields || []);
  const dateFields = new Set(config.dateFields || []);

  for (const field of config.fields) {
    if (!includeId && ['id', 'created_date', 'updated_date'].includes(field)) continue;
    if (!(field in input)) continue;

    const raw = input[field];
    if (raw === undefined) continue;
    if (dateFields.has(field)) {
      output[field] = raw ? new Date(raw) : null;
    } else if (intFields.has(field)) {
      output[field] = Number.parseInt(raw, 10) || 0;
    } else if (boolFields.has(field)) {
      output[field] = Boolean(raw);
    } else {
      output[field] = raw;
    }
  }

  return output;
}

function parseWhere(config, filters) {
  const where = {};
  const fieldSet = new Set(config.fields);
  for (const [key, rawValue] of Object.entries(filters)) {
    if (['sort', 'limit'].includes(key) || !fieldSet.has(key)) continue;
    where[key] = parseValue(rawValue);
  }
  return where;
}

function parseOrderBy(sort, config) {
  if (!sort) return undefined;
  const direction = sort.startsWith('-') ? 'desc' : 'asc';
  const field = sort.replace(/^-/, '');
  if (!config.fields.includes(field)) return undefined;
  return { [field]: direction };
}

function fallbackList(config, filters, sort, limit) {
  const where = parseWhere(config, filters);
  let rows = [...config.fallback];

  rows = rows.filter((row) =>
    Object.entries(where).every(([key, value]) => row[key] === value)
  );

  const orderBy = parseOrderBy(sort, config);
  if (orderBy) {
    const [[field, direction]] = Object.entries(orderBy);
    rows.sort((a, b) => {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return rows.slice(0, Number.parseInt(limit, 10) || rows.length);
}

export async function listResource(resource, filters = {}, sort, limit) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  const model = prisma[config.model];
  const where = parseWhere(config, filters);
  const orderBy = parseOrderBy(sort, config);
  const take = Number.parseInt(limit, 10) || undefined;

  try {
    const total = await model.count();
    const rows = await model.findMany({
      where,
      ...(orderBy ? { orderBy } : {}),
      ...(take ? { take } : {}),
    });

    if (rows.length || total > 0) return rows;
  } catch (error) {
    console.warn(`[${resource}] database read failed, using fallback:`, error.message);
  }

  return fallbackList(config, filters, sort, limit);
}

export async function createResource(resource, input) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  const data = sanitizeInput(config, input, { includeId: true });
  return prisma[config.model].create({ data });
}

export async function updateResource(resource, id, input) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  const data = sanitizeInput(config, input);
  return prisma[config.model].update({ where: { id }, data });
}

export async function deleteResource(resource, id) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  await prisma[config.model].delete({ where: { id } });
  return { id };
}

export async function trackEvent(input) {
  const eventType = input.event_type === 'copy' ? 'copy' : 'click';
  const prisma = getPrisma();
  const voucher = await prisma.voucher.findUnique({
    where: { id: input.voucher_id },
    select: {
      id: true,
      title: true,
      brand_id: true,
      brand_name: true,
      status: true,
    },
  });

  if (!voucher || voucher.status !== 'active') {
    const error = new Error('Voucher không tồn tại hoặc không còn hoạt động.');
    error.status = 404;
    throw error;
  }

  const eventPayload = {
    voucher_id: voucher.id,
    brand_id: voucher.brand_id || undefined,
    event_type: eventType,
    source_page: input.source_page,
    voucher_title: voucher.title,
    brand_name: voucher.brand_name || undefined,
  };

  const event = await createResource('click-events', {
    ...eventPayload,
  });

  if (eventType === 'copy') {
    await prisma.copyEvent.create({
      data: sanitizeInput(resources['copy-events'], eventPayload),
    }).catch(() => {});
  }

  if (voucher.id) {
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        ...(eventType === 'copy' ? { copy_count: { increment: 1 } } : { click_count: { increment: 1 } }),
      },
    }).catch(() => {});
  }

  if (voucher.brand_id && eventType === 'click') {
    await prisma.brand.update({
      where: { id: voucher.brand_id },
      data: { click_count: { increment: 1 } },
    }).catch(() => {});
  }

  return event;
}
