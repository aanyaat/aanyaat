import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Sparkles, Heart, Navigation, Maximize2, RotateCcw } from 'lucide-react';
import { useConfetti } from '@/lib/useConfetti';

/**
 * Cinematic satellite zoom — like in movies when they fly from space down to a location.
 * Uses real satellite tile imagery (Esri World Imagery — free, no API key needed).
 * We animate through progressively higher zoom levels, crossfading tiles for a smooth fly-down.
 */

// Godrej Royale Woods, Devanahalli, Bengaluru
const TARGET_LAT = 13.2723;
const TARGET_LNG = 77.6785;

// Esri World Imagery (free ArcGIS REST tile service, no key required)
const TILE_URL = (z: number, x: number, y: number) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

// Each zoom stage we fly through
const ZOOM_STAGES = [3, 5, 7, 9, 11, 13, 15, 17];

// Convert lat/lng to tile coordinates at a given zoom level
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y, zoom };
}

type Stage = {
  zoom: number;
  x: number;
  y: number;
  label: string;
  sub: string;
};

const STAGES: Stage[] = ZOOM_STAGES.map((z) => {
  const t = latLngToTile(TARGET_LAT, TARGET_LNG, z);
  const labels: Record<number, { label: string; sub: string }> = {
    3: { label: 'Earth', sub: 'Somewhere on this big round world…' },
    5: { label: 'India', sub: 'A country of colors, chai, and chaos we love' },
    7: { label: 'Karnataka', sub: 'South India — where our story is' },
    9: { label: 'Bengaluru region', sub: 'The city that brought us together' },
    11: { label: 'Devanahalli', sub: 'Just north of the city' },
    13: { label: 'Devanahalli town', sub: 'Getting closer…' },
    15: { label: 'Godrej Royale Woods', sub: 'Right about here' },
    17: { label: 'We met here', sub: 'This exact spot. 15th May 2026.' },
  };
  const info = labels[z] ?? { label: '', sub: '' };
  return { zoom: z, x: t.x, y: t.y, ...info };
});

const FINAL_NOTE = {
  name: 'Godrej Royale Woods',
  area: 'Devanahalli, Bengaluru, Karnataka 562110',
  note: 'This is where we met. Not in some grand romantic movie scene — just here, in this quiet corner of Devanahalli. You walked in and everything I thought I knew about timing, about luck, about "the right person" quietly rearranged itself around you. I took 3 hours to reply to your first message after we met, and I have been trying to make up for those 3 hours ever since. Every place I go now, I measure against this one. None of them come close.',
};

