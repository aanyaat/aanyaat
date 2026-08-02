import { useEffect, useRef, useState } from 'react';
import { Music2, Volume2, VolumeX } from 'lucide-react';

/**
 * A soft, royalty-free ambient loop is embedded as a short data-less
 * synthetic tone generated via the Web Audio API so the site ships
 * with zero external audio assets and never breaks autoplay policies.
 * The user toggles play/pause; nothing plays until they interact.
 */
export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    return () => {
      stop();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const start = () => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    gainRef.current = master;

    // A gentle, dreamy chord (A major 7-ish) with slow detune drift.
    const freqs = [220, 277.18, 329.63, 440];
    const types: OscillatorType[] = ['sine', 'sine', 'triangle', 'sine'];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = types[i];
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.25;
      // slow LFO-ish wobble via detune
      osc.detune.value = (i - 1.5) * 4;
      osc.connect(g);
      g.connect(master);
      osc.start();
      nodesRef.current.push(osc);
    });

    // fade in
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.06, now + 1.6);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const master = gainRef.current;
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.4);
    }
    window.setTimeout(() => {
      nodesRef.current.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      nodesRef.current = [];
    }, 500);
  };

  const toggle = async () => {
    if (playing) {
      stop();
      setPlaying(false);
      return;
    }
    if (!ctxRef.current) {
      start();
    } else {
      // resume + fade back in
      await ctxRef.current.resume();
      const master = gainRef.current!;
      const now = ctxRef.current.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.06, now + 1.2);
    }
    setPlaying(true);
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute background music' : 'Play background music'}
      aria-pressed={playing}
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-wine-700 text-cream-100 shadow-card transition-all duration-300 hover:scale-105 hover:bg-wine-600"
    >
      <span
        className={[
          'absolute inset-0 rounded-full bg-rose-400/40',
          playing ? 'animate-pulse-ring' : '',
        ].join(' ')}
      />
      {playing ? (
        <Volume2 className="relative h-5 w-5" />
      ) : (
        <VolumeX className="relative h-5 w-5" />
      )}
      <Music2
        className={[
          'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5',
          playing ? 'animate-spin text-gold-300' : 'text-gold-400/70',
        ].join(' ')}
      />
    </button>
  );
}
