import { describe, it, expect } from 'vitest';
import {
  accidentalsForCount,
  keySignatureForKey,
  normalizeSpellingsForKeySignature,
  keySignatureImpliedAccidental,
  accidentalForDisplay,
  deviatingAccidentals,
} from '@/helpers/key-signature';
import { MajorTonic, MinorTonic } from '@/types/tonic';
import { Scale } from '@/types/scale';
import { PitchSpelling } from '@/types/pitch-spelling';
import { Accidental } from '@/types/accidental';
import { Key } from '@/types/key';

describe('accidentalsForCount', () => {
  it('returns the correct sharps for a positive count', () => {
    expect(accidentalsForCount(0)).toEqual({ kind: Accidental.SHARP, notes: [] });
    expect(accidentalsForCount(1)).toEqual({ kind: Accidental.SHARP, notes: ['F'] });
    expect(accidentalsForCount(2)).toEqual({ kind: Accidental.SHARP, notes: ['F', 'C'] });
    expect(accidentalsForCount(3)).toEqual({ kind: Accidental.SHARP, notes: ['F', 'C', 'G'] });
    expect(accidentalsForCount(4)).toEqual({ kind: Accidental.SHARP, notes: ['F', 'C', 'G', 'D'] });
    expect(accidentalsForCount(5)).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A'],
    });
    expect(accidentalsForCount(6)).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A', 'E'],
    });
    expect(accidentalsForCount(7)).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A', 'E', 'B'],
    });
  });

  it('returns the correct flats for a negative count', () => {
    expect(accidentalsForCount(-1)).toEqual({ kind: Accidental.FLAT, notes: ['B'] });
    expect(accidentalsForCount(-2)).toEqual({ kind: Accidental.FLAT, notes: ['B', 'E'] });
    expect(accidentalsForCount(-3)).toEqual({ kind: Accidental.FLAT, notes: ['B', 'E', 'A'] });
    expect(accidentalsForCount(-4)).toEqual({ kind: Accidental.FLAT, notes: ['B', 'E', 'A', 'D'] });
    expect(accidentalsForCount(-5)).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G'],
    });
    expect(accidentalsForCount(-6)).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G', 'C'],
    });
    expect(accidentalsForCount(-7)).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G', 'C', 'F'],
    });
  });
});

