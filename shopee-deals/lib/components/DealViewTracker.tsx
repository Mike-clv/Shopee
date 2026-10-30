"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Records a deal detail view once per mount (consent-gated). */
export function DealViewTracker({
  dealId,
  merchant,
}: {
  dealId: string;
  merchant: string;
}) {
  useEffect(() => {
    trackEvent("deal_view", { deal_id: dealId, merchant });
  }, [dealId, merchant]);

  return null;
}
