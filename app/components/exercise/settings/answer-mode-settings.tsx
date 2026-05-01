import { useTranslations } from 'next-intl';
import { FileMusic, Music, Piano } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnswerMode } from '@/types/answer-mode';
import { Card } from '@/components/ui/card';

type AnswerModeSettingsProps = {
  answerMode: AnswerMode;
  onAnswerModeChange: (_mode: AnswerMode) => void;
};

export const AnswerModeSettings = ({ answerMode, onAnswerModeChange }: AnswerModeSettingsProps) => {
  const t = useTranslations('practice.settings.answerModes');

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('title')}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            { mode: AnswerMode.SELECT, icon: Music },
            { mode: AnswerMode.SHEET, icon: FileMusic },
            { mode: AnswerMode.KEYBOARD, icon: Piano },
          ] as const
        ).map(({ mode, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => onAnswerModeChange(mode)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all',
              answerMode === mode
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-muted',
            )}
          >
            <Icon className="size-5" />
            <span className="text-sm font-semibold">{t(`modes.${mode}.label`)}</span>
            <span className="text-xs text-muted-foreground">{t(`modes.${mode}.desc`)}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};
