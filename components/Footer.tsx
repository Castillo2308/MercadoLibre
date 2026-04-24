'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-0 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 mb-16 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">¡Recibe Ofertas Especiales!</h3>
              <p className="text-white/90">Suscríbete a nuestro newsletter para recibir las mejores ofertas</p>
            </div>
            <div className="w-full md:w-auto flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white flex-1 md:flex-none"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Mail size={18} />
                Suscribir
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1 - Sobre */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-primary-dark flex items-center gap-2 group-hover:text-primary transition-colors">
              Sobre Kivra
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <ul className="space-y-3 text-gray-300">
              {['Quiénes Somos', 'Carreras', 'Prensa', 'Blog'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                    {item}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Comprar */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-primary-dark flex items-center gap-2 group-hover:text-primary transition-colors">
              Comprar
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <ul className="space-y-3 text-gray-300">
              {['Categorías', 'Ofertas', 'Mis Compras', 'Devoluciones'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                    {item}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Vender */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-primary-dark flex items-center gap-2 group-hover:text-primary transition-colors">
              Vender
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <ul className="space-y-3 text-gray-300">
              {['Registrar Producto', 'Mis Ventas', 'Herramientas', 'Centro de Ayuda'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary transition-all duration-300 flex items-center gap-2 group">
                    {item}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contacto */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-primary-dark flex items-center gap-2 group-hover:text-primary transition-colors">
              Contacto
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={16} />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={16} />
                <span>soporte@ml.com</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors">
                <MapPin size={16} />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>

          {/* Column 5 - Redes Sociales */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-primary-dark group-hover:text-primary transition-colors">Síguenos</h3>
            <div className="flex gap-4 flex-wrap">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Mail, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="w-12 h-12 bg-white/10 hover:bg-primary text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 group"
                >
                  <Icon size={20} className="group-hover:text-gray-900 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <p className="text-center md:text-left">
            &copy; 2026 Kivra. Todos los derechos reservados. ❤️
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="#" className="hover:text-primary transition-colors duration-300">Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-300">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-primary transition-colors duration-300">Cookies</Link>
          </div>
        </div>

        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-xl hover:bg-primary-dark transition-all duration-300 hover:scale-125 animate-float flex items-center justify-center z-40"
        >
          ↑
        </button>
      </div>
    </footer>
  );
}
