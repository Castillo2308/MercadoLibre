/**
 * search.tsx
 * 
 * Página de búsqueda y filtrado de productos.
 * Características:
 * - Búsqueda por keywords
 * - Filtros por categoría, precio, rating
 * - Ordenamiento de resultados
 * - Paginación
 * - Skeleton loading
 * - Enlace a detalles de cada producto
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Star, Shield, Zap, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
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

export default function SearchPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const qParam = (searchParams.q || '').toString();
  const categoryParam = (searchParams.category || '').toString();
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [allFetched, setAllFetched] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const params = new URLSearchParams();
        if (categoryParam) params.set('category', categoryParam);
        if (qParam) params.set('q', qParam);
        params.set('take', '100');
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) {
          setAllFetched(data || []);
          setFilteredProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching products', err);
        if (!cancelled) setAllFetched([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [qParam, categoryParam]);

  useEffect(() => {
    let results = [...allFetched];
    // apply price filters
    if (priceRange !== 'all') {
      results = results.filter((p) => {
        const price = Number(p.price || 0);
        switch (priceRange) {
          case '0-100': return price <= 50000;
          case '100-500': return price > 50000 && price <= 250000;
          case '500-1000': return price > 250000 && price <= 500000;
          case '1000': return price > 500000;
          default: return true;
        }
      });
    }
    const sorted = [...results];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case 'price-desc': sorted.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case 'rating': sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break;
      case 'newest': sorted.sort((a, b) => (a.id > b.id ? -1 : 1)); break;
    }
    setFilteredProducts(sorted);
  }, [allFetched, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#071425]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(29,184,73,0.1),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.1),transparent_45%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t('search.title')}</h1>
            <p className="text-white/50 text-lg">
              {qParam && filteredProducts.length > 0
                ? t('search.resultsFor', { count: filteredProducts.length, query: qParam })
                : qParam
                  ? t('search.noResultsFor', { query: qParam })
                  : t('search.productsAvailable', { count: filteredProducts.length })}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-[#0d1c31] p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" /> {t('search.filters')}
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-white/50 hover:text-white transition-colors"
                >
                  {showFilters ? <X size={18} /> : <Filter size={18} />}
                </button>
              </div>

              <div className={`space-y-5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Price */}
                <div className="pb-5 border-b border-white/10">
                  <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">{t('search.price')}</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: t('search.allPrices') },
                      { value: '0-100', label: '₡0 - ₡50.000' },
                      { value: '100-500', label: '₡50.000 - ₡250.000' },
                      { value: '500-1000', label: '₡250.000 - ₡500.000' },
                      { value: '1000', label: t('search.moreThan1000') },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${priceRange === opt.value ? 'border-primary bg-primary' : 'border-white/30 group-hover:border-primary/60'}`}>
                          {priceRange === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-[#071425]" />}
                        </div>
                        <span className={`text-sm transition-colors ${priceRange === opt.value ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}
                          onClick={() => setPriceRange(opt.value)}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="pb-5 border-b border-white/10">
                  <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Zap size={12} className="text-yellow-400" /> {t('search.condition')}
                  </h4>
                  {[t('search.new'), t('search.likeNew'), t('search.used')].map((c, idx) => (
                    <label key={c} className="flex items-center gap-3 mb-2.5 cursor-pointer group">
                      <input type="checkbox" defaultChecked={idx === 0} className="w-4 h-4 accent-primary cursor-pointer" />
                      <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{c}</span>
                    </label>
                  ))}
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">{t('search.rating')}</h4>
                  {[5, 4, 3].map((stars) => (
                    <label key={stars} className="flex items-center gap-3 mb-2.5 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" />
                      <div className="flex gap-0.5">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} size={12} className="fill-primary text-primary" />
                        ))}
                        {[...Array(5 - stars)].map((_, i) => (
                          <Star key={i} size={12} className="text-white/20" />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="mb-6 flex justify-between items-center rounded-xl border border-white/10 bg-[#0d1c31] p-3 px-4">
              <p className="text-white/50 text-sm">{t('search.productsFound', { count: filteredProducts.length })}</p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/15 text-white text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="relevance" className="bg-[#0d1c31]">{t('search.sortRelevance')}</option>
                  <option value="price-asc" className="bg-[#0d1c31]">{t('search.sortPriceAsc')}</option>
                  <option value="price-desc" className="bg-[#0d1c31]">{t('search.sortPriceDesc')}</option>
                  <option value="rating" className="bg-[#0d1c31]">{t('search.sortRating')}</option>
                  <option value="newest" className="bg-[#0d1c31]">{t('search.sortNewest')}</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <CardSkeleton key={idx} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      whileHover={{ y: -6 }}
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1c31] hover:border-white/20 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] h-full flex flex-col">
                          {/* Image */}
                          <div className="relative bg-gradient-to-br from-[#102036] to-[#0d1c31] h-44 flex items-center justify-center overflow-hidden">
                            {product.images && product.images[0] ? (
                              <SmartImage
                                src={product.images[0].imageUrl}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="text-5xl group-hover:scale-125 transition-transform duration-400">📦</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c31]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm leading-snug">
                              {product.title}
                            </h3>

                            <div className="flex items-center gap-1.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < Math.floor(product.averageRating || 0) ? 'fill-primary text-primary' : 'text-white/20'} />
                              ))}
                              <span className="text-xs text-white/40">({product.reviewCount || 0})</span>
                            </div>

                            <p className="text-xs text-white/40 mb-3 flex items-center gap-1">
                              <Shield size={11} className="text-primary" /> {product.seller ? `${product.seller.firstName || ''} ${product.seller.lastName || ''}` : t('common.seller')}
                            </p>

                            <div className="mt-auto">
                              <p className="text-2xl font-bold text-white">{formatCRC(product.price)}</p>
                            </div>

                            <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 py-1.5 text-xs text-primary font-semibold text-center">
                              {t('common.freeShipping')}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 rounded-2xl border border-white/10 bg-[#0d1c31]"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('search.noResultsTitle')}</h3>
                <p className="text-white/50">{t('search.noResultsText')}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
