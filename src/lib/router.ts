import { useCallback, useEffect, useState } from 'react';

/**
 * Minimal hash-based router. No deps, no history API fuss — just
 * listens to location.hash and reports the current path.
 * Paths look like "#/wishes" -> "/wishes".
 */
export function useRouter() {
  const [path, setPath] = useState(() => normalize(window.location.hash));

  useEffect(() => {
    const onChange = () => setPath(normalize(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    if (normalize(window.location.hash) === to) {
      // Same route — still scroll up so a re-click feels intentional.
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = to;
    // hashchange scrolls to top of the new content for us via the page effect.
  }, []);

  return { path, navigate };
}

function normalize(hash: string): string {
  if (!hash || hash === '#') return '/';
  // Strip the leading "#"
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw.startsWith('/')) return '/' + raw;
  return raw;
}
