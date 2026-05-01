import { adaptSpellingToVexKey, accidentalOfSpelling } from '@/helpers/pitch-spelling';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { Clef, MeasureConfig, NoteDuration } from '@/types/music-sheet';
import { PianoKeyId } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';

export const makeIntervalMeasure = (
  bottom: PitchSpelling,
  top?: PitchSpelling,
  duration: NoteDuration = NoteDuration.WHOLE,
): MeasureConfig => {
  const bottomKeyId = getPianoKeyBySpelling(bottom)?.id;

  const bottomVoice = [
    {
      notes: [
        {
          keys: [adaptSpellingToVexKey(bottom)],
          duration,
          accidentals: [accidentalOfSpelling(bottom)],
        },
      ],
    },
  ];

  const topVoice = top
    ? [
        {
          notes: [
            {
              keys: [adaptSpellingToVexKey(top)],
              duration,
              accidentals: [accidentalOfSpelling(top)],
            },
          ],
        },
      ]
    : [];

  return {
    staves: [
      {
        clef: bottomKeyId && bottomKeyId >= PianoKeyId.G3 ? Clef.TREBLE : Clef.BASS,
        voices: [...bottomVoice, ...topVoice],
      },
    ],
  };
};
