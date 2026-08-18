import { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Plane, ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { person, memories } from '@/content';
import { CountdownDisplay } from '@/components/CountdownDisplay';
import type { useCountdown } from '@/lib/useCountdown';
import { useRouter } from '@/lib/router';

interface CinematicScrollOdysseyProps {
  cd: ReturnType<typeof useCountdown>;
  fire: (count?: number) => void;
  onOpenStorybook: () => void;
}

export function CinematicScrollOdyssey({ cd, fire, onOpenStorybook }: CinematicScrollOdysseyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { navigate } = useRouter();

  // Pick 3 memorable photos for the highway milestones
  const milestonePhotos = [
    memories.find((m) => m.category === 'highlights') || memories[0],
    memories[2] || memories[0],
    memories[4] || memories[0],
  ];

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const totalHeight = rect.height - window.innerHeight;
          if (totalHeight <= 0) return;

          // Normalized progress 0.0 -> 1.0 clamped
          const current = Math.min(Math.max(-rect.top / totalHeight, 0), 1);
          setProgress(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Helper interpolation functions for smooth sub-phase timelines
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
  const range = (start: number, end: number, current: number) => {
    return clamp((current - start) / (end - start), 0, 1);
  };

  // Phase ranges:
  // Phase 1: Grand Unboxing (0.00 - 0.25)
  // Phase 2: The Memory Highway (0.25 - 0.55)
  // Phase 3: The Bengaluru -> Delhi Flight (0.55 - 0.80)
  // Phase 4: Touchdown & Birthday Vault (0.80 - 1.00)

  // Phase 1 weights
  const p1FadeOut = 1 - range(0.18, 0.25, progress);
  const p1EnvelopeOpen = range(0.04, 0.18, progress);
  const p1PhotoEmerge = range(0.08, 0.22, progress);

  // Phase 2 weights
  const p2Active = progress >= 0.20 && progress <= 0.60;
  const p2FadeIn = range(0.20, 0.28, progress);
  const p2FadeOut = 1 - range(0.52, 0.60, progress);
  const p2Opacity = Math.min(p2FadeIn, p2FadeOut);
  const p2RoadProgress = range(0.22, 0.55, progress); // 0 -> 1 for road car translation

  // Road Sub-stages
  const rStage1 = 1 - Math.abs(range(0.24, 0.35, progress) - 0.5) * 2;
  const rStage2 = 1 - Math.abs(range(0.35, 0.46, progress) - 0.5) * 2;
  const rStage3 = 1 - Math.abs(range(0.46, 0.57, progress) - 0.5) * 2;

  // Phase 3 weights (Flight)
  const p3Active = progress >= 0.55 && progress <= 0.82;
  const p3FadeIn = range(0.55, 0.62, progress);
  const p3FadeOut = 1 - range(0.76, 0.82, progress);
  const p3Opacity = Math.min(p3FadeIn, p3FadeOut);
  const p3FlightProgress = range(0.58, 0.78, progress); // 0 -> 1 plane motion

  // Phase 4 weights (Vault / Landing)
  const p4Opacity = range(0.78, 0.90, progress);
  const p4Scale = 0.9 + range(0.78, 0.92, progress) * 0.1;

  return (
    <div ref={containerRef} className="relative w-full h-[380vh] bg-wine-950 text-cream-100">
      {/* Pinned Viewport Camera */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Ambient Cosmic Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-wine-950 via-wine-900/80 to-wine-950 pointer-events-none" />
        
        {/* Dynamic Glowing Radial Aura that tracks scroll */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-rose-500/15 blur-[120px] pointer-events-none transition-transform duration-300"
          style={{
            transform: `translate3d(${Math.sin(progress * Math.PI * 2) * 120}px, ${Math.cos(progress * Math.PI * 2) * 80}px, 0)`,
          }}
        />

        {/* ────────────────────────────────────────────────────────────────
            PHASE 1: THE GRAND UNBOXING (0.00 - 0.25)
        ──────────────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center transition-opacity duration-300"
          style={{
            opacity: p1FadeOut,
            pointerEvents: p1FadeOut > 0.3 ? 'auto' : 'none',
            transform: `translate3d(0, ${-progress * 160}px, 0)`,
          }}
        >
          {/* Birthday Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300 border border-white/20 backdrop-blur-md shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive Birthday Odyssey</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            Happy Birthday,
            <br />
            <span className="text-gradient-rose text-glow-rose">{person.name}</span>
          </h1>

          <p className="mt-4 max-w-lg font-body text-sm sm:text-base text-cream-200/90 leading-relaxed font-medium">
            Scroll down to drive through our story road, cross our distance, and open your birthday surprise.
          </p>

          {/* Real-time Countdown Card */}
          <div className="mt-6">
            <CountdownDisplay cd={cd} />
          </div>

          {/* Interactive Sealed Memory Envelope */}
          <div className="mt-8 relative w-48 h-32 sm:w-56 sm:h-36 perspective-1000">
            {/* Base Envelope Body */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-600 to-wine-800 shadow-card border border-rose-400/40 flex items-center justify-center">
              <span className="font-handwriting text-xl text-gold-200 font-bold">For My Ladyy ✨</span>
            </div>

            {/* Emerging 3D Polaroid Photo */}
            <div
              className="absolute left-1/2 bottom-3 -translate-x-1/2 w-32 sm:w-36 bg-white p-2 rounded-xl shadow-2xl transition-transform duration-200"
              style={{
                transform: `translate3d(-50%, ${-p1PhotoEmerge * 110}px, ${p1PhotoEmerge * 80}px) rotateZ(${(p1PhotoEmerge - 0.5) * 14}deg) scale(${0.8 + p1PhotoEmerge * 0.4})`,
                opacity: clamp(p1PhotoEmerge * 1.5, 0, 1),
              }}
            >
              <img
                src={milestonePhotos[0]?.src || '/images/gifts/story_begins.jpg'}
                alt="Aanya snapshot"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <p className="mt-1 font-handwriting text-xs text-wine-900 font-bold text-center">
                Where it all began ❤️
              </p>
            </div>

            {/* Envelope Top Flap */}
            <div
              className="absolute top-0 inset-x-0 h-16 origin-top bg-gradient-to-b from-rose-500 to-rose-700 rounded-t-2xl border-t border-rose-300/60 shadow-md"
              style={{
                transform: `rotateX(${-p1EnvelopeOpen * 140}deg)`,
                transformStyle: 'preserve-3d',
              }}
            />
          </div>

          {/* Scroll Down Instruction Indicator */}
          <div className="mt-8 flex flex-col items-center gap-1.5 opacity-80 animate-bounce">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gold-300">Scroll to drive</span>
            <div className="h-6 w-3.5 rounded-full border border-white/40 flex items-start justify-center p-0.5">
              <span className="h-1.5 w-1 rounded-full bg-rose-400 animate-float" />
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────
            PHASE 2: THE MEMORY HIGHWAY (0.20 - 0.60)
            Inspired by Scene 3 of Reference Video (Top-Down Split Screen)
        ──────────────────────────────────────────────────────────────── */}
        {p2Active && (
          <div
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-300"
            style={{ opacity: p2Opacity }}
          >
            {/* Top-Down Central Highway Track */}
            <div className="absolute inset-y-0 w-28 sm:w-36 bg-wine-900/90 border-x-2 border-dashed border-rose-400/40 shadow-2xl flex flex-col items-center justify-around overflow-hidden">
              {/* Road markings */}
              <div className="w-1.5 h-full border-r-2 border-dashed border-gold-400/50" />
              
              {/* Cruising Memory Guide Capsule (Driving Vehicle) */}
              <div
                className="absolute w-16 sm:w-20 bg-white p-1.5 rounded-xl shadow-glow border border-gold-300/80 transition-transform duration-100 z-20"
                style={{
                  top: '15%',
                  transform: `translate3d(0, ${p2RoadProgress * 420}px, 0) rotateZ(${Math.sin(p2RoadProgress * Math.PI * 4) * 5}deg)`,
                }}
              >
                <img
                  src={
                    p2RoadProgress < 0.35
                      ? milestonePhotos[0]?.src
                      : p2RoadProgress < 0.7
                        ? milestonePhotos[1]?.src
                        : milestonePhotos[2]?.src
                  }
                  alt="Cruising memory"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <span className="block text-[8px] font-bold text-wine-900 text-center truncate mt-0.5">
                  {p2RoadProgress < 0.35 ? 'Chapter 1' : p2RoadProgress < 0.7 ? 'Chapter 2' : 'Chapter 3'}
                </span>
              </div>
            </div>

            {/* Split Screen Columns */}
            <div className="relative z-10 w-full max-w-5xl grid grid-cols-2 gap-8 sm:gap-16 items-center">
              {/* Left Column: Bold Display Typography (Changes per milestone) */}
              <div className="text-right pr-6 sm:pr-10 space-y-4">
                <div
                  className="transition-all duration-300"
                  style={{
                    opacity: clamp(rStage1 * 1.5, 0, 1),
                    transform: `translate3d(${(1 - rStage1) * -30}px, 0, 0)`,
                  }}
                >
                  <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">Milestone 01</span>
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    How We First Started
                  </h3>
                  <p className="mt-1 font-body text-xs sm:text-sm text-cream-200/80">
                    Random office photos, instant comfort, and realizing you're special.
                  </p>
                </div>

                <div
                  className="transition-all duration-300"
                  style={{
                    opacity: clamp(rStage2 * 1.5, 0, 1),
                    transform: `translate3d(${(1 - rStage2) * -30}px, 0, 0)`,
                  }}
                >
                  <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">Milestone 02</span>
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    Late Night Talks
                  </h3>
                  <p className="mt-1 font-body text-xs sm:text-sm text-cream-200/80">
                    Day won't be complete unless I talk to you — literally couldn't sleep without wishing you goodnight.
                  </p>
                </div>

                <div
                  className="transition-all duration-300"
                  style={{
                    opacity: clamp(rStage3 * 1.5, 0, 1),
                    transform: `translate3d(${(1 - rStage3) * -30}px, 0, 0)`,
                  }}
                >
                  <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">Milestone 03</span>
                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    Now You're My Family
                  </h3>
                  <p className="mt-1 font-body text-xs sm:text-sm text-cream-200/80">
                    Not just a girlfriend — you became my home, my peace, and my person.
                  </p>
                </div>
              </div>

              {/* Right Column: Romantic Badges & Memory Cards */}
              <div className="text-left pl-6 sm:pl-10 space-y-4">
                <div
                  className="rounded-2xl bg-white/10 backdrop-blur-xl p-4 sm:p-5 border border-white/20 shadow-card max-w-xs transition-all duration-300"
                  style={{
                    opacity: clamp(rStage1 * 1.5, 0, 1),
                    transform: `translate3d(${(1 - rStage1) * 30}px, 0, 0)`,
                  }}
                >
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-1">
                    15 May 2026
                  </span>
                  <p className="font-handwriting text-lg sm:text-xl text-gold-200 italic leading-snug">
                    "I saw you and I just thought ki how pretty u r"
                  </p>
                </div>

                <div
                  className="rounded-2xl bg-white/10 backdrop-blur-xl p-4 sm:p-5 border border-white/20 shadow-card max-w-xs transition-all duration-300"
                  style={{
                    opacity: clamp(rStage2 * 1.5, 0, 1),
                    transform: `translate3d(${(1 - rStage2) * 30}px, 0, 0)`,
                  }}
                >
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-1">
                    18 May 2026
                  </span>
                  <p className="font-handwriting text-lg sm:text-xl text-gold-200 italic leading-snug">
                    "U and ur talks are like a routine for my day now"
                  </p>
                </div>

                <div
                  className="rounded-2xl bg-white/10 backdrop-blur-xl p-4 sm:p-5 border border-white/20 shadow-card max-w-xs transition-all duration-300"
                  style={{
                    opacity: clamp(rStage3 * 1.5, 0, 1),
                    transform: `translate3d(${(1 - rStage3) * 30}px, 0, 0)`,
                  }}
                >
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-1">
                    August 2026
                  </span>
                  <p className="font-handwriting text-lg sm:text-xl text-gold-200 italic leading-snug">
                    "Didn't I tell u I can literally write a book for u"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────
            PHASE 3: THE BENGALURU ⇄ DELHI FLIGHT (0.55 - 0.82)
            Inspired by Scene 5 of Reference Video (Flight Perspective)
        ──────────────────────────────────────────────────────────────── */}
        {p3Active && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 transition-opacity duration-300"
            style={{ opacity: p3Opacity }}
          >
            {/* Flight Map Canvas Frame */}
            <div className="relative w-full max-w-4xl h-72 sm:h-96 rounded-3xl bg-wine-900/60 border border-white/20 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Flight Path SVG Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 120 280 Q 450 60 760 120"
                  fill="none"
                  stroke="rgba(244,63,94,0.4)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                {/* Active Glowing Trajectory */}
                <path
                  d="M 120 280 Q 450 60 760 120"
                  fill="none"
                  stroke="url(#flightGlow)"
                  strokeWidth="4"
                  strokeDasharray="800"
                  strokeDashoffset={800 * (1 - p3FlightProgress)}
                />
                <defs>
                  <linearGradient id="flightGlow" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f94f73" />
                    <stop offset="100%" stopColor="#e8b62a" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Origin Marker: Bengaluru */}
              <div className="absolute left-8 sm:left-14 bottom-8 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                <MapPin className="h-4 w-4 text-rose-400" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-rose-300 uppercase">Where we met</p>
                  <p className="text-xs font-semibold text-white">Bengaluru</p>
                </div>
              </div>

              {/* Destination Marker: Delhi */}
              <div className="absolute right-8 sm:right-14 top-8 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                <Heart className="h-4 w-4 text-gold-400 fill-gold-400 animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gold-300 uppercase">Where you are now</p>
                  <p className="text-xs font-semibold text-white">Delhi</p>
                </div>
              </div>

              {/* Soaring Supersonic Plane */}
              <div
                className="absolute z-20 flex items-center gap-2"
                style={{
                  left: `${15 + p3FlightProgress * 65}%`,
                  top: `${70 - Math.sin(p3FlightProgress * Math.PI) * 45}%`,
                  transform: `translate3d(-50%, -50%, 0) rotate(${p3FlightProgress * 15 - 5}deg)`,
                }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-rose-500 to-gold-400 text-white shadow-glow animate-pulse">
                  <Plane className="h-6 w-6 transform rotate-45" />
                </div>
                <div className="bg-white/90 text-wine-950 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap">
                  Flight BLR ➔ DEL
                </div>
              </div>

              {/* Flight HUD Status Tray */}
              <div className="relative z-10 mx-auto mt-auto flex flex-wrap items-center justify-center gap-4 text-center">
                <div className="bg-black/50 px-4 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[9px] text-cream-200/60 uppercase block">Distance</span>
                  <span className="text-xs font-bold text-gold-300">1,740 km</span>
                </div>
                <div className="bg-black/50 px-4 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[9px] text-cream-200/60 uppercase block">Flight Time</span>
                  <span className="text-xs font-bold text-rose-300">2h 45m</span>
                </div>
                <div className="bg-black/50 px-4 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[9px] text-cream-200/60 uppercase block">Distance to Heart</span>
                  <span className="text-xs font-bold text-emerald-300">0.0 mm ❤️</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────
            PHASE 4: TOUCHDOWN & BIRTHDAY VAULT (0.78 - 1.00)
            The Grand Climax of the Odyssey
        ──────────────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center transition-all duration-500"
          style={{
            opacity: p4Opacity,
            pointerEvents: p4Opacity > 0.4 ? 'auto' : 'none',
            transform: `scale(${p4Scale})`,
          }}
        >
          <span className="chip bg-gold-100 text-gold-900 border border-gold-300 font-bold shadow-glow text-xs sm:text-sm">
            ✨ You Have Arrived At Your Birthday Vault
          </span>

          <h2 className="mt-5 font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Everything Made For <span className="text-gradient-rose text-glow-rose">{person.name}</span>
          </h2>

          <p className="mt-3 max-w-xl font-body text-base sm:text-lg text-cream-100/90 leading-relaxed font-medium">
            Every room, every note, every coupon, and our cake are unlocked below. Explore at your own pace.
          </p>

          {/* Action Launchpad */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => {
                fire(160);
                navigate('/about');
              }}
              className="btn-primary shadow-glow cursor-pointer text-sm font-bold tracking-wide px-8 py-3.5"
            >
              Enter The Rooms
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                onOpenStorybook();
                fire(80);
              }}
              className="btn-ghost bg-white/80 text-wine-900 border-white hover:bg-white backdrop-blur-xl shadow-card cursor-pointer flex items-center gap-2 text-sm font-bold px-7 py-3.5"
            >
              <BookOpen className="h-4 w-4 text-rose-500" />
              Storybook Keepsake
            </button>
            <button
              onClick={() => fire(140)}
              className="btn-ghost bg-white/50 text-white border-white/60 hover:bg-white/70 backdrop-blur-xl shadow-soft cursor-pointer text-sm font-bold px-6 py-3.5"
            >
              <Sparkles className="h-4 w-4 text-gold-300" />
              Confetti Blast
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
