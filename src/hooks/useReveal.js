import { useLayoutEffect } from 'react';

/**
 * useReveal: elements marked with  data-reveal  fade up when they scroll into view.
 *
 *   <div data-reveal style={{ '--d': '80ms' }}>...</div>     (--d = optional delay, for staggering)
 *
 * How it works: we add .reveal (hidden) to each marked element, watch it with an
 * IntersectionObserver, and add .reveal-in (plays the animation) when it is visible.
 * Only opacity and transform are animated, so it stays smooth. Pass `deps` when marked
 * elements appear later (for example after data loads) so the new ones are picked up.
 */
export default function useReveal(deps = []) {
  useLayoutEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]:not(.reveal-in)'));
    if (!els.length) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('reveal-in'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
