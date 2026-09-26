import { finePointer, px, reducedMotion } from './env';

const OFFSET = { x: 44, y: -13 };
const T = { in: 240, hold: 360, out: 240 };
const TOTAL = T.in + T.hold + T.out;
const HOLD_END = T.in + T.hold;
const MAX_LIVE = 4;
const SPACING = 90;

interface Slot {
  el: HTMLElement;
  img: HTMLImageElement;
  anim: Animation | null;
}

/** Small photos wipe in along the pointer's path across the hero portrait. */
export function initTrail() {
  const wrap = document.querySelector<HTMLElement>('[data-trail]');
  const area = wrap?.parentElement;
  if (!wrap || !area || !finePointer || reducedMotion) return;

  const slots: Slot[] = [...wrap.children].map((el) => ({ el: el as HTMLElement, img: el.querySelector('img')!, anim: null }));
  const srcs = slots.map((s) => s.img.src);
  let inside = false;
  let lastX = 0;
  let lastY = 0;
  let travelled = 0;
  let scale = 1;
  let srcIndex = -1;
  let slotIndex = 0;
  const live: Slot[] = [];
  const fading: Slot[] = [];

  const hurry = (s: Slot) => {
    if (!s.anim || s.anim.currentTime === null) return;
    s.anim.currentTime = Math.max(Number(s.anim.currentTime), HOLD_END);
    s.anim.playbackRate = 2.5;
    fading.push(s);
    if (fading.length > 1) fading.shift()!.anim?.finish();
  };

  const spawn = (x: number, y: number) => {
    srcIndex = (srcIndex + 1) % srcs.length;
    const s = slots[slotIndex];
    slotIndex = (slotIndex + 1) % slots.length;
    if (live.length >= MAX_LIVE) hurry(live.shift()!);
    const li = live.indexOf(s);
    if (li !== -1) live.splice(li, 1);
    const fi = fading.indexOf(s);
    if (fi !== -1) fading.splice(fi, 1);

    s.img.src = srcs[srcIndex];
    s.el.style.transform = `translate3d(${x + (OFFSET.x - 40) * scale}px, ${y + (OFFSET.y - 40) * scale}px, 0)`;
    s.anim?.cancel();
    s.anim = s.img.animate(
      [
        { opacity: 1, transform: 'scale(0.98)', maskPosition: '100% 0%', easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
        { opacity: 1, transform: 'scale(1)', maskPosition: '0% 0%', offset: T.in / TOTAL },
        { opacity: 1, maskPosition: '0% 0%', offset: HOLD_END / TOTAL, easing: 'cubic-bezier(0.55, 0, 0.45, 1)' },
        { opacity: 0, transform: 'scale(0.97)', maskPosition: '0% 0%' },
      ] as Keyframe[],
      { duration: TOTAL, fill: 'both' },
    );
    live.push(s);
  };

  const release = () => {
    inside = false;
    while (live.length) {
      const s = live.shift()!;
      if (s.anim && s.anim.currentTime !== null) s.anim.currentTime = Math.max(Number(s.anim.currentTime), HOLD_END);
    }
    fading.length = 0;
  };

  document.addEventListener(
    'pointermove',
    (e) => {
      const r = area.getBoundingClientRect();
      const within = r.width > 0 && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!within) {
        if (inside) release();
        return;
      }
      if (!inside) {
        inside = true;
        scale = px();
        lastX = e.clientX;
        lastY = e.clientY;
        travelled = 0;
        spawn(e.clientX - r.left, e.clientY - r.top);
        return;
      }
      travelled += Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
      if (travelled >= SPACING * scale) {
        travelled = 0;
        spawn(e.clientX - r.left, e.clientY - r.top);
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', release);
  addEventListener('blur', release);
}
