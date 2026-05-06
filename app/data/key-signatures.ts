import { MajorTonic, MinorTonic } from '@/types/tonic';
import { Natural } from '@/types/pitch-spelling';

// Fixed order on the staff — sharps: F C G D A E B, flats: B E A D G C F
export const SHARP_ORDER: Natural[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLAT_ORDER: Natural[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

// Positive = sharps, negative = flats, 0 = no accidentals
export const MAJOR_KEY_ACCIDENTALS: Record<MajorTonic, number> = {
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
  'F#': 6,
  'C#': 7,
  F: -1,
  Bb: -2,
  Eb: -3,
  Ab: -4,
  Db: -5,
  Gb: -6,
};

// Minor keys share the key signature with their relative major (no raised 7th in sig)
export const MINOR_KEY_ACCIDENTALS: Record<MinorTonic, number> = {
  A: 0,
  E: 1,
  B: 2,
  'F#': 3,
  'C#': 4,
  'G#': 5,
  'D#': 6,
  'A#': 7,
  D: -1,
  G: -2,
  C: -3,
  F: -4,
  Bb: -5,
  Eb: -6,
  Ab: -7,
};
