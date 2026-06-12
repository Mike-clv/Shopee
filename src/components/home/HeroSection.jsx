import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Percent, Search, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AccessTradeCouponEmbed from '@/components/accesstrade/AccessTradeCouponEmbed';

const dealTypes = [
  { name: 'Mã giảm giá', path: '/ma-giam-gia', icon: Percent },
  { name: 'Mã hot', path: '/ma-giam-gia?filter=hot', icon: Flame, hot: true },
  { name: 'Miễn phí vận chuyển', path: '/ma-giam-gia?type=freeship', icon: Truck },
  { name: 'Siêu sale', path: '/ma-giam-gia?type=flash_sale', icon: Zap },
];

const platforms = [
  { name: 'Shopee', path: '/san/shopee' },
  { name: 'Lazada', path: '/san/lazada' },
  { name: 'Tiki', path: '/san/tiki' },
  { name: 'TikTok Shop', path: '/san/tiktok-shop' },
];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [couponBoardOpen, setCouponBoardOpen] = useState(false);
  const navigate = useNavigate();

  const openCouponBoard = () => {
    setCouponBoardOpen(true);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) {
      navigate(`/tim-kiem?q=${encodeURIComponent(value)}`);
    } else {
      openCouponBoard();
    }
    setQuery('');
  };

  return (
    <section className="hero-section relative overflow-hidden bg-background">
      <div className="hero-scanline" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="hero-title-pro text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-foreground leading-tight mb-4">
            Săn <span className="hero-highlight">Mã Giảm Giá</span> &amp;{' '}
            <br />
            Ưu Đãi Nổi Bật Mỗi Ngày
          </h2>
          <p className="hero-subtitle text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Tổng hợp voucher, coupon, deal từ Shopee, Lazada, Tiki, TikTok Shop và hàng trăm thương hiệu
          </p>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <button
                type="button"
                onClick={openCouponBoard}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Mở bảng mã giảm giá đầy đủ"
              >
                <Search className="w-5 h-5" />
              </button>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onPointerDown={(event) => {
                  event.preventDefault();
                  openCouponBoard();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCouponBoard();
                  }
                }}
                readOnly
                aria-haspopup="dialog"
                placeholder="Tìm mã giảm giá, voucher, thương hiệu..."
                className="pl-12 pr-24 h-[52px] rounded-full text-base bg-card border-border shadow-sm focus-visible:ring-primary cursor-pointer"
              />
              <Button type="button" onClick={openCouponBoard} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-10 px-5">
                Tìm kiếm
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {dealTypes.map((type) => (
              <Button key={type.path} asChild variant="outline" size="sm" className="deal-chip rounded-full bg-card/80 gap-1.5">
                <Link to={type.path}>
                  <type.icon className={`w-3.5 h-3.5 ${type.hot ? 'flame-svg' : ''}`} />
                  {type.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-10 mt-10 sm:mt-14">
          {platforms.map((platform) => (
            <Link
              key={platform.path}
              to={platform.path}
              className="hero-platform-link text-sm sm:text-base font-semibold text-muted-foreground/70 hover:text-primary transition-colors"
            >
              {platform.name}
            </Link>
          ))}
        </div>
      </div>

      <Dialog open={couponBoardOpen} onOpenChange={setCouponBoardOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-6xl max-h-[92vh] gap-0 overflow-hidden p-0">
          <DialogHeader className="px-4 sm:px-5 py-3 border-b border-border bg-card pr-12">
            <DialogTitle className="text-base sm:text-lg font-bold font-heading">Bảng mã giảm giá đầy đủ</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(92vh-58px)] overflow-y-auto bg-[#e5ebed]">
            <AccessTradeCouponEmbed showHeader={false} />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
