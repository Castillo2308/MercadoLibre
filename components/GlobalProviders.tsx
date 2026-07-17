'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NavigationLoaderProvider } from './NavigationLoaderProvider';

export default function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}