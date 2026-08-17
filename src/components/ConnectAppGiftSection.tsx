import { useState } from 'react';
import {
  Smartphone,
  Globe,
  Heart,
  Sparkles,
  Download,
  ExternalLink,
  Zap,
  MapPin,
  Palette,
  Clock,
  Radio,
  History,
  Send,
  Battery,
  Flame,
} from 'lucide-react';

interface FeatureTour {
  id: string;
  icon: any;
  title: string;
  badge: string;
  summary: string;
  details: string;
  screenTitle: string;
  screenSubtitle: string;
  screenEmoji: string;
  accentGradient: string;
}

const features: FeatureTour[] = [
  {
    id: 'love-moments',
    icon: Send,
    title: 'Instant Love Moments',
    badge: '1-Tap Love Buzz',
    summary: 'Send instant one-tap love notes: "Thinking of you", "I Miss You", "Good Morning", "Call me", or custom quick messages.',
    details: 'Each moment is delivered in under 50ms with live battery status and online presence sync so you always feel close.',
    screenTitle: 'Aanya & Me · Home',
    screenSubtitle: 'Sent: "Thinking of you right now ❤️"',
    screenEmoji: '💖',
    accentGradient: 'from-rose-500 via-pink-500 to-rose-600',
  },
  {
    id: 'heartbeat',
    icon: Heart,
    title: 'Live Heartbeat Touch',
    badge: 'Realtime Haptics',
    summary: 'Hold your finger on the screen to send live heartbeat vibrations directly into your partner\'s phone.',
    details: 'Whenever you miss me, hold down the heartbeat touch pad. Your phone vibrates and pulses in real time, no matter how far apart we are.',
    screenTitle: 'Heartbeat Touch & Pulse',
    screenSubtitle: 'Sending live 72 BPM heartbeat haptics...',
    screenEmoji: '💓',
    accentGradient: 'from-rose-500 via-pink-600 to-purple-600',
  },
  {
    id: 'glance',
    icon: Clock,
    title: '1-Hour Live Glance',
    badge: 'Disappearing Stories',
    summary: 'Share a quick photo, 3-second live video moment, or voice whisper that auto-clears after 1 hour.',
    details: 'A clean 2-card tray clearly separating Your Glance and Aanya\'s Glance. Share candid moments throughout your day without cluttering storage.',
    screenTitle: '1-Hour Live Glance Tray',
    screenSubtitle: 'Aanya shared a new glance! (Expires in 48m)',
    screenEmoji: '⏱️',
    accentGradient: 'from-purple-500 via-pink-500 to-rose-500',
  },
  {
    id: 'doodle',
    icon: Palette,
    title: 'Live Shared Doodle Canvas',
    badge: 'Draw Together',
    summary: 'A real-time shared drawing board where we can sketch, write love notes, and doodle together.',
    details: 'Pick glowing colors, draw little hearts or silly sketches together in real time on a romantic dark canvas with instant undo and clear.',
    screenTitle: 'Live Doodle Canvas',
    screenSubtitle: 'Akhil is drawing a heart... ❤️',
    screenEmoji: '🎨',
    accentGradient: 'from-amber-500 via-rose-500 to-pink-500',
  },
  {
    id: 'love-map',
    icon: MapPin,
    title: 'Places & Love Map',
    badge: 'Our Date Spots',
    summary: 'Pin our favorite cafes, date spots, airport memories, and see our live coordinates and distance.',
    details: 'Tag the places we love, the restaurants we want to visit, and keep track of all the coordinates that hold our favorite memories together.',
    screenTitle: 'Our Places & Map',
    screenSubtitle: 'Bengaluru ⇄ Delhi · Distance: 1,740 km',
    screenEmoji: '📍',
    accentGradient: 'from-blue-500 via-indigo-500 to-rose-500',
  },
  {
    id: 'history',
    icon: History,
    title: 'Moment History & Keepsake',
    badge: 'Never Forget',
    summary: 'A timeline of every love moment sent, with timestamps, search, and "Keep Forever" pin.',
    details: 'Every sweet moment, SOS, custom note, and haptic touch is preserved in a searchable timeline so we never lose our memories.',
    screenTitle: 'Shared Timeline & History',
    screenSubtitle: 'All moments safely recorded & synced',
    screenEmoji: '📜',
    accentGradient: 'from-emerald-500 via-teal-500 to-rose-500',
  },
];

