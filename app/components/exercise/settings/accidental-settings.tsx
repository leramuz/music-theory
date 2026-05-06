import { useTranslations } from 'next-intl';
import { Accidental } from '@/types/accidental';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AccidentalSettingsProps = {
  accidental: Accidental | null;
  enabledAccidentals: Set<Accidental>;
  onAccidentalChange: (_accidental: Accidental | null) => void;
};

export const AccidentalSettings = ({
  accidental,
  enabledAccidentals,
  onAccidentalChange,
}: AccidentalSettingsProps) => {
  const t = useTranslations('practice.settings.accidental');

  if (!enabledAccidentals || enabledAccidentals.size === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('title')}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onAccidentalChange(null)}
          variant={accidental === null ? 'default' : 'outline'}
        >
          {t('options.none')}
        </Button>
        {Array.from(enabledAccidentals).map((a) => (
          <Button
            key={a}
            onClick={() => onAccidentalChange(a)}
            variant={accidental === a ? 'default' : 'outline'}
          >
            {t(`options.${a}`)}
          </Button>
        ))}
      </div>
    </Card>
  );
};
