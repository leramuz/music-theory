import { useTranslations } from 'next-intl';
import { Play, Settings2 } from 'lucide-react';
import { Interval, IntervalInstance } from '@/types/interval';
import { PianoKeyId } from '@/types/piano-key';
import { Accidental } from '@/types/accidental';
import { MeasureConfig, StaveClickPayload } from '@/types/music-sheet';
import { AnswerMode } from '@/types/answer-mode';
import { RangeOption } from '@/types/range-option';
import { Key } from '@/types/key';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyHighlightColor } from '@/components/interactive-piano';
import { SelectAnswer } from '@/components/exercise/answers/select-answer';
import { SheetAnswer } from '@/components/exercise/answers/sheet-answer';
import { KeyboardAnswer } from '@/components/exercise/answers/keyboard-answer';

type QuestionPhaseProps = {
  question: IntervalInstance;
  answerMode: AnswerMode;
  onPlay: () => void;
  selectAnswer: Interval | null;
  onSelectAnswer: (_i: Interval) => void;
  enabledIntervals: Set<Interval>;
  range: RangeOption;
  musicalKey: Key | null;
  highlightedKeys: { id: PianoKeyId; color: KeyHighlightColor }[];
  bottomKeyId: PianoKeyId | null;
  onKeyboardAnswer: (_id: PianoKeyId) => void;
  keyboardAnswerKeyId: PianoKeyId | null;
  sheetMeasures: MeasureConfig[];
  sheetAccidental: Accidental | null;
  onSheetAccidentalChange: (_a: Accidental | null) => void;
  onSheetAnswer: (_payload: StaveClickPayload) => void;
  measureWidth: number;
  canSubmit: boolean;
  onSubmit: () => void;
  onBackToSettings: () => void;
  enabledAccidentals: Set<Accidental> | null;
};

export const QuestionPhase = ({
  question,
  answerMode,
  onPlay,
  selectAnswer,
  onSelectAnswer,
  enabledIntervals,
  range,
  musicalKey,
  highlightedKeys,
  bottomKeyId,
  onKeyboardAnswer,
  keyboardAnswerKeyId,
  sheetMeasures,
  sheetAccidental,
  onSheetAccidentalChange,
  onSheetAnswer,
  measureWidth,
  canSubmit,
  onSubmit,
  onBackToSettings,
  enabledAccidentals,
}: QuestionPhaseProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{t('practice.intervals.question.title')}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t('practice.intervals.question.description')}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={onPlay} className="gap-2">
              <Play className="size-4" />
              {t('practice.intervals.question.play')}
            </Button>
          </div>
        </div>
      </Card>

      {answerMode === AnswerMode.SELECT && (
        <SelectAnswer
          enabledIntervals={enabledIntervals}
          selected={selectAnswer}
          onSelect={onSelectAnswer}
        />
      )}

      {answerMode === AnswerMode.SHEET && (
        <SheetAnswer
          measures={sheetMeasures}
          accidental={sheetAccidental}
          enabledAccidentals={enabledAccidentals}
          bottomSpelling={question.bottom}
          enabledIntervals={enabledIntervals}
          range={range}
          musicalKey={musicalKey}
          measureWidth={measureWidth}
          onAccidentalChange={onSheetAccidentalChange}
          onNotePlace={onSheetAnswer}
        />
      )}

      {answerMode === AnswerMode.KEYBOARD && (
        <KeyboardAnswer
          range={range}
          highlightedKeys={highlightedKeys}
          selectedKeyId={keyboardAnswerKeyId}
          onKeySelect={onKeyboardAnswer}
          bottomKeyId={bottomKeyId!}
          enabledIntervals={enabledIntervals}
        />
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBackToSettings} className="gap-2">
          <Settings2 className="size-4" />
          {t('practice.intervals.question.settings')}
        </Button>
        <Button className="flex-1" disabled={!canSubmit} onClick={onSubmit}>
          {t('practice.intervals.question.submitAnswer')}
        </Button>
      </div>
    </div>
  );
};
