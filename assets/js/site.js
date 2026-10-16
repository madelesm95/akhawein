(() => {
  'use strict';
  window.akhReady = true;

  const doc = document.documentElement;
  const rtl = doc.dir === 'rtl';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const strings = JSON.parse(document.getElementById('i18n')?.textContent || '{}');
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Theme */
  const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const storedTheme = () => { try { return localStorage.getItem('theme'); } catch { return null; } };
  const applyTheme = (theme) => {
    doc.dataset.theme = theme;
    $$('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', theme === 'dark' ? '#0B1322' : '#FBF8F4'));
  };
  $$('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', () => {
    const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
  }));
  themeQuery.addEventListener('change', (e) => { if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light'); });
  if (storedTheme()) applyTheme(doc.dataset.theme);

  /* Language preference (used to remember the visitor's choice) */
  $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => {
    try { localStorage.setItem('lang', a.dataset.langSwitch); } catch { /* storage unavailable */ }
  }));

  /* Sticky header shadow */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Dropdown menus */
  const menus = $$('.has-menu');
  const closeMenus = (except) => menus.forEach((m) => {
    if (m === except) return;
    m.classList.remove('is-open');
    m.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
  });
  menus.forEach((m) => {
    const btn = m.querySelector('button');
    btn.addEventListener('click', () => {
      const open = !m.classList.contains('is-open');
      closeMenus(m);
      m.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeMenus(); btn.focus(); }
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-menu')) closeMenus(); });

  /* Mobile drawer */
  const drawer = $('#drawer');
  const drawerBtn = $('[data-drawer-open]');
  if (drawer && drawerBtn) {
    drawerBtn.addEventListener('click', () => { drawer.showModal(); drawerBtn.setAttribute('aria-expanded', 'true'); });
    $('[data-drawer-close]', drawer)?.addEventListener('click', () => drawer.close());
    drawer.addEventListener('close', () => drawerBtn.setAttribute('aria-expanded', 'false'));
    drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); });
  }

  /* Toast */
  const toast = $('[data-toast]');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };

  /* Copy to clipboard */
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    if (!ok) throw new Error('copy failed');
  };
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    try {
      await copyText(btn.dataset.copy);
      const label = btn.querySelector('.copy-btn__text');
      btn.classList.add('is-copied');
      if (label) label.textContent = strings.copiedShort;
      showToast(`${strings.copied}: ${btn.dataset.copy}`);
      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = strings.copy;
      }, 2200);
    } catch {
      window.prompt('', btn.dataset.copy);
    }
  });

  /* Reveal on scroll + counters */
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const format = new Intl.NumberFormat(doc.lang === 'ar' ? 'ar-EG' : 'en-US');
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = format.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.dataset.count && !reduceMotion) animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    $$('.reveal, [data-count]').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* Filters (chips) + optional search */
  const normalize = (s) => s.toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627').replace(/\u0629/g, '\u0647').replace(/\u0649/g, '\u064A').replace(/\u0624/g, '\u0648').replace(/\u0626/g, '\u064A')
    .replace(/\s+/g, ' ').trim();

  $$('[data-filter-group]').forEach((bar) => {
    const group = bar.dataset.filterGroup;
    const scope = $(`[data-filter-scope="${group}"]`) || document;
    const items = $$('[data-cats]', scope);
    const search = $(`[data-search="${group}"]`);
    const countEl = $(`[data-count-for="${group}"]`);
    const empty = $(`[data-empty-for="${group}"]`);
    const sections = $$('[data-filter-section]', scope);
    let active = 'all';

    const apply = () => {
      const q = search ? normalize(search.value) : '';
      let visible = 0;
      items.forEach((el) => {
        const inCat = active === 'all' || el.dataset.cats.split(' ').includes(active);
        const inSearch = !q || normalize(el.dataset.search || el.textContent).includes(q);
        const show = inCat && inSearch;
        el.hidden = !show;
        if (show) visible++;
      });
      sections.forEach((s) => { s.hidden = !$$('[data-cats]', s).some((el) => !el.hidden); });
      if (countEl) {
        const forms = strings.results || {};
        const form = forms[new Intl.PluralRules(doc.lang).select(visible)] || forms.other || '{n}';
        countEl.textContent = form.replace('{n}', new Intl.NumberFormat(doc.lang === 'ar' ? 'ar-EG' : 'en-US').format(visible));
      }
      if (empty) empty.hidden = visible > 0;
    };

    bar.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      active = chip.dataset.filter;
      $$('[data-filter]', bar).forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      apply();
    });
    search?.addEventListener('input', apply);
    const initial = new URLSearchParams(location.search).get('filter');
    const initialChip = initial && $(`[data-filter="${CSS.escape(initial)}"]`, bar);
    if (initialChip) initialChip.click(); else apply();
  });

  /* Lightbox (images + YouTube) */
  const lightbox = $('[data-lightbox]');
  if (lightbox) {
    const stage = $('[data-lightbox-stage]', lightbox);
    const caption = $('[data-lightbox-caption]', lightbox);
    let list = [];
    let index = 0;

    const render = () => {
      const item = list[index];
      stage.replaceChildren();
      if (item.dataset.type === 'video') {
        const wrap = document.createElement('div');
        wrap.className = 'video';
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.dataset.src)}?autoplay=1&rel=0`;
        frame.title = item.dataset.caption || '';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        frame.allowFullscreen = true;
        wrap.appendChild(frame);
        stage.appendChild(wrap);
      } else {
        const image = document.createElement('img');
        image.src = item.dataset.src;
        image.alt = item.dataset.caption || '';
        stage.appendChild(image);
      }
      caption.textContent = item.dataset.caption || '';
      lightbox.classList.toggle('is-single', list.length < 2);
    };
    const step = (delta) => { index = (index + delta + list.length) % list.length; render(); };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox-item]');
      if (!trigger) return;
      e.preventDefault();
      const group = trigger.closest('[data-lightbox-group]') || document;
      list = $$('[data-lightbox-item]', group).filter((el) => !el.closest('[hidden]'));
      index = Math.max(0, list.indexOf(trigger));
      render();
      lightbox.showModal();
      $('[data-lightbox-close]', lightbox).focus();
    });
    $('[data-lightbox-close]', lightbox).addEventListener('click', () => lightbox.close());
    $('[data-lightbox-prev]', lightbox).addEventListener('click', () => step(-1));
    $('[data-lightbox-next]', lightbox).addEventListener('click', () => step(1));
    lightbox.addEventListener('close', () => stage.replaceChildren());
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target === stage) lightbox.close(); });
    lightbox.addEventListener('keydown', (e) => {
      if (list.length < 2) return;
      if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
    });
    let touchX = null;
    lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (touchX === null || list.length < 2) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step((dx < 0) !== rtl ? 1 : -1);
      touchX = null;
    });
  }

  /* Contact form: FormSubmit with WhatsApp fallback */
  const form = $('[data-contact-form]');
  if (form) {
    const status = $('[data-form-status]', form);
    const submit = $('button[type="submit"]', form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form));
      const typeLabel = form.elements.type.selectedOptions[0]?.textContent || '';
      const lines = [
        `${form.dataset.lName}: ${data.name}`,
        `${form.dataset.lPhone}: ${data.phone}`,
        data.email ? `${form.dataset.lEmail}: ${data.email}` : '',
        `${form.dataset.lType}: ${typeLabel}`,
        `${form.dataset.lMessage}: ${data.message}`,
      ].filter(Boolean);
      const waUrl = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
      submit.disabled = true;
      status.className = 'form-status';
      status.textContent = form.dataset.sending;
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${form.dataset.email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: data.name, phone: data.phone, email: data.email || '-', type: typeLabel, message: data.message,
            _subject: `${form.dataset.subject}: ${typeLabel} — ${data.name}`, _template: 'table', _captcha: 'false',
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) !== 'true') throw new Error('send failed');
        status.classList.add('is-success');
        status.textContent = form.dataset.success;
        form.reset();
      } catch {
        status.classList.add('is-error');
        status.textContent = `${form.dataset.fallback} `;
        const link = document.createElement('a');
        link.href = waUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'btn btn--whatsapp btn--sm';
        link.textContent = form.dataset.fallbackLink;
        status.appendChild(link);
      } finally {
        submit.disabled = false;
      }
    });
  }
})();
