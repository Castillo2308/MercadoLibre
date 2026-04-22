'use client';

import { Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  seller: string;
  rating: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      price: 999.99,
      image: '',
      seller: 'TechStore',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'iPhone 14 Pro',
      price: 1099.99,
      image: '',
      seller: 'Apple Authorized',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'AirPods Pro',
      price: 249.99,
      image: '',
      seller: 'ElectronicsHub',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'iPad Air',
      price: 599.99,
      image: '',
      seller: 'TechStore',
      rating: 4.8,
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-pink-200/10 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-accent" size={32} fill="currentColor" />
            <h1 className="text-5xl font-black text-gray-900">Mis Favoritos</h1>
          </div>
          <p className="text-gray-600">{favorites.length} productos guardados</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <div className="mb-6">
              <Heart size={80} className="mx-auto text-gray-300 mb-4" />
            </div>
            <p className="text-2xl font-bold text-gray-600 mb-4">No hay productos favoritos aún</p>
            <p className="text-gray-600 mb-8">Haz clic en el corazón de cualquier producto para agregarlo a favoritos</p>
            <Link
              href="/"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              Explorar Productos
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product, idx) => (
              <div
                key={product.id}
                className="card-elevated group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-300">💻</div>
                  </div>
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10"
                  >
                    <Heart size={20} className="text-accent fill-accent" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                  </div>

                  {/* Seller */}
                  <p className="text-xs text-gray-600 mb-3 font-semibold">{product.seller}</p>

                  {/* Price */}
                  <p className="text-2xl font-black text-secondary mb-4">
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Button */}
                  <button className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm">
                    <ShoppingCart size={16} />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
