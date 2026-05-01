export const PlaybackMode = {
  MELODIC: 'melodic',
  HARMONIC: 'harmonic',
} as const;
export type PlaybackMode = (typeof PlaybackMode)[keyof typeof PlaybackMode];
