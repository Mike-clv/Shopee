import 'dotenv/config';
import cron from 'node-cron';
import { runPriceTrackingBatch } from '../server/services/price-tracking/service.js';

const schedule = '0 2 * * *';
const isEnabled = String(process.env.PRICE_TRACKING_CRON_ENABLED || 'false').toLowerCase() === 'true';

if (!isEnabled) {
  console.log('[price-tracker-cron] PRICE_TRACKING_CRON_ENABLED=false, khong khoi dong local scheduler.');
  process.exit(0);
}

console.log(`[price-tracker-cron] Local scheduler dang chay voi lich ${schedule}.`);

cron.schedule(schedule, async () => {
  console.log('[price-tracker-cron] Bat dau lay gia dinh ky...');
  try {
    const result = await runPriceTrackingBatch();
    console.log('[price-tracker-cron] Hoan tat:', JSON.stringify(result));
  } catch (error) {
    console.error('[price-tracker-cron] Loi khi lay gia:', error);
  }
});
