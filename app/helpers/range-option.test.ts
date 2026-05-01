import { describe, it, expect } from 'vitest';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { PianoKeyId } from '@/types/piano-key';
import { RangeOption } from '@/types/range-option';

describe('pianoRangeFromOption', () => {
  it('returns the correct piano key range for each range option', () => {
    expect(pianoRangeFromOption(RangeOption.C3_C4)).toEqual({
      from: PianoKeyId.C3,
      to: PianoKeyId.C4,
    });
    expect(pianoRangeFromOption(RangeOption.C4_C5)).toEqual({
      from: PianoKeyId.C4,
      to: PianoKeyId.C5,
    });
    expect(pianoRangeFromOption(RangeOption.C5_C6)).toEqual({
      from: PianoKeyId.C5,
      to: PianoKeyId.C6,
    });
    expect(pianoRangeFromOption(RangeOption.C3_C5)).toEqual({
      from: PianoKeyId.C3,
      to: PianoKeyId.C5,
    });
    expect(pianoRangeFromOption(RangeOption.C4_C6)).toEqual({
      from: PianoKeyId.C4,
      to: PianoKeyId.C6,
    });
    expect(pianoRangeFromOption(RangeOption.C3_C6)).toEqual({
      from: PianoKeyId.C3,
      to: PianoKeyId.C6,
    });
  });
});
