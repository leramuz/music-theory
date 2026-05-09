import { useTranslations } from 'next-intl';
import { PlaybackMode } from '@/types/playback-mode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type PlaybackModeSettingsProps = {
  playbackMode: PlaybackMode;
  onPlaybackModeChange: (_mode: PlaybackMode) => void;
};

export const PlaybackModeSettings = ({
  playbackMode,
  onPlaybackModeChange,
}: PlaybackModeSettingsProps) => {
  const t = useTranslations('practice.settings.playbackModes');

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('title')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.values(PlaybackMode).map((m) => (
          <Button
            key={m}
            variant={playbackMode === m ? 'default' : 'outline'}
            onClick={() => onPlaybackModeChange(m)}
          >
            {t(`modes.${m}`)}
          </Button>
        ))}
      </div>
    </Card>
  );
};
