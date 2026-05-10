import { Natural } from '@/types/pitch-spelling';

export type KeySignature = { kind: '#'; notes: Natural[] } | { kind: 'b'; notes: Natural[] };
