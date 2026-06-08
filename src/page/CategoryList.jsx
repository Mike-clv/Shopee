import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import {
  Baby,
  BookOpen,
  Heart,
  Home as HomeIcon,
  Plane,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, CATEGORY_KEYWORDS, mergeKeywords } from '@/lib/site';

const iconMap = {
  Shirt,
  Sparkles,
  Baby,
  Smartphone,
  Home: HomeIcon,
  Heart,
  Plane,
  BookOpen,
  UtensilsCrossed,
  Wifi,
  ShoppingBag,
  Store,
};

export default function CategoryList() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => localClient.entities.Category.filter({ is_active: true }, 'sort_order', 50),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Seo
        title="Danh mục mã giảm giá theo ngành hàng"
        description="Tìm mã giảm giá theo từng ngành hàng như thời trang, mỹ phẩm, điện tử, đồ ăn, du lịch, mẹ và bé cùng nhiều danh mục khác."
        path="/danh-muc"
        keywords={mergeKeywords(BASE_KEYWORDS, CATEGORY_KEYWORDS, [
          'mã giảm giá thời trang',
          'ma giam gia thoi trang',
          'mã giảm giá mỹ phẩm',
          'ma giam gia my pham',
        ])}
      />

      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Danh mục</h1>
      <p className="text-muted-foreground mb-8">Tìm mã giảm giá theo ngành hàng.</p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-2xl border p-6">
              <Skeleton className="w-14 h-14 rounded-xl mx-auto mb-3" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || ShoppingBag;

            return (
              <Link
                key={category.id}
                to={`/danh-muc/${category.slug}`}
                className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all p-6 text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-semibold group-hover:text-primary transition-colors mb-1">{category.name}</h2>
                {category.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                )}
                {category.voucher_count > 0 && (
                  <p className="text-xs text-primary font-medium mt-2">{category.voucher_count} mã giảm giá</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
