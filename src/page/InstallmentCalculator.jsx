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
    description: 'Goi vay tieu dung linh hoat, thu tuc nhanh cho nhom khach hang can xoay von online.',
    aprHint: 'Tu 1.5%/thang',
    url: 'https://www.vpbank.com.vn/',
  },
  {
    name: 'Techcombank',
    description: 'Phu hop nguoi muon so sanh lai suat va uu tien ung dung ngan hang so.',
    aprHint: 'Tu 1.2%/thang',
    url: 'https://www.techcombank.com/',
  },
  {
    name: 'MBBank',
    description: 'Manh o nhom vay tieu dung online, co he thong app de theo doi lich tra no kha gon.',
    aprHint: 'Tu 1.25%/thang',
    url: 'https://www.mbbank.com.vn/',
  },
];

const PAGE_KEYWORDS = [
  'tinh lai vay tra gop',
  'tinh du no giam dan',
  'cong cu tinh tra gop',
  'bang tinh lai vay',
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
        title="Cong cu tinh lai suat vay tra gop du no giam dan"
        description="Tinh nhanh lich tra no, tong lai va tong thanh toan theo du no giam dan ngay tren website."
        path="/tinh-tra-gop"
        keywords={mergeKeywords(BASE_KEYWORDS, PAGE_KEYWORDS)}
      />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Tinh lai suat vay tra gop</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Nhap du lieu la thay ngay lich thanh toan theo du no giam dan. Cong cu nay phu hop de uoc luong nhanh truoc khi chon goi tra gop.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px,minmax(0,1fr)]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Thong so dau vao</CardTitle>
            <CardDescription>Cap nhat so tien vay, lai suat va so thang. Ket qua thay doi ngay lap tuc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>So tien vay</Label>
              <Input type="number" value={principal} onChange={(event) => setPrincipal(Number(event.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Lai suat nam (%)</Label>
              <Input type="number" step="0.1" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>So thang vay</Label>
              <Input type="number" value={months} onChange={(event) => setMonths(Number(event.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>Phi co dinh hang thang (neu co)</Label>
              <Input type="number" value={monthlyFee} onChange={(event) => setMonthlyFee(Number(event.target.value) || 0)} />
            </div>

            <div className="rounded-2xl border border-border bg-secondary/20 p-4 text-sm leading-6 text-muted-foreground">
              Cong thuc dang dung: tien goc moi thang gan nhu co dinh, tien lai tinh tren du no con lai, phi co dinh neu co se duoc cong vao moi ky thanh toan.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tra thang dau</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.firstMonthPayment)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Lai thang dau</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.firstMonthInterest)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tong tien lai</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.totalInterest)}</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Tong thanh toan</p>
                <p className="mt-2 text-lg font-bold">{formatTrackedPrice(result.totalPayment)}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Bang lich thanh toan</CardTitle>
                <CardDescription>Xem chi tiet tien goc, tien lai va du no con lai theo tung thang.</CardDescription>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Tu dong cap nhat
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Thang</th>
                      <th className="pb-3 pr-4 font-medium">Du no dau ky</th>
                      <th className="pb-3 pr-4 font-medium">Tien goc</th>
                      <th className="pb-3 pr-4 font-medium">Tien lai</th>
                      <th className="pb-3 pr-4 font-medium">Phi</th>
                      <th className="pb-3 pr-4 font-medium">Tong tra</th>
                      <th className="pb-3 font-medium">Du no cuoi ky</th>
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
              <CardTitle>Ngan hang khuyen nghi</CardTitle>
              <CardDescription>Anh co the chen link dieu huong/affiliate vao cac box nay ve sau.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {bankRecommendations.map((bank) => (
                <div key={bank.name} className="rounded-3xl border border-border bg-secondary/20 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold">{bank.name}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">{bank.aprHint}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{bank.description}</p>
                  <Button asChild className="mt-5 w-full rounded-2xl">
                    <a href={bank.url} target="_blank" rel="noopener noreferrer">Xem goi vay</a>
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
