import Lenis from 'lenis';

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Lenis drives the native scroll position, so plain window scroll listeners keep working. */
export const lenis = reducedMotion ? null : new Lenis({ lerp: 0.1, smoothWheel: true });
if (lenis) {
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Size of one design pixel, mirroring the CSS --px variable. */
export const px = () => Math.min(1.6, Math.max(1, Math.min(innerWidth / 1728, innerHeight / 680)));

/** Run `fn` at most once per animation frame for scroll/resize events. */
export function onFrame(fn: () => void) {
  let queued = false;
  const tick = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  fn();
  return tick;
}

let locks = 0;
export function lockScroll() {
  if (locks++ === 0) {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
  }
}
export function unlockScroll() {
  if (locks > 0 && --locks === 0) {
    lenis?.start();
    document.documentElement.style.overflow = '';
  }
}

export function scrollToTarget(target: HTMLElement | 0) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (target === 0) scrollTo({ top: 0 });
  else target.scrollIntoView();
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
