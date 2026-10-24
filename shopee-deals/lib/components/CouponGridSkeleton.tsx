export function CouponGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex h-44 animate-pulse flex-col justify-between rounded-xl border border-neutral-200 bg-white p-3"
          aria-hidden
        >
          <div className="flex gap-3">
            <div className="h-16 w-16 rounded-lg bg-neutral-200" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3.5 w-4/5 rounded bg-neutral-200" />
              <div className="h-3 w-2/5 rounded bg-neutral-100" />
            </div>
          </div>
          <div className="h-9 w-full rounded-lg bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}
