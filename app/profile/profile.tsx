'use client';

/**
 * profile.tsx
 *
 * Página de perfil del usuario. Muestra información real de la cuenta,
 * los productos que realmente publicó como vendedor, sus compras reales
 * (órdenes) y configuración básica. Sin datos inventados.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Package,
  Phone,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  ShoppingBag,
  Heart,
  ShoppingCart,
  PlusCircle,
  MessageCircle,
  BarChart3,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigationLoader } from '@/components/NavigationLoaderProvider';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useWishlist } from '@/hooks/useWishlist';
import { SmartImage } from '@/components/ui/smart-image';
import { MiniBarChart, MiniDonutChart } from '@/components/ui/charts';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useLanguage } from '@/context/LanguageContext';
import type { TranslationKey } from '@/lib/i18n';
import { formatCRC } from '@/lib/utils';

interface MyProduct {
  id: string;
  title: string;
  price: string | number;
  quantityAvailable: number;
  quantitySold: number;
  isActive: boolean;
  mainImageUrl: string | null;
  images: { imageUrl: string }[];
}

interface MyOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  items: { id: string; product: { title: string } }[];
}

interface MySaleItem {
  id: string;
  quantity: number;
  unitPrice: string | number;
  subtotal: string | number;
  product: { id: string; title: string };
  order: { id: string; orderNumber: string; status: string; createdAt: string };
}

const ORDER_STATUS_KEYS: Record<string, TranslationKey> = {
  pending: 'profile.orderStatus.pending',
  confirmed: 'profile.orderStatus.confirmed',
  shipped: 'profile.orderStatus.shipped',
  delivered: 'profile.orderStatus.delivered',
  cancelled: 'profile.orderStatus.cancelled',
};

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const VALID_TABS = ['overview', 'sales', 'purchases', 'stats', 'settings'];
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    initialTab && VALID_TABS.includes(initialTab) ? initialTab : 'overview'
  );
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale } = useLanguage();
  const { startLoading } = useNavigationLoader();
  const { clearCart, getTotalItems } = useShoppingCart();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const isLightTheme = theme === 'light';

  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [myOrders, setMyOrders] = useState<MyOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [mySales, setMySales] = useState<MySaleItem[]>([]);
  const [salesLoaded, setSalesLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/products?sellerId=${user.id}&take=50`)
      .then((res) => res.json())
      .then((data: MyProduct[]) => setMyProducts(Array.isArray(data) ? data : []))
      .catch(() => setMyProducts([]))
      .finally(() => setProductsLoaded(true));

    fetch('/api/users/sales', { headers: { 'X-User-ID': user.id }, cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => setMySales(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setMySales([]))
      .finally(() => setSalesLoaded(true));

    fetch('/api/users/orders', { headers: { 'X-User-ID': user.id }, cache: 'no-store' })
      .then((res) => res.json())
      .then((payload) => setMyOrders(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setMyOrders([]))
      .finally(() => setOrdersLoaded(true));
  }, [user?.id]);

  const userInfo = useMemo(() => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : t('profile.defaultName');
    return {
      name: fullName || t('profile.defaultName'),
      email: user?.email || 'sin-correo@kivra.com',
      phone: user?.phone || t('profile.noPhone'),
    };
  }, [user, t]);

  const initials = useMemo(() => {
    const parts = userInfo.name.split(' ').filter(Boolean);
    const first = parts[0]?.charAt(0) || 'U';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`.toUpperCase();
  }, [userInfo.name]);

  const inventoryValue = useMemo(
    () => myProducts.reduce((sum, p) => sum + Number(p.price) * p.quantityAvailable, 0),
    [myProducts]
  );

  const tabs = [
    { id: 'overview', label: t('profile.tab.overview'), icon: User },
    { id: 'sales', label: t('profile.tab.sales'), icon: ShoppingBag },
    { id: 'purchases', label: t('profile.tab.purchases'), icon: Package },
    { id: 'stats', label: t('profile.tab.stats'), icon: BarChart3 },
    { id: 'settings', label: t('profile.tab.settings'), icon: Settings },
  ];

  const PALETTE = ['#1DB849', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#FF6B6B'];

  const totalSpent = useMemo(
    () => myOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
    [myOrders]
  );

  const avgOrderValue = myOrders.length > 0 ? totalSpent / myOrders.length : 0;

  const spendingByMonth = useMemo(() => {
    const buckets = new Map<string, number>();
    myOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { month: 'short', year: '2-digit' });
      buckets.set(key, (buckets.get(key) || 0) + Number(order.totalAmount));
    });
    return Array.from(buckets.entries())
      .slice(-6)
      .map(([label, value]) => ({ label, value }));
  }, [myOrders, locale]);

  const ordersByStatus = useMemo(() => {
    const buckets = new Map<string, number>();
    myOrders.forEach((order) => {
      const statusKey = ORDER_STATUS_KEYS[order.status];
      const key = statusKey ? t(statusKey) : order.status;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return Array.from(buckets.entries()).map(([label, value], idx) => ({
      label,
      value,
      color: PALETTE[idx % PALETTE.length],
    }));
  }, [myOrders, t]);

  const topSellingProducts = useMemo(
    () =>
      [...myProducts]
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 5)
        .map((p) => ({ label: p.title, value: p.quantitySold })),
    [myProducts]
  );

  const totalRevenue = useMemo(
    () => mySales.reduce((sum, item) => sum + Number(item.subtotal), 0),
    [mySales]
  );

  const salesByMonth = useMemo(() => {
    const buckets = new Map<string, number>();
    mySales.forEach((item) => {
      const date = new Date(item.order.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { month: 'short', year: '2-digit' });
      buckets.set(key, (buckets.get(key) || 0) + Number(item.subtotal));
    });
    return Array.from(buckets.entries())
      .slice(-6)
      .map(([label, value]) => ({ label, value }));
  }, [mySales, locale]);

  const inventoryByProduct = useMemo(
    () =>
      [...myProducts]
        .sort((a, b) => Number(b.price) * b.quantityAvailable - Number(a.price) * a.quantityAvailable)
        .slice(0, 5)
        .map((p, idx) => ({
          label: p.title,
          value: Number(p.price) * p.quantityAvailable,
          color: PALETTE[idx % PALETTE.length],
        })),
    [myProducts]
  );

  const activeVsInactive = useMemo(() => {
    const active = myProducts.filter((p) => p.isActive).length;
    const inactive = myProducts.length - active;
    return [
      { label: t('profile.chartActive'), value: active, color: '#1DB849' },
      { label: t('profile.chartInactive'), value: inactive, color: '#64748B' },
    ];
  }, [myProducts, t]);

  const panelAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45 },
  };

  const overviewStats = [
    { label: t('profile.statPublished'), value: myProducts.length, icon: ShoppingBag },
    { label: t('profile.statFavorites'), value: wishlist.length, icon: Heart },
    { label: t('profile.statInCart'), value: getTotalItems(), icon: ShoppingCart },
  ];

  return (
    <main className="min-h-screen bg-[#071425] pb-16">
      <div className="relative overflow-hidden border-b border-white/10 bg-[#091424] py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,230,0,0.16),transparent_36%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,0.22),transparent_40%),radial-gradient(circle_at_40%_100%,rgba(29,184,73,0.18),transparent_42%)]" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end"
          >
            <div className="flex items-end gap-5">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-primary to-primary-dark dark:to-secondary text-4xl font-black text-gray-900 shadow-[0_18px_42px_rgba(0,0,0,0.45)] md:h-32 md:w-32 md:text-5xl">
                {initials}
              </div>
              <div className="pb-1">
                <h1 className="mb-2 text-3xl font-black text-white md:text-4xl">{userInfo.name}</h1>
                <p className="flex items-center gap-2 text-sm text-white/70">
                  <Mail size={15} /> {userInfo.email}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 mt-7 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {overviewStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <stat.icon size={18} className="mx-auto mb-1 text-primary" />
                <p className="mb-1 text-sm font-semibold text-white/70">{stat.label}</p>
                <p className="text-3xl font-black text-primary">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0d1c31] p-6">
              <div className="mb-6 space-y-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3 text-white/80">
                  <Mail size={18} className="flex-shrink-0 text-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/60">{t('profile.email')}</p>
                    <p className="truncate text-sm font-semibold">{userInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Phone size={18} className="flex-shrink-0 text-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/60">{t('profile.phone')}</p>
                    <p className="text-sm font-semibold">{userInfo.phone}</p>
                  </div>
                </div>
              </div>

              <nav className="mb-6 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary to-primary-dark text-gray-900 shadow-lg'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  startLoading();
                  logout();
                  clearCart();
                  router.push('/');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-accent px-4 py-3 font-semibold text-accent transition-all hover:bg-accent/10"
              >
                <LogOut size={20} />
                {t('profile.logout')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" className="space-y-6" {...panelAnimation}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                    <h3 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
                      <User size={24} className="text-secondary" />
                      {t('profile.personalInfo')}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {[
                        { label: t('profile.fullName'), value: userInfo.name },
                        { label: t('profile.emailField'), value: userInfo.email },
                        { label: t('profile.phone'), value: userInfo.phone },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <p className="mb-2 text-xs font-semibold text-white/60">{item.label}</p>
                          <p className="text-lg font-bold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!productsLoaded ? null : myProducts.length === 0 ? (
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
                      <p className="text-white/70">
                        {t('profile.sellCta')}
                      </p>
                      <Link href="/sell" className="premium-cta mt-4 inline-flex">
                        <PlusCircle size={18} /> {t('profile.publishProduct')}
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="flex items-center gap-2 text-lg font-black text-white">
                          <ShoppingBag size={20} className="text-secondary" />
                          {t('profile.myPublishedProducts')}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveTab('sales')}
                            className="text-sm font-semibold text-primary hover:text-secondary"
                          >
                            {t('profile.viewAll')}
                          </button>
                          <Link href="/sell" className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-[#052012] transition hover:brightness-105">
                            <PlusCircle size={14} /> {t('profile.publishAnother')}
                          </Link>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {myProducts.slice(0, 4).map((product) => {
                          const image = product.images?.[0]?.imageUrl || product.mainImageUrl;
                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.id}`}
                              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-white/20"
                            >
                              <div className="relative h-24 overflow-hidden bg-white/5">
                                {image && (
                                  <SmartImage src={image} alt={product.title} fill sizes="200px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                )}
                              </div>
                              <div className="p-2.5">
                                <p className="truncate text-xs font-semibold text-white">{product.title}</p>
                                <p className="mt-0.5 text-xs text-primary">{formatCRC(product.price)}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'sales' && (
                <motion.div key="sales" className="space-y-6" {...panelAnimation}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="flex items-center gap-2 text-2xl font-black text-white">
                        <ShoppingBag size={24} className="text-secondary" />
                        {t('profile.mySales')}
                      </h3>
                      <p className="text-sm text-white/60">{t('profile.mySalesSubtitle')}</p>
                    </div>
                    <Link href="/sell" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-[#052012] transition hover:brightness-105">
                      <PlusCircle size={16} /> {t('profile.publish')}
                    </Link>
                  </div>

                  {!productsLoaded ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-white/50">{t('profile.loading')}</div>
                  ) : myProducts.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-16 text-center">
                      <ShoppingBag size={36} className="mx-auto mb-3 text-white/25" />
                      <p className="mb-4 text-white/60">{t('profile.noProductsYet')}</p>
                      <Link href="/sell" className="premium-cta inline-flex">{t('profile.startSelling')}</Link>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-white/50">{t('profile.products')}</p>
                          <p className="text-2xl font-black text-white">{myProducts.length}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-white/50">{t('profile.unitsSold')}</p>
                          <p className="text-2xl font-black text-white">{myProducts.reduce((s, p) => s + p.quantitySold, 0)}</p>
                        </div>
                        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                          <p className="text-xs text-white/50">{t('profile.inventoryValue')}</p>
                          <p className="text-2xl font-black text-primary">{formatCRC(inventoryValue)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {myProducts.map((product) => {
                          const image = product.images?.[0]?.imageUrl || product.mainImageUrl;
                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.id}`}
                              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20"
                            >
                              <div className="relative h-32 overflow-hidden bg-white/5">
                                {image && (
                                  <SmartImage src={image} alt={product.title} fill sizes="300px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                )}
                                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${product.isActive ? 'bg-primary text-[#052012]' : 'bg-white/20 text-white'}`}>
                                  {product.isActive ? t('profile.active') : t('profile.inactive')}
                                </span>
                              </div>
                              <div className="p-3">
                                <p className="truncate text-sm font-semibold text-white">{product.title}</p>
                                <div className="mt-1 flex items-center justify-between text-xs text-white/50">
                                  <span>{formatCRC(product.price)}</span>
                                  <span>{product.quantityAvailable} {t('profile.inStock')}</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'purchases' && (
                <motion.div key="purchases" className="space-y-6" {...panelAnimation}>
                  <div>
                    <h3 className="flex items-center gap-2 text-2xl font-black text-white">
                      <Package size={24} className="text-secondary" />
                      {t('profile.myPurchases')}
                    </h3>
                    <p className="text-sm text-white/60">{t('profile.myPurchasesSubtitle')}</p>
                  </div>

                  {!ordersLoaded ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-white/50">{t('profile.loading')}</div>
                  ) : myOrders.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-16 text-center">
                      <Package size={36} className="mx-auto mb-3 text-white/25" />
                      <p className="mb-2 text-white/60">{t('profile.noPurchasesYet')}</p>
                      <p className="mb-4 text-sm text-white/40">{t('profile.noPurchasesHint')}</p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/" className="premium-cta inline-flex">{t('profile.exploreProducts')}</Link>
                        <Link href="/messages" className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:bg-white/10">
                          <MessageCircle size={16} /> {t('profile.viewMessages')}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myOrders.map((order) => (
                        <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-white">{t('profile.order', { number: order.orderNumber })}</p>
                              <p className="text-xs text-white/45">{new Date(order.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')} · {t('profile.productsCount', { count: order.items.length })}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
                                {ORDER_STATUS_KEYS[order.status] ? t(ORDER_STATUS_KEYS[order.status]) : order.status}
                              </span>
                              <span className="text-lg font-black text-primary">{formatCRC(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'stats' && (
                <motion.div key="stats" className="space-y-6" {...panelAnimation}>
                  <div>
                    <h3 className="flex items-center gap-2 text-2xl font-black text-white">
                      <BarChart3 size={24} className="text-secondary" />
                      {t('profile.statistics')}
                    </h3>
                    <p className="text-sm text-white/60">
                      {t('profile.statisticsSubtitle')}
                    </p>
                  </div>

                  {!productsLoaded || !ordersLoaded || !salesLoaded ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-white/50">
                      {t('profile.loadingMetrics')}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <DollarSign size={16} className="mb-1 text-primary" />
                          <p className="text-xs text-white/50">{t('profile.totalSpent')}</p>
                          <p className="text-2xl font-black text-white">{formatCRC(totalSpent)}</p>
                        </div>
                        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                          <TrendingUp size={16} className="mb-1 text-primary" />
                          <p className="text-xs text-white/50">{t('profile.revenue')}</p>
                          <p className="text-2xl font-black text-primary">{formatCRC(totalRevenue)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <TrendingUp size={16} className="mb-1 text-secondary" />
                          <p className="text-xs text-white/50">{t('profile.avgTicket')}</p>
                          <p className="text-2xl font-black text-white">{formatCRC(avgOrderValue)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <ShoppingBag size={16} className="mb-1 text-primary" />
                          <p className="text-xs text-white/50">{t('profile.totalOrders')}</p>
                          <p className="text-2xl font-black text-white">{myOrders.length}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <Package size={16} className="mb-1 text-primary" />
                          <p className="text-xs text-white/50">{t('profile.inventoryValueShort')}</p>
                          <p className="text-2xl font-black text-white">{formatCRC(inventoryValue)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <p className="mb-4 text-sm font-semibold text-white">{t('profile.salesByMonth')}</p>
                          <MiniBarChart data={salesByMonth} valuePrefix="₡" color="#1DB849" emptyLabel={t('profile.noSalesData')} />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <p className="mb-4 text-sm font-semibold text-white">{t('profile.spendingByMonth')}</p>
                          <MiniBarChart data={spendingByMonth} valuePrefix="₡" color="#3B82F6" emptyLabel={t('profile.noSpendingData')} />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <p className="mb-4 text-sm font-semibold text-white">{t('profile.ordersByStatusBar')}</p>
                          <MiniBarChart data={ordersByStatus} color="#F59E0B" emptyLabel={t('profile.noOrdersData')} />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <p className="mb-4 text-sm font-semibold text-white">{t('profile.topSellingProducts')}</p>
                          <MiniBarChart data={topSellingProducts} color="#1DB849" emptyLabel={t('profile.noSalesData')} />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <p className="mb-4 text-sm font-semibold text-white">{t('profile.inventoryByProduct')}</p>
                          <MiniDonutChart data={inventoryByProduct} emptyLabel={t('profile.noInventoryData')} />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <p className="mb-4 text-sm font-semibold text-white">{t('profile.activeVsInactive')}</p>
                          <MiniDonutChart data={activeVsInactive} emptyLabel={t('profile.noPublishedData')} />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" className="space-y-6" {...panelAnimation}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                    <h3 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
                      <Settings size={24} className="text-secondary" />
                      {t('profile.accountSettings')}
                    </h3>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-bold text-white">{t('profile.appearance')}</p>
                          <p className="text-sm text-white/65">{t('profile.appearanceSubtitle')}</p>
                        </div>

                        <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
                          <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                              !isLightTheme ? 'bg-primary text-[#071425] shadow-[0_8px_18px_rgba(29,184,73,0.28)]' : 'text-white/65 hover:text-white'
                            }`}
                          >
                            <Moon size={16} /> {t('profile.dark')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                              isLightTheme ? 'bg-white text-[#071425] shadow-[0_8px_18px_rgba(255,255,255,0.18)]' : 'text-white/65 hover:text-white'
                            }`}
                          >
                            <Sun size={16} /> {t('profile.light')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-bold text-white">{t('profile.language')}</p>
                          <p className="text-sm text-white/65">{t('profile.languageSubtitle')}</p>
                        </div>

                        <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
                          <button
                            type="button"
                            onClick={() => setLocale('es')}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                              locale === 'es' ? 'bg-primary text-[#071425] shadow-[0_8px_18px_rgba(29,184,73,0.28)]' : 'text-white/65 hover:text-white'
                            }`}
                          >
                            🇪🇸 Español
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocale('en')}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                              locale === 'en' ? 'bg-primary text-[#071425] shadow-[0_8px_18px_rgba(29,184,73,0.28)]' : 'text-white/65 hover:text-white'
                            }`}
                          >
                            🇺🇸 English
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
