import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Tag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { localClient } from '@/api/localClient';

const platforms = [
  { name: 'Shopee', slug: 'shopee', color: 'text-orange-500' },
  { name: 'Lazada', slug: 'lazada', color: 'text-blue-600' },
  { name: 'Tiki', slug: 'tiki', color: 'text-blue-500' },
  { name: 'TikTok Shop', slug: 'tiktok-shop', color: 'text-black' },
];

const navLinks = [
  { name: 'Mã Giảm Giá', path: '/ma-giam-gia' },
  { name: 'Mã Hot', path: '/ma-giam-gia?filter=hot', hot: true },
  { name: 'Thương Hiệu', path: '/thuong-hieu' },
  { name: 'Danh Mục', path: '/danh-muc' },
  { name: 'Quan Tâm', path: '/quan-tam' },
  { name: 'Blog', path: '/blog' },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localClient.auth.me().then((user) => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = searchQuery.trim();
    navigate(value ? `/tim-kiem?q=${encodeURIComponent(value)}` : '/tim-kiem?embed=1');
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const openCouponBoard = () => {
    navigate('/tim-kiem?embed=1');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur-md">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-hidden px-4 py-1.5 text-xs font-medium">
          <div className="topbar-marquee min-w-0 flex-1 overflow-hidden">
            <span className="topbar-announcement">🎉 Tổng hợp mã giảm giá, voucher, deal hot nhất hôm nay!</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            {platforms.map((platform) => (
              <Link key={platform.slug} to={`/san/${platform.slug}`} className="topbar-platform-link transition-colors hover:underline">
                {platform.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Tag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="block">
              <h1 className="brand-title whitespace-nowrap text-base font-bold font-heading leading-tight sm:text-lg">Mã Giảm Giá</h1>
              <p className="brand-pro -mt-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">PRO</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden max-w-xl flex-1 md:flex">
            <div className="relative w-full">
              <button
                type="button"
                onClick={openCouponBoard}
                className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label="Mở bảng mã giảm giá"
              >
                <Search className="h-4 w-4" />
              </button>
              <Input
                placeholder="Tìm mã giảm giá, voucher, thương hiệu..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 rounded-full border-0 bg-secondary pl-10 pr-20 focus-visible:ring-primary"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-full px-4">
                Tìm
              </Button>
            </div>
          </form>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.name}
                {link.hot && <span className="flame-pop ml-1" aria-hidden="true">🔥</span>}
              </Link>
            ))}
          </nav>

          {isAdmin && (
            <Link to="/admin" className="ml-2 hidden items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 lg:flex">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Mở menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="p-6">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                      <Tag className="h-4.5 w-4.5 text-primary-foreground" />
                    </div>
                    <span className="font-heading text-base font-bold">Mã Giảm Giá Pro</span>
                  </div>
                  <nav className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                      >
                        {link.name}
                        {link.hot && <span className="flame-pop ml-1" aria-hidden="true">🔥</span>}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                      >
                        <Settings className="h-4 w-4" />
                        Quản trị Admin
                      </Link>
                    )}
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sàn TMĐT</p>
                      {platforms.map((platform) => (
                        <Link
                          key={platform.slug}
                          to={`/san/${platform.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                        >
                          {platform.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <form id="mobile-search" onSubmit={handleSearch} className="mt-3 hidden md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm mã giảm giá..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 rounded-full border-0 bg-secondary pl-10 pr-16"
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-full px-3">
              Tìm
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}
