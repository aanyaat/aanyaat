import { Heart } from 'lucide-react';

/**
 * Soft floating hearts + glow blobs used as a page-wide background
 * decoration. Purely presentational, pointer-events disabled.
 */
export function FloatingHearts({ count = 9 }: { count?: number }) {
  const hearts = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-gold-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-100/40 blur-3xl" />
      {hearts.map((i) => {
        const left = (i * 97) % 100;
        const size = 12 + ((i * 7) % 18);
        const delay = (i * 1.3) % 8;
        const dur = 7 + ((i * 2) % 6);
        const opacity = 0.08 + ((i * 3) % 10) / 100;
        return (
          <Heart
            key={i}
            className="absolute animate-float-slow text-rose-400"
            style={{
              left: `${left}%`,
              top: `${10 + ((i * 11) % 70)}%`,
              width: size,
              height: size,
              opacity,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
            fill="currentColor"
          />
        );
      })}
    </div>
  );
}
