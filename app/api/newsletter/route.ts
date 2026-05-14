import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    // Intenta guardar en BD si existe la tabla newsletters, si no solo retorna ok
    try {
      await prisma.newsletter.create({ data: { email } });
    } catch (err) {
      // Si no existe la tabla o falla, ignoramos y retornamos ok
      console.warn('No se pudo persistir newsletter:', err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/newsletter:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
