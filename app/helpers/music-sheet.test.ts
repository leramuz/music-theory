import { describe, it, expect, beforeEach } from 'vitest';
import {
  addNoteToMusicSheet,
  removeNoteFromMusicSheet,
  updateNoteInMusicSheet,
} from '@/helpers/music-sheet';
import { NoteDuration, MeasureConfig, VexFlowAccidental } from '@/types/music-sheet';

const measures = (): MeasureConfig[] => [
  {
    staves: [
      {
        voices: [
          {
            notes: [
              { keys: ['c/4'], duration: NoteDuration.QUARTER },
              { keys: ['e/4'], duration: NoteDuration.QUARTER },
            ],
          },
          {
            notes: [
              { keys: ['c/4'], duration: NoteDuration.QUARTER },
              { keys: ['e/4'], duration: NoteDuration.QUARTER },
            ],
          },
        ],
      },
    ],
  },
];

describe('immutability', () => {
  let currentMeasures: MeasureConfig[];

  beforeEach(() => {
    currentMeasures = measures();
  });

  it('addNoteToMusicSheet does not mutate the original measures', () => {
    const original = currentMeasures;
    addNoteToMusicSheet(
      original,
      { noteKey: 'g/4', measureIndex: 0, staveIndex: 0 },
      NoteDuration.QUARTER,
      0,
      [],
    );
    expect(original[0].staves[0].voices[0].notes).toHaveLength(2);
  });

  it('removeNoteFromMusicSheet does not mutate the original measures', () => {
    const original = currentMeasures;
    removeNoteFromMusicSheet(original, {
      noteKey: 'c/4',
      measureIndex: 0,
      staveIndex: 0,
      voiceIndex: 0,
      noteIndex: 0,
    });
    expect(original[0].staves[0].voices[0].notes).toHaveLength(2);
  });

  it('updateNoteInMusicSheet does not mutate the original measures', () => {
    const original = currentMeasures;
    updateNoteInMusicSheet(
      original,
      { noteKey: 'c/4', measureIndex: 0, staveIndex: 0, voiceIndex: 0, noteIndex: 0 },
      { keys: ['d/4'] },
    );
    expect(original[0].staves[0].voices[0].notes[0].keys).toEqual(['c/4']);
  });
});

describe('addNoteToMusicSheet', () => {
  let currentMeasures: MeasureConfig[];

  beforeEach(() => {
    currentMeasures = measures();
  });

  it('appends a note to the target voice', () => {
    const result = addNoteToMusicSheet(
      currentMeasures,
      { noteKey: 'g/4', measureIndex: 0, staveIndex: 0 },
      NoteDuration.QUARTER,
      0,
      [],
    );
    expect(result[0].staves[0].voices[0].notes).toHaveLength(3);
    expect(result[0].staves[0].voices[0].notes[2].keys).toEqual(['g/4']);
    expect(result[0].staves[0].voices[0].notes[2].duration).toBe(NoteDuration.QUARTER);
  });

  it('appends to the correct voice index', () => {
    const result = addNoteToMusicSheet(
      currentMeasures,
      { noteKey: 'g/4', measureIndex: 0, staveIndex: 0 },
      NoteDuration.EIGHTH,
      1,
      [],
    );
    expect(result[0].staves[0].voices[1].notes).toHaveLength(3);
    expect(result[0].staves[0].voices[1].notes[2].keys).toEqual(['g/4']);
    expect(result[0].staves[0].voices[0].notes).toHaveLength(2);
  });

  it('stores accidentals when provided', () => {
    const result = addNoteToMusicSheet(
      currentMeasures,
      { noteKey: 'f/4', measureIndex: 0, staveIndex: 0 },
      NoteDuration.QUARTER,
      0,
      [VexFlowAccidental.SHARP],
    );
    expect(result[0].staves[0].voices[0].notes[2].accidentals).toEqual([VexFlowAccidental.SHARP]);
  });
});

describe('removeNoteFromMusicSheet', () => {
  let currentMeasures: MeasureConfig[];

  beforeEach(() => {
    currentMeasures = measures();
  });

  it('removes the note at the given index', () => {
    const result = removeNoteFromMusicSheet(currentMeasures, {
      noteKey: 'c/4',
      measureIndex: 0,
      staveIndex: 0,
      voiceIndex: 0,
      noteIndex: 0,
    });
    expect(result[0].staves[0].voices[0].notes).toHaveLength(1);
    expect(result[0].staves[0].voices[0].notes[0].keys).toEqual(['e/4']);
  });

  it('removes the last note', () => {
    const result = removeNoteFromMusicSheet(currentMeasures, {
      noteKey: 'e/4',
      measureIndex: 0,
      staveIndex: 0,
      voiceIndex: 0,
      noteIndex: 1,
    });
    expect(result[0].staves[0].voices[0].notes).toHaveLength(1);
    expect(result[0].staves[0].voices[0].notes[0].keys).toEqual(['c/4']);
  });
});

describe('updateNoteInMusicSheet', () => {
  let currentMeasures: MeasureConfig[];

  beforeEach(() => {
    currentMeasures = measures();
  });

  it('updates the keys of the note', () => {
    const result = updateNoteInMusicSheet(
      currentMeasures,
      { noteKey: 'c/4', measureIndex: 0, staveIndex: 0, voiceIndex: 0, noteIndex: 0 },
      { keys: ['d/4'] },
    );
    expect(result[0].staves[0].voices[0].notes[0].keys).toEqual(['d/4']);
  });

  it('updates the duration of the note', () => {
    const result = updateNoteInMusicSheet(
      currentMeasures,
      { noteKey: 'c/4', measureIndex: 0, staveIndex: 0, voiceIndex: 0, noteIndex: 0 },
      { duration: NoteDuration.HALF },
    );
    expect(result[0].staves[0].voices[0].notes[0].duration).toBe(NoteDuration.HALF);
  });

  it('adds accidentals while preserving other fields', () => {
    const result = updateNoteInMusicSheet(
      currentMeasures,
      { noteKey: 'c/4', measureIndex: 0, staveIndex: 0, voiceIndex: 0, noteIndex: 0 },
      { accidentals: [VexFlowAccidental.SHARP] },
    );
    const note = result[0].staves[0].voices[0].notes[0];
    expect(note.accidentals).toEqual([VexFlowAccidental.SHARP]);
    expect(note.keys).toEqual(['c/4']);
    expect(note.duration).toBe(NoteDuration.QUARTER);
  });

  it('does not affect other notes', () => {
    const result = updateNoteInMusicSheet(
      currentMeasures,
      { noteKey: 'c/4', measureIndex: 0, staveIndex: 0, voiceIndex: 0, noteIndex: 0 },
      { keys: ['d/4'] },
    );
    expect(result[0].staves[0].voices[0].notes[1].keys).toEqual(['e/4']);
  });
});
