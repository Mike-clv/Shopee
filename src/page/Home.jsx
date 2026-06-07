import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import Seo from '@/components/Seo';
import HeroSection from '../components/home/HeroSection';
import AdBannerSlot from '../components/home/AdBannerSlot';
import VoucherSection from '../components/home/VoucherSection';
import CategoryGrid from '../components/home/CategoryGrid';
import BrandSection from '../components/home/BrandSection';
import HotVoucherBannerSlot from '../components/home/HotVoucherBannerSlot';
import BlogTipsSection from '../components/home/BlogTipsSection';
import InterestSection from '../components/home/InterestSection';
import FAQSection from '../components/home/FAQSection';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

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
      <Seo
        title="Mã giảm giá, voucher, deal hot mỗi ngày"
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/tim-kiem?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <HeroSection />
      <AdBannerSlot banners={topBanners} />

      <VoucherSection
        title="🔥 Mã Giảm Giá Hot Hôm Nay"
        vouchers={hotVouchers}
        loading={isLoading}
        linkTo="/ma-giam-gia?filter=hot"
        emptyMessage="Chưa có mã hot nào hôm nay"
        emptyFallback={<HotVoucherBannerSlot banners={hotEmptyBanners} />}
      />

      <CategoryGrid categories={categories} />

      <VoucherSection
        title="🆕 Mã Mới Nhất"
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
