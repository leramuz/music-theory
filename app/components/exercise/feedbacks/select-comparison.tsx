import { intervalTopSpelling, translationKeyForInterval } from '@/helpers/interval';
import { playInterval } from '@/helpers/audio';
import { Interval, IntervalInstance } from '@/types/interval';
import { PlaybackMode } from '@/types/playback-mode';
import { FeedbackStatus } from '@/types/feedback-status';
import { ComparisonCard } from '@/components/exercise/feedbacks/common/comparison-card';

type SelectComparisonProps = {
  question: IntervalInstance;
  correctInterval: Interval;
  answeredInterval: Interval;
  playbackMode: PlaybackMode;
  feedbackStatus: FeedbackStatus;
};

export const SelectComparison = ({
  question,
  correctInterval,
  answeredInterval,
  playbackMode,
  feedbackStatus,
}: SelectComparisonProps) => {
  const answeredTopSpelling = intervalTopSpelling(question.bottom, answeredInterval);
  const answeredIntervalInstance = answeredTopSpelling
    ? { bottom: question.bottom, top: answeredTopSpelling }
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComparisonCard
        feedbackStatus={FeedbackStatus.CORRECT}
        labelKey="practice.intervals.feedbackPhase.correctAnswerLabel"
        valueKey={`intervals.${translationKeyForInterval(correctInterval)}`}
        onPlay={() => playInterval(question, playbackMode)}
        ariaLabel="practice.intervals.feedbackPhase.playCorrectAriaLabel"
      ></ComparisonCard>

      {answeredInterval && answeredIntervalInstance && (
        <ComparisonCard
          feedbackStatus={feedbackStatus}
          labelKey="practice.intervals.feedbackPhase.yourAnswerLabel"
          valueKey={`intervals.${translationKeyForInterval(answeredInterval)}`}
          onPlay={() => playInterval(answeredIntervalInstance, playbackMode)}
          ariaLabel="practice.intervals.feedbackPhase.playAnswerAriaLabel"
        ></ComparisonCard>
      )}
    </div>
  );
};
