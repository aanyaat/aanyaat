import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Gift, HelpCircle, MapPin, Sparkles, Music2, Heart, BookOpen } from 'lucide-react';
import { nav, person, wishes, memories } from '@/content';
import { useCountdown } from '@/lib/useCountdown';
import { useConfetti } from '@/lib/useConfetti';
import { useRouter } from '@/lib/router';
import { useReveal } from '@/lib/useReveal';
import { CountdownDisplay } from '@/components/CountdownDisplay';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { ThreeDPhotoExperience } from '@/components/ThreeDPhotoExperience';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { StorybookModal } from '@/components/StorybookModal';

export function HomePage() {
  const cd = useCountdown(person.birthday);
  const { canvasRef, fire } = useConfetti(false);
  const { navigate } = useRouter();
  const previewRef = useReveal<HTMLElement>();
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);

  // When the birthday arrives, celebrate automatically.
  useEffect(() => {
    if (cd.isToday) {
      const t1 = setTimeout(() => fire(220), 700);
      const t2 = setTimeout(() => fire(140), 2600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [cd.isToday, fire]);

  const previews = [
    { icon: Sparkles, label: 'About this site', path: '/about', hint: 'Why I made this for you' },
    { icon: Heart, label: 'Reasons I Adore you', path: '/wishes', hint: wishes.length + ' letters + a cake' },
    { icon: Gift, label: 'Our memories', path: '/memories', hint: memories.length + ' moments' },
    { icon: MapPin, label: 'Our timeline', path: '/timeline', hint: 'our story + satellite zoom' },
    { icon: HelpCircle, label: 'A quiz about us', path: '/quiz', hint: 'how well do you know us?' },
    { icon: Music2, label: 'Music & Gifts', path: '/gifts', hint: 'Playlist, coupons & keepsake' },
  ];

  return (
    <>
      <ConfettiOverlay canvasRef={canvasRef} />

      {/* ─── PWA INSTALLATION PROMPT ─── */}
      <PWAInstallPrompt />

      {/* ─── STORYBOOK MODAL KEEPSAKE ─── */}
      <StorybookModal
        isOpen={isStorybookOpen}
        onClose={() => setIsStorybookOpen(false)}
      />

      {/* ─── 3D PHOTO EXPERIENCE BACKGROUND LAYER ─── */}
      <ThreeDPhotoExperience />

      {/* ─── HERO WITH 3D ORBITING PHOTOS ─── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Soft atmospheric gradient to give depth while keeping 3D photos visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-wine-950/40 via-transparent to-wine-950/60 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="chip animate-fade-in bg-white/50 text-wine-900 backdrop-blur-2xl border border-white/70 shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-spin" style={{ animationDuration: '6s' }} />
              A surprise for the birthday queen
            </span>
          </div>

          <h1 className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[1.08] text-wine-950 drop-shadow-sm sm:text-7xl tracking-tight">
            Happy Birthday,
            <br />
            <span className="text-gradient-rose text-glow-rose">{person.name}</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl animate-fade-up font-body text-lg leading-relaxed text-wine-900/90 sm:text-xl font-medium"
            style={{ animationDelay: '0.15s' }}
          >
            {person.nickname}, a simple birthday message wasn't enough. So I built
            this — every page, every word, for you. Wander around, take your time, and
            let me tell you all the things I don't always say out loud.
          </p>

          <div
            className="mt-8 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <CountdownDisplay cd={cd} />
          </div>

          <div
            className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.45s' }}
          >
            <button
              onClick={() => {
                fire(120);
                navigate('/about');
              }}
              className="btn-primary shadow-soft cursor-pointer text-sm font-semibold tracking-wide"
            >
              Start the tour
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setIsStorybookOpen(true);
                fire(60);
              }}
              className="btn-ghost bg-white/75 text-wine-900 border-white/80 hover:bg-white backdrop-blur-xl shadow-soft cursor-pointer flex items-center gap-2 text-sm font-semibold"
            >
              <BookOpen className="h-4 w-4 text-rose-500" />
              Our Storybook Keepsake
            </button>
            <button
              onClick={() => fire(80)}
              className="btn-ghost bg-white/60 text-wine-900 border-white/70 hover:bg-white/90 backdrop-blur-xl shadow-soft cursor-pointer text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4 text-gold-600" />
              Throw confetti
            </button>
          </div>

          {!cd.isToday && (
            <div className="mt-8 animate-fade-in">
              <span className="inline-block rounded-full bg-white/75 backdrop-blur-xl px-5 py-2 font-body text-xs text-wine-900 font-semibold border border-white/80 shadow-soft">
                Countdown to {person.birthDateDisplay} — your day is almost here! ✨
              </span>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-wine-400/40 p-1 backdrop-blur-sm bg-white/20">
            <span className="h-2.5 w-1 animate-float rounded-full bg-rose-500" />
          </div>
        </div>
      </section>

      {/* ─── PREVIEW CARDS (FROSTED GLASS ON TOP OF 3D PHOTOS) ─── */}
      <section ref={previewRef} className="relative pb-16 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal mx-auto max-w-2xl pt-16 text-center">
            <span className="chip bg-rose-100/90 text-rose-700 border border-white/60 shadow-soft">What's inside</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-wine-800 sm:text-5xl tracking-tight">
              A few rooms, made just for you
            </h2>
            <p className="mt-4 font-body text-lg text-wine-600/90 leading-relaxed">
              Take it slow. Each page is a different way of saying the same thing — that you matter to me.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {previews.map((p) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className="reveal group relative overflow-hidden rounded-3xl bg-white/55 backdrop-blur-xl p-7 sm:p-8 text-left shadow-card border border-white/80 transition-all duration-500 hover:-translate-y-2 hover:bg-white/80 hover:shadow-glass-lift cursor-pointer"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-200/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60 pointer-events-none" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft transition-transform duration-500 group-hover:scale-110">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-6 font-display text-2xl font-semibold text-wine-800">
                  {p.label}
                </h3>
                <p className="relative mt-2 font-body text-sm text-wine-600/85 leading-relaxed">
                  {p.hint}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-rose-600 transition-all duration-300 group-hover:gap-3">
                  Open
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          {/* nav strip */}
          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-rose-200/50 pt-8 pb-8">
            {nav
              .filter((n) => n.path !== '/')
              .map((n) => (
                <button
                  key={n.path}
                  onClick={() => navigate(n.path)}
                  className="nav-link font-medium cursor-pointer"
                >
                  {n.label}
                </button>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
