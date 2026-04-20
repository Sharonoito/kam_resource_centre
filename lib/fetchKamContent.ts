import prisma from './prisma';
import type { kam_content as KamContent } from '@prisma/client';

export async function fetchKamContentBySector(sectorId: number, limit = 20): Promise<KamContent[]> {
  return prisma.kam_content.findMany({
    where: {
      sector_id: sectorId,
      is_active: true,
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function fetchKamContentByTag(tag: string, limit = 20): Promise<KamContent[]> {
  return prisma.kam_content.findMany({
    where: {
      tags: { contains: tag, mode: 'insensitive' },
      is_active: true,
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function fetchPowerBiBySector(sectorId: number): Promise<KamContent[]> {
  return prisma.kam_content.findMany({
    where: {
      sector_id: sectorId,
      content_type: 'POWERBI',
      is_active: true,
    },
    orderBy: { created_at: 'desc' },
  });
}

