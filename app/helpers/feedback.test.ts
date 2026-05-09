import { describe, it, expect } from 'vitest';
import {
  randomCorrectTranslationKey,
  incorrectTitleTranslationKey,
  getFeedbackStatus,
  getFeedbackNote,
  isRedundantAccidental,
  getRedundantAccidentalFeedback,
  getOutOfScaleFeedback,
} from '@/helpers/feedback';
import { Interval } from '@/types/interval';
import { FeedbackStatus } from '@/types/feedback-status';
import { Key } from '@/types/key';
import { MajorTonic } from '@/types/tonic';
import { PitchSpelling } from '@/types/pitch-spelling';

describe('randomCorrectTranslationKey', () => {
  const validKeys = [
    'practice.intervals.feedbackPhase.correct.correct',
    'practice.intervals.feedbackPhase.correct.perfect',
    'practice.intervals.feedbackPhase.correct.wellDone',
    'practice.intervals.feedbackPhase.correct.keepItUp',
  ];

  it('returns one of the valid translation keys', () => {
    const key = randomCorrectTranslationKey();
    expect(validKeys).toContain(key);
  });

  it('returns all keys given enough calls', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(randomCorrectTranslationKey());
    }
    for (const key of validKeys) {
      expect(seen).toContain(key);
    }
  });
});

describe('incorrectTitleTranslationKey', () => {
  it('returns the "almost" key for major/minor confusion (m3 vs M3)', () => {
    expect(incorrectTitleTranslationKey(Interval.MAJOR_THIRD, Interval.MINOR_THIRD)).toBe(
      'practice.intervals.feedbackPhase.incorrect.almost',
    );
  });

  it('returns the "almost" key for major/minor confusion (M2 vs m2)', () => {
    expect(incorrectTitleTranslationKey(Interval.MAJOR_SECOND, Interval.MINOR_SECOND)).toBe(
      'practice.intervals.feedbackPhase.incorrect.almost',
    );
  });

  it('returns the "almost" key for major/minor confusion (m6 vs M6)', () => {
    expect(incorrectTitleTranslationKey(Interval.MINOR_SIXTH, Interval.MAJOR_SIXTH)).toBe(
      'practice.intervals.feedbackPhase.incorrect.almost',
    );
  });

  it('returns the "notQuite" key for completely different intervals', () => {
    expect(incorrectTitleTranslationKey(Interval.PERFECT_FIFTH, Interval.MINOR_THIRD)).toBe(
      'practice.intervals.feedbackPhase.incorrect.notQuite',
    );
  });

  it('returns the "notQuite" key when same number but not major/minor (e.g. P4 vs A4)', () => {
    expect(incorrectTitleTranslationKey(Interval.PERFECT_FOURTH, Interval.AUGMENTED_FOURTH)).toBe(
      'practice.intervals.feedbackPhase.incorrect.notQuite',
    );
  });

  it('returns the "notQuite" key when same number but not major/minor (e.g. P5 vs d5)', () => {
    expect(incorrectTitleTranslationKey(Interval.PERFECT_FIFTH, Interval.DIMINISHED_FIFTH)).toBe(
      'practice.intervals.feedbackPhase.incorrect.notQuite',
    );
  });
});

const cMajor: Key = { scale: 'major', tonic: MajorTonic.C };
const bFlatMajor: Key = { scale: 'major', tonic: MajorTonic.B_FLAT };
const fMajor: Key = { scale: 'major', tonic: MajorTonic.F };

describe('getFeedbackStatus', () => {
  it('returns CORRECT when answered equals correct', () => {
    expect(getFeedbackStatus(Interval.PERFECT_FIFTH, Interval.PERFECT_FIFTH)).toBe(
      FeedbackStatus.CORRECT,
    );
  });

  it('returns PARTIALLY_CORRECT for enharmonic intervals (A4 vs d5)', () => {
    expect(getFeedbackStatus(Interval.AUGMENTED_FOURTH, Interval.DIMINISHED_FIFTH)).toBe(
      FeedbackStatus.PARTIALLY_CORRECT,
    );
  });

  it('returns INCORRECT for completely different intervals', () => {
    expect(getFeedbackStatus(Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH)).toBe(
      FeedbackStatus.INCORRECT,
    );
  });

  it('returns INCORRECT when answered is null', () => {
    expect(getFeedbackStatus(Interval.PERFECT_FIFTH, null)).toBe(FeedbackStatus.INCORRECT);
  });
});

