import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ChevronRight, ExternalLink, Home } from 'lucide-react';
import { localClient } from '@/api/localClient';
import Seo from '@/components/Seo';
import MarkdownContent from '@/components/content/MarkdownContent';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE_KEYWORDS, DEFAULT_DESCRIPTION, mergeKeywords } from '@/lib/site';

export default function InterestDetail() {
  const { slug } = useParams();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['interest-post', slug],
    queryFn: async () => {
      const bySlug = await localClient.entities.InterestPost.filter({ slug });
      if (bySlug.length) return bySlug;
      return localClient.entities.InterestPost.filter({ id: slug });
    },
    enabled: !!slug,
  });

  const post = posts[0];
  const isPublic = post?.status === 'published';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (!post || !isPublic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="mb-4 text-4xl">🛍️</p>
        <h1 className="mb-2 text-xl font-bold">Không tìm thấy bài viết quan tâm</h1>
        <p className="text-sm text-muted-foreground">
          Bài viết này có thể chưa được xuất bản hoặc đường dẫn đã thay đổi.
        </p>
        <Link to="/" className="inline-block">
          <Button className="mt-4 rounded-full">Quay về trang chủ</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Seo
        title={post.title}
        description={post.excerpt || post.content || DEFAULT_DESCRIPTION}
        path={`/quan-tam/${post.slug || post.id}`}
        image={post.thumbnail_image}
        type="article"
        keywords={mergeKeywords(BASE_KEYWORDS, [
          post.title,
          'co the ban quan tam',
          'có thể bạn quan tâm',
          'goi y mua sam',
          'gợi ý mua sắm',
        ])}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt || post.content || DEFAULT_DESCRIPTION,
          image: post.thumbnail_image ? [post.thumbnail_image] : undefined,
          datePublished: post.published_at || undefined,
          author: {
            '@type': 'Organization',
            name: 'Mã Giảm Giá Pro',
          },
        }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-3.5 w-3.5" />
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Có thể bạn quan tâm</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 text-foreground">{post.title}</span>
      </nav>

      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Gợi ý mua sắm
      </span>
      <h1 className="mt-2 text-2xl font-bold font-heading sm:text-3xl">{post.title}</h1>

      <div className="mb-6 mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
      </div>

      {post.thumbnail_image && (
        <img
          src={post.thumbnail_image}
          alt={post.title}
          className="mb-8 max-h-[420px] w-full rounded-2xl object-cover"
        />
      )}

      {post.excerpt && (
        <p className="mb-6 text-base leading-7 text-muted-foreground">
          {post.excerpt}
        </p>
      )}

      <MarkdownContent content={post.content || ''} />

      {post.target_url && (
        <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5">
          <p className="text-sm text-muted-foreground">
            Xem sản phẩm hoặc chiến dịch gắn với bài viết này tại đây.
          </p>
          <a
            href={post.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline shadow transition-opacity hover:opacity-90"
          >
            <span>Xem ưu đãi ngay</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </article>
  );
}
