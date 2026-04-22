'use client';

import {
  Smartphone,
  Laptop,
  Shirt,
  Home,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Music,
  Camera,
  Watch,
  Utensils,
  Car,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  productCount: number;
}

export default function Categories() {
  const categories: Category[] = [
    {
      id: 'electronics',
      name: 'Electrónica',
      icon: Smartphone,
      description: 'Teléfonos, computadoras y accesorios',
      productCount: 15234,
    },
    {
      id: 'computers',
      name: 'Computadoras',
      icon: Laptop,
      description: 'Laptops, desktops y componentes',
      productCount: 8945,
    },
    {
      id: 'clothing',
      name: 'Ropa y Calzado',
      icon: Shirt,
      description: 'Prendas de moda para toda la familia',
      productCount: 42156,
    },
    {
      id: 'home',
      name: 'Hogar',
      icon: Home,
      description: 'Muebles y decoración para tu hogar',
      productCount: 23845,
    },
    {
      id: 'books',
      name: 'Libros',
      icon: BookOpen,
      description: 'Libros nuevos y usados',
      productCount: 18234,
    },
    {
      id: 'sports',
      name: 'Deportes',
      icon: Dumbbell,
      description: 'Equipamiento y ropa deportiva',
      productCount: 12543,
    },
    {
      id: 'gaming',
      name: 'Videojuegos',
      icon: Gamepad2,
      description: 'Juegos y consolas',
      productCount: 9876,
    },
    {
      id: 'audio',
      name: 'Audio y Música',
      icon: Music,
      description: 'Auriculares, parlantes y equipos',
      productCount: 7234,
    },
    {
      id: 'photography',
      name: 'Fotografía',
      icon: Camera,
      description: 'Cámaras y accesorios',
      productCount: 5432,
    },
    {
      id: 'watches',
      name: 'Relojes',
      icon: Watch,
      description: 'Relojes y accesorios',
      productCount: 6789,
    },
    {
      id: 'kitchen',
      name: 'Cocina',
      icon: Utensils,
      description: 'Electrodomésticos y utensilios',
      productCount: 11234,
    },
    {
      id: 'automotive',
      name: 'Automoción',
      icon: Car,
      description: 'Accesorios y repuestos para vehículos',
      productCount: 8765,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-black text-gray-900 mb-3">Categorías</h1>
          <p className="text-lg text-gray-600">
            Explora nuestras categorías y descubre miles de productos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={`/search?category=${category.id}`}>
                <div 
                  className="card-elevated group h-full p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fadeIn cursor-pointer"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-secondary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
                    {category.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 group-hover:border-secondary transition-colors">
                    <p className="text-xs font-semibold text-gray-500">
                      {category.productCount.toLocaleString()} artículos
                    </p>
                    <span className="text-secondary font-black text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Spotlight */}
        <div className="card-elevated overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-12 text-white text-center">
            <h2 className="text-4xl font-black mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Utiliza nuestra búsqueda avanzada con filtros inteligentes para encontrar exactamente lo que necesitas
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/search"
                className="btn bg-white text-secondary hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-all hover:scale-105"
              >
                Búsqueda Avanzada
              </Link>
              <button className="btn border-2 border-white text-white hover:bg-white/20 font-bold px-8 py-3 rounded-lg transition-all hover:scale-105">
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
