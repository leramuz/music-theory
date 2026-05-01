'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NavItem } from '@/components/nav/navigation';

interface PublicDesktopNavigationProps {
  navItems: NavItem[];
}

export function PublicDesktopNavigation({ navItems }: PublicDesktopNavigationProps) {
  const t = useTranslations();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center w-full space-x-8 px-6 py-2 h-14 bg-background">
      <Logo width={100} />
      <div className="flex items-center gap-12" ref={dropdownRef}>
        {navItems.map((item) =>
          item.children ? (
            <div key={item.href} className="relative">
              <button
                className="text-foreground hover:text-foreground/80 transition-colors duration-200 font-medium text-base"
                onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
              >
                {t(item.label)}
              </button>
              {openDropdown === item.href && (
                <div className="absolute top-full left-0 mt-2 min-w-max bg-background border rounded-md shadow-md py-1 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {t(child.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-foreground/80 transition-colors duration-200 font-medium text-base"
            >
              {t(item.label)}
            </Link>
          ),
        )}
      </div>
      <LanguageSwitcher />
    </nav>
  );
}
