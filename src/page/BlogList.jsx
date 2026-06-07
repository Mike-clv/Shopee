import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

export default function BlogList() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'blog | Mã Giảm Giá Pro';

    return () => {
      document.title = previousTitle || 'Mã Giảm Giá Pro';
    };
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => localClient.entities.BlogPost.filter({ status: 'published' }, '-published_at', 50),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Blog & Mẹo Săn Mã</h1>
      <p className="text-muted-foreground mb-8">Mẹo mua hàng tiết kiệm, cách sử dụng mã giảm giá hiệu quả</p>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border overflow-hidden">
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
          <p className="text-4xl mb-3">📝</p>
          <p className="text-muted-foreground">Chưa có bài viết nào</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug || post.id}`}
              className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden group"
            >
              {post.cover_image && (
                <div className="h-48 overflow-hidden">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                {post.category && (
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{post.category}</span>
                )}
                <h3 className="font-semibold font-heading text-base mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
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
