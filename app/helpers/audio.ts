import { PianoKey } from '@/types/piano-key';

export const playPianoKey = (key: PianoKey) => {
  const audio = new Audio(`/audio/piano/${key.spellings[0].replace('#', 's')}.mp3`);
  audio.play();
  return audio;
};
