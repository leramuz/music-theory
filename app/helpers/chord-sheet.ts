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

/**
 * Builds a MeasureConfig for a chord.
 *
 * All notes are placed in a single voice using VexFlow's multi-key note format
 * (keys: string[]). This keeps the chord stacked on the staff rather than
 * splitting across voices like the interval sheet helper does.
 *
 * @param notes  Notes to render — first element is the bass. Pass only the notes
 *               you want shown (e.g. [bass] during question, full chord in feedback).
 * @param duration  Note duration (default: whole)
 * @param key  Musical key for accidental display (omit for chromatic)
 * @param showExplicitAccidentals  When true, renders raw accidentals instead of
 *                                 key-signature-aware ones (used for sheet answer)
 */
export const makeChordMeasure = (
  notes: PitchSpelling[],
  duration: NoteDuration = NoteDuration.WHOLE,
  key?: Key | null,
  showExplicitAccidentals = false,
): MeasureConfig => {
  if (notes.length === 0) {
    throw new Error('makeChordMeasure requires at least one note');
  }

  const getAcc = (spelling: PitchSpelling) =>
    key ? accidentalForDisplay(spelling, key) : accidentalOfSpelling(spelling);

  const accidentals = showExplicitAccidentals ? notes.map(accidentalOfSpelling) : notes.map(getAcc);

  const bassKeyId = getPianoKeyBySpelling(notes[0])?.id;

  return {
    staves: [
      {
        clef: bassKeyId && bassKeyId >= PianoKeyId.G3 ? Clef.TREBLE : Clef.BASS,
        voices: [
          {
            notes: [
              {
                keys: notes.map(adaptSpellingToVexflowSpelling),
                duration,
                accidentals,
              },
            ],
          },
        ],
      },
    ],
  };
};
