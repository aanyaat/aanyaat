import { useEffect } from 'react';
import { ArrowRight, Cake, Gift, Sparkles } from 'lucide-react';
import { heroImage, nav, person, wishes } from '@/content';
import { useCountdown } from '@/lib/useCountdown';
import { useConfetti } from '@/lib/useConfetti';
import { useRouter } from '@/lib/router';
import { CountdownDisplay } from '@/components/CountdownDisplay';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { memories } from '@/content';

export function HomePage() {
  const cd = useCountdown(person.birthday);
  const { canvasRef, fire } = useConfetti(false);
  const { navigate } = useRouter();

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
    { icon: Sparkles, label: 'Reasons I Adore you', path: '/wishes', hint: wishes.length + ' little letters' },
    { icon: Gift, label: 'Our memories', path: '/memories', hint: memories.length + ' moments' },
    { icon: Cake, label: 'A quiz about us', path: '/quiz', hint: 'how well do you know us?' },
  ];

  return (
    <>
      <ConfettiOverlay canvasRef={canvasRef} />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="A couple sharing a kiss at sunset."
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine-900/70 via-wine-800/55 to-wine-900/85" />
          <div className="absolute inset-0 bg-rose-radial opacity-70" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 py-32 text-center">
          <span className="chip mx-auto animate-fade-in bg-white/15 text-cream-100 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            A surprise, just for you
          </span>

          <h1 className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[1.05] text-white drop-shadow-lg sm:text-7xl">
            Happy Birthday,
            <br />
            <span className="text-gradient-gold">{person.name}</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl animate-fade-up font-body text-lg leading-relaxed text-cream-100/90 sm:text-xl"
            style={{ animationDelay: '0.15s' }}
          >
            {person.nickname}, a simple birthday message wasn’t enough. So I built
            this — every page, every word, for you. Wander around, take your time, and
            let me tell you all the things I don’t always say out loud.
          </p>

          <div
            className="mt-10 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            <CountdownDisplay cd={cd} />
          </div>

          <div
            className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.45s' }}
          >
            <button
              onClick={() => {
                fire(120);
                navigate('/about');
              }}
              className="btn-primary"
            >
              Start the tour
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => fire(80)}
              className="btn-ghost bg-white/15 text-white border-white/30 hover:bg-white/25 hover:border-white/50"
            >
              <Sparkles className="h-4 w-4" />
              Throw confetti
            </button>
          </div>

          {!cd.isToday && (
            <p className="mt-12 animate-fade-in font-body text-sm text-cream-200/70">
              Countdown to {person.birthDateDisplay} — your day is almost here.
            </p>
          )}
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
            <span className="h-2 w-1 animate-float rounded-full bg-white/70" />
          </div>
        </div>
      </section>

      {/* PREVIEW CARDS */}
      <section className="relative bg-cream-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="chip bg-rose-100 text-rose-600">What’s inside</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-wine-700 sm:text-5xl">
              A few rooms, made just for you
            </h2>
            <p className="mt-4 font-body text-lg text-wine-500/80">
              Take it slow. Each page is a different way of saying the same thing — that you matter to me.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {previews.map((p) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className="reveal group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-100/60 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft transition-transform duration-500 group-hover:scale-110">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-6 font-display text-2xl font-semibold text-wine-700">
                  {p.label}
                </h3>
                <p className="relative mt-2 font-body text-sm text-wine-500/70">
                  {p.hint}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 font-body text-sm font-medium text-rose-600 transition-all duration-300 group-hover:gap-3">
                  Open
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          {/* nav strip */}
          <div className="reveal mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-rose-200/50 pt-10">
            {nav
              .filter((n) => n.path !== '/')
              .map((n) => (
                <button
                  key={n.path}
                  onClick={() => navigate(n.path)}
                  className="nav-link"
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
