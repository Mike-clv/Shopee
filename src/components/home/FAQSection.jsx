import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Mã giảm giá trên website có miễn phí không?',
    a: 'Có, tất cả mã giảm giá trên Mã Giảm Giá Pro đều hoàn toàn miễn phí. Bạn chỉ cần copy mã và dán vào ô mã giảm giá khi thanh toán trên các sàn thương mại điện tử.',
  },
  {
    q: 'Làm sao để sử dụng mã giảm giá?',
    a: 'Bước 1: Tìm mã phù hợp. Bước 2: Nhấn Lấy mã hoặc Sao chép. Bước 3: Mã được sao chép vào clipboard. Bước 4: Dán mã vào ô giảm giá khi thanh toán trên shop.',
  },
  {
    q: 'Tại sao mã giảm giá không áp dụng được?',
    a: 'Có thể do mã đã hết hạn, đơn hàng chưa đạt giá trị tối thiểu, sản phẩm không nằm trong danh mục áp dụng, hoặc tài khoản đã sử dụng mã trước đó. Hãy đọc kỹ điều kiện áp dụng.',
  },
  {
    q: 'Mã giảm giá được cập nhật khi nào?',
    a: 'Website có thể cập nhật mã mỗi ngày thông qua dữ liệu seed, dữ liệu admin hoặc đồng bộ affiliate khi AccessTrade được cấu hình. Mã hết hạn nên được ẩn hoặc chuyển trạng thái trong CMS.',
  },
  {
    q: 'Website có an toàn không?',
    a: 'Website không yêu cầu thông tin tài khoản ngân hàng. Giao dịch mua hàng được thực hiện trực tiếp trên sàn thương mại điện tử hoặc website của nhà bán hàng.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-center mb-6">Câu Hỏi Thường Gặp</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-4">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
