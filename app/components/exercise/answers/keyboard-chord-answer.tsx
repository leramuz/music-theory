import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getPianoKeysInRange } from '@/helpers/piano-key';
import { pianoRangeFromOption } from '@/helpers/range-option';
import { chordNoteCount } from '@/helpers/chord';
import { Chord } from '@/types/chord';
import { PianoKeyId } from '@/types/piano-key';
import { RangeOption } from '@/types/range-option';
import { Card } from '@/components/ui/card';
import { InteractivePiano, KeyHighlightColor } from '@/components/interactive-piano';

type KeyboardChordAnswerProps = {
  range: RangeOption;
  highlightedKeys: { id: PianoKeyId; color: KeyHighlightColor }[];
  selectedKeyIds: Set<PianoKeyId>;
  bassKeyId: PianoKeyId;
  enabledChords: Set<Chord>;
  onKeyToggle: (_id: PianoKeyId) => void;
};

export const KeyboardChordAnswer = ({
  range,
  highlightedKeys,
  selectedKeyIds,
  bassKeyId,
  enabledChords,
  onKeyToggle,
}: KeyboardChordAnswerProps) => {
  const t = useTranslations('practice.chords');

  // Max upper notes needed across all enabled chords
  const maxUpperNotes = useMemo(() => {
    if (enabledChords.size === 0) return 2;
    return Math.max(...Array.from(enabledChords).map((c) => chordNoteCount(c) - 1));
  }, [enabledChords]);

  const disabledKeys = useMemo(() => {
    const keys = getPianoKeysInRange(pianoRangeFromOption(range));
    return new Set(
      keys.filter((k) => k.id === bassKeyId || k.id > bassKeyId + 12 * 2).map((k) => k.id),
    );
  }, [range, bassKeyId]);

  const remaining = maxUpperNotes - selectedKeyIds.size;

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

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-blue-200 border border-blue-400" />
          {t('keyboardAnswer.bassNote')}
        </span>
        {selectedKeyIds.size > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm bg-amber-200 border border-amber-400" />
            {t('keyboardAnswer.yourAnswer')}
          </span>
        )}
        {remaining > 0 && (
          <span className="text-xs text-muted-foreground">
            {t('keyboardAnswer.selectMore', { count: remaining })}
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
          if (keyId !== bassKeyId) onKeyToggle(keyId);
        }}
        zoom={0.5}
        muted={true}
        scrollToKeyId={bassKeyId}
      />
    </Card>
  );
};
