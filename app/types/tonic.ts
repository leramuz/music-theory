export const MajorTonic = {
  C: 'C',
  G: 'G',
  D: 'D',
  A: 'A',
  E: 'E',
  B: 'B',
  C_FLAT: 'Cb',
  F_SHARP: 'F#',
  G_FLAT: 'Gb',
  C_SHARP: 'C#',
  D_FLAT: 'Db',
  A_FLAT: 'Ab',
  E_FLAT: 'Eb',
  B_FLAT: 'Bb',
  F: 'F',
};
export type MajorTonic = (typeof MajorTonic)[keyof typeof MajorTonic];

export const MinorTonic = {
  A: 'A',
  E: 'E',
  B: 'B',
  F_SHARP: 'F#',
  C_SHARP: 'C#',
  G_SHARP: 'G#',
  A_FLAT: 'Ab',
  D_SHARP: 'D#',
  E_FLAT: 'Eb',
  A_SHARP: 'A#',
  B_FLAT: 'Bb',
  F: 'F',
  C: 'C',
  G: 'G',
  D: 'D',
};
export type MinorTonic = (typeof MinorTonic)[keyof typeof MinorTonic];

export type Tonic = MajorTonic | MinorTonic;
