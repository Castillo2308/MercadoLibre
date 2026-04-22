'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromRedirect = searchParams.get('redirect');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      login(email, password);
      setTimeout(() => {
        router.push(fromRedirect ? '/cart' : '/');
      }, 500);
    } catch (err) {
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !name || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      register(email, name, password);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      setError('Error al registrarse');
      setLoading(false);
    }
  };

  const switchForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-white to-gray-100 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="inline-block group mb-6">
            <div className="text-6xl font-black text-primary transform group-hover:scale-110 transition-transform duration-300">
              💚
            </div>
            <h1 className="text-4xl font-black text-gray-900 mt-2 group-hover:text-primary transition-colors duration-300">
              MercadoLibre
            </h1>
          </Link>
          <p className="text-gray-600 text-lg mt-2">
            {isLogin ? 'Bienvenido de vuelta' : 'Únete a nuestra comunidad'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-xl animate-slideDown">
          <button
            onClick={switchForm}
            className={`flex-1 py-3 px-4 font-bold text-base rounded-lg transition-all duration-300 transform ${
              isLogin
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Inicia Sesión
          </button>
          <button
            onClick={switchForm}
            className={`flex-1 py-3 px-4 font-bold text-base rounded-lg transition-all duration-300 transform ${
              !isLogin
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registrate
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg mb-6 animate-slideDown">
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 animate-slideUp">
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform duration-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:shadow-lg transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform duration-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="w-full border-2 border-gray-200 rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:shadow-lg transition-all duration-300 placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Iniciando sesión...' : 'Inicia Sesión'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                type="button"
                className="w-full border-2 border-gray-300 py-3 rounded-xl font-semibold text-gray-700 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Nombre Completo
                </label>
                <div className="relative group">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform duration-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full border-2 border-gray-200 rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:shadow-lg transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform duration-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:shadow-lg transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform duration-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full border-2 border-gray-200 rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:shadow-lg transition-all duration-300 placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <p className="text-center text-gray-600 text-sm">
                Al registrarte aceptas nuestros{' '}
                <Link href="#" className="text-primary font-bold hover:underline transition-colors">
                  Términos y Condiciones
                </Link>
              </p>
            </form>
          )}

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-semibold">o continúa como</span>
            </div>
          </div>

          {/* Guest Link */}
          <Link
            href="/"
            className="block w-full text-center border-2 border-gray-300 py-3 rounded-xl font-bold text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 transform hover:scale-105"
          >
            ✨ Explorar como Invitado
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={switchForm}
              className="text-primary font-bold hover:underline transition-colors"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
