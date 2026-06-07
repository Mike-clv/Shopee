import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { localClient } from '@/api/localClient';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const slug = window.location.pathname.split('/blog/')[1];

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const bySlug = await localClient.entities.BlogPost.filter({ slug });
      if (bySlug.length) return bySlug;
      return await localClient.entities.BlogPost.filter({ id: slug });
    },
    enabled: !!slug,
  });

  const post = posts[0];
  const isPublic = post?.status === 'published';

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!post || !isPublic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">📝</p>
        <h1 className="text-xl font-bold mb-2">Không tìm thấy bài viết</h1>
        <Link to="/blog"><Button className="rounded-full mt-4">Xem bài viết khác</Button></Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/blog" className="hover:text-primary">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      {post.category && <span className="text-xs font-medium text-primary uppercase tracking-wider">{post.category}</span>}
      <h1 className="text-2xl sm:text-3xl font-bold font-heading mt-1 mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
        <Calendar className="w-4 h-4" />
        {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'N/A'}
      </div>

      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl mb-8 max-h-96 object-cover" />
      )}

      <div className="prose prose-sm sm:prose max-w-none">
        <ReactMarkdown>{post.content || ''}</ReactMarkdown>
      </div>
    </article>
  );
}
