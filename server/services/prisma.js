import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export function getPrisma() {
  if (!globalForPrisma.__prismaClient) {
    globalForPrisma.__prismaClient = new PrismaClient();
  }
  return globalForPrisma.__prismaClient;
}

export async function canUseDatabase() {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.warn('[database] using fallback data:', error.message);
    return false;
  }
}
