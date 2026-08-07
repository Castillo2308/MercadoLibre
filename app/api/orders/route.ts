/**
 * POST /api/orders
 *
 * Checkout real: convierte el carrito del usuario autenticado (X-User-ID) en
 * una orden real. Soporta pago con tarjeta (simulado — no hay pasarela de
 * pago real conectada, no se guarda el número de tarjeta ni el CVV) y pago
 * a coordinar (SINPE / efectivo). Al confirmarse, envía un mensaje al
 * vendedor de cada producto con el detalle del pedido y descuenta stock
 * (esto último ya lo hace createOrder), lo que además actualiza en vivo las
 * estadísticas de ventas que ve el vendedor en su perfil.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db-queries';
import { sendMessage } from '@/lib/db-queries';
import prisma from '@/lib/prisma';

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-ID');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const buyer = await prisma.user.findUnique({ where: { id: userId } });
    if (!buyer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
      paymentMethod,
      card,
    } = body as {
      shippingAddress?: string;
      shippingCity?: string;
      shippingState?: string;
      shippingPostalCode?: string;
      paymentMethod?: 'card' | 'sinpe' | 'cash';
      card?: { number?: string; name?: string; expiry?: string; cvv?: string };
    };

    if (!paymentMethod || !['card', 'sinpe', 'cash'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 });
    }

    let paymentStatus = 'pending';
    let status = 'pending';

    if (paymentMethod === 'card') {
      const number = (card?.number || '').replace(/\s/g, '');
      const name = (card?.name || '').trim();
      const expiry = (card?.expiry || '').trim(); // MM/YY
      const cvv = (card?.cvv || '').trim();

      if (!name) {
        return NextResponse.json({ error: 'Falta el nombre en la tarjeta' }, { status: 400 });
      }
      if (!luhnCheck(number)) {
        return NextResponse.json({ error: 'Número de tarjeta inválido' }, { status: 400 });
      }
      const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(expiry);
      if (!expiryMatch) {
        return NextResponse.json({ error: 'Fecha de expiración inválida (MM/AA)' }, { status: 400 });
      }
      const [, mm, yy] = expiryMatch;
      const expDate = new Date(2000 + Number(yy), Number(mm), 0, 23, 59, 59);
      if (Number(mm) < 1 || Number(mm) > 12 || expDate < new Date()) {
        return NextResponse.json({ error: 'La tarjeta está vencida' }, { status: 400 });
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        return NextResponse.json({ error: 'CVV inválido' }, { status: 400 });
      }

      // No hay pasarela de pago real conectada: se valida el formato y se
      // simula el cobro aprobado. Nunca se persiste el número completo ni el CVV.
      paymentStatus = 'completed';
      status = 'confirmed';
    }

    let order;
    try {
      order = await createOrder(userId, {
        shippingAddress: shippingAddress || '',
        shippingCity: shippingCity || '',
        shippingState: shippingState || '',
        shippingPostalCode: shippingPostalCode || '',
        paymentMethod,
        paymentStatus,
        status,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Cart is empty') {
        return NextResponse.json({ error: 'Tu carrito está vacío' }, { status: 400 });
      }
      throw err;
    }

    // Agrupar items por vendedor y avisarle por chat que le llegó un pedido.
    const bySeller = new Map<string, typeof order.items>();
    for (const item of order.items) {
      const list = bySeller.get(item.sellerId) || [];
      list.push(item);
      bySeller.set(item.sellerId, list);
    }

    const paymentLabel =
      paymentMethod === 'card' ? 'Tarjeta (pagado)' : paymentMethod === 'sinpe' ? 'SINPE Móvil' : 'Efectivo';

    for (const [sellerId, items] of bySeller) {
      const lines = items
        .map((item) => `- ${item.product.title} x${item.quantity} — ₡${Number(item.subtotal).toLocaleString('es-CR')}`)
        .join('\n');
      const sellerTotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

      const content = [
        paymentMethod === 'card' ? '💳 ¡Nuevo pedido pagado!' : '📦 ¡Nuevo pedido!',
        `Pedido ${order.orderNumber}`,
        lines,
        `Total: ₡${sellerTotal.toLocaleString('es-CR')}`,
        `Método de pago: ${paymentLabel}`,
        paymentMethod !== 'card' ? 'Coordinemos el pago y la entrega por aquí.' : '',
      ]
        .filter(Boolean)
        .join('\n');

      await sendMessage({
        senderId: userId,
        recipientId: sellerId,
        content,
        productId: items[0].productId,
        orderId: order.id,
      });
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'No se pudo procesar el pedido' }, { status: 500 });
  }
}
