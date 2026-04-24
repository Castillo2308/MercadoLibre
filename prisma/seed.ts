import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Limpiar existentes
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.return.deleteMany();
  await prisma.review.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.message.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Categorías
  const [cat1, cat2, cat3] = await Promise.all([
    prisma.category.create({
      data: { name: 'Electrónica', slug: 'electronica', icon: '📱', displayOrder: 1 },
    }),
    prisma.category.create({
      data: { name: 'Computadoras', slug: 'computadoras', icon: '💻', displayOrder: 2 },
    }),
    prisma.category.create({
      data: { name: 'Ropa', slug: 'ropa', icon: '👔', displayOrder: 3 },
    }),
  ]);

  // Vendedores
  const [seller1, seller2] = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'Tech',
        lastName: 'Store',
        email: 'tech@store.com',
        passwordHash,
        isVerified: true,
        isSeller: true,
        sellerRating: 4.8,
        sellerProfile: {
          create: {
            storeName: 'Tech Store',
            sellerLevel: 'platinum',
            isVerifiedSeller: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Fashion',
        lastName: 'Hub',
        email: 'fashion@hub.com',
        passwordHash,
        isVerified: true,
        isSeller: true,
        sellerRating: 4.7,
        sellerProfile: {
          create: {
            storeName: 'Fashion Hub',
            sellerLevel: 'gold',
            isVerifiedSeller: true,
          },
        },
      },
    }),
  ]);

  // Productos
  const [p1, p2, p3, p4, p5] = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: cat1.id,
        title: 'iPhone 14 Pro 256GB',
        sku: 'IPHONE14-256',
        price: '999.99',
        originalPrice: '1199.99',
        quantityAvailable: 45,
        averageRating: 4.9,
        reviewCount: 342,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: cat1.id,
        title: 'Samsung Galaxy S23',
        sku: 'SAMSUNG-S23',
        price: '899.99',
        quantityAvailable: 52,
        averageRating: 4.8,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: cat2.id,
        title: 'MacBook Pro 14"',
        sku: 'MACBOOK-14',
        price: '1899.99',
        quantityAvailable: 15,
        averageRating: 4.9,
        isActive: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: cat3.id,
        title: 'Camiseta Básica',
        sku: 'TSHIRT-BASIC',
        price: '19.99',
        quantityAvailable: 200,
        averageRating: 4.6,
        isActive: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: cat3.id,
        title: 'Jeans Premium',
        sku: 'JEANS-PREMIUM',
        price: '59.99',
        quantityAvailable: 150,
        averageRating: 4.7,
        isActive: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500' }] },
      },
    }),
  ]);

  // Compradores
  const [buyer1, buyer2] = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        passwordHash,
        isVerified: true,
        buyerRating: 4.9,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'María',
        lastName: 'López',
        email: 'maria@example.com',
        passwordHash,
        isVerified: true,
        buyerRating: 4.8,
      },
    }),
  ]);

  // Carritos
  await Promise.all([
    prisma.cart.create({
      data: {
        userId: buyer1.id,
        itemCount: 2,
        subtotal: '1249.98',
        items: {
          create: [
            { productId: p1.id, quantity: 1, unitPrice: '999.99' },
            { productId: p2.id, quantity: 1, unitPrice: '899.99' },
          ],
        },
      },
    }),
    prisma.cart.create({
      data: {
        userId: buyer2.id,
        itemCount: 2,
        subtotal: '79.98',
        items: {
          create: [
            { productId: p4.id, quantity: 2, unitPrice: '19.99' },
            { productId: p5.id, quantity: 1, unitPrice: '59.99' },
          ],
        },
      },
    }),
  ]);

  // Favoritos
  await Promise.all([
    prisma.favorite.create({ data: { userId: buyer1.id, productId: p1.id } }),
    prisma.favorite.create({ data: { userId: buyer1.id, productId: p3.id } }),
    prisma.favorite.create({ data: { userId: buyer2.id, productId: p5.id } }),
  ]);

  // Mensajes
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: buyer1.id,
        recipientId: seller1.id,
        content: '¿Aún disponible el iPhone?',
        productId: p1.id,
      },
    }),
    prisma.message.create({
      data: {
        senderId: seller1.id,
        recipientId: buyer1.id,
        content: 'Sí, tenemos disponibles',
        productId: p1.id,
        isRead: true,
      },
    }),
  ]);

  // Reseñas
  await Promise.all([
    prisma.review.create({
      data: {
        productId: p1.id,
        reviewerId: buyer1.id,
        sellerId: seller1.id,
        rating: 5,
        title: 'Excelente producto',
        comment: 'Llegó en perfecto estado',
        isVerifiedPurchase: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: p5.id,
        reviewerId: buyer2.id,
        sellerId: seller2.id,
        rating: 4,
        title: 'Muy bueno',
        comment: 'Excelente calidad al precio',
        isVerifiedPurchase: true,
      },
    }),
  ]);

  // Órdenes
  await Promise.all([
    prisma.order.create({
      data: {
        buyerId: buyer1.id,
        orderNumber: `ORD-${Date.now()}-1`,
        subtotal: '999.99',
        tax: '99.99',
        totalAmount: '1099.98',
        status: 'delivered',
        paymentStatus: 'completed',
        deliveredAt: new Date(),
        items: {
          create: [
            {
              productId: p1.id,
              sellerId: seller1.id,
              quantity: 1,
              unitPrice: '999.99',
              subtotal: '999.99',
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        buyerId: buyer2.id,
        orderNumber: `ORD-${Date.now()}-2`,
        subtotal: '59.99',
        tax: '5.99',
        totalAmount: '65.98',
        status: 'confirmed',
        paymentStatus: 'completed',
        items: {
          create: [
            {
              productId: p5.id,
              sellerId: seller2.id,
              quantity: 1,
              unitPrice: '59.99',
              subtotal: '59.99',
            },
          ],
        },
      },
    }),
  ]);

  // Notificaciones
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: buyer1.id,
        title: 'Tu pedido entregado',
        message: 'Tu iPhone fue entregado',
        type: 'order',
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: buyer2.id,
        title: 'Nuevo mensaje',
        message: 'El vendedor te respondió',
        type: 'message',
      },
    }),
  ]);

  console.log('✅ Seed completado!');
  console.log('✓ 3 categorías | ✓ 2 vendedores | ✓ 2 compradores');
  console.log('✓ 5 productos | ✓ 2 carritos | ✓ 3 favoritos');
  console.log('✓ 2 mensajes | ✓ 2 reseñas | ✓ 2 órdenes | ✓ 2 notificaciones');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
