import { chromaticSize, diatonicSteps } from '@/helpers/interval';
import { NATURAL_NOTES } from '@/data/natural-notes';
import { Interval } from '@/types/interval';
import { EnharmonicSpellings, Natural, PitchSpelling } from '@/types/pitch-spelling';
import { Accidental } from '@/types/accidental';

export const naturalNoteOfPitchSpelling = (spelling: PitchSpelling): Natural => {
  const naturalNote = spelling[0] as Natural;
  return naturalNote;
};

// Currently works only for max interval of an octave, which is sufficient for our use cases
export const stepsBetweenNaturals = (from: Natural, to: Natural, numSemitones = 0): number => {
  const octaveSemitones = chromaticSize(Interval.PERFECT_OCTAVE);
  const octaveSteps = diatonicSteps(Interval.PERFECT_OCTAVE);
  if (from === to) return numSemitones > 0 ? (numSemitones / octaveSemitones) * octaveSteps : 0;

  const fromIdx = NATURAL_NOTES.findIndex((n) => n === from);
  const toIdx = NATURAL_NOTES.findIndex((n) => n === to);
  return (toIdx - fromIdx + NATURAL_NOTES.length) % NATURAL_NOTES.length;
};

export const spellingByNaturalNote = (
  spellings: EnharmonicSpellings,
  naturalNote: Natural,
): PitchSpelling | undefined => spellings.find((s) => s.startsWith(naturalNote));

export const accidentalOfSpelling = (spelling: PitchSpelling): Accidental | null => {
  if (spelling.length === 2) return null;

  const accidentalChar = spelling.slice(1, -1);
  switch (accidentalChar) {
    case '#':
      return Accidental.SHARP;
    case 'b':
      return Accidental.FLAT;
    case 'n':
      return Accidental.NATURAL;
    case '##':
      return Accidental.DOUBLE_SHARP;
    case 'bb':
      return Accidental.DOUBLE_FLAT;
    default:
      throw new Error(`Invalid accidental character in spelling: ${spelling}`);
  }
};

/* Given a list of spellings for a piano key, returns the simplest spellings:
   - White key: the natural spelling(s) with no accidental (e.g. 'C4')
   - Black key: all single-accidental spellings (e.g. 'C#4', 'Db4'), excluding double-sharps and double-flats
*/
export const baseSpellings = (spellings: EnharmonicSpellings): PitchSpelling[] => {
  const minComplexity = Math.min(...spellings.map(spellingComplexity));
  return spellings.filter((s) => spellingComplexity(s) === minComplexity);
};

export const spellingComplexity = (spelling: PitchSpelling): number => {
  const accidental = accidentalOfSpelling(spelling);
  switch (accidental) {
    case null:
      return 0;
    case Accidental.SHARP:
    case Accidental.FLAT:
      return 1;
    default:
      return 2;
  }
};

// Given a pitch like 'E4', return the letter name 2 steps higher (i.e. 'G')
export const letterAtDiatonicStep = (pitch: PitchSpelling, steps: number): Natural => {
  const letter = naturalNoteOfPitchSpelling(pitch);
  const idx = NATURAL_NOTES.findIndex((n) => n === letter);
  return NATURAL_NOTES[(idx + steps) % NATURAL_NOTES.length];
};

export const naturalSpelling = (spelling: PitchSpelling): PitchSpelling =>
  `${spelling[0]}${spelling[spelling.length - 1]}` as PitchSpelling;

export const displaySpellingBase = (spelling: PitchSpelling): string => {
  const ACCIDENTAL_SYMBOLS: Record<Accidental, string> = {
    b: '♭',
    '#': '♯',
    n: '♮',
    '##': '𝄪',
    bb: '𝄫',
  };

  const spellingAccidental = accidentalOfSpelling(spelling);
  const natural = naturalNoteOfPitchSpelling(spelling);

  if (!spellingAccidental) return natural;
  return `${natural}${ACCIDENTAL_SYMBOLS[spellingAccidental]}`;
};
