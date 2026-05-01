'use client';

import { useTranslations } from 'next-intl';
import { Heading } from '@/components/heading';
import { Interval } from '@/types/interval';
import { Accidental } from '@/types/accidental';
import { IntervalExercise } from '@/components/exercise/interval-exercise';

export default function IntervalsPage() {
  const t = useTranslations('practice.intervals');

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Heading title={t('title')} subtitle={t('description')} />
      <IntervalExercise
        intervalOptions={[
          Interval.PERFECT_UNISON,
          Interval.MINOR_SECOND,
          Interval.MAJOR_SECOND,
          Interval.MINOR_THIRD,
          Interval.MAJOR_THIRD,
          Interval.PERFECT_FOURTH,
          Interval.AUGMENTED_FOURTH,
          Interval.PERFECT_FIFTH,
          Interval.MINOR_SIXTH,
          Interval.MAJOR_SIXTH,
          Interval.MINOR_SEVENTH,
          Interval.MAJOR_SEVENTH,
          Interval.PERFECT_OCTAVE,
        ]}
        accidentalOptions={[Accidental.SHARP, Accidental.FLAT]}
      />
    </div>
  );
}
