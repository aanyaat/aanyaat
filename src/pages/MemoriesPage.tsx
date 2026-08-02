import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';
import { memories } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';

export function MemoriesPage() {
  const { navigate } = useRouter();
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % memories.length)),
    []
  );
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + memories.length) % memories.length)),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, next, prev]);

  return (
    <PageShell>
      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Memories"
            title={
              <>
                Us, in <span className="text-gradient-rose">moments</span>
              </>
            }
            subtitle="A few moments I keep going back to. Tap any photo to see it up close."
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {memories.map((m, i) => (
            <button
              key={m.src}
              onClick={() => setActive(i)}
              className={[
                'reveal group relative overflow-hidden rounded-3xl bg-wine-700 shadow-soft transition-all duration-500 hover:shadow-card',
                m.span ? 'col-span-2 lg:row-span-2' : '',
              ].join(' ')}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                className={[
                  'w-full object-cover transition-transform duration-700 group-hover:scale-105',
                  m.span ? 'aspect-[16/10] lg:aspect-square' : 'aspect-square',
                ].join(' ')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-900/85 via-wine-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-100 backdrop-blur-sm">
                  <Calendar className="h-3 w-3" />
                  {m.date}
                </span>
                <p className="mt-2 font-display text-base font-medium text-white drop-shadow sm:text-lg">
                  {m.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="reveal mx-auto mt-14 max-w-xl text-center">
          <p className="font-body text-wine-500/80">
            These are just the ones we stopped to share. My favorite ones don't have
            reels — they're just you, being you, when you didn't know I was paying
            attention.
          </p>
          <button onClick={() => navigate('/timeline')} className="btn-primary mt-8">
            See how we got here
          </button>
        </div>
      </section>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-wine-900/90 p-4 backdrop-blur-md animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:left-6"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:right-6"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure
            className="max-h-[85vh] max-w-4xl animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={memories[active].src}
              alt={memories[active].alt}
              className="mx-auto max-h-[72vh] rounded-2xl object-contain shadow-card"
            />
            <figcaption className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cream-200">
                <Calendar className="h-3 w-3" />
                {memories[active].date}
              </span>
              <p className="mt-2 font-display text-lg text-white">
                {memories[active].caption}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </PageShell>
  );
}
