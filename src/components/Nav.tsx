import { useEffect, useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { nav, person } from '@/content';
import { useRouter } from '@/lib/router';

export function Nav() {
  const { path, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-cream-50/85 backdrop-blur-xl shadow-soft'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <button
          onClick={() => go('/')}
          className="group flex items-center gap-2.5"
          aria-label="Go home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-white shadow-soft transition-transform duration-300 group-hover:scale-110">
            <Heart className="h-4.5 w-4.5 animate-heart-beat" fill="currentColor" />
          </span>
          <span className="font-display text-lg font-semibold text-wine-700">
            for {person.nickname}
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <li key={item.path}>
              <button
                className="nav-link"
                data-active={path === item.path}
                onClick={() => go(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-wine-700 shadow-soft lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={[
          'overflow-hidden transition-all duration-500 lg:hidden',
          open ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <ul className="mx-5 mb-4 grid gap-1 rounded-3xl bg-white/95 p-3 shadow-card backdrop-blur-xl">
          {nav.map((item) => (
            <li key={item.path}>
              <button
                className={[
                  'flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left font-body text-base transition-colors',
                  path === item.path
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-wine-600 hover:bg-cream-100',
                ].join(' ')}
                onClick={() => go(item.path)}
              >
                <Heart
                  className={[
                    'h-4 w-4',
                    path === item.path ? 'text-rose-500' : 'text-rose-300',
                  ].join(' ')}
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
