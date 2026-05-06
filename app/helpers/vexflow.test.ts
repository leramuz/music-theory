import { describe, it, expect } from 'vitest';
import {
  adaptVexflowSpellingToSpelling,
  adaptSpellingToVexflowSpelling,
  adaptKeyToVexflowKey,
} from '@/helpers/vexflow';
import { Accidental } from '@/types/accidental';
import { Scale } from '@/types/scale';
import { MajorTonic, MinorTonic } from '@/types/tonic';

describe('adaptKeyToVexflowKey', () => {
  it('converts a Key object to a VexFlow key string', () => {
    expect(adaptKeyToVexflowKey({ tonic: MajorTonic.C, scale: Scale.MAJOR })).toBe('C');
    expect(adaptKeyToVexflowKey({ tonic: MinorTonic.A, scale: Scale.HARMONIC_MINOR })).toBe('Am');
    expect(adaptKeyToVexflowKey({ tonic: MajorTonic.F_SHARP, scale: Scale.MAJOR })).toBe('F#');
    expect(adaptKeyToVexflowKey({ tonic: MinorTonic.D_SHARP, scale: Scale.HARMONIC_MINOR })).toBe(
      'D#m',
    );
  });
});

describe('adaptVexflowSpellingToSpelling', () => {
  it('converts a VexFlow spelling and accidental to a pitch spelling', () => {
    expect(adaptVexflowSpellingToSpelling('c/4', null)).toBe('C4');
    expect(adaptVexflowSpellingToSpelling('d/5', Accidental.SHARP)).toBe('D#5');
    expect(adaptVexflowSpellingToSpelling('e/3', Accidental.FLAT)).toBe('Eb3');
    expect(adaptVexflowSpellingToSpelling('f/4', Accidental.NATURAL)).toBe('Fn4');
    expect(adaptVexflowSpellingToSpelling('g/2', Accidental.DOUBLE_SHARP)).toBe('G##2');
    expect(adaptVexflowSpellingToSpelling('a/6', Accidental.DOUBLE_FLAT)).toBe('Abb6');
  });

  it('applies the key signature when no explicit accidental is provided', () => {
    // C minor: Bb, Eb, Ab
    const cMinor = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    expect(adaptVexflowSpellingToSpelling('e/4', null, cMinor)).toBe('Eb4');
    expect(adaptVexflowSpellingToSpelling('b/4', null, cMinor)).toBe('Bb4');
    expect(adaptVexflowSpellingToSpelling('a/4', null, cMinor)).toBe('Ab4');
    // Non-altered letter stays natural
    expect(adaptVexflowSpellingToSpelling('c/4', null, cMinor)).toBe('C4');
  });

  it('explicit accidental overrides the key signature', () => {
    const cMinor = { tonic: MinorTonic.C, scale: Scale.HARMONIC_MINOR };
    // Key sig says B flat, but NATURAL is selected explicitly
    expect(adaptVexflowSpellingToSpelling('b/4', Accidental.NATURAL, cMinor)).toBe('Bn4');
  });

  it('throws an error for invalid VexFlow keys', () => {
    expect(() => adaptVexflowSpellingToSpelling('invalidKey', null)).toThrow();
    expect(() => adaptVexflowSpellingToSpelling('c/', null)).toThrow();
  });
});

describe('adaptSpellingToVexflowSpelling', () => {
  it('converts a pitch spelling to a VexFlow spelling', () => {
    expect(adaptSpellingToVexflowSpelling('C4')).toBe('c/4');
    expect(adaptSpellingToVexflowSpelling('D#5')).toBe('d/5');
    expect(adaptSpellingToVexflowSpelling('Eb3')).toBe('e/3');
    expect(adaptSpellingToVexflowSpelling('Fn4')).toBe('f/4');
    expect(adaptSpellingToVexflowSpelling('G##2')).toBe('g/2');
    expect(adaptSpellingToVexflowSpelling('Abb6')).toBe('a/6');
  });
});
