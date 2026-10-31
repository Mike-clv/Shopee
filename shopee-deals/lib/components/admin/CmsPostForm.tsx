"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { savePostAction, type CmsActionState } from "@/app/actions/cms";
import { CMS_POST_ICONS } from "@/lib/cms/types";
import type { BlogBlock } from "@/lib/blog/post-types";
import type { PostInput } from "@/lib/cms/validation";

const inputClass =
  "mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none";
const labelClass = "block text-xs font-medium text-ink/60";

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function TableEditor({
  block,
  onChange,
}: {
  block: Extract<BlogBlock, { kind: "table" }>;
  onChange: (block: BlogBlock) => void;
}) {
  return (
    <div className="space-y-2">
      <input
        value={block.caption ?? ""}
        onChange={(event) => onChange({ ...block, caption: event.target.value })}
        placeholder="Chú thích bảng (không bắt buộc)"
        className={inputClass}
      />
      <textarea
        value={block.headers.join(" | ")}
        onChange={(event) =>
          onChange({
            ...block,
            headers: event.target.value.split("|").map((cell) => cell.trim()).filter(Boolean),
          })
        }
        rows={1}
        placeholder="Cột 1 | Cột 2 | Cột 3"
        className={inputClass}
      />
      <textarea
        value={block.rows.map((row) => row.join(" | ")).join("\n")}
        onChange={(event) =>
          onChange({
            ...block,
            rows: lines(event.target.value).map((line) =>
              line.split("|").map((cell) => cell.trim()),
            ),
          })
        }
        rows={4}
        placeholder={"Ô 1 | Ô 2 | Ô 3\nÔ 4 | Ô 5 | Ô 6"}
        className={inputClass}
      />
    </div>
  );
}

