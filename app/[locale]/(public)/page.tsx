'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { addNoteToMusicSheet, removeNoteFromMusicSheet } from '@/helpers/music-sheet';
import { PianoKeyId } from '@/types/piano-key';
import {
  MeasureConfig,
  NoteClickPayload,
  NoteDuration,
  StaveClickPayload,
} from '@/types/music-sheet';
import { Button } from '@/components/ui/button';
import { InteractivePiano } from '@/components/interactive-piano';
import { MusicSheet } from '@/components/music-sheet/music-sheet';
import { SHEET_DEFAULT_CONFIG } from '@/components/music-sheet/config';
import { Card } from '@/components/ui/card';

export default function Home() {
  const t = useTranslations();
  const [currentMeasures, setCurrentMeasures] = useState<MeasureConfig[]>(
    SHEET_DEFAULT_CONFIG.measures,
  );

  const onNoteClick = (payload: NoteClickPayload) => {
    const newMeasures = removeNoteFromMusicSheet(currentMeasures, payload);
    setCurrentMeasures(newMeasures);
  };

  const onStaveClick = (payload: StaveClickPayload) => {
    const newMeasures = addNoteToMusicSheet(currentMeasures, payload, NoteDuration.QUARTER, 0, []);
    setCurrentMeasures(newMeasures);
  };

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
      <div className="w-full">
        <div className="max-w-min mx-auto">
          <Card className="overflow-x-auto">
            <MusicSheet
              measures={currentMeasures}
              onNoteClick={onNoteClick}
              onStaveClick={onStaveClick}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
