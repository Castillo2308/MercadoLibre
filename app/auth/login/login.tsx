'use client';

/**
 * login.tsx
 * 
 * Componente para la página de login/registro.
 * Incluye:
 * - Formulario de inicio de sesión
 * - Formulario de registro
 * - Validación de credenciales
 * - Manejo de errores
 * - Redirección después de autenticación
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigationLoader } from '@/components/NavigationLoaderProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import PhoneCountryInput from '@/components/PhoneCountryInput';

export default function Login() {
  const [formMode, setFormMode] = useState<'login' | 'register' | 'reset' | '2fa' | 'verify-register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, verifyLoginCode, register } = useAuth();
  const { startLoading } = useNavigationLoader();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const isLogin = formMode === 'login';
  const isRegister = formMode === 'register';
  const isTwoFa = formMode === '2fa';
  const isVerifyRegister = formMode === 'verify-register';

  useEffect(() => {
    const verify = searchParams.get('verify');
    if (verify === 'success') {
      setSuccessMessage('¡Tu cuenta fue verificada! Ya puedes iniciar sesión.');
    } else if (verify === 'expired') {
      setError('El enlace de verificación venció. Vuelve a registrarte o inicia sesión para recibir uno nuevo.');
    } else if (verify === 'invalid' || verify === 'missing' || verify === 'error') {
      setError('No pudimos verificar tu cuenta con ese enlace. Intenta iniciar sesión.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.requires2FA) {
        setSuccessMessage('Te enviamos un código de acceso a tu correo. Ingrésalo para continuar.');
        setFormMode('2fa');
        setLoading(false);
        return;
      }
      startLoading();
      router.push(redirectTo ? decodeURIComponent(redirectTo) : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginError'));
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!twoFaCode || twoFaCode.trim().length !== 6) {
      setError('Ingresa el código de 6 dígitos que te enviamos por correo');
      return;
    }

    setLoading(true);
    try {
      await verifyLoginCode(email, twoFaCode.trim());
      startLoading();
      router.push(redirectTo ? decodeURIComponent(redirectTo) : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido');
      setLoading(false);
    }
  };

  const handleVerifyRegisterCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!verifyCode || verifyCode.trim().length !== 6) {
      setError('Ingresa el código de 6 dígitos que te enviamos por correo');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verifyCode.trim() }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Código inválido');
      }

      setSuccessMessage('¡Cuenta verificada! Ya puedes iniciar sesión.');
      setFormMode('login');
      setPassword('');
      setVerifyCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setError(t('auth.fillAllFields'));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsMismatch'));
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
      });
      setSuccessMessage(`Te enviamos un código a ${email}. Ingrésalo para activar tu cuenta (o usa el enlace del correo).`);
      setFormMode('verify-register');
      setPassword('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerError'));
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError(t('auth.fillAllFields'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || t('auth.resetError'));
      }

      setSuccessMessage(payload?.message || t('auth.passwordUpdated'));
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setFormMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.resetError'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: 'login' | 'register' | 'reset' | '2fa' | 'verify-register') => {
    setError('');
    setSuccessMessage('');
    if (nextMode !== 'reset') {
      setEmail('');
    }
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setConfirmPassword('');
    setTwoFaCode('');
    setVerifyCode('');
    setShowPassword(false);
    setFormMode(nextMode);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061321] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,#061321_0%,#08192d_56%,#0b2137_100%)] dark:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(29,184,73,0.22),transparent_34%),radial-gradient(circle_at_85%_22%,rgba(29,184,73,0.14),transparent_38%)]" />
      <div className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-floatCard" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-72 w-72 rounded-full bg-blue-400/25 dark:bg-secondary/20 blur-3xl animate-floatCard" style={{ animationDelay: '1.2s' }} />

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
          <p className="mt-2 text-white/70">{isLogin ? t('auth.welcomeBack') : t('auth.joinCommunity')}</p>
        </div>

        {!isTwoFa && !isVerifyRegister && (
          <div className="mb-6 flex gap-3 rounded-xl border border-white/15 bg-white/5 p-1.5 animate-fadeInUp">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 rounded-lg px-4 py-3 text-base font-bold transition-all duration-300 ${
                isLogin
                  ? 'scale-105 bg-gradient-to-r from-primary to-primary-dark dark:to-secondary text-[#062012] shadow-[0_10px_24px_rgba(29,184,73,0.4)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t('auth.loginTab')}
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 rounded-lg px-4 py-3 text-base font-bold transition-all duration-300 ${
                isRegister
                  ? 'scale-105 bg-gradient-to-r from-primary to-primary-dark dark:to-secondary text-[#062012] shadow-[0_10px_24px_rgba(29,184,73,0.4)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t('auth.registerTab')}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-400/35 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200 animate-fadeInDown">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 animate-fadeInDown">
            {successMessage}
          </div>
        )}

        <div className="rounded-2xl border border-white/15 bg-[#0c1d31]/85 p-8 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-md animate-fadeInUp">
          {isTwoFa ? (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <p className="text-center text-sm text-white/70">
                Enviamos un código de 6 dígitos a <span className="font-semibold text-white">{email}</span>.
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Código de acceso</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-2xl font-black tracking-[0.6em] text-white placeholder:text-white/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? 'Verificando...' : 'Confirmar código'}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {t('auth.backToLogin')}
              </button>
            </form>
          ) : isVerifyRegister ? (
            <form onSubmit={handleVerifyRegisterCode} className="space-y-6">
              <p className="text-center text-sm text-white/70">
                Enviamos un código de 6 dígitos a <span className="font-semibold text-white">{email}</span> para activar tu cuenta.
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">Código de verificación</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-2xl font-black tracking-[0.6em] text-white placeholder:text-white/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? 'Verificando...' : 'Activar cuenta'}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {t('auth.backToLogin')}
              </button>
            </form>
          ) : isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.email')}</label>
                <div className="group relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.password')}</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-sm font-semibold text-primary transition-colors hover:text-secondary"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? t('auth.loggingIn') : t('auth.loginTab')}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          ) : isRegister ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/75">{t('auth.firstName')}</label>
                  <div className="group relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('auth.firstNamePlaceholder')}
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/75">{t('auth.lastName')}</label>
                  <div className="group relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('auth.lastNamePlaceholder')}
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/75">{t('auth.email')}</label>
                  <div className="group relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/75">{t('auth.phone')}</label>
                  <PhoneCountryInput value={phone} onChange={setPhone} placeholder="600 000 000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.password')}</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordMin6')}
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

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.confirmPassword')}</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 pr-12 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="text-center text-sm text-white/70">
                {t('auth.termsAgree')}{' '}
                <Link href="#" className="font-bold text-primary transition-colors hover:text-secondary">
                  {t('auth.termsLink')}
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.email')}</label>
                <div className="group relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.newPassword')}</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordMin6')}
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

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/75">{t('auth.confirmPassword')}</label>
                <div className="group relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmNewPasswordPlaceholder')}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-12 py-3 pr-12 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? t('auth.updatingPassword') : t('auth.changePassword')}
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {t('auth.backToLogin')}
              </button>
            </form>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/15" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#0c1d31] px-3 font-semibold text-white/60">{t('auth.orContinueAs')}</span>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full rounded-xl border border-white/20 bg-white/5 py-3 text-center font-bold text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:bg-primary/10"
          >
            {t('auth.exploreAsGuest')}
          </Link>
        </div>

        <div className="mt-7 text-center text-sm text-white/70 animate-fadeInUp">
          {!isTwoFa && !isVerifyRegister && (
          <p>
            {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <button
              onClick={() => switchMode(isLogin ? 'register' : 'login')}
              className="font-bold text-primary hover:text-secondary transition-colors"
            >
              {isLogin ? t('auth.registerHere') : t('auth.loginHere')}
            </button>
          </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
