export const ExercisePhase = {
  SETTINGS: 'settings',
  QUESTION: 'question',
  FEEDBACK: 'feedback',
} as const;
export type ExercisePhase = (typeof ExercisePhase)[keyof typeof ExercisePhase];
