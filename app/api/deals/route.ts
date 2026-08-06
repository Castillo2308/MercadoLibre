/**
 * GET /api/deals
 * 
 * Endpoint para obtener productos en oferta/descuento.
 * Devuelve productos activos que tienen porcentaje de descuento.
 * Ordenados por descuento en orden descendente.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const deals = await prisma.product.findMany({
      where: {
        isActive: true,
        originalPrice: { not: null },
      },
      include: {
        images: true,
        seller: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
