import { MajorTonic, MinorTonic } from '@/types/tonic';

export type Key =
  | { scale: 'major'; tonic: MajorTonic }
  | { scale: 'harmonicMinor'; tonic: MinorTonic };
