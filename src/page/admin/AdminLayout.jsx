import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Tag,
  Store,
  FolderOpen,
  FileText,
  RefreshCw,
  BarChart3,
  ArrowLeft,
  Images,
  Newspaper,
  Flame,
  Menu,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Tag, label: 'Vouchers', path: '/admin/vouchers' },
  { icon: Store, label: 'Thương hiệu', path: '/admin/brands' },
  { icon: FolderOpen, label: 'Danh mục', path: '/admin/categories' },
  { icon: FileText, label: 'Blog', path: '/admin/blog' },
  { icon: Images, label: 'Banner đầu trang', path: '/admin/banners' },
  { icon: Flame, label: 'Banner mã hot', path: '/admin/hot-banners' },
  { icon: Newspaper, label: 'Quan tâm', path: '/admin/interests' },
  { icon: RefreshCw, label: 'Sync', path: '/admin/sync' },
  { icon: BarChart3, label: 'Thống kê', path: '/admin/stats' },
];

export default function AdminLayout() {
  const location = useLocation();
  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="flex items-center justify-between gap-3 px-3 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Admin CMS</p>
            <p className="truncate text-sm font-semibold">{currentItem.label}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Link to="/" aria-label="Về trang chủ">
                <Home className="h-4 w-4" />
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label="Mở menu admin">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
                <div className="flex h-full flex-col">
                  <SheetHeader className="border-b border-border px-5 py-4 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Admin CMS</p>
                    <SheetTitle className="text-left text-lg">{currentItem.label}</SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navItems.map(item => (
                      <SheetClose asChild key={item.path}>
                        <Link
                          to={item.path}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                            location.pathname === item.path
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  <div className="border-t border-border p-3">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Về trang chủ
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="px-3 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors',
                  location.pathname === item.path
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="sticky top-0 hidden min-h-screen w-60 flex-col border-r border-border bg-card lg:flex">
          <div className="border-b border-border p-4">
            <Link to="/" className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Link>
            <h2 className="font-heading text-lg font-bold">Admin CMS</h2>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
