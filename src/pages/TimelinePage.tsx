import { Satellite, Plane } from 'lucide-react';
import { timeline, person } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';
import { InteractiveMap } from '@/components/InteractiveMap';

export function TimelinePage() {
  const { navigate } = useRouter();
  return (
    <PageShell>
      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Our timeline"
            title={
              <>
                How we got <span className="text-gradient-rose">here</span>
              </>
            }
            subtitle={`A few moments I never want to forget — from our first conversations to this website, ${person.nickname}.`}
          />
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto max-w-3xl">
          <ol className="relative">
            {/* center line */}
            <div className="absolute left-4 top-2 h-full w-0.5 origin-top animate-draw-line bg-gradient-to-b from-rose-400 via-rose-300 to-gold-300 md:left-1/2 md:-translate-x-1/2" />

            {timeline.map((t, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={t.date}
                  className="reveal relative mb-10 pl-14 md:grid md:grid-cols-2 md:gap-10 md:pl-0"
                >
                  {/* node */}
                  <span className="absolute left-4 top-1.5 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-white shadow-soft ring-4 ring-cream-100 md:left-1/2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-white">
                      <t.icon className="h-4 w-4" />
                    </span>
                  </span>

                  {/* card */}
                  <div
                    className={[
                      'md:col-span-1',
                      left ? 'md:col-start-1 md:text-right md:pr-10' : 'md:col-start-2 md:pl-10',
                    ].join(' ')}
                  >
                    <div className="rounded-3xl bg-white p-6 shadow-soft transition-all duration-500 hover:shadow-card">
                      <span className="chip bg-gold-100 text-gold-700">
                        {t.date}
                      </span>
                      <h3 className="mt-3 font-display text-xl font-semibold text-wine-700">
                        {t.title}
                      </h3>
                      <p className="mt-2 font-body text-base leading-relaxed text-wine-500/90">
                        {t.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Interactive satellite map — where we met + where you are now */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="reveal mx-auto mb-10 max-w-2xl text-center">
            <span className="chip bg-rose-100 text-rose-600">
              <Satellite className="h-3.5 w-3.5" />
              Our two worlds
            </span>
            <h3 className="mt-4 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">
              From where we met, to where you <span className="text-gradient-gold">are now</span>
            </h3>
            <p className="mt-3 font-body text-wine-500/80">
              This is a real satellite map. Drag it, pinch to zoom, explore it like you would any map. Press "Fly from space" to zoom from orbit down to where we met in Bengaluru — then press "Fly to you in Delhi" to watch a plane travel the whole distance to where you are now.
            </p>
          </div>
          <InteractiveMap />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="reveal mx-auto max-w-3xl rounded-3xl bg-wine-700 p-8 text-center text-cream-100 shadow-card">
          <Plane className="mx-auto h-8 w-8 animate-heart-beat text-gold-300" />
          <p className="mt-4 font-display text-2xl text-white">
            Bengaluru to Delhi. Long distance, but never long enough to lose us.
          </p>
          <p className="mt-3 font-body text-cream-200/90">
            The next timeline entry is the day this distance closes. Until then, every call, every text, every visit is another line on this map.
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-primary mt-6 bg-rose-400 hover:bg-rose-300"
          >
            Take the quiz about us
          </button>
        </div>
      </section>
    </PageShell>
  );
}
