import { useTranslations } from 'next-intl';
import { RangeOption } from '@/types/range-option';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PianoRangeSettingsProps = {
  range: RangeOption;
  onRangeChange: (_range: RangeOption) => void;
};

export const PianoRangeSettings = ({ range, onRangeChange }: PianoRangeSettingsProps) => {
  const t = useTranslations('practice.settings.pianoRange');

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('title')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.values(RangeOption).map((r) => (
          <Button
            key={r}
            onClick={() => onRangeChange(r)}
            variant={range === r ? 'default' : 'outline'}
          >
            {t(`options.${r}`)}
          </Button>
        ))}
      </div>
    </Card>
  );
};
