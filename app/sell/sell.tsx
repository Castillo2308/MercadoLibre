'use client';

/**
 * sell.tsx
 *
 * Página para que vendedores publiquen nuevos productos.
 * Wizard real de 4 pasos (solo se muestra el paso activo), drag & drop
 * de imágenes con reordenamiento, vista previa con tilt 3D, y feedback
 * vía toasts + animación de publicación exitosa.
 */

import { AnimatePresence, motion, useMotionValue, useSpring, Reorder } from 'framer-motion';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  DollarSign,
  GripVertical,
  ImagePlus,
  Layers,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useNavigationLoader } from '@/components/NavigationLoaderProvider';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import type { TranslationKey } from '@/lib/i18n';
import { formatCRC } from '@/lib/utils';

interface ProductForm {
  title: string;
  category: string;
  condition: string;
  price: string;
  quantity: string;
  description: string;
  images: File[];
}

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  'laptops-pc': 'sell.category.laptops-pc',
  celulares: 'sell.category.celulares',
  gaming: 'sell.category.gaming',
  audio: 'sell.category.audio',
  hogar: 'sell.category.hogar',
  moda: 'sell.category.moda',
  accesorios: 'sell.category.accesorios',
  belleza: 'sell.category.belleza',
  movilidad: 'sell.category.movilidad',
  ciclismo: 'sell.category.ciclismo',
  fitness: 'sell.category.fitness',
  deportes: 'sell.category.deportes',
};

const CONDITION_KEYS: Record<string, TranslationKey> = {
  new: 'sell.condition.new',
  'like-new': 'sell.condition.like-new',
  good: 'sell.condition.good',
  fair: 'sell.condition.fair',
};

const editorSteps = [
  { id: 'basics', labelKey: 'sell.step.basics' },
  { id: 'pricing', labelKey: 'sell.step.pricing' },
  { id: 'media', labelKey: 'sell.step.media' },
  { id: 'review', labelKey: 'sell.step.review' },
] as const;

type StepId = (typeof editorSteps)[number]['id'];

