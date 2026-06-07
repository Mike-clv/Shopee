# Cap Nhat Logo Va Toc Do

## Nhung gi da duoc cai tien

- Trang chu da dung API gop `/api/homepage` de giam so request khi mo web.
- Public site khong con bi chan toan man hinh chi vi dang kiem tra dang nhap admin.
- Cac thuong hieu chinh da co bo logo noi bo de tranh bi trong logo tren production.

## Cac logo da co san

- `Shopee`
- `Lazada`
- `Tiki`
- `TikTok Shop`
- `Samsung`
- `Nike`
- `Unilever`
- `L'Oreal`
- `Grab`
- `The Coffee House`
- `concung`

## Vi tri file logo

- Logo assets: `public/brand-logos/`
- Mapping logo: `src/lib/branding.js`

## Cach thay logo sau nay

1. Thay file logo trong `public/brand-logos/`
2. Neu can, cap nhat mapping trong `src/lib/branding.js`
3. Chay:

```bash
npm run build
```

4. Day code len GitHub hoac redeploy Vercel de production nhan file moi

## Build command tren Vercel

Nen de build command la:

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

## Kiem tra sau khi deploy

1. Mo trang chu va trang admin
2. Hard refresh trinh duyet
3. Kiem tra lai logo thuong hieu, voucher va du lieu moi

## Vercel Analytics va Speed Insights

- Package da duoc gan vao app root trong `src/App.jsx`
- `Analytics` dung de dem luot truy cap, page views va visitor
- `Speed Insights` dung de do toc do tai trang va Core Web Vitals
- Sau khi deploy, can mo web va dieu huong qua vai trang de Vercel bat dau co du lieu
- Neu dashboard chua co so lieu ngay, thu cho 30-60 giay va refresh lai
- Mot so ad blocker co the lam giam du lieu Analytics/Speed Insights

## SEO va Google

- Meta title, description, canonical, Open Graph va Twitter tags da duoc them theo tung trang
- `robots.txt` va `sitemap.xml` da duoc bo sung trong server
- Cac trang admin, login va tim kiem duoc de `noindex`
- Sau khi deploy, anh nen submit `https://ten-domain-cua-anh/sitemap.xml` len Google Search Console
