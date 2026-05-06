import {
  spellingByNaturalNote,
  baseSpellings,
  spellingComplexity,
  naturalNoteOfPitchSpelling,
  stepsBetweenNaturals,
} from '@/helpers/pitch-spelling';
import { randomElement } from '@/helpers/common';
import {
  getPianoKeyById,
  getPianoKeyBySpelling,
  getPianoKeyIdByOffset,
  getPianoKeysInRange,
} from '@/helpers/piano-key';
import { letterAtDiatonicStep } from '@/helpers/pitch-spelling';
import { Interval, IntervalInstance } from '@/types/interval';
import { PianoKeyId, PianoKeyRange } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';
import { SEMITONES } from '@/data/interval-semitones';

export const diatonicSteps = (interval: Interval): number => {
  const degree = parseInt(interval.match(/\d+/)![0], 10);
  return degree - 1;
};

export const chromaticSize = (interval: Interval): number => SEMITONES[interval];

export const maxChromaticSize = (intervals: Iterable<Interval>): number =>
  Math.max(...[...intervals].map(chromaticSize));

export const intervalTopSpelling = (bottom: PitchSpelling, interval: Interval): PitchSpelling => {
  const steps = diatonicSteps(interval);
  const semitones = chromaticSize(interval);
  const bottomKey = getPianoKeyBySpelling(bottom);

  const topKeyId = getPianoKeyIdByOffset(bottomKey.id, semitones);
  if (!topKeyId) {
    throw new Error('Interval is too large for the given range');
  }

  const topKey = getPianoKeyById(topKeyId);

  const expectedNaturalNote = letterAtDiatonicStep(bottom, steps);
  const top = spellingByNaturalNote(topKey.spellings, expectedNaturalNote);

  if (!top) {
    throw new Error('No top spelling matches the expected interval bottom');
  }

  return top;
};

export const simplestInterval = (intervals: IntervalInstance[]): IntervalInstance => {
  return intervals.sort((a, b) => intervalSpellingComplexity(a) - intervalSpellingComplexity(b))[0];
};

export const fittingIntervalsInRange = (
  intervals: Set<Interval>,
  range: PianoKeyRange,
): Interval[] => {
  const rangeSize = range.to - range.from;
  return Array.from(intervals).filter((interval) => chromaticSize(interval) <= rangeSize);
};

export const randomIntervalInstanceInRange = (
  intervals: Set<Interval>,
  range: PianoKeyRange,
): IntervalInstance => {
  const fittingIntervals = fittingIntervalsInRange(intervals, range);

  if (fittingIntervals.length === 0) {
    throw new Error('No enabled intervals fit in the given range');
  }

  const randomInterval = randomElement(fittingIntervals);
  const semitones = chromaticSize(randomInterval);

  const upperKeyId = getPianoKeyIdByOffset(range.to, -semitones);
  if (!upperKeyId) {
    throw new Error('Interval is too large for the given range');
  }

  const bottomKeyCandidates = getPianoKeysInRange({
    from: range.from,
    to: upperKeyId,
  });

  const bottomKey = randomElement(bottomKeyCandidates);

  const bottomSpellings = baseSpellings(bottomKey.spellings);

  if (!bottomSpellings || bottomSpellings.length === 0) {
    throw new Error('Bottom key has no valid spelling');
  }

  const possibleIntervals = bottomSpellings.map((spelling) => ({
    bottom: spelling,
    top: intervalTopSpelling(spelling, randomInterval),
  }));

  const resultInterval = simplestInterval(possibleIntervals);

  if (!resultInterval) {
    throw new Error('No valid interval instance found');
  }

  return resultInterval;
};

export const intervalSpellingComplexity = (interval: IntervalInstance): number => {
  return spellingComplexity(interval.bottom) + spellingComplexity(interval.top);
};

