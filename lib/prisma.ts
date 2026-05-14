/**
 * prisma.ts
 * 
 * Instancia singleton de Prisma Client.
 * Evita crear múltiples instancias en desarrollo (hot reload).
 * Se exporta para usar en db-queries.ts y rutas API.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
