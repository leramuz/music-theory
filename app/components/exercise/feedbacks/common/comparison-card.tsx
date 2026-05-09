import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { FeedbackStatus } from '@/types/feedback-status';
import { Card } from '@/components/ui/card';
import { PlayButton } from '@/components/common/play-button';

type ComparisonCardProps = {
  feedbackStatus: FeedbackStatus;
  labelKey: string;
  valueKey: string;
  ariaLabel: string;
  onPlay: () => void;
  children?: ReactNode;
};

export const ComparisonCard = ({
  feedbackStatus,
  labelKey,
  valueKey,
  onPlay,
  ariaLabel,
  children,
}: ComparisonCardProps) => {
  const t = useTranslations();

  return (
    <Card
      className={`p-4 space-y-3 ${feedbackStatus === FeedbackStatus.CORRECT ? 'border-green-300' : feedbackStatus === FeedbackStatus.INCORRECT ? 'border-red-300' : 'border-amber-300'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t(labelKey)}
          </p>
          <p className="mt-0.5 font-semibold">{t(valueKey)}</p>
        </div>
        <PlayButton onClick={onPlay} ariaLabel={ariaLabel} />
      </div>
      {children && <div>{children}</div>}
    </Card>
  );
};
