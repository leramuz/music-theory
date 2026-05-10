'use client';

import { useTranslations } from 'next-intl';
import { Interval } from '@/types/interval';
import { Heading } from '@/components/heading';
import { IntervalExercise } from '@/components/exercise/interval-exercise';

export default function IntervalsPage() {
  const t = useTranslations('practice.intervals');

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Heading title={t('title')} subtitle={t('description')} />
      <IntervalExercise intervalOptions={new Set(Object.values(Interval))} />
    </div>
  );
}
