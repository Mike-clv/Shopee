import { getPrisma } from './prisma.js';
import { mockData } from './mock-data.js';
import { cloakAffiliateFields } from './accesstrade/deeplink.js';

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
  'tracked-products': {
    model: 'trackedProduct',
    fallback: mockData.trackedProducts || [],
    fields: [
      ...commonFields,
      'name', 'slug', 'platform', 'product_url', 'price_selector', 'currency',
      'current_price', 'current_price_text', 'last_checked_at', 'last_error', 'consecutive_error_count',
      'is_active', 'sort_order',
    ],
    boolFields: ['is_active'],
    intFields: ['sort_order', 'consecutive_error_count'],
    dateFields: ['last_checked_at', 'created_date', 'updated_date'],
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

async function syncVoucherCounts(prisma) {
  const [brandCounts, categoryCounts] = await Promise.all([
    prisma.voucher.groupBy({
      by: ['brand_id'],
      where: { status: 'active', brand_id: { not: null } },
      _count: { _all: true },
    }),
    prisma.voucher.groupBy({
      by: ['category_id'],
      where: { status: 'active', category_id: { not: null } },
      _count: { _all: true },
    }),
  ]);

  await Promise.all([
    prisma.brand.updateMany({ data: { voucher_count: 0 } }),
    prisma.category.updateMany({ data: { voucher_count: 0 } }),
  ]);

  for (const item of brandCounts) {
    await prisma.brand.update({
      where: { id: item.brand_id },
      data: { voucher_count: item._count._all },
    }).catch(() => {});
  }

  for (const item of categoryCounts) {
    await prisma.category.update({
      where: { id: item.category_id },
      data: { voucher_count: item._count._all },
    }).catch(() => {});
  }
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

/**
 * Paginated version of listResource - returns { data, total, page, limit }
 */
export async function listResourcePaginated(resource, filters = {}, sort, limit, page = 1) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  const model = prisma[config.model];
  const where = parseWhere(config, filters);
  const orderBy = parseOrderBy(sort, config);
  const take = Math.max(1, Number.parseInt(limit, 10) || 50);
  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
  const skip = (pageNum - 1) * take;

  try {
    const total = await model.count({ where });
    const rows = await model.findMany({
      where,
      ...(orderBy ? { orderBy } : {}),
      take,
      skip,
    });

    return { data: rows, total, page: pageNum, limit: take };
  } catch (error) {
    console.warn(`[${resource}] database read failed, using fallback:`, error.message);
  }

  const allRows = fallbackList(config, filters, sort, undefined);
  const paginatedRows = allRows.slice(skip, skip + take);
  return { data: paginatedRows, total: allRows.length, page: pageNum, limit: take };
}

export async function createResource(resource, input) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  const transformedInput = await cloakAffiliateFields(resource, input);
  const data = sanitizeInput(config, transformedInput, { includeId: true });
  const created = await prisma[config.model].create({ data });
  if (resource === 'vouchers') {
    await syncVoucherCounts(prisma);
  }
  return created;
}

export async function updateResource(resource, id, input) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  const transformedInput = await cloakAffiliateFields(resource, input);
  const data = sanitizeInput(config, transformedInput);
  const updated = await prisma[config.model].update({ where: { id }, data });
  if (resource === 'vouchers') {
    await syncVoucherCounts(prisma);
  }
  return updated;
}

export async function deleteResource(resource, id) {
  const config = getConfig(resource);
  const prisma = getPrisma();
  await prisma[config.model].delete({ where: { id } });
  if (resource === 'vouchers') {
    await syncVoucherCounts(prisma);
  }
  return { id };
}

export async function bulkUpdateVoucherStatus(filters = {}, status) {
  const prisma = getPrisma();
  const allowedStatuses = new Set(['active', 'expiring_soon', 'expired', 'draft']);
  const nextStatus = String(status || '').trim();

  if (!allowedStatuses.has(nextStatus)) {
    const error = new Error('Trạng thái voucher không hợp lệ.');
    error.status = 400;
    throw error;
  }

  const where = {};
  if (filters.platform) where.platform = String(filters.platform).trim();
  if (filters.brand_id) where.brand_id = String(filters.brand_id).trim();
  if (filters.status) where.status = String(filters.status).trim();

  const result = await prisma.voucher.updateMany({
    where,
    data: { status: nextStatus },
  });

  await syncVoucherCounts(prisma);

  return {
    updatedCount: result.count,
    status: nextStatus,
    filters: where,
  };
}

