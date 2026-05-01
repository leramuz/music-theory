import { describe, it, expect } from 'vitest';
import {
  diatonicSteps,
  chromaticSize,
  maxChromaticSize,
  intervalTopSpelling,
  simplestInterval,
  intervalSpellingComplexity,
  intervalTypeFromInstance,
  randomIntervalInstanceInRange,
  fittingIntervalsInRange,
  resolveKeyboardIntervalInstance,
} from '@/helpers/interval';
import { Interval, IntervalInstance } from '@/types/interval';
import { PianoKeyId } from '@/types/piano-key';

describe('diatonicSteps', () => {
  it('returns 0 for a unison (P1)', () => {
    expect(diatonicSteps(Interval.PERFECT_UNISON)).toBe(0);
  });

  it('returns 1 for a second (m2, M2, A2)', () => {
    expect(diatonicSteps(Interval.MINOR_SECOND)).toBe(1);
    expect(diatonicSteps(Interval.MAJOR_SECOND)).toBe(1);
    expect(diatonicSteps(Interval.AUGMENTED_SECOND)).toBe(1);
  });

  it('returns 2 for a third (m3, M3)', () => {
    expect(diatonicSteps(Interval.MINOR_THIRD)).toBe(2);
    expect(diatonicSteps(Interval.MAJOR_THIRD)).toBe(2);
  });

  it('returns 4 for a fifth (P5, d5)', () => {
    expect(diatonicSteps(Interval.PERFECT_FIFTH)).toBe(4);
    expect(diatonicSteps(Interval.DIMINISHED_FIFTH)).toBe(4);
  });

  it('returns 7 for an octave (P8)', () => {
    expect(diatonicSteps(Interval.PERFECT_OCTAVE)).toBe(7);
  });
});

describe('chromaticSize', () => {
  it('returns 0 for a perfect unison', () => {
    expect(chromaticSize(Interval.PERFECT_UNISON)).toBe(0);
  });

  it('returns 1 for a minor second', () => {
    expect(chromaticSize(Interval.MINOR_SECOND)).toBe(1);
  });

  it('returns 4 for a major third', () => {
    expect(chromaticSize(Interval.MAJOR_THIRD)).toBe(4);
  });

  it('returns 7 for a perfect fifth', () => {
    expect(chromaticSize(Interval.PERFECT_FIFTH)).toBe(7);
  });

  it('returns 12 for a perfect octave', () => {
    expect(chromaticSize(Interval.PERFECT_OCTAVE)).toBe(12);
  });

  it('returns the same semitone count for enharmonic intervals (A4 and d5)', () => {
    expect(chromaticSize(Interval.AUGMENTED_FOURTH)).toBe(6);
    expect(chromaticSize(Interval.DIMINISHED_FIFTH)).toBe(6);
  });
});

describe('maxChromaticSize', () => {
  it('returns the semitone count of a single interval', () => {
    expect(maxChromaticSize(new Set([Interval.MAJOR_THIRD]))).toBe(4);
  });

  it('returns the largest semitone count from multiple intervals', () => {
    expect(
      maxChromaticSize(
        new Set([Interval.MINOR_SECOND, Interval.PERFECT_FIFTH, Interval.MAJOR_THIRD]),
      ),
    ).toBe(7);
  });

  it('returns 12 when the octave is included', () => {
    expect(maxChromaticSize(new Set([Interval.MAJOR_THIRD, Interval.PERFECT_OCTAVE]))).toBe(12);
  });

  it('handles enharmonic intervals with the same semitone count', () => {
    expect(maxChromaticSize(new Set([Interval.AUGMENTED_FOURTH, Interval.DIMINISHED_FIFTH]))).toBe(
      6,
    );
  });
});