export function ConnectAppGiftSection() {
  const [activeTab, setActiveTab] = useState<string>('love-moments');
  const [pulseActive, setPulseActive] = useState<boolean>(false);

  const selectedFeature = features.find((f) => f.id === activeTab) || features[0];

  const triggerPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 600);
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <section id="gift-app" className="px-4 sm:px-6 pb-20 scroll-mt-28">
      <div className="reveal mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/95 via-cream-50/90 to-rose-50/80 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-card border border-rose-200/80 border-t-4 border-t-rose-500 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 border border-rose-300 shadow-sm text-xs font-bold text-rose-800">
            <Sparkles className="h-3.5 w-3.5 text-rose-600 animate-spin-slow" />
            <span>Special Couple Gift · Made Just for You</span>
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-wine-900 tracking-tight">
            Aanya &amp; Me —{' '}
            <span className="text-gradient-rose">Our Private Couple App</span>
          </h2>

          <p className="mt-4 font-body text-base sm:text-lg text-wine-800 leading-relaxed font-medium">
            I built a dedicated private app just for the two of us. I want us to always be able to connect with each other — no matter how busy the day gets or how far apart we might be.
          </p>
        </div>

        {/* Personal Handwritten Letter Box with high-contrast text */}
        <div className="mt-8 rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-8 border border-rose-200 shadow-soft relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
              <Heart className="h-4.5 w-4.5 fill-white" />
            </span>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-wine-900">
                Why I built this for us
              </h3>
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                A personal message from Akhil
              </p>
            </div>
          </div>

          <p className="font-body text-sm sm:text-base leading-relaxed text-wine-800 font-medium">
            "Whenever you miss me, want to send a quick live glance, feel my heartbeat, draw something silly on a shared screen, or drop a love buzz that lights up your phone on your locked screen — you don't have to look through ten different apps or crowded feeds. This is our quiet, private corner of the world. No ads, no followers, no noise. Just you and me, always connected."
          </p>
        </div>

        {/* ─── DUAL ACCESS HUB (Direct APK Download + Web Version) ─── */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {/* Card 1: Native Android APK (Direct download, zero GitHub) */}
          <div className="rounded-3xl bg-gradient-to-br from-wine-950 via-rose-950 to-wine-900 p-6 text-white shadow-card border border-rose-500/40 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-[11px] font-bold text-emerald-300">
                  <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  Recommended · Instant Lock-Screen Haptics (0ms)
                </span>
                <Smartphone className="w-6 h-6 text-rose-300" />
              </div>

              <h4 className="mt-4 font-display text-xl font-bold text-white">
                Download Android App (.APK)
              </h4>
              <p className="mt-2 font-body text-xs sm:text-sm text-cream-100/90 leading-relaxed">
                Full native Android experience: lights up your lock screen, vibrates with custom pulses, zero battery drain, and works in an instant background stream.
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/app-debug.apk"
                download="Aanya-and-Me.apk"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Aanya &amp; Me APK</span>
              </a>
              <p className="text-center text-[11px] text-cream-200/70 mt-2">
                Direct download · 1-tap install on your Android phone
              </p>
            </div>
          </div>

          {/* Card 2: Web App Link */}
          <div className="rounded-3xl bg-white p-6 text-wine-900 shadow-soft border border-rose-200 flex flex-col justify-between hover:shadow-card transition-all">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[11px] font-bold text-rose-800 border border-rose-200">
                  <Globe className="w-3 h-3 text-rose-600" />
                  Zero Storage Needed · Instant Browser Access
                </span>
                <Radio className="w-6 h-6 text-rose-600" />
              </div>

              <h4 className="mt-4 font-display text-xl font-bold text-wine-900">
                Open Web Version
              </h4>
              <p className="mt-2 font-body text-xs sm:text-sm text-wine-700 leading-relaxed font-medium">
                And before you say <i>"I don't have storage for another app"</i> 😂 — you can open it directly in Safari, Chrome, or any browser with zero installation!
              </p>
            </div>

            <div className="mt-6">
              <a
                href="https://aanya-and-me.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-rose-600" />
                <span>Open aanya-and-me.pages.dev</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <p className="text-center text-[11px] text-wine-600 font-medium mt-2">
                Tip: You can also tap "Add to Home Screen" to use it like an app!
              </p>
            </div>
          </div>
        </div>

        {/* ─── INTERACTIVE APP TOUR & FEATURE SIMULATOR ─── */}
        <div className="mt-14 pt-10 border-t border-rose-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="chip bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
              <Sparkles className="w-3 h-3 text-rose-600" />
              Interactive App Tour
            </span>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-wine-900">
              Explore how our private space works
            </h3>
            <p className="mt-2 font-body text-xs sm:text-sm text-wine-700 font-medium">
              Tap any feature below to see how it looks and test the live interactive preview.
            </p>
          </div>

          {/* Feature Tabs Selector with high contrast text */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {features.map((f) => {
              const isSelected = activeTab === f.id;
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(f.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white border-transparent shadow-md shadow-rose-500/30 scale-102 font-bold'
                      : 'bg-white hover:bg-rose-50 text-wine-900 border-rose-200 shadow-sm font-semibold'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <p className="text-xs font-bold truncate w-full text-center sm:text-left mt-1">
                    {f.title}
                  </p>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                      isSelected ? 'text-rose-100' : 'text-wine-600'
                    }`}
                  >
                    {f.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Feature Showcase & Phone Simulator with high-contrast luxury dark background */}
          <div className="mt-6 rounded-3xl bg-[#1a0717] p-6 sm:p-8 text-white shadow-2xl border border-rose-500/40 grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Description & Interactive Action */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/30 border border-rose-400/50 text-[11px] font-bold text-rose-300">
                    {selectedFeature.badge}
                  </span>
                  <span className="text-xs text-rose-200/80 font-medium">· Feature Preview</span>
                </div>

                <h4 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span>{selectedFeature.title}</span>
                  <span className="text-xl">{selectedFeature.screenEmoji}</span>
                </h4>

                <p className="mt-3 font-body text-sm sm:text-base text-cream-100 leading-relaxed font-semibold">
                  {selectedFeature.summary}
                </p>

                <p className="mt-2 font-body text-xs sm:text-sm text-rose-100/80 leading-relaxed font-normal">
                  {selectedFeature.details}
                </p>
              </div>

              {/* Interactive Simulator Trigger */}
              <div className="rounded-2xl bg-white/10 border border-white/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-white">Live Feature Simulator</p>
                  <p className="text-[11px] text-rose-200/90 font-medium">
                    {activeTab === 'heartbeat'
                      ? 'Tap the button to test live haptic heartbeat pulse'
                      : 'Simulate live action in Aanya & Me'}
                  </p>
                </div>

                <button
                  onClick={triggerPulse}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-rose-500/40 flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <Heart className={`w-3.5 h-3.5 fill-white ${pulseActive ? 'animate-ping' : ''}`} />
                  <span>{pulseActive ? 'Pulsing...' : 'Test Feature'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sleek Smartphone Bezel Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 sm:w-72 rounded-[2.5rem] bg-[#120510] p-3 shadow-2xl ring-4 ring-white/20 border border-rose-500/40 relative">
                {/* Phone Speaker & Dynamic Island */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500/60 animate-pulse" />
                  <span className="w-2.5 h-1 bg-white/30 rounded-full" />
                </div>

                {/* Simulated Screen Content */}
                <div className="rounded-[1.8rem] bg-[#220a1f] border border-white/15 p-4 flex flex-col gap-3 min-h-[320px] justify-between text-left">
                  {/* Screen Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-rose-400">
                        AANYA &amp; ME
                      </p>
                      <p className="text-xs font-bold text-white">Akhil &amp; Aanya ❤️</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[9px] font-bold border border-emerald-400/40">
                      LIVE
                    </span>
                  </div>

                  {/* Dynamic Mockup Card based on active feature */}
                  <div className="my-auto py-4 flex flex-col items-center justify-center text-center">
                    <div
                      className={`relative w-20 h-20 rounded-full bg-gradient-to-tr ${selectedFeature.accentGradient} p-1 shadow-lg flex items-center justify-center transition-all ${
                        pulseActive ? 'scale-110 shadow-rose-500/60' : ''
                      }`}
                    >
                      {pulseActive && (
                        <div className="absolute inset-0 rounded-full bg-rose-400/50 animate-ping" />
                      )}
                      <div className="w-full h-full rounded-full bg-[#180716] flex items-center justify-center text-3xl">
                        {selectedFeature.screenEmoji}
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-bold text-white">
                      {selectedFeature.screenTitle}
                    </p>
                    <p className="mt-1 text-[10px] text-cream-100/90 max-w-[200px] leading-tight font-medium">
                      {selectedFeature.screenSubtitle}
                    </p>
                  </div>

                  {/* Screen Bottom Quick Actions */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-cream-200/80 font-medium">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      Connected
                    </span>
                    <span className="text-rose-400 font-bold">0ms Realtime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3 SIMPLE STEPS TO CONNECT ─── */}
        <div className="mt-12 pt-8 border-t border-rose-200">
          <h4 className="font-display text-lg font-bold text-wine-900 text-center mb-6">
            How we get connected in 3 quick steps
          </h4>

          <div className="grid gap-4 sm:grid-cols-3 text-left">
            <div className="rounded-2xl bg-white p-4 border border-rose-200 shadow-soft">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-500 text-white text-xs font-bold mb-2">
                1
              </span>
              <h5 className="font-display text-sm font-bold text-wine-900">Open App or Web</h5>
              <p className="mt-1 font-body text-xs text-wine-700 leading-relaxed font-medium">
                Download the APK or open <a href="https://aanya-and-me.pages.dev/" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline font-bold">aanya-and-me.pages.dev</a>.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-rose-200 shadow-soft">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-500 text-white text-xs font-bold mb-2">
                2
              </span>
              <h5 className="font-display text-sm font-bold text-wine-900">Enter Pairing Code</h5>
              <p className="mt-1 font-body text-xs text-wine-700 leading-relaxed font-medium">
                One of us generates the code, the other enters it once. That's it!
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-rose-200 shadow-soft">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-500 text-white text-xs font-bold mb-2">
                3
              </span>
              <h5 className="font-display text-sm font-bold text-wine-900">Stay Connected 24/7</h5>
              <p className="mt-1 font-body text-xs text-wine-700 leading-relaxed font-medium">
                Send love notes, live heartbeat haptics, and 1-hour glances anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
