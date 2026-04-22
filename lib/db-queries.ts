/**
 * Ejemplos de uso de Prisma ORM
 * Para MercadoLibre Clone
 */

import prisma from "@/lib/prisma";

// =====================================
// USUARIOS
// =====================================

/**
 * Crear un nuevo usuario
 */
export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
}) {
  return await prisma.user.create({
    data,
  });
}

/**
 * Obtener usuario por email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      cart: true,
      favorites: true,
    },
  });
}

/**
 * Actualizar perfil de usuario
 */
export async function updateUserProfile(userId: string, data: any) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
}

// =====================================
// PRODUCTOS
// =====================================

/**
 * Crear un nuevo producto
 */
export async function createProduct(data: {
  title: string;
  description?: string;
  category: string;
  price: number;
  quantityAvailable: number;
  sellerId: string;
  mainImageUrl?: string;
}) {
  return await prisma.product.create({
    data: {
      ...data,
      price: new Decimal(data.price),
    },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          sellerRating: true,
        },
      },
    },
  });
}

/**
 * Obtener productos con filtros
 */
export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  skip?: number;
  take?: number;
}) {
  const skip = filters?.skip || 0;
  const take = filters?.take || 20;

  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.sellerId && { sellerId: filters.sellerId }),
      ...(filters?.minPrice && {
        price: { gte: new Decimal(filters.minPrice) },
      }),
      ...(filters?.maxPrice && {
        price: { lte: new Decimal(filters.maxPrice) },
      }),
    },
    include: {
      seller: {
        select: {
          firstName: true,
          lastName: true,
          sellerRating: true,
        },
      },
      images: {
        take: 3,
      },
      _count: {
        select: { reviews: true },
      },
    },
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Obtener detalle del producto
 */
export async function getProductDetail(productId: string) {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          sellerRating: true,
          totalSales: true,
        },
      },
      images: true,
      reviews: {
        include: {
          reviewer: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

// =====================================
// CARRITO
// =====================================

/**
 * Obtener o crear carrito del usuario
 */
export async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  return cart;
}

/**
 * Agregar producto al carrito
 */
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  const cart = await getOrCreateCart(userId);
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: product.price,
    },
    update: {
      quantity: { increment: quantity },
    },
  });
}

/**
 * Remover producto del carrito
 */
export async function removeFromCart(cartItemId: string) {
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

// =====================================
// ÓRDENES
// =====================================

/**
 * Crear orden desde carrito
 */
export async function createOrder(
  userId: string,
  data: {
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    paymentMethod: string;
  }
) {
  const cart = await getOrCreateCart(userId);
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calcular totales
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
  const tax = subtotal * 0.21; // 21% IVA
  const shippingCost = subtotal > 100 ? 0 : 10; // Envío gratis > $100
  const totalAmount = subtotal + tax + shippingCost;

  // Crear orden
  const order = await prisma.order.create({
    data: {
      buyerId: userId,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingState: data.shippingState,
      shippingPostalCode: data.shippingPostalCode,
      paymentMethod: data.paymentMethod,
      subtotal: new Decimal(subtotal),
      tax: new Decimal(tax),
      shippingCost: new Decimal(shippingCost),
      totalAmount: new Decimal(totalAmount),
      items: {
        createMany: {
          data: cartItems.map((item) => ({
            productId: item.productId,
            sellerId: item.product.sellerId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: new Decimal(Number(item.unitPrice) * item.quantity),
          })),
        },
      },
    },
    include: { items: true },
  });

  // Limpiar carrito
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  // Actualizar stock
  for (const item of cartItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantityAvailable: { decrement: item.quantity },
        quantitySold: { increment: item.quantity },
      },
    });
  }

  return order;
}

/**
 * Obtener órdenes del usuario
 */
export async function getUserOrders(userId: string, skip = 0, take = 10) {
  return await prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      items: {
        include: {
          product: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}

// =====================================
// RESEÑAS
// =====================================

/**
 * Crear reseña de producto
 */
export async function createReview(data: {
  productId: string;
  reviewerId: string;
  sellerId: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const review = await prisma.review.create({
    data,
    include: {
      reviewer: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Actualizar rating promedio del producto
  const reviews = await prisma.review.findMany({
    where: { productId: data.productId },
  });

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.product.update({
    where: { id: data.productId },
    data: {
      averageRating,
      reviewCount: reviews.length,
    },
  });

  return review;
}

// =====================================
// MENSAJES
// =====================================

/**
 * Enviar mensaje
 */
export async function sendMessage(data: {
  senderId: string;
  recipientId: string;
  content: string;
  productId?: string;
}) {
  return await prisma.message.create({
    data,
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });
}

/**
 * Obtener conversación
 */
export async function getConversation(
  userId1: string,
  userId2: string,
  skip = 0,
  take = 20
) {
  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, recipientId: userId2 },
        { senderId: userId2, recipientId: userId1 },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}

// =====================================
// FAVORITOS
// =====================================

/**
 * Agregar a favoritos
 */
export async function addToFavorites(userId: string, productId: string) {
  return await prisma.favorite.create({
    data: { userId, productId },
  });
}

/**
 * Remover de favoritos
 */
export async function removeFromFavorites(userId: string, productId: string) {
  return await prisma.favorite.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

/**
 * Obtener favoritos del usuario
 */
export async function getUserFavorites(userId: string, skip = 0, take = 20) {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true,
              sellerRating: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}
