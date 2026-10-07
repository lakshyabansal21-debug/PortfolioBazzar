import { useEffect, useRef } from 'react';

/**
 * useTilt: makes an element lean toward the mouse pointer (a small 3D effect).
 *
 * How it works:
 *  - on pointer move we work out where the pointer is inside the element (-0.5 .. 0.5)
 *  - we write that into two CSS variables, --rx and --ry
 *  - the .tilt class in index.css turns those variables into a 3D rotation
 * It does nothing on touch screens or when the user asked for reduced motion.
 */
export default function useTilt(maxDeg = 6) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return undefined;
    const canHover = window.matchMedia('(hover: hover)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return undefined;

    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(px * maxDeg).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-py * maxDeg).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [maxDeg]);

  return ref;
}
