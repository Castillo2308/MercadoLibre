'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Star, Shield, Zap, Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  seller: string;
  rating: number;
  reviews: number;
  category?: string;
  emoji: string;
}

const ALL_PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone 14 Pro - 256GB', price: 999.99, seller: 'Apple Store', rating: 4.9, reviews: 342, category: 'smartphones', emoji: '📱' },
  { id: 2, name: 'Samsung Galaxy S23', price: 899.99, seller: 'Samsung Official', rating: 4.8, reviews: 289, category: 'smartphones', emoji: '📱' },
  { id: 3, name: 'Google Pixel 7 Pro', price: 799.99, seller: 'Google Store', rating: 4.7, reviews: 156, category: 'smartphones', emoji: '📱' },
  { id: 4, name: 'OnePlus 11 Pro', price: 699.99, seller: 'OnePlus Direct', rating: 4.6, reviews: 98, category: 'smartphones', emoji: '📱' },
  { id: 5, name: 'Xiaomi 13 Ultra', price: 649.99, seller: 'Xiaomi Global', rating: 4.5, reviews: 203, category: 'smartphones', emoji: '📱' },
  { id: 6, name: 'Motorola Edge 40', price: 549.99, seller: 'Motorola Store', rating: 4.4, reviews: 127, category: 'smartphones', emoji: '📱' },
  { id: 7, name: 'Nothing Phone 1', price: 469.99, seller: 'Nothing Store', rating: 4.3, reviews: 85, category: 'smartphones', emoji: '📱' },
  { id: 8, name: 'Realme GT 3', price: 399.99, seller: 'Realme Direct', rating: 4.2, reviews: 142, category: 'smartphones', emoji: '📱' },
  { id: 9, name: 'iPad Pro 12.9 - 256GB', price: 1199.99, seller: 'Apple Store', rating: 4.9, reviews: 421, category: 'tablets', emoji: '📱' },
  { id: 10, name: 'Samsung Galaxy Tab S9', price: 849.99, seller: 'Samsung Official', rating: 4.7, reviews: 318, category: 'tablets', emoji: '📱' },
];

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q || '').toLowerCase();
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(ALL_PRODUCTS);

  useEffect(() => {
    let results = ALL_PRODUCTS;
    if (query) {
      results = results.filter(
        (p) => p.name.toLowerCase().includes(query) || p.seller.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query)
      );
    }
    if (priceRange !== 'all') {
      results = results.filter((p) => {
        switch (priceRange) {
          case '0-100': return p.price <= 100;
          case '100-500': return p.price > 100 && p.price <= 500;
          case '500-1000': return p.price > 500 && p.price <= 1000;
          case '1000': return p.price > 1000;
          default: return true;
        }
      });
    }
    const sorted = [...results];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'newest': sorted.sort((a, b) => b.id - a.id); break;
    }
    setFilteredProducts(sorted);
  }, [query, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#071425]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(29,184,73,0.1),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.1),transparent_45%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Busqueda</h1>
            <p className="text-white/50 text-lg">
              {query && filteredProducts.length > 0
                ? `${filteredProducts.length} resultados para: "${searchParams.q}"`
                : query
                  ? `Sin resultados para: "${searchParams.q}"`
                  : `${filteredProducts.length} productos disponibles`}
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
                  <SlidersHorizontal size={18} className="text-primary" /> Filtros
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
                  <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">Precio</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Todos los precios' },
                      { value: '0-100', label: '$0 - $100' },
                      { value: '100-500', label: '$100 - $500' },
                      { value: '500-1000', label: '$500 - $1,000' },
                      { value: '1000', label: 'Mas de $1,000' },
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
                    <Zap size={12} className="text-yellow-400" /> Estado
                  </h4>
                  {['Nuevo', 'Como Nuevo', 'Usado'].map((c, idx) => (
                    <label key={c} className="flex items-center gap-3 mb-2.5 cursor-pointer group">
                      <input type="checkbox" defaultChecked={idx === 0} className="w-4 h-4 accent-primary cursor-pointer" />
                      <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{c}</span>
                    </label>
                  ))}
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">Calificacion</h4>
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
              <p className="text-white/50 text-sm">{filteredProducts.length} productos encontrados</p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/15 text-white text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="relevance" className="bg-[#0d1c31]">Relevancia</option>
                  <option value="price-asc" className="bg-[#0d1c31]">Menor precio</option>
                  <option value="price-desc" className="bg-[#0d1c31]">Mayor precio</option>
                  <option value="rating" className="bg-[#0d1c31]">Mejor calificacion</option>
                  <option value="newest" className="bg-[#0d1c31]">Mas nuevo</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
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
                            <div className="text-5xl group-hover:scale-125 transition-transform duration-400">
                              {product.emoji}
                            </div>
                            <div className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                              -15%
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c31]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm leading-snug">
                              {product.name}
                            </h3>

                            <div className="flex items-center gap-1.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-white/20'} />
                              ))}
                              <span className="text-xs text-white/40">({product.reviews})</span>
                            </div>

                            <p className="text-xs text-white/40 mb-3 flex items-center gap-1">
                              <Shield size={11} className="text-primary" /> {product.seller}
                            </p>

                            <div className="mt-auto">
                              <p className="text-2xl font-bold text-white">${product.price.toFixed(2)}</p>
                              <p className="text-xs text-white/30 line-through">${(product.price * 1.17).toFixed(2)}</p>
                            </div>

                            <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 py-1.5 text-xs text-primary font-semibold text-center">
                              Envio Gratis
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
                <h3 className="text-2xl font-bold text-white mb-2">Sin resultados</h3>
                <p className="text-white/50">Intenta con una busqueda diferente o ajusta los filtros</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
