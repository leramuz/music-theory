export const randomElement = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
