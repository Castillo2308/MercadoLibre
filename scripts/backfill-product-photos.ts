/**
 * Rellena mainImageUrl para productos existentes que no tienen foto,
 * usando una foto real de internet acorde a la categoría del producto.
 * Uso: npx tsx scripts/backfill-product-photos.ts
 */
import { PrismaClient } from '@prisma/client';
import { getProductPhoto } from '../lib/design-api';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true },
  });

  let updated = 0;
  for (const product of products) {
    const photo = getProductPhoto(product.id, product.category?.slug, product.title);
    await prisma.product.update({
      where: { id: product.id },
      data: { mainImageUrl: photo },
    });

    if (product.images.length === 0) {
      await prisma.productImage.create({
        data: { productId: product.id, imageUrl: photo, altText: product.title, displayOrder: 0 },
      });
    } else {
      await prisma.productImage.update({
        where: { id: product.images[0].id },
        data: { imageUrl: photo },
      });
    }

    updated += 1;
  }

  console.log(`Actualizadas ${updated} fotos de producto.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
