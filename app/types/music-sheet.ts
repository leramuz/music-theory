import { Accidental } from '@/types/accidental';
import { NoteDuration } from '@/types/note-duration';
import { Clef } from '@/types/clef';

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
