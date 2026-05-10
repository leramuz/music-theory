import { Clef } from '@/types/clef';
import { Key } from '@/types/key';
import { MajorTonic } from '@/types/tonic';
import { Scale } from '@/types/scale';
import { TimeSignature } from '@/types/time-signature';

export const SHEET_DEFAULT_CONFIG = {
  timeSignature: TimeSignature.FOUR_FOUR,
  keySignature: {
    scale: Scale.MAJOR,
    tonic: MajorTonic.C,
  } as Key,
  measureWidth: 300,
  measuresPerLine: 4,
  staveGapY: 120,
  paddingX: 40,
  paddingY: 20,
  measures: [
    {
      staves: [
        {
          clef: Clef.TREBLE,
          voices: [
            {
              notes: [],
            },
          ],
        },
        {
          clef: Clef.BASS,
          voices: [
            {
              notes: [],
            },
          ],
        },
      ],
    },
  ],
};

export const TREBLE_CLEF_NOTES = [
  'e/6',
  'd/6',
  'c/6',
  'b/5',
  'a/5',
  'g/5',
  'f/5',
  'e/5',
  'd/5',
  'c/5',
  'b/4',
  'a/4',
  'g/4',
  'f/4',
  'e/4',
  'd/4',
  'c/4',
  'b/3',
  'a/3',
  'g/3',
  'f/3',
];

export const BASS_CLEF_NOTES = [
  'g/4',
  'f/4',
  'e/4',
  'd/4',
  'c/4',
  'b/3',
  'a/3',
  'g/3',
  'f/3',
  'e/3',
  'd/3',
  'c/3',
  'b/2',
  'a/2',
  'g/2',
  'f/2',
  'e/2',
  'd/2',
  'c/2',
  'b/1',
  'a/1',
];

export const CLEF_NOTE_MAPS: Record<Clef, string[]> = {
  [Clef.TREBLE]: TREBLE_CLEF_NOTES,
  [Clef.BASS]: BASS_CLEF_NOTES,
};

export const CLEF_TOP_LINE_OFFSET = 6;
