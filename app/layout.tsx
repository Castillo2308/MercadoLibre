import type { Metadata } from 'next';
import { Poppins, Outfit } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/context/AuthContext';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false, loading: () => null });
const ConditionalFooter = dynamic(() => import('@/components/ConditionalFooter'), { ssr: false, loading: () => null });

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
  title: 'MercadoLibre Clone - Compra y Vende Online',
  description: 'Plataforma moderna de compra y venta de productos con experiencia fluida',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-poppins overflow-x-hidden bg-[#071425]">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,230,0,0.08),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(37,99,235,0.18),transparent_36%),linear-gradient(180deg,#071425_0%,#0a1a2d_50%,#0f2139_100%)]" />
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
