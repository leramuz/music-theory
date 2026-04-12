import { PublicDesktopNavigation } from '@/components/nav/desktop';
import { PublicMobileNavigation } from '@/components/nav/mobile';

const navItems = [
  { href: '/', label: 'nav.home' },
  { href: '/theory', label: 'nav.theory' },
  { href: '/practice', label: 'nav.practice' },
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
