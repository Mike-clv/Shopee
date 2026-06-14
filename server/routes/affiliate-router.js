import { Router } from 'express';
import { ensureCloakedLink, findCloakedLinkBySlug, buildAccessTradeDeepLink } from '../services/accesstrade/deeplink.js';

const legacyCloakedLinks = {
  'shopee-vn-b4161c3c0f32': {
    originalUrl: 'https://shopee.vn/m/6-6',
    deepLink: 'https://go.isclix.com/deep_link/v6/6041223145843920598/4751584435713464237?utm_source=Google&utm_medium=Banner&utm_campaign=Ctrinh66&utm_content=Shopee66&sub4=oneatweb&url_enc=aHR0cHM6Ly9zaG9wZWUudm4vbS82LTY%3D',
  },
};

function getLegacyCloakedLink(slug) {
  return legacyCloakedLinks[String(slug || '').trim()] || null;
}

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
      const record = await findCloakedLinkBySlug(req.params.slug) || getLegacyCloakedLink(req.params.slug);
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
