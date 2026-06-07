import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import PromoBannerGrid from './PromoBannerGrid';

export default function HotVoucherBannerSlot() {
  const { data: banners = [] } = useQuery({
    queryKey: ['banners', 'hot_empty'],
    queryFn: () => localClient.entities.Banner.filter({ is_active: true, placement: 'hot_empty' }, 'sort_order', 4),
  });

  return <PromoBannerGrid banners={banners} />;
}
