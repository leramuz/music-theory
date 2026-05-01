import { translationKeyForInterval } from '@/helpers/interval';
import { playInterval } from '@/helpers/audio';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { Interval, IntervalInstance } from '@/types/interval';
import { PlaybackMode } from '@/types/playback-mode';
import { RangeOption } from '@/types/range-option';
import { InteractivePiano } from '@/components/interactive-piano';
import { ComparisonCard } from '@/components/exercise/feedbacks/common/comparison-card';

type KeyboardComparisonProps = {
  question: IntervalInstance;
  correctInterval: Interval;
  answeredInterval: Interval | null;
  answeredIntervalInstance: IntervalInstance | null;
  playbackMode: PlaybackMode;
  range: RangeOption;
};

export const KeyboardComparison = ({
  question,
  correctInterval,
  answeredInterval,
  answeredIntervalInstance,
  playbackMode,
  range,
}: KeyboardComparisonProps) => {
  const correctBottomId = getPianoKeyBySpelling(question.bottom).id;
  const correctTopId = getPianoKeyBySpelling(question.top).id;

  const answeredBottomId = answeredIntervalInstance
    ? getPianoKeyBySpelling(answeredIntervalInstance.bottom).id
    : null;
  const answeredTopId = answeredIntervalInstance
    ? getPianoKeyBySpelling(answeredIntervalInstance.top).id
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComparisonCard
        isCorrect={true}
        labelKey="practice.intervals.feedbackPhase.correctAnswerLabel"
        valueKey={`intervals.${translationKeyForInterval(correctInterval)}`}
        onPlay={() => playInterval(question, playbackMode)}
        ariaLabel="practice.intervals.feedbackPhase.playCorrectAriaLabel"
      >
        <div className="overflow-x-auto">
          <InteractivePiano
            range={pianoRangeFromOption(range)}
            showKeyLabels={true}
            zoom={0.5}
            highlightedKeys={[
              { id: correctBottomId, color: 'blue' },
              { id: correctTopId, color: 'green' },
            ]}
            scrollToKeyId={correctBottomId}
            muted={true}
          />
        </div>
      </ComparisonCard>

      {answeredInterval && answeredIntervalInstance && answeredBottomId && answeredTopId && (
        <ComparisonCard
          isCorrect={false}
          labelKey="practice.intervals.feedbackPhase.yourAnswerLabel"
          valueKey={`intervals.${translationKeyForInterval(answeredInterval)}`}
          onPlay={() => playInterval(answeredIntervalInstance, playbackMode)}
          ariaLabel="practice.intervals.feedbackPhase.playAnswerAriaLabel"
        >
          <div className="overflow-x-auto">
            <InteractivePiano
              range={pianoRangeFromOption(range)}
              showKeyLabels={true}
              zoom={0.5}
              highlightedKeys={[
                { id: answeredBottomId, color: 'blue' },
                { id: answeredTopId, color: 'red' },
              ]}
              scrollToKeyId={correctBottomId}
              muted={true}
            />
          </div>
        </ComparisonCard>
      )}
    </div>
  );
};
