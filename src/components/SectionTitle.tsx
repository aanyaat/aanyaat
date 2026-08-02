import type { ReactNode } from 'react';

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
}) {
  return (
    <div
      className={[
        'reveal max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      ].join(' ')}
    >
      {eyebrow && (
        <span className="chip bg-rose-100 text-rose-600">{eyebrow}</span>
      )}
      <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-wine-700 sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-body text-lg leading-relaxed text-wine-500/80">
          {subtitle}
        </p>
      )}
    </div>
  );
}
