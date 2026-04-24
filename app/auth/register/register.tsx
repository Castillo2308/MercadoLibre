'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { User, Mail, Lock, Phone } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (Object.values(formData).some((val) => !val)) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    console.log('Register:', formData);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061321] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(29,184,73,0.2),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(29,184,73,0.14),transparent_40%),linear-gradient(180deg,#061321_0%,#08192d_55%,#0b2137_100%)]" />
      <div className="pointer-events-none absolute -top-14 -left-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-floatCard" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-floatCard" style={{ animationDelay: '1.1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1d31]/85 p-8 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-md"
      >
        <h1 className="mb-2 text-center text-3xl font-black text-white animate-fadeInDown">Kivra</h1>
        <h2 className="mb-6 text-center text-2xl font-black text-primary animate-fadeInUp">Crear Cuenta</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/35 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200 animate-fadeInDown">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/75">Nombre Completo</label>
            <div className="group flex items-center rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
              <User size={18} className="mr-2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="w-full bg-transparent text-white placeholder:text-white/45 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white/75">Correo Electronico</label>
            <div className="group flex items-center rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
              <Mail size={18} className="mr-2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full bg-transparent text-white placeholder:text-white/45 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white/75">Telefono</label>
            <div className="group flex items-center rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
              <Phone size={18} className="mr-2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 123 456 789"
                className="w-full bg-transparent text-white placeholder:text-white/45 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white/75">Contrasena</label>
            <div className="group flex items-center rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
              <Lock size={18} className="mr-2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimo 6 caracteres"
                className="w-full bg-transparent text-white placeholder:text-white/45 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white/75">Confirmar Contrasena</label>
            <div className="group flex items-center rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
              <Lock size={18} className="mr-2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contrasena"
                className="w-full bg-transparent text-white placeholder:text-white/45 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Crear Cuenta
          </button>
        </form>

        <div className="mt-6 text-center text-white/70">
          <p>
            Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-semibold text-primary transition-colors hover:text-secondary">
              Inicia sesion aqui
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
