'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SmartImageProps = Omit<ImageProps, 'loader'> & {
  wrapperClassName?: string;
  skeletonClassName?: string;
};

export function SmartImage({
  className,
  wrapperClassName,
  skeletonClassName,
  onLoad,
  alt,
  fill,
  ...props
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative h-full w-full overflow-hidden', wrapperClassName)}>
      {!loaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10',
            skeletonClassName
          )}
        />
      )}
      <Image
        {...props}
        alt={alt}
        fill={fill}
        unoptimized
        loader={({ src }) => src}
        className={cn(
          className,
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500'
        )}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </div>
  );
}
