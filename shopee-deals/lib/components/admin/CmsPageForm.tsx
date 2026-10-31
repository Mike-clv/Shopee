"use client";

import { useActionState, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { savePageAction, type CmsActionState } from "@/app/actions/cms";
import { CMS_PAGE_TYPES } from "@/lib/db/schema";
import type { PageInput } from "@/lib/cms/validation";
import type { CmsChecklistGroup, CmsGuideSection } from "@/lib/cms/types";

const inputClass =
  "mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none";
const labelClass = "block text-xs font-medium text-ink/60";

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function CmsPageForm({ initial, id }: { initial: PageInput; id?: string }) {
  const [state, formAction, pending] = useActionState<CmsActionState, FormData>(
    savePageAction,
    {},
  );
  const [intro, setIntro] = useState(initial.meta.intro.join("\n"));
  const [highlights, setHighlights] = useState(initial.meta.highlights.join("\n"));
  const [sections, setSections] = useState(initial.body);
  const [faqs, setFaqs] = useState(initial.meta.faqs);
  const [checklist, setChecklist] = useState<CmsChecklistGroup[]>(
    initial.meta.checklist ?? [],
  );
  const [guide, setGuide] = useState<CmsGuideSection[]>(initial.meta.guide ?? []);
  const isEvent = initial.meta.pageType === "event";

  return (
    <form action={formAction} className="space-y-5">
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="body" value={JSON.stringify(sections)} />
      <input type="hidden" name="intro" value={JSON.stringify(lines(intro))} />
      <input type="hidden" name="highlights" value={JSON.stringify(lines(highlights))} />
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />
      <input type="hidden" name="checklist" value={JSON.stringify(checklist)} />
      <input type="hidden" name="guide" value={JSON.stringify(guide)} />

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Thông tin trang</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="page-title">Tiêu đề *</label>
            <input id="page-title" name="title" defaultValue={initial.title} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-path">Đường dẫn *</label>
            <input id="page-path" name="path" defaultValue={initial.path} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-slug">Slug *</label>
            <input id="page-slug" name="slug" defaultValue={initial.slug} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-type">Loại trang</label>
            <select id="page-type" name="pageType" defaultValue={initial.meta.pageType} className={inputClass}>
              {CMS_PAGE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="page-status">Trạng thái</label>
            <select id="page-status" name="status" defaultValue={initial.status} className={inputClass}>
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="page-excerpt">Mô tả ngắn</label>
            <textarea id="page-excerpt" name="excerpt" defaultValue={initial.excerpt ?? ""} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-seo-title">SEO title</label>
            <input id="page-seo-title" name="seoTitle" defaultValue={initial.seoTitle ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-seo-description">SEO description</label>
            <input id="page-seo-description" name="seoDescription" defaultValue={initial.seoDescription ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="badge">Badge</label>
            <input id="badge" name="badge" defaultValue={initial.meta.badge ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="updated">Ngày cập nhật</label>
            <input id="updated" name="updated" type="date" defaultValue={initial.meta.updated ?? ""} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Mở đầu & điểm chính</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className={labelClass} htmlFor="page-intro">Các đoạn mở đầu (mỗi dòng một đoạn)</label>
            <textarea id="page-intro" value={intro} onChange={(event) => setIntro(event.target.value)} rows={4} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="page-highlights">Điểm chính (mỗi dòng một ý)</label>
            <textarea id="page-highlights" value={highlights} onChange={(event) => setHighlights(event.target.value)} rows={5} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Mục nội dung ({sections.length})</h2>
          <button type="button" onClick={() => setSections((current) => [...current, { title: "", paragraphs: [""] }])} className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-xs font-medium text-ink/60 hover:text-brand">
            <Plus className="h-3 w-3" aria-hidden /> Thêm mục
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-line p-3">
              <div className="flex gap-2">
                <input
                  value={section.title}
                  onChange={(event) => setSections((current) => current.map((item, i) => i === index ? { ...item, title: event.target.value } : item))}
                  placeholder="Tiêu đề mục"
                  className={inputClass}
                />
                <button type="button" onClick={() => setSections((current) => current.filter((_, i) => i !== index))} aria-label="Xóa mục" className="mt-1 rounded border border-red-200 px-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={section.paragraphs.join("\n")}
                onChange={(event) => setSections((current) => current.map((item, i) => i === index ? { ...item, paragraphs: lines(event.target.value) } : item))}
                rows={4}
                placeholder="Mỗi dòng là một đoạn"
                className={inputClass}
              />
              <textarea
                value={(section.bullets ?? []).join("\n")}
                onChange={(event) => setSections((current) => current.map((item, i) => i === index ? { ...item, bullets: lines(event.target.value) } : item))}
                rows={4}
                placeholder="Bullet (mỗi dòng một ý, không bắt buộc)"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </section>

      {isEvent && (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="font-display text-lg font-semibold text-ink">Dữ liệu sự kiện</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="startISO">Bắt đầu</label>
              <input id="startISO" name="startISO" defaultValue={initial.meta.startISO ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="endISO">Kết thúc</label>
              <input id="endISO" name="endISO" defaultValue={initial.meta.endISO ?? ""} className={inputClass} />
            </div>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Checklist (JSON)</label>
              <textarea
                defaultValue={JSON.stringify(checklist, null, 2)}
                onChange={(event) => {
                  try { setChecklist(JSON.parse(event.target.value) as CmsChecklistGroup[]); } catch { /* keep typing */ }
                }}
                rows={8}
                className={`${inputClass} font-mono text-xs`}
              />
            </div>
            <div>
              <label className={labelClass}>Hướng dẫn (JSON)</label>
              <textarea
                defaultValue={JSON.stringify(guide, null, 2)}
                onChange={(event) => {
                  try { setGuide(JSON.parse(event.target.value) as CmsGuideSection[]); } catch { /* keep typing */ }
                }}
                rows={8}
                className={`${inputClass} font-mono text-xs`}
              />
            </div>
          </div>
        </section>
      )}

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

      <div className="sticky bottom-3 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white/95 p-3 shadow-sm backdrop-blur">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
          <Save className="h-4 w-4" aria-hidden />
          {pending ? "Đang lưu…" : "Lưu trang"}
        </button>
        {state.error && <p className="text-sm text-accent">{state.error}</p>}
        {state.ok && <p className="text-sm text-brand">{state.ok}</p>}
      </div>
    </form>
  );
}
