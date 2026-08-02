import { useEffect, useState } from 'react';

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isToday: boolean;
};

function compute(target: number): Countdown {
  const totalMs = Math.max(0, target - Date.now());
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1_000);
  // "isToday" = within the birthday window (that calendar day, local).
  const targetDate = new Date(target);
  const now = new Date();
  const isToday =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();
  return { days, hours, minutes, seconds, totalMs, isToday };
}

export function useCountdown(targetIso: string): Countdown {
  const target = new Date(targetIso).getTime();
  const [state, setState] = useState<Countdown>(() => compute(target));

  useEffect(() => {
    const tick = () => setState(compute(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return state;
}
