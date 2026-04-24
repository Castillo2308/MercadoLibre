'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useWishlist } from '@/hooks/useWishlist';

const mainLinks = [
  { href: '/categories', label: 'Explorar' },
  { href: '/deals', label: 'Ofertas' },
  { href: '/sell', label: 'Vender' },
  { href: '/profile', label: 'Mi cuenta' },
];

const productMegaMenu = [
  {
    title: 'Tecnologia',
    items: [
      { icon: '💻', label: 'Laptops y PC', href: '/categories' },
      { icon: '📱', label: 'Celulares', href: '/categories' },
      { icon: '🎮', label: 'Gaming', href: '/categories' },
      { icon: '🎧', label: 'Audio', href: '/categories' },
    ],
  },
  {
    title: 'Hogar y estilo',
    items: [
      { icon: '🏠', label: 'Hogar', href: '/categories' },
      { icon: '👟', label: 'Moda', href: '/categories' },
      { icon: '⌚', label: 'Accesorios', href: '/categories' },
      { icon: '🧴', label: 'Belleza', href: '/categories' },
    ],
  },
  {
    title: 'Movilidad y deporte',
    items: [
      { icon: '🚗', label: 'Movilidad', href: '/categories' },
      { icon: '🚲', label: 'Ciclismo', href: '/categories' },
      { icon: '🏋️', label: 'Fitness', href: '/categories' },
      { icon: '⚽', label: 'Deportes', href: '/categories' },
    ],
  },
];

function NavbarComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useShoppingCart();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getTotalItems());
  }, [getTotalItems]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const submitSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
  }, [searchQuery, router]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        submitSearch();
      }
    },
    [submitSearch]
  );

  const userInitial = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-[#071425]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="container mx-auto px-4">
          <div className="h-24 flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="group inline-flex items-center gap-2 text-white">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-[#071425]">
                  M
                </div>
                <div className="leading-tight">
                  <p className="text-[1.35rem] font-semibold tracking-tight">MercadoLibre</p>
                  <p className="text-xs text-white/60 group-hover:text-primary transition">Marketplace modernizado</p>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1 text-base font-medium text-white/85">
                <Link href="/" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition">
                  Inicio
                </Link>

                <div
                  className="relative"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <button
                    className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition inline-flex items-center gap-1"
                    type="button"
                  >
                    Productos
                    <ChevronDown size={15} className={`transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 top-[120%] w-[min(92vw,1100px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#0b1b2f]/95 p-6 shadow-2xl"
                      >
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-9 grid grid-cols-3 gap-5">
                              {productMegaMenu.map((section) => (
                                <div key={section.title}>
                                  <p className="text-sm font-semibold uppercase tracking-wide text-primary/90">
                                    {section.title}
                                  </p>
                                  <div className="mt-3 space-y-1">
                                    {section.items.map((item) => (
                                      <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                                      >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="col-span-3 rounded-xl border border-white/15 bg-gradient-to-b from-secondary/20 to-primary/15 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Destacado</p>
                              <p className="mt-2 text-lg font-semibold text-white">Tendencias de compra</p>
                              <p className="mt-1 text-xs text-white/70">
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
                                    className="rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-xs text-white/85"
                                  >
                                    {line}
                                  </div>
                                ))}
                              </div>

                              <Link
                                href="/categories"
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#071425] hover:brightness-95 transition"
                              >
                                Ver todo
                                <ChevronDown size={14} className="-rotate-90" />
                              </Link>
                            </div>
                        </div>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                          <Link href="/messages" className="rounded-xl bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 p-4 hover:brightness-110 transition">
                            <p className="text-white font-semibold">Mensajeria real</p>
                            <p className="text-xs text-white/70 mt-1">Chat persistente integrado con base de datos.</p>
                          </Link>
                          <Link href="/sell" className="rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 p-4 hover:brightness-110 transition">
                            <p className="text-white font-semibold">Centro de vendedor</p>
                            <p className="text-xs text-white/70 mt-1">Publica productos y gestiona tu inventario.</p>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {mainLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar productos, marcas y mas..."
                  className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
              <button
                type="button"
                onClick={submitSearch}
                className="rounded-full bg-primary p-3 text-[#071425] hover:brightness-105 transition"
                aria-label="Buscar"
              >
                <Search size={16} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-white">
              <Link href="/favorites" className="relative h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition" aria-label="Favoritos">
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-[10px] font-bold text-[#071425] flex items-center justify-center">
                    {wishlist.length > 9 ? '9+' : wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/messages" className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition" aria-label="Mensajes">
                <MessageSquare size={18} />
              </Link>

              <Link href="/cart" className="relative h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition" aria-label="Carrito">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="ml-1 h-11 w-11 rounded-full bg-gradient-to-br from-primary to-secondary text-[#071425] font-bold flex items-center justify-center">
                    {userInitial}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-red-500/20 transition"
                    aria-label="Cerrar sesion"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="ml-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#071425] hover:brightness-95 transition">
                  <Sparkles size={14} />
                  Comienza gratis
                </Link>
              )}
            </div>

            <button
              className="md:hidden h-10 w-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir menu"
              type="button"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
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
                <div className="rounded-2xl border border-white/15 bg-[#0b1b2f]/95 p-4 text-white">
                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 border border-white/15">
                    <Search size={16} className="text-white/70" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Buscar..."
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                    />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    <Link href="/" className="rounded-lg px-3 py-2 hover:bg-white/10">Inicio</Link>
                    <Link href="/categories" className="rounded-lg px-3 py-2 hover:bg-white/10">Categorias</Link>
                    <Link href="/deals" className="rounded-lg px-3 py-2 hover:bg-white/10">Ofertas</Link>
                    <Link href="/sell" className="rounded-lg px-3 py-2 hover:bg-white/10">Vender</Link>
                    <Link href="/favorites" className="rounded-lg px-3 py-2 hover:bg-white/10">Favoritos</Link>
                    <Link href="/messages" className="rounded-lg px-3 py-2 hover:bg-white/10">Mensajes</Link>
                    <Link href="/cart" className="rounded-lg px-3 py-2 hover:bg-white/10">Carrito</Link>
                    <Link href="/profile" className="rounded-lg px-3 py-2 hover:bg-white/10">Perfil</Link>
                  </div>

                  <div className="mt-4 border-t border-white/15 pt-3">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-red-500/20 border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-200"
                      >
                        Cerrar sesion
                      </button>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="w-full inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#071425]"
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
