import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Music2,
  ExternalLink,
  Ticket,
  Download,
  Heart,
  Sparkles,
  Bot,
  CheckCircle2,
  Sparkle,
  Gift,
  Infinity,
  SmilePlus,
  Compass,
  BookOpen,
  X,
} from 'lucide-react';
import { coupons, playlist, person, memories } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useConfetti } from '@/lib/useConfetti';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { ScratchOverlay } from '@/components/ScratchCard';
import { ThreeDTulipExperience } from '@/components/ThreeDTulipExperience';
import { StorybookModal } from '@/components/StorybookModal';

type LuckyStage = 'idle' | 'rolling' | 'revealed';

const LUCKY_MIN = 1;
const LUCKY_MAX = 9;
const randomLucky = () =>
  LUCKY_MIN + Math.floor(Math.random() * (LUCKY_MAX - LUCKY_MIN + 1));



const fourGifts = [
  { letter: 'A', label: 'Something handmade', icon: Gift, body: `This website. I created this for you by my own hands, my time, and my thoughts — because I wanted to make something that exists only for you. Not a forwarded wish, not a bought gift. Something I built from scratch, just for you.` },
  { letter: 'B', label: 'A meaningful experience', icon: Bot, body: `I made you an AI companion that works even without the internet. Remember when we talked about the protests and the internet just wasn't there? I didn't want you to ever feel stuck. Even when the internet can't help you, I wanted to make sure you could always find your way back home — back to me.`, link: { href: 'https://aanya-ai.pages.dev/', text: 'Meet your companion' } },
  { letter: 'C', label: "Something you've wanted forever", icon: Infinity, body: `This website isn't a one-day birthday website. It will keep growing. New photos, new memories, new notes — I'll keep adding to it. I hope this is something you've wanted forever — a gift specially made for you that stays with you forever.` },
  { letter: 'D', label: 'Kiss', icon: SmilePlus, body: `The kiss gift will soon come to you. 😘` },
] as const;

