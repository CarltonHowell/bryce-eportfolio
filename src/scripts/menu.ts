import { lockScroll, unlockScroll } from './env';

let open = false;

export function closeMenu() {
  if (!open) return;
  setMenu(false);
}

function setMenu(next: boolean) {
  const menu = document.getElementById('site-menu')!;
  const scrim = document.querySelector<HTMLElement>('[data-menu-scrim]')!;
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const [a, b] = toggle.querySelectorAll<HTMLElement>('[data-bar]');
  open = next;
  menu.dataset.menu = scrim.dataset.menuScrim = next ? 'open' : 'closed';
  menu.setAttribute('aria-hidden', String(!next));
  toggle.setAttribute('aria-expanded', String(next));
  toggle.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
  a.style.transform = next ? 'translateY(5px) rotate(45deg)' : '';
  b.style.transform = next ? 'translateY(-5px) rotate(-45deg)' : '';
  menu.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((l) => (l.tabIndex = next ? 0 : -1));
  if (next) {
    lockScroll();
    menu.focus({ preventScroll: true });
  } else {
    unlockScroll();
  }
}

export function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', () => setMenu(!open));
  document.querySelector('[data-menu-scrim]')?.addEventListener('click', () => closeMenu());
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      closeMenu();
      toggle.focus();
    }
  });
}
