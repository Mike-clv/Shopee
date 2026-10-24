"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Coupon-standard flow: click the box → copy the code AND start the
 * affiliate redirect in a new tab, so the user gets both money saved
 * and the discounted page.
 */
export function CopyButton({ code, goPath }: { code: string; goPath: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers without clipboard permission — still redirect.
    } finally {
      window.open(goPath, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Sao chép mã giảm giá"
      className="flex-1 rounded-lg border border-dashed border-[#ee4d2d] bg-[#ee4d2d]/5 px-3 py-2 text-center transition hover:bg-[#ee4d2d]/10 active:scale-[0.99]"
    >
      <span className="font-mono text-sm font-bold tracking-wider text-[#ee4d2d]">
        {copied ? "✔ Đã chép!" : code}
      </span>
    </button>
  );
}
