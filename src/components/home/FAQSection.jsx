import React from 'react';
import { CircleHelp, ShieldCheck, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    q: 'Mã giảm giá trên website có miễn phí không?',
    a: 'Có. Tất cả mã giảm giá trên Mã Giảm Giá Pro đều hoàn toàn miễn phí. Bạn chỉ cần lấy mã rồi dán vào ô ưu đãi khi thanh toán trên sàn thương mại điện tử.',
  },
  {
    q: 'Làm sao để sử dụng mã giảm giá?',
    a: 'Bước 1: Chọn mã phù hợp với sàn và điều kiện đơn hàng. Bước 2: Nhấn lấy mã hoặc sao chép. Bước 3: Mở ứng dụng hoặc website của sàn. Bước 4: Dán mã vào ô giảm giá trước khi thanh toán.',
  },
  {
    q: 'Tại sao mã giảm giá không áp dụng được?',
    a: 'Nguyên nhân phổ biến là mã đã hết hạn, đơn hàng chưa đạt giá trị tối thiểu, sản phẩm không thuộc ngành hàng áp dụng hoặc tài khoản đã dùng mã trước đó. Anh/chị nên xem kỹ điều kiện ngay trên từng voucher.',
  },
  {
    q: 'Mã giảm giá được cập nhật khi nào?',
    a: 'Hệ thống cập nhật dữ liệu định kỳ từ nguồn đang cấu hình. Những mã hết hạn hoặc không còn hiệu lực sẽ được ẩn khỏi các khối hiển thị chính để danh sách luôn gọn và dễ dùng hơn.',
  },
  {
    q: 'Website có an toàn không?',
    a: 'Website không yêu cầu thông tin tài khoản ngân hàng hay thanh toán trực tiếp. Việc mua hàng và áp mã đều diễn ra trên sàn thương mại điện tử hoặc website chính thức của thương hiệu.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-[28px] border border-border/70 bg-gradient-to-br from-primary/5 via-background to-secondary/40 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[0.92fr,1.08fr] lg:items-start">
            <div className="space-y-5">
              <Badge variant="secondary" className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Hỗ trợ nhanh
              </Badge>

              <div>
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">Câu hỏi thường gặp</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  Tổng hợp nhanh những thắc mắc phổ biến để anh/chị dễ tra cứu cách dùng mã, kiểm tra điều kiện áp dụng và săn ưu đãi hiệu quả hơn.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold">Thông tin luôn dễ theo dõi</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Các ưu đãi đang hoạt động sẽ được ưu tiên hiển thị để anh/chị dễ chọn nhanh và hạn chế gặp mã không còn hiệu lực.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold">Mẹo dùng mã gọn gàng</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Xem nhanh cách lấy mã, áp điều kiện và kiểm tra ưu đãi trước khi mua.
                  </p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 px-5 shadow-sm transition-all data-[state=open]:border-primary/30 data-[state=open]:shadow-[0_18px_40px_-28px_rgba(249,115,22,0.75)]"
                >
                  <AccordionTrigger className="py-5 text-left text-sm font-semibold hover:no-underline sm:text-[15px]">
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CircleHelp className="h-4 w-4" />
                      </span>
                      <span className="leading-6">{faq.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-11 text-sm leading-7 text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
