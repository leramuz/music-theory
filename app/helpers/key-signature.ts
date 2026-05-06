import {
  MAJOR_KEY_ACCIDENTALS,
  MINOR_KEY_ACCIDENTALS,
  SHARP_ORDER,
  FLAT_ORDER,
} from '@/data/key-signatures';
import { accidentalOfSpelling, naturalNoteOfPitchSpelling } from '@/helpers/pitch-spelling';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { Key } from '@/types/key';
import { KeySignature } from '@/types/key-signature';
import { Natural, PitchSpelling } from '@/types/pitch-spelling';
import { Accidental } from '@/types/accidental';
import { Scale } from '@/types/scale';

/**
 * Converts a circle-of-fifths accidental count into a KeySignature.
 * A positive count produces sharps (in circle-of-fifths order: F C G D A E B),
 * a negative count produces flats (B E A D G C F), and zero gives an empty sharp signature.
 */
export const accidentalsForCount = (count: number): KeySignature => {
  if (count >= 0) return { kind: Accidental.SHARP, notes: SHARP_ORDER.slice(0, count) };
  return { kind: Accidental.FLAT, notes: FLAT_ORDER.slice(0, -count) };
};

/** Returns the key signature for a given key (major or harmonic minor). */
export const keySignatureForKey = (key: Key): KeySignature => {
  const count =
    key.scale === Scale.MAJOR ? MAJOR_KEY_ACCIDENTALS[key.tonic] : MINOR_KEY_ACCIDENTALS[key.tonic];

  return accidentalsForCount(count);
};

/**
 * Returns the accidental the key signature implies for a natural note letter,
 * or null if the key signature does not alter that letter.
 */
export const keySignatureImpliedAccidental = (natural: Natural, key: Key): Accidental | null => {
  const keySignature = keySignatureForKey(key);
  if (keySignature.kind === Accidental.FLAT && keySignature.notes.includes(natural))
    return Accidental.FLAT;
  if (keySignature.kind === Accidental.SHARP && keySignature.notes.includes(natural))
    return Accidental.SHARP;
  return null;
};

/**
 * Returns the accidental that VexFlow should show explicitly for a spelling under a key
 * signature. Returns null when the note matches what the key sig already implies (so VexFlow
 * handles it automatically). Returns the deviation accidental otherwise (e.g. NATURAL for a
 * raised 7th in harmonic minor, SHARP for an extra chromatic alteration).
 */
export const accidentalForDisplay = (spelling: PitchSpelling, key: Key): Accidental | null => {
  const natural = naturalNoteOfPitchSpelling(spelling);
  const acc = accidentalOfSpelling(spelling);
  const implied = keySignatureImpliedAccidental(natural, key);

  return acc === implied ? null : acc;
};

/** Maps each natural letter altered by the key signature to the accidental it implies. */
const alteredLettersForKey = (key: Key): Map<Natural, Accidental> => {
  const keySignature = keySignatureForKey(key);
  const map = new Map<Natural, Accidental>();
  keySignature.notes.forEach((n) => map.set(n, keySignature.kind));

  return map;
};

/**
 * Returns the subset of accidentals (in canonical Accidental order) that appear in
 * `spellings` but deviate from what the key signature implies for those letter names.
 * Used to determine which accidental buttons to show in the sheet-answer UI.
 */
export const deviatingAccidentals = (spellings: PitchSpelling[], key: Key): Accidental[] => {
  const alteredLetters = alteredLettersForKey(key);
  const deviating = new Set<Accidental>();

  for (const spelling of spellings) {
    const natural = naturalNoteOfPitchSpelling(spelling);
    const acc = accidentalOfSpelling(spelling);
    const keySigAcc = alteredLetters.get(natural) ?? null;

    if (acc !== keySigAcc && acc !== null) {
      deviating.add(acc);
    }
  }

  return Object.values(Accidental).filter((a) => deviating.has(a));
};

/**
 * Normalizes scale spellings against a key signature so that notes deviating from
 * the key sig are spelled explicitly. For example, in C harmonic minor (key sig: Bb, Eb, Ab),
 * the raised 7th is spelled `B4` (no accidental) by intervalTopSpelling, but VexFlow would
 * render it as Bb under the key sig. This function replaces `B4` → `Bn4` so that both the
 * music sheet and the answer comparison use the natural-sign form.
 */
export const normalizeSpellingsForKeySignature = (
  spellings: PitchSpelling[],
  key: Key,
): PitchSpelling[] => {
  const alteredLetters = alteredLettersForKey(key);

  return spellings.map((spelling) => {
    const natural = naturalNoteOfPitchSpelling(spelling);
    const spellingAcc = accidentalOfSpelling(spelling);
    const keySigAcc = alteredLetters.get(natural) ?? null;

    // Note sounds natural but key sig alters this letter → needs explicit natural sign (e.g. B4 → Bn4)
    if (keySigAcc !== null && spellingAcc === null) {
      const pianoKey = getPianoKeyBySpelling(spelling);
      const naturalSignSpelling = pianoKey.spellings.find((s) => s.startsWith(natural + 'n')) as
        | PitchSpelling
        | undefined;
      if (naturalSignSpelling) return naturalSignSpelling;
    }

    return spelling;
  });
};
