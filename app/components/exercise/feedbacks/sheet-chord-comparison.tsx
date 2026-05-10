import { useMemo } from 'react';
import { translationKeyForChord } from '@/helpers/chord';
import { playChord } from '@/helpers/audio';
import { makeChordMeasure } from '@/helpers/chord-sheet';
import { Chord, ChordInstance } from '@/types/chord';
import { PlaybackMode } from '@/types/playback-mode';
import { Key } from '@/types/key';
import { FeedbackStatus } from '@/types/feedback-status';
import { MusicSheet } from '@/components/music-sheet/music-sheet';
import { ComparisonCard } from '@/components/exercise/feedbacks/common/comparison-card';

type SheetChordComparisonProps = {
  question: ChordInstance;
  correctChord: Chord;
  answeredChord: Chord | null;
  answeredChordInstance: ChordInstance | null;
  playbackMode: PlaybackMode;
  musicalKey: Key | null;
  measureWidth: number;
  feedbackStatus: FeedbackStatus;
};

export const SheetChordComparison = ({
  question,
  correctChord,
  answeredChord,
  answeredChordInstance,
  playbackMode,
  musicalKey,
  measureWidth,
  feedbackStatus,
}: SheetChordComparisonProps) => {
  const correctMeasures = useMemo(
    () => [makeChordMeasure(Array.from(question.notes), undefined, musicalKey)],
    [question, musicalKey],
  );

  const answeredMeasures = useMemo(
    () =>
      answeredChordInstance
        ? [makeChordMeasure(Array.from(answeredChordInstance.notes), undefined, musicalKey)]
        : null,
    [answeredChordInstance, musicalKey],
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ComparisonCard
        feedbackStatus={FeedbackStatus.CORRECT}
        labelKey="practice.chords.feedbackPhase.correctAnswerLabel"
        valueKey={`chords.${translationKeyForChord(correctChord)}`}
        onPlay={() => playChord(question, playbackMode)}
        ariaLabel="practice.chords.feedbackPhase.playCorrectAriaLabel"
      >
        <MusicSheet
          measures={correctMeasures}
          disableInteractions={true}
          measureWidth={measureWidth}
          musicalKey={musicalKey}
        />
      </ComparisonCard>

      {answeredChordInstance && answeredMeasures && (
        <ComparisonCard
          feedbackStatus={feedbackStatus}
          labelKey="practice.chords.feedbackPhase.yourAnswerLabel"
          valueKey={
            answeredChord
              ? `chords.${translationKeyForChord(answeredChord)}`
              : 'practice.chords.feedbackPhase.unknownChord'
          }
          onPlay={() => playChord(answeredChordInstance, playbackMode)}
          ariaLabel="practice.chords.feedbackPhase.playAnswerAriaLabel"
        >
          <MusicSheet
            measures={answeredMeasures}
            disableInteractions={true}
            measureWidth={measureWidth}
            musicalKey={musicalKey}
          />
        </ComparisonCard>
      )}
    </div>
  );
};
