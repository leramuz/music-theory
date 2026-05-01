import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { IntervalInstance } from '@/types/interval';
import { PianoKey } from '@/types/piano-key';
import { PlaybackMode } from '@/types/playback-mode';

export const playPianoKey = (key: PianoKey, audio?: HTMLAudioElement) => {
  const el = audio ?? new Audio(`/audio/piano/${key.spellings[0].replace('#', 's')}.mp3`);
  el.play();
  return el;
};

const loadAudio = (key: PianoKey): Promise<HTMLAudioElement> => {
  return new Promise((resolve) => {
    const audio = new Audio(`/audio/piano/${key.spellings[0].replace('#', 's')}.mp3`);
    audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
    // resolve immediately if already cached/loaded
    if (audio.readyState >= 3) resolve(audio);
  });
};

export const playInterval = (
  interval: IntervalInstance,
  mode: PlaybackMode = PlaybackMode.HARMONIC,
  delayMs = 1000,
): (() => void) => {
  const bottomKey = getPianoKeyBySpelling(interval.bottom);
  const topKey = getPianoKeyBySpelling(interval.top);

  let timeoutId: ReturnType<typeof setTimeout>;
  let cancelled = false;

  Promise.all([loadAudio(bottomKey), loadAudio(topKey)]).then(([bottomAudio, topAudio]) => {
    if (cancelled) return;

    if (mode === PlaybackMode.HARMONIC) {
      playPianoKey(bottomKey, bottomAudio);
      playPianoKey(topKey, topAudio);
      return;
    }

    playPianoKey(bottomKey, bottomAudio);
    timeoutId = setTimeout(() => playPianoKey(topKey, topAudio), delayMs);
  });

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
};
