import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getPianoKeyBySpelling, isPianoKeyInRange } from '@/helpers/piano-key';
import { naturalSpelling } from '@/helpers/pitch-spelling';
import { adaptVexflowSpellingToSpelling } from '@/helpers/vexflow';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { MeasureConfig, StaveClickPayload } from '@/types/music-sheet';
import { Accidental } from '@/types/accidental';
import { PitchSpelling } from '@/types/pitch-spelling';
import { RangeOption } from '@/types/range-option';
import { Key } from '@/types/key';
import { Card } from '@/components/ui/card';
import { MusicSheet } from '@/components/music-sheet/music-sheet';
import { AccidentalSettings } from '@/components/exercise/settings/accidental-settings';

type SheetChordAnswerProps = {
  measures: MeasureConfig[];
  accidental: Accidental | null;
  enabledAccidentals: Set<Accidental> | null;
  bassSpelling: PitchSpelling;
  range: RangeOption;
  musicalKey: Key | null;
  measureWidth: number;
  onNotePlace: (_payload: StaveClickPayload) => void;
  onAccidentalChange: (_accidental: Accidental | null) => void;
};

export const SheetChordAnswer = ({
  measures,
  accidental,
  enabledAccidentals,
  bassSpelling,
  range,
  musicalKey,
  measureWidth,
  onNotePlace,
  onAccidentalChange,
}: SheetChordAnswerProps) => {
  const t = useTranslations('practice.chords');

  const isValidStavePosition = useMemo(() => {
    const pianoRange = pianoRangeFromOption(range);
    const naturalBassKeyId = getPianoKeyBySpelling(naturalSpelling(bassSpelling)).id;

    return (noteKey: string) => {
      try {
        const naturalClickedKeyId = getPianoKeyBySpelling(
          adaptVexflowSpellingToSpelling(noteKey, null),
        ).id;
        const key = getPianoKeyBySpelling(
          adaptVexflowSpellingToSpelling(noteKey, accidental, musicalKey),
        );
        return isPianoKeyInRange(key.id, pianoRange) && naturalClickedKeyId >= naturalBassKeyId;
      } catch {
        return false;
      }
    };
  }, [range, accidental, bassSpelling, musicalKey]);

  return (
    <Card className="p-5 space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('sheetAnswer.title')}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t('sheetAnswer.description')}</p>
      </div>

      <AccidentalSettings
        accidental={accidental}
        enabledAccidentals={enabledAccidentals ?? new Set()}
        onAccidentalChange={onAccidentalChange}
      />

      <div className="overflow-x-auto">
        <MusicSheet
          measureWidth={measureWidth}
          measures={measures}
          musicalKey={musicalKey}
          disableNoteHighlight={true}
          onStaveClick={onNotePlace}
          isValidStavePosition={isValidStavePosition}
        />
      </div>
    </Card>
  );
};
