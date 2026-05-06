import { describe, it, expect } from 'vitest';
import { scaleSpellingsInRange, intervalsInKey, isRootSpelling } from '@/helpers/scale';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { SCALE_STEP_PATTERN } from '@/data/scales';
import { Interval } from '@/types/interval';
import { RangeOption } from '@/types/range-option';
import { MajorTonic } from '@/types/tonic';

describe('scaleSpellingsInRange', () => {
  describe('C major, C4-C5', () => {
    const spellings = scaleSpellingsInRange(
      'C',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C4_C5),
    );

    it('returns exactly 8 notes (root to octave)', () => {
      expect(spellings).toHaveLength(8);
    });

    it('starts on C4 and ends on C5', () => {
      expect(spellings[0]).toBe('C4');
      expect(spellings[7]).toBe('C5');
    });

    it('contains all diatonic notes of C major', () => {
      expect(spellings).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']);
    });
  });

  describe('A harmonic minor, C4-C5', () => {
    const spellings = scaleSpellingsInRange(
      'A',
      SCALE_STEP_PATTERN.harmonicMinor,
      pianoRangeFromOption(RangeOption.C4_C5),
    );

    it('returns notes within range only', () => {
      // A harmonic minor: A B C D E F G# — range C4-C5 starts mid-scale
      expect(
        spellings.every((s) => {
          const octave = parseInt(s.slice(-1));
          return octave >= 4 && octave <= 5;
        }),
      ).toBe(true);
    });

    it('includes G# (raised 7th of A harmonic minor)', () => {
      expect(spellings.some((s) => s.startsWith('G#'))).toBe(true);
    });

    it('does not include G natural', () => {
      expect(spellings.some((s) => s === 'G4')).toBe(false);
    });
  });

  describe('G major, C4-C5', () => {
    const spellings = scaleSpellingsInRange(
      'G',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C4_C5),
    );

    it('includes F# (raised 7th of G major)', () => {
      expect(spellings.some((s) => s.startsWith('F#'))).toBe(true);
    });

    it('does not include F natural', () => {
      expect(spellings.some((s) => s === 'F4')).toBe(false);
    });
  });

  describe('F major, C4-C5', () => {
    const spellings = scaleSpellingsInRange(
      'F',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C4_C5),
    );

    it('includes Bb (flattened 4th of F major)', () => {
      expect(spellings.some((s) => s.startsWith('Bb'))).toBe(true);
    });

    it('does not include B natural', () => {
      expect(spellings.some((s) => s === 'B4')).toBe(false);
    });
  });

  describe('C major, C3-C5 (two octaves)', () => {
    const spellings = scaleSpellingsInRange(
      'C',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C3_C5),
    );

    it('returns 15 notes (two octaves + shared boundary)', () => {
      expect(spellings).toHaveLength(15);
    });

    it('starts on C3 and ends on C5', () => {
      expect(spellings[0]).toBe('C3');
      expect(spellings[14]).toBe('C5');
    });
  });

  it('returns empty array for an unknown root', () => {
    const spellings = scaleSpellingsInRange(
      'X',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C4_C5),
    );
    expect(spellings).toEqual([]);
  });
});

