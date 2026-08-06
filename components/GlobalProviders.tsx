'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { NavigationLoaderProvider } from './NavigationLoaderProvider';

export default function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}