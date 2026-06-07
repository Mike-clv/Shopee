import { blogPosts, brands, categories, vouchers } from '../../prisma/seed-data.js';

export const mockData = {
  brands,
  categories,
  vouchers,
  blogPosts,
  clickEvents: [],
  copyEvents: [],
  syncLogs: [],
};
