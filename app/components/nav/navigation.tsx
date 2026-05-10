import { PublicDesktopNavigation } from '@/components/nav/desktop';
import { PublicMobileNavigation } from '@/components/nav/mobile';

export interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/', label: 'nav.home' },
  { href: '/theory', label: 'nav.theory' },
  {
    href: '/practice',
    label: 'nav.practice',
    children: [
      { href: '/practice/intervals', label: 'nav.intervals' },
      { href: '/practice/chords', label: 'nav.chords' },
    ],
  },
];

export const Navigation = () => {
  return (
    <div className="sticky top-0 z-50">
      <div className="hidden lg:block">
        <PublicDesktopNavigation navItems={navItems} />
      </div>
      <div className="lg:hidden">
        <PublicMobileNavigation navItems={navItems} />
      </div>
    </div>
  );
};
