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
      <main className="pt-24 pb-12 sm:pt-36 sm:pb-24 px-5 w-full max-w-5xl mx-auto min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
