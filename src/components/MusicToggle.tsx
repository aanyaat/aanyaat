import { useEffect, useRef, useState } from 'react';
import { Music2, Volume2, VolumeX } from 'lucide-react';

// YouTube video IDs to try in order (Mast Magan → Happy Birthday fallback)
const VIDEO_IDS = ['xitd9mEZIHk', 'ZbZSe6N_BXs'];

export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send a postMessage command to the YouTube iframe player
  const postCmd = (cmd: 'playVideo' | 'pauseVideo' | 'stopVideo') => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: cmd, args: [] }),
      '*'
    );
  };

  const toggle = () => {
    if (playing) {
      postCmd('pauseVideo');
      setPlaying(false);
    } else {
      postCmd('playVideo');
      setPlaying(true);
    }
  };

  // Try the next fallback video if the current one fails to load
  const handleError = () => {
    if (videoIndex < VIDEO_IDS.length - 1) {
      setVideoIndex((i) => i + 1);
    }
  };

  // When the video index changes while playing, re-issue playVideo after the iframe reloads
  useEffect(() => {
    if (playing) {
      const t = setTimeout(() => postCmd('playVideo'), 1500);
      return () => clearTimeout(t);
    }
  }, [videoIndex]);

  const src = `https://www.youtube.com/embed/${VIDEO_IDS[videoIndex]}?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=${VIDEO_IDS[videoIndex]}&modestbranding=1&rel=0&playsinline=1`;

  return (
    <>
      {/* Hidden YouTube player */}
      <div className="fixed -left-[9999px] -top-[9999px] h-1 w-1 overflow-hidden" aria-hidden="true">
        <iframe
          ref={iframeRef}
          src={src}
          title="background music"
          allow="autoplay"
          onError={handleError}
        />
      </div>

      <button
        onClick={toggle}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        aria-pressed={playing}
        className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-wine-700 text-cream-100 shadow-card transition-all duration-300 hover:scale-105 hover:bg-wine-600"
      >
        <span
          className={[
            'absolute inset-0 rounded-full bg-rose-400/40',
            playing ? 'animate-pulse-ring' : '',
          ].join(' ')}
        />
        {playing ? (
          <Volume2 className="relative h-5 w-5" />
        ) : (
          <VolumeX className="relative h-5 w-5" />
        )}
        <Music2
          className={[
            'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5',
            playing ? 'animate-spin text-gold-300' : 'text-gold-400/70',
          ].join(' ')}
        />
      </button>
    </>
  );
}
