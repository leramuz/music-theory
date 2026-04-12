'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error('Global error boundary:', error);
  }, [error]);

  return (
    <html>
      <body className="antialiased">
        <main className="flex min-h-screen items-center justify-center px-6 py-24">
          <Card className="w-full max-w-xl rounded-2xl border border-foreground/15 bg-background/70 p-8 text-center shadow-sm backdrop-blur">
            <CardContent className="p-0">
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Something went wrong
              </h1>
              <p className="mt-3 text-sm leading-6 text-foreground/80">
                An unexpected error occurred. Please try again.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={reset}>Try again</Button>
                <Button asChild variant="outline">
                  <Link href="/">Go to home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </body>
    </html>
  );
}
