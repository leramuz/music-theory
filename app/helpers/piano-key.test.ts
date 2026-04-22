import { describe, it, expect } from 'vitest';
import {
  isWhiteKey,
  getPianoKeyById,
  getPianoKeysInRange,
  getWhiteKeysInRange,
  getBlackKeysInRange,
} from '@/helpers/piano-key';
import { PianoKeyId } from '@/types/piano-key';

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

  it('returns undefined for an unknown id', () => {
    expect(getPianoKeyById(9999 as PianoKeyId)).toBeUndefined();
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
