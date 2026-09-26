import { lockScroll, reducedMotion, unlockScroll, wait } from './env';
import { prepareReveals } from './reveal';
import { closeMenu } from './menu';

const COVER_MS = 667;
const REVEAL_MS = 754;
const slugFromHash = () => location.hash.match(/^#work\/([\w-]+)$/)?.[1] ?? null;

let current: HTMLElement | null = null;
let opener: HTMLElement | null = null;
let busy = false;

/** Night-coloured curtain sweeps up to cover the swap, then carries on up to reveal — as between pages on the reference. */
async function curtain(swap: () => void) {
  const c = document.querySelector<HTMLElement>('[data-route-curtain]');
  if (!c || reducedMotion) return swap();
  busy = true;
  c.dataset.routeCurtain = 'cover';
  await wait(COVER_MS);
  swap();
  // Let the new view paint before revealing it.
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  c.dataset.routeCurtain = 'reveal';
  await wait(REVEAL_MS);
  c.dataset.routeCurtain = 'idle';
  busy = false;
}

function show(slug: string) {
  const next = document.querySelector<HTMLElement>(`[data-case="${slug}"]`);
  if (!next) return false;
  if (current && current !== next) current.hidden = true;
  if (!current) lockScroll();
  next.hidden = false;
  next.scrollTop = 0;
  current = next;
  prepareReveals(next);
  next.querySelector<HTMLElement>('button[data-close-work]')?.focus({ preventScroll: true });
  return true;
}

function hide() {
  if (!current) return;
  current.hidden = true;
  current = null;
  unlockScroll();
  opener?.focus({ preventScroll: true });
}

async function open(slug: string, mode: 'push' | 'replace' | 'none') {
  if (busy || !document.querySelector(`[data-case="${slug}"]`)) return;
  closeMenu();
  if (mode === 'push') history.pushState({ work: slug }, '', `#work/${slug}`);
  if (mode === 'replace') history.replaceState(history.state, '', `#work/${slug}`);
  await curtain(() => show(slug));
}

async function close(viaHistory: boolean) {
  if (busy || !current) return;
  if (!viaHistory) {
    // If we pushed the entry, step back so Back/Forward stay in sync; otherwise just clear the hash.
    if (history.state?.work) return history.back();
    history.replaceState(null, '', location.pathname + location.search);
  }
  await curtain(hide);
}

export function initCases() {
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const openLink = t.closest<HTMLElement>('[data-open-work]');
    const nextLink = t.closest<HTMLElement>('[data-next-work]');
    const closeBtn = t.closest<HTMLElement>('[data-close-work]');
    if (openLink) {
      e.preventDefault();
      opener = openLink;
      open(openLink.dataset.openWork!, 'push');
    } else if (nextLink) {
      e.preventDefault();
      open(nextLink.dataset.nextWork!, 'replace');
    } else if (closeBtn) {
      e.preventDefault();
      close(false);
    }
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) close(false);
  });

  addEventListener('popstate', () => {
    const slug = slugFromHash();
    if (slug && current?.dataset.case !== slug) open(slug, 'none');
    else if (!slug && current) close(true);
  });

  // Deep link straight into a case study (no curtain on first paint).
  const initial = slugFromHash();
  if (initial) {
    opener = document.querySelector<HTMLElement>(`[data-open-work="${initial}"]`);
    show(initial);
  }
}
