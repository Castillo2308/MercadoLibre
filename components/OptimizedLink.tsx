'use client';

/**
 * OptimizedLink.tsx
 * 
 * Componente Link optimizado que envuelve Next.js Link.
 * Proporciona manejo mejorado de prefetch y eventos.
 * Se utiliza en toda la aplicación en lugar de Link directo.
 */

import Link, { LinkProps } from 'next/link';
import { ReactNode, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationLoader } from './NavigationLoaderProvider';

interface OptimizedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: () => void;
}

function OptimizedLinkComponent({
  children,
  className,
  prefetch = true,
  onClick,
  ...props
}: OptimizedLinkProps) {
  const router = useRouter();
  const { startLoading } = useNavigationLoader();

  const handleClick = () => {
    startLoading();
    if (onClick) onClick();
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <Link
      {...props}
      className={className}
      onClick={handleClick}
      onMouseEnter={() => {
        if (prefetch && typeof props.href === 'string') {
          router.prefetch(props.href);
        }
      }}
    >
      {children}
    </Link>
  );
}

export default memo(OptimizedLinkComponent);
