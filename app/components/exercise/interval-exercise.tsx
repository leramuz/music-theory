'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  intervalTypeFromInstance,
  randomIntervalInstanceInRange,
  resolveKeyboardIntervalInstance,
} from '@/helpers/interval';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { playInterval } from '@/helpers/audio';
import { adaptVexKeyToSpelling } from '@/helpers/pitch-spelling';
import { makeIntervalMeasure } from '@/helpers/interval-sheet';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { Interval, IntervalInstance } from '@/types/interval';
import { PianoKeyId } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';
import { Accidental } from '@/types/accidental';
import { PlaybackMode } from '@/types/playback-mode';
import { ExercisePhase } from '@/types/exercise';
import { AnswerMode } from '@/types/answer-mode';
import { RangeOption } from '@/types/range-option';
import { MeasureConfig, StaveClickPayload } from '@/types/music-sheet';
import { KeyHighlightColor } from '@/components/interactive-piano';
import { SettingsPhase } from '@/components/exercise/phases/settings-phase';
import { QuestionPhase } from '@/components/exercise/phases/question-phase';
import { FeedbackPhase } from '@/components/exercise/phases/feedback-phase';

type IntervalExerciseProps = {
  intervalOptions: Interval[];
  accidentalOptions: Accidental[];
};

export const IntervalExercise = ({ intervalOptions, accidentalOptions }: IntervalExerciseProps) => {
  const [range, setRange] = useState<RangeOption>(RangeOption.C4_C5);
  const [enabledIntervals, setEnabledIntervals] = useState<Set<Interval>>(new Set(intervalOptions));
  const [answerMode, setAnswerMode] = useState<AnswerMode>(AnswerMode.SELECT);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.HARMONIC);

  const [phase, setPhase] = useState<ExercisePhase>(ExercisePhase.SETTINGS);
  const [question, setQuestion] = useState<IntervalInstance | null>(null);

  const [selectAnswer, setSelectAnswer] = useState<Interval | null>(null);
  const [sheetAnswerTopSpelling, setSheetAnswerTopSpelling] = useState<PitchSpelling | null>(null);
  const [sheetAccidental, setSheetAccidental] = useState<Accidental | null>(null);
  const [answerTopKeyId, setAnswerTopKeyId] = useState<PianoKeyId | null>(null);

  const [isCorrect, setIsCorrect] = useState(false);

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
      return resolveKeyboardIntervalInstance(question.bottom, answerTopKeyId, enabledIntervals);
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
    return [makeIntervalMeasure(question.bottom, sheetAnswerTopSpelling ?? undefined)];
  }, [question, sheetAnswerTopSpelling]);

  const canSubmit =
    (answerMode === AnswerMode.SELECT && selectAnswer !== null) ||
    (answerMode === AnswerMode.KEYBOARD && answerTopKeyId !== null) ||
    (answerMode === AnswerMode.SHEET && sheetAnswerTopSpelling !== null);

  const resetAnswers = useCallback(() => {
    setSelectAnswer(null);
    setAnswerTopKeyId(null);
    setSheetAnswerTopSpelling(null);
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
    const q = randomIntervalInstanceInRange(enabledIntervals, pianoRangeFromOption(range));
    if (q) startQuestion(q);
  }, [enabledIntervals, range, startQuestion]);

  const playQuestion = useCallback(() => {
    if (question) playInterval(question, playbackMode);
  }, [question, playbackMode]);

  const submitAnswer = useCallback(() => {
    if (!question) return;

    if (answerMode === AnswerMode.SELECT && selectAnswer) {
      const correct = intervalTypeFromInstance(question);
      setIsCorrect(selectAnswer === correct);
    } else if (answerMode === AnswerMode.KEYBOARD && answerTopKeyId) {
      setIsCorrect(answerTopKeyId === getPianoKeyBySpelling(question.top).id);
    } else if (answerMode === AnswerMode.SHEET && sheetAnswerTopSpelling) {
      setIsCorrect(sheetAnswerTopSpelling === question.top);
    }

    setPhase(ExercisePhase.FEEDBACK);
  }, [question, answerMode, selectAnswer, answerTopKeyId, sheetAnswerTopSpelling]);

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
        const spelling = adaptVexKeyToSpelling(payload.noteKey, sheetAccidental);
        getPianoKeyBySpelling(spelling);
        setSheetAnswerTopSpelling(spelling);
      } catch {
        // invalid spelling, ignore
      }
    },
    [sheetAccidental],
  );

  if (phase === ExercisePhase.SETTINGS) {
    return (
      <SettingsPhase
        range={range}
        onRangeChange={setRange}
        intervalOptions={intervalOptions}
        enabledIntervals={enabledIntervals}
        onToggleInterval={toggleInterval}
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
        range={range}
        highlightedKeys={highlightedKeys}
        bottomKeyId={bottomKeyId}
        onKeyboardAnswer={setAnswerTopKeyId}
        keyboardAnswerKeyId={answerTopKeyId}
        sheetMeasures={sheetMeasures}
        sheetAccidental={sheetAccidental}
        onSheetAccidentalChange={setSheetAccidental}
        onSheetAnswer={handleSheetAnswer}
        canSubmit={canSubmit}
        onSubmit={submitAnswer}
        onBackToSettings={() => setPhase(ExercisePhase.SETTINGS)}
        enabledAccidentals={new Set(accidentalOptions)}
      />
    );
  }

  if (phase === ExercisePhase.FEEDBACK && question) {
    return (
      <FeedbackPhase
        answerMode={answerMode}
        question={question}
        answeredIntervalInstance={answerIntervalInstance}
        correctInterval={intervalTypeFromInstance(question)}
        answeredInterval={answeredInterval}
        isCorrect={isCorrect}
        playbackMode={playbackMode}
        range={range}
        onNext={startExercise}
        onBackToSettings={() => setPhase(ExercisePhase.SETTINGS)}
      />
    );
  }

  return null;
};
