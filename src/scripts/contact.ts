/** No backend: "Send Details" composes an email in the visitor's own mail app. */
export function initContact() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const original = status.textContent;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const name = get('name');
    const email = get('email');
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = 'Please add your name and a valid email.';
      form.querySelector<HTMLInputElement>(!name ? '#lead-name' : '#lead-email')?.focus();
      return;
    }
    const subject = `${get('reason')} — ${name}`;
    const body = [get('message'), '', `Name: ${name}`, `Email: ${email}`, get('phone') && `Phone: ${get('phone')}`].filter((l) => l !== '').join('\n');
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app…';
    setTimeout(() => (status.textContent = original), 4000);
  });
}
