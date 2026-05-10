import { intervalTopSpelling } from '@/helpers/interval';
import { baseSpellings, spellingComplexity } from '@/helpers/pitch-spelling';
import {
  getPianoKeyById,
  getPianoKeyBySpelling,
  getPianoKeyIdByOffset,
  getPianoKeysInRange,
} from '@/helpers/piano-key';
import { randomElement } from '@/helpers/common';
import { CHORD_FORMULAS } from '@/data/chord-formulas';
import { SEMITONES } from '@/data/interval-semitones';
import { Chord, ChordInstance, ChordQuality, Inversion } from '@/types/chord';
import { PianoKeyId, PianoKeyRange } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';

// ─── Chord metadata ──────────────────────────────────────────────────────────

export const chordQuality = (chord: Chord): ChordQuality => chord.split(':')[0] as ChordQuality;

export const chordInversion = (chord: Chord): Inversion => chord.split(':')[1] as Inversion;

export const chordNoteCount = (chord: Chord): number => CHORD_FORMULAS[chord].length + 1; // bass + N upper notes

export const translationKeyForChord = (chord: Chord): string => {
  const [quality, inversion] = chord.split(':');
  return `${quality}.${inversion}`;
};

// ─── Spelling computation ─────────────────────────────────────────────────────

/**
 * Computes all note spellings for a chord given its bass note.
 */
export const chordNoteSpellings = (bass: PitchSpelling, chord: Chord): PitchSpelling[] => {
  const formula = CHORD_FORMULAS[chord];
  return formula.map((interval) => intervalTopSpelling(bass, interval));
};

// ─── Instance construction ────────────────────────────────────────────────────

/**
 * Generates a random ChordInstance where the entire chord fits within `range`.
 * When `scaleSpellings` are provided, the bass is restricted to those spellings.
 */
