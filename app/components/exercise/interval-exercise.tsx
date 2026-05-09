'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  intervalTypeFromInstance,
  randomIntervalInstanceInRange,
  randomIntervalInstanceInKey,
  resolveKeyboardIntervalInstance,
} from '@/helpers/interval';
import { scaleSpellingsInRange, intervalsInKey } from '@/helpers/scale';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { playInterval } from '@/helpers/audio';
import { adaptVexflowSpellingToSpelling } from '@/helpers/vexflow';
import { makeIntervalMeasure } from '@/helpers/interval-sheet';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { getFeedbackNote, getFeedbackStatus, FeedbackNote } from '@/helpers/feedback';
import { normalizeSpellingsForKeySignature, deviatingAccidentals } from '@/helpers/key-signature';
import { SCALE_STEP_PATTERN } from '@/data/scales';
import { Interval, IntervalInstance } from '@/types/interval';
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
import { SettingsPhase } from '@/components/exercise/phases/settings-phase';
import { QuestionPhase } from '@/components/exercise/phases/question-phase';
import { FeedbackPhase } from '@/components/exercise/phases/feedback-phase';

const INTERVAL_EXERCISE_CONFIG = {
  measureWidth: 230,
  intervalOptionsNoKey: [
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
  ] as Interval[],
};

type IntervalExerciseProps = {
  intervalOptions: Set<Interval>;
};

