'use client';

/**
 * product-detail.tsx
 *
 * Página de detalle de un producto real (fetch desde /api/products/[id]).
 * Muestra imágenes, precio, vendedor, descripción y reseñas reales.
 */

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Share2, Star, Shield, MessageCircle, BadgeCheck, PackageCheck, ArrowLeft } from 'lucide-react';
import { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useAuth } from '@/context/AuthContext';
import { useNavigationLoader } from '@/components/NavigationLoaderProvider';
import { SmartImage } from '@/components/ui/smart-image';
import { useLanguage } from '@/context/LanguageContext';
import type { TranslationKey } from '@/lib/i18n';
import { formatCRC } from '@/lib/utils';

const CONDITION_KEYS: Record<string, TranslationKey> = {
  new: 'product.condition.new',
  'like-new': 'product.condition.like-new',
  good: 'product.condition.good',
  fair: 'product.condition.fair',
  refurbished: 'product.condition.refurbished',
};

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  reviewer: { firstName: string; lastName: string } | null;
}

interface ProductDetail {
  id: string;
  title: string;
  description: string | null;
  price: string;
  originalPrice: string | null;
  condition: string;
  quantityAvailable: number;
  averageRating: number;
  reviewCount: number;
  mainImageUrl: string | null;
  images: ProductImage[];
  category: { name: string; slug: string } | null;
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    sellerRating: number;
    totalSales: number;
    totalReviews: number;
    isVerified: boolean;
  };
  reviews: ReviewItem[];
}

