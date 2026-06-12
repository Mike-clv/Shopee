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
  'theo doi gia san pham',
  'lich su gia san pham',
  'gia shopee hom nay',
  'gia lazada hom nay',
  'gia tiki hom nay',
  'gia tiktok shop hom nay',
];

export default function PriceTrackingList() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['tracked-products'],
    queryFn: () => localClient.entities.TrackedProduct.filter({ is_active: true }, 'sort_order', 100),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title="Theo doi gia san pham | Lich su bien dong gia"
        description="Theo doi gia san pham dang quan tam, xem lich su bien dong gia va cap nhat moi nhat tren tung san."
        path="/theo-doi-gia"
        keywords={mergeKeywords(BASE_KEYWORDS, PAGE_KEYWORDS)}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Theo doi gia san pham</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Xem nhanh gia hien tai va mo trang chi tiet de theo doi lich su bien dong gia cua tung san pham.
        </p>
      </div>

      {isLoading ? (
        <Card className="rounded-3xl">
          <CardContent className="p-6 text-sm text-muted-foreground">Dang tai danh sach san pham dang theo doi gia...</CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="p-6 text-sm text-muted-foreground">Chua co san pham nao duoc theo doi gia.</CardContent>
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
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Gia hien tai</p>
                    <p className="mt-2 text-base font-semibold">{formatTrackedPrice(product.current_price, product.currency || 'VND')}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Lan cap nhat</p>
                    <p className="mt-2 text-sm font-semibold">{formatTrackedDateTime(product.last_checked_at)}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild className="rounded-2xl">
                    <Link to={`/theo-doi-gia/${product.slug || product.id}`}>Xem lich su gia</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-2xl">
                    <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                      Mo san pham
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {product.last_error ? (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    <RefreshCw className="h-3.5 w-3.5" />
                    He thong se thu lai o lan cron tiep theo neu san dang thay doi giao dien.
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
