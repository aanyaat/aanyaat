import { person } from '@/content';
import type { Countdown } from '@/lib/useCountdown';

export function CountdownDisplay({ cd }: { cd: Countdown }) {
  if (cd.isToday) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-white/75 backdrop-blur-xl p-6 text-center shadow-card border border-white/80">
        <p className="font-display text-4xl font-extrabold text-gradient-rose sm:text-5xl">
          It’s today! 🎉
        </p>
        <p className="mt-3 font-body text-lg text-wine-800 font-medium">
          Happy birthday, {person.nickname}. The countdown is over — let’s celebrate!
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
    <div className="mx-auto inline-block max-w-xl rounded-3xl bg-white/60 backdrop-blur-xl p-5 sm:p-7 text-center shadow-card border border-white/80 ring-1 ring-white/60">
      <p className="mb-4 font-body text-xs font-bold uppercase tracking-[0.25em] text-wine-700">
        Counting down to {person.birthDateDisplay}
      </p>
      <div className="flex items-stretch justify-center gap-2 sm:gap-4">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-stretch gap-2 sm:gap-4">
            <div className="flex w-16 flex-col items-center justify-center rounded-2xl bg-white/85 p-2.5 sm:w-24 sm:py-4 shadow-soft border border-white ring-1 ring-rose-100">
              <span
                key={u.value}
                className="font-display text-3xl font-extrabold tabular-nums text-rose-600 sm:text-5xl"
                style={{ animation: 'bounce-in 0.4s ease both' }}
              >
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest text-wine-800 sm:text-xs">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="self-center font-display text-2xl font-bold text-rose-400 sm:text-4xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
