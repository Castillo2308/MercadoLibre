'use client';

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
}

export default function AnimatedCard({
  href,
  children,
  delay = 0,
  className = '',
  hoverScale = 1.05,
}: AnimatedCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ scale: hoverScale }}
      className={`card-elevated group ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
