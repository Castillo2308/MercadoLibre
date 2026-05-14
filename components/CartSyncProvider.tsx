'use client';

/**
 * CartSyncProvider.tsx
 * 
 * Componente que sincroniza el carrito cuando el usuario inicia sesión.
 * Transfiere los items del carrito de invitado al usuario autenticado.
 * Se coloca dentro del AuthProvider en el layout.
 */

import { useSyncCartOnLogin } from '@/hooks/useSyncCartOnLogin';

/**
 * Componente que sincroniza el carrito cuando el usuario inicia sesión
 * Debe colocarse dentro del AuthProvider
 */
export function CartSyncProvider() {
  useSyncCartOnLogin();
  return null;
}
