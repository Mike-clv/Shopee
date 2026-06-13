import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Sparkles, Baby, Smartphone, Home, Heart, Plane, BookOpen, UtensilsCrossed, Wifi, ShoppingBag, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  Shirt,
  Sparkles,
  Baby,
  Smartphone,
  Home,
  Heart,
  Plane,
  BookOpen,
  UtensilsCrossed,
  Wifi,
  ShoppingBag,
  Store,
};

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading sm:text-2xl">Danh Mục Phổ Biến</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || ShoppingBag;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/danh-muc/${cat.slug}`}
                  className="group flex min-h-[152px] flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition-all hover:border-primary/30 hover:shadow-md sm:p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  </div>
                  <span className="line-clamp-1 text-xs font-medium text-foreground sm:text-sm">{cat.name}</span>
                  {cat.voucher_count > 0 ? (
                    <span className="text-[10px] text-muted-foreground">{cat.voucher_count} mã</span>
                  ) : (
                    <Badge variant="secondary" className="mt-auto rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                      Sắp có
                    </Badge>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
