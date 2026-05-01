import { describe, it, expect } from 'vitest';
import {
  isWhiteKey,
  getPianoKeyById,
  getPianoKeysInRange,
  getWhiteKeysInRange,
  getBlackKeysInRange,
  getPianoKeySpellings,
  getPianoKeyIdByOffset,
  getPianoKeyBySpelling,
  isPianoKeyInRange,
} from '@/helpers/piano-key';
import { PianoKeyId } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';

describe('isWhiteKey', () => {
  it('returns true for white keys', () => {
    expect(isWhiteKey(PianoKeyId.A0)).toBe(true);
    expect(isWhiteKey(PianoKeyId.B0)).toBe(true);
    expect(isWhiteKey(PianoKeyId.C1)).toBe(true);
    expect(isWhiteKey(PianoKeyId.D1)).toBe(true);
    expect(isWhiteKey(PianoKeyId.E1)).toBe(true);
    expect(isWhiteKey(PianoKeyId.F1)).toBe(true);
    expect(isWhiteKey(PianoKeyId.G1)).toBe(true);
  });

  it('returns false for black keys', () => {
    expect(isWhiteKey(PianoKeyId.As0)).toBe(false);
    expect(isWhiteKey(PianoKeyId.Cs1)).toBe(false);
    expect(isWhiteKey(PianoKeyId.Ds1)).toBe(false);
    expect(isWhiteKey(PianoKeyId.Fs1)).toBe(false);
    expect(isWhiteKey(PianoKeyId.Gs1)).toBe(false);
  });

  it('works correctly across octaves', () => {
    expect(isWhiteKey(PianoKeyId.C4)).toBe(true);
    expect(isWhiteKey(PianoKeyId.Cs4)).toBe(false);
    expect(isWhiteKey(PianoKeyId.A4)).toBe(true);
    expect(isWhiteKey(PianoKeyId.As4)).toBe(false);
  });
});

describe('getPianoKeyById', () => {
  it('returns the correct key', () => {
    const key = getPianoKeyById(PianoKeyId.A4);
    expect(key).toBeDefined();
    expect(key!.id).toBe(PianoKeyId.A4);
    expect(key!.spellings[0]).toBe('A4');
  });

  it('throws an error for an unknown id', () => {
    expect(() => getPianoKeyById(9999 as PianoKeyId)).toThrow('No piano key found for id: 9999');
  });
});

describe('getPianoKeysInRange', () => {
  it('returns all keys within the range (inclusive)', () => {
    const keys = getPianoKeysInRange({ from: PianoKeyId.C4, to: PianoKeyId.E4 });
    expect(keys).toHaveLength(5);
    expect(keys[0].id).toBe(PianoKeyId.C4);
    expect(keys[keys.length - 1].id).toBe(PianoKeyId.E4);
  });

  it('returns a single key when from equals to', () => {
    const keys = getPianoKeysInRange({ from: PianoKeyId.C4, to: PianoKeyId.C4 });
    expect(keys).toHaveLength(1);
    expect(keys[0].id).toBe(PianoKeyId.C4);
  });
});

describe('getWhiteKeysInRange', () => {
  it('returns only white keys in the range', () => {
    const keys = getWhiteKeysInRange({ from: PianoKeyId.C4, to: PianoKeyId.E4 });
    expect(keys).toHaveLength(3);
    keys.forEach((key) => expect(isWhiteKey(key.id)).toBe(true));
  });
});

describe('getBlackKeysInRange', () => {
  it('returns only black keys in the range', () => {
    const keys = getBlackKeysInRange({ from: PianoKeyId.C4, to: PianoKeyId.E4 });
    expect(keys).toHaveLength(2);
    keys.forEach((key) => expect(isWhiteKey(key.id)).toBe(false));
  });
});

describe('getPianoKeySpellings', () => {
  it('returns the spellings for a given key', () => {
    const spellings = getPianoKeySpellings(PianoKeyId.C4);
    expect(spellings).toBeDefined();
    expect(spellings).toContain('C4');
    expect(spellings).toContain('B#3');
    expect(spellings).toContain('Dbb4');
  });

  it('throws an error for an unknown key', () => {
    expect(() => getPianoKeySpellings(9999 as PianoKeyId)).toThrow(
      'No piano key found for id: 9999',
    );
  });
});

describe('getPianoKeyIdByOffset', () => {
  it('returns the correct offset key id', () => {
    expect(getPianoKeyIdByOffset(PianoKeyId.C4, 2)).toBe(PianoKeyId.D4);
    expect(getPianoKeyIdByOffset(PianoKeyId.C4, -1)).toBe(PianoKeyId.B3);
    expect(getPianoKeyIdByOffset(PianoKeyId.A4, 3)).toBe(PianoKeyId.C5);
  });

  it('returns undefined when offset goes below the lowest key', () => {
    expect(getPianoKeyIdByOffset(PianoKeyId.A0, -1)).toBeUndefined();
  });

  it('returns undefined when offset goes above the highest key', () => {
    expect(getPianoKeyIdByOffset(PianoKeyId.C8, 1)).toBeUndefined();
  });

  it('returns the same key id for an offset of 0', () => {
    expect(getPianoKeyIdByOffset(PianoKeyId.C4, 0)).toBe(PianoKeyId.C4);
  });
});

describe('getPianoKeyBySpelling', () => {
  it('returns the correct key for a given spelling', () => {
    const key = getPianoKeyBySpelling('C4');
    expect(key).toBeDefined();
    expect(key!.id).toBe(PianoKeyId.C4);
  });

  it('throws an error for an unknown spelling', () => {
    expect(() => getPianoKeyBySpelling('H4' as PitchSpelling)).toThrow(
      'No piano key found for spelling: H4',
    );
  });
});

describe('isPianoKeyInRange', () => {
  it('returns true for keys within the range', () => {
    expect(isPianoKeyInRange(PianoKeyId.C4, { from: PianoKeyId.C4, to: PianoKeyId.E4 })).toBe(true);
    expect(isPianoKeyInRange(PianoKeyId.D4, { from: PianoKeyId.C4, to: PianoKeyId.E4 })).toBe(true);
    expect(isPianoKeyInRange(PianoKeyId.E4, { from: PianoKeyId.C4, to: PianoKeyId.E4 })).toBe(true);
  });

  it('returns false for keys outside the range', () => {
    expect(isPianoKeyInRange(PianoKeyId.B3, { from: PianoKeyId.C4, to: PianoKeyId.E4 })).toBe(
      false,
    );
    expect(isPianoKeyInRange(PianoKeyId.F4, { from: PianoKeyId.C4, to: PianoKeyId.E4 })).toBe(
      false,
    );
  });
});
