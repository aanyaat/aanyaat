import { useEffect, useState } from 'react';
import { Smartphone, Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed app)
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // Check if user dismissed recently
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 1000 * 60 * 60 * 24 * 3) {
      // Dismissed within last 3 days
      return;
    }

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture standard install prompt (Chrome / Android / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not standalone, show prompt after 4 seconds
    if (isIosDevice && !isRunningStandalone) {
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-40 animate-fade-in pointer-events-auto">
      <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl border border-white/80 ring-1 ring-rose-200">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 rounded-full p-1 text-wine-400 hover:text-wine-800 hover:bg-rose-50 transition-colors"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-soft">
            <Smartphone className="h-5 w-5 animate-heart-beat" />
          </div>

          <div className="flex-1 pr-4">
            <h4 className="font-display text-sm font-bold text-wine-900">
              Install Aanya's Birthday App 🎂
            </h4>
            <p className="mt-1 font-body text-xs text-wine-600/90 leading-relaxed">
              Add to your phone's Home Screen for the full-screen experience with zero browser bars!
            </p>

            {isIOS ? (
              <div className="mt-3 rounded-2xl bg-rose-50/80 p-2.5 text-xs text-wine-800 border border-rose-100 flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1 text-rose-600">
                  <Share className="h-3 w-3" /> On iPhone/iPad:
                </span>
                <span>1. Tap the <strong>Share button (⬆️)</strong> at the bottom</span>
                <span>2. Tap <strong>'Add to Home Screen'</strong> 📱</span>
              </div>
            ) : deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 font-body text-xs font-bold shadow-soft transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Add to Home Screen
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
