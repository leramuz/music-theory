export const Clef = {
  TREBLE: 'treble',
  BASS: 'bass',
} as const;
export type Clef = (typeof Clef)[keyof typeof Clef];
