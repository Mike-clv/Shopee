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
  const { data: homepage, isLoading } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => localClient.homepage.get(),
  });

  const hotVouchers = homepage?.hotVouchers || [];
  const newVouchers = homepage?.newVouchers || [];
  const categories = homepage?.categories || [];
  const brands = homepage?.brands || [];
  const topBanners = homepage?.topBanners || [];
  const hotEmptyBanners = homepage?.hotEmptyBanners || [];
  const blogPosts = homepage?.blogPosts || [];
  const interestPosts = homepage?.interestPosts || [];

  return (
    <div>
      <HeroSection />
      <AdBannerSlot banners={topBanners} />

      <VoucherSection
        title="ðŸ”¥ MÃ£ Giáº£m GiÃ¡ Hot HÃ´m Nay"
        vouchers={hotVouchers}
        loading={isLoading}
        linkTo="/ma-giam-gia?filter=hot"
        emptyMessage="ChÆ°a cÃ³ mÃ£ hot nÃ o hÃ´m nay"
        emptyFallback={<HotVoucherBannerSlot banners={hotEmptyBanners} />}
      />

      <CategoryGrid categories={categories} />

      <VoucherSection
        title="ðŸ†• MÃ£ Má»›i Nháº¥t"
        vouchers={newVouchers}
        loading={isLoading}
        linkTo="/ma-giam-gia?filter=newest"
      />

      <BrandSection brands={brands} />

      <BlogTipsSection posts={blogPosts} />

      <InterestSection posts={interestPosts} />

      <FAQSection />
    </div>
  );
}
