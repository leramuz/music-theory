export const PlaybackMode = {
  HARMONIC: 'harmonic',
  MELODIC_ASCENDING: 'melodic-ascending',
  MELODIC_DESCENDING: 'melodic-descending',
} as const;
export type PlaybackMode = (typeof PlaybackMode)[keyof typeof PlaybackMode];
