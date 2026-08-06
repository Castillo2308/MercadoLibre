'use client';

/**
 * useWishlist.ts
 * 
 * Hook para gestionar la lista de deseos/favoritos.
 * Sincroniza entre localStorage y servidor para usuarios autenticados.
 * Permite agregar/remover productos de la lista de deseos.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface WishlistItem {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number | null;
  condition?: string;
  averageRating?: number;
  reviewCount?: number;
  mainImageUrl?: string | null;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { user, isAuthenticated, isAuthReady } = useAuth();

  // Load from localStorage as fallback
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
    setLoaded(true);
  }, []);

  // When user is authenticated, sync with server
  useEffect(() => {
    if (!isAuthReady) return;
    const sync = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await fetch('/api/favorites', { headers: { 'X-User-ID': user.id }, cache: 'no-store' });
          if (!res.ok) return;
          const payload = await res.json();
          const items = (payload.data || []).map((f: any) => ({
            id: String(f.product?.id || f.id),
            name: f.product?.title || f.product?.name || '',
            price: f.product?.price ?? undefined,
            originalPrice: f.product?.originalPrice ?? null,
            condition: f.product?.condition ?? 'new',
            averageRating: f.product?.averageRating ?? 0,
            reviewCount: f.product?.reviewCount ?? 0,
            mainImageUrl: f.product?.mainImageUrl ?? null,
          }));
          setWishlist(items);
          localStorage.setItem('wishlist', JSON.stringify(items));
        } catch (e) {
          console.error('Failed to sync wishlist:', e);
        }
      }
    };
    void sync();
  }, [isAuthReady, isAuthenticated, user?.id]);

  // Persist locally when wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback(
    async (id: string, name: string) => {
      setWishlist((prev) => {
        if (prev.some((item) => item.id === id)) return prev;
        return [...prev, { id, name }];
      });

      if (isAuthenticated && user?.id) {
        try {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-User-ID': user.id },
            body: JSON.stringify({ productId: id }),
          });
        } catch (e) {
          console.error('Failed to add favorite on server', e);
        }
      }
    },
    [isAuthenticated, user?.id]
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      setWishlist((prev) => prev.filter((item) => item.id !== id));

      if (isAuthenticated && user?.id) {
        try {
          await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-User-ID': user.id },
            body: JSON.stringify({ productId: id }),
          });
        } catch (e) {
          console.error('Failed to remove favorite on server', e);
        }
      }
    },
    [isAuthenticated, user?.id]
  );

  const isInWishlist = useCallback((id: string) => wishlist.some((item) => item.id === id), [wishlist]);

  const toggleWishlist = useCallback(
    async (id: string, name: string) => {
      if (wishlist.some((item) => item.id === id)) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id, name);
      }
    },
    [addToWishlist, removeFromWishlist, wishlist]
  );

  const clear = useCallback(() => setWishlist([]), []);

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, clear, loaded };
}
