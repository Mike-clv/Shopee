import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import BrandLogo from '@/components/brand/BrandLogo';

const platformRoutes = {
  shopee: '/san/shopee',
  lazada: '/san/lazada',
  tiki: '/san/tiki',
  tiktok_shop: '/san/tiktok-shop',
};

export default function BrandSection({ brands }) {
  if (!brands?.length) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="section-heading-pro text-xl font-bold font-heading sm:text-2xl">Thương Hiệu Nổi Bật</h2>
          <Link to="/thuong-hieu" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={platformRoutes[brand.platform] || `/thuong-hieu/${brand.slug}`}
                className="platform-card-lift group flex min-h-[176px] flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md sm:p-5"
              >
                <div className="brand-logo-float flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary sm:h-16 sm:w-16">
                  <BrandLogo
                    brand={brand}
                    alt={brand.name}
                    className="h-full w-full object-contain p-1.5"
                    fallbackClassName="text-xl font-bold text-muted-foreground"
                  />
                </div>
                <div className="text-center">
                  <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">{brand.name}</h3>
                  {brand.voucher_count > 0 ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{brand.voucher_count} mã</p>
                  ) : (
                    <Badge variant="secondary" className="mt-2 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                      Sắp có ưu đãi
                    </Badge>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
