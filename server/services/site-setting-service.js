import { getPrisma } from './prisma.js';

export const EXIT_INTENT_POPUP_KEY = 'exit_intent_popup';

const DEFAULT_EXIT_INTENT_POPUP = {
  enabled: false,
  title: 'Dung bo lo ma giam gia hot hom nay',
  description: 'Nhan nhanh ma giam gia va deal dang duoc ap dung tren web.',
  couponCode: '',
  buttonLabel: 'Xem ma giam gia',
  buttonUrl: '/tim-kiem?embed=1',
  imageUrl: '',
};

function sanitizeString(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

export function normalizeExitIntentPopupValue(input = {}) {
  return {
    enabled: Boolean(input.enabled),
    title: sanitizeString(input.title || DEFAULT_EXIT_INTENT_POPUP.title, 120),
    description: sanitizeString(input.description || DEFAULT_EXIT_INTENT_POPUP.description, 500),
    couponCode: sanitizeString(input.couponCode, 120),
    buttonLabel: sanitizeString(input.buttonLabel || DEFAULT_EXIT_INTENT_POPUP.buttonLabel, 60),
    buttonUrl: sanitizeString(input.buttonUrl || DEFAULT_EXIT_INTENT_POPUP.buttonUrl, 1000),
    imageUrl: sanitizeString(input.imageUrl, 1000),
  };
}

export async function getSiteSettingValue(key, fallbackValue) {
  const prisma = getPrisma();
  const record = await prisma.siteSetting.findUnique({
    where: { key },
  });

  if (!record) {
    return fallbackValue;
  }

  return record.value ?? fallbackValue;
}

export async function upsertSiteSettingValue(key, value) {
  const prisma = getPrisma();
  const now = new Date().toISOString();
  const normalizedValue = {
    ...(value && typeof value === 'object' && !Array.isArray(value) ? value : {}),
    updatedAt: now,
  };

  const record = await prisma.siteSetting.upsert({
    where: { key },
    update: {
      value: normalizedValue,
    },
    create: {
      key,
      value: {
        ...normalizedValue,
        createdAt: now,
      },
    },
  });

  return record.value;
}

export async function upsertSiteSettingRawValue(key, value) {
  const prisma = getPrisma();
  const record = await prisma.siteSetting.upsert({
    where: { key },
    update: {
      value,
    },
    create: {
      key,
      value,
    },
  });

  return record.value;
}

export async function deleteSiteSettingValue(key) {
  const prisma = getPrisma();

  try {
    await prisma.siteSetting.delete({
      where: { key },
    });
  } catch (error) {
    if (error?.code !== 'P2025') {
      throw error;
    }
  }
}

export async function getExitIntentPopupSetting() {
  const value = await getSiteSettingValue(EXIT_INTENT_POPUP_KEY, DEFAULT_EXIT_INTENT_POPUP);
  return normalizeExitIntentPopupValue(value);
}

export async function saveExitIntentPopupSetting(input) {
  const normalized = normalizeExitIntentPopupValue(input);
  await upsertSiteSettingValue(EXIT_INTENT_POPUP_KEY, normalized);
  return normalized;
}
