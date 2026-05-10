import { PitchSpelling } from '@/types/pitch-spelling';

export const Interval = {
  PERFECT_UNISON: 'P1',
  MINOR_SECOND: 'm2',
  MAJOR_SECOND: 'M2',
  AUGMENTED_SECOND: 'A2',
  MINOR_THIRD: 'm3',
  MAJOR_THIRD: 'M3',
  PERFECT_FOURTH: 'P4',
  AUGMENTED_FOURTH: 'A4',
  DIMINISHED_FOURTH: 'd4',
  PERFECT_FIFTH: 'P5',
  DIMINISHED_FIFTH: 'd5',
  AUGMENTED_FIFTH: 'A5',
  MINOR_SIXTH: 'm6',
  MAJOR_SIXTH: 'M6',
  MINOR_SEVENTH: 'm7',
  MAJOR_SEVENTH: 'M7',
  DIMINISHED_SEVENTH: 'd7',
  PERFECT_OCTAVE: 'P8',
} as const;
export type Interval = (typeof Interval)[keyof typeof Interval];

export type IntervalInstance = {
  bottom: PitchSpelling;
  top: PitchSpelling;
};
