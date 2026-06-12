import { getPrisma } from '../prisma.js';
import { getPriceTrackingTimeoutMs, launchPriceTrackingBrowser } from './browser.js';
import { extractPriceFromPage } from './scraper.js';
import { sendPriceTrackingTelegramAlert, shouldSendPriceTrackingAlert } from './telegram.js';

const MIN_BATCH_SIZE = 1;
const MAX_BATCH_SIZE = 5;

function clampBatchSize(value) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed)) return 3;
  return Math.max(MIN_BATCH_SIZE, Math.min(parsed, MAX_BATCH_SIZE));
}

function getBatchSize(limit) {
  if (limit !== undefined) {
    return clampBatchSize(limit);
  }
  return clampBatchSize(process.env.PRICE_TRACKING_BATCH_SIZE || '3');
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeHistoryDays(days) {
  const parsed = Number.parseInt(days || '30', 10);
  if (!Number.isFinite(parsed)) return 30;
  return Math.max(1, Math.min(parsed, 365));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelayMs() {
  return 2000 + Math.floor(Math.random() * 3000);
}

function shouldAttemptAlert(consecutiveErrorCount) {
  return shouldSendPriceTrackingAlert(consecutiveErrorCount);
}

async function findTrackedProductByIdentifier(identifier, { activeOnly = false } = {}) {
  const prisma = getPrisma();
  const baseWhere = activeOnly ? { is_active: true } : {};

  const byId = await prisma.trackedProduct.findUnique({
    where: { id: identifier },
  });
  if (byId && (!activeOnly || byId.is_active)) {
    return byId;
  }

  const bySlug = await prisma.trackedProduct.findUnique({
    where: { slug: identifier },
  });
  if (bySlug && (!activeOnly || bySlug.is_active)) {
    return bySlug;
  }

  const byName = await prisma.trackedProduct.findFirst({
    where: {
      ...baseWhere,
      name: identifier,
    },
  });

  return byName || null;
}

async function getDueTrackedProducts(limit) {
  const prisma = getPrisma();
  const neverChecked = await prisma.trackedProduct.findMany({
    where: {
      is_active: true,
      last_checked_at: null,
    },
    orderBy: [
      { sort_order: 'asc' },
      { created_date: 'asc' },
    ],
    take: limit,
  });

  if (neverChecked.length >= limit) {
    return neverChecked;
  }

  const remaining = limit - neverChecked.length;
  const previouslyChecked = await prisma.trackedProduct.findMany({
    where: {
      is_active: true,
      last_checked_at: {
        not: null,
      },
    },
    orderBy: [
      { last_checked_at: 'asc' },
      { sort_order: 'asc' },
      { created_date: 'asc' },
    ],
    take: remaining,
  });

  return [...neverChecked, ...previouslyChecked];
}

async function openTrackingPage(browser, product) {
  const timeout = getPriceTrackingTimeoutMs();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(timeout);
  page.setDefaultTimeout(timeout);
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  );
  await page.goto(product.product_url, {
    waitUntil: 'domcontentloaded',
    timeout,
  });
  await page.waitForSelector('body', { timeout: Math.min(timeout, 5000) }).catch(() => {});
  return page;
}

function buildTrackingErrorMessage(error) {
  return String(error?.message || 'Khong the lay du lieu gia').trim().slice(0, 1000);
}

export async function processTrackedProduct(product, { browser } = {}) {
  const prisma = getPrisma();
  const ownedBrowser = browser || await launchPriceTrackingBrowser();
  let page;

  try {
    page = await openTrackingPage(ownedBrowser, product);
    const result = await extractPriceFromPage(page, {
      priceSelector: product.price_selector || '',
    });

    if (!result || result.price === null || result.price === undefined) {
      const lastError = 'Khong tim thay gia tu JSON-LD hoac selector du phong.';
      const updated = await prisma.trackedProduct.update({
        where: { id: product.id },
        data: {
          last_checked_at: new Date(),
          last_error: lastError,
          consecutive_error_count: {
            increment: 1,
          },
        },
      });

      return {
        ok: false,
        product: updated,
        error: lastError,
        consecutiveErrorCount: updated.consecutive_error_count || 0,
      };
    }

    const now = new Date();
    const currentPrice = toNumber(result.price);
    const currentPriceText = String(result.priceText || result.price || '').trim();

    const [updatedProduct] = await prisma.$transaction([
      prisma.trackedProduct.update({
        where: { id: product.id },
        data: {
          current_price: currentPrice,
          current_price_text: currentPriceText,
          last_checked_at: now,
          last_error: null,
          consecutive_error_count: 0,
        },
      }),
      prisma.priceHistory.create({
        data: {
          tracked_product_id: product.id,
          price: currentPrice,
          price_text: currentPriceText,
          source: result.source || 'jsonld',
          source_url: product.product_url,
          captured_at: now,
        },
      }),
    ]);

    return {
      ok: true,
      product: updatedProduct,
      source: result.source || 'jsonld',
      price: currentPrice,
      priceText: currentPriceText,
      consecutiveErrorCount: 0,
    };
  } catch (error) {
    const lastError = buildTrackingErrorMessage(error);
    const updated = await prisma.trackedProduct.update({
      where: { id: product.id },
      data: {
        last_checked_at: new Date(),
        last_error: lastError,
        consecutive_error_count: {
          increment: 1,
        },
      },
    }).catch(() => product);

    return {
      ok: false,
      product: updated,
      error: lastError,
      consecutiveErrorCount: updated?.consecutive_error_count || (Number(product?.consecutive_error_count) || 0) + 1,
    };
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
    if (!browser) {
      await ownedBrowser.close().catch(() => {});
    }
  }
}

export async function runTrackedProductNow(identifier) {
  const product = await findTrackedProductByIdentifier(identifier);
  if (!product) {
    const error = new Error('Khong tim thay san pham dang theo doi.');
    error.status = 404;
    throw error;
  }

  return processTrackedProduct(product);
}

export async function runPriceTrackingBatch({ limit } = {}) {
  const startedAt = new Date();
  const batchSize = getBatchSize(limit);
  const products = await getDueTrackedProducts(batchSize);

  if (products.length === 0) {
    return {
      ok: true,
      processed: 0,
      successCount: 0,
      errorCount: 0,
      batchSize,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      items: [],
    };
  }

  const browser = await launchPriceTrackingBrowser();
  const items = [];
  let successCount = 0;
  let errorCount = 0;
  let alertsSent = 0;

  try {
    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];
      const result = await processTrackedProduct(product, { browser });
      items.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        ok: result.ok,
        price: result.price ?? null,
        priceText: result.priceText || '',
        source: result.source || '',
        error: result.error || '',
        consecutiveErrorCount: result.consecutiveErrorCount || 0,
      });

      if (result.ok) {
        successCount += 1;
      } else {
        errorCount += 1;

        if (shouldAttemptAlert(result.consecutiveErrorCount)) {
          try {
            const alertResult = await sendPriceTrackingTelegramAlert({
              product: result.product || product,
              errorMessage: result.error || 'Khong the lay gia san pham',
              consecutiveErrorCount: result.consecutiveErrorCount,
            });
            if (alertResult?.sent) {
              alertsSent += 1;
            }
          } catch (alertError) {
            console.warn('[price-tracking] telegram alert failed:', alertError.message);
          }
        }
      }

      if (index < products.length - 1) {
        await sleep(randomDelayMs());
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  return {
    ok: true,
    processed: products.length,
    successCount,
    errorCount,
    alertsSent,
    batchSize,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    items,
  };
}

