import { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Sparkles, Heart, RotateCcw, Cake } from 'lucide-react';
import { person, memories } from '@/content';
import { useConfetti } from '@/lib/useConfetti';

type CandleState = 'lit' | 'out';
const CANDLE_COUNT = 5;
const BLOW_THRESHOLD = 0.16;
const CANDLES_PER_BLOW = 2;

export function CakeRitual() {
  const { canvasRef, fire } = useConfetti(false);
  const [candles, setCandles] = useState<CandleState[]>(
    Array.from({ length: CANDLE_COUNT }, () => 'lit')
  );
  const [micState, setMicState] = useState<'idle' | 'listening' | 'denied' | 'unsupported'>('idle');
  const [blowPulse, setBlowPulse] = useState(0);
  const [allOut, setAllOut] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const cooldownRef = useRef(false);

  const litCount = candles.filter((c) => c === 'lit').length;

  const extinguishFromBlow = useCallback(() => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setBlowPulse((p) => p + 1);
    setCandles((prev) => {
      let remaining = CANDLES_PER_BLOW;
      const next = [...prev];
      for (let i = 0; i < next.length && remaining > 0; i++) {
        if (next[i] === 'lit') {
          next[i] = 'out';
          remaining--;
        }
      }
      return next;
    });
    setTimeout(() => { cooldownRef.current = false; }, 500);
  }, []);

  const stopListening = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
    analyserRef.current = null;
    dataRef.current = null;
    setMicState('idle');
  }, []);

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setMicState('unsupported'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      dataRef.current = buf;
      setMicState('listening');
      const tick = () => {
        const an = analyserRef.current;
        const data = dataRef.current;
        if (!an || !data) return;
        an.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
        if (Math.sqrt(sum / data.length) > BLOW_THRESHOLD) extinguishFromBlow();
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch { setMicState('denied'); }
  }, [extinguishFromBlow]);

  useEffect(() => { return () => stopListening(); }, [stopListening]);

  useEffect(() => {
    const out = candles.every((c) => c === 'out');
    if (out && !allOut) {
      setAllOut(true);
      fire(260);
      setTimeout(() => fire(120), 700);
    }
  }, [candles, allOut, fire]);

  const tapCandle = (i: number) => {
    setCandles((prev) => {
      if (prev[i] === 'out') return prev;
      const next = [...prev]; next[i] = 'out'; return next;
    });
  };

  const reset = () => {
    setCandles(Array.from({ length: CANDLE_COUNT }, () => 'lit'));
    setAllOut(false);
    setBlowPulse(0);
  };

  const heroPhoto = memories.find((m) => m.date === 'Our First Meet') ?? memories[memories.length - 1];

  return (
    <div className="mx-auto max-w-2xl">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 h-full w-full" aria-hidden="true" />

      <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-rose-50/90 via-cream-100 to-cream-200 p-6 sm:p-10 shadow-card border border-rose-100/80">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold-300/30 blur-3xl" />

        {/* ─── CAKE & CANDLE STAGE ─── */}
        <div className="relative mx-auto flex flex-col items-center max-w-sm sm:max-w-md pt-4">
          
          {/* Candles directly standing on the top tier */}
          <div className="relative z-20 flex items-end justify-center gap-3 sm:gap-5 mb-[-8px]">
            {candles.map((state, i) => (
              <button
                key={i}
                onClick={() => tapCandle(i)}
                className="group relative flex flex-col items-center outline-none cursor-pointer transition-transform hover:scale-105"
                aria-label={`Candle ${i + 1} — ${state === 'lit' ? 'lit' : 'out'}`}
              >
                {/* Candle flame */}
                <span
                  className={[
                    'relative mb-0.5 transition-all duration-500',
                    state === 'lit' ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                  ].join(' ')}
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <FlameSvg />
                </span>
                {/* Wick */}
                <span className="h-2 w-0.5 bg-amber-900/60" />
                {/* Candle body with wax stripes */}
                <span
                  className={[
                    'h-12 w-2 sm:h-14 sm:w-2.5 rounded-t-sm shadow-sm transition-all duration-300',
                    state === 'lit'
                      ? 'bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                      : 'bg-gradient-to-b from-stone-300 to-stone-400 opacity-60',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          {/* 3-Tier Birthday Cake Illustration */}
          <div className="relative z-10 w-full">
            <CakeSvg dimmed={allOut} />
          </div>
        </div>

        <p className="mt-4 text-center font-body text-sm font-medium text-wine-600">
          {allOut
            ? '✨ Every candle is out. Close your eyes and make a wish!'
            : `${litCount} candle${litCount === 1 ? '' : 's'} still glowing — tap or blow!`}
        </p>

        <div className="mt-3 flex items-center justify-center">
          <div key={blowPulse} className={blowPulse > 0 ? 'animate-bounce-in' : ''}>
            {blowPulse > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-xs font-semibold text-rose-600 shadow-soft">
                <Sparkles className="h-3.5 w-3.5" />
                Whoosh! Keep going
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3">
        {micState === 'listening' ? (
          <button onClick={stopListening} className="btn-ghost text-xs sm:text-sm">
            <MicOff className="h-4 w-4" />
            Stop listening
          </button>
        ) : (
          <button
            onClick={startListening}
            disabled={micState === 'unsupported'}
            className="btn-primary text-xs sm:text-sm disabled:opacity-50"
          >
            <Mic className="h-4 w-4" />
            {micState === 'unsupported'
              ? 'Mic not available — tap candles'
              : micState === 'denied'
                ? 'Mic blocked — tap candles instead'
                : 'Turn on microphone & blow'}
          </button>
        )}
        <button onClick={reset} className="btn-ghost text-xs sm:text-sm">
          <RotateCcw className="h-4 w-4" />
          Relight candles
        </button>
      </div>

      {micState === 'denied' && (
        <p className="mt-3 text-center font-body text-xs text-wine-500/70">
          No worries — you can tap each candle to blow it out instead.
        </p>
      )}

      {/* Special message after all candles out */}
      {allOut && (
        <div className="reveal mt-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-wine-700 via-rose-600 to-gold-600 p-8 text-center text-white shadow-card sm:p-10 border border-gold-300/30 animate-scale-in">
          <Heart className="mx-auto h-10 w-10 animate-heart-beat text-gold-200" fill="currentColor" />
          <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Happy Birthday, {person.nickname}
          </h3>
          <p className="mx-auto mt-4 max-w-lg font-body text-lg leading-relaxed text-cream-100/95">
            Did you make your wish? Good. Now let me tell you mine —
            I wish that every candle you blow out, for every year to come,
            I'm standing right next to you. Cheering the loudest. Loving you the most.
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-white/10 p-5 ring-1 ring-white/25 backdrop-blur-sm">
            <img
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              className="mx-auto h-48 w-48 rounded-2xl object-cover shadow-glow ring-2 ring-white/60"
            />
            <p className="mt-3 font-body text-sm italic text-cream-100/90">
              {heroPhoto.caption}
            </p>
          </div>
          <button onClick={() => fire(200)} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 font-body font-semibold text-rose-600 shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer">
            <Sparkles className="h-4 w-4" />
            More confetti!
          </button>
        </div>
      )}
    </div>
  );
}

export function CakeSectionHeader() {
  return (
    <div className="reveal mx-auto mb-10 max-w-2xl text-center">
      <span className="chip bg-gold-100 text-gold-700">
        <Cake className="h-3.5 w-3.5" />
        Make a wish
      </span>
      <h3 className="mt-4 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">
        Now blow out your <span className="text-gradient-gold">candles</span>
      </h3>
      <p className="mt-3 font-body text-wine-500/80">
        Tap the microphone, then really blow on your phone. The candles will go out one by one. When they're all gone, make a wish — it'll come true, I promise.
      </p>
    </div>
  );
}

function FlameSvg() {
  return (
    <span className="block h-6 w-3.5 sm:h-7 sm:w-4">
      <span className="absolute inset-0 animate-pulse rounded-full bg-gold-300/60 blur-md" />
      <svg viewBox="0 0 16 28" className="relative h-full w-full drop-shadow-[0_0_8px_rgba(232,182,42,0.9)]">
        <defs>
          <radialGradient id="flame-glow" cx="50%" cy="60%" r="60%">
            <stop offset="0" stopColor="#fffbeb" />
            <stop offset="0.4" stopColor="#f9e28a" />
            <stop offset="0.75" stopColor="#e8b62a" />
            <stop offset="1" stopColor="#d09a16" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <path d="M8 0 C 12 6 14 10 14 16 C 14 22 11 27 8 27 C 5 27 2 22 2 16 C 2 10 4 6 8 0 Z" fill="url(#flame-glow)">
          <animateTransform attributeName="transform" type="scale" values="1 1;1 1.08;1 0.96;1 1" dur="0.6s" repeatCount="indefinite" />
        </path>
      </svg>
    </span>
  );
}

function CakeSvg({ dimmed }: { dimmed: boolean }) {
  return (
    <svg viewBox="0 0 320 180" className="w-full drop-shadow-md">
      <defs>
        {/* Tier 1 - Top vanilla cream */}
        <linearGradient id="tier-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdfa" />
          <stop offset="100%" stopColor="#fce7ee" />
        </linearGradient>
        {/* Tier 2 - Middle strawberry rose */}
        <linearGradient id="tier-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        {/* Tier 3 - Bottom rich velvet */}
        <linearGradient id="tier-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        {/* Ambient candle glow */}
        <radialGradient id="cake-glow" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="rgba(253, 224, 71, 0.45)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Ambient warm light on cake top */}
      {!dimmed && <ellipse cx="160" cy="15" rx="110" ry="30" fill="url(#cake-glow)" />}

      {/* ─── TIER 1 (TOP) ─── */}
      <rect x="95" y="8" width="130" height="38" rx="8" fill="url(#tier-1)" />
      {/* Scalloped top frosting */}
      <path d="M95 24 Q 105 32 115 24 Q 125 32 135 24 Q 145 32 155 24 Q 165 32 175 24 Q 185 32 195 24 Q 205 32 215 24 Q 220 28 225 24 L 225 8 L 95 8 Z" fill="#ffffff" opacity="0.9" />
      {/* Decorative gold pearls on Tier 1 */}
      <circle cx="115" cy="36" r="2.5" fill="#facc15" />
      <circle cx="140" cy="36" r="2.5" fill="#fb7185" />
      <circle cx="160" cy="36" r="2.5" fill="#facc15" />
      <circle cx="180" cy="36" r="2.5" fill="#fb7185" />
      <circle cx="205" cy="36" r="2.5" fill="#facc15" />

      {/* ─── TIER 2 (MIDDLE) ─── */}
      <rect x="65" y="46" width="190" height="48" rx="10" fill="url(#tier-2)" />
      {/* Scalloped middle frosting drip */}
      <path d="M65 62 Q 78 72 90 62 Q 102 72 115 62 Q 128 72 140 62 Q 153 72 165 62 Q 178 72 190 62 Q 203 72 215 62 Q 228 72 240 62 Q 250 68 255 62 L 255 46 L 65 46 Z" fill="#fff1f2" />
      {/* Golden sprinkles & pearls on Tier 2 */}
      <circle cx="85" cy="80" r="3" fill="#fef08a" />
      <circle cx="115" cy="80" r="3" fill="#ffffff" />
      <circle cx="145" cy="80" r="3" fill="#fef08a" />
      <circle cx="175" cy="80" r="3" fill="#ffffff" />
      <circle cx="205" cy="80" r="3" fill="#fef08a" />
      <circle cx="235" cy="80" r="3" fill="#ffffff" />

      {/* ─── TIER 3 (BOTTOM) ─── */}
      <rect x="35" y="94" width="250" height="56" rx="12" fill="url(#tier-3)" />
      {/* Scalloped bottom frosting drip */}
      <path d="M35 112 Q 50 124 65 112 Q 80 124 95 112 Q 110 124 125 112 Q 140 124 155 112 Q 170 124 185 112 Q 200 124 215 112 Q 230 124 245 112 Q 260 124 275 112 Q 282 118 285 112 L 285 94 L 35 94 Z" fill="#fecdd3" />
      {/* Elegant pearls on Tier 3 */}
      <circle cx="55" cy="134" r="3.5" fill="#fef08a" />
      <circle cx="90" cy="134" r="3.5" fill="#ffffff" />
      <circle cx="125" cy="134" r="3.5" fill="#fef08a" />
      <circle cx="160" cy="134" r="3.5" fill="#ffffff" />
      <circle cx="195" cy="134" r="3.5" fill="#fef08a" />
      <circle cx="230" cy="134" r="3.5" fill="#ffffff" />
      <circle cx="265" cy="134" r="3.5" fill="#fef08a" />

      {/* Cake stand / plate */}
      <ellipse cx="160" cy="154" rx="145" ry="14" fill="#fde68a" opacity="0.8" />
      <ellipse cx="160" cy="157" rx="150" ry="10" fill="#d97706" opacity="0.3" />
    </svg>
  );
}