export function SatelliteZoomMap() {
  const { canvasRef, fire } = useConfetti(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [loadedTiles, setLoadedTiles] = useState<Set<number>>(new Set());
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => { return () => clearTimers(); }, []);

  // Preload tiles for upcoming stages
  useEffect(() => {
    STAGES.forEach((s, i) => {
      const img = new Image();
      img.onload = () => {
        setLoadedTiles((prev) => new Set(prev).add(i));
      };
      img.src = TILE_URL(s.zoom, s.x, s.y);
    });
  }, []);

  const goToStage = useCallback((idx: number) => {
    setCurrentStage(idx);
    if (idx >= STAGES.length - 1) {
      setArrived(true);
      fire(200);
      setTimeout(() => fire(80), 600);
    }
  }, [fire]);

  const playCinematic = useCallback(() => {
    if (autoPlaying) return;
    setAutoPlaying(true);
    setArrived(false);
    clearTimers();
    setCurrentStage(0);
    let delay = 1200;
    for (let i = 1; i < STAGES.length; i++) {
      const t = window.setTimeout(() => {
        goToStage(i);
        if (i === STAGES.length - 1) setAutoPlaying(false);
      }, delay);
      timersRef.current.push(t);
      delay += 1400;
    }
  }, [autoPlaying, goToStage]);

  const replay = () => {
    setArrived(false);
    setCurrentStage(0);
    fire(40);
  };

  const stage = STAGES[currentStage];
  const prevStage = currentStage > 0 ? STAGES[currentStage - 1] : null;
  const canZoom = currentStage < STAGES.length - 1;

  return (
    <div className="mx-auto max-w-4xl">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 h-full w-full" aria-hidden="true" />

      <div className="reveal relative overflow-hidden rounded-[2rem] bg-wine-900 shadow-card">
        {/* Satellite viewport */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a14] sm:aspect-[16/10]">
          {/* Tile layers — we stack them and crossfade */}
          {STAGES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: i === currentStage ? 1 : 0,
                transform: i === currentStage ? 'scale(1)' : `scale(${i < currentStage ? 1.3 : 0.85})`,
                zIndex: i,
              }}
            >
              <SatelliteTile zoom={s.zoom} x={s.x} y={s.y} index={i} loaded={loadedTiles.has(i)} />
            </div>
          ))}

          {/* Scanning grid overlay (movie HUD effect) */}
          <div className="pointer-events-none absolute inset-0 z-[100]">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'linear-gradient(rgba(100,200,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.15) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />
            {/* Corner brackets */}
            <CornerBrackets />
            {/* Scan line */}
            {!arrived && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" style={{
                animation: 'scan-line 3s linear infinite',
                top: 0,
              }} />
            )}
          </div>

          {/* Targeting reticle */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2">
            {!arrived ? (
              <div className="relative h-16 w-16 sm:h-24 sm:w-24">
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(249,79,115,0.8)]" />
                <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full border-2 border-rose-400/70 sm:h-14 sm:w-14" />
                <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40 sm:h-24 sm:w-24" />
              </div>
            ) : (
              <div className="relative">
                <span className="absolute -inset-6 animate-pulse-ring rounded-full border-2 border-gold-300" />
                <span className="absolute -inset-3 animate-pulse-ring rounded-full border-2 border-rose-300" style={{ animationDelay: '0.5s' }} />
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white shadow-glow sm:h-20 sm:w-20">
                  <Heart className="h-8 w-8" fill="currentColor" />
                </div>
              </div>
            )}
          </div>

          {/* HUD label */}
          <div className="pointer-events-none absolute left-4 top-4 z-[102] sm:left-6 sm:top-6">
            <div
              key={currentStage}
              className={arrived ? 'animate-bounce-in' : 'animate-fade-in'}
            >
              <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2.5">
                <Navigation className="h-4 w-4 text-cyan-300" />
                <div>
                  <p className="font-display text-sm font-semibold text-white sm:text-base">
                    {stage.label}
                  </p>
                  <p className="font-body text-[10px] text-cyan-200/70 sm:text-xs">
                    {stage.sub}
                  </p>
                </div>
              </div>
              <p className="mt-1.5 ml-1 font-mono text-[10px] text-cyan-300/50">
                {stage.zoom > 2 && `ZOOM ${stage.zoom}x`} · {TARGET_LAT.toFixed(4)}°N {TARGET_LNG.toFixed(4)}°E
              </p>
            </div>
          </div>

          {/* Zoom level indicator bar */}
          <div className="pointer-events-none absolute right-4 top-4 z-[102] sm:right-6 sm:top-6">
            <div className="flex flex-col gap-1">
              {STAGES.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'h-1.5 w-6 rounded-full transition-all duration-500',
                    i <= currentStage ? 'bg-cyan-300' : 'bg-white/20',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>

          {/* Loading indicator */}
          {!loadedTiles.has(currentStage) && !arrived && (
            <div className="absolute inset-0 z-[103] flex items-center justify-center bg-wine-900/50">
              <div className="flex items-center gap-2 text-cyan-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="font-mono text-xs tracking-wider">ACQUIRING SATELLITE…</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="flex flex-col gap-4 bg-wine-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          {/* Stage dots */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STAGES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setArrived(false); goToStage(i); }}
                className={[
                  'h-2 rounded-full transition-all duration-300',
                  i === currentStage
                    ? 'w-8 bg-rose-400'
                    : i < currentStage
                      ? 'w-2 bg-cyan-400/70'
                      : 'w-2 bg-white/20 hover:bg-white/40',
                ].join(' ')}
                aria-label={s.label}
                title={s.label}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={playCinematic}
              disabled={autoPlaying}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-gold-500 px-6 py-2.5 font-body text-sm font-medium text-white shadow-soft transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {autoPlaying ? 'Flying down…' : arrived ? 'Replay from space' : 'Fly from space'}
            </button>
            {canZoom && !autoPlaying && (
              <button
                onClick={() => goToStage(currentStage + 1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-body text-sm font-medium text-white transition-all duration-300 hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
                Zoom in
              </button>
            )}
            {arrived && (
              <button
                onClick={replay}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-body text-sm font-medium text-white transition-all duration-300 hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The note — appears when arrived */}
      {arrived && (
        <div className="reveal mt-6 overflow-hidden rounded-[2rem] bg-white p-8 shadow-card sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-wine-700">
                {FINAL_NOTE.name}
              </h3>
              <p className="font-body text-sm text-wine-500/70">{FINAL_NOTE.area}</p>
            </div>
          </div>
          <p className="mt-6 font-body text-lg leading-relaxed text-wine-600">
            {FINAL_NOTE.note}
          </p>
          <div className="mt-6 rounded-2xl bg-rose-50 p-5">
            <p className="font-body text-base italic text-rose-700">
              "It was nice meeting you."
            </p>
            <p className="mt-1 font-body text-sm text-wine-500/70">
              — your first message. The one I took 3 hours to reply to.
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Godrej Royale Woods, Devanahalli, Bengaluru, Karnataka 562110')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-7"
          >
            <MapPin className="h-4 w-4" />
            See it on Google Maps
          </a>
        </div>
      )}

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Renders a 3x3 grid of satellite tiles centered on the target location */
function SatelliteTile({
  zoom,
  x,
  y,
  index,
  loaded,
}: {
  zoom: number;
  x: number;
  y: number;
  index: number;
  loaded: boolean;
}) {
  // 3x3 grid of tiles for a wider view, center tile is the target
  const offsets = [-1, 0, 1];
  const tileSize = 256;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        className="relative"
        style={{
          width: tileSize * 3,
          height: tileSize * 3,
          // Scale to fill the container while keeping center tile centered
          transform: 'scale(1.5)',
        }}
      >
        {offsets.map((dy) =>
          offsets.map((dx) => {
            const tx = x + dx;
            const ty = y + dy;
            const url = TILE_URL(zoom, tx, ty);
            return (
              <img
                key={`${dx},${dy}`}
                src={url}
                alt=""
                aria-hidden="true"
                className="absolute"
                style={{
                  left: (dx + 1) * tileSize,
                  top: (dy + 1) * tileSize,
                  width: tileSize,
                  height: tileSize,
                  objectFit: 'cover',
                }}
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0';
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function CornerBrackets() {
  const base = 'absolute h-6 w-6 border-cyan-300/50 sm:h-8 sm:w-8';
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 sm:left-5 sm:top-5`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 sm:right-5 sm:top-5`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 sm:bottom-5 sm:left-5`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 sm:bottom-5 sm:right-5`} />
    </>
  );
}
