import React from 'react';
import Seo from '@/components/Seo';

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Seo
        title="Chính sách và điều khoản"
        description="Chính sách bảo mật, điều khoản sử dụng và affiliate disclosure của website Mã Giảm Giá Pro."
        path="/chinh-sach"
      />

      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-6">Chính sách & Điều khoản</h1>

      <div className="prose prose-sm sm:prose max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold font-heading">Chính sách bảo mật</h2>
          <p className="text-muted-foreground">
            Mã Giảm Giá Pro cam kết bảo vệ quyền riêng tư của người dùng. Website không yêu cầu tài
            khoản ngân hàng hay mật khẩu của các sàn thương mại điện tử. Cookie admin local chỉ dùng
            để giữ phiên đăng nhập quản trị.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-heading">Điều khoản sử dụng</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>Mã giảm giá được cung cấp miễn phí và có thể thay đổi theo quyết định của nhà bán hàng.</li>
            <li>Người dùng cần kiểm tra điều kiện áp dụng trên trang bán hàng trước khi mua.</li>
            <li>Mọi giao dịch được thực hiện trực tiếp trên sàn thương mại điện tử hoặc website của nhà bán hàng.</li>
            <li>Admin chịu trách nhiệm cập nhật trạng thái mã hết hạn trong CMS.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold font-heading">Affiliate Disclosure</h2>
          <p className="text-muted-foreground">
            Website có thể sử dụng liên kết affiliate. Khi bạn mua hàng qua các liên kết này, website có
            thể nhận hoa hồng từ nhà bán hàng. Điều này không làm tăng giá sản phẩm bạn mua.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-heading">Disclaimer</h2>
          <p className="text-muted-foreground">
            Mã Giảm Giá Pro không phải đại diện chính thức của bất kỳ sàn thương mại điện tử hay thương
            hiệu nào. Logo và tên thương hiệu thuộc quyền sở hữu của chủ sở hữu tương ứng.
          </p>
        </section>
      </div>
    </div>
  );
}
