import { accidentalOfSpelling } from '@/helpers/pitch-spelling';
import { accidentalForDisplay } from '@/helpers/key-signature';
import { getPianoKeyBySpelling } from '@/helpers/piano-key';
import { adaptSpellingToVexflowSpelling } from '@/helpers/vexflow';
import { MeasureConfig } from '@/types/music-sheet';
import { Clef } from '@/types/clef';
import { Key } from '@/types/key';
import { NoteDuration } from '@/types/note-duration';
import { PianoKeyId } from '@/types/piano-key';
import { PitchSpelling } from '@/types/pitch-spelling';

export const makeIntervalMeasure = (
  bottom: PitchSpelling,
  top?: PitchSpelling,
  duration: NoteDuration = NoteDuration.WHOLE,
  key?: Key | null,
): MeasureConfig => {
  const bottomKeyId = getPianoKeyBySpelling(bottom)?.id;
  const getAcc = (spelling: PitchSpelling) =>
    key ? accidentalForDisplay(spelling, key) : accidentalOfSpelling(spelling);

  const bottomVoice = [
    {
      notes: [
        {
          keys: [adaptSpellingToVexflowSpelling(bottom)],
          duration,
          accidentals: [getAcc(bottom)],
        },
      ],
    },
  ];

  const topVoice = top
    ? [
        {
          notes: [
            {
              keys: [adaptSpellingToVexflowSpelling(top)],
              duration,
              accidentals: [getAcc(top)],
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
