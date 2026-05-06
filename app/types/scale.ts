export const Scale = {
  MAJOR: 'major',
  HARMONIC_MINOR: 'harmonicMinor',
} as const;
export type Scale = (typeof Scale)[keyof typeof Scale];
