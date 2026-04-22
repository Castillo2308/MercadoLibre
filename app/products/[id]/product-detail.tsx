'use client';

import { Heart, ShoppingCart, Share2, Star, Shield, MessageCircle } from 'lucide-react';
import { useState, memo } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function ProductDetailComponent({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const productId = parseInt(params.id) || 1;
  const isFavorite = isInWishlist(productId);

  const product = {
    name: 'iPhone 14 Pro - 256GB',
    price: 999.99,
    originalPrice: 1199.99,
    rating: 4.8,
    reviews: 342,
    seller: 'Apple Store Official',
    stock: 15,
    description: 'El iPhone 14 Pro es el smartphone más avanzado de Apple, con pantalla ProMotion de 120Hz, cámara profesional de 48MP y chip A16 Bionic. Perfecto para fotógrafos y videógrafos.',
  };

  const handleFavoriteClick = () => {
    toggleWishlist(productId, product.name);
  };

  const handleAddToCart = () => {
    addToCart(productId, product.name, product.price, quantity);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=true');
      return;
    }
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-secondary transition-colors">Productos</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4 animate-fadeIn">
            <div className="card-elevated h-96 flex items-center justify-center overflow-hidden group relative">
              <div className="text-7xl group-hover:scale-110 transition-transform duration-300">📱</div>
              <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-bold">
                -17%
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i - 1)}
                  className={`card-elevated h-24 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    selectedImage === i - 1 ? 'ring-2 ring-secondary scale-105' : 'hover:scale-105'
                  }`}
                >
                  <span className="text-3xl">📱</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-600 text-sm mb-1">SKU: {params.id}</p>
                  <h1 className="text-4xl font-black text-gray-900 mb-3">{product.name}</h1>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className="p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <Heart
                    size={28}
                    className={`transition-all duration-300 ${
                      isFavorite
                        ? 'fill-accent text-accent scale-125'
                        : 'text-gray-600 group-hover:text-accent'
                    }`}
                  />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="card-elevated bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20">
              <p className="text-gray-600 text-sm mb-2">Precio</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-black text-secondary">${product.price}</span>
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="badge bg-accent text-white">Ahorra $200</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 font-semibold bg-green-50 px-3 py-2 rounded-lg w-fit">
                📦 Envío Gratis
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-bold text-gray-900 mb-3 block">Cantidad</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-xl font-bold text-secondary hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center outline-none text-lg font-bold border-l border-r border-gray-200"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-xl font-bold text-secondary hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600 text-sm">
                  {product.stock} disponibles
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              {showSuccessMessage && (
                <div className="bg-green-50 border-l-4 border-primary text-primary px-4 py-3 rounded-lg font-bold animate-slideDown">
                  ✓ Producto agregado al carrito
                </div>
              )}
              
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary w-full h-14 flex items-center justify-center gap-2 text-lg font-bold hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <ShoppingCart size={24} />
                Agregar al Carrito
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="btn btn-secondary w-full h-14 flex items-center justify-center gap-2 text-lg font-bold hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Comprar Ahora</span>
              </button>
            </div>

            {/* Additional Options */}
            <div className="space-y-2 pt-4 border-t-2 border-gray-200">
              <button className="w-full py-3 flex items-center justify-between group hover:bg-gray-50 rounded px-3 transition-colors">
                <div className="flex items-center gap-3">
                  <Share2 size={20} className="text-gray-600 group-hover:text-secondary transition-colors" />
                  <span className="font-semibold text-gray-900">Compartir</span>
                </div>
                <span>→</span>
              </button>
            </div>

            {/* Seller Info Card */}
            <div className="card-elevated p-6 border-2 border-gray-100">
              <div className="mb-4">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-secondary" />
                  Vendedor Oficial
                </h4>
                <p className="text-2xl font-black text-gray-900">{product.seller}</p>
              </div>

              <div className="space-y-2 mb-4 py-4 border-y border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calificación:</span>
                  <span className="font-bold text-secondary">★★★★★ 4.9</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Productos:</span>
                  <span className="font-bold">1,245</span>
                </div>
              </div>

              <button className="btn btn-outline w-full flex items-center justify-center gap-2 mb-2">
                <MessageCircle size={18} />
                Contactar Vendedor
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 gap-3 pt-4">
              {[
                { icon: '🛡️', title: 'Compra Protegida', desc: 'Tu dinero está seguro' },
                { icon: '🚚', title: 'Envío Rápido', desc: '2-3 días hábiles' },
                { icon: '↩️', title: 'Devolución Fácil', desc: '30 días' },
              ].map((benefit) => (
                <div key={benefit.title} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{benefit.title}</p>
                    <p className="text-xs text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 border-t-2 border-gray-200 pt-12">
          <h2 className="section-title mb-8">Descripción del Producto</h2>
          <div className="card-elevated p-8">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h3 className="font-bold text-xl mb-6 text-gray-900">Especificaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Pantalla', value: 'ProMotion OLED 6.1" 120Hz' },
                  { label: 'Procesador', value: 'Apple A16 Bionic' },
                  { label: 'Cámara', value: '48MP + 12MP + 12MP' },
                  { label: 'Batería', value: 'Li-Ion 3200 mAh' },
                  { label: 'Almacenamiento', value: '256GB' },
                  { label: 'SO', value: 'iOS 16 o superior' },
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">{spec.label}</span>
                    <span className="text-secondary font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="section-title mb-8">Reseñas ({product.reviews})</h2>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elevated p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">Usuario Verificado</h4>
                    <p className="text-sm text-gray-600">Compra verificada hace 2 semanas</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">Excelente producto, superó mis expectativas. Muy recomendado, llega rápido y bien empaquetado.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(ProductDetailComponent);
