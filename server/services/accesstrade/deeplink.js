import { isAccessTradeConfigured } from './client.js';

export async function createDeepLink(originalUrl) {
  if (!originalUrl || !isAccessTradeConfigured()) {
    return originalUrl || '#';
  }

  // TODO production: gọi API tạo deeplink của AccessTrade khi đã có API key thật.
  return originalUrl;
}
