/**
 * Accordion list: on desktop the hovered project opens (first one by default);
 * on touch screens the project nearest the middle of the viewport is the active one.
 */
export function initProjects() {
  const list = document.querySelector<HTMLElement>('[data-projects]');
  if (!list) return;
  const items = [...list.querySelectorAll<HTMLElement>('[data-project]')];
  const hoverMq = matchMedia('(min-width: 1024px) and (hover: hover)');
  let hovered: number | null = null;
  let centred = 0;

  const apply = () => {
    const active = hovered ?? (hoverMq.matches ? 0 : centred);
    items.forEach((li, i) => {
      const on = i === active;
      li.toggleAttribute('data-active', on);
      li.querySelectorAll('.project-title, .project-meta').forEach((el) => el.toggleAttribute('data-hw-on', on));
    });
  };

  items.forEach((li, i) => {
    li.addEventListener('mouseenter', () => hoverMq.matches && ((hovered = i), apply()));
    li.addEventListener('focusin', () => ((hovered = i), apply()));
  });
  list.addEventListener('mouseleave', () => ((hovered = null), apply()));
  list.addEventListener('focusout', (e) => {
    if (!list.contains(e.relatedTarget as Node)) ((hovered = null), apply());
  });

  const io = new IntersectionObserver(
    () => {
      if (hoverMq.matches) return;
      const mid = innerHeight / 2;
      let best = Infinity;
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < best) ((best = d), (centred = i));
      });
      apply();
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  items.forEach((li) => io.observe(li));
  hoverMq.addEventListener('change', apply);
  apply();
}
