/**
 * layout.tsx
 * 
 * Layout raíz de la aplicación Kivra.
 * Define estructura HTML global, carga fuentes personalizadas,
 * configura el provider de autenticación y componentes dinámicos.
 */

import type { Metadata } from 'next';
import { Poppins, Outfit } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import GlobalProviders from '@/components/GlobalProviders';
import { cn } from "@/lib/utils";
import { PageTransition } from '@/components/PageTransition';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false, loading: () => null });
const ConditionalFooter = dynamic(() => import('@/components/ConditionalFooter'), { ssr: false, loading: () => null });
const RouteScrollToTop = dynamic(() => import('@/components/RouteScrollToTop'), { ssr: false, loading: () => null });

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kivra - Compra y Vende Online',
  description: 'Plataforma moderna de compra y venta de productos con experiencia fluida',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(poppins.variable, outfit.variable, "font-sans")} suppressHydrationWarning>
      <body className="theme-unified font-poppins overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='kivra-theme';var theme=localStorage.getItem(key);if(theme!=='light'&&theme!=='dark'){theme='dark';}document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;document.documentElement.classList.toggle('dark',theme==='dark');document.body.dataset.theme=theme;document.body.style.colorScheme=theme;document.body.classList.toggle('dark',theme==='dark');}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark';document.documentElement.classList.add('dark');document.body.dataset.theme='dark';document.body.style.colorScheme='dark';document.body.classList.add('dark');}})();`,
          }}
        />
        <div className="app-shell-overlay fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(29,184,73,0.08),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(37,99,235,0.12),transparent_36%),linear-gradient(180deg,#071425_0%,#0a1a2d_50%,#0f2139_100%)]" />
        <Suspense fallback={null}>
          <GlobalProviders>
            <Navbar />
            <RouteScrollToTop />
            <PageTransition>
              <div className="min-h-screen">{children}</div>
            </PageTransition>
            <ConditionalFooter />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3200,
                style: {
                  background: '#0d1c31',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '1rem',
                  padding: '10px 16px',
                  fontSize: '0.875rem',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
                },
                success: { iconTheme: { primary: '#1DB849', secondary: '#06131f' } },
                error: { iconTheme: { primary: '#FF6B6B', secondary: '#06131f' } },
              }}
            />
          </GlobalProviders>
        </Suspense>
      </body>
    </html>
  );
}
