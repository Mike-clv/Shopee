import { PrismaClient } from '@prisma/client';

let prisma;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
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
