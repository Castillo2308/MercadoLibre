/**
 * GET /api/products/[id]
 *
 * Devuelve el detalle completo de un producto: imágenes, categoría,
 * datos del vendedor y reseñas reales.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            sellerRating: true,
            totalSales: true,
            totalReviews: true,
            isVerified: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            reviewer: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
