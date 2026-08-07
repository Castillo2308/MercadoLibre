/**
 * GET /api/users/sales
 *
 * Devuelve los items de orden donde el usuario autenticado es el vendedor
 * (OrderItem.sellerId), con la fecha y estado de cada orden. Se usa para
 * graficar las ventas reales del vendedor por mes en su perfil.
 * Requiere X-User-ID en los headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const items = await prisma.orderItem.findMany({
      where: { sellerId: userId },
      include: {
        product: { select: { id: true, title: true } },
        order: { select: { id: true, orderNumber: true, status: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('GET /api/users/sales error', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
