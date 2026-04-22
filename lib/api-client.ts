// Utilities para consumir APIs del marketplace

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
