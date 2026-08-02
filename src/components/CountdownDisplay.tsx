import { person } from '@/content';
import type { Countdown } from '@/lib/useCountdown';

export function CountdownDisplay({ cd }: { cd: Countdown }) {
  if (cd.isToday) {
    return (
      <div className="text-center">
        <p className="font-display text-4xl font-semibold text-gradient-gold sm:text-5xl">
          It’s today!
        </p>
        <p className="mt-3 font-body text-lg text-cream-100/90">
          Happy birthday, {person.nickname}. The countdown is over — let’s celebrate.
        </p>
      </div>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: cd.days },
    { label: 'Hours', value: cd.hours },
    { label: 'Minutes', value: cd.minutes },
    { label: 'Seconds', value: cd.seconds },
  ];

  return (
    <div className="text-center">
      <p className="mb-5 font-body text-sm uppercase tracking-[0.3em] text-cream-200/80">
        Counting down to {person.birthDateDisplay}
      </p>
      <div className="flex items-stretch justify-center gap-2.5 sm:gap-4">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-stretch gap-2.5 sm:gap-4">
            <div className="flex w-16 flex-col items-center rounded-2xl bg-white/10 px-2 py-4 backdrop-blur-md sm:w-24 sm:py-5">
              <span
                key={u.value}
                className="font-display text-3xl font-bold tabular-nums text-white sm:text-5xl"
                style={{ animation: 'bounce-in 0.4s ease both' }}
              >
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="mt-1 font-body text-[10px] uppercase tracking-widest text-cream-200/70 sm:text-xs">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="self-center font-display text-2xl text-rose-300/60 sm:text-4xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
