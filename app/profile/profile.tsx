'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  CreditCard,
  Edit2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Receipt,
  Phone,
  Settings,
  Star,
  Truck,
  TrendingUp,
  User,
} from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');

  const userInfo = {
    name: 'Juan González',
    email: 'juan@example.com',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    joinDate: '15 de enero de 2023',
    rating: 4.8,
    reviews: 156,
    totalSales: 1250,
    totalPurchases: 3420,
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: User },
    { id: 'purchases', label: 'Mis Compras', icon: Package },
    { id: 'sales', label: 'Mis Ventas', icon: TrendingUp },
    { id: 'settings', label: 'Configuracion', icon: Settings },
  ];

  const weeklySales = [
    { day: 'Lun', value: 840 },
    { day: 'Mar', value: 1260 },
    { day: 'Mie', value: 980 },
    { day: 'Jue', value: 1590 },
    { day: 'Vie', value: 1750 },
    { day: 'Sab', value: 1320 },
    { day: 'Dom', value: 940 },
  ];

  const categorySales = [
    { category: 'Tecnologia', value: 48, amount: 600 },
    { category: 'Gaming', value: 24, amount: 300 },
    { category: 'Audio', value: 16, amount: 200 },
    { category: 'Hogar', value: 12, amount: 150 },
  ];

  const topProducts = [
    { name: 'Laptop Pro 14', sold: 23, revenue: 13800 },
    { name: 'Headphones Elite', sold: 18, revenue: 3600 },
    { name: 'Camera 4K', sold: 11, revenue: 8800 },
  ];

  const purchaseStats = [
    { label: 'Total invertido', value: '$3,420', icon: CreditCard, extra: '+12% mensual' },
    { label: 'Pedidos entregados', value: '41', icon: CheckCircle2, extra: '95% exito' },
    { label: 'En transito', value: '6', icon: Truck, extra: 'ETA 2.3 dias' },
  ];

  const monthlyPurchases = [
    { month: 'Ene', value: 220 },
    { month: 'Feb', value: 330 },
    { month: 'Mar', value: 410 },
    { month: 'Abr', value: 360 },
    { month: 'May', value: 520 },
    { month: 'Jun', value: 480 },
  ];

  const purchaseCategories = [
    { name: 'Tecnologia', value: 46 },
    { name: 'Hogar', value: 26 },
    { name: 'Moda', value: 18 },
    { name: 'Gaming', value: 10 },
  ];

  const recentPurchases = [
    { title: 'Laptop Pro 14', price: 1299, status: 'Entregado' },
    { title: 'Headphones Elite', price: 199, status: 'En camino' },
    { title: 'Smart Speaker', price: 159, status: 'Preparando envio' },
  ];

  const maxWeeklySale = Math.max(...weeklySales.map((item) => item.value));
  const maxMonthlyPurchase = Math.max(...monthlyPurchases.map((item) => item.value));

  const panelAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45 },
  };

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
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-primary to-secondary text-4xl font-black text-gray-900 shadow-[0_18px_42px_rgba(0,0,0,0.45)] md:h-32 md:w-32 md:text-5xl"
              >
                JG
              </motion.div>
              <div className="pb-1">
                <h1 className="mb-2 text-3xl font-black text-white md:text-4xl">{userInfo.name}</h1>
                <p className="mb-2 flex items-center gap-2 text-sm text-white/75">
                  <MapPin size={16} />
                  {userInfo.location}
                </p>
                <p className="text-sm text-white/65">Miembro desde {userInfo.joinDate}</p>
              </div>
            </div>
            <div className="md:ml-auto">
              <button className="btn btn-outline flex items-center gap-2">
                <Edit2 size={18} />
                Editar Perfil
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 mt-7 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {[
              { label: 'Compras', value: userInfo.totalPurchases },
              { label: 'Ventas', value: userInfo.totalSales },
              { label: 'Calificacion', value: `${userInfo.rating}⭐` },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated animate-floatCard p-4 text-center" style={{ animationDelay: `${stat.label.length * 0.04}s` }}>
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
            <div className="card-elevated p-6 mb-6 sticky top-24">
              <div className="mb-6 border-b border-white/10 pb-6 text-center">
                <div className="mb-2 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(userInfo.rating) ? 'fill-primary text-primary' : 'text-white/25'}
                    />
                  ))}
                </div>
                <p className="text-lg font-black text-white">{userInfo.rating}</p>
                <p className="text-xs text-white/65">{userInfo.reviews} opiniones</p>
              </div>

              <div className="mb-6 space-y-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3 text-white/80">
                  <Mail size={18} className="text-secondary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/60">Email</p>
                    <p className="truncate text-sm font-semibold">{userInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Phone size={18} className="text-secondary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/60">Telefono</p>
                    <p className="text-sm font-semibold">{userInfo.phone}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'scale-[1.02] bg-gradient-to-r from-primary to-primary-dark text-gray-900 shadow-lg'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-all font-semibold">
                <LogOut size={20} />
                Cerrar Sesion
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" className="space-y-6" {...panelAnimation}>
                  <div className="card-elevated p-8">
                    <h3 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
                      <User size={24} className="text-secondary" />
                      Informacion Personal
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {[
                        { label: 'Nombre Completo', value: userInfo.name },
                        { label: 'Correo Electronico', value: userInfo.email },
                        { label: 'Telefono', value: userInfo.phone },
                        { label: 'Ubicacion', value: userInfo.location },
                        { label: 'Miembro desde', value: userInfo.joinDate },
                        { label: 'Estado', value: 'Verificado' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <p className="mb-2 text-xs font-semibold text-white/60">{item.label}</p>
                          <p className="text-lg font-bold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                      { icon: '🛍️', title: 'Total Comprado', value: `$${userInfo.totalPurchases}` },
                      { icon: '💰', title: 'Total Vendido', value: `$${userInfo.totalSales}` },
                      { icon: '⭐', title: 'Reputacion', value: '4.8 / 5' },
                    ].map((stat) => (
                      <motion.div
                        key={stat.title}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="card-elevated p-6"
                      >
                        <div className="mb-3 text-4xl">{stat.icon}</div>
                        <p className="mb-2 text-sm font-semibold text-white/70">{stat.title}</p>
                        <p className="text-3xl font-black text-primary">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'purchases' && (
                <motion.div key="purchases" className="space-y-6" {...panelAnimation}>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-2xl font-black text-white">
                      <Package size={24} className="text-secondary" />
                      Mis Compras con Analitica
                    </h3>
                    <p className="text-sm text-white/70">Resumen visual de tus compras, categorias y actividad reciente.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {purchaseStats.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: idx * 0.08 }}
                          className="card-elevated p-5"
                        >
                          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary">
                            <Icon size={18} />
                          </div>
                          <p className="text-sm text-white/65">{item.label}</p>
                          <p className="mt-1 text-3xl font-black text-primary">{item.value}</p>
                          <p className="mt-2 inline-flex rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-semibold text-secondary">
                            {item.extra}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="card-elevated p-6">
                    <p className="mb-5 text-lg font-bold text-white">Evolucion de compras (grafico de barras)</p>
                    <div className="flex h-64 items-end justify-between gap-3 rounded-xl border border-white/10 bg-[#0b182b]/80 p-4">
                      {monthlyPurchases.map((item, idx) => {
                        const height = Math.max((item.value / maxMonthlyPurchase) * 100, 15);
                        return (
                          <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: `${height}%`, opacity: 1 }}
                              transition={{ duration: 0.55, delay: idx * 0.08 }}
                              className="w-full rounded-t-xl bg-gradient-to-t from-primary/80 via-secondary to-primary"
                            />
                            <p className="text-xs font-semibold text-white/65">{item.month}</p>
                            <p className="text-xs text-white/50">${item.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="card-elevated p-6">
                      <p className="mb-5 text-lg font-bold text-white">Distribucion por categoria</p>
                      <div className="space-y-4">
                        {purchaseCategories.map((item, idx) => (
                          <div key={item.name}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-semibold text-white/80">{item.name}</span>
                              <span className="text-white/65">{item.value}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.08 }}
                                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card-elevated p-6">
                      <p className="mb-5 text-lg font-bold text-white">Compras recientes</p>
                      <div className="space-y-4">
                        {recentPurchases.map((purchase, idx) => (
                          <motion.div
                            key={purchase.title}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="rounded-xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Receipt size={16} className="text-secondary" />
                                <p className="font-semibold text-white">{purchase.title}</p>
                              </div>
                              <span className="text-sm font-semibold text-primary">${purchase.price}</span>
                            </div>
                            <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/75">
                              {purchase.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sales' && (
                <motion.div key="sales" className="space-y-6" {...panelAnimation}>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-2xl font-black text-white">
                      <BarChart3 size={24} className="text-secondary" />
                      Mis Ventas con Analitica
                    </h3>
                    <p className="text-sm text-white/70">
                      Dashboard semanal con barras, rendimiento por categoria y productos top.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                      { label: 'Facturacion semanal', value: '$8,680', extra: '+18%' },
                      { label: 'Pedidos cerrados', value: '52', extra: '+9%' },
                      { label: 'Ticket promedio', value: '$166', extra: '+4%' },
                    ].map((kpi, idx) => (
                      <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.08 }}
                        className="card-elevated p-5"
                      >
                        <p className="text-sm text-white/65">{kpi.label}</p>
                        <p className="mt-1 text-3xl font-black text-primary">{kpi.value}</p>
                        <p className="mt-2 inline-flex rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-semibold text-secondary">
                          {kpi.extra} vs semana pasada
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="card-elevated p-6">
                    <p className="mb-5 text-lg font-bold text-white">Ventas por dia (grafico de barras)</p>
                    <div className="flex h-64 items-end justify-between gap-3 rounded-xl border border-white/10 bg-[#0b182b]/80 p-4">
                      {weeklySales.map((item, idx) => {
                        const height = Math.max((item.value / maxWeeklySale) * 100, 12);
                        return (
                          <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: `${height}%`, opacity: 1 }}
                              transition={{ duration: 0.55, delay: 0.08 * idx }}
                              className="w-full rounded-t-xl bg-gradient-to-t from-secondary via-primary to-primary shadow-[0_8px_20px_rgba(29,184,73,0.28)]"
                            />
                            <p className="text-xs font-semibold text-white/65">{item.day}</p>
                            <p className="text-xs text-white/50">${item.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="card-elevated p-6">
                      <p className="mb-5 text-lg font-bold text-white">Participacion por categoria</p>
                      <div className="space-y-4">
                        {categorySales.map((item, idx) => (
                          <div key={item.category}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-semibold text-white/80">{item.category}</span>
                              <span className="text-white/65">{item.value}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 0.65, delay: idx * 0.08 }}
                                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                              />
                            </div>
                            <p className="mt-1 text-xs text-white/50">{item.amount} ordenes</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card-elevated p-6">
                      <p className="mb-5 text-lg font-bold text-white">Top productos vendidos</p>
                      <div className="space-y-4">
                        {topProducts.map((product, idx) => (
                          <motion.div
                            key={product.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="rounded-xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <p className="font-semibold text-white">{product.name}</p>
                              <span className="text-sm text-primary">${product.revenue}</span>
                            </div>
                            <p className="text-xs text-white/60">{product.sold} unidades vendidas</p>
                            <div className="mt-3 h-1.5 rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((product.sold / 25) * 100, 100)}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" className="space-y-6" {...panelAnimation}>
                  <div className="card-elevated p-8">
                    <h3 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
                      <Settings size={24} className="text-secondary" />
                      Configuracion de Cuenta
                    </h3>

                    {[
                      {
                        title: 'Privacidad',
                        items: [
                          { label: 'Perfil Publico', enabled: true },
                          { label: 'Mostrar Calificacion', enabled: true },
                          { label: 'Recibir Mensajes', enabled: false },
                        ],
                      },
                      {
                        title: 'Notificaciones',
                        items: [
                          { label: 'Email de Compras', enabled: true },
                          { label: 'Email de Mensajes', enabled: true },
                          { label: 'Email de Ofertas', enabled: false },
                        ],
                      },
                    ].map((group) => (
                      <div key={group.title} className="border-b border-white/10 pb-6">
                        <h4 className="mb-4 text-lg font-bold text-white">{group.title}</h4>
                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <label
                              key={item.label}
                              className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-white/5"
                            >
                              <input
                                type="checkbox"
                                defaultChecked={item.enabled}
                                className="h-5 w-5 cursor-pointer rounded text-secondary"
                              />
                              <span className="font-semibold text-white/80">{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 pt-6">
                      <h4 className="mb-4 text-lg font-bold text-accent">Zona de Peligro</h4>
                      <button className="w-full rounded-lg border-2 border-accent px-6 py-3 font-semibold text-accent transition-all hover:bg-accent/10">
                        Eliminar Cuenta
                      </button>
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
