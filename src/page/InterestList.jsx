import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, mergeKeywords } from '@/lib/site';
import { sortContentByPriority } from '@/lib/content-admin';

const interestKeywords = [
  'có thể bạn quan tâm',
  'gợi ý mua sắm',
  'sản phẩm nổi bật',
  'ưu đãi nên xem',
];

export default function InterestList() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['interest-posts-page'],
    queryFn: () => localClient.entities.InterestPost.filter({ status: 'published' }, 'sort_order', 100),
  });

  const visiblePosts = sortContentByPriority(posts);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Seo
        title="Có thể bạn quan tâm | Gợi ý mua sắm nổi bật"
        description="Tổng hợp các bài gợi ý mua sắm, sản phẩm nổi bật và ưu đãi nên xem để bạn tham khảo nhanh trước khi chốt đơn."
        path="/quan-tam"
        keywords={mergeKeywords(BASE_KEYWORDS, interestKeywords)}
      />

      <h1 className="mb-2 text-2xl font-bold font-heading sm:text-3xl">Có Thể Bạn Quan Tâm</h1>
      <p className="mb-8 text-muted-foreground">
        Những bài viết gợi ý mua sắm, sản phẩm nổi bật và ưu đãi đáng chú ý để anh em xem nhanh trước khi quyết định.
      </p>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border bg-card">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-3 text-4xl">🛍️</p>
          <p className="text-muted-foreground">Chưa có bài quan tâm nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <Link
              key={post.id}
              to={`/quan-tam/${post.slug || post.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
            >
              {post.thumbnail_image && (
                <div className="h-48 overflow-hidden bg-secondary">
                  <img
                    src={post.thumbnail_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">Gợi ý mua sắm</span>
                <h2 className="mt-1 mb-2 line-clamp-2 text-base font-semibold font-heading transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'N/A'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
