'use client';

import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Zap, Wallet, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDesignIllustration } from '@/lib/design-api';
import { SmartImage } from '@/components/ui/smart-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

function CartContent() {
  const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useShoppingCart();
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'sinpe' | 'cash'>('sinpe');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const cartItems = cart;
  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleProceedToPurchase = async () => {
    if (!user?.id || cartItems.length === 0) return;

    const groupedBySeller = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
      const sellerKey = item.sellerId || '';
      if (!sellerKey) return acc;
      if (!acc[sellerKey]) acc[sellerKey] = [];
      acc[sellerKey].push(item);
      return acc;
    }, {});

    const sellerIds = Object.keys(groupedBySeller);
    if (sellerIds.length === 0) {
      return;
    }

    setIsProcessingCheckout(true);
    try {
      for (const sellerId of sellerIds) {
        const sellerItems = groupedBySeller[sellerId];
        const lines = sellerItems
          .map((item) => `- ${item.name} x${item.quantity}`)
          .join('\n');

        const message = [
          'Hola, quiero proceder con la compra de estos productos:',
          lines,
          '',
          `Metodo de pago preferido: ${paymentMethod === 'sinpe' ? 'SINPE Movil' : 'Efectivo'}`,
          'Podemos coordinar entrega personal?',
        ].join('\n');

        await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user.id,
          },
          body: JSON.stringify({
            recipientId: sellerId,
            content: message,
          }),
        });
      }

      router.push(`/messages?user=${encodeURIComponent(sellerIds[0])}`);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071425]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(29,184,73,0.12),transparent_34%),radial-gradient(circle_at_85%_24%,rgba(255,214,0,0.12),transparent_38%),radial-gradient(circle_at_40%_90%,rgba(37,99,235,0.14),transparent_42%)]" />
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[#091424] py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,184,73,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,214,0,0.18),transparent_45%)]" />
        <div className="container mx-auto px-4">
          <div className="relative z-10 flex items-center gap-3 mb-2">
            <ShoppingCart className="text-primary" size={32} />
            <h1 className="text-4xl font-black text-white">Mi Carrito</h1>
          </div>
          <p className="relative z-10 text-white/60">{getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {cartItems.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="rounded-2xl border-white/10 bg-[#0c1d31]/90 p-4">
              <p className="text-xs uppercase tracking-wide text-white/45">Productos</p>
              <p className="mt-1 text-2xl font-black text-white">{getTotalItems()}</p>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-[#0c1d31]/90 p-4">
              <p className="text-xs uppercase tracking-wide text-white/45">Subtotal</p>
              <p className="mt-1 text-2xl font-black text-primary">${subtotal.toFixed(2)}</p>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-[#0c1d31]/90 p-4">
              <p className="text-xs uppercase tracking-wide text-white/45">Metodo</p>
              <p className="mt-1 text-sm font-semibold text-white/80">{paymentMethod === 'sinpe' ? 'SINPE Movil' : 'Efectivo'}</p>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="min-h-[70vh] flex items-center">
                <Card className="relative w-full overflow-hidden border-white/12 bg-[#0c1d31]/90 text-center shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,184,73,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,214,0,0.2),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(37,99,235,0.18),transparent_50%)]" />
                  <CardContent className="relative z-10 p-12">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-primary">
                      <ShoppingCart size={28} />
                    </div>
                    <p className="text-3xl font-black text-white">Tu carrito esta vacio</p>
                    <p className="mt-2 text-white/65">
                      Guarda productos y completa tu compra cuando quieras.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <Button asChild className="bg-primary text-[#071425] hover:brightness-110">
                        <Link href="/">
                          Explorar productos
                          <ArrowRight size={18} className="ml-2" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white/80 hover:bg-white/20">
                        <Link href="/deals">
                          Ver ofertas
                          <Zap size={16} className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <Card
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-[#0c1d31]/90 p-4 flex gap-4 group animate-fadeIn hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-all duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 overflow-hidden bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                      <SmartImage
                        src={item.imageUrl || getDesignIllustration(`cart-${item.id}-${item.name}`)}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors mb-1">{item.name}</h3>
                      <p className="text-sm text-white/60 mb-3">Disponible: Stock ilimitado</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg w-fit p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 rounded hover:bg-white/10 transition-colors hover:text-primary text-white"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-12 text-center border-0 bg-transparent font-semibold text-white focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded hover:bg-white/10 transition-colors hover:text-primary text-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Price and Delete */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-2xl font-black text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-white/40 line-through">
                          ${(item.price * 1.2 * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all hover:scale-110"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border border-white/10 bg-[#0c1d31]/90 sticky top-24 shadow-[0_18px_40px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary" />
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-white">Resumen</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">

                {/* Items Breakdown */}
                <div className="space-y-3 pb-4 border-b border-white/10 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Subtotal:</span>
                    <span className="font-bold text-lg text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 flex items-center gap-2">
                      <Zap size={16} className="text-secondary" />
                      Envío:
                    </span>
                    <span className={`font-bold text-lg ${shipping === 0 ? 'text-primary' : 'text-white'}`}>
                      {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Impuestos (10%):</span>
                    <span className="font-bold text-lg text-white">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-white/10 to-white/[0.04] rounded-xl border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total:</span>
                    <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {shipping === 0 && (
                  <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
                    <p className="text-sm font-semibold text-primary">
                      ✓ ¡Envío gratis en tu compra!
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-sm font-semibold text-white mb-3">Metodo de pago</p>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as 'sinpe' | 'cash')}
                    className="space-y-2"
                  >
                    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20">
                      <span className="flex items-center gap-2">
                        <RadioGroupItem value="sinpe" id="pay-sinpe" className="border-white/30" />
                        <CreditCard size={16} className="text-secondary" /> SINPE Movil
                      </span>
                      <span className="text-xs text-white/50">Instantaneo</span>
                    </label>
                    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20">
                      <span className="flex items-center gap-2">
                        <RadioGroupItem value="cash" id="pay-cash" className="border-white/30" />
                        <Wallet size={16} className="text-secondary" /> Efectivo
                      </span>
                      <span className="text-xs text-white/50">Contra entrega</span>
                    </label>
                  </RadioGroup>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleProceedToPurchase}
                  disabled={isProcessingCheckout}
                  className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] px-4 py-3 text-lg font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.35)] transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  <span>{isProcessingCheckout ? 'Enviando solicitud...' : 'Proceder a la compra'}</span>
                  <ArrowRight size={20} />
                </Button>

                {/* Continue Shopping */}
                <Button asChild variant="outline" className="w-full border-white/15 bg-white/5 text-white/80 hover:bg-white/10">
                  <Link href="/">
                    Continuar Comprando
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </Button>

                {/* Security Badge */}
                <Separator className="my-6 bg-white/10" />
                <div className="rounded-lg bg-white/5 p-4 text-center border border-white/10">
                  <p className="text-xs text-white/70 font-semibold">
                    🔒 Tu compra está 100% protegida
                  </p>
                </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Cart() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
