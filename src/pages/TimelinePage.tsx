import { Satellite, Plane } from 'lucide-react';
import { person } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';
import { InteractiveMap } from '@/components/InteractiveMap';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';

export function TimelinePage() {
  const { navigate } = useRouter();
  return (
    <PageShell>
      {/* ─── HEADER ─── */}
      <section className="px-6 pt-24 pb-6 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
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

      {/* ─── INTERACTIVE TIMELINE (STORY ROAD & STEP-BY-STEP) ─── */}
      <section className="px-3 sm:px-6 pb-20">
        <InteractiveTimeline />
      </section>

      {/* ─── INTERACTIVE SATELLITE MAP ─── */}
      <section className="px-6 pb-24 border-t border-rose-100/50 pt-16">
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

      {/* ─── CLOSING MILESTONE CARD ─── */}
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
