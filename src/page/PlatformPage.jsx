import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Home, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import VoucherGrid from '../components/voucher/VoucherGrid';
import BrandLogo from '@/components/brand/BrandLogo';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, PLATFORM_KEYWORDS, mergeKeywords } from '@/lib/site';

const platformConfig = {
  shopee: {
    name: 'Shopee',
    key: 'shopee',
    color: 'from-orange-500 to-orange-600',
    desc: 'Tổng hợp mã giảm giá Shopee, voucher Shopee, deal hot Shopee mỗi ngày',
  },
  lazada: {
    name: 'Lazada',
    key: 'lazada',
    color: 'from-blue-600 to-blue-700',
    desc: 'Mã giảm giá Lazada, voucher Lazada, flash sale Lazada cập nhật liên tục',
  },
  tiki: {
    name: 'Tiki',
    key: 'tiki',
    color: 'from-blue-500 to-blue-600',
    desc: 'Săn mã giảm giá Tiki, coupon Tiki, deal siêu rẻ Tiki hôm nay',
  },
  'tiktok-shop': {
    name: 'TikTok Shop',
    key: 'tiktok_shop',
    color: 'from-gray-900 to-black',
    desc: 'Mã giảm giá TikTok Shop, voucher TikTok Shop, deal hot TikTok mỗi ngày',
  },
};

const platformRouteByKey = {
  shopee: '/san/shopee',
  lazada: '/san/lazada',
  tiki: '/san/tiki',
  tiktok_shop: '/san/tiktok-shop',
};

export default function PlatformPage() {
  const { platform: slug } = useParams();
  const config = platformConfig[slug];

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['platform-vouchers', config?.key],
    queryFn: () => localClient.entities.Voucher.filter({ platform: config.key, status: 'active' }, '-created_date', 50),
    enabled: !!config,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['platform-brands', config?.key],
    queryFn: () => localClient.entities.Brand.filter({ platform: config.key, is_active: true }, 'sort_order', 12),
    enabled: !!config,
  });

  const { data: allBrands = [] } = useQuery({
    queryKey: ['platform-switch-brands'],
    queryFn: () => localClient.entities.Brand.filter({ is_active: true }, 'sort_order', 50),
  });

  const { data: activeSuggestions = [] } = useQuery({
    queryKey: ['platform-active-suggestions'],
    queryFn: () => localClient.entities.Voucher.filter({ status: 'active' }, '-created_date', 10),
  });

  const quickSwitchBrands = useMemo(() => {
    const platformCards = Object.entries(platformConfig)
      .map(([routeSlug, platform]) => {
        const matchedBrand = allBrands.find(
          (brand) => brand.platform === platform.key || brand.slug === routeSlug,
        );

        return matchedBrand ? { ...matchedBrand, routeSlug } : null;
      })
      .filter(Boolean);

    return platformCards.sort((left, right) => {
      if (left.routeSlug === slug) return -1;
      if (right.routeSlug === slug) return 1;
      return 0;
    });
  }, [allBrands, slug]);

  if (!config) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="mb-4 text-4xl">Sàn</p>
        <h1 className="mb-2 text-xl font-bold">Không tìm thấy sàn này</h1>
        <Link to="/">
          <Button className="mt-4 rounded-full">Về trang chủ</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Seo
        title={`Mã giảm giá ${config.name} hôm nay, voucher ${config.name} mới nhất`}
        description={config.desc}
        path={`/san/${slug}`}
        keywords={mergeKeywords(BASE_KEYWORDS, PLATFORM_KEYWORDS[slug], [
          `mã giảm giá ${config.name.toLowerCase()}`,
          `voucher ${config.name.toLowerCase()}`,
        ])}
      />
      <div className={`bg-gradient-to-r ${config.color} text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <Link to="/" className="flex items-center gap-1 hover:text-white">
              <Home className="h-3.5 w-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{config.name}</span>
          </nav>
          <h1 className="mb-2 font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
            Mã Giảm Giá {config.name}
          </h1>
          <p className="max-w-xl text-white/80">{config.desc}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {quickSwitchBrands.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading">Chuyển nhanh giữa các sàn</h2>
                <p className="text-sm text-muted-foreground">
                  Có thể đổi sang Shopee, Lazada, Tiki hoặc TikTok Shop ngay tại đây mà không cần quay lại trang chủ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickSwitchBrands.map((brand) => {
                const isActivePlatform = brand.routeSlug === slug;

                return (
                  <Link
                    key={brand.id}
                    to={platformRouteByKey[brand.platform] || `/san/${brand.routeSlug}`}
                    className={`group rounded-xl border p-4 text-center transition-all ${
                      isActivePlatform
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                      <BrandLogo
                        brand={brand}
                        alt={brand.name}
                        className="h-full w-full object-contain p-1"
                        fallbackClassName="font-bold text-muted-foreground"
                      />
                    </div>
                    <p className={`text-sm font-semibold ${isActivePlatform ? 'text-primary' : 'group-hover:text-primary'}`}>
                      {brand.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {isActivePlatform ? 'Đang xem' : 'Mở trang sàn'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {brands.length > 1 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold font-heading">Thương hiệu tiêu biểu trên {config.name}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {brands.slice(0, 6).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/thuong-hieu/${brand.slug}`}
                  className="group rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary/30"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                    <BrandLogo
                      brand={brand}
                      alt={brand.name}
                      className="h-full w-full object-contain p-1"
                      fallbackClassName="font-bold text-muted-foreground"
                    />
                  </div>
                  <p className="line-clamp-1 text-xs font-medium transition-colors group-hover:text-primary">
                    {brand.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold font-heading">Tất cả mã giảm giá {config.name}</h2>
            <p className="text-sm text-muted-foreground">
              Danh sách bên dưới chỉ hiển thị các ưu đãi đang hoạt động thật từ nguồn dữ liệu hiện tại.
            </p>
          </div>
          {vouchers.length === 0 && (
            <Badge variant="secondary" className="w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Đang cập nhật thêm mã mới
            </Badge>
          )}
        </div>

        {vouchers.length > 0 || isLoading ? (
          <VoucherGrid
            vouchers={vouchers}
            loading={isLoading}
            emptyMessage={`Chưa có mã giảm giá ${config.name}`}
          />
        ) : (
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-3xl border-border/80 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.55)]">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <Badge variant="secondary" className="mb-3 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Dữ liệu thật đang được đồng bộ
                    </Badge>
                    <h3 className="text-2xl font-bold font-heading">Hiện chưa có mã {config.name} đang hoạt động</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Trang này vẫn giữ đúng dữ liệu sync thật. Khi chưa có voucher khả dụng cho {config.name}, em ưu tiên hiển thị trạng thái rõ ràng và gợi ý các mã đang chạy ở sàn khác để người dùng không bị cụt trải nghiệm.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild className="rounded-full px-5">
                        <Link to="/ma-giam-gia?filter=hot">Xem mã hot hôm nay</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full px-5">
                        <Link to="/">Về trang chủ</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5 text-sm text-muted-foreground lg:max-w-sm">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-foreground">Gợi ý chuyển hướng nhanh</p>
                    <p className="mt-2 leading-7">
                      Anh có thể giữ người dùng ở lại bằng cách cho họ xem các mã đang hoạt động thật bên dưới, hoặc chuyển nhanh sang Shopee nếu đang có deal tốt hơn.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {activeSuggestions.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <h3 className="font-heading text-lg font-bold">Mã đang hoạt động hôm nay</h3>
                </div>
                <VoucherGrid vouchers={activeSuggestions} loading={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
