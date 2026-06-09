import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, ExternalLink, Globe2, Home, Ticket, Store } from 'lucide-react';
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
        description={brand.seo_description || brand.description || `Tổng hợp mã giảm giá, voucher và ưu đãi mới nhất của ${brand.name}.`}
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
                  {brand.platform && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      {platformNames[brand.platform]}
                    </Badge>
                  )}
                  {brand.is_featured ? (
                    <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                      Thương hiệu nổi bật
                    </Badge>
                  ) : null}
                </div>

                <h1 className="mt-3 text-3xl font-bold leading-tight font-heading text-foreground sm:text-[2.1rem]">
                  {brand.name}
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground sm:max-w-2xl">
                  {brand.description || `Tổng hợp voucher, mã giảm giá và ưu đãi mới nhất từ ${brand.name} để anh dễ theo dõi và chuyển sang website chính hãng nhanh hơn.`}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                  <div className="rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                      <Ticket className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-[0.18em]">Voucher</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-foreground">{voucherCount} mã giảm giá</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                      <Store className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-[0.18em]">Website</span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-semibold text-foreground">
                      {websiteHost || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
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
                    <Button className="h-12 w-full rounded-2xl gap-2 text-sm font-semibold shadow-[0_18px_40px_-20px_hsl(var(--primary))]">
                      Chuyển đến website
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </a>

                  <p className="mt-3 line-clamp-1 text-center text-xs text-muted-foreground">
                    {websiteHost}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-heading text-foreground sm:text-2xl">
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
