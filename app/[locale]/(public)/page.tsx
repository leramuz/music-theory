'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center w-full gap-5 px-6 py-24 sm:px-12">
      <h1 className="text-center max-w-sm text-3xl font-semibold tracking-tight">{t('welcome')}</h1>
      <Button>{t('buttonText')}</Button>
    </div>
  );
}
