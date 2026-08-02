import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Music2,
  ExternalLink,
  Ticket,
  Download,
  Heart,
  Sparkles,
} from 'lucide-react';
import { coupons, playlist, person } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useConfetti } from '@/lib/useConfetti';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';

type LuckyStage = 'idle' | 'rolling' | 'revealed';

const LUCKY_MIN = 1;
const LUCKY_MAX = 9;
const randomLucky = () =>
  LUCKY_MIN + Math.floor(Math.random() * (LUCKY_MAX - LUCKY_MIN + 1));

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
        .tulip-particle {
          position: absolute;
          left: 50%;
          top: 58%;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          opacity: 0;
          animation-name: tulip-particle-converge;
          animation-timing-function: ease-in;
          animation-fill-mode: both;
        }
        .tulip-bloom {
          transform-origin: 50% 100%;
          opacity: 0;
          animation-name: tulip-bloom-grow;
          animation-duration: 550ms;
          animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: both;
        }
        @keyframes tulip-particle-converge {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1);
          }
          15% { opacity: 1; }
          75% { opacity: 0.85; }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(0, 0) scale(0.3);
          }
        }
        @keyframes tulip-bloom-grow {
          0% { opacity: 0; transform: scale(0.2) translateY(14px); }
          70% { opacity: 1; transform: scale(1.12) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
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
      `}</style>

      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Music & gifts"
            title={
              <>
                A soundtrack, and a few <span className="text-gradient-gold">gifts</span>
              </>
            }
            subtitle={`Everything good deserves a playlist. And because I couldn't wrap the real presents, here are some you can keep in your pocket, ${person.nickname}.`}
          />
        </div>
      </section>

      {/* Playlist */}
      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <div className="reveal rounded-3xl bg-white p-7 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
                <Music2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-wine-700">
                  Songs and shows that remind me of you
                </h3>
                <p className="font-body text-sm text-wine-500/70">
                  Press play — these are from our conversations.
                </p>
              </div>
            </div>

            {/* Embedded player — YouTube playlist embed */}
            <div className="mt-6 overflow-hidden rounded-2xl shadow-soft ring-1 ring-rose-100">
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
          </div>

          {/* Track list */}
          <div className="reveal rounded-3xl bg-wine-700 p-7 text-cream-100 shadow-card sm:p-8">
            <h3 className="font-display text-xl font-semibold text-white">
              The track list
            </h3>
            <p className="mt-1 font-body text-sm text-cream-200/70">
              Each one comes with a reason.
            </p>
            <ul className="mt-6 divide-y divide-white/10">
              {playlist.map((t, i) => (
                <li key={t.title} className="flex items-start gap-4 py-3.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 font-display text-sm text-gold-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-body font-medium text-white">{t.title}</p>
                    <p className="font-body text-xs text-cream-200/60">{t.artist}</p>
                    <p className="mt-1 font-body text-sm italic text-cream-200/80">
                      {t.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Coupons */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mx-auto mb-10 max-w-2xl text-center">
            <span className="chip bg-gold-100 text-gold-700">
              <Ticket className="h-3.5 w-3.5" />
              Redeemable, anytime
            </span>
            <h3 className="mt-4 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">
              Your little coupon book
            </h3>
            <p className="mt-3 font-body text-wine-500/80">
              Tap to claim. No expiry — I’m good for it.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {coupons.map((c, i) => {
              const isClaimed = claimed.includes(i);
              return (
                <button
                  key={c.title}
                  onClick={() => claim(i)}
                  className={[
                    'reveal group relative flex items-start gap-4 overflow-hidden rounded-3xl p-6 text-left transition-all duration-500',
                    isClaimed
                      ? 'bg-emerald-50 ring-2 ring-emerald-300'
                      : 'bg-white shadow-soft hover:-translate-y-1 hover:shadow-card',
                  ].join(' ')}
                >
                  {/* perforated edge */}
                  <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-rose-400 to-gold-400" />
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h4 className="font-display text-lg font-semibold text-wine-700">
                      {c.title}
                    </h4>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-wine-500/90">
                      {c.body}
                    </p>
                    <span
                      className={[
                        'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                        isClaimed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-600 group-hover:bg-rose-200',
                      ].join(' ')}
                    >
                      {isClaimed ? (
                        <>
                          <Heart className="h-3 w-3" fill="currentColor" />
                          Claimed — see you soon
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          Tap to claim
                        </>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={downloadKeepsake}
              disabled={generating}
              className="btn-ghost disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {generating ? 'Preparing keepsake…' : 'Download keepsake'}
            </button>
            <button
              onClick={rollLuckyNumber}
              disabled={luckyStage === 'rolling'}
              className="btn-primary disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {luckyStage === 'idle'
                ? "What's my lucky number?"
                : luckyStage === 'rolling'
                  ? 'Rolling…'
                  : 'Roll again'}
            </button>
          </div>

          {/* Lucky number → digital tulips reveal */}
          {luckyStage !== 'idle' && (
            <div
              key={luckyStage === 'rolling' ? 'rolling' : `revealed-${revealKey}`}
              className="lucky-panel-in mt-8 rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-gold-100"
            >
              {luckyStage === 'rolling' ? (
                <>
                  <p className="font-body text-sm text-wine-500/70">
                    Finding your lucky number…
                  </p>
                  <p className="mt-2 font-display text-6xl font-bold tabular-nums text-rose-600">
                    {rollingDisplay}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-body text-sm text-wine-500/70">
                    Surprise! Your lucky number is
                  </p>
                  <p className="mt-1 font-display text-6xl font-bold text-gradient-gold">
                    {luckyNumber}
                  </p>
                  <p className="mt-2 font-body text-sm italic text-wine-500/70">
                    {luckyNumber} tulips, one for every reason I adore you.
                  </p>
                  <div className="mt-6 flex flex-wrap items-end justify-center gap-1">
                    {Array.from({ length: luckyNumber ?? 0 }).map((_, i) => (
                      <TulipBurst key={`${revealKey}-${i}`} delay={i * 130} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
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

// --- lucky-number tulip reveal ---

const TULIP_PARTICLE_COLORS = ['#f36c96', '#e2497a', '#c78a2e', '#e7c98f', '#b3324a'];

type ParticleStyle = CSSProperties & {
  '--dx': string;
  '--dy': string;
};

function TulipBurst({ delay = 0 }: { delay?: number }) {
  // Each burst gets its own random scatter, generated once per mount —
  // callers force a remount per reveal via the `key` prop so the
  // particles re-randomize and the animation replays from scratch.
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        dx: (Math.random() - 0.5) * 140,
        dy: (Math.random() - 0.5) * 140 - 20,
        color:
          TULIP_PARTICLE_COLORS[
          Math.floor(Math.random() * TULIP_PARTICLE_COLORS.length)
          ],
        duration: 450 + Math.random() * 250,
      })),
    []
  );

  return (
    <div className="relative h-28 w-16 shrink-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="tulip-particle"
          style={
            {
              background: p.color,
              animationDuration: `${p.duration}ms`,
              animationDelay: `${delay + i * 14}ms`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            } as ParticleStyle
          }
        />
      ))}
      <svg
        viewBox="0 0 100 140"
        className="tulip-bloom absolute inset-0 h-28 w-16"
        style={{ animationDelay: `${delay + 360}ms` }}
      >
        {/* stem */}
        <path
          d="M50 62 C 47 90 53 112 50 136"
          stroke="#4f8f56"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* leaves */}
        <path
          d="M50 96 C 28 90 10 100 4 120 C 24 122 44 112 50 98 Z"
          fill="#4f8f56"
        />
        <path
          d="M50 108 C 72 102 90 112 96 130 C 76 132 56 124 50 110 Z"
          fill="#3f7a46"
        />
        {/* petals — back-left, back-right, front-center */}
        <path
          d="M50 22 C 30 24 22 46 30 64 C 36 70 44 70 50 64 C 42 52 40 34 50 22 Z"
          fill="#c93865"
        />
        <path
          d="M50 22 C 70 24 78 46 70 64 C 64 70 56 70 50 64 C 58 52 60 34 50 22 Z"
          fill="#c93865"
        />
        <path
          d="M50 16 C 36 16 30 42 40 62 C 44 68 56 68 60 62 C 70 42 64 16 50 16 Z"
          fill="#f36c96"
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