import { useTranslations } from 'next-intl';
import { translationKeyForInterval } from '@/helpers/interval';
import { Interval } from '@/types/interval';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const INTERVAL_GROUPS_CONFIG: { labelKey: string; intervals: Interval[] }[] = [
  { labelKey: 'unisonsAndOctave', intervals: [Interval.PERFECT_UNISON, Interval.PERFECT_OCTAVE] },
  {
    labelKey: 'seconds',
    intervals: [Interval.MINOR_SECOND, Interval.MAJOR_SECOND, Interval.AUGMENTED_SECOND],
  },
  { labelKey: 'thirds', intervals: [Interval.MINOR_THIRD, Interval.MAJOR_THIRD] },
  { labelKey: 'fourths', intervals: [Interval.PERFECT_FOURTH, Interval.AUGMENTED_FOURTH] },
  { labelKey: 'fifths', intervals: [Interval.DIMINISHED_FIFTH, Interval.PERFECT_FIFTH] },
  { labelKey: 'sixths', intervals: [Interval.MINOR_SIXTH, Interval.MAJOR_SIXTH] },
  { labelKey: 'sevenths', intervals: [Interval.MINOR_SEVENTH, Interval.MAJOR_SEVENTH] },
];

type IntervalSettingsProps = {
  intervalOptions: Interval[];
  enabledIntervals: Set<Interval>;
  onToggleInterval: (_interval: Interval) => void;
};

export const IntervalSettings = ({
  intervalOptions,
  enabledIntervals,
  onToggleInterval,
}: IntervalSettingsProps) => {
  const t = useTranslations();

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('practice.settings.intervals.title')}
      </h3>
      <div className="space-y-3">
        {INTERVAL_GROUPS_CONFIG.map(
          (group) =>
            group.intervals.some((interval) => intervalOptions.includes(interval)) && (
              <div key={group.labelKey}>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  {t(`practice.settings.intervals.groups.${group.labelKey}`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.intervals
                    .filter((interval) => intervalOptions.includes(interval))
                    .map((interval) => (
                      <Button
                        key={interval}
                        variant={enabledIntervals.has(interval) ? 'default' : 'outline'}
                        onClick={() => onToggleInterval(interval)}
                      >
                        {t(`intervals.${translationKeyForInterval(interval)}`)}
                      </Button>
                    ))}
                </div>
              </div>
            ),
        )}
      </div>
    </Card>
  );
};
