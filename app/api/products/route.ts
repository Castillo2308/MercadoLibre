/**
 * GET /api/products
 * POST /api/products
 *
 * GET: obtiene productos con filtros opcionales (category, q, take).
 * POST: publica un producto nuevo (requiere X-User-ID). Acepta multipart/form-data
 * con title, category (slug), condition, price, quantity, description e images[].
 */

import { NextResponse, NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { getProductPhoto } from '@/lib/design-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const q = url.searchParams.get('q');
    const sellerId = url.searchParams.get('sellerId');
    const take = Number(url.searchParams.get('take') || 20);

    const where: any = { isActive: true };

    if (category) {
      // filter by category slug or id
      where.category = { slug: category };
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        seller: { select: { firstName: true, lastName: true, sellerRating: true } },
        category: true,
      },
      take,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const seller = await prisma.user.findUnique({ where: { id: userId } });
    if (!seller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const title = String(formData.get('title') || '').trim();
    const categorySlug = String(formData.get('category') || '').trim();
    const condition = String(formData.get('condition') || 'new').trim();
    const price = Number(formData.get('price'));
    const quantity = Number(formData.get('quantity'));
    const description = String(formData.get('description') || '').trim();

    if (!title || title.length < 10) {
      return NextResponse.json({ error: 'El título debe tener al menos 10 caracteres' }, { status: 400 });
    }
    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 });
    }

    const uploadedFiles = formData
      .getAll('images')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0 && ALLOWED_IMAGE_TYPES.has(entry.type));

    const imageUrls: string[] = [];
    if (uploadedFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      await mkdir(uploadDir, { recursive: true });

      for (const file of uploadedFiles.slice(0, 5)) {
        const ext = file.type.split('/')[1] || 'jpg';
        const filename = `${randomUUID()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadDir, filename), buffer);
        imageUrls.push(`/uploads/products/${filename}`);
      }
    }

    const sku = `${categorySlug}-${Date.now()}-${randomUUID().slice(0, 6)}`.toUpperCase();

    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        categoryId: category.id,
        title,
        description: description || null,
        sku,
        price,
        quantityAvailable: quantity,
        condition,
        mainImageUrl: imageUrls[0] || getProductPhoto(title, categorySlug, title),
      },
    });

    const finalImageUrls = imageUrls.length > 0 ? imageUrls : [getProductPhoto(product.id, categorySlug, title)];
    await prisma.productImage.createMany({
      data: finalImageUrls.map((url, index) => ({
        productId: product.id,
        imageUrl: url,
        displayOrder: index,
      })),
    });

    if (!seller.isSeller) {
      await prisma.user.update({ where: { id: userId }, data: { isSeller: true } });
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
