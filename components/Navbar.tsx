'use client';

import Link from 'next/link';
import { ShoppingCart, MessageSquare, Heart, Search, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';

function NavbarComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleSearch = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const handleSearchClick = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-dark shadow-lg">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4 gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
          >
            <div className="relative">
              <h1 className="text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300">
                MercadoLibre
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-secondary group-hover:w-full transition-all duration-300 rounded-full"></div>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-6 max-w-2xl">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="¿Qué buscas hoy?"
                className="w-full px-5 py-3 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-300 shadow-md"
              />
            <button 
              onClick={handleSearchClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-primary p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
            >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right Icons - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/favorites" 
              className="flex items-center gap-2 text-white hover:text-white/80 font-bold text-base group transition-all duration-300 relative"
            >
              <Heart size={24} className="group-hover:scale-125 transition-transform duration-300" />
              <span className="hidden lg:inline">Favoritos</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              href="/messages" 
              className="flex items-center gap-2 text-white hover:text-white/80 font-bold text-base group transition-all duration-300"
            >
              <MessageSquare size={24} className="group-hover:scale-125 transition-transform duration-300" />
              <span className="hidden lg:inline">Mensajes</span>
            </Link>
            <Link 
              href="/cart" 
              className="flex items-center gap-2 text-white hover:text-white/80 font-bold text-base group transition-all duration-300 relative"
            >
              <ShoppingCart size={24} className="group-hover:scale-125 transition-transform duration-300" />
              <span className="hidden lg:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-white hover:text-white/80 font-bold text-base group transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center font-black group-hover:scale-125 transition-transform duration-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
              </div>
              <span className="hidden lg:inline">{user?.name || 'Mi Cuenta'}</span>
            </Link>
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white hover:text-white/80 font-bold text-base group transition-all duration-300"
              >
                <LogOut size={24} className="group-hover:scale-125 transition-transform duration-300" />
                <span className="hidden lg:inline">Salir</span>
              </button>
            )}
            
            {!isAuthenticated && (
              <Link
                href="/auth/login"
                className="bg-white text-primary px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 text-base"
              >
                Inicia Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:scale-110 transition-transform duration-300"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Search bar - Mobile */}
        <div className="md:hidden mb-4">
          <div className="relative w-full group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué buscas?"
              className="w-full px-4 py-2 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full hover:scale-110 transition-transform">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Bottom navbar - Categories - Desktop */}
        <div className="hidden md:flex gap-8 overflow-x-auto pb-2 text-white text-base font-bold">
          {[
            { href: '/categories', label: 'Categorías' },
            { href: '/deals', label: '🔥 Ofertas' },
            { href: '/sell', label: 'Vender' },
            { href: '/profile', label: 'Mis Compras' },
            { href: '/profile', label: 'Mis Ventas' },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="hover:text-white/80 whitespace-nowrap relative group transition-colors duration-300"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-primary-dark animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link href="/categories" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">Categorías</Link>
            <Link href="/deals" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">🔥 Ofertas</Link>
            <Link href="/sell" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">Vender</Link>
            <Link href="/favorites" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">Favoritos</Link>
            <Link href="/messages" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">Mensajes</Link>
            <Link href="/cart" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">Carrito</Link>
            <Link href="/profile" className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold text-base">Mi Cuenta</Link>
            
            <div className="border-t border-gray-200 pt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <p className="px-4 py-2 text-sm font-semibold text-gray-600">
                    Hola, {user?.name}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 transition-colors font-bold text-base text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="block px-4 py-3 rounded-lg bg-primary text-white text-center font-bold text-base hover:bg-primary-dark transition-colors">
                  Inicia Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default memo(NavbarComponent);