export const IntervalExercise = ({ intervalOptions }: IntervalExerciseProps) => {
  const [range, setRange] = useState<RangeOption>(RangeOption.C4_C5);
  const [key, setKey] = useState<Key | null>(null);
  const [enabledIntervals, setEnabledIntervals] = useState<Set<Interval>>(intervalOptions);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(AnswerMode.SELECT);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.HARMONIC);

  const [phase, setPhase] = useState<ExercisePhase>(ExercisePhase.SETTINGS);
  const [question, setQuestion] = useState<IntervalInstance | null>(null);

  const [selectAnswer, setSelectAnswer] = useState<Interval | null>(null);
  const [sheetAnswerTopSpelling, setSheetAnswerTopSpelling] = useState<PitchSpelling | null>(null);
  const [sheetAnswerExplicitAccidental, setSheetAnswerExplicitAccidental] =
    useState<boolean>(false);
  const [sheetAccidental, setSheetAccidental] = useState<Accidental | null>(null);
  const [answerTopKeyId, setAnswerTopKeyId] = useState<PianoKeyId | null>(null);

  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>(FeedbackStatus.INCORRECT);
  const [feedbackNote, setFeedbackNote] = useState<FeedbackNote | null>(null);

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

  const effectiveIntervalOptions = useMemo<Interval[]>(() => {
    if (!key || scaleSpellings.length === 0)
      return Array.from(intervalOptions).filter((i) =>
        INTERVAL_EXERCISE_CONFIG.intervalOptionsNoKey.includes(i),
      );

    const inKey = intervalsInKey(scaleSpellings, Array.from(intervalOptions));
    return Array.from(intervalOptions).filter((i) => inKey.has(i));
  }, [key, scaleSpellings, intervalOptions]);

  const effectiveAccidentalOptions = useMemo<Accidental[]>(() => {
    // Without a key signature, NATURAL has no meaning
    if (!key || normalizedScaleSpellings.length === 0) {
      return [Accidental.FLAT, Accidental.SHARP];
    }
    return deviatingAccidentals(normalizedScaleSpellings, key);
  }, [key, normalizedScaleSpellings]);

  const bottomKeyId = useMemo(
    () => (question ? getPianoKeyBySpelling(question.bottom).id : null),
    [question],
  );

  const answerIntervalInstance = useMemo<IntervalInstance | null>(() => {
    if (!question) return null;

    if (answerMode === AnswerMode.SHEET && sheetAnswerTopSpelling) {
      return { bottom: question.bottom, top: sheetAnswerTopSpelling };
    }

    if (answerMode === AnswerMode.KEYBOARD && answerTopKeyId) {
      return resolveKeyboardIntervalInstance(
        question.bottom,
        answerTopKeyId,
        enabledIntervals,
        normalizedScaleSpellings.length > 0 ? normalizedScaleSpellings : undefined,
      );
    }

    return null;
  }, [question, answerMode, answerTopKeyId, sheetAnswerTopSpelling, enabledIntervals]);

  const answeredInterval = useMemo<Interval | null>(() => {
    if (answerMode === AnswerMode.SELECT) return selectAnswer;

    if (!answerIntervalInstance) return null;

    try {
      return intervalTypeFromInstance(answerIntervalInstance);
    } catch {
      return null;
    }
  }, [answerMode, selectAnswer, answerIntervalInstance]);

  const highlightedKeys = useMemo<{ id: PianoKeyId; color: KeyHighlightColor }[]>(() => {
    if (!bottomKeyId) return [];

    const keys: { id: PianoKeyId; color: KeyHighlightColor }[] = [
      { id: bottomKeyId, color: 'blue' },
    ];

    if (answerTopKeyId) {
      keys.push({ id: answerTopKeyId, color: 'amber' });
    }

    return keys;
  }, [bottomKeyId, answerTopKeyId]);

  const sheetMeasures = useMemo((): MeasureConfig[] => {
    if (!question) return [];
    return [
      makeIntervalMeasure(
        question.bottom,
        sheetAnswerTopSpelling ?? undefined,
        undefined,
        key,
        sheetAnswerExplicitAccidental,
      ),
    ];
  }, [question, sheetAnswerTopSpelling, key, sheetAnswerExplicitAccidental]);

  const canSubmit =
    (answerMode === AnswerMode.SELECT && selectAnswer !== null) ||
    (answerMode === AnswerMode.KEYBOARD && answerTopKeyId !== null) ||
    (answerMode === AnswerMode.SHEET && sheetAnswerTopSpelling !== null);

  const handleRangeChange = useCallback(
    (newRange: RangeOption) => {
      setRange(newRange);
      if (key) {
        const spellings = scaleSpellingsInRange(
          key.tonic,
          SCALE_STEP_PATTERN[key.scale],
          pianoRangeFromOption(newRange),
        );
        setEnabledIntervals(intervalsInKey(spellings, Array.from(intervalOptions)));
      } else {
        setEnabledIntervals(
          new Set(
            Array.from(intervalOptions).filter((i) =>
              INTERVAL_EXERCISE_CONFIG.intervalOptionsNoKey.includes(i),
            ),
          ),
        );
      }
    },
    [key, intervalOptions],
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
        setEnabledIntervals(intervalsInKey(spellings, Array.from(intervalOptions)));
      } else {
        setEnabledIntervals(
          new Set(
            Array.from(intervalOptions).filter((i) =>
              INTERVAL_EXERCISE_CONFIG.intervalOptionsNoKey.includes(i),
            ),
          ),
        );
      }
    },
    [intervalOptions, range],
  );

  const resetAnswers = useCallback(() => {
    setSelectAnswer(null);
    setAnswerTopKeyId(null);
    setSheetAnswerTopSpelling(null);
    setSheetAnswerExplicitAccidental(false);
    setSheetAccidental(null);
  }, []);

  const startQuestion = useCallback(
    (q: IntervalInstance) => {
      setQuestion(q);
      resetAnswers();
      setPhase(ExercisePhase.QUESTION);
    },
    [resetAnswers],
  );

  const startExercise = useCallback(() => {
    const q =
      key && normalizedScaleSpellings.length > 0
        ? randomIntervalInstanceInKey(enabledIntervals, normalizedScaleSpellings)
        : randomIntervalInstanceInRange(enabledIntervals, pianoRangeFromOption(range));

    if (q) startQuestion(q);
  }, [enabledIntervals, range, key, normalizedScaleSpellings, startQuestion]);

  const playQuestion = useCallback(() => {
    if (question) playInterval(question, playbackMode);
  }, [question, playbackMode]);

  const submitAnswer = () => {
    if (!question) return;

    const correctInterval = intervalTypeFromInstance(question);
    setFeedbackStatus(getFeedbackStatus(correctInterval, answeredInterval));
    setFeedbackNote(
      getFeedbackNote(
        correctInterval,
        answeredInterval,
        sheetAnswerTopSpelling,
        key,
        normalizedScaleSpellings,
        answerIntervalInstance?.top,
        sheetAnswerExplicitAccidental,
      ),
    );

    setPhase(ExercisePhase.FEEDBACK);
  };

  const toggleInterval = useCallback((interval: Interval) => {
    setEnabledIntervals((prev) => {
      const next = new Set(prev);
      if (next.has(interval)) {
        if (next.size > 1) next.delete(interval);
      } else {
        next.add(interval);
      }
      return next;
    });
  }, []);

  const handleSheetAnswer = useCallback(
    (payload: StaveClickPayload) => {
      try {
        const spelling = adaptVexflowSpellingToSpelling(payload.noteKey, sheetAccidental, key);
        getPianoKeyBySpelling(spelling);
        setSheetAnswerTopSpelling(spelling);
        setSheetAnswerExplicitAccidental(sheetAccidental !== null);
      } catch {
        // invalid spelling, ignore
      }
    },
    [sheetAccidental, key],
  );

  if (phase === ExercisePhase.SETTINGS) {
    return (
      <SettingsPhase
        range={range}
        onRangeChange={handleRangeChange}
        intervalOptions={effectiveIntervalOptions}
        enabledIntervals={enabledIntervals}
        onToggleInterval={toggleInterval}
        musicalKey={key}
        onKeyChange={handleKeyChange}
        answerMode={answerMode}
        onAnswerModeChange={setAnswerMode}
        playbackMode={playbackMode}
        onPlaybackModeChange={setPlaybackMode}
        onStart={startExercise}
      />
    );
  }

  if (phase === ExercisePhase.QUESTION && question) {
    return (
      <QuestionPhase
        question={question}
        answerMode={answerMode}
        onPlay={playQuestion}
        selectAnswer={selectAnswer}
        onSelectAnswer={setSelectAnswer}
        enabledIntervals={enabledIntervals}
        musicalKey={key}
        range={range}
        highlightedKeys={highlightedKeys}
        bottomKeyId={bottomKeyId}
        onKeyboardAnswer={setAnswerTopKeyId}
        keyboardAnswerKeyId={answerTopKeyId}
        sheetMeasures={sheetMeasures}
        sheetAccidental={sheetAccidental}
        measureWidth={INTERVAL_EXERCISE_CONFIG.measureWidth}
        onSheetAccidentalChange={setSheetAccidental}
        onSheetAnswer={handleSheetAnswer}
        canSubmit={canSubmit}
        onSubmit={submitAnswer}
        onBackToSettings={() => setPhase(ExercisePhase.SETTINGS)}
        enabledAccidentals={new Set(effectiveAccidentalOptions)}
      />
    );
  }

  if (phase === ExercisePhase.FEEDBACK && question) {
    return (
      <FeedbackPhase
        answerMode={answerMode}
        question={question}
        musicalKey={key}
        answeredIntervalInstance={answerIntervalInstance}
        correctInterval={intervalTypeFromInstance(question)}
        answeredInterval={answeredInterval}
        feedbackStatus={feedbackStatus}
        feedbackNote={feedbackNote}
        playbackMode={playbackMode}
        range={range}
        measureWidth={INTERVAL_EXERCISE_CONFIG.measureWidth}
        answeredHadExplicitAccidental={sheetAnswerExplicitAccidental}
        onNext={startExercise}
        onBackToSettings={() => setPhase(ExercisePhase.SETTINGS)}
      />
    );
  }

  return null;
};