export const randomChordInstanceInRange = (
  chords: Set<Chord>,
  range: PianoKeyRange,
  scaleSpellings?: PitchSpelling[],
): ChordInstance => {
  const chordArray = Array.from(chords);

  // Build candidate (bass spelling, chord) pairs
  const candidates: { bass: PitchSpelling; chord: Chord }[] = [];

  for (const chord of chordArray) {
    const formula = CHORD_FORMULAS[chord];
    const topSemitones = SEMITONES[formula[formula.length - 1]] as number;

    const upperLimit = getPianoKeyIdByOffset(range.to, -topSemitones);
    if (!upperLimit) continue;

    const bassKeys = getPianoKeysInRange({ from: range.from, to: upperLimit });
    const scaleLetterAcc = scaleSpellings
      ? new Set(scaleSpellings.map((s) => s.slice(0, -1)))
      : null;

    for (const bassKey of bassKeys) {
      const bassSpellings = baseSpellings(bassKey.spellings);
      for (const bass of bassSpellings) {
        if (scaleLetterAcc && !scaleLetterAcc.has(bass.slice(0, -1))) continue;
        candidates.push({ bass, chord });
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error('No chord instances fit in the given range');
  }

  const { bass, chord } = randomElement(candidates);
  const upperNotes = chordNoteSpellings(bass, chord);
  return { notes: [bass, ...upperNotes] as [PitchSpelling, ...PitchSpelling[]] };
};

// ─── Chord identification ─────────────────────────────────────────────────────

/**
 * Given an array of piano key IDs (bass + additional), returns the semitone
 * offsets of each additional key above the bass.
 */
const semitonesFromBass = (bassId: PianoKeyId, additionalIds: PianoKeyId[]): number[] =>
  additionalIds.map((id) => id - bassId);

/**
 * Returns the Chord type for a given bass + additional key IDs, or null if no
 * enabled chord matches the semitone pattern.
 */
export const chordTypeFromKeyIds = (
  bassId: PianoKeyId,
  additionalIds: PianoKeyId[],
  enabledChords: Set<Chord>,
): Chord | null => {
  const offsets = semitonesFromBass(bassId, additionalIds);

  for (const chord of enabledChords) {
    const formula = CHORD_FORMULAS[chord];
    if (formula.length !== offsets.length) continue;
    const match = formula.every((interval, i) => SEMITONES[interval] === offsets[i]);
    if (match) return chord;
  }

  return null;
};

/**
 * Like chordTypeFromKeyIds, but works from an already-spelled ChordInstance.
 * Tries to match the semitone pattern to an enabled chord.
 */
export const chordTypeFromInstance = (
  instance: ChordInstance,
  enabledChords: Set<Chord>,
): Chord | null => {
  const [bass, ...upper] = instance.notes;
  const bassId = getPianoKeyBySpelling(bass).id;
  const upperIds = upper.map((s) => getPianoKeyBySpelling(s).id);
  return chordTypeFromKeyIds(bassId, upperIds, enabledChords);
};

/**
 * Resolves a keyboard chord answer into a properly-spelled ChordInstance.
 * Prefers spellings that appear in `scaleSpellings` when provided.
 * Returns null if the semitone pattern doesn't match any enabled chord.
 */
export const resolveKeyboardChordInstance = (
  bass: PitchSpelling,
  additionalKeyIds: PianoKeyId[],
  enabledChords: Set<Chord>,
  scaleSpellings?: PitchSpelling[],
): ChordInstance | null => {
  const bassId = getPianoKeyBySpelling(bass).id;
  const matchedChord = chordTypeFromKeyIds(bassId, additionalKeyIds, enabledChords);
  if (!matchedChord) return null;

  const scaleLetterAcc = scaleSpellings ? new Set(scaleSpellings.map((s) => s.slice(0, -1))) : null;

  // Resolve each additional key to its best spelling
  const formula = CHORD_FORMULAS[matchedChord];
  const upperSpellings: PitchSpelling[] = additionalKeyIds.map((keyId, i) => {
    const key = getPianoKeyById(keyId);
    // The canonical spelling for this position is given by intervalTopSpelling
    const canonical = intervalTopSpelling(bass, formula[i]);
    // Use canonical if valid, otherwise fall back to scale preference
    if (key.spellings.includes(canonical)) return canonical;

    if (scaleLetterAcc) {
      const scaleMatch = key.spellings.find((s) => scaleLetterAcc.has(s.slice(0, -1)));
      if (scaleMatch) return scaleMatch;
    }
    // Fall back to simplest spelling
    return baseSpellings(key.spellings)[0];
  });

  return {
    notes: [bass, ...upperSpellings] as [PitchSpelling, ...PitchSpelling[]],
  };
};

// ─── Key filtering ────────────────────────────────────────────────────────────

/**
 * Returns the subset of `chords` that can be built diatonically from `scaleSpellings`:
 * there exists a bass in the scale such that every chord tone is also in the scale.
 */
export const chordsInKey = (
  scaleSpellings: PitchSpelling[],
  chords: Iterable<Chord>,
): Set<Chord> => {
  const scaleIds = new Set(scaleSpellings.map((s) => getPianoKeyBySpelling(s).id));
  const found = new Set<Chord>();

  for (const chord of chords) {
    const formula = CHORD_FORMULAS[chord];

    for (const bassSpelling of scaleSpellings) {
      const bassId = getPianoKeyBySpelling(bassSpelling).id;
      const allInScale = formula.every((interval) => {
        const upperIdCandidate = getPianoKeyIdByOffset(bassId, SEMITONES[interval]);
        return upperIdCandidate !== undefined && scaleIds.has(upperIdCandidate);
      });

      if (allInScale) {
        found.add(chord);
        break; // one matching bass is enough
      }
    }
  }

  return found;
};

// ─── Spelling complexity ──────────────────────────────────────────────────────

export const chordInstanceSpellingComplexity = (instance: ChordInstance): number =>
  instance.notes.reduce((sum, s) => sum + spellingComplexity(s), 0);
