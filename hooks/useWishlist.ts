'use client';

import { useState, useEffect, useCallback } from 'react';

interface WishlistItem {
  id: number;
  name: string;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar del localStorage
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

  // Guardar en localStorage cuando cambia la wishlist
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((id: number, name: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === id)) {
        return prevWishlist;
      }
      return [...prevWishlist, { id, name }];
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  }, []);

  const isInWishlist = useCallback((id: number): boolean => {
    return wishlist.some((item) => item.id === id);
  }, [wishlist]);

  const toggleWishlist = useCallback((id: number, name: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === id)) {
        return prevWishlist.filter((item) => item.id !== id);
      } else {
        return [...prevWishlist, { id, name }];
      }
    });
  }, []);

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, loaded };
}
