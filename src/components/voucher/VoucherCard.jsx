import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Check, Clock, Flame, BadgeCheck, Star, Truck, Percent, Gift, Zap } from 'lucide-react';
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

export default function VoucherCard({ voucher, variant = 'default' }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const config = typeConfig[voucher.voucher_type] || typeConfig.coupon;
  const TypeIcon = config.icon;
  const daysLeft = getDaysLeft(voucher.end_date);
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 3;

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
        toast.success('Đã copy mã: ' + voucher.code);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        toast.info('Vui lòng copy mã thủ công');
      }
    } else {
      await trackClick('click');
      const url = voucher.tracking_url || voucher.original_url || '#';
      window.open(url, '_blank', 'noopener');
    }
  };

  const handleCopyCode = async () => {
    if (!voucher.code) return;
    await trackClick('copy');
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      toast.success('Đã copy mã: ' + voucher.code);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.info('Vui lòng copy mã thủ công');
    }
  };

  const isCompact = variant === 'compact';
  return (
    <>
      <div className={`group bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden ${isExpired ? 'opacity-60' : ''}`}>
        <div className={`p-4 ${isCompact ? '' : 'sm:p-5'}`}>
          <div className="flex gap-3 sm:gap-4">
            {/* Brand logo */}
            <div className="shrink-0">
              <div className={`${isCompact ? 'w-12 h-12' : 'w-14 h-14 sm:w-16 sm:h-16'} rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border`}>
                <BrandLogo
                  brand={voucher}
                  alt={voucher.brand_name || voucher.title}
                  className="w-full h-full object-contain p-1.5"
                  fallbackClassName="text-lg font-bold text-muted-foreground"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {voucher.brand_name && (
                    <span className="text-xs font-medium text-muted-foreground">{voucher.brand_name}</span>
                  )}
                  {voucher.platform && (
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${platformColors[voucher.platform]}`} title={platformNames[voucher.platform]} />
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {voucher.is_hot && <Flame className="w-4 h-4 text-red-500" />}
                  {voucher.is_verified && <BadgeCheck className="w-4 h-4 text-green-500" />}
                  {voucher.is_exclusive && <Star className="w-4 h-4 text-amber-500" />}
                </div>
              </div>

              <Link to={`/ma-giam-gia/${voucher.slug || voucher.id}`} className="block">
                <h3 className={`font-semibold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 ${isCompact ? 'text-sm' : 'text-sm sm:text-base'}`}>
                  {voucher.title}
                </h3>
              </Link>

              {voucher.discount_value && (
                <p className="text-primary font-bold text-sm mt-1">
                  {voucher.discount_type === 'percent' && `Giảm ${voucher.discount_value}`}
                  {voucher.discount_type === 'fixed' && `Giảm ${voucher.discount_value}`}
                  {voucher.discount_type === 'cashback' && `Hoàn ${voucher.discount_value}`}
                  {voucher.discount_type === 'freeship' && 'Miễn phí vận chuyển'}
                  {!['percent', 'fixed', 'cashback', 'freeship'].includes(voucher.discount_type) && voucher.discount_value}
                  {voucher.max_discount && ` (tối đa ${voucher.max_discount})`}
                </p>
              )}

              {!isCompact && voucher.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{voucher.description}</p>
              )}

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${config.color}`}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
                {isExpiringSoon && !isExpired && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700">
                    <Clock className="w-3 h-3 mr-1" />
                    Còn {daysLeft} ngày
                  </Badge>
                )}
                {isExpired && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500">
                    Hết hạn
                  </Badge>
                )}
                {voucher.min_order_value && (
                  <span className="text-[10px] text-muted-foreground">Đơn từ {voucher.min_order_value}</span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className={`shrink-0 flex flex-col items-end justify-between ${isCompact ? 'gap-2' : 'gap-3'}`}>
              {voucher.code ? (
                <div className="text-right">
                  <div className="border-2 border-dashed border-primary/40 rounded-lg px-3 py-1.5 bg-primary/5 relative group/code cursor-pointer" onClick={handleCopyCode}>
                    <span className="text-xs font-mono font-bold text-primary tracking-wider">{voucher.code}</span>
                    <div className="absolute inset-0 bg-primary/90 rounded-lg flex items-center justify-center opacity-0 group-hover/code:opacity-100 transition-opacity">
                      {copied ? (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Copy className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              <Button
                onClick={handleGetCode}
                disabled={isExpired}
                size="sm"
                className={`rounded-full text-xs font-semibold whitespace-nowrap ${isCompact ? 'h-8 px-3' : 'h-9 px-4'}`}
              >
                {voucher.code ? (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Lấy mã
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Xem deal
                  </>
                )}
              </Button>
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
