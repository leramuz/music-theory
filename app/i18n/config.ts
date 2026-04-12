export const LANGUAGES = {
  EN: 'en',
  DE: 'de',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
