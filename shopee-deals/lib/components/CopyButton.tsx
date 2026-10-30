"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * “Lấy mã” interaction: copies the code, confirms in-place, and always opens
 * the affiliate redirect in a new tab.
 * - variant "row": dashed code plate + pill button (detail purchase ticket).
 * - variant "tile": one full-width dashed button (square coupon tiles).
 */
export function CopyButton({
  code,
  goPath,
  variant = "row",
  dealId,
  merchant,
  placement = "copy_button",
}: {
  code: string;
  goPath: string;
  variant?: "row" | "tile";
  dealId?: string;
  merchant?: string;
  placement?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail on http/permission denial — the redirect still works.
    } finally {
      trackEvent("affiliate_click", {
        deal_id: dealId,
        merchant,
        placement,
      });
      window.open(goPath, "_blank", "noopener,noreferrer");
    }
  };

  if (variant === "tile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Sao chép mã ${code}`}
        className={cn(
          "flex h-8 w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed px-2 transition active:scale-[0.99]",
          copied
            ? "border-emerald-500/50 bg-emerald-50"
            : "border-brand/40 bg-brand/5 hover:bg-brand/10",
        )}
      >
        {copied ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold tracking-wider text-emerald-600">
            <CircleCheck className="h-3 w-3" aria-hidden />
            Đã chép
          </span>
        ) : (
          <span
            className="inline-flex min-w-0 items-center gap-1 font-mono text-[11px] font-bold tracking-wider text-brand"
            title={code}
          >
            <Copy className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{code}</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex w-full items-center gap-2 sm:max-w-[300px]">
      <span
        className="min-w-0 flex-1 truncate rounded-lg border-2 border-dashed border-brand/40 bg-brand/5 px-3 py-2 font-mono text-[11px] leading-4 font-bold tracking-wider text-brand sm:text-xs"
        title={code}
      >
        {code}
      </span>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full px-3.5 text-xs font-semibold whitespace-nowrap text-white transition ${
          copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-brand hover:bg-brand-dark"
        }`}
      >
        {copied ? (
          <>
            <CircleCheck className="h-3.5 w-3.5" aria-hidden />
            Đã chép
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Lấy mã
          </>
        )}
      </button>
    </div>
  );
}