export function GiftsPage() {
  const { canvasRef, fire } = useConfetti(true);
  const [claimed, setClaimed] = useState<number[]>([]);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [kisses, setKisses] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);

  // Lucky-number-into-tulips state
  const [luckyStage, setLuckyStage] = useState<LuckyStage>('idle');
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);
  const [rollingDisplay, setRollingDisplay] = useState(LUCKY_MIN);
  const [revealKey, setRevealKey] = useState(0);
  const rollTimeoutRef = useRef<number>();

  useEffect(() => {
    // final celebration as the user lands on the last page
    const t = setTimeout(() => fire(180), 400);
    return () => clearTimeout(t);
  }, [fire]);

  useEffect(() => {
    return () => {
      if (rollTimeoutRef.current) window.clearTimeout(rollTimeoutRef.current);
    };
  }, []);

  const claim = (i: number) => {
    if (claimed.includes(i)) return;
    setClaimed((c) => [...c, i]);
    fire(40);
  };

  const rollLuckyNumber = () => {
    if (luckyStage === 'rolling') return;
    setLuckyStage('rolling');
    setLuckyNumber(null);

    const totalDuration = 900;
    const tickEvery = 70;
    let elapsed = 0;

    const tick = () => {
      setRollingDisplay(randomLucky());
      elapsed += tickEvery;
      if (elapsed < totalDuration) {
        rollTimeoutRef.current = window.setTimeout(tick, tickEvery);
      } else {
        const final = randomLucky();
        setLuckyNumber(final);
        setRevealKey((k) => k + 1);
        setLuckyStage('revealed');
        fire(60);
      }
    };

    tick();
  };

  return (
    <PageShell>
      {/* 3D Realtime Scroll-Driven Tulip & Petal Odyssey */}
      <ThreeDTulipExperience />
      <ConfettiOverlay canvasRef={canvasRef} />

      {/* Keyframes for the lucky-number tulip reveal */}
      <style>{`
        /* Fades the lucky-number panel in on its own — it can't rely on
           a scroll-triggered reveal observer since it doesn't exist in
           the DOM until after the button click. */
        .lucky-panel-in {
          animation: lucky-panel-fade 380ms ease-out both;
        }
        @keyframes lucky-panel-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* photo-to-tulip morph */
        .morph-photo {
          animation: morph-photo 1.9s cubic-bezier(0.45, 0, 0.2, 1) both;
        }
        .morph-glow {
          animation: morph-glow 1.2s ease-out both;
        }
        .morph-spark {
          animation: morph-spark 0.9s ease-out both;
          box-shadow: 0 0 8px rgba(249, 226, 138, 0.85);
        }
        .morph-tulip {
          transform-origin: 50% 82%;
          animation: morph-tulip 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes morph-photo {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--sx), var(--sy)) scale(0.5) rotate(var(--rot));
          }
          18% { opacity: 1; }
          55% {
            opacity: 0.95;
            transform: translate(-50%, -50%) translate(calc(var(--sx) * 0.22), calc(var(--sy) * 0.22)) scale(0.72) rotate(calc(var(--rot) * 0.25));
          }
          80% {
            opacity: 0.45;
            transform: translate(-50%, -50%) translate(0, 0) scale(0.3) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(0, 0) scale(0.08) rotate(0deg);
          }
        }
        @keyframes morph-glow {
          0%, 45% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          62% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.35); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.6); }
        }
        @keyframes morph-tulip {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0) translateY(26px); }
          55% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) translateY(-8px); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1) translateY(0); }
        }
        @keyframes morph-spark {
          0%, 55% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          72% { opacity: 1; transform: translate(-50%, -50%) translate(var(--ex), var(--ey)) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) translate(calc(var(--ex) * 1.35), calc(var(--ey) * 1.35)) scale(0.3); }
        }
      `}</style>

      {/* ─── THE 4 GIFTS EXPERIENCE ─── */}
      <section className="px-6 pt-24 pb-6 sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="chip bg-gold-100 text-gold-700">
              <Gift className="h-3.5 w-3.5" />
              The 4 gifts
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">
              You said you wanted all four.{' '}
              <span className="text-gradient-rose">So I chose all four for you.</span>
            </h2>
            <p className="mt-3 font-body text-base text-wine-600/90 max-w-lg mx-auto">
              Every card below is one of your four gifts, resting on your blooming 3D tulip.
            </p>

            {/* Interactive Memory Badge (Non-blocking so the 3D Tulip is in full glory) */}
            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={() => setShowQuizModal(true)}
                className="group flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-xl px-5 py-2.5 shadow-soft border border-white/80 hover:bg-white hover:shadow-card transition-all cursor-pointer text-xs font-semibold text-wine-700"
              >
                <span className="text-sm">📸</span>
                <span>See the question: <i>"Pick one type of gift"</i> — she picked all four 😂</span>
                <ExternalLink className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Gift Roadmap Chips (Interactive jumping across gifts) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => document.getElementById('gift-a')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-wine-700 border border-white/80 hover:bg-white hover:text-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <span>🌸</span>
                <span>Gift A: Handmade</span>
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('gift-b')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-wine-700 border border-white/80 hover:bg-white hover:text-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <span>🤖</span>
                <span>Gift B: Offline AI</span>
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('gift-c')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-wine-700 border border-white/80 hover:bg-white hover:text-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <span>♾️</span>
                <span>Gift C: Forever</span>
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('gift-d')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-wine-700 border border-white/80 hover:bg-white hover:text-rose-600 transition-all shadow-sm cursor-pointer"
              >
                <span>😘</span>
                <span>Gift D: Kiss</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GIFT A: Something handmade — This website ─── */}
      <section id="gift-a" className="px-3 sm:px-6 pb-16 animate-fade-in scroll-mt-28">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white/50 backdrop-blur-xl p-4 sm:p-8 md:p-10 shadow-card border border-white/70 border-t-4 border-t-rose-400">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div>
              <span className="chip bg-gold-100/90 text-gold-700 text-xs">Gift A</span>
              <h3 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-semibold text-wine-700">
                Something handmade — This website
              </h3>
              <p className="mt-2.5 font-body text-sm sm:text-base leading-relaxed text-wine-600/90">
                I created this website for you by my own hands, my time, and my thoughts — because I wanted to make something that exists only for you. Not a forwarded wish, not a bought gift. Something I built from scratch, just for you.
              </p>
            </div>
          </div>

          {/* Nested Playlist & Coupon Book directly inside Gift A */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start border-t border-rose-200/50 pt-10">
            {/* Playlist */}
            <div className="reveal">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
                  <Music2 className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-display text-lg font-semibold text-wine-700">
                    Songs and shows that remind me of you
                  </h4>
                  <p className="font-body text-xs text-wine-500/70">
                    Press play — these are from our conversations.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl shadow-soft ring-1 ring-white/60 bg-black/5">
                <iframe
                  className="aspect-[16/9] w-full"
                  src="https://www.youtube.com/embed/xitd9mEZIHk"
                  title="Mast Magan"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <a
                href="https://www.youtube.com/results?search_query=love+songs+playlist"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-medium text-rose-600 transition-all hover:gap-2.5"
              >
                Open more songs
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Interactive Jukebox Track List */}
              <div className="mt-6 rounded-2xl bg-wine-900/60 backdrop-blur-xl p-6 text-cream-100 shadow-card border border-wine-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-display text-base font-semibold text-white">The track list</h5>
                  <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider">Tap to view memory note</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {playlist.map((t, i) => {
                    const isSelected = selectedTrack === i;
                    return (
                      <li
                        key={t.title}
                        onClick={() => setSelectedTrack(i)}
                        className={[
                          'flex flex-col p-3 rounded-xl transition-all duration-300 cursor-pointer border',
                          isSelected
                            ? 'bg-white/15 border-gold-400/50 shadow-md ring-1 ring-gold-400/30'
                            : 'bg-white/5 border-transparent hover:bg-white/10',
                        ].join(' ')}
                      >
                        <div className="flex items-center gap-3">
                          <span className={['grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-xs', isSelected ? 'bg-gold-400 text-wine-900 font-bold' : 'bg-white/10 text-gold-300'].join(' ')}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-medium text-white truncate">{t.title}</p>
                            <p className="font-body text-xs text-cream-200/60">{t.artist}</p>
                          </div>
                          {isSelected && (
                            <span className="flex h-2 w-2 rounded-full bg-gold-400 animate-pulse shrink-0" />
                          )}
                        </div>
                        {isSelected && (
                          <div className="mt-2.5 pt-2 border-t border-white/10 animate-fade-in">
                            <p className="font-handwriting text-base text-gold-200 italic leading-snug">
                              "{t.note}"
                            </p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Coupons */}
            <div className="reveal">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-500 text-white shadow-soft">
                  <Ticket className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-display text-lg font-semibold text-wine-700">
                    Your little coupon book
                  </h4>
                  <p className="font-body text-xs text-wine-500/70">
                    Tap to claim / scratch. No expiry.
                  </p>
                </div>
              </div>

              {/* Scratch coupons */}
              <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2">
                {coupons.map((c, i) => {
                  const isClaimed = claimed.includes(i);
                  return (
                    <button
                      key={c.title}
                      onClick={() => isClaimed && fire(10)}
                      className={[
                        'group relative flex min-h-[84px] w-full items-start gap-3 overflow-hidden rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-300 border border-white/60 box-border',
                        isClaimed
                          ? 'bg-cream-100/80 backdrop-blur-md ring-1 ring-emerald-300'
                          : 'bg-white/60 backdrop-blur-md hover:bg-white/80 shadow-soft',
                      ].join(' ')}
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-rose-400" />
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600 shadow-soft">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0 pr-1">
                        <h5 className="font-display text-sm font-semibold text-wine-700 truncate">{c.title}</h5>
                        <p className="mt-0.5 font-body text-xs text-wine-500/85 leading-relaxed">{c.body}</p>
                      </div>
                      {isClaimed ? (
                        <div className="absolute right-2 top-2 rounded-full bg-emerald-100 p-0.5 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <ScratchOverlay onReveal={() => claim(i)} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Keepsake & Lucky number actions */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsStorybookOpen(true)}
                  className="btn-primary text-xs px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 shadow-soft flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Our Storybook Keepsake
                </button>
                <button
                  onClick={rollLuckyNumber}
                  disabled={luckyStage === 'rolling'}
                  className="btn-ghost text-xs px-4 py-2 disabled:opacity-60 bg-white/60 backdrop-blur-md border-white/80 shadow-soft cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold-600" />
                  Lucky number?
                </button>
              </div>

              {/* Sweet Note & Forever Rules Card to balance column height */}
              <div className="mt-6 rounded-2xl bg-rose-50/70 backdrop-blur-md p-4 border border-rose-100/80 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-200 text-rose-700 text-xs">
                    ✨
                  </span>
                  <h6 className="font-display text-xs font-bold uppercase tracking-wider text-wine-800">
                    Official Coupon Rules
                  </h6>
                </div>
                <p className="font-body text-xs text-wine-600/90 leading-relaxed">
                  Every coupon you scratch is permanently recorded. Valid anytime, anywhere across Bengaluru, Delhi, or wherever we are — no expiration date, no arguments, just love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GIFT B: A meaningful experience — Two Offline Tools ─── */}
      <section id="gift-b" className="px-6 pb-16 scroll-mt-28">
        <div className="reveal mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-white/45 backdrop-blur-xl p-8 shadow-card sm:p-10 border border-white/70">
          <div className="max-w-3xl">
            <span className="chip bg-rose-100 text-rose-600">
              <Bot className="h-3.5 w-3.5" />
              Gift B
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-wine-700 sm:text-3xl">
              A meaningful experience — Two Offline Tools
            </h3>
            <p className="mt-4 font-body text-base leading-relaxed text-wine-600/90">
              I know how much you care about staying connected and safe, especially when the signal drops. So I built you two tools that work completely offline on your phone — a companion to talk to, and a way to always find your way back home.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Tool 1: AI Companion */}
            <div className="relative flex flex-col justify-between rounded-3xl bg-white/50 backdrop-blur-md p-6 shadow-soft ring-1 ring-white/60 border border-white/40 transition-all duration-300 hover:shadow-card hover:bg-white/70">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white shadow-soft">
                    <Bot className="h-5 w-5 animate-heart-beat" />
                  </span>
                  <h4 className="font-display text-lg font-semibold text-wine-700">Offline AI Companion</h4>
                </div>
                <p className="mt-4 font-body text-sm leading-relaxed text-wine-500/90">
                  An offline AI you can talk to. Big important questions, tiny everyday issues, anything on your mind. It lives on your phone, no signal needed, no one watching.
                </p>
                <p className="mt-3 font-body text-xs italic text-rose-600/90">
                  And before you say it — I know, I know, "you don't have storage" for another app 😂 So I built you a website instead.
                </p>
              </div>
              <div className="mt-6 border-t border-rose-100/50 pt-4">
                <a
                  href="https://aanya-ai.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center text-xs justify-center shadow-soft"
                >
                  <Bot className="h-3.5 w-3.5" />
                  Meet your companion
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Tool 2: Get Me Home — Always */}
            <div className="relative flex flex-col justify-between rounded-3xl bg-white/50 backdrop-blur-md p-6 shadow-soft ring-1 ring-white/60 border border-white/40 transition-all duration-300 hover:shadow-card hover:bg-white/70">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white shadow-soft">
                    <Compass className="h-5 w-5 animate-heart-beat" />
                  </span>
                  <h4 className="font-display text-lg font-semibold text-wine-700">Get Me Home — Always</h4>
                </div>
                <p className="mt-4 font-body text-sm leading-relaxed text-wine-500/90">
                  I don't want you to ever be lost. Remember when I told you to download offline maps and you complained about the memory? So I built this — it gives you an idea of how to always get home and to your family, even with no signal.
                </p>
                <p className="mt-3 font-body text-xs italic text-rose-600/90">
                  Hoping you never have to use it, but making it just in case you do.
                </p>
              </div>
              <div className="mt-6 border-t border-rose-100/50 pt-4">
                <a
                  href="https://aanya-ai.pages.dev/#get-me-home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-center text-xs justify-center border-rose-200 bg-white/40 text-rose-600 hover:bg-rose-50"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Open navigation tool
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GIFT C: Something you've wanted forever — Living Time Capsule ─── */}
      <section id="gift-c" className="px-6 pb-16 scroll-mt-28">
        <div className="reveal mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-white/45 backdrop-blur-xl p-10 text-center text-wine-900 shadow-card sm:p-14 border border-white/70 border-t-4 border-t-gold-400">
          <Infinity className="mx-auto h-10 w-10 animate-heart-beat text-gold-600" />
          <span className="chip bg-gold-100 text-gold-700 text-xs mt-2">Gift C</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl text-wine-800">
            Something you've wanted forever — This website isn't finished.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-wine-700/90 leading-relaxed">
            This is something that starts with your birthday, but it doesn't end here.
            I'm going to keep adding to this — new photos, new memories, new notes, new
            milestones — for as long as we're us. Which is forever.
          </p>
          <p className="mx-auto mt-5 max-w-xl font-body text-base text-wine-600/85">
            One day, our kids can open this website and see how special their mom was to
            their father and how our story started.
          </p>
        </div>
      </section>

      {/* ─── GIFT D: Kiss ─── */}
      <section id="gift-d" className="px-6 pb-16 scroll-mt-28">
        <div
          onClick={() => {
            setKisses((k) => k + 1);
            fire(35);
          }}
          className="reveal mx-auto max-w-xl overflow-hidden rounded-3xl bg-white/50 backdrop-blur-xl p-8 text-center shadow-card border border-white/70 hover:shadow-card hover:bg-white/70 hover:scale-102 transition-all duration-300 cursor-pointer group"
        >
          <span className="text-5xl block animate-heart-beat">😘</span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-wine-700">
            Gift D — Kiss
          </h3>
          <p className="mt-3 font-body text-base text-wine-600/90">
            The kiss gift will soon come to you. 😘
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-50/90 px-4 py-1.5 text-xs font-bold text-rose-600 border border-rose-200/60 shadow-sm">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>
              {kisses === 0 ? 'Tap to send a kiss' : `${kisses} ${kisses === 1 ? 'kiss' : 'kisses'} sent! ❤️`}
            </span>
          </div>
        </div>
      </section>

      {/* Final celebration banner */}
      <section className="px-6 pb-24">
        <div className="reveal mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] bg-white/50 backdrop-blur-xl p-10 text-center text-wine-900 shadow-card sm:p-14 border border-white/70 border-t-4 border-t-rose-400">
          <Sparkles className="mx-auto h-10 w-10 animate-heart-beat text-rose-500" />
          <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl text-gradient-rose">
            Happy Birthday, {person.name}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-wine-700/90 leading-relaxed">
            That's the whole site — every page, every word, made for you. You know me a little too much, and I wouldn't have it any other way. Now let's go have the real day. I Miss You
          </p>
          <p className="mx-auto mt-5 max-w-xl rounded-2xl bg-rose-50/80 px-6 py-4 font-body text-base italic text-wine-800 ring-1 ring-rose-200/70 shadow-sm">
            "Aree Baba ye toh bas first step hai Next toh aapke liye Dress Select Karna hai, Jo bhi pasand hai yaad se bhej dena — I want to see you in it, something which i bought for my ladyy"
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.amazon.in/s?k=clothes+for+girlfriend+birthday+gift"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-7 py-3 shadow-soft"
            >
              <ExternalLink className="h-4 w-4" />
              Browse dress ideas on Amazon
            </a>
          </div>
          <button
            onClick={() => fire(260)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-8 py-3 font-body font-bold text-rose-600 shadow-soft ring-1 ring-rose-200 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-glow cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            One more round of confetti
          </button>
        </div>
      </section>

      {/* ─── FLAMINGO QUESTION SCREENSHOT MODAL ─── */}
      {showQuizModal && (
        <div
          onClick={() => setShowQuizModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full rounded-3xl bg-wine-950/90 p-4 sm:p-6 shadow-2xl border border-white/20 text-center animate-scale-in"
          >
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/30 p-2 text-white transition-all cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>
            <h4 className="font-display text-xl font-bold text-white mb-1">
              "Pick one type of gift"
            </h4>
            <p className="font-body text-xs text-cream-200/80 mb-4">
              And she picked all four 😂 That's why you get all four.
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/20 shadow-lg">
              <img
                src="/image.png"
                alt="Pick one type of gift question with all 4 selected"
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
              />
            </div>
            <button
              onClick={() => setShowQuizModal(false)}
              className="mt-4 btn-primary text-xs px-6 py-2"
            >
              Close Memory
            </button>
          </div>
        </div>
      )}

      {/* ─── LUCKY TULIP FLOWER MODAL ─── */}
      {luckyStage !== 'idle' && (
        <div
          onClick={() => setLuckyStage('idle')}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full rounded-3xl bg-white/95 p-6 shadow-2xl border border-white text-center animate-scale-in text-wine-900"
          >
            <button
              onClick={() => setLuckyStage('idle')}
              className="absolute top-3.5 right-3.5 rounded-full bg-rose-100 hover:bg-rose-200 p-1.5 text-wine-800 transition-all cursor-pointer"
              title="Close flower"
            >
              <X className="h-4 w-4" />
            </button>

            {luckyStage === 'rolling' ? (
              <div className="py-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100 text-gold-700 mx-auto shadow-sm animate-bounce mb-3">
                  <Sparkles className="h-6 w-6" />
                </span>
                <p className="font-body text-xs text-wine-500 font-semibold uppercase tracking-wider">Finding your lucky number…</p>
                <p className="mt-2 font-display text-5xl font-extrabold tabular-nums text-rose-600">
                  {rollingDisplay}
                </p>
              </div>
            ) : (
              <div className="pt-2 pb-1">
                <span className="chip bg-gold-100 text-gold-800 text-xs mx-auto">
                  ✨ Aanya's Blooming Tulip
                </span>
                <p className="mt-2 font-body text-xs text-wine-500/80 font-medium">Your lucky number is</p>
                <p className="font-display text-4xl font-extrabold text-gradient-gold">
                  {luckyNumber}
                </p>
                <p className="mt-1 font-body text-xs text-wine-600/90 italic">
                  Every piece of you, blooming into one beautiful flower.
                </p>
                <PhotoTulipMorph key={revealKey} startDelay={0} />
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={rollLuckyNumber}
                    className="btn-primary text-xs px-4 py-2 shadow-soft cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Roll again
                  </button>
                  <button
                    onClick={() => setLuckyStage('idle')}
                    className="btn-ghost text-xs px-4 py-2 bg-rose-50 hover:bg-rose-100 text-wine-800 border-rose-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── STORYBOOK MODAL KEEPSAKE ─── */}
      <StorybookModal
        isOpen={isStorybookOpen}
        onClose={() => setIsStorybookOpen(false)}
      />
    </PageShell>
  );
}

// --- photo-to-tulip morph reveal ---

const MORPH_PHOTO_SRCS = memories.slice(0, 5).map((m) => m.src);

const MORPH_SCATTER = [
  { x: -65, y: -35 },
  { x: 65, y: -40 },
  { x: -50, y: 40 },
  { x: 55, y: 35 },
  { x: 0, y: -50 },
];

const MORPH_SPARK_COUNT = 12;

type MorphStyle = CSSProperties & {
  '--sx'?: string;
  '--sy'?: string;
  '--rot'?: string;
  '--ex'?: string;
  '--ey'?: string;
};

function PhotoTulipMorph({ startDelay = 0 }: { startDelay?: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: MORPH_SPARK_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 50;
        return {
          ex: Math.cos(angle) * dist,
          ey: Math.sin(angle) * dist,
          size: 3 + Math.random() * 4,
          color: ['#f9e28a', '#ffabb9', '#f36c96', '#e8b62a'][
            Math.floor(Math.random() * 4)
          ],
          delay: Math.random() * 200,
        };
      }),
    []
  );

  return (
    <div className="relative mx-auto mt-4 h-60 w-full max-w-[260px] overflow-hidden">
      {/* glow burst at the merge point */}
      <span
        className="morph-glow absolute left-1/2 top-1/2 h-36 w-36 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(249,226,138,0.9) 0%, rgba(255,171,185,0.5) 45%, transparent 70%)',
          animationDelay: `${startDelay + 1300}ms`,
        }}
      />

      {/* her photos, swirling in and converging */}
      {MORPH_PHOTO_SRCS.map((src, i) => {
        const s = MORPH_SCATTER[i] ?? { x: 0, y: 0 };
        return (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className="morph-photo absolute left-1/2 top-1/2 h-16 w-16 rounded-xl object-cover shadow-card ring-2 ring-white/80 sm:h-20 sm:w-20"
            style={
              {
                animationDelay: `${startDelay + i * 90}ms`,
                '--sx': `${s.x}px`,
                '--sy': `${s.y}px`,
                '--rot': `${(i - 2) * 14}deg`,
              } as MorphStyle
            }
          />
        );
      })}

      {/* magic sparkles bursting outward as the tulip blooms */}
      {sparks.map((s, i) => (
        <span
          key={i}
          className="morph-spark absolute left-1/2 top-1/2 rounded-full"
          style={
            {
              width: s.size,
              height: s.size,
              background: s.color,
              animationDelay: `${startDelay + 1500 + s.delay}ms`,
              '--ex': `${s.ex}px`,
              '--ey': `${s.ey}px`,
            } as MorphStyle
          }
        />
      ))}

      {/* the single beautiful tulip, blooming from all of her */}
      <svg
        viewBox="0 0 120 170"
        className="morph-tulip absolute left-1/2 top-1/2 h-52 w-36 sm:h-56 sm:w-40"
        style={{ animationDelay: `${startDelay + 1500}ms` }}
        aria-label="A tulip blooming from her photos."
      >
        <defs>
          <linearGradient id="morph-petal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff8aa6" />
            <stop offset="1" stopColor="#d63264" />
          </linearGradient>
          <linearGradient id="morph-petal-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e85a82" />
            <stop offset="1" stopColor="#b3264a" />
          </linearGradient>
          <linearGradient id="morph-stem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3f7a46" />
            <stop offset="0.5" stopColor="#5aa25f" />
            <stop offset="1" stopColor="#3f7a46" />
          </linearGradient>
        </defs>
        <path
          d="M60 70 C 56 100 64 132 60 166"
          stroke="url(#morph-stem)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 112 C 34 104 12 116 4 140 C 30 142 54 130 60 114 Z"
          fill="url(#morph-stem)"
        />
        <path
          d="M60 126 C 86 118 108 130 116 152 C 90 154 66 142 60 128 Z"
          fill="#3f7a46"
        />
        <path
          d="M60 24 C 36 26 26 52 36 74 C 44 82 54 82 60 74 C 50 60 48 38 60 24 Z"
          fill="url(#morph-petal-dark)"
        />
        <path
          d="M60 24 C 84 26 94 52 84 74 C 76 82 66 82 60 74 C 70 60 72 38 60 24 Z"
          fill="url(#morph-petal-dark)"
        />
        <path
          d="M60 16 C 42 16 34 48 46 72 C 52 80 68 80 74 72 C 86 48 78 16 60 16 Z"
          fill="url(#morph-petal)"
        />
        <path
          d="M60 22 C 52 26 48 44 52 64"
          stroke="#ffd0d8"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// --- canvas helpers ---

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let lineY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineY);
}
