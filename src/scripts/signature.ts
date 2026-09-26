import { finePointer, px, reducedMotion } from './env';

/** The wordmark drifts toward the pointer with a soft lag. */
export function initSignature() {
  const root = document.querySelector<HTMLElement>('[data-sig-root]');
  const move = document.querySelector<HTMLElement>('[data-sig-move]');
  if (!root || !move || !finePointer || reducedMotion) return;
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let frame = 0;
  const loop = () => {
    x += (tx - x) * 0.075;
    y += (ty - y) * 0.075;
    move.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => frame || (frame = requestAnimationFrame(loop));
  root.addEventListener('mousemove', (e) => {
    const r = root.getBoundingClientRect();
    const s = px();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 52 * s;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 52 * s;
    kick();
  });
  root.addEventListener('mouseleave', () => ((tx = 0), (ty = 0), kick()));
}
