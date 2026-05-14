/**
 * useFavorites.ts
 * 
 * Hook para gestionar favoritos/wishlist del usuario.
 * Permite agregar, remover y alternar favoritos en el estado local.
 * Los favoritos se pueden sincronizar con el servidor si es necesario.
 */

import { useCallback, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
