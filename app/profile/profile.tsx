'use client';

import { User, Settings, LogOut, Package, TrendingUp, Star, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
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
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Profile Cover */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-end gap-6 mb-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center text-5xl font-black shadow-xl border-4 border-white">
              JG
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-4xl font-black text-gray-900 mb-2">{userInfo.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 mb-3">
                <MapPin size={16} />
                {userInfo.location}
              </p>
              <p className="text-sm text-gray-600">Miembro desde {userInfo.joinDate}</p>
            </div>
            <button className="btn btn-outline flex items-center gap-2">
              <Edit2 size={18} />
              Editar Perfil
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Compras', value: userInfo.totalPurchases },
              { label: 'Ventas', value: userInfo.totalSales },
              { label: 'Calificación', value: `${userInfo.rating}⭐` },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated p-4 text-center">
                <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-secondary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Card */}
            <div className="card-elevated p-6 mb-6 sticky top-24">
              {/* Rating Section */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200 text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(userInfo.rating) ? 'fill-primary text-primary' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-lg font-black text-gray-900">{userInfo.rating}</p>
                <p className="text-xs text-gray-600">{userInfo.reviews} opiniones</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-secondary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-semibold truncate">{userInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-secondary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Teléfono</p>
                    <p className="text-sm font-semibold">{userInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-all font-semibold">
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Información Personal */}
                <div className="card-elevated p-8">
                  <h3 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-2">
                    <User size={24} className="text-secondary" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Nombre Completo', value: userInfo.name },
                      { label: 'Correo Electrónico', value: userInfo.email },
                      { label: 'Teléfono', value: userInfo.phone },
                      { label: 'Ubicación', value: userInfo.location },
                      { label: 'Miembro desde', value: userInfo.joinDate },
                      { label: 'Estado', value: 'Verificado ✓' },
                    ].map((item) => (
                      <div key={item.label} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-2">{item.label}</p>
                        <p className="text-lg font-bold text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: '🛍️', title: 'Total Comprado', value: `$${userInfo.totalPurchases}` },
                    { icon: '💰', title: 'Total Vendido', value: `$${userInfo.totalSales}` },
                    { icon: '⭐', title: 'Reputación', value: '⭐⭐⭐⭐⭐' },
                  ].map((stat) => (
                    <div key={stat.title} className="card-elevated p-6 hover:shadow-lg transition-all">
                      <div className="text-4xl mb-3">{stat.icon}</div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</p>
                      <p className="text-3xl font-black text-secondary">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <Package size={24} className="text-secondary" />
                  Mis Compras ({userInfo.totalPurchases})
                </h3>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-elevated p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                          📦
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">Producto #{i}</h4>
                          <p className="text-sm text-gray-600">Compra realizada hace 2 semanas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-secondary">$99.99</p>
                        <span className="badge bg-green-100 text-green-700">Entregado</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="btn btn-outline flex-1 text-sm">Ver Detalles</button>
                      <button className="btn btn-secondary flex-1 text-sm">Dejar Reseña</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sales Tab */}
            {activeTab === 'sales' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp size={24} className="text-secondary" />
                  Mis Ventas ({userInfo.totalSales})
                </h3>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-elevated p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-2xl">
                          💵
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">Venta #{i}</h4>
                          <p className="text-sm text-gray-600">Vendido hace 5 días</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-secondary">+$149.99</p>
                        <span className="badge bg-primary/10 text-primary">En proceso</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="btn btn-outline flex-1 text-sm">Ver Comprador</button>
                      <button className="btn btn-secondary flex-1 text-sm">Marcar Enviado</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="card-elevated p-8">
                  <h3 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-2">
                    <Settings size={24} className="text-secondary" />
                    Configuración de Cuenta
                  </h3>

                  {/* Settings Groups */}
                  {[
                    {
                      title: 'Privacidad',
                      items: [
                        { label: 'Perfil Público', enabled: true },
                        { label: 'Mostrar Calificación', enabled: true },
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
                    <div key={group.title} className="pb-6 border-b-2 border-gray-200">
                      <h4 className="font-bold text-lg text-gray-900 mb-4">{group.title}</h4>
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <label key={item.label} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              defaultChecked={item.enabled}
                              className="w-5 h-5 text-secondary rounded cursor-pointer"
                            />
                            <span className="font-semibold text-gray-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Danger Zone */}
                  <div className="mt-6 pt-6">
                    <h4 className="font-bold text-lg text-accent mb-4">Zona de Peligro</h4>
                    <button className="w-full px-6 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-all font-semibold">
                      Eliminar Cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
