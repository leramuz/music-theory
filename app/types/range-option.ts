export const RangeOption = {
  C3_C4: 'C3ToC4',
  C4_C5: 'C4ToC5',
  C5_C6: 'C5ToC6',
  C3_C5: 'C3ToC5',
  C4_C6: 'C4ToC6',
  C3_C6: 'C3ToC6',
} as const;
export type RangeOption = (typeof RangeOption)[keyof typeof RangeOption];
