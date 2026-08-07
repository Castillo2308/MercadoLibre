'use client';

/**
 * favorites.tsx
 *
 * Página de productos favoritos/wishlist.
 * Tarjetas planas (sin inclinación) que aparecen al hacer scroll,
 * con swipe-to-delete y burst de corazones al eliminar.
 */

import { useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Heart, ShoppingCart, ArrowRight, Trash2, Star, Sparkles, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { getDesignIllustration } from '@/lib/design-api';
import { SmartImage } from '@/components/ui/smart-image';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { formatCRC } from '@/lib/utils';

const CONDITION_KEYS: Record<string, 'favorites.condition.new' | 'favorites.condition.likeNew' | 'favorites.condition.good' | 'favorites.condition.fair' | 'favorites.condition.refurbished'> = {
  new: 'favorites.condition.new',
  'like-new': 'favorites.condition.likeNew',
  good: 'favorites.condition.good',
  fair: 'favorites.condition.fair',
  refurbished: 'favorites.condition.refurbished',
};

function FloatingHeart({
  springX,
  springY,
  depth,
  className,
  size,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  depth: number;
  className: string;
  size: number;
}) {
  const x = useTransform(springX, (v) => v * depth);
  const y = useTransform(springY, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`pointer-events-none absolute ${className}`}>
      <Heart size={size} className="fill-current" />
    </motion.div>
  );
}

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Link href={href} onMouseMove={handleMove} onMouseLeave={reset} className="premium-cta text-base">
        {children}
      </Link>
    </motion.div>
  );
}

interface FavoriteProduct {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number | null;
  condition?: string;
  averageRating?: number;
  reviewCount?: number;
  mainImageUrl?: string | null;
}

