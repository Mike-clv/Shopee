import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const footerLinks = {
  'Mã giảm giá': [
    { name: 'Mã Hot hôm nay', path: '/ma-giam-gia?filter=hot' },
    { name: 'Mã mới nhất', path: '/ma-giam-gia?filter=newest' },
    { name: 'Mã sắp hết hạn', path: '/ma-giam-gia?filter=expiring' },
    { name: 'Miễn phí vận chuyển', path: '/ma-giam-gia?filter=freeship' },
  ],
  'Sàn TMĐT': [
    { name: 'Shopee', path: '/san/shopee' },
    { name: 'Lazada', path: '/san/lazada' },
    { name: 'Tiki', path: '/san/tiki' },
    { name: 'TikTok Shop', path: '/san/tiktok-shop' },
  ],
  'Thông tin': [
    { name: 'Giới thiệu', path: '/gioi-thieu' },
    { name: 'Blog', path: '/blog' },
    { name: 'Theo dõi giá', path: '/theo-doi-gia' },
    { name: 'Công cụ tính lãi suất', path: '/tinh-tra-gop' },
    { name: 'Liên hệ', path: '/lien-he' },
    { name: 'Chính sách', path: '/chinh-sach' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer-glow relative mt-16 overflow-hidden border-t border-border bg-card">
      <div className="footer-finish-line" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Tag className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="brand-title text-lg font-bold font-heading">Mã Giảm Giá Pro</h3>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Tổng hợp mã giảm giá, voucher, coupon, deal hot nhất từ Shopee, Lazada, Tiki, TikTok Shop và hàng trăm thương hiệu uy tín.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold font-heading">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Mã Giảm Giá Pro. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/chinh-sach" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Chính sách bảo mật
            </Link>
            <Link to="/dieu-khoan" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
