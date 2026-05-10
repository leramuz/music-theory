import { Chord } from '@/types/chord';
import { Interval } from '@/types/interval';

/**
 * Each chord's formula expressed as an ordered array of intervals above the bass note.
 */
export const CHORD_FORMULAS: Record<Chord, Interval[]> = {
  // ── Major Triad ────────────────────────────────────────────────────────────
  'majorTriad:root': [Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH],
  'majorTriad:first': [Interval.MINOR_THIRD, Interval.MINOR_SIXTH],
  'majorTriad:second': [Interval.PERFECT_FOURTH, Interval.MAJOR_SIXTH],

  // ── Minor Triad ────────────────────────────────────────────────────────────
  'minorTriad:root': [Interval.MINOR_THIRD, Interval.PERFECT_FIFTH],
  'minorTriad:first': [Interval.MAJOR_THIRD, Interval.MAJOR_SIXTH],
  'minorTriad:second': [Interval.PERFECT_FOURTH, Interval.MINOR_SIXTH],

  // ── Diminished Triad ───────────────────────────────────────────────────────
  'diminishedTriad:root': [Interval.MINOR_THIRD, Interval.DIMINISHED_FIFTH],
  'diminishedTriad:first': [Interval.MINOR_THIRD, Interval.MAJOR_SIXTH],
  'diminishedTriad:second': [Interval.AUGMENTED_FOURTH, Interval.MAJOR_SIXTH],

  // ── Augmented Triad ────────────────────────────────────────────────────────
  'augmentedTriad:root': [Interval.MAJOR_THIRD, Interval.AUGMENTED_FIFTH],
  'augmentedTriad:first': [Interval.MAJOR_THIRD, Interval.MINOR_SIXTH],
  'augmentedTriad:second': [Interval.DIMINISHED_FOURTH, Interval.MINOR_SIXTH],

  // ── Dominant 7th ──────────────────────────────────────────────────────────
  'dominant7:root': [Interval.MAJOR_THIRD, Interval.PERFECT_FIFTH, Interval.MINOR_SEVENTH],
  'dominant7:first': [Interval.MINOR_THIRD, Interval.DIMINISHED_FIFTH, Interval.MINOR_SIXTH],
  'dominant7:second': [Interval.MINOR_THIRD, Interval.PERFECT_FOURTH, Interval.MAJOR_SIXTH],
  'dominant7:third': [Interval.MAJOR_SECOND, Interval.AUGMENTED_FOURTH, Interval.MAJOR_SIXTH],

  // ── Diminished 7th ────────────────────────────────────────────────────────
  'diminished7:root': [
    Interval.MINOR_THIRD,
    Interval.DIMINISHED_FIFTH,
    Interval.DIMINISHED_SEVENTH,
  ],
  'diminished7:first': [Interval.MINOR_THIRD, Interval.DIMINISHED_FIFTH, Interval.MAJOR_SIXTH],
  'diminished7:second': [Interval.MINOR_THIRD, Interval.AUGMENTED_FOURTH, Interval.MAJOR_SIXTH],
  'diminished7:third': [Interval.AUGMENTED_SECOND, Interval.AUGMENTED_FOURTH, Interval.MAJOR_SIXTH],
};
