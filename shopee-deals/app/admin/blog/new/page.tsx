import { requireAdmin } from "@/lib/auth";
import { EDITORIAL_TEAM } from "@/lib/blog/author";
import { CmsPostForm } from "@/lib/components/admin/CmsPostForm";
import type { PostInput } from "@/lib/cms/validation";

export const metadata = {
  title: "Cpanel — Bài viết mới",
  robots: { index: false, follow: false },
};

export const instant = false;

const INITIAL: PostInput = {
  slug: "bai-viet-moi",
  path: "/blog/bai-viet-moi",
  title: "",
  excerpt: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  isFeatured: false,
  body: [{ kind: "p", text: "" }],
  meta: {
    tagLabel: "Mẹo mua sắm",
    tagHref: "/blog",
    minutes: 6,
    gradient: "from-[#b23a1d] to-[#6f2110]",
    icon: "Tag",
    cover: {
      src: "/images/khuyen-mai/11-11-shopee-2026.jpg",
      alt: "Ảnh bìa bài viết",
      width: 1200,
      height: 675,
      caption: "",
    },
    author: EDITORIAL_TEAM,
    hintedCtas: [],
    faqs: [],
  },
};

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Bài viết mới</h1>
        <p className="mt-1 text-sm text-ink/50">
          Lưu nháp trước, kiểm tra nội dung rồi chuyển sang xuất bản.
        </p>
      </div>
      <CmsPostForm initial={INITIAL} />
    </div>
  );
}
