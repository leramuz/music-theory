import { useMemo } from 'react';
import { translationKeyForInterval } from '@/helpers/interval';
import { playInterval } from '@/helpers/audio';
import { makeIntervalMeasure } from '@/helpers/interval-sheet';
import { Interval, IntervalInstance } from '@/types/interval';
import { PlaybackMode } from '@/types/playback-mode';
import { MusicSheet } from '@/components/music-sheet/music-sheet';
import { ComparisonCard } from '@/components/exercise/feedbacks/common/comparison-card';

type SheetComparisonProps = {
  question: IntervalInstance;
  correctInterval: Interval;
  answeredInterval: Interval | null;
  answeredIntervalInstance: IntervalInstance | null;
  playbackMode: PlaybackMode;
};

export const SheetComparison = ({
  question,
  correctInterval,
  answeredInterval,
  answeredIntervalInstance,
  playbackMode,
}: SheetComparisonProps) => {
  const correctMeasures = useMemo(
    () => [makeIntervalMeasure(question.bottom, question.top)],
    [question],
  );
  const answeredMeasures = useMemo(
    () =>
      answeredIntervalInstance
        ? [makeIntervalMeasure(answeredIntervalInstance.bottom, answeredIntervalInstance.top)]
        : null,
    [answeredIntervalInstance],
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComparisonCard
        isCorrect={true}
        labelKey="practice.intervals.feedbackPhase.correctAnswerLabel"
        valueKey={`intervals.${translationKeyForInterval(correctInterval)}`}
        onPlay={() => playInterval(question, playbackMode)}
        ariaLabel="practice.intervals.feedbackPhase.playCorrectAriaLabel"
      >
        <MusicSheet measures={correctMeasures} disableInteractions={true} measureWidth={200} />
      </ComparisonCard>

      {answeredIntervalInstance && answeredMeasures && (
        <ComparisonCard
          isCorrect={false}
          labelKey="practice.intervals.feedbackPhase.yourAnswerLabel"
          valueKey={
            answeredInterval
              ? `intervals.${translationKeyForInterval(answeredInterval)}`
              : 'practice.intervals.feedbackPhase.unknownInterval'
          }
          onPlay={() => playInterval(answeredIntervalInstance, playbackMode)}
          ariaLabel="practice.intervals.feedbackPhase.playAnswerAriaLabel"
        >
          <MusicSheet measures={answeredMeasures} disableInteractions={true} measureWidth={200} />
        </ComparisonCard>
      )}
    </div>
  );
};
