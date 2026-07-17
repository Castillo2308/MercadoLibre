/**
 * GET /api/users/orders
 * 
 * Endpoint para obtener el historial de órdenes del usuario.
 * Devuelve todas las órdenes del usuario autenticado.
 * Requiere X-User-ID en los headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders } from '@/lib/db-queries';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

    const orders = await getUserOrders(currentUser.id, 0, 100);
    return NextResponse.json({ data: orders });
  } catch (error) {
    console.error('GET /api/users/orders error', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
