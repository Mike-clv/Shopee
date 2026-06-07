import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoucherGrid from '../components/voucher/VoucherGrid';
import BrandLogo from '@/components/brand/BrandLogo';

const platformConfig = {
  'shopee': { name: 'Shopee', key: 'shopee', color: 'from-orange-500 to-orange-600', desc: 'Tổng hợp mã giảm giá Shopee, voucher Shopee, deal hot Shopee mỗi ngày' },
  'lazada': { name: 'Lazada', key: 'lazada', color: 'from-blue-600 to-blue-700', desc: 'Mã giảm giá Lazada, voucher Lazada, flash sale Lazada cập nhật liên tục' },
  'tiki': { name: 'Tiki', key: 'tiki', color: 'from-blue-500 to-blue-600', desc: 'Săn mã giảm giá Tiki, coupon Tiki, deal siêu rẻ Tiki hôm nay' },
  'tiktok-shop': { name: 'TikTok Shop', key: 'tiktok_shop', color: 'from-gray-900 to-black', desc: 'Mã giảm giá TikTok Shop, voucher TikTok Shop, deal hot TikTok' },
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

  if (!config) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <h1 className="text-xl font-bold mb-2">Không tìm thấy sàn này</h1>
        <Link to="/"><Button className="rounded-full mt-4">Về trang chủ</Button></Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className={`bg-gradient-to-r ${config.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4 flex-wrap">
            <Link to="/" className="hover:text-white flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{config.name}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading mb-2">Mã Giảm Giá {config.name}</h1>
          <p className="text-white/80 max-w-xl">{config.desc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {brands.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold font-heading mb-4">Thương Hiệu {config.name}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {brands.slice(0, 6).map(b => (
                <Link key={b.id} to={`/thuong-hieu/${b.slug}`} className="bg-card rounded-xl border border-border hover:border-primary/30 p-3 text-center group transition-all">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden mx-auto mb-2">
                    <BrandLogo
                      brand={b}
                      alt={b.name}
                      className="w-full h-full object-contain p-1"
                      fallbackClassName="font-bold text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-1">{b.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold font-heading mb-4">Tất Cả Mã Giảm Giá {config.name}</h2>
        <VoucherGrid vouchers={vouchers} loading={isLoading} emptyMessage={`Chưa có mã giảm giá ${config.name}`} />
      </div>
    </div>
  );
}
