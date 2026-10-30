import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/lib/components/LegalPage";
import { OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Về Sansale247",
  description:
    "Sansale247 là website tổng hợp mã giảm giá, voucher và deal từ Shopee, Tiki, Lazada, TikTok Shop — cập nhật tự động, miễn phí và minh bạch về affiliate.",
  alternates: { canonical: "/ve-chung-toi" },
  openGraph: {
    title: "Về Sansale247",
    description:
      "Website tổng hợp mã giảm giá, voucher và deal đa sàn, cập nhật tự động qua AccessTrade.",
    url: "/ve-chung-toi",
    type: "website",
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <LegalPage
      title="Về Sansale247"
      description="Sansale247 giúp bạn tìm mã giảm giá còn hiệu lực và deal đáng mua từ các sàn lớn, với thông tin rõ ràng và minh bạch về link affiliate."
      updated="2026-10-30"
      current="/ve-chung-toi"
    >
      <LegalSection
        section={{
          heading: "Sansale247 là gì?",
          paragraphs: [
            "Sansale247 là website tổng hợp mã giảm giá, voucher freeship và deal sản phẩm từ Shopee, Tiki, Lazada, TikTok Shop cùng một số thương hiệu. Website cập nhật tự động qua AccessTrade và bổ sung kiểm tra thủ công với các nội dung quan trọng.",
            "Mục tiêu của Sansale247 là giúp bạn tiết kiệm thời gian tìm khuyến mãi, hiểu rõ điều kiện sử dụng và tránh những deal đã hết hạn hoặc không đáng tin.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Website hoạt động như thế nào?",
          bullets: [
            "Đồng bộ mã giảm giá và deal từ AccessTrade, datafeed của sàn và trang công khai của thương hiệu.",
            "Kiểm tra trạng thái, thời hạn và một số trường dữ liệu bắt buộc trước khi hiển thị.",
            "Phân loại theo sàn, danh mục và mức độ phổ biến để bạn tìm nhanh hơn.",
            "Ghi chú điều kiện, hạn sử dụng và link đích khi thông tin có thể ảnh hưởng đến quyết định mua.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Sansale247 không làm gì",
          bullets: [
            "Không phải sàn thương mại điện tử và không bán hàng trực tiếp.",
            "Không xử lý đơn hàng, thanh toán, vận chuyển, đổi trả hoặc bảo hành.",
            "Không đại diện chính thức cho Shopee, Tiki, Lazada, TikTok Shop hay bất kỳ nhãn hàng nào.",
            "Không bán vị trí hiển thị hoặc nhận tiền để đẩy deal lên đầu.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Nguyên tắc nội dung",
          bullets: [
            "Ưu tiên thông tin có thể kiểm chứng và hữu ích với người mua.",
            "Không tạo cảm giác khẩn cấp giả hoặc hứa hẹn mức giảm chưa kiểm tra.",
            "Minh bạch khi nội dung có link affiliate; hoa hồng không làm tăng giá bạn trả.",
            "Gỡ hoặc cập nhật deal hết hạn, link lỗi và nội dung sai khi phát hiện.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Ai vận hành website?",
          paragraphs: [
            "Sansale247 là dự án độc lập được vận hành bởi đội ngũ Sansale247. Website không trực thuộc các sàn thương mại điện tử hoặc mạng affiliate được nhắc đến.",
            "Mọi câu hỏi về nội dung, dữ liệu cá nhân hoặc hợp tác vui lòng gửi qua trang liên hệ. Website sẽ phản hồi trong thời gian sớm nhất.",
          ],
        }}
      />

      <p className="text-sm leading-relaxed text-ink/55">
        Xem thêm{" "}
        <Link href="/chinh-sach/tiet-lo-affiliate" className="font-semibold text-brand hover:text-brand-dark">
          Tiết lộ affiliate
        </Link>{" "}
        và{" "}
        <Link href="/chinh-sach/chinh-sach-bien-tap" className="font-semibold text-brand hover:text-brand-dark">
          Chính sách biên tập
        </Link>{" "}
        để hiểu rõ cách website hoạt động.
      </p>
    </LegalPage>
  );
}
