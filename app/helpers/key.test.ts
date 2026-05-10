import { describe, it, expect } from 'vitest';
import { defaultTonicForScale, keyTonics } from '@/helpers/key';
import { MajorTonic, MinorTonic } from '@/types/tonic';
import { Scale } from '@/types/scale';

describe('keyTonics', () => {
  it('returns all major key roots for the major scale', () => {
    const result = keyTonics(Scale.MAJOR);
    expect(result).toEqual(Object.values(MajorTonic));
  });

  it('returns all minor key roots for the harmonic minor scale', () => {
    const result = keyTonics(Scale.HARMONIC_MINOR);
    expect(result).toEqual(Object.values(MinorTonic));
  });
});

describe('defaultTonicForScale', () => {
  it('returns C for the major scale', () => {
    const result = defaultTonicForScale(Scale.MAJOR);
    expect(result).toEqual(MajorTonic.C);
  });

  it('returns A for the harmonic minor scale', () => {
    const result = defaultTonicForScale(Scale.HARMONIC_MINOR);
    expect(result).toEqual(MinorTonic.A);
  });
});
