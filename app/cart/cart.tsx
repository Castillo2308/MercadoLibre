'use client';

/**
 * cart.tsx
 *
 * Página de carrito de compras.
 * Muestra:
 * - Lista de items en el carrito
 * - Botones para ajustar cantidades
 * - Resumen de precios y totales
 * - Opciones de envío y pago
 * - Botón para proceder al checkout
 * Solo visible para usuarios autenticados (ProtectedRoute)
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Wallet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useNavigationLoader } from '@/components/NavigationLoaderProvider';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { SmartImage } from '@/components/ui/smart-image';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { getDesignIllustration } from '@/lib/design-api';

const PAYMENT_METHODS = [
  {
    id: 'sinpe' as const,
    label: 'SINPE Movil',
    description: 'Transferencia instantanea desde tu banco',
    tag: 'Instantaneo',
    icon: CreditCard,
  },
  {
    id: 'cash' as const,
    label: 'Efectivo',
    description: 'Paga en el momento de la entrega',
    tag: 'Contra entrega',
    icon: Wallet,
  },
];

function CartContent() {
  const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useShoppingCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { startLoading } = useNavigationLoader();
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
    if (sellerIds.length === 0) return;

    setIsProcessingCheckout(true);
    startLoading();

    try {
      for (const sellerId of sellerIds) {
        const sellerItems = groupedBySeller[sellerId];
        const lines = sellerItems.map((item) => `- ${item.name} x${item.quantity}`).join('\n');

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

      toast.success('Solicitud enviada al vendedor');
      router.push(`/messages?user=${encodeURIComponent(sellerIds[0])}`);
    } catch {
      toast.error('No se pudo enviar la solicitud, intenta de nuevo');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071425] pb-16">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(29,184,73,0.12),transparent_34%),radial-gradient(circle_at_85%_24%,rgba(255,214,0,0.12),transparent_38%),radial-gradient(circle_at_40%_90%,rgba(37,99,235,0.14),transparent_42%)]" />

      <div className="relative overflow-hidden border-b border-white/10 bg-[#091424] py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,184,73,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,214,0,0.18),transparent_45%)]" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-10 flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="premium-chip">
                <ShoppingCart size={14} className="text-primary" />
                Carrito activo
              </span>
              <span className="premium-chip">
                <Sparkles size={14} className="text-secondary" />
                Compra asistida
              </span>
              <span className="premium-chip">
                <ShieldCheck size={14} className="text-primary" />
                Sesion segura
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-black text-white md:text-5xl">{t('cart.title')}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/68">
                {getTotalItems()} {getTotalItems() !== 1 ? t('common.products') : t('common.product')} {t('cart.subtitleSuffix')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {cartItems.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: 'Productos', value: getTotalItems(), icon: ShoppingCart },
              { label: 'Subtotal', value: `$${subtotal.toFixed(2)}`, icon: Sparkles, accent: true },
              { label: 'Metodo', value: paymentMethod === 'sinpe' ? 'SINPE Movil' : 'Efectivo', icon: CreditCard },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="surface-panel p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
                    <p className={`mt-1 text-2xl font-black ${stat.accent ? 'text-primary' : 'text-white'}`}>{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${stat.accent ? 'bg-primary/15 text-primary' : 'bg-white/5 text-white/75'}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className={cartItems.length > 0 ? 'grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_0.95fr]' : 'flex justify-center'}>
          <div className={cartItems.length > 0 ? 'space-y-4' : 'w-full max-w-2xl space-y-4'}>
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="surface-panel-strong relative overflow-hidden text-center"
              >
                <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(29,184,73,0.16),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,214,0,0.18),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(37,99,235,0.16),transparent_50%)]" />
                <motion.div
                  animate={{ opacity: [0.22, 0.5, 0.22], scale: [1, 1.08, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                />
                <motion.div
                  animate={{ opacity: [0.18, 0.42, 0.18], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  className="pointer-events-none absolute -right-8 bottom-0 h-44 w-44 rounded-full bg-blue-400/15 dark:bg-secondary/10 blur-3xl"
                />
                <CardContent className="relative z-10 px-8 py-16 md:px-12">
                  <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-primary/25"
                    />
                    <motion.div
                      animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative flex h-18 w-18 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-primary/25 via-white/10 to-secondary/10 text-primary shadow-[0_16px_34px_rgba(29,184,73,0.22)]"
                    >
                      <ShoppingCart size={30} />
                    </motion.div>
                  </div>
                  <p className="text-3xl font-black text-white md:text-4xl">{t('cart.empty.title')}</p>
                  <p className="mx-auto mt-3 max-w-lg text-white/65">
                    {t('cart.empty.subtitle')}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                    {[t('cart.empty.quickBuy'), t('cart.empty.chatSeller'), t('cart.empty.noFriction')].map((label) => (
                      <span key={label} className="premium-chip bg-white/5">
                        <Sparkles size={12} className="text-primary" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button asChild className="premium-cta">
                      <Link href="/">
                        {t('cart.exploreProducts')}
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white/80 hover:bg-white/10">
                      <Link href="/deals">
                        {t('cart.viewDeals')}
                        <Zap size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
              {cartItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, scale: 0.96, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="surface-panel-strong group overflow-hidden p-4 md:p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:h-32 md:w-32 md:flex-shrink-0">
                      <SmartImage
                        src={item.imageUrl || getDesignIllustration(`cart-${item.id}-${item.name}`)}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071425]/40 to-transparent" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary">{item.name}</h3>
                          <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                            {t('cart.available')}
                          </span>
                        </div>
                        <p className="max-w-2xl text-sm text-white/60">
                          {t('cart.unitPrice')} <span className="font-semibold text-white/80">${item.price.toFixed(2)}</span> · {t('cart.chatCoordination')}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1.5">
                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/75 transition hover:bg-white/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            aria-label={t('cart.decreaseQty')}
                          >
                            <Minus size={16} />
                          </motion.button>
                          <div className="relative flex h-9 w-14 items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={item.quantity}
                                initial={{ y: 12, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -12, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="absolute text-sm font-bold text-white"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/75 transition hover:bg-white/10 hover:text-primary"
                            aria-label={t('cart.increaseQty')}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{t('cart.quantity')}</p>
                          <p className="text-sm font-semibold text-white">{item.quantity} {item.quantity !== 1 ? t('cart.units') : t('cart.unit')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left md:min-w-[190px] md:text-right">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{t('cart.itemTotal')}</p>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.p
                            key={item.quantity}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="mt-1 text-3xl font-black text-primary"
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-xs text-white/40 line-through">
                          ${(item.price * 1.2 * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex md:justify-end">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.success(`${item.name} eliminado del carrito`);
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 hover:text-white"
                        >
                          <Trash2 size={16} />
                          {t('cart.remove')}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="surface-panel-strong overflow-hidden"
              >
                <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary" />
                <CardHeader className="space-y-2 border-b border-white/10 bg-white/[0.03]">
                  <CardTitle className="text-2xl font-black text-white">{t('cart.summary')}</CardTitle>
                  <p className="text-sm text-white/55">Controla el total, el metodo de pago y la salida hacia mensajes.</p>
                </CardHeader>

                <CardContent className="space-y-6 p-5 md:p-6">
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/60">{t('cart.subtotal')}</span>
                      <span className="text-lg font-bold text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-white/60">
                        <Truck size={16} className="text-secondary" />
                        {t('cart.shipping')}
                      </span>
                      <span className={`text-lg font-bold ${shipping === 0 ? 'text-primary' : 'text-white'}`}>
                        {shipping === 0 ? t('cart.free') : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/60">{t('cart.taxes')}</span>
                      <span className="text-lg font-bold text-white">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/15 via-white/[0.06] to-secondary/15 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-bold text-white">{t('cart.total')}</span>
                      <span className="text-4xl font-black text-primary">${total.toFixed(2)}</span>
                    </div>
                    {shipping === 0 ? (
                      <p className="mt-2 text-sm font-semibold text-primary">Envío gratis activado por tu monto actual.</p>
                    ) : (
                      <p className="mt-2 text-sm text-white/60">Agrega mas productos para desbloquear envío gratis.</p>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{t('cart.paymentMethod')}</p>
                      <span className="text-xs text-white/45">Se usa en el mensaje al vendedor</span>
                    </div>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as 'sinpe' | 'cash')}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {PAYMENT_METHODS.map((method) => {
                        const isActive = paymentMethod === method.id;
                        const Icon = method.icon;
                        return (
                          <label
                            key={method.id}
                            htmlFor={`pay-${method.id}`}
                            className={`group/pay relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                              isActive
                                ? 'border-primary/50 bg-primary/10 text-white shadow-[0_14px_30px_rgba(29,184,73,0.18)]'
                                : 'border-white/10 bg-white/5 text-white/78 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10'
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="payment-method-highlight"
                                className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/40"
                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                              />
                            )}
                            <div className="relative z-10 flex items-center justify-between gap-2">
                              <span
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                                  isActive
                                    ? 'border-primary/40 bg-primary/20 text-primary'
                                    : 'border-white/10 bg-white/10 text-white/70 group-hover/pay:text-white'
                                }`}
                              >
                                <Icon size={18} />
                              </span>
                              <RadioGroupItem value={method.id} id={`pay-${method.id}`} className="border-white/30" />
                            </div>
                            <div className="relative z-10">
                              <p className="text-base font-bold text-white">{method.label}</p>
                              <p className="mt-0.5 text-xs font-normal leading-snug text-white/55">{method.description}</p>
                            </div>
                            <span className="relative z-10 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
                              {isActive && <ShieldCheck size={11} className="text-primary" />}
                              {method.tag}
                            </span>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleProceedToPurchase}
                    disabled={isProcessingCheckout}
                    className="premium-cta w-full"
                  >
                    <span>{isProcessingCheckout ? t('cart.processing') : t('cart.proceed')}</span>
                    <ArrowRight size={20} />
                  </Button>

                  <Button asChild variant="outline" className="w-full border-white/15 bg-white/5 text-white/80 hover:bg-white/10">
                    <Link href="/">
                      {t('cart.continueShopping')}
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </Button>

                  <Separator className="bg-white/10" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <ShieldCheck size={18} className="mx-auto text-primary" />
                      <p className="mt-2 text-xs font-semibold text-white/70">Compra protegida</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <Truck size={18} className="mx-auto text-secondary" />
                      <p className="mt-2 text-xs font-semibold text-white/70">Entrega coordinada por chat</p>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
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