function TiltPreview({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(py * -10);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function StepRail({ activeStep, completed, onSelect, t }: { activeStep: StepId; completed: Record<StepId, boolean>; onSelect: (s: StepId) => void; t: (key: TranslationKey) => string }) {
  const activeIndex = editorSteps.findIndex((s) => s.id === activeStep);
  return (
    <div className="flex items-center">
      {editorSteps.map((step, idx) => {
        const isActive = step.id === activeStep;
        const isDone = completed[step.id];
        return (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              className="group flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  backgroundColor: isActive ? 'rgba(29,184,73,1)' : isDone ? 'rgba(29,184,73,0.25)' : 'rgba(255,255,255,0.08)',
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sm font-bold text-white"
              >
                {isDone && !isActive ? <Check size={16} className="text-primary" /> : idx + 1}
              </motion.div>
              <span className={`text-xs font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/45 group-hover:text-white/70'}`}>
                {t(step.labelKey)}
              </span>
            </button>
            {idx < editorSteps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-primary"
                  initial={false}
                  animate={{ width: idx < activeIndex ? '100%' : '0%' }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SellContent() {
  const { startLoading } = useNavigationLoader();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    category: 'laptops-pc',
    condition: 'new',
    price: '',
    quantity: '',
    description: '',
    images: [],
  });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<StepId>('basics');
  const [coverPreview, setCoverPreview] = useState('');
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (incoming: FileList | File[]) => {
    const files = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files].slice(0, 5) }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const publishReadiness = useMemo(() => {
    const filledFields = [formData.title, formData.price, formData.quantity, formData.description].filter(Boolean).length;
    const photoScore = Math.min(formData.images.length, 3);
    const totalScore = filledFields * 20 + photoScore * 10;
    return Math.min(100, totalScore);
  }, [formData.description, formData.images.length, formData.price, formData.quantity, formData.title]);

  const pricingSignal = useMemo(() => {
    const price = Number(formData.price || 0);
    if (!price) return t('sell.pricing.noPrice');
    if (price < 25) return t('sell.pricing.lowPrice');
    if (price < 100) return t('sell.pricing.midPrice');
    return t('sell.pricing.highPrice');
  }, [formData.price, t]);

  const completed: Record<StepId, boolean> = {
    basics: formData.title.length >= 10 && Boolean(formData.category) && Boolean(formData.condition),
    pricing: Number(formData.price) > 0 && Number(formData.quantity) > 0,
    media: formData.description.length > 0,
    review: false,
  };

  const stepIndex = editorSteps.findIndex((s) => s.id === activeStep);

  const goNext = () => {
    if (!completed[activeStep] && activeStep !== 'review') {
      toast.error(t('sell.toast.completeStep'));
      return;
    }
    const next = editorSteps[stepIndex + 1];
    if (next) setActiveStep(next.id);
  };
  const goBack = () => {
    const prev = editorSteps[stepIndex - 1];
    if (prev) setActiveStep(prev.id);
  };

  useEffect(() => {
    if (!formData.images[0]) {
      setCoverPreview('');
      return;
    }
    const nextPreview = URL.createObjectURL(formData.images[0]);
    setCoverPreview(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [formData.images]);

  useEffect(() => {
    const nextUrls = formData.images.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(nextUrls);
    return () => nextUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [formData.images]);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.title.length < 10) {
      toast.error(t('sell.toast.titleMinLength'));
      setActiveStep('basics');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error(t('sell.toast.validPrice'));
      setActiveStep('pricing');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error(t('sell.toast.validQuantity'));
      setActiveStep('pricing');
      return;
    }

    try {
      setLoading(true);

      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('condition', formData.condition);
      uploadFormData.append('price', formData.price);
      uploadFormData.append('quantity', formData.quantity);
      uploadFormData.append('description', formData.description);
      formData.images.forEach((file) => uploadFormData.append('images', file));

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: user?.id ? { 'X-User-ID': user.id } : undefined,
        body: uploadFormData,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || t('sell.toast.publishError'));
      }

      setPublished(true);
      startLoading();
      window.setTimeout(() => router.push('/explore'), 1200);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : t('sell.toast.publishError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071425] pb-16">
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      <div ref={heroRef} className="relative overflow-hidden border-b border-white/10 bg-[#091424] py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(29,184,73,0.18),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(255,214,0,0.18),transparent_42%),radial-gradient(circle_at_40%_90%,rgba(37,99,235,0.15),transparent_45%)]" />
        <div className="pointer-events-none absolute -left-10 top-14 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-drift" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-blue-400/25 dark:bg-secondary/20 blur-3xl animate-drift-slow" />

        <div className="container mx-auto px-4">
          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="premium-chip"><Package size={14} className="text-primary" /> {t('sell.hero.badgeEditor')}</span>
              <span className="premium-chip"><ShieldCheck size={14} className="text-secondary" /> {t('sell.hero.badgeSecure')}</span>
              <span className="premium-chip"><Truck size={14} className="text-primary" /> {t('sell.hero.badgeDelivery')}</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
                {t('sell.hero.title')}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                {t('sell.hero.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Card className="surface-panel-strong overflow-hidden p-0">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary" />

              <div className="relative space-y-6 overflow-hidden border-b border-white/10 bg-gradient-to-br from-primary/[0.07] via-transparent to-[#ffd600]/[0.06] p-5 dark:from-white/[0.03] dark:to-white/[0.02] md:p-7">
                <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Package size={20} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white md:text-3xl">{t('sell.registerProduct')}</h2>
                      <p className="mt-0.5 text-sm text-white/55">{t('sell.readinessPercent', { pct: publishReadiness })}</p>
                    </div>
                  </div>
                  <Badge className="border-primary/30 bg-primary/10 text-primary">{t('sell.stepOf', { current: stepIndex + 1, total: editorSteps.length })}</Badge>
                </div>

                <StepRail activeStep={activeStep} completed={completed} onSelect={setActiveStep} t={t} />
              </div>

              <form onSubmit={handleSubmit} className="p-5 md:p-7">
                <div>
                  {activeStep === 'basics' && (
                    <motion.div
                      key="basics"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Layers size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t('sell.basicsIntroTitle')}</p>
                          <p className="text-xs text-white/50">{t('sell.basicsIntroText')}</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/75">
                          <Package size={14} className="text-primary" />
                          {t('sell.titleLabel')}
                        </label>
                        <div className="group relative">
                          <Package size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors duration-300 group-focus-within:text-primary" />
                          <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={t('sell.titlePlaceholder')}
                            className="h-12 rounded-2xl border-white/15 bg-white/5 pl-12 text-white placeholder:text-white/45 transition-all duration-300 focus-visible:border-primary/60 focus-visible:bg-white/[0.07] focus-visible:ring-primary/30"
                            required
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-white/50">{t('sell.titleHint', { count: formData.title.length })}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/75">
                            <Tag size={14} className="text-primary" />
                            {t('sell.categoryLabel')}
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setCategoryOpen((c) => !c)}
                              className={`flex h-12 w-full items-center justify-between gap-2 rounded-2xl border bg-white/5 px-4 text-left text-white transition-all duration-300 hover:border-white/25 hover:bg-white/10 ${
                                categoryOpen ? 'border-primary/50 bg-white/[0.08] shadow-[0_0_0_3px_rgba(29,184,73,0.15)]' : 'border-white/15'
                              }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <Layers size={15} className="flex-shrink-0 text-primary/80" />
                                {t(CATEGORY_KEYS[formData.category])}
                              </span>
                              <ChevronDown size={16} className={`flex-shrink-0 text-white/50 transition-transform duration-300 ${categoryOpen ? 'rotate-180 text-primary' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {categoryOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#06131f] p-1.5 shadow-2xl"
                                >
                                  {Object.entries(CATEGORY_KEYS).map(([value, key]) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, category: value }));
                                        setCategoryOpen(false);
                                      }}
                                      className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm text-white transition-colors ${
                                        formData.category === value ? 'bg-primary/15 text-primary' : 'hover:bg-white/5'
                                      }`}
                                    >
                                      {t(key)}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/75">
                            <BadgeCheck size={14} className="text-primary" />
                            {t('sell.conditionLabel')}
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setConditionOpen((c) => !c)}
                              className={`flex h-12 w-full items-center justify-between gap-2 rounded-2xl border bg-white/5 px-4 text-left text-white transition-all duration-300 hover:border-white/25 hover:bg-white/10 ${
                                conditionOpen ? 'border-primary/50 bg-white/[0.08] shadow-[0_0_0_3px_rgba(29,184,73,0.15)]' : 'border-white/15'
                              }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <BadgeCheck size={15} className="flex-shrink-0 text-primary/80" />
                                {t(CONDITION_KEYS[formData.condition])}
                              </span>
                              <ChevronDown size={16} className={`flex-shrink-0 text-white/50 transition-transform duration-300 ${conditionOpen ? 'rotate-180 text-primary' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {conditionOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#06131f] p-1.5 shadow-2xl"
                                >
                                  {Object.entries(CONDITION_KEYS).map(([value, key]) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, condition: value }));
                                        setConditionOpen(false);
                                      }}
                                      className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm text-white transition-colors ${
                                        formData.condition === value ? 'bg-primary/15 text-primary' : 'hover:bg-white/5'
                                      }`}
                                    >
                                      {t(key)}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <DollarSign size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t('sell.pricingIntroTitle')}</p>
                          <p className="text-xs text-white/50">{t('sell.pricingIntroText')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/75">
                            <DollarSign size={14} className="text-primary" />
                            {t('sell.priceLabel')}
                          </label>
                          <div className="flex h-12 items-stretch overflow-hidden rounded-2xl border border-white/15 bg-white/5 transition-all duration-300 focus-within:border-primary/60 focus-within:bg-white/[0.07]">
                            <span className="flex items-center border-r border-white/10 bg-white/5 px-4 font-semibold text-primary">₡</span>
                            <Input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="15000"
                              step="1"
                              className="h-full flex-1 rounded-none border-0 bg-transparent text-white placeholder:text-white/45 focus-visible:ring-0"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white/75">
                            <Layers size={14} className="text-primary" />
                            {t('sell.quantityLabel')}
                          </label>
                          <Input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="1"
                            min="1"
                            className="h-12 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/45 transition-all duration-300 focus-visible:border-primary/60 focus-visible:bg-white/[0.07] focus-visible:ring-primary/30"
                            required
                          />
                        </div>
                      </div>

                      <motion.div
                        key={pricingSignal}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-gradient-to-br from-secondary/15 via-white/[0.04] to-primary/10 p-4"
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{t('sell.pricingReading')}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{pricingSignal}</p>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeStep === 'media' && (
                    <motion.div
                      key="media"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ImagePlus size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t('sell.mediaIntroTitle')}</p>
                          <p className="text-xs text-white/50">{t('sell.mediaIntroText')}</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/75">{t('sell.descriptionLabel')}</label>
                        <Textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder={t('sell.descriptionPlaceholder')}
                          rows={6}
                          className="rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                          required
                        />
                      </div>

                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <label className="text-sm font-semibold text-white/75">{t('sell.imagesLabel')}</label>
                          <span className="text-xs text-white/45">{t('sell.imagesReorderHint', { count: formData.images.length })}</span>
                        </div>

                        {imagePreviewUrls.length > 0 && (
                          <Reorder.Group
                            axis="x"
                            values={formData.images}
                            onReorder={(newOrder) => setFormData((prev) => ({ ...prev, images: newOrder }))}
                            className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5"
                          >
                            {formData.images.map((file, index) => (
                              <Reorder.Item
                                key={`${file.name}-${file.lastModified}-${index}`}
                                value={file}
                                className="group relative cursor-grab overflow-hidden rounded-2xl border border-white/15 bg-white/5 active:cursor-grabbing"
                                whileDrag={{ scale: 1.06, zIndex: 10, boxShadow: '0 18px 30px rgba(0,0,0,0.5)' }}
                              >
                                <img src={imagePreviewUrls[index]} alt={`Preview ${index}`} className="h-24 w-full object-cover" draggable={false} />
                                {index === 0 && (
                                  <span className="absolute left-1.5 top-1.5 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold text-[#052012]">{t('sell.cover')}</span>
                                )}
                                <div className="absolute right-1.5 top-1.5 text-white/50">
                                  <GripVertical size={14} />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute right-1.5 bottom-1.5 rounded-full bg-red-500/85 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X size={12} className="text-white" />
                                </button>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        )}

                        <div
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className={`rounded-[1.75rem] border border-dashed p-7 text-center transition-all duration-200 ${
                            isDragging
                              ? 'scale-[1.02] border-primary bg-primary/10'
                              : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5'
                          }`}
                        >
                          <motion.div
                            animate={isDragging ? { y: [-2, 2, -2] } : { y: 0 }}
                            transition={{ duration: 0.6, repeat: isDragging ? Infinity : 0 }}
                            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary"
                          >
                            <Upload size={28} />
                          </motion.div>
                          <p className="mt-4 text-white/80">
                            {isDragging ? t('sell.dropHere') : t('sell.dragOrClick')}
                          </p>
                          <p className="mt-1 text-xs text-white/50">{t('sell.fileTypesHint')}</p>
                          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="mt-4 rounded-full border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
                          >
                            {t('sell.selectImages')}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 'review' && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <BadgeCheck size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t('sell.reviewIntroTitle')}</p>
                          <p className="text-xs text-white/50">{t('sell.reviewIntroText')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { label: t('sell.review.title'), value: formData.title || '—', ok: completed.basics, icon: BadgeCheck },
                          { label: t('sell.review.price'), value: formData.price ? formatCRC(formData.price) : '—', ok: completed.pricing, icon: Sparkles },
                          { label: t('sell.review.description'), value: formData.description ? t('sell.review.ready') : '—', ok: completed.media, icon: Package },
                          { label: t('sell.review.photos'), value: `${formData.images.length}/5`, ok: formData.images.length > 0, icon: ImagePlus },
                        ].map((item, i) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={`relative overflow-hidden rounded-2xl border p-3 pl-4 ${
                              item.ok ? 'border-primary/25 bg-primary/[0.06]' : 'border-white/10 bg-white/5'
                            }`}
                          >
                            <span className={`absolute left-0 top-0 h-full w-1 ${item.ok ? 'bg-primary' : 'bg-white/15'}`} />
                            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/45">
                              <item.icon size={11} className={item.ok ? 'text-primary' : 'text-white/40'} />
                              {item.label}
                            </div>
                            <p className="mt-1 truncate text-sm font-semibold text-white">{item.value}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                        <AnimatePresence>
                          {published && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0d1c31]"
                            >
                              <motion.svg width="56" height="56" viewBox="0 0 56 56">
                                <motion.circle
                                  cx="28" cy="28" r="25" fill="none" stroke="#1DB849" strokeWidth="3"
                                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                                />
                                <motion.path
                                  d="M17 29l7 7 15-15" fill="none" stroke="#1DB849" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4 }}
                                />
                              </motion.svg>
                              <p className="font-bold text-white">{t('sell.published')}</p>
                              <p className="text-sm text-white/50">{t('sell.redirecting')}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <p className="text-sm text-white/60">{t('sell.reviewSummaryHint')}</p>
                      </div>

                      <Button type="submit" disabled={loading} className="premium-cta w-full text-base">
                        {loading ? t('sell.publishing') : t('sell.publishProduct')}
                        <ArrowRight size={18} />
                      </Button>
                    </motion.div>
                  )}
                </div>

                {activeStep !== 'review' && (
                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={stepIndex === 0}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:text-white disabled:opacity-30"
                    >
                      <ArrowLeft size={16} /> {t('sell.back')}
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#052012] transition hover:brightness-105"
                    >
                      {t('sell.next')} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </form>
            </Card>
          </motion.div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
              <TiltPreview>
                <Card className="surface-panel overflow-hidden p-0 text-white shadow-[0_24px_50px_rgba(0,0,0,0.35)]" style={{ transform: 'translateZ(30px)' }}>
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-[#071425]">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Vista previa del producto" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-white/45">
                        <div>
                          <ImagePlus size={26} className="mx-auto mb-2 text-primary" />
                          <p className="text-sm">{t('sell.coverAppearsHere')}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-[#071425]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                      {t(CATEGORY_KEYS[formData.category])}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-white">{formData.title || t('sell.productTitleFallback')}</p>
                    <p className="mt-1 text-xs text-white/55">
                      {t(CONDITION_KEYS[formData.condition])} · {formData.quantity || '1'} {Number(formData.quantity || '1') !== 1 ? t('sell.units') : t('sell.unit')}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-3xl font-black text-primary">{formData.price ? formatCRC(formData.price) : formatCRC(0)}</p>
                      <div className="flex items-center gap-1 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="fill-primary" />
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-white/65 line-clamp-3">
                      {formData.description || t('sell.descriptionFallback')}
                    </p>
                  </div>
                </Card>
              </TiltPreview>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              <Card className="surface-panel overflow-hidden p-0 text-white">
                <div className="h-1 w-full bg-gradient-to-r from-secondary via-[#ffd600] to-primary" />
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t('sell.publishWithIntention')}</p>
                  </div>
                  <div className="mt-4 space-y-3.5 text-sm text-white/72">
                    {[
                      { icon: BadgeCheck, text: t('sell.tip1') },
                      { icon: ImagePlus, text: t('sell.tip2') },
                      { icon: Package, text: t('sell.tip3') },
                    ].map((tip, idx) => (
                      <div key={tip.text} className="flex items-start gap-3">
                        <div className="relative mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                          <tip.icon size={13} />
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-[#052012]">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="pt-0.5">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between text-xs text-white/45">
                    <span>{t('sell.overallProgress')}</span>
                    <span className="font-bold text-white">{publishReadiness}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary"
                      animate={{ width: `${publishReadiness}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function Sell() {
  return (
    <ProtectedRoute>
      <SellContent />
    </ProtectedRoute>
  );
}
