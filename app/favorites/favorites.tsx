'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  seller: string;
  rating: number;
  emoji: string;
  badge: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([
    { id: 1, name: 'Laptop Dell XPS 13', price: 999.99, originalPrice: 1299.99, seller: 'TechStore', rating: 4.8, emoji: '💻', badge: 'Oferta' },
    { id: 2, name: 'iPhone 14 Pro', price: 1099.99, originalPrice: 1199.99, seller: 'Apple Authorized', rating: 4.9, emoji: '📱', badge: 'Popular' },
    { id: 3, name: 'AirPods Pro', price: 249.99, originalPrice: 329.99, seller: 'ElectronicsHub', rating: 4.7, emoji: '🎧', badge: 'Top' },
    { id: 4, name: 'iPad Air', price: 599.99, originalPrice: 749.99, seller: 'TechStore', rating: 4.8, emoji: '📱', badge: 'Nuevo' },
    { id: 5, name: 'Sony WH-1000XM5', price: 279.99, originalPrice: 399.99, seller: 'SoundWorld', rating: 4.9, emoji: '🎧', badge: 'Flash' },
    { id: 6, name: 'MacBook Air M2', price: 1099.99, originalPrice: 1299.99, seller: 'Apple Store', rating: 4.9, emoji: '💻', badge: 'Premium' },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#071425]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.12),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(29,184,73,0.1),transparent_45%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 mb-5">
              <Heart size={13} className="fill-red-400 text-red-400" />
              Tu lista de deseos
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
              Mis
              <span className="block text-red-400">Favoritos</span>
            </h1>
            <p className="text-white/50 text-lg">
              {favorites.length} producto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-white/10 bg-[#0d1c31] text-center py-24 px-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <Heart size={80} className="mx-auto text-white/15" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">No hay favoritos aun</h3>
            <p className="text-white/50 mb-8 max-w-sm mx-auto">
              Haz click en el corazon de cualquier producto para agregarlo a tu lista de deseos.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-[#071425] transition hover:brightness-105">
              Explorar Productos <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {favorites.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, delay: idx * 0.06 }}
                    whileHover={{ y: -8 }}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1c31] hover:border-white/20 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    {/* Image */}
                    <div className="relative bg-gradient-to-br from-[#102036] to-[#0d1c31] h-48 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: idx * 0.3 }}
                        className="text-6xl group-hover:scale-110 transition-transform duration-300"
                      >
                        {product.emoji}
                      </motion.div>

                      <div className="absolute top-3 left-3 rounded-full bg-white/10 border border-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                        {product.badge}
                      </div>

                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-200 group/btn"
                      >
                        <Heart size={16} className="fill-red-400 text-red-400 group-hover/btn:fill-white group-hover/btn:text-white transition-colors" />
                      </button>

                      <div className="absolute bottom-3 right-3 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c31]/70 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer text-sm">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-white/20'} />
                        ))}
                        <span className="text-xs text-white/40">({product.rating})</span>
                      </div>

                      <p className="text-xs text-white/40 mb-3">{product.seller}</p>

                      <div className="mb-4">
                        <p className="text-2xl font-bold text-white">${product.price.toFixed(2)}</p>
                        <p className="text-xs text-white/30 line-through">${product.originalPrice.toFixed(2)}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button className="rounded-xl bg-primary/10 border border-primary/20 text-primary py-2.5 text-xs font-semibold hover:bg-primary hover:text-[#071425] transition-all duration-200 flex items-center justify-center gap-1.5">
                          <ShoppingCart size={13} /> Agregar
                        </button>
                        <button
                          onClick={() => removeFavorite(product.id)}
                          className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick actions bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 rounded-2xl border border-white/10 bg-[#0d1c31] p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <p className="text-white font-semibold">{favorites.length} productos en favoritos</p>
                <p className="text-white/40 text-sm">Total potencial: ${favorites.reduce((s, p) => s + p.price, 0).toFixed(2)}</p>
              </div>
              <div className="flex gap-3">
                <button className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-[#071425] text-sm hover:brightness-105 transition flex items-center gap-2">
                  <ShoppingCart size={16} /> Agregar Todo al Carrito
                </button>
                <button
                  onClick={() => setFavorites([])}
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 font-semibold text-white/60 text-sm hover:bg-white/10 transition"
                >
                  Limpiar Lista
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
