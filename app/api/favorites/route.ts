/**
 * GET /api/favorites
 * POST /api/favorites
 * DELETE /api/favorites
 * 
 * Endpoints para gestionar favoritos del usuario.
 * GET: Obtiene todos los favoritos del usuario
 * POST: Agrega un producto a favoritos
 * DELETE: Remueve un producto de favoritos
 * Requiere X-User-ID en los headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import {
  addToFavorites as dbAddToFavorites,
  removeFromFavorites as dbRemoveFromFavorites,
  getUserFavorites as dbGetUserFavorites,
} from '@/lib/db-queries';

async function getCurrentUser(request: NextRequest) {
  const userId = request.headers.get('X-User-ID');
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const favs = await dbGetUserFavorites(currentUser.id);
    const data = favs.map((f: any) => ({
      id: f.product.id,
      product: {
        id: f.product.id,
        title: f.product.title || (f.product as any).name || '',
        price: f.product.price ? Number(f.product.price) : 0,
        originalPrice: f.product.originalPrice ? Number(f.product.originalPrice) : null,
        condition: f.product.condition || 'new',
        mainImageUrl: f.product.mainImageUrl || null,
        averageRating: f.product.averageRating || 0,
        reviewCount: f.product.reviewCount || 0,
      },
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/favorites error', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { productId } = body as { productId?: string };
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    await dbAddToFavorites(currentUser.id, productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/favorites error', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { productId } = body as { productId?: string };
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    await dbRemoveFromFavorites(currentUser.id, productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/favorites error', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
