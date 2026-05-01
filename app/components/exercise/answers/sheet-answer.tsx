import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getPianoKeyBySpelling, isPianoKeyInRange } from '@/helpers/piano-key';
import { adaptVexKeyToSpelling, naturalSpelling } from '@/helpers/pitch-spelling';
import { maxChromaticSize } from '@/helpers/interval';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { MeasureConfig, StaveClickPayload } from '@/types/music-sheet';
import { Accidental } from '@/types/accidental';
import { Interval } from '@/types/interval';
import { PitchSpelling } from '@/types/pitch-spelling';
import { RangeOption } from '@/types/range-option';
import { Card } from '@/components/ui/card';
import { MusicSheet } from '@/components/music-sheet/music-sheet';
import { AccidentalSettings } from '@/components/exercise/settings/accidental-settings';

type SheetAnswerProps = {
  measures: MeasureConfig[];
  accidental: Accidental | null;
  enabledAccidentals: Set<Accidental> | null;
  bottomSpelling: PitchSpelling;
  enabledIntervals: Set<Interval>;
  range: RangeOption;
  onNotePlace: (_payload: StaveClickPayload) => void;
  onAccidentalChange: (_accidental: Accidental | null) => void;
};

export const SheetAnswer = ({
  measures,
  accidental,
  enabledAccidentals,
  bottomSpelling,
  enabledIntervals,
  range,
  onNotePlace,
  onAccidentalChange,
}: SheetAnswerProps) => {
  const t = useTranslations('practice.intervals');

  const isValidStavePosition = useMemo(() => {
    const pianoRange = pianoRangeFromOption(range);
    const maxSemitones = maxChromaticSize(enabledIntervals);
    const bottomKeyId = getPianoKeyBySpelling(bottomSpelling).id;
    // Natural staff position of bottom note (e.g. 'C#4' → 'C4'), so the line is
    // enabled even if the accidental shifts the pitch below the bottom exact id
    const naturalBottomKeyId = getPianoKeyBySpelling(naturalSpelling(bottomSpelling)).id;

    return (noteKey: string) => {
      try {
        const naturalClickedKeyId = getPianoKeyBySpelling(adaptVexKeyToSpelling(noteKey, null)).id;
        const key = getPianoKeyBySpelling(adaptVexKeyToSpelling(noteKey, accidental));
        return (
          isPianoKeyInRange(key.id, pianoRange) &&
          naturalClickedKeyId >= naturalBottomKeyId &&
          key.id <= bottomKeyId + maxSemitones
        );
      } catch {
        return false;
      }
    };
  }, [range, accidental, bottomSpelling, enabledIntervals]);

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
          measureWidth={200}
          measures={measures}
          disableNoteHighlight={true}
          onStaveClick={onNotePlace}
          isValidStavePosition={isValidStavePosition}
        />
      </div>
    </Card>
  );
};
