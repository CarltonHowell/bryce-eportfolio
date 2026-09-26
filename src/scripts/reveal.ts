import { reducedMotion } from './env';

const io =
  !reducedMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).dataset.reveal = 'shown';
            io!.unobserve(e.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      )
    : null;

/** Server-rendered blocks start visible; ones below the fold are nudged down and rise into place on entry. */
export function prepareReveals(scope: ParentNode = document) {
  if (!io) return;
  scope.querySelectorAll<HTMLElement>('.reveal[data-reveal]').forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < innerHeight * 0.92 && el.offsetParent !== null) return;
    el.dataset.reveal = 'waiting';
    io.observe(el);
  });
}
