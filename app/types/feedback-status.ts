export const FeedbackStatus = {
  CORRECT: 'correct',
  PARTIALLY_CORRECT: 'partiallyCorrect',
  INCORRECT: 'incorrect',
} as const;

export type FeedbackStatus = (typeof FeedbackStatus)[keyof typeof FeedbackStatus];
