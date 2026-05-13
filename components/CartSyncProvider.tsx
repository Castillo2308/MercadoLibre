'use client';

import { useSyncCartOnLogin } from '@/hooks/useSyncCartOnLogin';

/**
 * Componente que sincroniza el carrito cuando el usuario inicia sesión
 * Debe colocarse dentro del AuthProvider
 */
export function CartSyncProvider() {
  useSyncCartOnLogin();
  return null;
}
