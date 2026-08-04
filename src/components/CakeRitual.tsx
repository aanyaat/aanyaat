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
  const cakePhoto = '/images/gifts/yellow_mode.jpeg';

  return (
    <div className="mx-auto max-w-2xl">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 h-full w-full" aria-hidden="true" />

      <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-rose-50 via-cream-100 to-cream-200 p-8 shadow-card sm:p-12">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-gold-200/40 blur-3xl" />

        {/* Candle row */}
        <div className="relative flex items-end justify-center gap-3 sm:gap-5">
          {candles.map((state, i) => (
            <button
              key={i}
              onClick={() => tapCandle(i)}
              className="group relative flex flex-col items-center outline-none"
              aria-label={`Candle ${i + 1} — ${state === 'lit' ? 'lit' : 'out'}`}
            >
              <span
                className={[
                  'relative mb-[-2px] transition-all duration-500',
                  state === 'lit' ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                ].join(' ')}
                style={{ transformOrigin: 'bottom center' }}
              >
                <FlameSvg />
              </span>
              <span className="h-2 w-0.5 bg-wine-400" />
              <span
                className={[
                  'h-16 w-2.5 rounded-full shadow-soft transition-all duration-300 sm:h-20',
                  state === 'lit'
                    ? 'bg-gradient-to-b from-rose-300 to-rose-500'
                    : 'bg-gradient-to-b from-wine-300 to-wine-500',
                ].join(' ')}
              />
            </button>
          ))}
        </div>

        {/* Cake */}
        <div className="relative mx-auto mt-2 w-full max-w-md">
          <CakeSvg photoSrc={cakePhoto} dimmed={allOut} />
        </div>

        <p className="mt-6 text-center font-body text-sm text-wine-500/80">
          {allOut
            ? 'Every candle is out. Close your eyes and make a wish.'
            : `${litCount} candle${litCount === 1 ? '' : 's'} still glowing — keep blowing!`}
        </p>

        <div className="mt-4 flex items-center justify-center">
          <div key={blowPulse} className={blowPulse > 0 ? 'animate-bounce-in' : ''}>
            {blowPulse > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600">
                <Sparkles className="h-3 w-3" />
                Whoosh! Keep going
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3">
        {micState === 'listening' ? (
          <button onClick={stopListening} className="btn-ghost">
            <MicOff className="h-4 w-4" />
            Stop listening
          </button>
        ) : (
          <button
            onClick={startListening}
            disabled={micState === 'unsupported'}
            className="btn-primary disabled:opacity-50"
          >
            <Mic className="h-4 w-4" />
            {micState === 'unsupported'
              ? 'Mic not available — tap candles'
              : micState === 'denied'
                ? 'Mic blocked — tap candles instead'
                : 'Turn on microphone & blow'}
          </button>
        )}
        <button onClick={reset} className="btn-ghost">
          <RotateCcw className="h-4 w-4" />
          Relight candles
        </button>
      </div>

      {micState === 'denied' && (
        <p className="mt-3 text-center font-body text-sm text-wine-500/70">
          No worries — you can tap each candle to blow it out instead.
        </p>
      )}

      {/* Special message after all candles out */}
      {allOut && (
        <div className="reveal mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-wine-700 via-rose-600 to-gold-600 p-8 text-center text-white shadow-card sm:p-10">
          <Heart className="mx-auto h-10 w-10 animate-heart-beat text-gold-200" fill="currentColor" />
          <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Happy Birthday, {person.nickname}
          </h3>
          <p className="mx-auto mt-4 max-w-lg font-body text-lg leading-relaxed text-cream-100/90">
            Did you make your wish? Good. Now let me tell you mine —
            I wish that every candle you blow out, for every year to come,
            I'm standing right next to you. Cheering the loudest. Loving you the most.
          </p>
          <div className="mx-auto mt-5 max-w-md rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/20">
            <img
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              className="mx-auto h-40 w-40 rounded-2xl object-cover shadow-glow ring-2 ring-white/60"
            />
            <p className="mt-3 font-body text-sm italic text-cream-100/90">
              {heroPhoto.caption}
            </p>
          </div>
          <button onClick={() => fire(200)} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 font-body font-medium text-rose-600 shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-glow">
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
    <span className="block h-5 w-3 sm:h-7 sm:w-4">
      <span className="absolute inset-0 animate-pulse rounded-full bg-gold-300/50 blur-md" />
      <svg viewBox="0 0 16 28" className="relative h-full w-full drop-shadow-[0_0_6px_rgba(232,182,42,0.8)]">
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

function CakeSvg({ photoSrc, dimmed }: { photoSrc: string; dimmed: boolean }) {
  return (
    <svg viewBox="0 0 320 220" className="w-full">
      <defs>
        <linearGradient id="cake-layer-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff5f6" />
          <stop offset="1" stopColor="#ffd0d8" />
        </linearGradient>
        <linearGradient id="cake-layer-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffabb9" />
          <stop offset="1" stopColor="#f94f73" />
        </linearGradient>
        <linearGradient id="cake-layer-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6315c" />
          <stop offset="1" stopColor="#c02048" />
        </linearGradient>
        <clipPath id="photo-clip">
          <rect x="110" y="78" width="100" height="44" rx="8" />
        </clipPath>
        <radialGradient id="cake-glow" cx="50%" cy="0%" r="80%">
          <stop offset="0" stopColor="rgba(249,226,138,0.5)" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      {!dimmed && <ellipse cx="160" cy="10" rx="120" ry="40" fill="url(#cake-glow)" />}
      <rect x="100" y="60" width="120" height="40" rx="8" fill="url(#cake-layer-1)" />
      <image href={photoSrc} x="110" y="66" width="100" height="28" clipPath="url(#photo-clip)" preserveAspectRatio="xMidYMid slice" />
      <rect x="110" y="66" width="100" height="28" rx="6" fill="none" stroke="#f9e28a" strokeWidth="1.5" opacity="0.7" />
      <path d="M100 98 Q 110 106 120 98 Q 130 106 140 98 Q 150 106 160 98 Q 170 106 180 98 Q 190 106 200 98 Q 210 106 220 98 L 220 100 L 100 100 Z" fill="#fff5f6" />
      <rect x="80" y="100" width="160" height="48" rx="8" fill="url(#cake-layer-2)" />
      <path d="M80 146 Q 92 154 104 146 Q 116 154 128 146 Q 140 154 152 146 Q 164 154 176 146 Q 188 154 200 146 Q 212 154 224 146 Q 236 154 240 146 L 240 148 L 80 148 Z" fill="#ffabb9" />
      <rect x="50" y="148" width="220" height="52" rx="8" fill="url(#cake-layer-3)" />
      <path d="M50 198 Q 64 206 78 198 Q 92 206 106 198 Q 120 206 134 198 Q 148 206 162 198 Q 176 206 190 198 Q 204 206 218 198 Q 232 206 246 198 Q 260 206 270 198 L 270 200 L 50 200 Z" fill="#e6315c" />
      <circle cx="100" cy="124" r="3" fill="#f9e28a" />
      <circle cx="130" cy="124" r="3" fill="#fffbeb" />
      <circle cx="190" cy="124" r="3" fill="#fffbeb" />
      <circle cx="220" cy="124" r="3" fill="#f9e28a" />
      <circle cx="70" cy="172" r="3" fill="#f9e28a" />
      <circle cx="100" cy="172" r="3" fill="#fffbeb" />
      <circle cx="220" cy="172" r="3" fill="#fffbeb" />
      <circle cx="250" cy="172" r="3" fill="#f9e28a" />
      <ellipse cx="160" cy="206" rx="130" ry="10" fill="#e0b974" opacity="0.6" />
    </svg>
  );
}
