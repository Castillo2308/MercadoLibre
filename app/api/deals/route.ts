import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const deals = await prisma.product.findMany({
      where: {
        isActive: true,
        discountPercentage: { not: null },
      },
      include: {
        images: true,
        seller: { select: { firstName: true, lastName: true } },
      },
      orderBy: { discountPercentage: 'desc' },
      take: 10,
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
