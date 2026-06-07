import React from 'react';
import VoucherCard from './VoucherCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function VoucherGrid({ vouchers, loading, variant = 'default', emptyMessage = 'Chưa có mã giảm giá nào' }) {
  if (loading) {
    return (
      <div className="grid gap-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4 sm:p-5">
            <div className="flex gap-4">
              <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full max-w-xs" />
                <Skeleton className="h-3 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <div className="shrink-0 space-y-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!vouchers?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🎫</p>
        <p className="text-muted-foreground font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {vouchers.map(voucher => (
        <VoucherCard key={voucher.id} voucher={voucher} variant={variant} />
      ))}
    </div>
  );
}