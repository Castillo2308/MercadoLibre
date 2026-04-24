'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode, memo } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleClick = () => {
    if (onClick) onClick();
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <Link
      {...props}
      className={className}
      onClick={handleClick}
      onMouseEnter={(e) => {
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
