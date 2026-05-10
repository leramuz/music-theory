import { Accidental } from '@/types/accidental';

export const Natural = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
} as const;
export type Natural = (typeof Natural)[keyof typeof Natural];

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PitchSpelling = `${Natural}${Accidental}${Octave}` | `${Natural}${Octave}`;
export type EnharmonicSpellings = readonly [PitchSpelling, ...PitchSpelling[]];
