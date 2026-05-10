import { PianoKeyId, PianoKeyRange, PianoKey } from '@/types/piano-key';
import { PitchSpelling, EnharmonicSpellings } from '@/types/pitch-spelling';
import { PIANO_KEYS } from '@/data/piano-keys';

export const isWhiteKey = (pianoKeyId: PianoKeyId): boolean => {
  return ![0, 2, 5, 7, 10].includes(pianoKeyId % 12);
};

export const getPianoKeyById = (pianoKeyId: PianoKeyId): PianoKey => {
  const key = PIANO_KEYS.find((key) => key.id === pianoKeyId);

  if (!key) {
    throw new Error(`No piano key found for id: ${pianoKeyId}`);
  }

  return key;
};

export const getPianoKeySpellings = (pianoKeyId: PianoKeyId): EnharmonicSpellings => {
  const key = getPianoKeyById(pianoKeyId);
  return key.spellings;
};

export const isPianoKeyInRange = (keyId: PianoKeyId, range: PianoKeyRange): boolean => {
  return keyId >= range.from && keyId <= range.to;
};

export const getPianoKeysInRange = (range: PianoKeyRange): PianoKey[] => {
  return PIANO_KEYS.filter((key) => isPianoKeyInRange(key.id, range));
};

export const getWhiteKeysInRange = (range: PianoKeyRange): PianoKey[] => {
  return PIANO_KEYS.filter((key) => isWhiteKey(key.id) && isPianoKeyInRange(key.id, range));
};

export const getBlackKeysInRange = (range: PianoKeyRange): PianoKey[] => {
  return PIANO_KEYS.filter((key) => !isWhiteKey(key.id) && isPianoKeyInRange(key.id, range));
};

export const getPianoKeyIdByOffset = (
  pianoKeyId: PianoKeyId,
  offset: number,
): PianoKeyId | undefined => {
  const targetId = pianoKeyId + offset;

  if (targetId < PIANO_KEYS[0].id || targetId > PIANO_KEYS[PIANO_KEYS.length - 1].id) {
    return undefined;
  }

  return targetId as PianoKeyId;
};

export const getPianoKeyBySpelling = (spelling: PitchSpelling): PianoKey => {
  const key = PIANO_KEYS.find((key) => key.spellings.some((s) => s === spelling));

  if (!key) {
    throw new Error(`No piano key found for spelling: ${spelling}`);
  }

  return key;
};
