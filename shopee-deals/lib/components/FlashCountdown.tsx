"use client";

import { useEffect, useRef, useState } from "react";
import { Hourglass } from "lucide-react";

/**
 * Live flash-deal countdown. The server renders a stable "--:--:--" shell
 * (no wall-clock access during SSR/prerender); the ticking clock lives
 * entirely in the browser after hydration.
 */
export function FlashCountdown({
  isoEndTime,
  tone = "glass",
}: {
  isoEndTime: string;
  tone?: "glass" | "paper";
}) {
  const [left, setLeft] = useState<number | null>(null);
  const interval = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const target = Date.parse(isoEndTime);
    if (Number.isNaN(target)) return;
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    interval.current = setInterval(tick, 1000);
    return () => {
      if (interval.current !== null) clearInterval(interval.current);
    };
  }, [isoEndTime]);

  const parts =
    left == null
      ? []
      : (() => {
          const s = Math.floor(left / 1000);
          return [
            Math.floor(s / 86400),
            Math.floor((s % 86400) / 3600),
            Math.floor((s % 3600) / 60),
            s % 60,
          ];
        })();
  const label =
    left != null && left === 0
      ? "Đã kết thúc"
      : parts.length
        ? parts
            .map((p, i) => (i === 0 ? (p > 0 ? String(p) : null) : String(p).padStart(2, "0")))
            .filter((p, i) => (i === 0 ? p != null : true))
            .join(":")
        : "--:--:--";

  return (
    <span
      suppressHydrationWarning
      aria-live="off"
      className={
        tone === "paper"
          ? "inline-flex items-center gap-1 font-mono text-xs font-bold text-accent tabular-nums"
          : "inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-200 tabular-nums"
      }
    >
      <Hourglass className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
