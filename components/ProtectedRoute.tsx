'use client';

/**
 * ProtectedRoute.tsx
 * 
 * Componente que protege rutas requiriendo autenticación.
 * Si el usuario no está autenticado, lo redirige a la página de login
 * con un parámetro de redirección para volver a la página original.
 */

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      const target = pathname ? encodeURIComponent(pathname) : encodeURIComponent('/');
      router.push(`/auth/login?redirect=${target}`);
    }
  }, [isAuthReady, isAuthenticated, pathname, router]);

  if (!isAuthReady || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
