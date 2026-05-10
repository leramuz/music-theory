import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { translationKeyForChord } from '@/helpers/chord';
import { Chord } from '@/types/chord';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SelectChordAnswerProps = {
  enabledChords: Set<Chord>;
  selected: Chord | null;
  onSelect: (_chord: Chord) => void;
};

export const SelectChordAnswer = ({
  enabledChords,
  selected,
  onSelect,
}: SelectChordAnswerProps) => {
  const t = useTranslations();

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('practice.chords.selectAnswer.title')}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.values(Chord)
          .filter((c) => enabledChords.has(c))
          .map((chord) => (
            <Button
              key={chord}
              variant={selected === chord ? 'default' : 'outline'}
              onClick={() => onSelect(chord)}
              className={cn('whitespace-normal h-auto p-1.5 text-xs')}
            >
              {t(`chords.${translationKeyForChord(chord)}`)}
            </Button>
          ))}
      </div>
    </Card>
  );
};
