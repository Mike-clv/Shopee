const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://sansaleshopee.vercel.app').replace(/\/+$/, '');

export default function handler(_req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /login',
      'Disallow: /register',
      'Disallow: /forgot-password',
      'Disallow: /reset-password',
      'Disallow: /tim-kiem',
      `Sitemap: ${siteUrl}/sitemap.xml`,
    ].join('\n'),
  );
}
