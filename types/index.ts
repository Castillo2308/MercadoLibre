// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  joinDate: Date;
  rating: number;
  reviews: number;
  isVerified: boolean;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
  rating: number;
  reviews: number;
  sellerId: string;
  seller: User;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
}

export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'home'
  | 'books'
  | 'sports'
  | 'gaming'
  | 'audio'
  | 'photography'
  | 'watches'
  | 'kitchen'
  | 'automotive'
  | 'other';

export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Address Types
export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Payment Types
export type PaymentMethod = 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer';

// Message Types
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  text: string;
  images?: string[];
  isRead: boolean;
  createdAt: Date;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: Date;
}

// Favorite Types
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

// Listing Types (for sellers)
export interface Listing {
  id: string;
  sellerId: string;
  product: Product;
  views: number;
  favorites: number;
  sales: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Search Filter Types
export interface SearchFilters {
  query?: string;
  category?: ProductCategory;
  priceRange?: {
    min: number;
    max: number;
  };
  condition?: ProductCondition;
  rating?: number;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
