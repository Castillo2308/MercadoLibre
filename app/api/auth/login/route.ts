/**
 * POST /api/auth/login
 * 
 * Endpoint para autenticar un usuario.
 * Valida credenciales contra la base de datos y devuelve los datos del usuario.
 * El usuario se encarga de guardar estos datos en localStorage desde el frontend.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

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

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Error en POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesion' },
      { status: 500 }
    );
  }
}
