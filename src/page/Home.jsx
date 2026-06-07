import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import HeroSection from '../components/home/HeroSection';
import AdBannerSlot from '../components/home/AdBannerSlot';
import VoucherSection from '../components/home/VoucherSection';
import CategoryGrid from '../components/home/CategoryGrid';
import BrandSection from '../components/home/BrandSection';
import HotVoucherBannerSlot from '../components/home/HotVoucherBannerSlot';
import BlogTipsSection from '../components/home/BlogTipsSection';
import InterestSection from '../components/home/InterestSection';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  const { data: hotVouchers = [], isLoading: loadingHot } = useQuery({
    queryKey: ['vouchers', 'hot'],
    queryFn: () => localClient.entities.Voucher.filter({ is_hot: true, status: 'active' }, '-sort_order', 6),
  });

  const { data: newVouchers = [], isLoading: loadingNew } = useQuery({
    queryKey: ['vouchers', 'new'],
    queryFn: () => localClient.entities.Voucher.filter({ status: 'active' }, '-created_date', 6),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => localClient.entities.Category.filter({ is_active: true }, 'sort_order', 12),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands', 'featured'],
    queryFn: () => localClient.entities.Brand.filter({ is_featured: true, is_active: true }, 'sort_order', 12),
  });

  return (
    <div>
      <HeroSection />
      <AdBannerSlot />

      <VoucherSection
        title="🔥 Mã Giảm Giá Hot Hôm Nay"
        vouchers={hotVouchers}
        loading={loadingHot}
        linkTo="/ma-giam-gia?filter=hot"
        emptyMessage="Chưa có mã hot nào hôm nay"
        emptyFallback={<HotVoucherBannerSlot />}
      />

      <CategoryGrid categories={categories} />

      <VoucherSection
        title="🆕 Mã Mới Nhất"
        vouchers={newVouchers}
        loading={loadingNew}
        linkTo="/ma-giam-gia?filter=newest"
      />

      <BrandSection brands={brands} />

      <BlogTipsSection />

      <InterestSection />

      <FAQSection />
    </div>
  );
}
