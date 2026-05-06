import { MajorTonic, MinorTonic } from '@/types/tonic';
import { Scale } from '@/types/scale';

export const keyTonics = (scale: Scale): MajorTonic[] | MinorTonic[] => {
  const map: Record<Scale, MajorTonic[] | MinorTonic[]> = {
    [Scale.MAJOR]: Object.values(MajorTonic),
    [Scale.HARMONIC_MINOR]: Object.values(MinorTonic),
  };
  return map[scale];
};

export const defaultTonicForScale = (scale: Scale): MajorTonic | MinorTonic => {
  const map: Record<Scale, MajorTonic | MinorTonic> = {
    [Scale.MAJOR]: MajorTonic.C,
    [Scale.HARMONIC_MINOR]: MinorTonic.A,
  };
  return map[scale];
};
