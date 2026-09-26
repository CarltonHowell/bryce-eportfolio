import { clamp01, onFrame, reducedMotion } from './env';

/** The intro paragraph lights up character by character as the pinned section scrolls past. */
export function initStudio() {
  const outer = document.querySelector<HTMLElement>('[data-studio-outer]');
  const inner = document.querySelector<HTMLElement>('[data-studio-inner]');
  const text = document.querySelector<HTMLElement>('[data-studio-text]');
  if (!outer || !inner || !text || reducedMotion) return;

  const chars = [...text.querySelectorAll<HTMLElement>('[data-char]')];
  const desktop = matchMedia('(min-width: 1024px)');
  let lit = 0;
  text.setAttribute('data-wave', '');

  const update = () => {
    const rect = (desktop.matches ? outer : inner).getBoundingClientRect();
    const travel = rect.height - innerHeight;
    const progress = travel > 0 ? clamp01(-rect.top / travel) : clamp01((0.85 * innerHeight - rect.top) / (0.6 * innerHeight));
    const target = Math.round(progress * chars.length);
    if (target === lit) return;
    if (target > lit) for (let i = lit; i < target; i++) chars[i].setAttribute('data-lit', '');
    else for (let i = lit - 1; i >= target; i--) chars[i].removeAttribute('data-lit');
    lit = target;
  };
  const tick = onFrame(update);
  desktop.addEventListener('change', tick);
}
