'use client';

/**
 * AnimatedCard.tsx
 * 
 * Componente reutilizable para tarjetas con animaciones.
 * Soporta múltiples variantes de estilo (default, elevated, glass, highlight)
 * y animaciones de entrada/salida con framer-motion.
 * Se usa para mostrar productos, categorías y otros contenidos.
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedCardProps {
  href?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hoverScale?: number;
  onHover?: () => void;
  variant?: 'default' | 'elevated' | 'glass' | 'highlight';
}

const variantClasses: Record<NonNullable<AnimatedCardProps['variant']>, string> = {
  default: 'rounded-2xl border border-white/10 bg-[#0d1c31]/90',
  elevated: 'rounded-2xl border border-white/12 bg-[#0d1c31]/95 shadow-[0_18px_40px_rgba(0,0,0,0.35)]',
  glass: 'rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl',
  highlight:
    'rounded-2xl border border-primary/30 bg-gradient-to-br from-[#0d1c31] to-[#11233a] shadow-[0_18px_40px_rgba(29,184,73,0.2)]',
};

export default function AnimatedCard({
  href,
  children,
  delay = 0,
  className = '',
  hoverScale = 1.05,
  variant = 'default',
}: AnimatedCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ scale: hoverScale, y: -4 }}
      className={`group transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
