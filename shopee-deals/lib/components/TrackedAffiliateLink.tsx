"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  dealId: string;
  merchant: string;
  placement: string;
  children: ReactNode;
};

/**
 * Affiliate anchor that records the click before the browser follows it.
 * Keeps the normal <a> behaviour (new tab, rel) so tracking can never block
 * the redirect.
 */
export function TrackedAffiliateLink({
  dealId,
  merchant,
  placement,
  children,
  onClick,
  ...props
}: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent("affiliate_click", {
          deal_id: dealId,
          merchant,
          placement,
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
