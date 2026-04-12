import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="border-t border/10">
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground text-sm text-center">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};
