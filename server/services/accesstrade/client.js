export function getAccessTradeConfig() {
  return {
    apiBaseUrl: (process.env.ACCESSTRADE_API_BASE_URL || 'https://api.accesstrade.vn/v1').replace(/\/$/, ''),
    apiKey: process.env.ACCESSTRADE_API_KEY || '',
    publisherId: process.env.ACCESSTRADE_PUBLISHER_ID || '',
    authScheme: process.env.ACCESSTRADE_AUTH_SCHEME || 'Token',
    syncEnabled: process.env.ACCESSTRADE_SYNC_ENABLED === 'true',
  };
}

export function isAccessTradeConfigured() {
  const config = getAccessTradeConfig();
  return Boolean(config.apiKey && config.syncEnabled);
}

export async function accessTradeFetch(path, options = {}) {
  const config = getAccessTradeConfig();
  if (!isAccessTradeConfigured()) {
    throw new Error('AccessTrade chưa được cấu hình API key hoặc ACCESSTRADE_SYNC_ENABLED=false.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 30000);

  let response;
  try {
    response = await fetch(`${config.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        ...(options.headers || {}),
        Authorization: `${config.authScheme} ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const detail = typeof body === 'string' ? body : JSON.stringify(body);
    throw new Error(`AccessTrade API lỗi ${response.status}: ${detail.slice(0, 500)}`);
  }

  return body;
}
