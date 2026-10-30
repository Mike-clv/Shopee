"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires search/filter events when the URL query changes on /tim-kiem.
 * Search engines and direct visits are included; the event only leaves the
 * browser when measurement consent has been accepted.
 */
export function SearchAnalytics() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === query) return;
    last.current = query;

    const params = new URLSearchParams(query);
    const term = params.get("q")?.trim() ?? "";
    const merchant = params.get("merchant") ?? "all";
    const category = params.get("cate") ?? "all";
    const sort = params.get("sort") ?? "hot";

    if (term) {
      trackEvent("search_submit", {
        search_term: term,
        merchant,
        category,
      });
    }
    if (merchant !== "all" || category !== "all" || sort !== "hot") {
      trackEvent("filter_apply", { merchant, category, sort, search_term: term || undefined });
    }
  }, [query]);

  return null;
}
