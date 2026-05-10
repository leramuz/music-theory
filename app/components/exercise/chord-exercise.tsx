'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronRight, Play, Settings2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  chordTypeFromInstance,
  chordsInKey,
  randomChordInstanceInRange,
  resolveKeyboardChordInstance,
  translationKeyForChord,
} from '@/helpers/chord';
import { makeChordMeasure } from '@/helpers/chord-sheet';
import { scaleSpellingsInRange } from '@/helpers/scale';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { playChord } from '@/helpers/audio';
import { adaptVexflowSpellingToSpelling } from '@/helpers/vexflow';
import { normalizeSpellingsForKeySignature, deviatingAccidentals } from '@/helpers/key-signature';
import { randomElement } from '@/helpers/common';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { SCALE_STEP_PATTERN } from '@/data/scales';
import { Chord, ChordInstance } from '@/types/chord';
import { PianoKeyId } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';
import { Accidental } from '@/types/accidental';
import { PlaybackMode } from '@/types/playback-mode';
import { ExercisePhase } from '@/types/exercise';
import { AnswerMode } from '@/types/answer-mode';
import { RangeOption } from '@/types/range-option';
import { MeasureConfig, StaveClickPayload } from '@/types/music-sheet';
import { Key } from '@/types/key';
import { FeedbackStatus } from '@/types/feedback-status';
import { KeyHighlightColor } from '@/components/interactive-piano';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnswerModeSettings } from '@/components/exercise/settings/answer-mode-settings';
import { ChordSettings } from '@/components/exercise/settings/chord-settings';
import { PianoRangeSettings } from '@/components/exercise/settings/piano-range-settings';
import { PlaybackModeSettings } from '@/components/exercise/settings/playback-mode-settings';
import { KeySettings } from '@/components/exercise/settings/key-settings';
import { SelectChordAnswer } from '@/components/exercise/answers/select-chord-answer';
import { KeyboardChordAnswer } from '@/components/exercise/answers/keyboard-chord-answer';
import { SheetChordAnswer } from '@/components/exercise/answers/sheet-chord-answer';
import { SelectChordComparison } from '@/components/exercise/feedbacks/select-chord-comparison';
import { KeyboardChordComparison } from '@/components/exercise/feedbacks/keyboard-chord-comparison';
import { SheetChordComparison } from '@/components/exercise/feedbacks/sheet-chord-comparison';

const CHORD_EXERCISE_CONFIG = {
  measureWidth: 230,
};

const CORRECT_KEYS = [
  'practice.chords.feedbackPhase.correct.correct',
  'practice.chords.feedbackPhase.correct.perfect',
  'practice.chords.feedbackPhase.correct.wellDone',
  'practice.chords.feedbackPhase.correct.keepItUp',
] as const;

type ChordExerciseProps = {
  chordOptions: Set<Chord>;
};

