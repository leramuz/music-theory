export const AnswerMode = {
  SELECT: 'select',
  KEYBOARD: 'keyboard',
  SHEET: 'sheet',
};
export type AnswerMode = (typeof AnswerMode)[keyof typeof AnswerMode];
