import { PianoKeyId, PianoKeyRange } from '@/types/piano-key';
import { RangeOption } from '@/types/range-option';

export const pianoRangeFromOption = (option: RangeOption) => {
  const map: Record<RangeOption, PianoKeyRange> = {
    [RangeOption.C3_C4]: { from: PianoKeyId.C3, to: PianoKeyId.C4 },
    [RangeOption.C4_C5]: { from: PianoKeyId.C4, to: PianoKeyId.C5 },
    [RangeOption.C5_C6]: { from: PianoKeyId.C5, to: PianoKeyId.C6 },
    [RangeOption.C3_C5]: { from: PianoKeyId.C3, to: PianoKeyId.C5 },
    [RangeOption.C4_C6]: { from: PianoKeyId.C4, to: PianoKeyId.C6 },
    [RangeOption.C3_C6]: { from: PianoKeyId.C3, to: PianoKeyId.C6 },
  };
  return map[option];
};
