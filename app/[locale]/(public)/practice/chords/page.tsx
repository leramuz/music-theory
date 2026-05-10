'use client';

import { useTranslations } from 'next-intl';
import { Chord } from '@/types/chord';
import { Heading } from '@/components/heading';
import { ChordExercise } from '@/components/exercise/chord-exercise';

export default function ChordsPage() {
  const t = useTranslations('practice.chords');

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Heading title={t('title')} subtitle={t('description')} />
      <ChordExercise chordOptions={new Set(Object.values(Chord))} />
    </div>
  );
}
