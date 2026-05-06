import { useTranslations } from 'next-intl';
import { Scale } from '@/types/scale';
import { Key } from '@/types/key';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { keyTonics } from '@/helpers/key';

type KeySettingsProps = {
  musicalKey: Key | null;
  onKeyChange: (_key: Key | null) => void;
};

export const KeySettings = ({ musicalKey, onKeyChange }: KeySettingsProps) => {
  const t = useTranslations('practice.settings.key');

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('title')}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onKeyChange(null)}
          variant={musicalKey === null ? 'default' : 'outline'}
        >
          {t('none')}
        </Button>
        {Object.values(Scale).map((scale) => (
          <Button
            key={scale}
            onClick={() => onKeyChange({ scale, tonic: keyTonics(scale)[0] } as Key)}
            variant={musicalKey?.scale === scale ? 'default' : 'outline'}
          >
            {t(`scales.${scale}`)}
          </Button>
        ))}
      </div>
      {musicalKey && (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t('rootNote.title')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {keyTonics(musicalKey.scale).map((tonic) => (
              <Button
                key={tonic}
                onClick={() => onKeyChange({ scale: musicalKey.scale, tonic } as Key)}
                variant={musicalKey.tonic === tonic ? 'default' : 'outline'}
              >
                {t(`rootNote.options.${tonic}`)}
              </Button>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
