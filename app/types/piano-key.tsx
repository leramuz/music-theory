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

export const Accidental = {
  SHARP: '#',
  FLAT: 'b',
  DOUBLE_SHARP: 'x',
  NATURAL: 'n',
  DOUBLE_FLAT: 'bb',
} as const;
export type Accidental = (typeof Accidental)[keyof typeof Accidental];

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type PitchSpelling = `${Natural}${Accidental}${Octave}` | `${Natural}${Octave}`;
type EnharmonicSpellings = readonly [PitchSpelling, ...PitchSpelling[]];

export type PianoKey = {
  id: PianoKeyId;
  spellings: EnharmonicSpellings;
};

export const PianoKeyId = {
  A0: 1,
  As0: 2,
  B0: 3,
  C1: 4,
  Cs1: 5,
  D1: 6,
  Ds1: 7,
  E1: 8,
  F1: 9,
  Fs1: 10,
  G1: 11,
  Gs1: 12,
  A1: 13,
  As1: 14,
  B1: 15,
  C2: 16,
  Cs2: 17,
  D2: 18,
  Ds2: 19,
  E2: 20,
  F2: 21,
  Fs2: 22,
  G2: 23,
  Gs2: 24,
  A2: 25,
  As2: 26,
  B2: 27,
  C3: 28,
  Cs3: 29,
  D3: 30,
  Ds3: 31,
  E3: 32,
  F3: 33,
  Fs3: 34,
  G3: 35,
  Gs3: 36,
  A3: 37,
  As3: 38,
  B3: 39,
  C4: 40,
  Cs4: 41,
  D4: 42,
  Ds4: 43,
  E4: 44,
  F4: 45,
  Fs4: 46,
  G4: 47,
  Gs4: 48,
  A4: 49,
  As4: 50,
  B4: 51,
  C5: 52,
  Cs5: 53,
  D5: 54,
  Ds5: 55,
  E5: 56,
  F5: 57,
  Fs5: 58,
  G5: 59,
  Gs5: 60,
  A5: 61,
  As5: 62,
  B5: 63,
  C6: 64,
  Cs6: 65,
  D6: 66,
  Ds6: 67,
  E6: 68,
  F6: 69,
  Fs6: 70,
  G6: 71,
  Gs6: 72,
  A6: 73,
  As6: 74,
  B6: 75,
  C7: 76,
  Cs7: 77,
  D7: 78,
  Ds7: 79,
  E7: 80,
  F7: 81,
  Fs7: 82,
  G7: 83,
  Gs7: 84,
  A7: 85,
  As7: 86,
  B7: 87,
  C8: 88,
} as const;

export type PianoKeyId = (typeof PianoKeyId)[keyof typeof PianoKeyId];

export type PianoKeyRange = {
  from: PianoKeyId;
  to: PianoKeyId;
};
