import React from 'react';
import { Tag, Shield, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-6">Giới Thiệu</h1>

      <div className="prose prose-sm sm:prose max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          <strong>Mã Giảm Giá Pro</strong> là website tổng hợp mã giảm giá, voucher, coupon và deal hot nhất từ các sàn thương mại điện tử hàng đầu Việt Nam như Shopee, Lazada, Tiki, TikTok Shop và hàng trăm thương hiệu uy tín khác.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { icon: Tag, title: 'Miễn Phí 100%', desc: 'Tất cả mã giảm giá trên website đều hoàn toàn miễn phí' },
            { icon: Zap, title: 'Cập Nhật Liên Tục', desc: 'Mã được cập nhật tự động mỗi ngày từ các nguồn uy tín' },
            { icon: Shield, title: 'Đã Xác Minh', desc: 'Mã được kiểm tra và xác minh trước khi đăng tải' },
            { icon: Heart, title: 'Dễ Sử Dụng', desc: 'Chỉ cần copy mã và dán vào ô giảm giá khi thanh toán' },
          ].map(item => (
            <div key={item.title} className="bg-card rounded-xl border border-border p-5">
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold font-heading mb-3">Sứ mệnh</h2>
        <p className="text-muted-foreground mb-6">
          Chúng tôi mong muốn giúp người tiêu dùng Việt Nam tiết kiệm tối đa khi mua sắm online bằng cách cung cấp những mã giảm giá chất lượng, được cập nhật thường xuyên và dễ dàng sử dụng.
        </p>

        <h2 className="text-xl font-bold font-heading mb-3">Affiliate Disclosure</h2>
        <p className="text-muted-foreground mb-6">
          Website có thể nhận hoa hồng khi bạn mua hàng thông qua các liên kết trên trang. Điều này không ảnh hưởng đến giá sản phẩm bạn mua. Giá và khuyến mãi có thể thay đổi theo từng thời điểm, vui lòng kiểm tra trên trang bán hàng trước khi quyết định mua.
        </p>
      </div>
    </div>
  );
}