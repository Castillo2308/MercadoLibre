'use client';

/**
 * Navbar.tsx
 * 
 * Componente principal de navegación de la aplicación.
 * Incluye:
 * - Logo y links principales
 * - Mega menú de productos por categoría
 * - Barra de búsqueda
 * - Carrito de compras
 * - Opciones de usuario (perfil, logout)
 * - Menú responsive para dispositivos móviles
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  ShoppingCart,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useNavigationLoader } from './NavigationLoaderProvider';
import Logo from '@/Imagenes/Logo.png';

const mainLinks = [
  { href: '/explore', label: 'Explorar' },
  { href: '/deals', label: 'Ofertas' },
  { href: '/sell', label: 'Vender' },
];

const productMegaMenu = [
  {
    title: 'Tecnologia',
    items: [
      { icon: '💻', label: 'Laptops y PC', href: '/search?category=laptops-pc' },
      { icon: '📱', label: 'Celulares', href: '/search?category=celulares' },
      { icon: '🎮', label: 'Gaming', href: '/search?category=gaming' },
      { icon: '🎧', label: 'Audio', href: '/search?category=audio' },
    ],
  },
  {
    title: 'Hogar y estilo',
    items: [
      { icon: '🏠', label: 'Hogar', href: '/search?category=hogar' },
      { icon: '👟', label: 'Moda', href: '/search?category=moda' },
      { icon: '⌚', label: 'Accesorios', href: '/search?category=accesorios' },
      { icon: '🧴', label: 'Belleza', href: '/search?category=belleza' },
    ],
  },
  {
    title: 'Movilidad y deporte',
    items: [
      { icon: '🚗', label: 'Movilidad', href: '/search?category=movilidad' },
      { icon: '🚲', label: 'Ciclismo', href: '/search?category=ciclismo' },
      { icon: '🏋️', label: 'Fitness', href: '/search?category=fitness' },
      { icon: '⚽', label: 'Deportes', href: '/search?category=deportes' },
    ],
  },
];

function NavbarComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems, clearCart } = useShoppingCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { startLoading } = useNavigationLoader();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const cartCount = getTotalItems();

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = useCallback(() => {
    startLoading();
    logout();
    clearCart();
    router.push('/');
  }, [logout, clearCart, router, startLoading]);

  const submitSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) return;
    startLoading();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  }, [searchQuery, router, startLoading]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        submitSearch();
      }
    },
    [submitSearch]
  );

  const userInitial = useMemo(() => {
    if (!user?.firstName) return 'U';
    return user.firstName.charAt(0).toUpperCase();
  }, [user]);

  const navbarShellClasses =
    theme === 'light'
      ? 'border-b border-slate-200 bg-white/88 text-slate-900 shadow-[0_14px_36px_rgba(15,23,42,0.08)]'
      : 'border-b border-white/10 bg-[#071425]/90 text-white shadow-[0_10px_35px_rgba(0,0,0,0.25)]';

  return (
    <header className="sticky top-0 z-50">
      <div className={`${navbarShellClasses} relative overflow-visible backdrop-blur-xl`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.28, 0.5, 0.28], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-16 top-2 h-20 w-20 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.22, 0.42, 0.22], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-secondary/10 blur-3xl"
        />
        <div className="container mx-auto px-4">
          <div className="flex h-24 items-center justify-between gap-4">
            <div className="flex items-center gap-6 xl:gap-8">
              <Link href="/" className="group relative inline-flex items-center gap-4">
                <Image
                  src={Logo}
                  alt="Kivra"
                  height={128}
                  width={128}
                  className="h-32 w-32 relative object-cover transition-transform duration-500 group-hover:scale-[1.08] group-hover:rotate-[-1deg]"
                  priority
                />
                <div className="relative leading-tight">
                  <p className="font-outfit text-[2.35rem] font-extrabold tracking-[-0.08em] bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-[-0.1em] sm:text-[2.55rem]">
                    Kivra
                  </p>
                  <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-white/45 transition-colors duration-300 group-hover:text-primary/80">
                    Marketplace
                  </p>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 text-base font-medium text-white/85 lg:flex">
                <div
                  className="relative"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <motion.button
                    whileHover={{ y: -1, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2.5 font-outfit text-sm font-semibold tracking-[0.04em] text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    type="button"
                  >
                    Productos
                    <ChevronDown size={15} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {isProductsOpen && (
                      <div className="absolute left-1/2 top-full z-[70] mt-4 w-[min(96vw,1100px)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2">
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-[1.75rem] border border-white/15 bg-[#0b1b2f]/95 p-6 shadow-2xl"
                        >
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-9 grid grid-cols-3 gap-5">
                              {productMegaMenu.map((section) => (
                                <div key={section.title}>
                                  <p className="font-outfit text-sm font-semibold uppercase tracking-[0.24em] text-primary/90">
                                    {section.title}
                                  </p>
                                  <div className="mt-3 space-y-1">
                                    {section.items.map((item) => (
                                      <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                                      >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="col-span-3 rounded-2xl border border-white/15 bg-gradient-to-b from-secondary/20 to-primary/15 p-4">
                              <p className="font-outfit text-xs font-semibold uppercase tracking-[0.24em] text-primary">Destacado</p>
                              <p className="mt-2 text-lg font-semibold text-white">Tendencias de compra</p>
                              <p className="mt-1 text-xs leading-relaxed text-white/70">
                                Productos con mayor interes esta semana en la plataforma.
                              </p>

                              <div className="mt-4 space-y-2">
                                {[
                                  '⚡ Celulares premium',
                                  '🎧 Audio inalambrico',
                                  '🏠 Smart home',
                                  '🎮 Consolas y accesorios',
                                ].map((line) => (
                                  <div
                                    key={line}
                                    className="rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-white/85"
                                  >
                                    {line}
                                  </div>
                                ))}
                              </div>

                              <Link
                                href="/categories"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#071425] transition hover:scale-[1.02] hover:brightness-95"
                              >
                                Ver todo
                                <ChevronDown size={14} className="-rotate-90" />
                              </Link>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <Link href="/messages" className="group rounded-2xl border border-secondary/30 bg-gradient-to-r from-secondary/20 to-primary/20 p-4 transition hover:-translate-y-0.5 hover:brightness-110">
                            <p className="font-outfit text-sm font-semibold text-white transition group-hover:text-primary">Mensajería real</p>
                            <p className="mt-1 text-xs leading-relaxed text-white/70">Chat persistente integrado con base de datos.</p>
                          </Link>
                          <Link href="/sell" className="group rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/20 to-secondary/20 p-4 transition hover:-translate-y-0.5 hover:brightness-110">
                            <p className="font-outfit text-sm font-semibold text-white transition group-hover:text-primary">Centro de vendedor</p>
                            <p className="mt-1 text-xs leading-relaxed text-white/70">Publica productos y gestiona tu inventario.</p>
                          </Link>
                        </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {mainLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative rounded-full px-4 py-2 font-outfit text-sm font-semibold tracking-[0.04em] text-white/78 transition hover:-translate-y-0.5 hover:text-white"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex flex-1 max-w-md items-center gap-3 mx-4">
              <motion.div
                animate={{ width: isSearchOpen ? 336 : 52 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="relative h-12 overflow-hidden rounded-full border border-white/15 bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
              >
                {!isSearchOpen ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="flex h-full w-full items-center justify-center text-white/85 transition hover:text-white"
                    aria-label="Abrir buscador"
                  >
                    <Search size={17} />
                    <span className="sr-only">Abrir buscador</span>
                  </motion.button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitSearch();
                    }}
                    className="flex h-full items-center gap-2 px-3"
                  >
                    <Search size={16} className="shrink-0 text-white/60" />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar productos"
                      className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-semibold text-[#071425] transition hover:scale-[1.03] hover:brightness-110"
                    >
                      Buscar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                      aria-label="Cerrar buscador"
                    >
                      <X size={14} />
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-white">
              <motion.button
                whileHover={{ y: -1, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={toggleTheme}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.button>

              {isAuthenticated ? (
                <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/profile"
                  className="relative mr-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-primary to-secondary font-bold text-[#071425] shadow-[0_8px_20px_rgba(29,184,73,0.35)]"
                  aria-label="Mi perfil"
                >
                  {userInitial}
                </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/auth/login"
                  className="relative mr-1 flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-primary transition hover:bg-primary/30"
                  aria-label="Ir a perfil"
                >
                  <User size={18} />
                </Link>
                </motion.div>
              )}

              <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/favorites" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20" aria-label="Favoritos">
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-[#071425]">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </Link>
              </motion.div>

              <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/messages" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20" aria-label="Mensajes">
                <MessageSquare size={18} />
              </Link>
              </motion.div>

              <motion.div whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/cart" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20" aria-label="Carrito">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              </motion.div>

              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ y: -1, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleLogout}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-red-500/20"
                    aria-label="Cerrar sesion"
                  >
                    <LogOut size={18} />
                  </motion.button>
                </>
              ) : (
                <Link href="/auth/login" className="ml-2 inline-flex items-center gap-2 rounded-full border border-primary/45 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] px-6 py-3 font-outfit text-sm font-semibold tracking-[0.05em] text-[#052012] shadow-[0_12px_28px_rgba(29,184,73,0.45)] ring-1 ring-primary/30 backdrop-blur transition hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_16px_34px_rgba(29,184,73,0.55)]">
                  <Sparkles size={14} />
                  Comienza gratis
                </Link>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white md:hidden"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir menu"
              type="button"
            >
              <motion.span
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0, scale: isMobileMenuOpen ? 0.9 : 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </motion.button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="md:hidden pb-4"
              >
                <div className="rounded-[1.75rem] border border-white/15 bg-[#0b1b2f]/95 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
                  <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-3 py-2">
                    <div>
                      <p className="font-outfit text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Apariencia</p>
                      <p className="font-outfit text-sm font-semibold text-white">{theme === 'light' ? 'Modo claro' : 'Modo oscuro'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                      aria-label="Cambiar tema"
                    >
                      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5">
                    <Search size={16} className="text-white/70" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Buscar..."
                      className="w-full bg-transparent font-outfit text-sm text-white placeholder:text-white/60 focus:outline-none"
                    />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    <Link href="/categories" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Categorías</Link>
                    <Link href="/deals" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Ofertas</Link>
                    <Link href="/sell" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Vender</Link>
                    <Link href="/favorites" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Favoritos</Link>
                    <Link href="/messages" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Mensajes</Link>
                    <Link href="/cart" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Carrito</Link>
                    <Link href="/profile" className="rounded-2xl border border-white/10 px-3 py-2.5 font-outfit transition hover:-translate-y-0.5 hover:bg-white/10">Perfil</Link>
                  </div>

                  <div className="mt-4 border-t border-white/15 pt-3">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-2xl border border-red-400/30 bg-red-500/20 px-3 py-2.5 font-outfit text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
                      >
                        Cerrar sesion
                      </button>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-3 py-2.5 font-outfit text-sm font-semibold text-[#071425] transition hover:scale-[1.01]"
                      >
                        Iniciar sesion
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default memo(NavbarComponent);
