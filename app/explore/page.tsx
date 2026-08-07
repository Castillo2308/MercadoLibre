/**
 * explore.tsx / page.tsx
 * 
 * Página de exploración de productos.
 * Muestra:
 * - Grid de todos los productos disponibles
 * - Botones para agregar a carrito
 * - Botones para agregar a favoritos
 * - Ratings y información del vendedor
 * - Skeleton loading mientras carga
 * - Paginación si hay muchos productos
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/AuthContext";
import { useNavigationLoader } from "@/components/NavigationLoaderProvider";
import { useRouter } from "next/navigation";
import { SmartImage } from "@/components/ui/smart-image";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { formatCRC } from "@/lib/utils";

type ApiProduct = {
  id: string;
  title: string;
  price: string | number;
  seller?: { firstName?: string; lastName?: string } | null;
  averageRating?: number;
  reviewCount?: number;
  category?: { id?: string; slug?: string; name?: string } | null;
  images?: { imageUrl: string }[];
};

export default function ExplorePage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const { startLoading } = useNavigationLoader();
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`/api/products?take=100`);
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleAddToCart = (productId: string, productTitle: string, productPrice: number) => {
    if (!isAuthenticated) {
      startLoading();
      router.push(`/auth/login?redirect=${encodeURIComponent('/explore')}`);
      return;
    }
    addToCart(productId, productTitle, productPrice, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071425]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6 h-10 w-72 rounded bg-white/10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071425]">
      <section className="relative overflow-hidden border-b border-white/10 py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(29,184,73,0.1),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.1),transparent_45%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t('explore.title')}</h1>
            <p className="text-white/50 text-lg">{t('explore.subtitle', { count: products.length })}</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">{t('explore.noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence>
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1c31] hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative bg-gradient-to-br from-[#102036] to-[#0d1c31] h-48 flex items-center justify-center overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              startLoading();
                              router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
                              return;
                            }
                            toggleWishlist(String(product.id), product.title || '');
                          }}
                          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                        >
                          <Heart size={16} className={`transition-colors ${isInWishlist(String(product.id)) ? 'fill-red-400 text-red-400' : 'text-white/70'}`} />
                        </button>
                        {product.images && product.images[0] ? (
                          <SmartImage
                            src={product.images[0].imageUrl}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-5xl group-hover:scale-125 transition-transform duration-400">📦</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c31]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(product.averageRating || 0)
                                ? "fill-primary text-primary"
                                : "text-white/20"
                            }
                          />
                        ))}
                        <span className="text-xs text-white/40">({product.reviewCount || 0})</span>
                      </div>

                      {product.category && (
                        <p className="text-xs text-primary/70 mb-2">{product.category.name}</p>
                      )}

                      <div className="mt-auto">
                        <p className="text-2xl font-bold text-white">{formatCRC(product.price)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleAddToCart(product.id, product.title, Number(product.price));
                        }}
                        className="mt-3 w-full rounded-lg bg-primary text-[#071425] py-2 font-semibold hover:brightness-110 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} />
                        <span className="text-sm">{t('common.add')}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
