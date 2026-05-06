export const TimeSignature = {
  FOUR_FOUR: '4/4',
  THREE_FOUR: '3/4',
  TWO_FOUR: '2/4',
} as const;
export type TimeSignature = (typeof TimeSignature)[keyof typeof TimeSignature];
