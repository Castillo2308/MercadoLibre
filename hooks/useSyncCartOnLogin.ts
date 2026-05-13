'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShoppingCart } from './useShoppingCart';

/**
 * Hook que sincroniza el carrito del localStorage con la BD cuando inicia sesión
 */
export function useSyncCartOnLogin() {
  const { isAuthenticated, user } = useAuth();
  const { cart } = useShoppingCart();

  useEffect(() => {
    if (isAuthenticated && user?.id && cart.length > 0) {
      // Sincronizar cada item del carrito con la BD
      const syncCartItems = async () => {
        try {
          for (const item of cart) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-User-ID': user.id,
              },
              body: JSON.stringify({
                productId: item.id.toString(),
                quantity: item.quantity,
              }),
            });
          }
        } catch (error) {
          console.error('Error syncing cart items:', error);
        }
      };

      syncCartItems();
    }
  }, [isAuthenticated, user?.id, cart]);
}
