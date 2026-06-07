import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Sparkles, Baby, Smartphone, Home, Heart, Plane, BookOpen, UtensilsCrossed, Wifi, ShoppingBag, Store } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  'Shirt': Shirt,
  'Sparkles': Sparkles,
  'Baby': Baby,
  'Smartphone': Smartphone,
  'Home': Home,
  'Heart': Heart,
  'Plane': Plane,
  'BookOpen': BookOpen,
  'UtensilsCrossed': UtensilsCrossed,
  'Wifi': Wifi,
  'ShoppingBag': ShoppingBag,
  'Store': Store,
};

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading">Danh Mục Phổ Biến</h2>
          <Link to="/danh-muc" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
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
                  className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">{cat.name}</span>
                  <span className="text-[10px] text-muted-foreground">{cat.voucher_count || 0} mã</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
