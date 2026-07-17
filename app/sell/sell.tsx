'use client';

/**
 * sell.tsx
 *
 * Página para que vendedores publiquen nuevos productos.
 * Incluye:
 * - Formulario para ingresar datos del producto
 * - Campos para título, descripción, precio
 * - Subida de imágenes
 * - Selección de categoría
 * - Vista previa del producto
 * - Validación de formulario
 */

import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Flame,
  ImagePlus,
  Layers3,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useNavigationLoader } from '@/components/NavigationLoaderProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface ProductForm {
  title: string;
  category: string;
  condition: string;
  price: string;
  quantity: string;
  description: string;
  images: File[];
}

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Electrónica',
  clothing: 'Ropa',
  home: 'Hogar',
  sports: 'Deportes',
  books: 'Libros',
  other: 'Otros',
};

const CONDITION_LABELS: Record<string, string> = {
  new: 'Nuevo',
  'like-new': 'Como Nuevo',
  good: 'Buen Estado',
  fair: 'Estado Aceptable',
};

const CHECKLIST = [
  { icon: Layers3, title: 'Jerarquía clara', description: 'Cada bloque guía mejor al comprador.' },
  { icon: ImagePlus, title: 'Fotos destacadas', description: 'La portada y la galería tienen más presencia.' },
  { icon: Sparkles, title: 'Más conversión', description: 'Acciones visibles y diseño más profesional.' },
];

const editorSteps = [
  { id: 'basics', label: 'Base' },
  { id: 'pricing', label: 'Precio' },
  { id: 'media', label: 'Medios' },
  { id: 'review', label: 'Revisión' },
] as const;

