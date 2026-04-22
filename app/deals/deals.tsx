'use client';

import { Flame, Clock } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  timeLeft: string;
  soldCount: number;
  totalAvailable: number;
}

export default function Deals() {
  const deals: Deal[] = [
    {
      id: 1,
      name: 'iPhone 13 128GB',
      originalPrice: 799,
      discountedPrice: 599,
      discount: 25,
      image: '',
      timeLeft: '2 horas',
      soldCount: 234,
      totalAvailable: 500,
    },
    {
      id: 2,
      name: 'Samsung Galaxy S22',
      originalPrice: 899,
      discountedPrice: 649,
      discount: 28,
      image: '',
      timeLeft: '5 horas',
      soldCount: 187,
      totalAvailable: 300,
    },
    {
      id: 3,
      name: 'AirPods Pro',
      originalPrice: 249,
      discountedPrice: 179,
      discount: 28,
      image: '',
      timeLeft: '3 horas',
      soldCount: 456,
      totalAvailable: 600,
    },
    {
      id: 4,
      name: 'iPad Air 5',
      originalPrice: 599,
      discountedPrice: 449,
      discount: 25,
      image: '',
      timeLeft: '1 hora',
      soldCount: 89,
      totalAvailable: 200,
    },
    {
      id: 5,
      name: 'Laptop Dell XPS 13',
      originalPrice: 1299,
      discountedPrice: 999,
      discount: 23,
      image: '',
      timeLeft: '4 horas',
      soldCount: 45,
      totalAvailable: 100,
    },
    {
      id: 6,
      name: 'Sony WH1000XM4',
      originalPrice: 349,
      discountedPrice: 249,
      discount: 28,
      image: '',
      timeLeft: '6 horas',
      soldCount: 312,
      totalAvailable: 400,
    },
    {
      id: 7,
      name: 'Apple Watch Series 8',
      originalPrice: 399,
      discountedPrice: 299,
      discount: 25,
      image: '',
      timeLeft: '2.5 horas',
      soldCount: 178,
      totalAvailable: 250,
    },
    {
      id: 8,
      name: 'GoPro Hero 11',
      originalPrice: 499,
      discountedPrice: 349,
      discount: 30,
      image: '',
      timeLeft: '3 horas',
      soldCount: 98,
      totalAvailable: 150,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="text-red-500" size={32} />
          <h1 className="text-3xl font-bold">Ofertas Relámpago</h1>
        </div>
        <p className="text-gray-600">
          Descuentos increíbles por tiempo limitado. ¡No te los pierdas!
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-gray-700">
          <strong>💡 Consejo:</strong> Estas ofertas se actualizan cada hora.
          Suscríbete a notificaciones para no perderte tus productos favoritos.
        </p>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => {
          const progressPercent = (deal.soldCount / deal.totalAvailable) * 100;

          return (
            <Link key={deal.id} href={`/products/${deal.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden">
                {/* Image */}
                <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-400">Imagen {deal.id}</span>

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    -{deal.discount}%
                  </div>

                  {/* Time Left Badge */}
                  <div className="absolute bottom-3 left-3 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Clock size={12} />
                    {deal.timeLeft}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold mb-3 line-clamp-2 text-sm">
                    {deal.name}
                  </h3>

                  {/* Prices */}
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </p>
                    <p className="text-2xl font-bold text-red-600 mb-1">
                      ${deal.discountedPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      Ahorras ${(deal.originalPrice - deal.discountedPrice).toFixed(2)}
                    </p>
                  </div>

                  {/* Stock Indicator */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Vendidos</span>
                      <span>
                        {deal.soldCount}/{deal.totalAvailable}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-semibold text-sm">
                    Comprar Ahora
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Nunca más te pierdas una oferta</h2>
        <p className="mb-6 text-white/90">
          Habilita notificaciones para recibir alertas de tus ofertas favoritas
        </p>
        <button className="bg-white text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Habilitar Notificaciones
        </button>
      </div>
    </div>
  );
}
