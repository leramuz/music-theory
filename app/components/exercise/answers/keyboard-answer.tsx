import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getPianoKeysInRange } from '@/helpers/piano-key';
import { maxChromaticSize } from '@/helpers/interval';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { PianoKeyId } from '@/types/piano-key';
import { Interval } from '@/types/interval';
import { RangeOption } from '@/types/range-option';
import { Card } from '@/components/ui/card';
import { InteractivePiano, KeyHighlightColor } from '@/components/interactive-piano';

type KeyboardAnswerProps = {
  range: RangeOption;
  highlightedKeys: { id: PianoKeyId; color: KeyHighlightColor }[];
  selectedKeyId: PianoKeyId | null;
  bottomKeyId: PianoKeyId;
  enabledIntervals: Set<Interval>;
  onKeySelect: (_id: PianoKeyId) => void;
};

export const KeyboardAnswer = ({
  range,
  highlightedKeys,
  selectedKeyId,
  bottomKeyId,
  enabledIntervals,
  onKeySelect,
}: KeyboardAnswerProps) => {
  const t = useTranslations('practice.intervals');

  const disabledKeys = useMemo(() => {
    const maxSemitones = maxChromaticSize(enabledIntervals);
    const keys = getPianoKeysInRange(pianoRangeFromOption(range));
    return new Set(
      keys.filter((k) => k.id < bottomKeyId || k.id > bottomKeyId + maxSemitones).map((k) => k.id),
    );
  }, [range, bottomKeyId, enabledIntervals]);

  return (
    <Card className="p-5 space-y-3">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('keyboardAnswer.title')}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t.rich('keyboardAnswer.description', {
            blue: (chunks) => <span className="font-semibold text-blue-600">{chunks}</span>,
          })}
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-blue-200 border border-blue-400" />
          {t('keyboardAnswer.bottomNote')}
        </span>
        {selectedKeyId && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm bg-amber-200 border border-amber-400" />
            {t('keyboardAnswer.yourAnswer')}
          </span>
        )}
      </div>
      <InteractivePiano
        range={pianoRangeFromOption(range)}
        showKeysOutOfRange={false}
        showKeyLabels={true}
        highlightedKeys={highlightedKeys}
        disabledKeys={disabledKeys}
        onKeyPlay={(keyId) => {
          onKeySelect(keyId);
        }}
        zoom={0.5}
        muted={true}
        scrollToKeyId={bottomKeyId}
      />
    </Card>
  );
};
