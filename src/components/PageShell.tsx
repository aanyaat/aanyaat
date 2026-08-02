import type { ReactNode } from 'react';
import { FloatingHearts } from '@/components/FloatingHearts';
import { useReveal } from '@/lib/useReveal';

export function PageShell({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="relative">
      <FloatingHearts />
      <div className="relative">{children}</div>
    </div>
  );
}
