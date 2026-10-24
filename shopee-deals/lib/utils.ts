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
