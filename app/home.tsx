'use client';

import { Heart, ShoppingCart, Zap, Shield, Truck, Star } from 'lucide-react';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, rating: 4.8, reviews: 234 },
  { id: 2, name: 'Smartphone X', price: 899.99, rating: 4.9, reviews: 512 },
  { id: 3, name: 'Headphones Elite', price: 199.99, rating: 4.7, reviews: 89 },
  { id: 4, name: 'Camera 4K', price: 1499.99, rating: 4.9, reviews: 156 },
  { id: 5, name: 'Tablet Max', price: 699.99, rating: 4.6, reviews: 234 },
  { id: 6, name: 'Smart Watch', price: 399.99, rating: 4.8, reviews: 456 },
  { id: 7, name: 'Speaker Pro', price: 299.99, rating: 4.7, reviews: 123 },
  { id: 8, name: 'Gaming Console', price: 499.99, rating: 5.0, reviews: 789 },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-16 bg-gradient-to-r from-primary via-primary to-primary-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div>
              <h1 
                className="text-5xl md:text-6xl font-black mb-6 leading-tight text-white"
              >
                Compra y Vende
                <br />
                <span className="text-white">con Confianza</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                La plataforma más grande de América Latina para comprar y vender online. Millones de productos, ofertas increíbles y la mejor experiencia de compra.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/categories" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Explorar Productos
                </Link>
                <Link href="/sell" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <Zap size={20} />
                  Comenzar a Vender
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🛒', label: '1M+ Productos' },
                  { icon: '⭐', label: 'Confiable' },
                  { icon: '🚚', label: 'Envío Rápido' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative h-96 md:h-[500px]">
              <div className="relative h-full flex items-center justify-center">
                <div className="text-8xl animate-bounce">🛍️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">¿Por qué Elegir MercadoLibre?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: Shield, title: 'Comprador Protegido', desc: 'Tu dinero está protegido hasta que recibas tu compra' },
              { Icon: Truck, title: 'Envíos Confiables', desc: 'Llega a tu puerta de forma segura y rápida' },
              { Icon: Zap, title: 'Pagos Seguros', desc: 'Múltiples opciones de pago disponibles' },
            ].map(({ Icon, title, desc }, idx) => (
              <div
                key={title}
                className="card hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title text-gray-900">🔥 Productos Destacados</h2>
            <Link href="/categories" className="text-primary font-semibold hover:text-primary-dark transition-colors flex items-center gap-2">
              Ver Todos <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="card-elevated group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-300">📦</div>
                  </div>
                  <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                    -20%
                  </div>
                  <button className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                    <Heart size={18} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-black text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 line-through">
                      ${(product.price * 1.25).toFixed(2)}
                    </p>
                  </div>

                  {/* Shipping */}
                  <div className="mb-4 p-2 bg-primary/10 rounded text-xs text-primary font-semibold">
                    📦 Envío Gratis
                  </div>

                  {/* Button */}
                  <button className="btn btn-primary w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-white hover:bg-primary-dark">
                    Ver Detalles
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl mx-4 mb-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">¿Tienes Productos para Vender?</h2>
          <p className="text-lg mb-8 text-white/90">
            Únete a millones de vendedores que ganan dinero todos los días
          </p>
          <Link href="/sell" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
            Registra tu Producto Ahora
          </Link>
        </div>
      </section>
    </main>
  );
}
