import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function GlobalNotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <Card className="w-full max-w-xl rounded-2xl border border-foreground/15 bg-background/70 p-8 text-center shadow-sm backdrop-blur">
        <CardContent className="p-0">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-foreground/60">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            The page you are looking for does not exist or may have been moved.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <Button asChild>
              <Link href="/">Go to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