function SellContent() {
  const { startLoading } = useNavigationLoader();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroBadgesRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    category: 'electronics',
    condition: 'new',
    price: '',
    quantity: '',
    description: '',
    images: [],
  });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<(typeof editorSteps)[number]['id']>('basics');
  const [coverPreview, setCoverPreview] = useState('');
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    const nextImages = [...formData.images, ...files].slice(0, maxFiles);
    setFormData((prev) => ({ ...prev, images: nextImages }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const publishReadiness = useMemo(() => {
    const filledFields = [formData.title, formData.price, formData.quantity, formData.description].filter(Boolean).length;
    const photoScore = Math.min(formData.images.length, 3);
    const totalScore = filledFields * 20 + photoScore * 10;
    return Math.min(100, totalScore);
  }, [formData.description, formData.images.length, formData.price, formData.quantity, formData.title]);

  const pricingSignal = useMemo(() => {
    const price = Number(formData.price || 0);
    if (!price) return 'Define un precio competitivo para activar la propuesta.';
    if (price < 25) return 'Precio de entrada ideal para rotación rápida.';
    if (price < 100) return 'Rango saludable para captar interés y margen.';
    return 'Precio premium: enfatiza la calidad en el texto y las fotos.';
  }, [formData.price]);

  const editorMood = useMemo(() => {
    if (publishReadiness >= 80) return 'Listo para publicar';
    if (publishReadiness >= 45) return 'En construcción';
    return 'Borrador visual';
  }, [publishReadiness]);

  useEffect(() => {
    if (!formData.images[0]) {
      setCoverPreview('');
      return;
    }

    const nextPreview = URL.createObjectURL(formData.images[0]);
    setCoverPreview(nextPreview);

    return () => {
      URL.revokeObjectURL(nextPreview);
    };
  }, [formData.images]);

  useEffect(() => {
    const nextUrls = formData.images.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(nextUrls);

    return () => {
      nextUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.images]);

  useEffect(() => {
    if (!heroBadgesRef.current || !formRef.current || !railRef.current) return;

    gsap.fromTo(heroBadgesRef.current.children, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' });
    gsap.fromTo(formRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.08 });
    gsap.fromTo(railRef.current.children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.12 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.title.length < 10) {
      alert('El título debe tener al menos 10 caracteres');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Ingresa un precio válido');
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      alert('Ingresa una cantidad válida');
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

      formData.images.forEach((file) => {
        uploadFormData.append('images', file);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Error al publicar el producto');
      }

      alert('¡Producto publicado exitosamente!');
      startLoading();
      router.push('/explore');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al publicar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071425] pb-16">
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="relative overflow-hidden border-b border-white/10 bg-[#091424] py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(29,184,73,0.18),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(255,214,0,0.18),transparent_42%),radial-gradient(circle_at_40%_90%,rgba(37,99,235,0.15),transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute -left-10 top-14 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-drift"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-drift-slow"
        />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col gap-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="premium-chip">
                <Package size={14} className="text-primary" /> Editor de publicación
              </span>
              <span className="premium-chip">
                <ShieldCheck size={14} className="text-secondary" /> Flujo seguro
              </span>
              <span className="premium-chip">
                <Truck size={14} className="text-primary" /> Listo para coordinar entrega
              </span>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
                Dale forma profesional a tu publicación
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                Este no es un formulario plano: es un editor de publicación con una jerarquía más fuerte, animación y un panel vivo para que el producto se vea listo para vender.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Estado</p>
                <p className="mt-1 text-lg font-black text-white">{editorMood}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Fotos</p>
                <p className="mt-1 text-lg font-black text-white">{formData.images.length} / 5</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Precio</p>
                <p className="mt-1 text-lg font-black text-white">{formData.price ? `$${formData.price}` : 'Sin definir'}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Progreso</p>
                <p className="mt-1 text-lg font-black text-primary">{publishReadiness}%</p>
              </div>
            </div>

            <div ref={heroBadgesRef} className="grid gap-3 md:grid-cols-3">
              {CHECKLIST.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <item.icon size={18} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/58">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            ref={formRef}
          >
            <Card className="surface-panel-strong overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary" />
              <CardHeader className="space-y-4 border-b border-white/10 bg-white/[0.03]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl font-black text-white md:text-3xl">Registra tu producto</CardTitle>
                    <p className="mt-1 text-sm text-white/55">Completa los bloques y la publicación se sentirá mucho más sólida.</p>
                  </div>
                  <Badge className="border-primary/30 bg-primary/10 text-primary">Paso 1 de 3</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-[#08192d]/70 p-2 sm:grid-cols-4">
                  {editorSteps.map((step) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        activeStep === step.id
                          ? 'bg-gradient-to-r from-primary to-secondary text-[#06131f] shadow-[0_10px_24px_rgba(29,184,73,0.28)]'
                          : 'text-white/65 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Estado</p>
                    <p className="mt-1 text-sm font-semibold text-white">{CONDITION_LABELS[formData.condition]}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Categoría</p>
                    <p className="mt-1 text-sm font-semibold text-white">{CATEGORY_LABELS[formData.category]}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Imágenes</p>
                    <p className="mt-1 text-sm font-semibold text-white">{formData.images.length}/5 cargadas</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/45">
                    <span>Progreso de publicación</span>
                    <span>{publishReadiness}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary transition-all duration-500"
                      style={{ width: `${publishReadiness}%` }}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white/75">1. Información principal</p>
                        <span className="text-xs text-white/45">Título, categoría y estado</span>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-white/75">Título del producto *</label>
                          <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ej: iPhone 13 Pro 256GB"
                            className="rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                            required
                          />
                          <p className="mt-1 text-xs text-white/50">Usa marca, modelo o detalles concretos para destacar más.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-white/75">Categoría *</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setCategoryOpen((current) => !current)}
                                className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-white transition hover:border-white/20 hover:bg-white/10"
                                aria-expanded={categoryOpen}
                              >
                                <span className="truncate">{CATEGORY_LABELS[formData.category]}</span>
                                <ChevronDown size={16} className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {categoryOpen && (
                                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#06131f] shadow-lg">
                                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, category: value }));
                                        setCategoryOpen(false);
                                      }}
                                      className="w-full px-4 py-3 text-left text-white transition hover:bg-white/5"
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-white/75">Estado *</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setConditionOpen((current) => !current)}
                                className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-white transition hover:border-white/20 hover:bg-white/10"
                                aria-expanded={conditionOpen}
                              >
                                <span className="truncate">{CONDITION_LABELS[formData.condition]}</span>
                                <ChevronDown size={16} className={`transition-transform ${conditionOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {conditionOpen && (
                                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#06131f] shadow-lg">
                                  {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, condition: value }));
                                        setConditionOpen(false);
                                      }}
                                      className="w-full px-4 py-3 text-left text-white transition hover:bg-white/5"
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-secondary/15 via-white/[0.04] to-primary/10 p-4">
                      <p className="text-sm font-semibold text-white/75">2. Resumen rápido</p>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Impacto</p>
                          <p className="mt-1 text-sm font-semibold text-white">{publishReadiness >= 80 ? 'Alta probabilidad de conversión' : 'Aún puedes mejorar la presentación'}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Precio</p>
                          <p className="mt-1 text-sm font-semibold text-white">{pricingSignal}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <Separator className="bg-white/10" />

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/75">3. Precio y stock</p>
                      <span className="text-xs text-white/45">Hazlo claro y directo</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/75">Precio *</label>
                        <div className="flex items-stretch">
                          <span className="rounded-l-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/70">$</span>
                          <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="rounded-l-none rounded-r-2xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/75">Cantidad *</label>
                        <Input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="1"
                          min="1"
                          className="rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/75">4. Descripción</p>
                      <span className="text-xs text-white/45">Cuenta la historia del producto</span>
                    </div>
                    <label className="mb-2 block text-sm font-semibold text-white/75">Descripción del producto *</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe el estado, características y detalles del producto..."
                      rows={7}
                      className="rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                      required
                    />
                    <p className="mt-2 text-xs text-white/50">Una descripción bien escrita mejora la confianza y reduce preguntas repetidas.</p>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/75">5. Imágenes</p>
                      <span className="text-xs text-white/45">Máximo 5 fotos</span>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
                      <div>
                        {imagePreviewUrls.length > 0 && (
                          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {imagePreviewUrls.map((url, index) => (
                              <motion.div
                                key={`${url}-${index}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index}`}
                                  className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute right-2 top-2 rounded-full bg-red-500/85 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X size={14} className="text-white" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        <div className="rounded-[1.75rem] border border-dashed border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-7 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
                            <Upload size={28} />
                          </div>
                          <p className="mt-4 text-white/80">Arrastra archivos aquí o haz clic para seleccionar</p>
                          <p className="mt-1 text-xs text-white/50">JPG, PNG o WEBP. Puedes subir hasta cinco imágenes.</p>
                          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="mt-4 rounded-full border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
                          >
                            Seleccionar imágenes
                          </Button>
                          <p className="mt-2 text-xs text-white/50">{formData.images.length}/5 imágenes subidas</p>
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] border border-white/10 bg-[#06131f] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Portada en vivo</p>
                          <Star size={14} className="text-primary" />
                        </div>
                        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          {coverPreview ? (
                            <img src={coverPreview} alt="Portada del producto" className="h-48 w-full object-cover" />
                          ) : (
                            <div className="flex h-48 items-center justify-center text-center text-white/45">
                              <div>
                                <Upload size={24} className="mx-auto mb-2 text-primary" />
                                <p className="text-sm">Agrega una foto para ver la portada aquí.</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Imágenes cargadas</p>
                            <p className="mt-1 text-sm font-semibold text-white">{formData.images.length} archivos seleccionados</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Recomendación</p>
                            <p className="mt-1 text-sm font-semibold text-white">Pon la imagen más fuerte primero.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" disabled={loading} className="premium-cta flex-1 text-base">
                      {loading ? 'Publicando...' : 'Publicar producto'}
                      <ArrowRight size={18} />
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 rounded-2xl border-white/20 bg-white/5 py-3 font-semibold text-white/80 hover:bg-white/10">
                      Guardar borrador
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <aside ref={railRef} className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
              <Card className="surface-panel p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Panel de estado</p>
                <h3 className="mt-2 text-lg font-black">Tu publicación en vivo</h3>
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/45">
                    <span>Preparación</span>
                    <span>{publishReadiness}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary transition-all duration-500"
                      style={{ width: `${publishReadiness}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Lectura rápida</p>
                    <p className="mt-1 text-sm font-semibold text-white">{pricingSignal}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Conversión</p>
                    <p className="mt-1 text-sm font-semibold text-white">Más espacio, menos ruido y mejor foco en la oferta.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              <Card className="surface-panel border-white/12 bg-gradient-to-br from-secondary/15 to-primary/15 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Sugerencia</p>
                <h3 className="mt-2 text-lg font-black">Publica con intención</h3>
                <div className="mt-4 space-y-3 text-sm text-white/72">
                  <p>• Usa un título que combine marca, modelo y detalle.</p>
                  <p>• Coloca las fotos más fuertes en la parte superior.</p>
                  <p>• Describe beneficios, no solo características.</p>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.13 }}>
              <Card className="surface-panel p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Publicación rápida</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Categoría</p>
                    <p className="mt-1 text-sm font-semibold text-white">{CATEGORY_LABELS[formData.category]}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Estado</p>
                    <p className="mt-1 text-sm font-semibold text-white">{CONDITION_LABELS[formData.condition]}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
              <Card className="surface-panel p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Vista previa</p>
                <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_36px_rgba(0,0,0,0.22)]">
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-[#071425]">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Vista previa del producto" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-white/45">
                        <div>
                          <ImagePlus size={26} className="mx-auto mb-2 text-primary" />
                          <p className="text-sm">La portada aparecerá aquí.</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-[#071425]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                      {CATEGORY_LABELS[formData.category]}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {formData.title || 'Título de producto'}
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          {CONDITION_LABELS[formData.condition]} · {formData.quantity || '1'} unidad(es)
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <Flame size={18} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Precio</p>
                        <p className="text-3xl font-black text-primary">${formData.price || '0.00'}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Calidad</p>
                        <p className="text-sm font-semibold text-white">{publishReadiness >= 80 ? 'Alta' : 'En progreso'}</p>
                      </div>
                    </div>

                    <Separator className="my-4 bg-white/10" />

                    <p className="text-sm leading-relaxed text-white/65 line-clamp-4">
                      {formData.description || 'Escribe una descripción atractiva para aumentar la conversión.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
              <Card className="surface-panel p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Checklist visual</p>
                <div className="mt-4 space-y-3">
                  {CHECKLIST.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-primary">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="text-xs text-white/55">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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