"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Deal image with graceful degradation. Marketplace/AT CDNs sometimes reject
 * hotlinking (empty gray boxes), so on load failure we swap to the same
 * merchant-initial plate the no-image case uses — the tile never renders
 * hollow on screen.
 */
export function DealImage({
  src,
  alt,
  initials,
  width,
  height,
  sizes,
  className,
  plateClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  initials: string;
  width: number;
  height: number;
  /** Rendered width hint for next/image; without it small cards fetch 100vw. */
  sizes?: string;
  className?: string;
  plateClassName?: string;
  /** Above-the-fold images should load immediately (avoids LCP lazy warning). */
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "grid shrink-0 place-items-center bg-brand/8 font-bold text-brand",
          plateClassName,
        )}
      >
        {initials}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={cn("bg-paper object-cover", className)}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
