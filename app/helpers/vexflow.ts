import { keySignatureImpliedAccidental } from '@/helpers/key-signature';
import { Accidental } from '@/types/accidental';
import { Key } from '@/types/key';
import { Natural, PitchSpelling } from '@/types/pitch-spelling';
import { Scale } from '@/types/scale';

export const adaptKeyToVexflowKey = (key: Key): string => {
  const suffix = key.scale === Scale.MAJOR ? '' : 'm';
  return `${key.tonic}${suffix}`;
};

export const adaptVexflowSpellingToSpelling = (
  vexflowSpelling: string,
  accidental: Accidental | null,
  musicalKey?: Key | null,
): PitchSpelling => {
  const [notePart, octave] = vexflowSpelling.split('/');

  if (!notePart || octave === undefined || octave === '') {
    throw new Error(`Invalid vexflowSpelling: ${vexflowSpelling}`);
  }

  const natural = notePart.toUpperCase() as Natural;
  // Explicit accidental always wins; otherwise apply key-signature implication
  const resolved =
    accidental !== null
      ? accidental
      : musicalKey
        ? keySignatureImpliedAccidental(natural, musicalKey)
        : null;

  return `${natural}${resolved ?? ''}${octave}` as PitchSpelling;
};

export const adaptSpellingToVexflowSpelling = (spelling: PitchSpelling): string => {
  const letter = spelling[0].toLowerCase();
  const octave = spelling[spelling.length - 1];

  return `${letter}/${octave}`;
};
