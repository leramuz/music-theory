import { intervalTopSpelling, intervalTypeFromInstance } from '@/helpers/interval';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { PIANO_KEYS } from '@/data/piano-keys';
import { Interval } from '@/types/interval';
import { PianoKeyRange } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';
import { MajorTonic, MinorTonic, Tonic } from '@/types/tonic';

/** Returns true if `spelling` corresponds to the given root name (e.g. 'C', 'F#') at any octave. */
export const isRootSpelling = (spelling: PitchSpelling, root: MajorTonic | MinorTonic): boolean =>
  spelling.startsWith(root) && spelling.length === root.length + 1 && /\d$/.test(spelling);

/**
 * Returns all PitchSpellings belonging to a scale (defined by root + step pattern) that
 * fall within the given piano range, in ascending order.
 */
export const scaleSpellingsInRange = (
  root: Tonic,
  stepPattern: Interval[],
  range: PianoKeyRange,
): PitchSpelling[] => {
  const result: PitchSpelling[] = [];

  // Start from the lowest occurrence of the root on the whole keyboard, then walk up
  const firstRootKey = PIANO_KEYS.find((key) => key.spellings.some((s) => isRootSpelling(s, root)));

  if (!firstRootKey) return result;

  const startSpelling = firstRootKey.spellings.find((s) => isRootSpelling(s, root))!;
  let current: PitchSpelling = startSpelling;

  const firstId = getPianoKeyBySpelling(startSpelling).id;
  if (firstId >= range.from && firstId <= range.to) {
    result.push(startSpelling);
  }

  // Walk the step pattern repeatedly, collecting notes within range
  while (true) {
    for (const step of stepPattern) {
      try {
        const next = intervalTopSpelling(current, step);
        const nextId = getPianoKeyBySpelling(next).id;
        if (nextId > range.to) return result;
        if (nextId >= range.from) result.push(next);
        current = next;
      } catch {
        return result;
      }
    }
  }
};

/**
 * Returns the subset of `intervalOptions` that actually occur between any two scale notes
 * (unisons and ascending pairs) in the given list of spellings.
 */
export const intervalsInKey = (
  scaleSpellings: PitchSpelling[],
  intervalOptions: Interval[],
): Set<Interval> => {
  const found = new Set<Interval>();

  for (let i = 0; i < scaleSpellings.length; i++) {
    for (let j = i; j < scaleSpellings.length; j++) {
      try {
        const interval = intervalTypeFromInstance({
          bottom: scaleSpellings[i],
          top: scaleSpellings[j],
        });
        if (intervalOptions.includes(interval)) {
          found.add(interval);
        }
      } catch {
        // unrecognized interval — skip
      }
    }
  }

  return found;
};

/**
 * Returns the pitch class of a spelling (letter + accidental, no octave), normalising an
 * explicit natural sign to the plain letter so that e.g. 'Fn' and 'F' compare equal.
 * This preserves the distinction between enharmonic spellings with different letter names
 * (e.g. 'G#' ≠ 'Ab'), which is the correct musical behaviour for scale membership.
 */
const pitchClass = (spelling: PitchSpelling): string => spelling.slice(0, -1).replace('n', '');

/**
 * Returns true when `spelling` belongs to `scaleSpellings`, compared by pitch class.
 * Enharmonic respellings with a different letter name (e.g. Ab vs G#) are treated as
 * distinct — only the diatonic spelling for that scale is accepted.
 * An explicit natural sign is normalised away, so Fn4 matches F4.
 */
export const isSpellingInScale = (
  spelling: PitchSpelling,
  scaleSpellings: PitchSpelling[],
): boolean => scaleSpellings.some((s) => pitchClass(s) === pitchClass(spelling));
