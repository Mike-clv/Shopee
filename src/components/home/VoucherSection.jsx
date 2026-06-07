import React from 'react';
import { Link } from 'react-router-dom';
import VoucherGrid from '../voucher/VoucherGrid';

export default function VoucherSection({ title, vouchers, loading, linkTo, linkText = 'Xem tất cả →', emptyMessage, emptyFallback = null }) {
  const isHotTitle = title?.startsWith('🔥');
  const cleanTitle = isHotTitle ? title.replace(/^🔥\s*/, '') : title;
  const showFallback = !loading && !vouchers?.length && emptyFallback;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold font-heading flex items-center min-w-0">
            {isHotTitle && <span className="flame-pop mr-2 shrink-0" aria-hidden="true">🔥</span>}
            <span className="truncate">{cleanTitle}</span>
          </h2>
          {linkTo && (
            <Link to={linkTo} className="text-sm font-medium text-primary hover:underline whitespace-nowrap">
              {linkText}
            </Link>
          )}
        </div>
        {showFallback ? emptyFallback : (
          <VoucherGrid vouchers={vouchers} loading={loading} emptyMessage={emptyMessage} />
        )}
      </div>
    </section>
  );
}
