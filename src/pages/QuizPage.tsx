import { useEffect, useState } from 'react'; import { Check, X, PartyPopper, RotateCcw, ArrowRight } from 'lucide-react';
import { quiz, person } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useConfetti } from '@/lib/useConfetti';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { useRouter } from '@/lib/router';

type Phase = 'idle' | 'answered';

export function QuizPage() {
  const { navigate } = useRouter();
  const { canvasRef, fire } = useConfetti(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [done, setDone] = useState(false);

  // 👇 ADD THESE HERE
  useEffect(() => {
    console.log("Quiz mounted");

    return () => {
      console.log("Quiz unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("STATE", {
      score,
      finalScore,
      done,
      idx,
      picked,
      phase,
    });
  }, [score, finalScore, done, idx, picked, phase]);

  // Existing code
  const q = quiz[idx];

  const pick = (i: number) => {
    if (phase === 'answered') return;
    setPicked(i);
    setPhase('answered');
    console.log({
      clicked: i,
      answer: q.answer,
      correct: i === q.answer,
    });

    if (i === q.answer) {
      const newScore = score + 1;
      console.log("Updating score to", newScore);
      setScore(newScore);
      fire(30);
    }
  };

  const next = () => {
    if (idx + 1 >= quiz.length) {
      setFinalScore(score);
      setDone(true);
      fire(200);
      return;
    }

    setIdx((n) => n + 1);
    setPicked(null);
    setPhase('idle');
  };

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setPhase('idle');
    setScore(0);
    setDone(false);
  };

  const displayScore = done ? finalScore : score;
  const perfect = displayScore === quiz.length;
  return (
    <PageShell>
      <ConfettiOverlay canvasRef={canvasRef} />
      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="A little game"
            title={
              <>
                How well do you know <span className="text-gradient-rose">us</span>?
              </>
            }
            subtitle={`Six questions about things only the two of us would know. No pressure, ${person.nickname} — you already know all of these.`}
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          {!done ? (
            <>
              {/* progress */}
              <div className="reveal mb-6">
                <div className="mb-2 flex items-center justify-between font-body text-sm text-wine-500">
                  <span>
                    Question {idx + 1} of {quiz.length}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-rose-600">
                    <PartyPopper className="h-4 w-4" />
                    {displayScore} correct
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-gold-400 transition-all duration-500"
                    style={{ width: `${((idx + (phase === 'answered' ? 1 : 0)) / quiz.length) * 100}%` }}
                  />
                </div>
              </div>

              <div key={idx} className="reveal rounded-3xl bg-white p-7 shadow-soft sm:p-9 animate-fade-up">
                <h3 className="font-display text-2xl font-semibold text-wine-700">
                  {q.question}
                </h3>
                <div className="mt-6 grid gap-3">
                  {q.options.map((opt, i) => {
                    const isAnswer = i === q.answer;
                    const isPicked = i === picked;
                    const show = phase === 'answered';
                    return (
                      <button
                        key={opt}
                        onClick={() => pick(i)}
                        disabled={phase === 'answered'}
                        className={[
                          'group flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-body text-base transition-all duration-300',
                          show && isAnswer
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : show && isPicked && !isAnswer
                              ? 'border-rose-400 bg-rose-50 text-rose-700'
                              : 'border-rose-100 bg-white text-wine-700 hover:border-rose-300 hover:bg-rose-50',
                          phase === 'answered' ? 'cursor-default' : 'cursor-pointer',
                        ].join(' ')}
                      >
                        <span>{opt}</span>
                        {show && isAnswer && <Check className="h-5 w-5 text-emerald-500" />}
                        {show && isPicked && !isAnswer && <X className="h-5 w-5 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {phase === 'answered' && (
                  <div className="mt-6 animate-fade-up rounded-2xl bg-cream-100 p-5">
                    <p className="font-body text-base leading-relaxed text-wine-600">
                      <span className="font-display font-semibold text-rose-600">
                        {picked === q.answer ? 'You got it. ' : 'Close — '}
                      </span>
                      {q.story}
                    </p>
                    <button onClick={next} className="btn-primary mt-5">
                      {idx + 1 >= quiz.length ? 'See my score' : 'Next question'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-3xl bg-white p-9 text-center shadow-card">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-gold-400 text-white shadow-glow">
                <PartyPopper className="h-10 w-10" />
              </div>
              <h3 className="mt-6 font-display text-3xl font-semibold text-wine-700">
                {perfect ? 'A perfect score!' : `${displayScore} out of ${quiz.length}`}
              </h3>
              <p className="mt-3 font-body text-lg text-wine-500/90">
                {perfect
                  ? 'Of course you knew every one. Who else would?'
                  : score >= quiz.length - 1
                    ? 'Almost perfect — you clearly know us better than almost anyone.'
                    : 'Hey, that’s still more than anyone else on earth would get. It’s us.'}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={restart} className="btn-ghost">
                  <RotateCcw className="h-4 w-4" />
                  Play again
                </button>
                <button onClick={() => navigate('/gifts')} className="btn-primary">
                  Last stop: music & gifts
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
