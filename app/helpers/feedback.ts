import { randomElement } from '@/helpers/common';
import { areEnharmonicIntervals, isMajorMinorConfusion } from '@/helpers/interval';
import {
  accidentalOfSpelling,
  displaySpellingBase,
  naturalNoteOfPitchSpelling,
} from '@/helpers/pitch-spelling';
import { keySignatureImpliedAccidental } from '@/helpers/key-signature';
import { isSpellingInScale } from '@/helpers/scale';
import { Interval } from '@/types/interval';
import { FeedbackStatus } from '@/types/feedback-status';
import { PitchSpelling } from '@/types/pitch-spelling';
import { Key } from '@/types/key';
import { Scale } from '@/types/scale';

export function randomCorrectTranslationKey(): string {
  const correctKeys = [
    'practice.intervals.feedbackPhase.correct.correct',
    'practice.intervals.feedbackPhase.correct.perfect',
    'practice.intervals.feedbackPhase.correct.wellDone',
    'practice.intervals.feedbackPhase.correct.keepItUp',
  ] as const;

  return randomElement(correctKeys);
}

export function incorrectTitleTranslationKey(correct: Interval, answered: Interval | null): string {
  if (answered === null) {
    return 'practice.intervals.feedbackPhase.incorrect.notQuite';
  }

  if (isMajorMinorConfusion(correct, answered)) {
    return 'practice.intervals.feedbackPhase.incorrect.almost';
  } else {
    return 'practice.intervals.feedbackPhase.incorrect.notQuite';
  }
}

export function getFeedbackStatus(correct: Interval, answered: Interval | null): FeedbackStatus {
  if (correct === answered) return FeedbackStatus.CORRECT;

  if (answered !== null && areEnharmonicIntervals(correct, answered))
    return FeedbackStatus.PARTIALLY_CORRECT;

  return FeedbackStatus.INCORRECT;
}

export type FeedbackNote = {
  translationKey: string;
  params?: Record<string, string>;
};

export function getFeedbackNote(
  correct: Interval,
  answered: Interval | null,
  sheetAnswerTopSpelling: PitchSpelling | null,
  key: Key | null,
  scaleSpellings: PitchSpelling[] = [],
  answerIntervalTopSpelling: PitchSpelling | null = null,
  sheetAnswerHadExplicitAccidental: boolean = false,
): FeedbackNote | null {
  if (sheetAnswerTopSpelling && key) {
    const outOfScaleFeedback = getOutOfScaleFeedback(sheetAnswerTopSpelling, key, scaleSpellings);
    if (outOfScaleFeedback) return outOfScaleFeedback;
  }

  if (answerIntervalTopSpelling && key) {
    const outOfScaleFeedback = getOutOfScaleFeedback(
      answerIntervalTopSpelling,
      key,
      scaleSpellings,
    );
    if (outOfScaleFeedback) return outOfScaleFeedback;
  }

  if (answered !== null && areEnharmonicIntervals(correct, answered)) {
    return { translationKey: 'practice.intervals.feedbackPhase.enharmonicIntervals' };
  }

  if (sheetAnswerTopSpelling && sheetAnswerHadExplicitAccidental) {
    const redundantAccidentalFeedback = getRedundantAccidentalFeedback(sheetAnswerTopSpelling, key);
    if (redundantAccidentalFeedback) return redundantAccidentalFeedback;
  }

  return null;
}

/**
 * Returns true when the accidental on `spelling` is redundant:
 * - A natural sign (♮) on a note that is already natural by default (no key signature alteration)
 * - An accidental that the key signature already implies (e.g. writing B♭ explicitly in B♭ major)
 */
export function isRedundantAccidental(spelling: PitchSpelling, key: Key | null): boolean {
  const acc = accidentalOfSpelling(spelling);
  if (acc === null) return false;

  const natural = naturalNoteOfPitchSpelling(spelling);
  const implied = key ? keySignatureImpliedAccidental(natural, key) : null;

  return acc === implied || (acc === 'n' && implied === null);
}

export type RedundantAccidentalFeedback = {
  translationKey:
    | 'practice.intervals.feedbackPhase.redundantNatural'
    | 'practice.intervals.feedbackPhase.redundantKeyAccidental';
  note: string;
};

/**
 * Returns feedback describing why an accidental on `spelling` is redundant, or null if it isn't.
 * - `redundantNatural`: ♮ written on a note that is already natural by default (e.g. F♮ in C major)
 * - `redundantKeyAccidental`: accidental already implied by the key signature (e.g. B♭ in B♭ major)
 */
export function getRedundantAccidentalFeedback(
  spelling: PitchSpelling,
  key: Key | null,
): FeedbackNote | null {
  const acc = accidentalOfSpelling(spelling);
  if (acc === null) return null;

  const natural = naturalNoteOfPitchSpelling(spelling);
  const implied = key ? keySignatureImpliedAccidental(natural, key) : null;

  if (acc === 'n' && implied === null) {
    return {
      translationKey: 'practice.intervals.feedbackPhase.redundantNatural',
      params: { note: natural },
    };
  }

  if (key && acc === implied) {
    return {
      translationKey: 'practice.intervals.feedbackPhase.redundantKeyAccidental',
      params: { note: natural },
    };
  }

  return null;
}

/**
 * Returns feedback when `spelling` is not a pitch in `scaleSpellings`, or null if it is.
 * Only meaningful when a key is active (scaleSpellings is non-empty).
 */
export function getOutOfScaleFeedback(
  spelling: PitchSpelling,
  key: Key,
  scaleSpellings: PitchSpelling[],
): FeedbackNote | null {
  if (scaleSpellings.length === 0 || isSpellingInScale(spelling, scaleSpellings)) return null;

  const translationKey =
    key.scale === Scale.MAJOR
      ? 'practice.intervals.feedbackPhase.notInScale.major'
      : 'practice.intervals.feedbackPhase.notInScale.harmonicMinor';

  return {
    translationKey,
    params: { note: displaySpellingBase(spelling), tonic: key.tonic },
  };
}
