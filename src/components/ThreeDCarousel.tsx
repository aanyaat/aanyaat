import { useState, useEffect, useRef, useCallback } from 'react';
import type { TouchEvent, MouseEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Film,
  Image as ImageIcon,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import type { MemoryItem } from '@/content';

interface ThreeDCarouselProps {
  items: MemoryItem[];
  onOpenLightbox: (index: number) => void;
}

export function ThreeDCarousel({ items, onOpenLightbox }: ThreeDCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay loop
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, next]);

  // Handle active video playback
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idxStr, videoEl]) => {
      const idx = Number(idxStr);
      if (videoEl) {
        if (idx === activeIndex) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      }
    });
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Touch Swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (mouseStartX.current !== null) {
      if (Math.abs(e.clientX - mouseStartX.current) > 5) {
        isDragging.current = true;
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    mouseStartX.current = null;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-5xl select-none px-2 sm:px-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── 3D PERSPECTIVE STAGE ─── */}
      <div
        className="relative h-[410px] sm:h-[470px] w-full flex items-center justify-center [perspective:1200px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Floating Side Arrow Left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-1 sm:left-4 z-30 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-white/90 text-wine-900 shadow-xl border border-rose-100/80 transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Previous memory"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Floating Side Arrow Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-1 sm:right-4 z-30 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-white/90 text-wine-900 shadow-xl border border-rose-100/80 transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Next memory"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* 3D Cards */}
        {items.map((item, index) => {
          const total = items.length;
          let offset = (index - activeIndex) % total;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Responsive 3D Geometry calculations
          const rotateY = offset * -26;
          const translateX = offset * 220;
          const translateZ = -Math.abs(offset) * 140;
          const scale = isCenter ? 1 : Math.max(0.82 - Math.abs(offset) * 0.08, 0.72);
          const opacity = isCenter ? 1 : Math.max(0.65 - Math.abs(offset) * 0.2, 0.35);
          const zIndex = 20 - Math.abs(offset) * 5;

          return (
            <div
              key={item.src}
              onClick={() => {
                if (isDragging.current) return;
                if (isCenter) onOpenLightbox(index);
                else setActiveIndex(index);
              }}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
              }}
              className={[
                'absolute w-[260px] sm:w-[310px] h-[370px] sm:h-[430px] rounded-3xl p-3 bg-white shadow-2xl transition-all duration-700 ease-out cursor-pointer group flex flex-col justify-between',
                isCenter
                  ? 'ring-4 ring-rose-400/90 shadow-rose-500/25 shadow-2xl'
                  : 'ring-1 ring-wine-900/10 hover:opacity-95 shadow-lg',
              ].join(' ')}
            >
              {/* Media Container */}
              <div className="relative h-[77%] w-full overflow-hidden rounded-2xl bg-wine-950/10 shadow-inner">
                {item.type === 'video' ? (
                  <>
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={item.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-full bg-wine-950/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md border border-white/10 shadow-md">
                      <Film className="h-3 w-3 text-rose-400" />
                      <span>{isCenter ? 'PLAYING' : 'REEL'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-full bg-wine-950/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md border border-white/10 shadow-md">
                      <ImageIcon className="h-3 w-3 text-gold-400" />
                      <span>PHOTO</span>
                    </div>
                  </>
                )}

                {/* Center Hover Action Banner */}
                {isCenter && (
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center p-3">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/25 backdrop-blur-md px-3.5 py-1 text-[11px] font-semibold text-white shadow-lg border border-white/20">
                      <Maximize2 className="h-3 w-3" /> Tap for fullscreen
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer (Inside the card, never clipped or overlapping) */}
              <div className="pt-2 pb-0.5 px-1 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    <Sparkles className="h-2.5 w-2.5 text-gold-500" />
                    {item.date}
                  </span>
                  <span className="text-[10px] font-semibold text-wine-400">
                    #{index + 1} of {total}
                  </span>
                </div>
                <p className="mt-1 font-display text-sm sm:text-base font-bold text-wine-800 line-clamp-1 leading-tight">
                  {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── FILMSTRIP SCRUBBER & TOUR CONTROLS ─── */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {/* Interactive Filmstrip Thumbnails */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1.5 px-3 no-scrollbar">
          {items.map((item, i) => {
            const isCur = i === activeIndex;
            return (
              <button
                key={item.src}
                onClick={() => setActiveIndex(i)}
                className={[
                  'relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden shrink-0 transition-all duration-300 cursor-pointer',
                  isCur
                    ? 'ring-3 ring-rose-500 scale-110 shadow-md shadow-rose-500/30 opacity-100'
                    : 'opacity-40 hover:opacity-75 ring-1 ring-wine-900/10',
                ].join(' ')}
                aria-label={`Jump to memory ${i + 1}`}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    muted
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                {isCur && <div className="absolute inset-0 bg-rose-500/10" />}
              </button>
            );
          })}
        </div>

        {/* Compact Auto-Tour Indicator */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-semibold text-wine-700 shadow-soft border border-rose-100 hover:bg-white transition-all cursor-pointer backdrop-blur-sm"
        >
          {isAutoPlaying ? (
            <>
              <Pause className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>Auto-tour on (pause)</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>Resume auto-tour</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
