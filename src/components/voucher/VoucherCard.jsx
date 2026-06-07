import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  ExternalLink,
  Clock,
  Flame,
  BadgeCheck,
  Star,
  Truck,
  Percent,
  Gift,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { localClient } from '@/api/localClient';
import CopyModal from './CopyModal';
import BrandLogo from '@/components/brand/BrandLogo';

const typeConfig = {
  coupon: { label: 'Mã giảm giá', icon: Percent, color: 'bg-orange-100 text-orange-700' },
  deal: { label: 'Deal', icon: Zap, color: 'bg-blue-100 text-blue-700' },
  cashback: { label: 'Hoàn tiền', icon: Gift, color: 'bg-green-100 text-green-700' },
  freeship: { label: 'Freeship', icon: Truck, color: 'bg-purple-100 text-purple-700' },
  flash_sale: { label: 'Flash Sale', icon: Zap, color: 'bg-red-100 text-red-700' },
  exclusive: { label: 'Độc quyền', icon: Star, color: 'bg-amber-100 text-amber-700' },
};

const platformColors = {
  shopee: 'bg-orange-500',
  lazada: 'bg-blue-600',
  tiki: 'bg-blue-500',
  tiktok_shop: 'bg-black',
  sendo: 'bg-red-500',
  other: 'bg-gray-500',
};

const platformNames = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiki: 'Tiki',
  tiktok_shop: 'TikTok Shop',
  sendo: 'Sendo',
  other: 'Khác',
};

function getDaysLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderDiscountText(voucher) {
  if (!voucher.discount_value) return null;

  if (voucher.discount_type === 'percent') return `Giảm ${voucher.discount_value}`;
  if (voucher.discount_type === 'fixed') return `Giảm ${voucher.discount_value}`;
  if (voucher.discount_type === 'cashback') return `Hoàn ${voucher.discount_value}`;
  if (voucher.discount_type === 'freeship') return 'Miễn phí vận chuyển';
  return voucher.discount_value;
}

function renderCodePreview(code, maxLength = 13) {
  if (!code) return '';
  if (code.length <= maxLength) return code;
  return `${code.slice(0, maxLength)}...`;
}

export default function VoucherCard({ voucher, variant = 'default' }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const config = typeConfig[voucher.voucher_type] || typeConfig.coupon;
  const TypeIcon = config.icon;
  const daysLeft = getDaysLeft(voucher.end_date);
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 3;
  const isCompact = variant === 'compact';
  const discountText = renderDiscountText(voucher);

  const trackClick = async (type) => {
    localClient.entities.ClickEvent.create({
      voucher_id: voucher.id,
      brand_id: voucher.brand_id || '',
      event_type: type,
      source_page: window.location.pathname,
      voucher_title: voucher.title,
      brand_name: voucher.brand_name || '',
    }).catch(() => {});
  };

  const handleGetCode = async () => {
    if (voucher.code) {
      setShowModal(true);
      await trackClick('click');

      try {
        await navigator.clipboard.writeText(voucher.code);
        setCopied(true);
        toast.success(`Đã copy mã: ${voucher.code}`);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        toast.info('Vui lòng copy mã thủ công');
      }

      return;
    }

    await trackClick('click');
    const url = voucher.tracking_url || voucher.original_url || '#';
    window.open(url, '_blank', 'noopener');
  };

  return (
    <>
      <div
        className={`group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${
          isExpired ? 'opacity-60' : ''
        }`}
      >
        <div className={`p-4 ${isCompact ? '' : 'sm:p-5'}`}>
          <div className="flex gap-3 sm:gap-4">
            <div className="shrink-0">
              <div
                className={`flex items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary ${
                  isCompact ? 'h-12 w-12' : 'h-12 w-12 sm:h-16 sm:w-16'
                }`}
              >
                <BrandLogo
                  brand={voucher}
                  alt={voucher.brand_name || voucher.title}
                  className="h-full w-full object-contain p-1.5"
                  fallbackClassName="text-lg font-bold text-muted-foreground"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {voucher.brand_name && (
                    <span className="text-xs font-medium text-muted-foreground">{voucher.brand_name}</span>
                  )}
                  {voucher.platform && (
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${platformColors[voucher.platform]}`}
                      title={platformNames[voucher.platform]}
                    />
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {voucher.is_hot && <Flame className="h-4 w-4 text-red-500" />}
                  {voucher.is_verified && <BadgeCheck className="h-4 w-4 text-green-500" />}
                  {voucher.is_exclusive && <Star className="h-4 w-4 text-amber-500" />}
                </div>
              </div>

              <Link to={`/ma-giam-gia/${voucher.slug || voucher.id}`} className="block">
                <h3
                  className={`line-clamp-2 font-heading font-semibold text-foreground transition-colors group-hover:text-primary ${
                    isCompact ? 'text-sm' : 'text-sm sm:text-base'
                  }`}
                >
                  {voucher.title}
                </h3>
              </Link>

              {discountText && (
                <p className="mt-1 text-sm font-bold text-primary">
                  {discountText}
                  {voucher.max_discount && ` (tối đa ${voucher.max_discount})`}
                </p>
              )}

              {!isCompact && voucher.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1">
                  {voucher.description}
                </p>
              )}

              <div className="mt-3 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className={`px-2 py-0.5 text-[10px] ${config.color}`}>
                    <TypeIcon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>

                  {isExpiringSoon && !isExpired && (
                    <Badge variant="secondary" className="bg-red-100 px-2 py-0.5 text-[10px] text-red-700">
                      <Clock className="mr-1 h-3 w-3" />
                      Còn {daysLeft} ngày
                    </Badge>
                  )}

                  {isExpired && (
                    <Badge variant="secondary" className="bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                      Hết hạn
                    </Badge>
                  )}

                  {voucher.min_order_value && (
                    <span className="text-[10px] text-muted-foreground">Đơn từ {voucher.min_order_value}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  {voucher.code ? (
                    <div className="w-full sm:max-w-[200px]">
                      <div
                        className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 px-3 py-2"
                        title={voucher.code}
                      >
                        <span className="block truncate text-[11px] font-mono font-bold leading-4 text-primary sm:text-xs sm:tracking-wider">
                          {renderCodePreview(voucher.code)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  <Button
                    onClick={handleGetCode}
                    disabled={isExpired}
                    size="sm"
                    className={`w-full justify-center whitespace-nowrap rounded-full text-xs font-semibold sm:w-auto sm:shrink-0 ${
                      isCompact ? 'h-8 px-3' : 'h-9 px-4'
                    }`}
                  >
                    {voucher.code ? (
                      <>
                        <Copy className="mr-1 h-3.5 w-3.5" />
                        Lấy mã
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        Xem deal
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CopyModal
          voucher={voucher}
          onClose={() => setShowModal(false)}
          copied={copied}
        />
      )}
    </>
  );
}