export async function cleanupOldPriceHistoryRecords({ olderThanDays = 90 } = {}) {
  const prisma = getPrisma();
  const safeDays = Math.max(1, Number.parseInt(olderThanDays || '90', 10) || 90);
  const thresholdDate = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);
  const result = await prisma.priceHistory.deleteMany({
    where: {
      captured_at: {
        lt: thresholdDate,
      },
    },
  });

  return {
    olderThanDays: safeDays,
    deletedCount: result.count || 0,
    thresholdDate: thresholdDate.toISOString(),
  };
}

export async function getTrackedProductPriceHistory(identifier, { days = 30 } = {}) {
  const prisma = getPrisma();
  const product = await findTrackedProductByIdentifier(identifier, { activeOnly: false });
  if (!product) {
    const error = new Error('Khong tim thay san pham dang theo doi.');
    error.status = 404;
    throw error;
  }

  const normalizedDays = normalizeHistoryDays(days);
  const sinceDate = new Date(Date.now() - normalizedDays * 24 * 60 * 60 * 1000);
  const histories = await prisma.priceHistory.findMany({
    where: {
      tracked_product_id: product.id,
      captured_at: {
        gte: sinceDate,
      },
    },
    orderBy: {
      captured_at: 'asc',
    },
    take: 500,
  });

  return {
    product,
    days: normalizedDays,
    history: histories.map((entry) => ({
      id: entry.id,
      price: toNumber(entry.price),
      price_text: entry.price_text || '',
      captured_at: entry.captured_at,
      source: entry.source || 'jsonld',
      source_url: entry.source_url || '',
    })),
  };
}
