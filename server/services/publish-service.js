import { getPrisma } from './prisma.js';

const schedulableModels = ['blogPost', 'interestPost'];

export async function publishScheduledContent() {
  const prisma = getPrisma();
  const now = new Date();
  const results = await Promise.all(
    schedulableModels.map((model) =>
      prisma[model].updateMany({
        where: {
          status: 'scheduled',
          published_at: {
            lte: now,
          },
        },
        data: {
          status: 'published',
        },
      })
    )
  );

  return results.reduce((total, result) => total + (result?.count || 0), 0);
}
