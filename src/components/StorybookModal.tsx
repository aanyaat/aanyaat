import { useState } from 'react';
import { X, Printer, Heart, Sparkles, BookOpen, Gift, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { person, wishes, timeline } from '@/content';

export function StorybookModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeChapter, setActiveChapter] = useState<'all' | 'reasons' | 'timeline' | 'coupons' | 'letter'>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-2 sm:p-6 overflow-y-auto animate-fade-in">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #storybook-print-area, #storybook-print-area * {
            visibility: visible;
          }
          #storybook-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #4c0519 !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Glass Book Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[2.5rem] bg-cream-50/95 shadow-2xl border border-white/80 overflow-hidden text-wine-900 animate-scale-in">
        
        {/* Header Action Bar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-rose-200/60 bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft">
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-wine-900">
                Our Storybook Keepsake
              </h3>
              <p className="font-body text-xs text-wine-500/70">
                Created with love for {person.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 font-body text-xs font-bold shadow-soft transition-all cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-rose-100 hover:bg-rose-200 p-2 text-wine-700 transition-all cursor-pointer"
              title="Close Storybook"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chapter Filter Pill Strip */}
        <div className="no-print flex items-center gap-1.5 px-6 py-2.5 bg-rose-50/60 border-b border-rose-100 overflow-x-auto">
          {[
            { id: 'all', label: 'Full Storybook' },
            { id: 'reasons', label: '1. Reasons I Adore You' },
            { id: 'timeline', label: '2. Our Journey' },
            { id: 'coupons', label: '3. Little Coupons' },
            { id: 'letter', label: '4. Akhil\'s Letter' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChapter(tab.id as any)}
              className={[
                'rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                activeChapter === tab.id
                  ? 'bg-wine-900 text-white shadow-soft'
                  : 'bg-white/60 text-wine-700 hover:bg-white',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Storybook Pages Area */}
        <div id="storybook-print-area" className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-12 bg-cream-50/50">
          
          {/* ─── COVER PAGE ─── */}
          {(activeChapter === 'all' || activeChapter === 'reasons') && (
            <div className="rounded-3xl bg-white p-8 sm:p-12 text-center shadow-card border border-rose-100 border-t-8 border-t-rose-500">
              <span className="chip bg-rose-100 text-rose-600 mx-auto">
                <Sparkles className="h-3.5 w-3.5" />
                The Story of Us
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold text-wine-900 sm:text-5xl">
                For {person.name}
              </h1>
              <p className="mt-2 font-display text-xl text-rose-600 font-semibold italic">
                A Birthday Storybook & Timeless Archive
              </p>
              <p className="mx-auto mt-4 max-w-lg font-body text-sm text-wine-600/90 leading-relaxed">
                Every page, every word, every note written by hand and heart — because you deserve something that exists only for you.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-wine-800 border border-rose-200">
                <span>🎂 {person.birthDateDisplay}</span>
                <span>•</span>
                <span>Made with love by Akhil</span>
              </div>
            </div>
          )}

          {/* ─── CHAPTER 1: REASONS I ADORE YOU ─── */}
          {(activeChapter === 'all' || activeChapter === 'reasons') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-200 pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500 text-white shadow-soft">
                  <Heart className="h-4 w-4" />
                </span>
                <h2 className="font-display text-2xl font-bold text-wine-900">
                  Chapter I: Reasons I Adore You
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {wishes.map((w, idx) => (
                  <div
                    key={w.title}
                    className="rounded-2xl bg-white p-5 shadow-soft border border-rose-100/80 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-display text-xs font-bold text-rose-500">
                        Reason #{idx + 1}
                      </span>
                      <h4 className="mt-1 font-display text-base font-bold text-wine-800">
                        {w.title}
                      </h4>
                      <p className="mt-2 font-body text-xs text-wine-600/90 leading-relaxed">
                        {w.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CHAPTER 2: OUR TIMELINE & JOURNEY ─── */}
          {(activeChapter === 'all' || activeChapter === 'timeline') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-200 pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold-500 text-white shadow-soft">
                  <MapPin className="h-4 w-4" />
                </span>
                <h2 className="font-display text-2xl font-bold text-wine-900">
                  Chapter II: The Journey of Us
                </h2>
              </div>

              <div className="space-y-4">
                {timeline.map((t, idx) => (
                  <div
                    key={t.title}
                    className="rounded-2xl bg-white p-5 shadow-soft border border-rose-100 flex items-start gap-4"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600 font-display text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-display text-base font-bold text-wine-900">{t.title}</h4>
                        <span className="font-body text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full">
                          {t.date}
                        </span>
                      </div>
                      <p className="mt-2 font-body text-xs text-wine-600/90 leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CHAPTER 3: THE COUPON BOOK ─── */}
          {(activeChapter === 'all' || activeChapter === 'coupons') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-200 pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white shadow-soft">
                  <Gift className="h-4 w-4" />
                </span>
                <h2 className="font-display text-2xl font-bold text-wine-900">
                  Chapter III: The Coupon Collection
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: 'Any Food, My Treat 🍕', body: 'Whatever you\'re craving, anywhere in Bengaluru, Delhi, or beyond.' },
                  { title: 'One Free Pass 🕊️', body: 'When I\'m being annoying or won\'t stop talking — play this and I\'ll shut up instantly.' },
                  { title: 'Midnight Chai & Yapping ☕', body: 'No sleep, just late-night conversations about everything and nothing.' },
                  { title: 'Movie Marathon with Zero Sleep 🎬', body: 'A whole day of our favorite Marvel & sitcom shows with zero chores.' },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl bg-white p-4 shadow-soft border-2 border-dashed border-rose-200 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-wine-900">{c.title}</h4>
                      <p className="mt-1 font-body text-xs text-wine-600/90">{c.body}</p>
                      <span className="mt-2 inline-block font-body text-[10px] font-bold uppercase tracking-wider text-rose-500">
                        Valid Forever • No Expiry
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CHAPTER 4: LETTER FROM AKHIL ─── */}
          {(activeChapter === 'all' || activeChapter === 'letter') && (
            <div className="rounded-3xl bg-wine-900 p-8 sm:p-10 text-cream-100 shadow-xl border border-wine-800">
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                To My Ladyy, Forever
              </h3>
              <p className="font-handwriting text-lg leading-relaxed text-cream-200 italic mb-4">
                "Aree Baba ye toh bas first step hai Next toh aapke liye Dress Select Karna hai, Jo bhi pasand hai yaad se bhej dena — I want to see you in it, something which i bought for my ladyy"
              </p>
              <p className="font-body text-sm text-cream-100/90 leading-relaxed mb-4">
                Thank you for being full of life, curiosity, care, and love. Distance between Bengaluru and Delhi is only geography — you are always in my heart.
              </p>
              <div className="text-right font-handwriting text-xl font-bold text-gold-300">
                — {person.fromYou}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
