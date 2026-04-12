import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Music Theory App',
  description: 'Interactive music theory and ear training platform.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={`${locale}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
