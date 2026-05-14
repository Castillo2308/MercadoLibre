/**
 * GET /api/products
 * 
 * Endpoint para obtener productos con filtros opcionales.
 * Soporta búsqueda por categoría (category), nombre (q) y paginación (take).
 * Solo devuelve productos activos.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const q = url.searchParams.get('q');
    const take = Number(url.searchParams.get('take') || 20);

    const where: any = { isActive: true };

    if (category) {
      // filter by category slug or id
      where.category = { slug: category };
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        seller: { select: { firstName: true, lastName: true, sellerRating: true } },
        category: true,
      },
      take,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
