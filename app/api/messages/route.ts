import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const SUPPORT_EMAIL = 'soporte@kivra.com';

async function getCurrentUser(request: NextRequest) {
  const userId = request.headers.get('X-User-ID');
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
}

async function getOrCreateSupportUser() {
  const existing = await prisma.user.findUnique({
    where: { email: SUPPORT_EMAIL },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      firstName: 'Soporte',
      lastName: 'Kivra',
      email: SUPPORT_EMAIL,
      passwordHash: 'support-account',
      isActive: true,
      isVerified: true,
    },
  });
}

async function ensureSingleWelcomeMessage(userId: string) {
  const support = await getOrCreateSupportUser();

  const existing = await prisma.message.findFirst({
    where: {
      senderId: support.id,
      recipientId: userId,
    },
    select: { id: true },
  });

  if (existing) return;

  await prisma.message.create({
    data: {
      senderId: support.id,
      recipientId: userId,
      content:
        'Hola! Soy el equipo de Kivra. Este es tu mensaje de bienvenida. Si necesitas ayuda para comprar o vender, respondeme por aqui.',
      isRead: false,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureSingleWelcomeMessage(currentUser.id);

    const otherUserId = request.nextUrl.searchParams.get('otherUserId');

    if (otherUserId) {
      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true },
      });

      if (!otherUser) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }

      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
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
            { senderId: currentUser.id, recipientId: otherUserId },
            { senderId: otherUserId, recipientId: currentUser.id },
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

    const conversationsMap = new Map<
      string,
      {
        otherUser: {
          id: string;
          name: string;
          email: string;
          avatarUrl: string | null;
        };
        lastMessage: string;
        timestamp: Date;
        unread: number;
      }
    >();

    for (const message of allMessages) {
      const isSender = message.senderId === currentUser.id;
      const other = isSender ? message.recipient : message.sender;
      const key = other.id;

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
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, recipientEmail, content, productId, orderId } = body as {
      recipientId?: string;
      recipientEmail?: string;
      content?: string;
      productId?: string;
      orderId?: string;
    };

    if (!content?.trim()) {
      return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 });
    }

    let recipient = null;
    if (recipientId) {
      recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    } else if (recipientEmail) {
      recipient = await prisma.user.findUnique({
        where: { email: recipientEmail.trim().toLowerCase() },
      });
    }

    if (!recipient) {
      return NextResponse.json({ error: 'Destinatario no encontrado' }, { status: 404 });
    }

    if (recipient.id === currentUser.id) {
      return NextResponse.json({ error: 'No puedes enviarte mensajes a ti mismo' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: currentUser.id,
        recipientId: recipient.id,
        content: content.trim(),
        productId: productId || null,
        orderId: orderId || null,
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
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}
