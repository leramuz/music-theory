import { PitchSpelling } from '@/types/pitch-spelling';

export const ChordQuality = {
  MAJOR_TRIAD: 'majorTriad',
  MINOR_TRIAD: 'minorTriad',
  DIMINISHED_TRIAD: 'diminishedTriad',
  AUGMENTED_TRIAD: 'augmentedTriad',
  DOMINANT_SEVENTH: 'dominant7',
  DIMINISHED_SEVENTH: 'diminished7',
} as const;
export type ChordQuality = (typeof ChordQuality)[keyof typeof ChordQuality];

export const Inversion = {
  ROOT: 'root',
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
} as const;
export type Inversion = (typeof Inversion)[keyof typeof Inversion];

/** Flat string enum — quality:inversion — mirrors the Interval pattern. */
export const Chord = {
  MAJOR_TRIAD_ROOT: 'majorTriad:root',
  MAJOR_TRIAD_FIRST: 'majorTriad:first',
  MAJOR_TRIAD_SECOND: 'majorTriad:second',

  MINOR_TRIAD_ROOT: 'minorTriad:root',
  MINOR_TRIAD_FIRST: 'minorTriad:first',
  MINOR_TRIAD_SECOND: 'minorTriad:second',

  DIMINISHED_TRIAD_ROOT: 'diminishedTriad:root',
  DIMINISHED_TRIAD_FIRST: 'diminishedTriad:first',
  DIMINISHED_TRIAD_SECOND: 'diminishedTriad:second',

  AUGMENTED_TRIAD_ROOT: 'augmentedTriad:root',
  AUGMENTED_TRIAD_FIRST: 'augmentedTriad:first',
  AUGMENTED_TRIAD_SECOND: 'augmentedTriad:second',

  DOMINANT_SEVENTH_ROOT: 'dominant7:root',
  DOMINANT_SEVENTH_FIRST: 'dominant7:first',
  DOMINANT_SEVENTH_SECOND: 'dominant7:second',
  DOMINANT_SEVENTH_THIRD: 'dominant7:third',

  DIMINISHED_SEVENTH_ROOT: 'diminished7:root',
  DIMINISHED_SEVENTH_FIRST: 'diminished7:first',
  DIMINISHED_SEVENTH_SECOND: 'diminished7:second',
  DIMINISHED_SEVENTH_THIRD: 'diminished7:third',
} as const;
export type Chord = (typeof Chord)[keyof typeof Chord];

/** All notes in the chord, first element is always the bass. */
export type ChordInstance = {
  notes: [PitchSpelling, ...PitchSpelling[]];
};
