import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/newsletter:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
