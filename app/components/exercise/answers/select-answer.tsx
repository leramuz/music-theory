import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { translationKeyForInterval } from '@/helpers/interval';
import { Interval } from '@/types/interval';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SelectAnswerProps = {
  enabledIntervals: Set<Interval>;
  selected: Interval | null;
  onSelect: (_i: Interval) => void;
};

export const SelectAnswer = ({ enabledIntervals, selected, onSelect }: SelectAnswerProps) => {
  const t = useTranslations();

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('practice.intervals.selectAnswer.title')}
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {(Object.values(Interval) as Interval[])
          .filter((i) => enabledIntervals.has(i))
          .map((interval) => (
            <Button
              key={interval}
              variant={selected === interval ? 'default' : 'outline'}
              onClick={() => onSelect(interval)}
              className={cn('whitespace-normal h-auto p-1.5')}
            >
              {t(`intervals.${translationKeyForInterval(interval)}`)}
            </Button>
          ))}
      </div>
    </Card>
  );
};
