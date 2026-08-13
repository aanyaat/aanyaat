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
} from 'lucide-react';
import { coupons, playlist, person, memories } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useConfetti } from '@/lib/useConfetti';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { ScratchOverlay } from '@/components/ScratchCard';

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
  const [generating, setGenerating] = useState(false);
  const keepsakeCanvasRef = useRef<HTMLCanvasElement>(null);

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

  // Draws a certificate-style keepsake onto an offscreen canvas and
  // downloads it as a PNG. Replaces the old window.print() flow so the
  // whole experience stays inside the site instead of a browser dialog.
  const downloadKeepsake = () => {
    setGenerating(true);

    const canvas = keepsakeCanvasRef.current;
    if (!canvas) {
      setGenerating(false);
      return;
    }

    const width = 1200;
    const height = 1500;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setGenerating(false);
      return;
    }

    // Background gradient — wine to rose to gold, matching the site
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#4a1d2e');
    bg.addColorStop(0.55, '#b3324a');
    bg.addColorStop(1, '#c78a2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Inner cream card
    const margin = 56;
    const cardX = margin;
    const cardY = margin;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;
    const radius = 36;
    ctx.fillStyle = '#fdf8f0';
    roundedRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();

    // Double border, like a certificate
    ctx.strokeStyle = '#c78a2e';
    ctx.lineWidth = 3;
    roundedRect(ctx, cardX + 24, cardY + 24, cardW - 48, cardH - 48, radius - 12);
    ctx.stroke();

    let y = cardY + 110;
    const centerX = width / 2;

    // Eyebrow
    ctx.fillStyle = '#b3324a';
    ctx.font = '600 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('K E E P S A K E   C E R T I F I C A T E', centerX, y);

    y += 70;
    ctx.fillStyle = '#4a1d2e';
    ctx.font = '700 56px Georgia, serif';
    ctx.fillText('This certifies that', centerX, y);

    y += 80;
    ctx.fillStyle = '#b3324a';
    ctx.font = 'italic 700 68px Georgia, serif';
    ctx.fillText(person.name, centerX, y);

    y += 60;
    ctx.fillStyle = '#4a1d2e';
    ctx.font = '400 30px Georgia, serif';
    ctx.fillText('holds the following coupons, valid forever:', centerX, y);

    y += 60;
    ctx.strokeStyle = '#e7c98f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 120, y);
    ctx.lineTo(cardX + cardW - 120, y);
    ctx.stroke();

    y += 56;
    ctx.textAlign = 'left';
    const listX = cardX + 120;
    coupons.forEach((c, i) => {
      const isClaimed = claimed.includes(i);
      ctx.fillStyle = isClaimed ? '#2f8f5b' : '#7a2038';
      ctx.font = '700 30px Georgia, serif';
      ctx.fillText(isClaimed ? '✓' : '❤', listX, y);

      ctx.fillStyle = '#4a1d2e';
      ctx.font = '700 30px Georgia, serif';
      ctx.fillText(c.title, listX + 44, y);

      ctx.fillStyle = '#8a6a56';
      ctx.font = 'italic 400 22px Georgia, serif';
      ctx.fillText(isClaimed ? 'claimed' : 'not yet claimed', width - margin - 190, y);

      y += 52;
    });

    y += 50;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4a1d2e';
    ctx.font = 'italic 400 26px Georgia, serif';
    wrapText(
      ctx,
      'No expiry. Redeemable anytime, anywhere, no questions asked.',
      centerX,
      y,
      cardW - 220,
      34
    );

    // Footer: date + signature
    const footerY = cardY + cardH - 130;
    ctx.strokeStyle = '#e7c98f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 120, footerY - 40);
    ctx.lineTo(cardX + cardW - 120, footerY - 40);
    ctx.stroke();

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#8a6a56';
    ctx.font = '400 22px Georgia, serif';
    ctx.fillText(`Issued ${dateStr}`, cardX + 120, footerY);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#b3324a';
    ctx.font = 'italic 700 30px Georgia, serif';
    ctx.fillText(`— ${person.fromYou}`, cardX + cardW - 120, footerY);

    // Trigger the download
    canvas.toBlob((blob) => {
      if (!blob) {
        setGenerating(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${person.name.toLowerCase()}-birthday-keepsake.png`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerating(false);
    }, 'image/png');
  };

  return (
    <PageShell>
      <ConfettiOverlay canvasRef={canvasRef} />
      {/* Offscreen canvas used only to render the keepsake PNG */}
      <canvas ref={keepsakeCanvasRef} className="hidden" />

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
      <section className="px-6 pt-32 pb-10 sm:pt-40">
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
          </div>

          {/* The screenshot */}
          <div className="reveal mt-10 overflow-hidden rounded-3xl bg-white p-3 shadow-soft ring-1 ring-rose-100 sm:p-4">
            <img
              src="/image.png"
              alt="Screenshot showing Aanya chose all four gift options"
              className="w-full rounded-2xl object-contain"
              loading="lazy"
            />
            <p className="mt-3 text-center font-body text-sm italic text-wine-500/70">
              "Pick one type of gift" — she picked all four. Obviously. 😂
            </p>
          </div>
        </div>
      </section>

      {/* ─── GIFT A: Something handmade — This website ─── */}
      <section className="px-6 pb-16 animate-fade-in">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft">
              <Gift className="h-6 w-6" />
            </span>
            <div>
              <span className="chip bg-gold-100 text-gold-700 text-xs">Gift A</span>
              <h3 className="mt-2 font-display text-2xl font-semibold text-wine-700 sm:text-3xl">
                Something handmade — This website
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-wine-500/90">
                I created this website for you by my own hands, my time, and my thoughts — because I wanted to make something that exists only for you. Not a forwarded wish, not a bought gift. Something I built from scratch, just for you.
              </p>
            </div>
          </div>

          {/* Nested Playlist & Coupon Book directly inside Gift A */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2 border-t border-rose-100 pt-10">
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

              <div className="mt-6 overflow-hidden rounded-2xl shadow-soft ring-1 ring-rose-100">
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

              {/* Track list */}
              <div className="mt-6 rounded-2xl bg-wine-700 p-6 text-cream-100 shadow-card">
                <h5 className="font-display text-base font-semibold text-white">The track list</h5>
                <ul className="mt-4 divide-y divide-white/10 text-sm">
                  {playlist.map((t, i) => (
                    <li key={t.title} className="flex items-start gap-3 py-2.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 font-display text-xs text-gold-300">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-body font-medium text-white">{t.title}</p>
                        <p className="font-body text-xs text-cream-200/60">{t.artist}</p>
                        <p className="mt-1 font-body text-xs italic text-cream-200/80">{t.note}</p>
                      </div>
                    </li>
                  ))}
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

              <div className="mt-6 space-y-4">
                {/* Featured link coupon */}
                {coupons.map((c, i) => {
                  if (!c.url) return null;
                  return (
                    <a
                      key={c.title}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-start gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-wine-700 to-rose-600 p-4 text-left text-white shadow-soft transition-all duration-300 hover:shadow-card"
                    >
                      <span className="absolute left-0 top-0 h-full w-1 bg-gold-300" />
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-200 shadow-soft">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-display text-sm font-semibold text-white truncate">{c.title}</h5>
                        <p className="mt-0.5 font-body text-xs text-cream-100/85 leading-relaxed">{c.body}</p>
                      </div>
                    </a>
                  );
                })}

                {/* Scratch coupons */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {coupons.map((c, i) => {
                    if (c.url) return null;
                    const isClaimed = claimed.includes(i);
                    return (
                      <button
                        key={c.title}
                        onClick={() => isClaimed && fire(10)}
                        className={[
                          'group relative flex h-full w-full items-start gap-3 overflow-hidden rounded-2xl p-4 text-left transition-all duration-300',
                          isClaimed
                            ? 'bg-cream-100 ring-1 ring-emerald-300'
                            : 'bg-cream-50 hover:bg-cream-100 shadow-soft',
                        ].join(' ')}
                      >
                        <span className="absolute left-0 top-0 h-full w-1 bg-rose-400" />
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600 shadow-soft">
                          <c.icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-display text-sm font-semibold text-wine-700 truncate">{c.title}</h5>
                          <p className="mt-0.5 font-body text-xs text-wine-500/85 leading-relaxed">{c.body}</p>
                        </div>
                        {isClaimed ? (
                          <div className="absolute right-1 top-1 rounded-full bg-emerald-100 p-0.5 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        ) : (
                          <ScratchOverlay onReveal={() => claim(i)} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keepsake & Lucky number actions */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  onClick={downloadKeepsake}
                  disabled={generating}
                  className="btn-ghost text-xs px-4 py-2 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  {generating ? 'Preparing keepsake…' : 'Download keepsake'}
                </button>
                <button
                  onClick={rollLuckyNumber}
                  disabled={luckyStage === 'rolling'}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-60"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {luckyStage === 'idle'
                    ? "Lucky number?"
                    : luckyStage === 'rolling'
                      ? 'Rolling…'
                      : 'Roll again'}
                </button>
              </div>

              {/* Lucky number panel */}
              {luckyStage !== 'idle' && (
                <div
                  key={luckyStage === 'rolling' ? 'rolling' : `revealed-${revealKey}`}
                  className="lucky-panel-in mt-6 rounded-2xl bg-cream-50 p-6 text-center shadow-soft ring-1 ring-gold-100"
                >
                  {luckyStage === 'rolling' ? (
                    <>
                      <p className="font-body text-xs text-wine-500/70">Finding your lucky number…</p>
                      <p className="mt-1 font-display text-4xl font-bold tabular-nums text-rose-600">
                        {rollingDisplay}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-body text-xs text-wine-500/70">Your lucky number is</p>
                      <p className="mt-0.5 font-display text-4xl font-bold text-gradient-gold">
                        {luckyNumber}
                      </p>
                      <p className="mt-1.5 font-body text-xs italic text-wine-500/70">
                        Now watch — every little piece of you, blooming into one beautiful flower.
                      </p>
                      <PhotoTulipMorph key={revealKey} startDelay={0} />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GIFT B: A meaningful experience — Offline AI Companion ─── */}
      <section className="px-6 pb-16">
        <div className="reveal mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-5">
            <div className="md:col-span-3">
              <span className="chip bg-rose-100 text-rose-600">
                <Bot className="h-3.5 w-3.5" />
                Gift B
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-wine-700 sm:text-3xl">
                A meaningful experience — Offline AI Companion
              </h3>
              <p className="mt-4 font-body text-base leading-relaxed text-wine-500/90">
                I made you an AI companion that works even without the internet. Remember when we talked about the protests, and the internet just… wasn't there? That can happen anytime. So I made you something for those moments — an offline AI you can talk to. Big important questions, tiny everyday issues, anything on your mind. It lives on your phone, no signal needed, no one watching.
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-wine-500/80">
                Think of it as a small piece of me that's always in your pocket — staying with you, along with me, always. Even when the world goes quiet, you've still got someone to ask.
              </p>
              <p className="mt-3 font-body text-xs italic text-rose-600/90">
                And before you say it — I know, I know, "you don't have storage" for another app 😂 So I didn't send an app. I built you a whole website instead. For you. Only you. Always yours.
              </p>
              <a
                href="https://aanya-ai.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-7"
              >
                <Bot className="h-4 w-4" />
                Meet your companion
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-rose-200 to-gold-200 opacity-70 blur-2xl" />
                <div className="relative grid place-items-center rounded-[2rem] bg-gradient-to-br from-wine-700 to-rose-600 p-10 text-center text-white shadow-card">
                  <Bot className="h-16 w-16 animate-heart-beat text-gold-200" />
                  <p className="mt-4 font-display text-xl text-white">No internet. No problem.</p>
                  <p className="mt-1 font-body text-sm text-cream-200/80">
                    Ask it anything, anywhere, anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GIFT C: Something you've wanted forever — Living Time Capsule ─── */}
      <section className="px-6 pb-16">
        <div className="reveal mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-wine-700 via-rose-600 to-gold-600 p-10 text-center text-white shadow-card sm:p-14">
          <Infinity className="mx-auto h-10 w-10 animate-heart-beat text-gold-200" />
          <span className="chip bg-white/10 text-cream-100 text-xs">Gift C</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Something you've wanted forever — This website isn't finished.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-cream-100/90">
            This is something that starts with your birthday, but it doesn't end here.
            I'm going to keep adding to this — new photos, new memories, new notes, new
            milestones — for as long as we're us. Which is forever.
          </p>
          <p className="mx-auto mt-5 max-w-xl font-body text-base text-cream-100/80">
            One day, our kids can open this website and see how special their mom was to
            their father and how our story started.
          </p>
        </div>
      </section>

      {/* ─── GIFT D: Kiss ─── */}
      <section className="px-6 pb-16">
        <div className="reveal mx-auto max-w-xl overflow-hidden rounded-3xl bg-white p-8 text-center shadow-soft border border-rose-100">
          <span className="text-4xl">😘</span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-wine-700">
            Gift D — Kiss
          </h3>
          <p className="mt-3 font-body text-base text-wine-500/90">
            The kiss gift will soon come to you. 😘
          </p>
        </div>
      </section>

      {/* Final celebration banner */}
      <section className="px-6 pb-24">
        <div className="reveal mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-wine-700 via-rose-600 to-gold-600 p-10 text-center text-white shadow-card sm:p-14">
          <Sparkles className="mx-auto h-10 w-10 animate-heart-beat text-gold-200" />
          <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
            Happy Birthday, {person.name}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-cream-100/90">
            That's the whole site — every page, every word, made for you. You know me a little too much, and I wouldn't have it any other way. Now let's go have the real day. I Miss You
          </p>
          <p className="mx-auto mt-5 max-w-xl rounded-2xl bg-white/10 px-6 py-4 font-body text-base italic text-cream-100/90 ring-1 ring-white/20">
            "Aree Baba ye toh bas first step hai Next toh aapke liye Dress Select Karna hai, Jo bhi pasand hai yaad se bhej dena — I want to see you in it, something which i bought for my ladyy"
          </p>
          <a
            href="https://www.amazon.in/s?k=clothes+for+girlfriend+birthday+gift"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white/15 px-7 py-3 font-body font-medium text-white ring-1 ring-white/30 transition-all duration-300 hover:bg-white/25 hover:ring-white/50"
          >
            <ExternalLink className="h-4 w-4" />
            Browse dress ideas on Amazon
          </a>
          <button
            onClick={() => fire(260)}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-body font-medium text-rose-600 shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            <Sparkles className="h-4 w-4" />
            One more round of confetti
          </button>
        </div>
      </section>
    </PageShell>
  );
}

// --- photo-to-tulip morph reveal ---

const MORPH_PHOTO_SRCS = memories.slice(0, 5).map((m) => m.src);

const MORPH_SCATTER = [
  { x: -128, y: -64 },
  { x: 124, y: -88 },
  { x: -104, y: 84 },
  { x: 112, y: 72 },
  { x: 0, y: -116 },
];

const MORPH_SPARK_COUNT = 14;

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
        const dist = 70 + Math.random() * 70;
        return {
          ex: Math.cos(angle) * dist,
          ey: Math.sin(angle) * dist,
          size: 4 + Math.random() * 5,
          color: ['#f9e28a', '#ffabb9', '#f36c96', '#e8b62a'][
            Math.floor(Math.random() * 4)
          ],
          delay: Math.random() * 220,
        };
      }),
    []
  );

  return (
    <div className="relative mx-auto mt-6 h-72 w-full max-w-sm sm:h-80">
      {/* glow burst at the merge point */}
      <span
        className="morph-glow absolute left-1/2 top-1/2 h-44 w-44 rounded-full"
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
            className="morph-photo absolute left-1/2 top-1/2 h-20 w-20 rounded-2xl object-cover shadow-card ring-2 ring-white/80 sm:h-24 sm:w-24"
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
        className="morph-tulip absolute left-1/2 top-1/2 h-64 w-48 sm:h-72 sm:w-56"
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
