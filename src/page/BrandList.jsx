import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import BrandLogo from '@/components/brand/BrandLogo';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, BRAND_KEYWORDS, mergeKeywords } from '@/lib/site';

const platformNames = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiki: 'Tiki',
  tiktok_shop: 'TikTok Shop',
  sendo: 'Sendo',
  other: 'Khác',
};

export default function BrandList() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands', 'all'],
    queryFn: () => localClient.entities.Brand.filter({ is_active: true }, 'sort_order', 100),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Seo
        title="Thương hiệu có mã giảm giá, voucher mới nhất"
        description="Danh sách thương hiệu, shop và sàn thương mại điện tử đang có mã giảm giá, voucher và deal mới nhất."
        path="/thuong-hieu"
        keywords={mergeKeywords(BASE_KEYWORDS, BRAND_KEYWORDS, [
          'thương hiệu shopee lazada tiki',
          'thuong hieu shopee lazada tiki',
        ])}
      />

      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Thương hiệu</h1>
      <p className="text-muted-foreground mb-8">Tất cả thương hiệu và shop đang có ưu đãi.</p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-2xl border p-5">
              <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-3" />
              <Skeleton className="h-4 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">Brand</p>
          <p className="text-muted-foreground">Chưa có thương hiệu nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/thuong-hieu/${brand.slug}`}
              className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all p-5 text-center group"
            >
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border mx-auto mb-3">
                <BrandLogo
                  brand={brand}
                  alt={brand.name}
                  className="w-full h-full object-contain p-2"
                  fallbackClassName="text-xl font-bold text-muted-foreground"
                />
              </div>
              <h2 className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">{brand.name}</h2>
              {brand.platform && (
                <Badge variant="secondary" className="text-[10px]">
                  {platformNames[brand.platform]}
                </Badge>
              )}
              {brand.voucher_count > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{brand.voucher_count} mã giảm giá</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
