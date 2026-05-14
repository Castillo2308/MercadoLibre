'use client';

/**
 * RouteScrollToTop.tsx
 * 
 * Componente que automáticamente hace scroll hacia el top cuando cambia la ruta.
 * Desactiva la restauración automática de posición del navegador para un control más preciso.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        // Jump to top instantly on route change
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } catch (e) {
      // ignore
    }
  }, [pathname]);

  return null;
}
