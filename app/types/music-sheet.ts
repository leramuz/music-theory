import { Accidental } from '@/types/accidental';

export const Clef = {
  TREBLE: 'treble',
  BASS: 'bass',
} as const;
export type Clef = (typeof Clef)[keyof typeof Clef];

export const TimeSignature = {
  FOUR_FOUR: '4/4',
  THREE_FOUR: '3/4',
  TWO_FOUR: '2/4',
} as const;
export type TimeSignature = (typeof TimeSignature)[keyof typeof TimeSignature];

export const KeySignature = {
  C: 'C',
  G: 'G',
  D: 'D',
  A: 'A',
  E: 'E',
  B: 'B',
  Fs: 'F#',
  Cs: 'C#',
  F: 'F',
  Bb: 'Bb',
  Eb: 'Eb',
  Ab: 'Ab',
  Db: 'Db',
  Gb: 'Gb',
  Cb: 'Cb',
  Am: 'Am',
  Em: 'Em',
  Bm: 'Bm',
  Fsm: 'F#m',
  Csm: 'C#m',
  Gsm: 'G#m',
  Dsm: 'D#m',
  Asm: 'A#m',
  Dm: 'Dm',
  Gm: 'Gm',
  Cm: 'Cm',
  Fm: 'Fm',
  Bbm: 'Bbm',
  Ebm: 'Ebm',
  Abm: 'Abm',
} as const;
export type KeySignature = (typeof KeySignature)[keyof typeof KeySignature];

export const NoteDuration = {
  WHOLE: 'w',
  HALF: 'h',
  QUARTER: 'q',
  EIGHTH: '8',
  SIXTEENTH: '16',
} as const;
export type NoteDuration = (typeof NoteDuration)[keyof typeof NoteDuration];

export type SheetNote = {
  keys: string[];
  duration: NoteDuration;
  accidentals?: (Accidental | null)[];
  highlight?: string;
};

export type StaveConfig = {
  clef?: Clef;
  voices: {
    notes: SheetNote[];
  }[];
};

export type MeasureConfig = {
  staves: StaveConfig[];
};

export type NoteClickPayload = {
  noteKey: string;
  measureIndex: number;
  noteIndex: number;
  staveIndex: number;
  voiceIndex: number;
};

export type StaveClickPayload = {
  noteKey: string;
  measureIndex: number;
  staveIndex: number;
};
