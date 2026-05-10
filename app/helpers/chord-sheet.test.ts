import { describe, it, expect } from 'vitest';
import { makeChordMeasure } from '@/helpers/chord-sheet';
import { Accidental } from '@/types/accidental';
import { Clef } from '@/types/clef';
import { NoteDuration } from '@/types/note-duration';
import { Key } from '@/types/key';
import { Scale } from '@/types/scale';
import { MajorTonic, MinorTonic } from '@/types/tonic';

// ─── helpers ─────────────────────────────────────────────────────────────────

const note = (measure: ReturnType<typeof makeChordMeasure>) => measure.staves[0].voices[0].notes[0];

// ─── error cases ─────────────────────────────────────────────────────────────

describe('makeChordMeasure — input validation', () => {
  it('throws when called with an empty notes array', () => {
    expect(() => makeChordMeasure([])).toThrow();
  });
});

// ─── clef selection ───────────────────────────────────────────────────────────

describe('makeChordMeasure — clef selection', () => {
  it('uses treble clef when bass is G3', () => {
    expect(makeChordMeasure(['G3']).staves[0].clef).toBe(Clef.TREBLE);
  });

  it('uses treble clef when bass is above G3', () => {
    expect(makeChordMeasure(['C4']).staves[0].clef).toBe(Clef.TREBLE);
  });

  it('uses bass clef when bass is below G3', () => {
    expect(makeChordMeasure(['C3']).staves[0].clef).toBe(Clef.BASS);
  });
});

// ─── structure ────────────────────────────────────────────────────────────────

describe('makeChordMeasure — structure', () => {
  it('always produces exactly one stave', () => {
    expect(makeChordMeasure(['C4', 'E4', 'G4']).staves).toHaveLength(1);
  });

  it('always produces exactly one voice', () => {
    expect(makeChordMeasure(['C4', 'E4', 'G4']).staves[0].voices).toHaveLength(1);
  });

  it('always produces exactly one note entry (a multi-key chord note)', () => {
    expect(note(makeChordMeasure(['C4', 'E4', 'G4'])).keys).toHaveLength(3);
  });

  it('works with a single note (bass only)', () => {
    const n = note(makeChordMeasure(['C4']));
    expect(n.keys).toHaveLength(1);
    expect(n.keys[0]).toBe('c/4');
  });
});

// ─── vexflow keys ────────────────────────────────────────────────────────────

describe('makeChordMeasure — vexflow keys', () => {
  it('converts all notes to vexflow format', () => {
    const n = note(makeChordMeasure(['C4', 'E4', 'G4']));
    expect(n.keys).toEqual(['c/4', 'e/4', 'g/4']);
  });

  it('strips accidentals from the vexflow key — accidental is in the accidentals array', () => {
    // VexFlow uses letter+octave in keys[], and the accidentals[] array separately
    const n = note(makeChordMeasure(['C4', 'Eb4', 'G4']));
    expect(n.keys[1]).toBe('e/4');
    expect(n.accidentals?.[1]).toBe(Accidental.FLAT);
  });
});

// ─── duration ────────────────────────────────────────────────────────────────

describe('makeChordMeasure — duration', () => {
  it('defaults to whole note duration', () => {
    expect(note(makeChordMeasure(['C4', 'E4', 'G4'])).duration).toBe(NoteDuration.WHOLE);
  });

  it('uses a custom duration when provided', () => {
    expect(note(makeChordMeasure(['C4', 'E4', 'G4'], NoteDuration.HALF)).duration).toBe(
      NoteDuration.HALF,
    );
  });
});

// ─── accidentals — no key ─────────────────────────────────────────────────────

describe('makeChordMeasure — accidentals without key', () => {
  it('sets null accidental for natural notes', () => {
    const n = note(makeChordMeasure(['C4', 'E4', 'G4']));
    expect(n.accidentals).toEqual([null, null, null]);
  });

  it('sets sharp accidental for sharped notes', () => {
    const n = note(makeChordMeasure(['C4', 'E4', 'G#4']));
    expect(n.accidentals?.[2]).toBe(Accidental.SHARP);
  });

  it('sets flat accidental for flatted notes', () => {
    const n = note(makeChordMeasure(['C4', 'Eb4', 'G4']));
    expect(n.accidentals?.[1]).toBe(Accidental.FLAT);
  });

  it('handles all three notes having accidentals', () => {
    // C minor triad with explicit accidentals
    const n = note(makeChordMeasure(['C4', 'Eb4', 'Ab4']));
    expect(n.accidentals).toEqual([null, Accidental.FLAT, Accidental.FLAT]);
  });
});

// ─── accidentals — with key signature ────────────────────────────────────────

describe('makeChordMeasure — accidentals with key', () => {
  const cMinor: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };

  it('suppresses accidentals covered by the key signature', () => {
    const n = note(makeChordMeasure(['C4', 'Eb4', 'Ab4'], undefined, cMinor));
    expect(n.accidentals).toEqual([null, null, null]);
  });

  it('shows NATURAL for notes that deviate from the key signature', () => {
    const n = note(makeChordMeasure(['G3', 'Bn4', 'D4'], undefined, cMinor));
    expect(n.accidentals?.[1]).toBe(Accidental.NATURAL);
  });

  it('shows no accidental for unaltered notes not in the key sig', () => {
    const n = note(makeChordMeasure(['C4', 'G4', 'D5'], undefined, cMinor));
    expect(n.accidentals).toEqual([null, null, null]);
  });

  const gMajor: Key = { tonic: MajorTonic.G, scale: Scale.MAJOR };

  it('suppresses F# accidental implied by G major key sig', () => {
    const n = note(makeChordMeasure(['G4', 'B4', 'F#5'], undefined, gMajor));
    expect(n.accidentals?.[2]).toBeNull();
  });
});

// ─── showExplicitAccidentals ─────────────────────────────────────────────────

describe('makeChordMeasure — showExplicitAccidentals', () => {
  const cMinor: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };

  it('forces raw accidentals even when the key sig covers them', () => {
    const n = note(makeChordMeasure(['C4', 'Eb4', 'Ab4'], undefined, cMinor, true));
    expect(n.accidentals?.[1]).toBe(Accidental.FLAT);
    expect(n.accidentals?.[2]).toBe(Accidental.FLAT);
  });

  it('shows null for natural notes even in explicit mode', () => {
    const n = note(makeChordMeasure(['C4', 'E4', 'G4'], undefined, cMinor, true));
    expect(n.accidentals?.[0]).toBeNull();
  });
});
