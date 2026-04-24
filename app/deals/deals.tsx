'use client';

import { motion } from 'framer-motion';
import { Flame, Clock, Zap, ArrowRight, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Deal {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  timeLeft: string;
  soldCount: number;
  totalAvailable: number;
  emoji: string;
  badge: string;
}

function Countdown({ seconds: initialSeconds }: { seconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div className="flex items-center gap-1">
      {[h, m, s].map((val, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <span className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-sm font-bold text-white">
            {String(val).padStart(2, '0')}
          </span>
          {idx < 2 && <span className="text-white/50 font-bold">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function Deals() {
  const deals: Deal[] = [
    { id: 1, name: 'iPhone 13 128GB', originalPrice: 799, discountedPrice: 599, discount: 25, timeLeft: '2h', soldCount: 234, totalAvailable: 500, emoji: '📱', badge: 'Flash' },
    { id: 2, name: 'Samsung Galaxy S22', originalPrice: 899, discountedPrice: 649, discount: 28, timeLeft: '5h', soldCount: 187, totalAvailable: 300, emoji: '📱', badge: 'Hot' },
    { id: 3, name: 'AirPods Pro', originalPrice: 249, discountedPrice: 179, discount: 28, timeLeft: '3h', soldCount: 456, totalAvailable: 600, emoji: '🎧', badge: 'Top' },
    { id: 4, name: 'iPad Air 5', originalPrice: 599, discountedPrice: 449, discount: 25, timeLeft: '1h', soldCount: 89, totalAvailable: 200, emoji: '📱', badge: 'Ultimo' },
    { id: 5, name: 'Laptop Dell XPS 13', originalPrice: 1299, discountedPrice: 999, discount: 23, timeLeft: '4h', soldCount: 45, totalAvailable: 100, emoji: '💻', badge: 'Premium' },
    { id: 6, name: 'Sony WH1000XM4', originalPrice: 349, discountedPrice: 249, discount: 28, timeLeft: '6h', soldCount: 312, totalAvailable: 400, emoji: '🎧', badge: 'Popular' },
    { id: 7, name: 'Apple Watch Series 8', originalPrice: 399, discountedPrice: 299, discount: 25, timeLeft: '2.5h', soldCount: 178, totalAvailable: 250, emoji: '⌚', badge: 'Nuevo' },
    { id: 8, name: 'GoPro Hero 11', originalPrice: 499, discountedPrice: 349, discount: 30, timeLeft: '3h', soldCount: 98, totalAvailable: 150, emoji: '📷', badge: 'Mejor' },
  ];

  return (
    <main className="min-h-screen bg-[#071425]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.12),transparent_45%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 mb-5">
                <Flame size={14} className="text-red-400" />
                Ofertas actualizadas cada hora
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
                Ofertas
                <span className="block text-red-400">Relampago</span>
              </h1>
              <p className="text-white/55 text-lg max-w-xl">
                Descuentos increibles por tiempo limitado. Precios que nunca volveras a ver.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-white/15 bg-[#0d1c31] p-5"
            >
              <p className="text-xs text-white/50 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock size={12} /> Proxima actualizacion en
              </p>
              <Countdown seconds={3600} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-white/70 text-center">
            <Zap size={14} className="inline text-yellow-400 mr-2" />
            <strong className="text-white">Consejo:</strong> Estas ofertas se actualizan cada hora. Activa notificaciones para no perderte tus productos favoritos.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal, idx) => {
            const progressPercent = (deal.soldCount / deal.totalAvailable) * 100;
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link href={`/products/${deal.id}`}>
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1c31] cursor-pointer group h-full flex flex-col">
                    {/* Image area */}
                    <div className="relative bg-gradient-to-br from-[#102036] to-[#0d1c31] h-44 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                        className="text-6xl"
                      >
                        {deal.emoji}
                      </motion.div>

                      <div className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        -{deal.discount}%
                      </div>
                      <div className="absolute top-3 right-3 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {deal.badge}
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 border border-white/10 px-3 py-1 text-xs text-white backdrop-blur">
                        <Clock size={10} /> {deal.timeLeft}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c31]/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-white mb-3 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                        {deal.name}
                      </h3>

                      <div className="mb-3">
                        <p className="text-white/35 text-xs line-through">${deal.originalPrice.toFixed(2)}</p>
                        <p className="text-2xl font-bold text-red-400">${deal.discountedPrice.toFixed(2)}</p>
                        <p className="text-xs text-primary font-semibold">
                          Ahorras ${(deal.originalPrice - deal.discountedPrice).toFixed(2)}
                        </p>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-white/40 mb-1.5">
                          <span>Vendidos</span>
                          <span>{deal.soldCount}/{deal.totalAvailable}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, delay: idx * 0.08 }}
                            className="bg-gradient-to-r from-red-500 to-orange-400 h-1.5 rounded-full"
                          />
                        </div>
                      </div>

                      <button className="mt-auto w-full rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 py-2.5 text-sm font-semibold group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2">
                        <ShoppingCart size={14} /> Comprar Ahora
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#1a0a0a] via-[#1f1010] to-[#1a0a0a] p-10 text-center"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Nunca mas te pierdas una oferta
            </h2>
            <p className="text-white/60 mb-7 max-w-md mx-auto">
              Habilita notificaciones para recibir alertas de tus productos favoritos al precio mas bajo.
            </p>
            <button className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-8 py-3 font-semibold text-white transition hover:bg-red-600">
              <Flame size={18} /> Habilitar Notificaciones
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