describe('getFeedbackNote', () => {
  it('returns enharmonic note for enharmonic intervals', () => {
    const result = getFeedbackNote(
      Interval.AUGMENTED_FOURTH,
      Interval.DIMINISHED_FIFTH,
      null,
      null,
    );
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.enharmonicIntervals');
  });

  it('returns null for a correct answer with no redundant accidental', () => {
    expect(getFeedbackNote(Interval.PERFECT_FIFTH, Interval.PERFECT_FIFTH, null, null)).toBeNull();
  });

  it('returns null for a plain incorrect answer with no sheet spelling', () => {
    expect(getFeedbackNote(Interval.MAJOR_THIRD, Interval.MINOR_THIRD, null, null)).toBeNull();
  });

  it('returns redundant natural note for Fn4 in C major', () => {
    const result = getFeedbackNote(
      Interval.PERFECT_FOURTH,
      Interval.PERFECT_FOURTH,
      'Fn4',
      cMajor,
      [],
      null,
      true,
    );
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.redundantNatural');
    expect(result?.params?.note).toBe('F');
  });

  it('returns redundant key signature note for Bb4 in Bb major when accidental was explicitly selected', () => {
    const result = getFeedbackNote(
      Interval.PERFECT_FOURTH,
      Interval.PERFECT_FOURTH,
      'Bb4',
      bFlatMajor,
      [],
      null,
      true,
    );
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.redundantKeyAccidental');
    expect(result?.params?.note).toBe('B');
  });

  it('returns null for Bb4 in Bb major when no explicit accidental was selected', () => {
    const result = getFeedbackNote(
      Interval.PERFECT_FOURTH,
      Interval.PERFECT_FOURTH,
      'Bb4',
      bFlatMajor,
    );
    expect(result).toBeNull();
  });

  it('prioritises enharmonic note over redundant accidental', () => {
    // Even if there were a redundant accidental, enharmonic check comes first
    const result = getFeedbackNote(
      Interval.AUGMENTED_FOURTH,
      Interval.DIMINISHED_FIFTH,
      'Fn4',
      cMajor,
    );
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.enharmonicIntervals');
  });
});

describe('isRedundantAccidental', () => {
  it('returns false when spelling has no accidental', () => {
    expect(isRedundantAccidental('F4', cMajor)).toBe(false);
  });

  it('returns true for natural sign on a note already natural by default (Fn4 in C major)', () => {
    expect(isRedundantAccidental('Fn4', cMajor)).toBe(true);
  });

  it('returns true for natural sign on a note already natural by default with no key (Cn4)', () => {
    expect(isRedundantAccidental('Cn4', null)).toBe(true);
  });

  it('returns true when accidental matches what the key signature implies (Bb4 in Bb major)', () => {
    expect(isRedundantAccidental('Bb4', bFlatMajor)).toBe(true);
  });

  it('returns false for a natural sign on a note altered by the key signature (Bn4 in Bb major)', () => {
    expect(isRedundantAccidental('Bn4', bFlatMajor)).toBe(false);
  });

  it('returns false for a sharp not in the key signature (F#4 in C major)', () => {
    expect(isRedundantAccidental('F#4', cMajor)).toBe(false);
  });

  it('returns true for flat matching key signature (Bb4 in F major)', () => {
    expect(isRedundantAccidental('Bb4', fMajor)).toBe(true);
  });
});

