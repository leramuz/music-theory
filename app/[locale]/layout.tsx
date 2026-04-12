import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
