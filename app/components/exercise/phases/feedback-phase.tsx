import { useTranslations } from 'next-intl';
import { Check, ChevronRight, Settings2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translationKeyForInterval } from '@/helpers/interval';
import {
  incorrectTitleTranslationKey,
  randomCorrectTranslationKey,
  FeedbackNote,
} from '@/helpers/feedback';
import { Interval, IntervalInstance } from '@/types/interval';
import { FeedbackStatus } from '@/types/feedback-status';
import { PlaybackMode } from '@/types/playback-mode';
import { AnswerMode } from '@/types/answer-mode';
import { RangeOption } from '@/types/range-option';
import { Key } from '@/types/key';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectComparison } from '@/components/exercise/feedbacks/select-comparison';
import { SheetComparison } from '@/components/exercise/feedbacks/sheet-comparison';
import { KeyboardComparison } from '@/components/exercise/feedbacks/keyboard-comparison';

type FeedbackPhaseProps = {
  answerMode: AnswerMode;
  question: IntervalInstance;
  musicalKey: Key | null;
  feedbackStatus: FeedbackStatus;
  feedbackNote: FeedbackNote | null;
  correctInterval: Interval;
  answeredInterval: Interval | null;
  answeredIntervalInstance: IntervalInstance | null;
  playbackMode: PlaybackMode;
  range: RangeOption;
  measureWidth: number;
  answeredHadExplicitAccidental: boolean;
  onNext: () => void;
  onBackToSettings: () => void;
};

export const FeedbackPhase = ({
  question,
  musicalKey,
  feedbackStatus,
  feedbackNote,
  correctInterval,
  answeredInterval,
  answeredIntervalInstance,
  playbackMode,
  answerMode,
  range,
  measureWidth,
  answeredHadExplicitAccidental,
  onNext,
  onBackToSettings,
}: FeedbackPhaseProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      <Card
        className={cn(
          'p-5 flex items-center gap-4',
          feedbackStatus === FeedbackStatus.CORRECT
            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
            : feedbackStatus === FeedbackStatus.PARTIALLY_CORRECT
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
              : 'border-red-400 bg-red-50 dark:bg-red-950/30',
        )}
      >
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            feedbackStatus === FeedbackStatus.CORRECT
              ? 'bg-green-500'
              : feedbackStatus === FeedbackStatus.PARTIALLY_CORRECT
                ? 'bg-amber-500'
                : 'bg-red-500',
          )}
        >
          {feedbackStatus === FeedbackStatus.CORRECT ? (
            <Check className="size-5 text-white" />
          ) : feedbackStatus === FeedbackStatus.PARTIALLY_CORRECT ? (
            <Check className="size-5 text-white" />
          ) : (
            <X className="size-5 text-white" />
          )}
        </div>
        <div>
          <p
            className={cn(
              'text-lg font-bold',
              feedbackStatus === FeedbackStatus.CORRECT
                ? 'text-green-700 dark:text-green-400'
                : feedbackStatus === FeedbackStatus.PARTIALLY_CORRECT
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-red-700 dark:text-red-400',
            )}
          >
            {feedbackStatus === FeedbackStatus.CORRECT
              ? t(randomCorrectTranslationKey())
              : feedbackStatus === FeedbackStatus.PARTIALLY_CORRECT
                ? t('practice.intervals.feedbackPhase.partiallyCorrect')
                : t(incorrectTitleTranslationKey(correctInterval, answeredInterval))}
          </p>
          {feedbackStatus === FeedbackStatus.CORRECT && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {t.rich('practice.intervals.feedbackPhase.thatsA', {
                interval: t(`intervals.${translationKeyForInterval(correctInterval)}`),
                strong: (chunks) => <span className="font-semibold">{chunks}</span>,
              })}
            </p>
          )}
          {feedbackStatus !== FeedbackStatus.CORRECT && (
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

          {feedbackNote && (
            <div className="mt-2 italic text-muted-foreground">
              <span className="text-sm mt-0.5 font-semibold">
                {t(`practice.intervals.feedbackPhase.note`)}
              </span>
              {': '}
              <span className="text-sm mt-0.5">
                {feedbackNote.params
                  ? t(feedbackNote.translationKey, feedbackNote.params)
                  : t(feedbackNote.translationKey)}
              </span>
            </div>
          )}
        </div>
      </Card>

      {feedbackStatus !== FeedbackStatus.CORRECT && (
        <ComparisonSection
          answerMode={answerMode}
          question={question}
          musicalKey={musicalKey}
          correctInterval={correctInterval}
          answeredInterval={answeredInterval}
          answeredIntervalInstance={answeredIntervalInstance}
          playbackMode={playbackMode}
          range={range}
          measureWidth={measureWidth}
          feedbackStatus={feedbackStatus}
          answeredHadExplicitAccidental={answeredHadExplicitAccidental}
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
  measureWidth: number;
  playbackMode: PlaybackMode;
  range: RangeOption;
  musicalKey: Key | null;
  feedbackStatus: FeedbackStatus;
  answeredHadExplicitAccidental: boolean;
};

const ComparisonSection = ({
  answerMode,
  question,
  correctInterval,
  answeredInterval,
  answeredIntervalInstance,
  playbackMode,
  range,
  musicalKey,
  measureWidth,
  feedbackStatus,
  answeredHadExplicitAccidental,
}: ComparisonSectionProps) => {
  if (answerMode === AnswerMode.SELECT)
    return answeredInterval ? (
      <SelectComparison
        question={question}
        correctInterval={correctInterval}
        answeredInterval={answeredInterval}
        playbackMode={playbackMode}
        feedbackStatus={feedbackStatus}
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
        feedbackStatus={feedbackStatus}
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
      musicalKey={musicalKey}
      measureWidth={measureWidth}
      feedbackStatus={feedbackStatus}
      answeredHadExplicitAccidental={answeredHadExplicitAccidental}
    />
  );
};
