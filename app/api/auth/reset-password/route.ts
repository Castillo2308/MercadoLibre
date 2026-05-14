/**
 * POST /api/auth/reset-password
 *
 * Endpoint para cambiar la contraseña de un usuario existente.
 * Busca al usuario por correo y actualiza el hash de la nueva contraseña.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body as {
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Las contrasenas no coinciden' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contrasena debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'No encontramos una cuenta con ese correo' }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ message: 'Contrasena actualizada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error en POST /api/auth/reset-password:', error);
    return NextResponse.json({ error: 'Error al actualizar la contrasena' }, { status: 500 });
  }
}