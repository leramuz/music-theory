import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { ChordInstance } from '@/types/chord';
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

    const [firstKey, firstAudio, secondKey, secondAudio] =
      mode === PlaybackMode.MELODIC_DESCENDING
        ? [topKey, topAudio, bottomKey, bottomAudio]
        : [bottomKey, bottomAudio, topKey, topAudio];

    playPianoKey(firstKey, firstAudio);
    timeoutId = setTimeout(() => playPianoKey(secondKey, secondAudio), delayMs);
  });

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
};

export const playChord = (
  chord: ChordInstance,
  mode: PlaybackMode = PlaybackMode.HARMONIC,
  delayMs = 1000,
): (() => void) => {
  const keys = chord.notes.map(getPianoKeyBySpelling);

  const timeoutIds: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  Promise.all(keys.map(loadAudio)).then((audios) => {
    if (cancelled) return;

    if (mode === PlaybackMode.HARMONIC) {
      keys.forEach((key, i) => playPianoKey(key, audios[i]));
      return;
    }

    const ordered =
      mode === PlaybackMode.MELODIC_DESCENDING
        ? keys.map((k, i) => ({ key: k, audio: audios[i] })).reverse()
        : keys.map((k, i) => ({ key: k, audio: audios[i] }));

    ordered.forEach(({ key, audio }, i) => {
      if (i === 0) {
        playPianoKey(key, audio);
      } else {
        timeoutIds.push(setTimeout(() => playPianoKey(key, audio), delayMs * i));
      }
    });
  });

  return () => {
    cancelled = true;
    timeoutIds.forEach(clearTimeout);
  };
};
