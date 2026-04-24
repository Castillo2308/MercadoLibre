import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

function splitName(name?: string) {
  const safeName = (name || '').trim();
  if (!safeName) {
    return { firstName: 'Usuario', lastName: 'Mercado' };
  }

  const parts = safeName.split(/\s+/);
  return {
    firstName: parts[0] || 'Usuario',
    lastName: parts.slice(1).join(' ') || 'Mercado',
  };
}

async function getOrCreateUserByEmail(email: string, name?: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return existing;
  }

  const { firstName, lastName } = splitName(name || normalizedEmail.split('@')[0]);

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      firstName,
      lastName,
      passwordHash: 'local-auth-placeholder',
      isActive: true,
      isVerified: false,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const currentUserEmail = request.nextUrl.searchParams.get('currentUserEmail');
    const otherUserEmail = request.nextUrl.searchParams.get('otherUserEmail');

    if (!currentUserEmail) {
      return NextResponse.json(
        { error: 'currentUserEmail es requerido' },
        { status: 400 }
      );
    }

    const currentUser = await getOrCreateUserByEmail(currentUserEmail);

    if (otherUserEmail) {
      const otherUser = await getOrCreateUserByEmail(otherUserEmail);

      await prisma.message.updateMany({
        where: {
          senderId: otherUser.id,
          recipientId: currentUser.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, recipientId: otherUser.id },
            { senderId: otherUser.id, recipientId: currentUser.id },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json({
        data: messages.map((message) => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          isRead: message.isRead,
          sender: {
            id: message.sender.id,
            name: `${message.sender.firstName} ${message.sender.lastName}`.trim(),
            email: message.sender.email,
            avatarUrl: message.sender.avatarUrl,
          },
        })),
      });
    }

    const allMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUser.id }, { recipientId: currentUser.id }],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationsMap = new Map<string, {
      otherUser: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
      };
      lastMessage: string;
      timestamp: Date;
      unread: number;
    }>();

    for (const message of allMessages) {
      const isSender = message.senderId === currentUser.id;
      const other = isSender ? message.recipient : message.sender;
      const key = other.email;

      const previous = conversationsMap.get(key);
      if (!previous) {
        conversationsMap.set(key, {
          otherUser: {
            id: other.id,
            name: `${other.firstName} ${other.lastName}`.trim(),
            email: other.email,
            avatarUrl: other.avatarUrl,
          },
          lastMessage: message.content,
          timestamp: message.createdAt,
          unread: !isSender && !message.isRead ? 1 : 0,
        });
      } else if (!isSender && !message.isRead) {
        previous.unread += 1;
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return NextResponse.json({ data: conversations });
  } catch (error) {
    console.error('Error en GET /api/messages:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      senderEmail,
      senderName,
      recipientEmail,
      recipientName,
      content,
    } = body as {
      senderEmail?: string;
      senderName?: string;
      recipientEmail?: string;
      recipientName?: string;
      content?: string;
    };

    if (!senderEmail || !recipientEmail || !content?.trim()) {
      return NextResponse.json(
        { error: 'senderEmail, recipientEmail y content son requeridos' },
        { status: 400 }
      );
    }

    if (senderEmail.trim().toLowerCase() === recipientEmail.trim().toLowerCase()) {
      return NextResponse.json(
        { error: 'No puedes enviarte mensajes a ti mismo' },
        { status: 400 }
      );
    }

    const sender = await getOrCreateUserByEmail(senderEmail, senderName);
    const recipient = await getOrCreateUserByEmail(recipientEmail, recipientName);

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        recipientId: recipient.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        isRead: message.isRead,
        sender: {
          id: message.sender.id,
          name: `${message.sender.firstName} ${message.sender.lastName}`.trim(),
          email: message.sender.email,
          avatarUrl: message.sender.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error en POST /api/messages:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}