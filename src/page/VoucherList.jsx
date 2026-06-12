import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import VoucherGrid from '../components/voucher/VoucherGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, VOUCHER_PAGE_KEYWORDS, mergeKeywords } from '@/lib/site';

const platformOptions = [
  { value: 'all', label: 'Tất cả sàn' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiki', label: 'Tiki' },
  { value: 'tiktok_shop', label: 'TikTok Shop' },
];

const typeOptions = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'coupon', label: 'Mã giảm giá' },
  { value: 'deal', label: 'Ưu đãi' },
  { value: 'cashback', label: 'Hoàn tiền' },
  { value: 'freeship', label: 'Miễn phí vận chuyển' },
  { value: 'flash_sale', label: 'Siêu sale' },
  { value: 'exclusive', label: 'Độc quyền' },
];

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'hot', label: 'Hot nhất' },
  { value: 'expiring', label: 'Sắp hết hạn' },
  { value: 'clicks', label: 'Nhiều lượt click' },
];

export default function VoucherList() {
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('filter') || '';
  const initialType = params.get('type') || 'all';
  const initialPlatform = params.get('platform') || 'all';

  const [platform, setPlatform] = useState(initialPlatform);
  const [type, setType] = useState(initialType);
  const [sort, setSort] = useState(initialFilter === 'hot' ? 'hot' : initialFilter === 'expiring' ? 'expiring' : 'newest');

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['vouchers', 'all'],
    queryFn: () => localClient.entities.Voucher.filter({ status: 'active' }, '-created_date', 100),
  });

  const filtered = useMemo(() => {
    let result = [...vouchers];

    if (platform !== 'all') result = result.filter(v => v.platform === platform);
    if (type !== 'all') result = result.filter(v => v.voucher_type === type);

    switch (sort) {
      case 'hot':
        result.sort((a, b) => (b.is_hot ? 1 : 0) - (a.is_hot ? 1 : 0) || (b.click_count || 0) - (a.click_count || 0));
        break;
      case 'expiring':
        result.sort((a, b) => {
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;
          return new Date(a.end_date) - new Date(b.end_date);
        });
        break;
      case 'clicks':
        result.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
        break;
      default:
        break;
    }

    return result;
  }, [vouchers, platform, type, sort]);

  const hasFilters = platform !== 'all' || type !== 'all';

  const clearFilters = () => {
    setPlatform('all');
    setType('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Seo
        title="Mã giảm giá hôm nay - voucher Shopee, Lazada, Tiki, TikTok Shop"
        description="Tổng hợp mã giảm giá hôm nay, voucher Shopee, Lazada, Tiki, TikTok Shop và deal hot mới nhất từ nhiều sàn thương mại điện tử."
        path="/ma-giam-gia"
        keywords={mergeKeywords(BASE_KEYWORDS, VOUCHER_PAGE_KEYWORDS)}
      />
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Mã Giảm Giá</h1>
        <p className="text-muted-foreground">Tổng hợp mã giảm giá, voucher, deal hot nhất hôm nay</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-border">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-36 h-9 rounded-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36 h-9 rounded-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40 h-9 rounded-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 rounded-full text-xs gap-1">
            <X className="w-3 h-3" /> Bỏ lọc
          </Button>
        )}
        <Badge variant="secondary" className="ml-auto text-xs">{filtered.length} kết quả</Badge>
      </div>

      <VoucherGrid vouchers={filtered} loading={isLoading} />
    </div>
  );
}
