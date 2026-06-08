import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Seo from '@/components/Seo';
import { BASE_KEYWORDS, mergeKeywords } from '@/lib/site';

const interestKeywords = [
  'co the ban quan tam',
  'có thể bạn quan tâm',
  'goi y mua sam',
  'gợi ý mua sắm',
  'san pham noi bat',
  'sản phẩm nổi bật',
  'ưu đãi nên xem',
  'uu dai nen xem',
];

export default function InterestList() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['interest-posts-page'],
    queryFn: () => localClient.entities.InterestPost.filter({ status: 'published' }, '-published_at', 50),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Seo
        title="Có thể bạn quan tâm | Gợi ý mua sắm nổi bật"
        description="Tổng hợp các bài gợi ý mua sắm, sản phẩm nổi bật và ưu đãi nên xem để bạn tham khảo nhanh trước khi chốt đơn."
        path="/quan-tam"
        keywords={mergeKeywords(BASE_KEYWORDS, interestKeywords)}
      />

      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Có Thể Bạn Quan Tâm</h1>
      <p className="text-muted-foreground mb-8">
        Những bài viết gợi ý mua sắm, sản phẩm nổi bật và ưu đãi đáng chú ý để anh em xem nhanh trước khi quyết định.
      </p>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-2xl border overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🛍️</p>
          <p className="text-muted-foreground">Chưa có bài quan tâm nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/quan-tam/${post.slug || post.id}`}
              className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden group"
            >
              {post.thumbnail_image && (
                <div className="h-48 overflow-hidden bg-secondary">
                  <img
                    src={post.thumbnail_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-5">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Gợi ý mua sắm</span>
                <h2 className="font-semibold font-heading text-base mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
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
