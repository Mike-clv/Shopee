import { Router } from 'express';
import {
  cleanupOldPriceHistoryRecords,
  getTrackedProductPriceHistory,
  runPriceTrackingBatch,
  runTrackedProductNow,
} from '../services/price-tracking/service.js';

export function createPriceTrackingRouter({
  adminMutationRateLimit,
  canRunCronWithoutSecret,
  getSessionUser,
  maybeRateLimitPublicRead,
  requireAdmin,
  requireSameOrigin,
}) {
  const router = Router();

  router.get('/api/tracked-products/:id/price-history', maybeRateLimitPublicRead, async (req, res, next) => {
    try {
      const response = await getTrackedProductPriceHistory(req.params.id, {
        days: req.query.days,
      });
      const user = getSessionUser(req);

      if (!response.product.is_active && user?.role !== 'admin') {
        res.status(404).json({ message: 'Khong tim thay san pham dang theo doi.' });
        return;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    '/api/tracked-products/:id/run-now',
    requireSameOrigin,
    requireAdmin,
    adminMutationRateLimit,
    async (req, res, next) => {
      try {
        const result = await runTrackedProductNow(req.params.id);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get('/api/cron/price-tracking', async (req, res, next) => {
    try {
      if (process.env.CRON_SECRET) {
        const authHeader = req.headers.authorization;
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
          res.status(401).json({ message: 'Unauthorized cron request.' });
          return;
        }
      } else if (!canRunCronWithoutSecret()) {
        res.status(503).json({ message: 'CRON_SECRET chua duoc cau hinh tren production.' });
        return;
      }

      const result = await runPriceTrackingBatch();
      const cleanup = await cleanupOldPriceHistoryRecords({ olderThanDays: 90 });
      res.json({
        ...result,
        cleanup,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
