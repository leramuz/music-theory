'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { InteractivePiano } from '@/components/interactive-piano';
import { PianoKeyId } from '@/types/piano-key';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-24 sm:px-12">
      <div className="space-y-2 text-center">
        <h1 className="max-w-sm text-3xl font-semibold tracking-tight">{t('welcome')}</h1>
        <Button>{t('buttonText')}</Button>
      </div>
      <InteractivePiano
        onKeyPlay={(key) => console.log('Key played:', key)}
        range={{ from: PianoKeyId.C4, to: PianoKeyId.C5 }}
        showKeyLabels={true}
        showKeysOutOfRange={true}
        rightPedalOn={true}
        zoom={0.5}
      />
    </main>
  );
}
