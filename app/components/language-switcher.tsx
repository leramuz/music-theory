'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '@/i18n/config';
import { Link, usePathname } from '@/i18n/navigation';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = Object.values(LANGUAGES).find((lang) => lang === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1 p-2 rounded-md bg-foreground/10 backdrop-blur-sm border border-foreground/20 hover:bg-foreground/20 transition-all duration-200"
      >
        <Globe className="h-3 w-3" />
        <span className="text-xs font-medium text-foreground/90 leading-none">
          {currentLanguage ? t(`language.${currentLanguage}`) : null}
        </span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-full mt-1 w-32 rounded-md bg-foreground/10 backdrop-blur-sm border border-foreground/20 shadow-lg z-20">
            {Object.values(LANGUAGES).map((language) => (
              <Link
                key={language}
                locale={language}
                href={pathname} // ← stay on same page
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium transition-all duration-200 hover:bg-foreground/20 ${
                  locale === language
                    ? 'text-foreground bg-foreground/15'
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                <span>{t(`language.${language}`)}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
