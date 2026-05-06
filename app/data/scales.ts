import { Interval } from '@/types/interval';
import { Scale } from '@/types/scale';

/**
 * Step intervals between consecutive scale degrees for each scale type.
 */
export const SCALE_STEP_PATTERN: Record<Scale, Interval[]> = {
  [Scale.MAJOR]: [
    Interval.MAJOR_SECOND,
    Interval.MAJOR_SECOND,
    Interval.MINOR_SECOND,
    Interval.MAJOR_SECOND,
    Interval.MAJOR_SECOND,
    Interval.MAJOR_SECOND,
    Interval.MINOR_SECOND,
  ],
  [Scale.HARMONIC_MINOR]: [
    Interval.MAJOR_SECOND,
    Interval.MINOR_SECOND,
    Interval.MAJOR_SECOND,
    Interval.MAJOR_SECOND,
    Interval.MINOR_SECOND,
    Interval.AUGMENTED_SECOND,
    Interval.MINOR_SECOND,
  ],
};
