import { useRef, useState, useCallback } from 'react';
import type { MouseEvent } from 'react';
import { Play, Sparkles } from 'lucide-react';
import type { MemoryItem } from '@/content';

interface SpotlightCardProps {
  item: MemoryItem;
  index: number;
  onClick: () => void;
}

export function SpotlightCard({ item, index, onClick }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(1);

    // Subtle 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransform(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay restrictions handled gracefully
      });
    }
  }, [item.type]);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    setTransform('');
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [item.type]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transition: transform ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${(index % 8) * 40}ms`,
      }}
      className={[
        'reveal group relative cursor-pointer overflow-hidden rounded-3xl bg-white p-3.5 pb-5 sm:p-4 sm:pb-6 shadow-soft transition-all duration-300 hover:shadow-card ring-1 ring-rose-100/70',
        (item as { span?: boolean }).span ? 'col-span-2 row-span-2' : 'col-span-1',
      ].join(' ')}
    >
      {/* ReactBits Dynamic Radial Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10 rounded-3xl"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(249, 79, 115, 0.18), rgba(232, 182, 42, 0.08), transparent 70%)`,
        }}
      />

      {/* Media Canvas */}
      <div className="relative overflow-hidden rounded-2xl bg-wine-900/5 aspect-square">
        {item.type === 'video' ? (
          <>
            <video
              ref={videoRef}
              src={item.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Reel Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-wine-900/60 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md transition-opacity group-hover:bg-rose-600/90">
              <Play className="h-2.5 w-2.5 fill-current" />
              <span>{isPlaying ? 'PLAYING' : 'REEL'}</span>
            </div>
          </>
        ) : (
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-gold-300" />
            Tap to view in full
          </span>
        </div>
      </div>

      {/* Card Caption Tray */}
      <div className="mt-3.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-rose-600">
            {item.date}
          </span>
          {item.category === 'highlights' && (
            <span className="text-[10px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">
              ★ Favorite
            </span>
          )}
        </div>
        <p className="mt-2 font-display text-base font-semibold text-wine-800 leading-snug line-clamp-2 sm:text-lg">
          {item.caption}
        </p>
      </div>
    </div>
  );
}
