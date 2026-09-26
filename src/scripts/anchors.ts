import { scrollToTarget } from './env';
import { closeMenu } from './menu';

/** Smooth in-page navigation for plain #section links (case-study links are handled separately). */
export function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.hasAttribute('data-open-work') || a.hasAttribute('data-next-work') || a.hasAttribute('data-close-work')) return;
    const hash = a.getAttribute('href')!;
    if (hash.startsWith('#work/')) return;
    const target = hash === '#top' || hash === '#' ? 0 : document.getElementById(hash.slice(1));
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    // Wait a frame so the menu's scroll lock is released before scrolling.
    requestAnimationFrame(() => scrollToTarget(target));
  });
}
