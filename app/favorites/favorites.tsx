'use client';

/**
 * favorites.tsx
 * 
 * Página de productos favoritos/wishlist.
 * Muestra:
 * - Lista de productos guardados como favoritos
 * - Botones para remover de favoritos
 * - Botones para agregar al carrito
 * - Mensajes cuando no hay favoritos
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { getDesignIllustration } from '@/lib/design-api';
import { SmartImage } from '@/components/ui/smart-image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Favorites() {
  const { wishlist, removeFromWishlist, loaded } = useWishlist();

  return (
    <main className="min-h-screen bg-[#071425]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.12),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(29,184,73,0.1),transparent_45%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <motion.div
          animate={{ opacity: [0.22, 0.5, 0.22], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-red-500/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.18, 0.42, 0.18], y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="pointer-events-none absolute right-0 top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 mb-5">
              <Heart size={13} className="fill-red-400 text-red-400" />
              Tu lista de deseos
              <Badge className="bg-white/10 text-white/80 border-white/20">{wishlist.length}</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
              Mis
              <span className="block text-red-400">Favoritos</span>
            </h1>
            <p className="text-white/50 text-lg">
              {wishlist.length} producto{wishlist.length !== 1 ? 's' : ''} guardado{wishlist.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loaded && wishlist.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="rounded-2xl border-white/10 bg-[#0d1c31]/90 p-4">
              <p className="text-xs uppercase tracking-wide text-white/45">Guardados</p>
              <p className="mt-1 text-2xl font-black text-white">{wishlist.length}</p>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-[#0d1c31]/90 p-4">
              <p className="text-xs uppercase tracking-wide text-white/45">Listos para comparar</p>
              <p className="mt-1 text-2xl font-black text-primary">{wishlist.length}</p>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-[#0d1c31]/90 p-4">
              <p className="text-xs uppercase tracking-wide text-white/45">Accion sugerida</p>
              <p className="mt-1 text-sm font-semibold text-white/80">Mover al carrito</p>
            </Card>
          </div>
        )}

        {!loaded ? (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-[#0d1c31] text-center py-24 px-8">
            <CardContent>
              <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl">
                ✨
              </motion.div>
              <p className="text-white/60">Cargando favoritos...</p>
            </CardContent>
          </motion.div>
        ) : wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1c31] text-center py-24 px-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.14),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(29,184,73,0.12),transparent_45%),radial-gradient(circle_at_50%_95%,rgba(37,99,235,0.12),transparent_50%)]" />
            <motion.div
              animate={{ scale: [1, 1.08, 1], y: [0, -6, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mb-6"
            >
              <Heart size={84} className="mx-auto text-white/15" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">No hay favoritos aún</h3>
            <p className="text-white/50 mb-8 max-w-sm mx-auto">
              Haz click en el corazon de cualquier producto para agregarlo a tu lista de deseos.
            </p>
            <div className="relative z-10">
              <Button asChild className="bg-primary text-[#071425] hover:brightness-105">
              <Link href="/">
                Explorar Productos <ArrowRight size={18} className="ml-2" />
              </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {wishlist.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, delay: idx * 0.06 }}
                    whileHover={{ y: -10, scale: 1.01 }}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1c31] transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    {/* Image */}
                    <div className="relative bg-gradient-to-br from-[#102036] to-[#0d1c31] h-48 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.04, 1] }}
                        transition={{ duration: 4, repeat: Infinity, delay: idx * 0.3 }}
                        className="h-full w-full group-hover:scale-110 transition-transform duration-300"
                      >
                        <SmartImage
                          src={getDesignIllustration(`favorite-${product.id}-${product.name}`)}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </motion.div>

                      <motion.button
                        onClick={() => removeFromWishlist(product.id)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-200 group/btn"
                      >
                        <Heart size={16} className="fill-red-400 text-red-400 group-hover/btn:fill-white group-hover/btn:text-white transition-colors" />
                      </motion.button>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c31]/70 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer text-sm">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                        Guardado para revisar despues
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button className="h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-[#071425]" variant="outline">
                          <ShoppingCart size={13} className="mr-2" /> Agregar
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(product.id)}
                          className="h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                          variant="outline"
                        >
                          <Trash2 size={13} className="mr-2" /> Eliminar
                        </Button>
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
                <p className="text-white font-semibold">{wishlist.length} productos en favoritos</p>
                <p className="text-white/40 text-sm">Guarda mas productos para compararlos luego.</p>
              </div>
              <div className="flex gap-3">
                <Button className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-[#071425] text-sm hover:brightness-105 transition flex items-center gap-2">
                  <ShoppingCart size={16} /> Agregar Todo al Carrito
                </Button>
                <Button
                  onClick={() => wishlist.forEach((item) => removeFromWishlist(item.id))}
                  variant="outline"
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 font-semibold text-white/60 text-sm hover:bg-white/10"
                >
                  Limpiar Lista
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
