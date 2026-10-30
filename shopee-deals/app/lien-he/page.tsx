import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { LegalPage, LegalSection } from "@/lib/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ Sansale247 để báo mã hết hạn, link lỗi, yêu cầu về dữ liệu cá nhân hoặc góp ý nội dung.",
  alternates: { canonical: "/lien-he" },
  openGraph: {
    title: "Liên hệ Sansale247",
    description:
      "Báo link lỗi, mã hết hạn, yêu cầu dữ liệu cá nhân hoặc góp ý nội dung.",
    url: "/lien-he",
    type: "website",
  },
};

const mailto = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(
  "Liên hệ Sansale247",
)}`;

export default function ContactPage() {
  return (
    <LegalPage
      title="Liên hệ"
      description="Gửi câu hỏi, báo link lỗi hoặc yêu cầu về dữ liệu cá nhân. Sansale247 không hỗ trợ xử lý đơn hàng của sàn."
      updated="2026-10-30"
      current="/lien-he"
    >
      <div className="rounded-2xl border border-brand/15 bg-brand/[0.04] p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Mail className="h-4 w-4 text-brand" aria-hidden />
          Email liên hệ
        </p>
        <a
          href={mailto}
          className="mt-2 inline-flex break-all text-lg font-bold text-brand transition hover:text-brand-dark"
        >
          {SITE.contactEmail}
        </a>
        <p className="mt-2 text-xs leading-relaxed text-ink/55">
          Đây là kênh liên hệ duy nhất của website. Không có hotline hoặc quầy
          hỗ trợ trực tiếp.
        </p>
      </div>

      <LegalSection
        section={{
          heading: "Khi nào nên liên hệ?",
          bullets: [
            "Báo mã giảm giá đã hết hạn, link lỗi hoặc deal không còn đúng giá.",
            "Góp ý về nội dung, cách trình bày hoặc trải nghiệm tìm deal.",
            "Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân.",
            "Đề xuất hợp tác, gửi sản phẩm hoặc thông tin thương hiệu.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Không hỗ trợ đơn hàng",
          paragraphs: [
            "Sansale247 không bán hàng, không giữ đơn và không xử lý thanh toán. Nếu đơn hàng gặp vấn đề, vui lòng liên hệ trực tiếp sàn hoặc người bán nơi bạn đã đặt hàng.",
            "Website không có quyền can thiệp vào đơn hàng, hoàn tiền, vận chuyển hoặc bảo hành của bên thứ ba.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Thời gian phản hồi",
          paragraphs: [
            "Email thường được phản hồi trong vòng 1–3 ngày làm việc. Các yêu cầu về dữ liệu cá nhân được xử lý theo thời hạn pháp luật quy định, thường không quá 30 ngày.",
            "Trong dịp lễ hoặc khi lượng email tăng cao, thời gian phản hồi có thể lâu hơn. Cảm ơn bạn đã kiên nhẫn.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Trước khi gửi email",
          bullets: [
            "Kèm URL cụ thể của trang hoặc deal đang gặp vấn đề.",
            "Mô tả ngắn điều bạn thấy sai hoặc cần hỗ trợ.",
            "Thêm ảnh chụp màn hình nếu lỗi khó diễn đạt bằng lời.",
            "Không gửi mật khẩu, mã OTP, số thẻ hoặc thông tin thanh toán qua email.",
          ],
        }}
      />

      <p className="text-sm leading-relaxed text-ink/55">
        Xem thêm{" "}
        <Link href="/chinh-sach/chinh-sach-bao-mat" className="font-semibold text-brand hover:text-brand-dark">
          Chính sách bảo mật
        </Link>{" "}
        để biết cách website xử lý dữ liệu bạn gửi.
      </p>
    </LegalPage>
  );
}
