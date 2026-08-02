import { Heart } from 'lucide-react';
import { person } from '@/content';
import { useRouter } from '@/lib/router';

export function Footer() {
  const { navigate } = useRouter();
  return (
    <footer className="relative mt-24 overflow-hidden bg-wine-700 text-cream-100">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
        <Heart
          className="mx-auto mb-5 h-8 w-8 animate-heart-beat text-rose-300"
          fill="currentColor"
        />
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
One more year of you.
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-cream-200/90">
          Happy birthday, {person.name}. Here's to more reels shared at midnight, more chai in bed, and every "good nighttt" still to come.
        </p>

        <button
          onClick={() => navigate('/wishes')}
          className="btn-primary mt-8 bg-rose-400 hover:bg-rose-300"
        >
          Read my wishes for you
        </button>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="font-display text-sm italic text-cream-300">
            {person.fromYou}
          </p>
          <p className="mt-2 font-body text-xs text-cream-300/60">
            Made with love, just for you — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
