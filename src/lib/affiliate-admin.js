import { localClient } from '@/api/localClient';

function isCloakedLink(value) {
  return /^https?:\/\/[^/]+\/go\/[a-z0-9-]+$/i.test(String(value || '').trim());
}

export async function convertAffiliateFieldValue(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed || isCloakedLink(trimmed)) {
    return {
      originalUrl: trimmed,
      cloakedUrl: trimmed,
      deepLink: trimmed,
      slug: '',
      wasCloaked: false,
    };
  }

  return localClient.affiliate.cloak(trimmed);
}
