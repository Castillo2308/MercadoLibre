'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

interface NavigationLoaderContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const NavigationLoaderContext = createContext<NavigationLoaderContextValue | undefined>(undefined);

// Solo mostramos el overlay de carga si la navegación tarda más de esto.
// Para navegaciones instantáneas (la mayoría, gracias al prefetch de Next.js)
// no se muestra ningún loader, evitando el "flash" en cada clic.
const NAVIGATION_LOADING_SHOW_DELAY = 220;

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isInternalLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }

  if (href.startsWith('/')) {
    return true;
  }

  try {
    return new URL(anchor.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

function isSameRoute(anchor: HTMLAnchorElement) {
  try {
    const targetUrl = new URL(anchor.href);
    const currentUrl = new URL(window.location.href);
    return targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search && targetUrl.hash === currentUrl.hash;
  } catch {
    return false;
  }
}

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimerRef = useRef<number | null>(null);
  const currentRouteRef = useRef('');

  const stopLoading = useCallback(() => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const startLoading = useCallback(() => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    loadingTimerRef.current = window.setTimeout(() => {
      setIsLoading(true);
    }, NAVIGATION_LOADING_SHOW_DELAY);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || !isInternalLink(anchor) || isSameRoute(anchor)) {
        return;
      }

      startLoading();
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [startLoading]);

  useEffect(() => {
    const route = `${pathname}?${searchParams?.toString() ?? ''}`;
    if (currentRouteRef.current === route) {
      return;
    }

    currentRouteRef.current = route;
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ isLoading, startLoading, stopLoading }),
    [isLoading, startLoading, stopLoading]
  );

  return (
    <NavigationLoaderContext.Provider value={value}>
      {children}
      <LoadingScreen visible={isLoading} />
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);
  if (!context) {
    throw new Error('useNavigationLoader debe usarse dentro de NavigationLoaderProvider');
  }

  return context;
}