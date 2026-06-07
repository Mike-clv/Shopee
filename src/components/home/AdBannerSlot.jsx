import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ExternalLink, Megaphone, Sparkles } from 'lucide-react';
import { localClient } from '@/api/localClient';
import { Button } from '@/components/ui/button';
import PromoBannerGrid, { defaultShopeeBanners } from './PromoBannerGrid';

export default function AdBannerSlot({ placement = 'homepage_top', banners: providedBanners }) {
  const { data: banners = [] } = useQuery({
    queryKey: ['banners', placement],
    queryFn: () => localClient.entities.Banner.filter({ is_active: true, placement }, 'sort_order', 4),
    enabled: !providedBanners,
  });

  const sourceBanners = providedBanners || banners;
  const imageBanners = sourceBanners.filter((banner) => banner?.image_url);
  const visibleBanners = imageBanners.length ? imageBanners : defaultShopeeBanners;

  if (visibleBanners.length) {
    return (
      <section className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <PromoBannerGrid banners={visibleBanners} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 ad-flow-line" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">AccessTrade Campaign</p>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-heading">Æ¯u Ä‘Ã£i ná»•i báº­t Ä‘ang cáº­p nháº­t</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Chiáº¿n dá»‹ch thÆ°Æ¡ng máº¡i Ä‘iá»‡n tá»­, voucher toÃ n sÃ n vÃ  deal ná»•i báº­t tá»« AccessTrade.
                </p>
              </div>
            </div>
            <Button asChild className="rounded-full shrink-0 gap-2">
              <Link to="/tim-kiem?embed=1">
                Xem báº£ng mÃ£
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
