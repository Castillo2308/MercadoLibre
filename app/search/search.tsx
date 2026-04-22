'use client';

import { Filter, ChevronDown, Star, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  seller: string;
  rating: number;
  reviews: number;
  category?: string;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'iPhone 14 Pro - 256GB',
    price: 999.99,
    image: '',
    seller: 'Apple Store',
    rating: 4.9,
    reviews: 342,
    category: 'smartphones',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23',
    price: 899.99,
    image: '',
    seller: 'Samsung Official',
    rating: 4.8,
    reviews: 289,
    category: 'smartphones',
  },
  {
    id: 3,
    name: 'Google Pixel 7 Pro',
    price: 799.99,
    image: '',
    seller: 'Google Store',
    rating: 4.7,
    reviews: 156,
    category: 'smartphones',
  },
  {
    id: 4,
    name: 'OnePlus 11 Pro',
    price: 699.99,
    image: '',
    seller: 'OnePlus Direct',
    rating: 4.6,
    reviews: 98,
    category: 'smartphones',
  },
  {
    id: 5,
    name: 'Xiaomi 13 Ultra',
    price: 649.99,
    image: '',
    seller: 'Xiaomi Global',
    rating: 4.5,
    reviews: 203,
    category: 'smartphones',
  },
  {
    id: 6,
    name: 'Motorola Edge 40',
    price: 549.99,
    image: '',
    seller: 'Motorola Store',
    rating: 4.4,
    reviews: 127,
    category: 'smartphones',
  },
  {
    id: 7,
    name: 'Nothing Phone 1',
    price: 469.99,
    image: '',
    seller: 'Nothing Store',
    rating: 4.3,
    reviews: 85,
    category: 'smartphones',
  },
  {
    id: 8,
    name: 'Realme GT 3',
    price: 399.99,
    image: '',
    seller: 'Realme Direct',
    rating: 4.2,
    reviews: 142,
    category: 'smartphones',
  },
  {
    id: 9,
    name: 'iPad Pro 12.9 - 256GB',
    price: 1199.99,
    image: '',
    seller: 'Apple Store',
    rating: 4.9,
    reviews: 421,
    category: 'tablets',
  },
  {
    id: 10,
    name: 'Samsung Galaxy Tab S9',
    price: 849.99,
    image: '',
    seller: 'Samsung Official',
    rating: 4.7,
    reviews: 318,
    category: 'tablets',
  },
];

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q || '').toLowerCase();
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(ALL_PRODUCTS);

  useEffect(() => {
    let results = ALL_PRODUCTS;

    // Filter by search query
    if (query) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.seller.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      results = results.filter((p) => {
        const price = p.price;
        switch (priceRange) {
          case '0-100':
            return price >= 0 && price <= 100;
          case '100-500':
            return price > 100 && price <= 500;
          case '500-1000':
            return price > 500 && price <= 1000;
          case '1000':
            return price > 1000;
          default:
            return true;
        }
      });
    }

    // Sort results
    const sorted = [...results];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(sorted);
  }, [query, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-black mb-2 text-gray-900">Búsqueda</h1>
            <p className="text-lg text-gray-600">
              {query && filteredProducts.length > 0
                ? `${filteredProducts.length} resultados para: "${searchParams.q}"`
                : query
                  ? `No se encontraron productos para: "${searchParams.q}"`
                  : `${filteredProducts.length} productos disponibles`}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-elevated sticky top-24">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-bold text-lg">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Filter
                    size={20}
                    className={showFilters ? 'text-secondary' : 'text-gray-600'}
                  />
                </button>
              </div>

              {showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024 ? (
                <div className="space-y-6">
                  {/* Price Filter */}
                  <div className="pb-6 border-b border-gray-200">
                    <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <span className="text-secondary">💰</span> Precio
                    </h4>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="all">Todos</option>
                      <option value="0-100">$0 - $100</option>
                      <option value="100-500">$100 - $500</option>
                      <option value="500-1000">$500 - $1000</option>
                      <option value="1000">Más de $1000</option>
                    </select>
                  </div>

                  {/* Condition Filter */}
                  <div className="pb-6 border-b border-gray-200">
                    <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <Zap size={18} className="text-accent" /> Estado
                    </h4>
                    {['Nuevo', 'Como Nuevo', 'Usado'].map((condition, idx) => (
                      <label key={condition} className="flex items-center gap-3 mb-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          defaultChecked={idx === 0}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-secondary transition-colors">
                          {condition}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Rating Filter */}
                  <div className="pb-6 border-b border-gray-200">
                    <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <Star size={18} className="text-primary" /> Calificación
                    </h4>
                    {[5, 4, 3].map((stars) => (
                      <label
                        key={stars}
                        className="flex items-center gap-3 mb-3 cursor-pointer group"
                      >
                        <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                        <div className="flex text-sm">
                          {[...Array(stars)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="fill-primary text-primary"
                            />
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>

                  <button className="btn btn-primary w-full">
                    Aplicar Filtros
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 font-semibold">{filteredProducts.length} productos encontrados</p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="rating">Mejor calificación</option>
                  <option value="newest">Más nuevo</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                />
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div
                      className="card-elevated group h-full overflow-hidden hover:shadow-2xl animate-fadeIn"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Image */}
                      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
                            📱
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                          -15%
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors text-sm">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-xs">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < Math.floor(product.rating)
                                    ? 'fill-primary text-primary'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">({product.reviews})</span>
                        </div>

                        {/* Seller */}
                        <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                          <Shield size={12} /> {product.seller}
                        </p>

                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-2xl font-black text-secondary">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 line-through">
                            ${(product.price * 1.17).toFixed(2)}
                          </p>
                        </div>

                        {/* Shipping */}
                        <div className="mb-4 p-2 bg-primary/10 rounded text-xs text-primary font-semibold flex items-center gap-1">
                          📦 Envío Gratis
                        </div>

                        {/* Button */}
                        <button className="btn btn-primary w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600">
                  Intenta con una búsqueda diferente o ajusta los filtros
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
