import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Store, FolderOpen, MousePointer, Copy, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function AdminDashboard() {
  const { data: vouchers = [] } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: () => localClient.entities.Voucher.list('-created_date', 200),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => localClient.entities.Brand.list('-created_date', 200),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => localClient.entities.Category.list('-created_date', 50),
  });

  const { data: clicks = [] } = useQuery({
    queryKey: ['admin-clicks'],
    queryFn: () => localClient.entities.ClickEvent.list('-created_date', 200),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => localClient.entities.BlogPost.list('-created_date', 50),
  });

  const activeVouchers = vouchers.filter(v => v.status === 'active').length;
  const expiredVouchers = vouchers.filter(v => v.status === 'expired').length;
  const totalClicks = clicks.filter(c => c.event_type === 'click').length;
  const totalCopies = clicks.filter(c => c.event_type === 'copy').length;

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayClicks = clicks.filter(c => c.created_date?.startsWith(dateStr) && c.event_type === 'click').length;
    const dayCopies = clicks.filter(c => c.created_date?.startsWith(dateStr) && c.event_type === 'copy').length;

    return {
      name: `${dayLabels[date.getDay()]} ${date.getDate()}`,
      fullName: date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' }),
      clicks: dayClicks,
      copies: dayCopies,
    };
  });

  const stats = [
    { icon: Tag, label: 'Tổng voucher', value: vouchers.length, color: 'text-primary' },
    { icon: Tag, label: 'Còn hạn', value: activeVouchers, color: 'text-green-500' },
    { icon: Tag, label: 'Hết hạn', value: expiredVouchers, color: 'text-red-500' },
    { icon: Store, label: 'Thương hiệu', value: brands.length, color: 'text-blue-500' },
    { icon: FolderOpen, label: 'Danh mục', value: categories.length, color: 'text-violet-500' },
    { icon: MousePointer, label: 'Tổng click', value: totalClicks, color: 'text-orange-500' },
    { icon: Copy, label: 'Tổng copy', value: totalCopies, color: 'text-cyan-500' },
    { icon: FileText, label: 'Bài viết', value: posts.length, color: 'text-emerald-500' },
  ];

  const topVouchers = [...vouchers]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, 5);

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-heading text-xl font-bold sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bố cục mobile đã được làm gọn để xem số liệu nhanh và dễ chạm hơn.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-4">
        {stats.map(item => (
          <Card key={item.label} className="border-border/80 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-secondary p-2">
                  <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] leading-4 text-muted-foreground sm:text-xs">{item.label}</p>
                  <p className="text-lg font-bold sm:text-xl">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base">Click & Copy 7 ngày gần nhất</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="overflow-x-auto pb-2">
            <div className="h-[220px] min-w-[540px] sm:h-[250px] sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickMargin={8} />
                  <YAxis tick={{ fontSize: 11 }} width={28} />
                  <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''} />
                  <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Click" />
                  <Bar dataKey="copies" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Copy" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base">Top Voucher Nhiều Click</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="space-y-3">
            {topVouchers.map((voucher, index) => (
              <div key={voucher.id} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-medium leading-5 sm:line-clamp-1">{voucher.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{voucher.brand_name || 'Chưa có thương hiệu'}</p>
                </div>
                <span className="shrink-0 text-right text-xs font-semibold text-muted-foreground sm:text-sm">{voucher.click_count || 0} clicks</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
