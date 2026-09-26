import { clamp01, onFrame, reducedMotion } from './env';

/** The footer opens out from a slightly inset card to full width as it scrolls into view. */
export function initFooter() {
  const el = document.querySelector<HTMLElement>('[data-footer-clip]');
  if (!el || reducedMotion) return;
  onFrame(() => {
    const top = el.getBoundingClientRect().top;
    const t = Math.pow(1 - clamp01((innerHeight - top) / (0.6 * innerHeight)), 3);
    el.style.clipPath = `inset(${(5 * t).toFixed(2)}% ${(7 * t).toFixed(2)}% 0% ${(7 * t).toFixed(2)}%)`;
  });
}
