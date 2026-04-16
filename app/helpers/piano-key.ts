import { PianoKeyId, PianoKeyRange, PianoKey } from '@/types/piano-key';
import { PIANO_KEYS } from '@/data/piano-keys';

export const isWhiteKey = (pianoKeyId: PianoKeyId) => {
  return ![0, 2, 5, 7, 10].includes(pianoKeyId % 12);
};

export const getPianoKeyById = (pianoKeyId: PianoKeyId) => {
  return PIANO_KEYS.find((key) => key.id === pianoKeyId);
};

export const getPianoKeysInRange = (range: PianoKeyRange): PianoKey[] => {
  return PIANO_KEYS.filter((key) => key.id >= range.from && key.id <= range.to);
};

export const getWhiteKeysInRange = (range: PianoKeyRange): PianoKey[] => {
  return PIANO_KEYS.filter(
    (key) => isWhiteKey(key.id) && key.id >= range.from && key.id <= range.to,
  );
};

export const getBlackKeysInRange = (range: PianoKeyRange): PianoKey[] => {
  return PIANO_KEYS.filter(
    (key) => !isWhiteKey(key.id) && key.id >= range.from && key.id <= range.to,
  );
};