describe('fittingIntervalsInRange', () => {
  it('returns intervals that fit within the given piano key range', () => {
    const range = { from: PianoKeyId.C4, to: PianoKeyId.G4 };
    const fittingIntervals = fittingIntervalsInRange(new Set(Object.values(Interval)), range);

    expect(fittingIntervals).toContain(Interval.PERFECT_UNISON);
    expect(fittingIntervals).toContain(Interval.MINOR_SECOND);
    expect(fittingIntervals).toContain(Interval.MAJOR_SECOND);
    expect(fittingIntervals).toContain(Interval.MINOR_THIRD);
    expect(fittingIntervals).toContain(Interval.MAJOR_THIRD);
    expect(fittingIntervals).toContain(Interval.AUGMENTED_SECOND);
    expect(fittingIntervals).toContain(Interval.PERFECT_FOURTH);
    expect(fittingIntervals).toContain(Interval.PERFECT_FIFTH);
    expect(fittingIntervals).toContain(Interval.AUGMENTED_FOURTH);
    expect(fittingIntervals).toContain(Interval.DIMINISHED_FIFTH);
    expect(fittingIntervals).not.toContain(Interval.MINOR_SIXTH);
    expect(fittingIntervals).not.toContain(Interval.MAJOR_SIXTH);
    expect(fittingIntervals).not.toContain(Interval.MINOR_SEVENTH);
    expect(fittingIntervals).not.toContain(Interval.MAJOR_SEVENTH);
    expect(fittingIntervals).not.toContain(Interval.PERFECT_OCTAVE);
  });
});

describe('randomIntervalInstanceInRange', () => {
  const range = { from: PianoKeyId.C4, to: PianoKeyId.C5 };

  it('returns bottom and top pitch spellings', () => {
    const result = randomIntervalInstanceInRange(new Set([Interval.MAJOR_THIRD]), range);
    expect(result).toHaveProperty('bottom');
    expect(result).toHaveProperty('top');
    expect(typeof result.bottom).toBe('string');
    expect(typeof result.top).toBe('string');
  });

  it('bottom pitch is within the range', () => {
    const result = randomIntervalInstanceInRange(new Set([Interval.PERFECT_FIFTH]), range);
    const bottomOctave = parseInt(result.bottom.slice(-1), 10);
    const rangeFromOctave = 4;
    const rangeToOctave = 5;
    expect(bottomOctave).toBeGreaterThanOrEqual(rangeFromOctave);
    expect(bottomOctave).toBeLessThanOrEqual(rangeToOctave);
  });

  it('throws when the interval is too large for the range', () => {
    const tinyRange = { from: PianoKeyId.C4, to: PianoKeyId.D4 }; // only 2 semitones
    expect(() => randomIntervalInstanceInRange(new Set([Interval.MAJOR_THIRD]), tinyRange)).toThrow(
      'No enabled intervals fit in the given range',
    );
  });

  it('works for a perfect unison', () => {
    const result = randomIntervalInstanceInRange(new Set([Interval.PERFECT_UNISON]), range);
    expect(result.bottom[0]).toBe(result.top[0]);
  });

  it('works for a perfect octave across a full octave range', () => {
    const result = randomIntervalInstanceInRange(new Set([Interval.PERFECT_OCTAVE]), range);
    expect(result).toHaveProperty('bottom');
    expect(result).toHaveProperty('top');
  });
});

describe('intervalTopSpelling', () => {
  it('returns the correct top spelling for a given bottom and interval', () => {
    expect(intervalTopSpelling('C4', Interval.PERFECT_UNISON)).toBe('C4');
    expect(intervalTopSpelling('E4', Interval.MINOR_SECOND)).toBe('F4');
    expect(intervalTopSpelling('Bb4', Interval.MAJOR_SECOND)).toBe('C5');
    expect(intervalTopSpelling('E4', Interval.MINOR_THIRD)).toBe('G4');
    expect(intervalTopSpelling('C#4', Interval.MAJOR_THIRD)).toBe('E#4');
    expect(intervalTopSpelling('D4', Interval.PERFECT_FOURTH)).toBe('G4');
    expect(intervalTopSpelling('D4', Interval.PERFECT_FIFTH)).toBe('A4');
    expect(intervalTopSpelling('F4', Interval.AUGMENTED_FOURTH)).toBe('B4');
    expect(intervalTopSpelling('G4', Interval.DIMINISHED_FIFTH)).toBe('Db5');
    expect(intervalTopSpelling('Eb4', Interval.MINOR_SIXTH)).toBe('Cb5');
    expect(intervalTopSpelling('Eb4', Interval.MAJOR_SIXTH)).toBe('C5');
    expect(intervalTopSpelling('E4', Interval.MINOR_SEVENTH)).toBe('D5');
    expect(intervalTopSpelling('C#4', Interval.MAJOR_SEVENTH)).toBe('B#4');
    expect(intervalTopSpelling('A4', Interval.PERFECT_OCTAVE)).toBe('A5');
  });
});

