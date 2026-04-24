'use client';

import { motion } from 'framer-motion';
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061321] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(29,184,73,0.22),transparent_34%),radial-gradient(circle_at_85%_22%,rgba(29,184,73,0.14),transparent_38%),linear-gradient(180deg,#061321_0%,#08192d_56%,#0b2137_100%)]" />
      <div className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-floatCard" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-floatCard" style={{ animationDelay: '1.2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-7 text-center animate-fadeInDown">
          <Link href="/" className="group inline-block">
            <div className="text-6xl font-black text-primary transition-transform duration-300 group-hover:scale-110">💚</div>
            <h1 className="mt-2 text-4xl font-black text-white">Kivra</h1>
          </Link>
          <p className="mt-2 text-white/70">{isLogin ? 'Bienvenido de vuelta' : 'Unete a nuestra comunidad'}</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-xl border border-white/15 bg-white/5 p-1.5 animate-fadeInUp">
          <button
            onClick={switchForm}
            className={`flex-1 rounded-lg px-4 py-3 text-base font-bold transition-all duration-300 ${
              isLogin
                ? 'scale-105 bg-gradient-to-r from-primary to-secondary text-[#062012] shadow-[0_10px_24px_rgba(29,184,73,0.4)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Inicia Sesion
          </button>
          <button
            onClick={switchForm}
            className={`flex-1 rounded-lg px-4 py-3 text-base font-bold transition-all duration-300 ${
              !isLogin
                ? 'scale-105 bg-gradient-to-r from-primary to-secondary text-[#062012] shadow-[0_10px_24px_rgba(29,184,73,0.4)]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Registrate
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-400/35 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200 animate-fadeInDown">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/15 bg-[#0c1d31]/85 p-8 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-md animate-fadeInUp">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Correo Electronico</label>
                <div className="group relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Contrasena</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contrasena"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 pr-12 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition-colors duration-300 hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? 'Iniciando sesion...' : 'Inicia Sesion'}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 font-semibold text-white/80 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-white"
              >
                Olvidaste tu contrasena?
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Nombre Completo</label>
                <div className="group relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Correo Electronico</label>
                <div className="group relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Contrasena</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 pr-12 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition-colors duration-300 hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="text-center text-sm text-white/70">
                Al registrarte aceptas nuestros{' '}
                <Link href="#" className="font-bold text-primary transition-colors hover:text-secondary">
                  Terminos y Condiciones
                </Link>
              </p>
            </form>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/15" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#0c1d31] px-3 font-semibold text-white/60">o continua como</span>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full rounded-xl border border-white/20 bg-white/5 py-3 text-center font-bold text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:bg-primary/10"
          >
            Explorar como Invitado
          </Link>
        </div>

        <div className="mt-7 text-center text-sm text-white/70 animate-fadeInUp">
          <p>
            {isLogin ? 'No tienes cuenta? ' : 'Ya tienes cuenta? '}
            <button onClick={switchForm} className="font-bold text-primary hover:text-secondary transition-colors">
              {isLogin ? 'Registrate aqui' : 'Inicia sesion aqui'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