describe('getRedundantAccidentalFeedback', () => {
  it('returns null when spelling has no accidental', () => {
    expect(getRedundantAccidentalFeedback('G4', cMajor)).toBeNull();
  });

  it('returns redundantNatural for Fn4 in C major', () => {
    const result = getRedundantAccidentalFeedback('Fn4', cMajor);
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.redundantNatural');
    expect(result?.params?.note).toBe('F');
  });

  it('returns redundantNatural when key is null (Cn4)', () => {
    const result = getRedundantAccidentalFeedback('Cn4', null);
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.redundantNatural');
    expect(result?.params?.note).toBe('C');
  });

  it('returns redundantKeyAccidental for Bb4 in Bb major', () => {
    const result = getRedundantAccidentalFeedback('Bb4', bFlatMajor);
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.redundantKeyAccidental');
    expect(result?.params?.note).toBe('B');
  });

  it('returns null for Bn4 in Bb major (needed to cancel the key sig)', () => {
    expect(getRedundantAccidentalFeedback('Bn4', bFlatMajor)).toBeNull();
  });

  it('returns null for F#4 in C major (chromatic alteration, not redundant)', () => {
    expect(getRedundantAccidentalFeedback('F#4', cMajor)).toBeNull();
  });
});

describe('getOutOfScaleFeedback', () => {
  const cMajorSpellings: PitchSpelling[] = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
  const aHarmonicMinorSpellings: PitchSpelling[] = [
    'A3',
    'B3',
    'C4',
    'D4',
    'E4',
    'F4',
    'G#4',
    'A4',
  ];

  it('returns null when the note is in the scale', () => {
    expect(getOutOfScaleFeedback('F4', cMajor, cMajorSpellings)).toBeNull();
  });

  it('returns null for a note with a redundant natural that is in the scale (Fn4 in C major)', () => {
    expect(getOutOfScaleFeedback('Fn4', cMajor, cMajorSpellings)).toBeNull();
  });

  it('returns null when scaleSpellings is empty', () => {
    expect(getOutOfScaleFeedback('F#4', cMajor, [])).toBeNull();
  });

  it('returns major notInScale feedback for F#4 in C major', () => {
    const result = getOutOfScaleFeedback('F#4', cMajor, cMajorSpellings);
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.notInScale.major');
    expect(result?.params?.note).toBe('F♯');
    expect(result?.params?.tonic).toBe('C');
  });

  it('returns major notInScale feedback for Bb4 in C major', () => {
    const result = getOutOfScaleFeedback('Bb4', cMajor, cMajorSpellings);
    expect(result?.translationKey).toBe('practice.intervals.feedbackPhase.notInScale.major');
    expect(result?.params?.note).toBe('B♭');
  });

  it('returns harmonicMinor notInScale feedback for G4 in A harmonic minor', () => {
    const aHarmonicMinorKey: Key = { scale: 'harmonicMinor', tonic: 'A' };
    const result = getOutOfScaleFeedback('G4', aHarmonicMinorKey, aHarmonicMinorSpellings);
    expect(result?.translationKey).toBe(
      'practice.intervals.feedbackPhase.notInScale.harmonicMinor',
    );
    expect(result?.params?.note).toBe('G');
    expect(result?.params?.tonic).toBe('A');
  });

  it('returns null for G#4 in A harmonic minor (raised 7th is in scale)', () => {
    const aHarmonicMinorKey: Key = { scale: 'harmonicMinor', tonic: 'A' };
    expect(getOutOfScaleFeedback('G#4', aHarmonicMinorKey, aHarmonicMinorSpellings)).toBeNull();
  });

  it('returns harmonicMinor notInScale feedback for enharmonic spelling of a key signature note (Ab4 in A harmonic minor)', () => {
    const aHarmonicMinorKey: Key = { scale: 'harmonicMinor', tonic: 'A' };
    const result = getOutOfScaleFeedback('Ab4', aHarmonicMinorKey, aHarmonicMinorSpellings);
    expect(result?.translationKey).toBe(
      'practice.intervals.feedbackPhase.notInScale.harmonicMinor',
    );
    expect(result?.params?.note).toBe('A♭');
    expect(result?.params?.tonic).toBe('A');
  });
});
