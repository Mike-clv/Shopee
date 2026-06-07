import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { localClient } from '@/api/localClient';

export default function InterestSection({ posts: providedPosts }) {
  const { data: posts = [] } = useQuery({
    queryKey: ['interest-posts'],
    queryFn: () => localClient.entities.InterestPost.filter({ status: 'published' }, 'sort_order', 12),
    enabled: !providedPosts,
  });

  const visiblePosts = providedPosts || posts;

  if (!visiblePosts.length) return null;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading-pro text-xl sm:text-2xl font-bold font-heading">Có Thể Bạn Quan Tâm</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiblePosts.map((post) => {
            const card = (
              <article className="content-card group h-full bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all">
                {post.thumbnail_image && (
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img src={post.thumbnail_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase text-primary">Gợi ý mua sắm</span>
                    {post.target_url && <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </div>
                  <h3 className="font-bold font-heading mt-1 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
                </div>
              </article>
            );

            return post.target_url ? (
              <a key={post.id} href={post.target_url} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            ) : (
              <div key={post.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
