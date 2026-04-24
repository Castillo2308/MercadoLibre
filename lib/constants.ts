// API endpoints configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
    SEARCH: `${API_BASE_URL}/products/search`,
    CATEGORIES: `${API_BASE_URL}/products/categories`,
    FEATURED: `${API_BASE_URL}/products/featured`,
  },

  // Users
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE: `${API_BASE_URL}/users/profile`,
    PURCHASES: `${API_BASE_URL}/users/purchases`,
    SALES: `${API_BASE_URL}/users/sales`,
  },

  // Cart
  CART: {
    LIST: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    REMOVE: `${API_BASE_URL}/cart/remove`,
    UPDATE: `${API_BASE_URL}/cart/update`,
    CLEAR: `${API_BASE_URL}/cart/clear`,
  },

  // Orders
  ORDERS: {
    LIST: `${API_BASE_URL}/orders`,
    CREATE: `${API_BASE_URL}/orders`,
    DETAIL: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: `${API_BASE_URL}/messages/conversations`,
    SEND: `${API_BASE_URL}/messages/send`,
    GET: (conversationId: string) => `${API_BASE_URL}/messages/${conversationId}`,
  },

  // Favorites
  FAVORITES: {
    LIST: `${API_BASE_URL}/favorites`,
    ADD: `${API_BASE_URL}/favorites/add`,
    REMOVE: `${API_BASE_URL}/favorites/remove`,
  },
};

// Constants
export const ITEMS_PER_PAGE = 20;
export const SHIPPING_THRESHOLD = 100;
export const SHIPPING_COST = 9.99;
export const TAX_RATE = 0.1;

// Categories
export const PRODUCT_CATEGORIES = [
  { value: 'electronics', label: 'Electrónica' },
  { value: 'clothing', label: 'Ropa y Calzado' },
  { value: 'home', label: 'Hogar' },
  { value: 'books', label: 'Libros' },
  { value: 'sports', label: 'Deportes' },
  { value: 'gaming', label: 'Videojuegos' },
  { value: 'audio', label: 'Audio y Música' },
  { value: 'photography', label: 'Fotografía' },
  { value: 'watches', label: 'Relojes' },
  { value: 'kitchen', label: 'Cocina' },
  { value: 'automotive', label: 'Automoción' },
  { value: 'other', label: 'Otros' },
];

// Product conditions
export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'Nuevo' },
  { value: 'like-new', label: 'Como Nuevo' },
  { value: 'good', label: 'Buen Estado' },
  { value: 'fair', label: 'Estado Aceptable' },
];

// Order status
export const ORDER_STATUS = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'credit-card', label: 'Tarjeta de Crédito' },
  { value: 'debit-card', label: 'Tarjeta de Débito' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank-transfer', label: 'Transferencia Bancaria' },
];
