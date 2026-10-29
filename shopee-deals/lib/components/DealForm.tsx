"use client";

import { useActionState } from "react";
import { Pencil, Plus } from "lucide-react";
import { upsertDealAction, type ActionState } from "@/app/actions/admin";
import { SITE } from "@/lib/site";
import type { CouponDeal } from "@/lib/db/schema";

const emptyValue = "";

export function DealForm({ deal }: { deal: CouponDeal | null }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    upsertDealAction,
    {},
  );
  const editing = deal != null;

  return (
    <section aria-label="Thêm / sửa mã">
      <h2 className="mb-2 flex items-center gap-2 font-display text-xl font-semibold">
        {editing ? (
          <Pencil className="h-4 w-4 text-brand" aria-hidden />
        ) : (
          <Plus className="h-4 w-4 text-brand" aria-hidden />
        )}
        {editing ? "Sửa mã" : "Thêm mã thủ công"}
      </h2>
      <form action={formAction} className="rounded-lg border border-line bg-white p-4">
        {editing && <input type="hidden" name="id" value={deal.id} />}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Tiêu đề *"
            name="title"
            defaultValue={deal?.title ?? emptyValue}
            required
            placeholder="Giảm 50% cho đơn từ 300K"
          />
          <Field
            label="Mã (bỏ trống nếu là deal khuyến mãi)"
            name="code"
            defaultValue={deal?.code ?? emptyValue}
            placeholder="SHOPEE500K"
            mono
          />
          <Field
            label="Link affiliate cần truy cập *"
            name="affLink"
            defaultValue={deal?.affLink ?? emptyValue}
            required
            placeholder="https://go.isclix.com/deep_link/..."
          />
          <Field
            label="Tên shop / thương hiệu"
            name="merchantName"
            defaultValue={deal?.merchantName ?? emptyValue}
            placeholder="Shopee"
          />
          <div>
            <label htmlFor="merchant" className="text-xs font-medium text-ink/60">
              Sàn
            </label>
            <select
              id="merchant"
              name="merchant"
              defaultValue={deal?.merchant ?? "shopee"}
              className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
            >
              {SITE.merchants.map((merchant) => (
                <option key={merchant} value={merchant}>
                  {SITE.merchantLabels[merchant]}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Hạn dùng mã"
            name="endTime"
            type="date"
            defaultValue={deal?.endTime ? deal.endTime.toISOString().slice(0, 10) : emptyValue}
          />
          <Field
            label="Ảnh logo/cover (URL)"
            name="image"
            defaultValue={deal?.image ?? emptyValue}
            placeholder="https://static.accesstrade.vn/..."
          />
          <div className="sm:col-span-2">
            <label htmlFor="content" className="text-xs font-medium text-ink/60">
              Mô tả điều kiện áp dụng
            </label>
            <textarea
              id="content"
              name="content"
              rows={2}
              defaultValue={deal?.content ?? emptyValue}
              className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={deal?.isActive ?? true}
              className="h-4 w-4 accent-brand"
            />
            Đang chạy
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={deal?.isFeatured ?? false}
              className="h-4 w-4 accent-brand"
            />
            Đánh dấu Hot
          </label>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c8401c] disabled:opacity-60"
          >
            {pending ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Thêm mã"}
          </button>
          {editing && (
            <a
              href="/admin"
              className="text-sm text-ink/50 underline-offset-4 hover:text-brand hover:underline"
            >
              Hủy sửa
            </a>
          )}
          {state.error && <p className="text-sm text-accent">{state.error}</p>}
          {state.ok && <p className="text-sm text-brand">{state.ok}</p>}
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  mono,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-ink/60">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none ${
          mono ? "font-mono tracking-wider uppercase" : ""
        }`}
      />
    </div>
  );
}
