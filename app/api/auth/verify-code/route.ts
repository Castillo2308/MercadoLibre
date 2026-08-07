/**
 * POST /api/auth/verify-code
 *
 * Verifica el correo de un usuario a partir del código de 6 dígitos
 * enviado por email durante el registro (alternativa al enlace de /api/auth/verify).
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body as { email?: string; code?: string };

    if (!email || !code) {
      return NextResponse.json({ error: 'Correo y código son obligatorios' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        isVerified: true,
        verificationCode: true,
        verificationTokenExpiry: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'No encontramos una cuenta con ese correo' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'La cuenta ya estaba verificada' }, { status: 200 });
    }

    if (!user.verificationCode || user.verificationCode !== code.trim()) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 });
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'El código venció, vuelve a registrarte para recibir uno nuevo' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationCode: null,
        verificationTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Cuenta verificada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error en POST /api/auth/verify-code:', error);
    return NextResponse.json({ error: 'Error al verificar el código' }, { status: 500 });
  }
}
