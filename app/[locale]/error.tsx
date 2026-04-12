'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error('Route error boundary:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <Card className="w-full max-w-xl rounded-2xl border border-foreground/15 bg-background/70 p-8 text-center shadow-sm backdrop-blur">
        <CardContent className="p-0">
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="mt-3 text-sm leading-6 text-foreground/80">{t('description')}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={reset}>{t('retry')}</Button>
            <Button asChild variant="outline">
              <Link href="/">{t('goHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
