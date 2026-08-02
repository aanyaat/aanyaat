import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  shape: number; // 0 rect, 1 circle
};

const COLORS = ['#f94f73', '#e8b62a', '#f9e28a', '#ffabb9', '#c02048', '#fffbeb'];

/**
 * Full-screen confetti burst rendered to a single canvas overlay.
 * Returns a ref to attach to a <canvas> and a fire() trigger.
 * Pass `fireOnMount` to celebrate immediately (e.g. birthday is today).
 */
export function useConfetti(fireOnMount = false) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const step = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const gravity = 0.12;
      const drag = 0.992;
      const arr = particlesRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.vy += gravity;
        p.vx *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
        if (p.y > window.innerHeight + 40) arr.splice(i, 1);
      }
      if (arr.length > 0) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const fire = (count = 160) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = window.innerWidth;
    for (let i = 0; i < count; i++) {
      const fromLeft = Math.random() > 0.5;
      const x = fromLeft ? -20 + Math.random() * 60 : W + 20 - Math.random() * 60;
      const y = Math.random() * window.innerHeight * 0.5 + 40;
      particlesRef.current.push({
        x,
        y,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        vx: (fromLeft ? 1 : -1) * (3 + Math.random() * 7),
        vy: -2 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? 1 : 0,
      });
    }
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        // kick the loop (defined in effect) by re-requesting
        const tick = () => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          const arr = particlesRef.current;
          for (let i = arr.length - 1; i >= 0; i--) {
            const p = arr[i];
            p.vy += 0.12;
            p.vx *= 0.992;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vrot;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            if (p.shape === 1) {
              ctx.beginPath();
              ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
            if (p.y > window.innerHeight + 40) arr.splice(i, 1);
          }
          if (arr.length > 0) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            rafRef.current = null;
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      });
    }
  };

  useEffect(() => {
    if (fireOnMount) {
      const t = setTimeout(() => fire(180), 600);
      return () => clearTimeout(t);
    }
  }, [fireOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

  return { canvasRef, fire };
}
