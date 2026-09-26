import { clamp01, finePointer, onFrame, reducedMotion } from './env';

/** Rows slide in from the right with their rules drawing across; hovering a row dims the others. */
export function initSkills() {
  const list = document.querySelector<HTMLElement>('[data-skills]');
  if (!list) return;
  const items = [...list.children] as HTMLElement[];
  const rows = items.map((li) => li.firstElementChild as HTMLElement);
  const rules = items.map((li) => li.lastElementChild as HTMLElement);

  if (!reducedMotion) {
    onFrame(() => {
      const top = list.getBoundingClientRect().top;
      const p = clamp01((0.78 * innerHeight - top) / (0.72 * innerHeight));
      rows.forEach((row, i) => {
        const n = 1 - Math.pow(1 - clamp01(p * rows.length - i), 3);
        row.style.transform = `translate3d(${((1 - n) * 28).toFixed(2)}%, 0, 0)`;
        row.style.opacity = String(n);
        rules[i].style.transform = `scaleX(${n.toFixed(3)})`;
        rules[i].style.transformOrigin = 'right';
      });
    });
  }

  const desktop = matchMedia('(min-width: 1024px)');
  if (!finePointer) return;
  const inner = items.map((li) => li.querySelector<HTMLElement>('[data-skill-row]')!);
  const set = (active: number | null) => {
    if (!desktop.matches) active = null;
    inner.forEach((r, n) => (r.style.opacity = active !== null && n !== active ? '0.4' : ''));
  };
  items.forEach((li, i) => li.addEventListener('mouseenter', () => set(i)));
  list.addEventListener('mouseleave', () => set(null));
}
