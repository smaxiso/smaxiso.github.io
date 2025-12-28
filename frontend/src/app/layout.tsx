import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: {
    default: siteConfig.site.title,
    template: `%s | ${siteConfig.site.author}`,
  },
  description: siteConfig.site.description,
  keywords: ["Data Engineer", "Machine Learning", "Portfolio", "Sumit Kumar", "Python", "Cloud", "Big Data"],
  authors: [{ name: siteConfig.site.author, url: siteConfig.site.url }],
  creator: siteConfig.site.author,
  openGraph: {
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    url: siteConfig.site.url,
    siteName: siteConfig.site.title,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: siteConfig.site.image,
        width: 1200,
        height: 630,
        alt: siteConfig.site.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    images: [siteConfig.site.image],
    creator: '@smaxiso',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
    </html>
  );
}
