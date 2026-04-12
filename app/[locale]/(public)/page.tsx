import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-12">
      <div className="text-center space-y-2">
        <h1 className="max-w-sm text-3xl font-semibold tracking-tight">{t('welcome')}</h1>
        <Button>{t('buttonText')}</Button>
      </div>
    </main>
  );
}
