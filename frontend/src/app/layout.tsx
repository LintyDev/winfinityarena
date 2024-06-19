import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] });
const upheavtt = localFont({
  src: '../../public/font/upheavtt.ttf',
  display: 'swap',
  variable: '--font-upheavtt',
});

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
        <body
          className={`${inter.className} ${upheavtt.variable} flex flex-col relative pb-6`}
        >
          {children}
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
