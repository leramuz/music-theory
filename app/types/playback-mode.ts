export const PlaybackMode = {
  MELODIC_ASCENDING: 'melodic-ascending',
  MELODIC_DESCENDING: 'melodic-descending',
  HARMONIC: 'harmonic',
} as const;
export type PlaybackMode = (typeof PlaybackMode)[keyof typeof PlaybackMode];
