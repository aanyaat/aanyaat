import { useEffect, useRef, useState } from 'react';

/**
 * A scratch-off foil overlay. Render it on top of any content; the user
 * drags/finger-rubs to wipe the foil away. Once enough is cleared the foil
 * fades out and `onReveal` fires — the content underneath was always there
 * and now stays visible.
 */
export function ScratchOverlay({ onReveal }: { onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const revealedRef = useRef(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFoil(ctx, rect.width, rect.height);

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const scratchAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 30;
      const last = lastPosRef.current;
      if (last) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
      lastPosRef.current = { x, y };
    };

    const progress = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return 0;
      const step = 10;
      let cleared = 0;
      let total = 0;
      const img = ctx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          total++;
          if (img[(y * w + x) * 4 + 3] < 128) cleared++;
        }
      }
      return total ? cleared / total : 0;
    };

    const maybeReveal = () => {
      if (revealedRef.current) return;
      if (progress() > 0.4) {
        revealedRef.current = true;
        setFading(true);
        window.setTimeout(() => onRevealRef.current(), 320);
      }
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      drawingRef.current = true;
      lastPosRef.current = null;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const p = pos(e);
      scratchAt(p.x, p.y);
    };
    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const p = pos(e);
      scratchAt(p.x, p.y);
    };
    const onUp = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      lastPosRef.current = null;
      maybeReveal();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-10 h-full w-full rounded-3xl ${
        fading ? 'opacity-0 transition-opacity duration-300' : ''
      }`}
      style={{ touchAction: 'none' }}
      aria-label="Scratch to reveal your coupon"
      role="img"
    />
  );
}

function drawFoil(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#9d1b3e');
  g.addColorStop(0.45, '#e8b62a');
  g.addColorStop(1, '#c02048');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // dotted metallic texture
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  for (let y = 6; y < h; y += 16) {
    for (let x = 6; x < w; x += 16) {
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // instructions
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,251,235,0.95)';
  ctx.font = '700 17px Georgia, serif';
  ctx.fillText('Scratch to reveal', w / 2, h / 2 - 8);
  ctx.font = '400 12px Georgia, serif';
  ctx.fillStyle = 'rgba(255,251,235,0.78)';
  ctx.fillText('rub with your finger ✦', w / 2, h / 2 + 14);
}
