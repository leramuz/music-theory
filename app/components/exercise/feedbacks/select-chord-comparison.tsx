import { translationKeyForChord } from '@/helpers/chord';
import { playChord } from '@/helpers/audio';
import { Chord, ChordInstance } from '@/types/chord';
import { PlaybackMode } from '@/types/playback-mode';
import { FeedbackStatus } from '@/types/feedback-status';
import { ComparisonCard } from '@/components/exercise/feedbacks/common/comparison-card';

type SelectChordComparisonProps = {
  question: ChordInstance;
  correctChord: Chord;
  answeredChord: Chord;
  playbackMode: PlaybackMode;
  feedbackStatus: FeedbackStatus;
};

export const SelectChordComparison = ({
  question,
  correctChord,
  answeredChord,
  playbackMode,
  feedbackStatus,
}: SelectChordComparisonProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComparisonCard
        feedbackStatus={FeedbackStatus.CORRECT}
        labelKey="practice.chords.feedbackPhase.correctAnswerLabel"
        valueKey={`chords.${translationKeyForChord(correctChord)}`}
        onPlay={() => playChord(question, playbackMode)}
        ariaLabel="practice.chords.feedbackPhase.playCorrectAriaLabel"
      />

      {answeredChord && (
        <ComparisonCard
          feedbackStatus={feedbackStatus}
          labelKey="practice.chords.feedbackPhase.yourAnswerLabel"
          valueKey={`chords.${translationKeyForChord(answeredChord)}`}
          onPlay={() => playChord(question, playbackMode)}
          ariaLabel="practice.chords.feedbackPhase.playAnswerAriaLabel"
        />
      )}
    </div>
  );
};
