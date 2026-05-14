'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProductForm {
  title: string;
  category: string;
  condition: string;
  price: string;
  quantity: string;
  description: string;
  images: File[];
}

function SellContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const CATEGORY_LABELS: Record<string, string> = {
    electronics: 'Electrónica',
    clothing: 'Ropa',
    home: 'Hogar',
    sports: 'Deportes',
    books: 'Libros',
    other: 'Otros',
  };

  const CONDITION_LABELS: Record<string, string> = {
    'new': 'Nuevo',
    'like-new': 'Como Nuevo',
    'good': 'Buen Estado',
    'fair': 'Estado Aceptable',
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    const newImages = [...formData.images, ...files].slice(0, maxFiles);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

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

      // Crear FormData para enviar archivos
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('condition', formData.condition);
      uploadFormData.append('price', formData.price);
      uploadFormData.append('quantity', formData.quantity);
      uploadFormData.append('description', formData.description);

      // Agregar imágenes
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
      router.push('/explore');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al publicar el producto');
    } finally {
      setLoading(false);
    }
  };

  const sectionMotion = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45 },
  };

  const heroBadgesRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroBadgesRef.current || !formRef.current || !asideRef.current) return;

    gsap.fromTo(
      heroBadgesRef.current.children,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
    );

    gsap.fromTo(
      formRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );

    gsap.fromTo(
      asideRef.current.children,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.15 }
    );
  }, []);

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
      <div className="relative overflow-hidden border-b border-white/10 bg-[#091424] py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(29,184,73,0.18),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(255,214,0,0.18),transparent_42%),radial-gradient(circle_at_40%_90%,rgba(37,99,235,0.15),transparent_45%)]" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col gap-3"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Centro de vendedor</p>
            <h1 className="text-4xl font-black text-white md:text-5xl">Publica tu producto</h1>
            <p className="max-w-2xl text-sm text-white/70">
              Comparte los detalles clave, agrega fotos y define tu precio para llegar a mas compradores.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Detalles', 'Precio', 'Publicacion'].map((step, index) => (
                <div key={step} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/80">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
            <div ref={heroBadgesRef} className="mt-4 flex flex-wrap gap-3">
              {[
                { icon: Sparkles, label: 'Publicacion premium' },
                { icon: ShieldCheck, label: 'Ventas seguras' },
                { icon: Truck, label: 'Envio rapido' },
              ].map((item) => (
                <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                  <item.icon size={14} className="text-secondary" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <motion.div {...sectionMotion} ref={formRef}>
            <Card className="rounded-3xl border-white/12 bg-[#0c1d31]/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ffd600] to-secondary" />
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-black text-white">Registra tu producto</CardTitle>
                <Badge className="border-primary/30 bg-primary/10 text-primary">Paso 1 de 3</Badge>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-white/70">Detalles del producto</p>

                    <div>
                      <label className="block text-sm font-semibold text-white/75 mb-2">Titulo del Producto *</label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: iPhone 13 Pro 256GB"
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                        required
                      />
                      <p className="text-xs text-white/50 mt-1">Minimo 10 caracteres</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-white/75 mb-2">Categoria *</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCategoryOpen((s) => !s)}
                            className="w-full text-left rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:outline-none flex items-center justify-between"
                            aria-expanded={categoryOpen}
                          >
                            <span className="truncate">{CATEGORY_LABELS[formData.category] || 'Selecciona'}</span>
                            <span className="text-white/60">▾</span>
                          </button>
                          {categoryOpen && (
                            <div className="absolute z-30 mt-2 w-full rounded-xl bg-[#06131f] border border-white/10 shadow-lg overflow-hidden">
                              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => {
                                    setFormData((p) => ({ ...p, category: val }));
                                    setCategoryOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-white"
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/75 mb-2">Estado *</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setConditionOpen((s) => !s)}
                            className="w-full text-left rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:outline-none flex items-center justify-between"
                            aria-expanded={conditionOpen}
                          >
                            <span className="truncate">{CONDITION_LABELS[formData.condition] || 'Selecciona'}</span>
                            <span className="text-white/60">▾</span>
                          </button>
                          {conditionOpen && (
                            <div className="absolute z-30 mt-2 w-full rounded-xl bg-[#06131f] border border-white/10 shadow-lg overflow-hidden">
                              {Object.entries(CONDITION_LABELS).map(([val, label]) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => {
                                    setFormData((p) => ({ ...p, condition: val }));
                                    setConditionOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-white"
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

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-white/70">Precio e inventario</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-white/75 mb-2">Precio *</label>
                        <div className="flex items-center">
                          <span className="rounded-l-xl border border-white/15 bg-white/10 px-3 py-3 text-white/70">
                            $
                          </span>
                          <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="rounded-r-xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/75 mb-2">Cantidad *</label>
                        <Input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="1"
                          min="1"
                          className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-white/70">Descripcion</p>
                    <div>
                      <label className="block text-sm font-semibold text-white/75 mb-2">Descripcion del producto *</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe el estado, caracteristicas y detalles del producto..."
                        rows={6}
                        className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/45"
                        required
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-white/70">Imagenes</p>
                    <div>
                      <label className="block text-sm font-semibold text-white/75 mb-2">Imagenes (máximo 5)</label>
                      
                      {formData.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {formData.images.map((file, index) => (
                            <div
                              key={index}
                              className="relative rounded-lg border border-white/15 bg-white/5 overflow-hidden group"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-24 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="rounded-2xl border border-dashed border-white/25 bg-gradient-to-b from-white/10 to-white/5 p-8 text-center">
                        <Upload size={36} className="mx-auto text-white/40 mb-2" />
                        <p className="text-white/70 mb-4">Arrastra archivos aqui o haz clic para seleccionar</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="rounded-full border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
                        >
                          Seleccionar imagenes
                        </Button>
                        <p className="text-xs text-white/50 mt-2">
                          {formData.images.length}/5 imágenes subidas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl border border-primary/40 bg-gradient-to-r from-[#1ed760] via-[#19c44f] to-[#13b249] py-3 font-bold text-[#052012] shadow-[0_12px_26px_rgba(29,184,73,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Publicando...' : 'Publicar Producto'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-xl border-white/20 bg-white/5 py-3 font-semibold text-white/80 hover:bg-white/10"
                    >
                      Guardar Borrador
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <aside ref={asideRef} className="space-y-4">
            <motion.div {...sectionMotion} transition={{ duration: 0.45, delay: 0.05 }}>
              <Card className="rounded-2xl border-white/12 bg-[#0c1d31]/90 p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Tips</p>
                <h3 className="mt-2 text-lg font-black">Aumenta tus ventas</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li>Sube fotos claras y desde varios angulos.</li>
                  <li>Usa titulos descriptivos con marca y modelo.</li>
                  <li>Agrega detalles del estado y garantia.</li>
                </ul>
              </Card>
            </motion.div>

            <motion.div {...sectionMotion} transition={{ duration: 0.45, delay: 0.1 }}>
              <Card className="rounded-2xl border border-white/12 bg-gradient-to-br from-secondary/15 to-primary/15 p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reputacion</p>
                <h3 className="mt-2 text-lg font-black">Vende con confianza</h3>
                <p className="mt-3 text-sm text-white/70">
                  Responde rapido a los mensajes y mantente activo para mejorar tu visibilidad.
                </p>
              </Card>
            </motion.div>

            <motion.div {...sectionMotion} transition={{ duration: 0.45, delay: 0.15 }}>
              <Card className="rounded-2xl border border-white/12 bg-[#0c1d31]/90 p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Vista previa</p>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white truncate">{formData.title || 'Titulo de producto'}</p>
                  <p className="mt-2 text-2xl font-black text-primary">${formData.price || '0.00'}</p>
                  <p className="mt-1 text-xs text-white/55">{CATEGORY_LABELS[formData.category]} · {CONDITION_LABELS[formData.condition]}</p>
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
