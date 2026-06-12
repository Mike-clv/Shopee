import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ExternalLink, LineChart as LineChartIcon, RefreshCw } from 'lucide-react';
import { localClient } from '@/api/localClient';
import Seo from '@/components/Seo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BASE_KEYWORDS, mergeKeywords } from '@/lib/site';
import {
  formatTrackedDateTime,
  formatTrackedPrice,
  getTrackedProductPlatformLabel,
} from '@/lib/price-tracking';

const PAGE_KEYWORDS = [
  'theo dõi giá sản phẩm',
  'lịch sử giá sản phẩm',
  'giá shopee hôm nay',
  'giá lazada hôm nay',
  'giá tiki hôm nay',
  'giá tiktok shop hôm nay',
];

export default function PriceTrackingList() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['tracked-products'],
    queryFn: () => localClient.entities.TrackedProduct.filter({ is_active: true }, 'sort_order', 100),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title="Theo dõi giá sản phẩm | Lịch sử biến động giá"
        description="Theo dõi giá sản phẩm đang quan tâm, xem lịch sử biến động giá và cập nhật mới nhất trên từng sàn."
        path="/theo-doi-gia"
        keywords={mergeKeywords(BASE_KEYWORDS, PAGE_KEYWORDS)}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Theo dõi giá sản phẩm</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Xem nhanh giá hiện tại và mở trang chi tiết để theo dõi lịch sử biến động giá của từng sản phẩm.
        </p>
      </div>

      {isLoading ? (
        <Card className="rounded-3xl">
          <CardContent className="p-6 text-sm text-muted-foreground">Đang tải danh sách sản phẩm đang theo dõi giá...</CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="p-6 text-sm text-muted-foreground">Chưa có sản phẩm nào được theo dõi giá.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="rounded-3xl border-border transition-shadow hover:shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="secondary" className="rounded-full">{getTrackedProductPlatformLabel(product.platform)}</Badge>
                    <h2 className="mt-3 line-clamp-2 font-heading text-xl font-bold">{product.name}</h2>
                  </div>
                  <LineChartIcon className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Giá hiện tại</p>
                    <p className="mt-2 text-base font-semibold">{formatTrackedPrice(product.current_price, product.currency || 'VND')}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Lần cập nhật</p>
                    <p className="mt-2 text-sm font-semibold">{formatTrackedDateTime(product.last_checked_at)}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild className="rounded-2xl">
                    <Link to={`/theo-doi-gia/${product.slug || product.id}`}>Xem lịch sử giá</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-2xl">
                    <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                      Mở sản phẩm
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {product.last_error ? (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Hệ thống sẽ thử lại ở lần cron tiếp theo nếu sàn đang thay đổi giao diện.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
