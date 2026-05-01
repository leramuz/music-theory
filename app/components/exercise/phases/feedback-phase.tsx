import { useTranslations } from 'next-intl';
import { Check, ChevronRight, Settings2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translationKeyForInterval } from '@/helpers/interval';
import { Interval, IntervalInstance } from '@/types/interval';
import { PlaybackMode } from '@/types/playback-mode';
import { AnswerMode } from '@/types/answer-mode';
import { RangeOption } from '@/types/range-option';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectComparison } from '@/components/exercise/feedbacks/select-comparison';
import { SheetComparison } from '@/components/exercise/feedbacks/sheet-comparison';
import { KeyboardComparison } from '@/components/exercise/feedbacks/keyboard-comparison';

type FeedbackPhaseProps = {
  answerMode: AnswerMode;
  question: IntervalInstance;
  isCorrect: boolean;
  correctInterval: Interval;
  answeredInterval: Interval | null;
  answeredIntervalInstance: IntervalInstance | null;
  playbackMode: PlaybackMode;
  range: RangeOption;
  onNext: () => void;
  onBackToSettings: () => void;
};

export const FeedbackPhase = ({
  question,
  isCorrect,
  correctInterval,
  answeredInterval,
  answeredIntervalInstance,
  playbackMode,
  answerMode,
  range,
  onNext,
  onBackToSettings,
}: FeedbackPhaseProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      <Card
        className={cn(
          'p-5 flex items-center gap-4',
          isCorrect
            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
            : 'border-red-400 bg-red-50 dark:bg-red-950/30',
        )}
      >
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            isCorrect ? 'bg-green-500' : 'bg-red-500',
          )}
        >
          {isCorrect ? (
            <Check className="size-5 text-white" />
          ) : (
            <X className="size-5 text-white" />
          )}
        </div>
        <div>
          <p
            className={cn(
              'text-lg font-bold',
              isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400',
            )}
          >
            {isCorrect
              ? t('practice.intervals.feedbackPhase.correct')
              : t('practice.intervals.feedbackPhase.incorrect')}
          </p>
          {isCorrect && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {t.rich('practice.intervals.feedbackPhase.thatsA', {
                interval: t(`intervals.${translationKeyForInterval(correctInterval)}`),
                strong: (chunks) => <span className="font-semibold">{chunks}</span>,
              })}
            </p>
          )}
          {!isCorrect && (
            <>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t.rich('practice.intervals.feedbackPhase.youAnswered', {
                  answered: answeredInterval
                    ? t(`intervals.${translationKeyForInterval(answeredInterval)}`)
                    : t('practice.intervals.feedbackPhase.unknownInterval'),
                  correct: t(`intervals.${translationKeyForInterval(correctInterval)}`),
                  strong: (chunks) => <span className="font-semibold">{chunks}</span>,
                })}
              </p>
            </>
          )}
        </div>
      </Card>

      {!isCorrect && (
        <ComparisonSection
          answerMode={answerMode}
          question={question}
          correctInterval={correctInterval}
          answeredInterval={answeredInterval}
          answeredIntervalInstance={answeredIntervalInstance}
          playbackMode={playbackMode}
          range={range}
        />
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBackToSettings} className="gap-2">
          <Settings2 className="size-4" />
          {t('practice.intervals.feedbackPhase.settings')}
        </Button>
        <Button className="flex-1 gap-2" onClick={onNext}>
          <ChevronRight className="size-4" />
          {t('practice.intervals.feedbackPhase.nextQuestion')}
        </Button>
      </div>
    </div>
  );
};

type ComparisonSectionProps = {
  answerMode: AnswerMode;
  question: IntervalInstance;
  correctInterval: Interval;
  answeredInterval: Interval | null;
  answeredIntervalInstance: IntervalInstance | null;
  playbackMode: PlaybackMode;
  range: RangeOption;
};

const ComparisonSection = ({
  answerMode,
  question,
  correctInterval,
  answeredInterval,
  answeredIntervalInstance,
  playbackMode,
  range,
}: ComparisonSectionProps) => {
  if (answerMode === AnswerMode.SELECT)
    return answeredInterval ? (
      <SelectComparison
        question={question}
        correctInterval={correctInterval}
        answeredInterval={answeredInterval}
        playbackMode={playbackMode}
      />
    ) : null;

  if (answerMode === AnswerMode.KEYBOARD) {
    return (
      <KeyboardComparison
        question={question}
        correctInterval={correctInterval}
        answeredInterval={answeredInterval}
        answeredIntervalInstance={answeredIntervalInstance}
        playbackMode={playbackMode}
        range={range}
      />
    );
  }

  return (
    <SheetComparison
      question={question}
      correctInterval={correctInterval}
      answeredInterval={answeredInterval}
      answeredIntervalInstance={answeredIntervalInstance}
      playbackMode={playbackMode}
    />
  );
};
