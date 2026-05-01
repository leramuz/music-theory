import { useTranslations } from 'next-intl';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PlayButtonProps = {
  onClick: () => void;
  ariaLabel: string;
};

export const PlayButton = ({ onClick, ariaLabel }: PlayButtonProps) => {
  const t = useTranslations();

  return (
    <Button variant="outline" size="icon" onClick={onClick} aria-label={t(ariaLabel)}>
      <Play className="size-4" />
    </Button>
  );
};
