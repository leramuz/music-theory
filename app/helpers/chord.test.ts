import { describe, it, expect } from 'vitest';
import {
  chordQuality,
  chordInversion,
  chordNoteCount,
  chordNoteSpellings,
  chordTypeFromInstance,
  chordTypeFromKeyIds,
  chordsInKey,
  resolveKeyboardChordInstance,
  translationKeyForChord,
} from '@/helpers/chord';
import { scaleSpellingsInRange } from '@/helpers/scale';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { SCALE_STEP_PATTERN } from '@/data/scales';
import { Chord, ChordQuality, Inversion } from '@/types/chord';
import { PianoKeyId } from '@/types/piano-key';
import { RangeOption } from '@/types/range-option';
import { MajorTonic } from '@/types/tonic';
import { Scale } from '@/types/scale';

describe('chordQuality', () => {
  it('parses major triad quality', () => {
    expect(chordQuality(Chord.MAJOR_TRIAD_ROOT)).toBe(ChordQuality.MAJOR_TRIAD);
  });

  it('parses dominant seventh quality', () => {
    expect(chordQuality(Chord.DOMINANT_SEVENTH_ROOT)).toBe(ChordQuality.DOMINANT_SEVENTH);
  });

  it('parses diminished seventh quality', () => {
    expect(chordQuality(Chord.DIMINISHED_SEVENTH_THIRD)).toBe(ChordQuality.DIMINISHED_SEVENTH);
  });
});

describe('chordInversion', () => {
  it('returns root for root position', () => {
    expect(chordInversion(Chord.MINOR_TRIAD_ROOT)).toBe(Inversion.ROOT);
  });

  it('returns first for first inversion', () => {
    expect(chordInversion(Chord.MAJOR_TRIAD_FIRST)).toBe(Inversion.FIRST);
  });

  it('returns second for second inversion', () => {
    expect(chordInversion(Chord.DIMINISHED_TRIAD_SECOND)).toBe(Inversion.SECOND);
  });

  it('returns third for third inversion (7th chord only)', () => {
    expect(chordInversion(Chord.DOMINANT_SEVENTH_THIRD)).toBe(Inversion.THIRD);
  });
});

describe('chordNoteCount', () => {
  it('returns 3 for triads', () => {
    expect(chordNoteCount(Chord.MAJOR_TRIAD_ROOT)).toBe(3);
    expect(chordNoteCount(Chord.MINOR_TRIAD_SECOND)).toBe(3);
    expect(chordNoteCount(Chord.DIMINISHED_TRIAD_FIRST)).toBe(3);
    expect(chordNoteCount(Chord.AUGMENTED_TRIAD_ROOT)).toBe(3);
  });

  it('returns 4 for seventh chords', () => {
    expect(chordNoteCount(Chord.DOMINANT_SEVENTH_ROOT)).toBe(4);
    expect(chordNoteCount(Chord.DIMINISHED_SEVENTH_THIRD)).toBe(4);
  });
});

describe('translationKeyForChord', () => {
  it('returns quality.inversion format', () => {
    expect(translationKeyForChord(Chord.MAJOR_TRIAD_ROOT)).toBe('majorTriad.root');
    expect(translationKeyForChord(Chord.DOMINANT_SEVENTH_THIRD)).toBe('dominant7.third');
    expect(translationKeyForChord(Chord.DIMINISHED_SEVENTH_SECOND)).toBe('diminished7.second');
  });
});

describe('chordNoteSpellings', () => {
  it('returns C E G for C major triad root position', () => {
    const notes = chordNoteSpellings('C4', Chord.MAJOR_TRIAD_ROOT);
    expect(notes[0]).toBe('E4');
    expect(notes[1]).toBe('G4');
  });

  it('returns C Eb G for C minor triad root position', () => {
    const notes = chordNoteSpellings('C4', Chord.MINOR_TRIAD_ROOT);
    expect(notes[0]).toBe('Eb4');
    expect(notes[1]).toBe('G4');
  });

  it('returns correct notes for G dominant 7th root position', () => {
    const notes = chordNoteSpellings('G4', Chord.DOMINANT_SEVENTH_ROOT);
    expect(notes[0]).toBe('B4');
    expect(notes[1]).toBe('D5');
    expect(notes[2]).toBe('F5');
  });

  it('returns correct notes for B diminished 7th root position', () => {
    const notes = chordNoteSpellings('B3', Chord.DIMINISHED_SEVENTH_ROOT);
    expect(notes[0]).toBe('D4');
    expect(notes[1]).toBe('F4');
    expect(notes[2]).toBe('Ab4');
  });

  it('spells augmented triad with augmented fifth', () => {
    const notes = chordNoteSpellings('C4', Chord.AUGMENTED_TRIAD_ROOT);
    expect(notes[0]).toBe('E4');
    expect(notes[1]).toBe('G#4');
  });

  it('handles first inversion — bass is the third', () => {
    const notes = chordNoteSpellings('E4', Chord.MAJOR_TRIAD_FIRST);
    expect(notes[0]).toBe('G4');
    expect(notes[1]).toBe('C5');
  });
});

