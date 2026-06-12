import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, Copy, ExternalLink, Percent, Sparkles, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  buildGlobalCouponRedirectPath,
  formatGlobalCouponExpiry,
  GLOBAL_COUPON_PLATFORM_LABELS,
  isGlobalCouponExpired,
} from '@/lib/global-coupons';

const TAB_ITEMS = [
  {
    value: 'all_site',
    label: 'Mã Toàn Sàn',
    icon: Percent,
    filter: (coupon) => coupon.type === 'all_site' || coupon.type === 'category',
  },
  {
    value: 'freeship',
    label: 'Mã miễn phí vận chuyển',
    icon: Truck,
    filter: (coupon) => coupon.type === 'freeship',
  },
  {
    value: 'evergreen',
    label: 'Mã lưu lâu dài',
    icon: Sparkles,
    filter: (coupon) => coupon.is_evergreen,
  },
];

async function copyCouponCode(code) {
  if (!code || !navigator?.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch {
    return false;
  }
}

function resolveCouponRedirectPath(coupon) {
  return coupon.redirect_path || buildGlobalCouponRedirectPath(coupon.id);
}

function CouponActionCard({ coupon }) {
  const handleAction = async () => {
    const redirectPath = resolveCouponRedirectPath(coupon);

    if (!coupon.is_evergreen && coupon.coupon_code) {
      const copied = await copyCouponCode(coupon.coupon_code);
      if (copied) {
        toast.success(`Đã sao chép mã ${coupon.coupon_code}`);
      } else {
        toast.info('Không thể sao chép tự động, hệ thống sẽ mở link ưu đãi ngay bây giờ.');
      }
    }

    window.location.assign(redirectPath);
  };

  return (
    <Card className="rounded-3xl border-border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {GLOBAL_COUPON_PLATFORM_LABELS[coupon.platform] || coupon.platform || 'Khác'}
          </Badge>
          {coupon.brand_name ? (
            <Badge variant="outline" className="rounded-full">
              {coupon.brand_name}
            </Badge>
          ) : null}
          {coupon.type === 'category' ? (
            <Badge variant="outline" className="rounded-full">Ngành hàng</Badge>
          ) : null}
          {coupon.is_evergreen ? (
            <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Lưu lâu dài
            </Badge>
          ) : null}
        </div>

        <h3 className="mt-4 line-clamp-2 font-heading text-xl font-bold">{coupon.title}</h3>
        {coupon.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{coupon.description}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {coupon.coupon_code ? (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Mã ưu đãi</p>
              <p className="mt-1 break-all font-mono text-sm font-bold text-primary">{coupon.coupon_code}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/20 px-3 py-2 text-sm text-muted-foreground">
              Không cần nhập mã, chỉ cần bấm kích hoạt ưu đãi.
            </div>
          )}

          {coupon.expires_at ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              Hết hạn: {formatGlobalCouponExpiry(coupon.expires_at)}
            </div>
          ) : null}
        </div>

        <Button type="button" className="mt-5 h-11 w-full rounded-2xl" onClick={handleAction}>
          {coupon.is_evergreen ? (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Bấm lưu trên ứng dụng
            </>
          ) : coupon.coupon_code ? (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Lấy mã
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem ưu đãi
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function GlobalCouponsSection({ coupons = [] }) {
  const validCoupons = useMemo(
    () => coupons.filter((coupon) => !isGlobalCouponExpired(coupon.expires_at)),
    [coupons],
  );

  const groupedCoupons = useMemo(
    () => TAB_ITEMS.map((tab) => ({
      ...tab,
      items: validCoupons.filter(tab.filter),
    })),
    [validCoupons],
  );

  const availableTabs = groupedCoupons.filter((tab) => tab.items.length > 0);
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.value || 'all_site');

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.value === activeTab)) {
      setActiveTab(availableTabs[0]?.value || 'all_site');
    }
  }, [activeTab, availableTabs]);

  const activeItems = groupedCoupons.find((tab) => tab.value === activeTab)?.items || [];

  if (validCoupons.length === 0 || availableTabs.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Card className="overflow-hidden rounded-[32px] border-primary/10 bg-gradient-to-br from-primary/[0.06] via-background to-background shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                  Mã chọn lọc
                </Badge>
                <CardTitle className="mt-4 font-heading text-2xl sm:text-3xl">
                  Mã nổi bật nên ghim ngay
                </CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Gom sẵn các mã toàn sàn, miễn phí vận chuyển và ưu đãi lưu lâu dài để người dùng bấm là đi qua link affiliate bọc của website.
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-2xl bg-transparent p-0 sm:grid-cols-3 lg:w-auto">
                  {availableTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-2xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid gap-4 lg:grid-cols-2">
              {activeItems.map((coupon) => (
                <CouponActionCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
