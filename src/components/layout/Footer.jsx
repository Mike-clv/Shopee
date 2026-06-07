import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const footerLinks = {
  'Mã Giảm Giá': [
    { name: 'Mã Hot Hôm Nay', path: '/ma-giam-gia?filter=hot' },
    { name: 'Mã Mới Nhất', path: '/ma-giam-gia?filter=newest' },
    { name: 'Mã Sắp Hết Hạn', path: '/ma-giam-gia?filter=expiring' },
    { name: 'Deal Freeship', path: '/ma-giam-gia?filter=freeship' },
  ],
  'Sàn TMĐT': [
    { name: 'Shopee', path: '/san/shopee' },
    { name: 'Lazada', path: '/san/lazada' },
    { name: 'Tiki', path: '/san/tiki' },
    { name: 'TikTok Shop', path: '/san/tiktok-shop' },
  ],
  'Thông Tin': [
    { name: 'Giới Thiệu', path: '/gioi-thieu' },
    { name: 'Blog', path: '/blog' },
    { name: 'Liên Hệ', path: '/lien-he' },
    { name: 'Chính Sách', path: '/chinh-sach' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer-glow relative overflow-hidden bg-card border-t border-border mt-16">
      <div className="footer-finish-line" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="brand-mark w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="brand-title text-lg font-bold font-heading">Mã Giảm Giá Pro</h3>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-sm">
              Tổng hợp mã giảm giá, voucher, coupon, deal hot nhất từ Shopee, Lazada, Tiki, TikTok Shop và hàng trăm thương hiệu uy tín.
            </p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              ⚠️ Website có thể nhận hoa hồng khi bạn mua hàng qua các liên kết affiliate. Giá và voucher có thể thay đổi, vui lòng kiểm tra trên trang bán hàng trước khi mua.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold font-heading text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Mã Giảm Giá Pro. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/chinh-sach" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Chính Sách Bảo Mật
            </Link>
            <Link to="/dieu-khoan" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Điều Khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
