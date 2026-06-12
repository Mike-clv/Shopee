import React, { useLayoutEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Check, Flame, BadgeCheck, Star, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import VoucherGrid from '../components/voucher/VoucherGrid';
import CopyModal from '../components/voucher/CopyModal';
import BrandLogo from '@/components/brand/BrandLogo';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, VOUCHER_PAGE_KEYWORDS, mergeKeywords } from '@/lib/site';

const typeLabels = {
  coupon: 'Mã giảm giá', deal: 'Ưu đãi', cashback: 'Hoàn tiền',
  freeship: 'Miễn phí vận chuyển', flash_sale: 'Siêu sale', exclusive: 'Độc quyền',
};

export default function VoucherDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = window.location.pathname.split('/ma-giam-gia/')[1];
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['voucher', slug],
    queryFn: async () => {
      const bySlug = await localClient.entities.Voucher.filter({ slug });
      if (bySlug.length) return bySlug;
      return await localClient.entities.Voucher.filter({ id: slug });
    },
    enabled: !!slug,
  });

  const voucher = vouchers[0];

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 120);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [slug, voucher?.id]);

  const { data: relatedVouchers = [] } = useQuery({
    queryKey: ['related-vouchers', voucher?.brand_id, voucher?.category_id],
    queryFn: async () => {
      if (voucher?.brand_id) {
        return localClient.entities.Voucher.filter({ brand_id: voucher.brand_id, status: 'active' }, '-created_date', 6);
      }
      return localClient.entities.Voucher.filter({ status: 'active' }, '-created_date', 6);
    },
    enabled: !!voucher,
  });

  const handleCopy = async () => {
    if (!voucher?.code) return;
    localClient.analytics.track({
      eventType: 'copy',
      voucher,
      sourcePage: window.location.pathname,
    }).catch(() => {});
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setShowModal(true);
      toast.success('Đã sao chép mã: ' + voucher.code);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setShowModal(true);
    }
  };

  const handleGoToShop = () => {
    if (!voucher) return;
    localClient.analytics.track({
      eventType: 'click',
      voucher,
      sourcePage: window.location.pathname,
    }).catch(() => {});
    const url = voucher.tracking_url || voucher.original_url || '#';
    window.open(url, '_blank', 'noopener');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-full max-w-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😢</p>
        <h1 className="text-xl font-bold mb-2">Không tìm thấy mã giảm giá</h1>
        <p className="text-muted-foreground mb-6">Mã này có thể đã hết hạn hoặc không tồn tại</p>
        <Link to="/ma-giam-gia"><Button className="rounded-full">Xem mã khác</Button></Link>
      </div>
    );
  }

  const daysLeft = voucher.end_date ? Math.ceil((new Date(voucher.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Seo
        title={`${voucher.title}${voucher.brand_name ? ` - ${voucher.brand_name}` : ''}`}
        description={voucher.description || voucher.terms || `Mã giảm giá ${voucher.brand_name || ''} mới nhất, cập nhật điều kiện sử dụng và ưu đãi nổi bật.`}
        path={`/ma-giam-gia/${voucher.slug || voucher.id}`}
        image={voucher.image || voucher.brand_logo}
        type="article"
        keywords={mergeKeywords(BASE_KEYWORDS, VOUCHER_PAGE_KEYWORDS, [
          voucher.title,
          voucher.brand_name ? `mã giảm giá ${voucher.brand_name}` : '',
          voucher.brand_name ? `voucher ${voucher.brand_name}` : '',
          voucher.platform ? `mã giảm giá ${voucher.platform}` : '',
        ])}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/ma-giam-gia" className="hover:text-primary">Mã giảm giá</Link>
        {voucher.brand_name && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground">{voucher.brand_name}</span>
          </>
        )}
      </nav>

      {/* Main card */}
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
            <BrandLogo
              brand={voucher}
              alt={voucher.brand_name || voucher.title}
              className="w-full h-full object-contain p-2"
              fallbackClassName="text-2xl font-bold text-muted-foreground"
              loading="eager"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {voucher.brand_name && <span className="text-sm font-medium text-muted-foreground">{voucher.brand_name}</span>}
              {voucher.is_hot && <Badge className="bg-red-100 text-red-700 text-[10px]"><Flame className="mr-0.5 h-3 w-3" /> Mã hot</Badge>}
              {voucher.is_verified && <Badge className="bg-green-100 text-green-700 text-[10px]"><BadgeCheck className="mr-0.5 h-3 w-3" /> Đã xác minh</Badge>}
              {voucher.is_exclusive && <Badge className="bg-amber-100 text-amber-700 text-[10px]"><Star className="w-3 h-3 mr-0.5" /> Độc quyền</Badge>}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading mb-2">{voucher.title}</h1>
            {voucher.discount_value && (
              <p className="text-lg font-bold text-primary">{voucher.discount_value}</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary/50 rounded-xl p-4 sm:p-6 mb-6">
          {voucher.code ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs text-muted-foreground mb-2">Mã giảm giá</p>
                <div className="border-2 border-dashed border-primary/40 rounded-lg px-6 py-3 bg-card inline-block">
                  <span className="text-xl font-mono font-bold text-primary tracking-widest">{voucher.code}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCopy} size="lg" variant="outline" className="rounded-full gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Đã sao chép' : 'Sao chép mã'}
                </Button>
                <Button onClick={handleGoToShop} size="lg" className="rounded-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Mua ngay
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-3 text-sm text-muted-foreground">Ưu đãi không cần mã - bấm để xem chi tiết</p>
              <Button onClick={handleGoToShop} size="lg" className="rounded-full gap-2 px-8">
                <ExternalLink className="w-4 h-4" />
                Xem deal ngay
              </Button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {voucher.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Mô tả</h3>
              <p className="text-sm text-muted-foreground">{voucher.description}</p>
            </div>
          )}
          {voucher.terms && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Điều kiện áp dụng</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{voucher.terms}</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {voucher.voucher_type && (
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Loại</p>
                <p className="text-sm font-medium">{typeLabels[voucher.voucher_type]}</p>
              </div>
            )}
            {voucher.min_order_value && (
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Đơn tối thiểu</p>
                <p className="text-sm font-medium">{voucher.min_order_value}</p>
              </div>
            )}
            {voucher.end_date && (
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">Hạn sử dụng</p>
                <p className="text-sm font-medium">{new Date(voucher.end_date).toLocaleDateString('vi-VN')}</p>
              </div>
            )}
            {daysLeft !== null && (
              <div className={`rounded-lg p-3 ${daysLeft <= 3 ? 'bg-red-50 dark:bg-red-950' : 'bg-secondary'}`}>
                <p className="text-[10px] text-muted-foreground mb-0.5">Còn lại</p>
                <p className={`text-sm font-medium ${daysLeft <= 3 ? 'text-red-600' : ''}`}>
                  {daysLeft > 0 ? `${daysLeft} ngày` : 'Hết hạn'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedVouchers.filter(v => v.id !== voucher.id).length > 0 && (
        <div>
          <h2 className="text-lg font-bold font-heading mb-4">Mã Giảm Giá Liên Quan</h2>
          <VoucherGrid vouchers={relatedVouchers.filter(v => v.id !== voucher.id).slice(0, 4)} loading={false} />
        </div>
      )}

      {showModal && voucher.code && <CopyModal voucher={voucher} onClose={() => setShowModal(false)} copied={copied} />}
    </div>
  );
}
