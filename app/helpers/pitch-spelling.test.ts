import { describe, it, expect } from 'vitest';
import {
  accidentalOfSpelling,
  baseSpellings,
  letterAtDiatonicStep,
  naturalNoteOfPitchSpelling,
  naturalSpelling,
  spellingByNaturalNote,
  spellingComplexity,
  stepsBetweenNaturals,
} from '@/helpers/pitch-spelling';
import { getPianoKeyById } from '@/helpers/piano-key';
import { PianoKeyId } from '@/types/piano-key';
import { EnharmonicSpellings } from '@/types/pitch-spelling';
import { Accidental } from '@/types/accidental';

describe('naturalNoteOfPitchSpelling', () => {
  it('returns the natural note from a pitch spelling', () => {
    expect(naturalNoteOfPitchSpelling('C4')).toBe('C');
    expect(naturalNoteOfPitchSpelling('D#4')).toBe('D');
    expect(naturalNoteOfPitchSpelling('Ebb4')).toBe('E');
  });
});

describe('spellingByNaturalNote', () => {
  it('returns the correct spelling for a given natural note', () => {
    const spellings: EnharmonicSpellings = ['C4', 'B#3', 'Dbb4'];
    expect(spellingByNaturalNote(spellings, 'C')).toBe('C4');
    expect(spellingByNaturalNote(spellings, 'B')).toBe('B#3');
    expect(spellingByNaturalNote(spellings, 'D')).toBe('Dbb4');
  });
});

describe('baseSpellings', () => {
  it('returns the natural spelling for a white key (no accidental)', () => {
    const spellings = getPianoKeyById(PianoKeyId.A4)?.spellings;

    if (!spellings) {
      throw new Error('Test setup error: A4 key not found');
    }

    expect(baseSpellings(spellings)).toContain('A4');
    expect(baseSpellings(spellings)?.length).toBe(1);
  });

  it('returns the sharp and flat spelling for a black key', () => {
    const spellings = getPianoKeyById(PianoKeyId.As4)?.spellings;

    if (!spellings) {
      throw new Error('Test setup error: A#4 key not found');
    }

    expect(baseSpellings(spellings)).toContain('A#4');
    expect(baseSpellings(spellings)).toContain('Bb4');
  });

  it('skips double-sharp spellings', () => {
    const spellings = getPianoKeyById(PianoKeyId.Cs4)?.spellings;

    if (!spellings) {
      throw new Error('Test setup error: C#4 key not found');
    }

    expect(baseSpellings(spellings)).not.toContain('B##3');
  });
});

describe('spellingComplexity', () => {
  it('returns 0 for natural spellings', () => {
    expect(spellingComplexity('C4')).toBe(0);
  });

  it('returns 1 for single-accidental spellings (length 3)', () => {
    expect(spellingComplexity('C#4')).toBe(1);
    expect(spellingComplexity('Db4')).toBe(1);
  });

  it('returns 2 for double-accidental spellings', () => {
    expect(spellingComplexity('C##4')).toBe(2);
    expect(spellingComplexity('Dbb4')).toBe(2);
  });

  it('returns 2 for spellings with natural signs', () => {
    expect(spellingComplexity('Cn4')).toBe(2);
  });
});

describe('letterAtDiatonicStep', () => {
  it('returns the correct letter name at a given diatonic step', () => {
    expect(letterAtDiatonicStep('C4', 2)).toBe('E');
    expect(letterAtDiatonicStep('D#4', 3)).toBe('G');
    expect(letterAtDiatonicStep('Ebb4', 1)).toBe('F');
    expect(letterAtDiatonicStep('G4', 4)).toBe('D');
  });
});

describe('stepsBetweenNaturals', () => {
  it('returns the correct number of steps between two natural notes', () => {
    expect(stepsBetweenNaturals('C', 'E')).toBe(2);
    expect(stepsBetweenNaturals('D', 'G')).toBe(3);
    expect(stepsBetweenNaturals('E', 'F')).toBe(1);
    expect(stepsBetweenNaturals('G', 'D')).toBe(4);
  });
});

describe('accidentalOfSpelling', () => {
  it('returns the correct accidental for a given pitch spelling', () => {
    expect(accidentalOfSpelling('C4')).toBeNull();
    expect(accidentalOfSpelling('D#5')).toBe(Accidental.SHARP);
    expect(accidentalOfSpelling('Eb3')).toBe(Accidental.FLAT);
    expect(accidentalOfSpelling('Fn4')).toBe(Accidental.NATURAL);
    expect(accidentalOfSpelling('G##2')).toBe(Accidental.DOUBLE_SHARP);
    expect(accidentalOfSpelling('Abb6')).toBe(Accidental.DOUBLE_FLAT);
  });
});

describe('naturalSpelling', () => {
  it('returns the natural spelling for a given pitch spelling', () => {
    expect(naturalSpelling('C4')).toBe('C4');
    expect(naturalSpelling('D#5')).toBe('D5');
    expect(naturalSpelling('Eb3')).toBe('E3');
    expect(naturalSpelling('Fn4')).toBe('F4');
    expect(naturalSpelling('G##2')).toBe('G2');
    expect(naturalSpelling('Abb6')).toBe('A6');
  });
});
