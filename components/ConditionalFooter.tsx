'use client';

/**
 * ConditionalFooter.tsx
 * 
 * Componente que renderiza el Footer solo en rutas específicas.
 * Actualmente muestra el footer en la página de inicio y categorías.
 * Se coloca en el layout principal para una mejor gestión de estado.
 */

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Mostrar footer solo en páginas de inicio y categorías
  const shouldShowFooter = pathname === '/' || pathname === '/categories';
  
  return shouldShowFooter ? <Footer /> : null;
}
