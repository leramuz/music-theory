'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { X, Menu } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { NavItem } from '@/components/nav/navigation';

interface PublicMobileNavigationProps {
  navItems: NavItem[];
}

export function PublicMobileNavigation({ navItems }: PublicMobileNavigationProps) {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex justify-between items-center w-full px-4 py-2 h-14 bg-background">
      <Logo width={80} />
      <div className="flex items-center gap-4">
        <button
          className="text-foreground hover:bg-foreground/10 rounded-xl transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium text-base tracking-wide py-2"
                    onClick={handleNavClick}
                  >
                    {t(item.label)}
                  </Link>
                  {item.children && (
                    <div className="mt-2 ml-4 flex flex-col space-y-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="text-foreground/60 hover:text-foreground transition-colors duration-200 text-sm tracking-wide py-1"
                          onClick={handleNavClick}
                        >
                          {t(child.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="self-end">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
