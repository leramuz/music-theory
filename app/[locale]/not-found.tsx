import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function NotFoundPage() {
  const t = await getTranslations('notFound');
  const notFoundStatus = 404;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <Card className="w-full max-w-xl rounded-2xl border border-foreground/15 bg-background/70 p-8 text-center shadow-sm backdrop-blur">
        <CardContent className="p-0">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-foreground/60">
            {notFoundStatus}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="mt-3 text-sm leading-6 text-foreground/80">{t('description')}</p>

          <div className="mt-8 flex items-center justify-center">
            <Button asChild>
              <Link href="/">{t('goHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
