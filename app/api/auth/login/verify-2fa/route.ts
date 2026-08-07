/**
 * POST /api/auth/login/verify-2fa
 *
 * Paso 2 del login. Recibe el código de un solo uso enviado por correo tras
 * /api/auth/login y, si es válido, devuelve los datos del usuario (equivalente
 * al login exitoso de antes).
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
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        twoFactorCode: true,
        twoFactorCodeExpiry: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 });
    }

    if (!user.twoFactorCode || user.twoFactorCode !== code.trim()) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 });
    }

    if (user.twoFactorCodeExpiry && user.twoFactorCodeExpiry < new Date()) {
      return NextResponse.json({ error: 'El código venció, vuelve a iniciar sesión' }, { status: 400 });
    }

    const { twoFactorCode: _c, twoFactorCodeExpiry: _e, ...safeUser } = user;

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode: null, twoFactorCodeExpiry: null, lastLogin: new Date() },
    });

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Error en POST /api/auth/login/verify-2fa:', error);
    return NextResponse.json({ error: 'Error al verificar el código' }, { status: 500 });
  }
}
