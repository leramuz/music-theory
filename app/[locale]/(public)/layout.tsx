import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
