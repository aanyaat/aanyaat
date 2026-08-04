import { Heart, Quote } from 'lucide-react';
import { person, wishes } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';
import { CakeRitual, CakeSectionHeader } from '@/components/CakeRitual';

export function WishesPage() {
  const { navigate } = useRouter();
  return (
    <PageShell>
      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Reasons I adore you"
            title={
              <>
                Six things, off the top of my heart
              </>
            }
            subtitle={`Not a complete list — that would take a whole other website. But here's a start, ${person.nickname}.`}
          />
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {wishes.map((w, i) => (
            <article
              key={w.title}
              className="reveal group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-card sm:p-8"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-rose-100/50 blur-2xl transition-all duration-500 group-hover:bg-rose-200/60" />
              <div className="relative flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft">
                  <w.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-snug text-wine-700">
                    {w.title}
                  </h3>
                  <p className="mt-3 font-body text-base leading-relaxed text-wine-500/90">
                    {w.body}
                  </p>
                </div>
              </div>
              <Quote className="absolute bottom-5 right-5 h-8 w-8 text-rose-200/70" />
            </article>
          ))}
        </div>
      </section>

      {/* Cake ritual — make a wish */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <CakeSectionHeader />
          <CakeRitual />
        </div>
      </section>

      {/* closing letter */}
      <section className="px-6 pb-24">
        <div className="reveal mx-auto max-w-2xl rounded-3xl bg-wine-700 p-9 text-center text-cream-100 shadow-card sm:p-12">
          <Heart className="mx-auto h-8 w-8 animate-heart-beat text-rose-300" fill="currentColor" />
          <p className="mt-5 font-display text-2xl italic leading-relaxed text-white sm:text-3xl">
            "The more I know you, the more I want to know you."
          </p>
          <p className="mt-6 font-body text-cream-200/90">
            Happy birthday, {person.name}. Here's to more reels shared at midnight,
            more "kya kha rhe ho?" evenings, and every good night text still to come.
            You are special — more than this website can hold, but I tried.
          </p>
          <p className="mt-5 font-display text-sm italic text-gold-300">
            {person.fromYou}
          </p>
          <button
            onClick={() => navigate('/memories')}
            className="btn-primary mt-8 bg-rose-400 hover:bg-rose-300"
          >
            Next: our photos
          </button>
        </div>
      </section>
    </PageShell>
  );
}