function FavoriteCard({
  product,
  idx,
  onRemove,
  onAddToCart,
}: {
  product: FavoriteProduct;
  idx: number;
  onRemove: (id: string) => void;
  onAddToCart: (product: FavoriteProduct) => void;
}) {
  const { t } = useLanguage();
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-140, -20], [1, 0]);
  const [bursting, setBursting] = useState(false);

  const discount =
    product.originalPrice && product.price && product.originalPrice > product.price
      ? Math.round(100 - (product.price / product.originalPrice) * 100)
      : 0;

  const triggerRemove = () => {
    if (bursting) return;
    setBursting(true);
    window.setTimeout(() => onRemove(product.id), 380);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: Math.min(idx * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Delete affordance revealed behind the card while dragging */}
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="absolute inset-0 flex items-center justify-end rounded-[1.75rem] bg-gradient-to-l from-red-500 to-red-500/20 pr-6"
      >
        <Trash2 size={22} className="text-white" />
      </motion.div>

      {/* Heart burst particles */}
      <AnimatePresence>
        {bursting && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            {Array.from({ length: 7 }).map((_, i) => {
              const angle = (i / 7) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, x: Math.cos(angle) * 70, y: Math.sin(angle) * 70 - 20, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute"
                >
                  <Heart size={14} className="fill-red-400 text-red-400" />
                </motion.span>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        drag={bursting ? false : 'x'}
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={0.12}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) triggerRemove();
        }}
        style={{ x }}
        whileHover={{ y: -6 }}
        animate={bursting ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="group relative z-10 cursor-grab overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1c31] transition-colors duration-300 hover:border-white/20 active:cursor-grabbing"
      >
        {idx === 0 && (
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur">
            {t('favorites.swipeHint')}
          </div>
        )}

        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#102036] to-[#0d1c31]">
          <SmartImage
            src={product.mainImageUrl || getDesignIllustration(`favorite-${product.id}-${product.name}`)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
              -{discount}%
            </div>
          )}
          <button
            onClick={triggerRemove}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-black/40 backdrop-blur transition-all duration-200 hover:bg-red-500"
          >
            <Heart size={16} className="fill-red-400 text-red-400 transition-colors group-hover:text-white" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <Link href={`/products/${product.id}`} draggable={false}>
            <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-primary">
              {product.name || t('favorites.savedProduct')}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
            <Badge className="border-white/15 bg-white/5 text-white/70">
              {t(CONDITION_KEYS[product.condition || 'new'])}
            </Badge>
            {(product.reviewCount ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star size={11} className="fill-primary text-primary" />
                {product.averageRating?.toFixed(1)} ({product.reviewCount})
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-2 pt-1">
            <div>
              <p className="text-xl font-black text-white">
                {product.price ? formatCRC(product.price) : t('favorites.noPrice')}
              </p>
              {discount > 0 && <p className="text-xs text-white/40 line-through">{formatCRC(product.originalPrice)}</p>}
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary hover:text-[#071425]"
            >
              <ShoppingCart size={13} /> {t('common.add')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Favorites() {
  const { wishlist, removeFromWishlist, loaded } = useWishlist();
  const { addToCart } = useShoppingCart();
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 120, damping: 18 });

  const handleHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    addToCart(product.id, product.name, product.price || 0, 1);
    toast.success(t('favorites.toastAdded', { name: product.name }));
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => addToCart(item.id, item.name, item.price || 0, 1));
    toast.success(t('favorites.toastAllAdded'));
  };

  const stats = useMemo(
    () => [
      { label: t('favorites.statSaved'), value: wishlist.length },
      { label: t('favorites.statCompare'), value: wishlist.length },
      { label: t('favorites.statValue'), value: formatCRC(wishlist.reduce((sum, p) => sum + (p.price || 0), 0)) },
    ],
    [wishlist, t]
  );

  return (
    <main className="min-h-screen bg-[#071425]">
      {/* Hero */}
      <section ref={heroRef} onMouseMove={handleHeroMove} className="relative overflow-hidden border-b border-white/10 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.12),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(29,184,73,0.1),transparent_45%)]" />

        <FloatingHeart springX={springX} springY={springY} depth={26} size={20} className="left-[8%] top-[20%] text-red-400/25" />
        <FloatingHeart springX={springX} springY={springY} depth={-40} size={32} className="right-[12%] top-[18%] text-red-400/20" />
        <FloatingHeart springX={springX} springY={springY} depth={18} size={14} className="left-[22%] top-[65%] text-primary/25" />
        <FloatingHeart springX={springX} springY={springY} depth={-22} size={24} className="right-[24%] top-[60%] text-red-400/15" />
        <FloatingHeart springX={springX} springY={springY} depth={34} size={18} className="left-[45%] top-[10%] text-red-400/15" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
              <Heart size={13} className="fill-red-400 text-red-400" />
              {t('favorites.badge')}
              <Badge className="border-white/20 bg-white/10 text-white/80">{wishlist.length}</Badge>
            </div>
            <h1 className="mb-3 text-5xl font-bold text-white md:text-6xl">
              {t('favorites.titleLine1')}
              <span className="block text-red-400">{t('favorites.titleLine2')}</span>
            </h1>
            <p className="text-lg text-white/50">
              {wishlist.length} {wishlist.length !== 1 ? t('common.products') : t('common.product')} {t('favorites.savedSuffix')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loaded && wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col divide-y divide-white/10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1c31]/90 sm:flex-row sm:divide-x sm:divide-y-0"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-white/45">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {!loaded ? (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-[#0d1c31] px-8 py-24 text-center">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
            >
              <Sparkles size={28} className="text-primary" />
            </motion.div>
            <p className="text-white/60">{t('favorites.loading')}</p>
          </motion.div>
        ) : wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1c31] px-8 py-24 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.14),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(29,184,73,0.12),transparent_45%),radial-gradient(circle_at_50%_95%,rgba(37,99,235,0.12),transparent_50%)]" />

            <div className="relative mx-auto mb-8 h-28 w-56">
              {[
                { x: -80, y: 6, size: 22, delay: 0, opacity: 'text-white/10' },
                { x: -34, y: -14, size: 16, delay: 0.3, opacity: 'text-white/15' },
                { x: 34, y: -10, size: 18, delay: 0.6, opacity: 'text-white/10' },
                { x: 80, y: 4, size: 24, delay: 0.9, opacity: 'text-white/15' },
              ].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [h.y, h.y - 10, h.y] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
                  className={`absolute top-1/2 ${h.opacity}`}
                  style={{ left: `calc(50% + ${h.x}px)` }}
                >
                  <Heart size={h.size} />
                </motion.div>
              ))}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Heart size={52} className="fill-red-500/20 text-red-400" />
              </motion.div>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white">{t('favorites.emptyTitle')}</h3>
            <p className="mx-auto mb-8 max-w-sm text-white/50">
              {t('favorites.emptyText')}
            </p>
            <div className="relative z-10 flex justify-center">
              <MagneticButton href="/">
                {t('favorites.exploreProducts')} <ArrowRight size={18} />
              </MagneticButton>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {wishlist.map((product, idx) => (
                  <FavoriteCard key={product.id} product={product} idx={idx} onRemove={removeFromWishlist} onAddToCart={handleAddToCart} />
                ))}
              </AnimatePresence>
            </div>

            {/* Quick actions bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-[#0d1c31] p-5 sm:flex-row"
            >
              <div className="flex items-center gap-3">
                <BadgeCheck size={18} className="text-primary" />
                <div>
                  <p className="font-semibold text-white">{wishlist.length} {t('favorites.itemsInFavorites')}</p>
                  <p className="text-sm text-white/40">{t('favorites.saveMoreHint')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-[#071425] transition hover:brightness-105"
                >
                  <ShoppingCart size={16} /> {t('favorites.addAllToCart')}
                </button>
                <button
                  onClick={() => wishlist.forEach((item) => removeFromWishlist(item.id))}
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10"
                >
                  {t('favorites.clearList')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
