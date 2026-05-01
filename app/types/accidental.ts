export const Accidental = {
  SHARP: '#',
  FLAT: 'b',
  DOUBLE_SHARP: '##',
  NATURAL: 'n',
  DOUBLE_FLAT: 'bb',
} as const;
export type Accidental = (typeof Accidental)[keyof typeof Accidental];
