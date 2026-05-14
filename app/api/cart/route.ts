/**
 * GET /api/cart
 * POST /api/cart
 * 
 * Endpoints para gestionar el carrito de compras del usuario.
 * GET: Obtiene los items del carrito del usuario autenticado
 * POST: Agrega un producto al carrito
 * Requiere X-User-ID en los headers para identificar al usuario.
 */

import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

async function getUserCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { addedAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              mainImageUrl: true,
              seller: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return cart;
}

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.cart.create({
    data: {
      userId,
    },
  });
}

// Obtener carrito del usuario
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await getUserCart(userId);

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json({ items: cart.items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// Agregar item al carrito
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const cart = await getOrCreateCart(userId);

    // Obtener producto
    const product = await prisma.product.findUnique({
      where: { id: String(productId) },
      select: { id: true, title: true, price: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Buscar item existente en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: String(productId),
      },
    });

    let cartItem;
    if (existingItem) {
      // Actualizar cantidad
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              mainImageUrl: true,
            },
          },
        },
      });
    } else {
      // Crear nuevo item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: String(productId),
          quantity,
          unitPrice: product.price,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              mainImageUrl: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true, item: cartItem, message: 'Item added to cart' }, { status: 200 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// Actualizar cantidad en carrito
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, productId, quantity } = await request.json();

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        ...(itemId ? { id: itemId } : {}),
        ...(productId ? { productId: String(productId) } : {}),
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
      return NextResponse.json({ success: true, message: 'Item removed' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            mainImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: cartItem,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// Eliminar item del carrito
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, productId } = await request.json();

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return NextResponse.json({ success: true, message: 'Cart already empty' }, { status: 200 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        ...(itemId ? { id: itemId } : {}),
        ...(productId ? { productId: String(productId) } : {}),
      },
    });

    if (!existingItem) {
      return NextResponse.json({ success: true, message: 'Item already removed' }, { status: 200 });
    }

    await prisma.cartItem.delete({
      where: { id: existingItem.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
