import { Heart, Sparkles } from 'lucide-react';
import { person } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';

export function AboutPage() {
  const { navigate } = useRouter();
  return (
    <PageShell>
      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="About this little site"
            title={
              <>
                Why I made this <span className="text-gradient-rose">for you</span>
              </>
            }
            subtitle="Not a forwarded reel. Not a forwarded wish. This is a whole website, built from scratch, with your name on the door."
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-5 md:items-center">
          <div className="reveal md:col-span-2">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-rose-200 to-gold-200 opacity-70 blur-xl" />
              <img
                src="https://images.pexels.com/photos/7312107/pexels-photo-7312107.jpeg?auto=compress&cs=tinysrgb&h=900&w=900"
                alt="A couple sharing a tender moment outdoors."
                className="relative aspect-square w-full rounded-[2rem] object-cover shadow-card"
                loading="lazy"
              />
              <span className="absolute -bottom-4 -right-4 grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-soft">
                <Heart className="h-7 w-7 animate-heart-beat text-rose-500" fill="currentColor" />
              </span>
            </div>
          </div>

          <div className="reveal space-y-5 md:col-span-3">
            <p className="font-body text-lg leading-relaxed text-wine-600">
              Hi {person.nickname}. You’re full of life, excitement, love, curiosity,
              and care — and I wanted your birthday gift to feel like{' '}
              <em className="font-display italic text-rose-600">you</em>. So instead
              of forwarding a wish like everyone else, I built this whole thing from
              scratch and put everything I want to say onto it.
            </p>
            <p className="font-body text-lg leading-relaxed text-wine-600">
              The more I know you, the more I want to know you — and this site is my
              way of showing that. There’s a countdown, the things I love about you,
              our timeline sort of 😂, a silly quiz only you can ace, and a playlist of things we’ve
              shared. Every word here is for you. Nothing is an accident.
            </p>
            <p className="font-body text-lg leading-relaxed text-wine-600">
              You make me want to explore life. Stay as long as you like — this place
              isn’t going anywhere, and neither am I.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => navigate('/wishes')} className="btn-primary">
                <Heart className="h-4 w-4" fill="currentColor" />
                Read my wishes
              </button>
              <button onClick={() => navigate('/memories')} className="btn-ghost">
                <Sparkles className="h-4 w-4" />
                See our photos
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
