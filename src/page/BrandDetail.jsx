import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, ExternalLink, Globe2, Home } from 'lucide-react';
import { localClient } from '@/api/localClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Seo from '@/components/Seo';
import BrandLogo from '@/components/brand/BrandLogo';
import VoucherGrid from '../components/voucher/VoucherGrid';
import { BASE_KEYWORDS, BRAND_KEYWORDS, mergeKeywords } from '@/lib/site';

const platformNames = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiki: 'Tiki',
  tiktok_shop: 'TikTok Shop',
  sendo: 'Sendo',
  other: 'Khác',
};

function getBrandDescription(brand) {
  const raw = String(brand?.description || '').trim();
  if (!raw) return '';

  const normalized = raw.toLowerCase();
  const blockedSignals = [
    'accesstrade',
    'publisher',
    'publishers',
    'thông báo',
    'traffic',
    'chiến dịch',
    'xác thực publisher',
    'tạm thời ngừng duyệt',
    'quý publishers',
    'kiểm tra và rà soát chất lượng',
    'logo sàn',
    'logo thương hiệu',
    'khu vực thương hiệu nổi bật',
  ];

  if (blockedSignals.some((signal) => normalized.includes(signal))) {
    return '';
  }

  if (raw.length > 220) {
    return '';
  }

  return raw;
}

export default function BrandDetail() {
  const slug = window.location.pathname.split('/thuong-hieu/')[1];

  const { data: brands = [], isLoading: loadingBrand } = useQuery({
    queryKey: ['brand', slug],
    queryFn: () => localClient.entities.Brand.filter({ slug }),
    enabled: !!slug,
  });

  const brand = brands[0];

  const { data: vouchers = [], isLoading: loadingVouchers } = useQuery({
    queryKey: ['brand-vouchers', brand?.id],
    queryFn: () => localClient.entities.Voucher.filter({ brand_id: brand.id, status: 'active' }, '-sort_order', 50),
    enabled: !!brand,
  });

  const voucherCount = vouchers.length || brand?.voucher_count || 0;
  const websiteHost = brand?.website_url
    ? brand.website_url.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
    : '';
  const displayDescription = getBrandDescription(brand);

  if (loadingBrand) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="mb-4 text-4xl">🏪</p>
        <h1 className="mb-2 text-xl font-bold">Không tìm thấy thương hiệu</h1>
        <Link to="/thuong-hieu">
          <Button className="mt-4 rounded-full">Xem thương hiệu khác</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Seo
        title={brand.seo_title || `Mã giảm giá ${brand.name} hôm nay, voucher ${brand.name}`}
        description={brand.seo_description || displayDescription || `Tổng hợp mã giảm giá, voucher và ưu đãi mới nhất của ${brand.name}.`}
        path={`/thuong-hieu/${brand.slug}`}
        image={brand.logo || brand.brand_logo}
        keywords={mergeKeywords(BASE_KEYWORDS, BRAND_KEYWORDS, [
          `mã giảm giá ${brand.name}`,
          `voucher ${brand.name}`,
          brand.platform ? `mã giảm giá ${platformNames[brand.platform]}` : '',
        ])}
      />

      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-3.5 w-3.5" />
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/thuong-hieu" className="hover:text-primary">Thương hiệu</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{brand.name}</span>
      </nav>

      <section className="relative mb-8 overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent sm:h-32" />
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-border bg-background shadow-sm sm:mx-0 sm:h-28 sm:w-28">
                <BrandLogo
                  brand={brand}
                  alt={brand.name}
                  className="h-full w-full object-contain p-3"
                  fallbackClassName="text-4xl font-bold text-muted-foreground"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {brand.platform ? (
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      {platformNames[brand.platform] || 'Khác'}
                    </Badge>
                  ) : null}
                  {brand.is_featured ? (
                    <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                      Thương hiệu nổi bật
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-4 inline-flex rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/90">
                  Thương hiệu {brand.platform ? platformNames[brand.platform] : 'nổi bật'}
                </div>

                <h1 className="mt-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-4xl font-black leading-none text-transparent sm:text-[3.2rem]">
                  {brand.name}
                </h1>

                <p className="mt-3 text-base font-medium text-foreground/80 sm:max-w-2xl">
                  {voucherCount} mã giảm giá đang còn hiệu lực
                </p>

                {displayDescription ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:max-w-2xl">
                    {displayDescription}
                  </p>
                ) : null}
              </div>
            </div>

            {brand.website_url ? (
              <div className="lg:w-[280px] lg:max-w-[280px]">
                <div className="rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                      <Globe2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Website chính thức</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Mở nhanh trang chủ thương hiệu để xem thêm sản phẩm, chiến dịch và ưu đãi đang chạy.
                      </p>
                    </div>
                  </div>

                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                    <Button className="h-12 w-full gap-2 rounded-2xl text-sm font-semibold shadow-[0_18px_40px_-20px_hsl(var(--primary))]">
                      Chuyển đến website
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </a>

                  {websiteHost ? (
                    <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Website chính hãng
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Mã Giảm Giá {brand.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách ưu đãi đang còn hiệu lực của {brand.name}.
          </p>
        </div>

        {brand.website_url ? (
          <a
            href={brand.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Mở website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>

      <VoucherGrid
        vouchers={vouchers}
        loading={loadingVouchers}
        emptyMessage={`Chưa có mã giảm giá cho ${brand.name}`}
      />
    </div>
  );
}
