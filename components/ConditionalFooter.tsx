'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Mostrar footer solo en páginas de inicio y categorías
  const shouldShowFooter = pathname === '/' || pathname === '/categories';
  
  return shouldShowFooter ? <Footer /> : null;
}
