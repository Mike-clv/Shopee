"use client";

import { useEffect, useState } from "react";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

/**
 * Live countdown to a sale start. Values are suppressed from hydration
 * warnings because the server and browser compute them a second apart.
 */
export function EventCountdown({
  startISO,
  tone = "light",
}: {
  startISO: string;
  tone?: "light" | "dark";
}) {
  const [now, setNow] = useState(() => Date.now());
  const target = new Date(startISO).getTime();
  const remaining = Math.max(0, target - now);
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const numberClass = tone === "dark" ? "text-white" : "text-ink";
  const labelClass = tone === "dark" ? "text-white/50" : "text-ink/35";

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (remaining === 0) {
    return (
      <p className={`text-sm font-semibold ${tone === "dark" ? "text-white" : "text-brand"}`}>
        Sự kiện đang diễn ra — kiểm tra deal mới nhất bên dưới.
      </p>
    );
  }

  return (
    <div className="flex items-end gap-2" aria-label="Đếm ngược đến 11.11">
      {[
        { value: days, label: "ngày" },
        { value: hours, label: "giờ" },
        { value: minutes, label: "phút" },
        { value: seconds, label: "giây" },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <span
            suppressHydrationWarning
            className={`block font-mono text-2xl leading-none font-bold tabular-nums ${numberClass}`}
          >
            {pad(item.value)}
          </span>
          <span
            className={`mt-1 block font-mono text-[9px] tracking-[0.12em] uppercase ${labelClass}`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
