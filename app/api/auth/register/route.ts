/**
 * POST /api/auth/register
 * 
 * Endpoint para registrar un nuevo usuario.
 * Valida los datos, hashea la contraseña y crea un usuario en la BD.
 * Devuelve los datos del usuario creado.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Las contrasenas no coinciden' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contrasena debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo ya esta registrado' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        passwordHash,
        isActive: true,
        isVerified: false,
        verificationToken,
        verificationCode,
        verificationTokenExpiry,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    // Se espera el envío (no fire-and-forget): en funciones serverless de Vercel,
    // una promesa no esperada puede quedar cortada apenas se envía la respuesta,
    // y el correo nunca llegaría a salir. El registro igual no falla si el correo falla.
    try {
      await sendVerificationEmail({
        to: user.email,
        firstName: user.firstName,
        token: verificationToken,
        code: verificationCode,
      });
    } catch (err) {
      console.error('Error enviando correo de verificación:', err);
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/auth/register:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
