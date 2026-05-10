import { NoteDuration } from '@/types/note-duration';
import { MeasureConfig, NoteClickPayload, StaveClickPayload } from '@/types/music-sheet';
import { Accidental } from '@/types/accidental';

const cloneMeasures = (measures: MeasureConfig[]): MeasureConfig[] =>
  measures.map((measure) => ({
    ...measure,
    staves: measure.staves.map((stave) => ({
      ...stave,
      voices: stave.voices.map((voice) => ({
        ...voice,
        notes: voice.notes.map((note) => ({ ...note })),
      })),
    })),
  }));

export const addNoteToMusicSheet = (
  measures: MeasureConfig[],
  note: StaveClickPayload,
  duration: NoteDuration,
  voiceIndex: number,
  accidentals: (Accidental | null)[],
): MeasureConfig[] => {
  const { noteKey, measureIndex, staveIndex } = note;
  const newMeasures = cloneMeasures(measures);

  const targetVoice = newMeasures[measureIndex].staves[staveIndex].voices[voiceIndex];
  targetVoice.notes.push({ keys: [noteKey], duration, accidentals });
  return newMeasures;
};

export const removeNoteFromMusicSheet = (
  measures: MeasureConfig[],
  note: NoteClickPayload,
): MeasureConfig[] => {
  const { measureIndex, staveIndex, voiceIndex, noteIndex } = note;
  const newMeasures = cloneMeasures(measures);

  const targetVoice = newMeasures[measureIndex].staves[staveIndex].voices[voiceIndex];
  targetVoice.notes.splice(noteIndex, 1);
  return newMeasures;
};

export const updateNoteInMusicSheet = (
  measures: MeasureConfig[],
  note: NoteClickPayload,
  updatedFields: Partial<{
    keys: string[];
    duration: NoteDuration;
    accidentals: (Accidental | null)[];
  }>,
): MeasureConfig[] => {
  const { measureIndex, staveIndex, voiceIndex, noteIndex } = note;
  const newMeasures = cloneMeasures(measures);

  const targetVoice = newMeasures[measureIndex].staves[staveIndex].voices[voiceIndex];
  targetVoice.notes[noteIndex] = { ...targetVoice.notes[noteIndex], ...updatedFields };
  return newMeasures;
};

export const getNumMeasures = (measures: MeasureConfig[]) => measures.length;

export const getNumStavesInMeasure = (measure: MeasureConfig) => measure.staves.length;