describe('keySignatureForKey', () => {
  it('returns the correct key signature for major keys', () => {
    expect(keySignatureForKey({ tonic: MajorTonic.C, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: [],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.G, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.D, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.A, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.E, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.B, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.F_SHARP, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A', 'E'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.C_SHARP, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A', 'E', 'B'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.F, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.B_FLAT, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.E_FLAT, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.A_FLAT, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.D_FLAT, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G'],
    });
    expect(keySignatureForKey({ tonic: MajorTonic.G_FLAT, scale: Scale.MAJOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G', 'C'],
    });
  });

  it('returns the correct key signature for minor keys', () => {
    expect(keySignatureForKey({ tonic: MinorTonic.A, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: [],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.E, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.B, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.F_SHARP, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.C_SHARP, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.G_SHARP, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.D_SHARP, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A', 'E'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.A_SHARP, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.SHARP,
      notes: ['F', 'C', 'G', 'D', 'A', 'E', 'B'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.D, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.G, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.F, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.B_FLAT, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.E_FLAT, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G', 'C'],
    });
    expect(keySignatureForKey({ tonic: MinorTonic.A_FLAT, scale: Scale.HARMONIC_MINOR })).toEqual({
      kind: Accidental.FLAT,
      notes: ['B', 'E', 'A', 'D', 'G', 'C', 'F'],
    });
  });
});

describe('normalizeSpellingsForKeySignature', () => {
  it('returns the same spellings if they all match the key signature', () => {
    const key: Key = { tonic: MajorTonic.G, scale: Scale.MAJOR };
    const spellings: PitchSpelling[] = ['G4', 'A4', 'B4', 'C4', 'D5', 'E5', 'F#5'];
    expect(normalizeSpellingsForKeySignature(spellings, key)).toEqual(spellings);
  });

  it('adds natural signs to notes that are altered by the key signature but spelled without an accidental', () => {
    const key: Key = { tonic: MajorTonic.C, scale: Scale.HARMONIC_MINOR };
    const spellings: PitchSpelling[] = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'B4'];
    const expected: PitchSpelling[] = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bn4'];
    expect(normalizeSpellingsForKeySignature(spellings, key)).toEqual(expected);
  });
});

describe('keySignatureImpliedAccidental', () => {
  it('returns flat for letters in a flat key signature', () => {
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR }; // Bb, Eb, Ab
    expect(keySignatureImpliedAccidental('B', key)).toBe(Accidental.FLAT);
    expect(keySignatureImpliedAccidental('E', key)).toBe(Accidental.FLAT);
    expect(keySignatureImpliedAccidental('A', key)).toBe(Accidental.FLAT);
  });

  it('returns sharp for letters in a sharp key signature', () => {
    // A minor has no key sig accidentals, so try E minor (F#)
    const key: Key = { tonic: MinorTonic.E, scale: Scale.HARMONIC_MINOR };
    expect(keySignatureImpliedAccidental('F', key)).toBe(Accidental.SHARP);
  });

  it('returns null for letters not in the key signature', () => {
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR }; // Bb, Eb, Ab
    expect(keySignatureImpliedAccidental('C', key)).toBeNull();
    expect(keySignatureImpliedAccidental('D', key)).toBeNull();
    expect(keySignatureImpliedAccidental('G', key)).toBeNull();
  });

  it('returns null for all letters in C major (no key sig accidentals)', () => {
    const key: Key = { tonic: MajorTonic.C, scale: Scale.MAJOR };
    expect(keySignatureImpliedAccidental('F', key)).toBeNull();
    expect(keySignatureImpliedAccidental('B', key)).toBeNull();
  });
});

describe('accidentalForDisplay', () => {
  it('returns null when the note matches the key signature implication (key sig flat, note is flat)', () => {
    // C minor: key sig has Bb, Eb, Ab — Eb4 needs no explicit accidental
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    expect(accidentalForDisplay('Eb4', key)).toBeNull();
    expect(accidentalForDisplay('Ab4', key)).toBeNull();
    expect(accidentalForDisplay('Bb4', key)).toBeNull();
  });

  it('returns NATURAL when note deviates from a flat key signature (raised 7th in harmonic minor)', () => {
    // C harmonic minor: key sig has Bb — Bn4 deviates
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    expect(accidentalForDisplay('Bn4', key)).toBe(Accidental.NATURAL);
  });

  it('returns SHARP when note deviates from a natural key signature (raised 7th in A harmonic minor)', () => {
    // A harmonic minor: no key sig accidentals — G#4 deviates
    const key: Key = { tonic: MinorTonic.A, scale: Scale.HARMONIC_MINOR };
    expect(accidentalForDisplay('G#4', key)).toBe(Accidental.SHARP);
  });

  it('returns null for unaltered notes in keys without those letters in the sig', () => {
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    expect(accidentalForDisplay('C4', key)).toBeNull();
    expect(accidentalForDisplay('G4', key)).toBeNull();
  });
});

describe('deviatingAccidentals', () => {
  it('returns empty array when all spellings match the key signature', () => {
    // G major (F#): all scale spellings are diatonic, nothing deviates
    const key: Key = { tonic: MajorTonic.G, scale: Scale.MAJOR };
    const spellings: PitchSpelling[] = ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5'];
    expect(deviatingAccidentals(spellings, key)).toEqual([]);
  });

  it('returns NATURAL when the raised 7th deviates from a flat key signature (C harmonic minor)', () => {
    // C harmonic minor (key sig: Bb, Eb, Ab): raised 7th Bn deviates
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    const spellings: PitchSpelling[] = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bn4'];
    expect(deviatingAccidentals(spellings, key)).toContain(Accidental.NATURAL);
  });

  it('returns SHARP when the raised 7th deviates from an empty key sig (A harmonic minor)', () => {
    // A harmonic minor (no key sig): raised 7th G# deviates
    const key: Key = { tonic: MinorTonic.A, scale: Scale.HARMONIC_MINOR };
    const spellings: PitchSpelling[] = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G#5'];
    expect(deviatingAccidentals(spellings, key)).toContain(Accidental.SHARP);
  });

  it('does not include an accidental that already matches the key signature', () => {
    // C harmonic minor: Eb and Ab match the key sig, so FLAT should not appear
    const key: Key = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    const spellings: PitchSpelling[] = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bn4'];
    expect(deviatingAccidentals(spellings, key)).not.toContain(Accidental.FLAT);
  });
});
