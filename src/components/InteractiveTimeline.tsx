import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Heart,
  Calendar,
  Compass,
  List,
  Layers,
  ArrowDown,
} from 'lucide-react';
import { timeline } from '@/content';

export function InteractiveTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [viewMode, setViewMode] = useState<'cards' | 'stream'>('stream');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    if (viewMode === 'stream' && cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, timeline.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full">
      {/* ─── STICKY CHAPTER ROADMAP & VIEW TOGGLE ─── */}
      <div className="sticky top-20 z-30 mb-10 mx-auto max-w-4xl px-2">
        <div className="rounded-2xl bg-white/85 p-2 sm:p-2.5 shadow-soft border border-rose-100/80 backdrop-blur-xl">
          {/* Header Row: Chapter Count & View Mode Switcher */}
          <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-rose-100/50">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-wine-900 tracking-wide">
                Chapter {activeStep + 1} of {timeline.length}
              </span>
              <span className="hidden sm:inline-block text-xs text-wine-400 font-medium">
                • {timeline[activeStep].title}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-cream-100/80 p-0.5 rounded-xl border border-rose-100/50">
              <button
                onClick={() => setViewMode('stream')}
                className={[
                  'flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer',
                  viewMode === 'stream'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-wine-500 hover:text-wine-800',
                ].join(' ')}
              >
                <List className="h-3 w-3" />
                <span>Story Road</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={[
                  'flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer',
                  viewMode === 'cards'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-wine-500 hover:text-wine-800',
                ].join(' ')}
              >
                <Layers className="h-3 w-3" />
                <span>Step-by-Step</span>
              </button>
            </div>
          </div>

          {/* Scroller Nodes */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
            {timeline.map((item, i) => {
              const isCurrent = i === activeStep;
              const isPassed = i < activeStep;
              return (
                <button
                  key={item.date}
                  onClick={() => scrollToStep(i)}
                  className={[
                    'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all cursor-pointer border',
                    isCurrent
                      ? 'bg-rose-500 text-white border-rose-400 shadow-sm shadow-rose-500/20 scale-105'
                      : isPassed
                      ? 'bg-rose-50 text-rose-700 border-rose-200/70 hover:bg-rose-100'
                      : 'bg-white/60 text-wine-600 border-transparent hover:bg-rose-50/50',
                  ].join(' ')}
                >
                  <span className={['text-[10px] font-mono font-bold', isCurrent ? 'text-white' : 'text-rose-400'].join(' ')}>
                    0{i + 1}
                  </span>
                  <span className="truncate max-w-[100px] sm:max-w-none">{item.date}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── MODE 1: STEP-BY-STEP STORY CARDS ─── */}
      {viewMode === 'cards' && (
        <div className="mx-auto max-w-2xl px-4 animate-fade-in">
          {(() => {
            const currentItem = timeline[activeStep];
            const Icon = currentItem.icon;
            return (
              <div className="relative overflow-hidden rounded-3xl bg-white p-7 sm:p-10 shadow-2xl border border-rose-100/80 transition-all duration-500">
                {/* Ambient Decorative Gradient Orbs */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />

                {/* Card Header */}
                <div className="relative flex items-center justify-between gap-4 pb-6 mb-6 border-b border-rose-100/60">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/25">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </span>
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                        <Calendar className="h-3 w-3 text-gold-500" />
                        {currentItem.date}
                      </span>
                      <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-wine-900 leading-tight">
                        {currentItem.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-3xl sm:text-4xl font-mono font-extrabold text-rose-200/80">
                    0{activeStep + 1}
                  </span>
                </div>

                {/* Card Body */}
                <div className="relative">
                  <p className="font-body text-base sm:text-lg leading-relaxed text-wine-700 font-normal">
                    {currentItem.body}
                  </p>
                </div>

                {/* Step Controls Footer */}
                <div className="mt-8 pt-6 border-t border-rose-100/60 flex items-center justify-between gap-4">
                  <button
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    className="flex items-center gap-1.5 rounded-full bg-cream-50 px-4 py-2 text-xs font-bold text-wine-800 border border-rose-100 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Chapter
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={activeStep === timeline.length - 1}
                    className="btn-primary flex items-center gap-1.5 px-5 py-2 text-xs uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    Next Chapter
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ─── MODE 2: STORY ROAD STREAM (ORIGINAL 3D CONNECTED TIMELINE) ─── */}
      {viewMode === 'stream' && (
        <div className="relative mx-auto max-w-4xl px-3 sm:px-6">
          {/* Glowing Animated Gradient Spine */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-8 w-1 sm:-translate-x-1/2 rounded-full bg-gradient-to-b from-rose-400 via-amber-300 to-rose-600 shadow-sm shadow-rose-400/30" />

          <div className="space-y-12 sm:space-y-16">
            {timeline.map((item, i) => {
              const isEven = i % 2 === 0;
              const Icon = item.icon;
              const isCurrent = i === activeStep;

              return (
                <div
                  key={item.date}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setActiveStep(i)}
                  className={[
                    'reveal relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 transition-all duration-500',
                    isEven ? 'sm:flex-row-reverse' : '',
                  ].join(' ')}
                >
                  {/* Glowing Milestone Center Marker */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div
                      className={[
                        'grid h-12 w-12 place-items-center rounded-2xl transition-all duration-500 shadow-md',
                        isCurrent
                          ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white ring-4 ring-rose-200 scale-110 shadow-rose-500/30'
                          : 'bg-white text-rose-500 ring-2 ring-rose-100 hover:scale-105',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Spacer for 2-column Desktop Balance */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Milestone Story Card */}
                  <div className="w-full sm:w-1/2 pl-14 sm:pl-0">
                    <div
                      className={[
                        'group relative overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-soft border transition-all duration-300 hover:shadow-card hover:-translate-y-1',
                        isCurrent ? 'border-rose-300 shadow-rose-500/10 ring-1 ring-rose-200' : 'border-rose-100/70',
                      ].join(' ')}
                    >
                      {/* Left/Right Top Color Accent Bar */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500" />

                      {/* Header row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                          <Calendar className="h-3 w-3 text-gold-500" />
                          {item.date}
                        </span>
                        <span className="text-xs font-mono font-bold text-wine-400">
                          0{i + 1}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-wine-800 leading-snug">
                        {item.title}
                      </h3>

                      {/* Body description */}
                      <p className="mt-3 font-body text-base leading-relaxed text-wine-600/90 font-normal">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
