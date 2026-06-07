import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import VoucherGrid from '../components/voucher/VoucherGrid';
import AccessTradeCouponEmbed from '../components/accesstrade/AccessTradeCouponEmbed';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialQ = params.get('q') || '';
  const initialEmbed = params.get('embed') === '1' || !initialQ;
  const [query, setQuery] = useState(initialQ);
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [showEmbed, setShowEmbed] = useState(initialEmbed);

  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    const nextQuery = nextParams.get('q') || '';
    setQuery(nextQuery);
    setSearchTerm(nextQuery);
    setShowEmbed(nextParams.get('embed') === '1' || !nextQuery);
  }, [location.search]);

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['vouchers', 'search'],
    queryFn: () => localClient.entities.Voucher.filter({ status: 'active' }, '-created_date', 200),
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return vouchers.filter(v =>
      (v.title || '').toLowerCase().includes(q) ||
      (v.code || '').toLowerCase().includes(q) ||
      (v.brand_name || '').toLowerCase().includes(q) ||
      (v.description || '').toLowerCase().includes(q) ||
      (v.category_name || '').toLowerCase().includes(q)
    );
  }, [vouchers, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = query.trim();
    setSearchTerm(value);
    setShowEmbed(!value);
    navigate(value ? `/tim-kiem?q=${encodeURIComponent(value)}` : '/tim-kiem?embed=1', { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-6">Tìm Kiếm</h1>

      <form onSubmit={handleSearch} className="max-w-2xl mb-8">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSearchTerm('');
              setShowEmbed(true);
              navigate('/tim-kiem?embed=1', { replace: true });
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Mở bảng mã giảm giá đầy đủ"
          >
            <Search className="w-5 h-5" />
          </button>
          <Input
            placeholder="Tìm mã giảm giá, voucher, thương hiệu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-24 h-12 rounded-full text-base"
          />
          <Button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-9 px-5">
            Tìm
          </Button>
        </div>
      </form>

      {searchTerm && (
        <p className="text-sm text-muted-foreground mb-4">
          Tìm thấy <strong>{filtered.length}</strong> kết quả cho "<strong>{searchTerm}</strong>"
        </p>
      )}

      {showEmbed && (
        <div className="mb-8">
          <AccessTradeCouponEmbed />
        </div>
      )}

      {searchTerm && (
        <VoucherGrid
          vouchers={filtered}
          loading={isLoading}
          emptyMessage={`Không tìm thấy kết quả cho "${searchTerm}"`}
        />
      )}
    </div>
  );
}
