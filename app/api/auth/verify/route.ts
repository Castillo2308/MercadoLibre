/**
 * GET /api/auth/verify?token=...
 *
 * Verifica el correo de un usuario a partir del token enviado por email.
 * Redirige a /auth/login con un query param indicando el resultado.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const loginUrl = new URL('/auth/login', request.url);

  if (!token) {
    loginUrl.searchParams.set('verify', 'missing');
    return NextResponse.redirect(loginUrl);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      select: { id: true, verificationTokenExpiry: true, isVerified: true },
    });

    if (!user) {
      loginUrl.searchParams.set('verify', 'invalid');
      return NextResponse.redirect(loginUrl);
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      loginUrl.searchParams.set('verify', 'expired');
      return NextResponse.redirect(loginUrl);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    loginUrl.searchParams.set('verify', 'success');
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Error en GET /api/auth/verify:', error);
    loginUrl.searchParams.set('verify', 'error');
    return NextResponse.redirect(loginUrl);
  }
}
