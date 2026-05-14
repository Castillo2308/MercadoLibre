'use client';

/**
 * useShoppingCart.ts
 * 
 * Hook personalizado para gestionar el carrito de compras.
 * Sincroniza automáticamente entre localStorage y la API del servidor.
 * Soporta usuarios autenticados y no autenticados (invitados).
 * Permite agregar/remover productos, actualizar cantidades y calcular totales.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  dbItemId?: string;
}

interface ServerCartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: string | number;
    mainImageUrl: string | null;
    seller: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

const CART_SYNC_EVENT = 'kivra:cart-sync';

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { isAuthenticated, isAuthReady, user } = useAuth();

  const storageKey = useMemo(
    () => (user?.id ? `cart:${user.id}` : 'cart:guest'),
    [user?.id]
  );

  const persistAndBroadcast = useCallback(
    (nextCart: CartItem[]) => {
      setCart(nextCart);
      localStorage.setItem(storageKey, JSON.stringify(nextCart));
      window.dispatchEvent(
        new CustomEvent(CART_SYNC_EVENT, {
          detail: { key: storageKey, cart: nextCart },
        })
      );
    },
    [storageKey]
  );

  const mapServerItems = useCallback((items: ServerCartItem[]): CartItem[] => {
    return items.map((item) => ({
      id: item.product.id,
      dbItemId: item.id,
      name: item.product.title,
      price: Number(item.product.price),
      quantity: item.quantity,
      imageUrl: item.product.mainImageUrl || undefined,
      sellerId: item.product.seller.id,
      sellerEmail: item.product.seller.email,
      sellerName: `${item.product.seller.firstName} ${item.product.seller.lastName}`.trim(),
    }));
  }, []);

  const fetchServerCart = useCallback(async (): Promise<CartItem[]> => {
    if (!isAuthenticated || !user?.id) return [];
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'X-User-ID': user.id,
        },
        cache: 'no-store',
      });

      if (!response.ok) return [];
      const payload = await response.json();
      return mapServerItems((payload.items || []) as ServerCartItem[]);
    } catch {
      return [];
    }
  }, [isAuthenticated, mapServerItems, user?.id]);

  useEffect(() => {
    const localCart = safeParseCart(localStorage.getItem(storageKey));
    setCart(localCart);
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setCart(safeParseCart(event.newValue));
      }
    };

    const onSync = (event: Event) => {
      const custom = event as CustomEvent<{ key: string; cart: CartItem[] }>;
      if (custom.detail?.key === storageKey) {
        setCart(custom.detail.cart || []);
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(CART_SYNC_EVENT, onSync as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CART_SYNC_EVENT, onSync as EventListener);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated || !user?.id) return;

    const syncUserCart = async () => {
      const guestItems = safeParseCart(localStorage.getItem('cart:guest'));

      if (guestItems.length > 0) {
        for (const item of guestItems) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-ID': user.id,
            },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.quantity,
            }),
          });
        }
        localStorage.removeItem('cart:guest');
      }

      const serverCart = await fetchServerCart();
      persistAndBroadcast(serverCart);
    };

    syncUserCart();
  }, [isAuthReady, isAuthenticated, user?.id, fetchServerCart, persistAndBroadcast]);

  const addToCart = useCallback(
    (
      id: string | number,
      name: string,
      price: number,
      quantity: number = 1,
      meta?: Pick<CartItem, 'imageUrl' | 'sellerId' | 'sellerName' | 'sellerEmail'>
    ) => {
      const normalizedId = String(id);

      const next = (() => {
        const existingItem = cart.find((item) => item.id === normalizedId);
        if (existingItem) {
          return cart.map((item) =>
            item.id === normalizedId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...cart,
          {
            id: normalizedId,
            name,
            price,
            quantity,
            ...meta,
          },
        ];
      })();

      persistAndBroadcast(next);

      if (isAuthenticated && user?.id) {
        void fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user.id,
          },
          body: JSON.stringify({ productId: normalizedId, quantity }),
        }).then(async () => {
          const refreshed = await fetchServerCart();
          persistAndBroadcast(refreshed);
        });
      }
    },
    [cart, fetchServerCart, isAuthenticated, persistAndBroadcast, user?.id]
  );

  const removeFromCart = useCallback(
    (id: string | number) => {
      const normalizedId = String(id);
      const existing = cart.find((item) => item.id === normalizedId);
      const next = cart.filter((item) => item.id !== normalizedId);
      persistAndBroadcast(next);

      if (isAuthenticated && user?.id && existing) {
        void fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user.id,
          },
          body: JSON.stringify({
            itemId: existing.dbItemId,
            productId: existing.id,
          }),
        });
      }
    },
    [cart, isAuthenticated, persistAndBroadcast, user?.id]
  );

  const updateQuantity = useCallback(
    (id: string | number, quantity: number) => {
      const normalizedId = String(id);
      const existing = cart.find((item) => item.id === normalizedId);
      if (!existing) return;

      if (quantity <= 0) {
        removeFromCart(normalizedId);
        return;
      }

      const next = cart.map((item) =>
        item.id === normalizedId ? { ...item, quantity } : item
      );
      persistAndBroadcast(next);

      if (isAuthenticated && user?.id) {
        void fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user.id,
          },
          body: JSON.stringify({
            itemId: existing.dbItemId,
            productId: existing.id,
            quantity,
          }),
        });
      }
    },
    [cart, isAuthenticated, persistAndBroadcast, removeFromCart, user?.id]
  );

  const clearCart = useCallback(() => {
    persistAndBroadcast([]);
  }, [persistAndBroadcast]);

  const getTotalPrice = useCallback((): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getTotalItems = useCallback((): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    loaded,
  };
}
