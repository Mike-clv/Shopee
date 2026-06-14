import { Router } from 'express';
import { ensureCloakedLink, findCloakedLinkBySlug, buildAccessTradeDeepLink } from '../services/accesstrade/deeplink.js';

export function createAffiliateRouter({
  requireAdmin,
  requireSameOrigin,
  adminMutationRateLimit,
}) {
  const router = Router();

  router.post('/api/affiliate/convert', requireSameOrigin, requireAdmin, adminMutationRateLimit, async (req, res, next) => {
    try {
      const inputUrl = String(req.body?.url || '').trim();
      if (!inputUrl) {
        res.status(400).json({ message: 'Vui long nhap link san pham de chuyen doi.' });
        return;
      }

      const result = await ensureCloakedLink(inputUrl);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/go/:slug', async (req, res, next) => {
    try {
      const record = await findCloakedLinkBySlug(req.params.slug);
      if (!record?.deepLink) {
        res.status(404).send('Link affiliate khong ton tai hoac da bi xoa.');
        return;
      }

      const deepLink = record.deepLink || buildAccessTradeDeepLink(record.originalUrl);
      res.setHeader('Cache-Control', 'no-store');
      res.redirect(302, deepLink);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