describe('intervalsInKey', () => {
  const allIntervals = Object.values(Interval);

  describe('C major, C4-C5', () => {
    const spellings = scaleSpellingsInRange(
      'C',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C4_C5),
    );
    const found = intervalsInKey(spellings, allIntervals);

    it('includes Perfect Unison', () => {
      expect(found.has(Interval.PERFECT_UNISON)).toBe(true);
    });

    it('includes Perfect Octave', () => {
      expect(found.has(Interval.PERFECT_OCTAVE)).toBe(true);
    });

    it('includes all diatonic intervals of major', () => {
      expect(found.has(Interval.MAJOR_SECOND)).toBe(true);
      expect(found.has(Interval.MAJOR_THIRD)).toBe(true);
      expect(found.has(Interval.PERFECT_FOURTH)).toBe(true);
      expect(found.has(Interval.PERFECT_FIFTH)).toBe(true);
      expect(found.has(Interval.MAJOR_SIXTH)).toBe(true);
      expect(found.has(Interval.MAJOR_SEVENTH)).toBe(true);
    });

    it('includes minor intervals that occur between diatonic pairs', () => {
      expect(found.has(Interval.MINOR_SECOND)).toBe(true);
      expect(found.has(Interval.MINOR_THIRD)).toBe(true);
      expect(found.has(Interval.MINOR_SIXTH)).toBe(true);
      expect(found.has(Interval.MINOR_SEVENTH)).toBe(true);
    });

    it('does not include augmented or diminished intervals not in major', () => {
      expect(found.has(Interval.AUGMENTED_SECOND)).toBe(false);
      expect(found.has(Interval.AUGMENTED_FIFTH)).toBe(false);
      expect(found.has(Interval.DIMINISHED_SEVENTH)).toBe(false);
    });
  });

  describe('A harmonic minor, C4-C5', () => {
    const spellings = scaleSpellingsInRange(
      'A',
      SCALE_STEP_PATTERN.harmonicMinor,
      pianoRangeFromOption(RangeOption.C4_C5),
    );
    const found = intervalsInKey(spellings, allIntervals);

    it('includes Augmented Second (characteristic of harmonic minor)', () => {
      expect(found.has(Interval.AUGMENTED_SECOND)).toBe(true);
    });

    it('includes Diminished Fourth', () => {
      expect(found.has(Interval.DIMINISHED_FOURTH)).toBe(true);
    });

    it('includes Augmented Fifth', () => {
      expect(found.has(Interval.AUGMENTED_FIFTH)).toBe(true);
    });
  });

  it('only returns intervals present in the provided intervalOptions', () => {
    const spellings = scaleSpellingsInRange(
      'C',
      SCALE_STEP_PATTERN.major,
      pianoRangeFromOption(RangeOption.C4_C5),
    );
    const limited = [Interval.PERFECT_FIFTH, Interval.MAJOR_THIRD];
    const found = intervalsInKey(spellings, limited);

    expect(found.has(Interval.PERFECT_FIFTH)).toBe(true);
    expect(found.has(Interval.MAJOR_THIRD)).toBe(true);
    expect(found.has(Interval.MAJOR_SECOND)).toBe(false);
  });

  it('returns empty set for empty spellings', () => {
    const found = intervalsInKey([], allIntervals);
    expect(found.size).toBe(0);
  });

  it('returns only Perfect Unison for a single note', () => {
    const found = intervalsInKey(['C4'], allIntervals);
    expect(found.size).toBe(1);
    expect(found.has(Interval.PERFECT_UNISON)).toBe(true);
  });
});

describe('isRootSpelling', () => {
  it('returns true for a spelling that matches the root', () => {
    expect(isRootSpelling('C4', MajorTonic.C)).toBe(true);
    expect(isRootSpelling('F#3', MajorTonic.F_SHARP)).toBe(true);
    expect(isRootSpelling('Bb5', MajorTonic.B_FLAT)).toBe(true);
  });

  it('returns false for a spelling that does not match the root', () => {
    expect(isRootSpelling('C4', MajorTonic.D)).toBe(false);
    expect(isRootSpelling('F#3', MajorTonic.F)).toBe(false);
    expect(isRootSpelling('Bb5', MajorTonic.B)).toBe(false);
  });

  it('returns false for a spelling that starts with the root but has extra characters', () => {
    expect(isRootSpelling('C#4', MajorTonic.C)).toBe(false);
    expect(isRootSpelling('F##3', MajorTonic.F_SHARP)).toBe(false);
    expect(isRootSpelling('Bbb5', MajorTonic.B_FLAT)).toBe(false);
  });
});
