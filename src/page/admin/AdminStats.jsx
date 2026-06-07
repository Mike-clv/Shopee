import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(15, 90%, 55%)', 'hsl(220, 70%, 50%)', 'hsl(173, 58%, 39%)', 'hsl(43, 74%, 66%)', 'hsl(352, 83%, 55%)'];

export default function AdminStats() {
  const { data: clicks = [] } = useQuery({
    queryKey: ['admin-all-clicks'],
    queryFn: () => localClient.entities.ClickEvent.list('-created_date', 500),
  });

  const { data: vouchers = [] } = useQuery({
    queryKey: ['admin-all-vouchers'],
    queryFn: () => localClient.entities.Voucher.list('-click_count', 200),
  });

  const brandClicks = {};
  clicks.forEach(click => {
    const name = click.brand_name || 'Không rõ';
    brandClicks[name] = (brandClicks[name] || 0) + 1;
  });

  const brandData = Object.entries(brandClicks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const typeData = [
    { name: 'Click', value: clicks.filter(click => click.event_type === 'click').length },
    { name: 'Copy', value: clicks.filter(click => click.event_type === 'copy').length },
  ];

  const topVouchers = [...vouchers]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, 10);

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-heading text-xl font-bold sm:text-2xl">Thống Kê Chi Tiết</h1>
        <p className="mt-1 text-sm text-muted-foreground">Biểu đồ được nới chiều ngang hợp lý hơn để nhìn rõ trên mobile.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base">Click/Copy theo loại</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={68}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${Math.round((percent || 0) * 100)}%`}
                >
                  {typeData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base">Top Thương hiệu theo click</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
            <div className="overflow-x-auto pb-2">
              <div className="h-[240px] min-w-[420px] sm:min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brandData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={92} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base">Top 10 Voucher Nhiều Click</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="space-y-3">
            {topVouchers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
            ) : (
              topVouchers.map((voucher, index) => (
                <div key={voucher.id} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium leading-5 sm:line-clamp-1">{voucher.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{voucher.brand_name} • {voucher.platform}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold">{voucher.click_count || 0}</p>
                    <p className="text-[10px] text-muted-foreground">clicks</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
