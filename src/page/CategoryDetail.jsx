import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Home, Sparkles } from 'lucide-react';
import { localClient } from '@/api/localClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import VoucherGrid from '../components/voucher/VoucherGrid';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, CATEGORY_KEYWORDS, mergeKeywords } from '@/lib/site';

export default function CategoryDetail() {
  const slug = window.location.pathname.split('/danh-muc/')[1];

  const { data: categories = [], isLoading: loadingCategory } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => localClient.entities.Category.filter({ slug }),
    enabled: !!slug,
  });

  const category = categories[0];

  const { data: vouchers = [], isLoading: loadingVouchers } = useQuery({
    queryKey: ['category-vouchers', category?.id],
    queryFn: () => localClient.entities.Voucher.filter({ category_id: category.id, status: 'active' }, '-created_date', 50),
    enabled: !!category,
  });

  const { data: activeSuggestions = [] } = useQuery({
    queryKey: ['category-active-suggestions'],
    queryFn: () => localClient.entities.Voucher.filter({ status: 'active' }, '-created_date', 10),
  });

  if (loadingCategory) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="mb-4 text-4xl">📂</p>
        <h1 className="mb-2 text-xl font-bold">Không tìm thấy danh mục</h1>
        <Link to="/danh-muc">
          <Button className="mt-4 rounded-full">Xem danh mục khác</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title={category.seo_title || `Mã giảm giá ${category.name} hôm nay`}
        description={category.seo_description || category.description || `Tổng hợp mã giảm giá, voucher và deal mới nhất cho danh mục ${category.name}.`}
        path={`/danh-muc/${category.slug}`}
        keywords={mergeKeywords(BASE_KEYWORDS, CATEGORY_KEYWORDS, [
          `mã giảm giá ${category.name}`,
          `ma giam gia ${category.name}`,
          `${category.name} voucher`,
        ])}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-3.5 w-3.5" />
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/danh-muc" className="hover:text-primary">Danh mục</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="mb-2 font-heading text-2xl font-bold sm:text-3xl">
          Mã Giảm Giá {category.name}
        </h1>
        {category.description ? (
          <p className="text-muted-foreground">{category.description}</p>
        ) : null}
      </div>

      {vouchers.length > 0 || loadingVouchers ? (
        <VoucherGrid
          vouchers={vouchers}
          loading={loadingVouchers}
          emptyMessage={`Chưa có mã giảm giá cho danh mục ${category.name}`}
        />
      ) : (
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border-border/80 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.55)]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <Badge
                    variant="secondary"
                    className="mb-3 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    Đang cập nhật ưu đãi
                  </Badge>
                  <h2 className="font-heading text-2xl font-bold">
                    Danh mục {category.name} hiện chưa có mã đang hoạt động
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Hiện tại danh mục này chưa có ưu đãi phù hợp, anh/chị có thể xem thêm các mã đang hoạt động bên dưới để không bỏ lỡ deal tốt trong hôm nay.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full px-5">
                      <Link to="/ma-giam-gia?filter=hot">Xem mã hot hôm nay</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full px-5">
                      <Link to="/danh-muc">Xem danh mục khác</Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5 text-sm text-muted-foreground lg:max-w-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground">Ưu đãi nổi bật nên xem thêm</p>
                  <p className="mt-2 leading-7">
                    Một số mã đang hoạt động sẽ được gợi ý thêm để anh/chị tiện chuyển sang ưu đãi phù hợp mà không cần quay lại từ đầu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeSuggestions.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                <h3 className="font-heading text-lg font-bold">Mã đang hoạt động hôm nay</h3>
              </div>
              <VoucherGrid vouchers={activeSuggestions} loading={false} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
