export const NoteDuration = {
  WHOLE: 'w',
  HALF: 'h',
  QUARTER: 'q',
  EIGHTH: '8',
  SIXTEENTH: '16',
} as const;
export type NoteDuration = (typeof NoteDuration)[keyof typeof NoteDuration];
