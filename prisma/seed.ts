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

  // 12 Categorías
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Laptops y PC', slug: 'laptops-pc', icon: '💻', displayOrder: 1 },
    }),
    prisma.category.create({
      data: { name: 'Celulares', slug: 'celulares', icon: '📱', displayOrder: 2 },
    }),
    prisma.category.create({
      data: { name: 'Gaming', slug: 'gaming', icon: '🎮', displayOrder: 3 },
    }),
    prisma.category.create({
      data: { name: 'Audio', slug: 'audio', icon: '🎧', displayOrder: 4 },
    }),
    prisma.category.create({
      data: { name: 'Hogar', slug: 'hogar', icon: '🏠', displayOrder: 5 },
    }),
    prisma.category.create({
      data: { name: 'Moda', slug: 'moda', icon: '👟', displayOrder: 6 },
    }),
    prisma.category.create({
      data: { name: 'Accesorios', slug: 'accesorios', icon: '⌚', displayOrder: 7 },
    }),
    prisma.category.create({
      data: { name: 'Belleza', slug: 'belleza', icon: '🧴', displayOrder: 8 },
    }),
    prisma.category.create({
      data: { name: 'Movilidad', slug: 'movilidad', icon: '🚗', displayOrder: 9 },
    }),
    prisma.category.create({
      data: { name: 'Ciclismo', slug: 'ciclismo', icon: '🚲', displayOrder: 10 },
    }),
    prisma.category.create({
      data: { name: 'Fitness', slug: 'fitness', icon: '🏋️', displayOrder: 11 },
    }),
    prisma.category.create({
      data: { name: 'Deportes', slug: 'deportes', icon: '⚽', displayOrder: 12 },
    }),
  ]);

  // Vendedores
  const [seller1, seller2, seller3, seller4] = await Promise.all([
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
    prisma.user.create({
      data: {
        firstName: 'Home',
        lastName: 'Decor',
        email: 'homedecor@store.com',
        passwordHash,
        isVerified: true,
        isSeller: true,
        sellerRating: 4.6,
        sellerProfile: {
          create: {
            storeName: 'Home Decor Plus',
            sellerLevel: 'gold',
            isVerifiedSeller: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Sports',
        lastName: 'World',
        email: 'sports@world.com',
        passwordHash,
        isVerified: true,
        isSeller: true,
        sellerRating: 4.9,
        sellerProfile: {
          create: {
            storeName: 'Sports World',
            sellerLevel: 'platinum',
            isVerifiedSeller: true,
          },
        },
      },
    }),
  ]);

  // 36 Productos (3 por categoría)
  const products = await Promise.all([
    // LAPTOPS Y PC (3)
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[0].id,
        title: 'MacBook Pro 16" M3 Max',
        sku: 'MACBOOK-16-M3',
        price: '2499.99',
        originalPrice: '2799.99',
        quantityAvailable: 15,
        averageRating: 4.9,
        reviewCount: 342,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[0].id,
        title: 'Dell XPS 15 Intel i9',
        sku: 'DELL-XPS15-I9',
        price: '1899.99',
        originalPrice: '2099.99',
        quantityAvailable: 22,
        averageRating: 4.7,
        reviewCount: 189,
        isActive: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1588872657840-90a53d2b516d?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[0].id,
        title: 'ASUS ROG Gaming Laptop RTX 4080',
        sku: 'ASUS-ROG-RTX4080',
        price: '2199.99',
        originalPrice: '2499.99',
        quantityAvailable: 10,
        averageRating: 4.8,
        reviewCount: 267,
        isActive: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop' }] },
      },
    }),
    // CELULARES (3)
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[1].id,
        title: 'iPhone 15 Pro Max 256GB',
        sku: 'IPHONE15PRO-256',
        price: '1199.99',
        originalPrice: '1399.99',
        quantityAvailable: 45,
        averageRating: 4.9,
        reviewCount: 512,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[1].id,
        title: 'Samsung Galaxy S24 Ultra',
        sku: 'SAMSUNG-S24ULTRA',
        price: '1299.99',
        originalPrice: '1499.99',
        quantityAvailable: 38,
        averageRating: 4.8,
        reviewCount: 456,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[1].id,
        title: 'Google Pixel 8 Pro',
        sku: 'PIXEL8PRO-128',
        price: '899.99',
        originalPrice: '999.99',
        quantityAvailable: 52,
        averageRating: 4.7,
        reviewCount: 334,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop' }] },
      },
    }),
    // GAMING (3)
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[2].id,
        title: 'PlayStation 5 con Disco Duro',
        sku: 'PS5-DISC',
        price: '499.99',
        originalPrice: '599.99',
        quantityAvailable: 28,
        averageRating: 4.9,
        reviewCount: 723,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1578496494514-246d4beb64c0?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[2].id,
        title: 'Xbox Series X 1TB',
        sku: 'XBOX-SERIESX',
        price: '499.99',
        originalPrice: '599.99',
        quantityAvailable: 32,
        averageRating: 4.8,
        reviewCount: 645,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1605868912902-876888ac7eb5?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[2].id,
        title: 'Nintendo Switch OLED',
        sku: 'SWITCH-OLED',
        price: '349.99',
        originalPrice: '399.99',
        quantityAvailable: 40,
        averageRating: 4.7,
        reviewCount: 289,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1606841838239-c5a1a8a07d5b?w=500&h=400&fit=crop' }] },
      },
    }),
    // AUDIO (3)
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[3].id,
        title: 'Sony WH-1000XM5 Headphones',
        sku: 'SONY-XM5',
        price: '379.99',
        originalPrice: '449.99',
        quantityAvailable: 48,
        averageRating: 4.9,
        reviewCount: 891,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[3].id,
        title: 'Apple AirPods Pro 2nd Gen',
        sku: 'AIRPODS-PRO2',
        price: '249.99',
        originalPrice: '299.99',
        quantityAvailable: 75,
        averageRating: 4.8,
        reviewCount: 567,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1606603715776-e4c67eb8b547?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller1.id,
        categoryId: categories[3].id,
        title: 'Bose QuietComfort 45 Headphones',
        sku: 'BOSE-QC45',
        price: '329.99',
        originalPrice: '399.99',
        quantityAvailable: 40,
        averageRating: 4.7,
        reviewCount: 423,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=400&fit=crop' }] },
      },
    }),
    // HOGAR (3)
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        categoryId: categories[4].id,
        title: 'Robot Aspirador Inteligente ILIFE',
        sku: 'ILIFE-VACUUM',
        price: '349.99',
        originalPrice: '449.99',
        quantityAvailable: 25,
        averageRating: 4.6,
        reviewCount: 312,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        categoryId: categories[4].id,
        title: 'Espejo Moderno LED 60x80',
        sku: 'ESPEJO-LED',
        price: '149.99',
        originalPrice: '199.99',
        quantityAvailable: 60,
        averageRating: 4.5,
        reviewCount: 198,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1537995477597-6ecf1397006d?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller3.id,
        categoryId: categories[4].id,
        title: 'Lámpara LED Inteligente RGB',
        sku: 'LED-LAMP-RGB',
        price: '79.99',
        originalPrice: '99.99',
        quantityAvailable: 150,
        averageRating: 4.7,
        reviewCount: 456,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1565636192335-14c89e68fc65?w=500&h=400&fit=crop' }] },
      },
    }),
    // MODA (3)
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[5].id,
        title: 'Zapatillas Nike Air Max Running',
        sku: 'NIKE-AIRMAX',
        price: '139.99',
        originalPrice: '169.99',
        quantityAvailable: 85,
        averageRating: 4.8,
        reviewCount: 634,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[5].id,
        title: 'Chaqueta Jean Premium Denim',
        sku: 'DENIM-JACKET',
        price: '89.99',
        originalPrice: '119.99',
        quantityAvailable: 120,
        averageRating: 4.7,
        reviewCount: 445,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[5].id,
        title: 'Camiseta Algodón 100% Premium',
        sku: 'COTTON-TSHIRT',
        price: '34.99',
        originalPrice: '49.99',
        quantityAvailable: 250,
        averageRating: 4.6,
        reviewCount: 567,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop' }] },
      },
    }),
    // ACCESORIOS (3)
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[6].id,
        title: 'Apple Watch Series 9 45mm',
        sku: 'APPLEWATCH-S9',
        price: '429.99',
        originalPrice: '499.99',
        quantityAvailable: 32,
        averageRating: 4.9,
        reviewCount: 823,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[6].id,
        title: 'Cartera Cuero Genuino Premium',
        sku: 'LEATHER-WALLET',
        price: '59.99',
        originalPrice: '79.99',
        quantityAvailable: 95,
        averageRating: 4.7,
        reviewCount: 234,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[6].id,
        title: 'Cinturón Piel Auténtica Ajustable',
        sku: 'LEATHER-BELT',
        price: '44.99',
        originalPrice: '59.99',
        quantityAvailable: 140,
        averageRating: 4.6,
        reviewCount: 312,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop' }] },
      },
    }),
    // BELLEZA (3)
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[7].id,
        title: 'Set Cuidado Piel Dermatológico',
        sku: 'SKINCARE-SET',
        price: '89.99',
        originalPrice: '119.99',
        quantityAvailable: 65,
        averageRating: 4.8,
        reviewCount: 512,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[7].id,
        title: 'Perfume Premium 100ml Luxury',
        sku: 'PERFUME-100ML',
        price: '74.99',
        originalPrice: '99.99',
        quantityAvailable: 80,
        averageRating: 4.7,
        reviewCount: 389,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1585611159391-a6c65d3ea59d?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller2.id,
        categoryId: categories[7].id,
        title: 'Maquillaje Profesional Palette',
        sku: 'MAKEUP-PALETTE',
        price: '49.99',
        originalPrice: '69.99',
        quantityAvailable: 110,
        averageRating: 4.6,
        reviewCount: 267,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1596462502278-5b4d142d6745?w=500&h=400&fit=crop' }] },
      },
    }),
    // MOVILIDAD (3)
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[8].id,
        title: 'Monopatin Eléctrico Pro 40km',
        sku: 'EBIKE-PRO',
        price: '599.99',
        originalPrice: '799.99',
        quantityAvailable: 18,
        averageRating: 4.8,
        reviewCount: 356,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[8].id,
        title: 'Patineta Profesional Skate',
        sku: 'SKATEBOARD-PRO',
        price: '129.99',
        originalPrice: '169.99',
        quantityAvailable: 45,
        averageRating: 4.6,
        reviewCount: 189,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1558618666-e309cecf667c?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[8].id,
        title: 'Casco Seguridad Certificado DOT',
        sku: 'HELMET-SAFETY',
        price: '99.99',
        originalPrice: '139.99',
        quantityAvailable: 75,
        averageRating: 4.7,
        reviewCount: 234,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' }] },
      },
    }),
    // CICLISMO (3)
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[9].id,
        title: 'Bicicleta Montaña 29" Shimano',
        sku: 'MTB-29-SHIMANO',
        price: '749.99',
        originalPrice: '999.99',
        quantityAvailable: 12,
        averageRating: 4.8,
        reviewCount: 267,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[9].id,
        title: 'Bicicleta Ruta Carbono Profesional',
        sku: 'ROAD-BIKE-CARBON',
        price: '899.99',
        originalPrice: '1199.99',
        quantityAvailable: 8,
        averageRating: 4.9,
        reviewCount: 178,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[9].id,
        title: 'Casco Ciclismo Aerodinámico',
        sku: 'BIKE-HELMET-AERO',
        price: '129.99',
        originalPrice: '179.99',
        quantityAvailable: 55,
        averageRating: 4.6,
        reviewCount: 145,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' }] },
      },
    }),
    // FITNESS (3)
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[10].id,
        title: 'Mancuernas Ajustables 5-50kg',
        sku: 'DUMBBELLS-50',
        price: '299.99',
        originalPrice: '399.99',
        quantityAvailable: 28,
        averageRating: 4.8,
        reviewCount: 423,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[10].id,
        title: 'Cinta de Correr Inteligente TreadMill',
        sku: 'TREADMILL-SMART',
        price: '899.99',
        originalPrice: '1199.99',
        quantityAvailable: 6,
        averageRating: 4.7,
        reviewCount: 189,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[10].id,
        title: 'Colchoneta Yoga Premium 6mm',
        sku: 'YOGA-MAT',
        price: '49.99',
        originalPrice: '69.99',
        quantityAvailable: 180,
        averageRating: 4.5,
        reviewCount: 312,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=400&fit=crop' }] },
      },
    }),
    // DEPORTES (3)
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[11].id,
        title: 'Balón Fútbol Profesional FIFA',
        sku: 'FOOTBALL-FIFA',
        price: '89.99',
        originalPrice: '119.99',
        quantityAvailable: 120,
        averageRating: 4.7,
        reviewCount: 356,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1579953538182-f0a5acd97718?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[11].id,
        title: 'Set Equipo Básquet Profesional',
        sku: 'BASKETBALL-SET',
        price: '199.99',
        originalPrice: '269.99',
        quantityAvailable: 35,
        averageRating: 4.6,
        reviewCount: 198,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop' }] },
      },
    }),
    prisma.product.create({
      data: {
        sellerId: seller4.id,
        categoryId: categories[11].id,
        title: 'Guantes Boxeo Profesionales 16oz',
        sku: 'BOXING-GLOVES-16',
        price: '129.99',
        originalPrice: '169.99',
        quantityAvailable: 65,
        averageRating: 4.8,
        reviewCount: 267,
        isActive: true,
        isFeatured: true,
        images: { create: [{ imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=400&fit=crop' }] },
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
        subtotal: '3699.98',
        items: {
          create: [
            { productId: products[0].id, quantity: 1, unitPrice: '2499.99' },
            { productId: products[3].id, quantity: 1, unitPrice: '1199.99' },
          ],
        },
      },
    }),
    prisma.cart.create({
      data: {
        userId: buyer2.id,
        itemCount: 2,
        subtotal: '189.98',
        items: {
          create: [
            { productId: products[15].id, quantity: 1, unitPrice: '139.99' },
            { productId: products[17].id, quantity: 1, unitPrice: '49.99' },
          ],
        },
      },
    }),
  ]);

  // Favoritos
  await Promise.all([
    prisma.favorite.create({ data: { userId: buyer1.id, productId: products[0].id } }),
    prisma.favorite.create({ data: { userId: buyer1.id, productId: products[2].id } }),
    prisma.favorite.create({ data: { userId: buyer2.id, productId: products[15].id } }),
  ]);

  // Mensajes
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: buyer1.id,
        recipientId: seller1.id,
        content: '¿Está disponible el MacBook?',
        productId: products[0].id,
      },
    }),
    prisma.message.create({
      data: {
        senderId: seller1.id,
        recipientId: buyer1.id,
        content: 'Sí, tenemos stock disponible',
        productId: products[0].id,
        isRead: true,
      },
    }),
  ]);

  // Reseñas
  await Promise.all([
    prisma.review.create({
      data: {
        productId: products[0].id,
        reviewerId: buyer1.id,
        sellerId: seller1.id,
        rating: 5,
        title: 'Excelente laptop',
        comment: 'Llegó en perfecto estado y funciona perfecto',
        isVerifiedPurchase: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: products[15].id,
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
        subtotal: '2499.99',
        tax: '249.99',
        totalAmount: '2749.98',
        status: 'delivered',
        paymentStatus: 'completed',
        deliveredAt: new Date(),
        items: {
          create: [
            {
              productId: products[0].id,
              sellerId: seller1.id,
              quantity: 1,
              unitPrice: '2499.99',
              subtotal: '2499.99',
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        buyerId: buyer2.id,
        orderNumber: `ORD-${Date.now()}-2`,
        subtotal: '139.99',
        tax: '14.00',
        totalAmount: '153.99',
        status: 'delivered',
        paymentStatus: 'completed',
        deliveredAt: new Date(),
        items: {
          create: [
            {
              productId: products[15].id,
              sellerId: seller2.id,
              quantity: 1,
              unitPrice: '139.99',
              subtotal: '139.99',
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
        message: 'Tu MacBook fue entregado',
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
  console.log('✓ 12 categorías | ✓ 4 vendedores | ✓ 2 compradores');
  console.log('✓ 36 productos | ✓ 2 carritos | ✓ 3 favoritos');
  console.log('✓ 2 mensajes | ✓ 2 reseñas | ✓ 2 órdenes | ✓ 2 notificaciones');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
