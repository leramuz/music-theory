import { useTranslations } from 'next-intl';
import { translationKeyForChord } from '@/helpers/chord';
import { Chord, ChordQuality } from '@/types/chord';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TRIAD_QUALITIES = [
  ChordQuality.MAJOR_TRIAD,
  ChordQuality.MINOR_TRIAD,
  ChordQuality.DIMINISHED_TRIAD,
  ChordQuality.AUGMENTED_TRIAD,
];

const SEVENTH_QUALITIES = [ChordQuality.DOMINANT_SEVENTH, ChordQuality.DIMINISHED_SEVENTH];

type ChordSettingsProps = {
  chordOptions: Chord[];
  enabledChords: Set<Chord>;
  onToggleChord: (_chord: Chord) => void;
};

export const ChordSettings = ({
  chordOptions,
  enabledChords,
  onToggleChord,
}: ChordSettingsProps) => {
  const t = useTranslations();

  const chordOptionSet = new Set(chordOptions);

  const renderGroup = (qualities: ChordQuality[], groupKey: 'triads' | 'seventhChords') => {
    const chordsInGroup = Object.values(Chord).filter(
      (c) => qualities.some((q) => c.startsWith(q)) && chordOptionSet.has(c),
    );

    if (chordsInGroup.length === 0) return null;

    return (
      <div key={groupKey}>
        <p className="mb-1.5 text-xs text-muted-foreground">
          {t(`practice.chords.settings.chords.groups.${groupKey}`)}
        </p>
        <div className="flex flex-wrap gap-2">
          {chordsInGroup.map((chord) => (
            <Button
              key={chord}
              variant={enabledChords.has(chord) ? 'default' : 'outline'}
              onClick={() => onToggleChord(chord)}
              className="whitespace-normal h-auto p-1.5 text-xs"
            >
              {t(`chords.${translationKeyForChord(chord)}`)}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t('practice.chords.settings.chords.title')}
      </h3>
      <div className="space-y-3">
        {renderGroup(TRIAD_QUALITIES, 'triads')}
        {renderGroup(SEVENTH_QUALITIES, 'seventhChords')}
      </div>
    </Card>
  );
};