export async function bulkUpdateVouchersByIds(ids = [], input = {}) {
  const prisma = getPrisma();
  const normalizedIds = Array.from(new Set((Array.isArray(ids) ? ids : []).map((id) => String(id || '').trim()).filter(Boolean)));
  if (normalizedIds.length === 0) {
    const error = new Error('Vui lòng chọn ít nhất một voucher.');
    error.status = 400;
    throw error;
  }

  const allowedStatuses = new Set(['active', 'expiring_soon', 'expired', 'draft']);
  const data = {};

  if (input.status !== undefined) {
    const nextStatus = String(input.status || '').trim();
    if (!allowedStatuses.has(nextStatus)) {
      const error = new Error('Trạng thái voucher không hợp lệ.');
      error.status = 400;
      throw error;
    }
    data.status = nextStatus;
  }

  for (const key of ['is_hot', 'is_verified', 'is_exclusive', 'is_featured']) {
    if (input[key] !== undefined) {
      data[key] = Boolean(input[key]);
    }
  }

  if (Object.keys(data).length === 0) {
    const error = new Error('Không có thay đổi nào để cập nhật.');
    error.status = 400;
    throw error;
  }

  const result = await prisma.voucher.updateMany({
    where: { id: { in: normalizedIds } },
    data,
  });

  await syncVoucherCounts(prisma);

  return {
    updatedCount: result.count,
    ids: normalizedIds,
    data,
  };
}

export async function bulkDeleteVouchersByIds(ids = []) {
  const prisma = getPrisma();
  const normalizedIds = Array.from(new Set((Array.isArray(ids) ? ids : []).map((id) => String(id || '').trim()).filter(Boolean)));
  if (normalizedIds.length === 0) {
    const error = new Error('Vui lòng chọn ít nhất một voucher.');
    error.status = 400;
    throw error;
  }

  const result = await prisma.voucher.deleteMany({
    where: { id: { in: normalizedIds } },
  });

  await syncVoucherCounts(prisma);

  return {
    deletedCount: result.count,
    ids: normalizedIds,
  };
}

export async function bulkUpdateInterestPostStatus(filters = {}, status) {
  const prisma = getPrisma();
  const allowedStatuses = new Set(['draft', 'published', 'scheduled']);
  const nextStatus = String(status || '').trim();

  if (!allowedStatuses.has(nextStatus)) {
    const error = new Error('Trạng thái bài viết không hợp lệ.');
    error.status = 400;
    throw error;
  }

  const where = {};
  if (filters.status) where.status = String(filters.status).trim();

  const result = await prisma.interestPost.updateMany({
    where,
    data: { status: nextStatus },
  });

  return {
    updatedCount: result.count,
    status: nextStatus,
    filters: where,
  };
}

export async function bulkUpdateInterestPostsByIds(ids = [], input = {}) {
  const prisma = getPrisma();
  const normalizedIds = Array.from(new Set((Array.isArray(ids) ? ids : []).map((id) => String(id || '').trim()).filter(Boolean)));
  if (normalizedIds.length === 0) {
    const error = new Error('Vui lòng chọn ít nhất một bài viết.');
    error.status = 400;
    throw error;
  }

  const allowedStatuses = new Set(['draft', 'published', 'scheduled']);
  const data = {};

  if (input.status !== undefined) {
    const nextStatus = String(input.status || '').trim();
    if (!allowedStatuses.has(nextStatus)) {
      const error = new Error('Trạng thái bài viết không hợp lệ.');
      error.status = 400;
      throw error;
    }
    data.status = nextStatus;
  }

  if (Object.keys(data).length === 0) {
    const error = new Error('Không có thay đổi nào để cập nhật.');
    error.status = 400;
    throw error;
  }

  const result = await prisma.interestPost.updateMany({
    where: { id: { in: normalizedIds } },
    data,
  });

  return {
    updatedCount: result.count,
    ids: normalizedIds,
    data,
  };
}

export async function bulkDeleteInterestPostsByIds(ids = []) {
  const prisma = getPrisma();
  const normalizedIds = Array.from(new Set((Array.isArray(ids) ? ids : []).map((id) => String(id || '').trim()).filter(Boolean)));
  if (normalizedIds.length === 0) {
    const error = new Error('Vui lòng chọn ít nhất một bài viết.');
    error.status = 400;
    throw error;
  }

  const result = await prisma.interestPost.deleteMany({
    where: { id: { in: normalizedIds } },
  });

  return {
    deletedCount: result.count,
    ids: normalizedIds,
  };
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
