import { lockScroll, unlockScroll } from './env';

const CHIP_OPEN_AT = 820;
const CYCLE_FROM = 1880;
const CYCLE_EVERY = 230;
const FALLBACK = 2600;

/** Letters rise in, a photo chip opens between the names and flicks through images, then everything exits. */
export function initIntro() {
  const root = document.documentElement;
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (root.dataset.loading !== 'true' || !intro) return;

  const chip = intro.querySelector<HTMLElement>('[data-intro-chip]')!;
  const imgs = [...intro.querySelectorAll<HTMLImageElement>('[data-intro-img]')];
  const letters = [...intro.querySelectorAll<HTMLElement>('[data-intro-letter]')];
  const timers: number[] = [];
  let cycle = 0;
  let frame = 0;
  const start = performance.now();
  lockScroll();

  timers.push(window.setTimeout(() => (chip.style.width = chip.dataset.openWidth!), CHIP_OPEN_AT));
  timers.push(
    window.setTimeout(() => {
      cycle = window.setInterval(() => {
        imgs[frame].style.opacity = '0';
        frame = (frame + 1) % imgs.length;
        imgs[frame].style.opacity = '1';
      }, CYCLE_EVERY);
    }, CYCLE_FROM),
  );

  let finishing = false;
  const finish = () => {
    if (finishing) return;
    finishing = true;
    const elapsed = performance.now() - start;
    // Always let the photo cycle run at least two full ticks, and end on a tick boundary.
    const ticks = Math.max(2, Math.ceil(Math.max(0, elapsed - CYCLE_FROM) / CYCLE_EVERY));
    timers.push(
      window.setTimeout(
        () => {
          clearInterval(cycle);
          chip.style.transition = 'width 560ms cubic-bezier(0.22,1,0.36,1)';
          chip.style.width = '0em';
          letters.forEach((l) => (l.style.animation = `loader-letter-out 420ms cubic-bezier(0.65,0,0.2,1) ${l.dataset.outDelay}ms both`));
          intro.setAttribute('data-out', '');
          timers.push(
            window.setTimeout(() => {
              root.removeAttribute('data-loading');
              unlockScroll();
            }, 560),
          );
        },
        Math.max(0, CYCLE_FROM + ticks * CYCLE_EVERY - elapsed),
      ),
    );
  };

  if (document.readyState === 'complete') finish();
  else addEventListener('load', finish, { once: true });
  timers.push(window.setTimeout(finish, CYCLE_FROM + FALLBACK));
}
