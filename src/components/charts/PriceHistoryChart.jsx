import React, { memo, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import {
  formatCompactTrackedPrice,
  formatTrackedDateLabel,
  formatTrackedDateTime,
  formatTrackedPrice,
} from '@/lib/price-tracking';

const chartConfig = {
  price: {
    label: 'Gia',
    color: 'hsl(var(--primary))',
  },
};

function TooltipCard({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{item.fullLabel}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {formatTrackedPrice(item.price, item.currency)}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        Nguon: {item.source === 'selector' ? 'Selector du phong' : 'JSON-LD'}
      </p>
    </div>
  );
}

function PriceHistoryChartComponent({
  history = [],
  currency = 'VND',
  className,
  heightClassName = 'h-[280px]',
}) {
  const chartData = useMemo(
    () => history.map((item) => ({
      id: item.id,
      price: Number(item.price),
      label: formatTrackedDateLabel(item.captured_at),
      fullLabel: formatTrackedDateTime(item.captured_at),
      source: item.source || 'jsonld',
      currency,
    })),
    [currency, history],
  );

  if (!chartData.length) {
    return (
      <div className={cn('flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 px-4 text-center text-sm text-muted-foreground', className)}>
        Chua co du lieu lich su gia de hien thi bieu do.
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('w-full aspect-auto rounded-2xl border border-border bg-card p-3 sm:p-4', heightClassName, className)}
    >
      <LineChart data={chartData} margin={{ top: 12, right: 12, left: 6, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          minTickGap={28}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={formatCompactTrackedPrice}
        />
        <ChartTooltip cursor={false} content={<TooltipCard />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="var(--color-price)"
          strokeWidth={3}
          dot={{ r: 3, fill: 'var(--color-price)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

const PriceHistoryChart = memo(PriceHistoryChartComponent);

export default PriceHistoryChart;
