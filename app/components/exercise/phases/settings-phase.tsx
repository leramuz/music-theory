import { useTranslations } from 'next-intl';
import { Interval } from '@/types/interval';
import { PlaybackMode } from '@/types/playback-mode';
import { AnswerMode } from '@/types/answer-mode';
import { RangeOption } from '@/types/range-option';
import { Key } from '@/types/key';
import { AnswerModeSettings } from '@/components/exercise/settings/answer-mode-settings';
import { IntervalSettings } from '@/components/exercise/settings/interval-settings';
import { PianoRangeSettings } from '@/components/exercise/settings/piano-range-settings';
import { PlaybackModeSettings } from '@/components/exercise/settings/playback-mode-settings';
import { KeySettings } from '@/components/exercise/settings/key-settings';
import { Button } from '@/components/ui/button';

type SettingsPhaseProps = {
  range: RangeOption;
  onRangeChange: (_r: RangeOption) => void;
  intervalOptions: Interval[];
  enabledIntervals: Set<Interval>;
  onToggleInterval: (_i: Interval) => void;
  musicalKey: Key | null;
  onKeyChange: (_k: Key | null) => void;
  answerMode: AnswerMode;
  onAnswerModeChange: (_m: AnswerMode) => void;
  playbackMode: PlaybackMode;
  onPlaybackModeChange: (_m: PlaybackMode) => void;
  onStart: () => void;
};

export const SettingsPhase = ({
  range,
  onRangeChange,
  intervalOptions,
  enabledIntervals,
  onToggleInterval,
  musicalKey,
  onKeyChange,
  answerMode,
  onAnswerModeChange,
  playbackMode,
  onPlaybackModeChange,
  onStart,
}: SettingsPhaseProps) => {
  const t = useTranslations('practice');

  return (
    <div className="space-y-5">
      <PianoRangeSettings range={range} onRangeChange={onRangeChange} />
      <KeySettings musicalKey={musicalKey} onKeyChange={onKeyChange} />
      <IntervalSettings
        intervalOptions={intervalOptions}
        enabledIntervals={enabledIntervals}
        onToggleInterval={onToggleInterval}
      />
      <AnswerModeSettings answerMode={answerMode} onAnswerModeChange={onAnswerModeChange} />
      <PlaybackModeSettings
        playbackMode={playbackMode}
        onPlaybackModeChange={onPlaybackModeChange}
      />

      <Button size="lg" onClick={onStart} className="w-full gap-2">
        {t('startTraining')}
      </Button>
    </div>
  );
};
