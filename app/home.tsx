'use client';

/**
 * home.tsx
 * 
 * Página de inicio/home del marketplace Kivra.
 * Muestra:
 * - Hero section con CTA principal
 * - Características principales del sitio
 * - Productos destacados
 * - Sección de ofertas
 * - Galería de categorías
 * - Llamadas a la acción
 */

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
import { useEffect, useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { useLanguage } from '@/context/LanguageContext';
import { SmartImage } from '@/components/ui/smart-image';
import { formatCRC } from '@/lib/utils';

interface TrendingProduct {
  id: string;
  title: string;
  price: string | number;
  averageRating: number;
  reviewCount: number;
  images: { imageUrl: string }[];
  mainImageUrl: string | null;
}

const TRENDING_BADGE_KEYS = ['home.badge.topSales', 'home.badge.new', 'home.badge.featured', 'home.badge.popular'] as const;

const heroStatKeys = [
  { labelKey: 'home.stat.buyers', value: '+1.8M' },
  { labelKey: 'home.stat.sellers', value: '+140K' },
  { labelKey: 'home.stat.messages', value: '+32K' },
  { labelKey: 'home.stat.responseTime', value: '< 4 min' },
] as const;

const categoryKeys = [
  { nameKey: 'home.category.tech', icon: '💻', href: '/categories' },
  { nameKey: 'home.category.home', icon: '🏠', href: '/categories' },
  { nameKey: 'home.category.fashion', icon: '👟', href: '/categories' },
  { nameKey: 'home.category.gaming', icon: '🎮', href: '/categories' },
  { nameKey: 'home.category.audio', icon: '🎧', href: '/categories' },
  { nameKey: 'home.category.mobility', icon: '🚗', href: '/categories' },
] as const;

const journeyKeys = [
  { icon: Search, titleKey: 'home.journey1Title', descriptionKey: 'home.journey1Text' },
  { icon: MessageCircle, titleKey: 'home.journey2Title', descriptionKey: 'home.journey2Text' },
  { icon: CreditCard, titleKey: 'home.journey3Title', descriptionKey: 'home.journey3Text' },
  { icon: Truck, titleKey: 'home.journey4Title', descriptionKey: 'home.journey4Text' },
] as const;

const trustPillarKeys = [
  { icon: ShieldCheck, titleKey: 'home.trust1Title', textKey: 'home.trust1Text' },
  { icon: BadgeCheck, titleKey: 'home.trust2Title', textKey: 'home.trust2Text' },
  { icon: Rocket, titleKey: 'home.trust3Title', textKey: 'home.trust3Text' },
  { icon: Boxes, titleKey: 'home.trust4Title', textKey: 'home.trust4Text' },
] as const;

export default function Home() {
  const marqueeGroups = [0, 1, 2, 3];
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/products?take=4')
      .then((res) => res.json())
      .then((data: TrendingProduct[]) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  const TRENDING_BADGES = TRENDING_BADGE_KEYS.map((key) => t(key));
  const heroStats = heroStatKeys.map((item) => ({ label: t(item.labelKey), value: item.value }));
  const categories = categoryKeys.map((item) => ({ name: t(item.nameKey), icon: item.icon, href: item.href }));
  const journey = journeyKeys.map((item) => ({ icon: item.icon, title: t(item.titleKey), description: t(item.descriptionKey) }));
  const trustPillars = trustPillarKeys.map((item) => ({ icon: item.icon, title: t(item.titleKey), text: t(item.textKey) }));

  return (
    <main className="bg-[#071425] pb-20">
      <section className="relative min-h-[72vh] overflow-hidden rounded-b-[2.8rem] bg-[#091424] text-white lg:min-h-[76vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,230,0,0.18),transparent_36%),radial-gradient(circle_at_82%_20%,rgba(37,99,235,0.24),transparent_40%),radial-gradient(circle_at_50%_95%,rgba(29,184,73,0.2),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,16,30,0.12),rgba(8,16,30,0.84))] hidden dark:block" />

        <div className="absolute top-[-6rem] right-[-6rem] h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[-5rem] h-72 w-72 rounded-full bg-blue-400/25 dark:bg-secondary/25 blur-3xl" />

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
              {t('home.badge')}
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-6 text-4xl font-semibold leading-[1.02] md:text-6xl"
            >
              {t('home.heroTitle1')}
              <span className="block text-primary">{t('home.heroTitle2')}</span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-6 max-w-xl text-base text-white/80 md:text-lg"
            >
              {t('home.heroSubtitle')}
            </motion.p>

            <motion.div variants={fadeUpVariants} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-gray-900 transition hover:brightness-105"
              >
                <ShoppingCart size={18} />
                {t('home.exploreCta')}
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                <Store size={18} />
                {t('home.sellCta')}
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
              className="absolute -left-6 bottom-0 h-44 w-44 rounded-full bg-blue-400/25 dark:bg-secondary/25 blur-3xl"
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
                  <p className="text-sm text-white/65">{t('home.mock.panel')}</p>
                  <p className="mt-1 text-2xl font-semibold">{t('home.mock.weekSales')}</p>
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
                  <p className="text-xs text-white/60">{t('home.mock.leadProduct')}</p>
                  <p className="mt-2 text-xl font-semibold">{t('home.mock.productName')}</p>
                  <p className="mt-1 font-semibold text-primary">{formatCRC(676000)}</p>
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
                  <p className="text-xs text-white/60">{t('home.mock.chats')}</p>
                  <p className="mt-2 text-2xl font-semibold">+230</p>
                  <p className="text-xs text-emerald-300">{t('home.mock.today')}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.55 }}
                  className="col-span-6 rounded-2xl border border-white/15 bg-[#0f1c30] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">{t('home.mock.recentActivity')}</p>
                    <motion.div
                      animate={{ rotate: [0, 12, 0] }}
                      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                    >
                      <Flame size={16} className="text-primary" />
                    </motion.div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-white/80">
                    {[
                      t('home.mock.activity1'),
                      t('home.mock.activity2'),
                      t('home.mock.activity3'),
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

      <div className="relative space-y-0 pt-8 pb-20 dark:bg-[radial-gradient(circle_at_30%_10%,rgba(37,99,235,0.18),transparent_35%),linear-gradient(180deg,#071425_0%,#0a1a2d_55%,#0f2139_100%)]">
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
            <p className="text-sm text-primary">{t('home.featuredLabel')}</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">{t('home.featuredTitle')}</h2>
            <p className="mt-4 max-w-2xl text-white/75">
              {t('home.featuredText')}
            </p>
            <Link
              href="/deals"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-gray-900 transition hover:brightness-105"
            >
              {t('home.featuredCta')}
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
            <h3 className="text-2xl font-semibold text-white">{t('home.sellSimpleTitle')}</h3>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-secondary" />
                {t('home.sellPoint1')}
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-secondary" />
                {t('home.sellPoint2')}
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-secondary" />
                {t('home.sellPoint3')}
              </li>
            </ul>
            <Link
              href="/sell"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              {t('home.sellSimpleCta')}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{t('home.trendingLabel')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              {t('home.trendingTitle')}
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-dark"
          >
            {t('home.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, idx) => {
            const price = Number(product.price);
            const image = product.images?.[0]?.imageUrl || product.mainImageUrl;
            return (
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
                  <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-[linear-gradient(130deg,#10233c,#163052,#1a3d63)]">
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow">
                      {TRENDING_BADGES[idx % TRENDING_BADGES.length]}
                    </div>
                    {image ? (
                      <SmartImage
                        src={image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110">
                        📦
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id, product.title);
                      }}
                      className="absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white shadow backdrop-blur"
                    >
                      <Heart size={16} className={isInWishlist(product.id) ? 'fill-red-400 text-red-400' : ''} />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-primary">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.round(product.averageRating)
                              ? 'fill-primary text-primary'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="text-white/60">{product.reviewCount} {t('home.reviews')}</span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-white">{formatCRC(price)}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-3xl border border-white/15 bg-[#0f2139] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.35)] md:p-10">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{t('home.howItWorksLabel')}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                {t('home.howItWorksTitle')}
              </h2>
            </div>
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-dark"
            >
              {t('home.liveChatCta')} <ArrowRight size={16} />
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
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-400/30 dark:bg-secondary/30 blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('home.finalCtaLabel')}</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-5xl">{t('home.finalCtaTitle')}</h2>
              <p className="mt-4 max-w-xl text-white/80">
                {t('home.finalCtaText')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-gray-900 transition hover:brightness-105"
              >
                <Laptop size={18} />
                {t('home.finalCtaPublish')}
              </Link>
              <Link
                href="/messages"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                <MessageCircle size={18} />
                {t('home.finalCtaMessages')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      </div>
    </main>
  );
}
