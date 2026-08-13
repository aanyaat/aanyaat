import { useEffect, useRef } from 'react';

/**
 * Adds the `is-visible` class to any descendant `.reveal` elements
 * as they scroll into view. Attach the ref to a container.
 * Automatically handles dynamically added elements using MutationObserver.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    // Track which elements are already being observed
    const observedElements = new Set<Element>();

    const observeNewElements = () => {
      const els = root.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
      els.forEach((el) => {
        if (!observedElements.has(el)) {
          io.observe(el);
          observedElements.add(el);
        }
      });
    };

    // Initial check
    observeNewElements();

    // Set up MutationObserver to watch for additions to the DOM
    const mo = new MutationObserver(() => {
      observeNewElements();
    });

    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      observedElements.clear();
    };
  }, []);

  return ref;
}