export const translationKeyForInterval = (interval: Interval): string => {
  const map: Record<Interval, string> = {
    [Interval.PERFECT_UNISON]: 'perfectUnison',
    [Interval.MINOR_SECOND]: 'minorSecond',
    [Interval.MAJOR_SECOND]: 'majorSecond',
    [Interval.AUGMENTED_SECOND]: 'augmentedSecond',
    [Interval.MINOR_THIRD]: 'minorThird',
    [Interval.MAJOR_THIRD]: 'majorThird',
    [Interval.PERFECT_FOURTH]: 'perfectFourth',
    [Interval.AUGMENTED_FOURTH]: 'augmentedFourth',
    [Interval.DIMINISHED_FOURTH]: 'diminishedFourth',
    [Interval.PERFECT_FIFTH]: 'perfectFifth',
    [Interval.DIMINISHED_FIFTH]: 'diminishedFifth',
    [Interval.AUGMENTED_FIFTH]: 'augmentedFifth',
    [Interval.MINOR_SIXTH]: 'minorSixth',
    [Interval.MAJOR_SIXTH]: 'majorSixth',
    [Interval.MINOR_SEVENTH]: 'minorSeventh',
    [Interval.MAJOR_SEVENTH]: 'majorSeventh',
    [Interval.DIMINISHED_SEVENTH]: 'diminishedSeventh',
    [Interval.PERFECT_OCTAVE]: 'perfectOctave',
  };

  return map[interval];
};

export const intervalByStepsAndSemitones = (steps: number, semitones: number): Interval => {
  const match = (Object.values(Interval) as Interval[]).find(
    (i) => diatonicSteps(i) === steps && chromaticSize(i) === semitones,
  );

  if (!match) {
    throw new Error(`No interval found for ${steps} steps and ${semitones} semitones`);
  }

  return match;
};

export const intervalTypeFromInstance = (interval: IntervalInstance): Interval => {
  const bottomKey = getPianoKeyBySpelling(interval.bottom);
  const topKey = getPianoKeyBySpelling(interval.top);

  const semitones = topKey.id - bottomKey.id;
  const bottomNatural = naturalNoteOfPitchSpelling(interval.bottom);
  const topNatural = naturalNoteOfPitchSpelling(interval.top);
  const steps = stepsBetweenNaturals(bottomNatural, topNatural, semitones);

  return intervalByStepsAndSemitones(steps, semitones);
};

export const resolveKeyboardIntervalInstance = (
  bottom: PitchSpelling,
  topKeyId: PianoKeyId,
  enabledIntervals: Set<Interval>,
  scaleSpellings?: PitchSpelling[],
): IntervalInstance | null => {
  const topKey = getPianoKeyById(topKeyId);

  // When scale spellings are available, prefer the spelling that matches the scale
  // (e.g. Ab over G# in C minor). Strip octave to match across registers.
  const scaleLetterAccidentals = scaleSpellings
    ? new Set(scaleSpellings.map((s) => s.slice(0, -1)))
    : null;
  const spellingPool =
    scaleLetterAccidentals !== null
      ? topKey.spellings.filter((s) => scaleLetterAccidentals.has(s.slice(0, -1))).length > 0
        ? topKey.spellings.filter((s) => scaleLetterAccidentals.has(s.slice(0, -1)))
        : topKey.spellings
      : topKey.spellings;

  const candidates = spellingPool.flatMap((spelling) => {
    try {
      const instance = { bottom, top: spelling };
      return enabledIntervals.has(intervalTypeFromInstance(instance)) ? [instance] : [];
    } catch {
      return [];
    }
  });

  return candidates.length > 0 ? simplestInterval(candidates) : null;
};

export const randomIntervalInstanceInKey = (
  enabledIntervals: Set<Interval>,
  scaleSpellings: PitchSpelling[],
): IntervalInstance | null => {
  const candidates: IntervalInstance[] = [];

  for (let i = 0; i < scaleSpellings.length; i++) {
    for (let j = i; j < scaleSpellings.length; j++) {
      try {
        const instance: IntervalInstance = {
          bottom: scaleSpellings[i],
          top: scaleSpellings[j],
        };

        if (enabledIntervals.has(intervalTypeFromInstance(instance))) {
          candidates.push(instance);
        }
      } catch {
        // unrecognized interval — skip
      }
    }
  }

  return candidates.length > 0 ? randomElement(candidates) : null;
};
