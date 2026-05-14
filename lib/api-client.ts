/**
 * api-client.ts
 * 
 * Cliente centralizado para consumir APIs del servidor.
 * Contiene funciones reutilizables para hacer fetch a endpoints comunes
 * como productos, categorías, ofertas, carrito, etc.
 */

// Utilities para consumir APIs del marketplace

// Obtiene la lista completa de productos disponibles
export async function fetchProducts() {
  const res = await fetch('/api/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch('/api/categories', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchDeals() {
  const res = await fetch('/api/deals', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch deals');
  return res.json();
}
