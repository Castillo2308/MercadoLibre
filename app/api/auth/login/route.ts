/**
 * POST /api/auth/login
 *
 * Endpoint para autenticar un usuario (paso 1 de 2).
 * Valida credenciales contra la base de datos. Si son correctas, genera un
 * código de un solo uso (2FA), lo guarda y lo envía por correo. NO devuelve
 * los datos del usuario todavía — eso ocurre en /api/auth/login/verify-2fa
 * una vez que el usuario confirma el código.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendTwoFactorCodeEmail, isEmailConfigured } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Correo y contrasena son obligatorios' },
        { status: 400 }
      );
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
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales invalidas' },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Credenciales invalidas' },
        { status: 401 }
      );
    }

    // Salvaguarda: si el correo SMTP aún no está configurado (variables de entorno
    // faltantes), no se puede exigir 2FA porque el código nunca llegaría y nadie
    // podría iniciar sesión. En ese caso, se deja entrar directo como antes.
    if (!isEmailConfigured) {
      console.warn('[login] SMTP no configurado — se omite 2FA y se inicia sesión directo.');
      const { passwordHash: _passwordHash, ...safeUser } = user;
      await prisma.user
        .update({ where: { id: safeUser.id }, data: { lastLogin: new Date() } })
        .catch((err) => console.error('Error actualizando lastLogin:', err));
      return NextResponse.json({ user: safeUser }, { status: 200 });
    }

    const twoFactorCode = crypto.randomInt(100000, 1000000).toString();
    const twoFactorCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode, twoFactorCodeExpiry },
    });

    try {
      await sendTwoFactorCodeEmail({
        to: user.email,
        firstName: user.firstName,
        code: twoFactorCode,
      });
    } catch (err) {
      console.error('Error enviando código 2FA:', err);
      return NextResponse.json(
        { error: 'No pudimos enviar el código de acceso, intenta de nuevo' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { requires2FA: true, email: user.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesion' },
      { status: 500 }
    );
  }
}
