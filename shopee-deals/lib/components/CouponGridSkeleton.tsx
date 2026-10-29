/** Loading placeholder matching the small square coupon tile grid. */
export function CouponGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-line bg-white"
        >
          <div className="shimmer h-24 w-full rounded-none sm:h-32" />
          <div className="space-y-1.5 p-2">
            <div className="shimmer h-2.5 w-16 rounded" />
            <div className="shimmer h-3 w-3/4 rounded" />
            <div className="shimmer h-3 w-12 rounded" />
            <div className="shimmer h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
