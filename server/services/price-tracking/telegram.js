function hasTelegramConfig() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

function buildTelegramEndpoint() {
  return `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
}

export function shouldSendPriceTrackingAlert(consecutiveErrorCount) {
  const count = Number(consecutiveErrorCount);
  return Number.isFinite(count) && count >= 3 && count % 3 === 0;
}

export async function sendPriceTrackingTelegramAlert({
  product,
  errorMessage,
  consecutiveErrorCount,
}) {
  if (!hasTelegramConfig()) {
    return { sent: false, skipped: true, reason: 'telegram_not_configured' };
  }

  const text = [
    'Canh bao theo doi gia',
    `San pham: ${product?.name || 'Khong ro'}`,
    `Slug: ${product?.slug || 'Khong ro'}`,
    `Platform: ${product?.platform || 'Khong ro'}`,
    `So lan loi lien tiep: ${consecutiveErrorCount}`,
    `URL: ${product?.product_url || ''}`,
    `Loi: ${String(errorMessage || '').slice(0, 800)}`,
  ].join('\n');

  const response = await fetch(buildTelegramEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const error = new Error(`Khong gui duoc canh bao Telegram: ${response.status} ${errorText}`.trim());
    error.status = 502;
    throw error;
  }

  return { sent: true };
}
