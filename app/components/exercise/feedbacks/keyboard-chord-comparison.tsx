import { translationKeyForChord } from '@/helpers/chord';
import { playChord } from '@/helpers/audio';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { Chord, ChordInstance } from '@/types/chord';
import { PlaybackMode } from '@/types/playback-mode';
import { RangeOption } from '@/types/range-option';
import { FeedbackStatus } from '@/types/feedback-status';
import { InteractivePiano } from '@/components/interactive-piano';
import { ComparisonCard } from '@/components/exercise/feedbacks/common/comparison-card';

type KeyboardChordComparisonProps = {
  question: ChordInstance;
  correctChord: Chord;
  answeredChord: Chord | null;
  answeredChordInstance: ChordInstance | null;
  playbackMode: PlaybackMode;
  range: RangeOption;
  feedbackStatus: FeedbackStatus;
};

export const KeyboardChordComparison = ({
  question,
  correctChord,
  answeredChord,
  answeredChordInstance,
  playbackMode,
  range,
  feedbackStatus,
}: KeyboardChordComparisonProps) => {
  const correctKeyIds = question.notes.map((s) => getPianoKeyBySpelling(s).id);

  const answeredKeyIds = answeredChordInstance
    ? answeredChordInstance.notes.map((s) => getPianoKeyBySpelling(s).id)
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComparisonCard
        feedbackStatus={FeedbackStatus.CORRECT}
        labelKey="practice.chords.feedbackPhase.correctAnswerLabel"
        valueKey={`chords.${translationKeyForChord(correctChord)}`}
        onPlay={() => playChord(question, playbackMode)}
        ariaLabel="practice.chords.feedbackPhase.playCorrectAriaLabel"
      >
        <div className="overflow-x-auto">
          <InteractivePiano
            range={pianoRangeFromOption(range)}
            showKeyLabels={true}
            zoom={0.5}
            highlightedKeys={[
              { id: correctKeyIds[0], color: 'blue' },
              ...correctKeyIds.slice(1).map((id) => ({ id, color: 'green' as const })),
            ]}
            scrollToKeyId={correctKeyIds[0]}
            muted={true}
          />
        </div>
      </ComparisonCard>

      {answeredChord && answeredChordInstance && answeredKeyIds && (
        <ComparisonCard
          feedbackStatus={feedbackStatus}
          labelKey="practice.chords.feedbackPhase.yourAnswerLabel"
          valueKey={`chords.${translationKeyForChord(answeredChord)}`}
          onPlay={() => playChord(answeredChordInstance, playbackMode)}
          ariaLabel="practice.chords.feedbackPhase.playAnswerAriaLabel"
        >
          <div className="overflow-x-auto">
            <InteractivePiano
              range={pianoRangeFromOption(range)}
              showKeyLabels={true}
              zoom={0.5}
              highlightedKeys={[
                { id: answeredKeyIds[0], color: 'blue' },
                ...answeredKeyIds.slice(1).map((id) => ({ id, color: 'red' as const })),
              ]}
              scrollToKeyId={correctKeyIds[0]}
              muted={true}
            />
          </div>
        </ComparisonCard>
      )}
    </div>
  );
};
