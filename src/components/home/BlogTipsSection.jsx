import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { localClient } from '@/api/localClient';

export default function BlogTipsSection() {
  const { data: posts = [] } = useQuery({
    queryKey: ['home-blog-tips'],
    queryFn: () => localClient.entities.BlogPost.filter({ status: 'published' }, '-published_at', 100),
  });

  if (!posts.length) return null;

  return (
    <section className="py-10 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading-pro text-xl sm:text-2xl font-bold font-heading">Mẹo Săn Mã</h2>
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline">Xem tất cả →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug || post.id}`} className="content-card group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all">
              {post.cover_image && (
                <div className="aspect-[16/9] overflow-hidden bg-secondary">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-4">
                {post.category && <span className="text-[11px] font-semibold uppercase text-primary">{post.category}</span>}
                <h3 className="font-bold font-heading mt-1 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
                {post.published_at && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(post.published_at).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
