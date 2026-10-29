export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function formatDayVi(value: Date | null): string {
  if (!value) return "Không có hạn";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(value);
}

export function truncateVi(value: string, max = 160): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

const vnd = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  maximumFractionDigits: 0,
});

/** Vietnamese VND price, e.g. `237.000đ`. Returns null for invalid input. */
export function formatPriceVi(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return `${vnd.format(value)}đ`;
}

/** 0.25 → "25%"; null-safe for missing rates. */
export function formatDiscountVi(rate: number | null | undefined): string | null {
  if (rate == null || !Number.isFinite(rate) || rate <= 0) return null;
  const pct = Math.round(rate * 100);
  return pct > 0 ? `-${pct}%` : null;
}

const dtf = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

/**
 * Absolute timestamp in vi-VN. Deterministic — never depends on the wall
 * clock at render time, so it is safe inside Cache Components prerenders.
 */
export function formatDateTimeVi(value: Date): string {
  return dtf.format(value);
}
