import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Sumit Kumar - Portfolio',
  description: 'Data Engineer & ML Specialist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-primary antialiased bg-surface-0 text-on-surface`}>
        <Header />
        <main className="l-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
