'use client';

import { motion } from 'framer-motion';
import { Smartphone, Laptop, Shirt, Home, BookOpen, Dumbbell, Gamepad2, Music, Camera, Watch, Utensils, Car, ArrowRight, Sparkles, Video as LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  productCount: number;
  gradient: string;
}

export default function Categories() {
  const categories: Category[] = [
    { id: 'electronics', name: 'Electronica', icon: Smartphone, description: 'Telefonos, computadoras y accesorios', productCount: 15234, gradient: 'from-blue-500/30 to-cyan-500/10' },
    { id: 'computers', name: 'Computadoras', icon: Laptop, description: 'Laptops, desktops y componentes', productCount: 8945, gradient: 'from-emerald-500/30 to-teal-500/10' },
    { id: 'clothing', name: 'Ropa y Calzado', icon: Shirt, description: 'Prendas de moda para toda la familia', productCount: 42156, gradient: 'from-pink-500/30 to-rose-500/10' },
    { id: 'home', name: 'Hogar', icon: Home, description: 'Muebles y decoracion para tu hogar', productCount: 23845, gradient: 'from-amber-500/30 to-yellow-500/10' },
    { id: 'books', name: 'Libros', icon: BookOpen, description: 'Libros nuevos y usados de toda clase', productCount: 18234, gradient: 'from-green-500/30 to-lime-500/10' },
    { id: 'sports', name: 'Deportes', icon: Dumbbell, description: 'Equipamiento y ropa deportiva', productCount: 12543, gradient: 'from-orange-500/30 to-red-500/10' },
    { id: 'gaming', name: 'Videojuegos', icon: Gamepad2, description: 'Juegos, consolas y accesorios', productCount: 9876, gradient: 'from-cyan-500/30 to-blue-500/10' },
    { id: 'audio', name: 'Audio y Musica', icon: Music, description: 'Auriculares, parlantes y equipos', productCount: 7234, gradient: 'from-fuchsia-500/30 to-pink-500/10' },
    { id: 'photography', name: 'Fotografia', icon: Camera, description: 'Camaras y accesorios profesionales', productCount: 5432, gradient: 'from-teal-500/30 to-cyan-500/10' },
    { id: 'watches', name: 'Relojes', icon: Watch, description: 'Relojes premium y accesorios', productCount: 6789, gradient: 'from-yellow-500/30 to-amber-500/10' },
    { id: 'kitchen', name: 'Cocina', icon: Utensils, description: 'Electrodomesticos y utensilios', productCount: 11234, gradient: 'from-lime-500/30 to-green-500/10' },
    { id: 'automotive', name: 'Automocion', icon: Car, description: 'Accesorios y repuestos para vehiculos', productCount: 8765, gradient: 'from-red-500/30 to-orange-500/10' },
  ];

  return (
    <main className="min-h-screen bg-[#071425]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(29,184,73,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.18),transparent_45%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur mb-6">
              <Sparkles size={14} className="text-primary" />
              Mas de 170,000 productos disponibles
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
              Explorar por
              <span className="block text-primary">Categorias</span>
            </h1>
            <p className="text-white/55 text-xl max-w-2xl">
              Encuentra exactamente lo que buscas entre nuestras categorias con miles de productos verificados.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link href={`/search?category=${category.id}`}>
                  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${category.gradient} p-6 h-full cursor-pointer group bg-[#0d1c31]`}>
                    <div className="absolute inset-0 bg-[#0d1c31]/60 group-hover:bg-[#0d1c31]/40 transition-all duration-300" />

                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
                        <Icon size={26} className="text-white group-hover:text-primary transition-colors" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-white/50 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <p className="text-xs font-medium text-white/35">
                          {category.productCount.toLocaleString()} articulos
                        </p>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300"
                        >
                          <ArrowRight size={14} className="text-white/60 group-hover:text-[#071425] transition-colors" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/5 blur-2xl group-hover:bg-primary/15 transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { value: '170K+', label: 'Productos activos' },
            { value: '12', label: 'Categorias' },
            { value: '98%', label: 'Satisfaccion' },
            { value: '24h', label: 'Soporte' },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-[#0d1c31] p-5 text-center">
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0f2139] via-[#132a46] to-[#1b3a62] p-10 md:p-14 text-center"
        >
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              No encuentras lo que buscas?
            </h2>
            <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
              Usa nuestra busqueda avanzada con filtros inteligentes para encontrar exactamente lo que necesitas.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-[#071425] transition hover:brightness-105">
                Busqueda Avanzada <ArrowRight size={18} />
              </Link>
              <Link href="/messages" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-8 py-3 font-semibold text-white transition hover:bg-white/20">
                Contactar Soporte
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
