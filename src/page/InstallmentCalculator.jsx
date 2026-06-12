import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, Landmark } from 'lucide-react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateReducingBalanceSchedule } from '@/lib/installment-calculator';
import { formatTrackedPrice } from '@/lib/price-tracking';
import { BASE_KEYWORDS, mergeKeywords } from '@/lib/site';

const bankRecommendations = [
  {
    name: 'VPBank',
    description: 'Gói vay tiêu dùng linh hoạt, thủ tục nhanh cho nhóm khách hàng cần xoay vốn online.',
    aprHint: 'Từ 1.5%/tháng',
    url: 'https://www.vpbank.com.vn/',
  },
  {
    name: 'Techcombank',
    description: 'Phù hợp người muốn so sánh lãi suất và ưu tiên ứng dụng ngân hàng số.',
    aprHint: 'Từ 1.2%/tháng',
    url: 'https://www.techcombank.com/',
  },
  {
    name: 'MBBank',
    description: 'Mạnh ở nhóm vay tiêu dùng online, có hệ thống app để theo dõi lịch trả nợ khá gọn.',
    aprHint: 'Từ 1.25%/tháng',
    url: 'https://www.mbbank.com.vn/',
  },
];

const PAGE_KEYWORDS = [
  'tính lãi vay trả góp',
  'tính dư nợ giảm dần',
  'công cụ tính trả góp',
  'bảng tính lãi vay',
];

export default function InstallmentCalculator() {
  const [principal, setPrincipal] = useState(30000000);
  const [annualRate, setAnnualRate] = useState(15);
  const [months, setMonths] = useState(12);
  const [monthlyFee, setMonthlyFee] = useState(0);

  const result = useMemo(() => calculateReducingBalanceSchedule({
    principal,
    annualRate,
    months,
    monthlyFee,
  }), [annualRate, months, monthlyFee, principal]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title="Công cụ tính lãi suất vay trả góp dư nợ giảm dần"
        description="Tính nhanh lịch trả nợ, tổng lãi và tổng thanh toán theo dư nợ giảm dần ngay trên website."
        path="/tinh-tra-gop"
        keywords={mergeKeywords(BASE_KEYWORDS, PAGE_KEYWORDS)}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Công cụ tính lãi suất vay trả góp</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Nhập dữ liệu là thấy ngay lịch thanh toán theo dư nợ giảm dần. Công cụ này phù hợp để ước lượng nhanh trước khi chọn gói trả góp.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px,minmax(0,1fr)]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Thông số đầu vào</CardTitle>
            <CardDescription>Cập nhật số tiền vay, lãi suất và số tháng. Kết quả thay đổi ngay lập tức.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Số tiền vay</Label>
              <Input type="number" value={principal} onChange={(event) => setPrincipal(Number(event.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Lãi suất năm (%)</Label>
              <Input type="number" step="0.1" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Số tháng vay</Label>
              <Input type="number" value={months} onChange={(event) => setMonths(Number(event.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>Phí cố định hàng tháng (nếu có)</Label>
              <Input type="number" value={monthlyFee} onChange={(event) => setMonthlyFee(Number(event.target.value) || 0)} />
            </div>

            <div className="rounded-2xl border border-border bg-secondary/20 p-4 text-sm leading-6 text-muted-foreground">
              Công thức đang dùng: tiền gốc mỗi tháng gần như cố định, tiền lãi tính trên dư nợ còn lại, phí cố định nếu có sẽ được cộng vào mỗi kỳ thanh toán.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Trả tháng đầu</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.firstMonthPayment)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Lãi tháng đầu</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.firstMonthInterest)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tổng tiền lãi</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.totalInterest)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tổng thanh toán</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.totalPayment)}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Bảng lịch thanh toán</CardTitle>
                <CardDescription>Xem chi tiết tiền gốc, tiền lãi và dư nợ còn lại theo từng tháng.</CardDescription>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Tự động cập nhật
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Tháng</th>
                      <th className="pb-3 pr-4 font-medium">Dư nợ đầu kỳ</th>
                      <th className="pb-3 pr-4 font-medium">Tiền gốc</th>
                      <th className="pb-3 pr-4 font-medium">Tiền lãi</th>
                      <th className="pb-3 pr-4 font-medium">Phí</th>
                      <th className="pb-3 pr-4 font-medium">Tổng trả</th>
                      <th className="pb-3 font-medium">Dư nợ cuối kỳ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-border/60">
                        <td className="py-3 pr-4 font-semibold">{row.month}</td>
                        <td className="py-3 pr-4">{formatTrackedPrice(row.openingBalance)}</td>
                        <td className="py-3 pr-4">{formatTrackedPrice(row.principalPayment)}</td>
                        <td className="py-3 pr-4">{formatTrackedPrice(row.interestPayment)}</td>
                        <td className="py-3 pr-4">{formatTrackedPrice(row.monthlyFee)}</td>
                        <td className="py-3 pr-4 font-semibold">{formatTrackedPrice(row.totalPayment)}</td>
                        <td className="py-3">{formatTrackedPrice(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Ngân hàng khuyến nghị</CardTitle>
              <CardDescription>Anh có thể chèn link điều hướng hoặc affiliate vào các ô này về sau.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {bankRecommendations.map((bank) => (
                <div key={bank.name} className="flex h-full flex-col rounded-3xl border border-border bg-secondary/20 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold">{bank.name}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">{bank.aprHint}</p>
                  <p className="mt-3 min-h-[96px] text-sm leading-6 text-muted-foreground">{bank.description}</p>
                  <Button asChild className="mt-auto min-h-12 w-full rounded-2xl px-5 text-sm font-semibold shadow-sm shadow-primary/20">
                    <a href={bank.url} target="_blank" rel="noopener noreferrer">Xem gói vay</a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