export const ChordExercise = ({ chordOptions }: ChordExerciseProps) => {
  const t = useTranslations();

  const [range, setRange] = useState<RangeOption>(RangeOption.C4_C5);
  const [key, setKey] = useState<Key | null>(null);
  const [enabledChords, setEnabledChords] = useState<Set<Chord>>(chordOptions);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(AnswerMode.SELECT);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.HARMONIC);

  const [phase, setPhase] = useState<ExercisePhase>(ExercisePhase.SETTINGS);
  const [question, setQuestion] = useState<ChordInstance | null>(null);

  // SELECT answer state
  const [selectAnswer, setSelectAnswer] = useState<Chord | null>(null);
  // KEYBOARD answer state
  const [answerAdditionalKeyIds, setAnswerAdditionalKeyIds] = useState<Set<PianoKeyId>>(new Set());
  // SHEET answer state
  const [sheetAnswerSpellings, setSheetAnswerSpellings] = useState<PitchSpelling[]>([]);
  const [sheetAccidental, setSheetAccidental] = useState<Accidental | null>(null);

  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>(FeedbackStatus.INCORRECT);

  // ── Derived state ─────────────────────────────────────────────────────────

  const scaleSpellings = useMemo<PitchSpelling[]>(() => {
    if (!key) return [];
    return scaleSpellingsInRange(
      key.tonic,
      SCALE_STEP_PATTERN[key.scale],
      pianoRangeFromOption(range),
    );
  }, [key, range]);

  const normalizedScaleSpellings = useMemo<PitchSpelling[]>(() => {
    if (!key || scaleSpellings.length === 0) return scaleSpellings;
    return normalizeSpellingsForKeySignature(scaleSpellings, key);
  }, [key, scaleSpellings]);

  const effectiveChordOptions = useMemo<Chord[]>(() => {
    if (!key || scaleSpellings.length === 0) return Array.from(chordOptions);
    return Array.from(chordsInKey(scaleSpellings, chordOptions));
  }, [key, scaleSpellings, chordOptions]);

  const effectiveAccidentalOptions = useMemo<Accidental[]>(() => {
    if (!key || normalizedScaleSpellings.length === 0) {
      return [Accidental.FLAT, Accidental.SHARP];
    }
    return deviatingAccidentals(normalizedScaleSpellings, key);
  }, [key, normalizedScaleSpellings]);

  const bassKeyId = useMemo(
    () => (question ? getPianoKeyBySpelling(question.notes[0]).id : null),
    [question],
  );

  const answerChordInstance = useMemo<ChordInstance | null>(() => {
    if (!question) return null;

    if (answerMode === AnswerMode.KEYBOARD && answerAdditionalKeyIds.size > 0) {
      return resolveKeyboardChordInstance(
        question.notes[0],
        Array.from(answerAdditionalKeyIds).sort((a, b) => a - b),
        enabledChords,
        normalizedScaleSpellings.length > 0 ? normalizedScaleSpellings : undefined,
      );
    }

    if (answerMode === AnswerMode.SHEET && sheetAnswerSpellings.length > 0) {
      return {
        notes: [question.notes[0], ...sheetAnswerSpellings] as [PitchSpelling, ...PitchSpelling[]],
      };
    }

    return null;
  }, [
    question,
    answerMode,
    answerAdditionalKeyIds,
    sheetAnswerSpellings,
    enabledChords,
    normalizedScaleSpellings,
  ]);

  const answeredChord = useMemo<Chord | null>(() => {
    if (answerMode === AnswerMode.SELECT) return selectAnswer;
    if (!answerChordInstance) return null;
    return chordTypeFromInstance(answerChordInstance, enabledChords);
  }, [answerMode, selectAnswer, answerChordInstance, enabledChords]);

  const highlightedKeys = useMemo<{ id: PianoKeyId; color: KeyHighlightColor }[]>(() => {
    if (!bassKeyId) return [];
    return [
      { id: bassKeyId, color: 'blue' },
      ...Array.from(answerAdditionalKeyIds).map((id) => ({ id, color: 'amber' as const })),
    ];
  }, [bassKeyId, answerAdditionalKeyIds]);

  const sheetMeasures = useMemo((): MeasureConfig[] => {
    if (!question) return [];
    const notes: PitchSpelling[] = [question.notes[0], ...sheetAnswerSpellings];
    return [makeChordMeasure(notes, undefined, key)];
  }, [question, sheetAnswerSpellings, key]);

  const canSubmit =
    (answerMode === AnswerMode.SELECT && selectAnswer !== null) ||
    (answerMode === AnswerMode.KEYBOARD &&
      answerAdditionalKeyIds.size >= 1 &&
      answeredChord !== null) ||
    (answerMode === AnswerMode.SHEET && sheetAnswerSpellings.length >= 1 && answeredChord !== null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRangeChange = useCallback(
    (newRange: RangeOption) => {
      setRange(newRange);
      if (key) {
        const spellings = scaleSpellingsInRange(
          key.tonic,
          SCALE_STEP_PATTERN[key.scale],
          pianoRangeFromOption(newRange),
        );
        const inKey = chordsInKey(spellings, chordOptions);
        setEnabledChords(inKey.size > 0 ? inKey : chordOptions);
      }
    },
    [key, chordOptions],
  );

  const handleKeyChange = useCallback(
    (newKey: Key | null) => {
      setKey(newKey);
      if (newKey) {
        const spellings = scaleSpellingsInRange(
          newKey.tonic,
          SCALE_STEP_PATTERN[newKey.scale],
          pianoRangeFromOption(range),
        );
        const inKey = chordsInKey(spellings, chordOptions);
        setEnabledChords(inKey.size > 0 ? inKey : chordOptions);
      } else {
        setEnabledChords(chordOptions);
      }
    },
    [chordOptions, range],
  );

  const resetAnswers = useCallback(() => {
    setSelectAnswer(null);
    setAnswerAdditionalKeyIds(new Set());
    setSheetAnswerSpellings([]);
    setSheetAccidental(null);
  }, []);

  const startQuestion = useCallback(
    (q: ChordInstance) => {
      setQuestion(q);
      resetAnswers();
      setPhase(ExercisePhase.QUESTION);
    },
    [resetAnswers],
  );

  const startExercise = useCallback(() => {
    const spellings = normalizedScaleSpellings.length > 0 ? normalizedScaleSpellings : undefined;
    const q = randomChordInstanceInRange(enabledChords, pianoRangeFromOption(range), spellings);
    startQuestion(q);
  }, [enabledChords, range, normalizedScaleSpellings, startQuestion]);

  const playQuestion = useCallback(() => {
    if (question) playChord(question, playbackMode);
  }, [question, playbackMode]);

  const submitAnswer = () => {
    if (!question) return;
    const correctChord = chordTypeFromInstance(question, enabledChords)!;
    setFeedbackStatus(
      answeredChord === correctChord ? FeedbackStatus.CORRECT : FeedbackStatus.INCORRECT,
    );
    setPhase(ExercisePhase.FEEDBACK);
  };

  const toggleChord = useCallback((chord: Chord) => {
    setEnabledChords((prev) => {
      const next = new Set(prev);
      if (next.has(chord)) {
        if (next.size > 1) next.delete(chord);
      } else {
        next.add(chord);
      }
      return next;
    });
  }, []);

  const handleKeyboardKeyToggle = useCallback((keyId: PianoKeyId) => {
    setAnswerAdditionalKeyIds((prev) => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  }, []);

  const handleSheetNotePlace = useCallback(
    (payload: StaveClickPayload) => {
      try {
        const spelling = adaptVexflowSpellingToSpelling(payload.noteKey, sheetAccidental, key);
        getPianoKeyBySpelling(spelling); // validate
        setSheetAnswerSpellings((prev) => [...prev, spelling]);
      } catch {
        // invalid spelling, ignore
      }
    },
    [sheetAccidental, key],
  );

  // ── Render: Settings ──────────────────────────────────────────────────────

  if (phase === ExercisePhase.SETTINGS) {
    return (
      <div className="space-y-5">
        <PianoRangeSettings range={range} onRangeChange={handleRangeChange} />
        <KeySettings musicalKey={key} onKeyChange={handleKeyChange} />
        <ChordSettings
          chordOptions={effectiveChordOptions}
          enabledChords={enabledChords}
          onToggleChord={toggleChord}
        />
        <AnswerModeSettings answerMode={answerMode} onAnswerModeChange={setAnswerMode} />
        <PlaybackModeSettings playbackMode={playbackMode} onPlaybackModeChange={setPlaybackMode} />
        <Button size="lg" onClick={startExercise} className="w-full gap-2">
          {t('practice.startTraining')}
        </Button>
      </div>
    );
  }

  // ── Render: Question ──────────────────────────────────────────────────────

  if (phase === ExercisePhase.QUESTION && question) {
    return (
      <div className="space-y-5">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{t('practice.chords.question.title')}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t('practice.chords.question.description')}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button onClick={playQuestion} className="gap-2">
                <Play className="size-4" />
                {t('practice.chords.question.play')}
              </Button>
            </div>
          </div>
        </Card>

        {answerMode === AnswerMode.SELECT && (
          <SelectChordAnswer
            enabledChords={enabledChords}
            selected={selectAnswer}
            onSelect={setSelectAnswer}
          />
        )}

        {answerMode === AnswerMode.KEYBOARD && bassKeyId && (
          <KeyboardChordAnswer
            range={range}
            highlightedKeys={highlightedKeys}
            selectedKeyIds={answerAdditionalKeyIds}
            bassKeyId={bassKeyId}
            enabledChords={enabledChords}
            onKeyToggle={handleKeyboardKeyToggle}
          />
        )}

        {answerMode === AnswerMode.SHEET && (
          <SheetChordAnswer
            measures={sheetMeasures}
            accidental={sheetAccidental}
            enabledAccidentals={new Set(effectiveAccidentalOptions)}
            bassSpelling={question.notes[0]}
            range={range}
            musicalKey={key}
            measureWidth={CHORD_EXERCISE_CONFIG.measureWidth}
            onAccidentalChange={setSheetAccidental}
            onNotePlace={handleSheetNotePlace}
          />
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPhase(ExercisePhase.SETTINGS)}
            className="gap-2"
          >
            <Settings2 className="size-4" />
            {t('practice.chords.question.settings')}
          </Button>
          <Button className="flex-1" disabled={!canSubmit} onClick={submitAnswer}>
            {t('practice.chords.question.submitAnswer')}
          </Button>
        </div>
      </div>
    );
  }

  // ── Render: Feedback ──────────────────────────────────────────────────────

  if (phase === ExercisePhase.FEEDBACK && question) {
    const correctChord = chordTypeFromInstance(question, enabledChords)!;

    return (
      <div className="space-y-5">
        <Card
          className={cn(
            'p-5 flex items-center gap-4',
            feedbackStatus === FeedbackStatus.CORRECT
              ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
              : 'border-red-400 bg-red-50 dark:bg-red-950/30',
          )}
        >
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              feedbackStatus === FeedbackStatus.CORRECT ? 'bg-green-500' : 'bg-red-500',
            )}
          >
            {feedbackStatus === FeedbackStatus.CORRECT ? (
              <Check className="size-5 text-white" />
            ) : (
              <X className="size-5 text-white" />
            )}
          </div>
          <div>
            <p
              className={cn(
                'text-lg font-bold',
                feedbackStatus === FeedbackStatus.CORRECT
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400',
              )}
            >
              {feedbackStatus === FeedbackStatus.CORRECT
                ? t(randomElement(CORRECT_KEYS))
                : t('practice.chords.feedbackPhase.incorrect.notQuite')}
            </p>
            {feedbackStatus === FeedbackStatus.CORRECT && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {t.rich('practice.chords.feedbackPhase.thatsA', {
                  chord: t(`chords.${translationKeyForChord(correctChord)}`),
                  strong: (chunks) => <span className="font-semibold">{chunks}</span>,
                })}
              </p>
            )}
            {feedbackStatus !== FeedbackStatus.CORRECT && answeredChord && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {t.rich('practice.chords.feedbackPhase.youAnswered', {
                  answered: t(`chords.${translationKeyForChord(answeredChord)}`),
                  correct: t(`chords.${translationKeyForChord(correctChord)}`),
                  strong: (chunks) => <span className="font-semibold">{chunks}</span>,
                })}
              </p>
            )}
          </div>
        </Card>

        {feedbackStatus !== FeedbackStatus.CORRECT && (
          <ChordComparisonSection
            answerMode={answerMode}
            question={question}
            correctChord={correctChord}
            answeredChord={answeredChord}
            answeredChordInstance={answerChordInstance}
            playbackMode={playbackMode}
            range={range}
            musicalKey={key}
            measureWidth={CHORD_EXERCISE_CONFIG.measureWidth}
            feedbackStatus={feedbackStatus}
          />
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPhase(ExercisePhase.SETTINGS)}
            className="gap-2"
          >
            <Settings2 className="size-4" />
            {t('practice.chords.feedbackPhase.settings')}
          </Button>
          <Button className="flex-1 gap-2" onClick={startExercise}>
            <ChevronRight className="size-4" />
            {t('practice.chords.feedbackPhase.nextQuestion')}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

// ── Comparison section ────────────────────────────────────────────────────────

type ChordComparisonSectionProps = {
  answerMode: AnswerMode;
  question: ChordInstance;
  correctChord: Chord;
  answeredChord: Chord | null;
  answeredChordInstance: ChordInstance | null;
  playbackMode: PlaybackMode;
  range: RangeOption;
  musicalKey: Key | null;
  measureWidth: number;
  feedbackStatus: FeedbackStatus;
};

const ChordComparisonSection = ({
  answerMode,
  question,
  correctChord,
  answeredChord,
  answeredChordInstance,
  playbackMode,
  range,
  musicalKey,
  measureWidth,
  feedbackStatus,
}: ChordComparisonSectionProps) => {
  if (answerMode === AnswerMode.SELECT && answeredChord) {
    return (
      <SelectChordComparison
        question={question}
        correctChord={correctChord}
        answeredChord={answeredChord}
        playbackMode={playbackMode}
        feedbackStatus={feedbackStatus}
      />
    );
  }

  if (answerMode === AnswerMode.KEYBOARD) {
    return (
      <KeyboardChordComparison
        question={question}
        correctChord={correctChord}
        answeredChord={answeredChord}
        answeredChordInstance={answeredChordInstance}
        playbackMode={playbackMode}
        range={range}
        feedbackStatus={feedbackStatus}
      />
    );
  }

  return (
    <SheetChordComparison
      question={question}
      correctChord={correctChord}
      answeredChord={answeredChord}
      answeredChordInstance={answeredChordInstance}
      playbackMode={playbackMode}
      musicalKey={musicalKey}
      measureWidth={measureWidth}
      feedbackStatus={feedbackStatus}
    />
  );
};