export function CmsPostForm({ initial, id }: { initial: PostInput; id?: string }) {
  const [state, formAction, pending] = useActionState<CmsActionState, FormData>(
    savePostAction,
    {},
  );
  const [blocks, setBlocks] = useState<BlogBlock[]>(initial.body);
  const [faqs, setFaqs] = useState(initial.meta.faqs);
  const [ctas, setCtas] = useState(initial.meta.hintedCtas);

  function updateBlock(index: number, block: BlogBlock) {
    setBlocks((current) => current.map((item, i) => (i === index ? block : item)));
  }

  function addBlock(kind: BlogBlock["kind"]) {
    const block: BlogBlock =
      kind === "list"
        ? { kind, items: [""] }
        : kind === "table"
          ? { kind, headers: ["Cột 1", "Cột 2"], rows: [["", ""]] }
          : { kind, text: "" };
    setBlocks((current) => [...current, block]);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-5">
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="body" value={JSON.stringify(blocks)} />
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />
      <input type="hidden" name="hintedCtas" value={JSON.stringify(ctas)} />

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Thông tin bài</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="post-title">Tiêu đề *</label>
            <input id="post-title" name="title" defaultValue={initial.title} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="post-slug">Slug *</label>
            <input id="post-slug" name="slug" defaultValue={initial.slug} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="post-path">Đường dẫn *</label>
            <input id="post-path" name="path" defaultValue={initial.path} required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="post-excerpt">Mô tả ngắn *</label>
            <textarea id="post-excerpt" name="excerpt" defaultValue={initial.excerpt} rows={2} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="post-status">Trạng thái</label>
            <select id="post-status" name="status" defaultValue={initial.status} className={inputClass}>
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm text-ink/60">
            <input type="checkbox" name="isFeatured" defaultChecked={initial.isFeatured} />
            Bài nổi bật
          </label>
          <div>
            <label className={labelClass} htmlFor="post-seo-title">SEO title</label>
            <input id="post-seo-title" name="seoTitle" defaultValue={initial.seoTitle ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="post-seo-description">SEO description</label>
            <input id="post-seo-description" name="seoDescription" defaultValue={initial.seoDescription ?? ""} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Phân loại & hiển thị</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="tagLabel">Nhãn chủ đề *</label>
            <input id="tagLabel" name="tagLabel" defaultValue={initial.meta.tagLabel} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="tagHref">Link chủ đề *</label>
            <input id="tagHref" name="tagHref" defaultValue={initial.meta.tagHref} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="minutes">Số phút đọc</label>
            <input id="minutes" name="minutes" type="number" min={1} max={180} defaultValue={initial.meta.minutes} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="icon">Icon</label>
            <select id="icon" name="icon" defaultValue={initial.meta.icon} className={inputClass}>
              {CMS_POST_ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="gradient">Gradient Tailwind *</label>
            <input id="gradient" name="gradient" defaultValue={initial.meta.gradient} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="coverSrc">Ảnh cover *</label>
            <input id="coverSrc" name="coverSrc" defaultValue={initial.meta.cover.src} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="coverAlt">Alt ảnh *</label>
            <input id="coverAlt" name="coverAlt" defaultValue={initial.meta.cover.alt} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="coverWidth">Rộng (px)</label>
            <input id="coverWidth" name="coverWidth" type="number" defaultValue={initial.meta.cover.width} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="coverHeight">Cao (px)</label>
            <input id="coverHeight" name="coverHeight" type="number" defaultValue={initial.meta.cover.height} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="coverCaption">Chú thích ảnh</label>
            <input id="coverCaption" name="coverCaption" defaultValue={initial.meta.cover.caption} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Tác giả</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="authorName">Tên *</label>
            <input id="authorName" name="authorName" defaultValue={initial.meta.author.name} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="authorTitle">Chức danh *</label>
            <input id="authorTitle" name="authorTitle" defaultValue={initial.meta.author.title} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="authorHref">Link hồ sơ *</label>
            <input id="authorHref" name="authorHref" defaultValue={initial.meta.author.href} required className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Nội dung ({blocks.length} block)</h2>
          <div className="flex flex-wrap gap-1.5">
            {(["p", "h2", "tip", "list", "table"] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => addBlock(kind)}
                className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-xs font-medium text-ink/60 hover:border-brand/40 hover:text-brand"
              >
                <Plus className="h-3 w-3" aria-hidden />
                {kind}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 space-y-3">
          {blocks.map((block, index) => (
            <div key={index} className="rounded-lg border border-line p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded bg-paper px-2 py-0.5 font-mono text-[10px] uppercase text-ink/50">
                  {block.kind}
                </span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveBlock(index, -1)} aria-label="Lên" className="rounded border border-line p-1 text-ink/50 hover:text-brand">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => moveBlock(index, 1)} aria-label="Xuống" className="rounded border border-line p-1 text-ink/50 hover:text-brand">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setBlocks((current) => current.filter((_, i) => i !== index))} aria-label="Xóa block" className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                {block.kind === "table" ? (
                  <TableEditor block={block} onChange={(next) => updateBlock(index, next)} />
                ) : block.kind === "list" ? (
                  <textarea
                    value={block.items.join("\n")}
                    onChange={(event) => updateBlock(index, { kind: "list", items: lines(event.target.value) })}
                    rows={4}
                    placeholder="Mỗi dòng là một gạch đầu dòng"
                    className={inputClass}
                  />
                ) : (
                  <textarea
                    value={block.text}
                    onChange={(event) => updateBlock(index, { kind: block.kind, text: event.target.value })}
                    rows={block.kind === "p" ? 4 : 2}
                    className={inputClass}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">FAQ</h2>
          <button type="button" onClick={() => setFaqs((current) => [...current, { question: "", answer: "" }])} className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-xs font-medium text-ink/60 hover:text-brand">
            <Plus className="h-3 w-3" aria-hidden /> Thêm FAQ
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="grid gap-2 rounded-lg border border-line p-3 sm:grid-cols-2">
              <input
                value={faq.question}
                onChange={(event) => setFaqs((current) => current.map((item, i) => i === index ? { ...item, question: event.target.value } : item))}
                placeholder="Câu hỏi"
                className={inputClass}
              />
              <textarea
                value={faq.answer}
                onChange={(event) => setFaqs((current) => current.map((item, i) => i === index ? { ...item, answer: event.target.value } : item))}
                placeholder="Câu trả lời"
                rows={2}
                className={inputClass}
              />
              <button type="button" onClick={() => setFaqs((current) => current.filter((_, i) => i !== index))} className="justify-self-start text-xs text-red-600">
                Xóa FAQ
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">CTA gợi ý</h2>
          <button type="button" onClick={() => setCtas((current) => [...current, { label: "", href: "" }])} className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-xs font-medium text-ink/60 hover:text-brand">
            <Plus className="h-3 w-3" aria-hidden /> Thêm CTA
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {ctas.map((cta, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-2">
              <input
                value={cta.label}
                onChange={(event) => setCtas((current) => current.map((item, i) => i === index ? { ...item, label: event.target.value } : item))}
                placeholder="Nhãn CTA"
                className={inputClass}
              />
              <input
                value={cta.href}
                onChange={(event) => setCtas((current) => current.map((item, i) => i === index ? { ...item, href: event.target.value } : item))}
                placeholder="/danh-muc/voucher"
                className={inputClass}
              />
              <button type="button" onClick={() => setCtas((current) => current.filter((_, i) => i !== index))} className="justify-self-start text-xs text-red-600">
                Xóa CTA
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-3 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white/95 p-3 shadow-sm backdrop-blur">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
          <Save className="h-4 w-4" aria-hidden />
          {pending ? "Đang lưu…" : "Lưu bài viết"}
        </button>
        {state.error && <p className="text-sm text-accent">{state.error}</p>}
        {state.ok && <p className="text-sm text-brand">{state.ok}</p>}
      </div>
    </form>
  );
}
