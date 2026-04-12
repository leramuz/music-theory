import { Navigation } from '@/components/nav/navigation';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border/10 w-screen">
      <Navigation />
    </header>
  );
};
