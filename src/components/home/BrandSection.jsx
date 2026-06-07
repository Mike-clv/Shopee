import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading-pro text-xl sm:text-2xl font-bold font-heading">Thương Hiệu Nổi Bật</h2>
          <Link to="/thuong-hieu" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={platformRoutes[brand.platform] || `/thuong-hieu/${brand.slug}`}
                className="platform-card-lift flex flex-col items-center gap-3 p-4 sm:p-5 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="brand-logo-float w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-secondary flex items-center justify-center overflow-hidden border border-border">
                  <BrandLogo
                    brand={brand}
                    alt={brand.name}
                    className="w-full h-full object-contain p-1.5"
                    fallbackClassName="text-xl font-bold text-muted-foreground"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">{brand.name}</h3>
                  {brand.voucher_count > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">{brand.voucher_count} mã</p>
                  )}
                  {!brand.voucher_count && (
                    <p className="text-xs text-muted-foreground mt-0.5">0 mã</p>
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
