'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CreditCard,
  Flame,
  Heart,
  Laptop,
  MessageCircle,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

const heroStats = [
  { label: 'Compradores activos', value: '+1.8M' },
  { label: 'Vendedores validados', value: '+140K' },
  { label: 'Mensajes por dia', value: '+32K' },
  { label: 'Tiempo de respuesta', value: '< 4 min' },
];

const categories = [
  { name: 'Tecnologia', icon: '💻', href: '/categories' },
  { name: 'Hogar', icon: '🏠', href: '/categories' },
  { name: 'Moda', icon: '👟', href: '/categories' },
  { name: 'Gaming', icon: '🎮', href: '/categories' },
  { name: 'Audio', icon: '🎧', href: '/categories' },
  { name: 'Movilidad', icon: '🚗', href: '/categories' },
];

const products = [
  {
    id: 1,
    name: 'Laptop Pro 14',
    price: 1299.99,
    rating: 4.8,
    reviews: 234,
    badge: 'Top ventas',
  },
  {
    id: 2,
    name: 'Smartphone X',
    price: 899.99,
    rating: 4.9,
    reviews: 512,
    badge: 'Nuevo',
  },
  {
    id: 3,
    name: 'Headphones Elite',
    price: 199.99,
    rating: 4.7,
    reviews: 89,
    badge: 'Flash',
  },
  {
    id: 4,
    name: 'Camera 4K',
    price: 1499.99,
    rating: 4.9,
    reviews: 156,
    badge: 'Profesional',
  },
];

const journey = [
  {
    icon: Search,
    title: 'Descubre productos reales',
    description: 'Catalogo curado por categoria, filtros inteligentes y resenas verificadas.',
  },
  {
    icon: MessageCircle,
    title: 'Negocia por chat',
    description: 'Habla directo con comprador o vendedor y guarda historial en la plataforma.',
  },
  {
    icon: CreditCard,
    title: 'Paga con seguridad',
    description: 'Pago protegido, trazabilidad y confirmacion antes de liberar fondos.',
  },
  {
    icon: Truck,
    title: 'Recibe y califica',
    description: 'Seguimiento de envio y sistema de reputacion para mantener confianza.',
  },
];

const trustPillars = [
  {
    icon: ShieldCheck,
    title: 'Proteccion integral',
    text: 'Cobertura de compra y prevencion de fraude.',
  },
  {
    icon: BadgeCheck,
    title: 'Perfiles validados',
    text: 'Usuarios con historial y reputacion transparente.',
  },
  {
    icon: Rocket,
    title: 'Rendimiento rapido',
    text: 'Experiencia fluida en desktop y mobile.',
  },
  {
    icon: Boxes,
    title: 'Escalable',
    text: 'Arquitectura lista para crecer con tu negocio.',
  },
];

