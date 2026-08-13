import { useState } from 'react';
import { Heart, Sparkles, ArrowRight, BookOpen, Bot, SmilePlus } from 'lucide-react';
import { person } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';

/* ── Story beats (user's exact words) ── */
const storyBeats = [
  { icon: Sparkles, text: `Obviously i liked u just when we started talking Ofc U seemed easy going someone who cares someone I can see with my family and they are really important to me And now u r my family And u r important for me` },
  { icon: Heart, text: `So just randomly u were sending me ur office photos and i saw u and i just thought ki how pretty u r` },
  { icon: BookOpen, text: `We used to talk daily u once told me ki mai hi nhi u can also text first` },
  { icon: SmilePlus, text: `When I used to wait for u to text me soo u won't feel like bombarded and pressured ofc` },
  { icon: Sparkles, text: `And u were soo free and sooo cute in talking I just liked u more` },
  { icon: Heart, text: `It's like getting to know u and then wanting to know more uk and just started to feel that u r really special` },
  { icon: BookOpen, text: `then I learn ur phone number I mean didn't even think like i want to learn it just happened` },
  { icon: Heart, text: `U and ur talks are like a routine for my day now like day won't be complete unless I talk` },
  { icon: SmilePlus, text: `Like i can't literally sleep unless I text u good night` },
  { icon: Sparkles, text: `Even yesterday I mean u slept even thenni texted u good night` },
];
const storyCutOff = `Just these small small things and i just star`;

export function AboutPage() {
  const { navigate } = useRouter();
  const [showAllBeats, setShowAllBeats] = useState(false);

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

      {/* ─── OUR STORY: How I First Liked You ─── */}
      <section className="px-6 pb-24 border-t border-rose-100/50 pt-20">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Our Story"
            title={
              <>
                How I first <span className="text-gradient-rose">liked you</span>
              </>
            }
            subtitle="The story of how you quietly became my whole day, my routine, and my family."
          />
        </div>
        <div className="mx-auto max-w-3xl mt-12 space-y-5">
          {(showAllBeats ? storyBeats : storyBeats.slice(0, 4)).map((beat, i) => (
            <div
              key={i}
              className="reveal rounded-3xl bg-white p-6 shadow-soft transition-all duration-500 hover:shadow-card sm:p-7"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
                  <beat.icon className="h-5 w-5" />
                </span>
                <p className="font-body text-base leading-relaxed text-wine-600 sm:text-lg">
                  {beat.text}
                </p>
              </div>
            </div>
          ))}

          {!showAllBeats && (
            <div className="text-center">
              <button onClick={() => setShowAllBeats(true)} className="btn-ghost">
                <ArrowRight className="h-4 w-4" />
                Keep reading…
              </button>
            </div>
          )}

          {showAllBeats && (
            <>
              {/* The cut-off card */}
              <div className="reveal rounded-3xl bg-white p-6 shadow-soft sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
                    <Heart className="h-5 w-5" />
                  </span>
                  <p className="font-body text-base leading-relaxed text-wine-600 sm:text-lg">
                    {storyCutOff}
                    <span className="animate-pulse text-rose-400">|</span>
                  </p>
                </div>
              </div>

              {/* Character limit banner */}
              <div className="reveal rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50 p-5 text-center">
                <p className="font-display text-lg font-semibold text-rose-600">
                  ⚠️ Character limit reached.
                </p>
                <p className="mt-1 font-body text-sm italic text-wine-500/70">
                  Didn't I tell u I can literally write a book for u
                </p>
              </div>

              {/* AI Summary joke */}
              <div className="reveal rounded-3xl bg-gradient-to-br from-wine-700 to-rose-600 p-7 text-white shadow-card sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-gold-200 shadow-soft ring-1 ring-white/20">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      AI Summary of what he was trying to say:
                    </h3>
                    <p className="font-body text-xs text-cream-200/60">
                      auto-generated because he ran out of space
                    </p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 font-body text-base text-cream-100/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />
                    He likes you.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />
                    A lot.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />
                    Apparently enough to write an entire book.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />
                    Unfortunately, the website has a character limit.
                  </li>
                </ul>
                <p className="mt-5 font-body text-sm italic text-cream-200/70">
                  — This summary was generated because the author exceeded 10,000 characters of feelings.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

