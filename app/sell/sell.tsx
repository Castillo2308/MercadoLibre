'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface ProductForm {
  title: string;
  category: string;
  condition: string;
  price: string;
  quantity: string;
  description: string;
  images: string[];
}

function SellContent() {
  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    category: 'electronics',
    condition: 'new',
    price: '',
    quantity: '',
    description: '',
    images: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product to sell:', formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vender</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Registra tu Producto</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del Producto *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: iPhone 13 Pro 256GB"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 10 caracteres</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="electronics">Electrónica</option>
              <option value="clothing">Ropa</option>
              <option value="home">Hogar</option>
              <option value="sports">Deportes</option>
              <option value="books">Libros</option>
              <option value="other">Otros</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="new">Nuevo</option>
              <option value="like-new">Como Nuevo</option>
              <option value="good">Buen Estado</option>
              <option value="fair">Estado Aceptable</option>
            </select>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio *
              </label>
              <div className="flex items-center">
                <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-l-lg border border-gray-300">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="1"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el estado, características y detalles del producto..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imágenes (Máximo 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                className="px-4 py-2 bg-secondary text-white rounded hover:opacity-90 transition"
              >
                Seleccionar Imágenes
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
            >
              Publicar Producto
            </button>
            <button
              type="button"
              className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Sell() {
  return (
    <ProtectedRoute>
      <SellContent />
    </ProtectedRoute>
  );
}
