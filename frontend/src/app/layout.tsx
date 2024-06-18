import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WinfintyArena',
  description: 'Championship mini-games for all the family',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <AuthProvider>
        <body className={inter.className + ' flex flex-col relative pb-6'}>
          {children}
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
