import "server-only";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog/posts";
import { getPublishedCmsPost, listPublishedCmsPosts } from "./data";

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Published CMS posts override a static post with the same slug. */
export async function listAllPublishedPosts(): Promise<BlogPost[]> {
  const cmsPosts = await listPublishedCmsPosts();
  const bySlug = new Map<string, BlogPost>();
  for (const post of BLOG_POSTS) bySlug.set(post.slug, post);
  for (const post of cmsPosts) bySlug.set(post.slug, post);
  return sortPosts([...bySlug.values()]);
}

export async function getAnyPublishedPost(
  slug: string,
): Promise<BlogPost | undefined> {
  const cmsPost = await getPublishedCmsPost(slug);
  if (cmsPost) return cmsPost;
  return BLOG_POSTS.find((post) => post.slug === slug);
}
