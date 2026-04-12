'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';

interface PublicDesktopNavigationProps {
  navItems: { href: string; label: string }[];
}

export function PublicDesktopNavigation({ navItems }: PublicDesktopNavigationProps) {
  const t = useTranslations();

  return (
    <nav className="flex justify-between items-center w-full space-x-8 px-6 py-2 h-14">
      <Logo width={100} />
      <div className="flex items-center gap-12">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-foreground hover:text-foreground/80 transition-colors duration-200 font-medium text-base"
          >
            {t(item.label)}
          </Link>
        ))}
      </div>
      <LanguageSwitcher />
    </nav>
  );
}
