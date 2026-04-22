'use client';

import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'iPhone 14 Pro', price: 999.99, quantity: 2, image: '' },
    { id: 2, name: 'Samsung Galaxy S23', price: 899.99, quantity: 1, image: '' },
    { id: 3, name: 'AirPods Pro', price: 249.99, quantity: 3, image: '' },
  ]);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="text-secondary" size={32} />
            <h1 className="text-4xl font-black text-gray-900">Mi Carrito</h1>
          </div>
          <p className="text-gray-600">{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="card-elevated text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-xl text-gray-600 mb-6">Tu carrito está vacío</p>
                <Link
                  href="/"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  Continuar comprando
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="card-elevated p-4 flex gap-4 group animate-fadeIn hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">📦</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-secondary transition-colors mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">Disponible: Stock ilimitado</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg w-fit p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 rounded hover:bg-white transition-colors hover:text-secondary"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-12 text-center border-0 bg-transparent font-semibold focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded hover:bg-white transition-colors hover:text-secondary"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Price and Delete */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-2xl font-black text-secondary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ${(item.price * 1.2 * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-accent hover:bg-accent/10 p-2 rounded-lg transition-all hover:scale-110"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="card-elevated p-6 sticky top-24">
                <h3 className="text-2xl font-black mb-6 text-gray-900">Resumen</h3>

                {/* Items Breakdown */}
                <div className="space-y-3 pb-4 border-b-2 border-gray-200 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Zap size={16} className="text-accent" />
                      Envío:
                    </span>
                    <span className={`font-bold text-lg ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? 'GRATIS ✓' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Impuestos (10%):</span>
                    <span className="font-bold text-lg">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-black text-secondary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {shipping === 0 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm font-semibold text-green-700">
                      ✓ ¡Envío gratis en tu compra!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button className="btn btn-primary w-full mb-3 flex items-center justify-center gap-2 text-lg">
                  <span>Proceder al Pago</span>
                  <ArrowRight size={20} />
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                  Continuar Comprando
                  <ArrowRight size={18} />
                </Link>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center border border-primary/20">
                  <p className="text-xs text-primary font-semibold">
                    🔒 Tu compra está 100% protegida
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Cart() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
