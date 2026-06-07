import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import VoucherGrid from '../components/voucher/VoucherGrid';

export default function CategoryDetail() {
  const slug = window.location.pathname.split('/danh-muc/')[1];

  const { data: categories = [], isLoading: loadingCat } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => localClient.entities.Category.filter({ slug }),
    enabled: !!slug,
  });

  const category = categories[0];

  const { data: vouchers = [], isLoading: loadingVouchers } = useQuery({
    queryKey: ['category-vouchers', category?.id],
    queryFn: () => localClient.entities.Voucher.filter({ category_id: category.id, status: 'active' }, '-created_date', 50),
    enabled: !!category,
  });

  if (loadingCat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">📂</p>
        <h1 className="text-xl font-bold mb-2">Không tìm thấy danh mục</h1>
        <Link to="/danh-muc"><Button className="rounded-full mt-4">Xem danh mục khác</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/danh-muc" className="hover:text-primary">Danh mục</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Mã Giảm Giá {category.name}</h1>
        {category.description && <p className="text-muted-foreground">{category.description}</p>}
      </div>

      <VoucherGrid vouchers={vouchers} loading={loadingVouchers} emptyMessage={`Chưa có mã giảm giá cho danh mục ${category.name}`} />
    </div>
  );
}