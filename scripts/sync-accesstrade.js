import 'dotenv/config';
import { syncAccessTrade } from '../server/services/accesstrade/sync.js';
import { getPrisma } from '../server/services/prisma.js';

const syncType = process.argv[2] || 'all';
const result = await syncAccessTrade(syncType);

console.log(JSON.stringify({
  success: result.success,
  message: result.message,
  items_synced: result.items_synced,
  error: result.error,
}, null, 2));

await getPrisma().$disconnect();

if (!result.success) {
  process.exitCode = 1;
}
