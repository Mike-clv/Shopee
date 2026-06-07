import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import VoucherGrid from '../components/voucher/VoucherGrid';
import BrandLogo from '@/components/brand/BrandLogo';

const platformNames = {
  shopee: 'Shopee', lazada: 'Lazada', tiki: 'Tiki',
  tiktok_shop: 'TikTok Shop', sendo: 'Sendo', other: 'Khác',
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
    queryFn: () => localClient.entities.Voucher.filter({ brand_id: brand.id, status: 'active' }, '-created_date', 50),
    enabled: !!brand,
  });

  if (loadingBrand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🏪</p>
        <h1 className="text-xl font-bold mb-2">Không tìm thấy thương hiệu</h1>
        <Link to="/thuong-hieu"><Button className="rounded-full mt-4">Xem thương hiệu khác</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/thuong-hieu" className="hover:text-primary">Thương hiệu</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{brand.name}</span>
      </nav>

      {/* Brand header */}
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
            <BrandLogo
              brand={brand}
              alt={brand.name}
              className="w-full h-full object-contain p-2"
              fallbackClassName="text-3xl font-bold text-muted-foreground"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold font-heading mb-1">{brand.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              {brand.platform && <Badge variant="secondary">{platformNames[brand.platform]}</Badge>}
              <span className="text-sm text-muted-foreground">{vouchers.length} mã giảm giá</span>
            </div>
            {brand.description && <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>}
          </div>
          {brand.website_url && (
            <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0">
                <ExternalLink className="w-3.5 h-3.5" /> Website
              </Button>
            </a>
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold font-heading mb-4">Mã Giảm Giá {brand.name}</h2>
      <VoucherGrid vouchers={vouchers} loading={loadingVouchers} emptyMessage={`Chưa có mã giảm giá cho ${brand.name}`} />
    </div>
  );
}