export default function Home() {
  const marqueeGroups = [0, 1, 2, 3];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  return (
    <main className="bg-[#071425] pb-20">
      <section className="relative min-h-[72vh] overflow-hidden rounded-b-[2.8rem] bg-[#091424] text-white lg:min-h-[76vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,230,0,0.18),transparent_36%),radial-gradient(circle_at_82%_20%,rgba(37,99,235,0.24),transparent_40%),radial-gradient(circle_at_50%_95%,rgba(29,184,73,0.2),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,16,30,0.12),rgba(8,16,30,0.84))]" />

        <div className="absolute top-[-6rem] right-[-6rem] h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[-5rem] h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

        <div className="container relative z-10 mx-auto grid grid-cols-1 items-start gap-10 px-4 pt-8 pb-12 lg:grid-cols-2 lg:pt-12 lg:pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur"
            >
              <Sparkles size={15} className="text-primary" />
              Nuevo look del marketplace
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-6 text-4xl font-semibold leading-[1.02] md:text-6xl"
            >
              Vende mas rapido.
              <span className="block text-primary">Compra con mas confianza.</span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-6 max-w-xl text-base text-white/80 md:text-lg"
            >
              Un ecosistema pensado para mover productos, cerrar ventas por chat y sostener una
              experiencia premium de punta a punta.
            </motion.p>

            <motion.div variants={fadeUpVariants} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-gray-900 transition hover:brightness-105"
              >
                <ShoppingCart size={18} />
                Explorar ahora
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                <Store size={18} />
                Publicar producto
              </Link>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur"
                >
                  <p className="text-lg font-semibold text-primary">{item.value}</p>
                  <p className="text-xs text-white/70">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[500px]"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute -left-6 bottom-0 h-44 w-44 rounded-full bg-secondary/25 blur-3xl"
            />

            <div className="absolute inset-0 rounded-[2rem] border border-white/20 bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <div className="grid h-full grid-cols-6 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 }}
                  className="relative col-span-6 overflow-hidden rounded-2xl border border-white/15 bg-[#102036] p-5"
                >
                  <motion.div
                    animate={{ x: ['-120%', '140%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                    className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <p className="text-sm text-white/65">Panel comercial</p>
                  <p className="mt-1 text-2xl font-semibold">Ventas de la semana</p>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 1.2, delay: 0.7 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: [0, -5, 0] }}
                  transition={{ opacity: { duration: 0.45, delay: 0.35 }, y: { repeat: Infinity, duration: 4.2, ease: 'easeInOut' } }}
                  className="col-span-4 rounded-2xl border border-white/15 bg-[#0f1c30] p-5 shadow-[0_14px_30px_rgba(0,0,0,0.3)]"
                >
                  <p className="text-xs text-white/60">Producto lider</p>
                  <p className="mt-2 text-xl font-semibold">Laptop Pro 14&quot;</p>
                  <p className="mt-1 font-semibold text-primary">$1,299.99</p>
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} className="fill-primary" />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: [0, 6, 0] }}
                  transition={{ opacity: { duration: 0.45, delay: 0.45 }, y: { repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.2 } }}
                  className="col-span-2 rounded-2xl border border-white/15 bg-[#0f1c30] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.3)]"
                >
                  <p className="text-xs text-white/60">Chats</p>
                  <p className="mt-2 text-2xl font-semibold">+230</p>
                  <p className="text-xs text-emerald-300">hoy</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.55 }}
                  className="col-span-6 rounded-2xl border border-white/15 bg-[#0f1c30] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Actividad reciente</p>
                    <motion.div
                      animate={{ rotate: [0, 12, 0] }}
                      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                    >
                      <Flame size={16} className="text-primary" />
                    </motion.div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-white/80">
                    {[
                      'Andrea reservo Smartphone X',
                      'Lucas envio propuesta por chat',
                      'Sofia publico dos productos nuevos',
                    ].map((item, idx) => (
                      <motion.p
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.65 + idx * 0.12 }}
                      >
                        {item}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative space-y-0 bg-[radial-gradient(circle_at_30%_10%,rgba(37,99,235,0.18),transparent_35%),linear-gradient(180deg,#071425_0%,#0a1a2d_55%,#0f2139_100%)] pt-8 pb-20">
      <section className="container relative z-20 mx-auto px-4">
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d1c31]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <motion.div
              className="flex w-max items-center gap-3"
              animate={{ x: ['0%', '-25%'] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            >
              {marqueeGroups.map((groupIdx) => (
                <div key={groupIdx} className="flex shrink-0 items-center gap-3">
                  {categories.map((category, idx) => (
                    <Link
                      key={`${groupIdx}-${category.name}-${idx}`}
                      href={category.href}
                      className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 transition hover:-translate-y-0.5 hover:border-primary hover:bg-white/15 hover:text-white"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-16">
        <div className="grid gap-4 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="lg:col-span-7 rounded-3xl border border-white/15 bg-[#0f2139] p-8 text-white shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
          >
            <p className="text-sm text-primary">Coleccion destacada</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Tecnologia para crecer tu negocio</h2>
            <p className="mt-4 max-w-2xl text-white/75">
              Equipos, accesorios y herramientas con ofertas semanales para que compres mejor y
              vendas mas rapido.
            </p>
            <Link
              href="/deals"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-gray-900 transition hover:brightness-105"
            >
              Ver ofertas activas
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#122741] p-8 text-white shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
          >
            <h3 className="text-2xl font-semibold text-white">Vender nunca fue tan simple</h3>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-secondary" />
                Publica en menos de 3 minutos.
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-secondary" />
                Administra inventario en un solo panel.
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-secondary" />
                Responde mensajes y cierra ventas por chat.
              </li>
            </ul>
            <Link
              href="/sell"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              Empezar como vendedor
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Trending</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              Productos que estan llamando la atencion
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-dark"
          >
            Ver todo <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/products/${product.id}`}
                className="group block overflow-hidden rounded-2xl border border-white/15 bg-[#112641] shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-[0_22px_45px_rgba(0,0,0,0.45)]"
              >
                <div className="relative h-44 bg-[linear-gradient(130deg,#10233c,#163052,#1a3d63)]">
                  <div className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow">
                    {product.badge}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110">
                    📦
                  </div>
                  <button className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white shadow backdrop-blur">
                    <Heart size={16} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs">
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
                    <span className="text-white/60">{product.reviews} resenas</span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-white/45 line-through">${(product.price * 1.22).toFixed(2)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-3xl border border-white/15 bg-[#0f2139] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.35)] md:p-10">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Como funciona</p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Un flujo simple para comprar y vender
              </h2>
            </div>
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-dark"
            >
              Ver chat en vivo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journey.map(({ icon: Icon, title, description }, idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-white/10 bg-[#122845] p-5"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/70">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustPillars.map(({ icon: Icon, title, text }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/15 bg-[#122845] p-5 shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                <Icon size={18} />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f1f35] via-[#132a46] to-[#1b3a62] p-8 text-white md:p-12"
        >
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-secondary/30 blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Empieza hoy</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-5xl">Convierte visitas en ventas reales</h2>
              <p className="mt-4 max-w-xl text-white/80">
                Sube tus productos, responde en chat y aprovecha una plataforma diseniada para
                crecer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-gray-900 transition hover:brightness-105"
              >
                <Laptop size={18} />
                Publicar ahora
              </Link>
              <Link
                href="/messages"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                <MessageCircle size={18} />
                Abrir mensajes
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      </div>
    </main>
  );
}