function ProductDetailComponent({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading');

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const { startLoading } = useNavigationLoader();
  const { t, locale } = useLanguage();
  const router = useRouter();

  const productId = params.id;
  const isFavorite = isInWishlist(productId);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetch(`/api/products/${productId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('not-found');
        return res.json();
      })
      .then((data: ProductDetail) => {
        if (cancelled) return;
        setProduct(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('not-found');
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleFavoriteClick = () => {
    if (!product) return;
    toggleWishlist(productId, product.title);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      startLoading();
      router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${productId}`)}`);
      return;
    }
    if (!product) return;
    addToCart(productId, product.title, Number(product.price), quantity, {
      sellerId: product.seller.id,
      sellerName: `${product.seller.firstName} ${product.seller.lastName}`.trim(),
    });
    toast.success(t('product.addedToCart'));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      startLoading();
      router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${productId}`)}`);
      return;
    }
    handleAddToCart();
    startLoading();
    router.push('/cart');
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-[#071425] pb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded-xl bg-white/5" />
              <div className="h-6 w-1/3 animate-pulse rounded-xl bg-white/5" />
              <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'not-found' || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#071425] px-4 text-center">
        <p className="text-3xl font-black text-white">{t('product.notFound')}</p>
        <p className="text-white/55">{t('product.notFoundSubtitle')}</p>
        <Link href="/explore" className="premium-cta">
          <ArrowLeft size={18} /> {t('product.backToExplore')}
        </Link>
      </main>
    );
  }

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discount = originalPrice && originalPrice > price ? Math.round(100 - (price / originalPrice) * 100) : 0;
  const gallery = product.images.length > 0 ? product.images : product.mainImageUrl ? [{ id: 'main', imageUrl: product.mainImageUrl }] : [];
  const sellerName = `${product.seller.firstName} ${product.seller.lastName}`.trim() || t('product.defaultSellerName');

  return (
    <main className="min-h-screen bg-[#071425] pb-16">
      <div className="border-b border-white/10 bg-[#091424]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-primary">{t('product.breadcrumbHome')}</Link>
            <span>/</span>
            <Link href="/explore" className="transition-colors hover:text-primary">{t('product.breadcrumbProducts')}</Link>
            <span>/</span>
            <span className="truncate font-semibold text-white/80">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
            <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              {gallery[selectedImage] ? (
                <SmartImage src={gallery[selectedImage].imageUrl} alt={product.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">📦</div>
              )}
              {discount > 0 && (
                <div className="absolute right-4 top-4 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  -{discount}%
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {gallery.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 overflow-hidden rounded-2xl border transition-all duration-300 ${
                      selectedImage === i ? 'border-primary ring-2 ring-primary/40' : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <SmartImage src={img.imageUrl} alt={`${product.title} ${i + 1}`} fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="space-y-6">
            <div>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{product.category?.name || t('product.defaultCategory')}</p>
                  <h1 className="mt-1 text-3xl font-black text-white md:text-4xl">{product.title}</h1>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                >
                  <Heart size={22} className={`transition-all ${isFavorite ? 'fill-red-400 text-red-400 scale-110' : 'text-white/70'}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(product.averageRating) ? 'fill-primary text-primary' : 'text-white/15'} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white/70">
                  {product.averageRating.toFixed(1)} ({t('product.reviewsCount', { count: product.reviewCount })})
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
                  {CONDITION_KEYS[product.condition] ? t(CONDITION_KEYS[product.condition]) : product.condition}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6">
              <p className="mb-2 text-sm text-white/50">{t('product.price')}</p>
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <span className="text-5xl font-black text-white">{formatCRC(price)}</span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-white/35 line-through">{formatCRC(originalPrice)}</span>
                    <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                      {t('product.youSave', { amount: formatCRC(originalPrice - price) })}
                    </span>
                  </>
                )}
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-primary/15 px-3 py-2 text-sm font-semibold text-primary">
                <PackageCheck size={16} /> {t('product.available', { count: product.quantityAvailable })}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-white/75">{t('product.quantity')}</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-2xl border border-white/15 bg-white/5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-xl font-bold text-white/70 transition hover:text-primary">
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantityAvailable, parseInt(e.target.value) || 1)))}
                    className="w-16 border-x border-white/10 bg-transparent text-center text-lg font-bold text-white outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantityAvailable, quantity + 1))}
                    className="px-4 py-3 text-xl font-bold text-white/70 transition hover:text-primary"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/15 text-lg font-bold text-white transition hover:bg-white/15"
              >
                <ShoppingCart size={22} /> {t('product.addToCart')}
              </button>
              <button onClick={handleBuyNow} className="premium-cta h-14 w-full text-lg">
                {t('product.buyNow')}
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Shield size={18} className="text-secondary" />
                <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">{t('product.seller')}</h4>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <p className="text-xl font-black text-white">{sellerName}</p>
                {product.seller.isVerified && (
                  <BadgeCheck size={18} className="text-primary" />
                )}
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-sm">
                <div>
                  <p className="text-white/45">{t('product.rating')}</p>
                  <p className="font-bold text-white">★ {product.seller.sellerRating.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-white/45">{t('product.sales')}</p>
                  <p className="font-bold text-white">{product.seller.totalSales}</p>
                </div>
              </div>
              <Link
                href={`/messages?user=${encodeURIComponent(product.seller.id)}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle size={18} /> {t('product.contactSeller')}
              </Link>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(t('product.linkCopied'));
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <Share2 size={16} /> {t('product.share')}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t border-white/10 pt-12"
        >
          <h2 className="mb-6 text-2xl font-black text-white md:text-3xl">{t('product.description')}</h2>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="whitespace-pre-line text-base leading-relaxed text-white/75">
              {product.description || t('product.noDescription')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="mb-6 text-2xl font-black text-white md:text-3xl">{t('product.reviews', { count: product.reviewCount })}</h2>
          {product.reviews.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/55">
              {t('product.noReviews')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : t('product.defaultReviewer')}
                      </p>
                      <p className="text-sm text-white/45">{new Date(review.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} className={j < review.rating ? 'fill-primary text-primary' : 'text-white/15'} />
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="mb-1 font-semibold text-white/85">{review.title}</p>}
                  {review.comment && <p className="text-white/70">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default memo(ProductDetailComponent);
