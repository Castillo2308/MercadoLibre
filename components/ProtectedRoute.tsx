'use client';

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
