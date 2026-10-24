"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="my-16 rounded-xl border border-neutral-200 bg-white p-8 text-center">
      <p className="text-4xl">😵</p>
      <h1 className="mt-2 text-lg font-bold">Có lỗi khi hiển thị trang</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {error.message.slice(0, 220)}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73211]"
      >
        Thử lại
      </button>
    </div>
  );
}
