import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ExternalLink, Home } from 'lucide-react';
import { localClient } from '@/api/localClient';
import PriceHistoryChart from '@/components/charts/PriceHistoryChart';
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

export default function PriceTrackingDetail() {
  const { slug = '' } = useParams();
  const [historyDays, setHistoryDays] = useState(30);

  const { data: products = [], isLoading: productLoading } = useQuery({
    queryKey: ['tracked-product-detail', slug],
    queryFn: async () => {
      const bySlug = await localClient.entities.TrackedProduct.filter({ slug });
      if (bySlug.length) return bySlug;
      return localClient.entities.TrackedProduct.filter({ id: slug });
    },
    enabled: !!slug,
  });

  const product = products[0];

  const { data: historyResponse, isLoading: historyLoading } = useQuery({
    queryKey: ['tracked-product-history-public', product?.id, historyDays],
    queryFn: () => localClient.priceTracking.history(product.id, historyDays),
    enabled: !!product?.id,
  });

  const history = historyResponse?.history || [];
  const latestEntries = useMemo(() => [...history].reverse().slice(0, 8), [history]);

  if (productLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Card className="rounded-3xl">
          <CardContent className="p-6 text-sm text-muted-foreground">Đang tải thông tin sản phẩm...</CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <Card className="rounded-3xl">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">Không tìm thấy sản phẩm đang theo dõi giá.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Seo
        title={`Lịch sử giá ${product.name}`}
        description={`Theo dõi lịch sử biến động giá của ${product.name} và xem giá cập nhật mới nhất.`}
        path={`/theo-doi-gia/${product.slug || product.id}`}
        keywords={mergeKeywords(BASE_KEYWORDS, [
          `lịch sử giá ${product.name}`,
          `theo dõi giá ${product.name}`,
          `${product.name} giá bao nhiêu`,
        ])}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-3.5 w-3.5" />
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/theo-doi-gia" className="hover:text-primary">Theo dõi giá</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <Card className="rounded-[28px] border-border shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Badge variant="secondary" className="rounded-full">{getTrackedProductPlatformLabel(product.platform)}</Badge>
              <h1 className="mt-3 font-heading text-3xl font-bold">{product.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Hệ thống ưu tiên đọc giá từ dữ liệu JSON-LD của trang sản phẩm. Nếu sàn thay đổi giao diện, selector dự phòng sẽ được sử dụng để giảm nguy cơ mất dữ liệu.
              </p>
            </div>

            <Button asChild className="rounded-2xl">
              <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                Mở trang sản phẩm
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Giá hiện tại</p>
              <p className="mt-2 text-lg font-bold">{formatTrackedPrice(product.current_price, product.currency || 'VND')}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Lần cập nhật</p>
              <p className="mt-2 text-sm font-semibold">{formatTrackedDateTime(product.last_checked_at)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Khoảng thời gian</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[7, 30, 90].map((days) => (
                  <Button
                    key={days}
                    type="button"
                    variant={historyDays === days ? 'default' : 'outline'}
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => setHistoryDays(days)}
                  >
                    {days} ngày
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <PriceHistoryChart
              history={history}
              currency={product.currency || 'VND'}
              className={historyLoading ? 'opacity-60' : ''}
              heightClassName="h-[320px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr),280px]">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <h2 className="font-heading text-xl font-bold">Lịch sử cập nhật gần nhất</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Thời gian</th>
                    <th className="pb-3 pr-4 font-medium">Giá</th>
                    <th className="pb-3 font-medium">Nguồn</th>
                  </tr>
                </thead>
                <tbody>
                  {latestEntries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-muted-foreground">Chưa có bản ghi lịch sử giá.</td>
                    </tr>
                  ) : latestEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">{formatTrackedDateTime(entry.captured_at)}</td>
                      <td className="py-3 pr-4 font-semibold">{formatTrackedPrice(entry.price, product.currency || 'VND')}</td>
                      <td className="py-3">{entry.source === 'selector' ? 'Selector dự phòng' : 'JSON-LD'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <h2 className="font-heading text-xl font-bold">Ghi chú vận hành</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>• Cron production trên Vercel chỉ xử lý tối đa 3 sản phẩm mỗi lần gọi.</li>
              <li>• Hệ thống ưu tiên JSON-LD để giảm nguy cơ selector bị vỡ.</li>
              <li>• Nếu giao diện sàn thay đổi, lần cron sau sẽ tiếp tục thử lại.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
