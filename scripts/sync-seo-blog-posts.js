import 'dotenv/config';
import { seoBlogPosts } from '../prisma/seo-blog-posts.js';

const baseUrl = (process.argv[2] || process.env.CONTENT_SYNC_BASE_URL || 'http://localhost:3001').replace(/\/+$/, '');
const adminEmail = process.env.CONTENT_SYNC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const adminPassword = process.env.CONTENT_SYNC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('Thiếu CONTENT_SYNC_ADMIN_EMAIL/CONTENT_SYNC_ADMIN_PASSWORD hoặc ADMIN_EMAIL/ADMIN_PASSWORD.');
  process.exit(1);
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message ? data.message : `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return { response, data };
}

async function login() {
  const { response } = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: adminEmail,
      password: adminPassword,
    },
  });

  const cookie = response.headers.get('set-cookie');
  if (!cookie) {
    throw new Error('Không lấy được cookie đăng nhập admin.');
  }

  return cookie.split(';')[0];
}

function normalizePost(post) {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.cover_image,
    category: post.category,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    status: post.status,
    published_at:
      post.published_at instanceof Date
        ? post.published_at.toISOString()
        : post.published_at,
  };
}

async function upsertBlogPost(cookie, post) {
  const encodedSlug = encodeURIComponent(post.slug);
  const { data: existing } = await request(`/api/blog-posts?slug=${encodedSlug}`);
  const payload = normalizePost(post);

  if (Array.isArray(existing) && existing.length > 0) {
    const current = existing[0];
    await request(`/api/blog-posts/${encodeURIComponent(current.id)}`, {
      method: 'PUT',
      headers: { Cookie: cookie },
      body: payload,
    });
    return { action: 'updated', slug: post.slug };
  }

  await request('/api/blog-posts', {
    method: 'POST',
    headers: { Cookie: cookie },
    body: {
      id: post.id,
      ...payload,
    },
  });
  return { action: 'created', slug: post.slug };
}

async function main() {
  console.log(`Dong bo bai viet SEO toi ${baseUrl}`);
  const cookie = await login();
  const results = [];

  for (const post of seoBlogPosts) {
    const result = await upsertBlogPost(cookie, post);
    results.push(result);
    console.log(`${result.action.toUpperCase()}: ${result.slug}`);
  }

  const created = results.filter((item) => item.action === 'created').length;
  const updated = results.filter((item) => item.action === 'updated').length;
  console.log(`Hoan tat. Created: ${created}, Updated: ${updated}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