describe('chordTypeFromInstance', () => {
  const allChords = new Set(Object.values(Chord));

  it('identifies C major triad root position', () => {
    expect(chordTypeFromInstance({ notes: ['C4', 'E4', 'G4'] }, allChords)).toBe(
      Chord.MAJOR_TRIAD_ROOT,
    );
  });

  it('identifies A minor triad root position', () => {
    expect(chordTypeFromInstance({ notes: ['A3', 'C4', 'E4'] }, allChords)).toBe(
      Chord.MINOR_TRIAD_ROOT,
    );
  });

  it('identifies G dominant 7th root position', () => {
    expect(chordTypeFromInstance({ notes: ['G3', 'B3', 'D4', 'F4'] }, allChords)).toBe(
      Chord.DOMINANT_SEVENTH_ROOT,
    );
  });

  it('identifies B diminished 7th root position', () => {
    expect(chordTypeFromInstance({ notes: ['B3', 'D4', 'F4', 'Ab4'] }, allChords)).toBe(
      Chord.DIMINISHED_SEVENTH_ROOT,
    );
  });

  it('returns null for a note combination not matching any enabled chord', () => {
    expect(chordTypeFromInstance({ notes: ['C4', 'D4', 'G4'] }, allChords)).toBeNull();
  });
});

describe('chordTypeFromKeyIds', () => {
  it('identifies major triad by semitone offsets', () => {
    const result = chordTypeFromKeyIds(
      PianoKeyId.C4,
      [PianoKeyId.E4, PianoKeyId.G4],
      new Set(Object.values(Chord)),
    );
    expect(result).toBe(Chord.MAJOR_TRIAD_ROOT);
  });

  it('identifies diminished seventh by semitone offsets', () => {
    const result = chordTypeFromKeyIds(
      PianoKeyId.C4,
      [PianoKeyId.Ds4, PianoKeyId.Fs4, PianoKeyId.A4],
      new Set(Object.values(Chord)),
    );
    expect(result).toBe(Chord.DIMINISHED_SEVENTH_ROOT);
  });

  it('identifies dominant seventh 2nd inversion by semitone offsets', () => {
    const result = chordTypeFromKeyIds(
      PianoKeyId.D4,
      [PianoKeyId.F4, PianoKeyId.G4, PianoKeyId.B4],
      new Set(Object.values(Chord)),
    );
    expect(result).toBe(Chord.DOMINANT_SEVENTH_SECOND);
  });

  it('identifies minor chord 2nd inversion by semitone offsets', () => {
    const result = chordTypeFromKeyIds(
      PianoKeyId.D4,
      [PianoKeyId.G4, PianoKeyId.As4],
      new Set(Object.values(Chord)),
    );
    expect(result).toBe(Chord.MINOR_TRIAD_SECOND);
  });

  it('returns null when no chord matches', () => {
    const result = chordTypeFromKeyIds(
      PianoKeyId.C4,
      [PianoKeyId.D4, PianoKeyId.G4],
      new Set(Object.values(Chord)),
    );
    expect(result).toBeNull();
  });
});

describe('chordsInKey', () => {
  const cMajorSpellings = scaleSpellingsInRange(
    MajorTonic.C,
    SCALE_STEP_PATTERN[Scale.MAJOR],
    pianoRangeFromOption(RangeOption.C3_C6),
  );

  it('includes major triad root position in C major', () => {
    const result = chordsInKey(cMajorSpellings, Object.values(Chord));
    expect(result.has(Chord.MAJOR_TRIAD_ROOT)).toBe(true);
  });

  it('includes minor triad root position in C major', () => {
    const result = chordsInKey(cMajorSpellings, Object.values(Chord));
    expect(result.has(Chord.MINOR_TRIAD_ROOT)).toBe(true);
  });

  it('excludes augmented triad root position from C major (not diatonic)', () => {
    const result = chordsInKey(cMajorSpellings, Object.values(Chord));
    expect(result.has(Chord.AUGMENTED_TRIAD_ROOT)).toBe(false);
  });

  it('excludes diminished 7th root position from C major (not diatonic)', () => {
    const result = chordsInKey(cMajorSpellings, Object.values(Chord));
    expect(result.has(Chord.DIMINISHED_SEVENTH_ROOT)).toBe(false);
  });

  it('includes dominant 7th root position in C major (G B D F)', () => {
    const result = chordsInKey(cMajorSpellings, Object.values(Chord));
    expect(result.has(Chord.DOMINANT_SEVENTH_ROOT)).toBe(true);
  });
});

describe('resolveKeyboardChordInstance', () => {
  it('resolves C major triad from key IDs', () => {
    const result = resolveKeyboardChordInstance(
      'C4',
      [PianoKeyId.E4, PianoKeyId.G4],
      new Set(Object.values(Chord)),
    );
    expect(result).not.toBeNull();
    expect(result!.notes[0]).toBe('C4');
    expect(result!.notes[1]).toBe('E4');
    expect(result!.notes[2]).toBe('G4');
  });

  it('returns null when additional keys do not form a known chord', () => {
    const result = resolveKeyboardChordInstance(
      'C4',
      [PianoKeyId.D4, PianoKeyId.G4],
      new Set(Object.values(Chord)),
    );
    expect(result).toBeNull();
  });
});