describe('simplestInterval', () => {
  it('returns the interval with the simplest spelling', () => {
    const intervals: IntervalInstance[] = [
      { bottom: 'G#4', top: 'B#4' },
      { bottom: 'Ab4', top: 'C5' },
    ];
    const simplest = simplestInterval(intervals);
    expect(simplest).toEqual({ bottom: 'Ab4', top: 'C5' });
  });
});

describe('intervalSpellingComplexity', () => {
  it('returns 0 for a simple interval with natural spellings', () => {
    const interval: IntervalInstance = { bottom: 'C4', top: 'E4' };
    expect(intervalSpellingComplexity(interval)).toBe(0);
  });

  it('returns 1 for an interval with one accidental spelling', () => {
    const interval: IntervalInstance = { bottom: 'C#4', top: 'E4' };
    expect(intervalSpellingComplexity(interval)).toBe(1);
  });

  it('returns 4 for an interval with double accidental spellings', () => {
    const interval: IntervalInstance = { bottom: 'C##4', top: 'E#4' };
    expect(intervalSpellingComplexity(interval)).toBe(3);
  });
});

describe('intervalTypeFromInstance', () => {
  it('returns the correct interval type for a given interval instance', () => {
    const interval: IntervalInstance = { bottom: 'C4', top: 'E4' };
    expect(intervalTypeFromInstance(interval)).toBe(Interval.MAJOR_THIRD);

    const interval2: IntervalInstance = { bottom: 'D4', top: 'G4' };
    expect(intervalTypeFromInstance(interval2)).toBe(Interval.PERFECT_FOURTH);

    const interval3: IntervalInstance = { bottom: 'F4', top: 'B4' };
    expect(intervalTypeFromInstance(interval3)).toBe(Interval.AUGMENTED_FOURTH);

    const interval4: IntervalInstance = { bottom: 'E4', top: 'G4' };
    expect(intervalTypeFromInstance(interval4)).toBe(Interval.MINOR_THIRD);

    const interval5: IntervalInstance = { bottom: 'G#4', top: 'F#5' };
    expect(intervalTypeFromInstance(interval5)).toBe(Interval.MINOR_SEVENTH);

    const interval6: IntervalInstance = { bottom: 'Bb4', top: 'C#5' };
    expect(intervalTypeFromInstance(interval6)).toBe(Interval.AUGMENTED_SECOND);

    const interval7: IntervalInstance = { bottom: 'C4', top: 'C5' };
    expect(intervalTypeFromInstance(interval7)).toBe(Interval.PERFECT_OCTAVE);

    const interval8: IntervalInstance = { bottom: 'Bn3', top: 'Ab4' };
    expect(intervalTypeFromInstance(interval8)).toBe(Interval.DIMINISHED_SEVENTH);

    const interval9: IntervalInstance = { bottom: 'C4', top: 'G#4' };
    expect(intervalTypeFromInstance(interval9)).toBe(Interval.AUGMENTED_FIFTH);
  });
});

describe('resolveKeyboardIntervalInstance', () => {
  it('returns the correct interval instance for given bottom spelling and top key ID', () => {
    const result = resolveKeyboardIntervalInstance(
      'C4',
      PianoKeyId.E4,
      new Set(Object.values(Interval)),
    );
    expect(result).toEqual({ bottom: 'C4', top: 'E4' });
  });

  it('returns null if the resulting interval is not in the enabled intervals set', () => {
    const result = resolveKeyboardIntervalInstance(
      'C4',
      PianoKeyId.E4,
      new Set([Interval.PERFECT_FIFTH]),
    );
    expect(result).toBeNull();
  });

  it('handles enharmonic equivalents correctly', () => {
    const result = resolveKeyboardIntervalInstance(
      'C4',
      PianoKeyId.Gs4,
      new Set([Interval.MINOR_SIXTH]),
    );
    expect(result).toEqual({ bottom: 'C4', top: 'Ab4' });

    const result2 = resolveKeyboardIntervalInstance(
      'E4',
      PianoKeyId.Gs4,
      new Set([Interval.MAJOR_THIRD]),
    );
    expect(result2).toEqual({ bottom: 'E4', top: 'G#4' });

    const result3 = resolveKeyboardIntervalInstance(
      'E4',
      PianoKeyId.Gs4,
      new Set([Interval.DIMINISHED_FOURTH]),
    );
    expect(result3).toEqual({ bottom: 'E4', top: 'Ab4' });
  });
});
