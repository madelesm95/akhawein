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
  /* Online donations (Paymob hosted checkout) */
  const donateForm = $('[data-donate-form]');
  if (donateForm) {
    const i18nEl = document.getElementById('donation-i18n');
    let config = {};
    try { config = JSON.parse(i18nEl?.textContent || '{}'); } catch { config = {}; }
    const strings = config.strings || {};
    const locale = config.lang === 'ar' ? 'ar-EG' : 'en-US';
    const tr = (key) => {
      const entry = strings[key];
      if (!entry) return '';
      return entry[config.lang] || entry.en || entry.ar || '';
    };

    const amountInput = $('#donate-amount', donateForm);
    const presets = $$('[data-amount]', donateForm);
    const totalEl = $('[data-donate-total]', donateForm);
    const submitBtn = $('[data-donate-submit]', donateForm);
    const submitLabel = $('[data-donate-submit-label]', donateForm);
    const statusEl = $('[data-donate-status]', donateForm);
    const messageEl = $('[data-donate-message]', donateForm);
    const counterEl = $('[data-donate-counter]', donateForm);
    const gridEl = $('[data-donate-grid]');
    const resultEl = $('[data-donate-result]');
    const resultIcon = $('[data-result-icon]', resultEl);
    const resultTitle = $('[data-result-title]', resultEl);
    const resultText = $('[data-result-text]', resultEl);
    const resultMeta = $('[data-result-meta]', resultEl);
    const resultAmount = $('[data-result-amount]', resultEl);
    const resultCause = $('[data-result-cause]', resultEl);
    const resultReference = $('[data-result-reference]', resultEl);
    const resultRetry = $('[data-result-retry]', resultEl);
    const resultHelp = $('[data-result-help]', resultEl);
    const waHelpBase = resultHelp ? resultHelp.href : '';

    const scrollToResult = () => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      resultEl.scrollIntoView({ block: 'start' });
      root.style.scrollBehavior = previous;
    };

    let ready = false;
    let redirecting = false;

    const parseAmount = (value) => {
      let s = String(value ?? '').trim();
      if (!s || s.length > 24) return null;
      s = s
        .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/\u066B/g, '.')
        .replace(/[\s,\u066C]/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
      const n = Number(s);
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
    };

    const formatAmount = (n) => `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n)} ${tr('egp')}`;

    const updateTotal = () => {
      const n = parseAmount(amountInput.value);
      totalEl.textContent = n && n > 0 ? formatAmount(n) : `0 ${tr('egp')}`;
    };

    const setStatus = (kind, message) => {
      statusEl.className = 'donate-status' + (kind ? ` is-${kind}` : '');
      statusEl.textContent = message || '';
    };

    const setBusy = (busy, label) => {
      submitBtn.disabled = busy || !ready;
      submitBtn.classList.toggle('is-loading', busy);
      submitBtn.setAttribute('aria-busy', String(busy));
      submitLabel.textContent = label || (busy ? tr('loading') : tr('pay'));
    };

    const selectPreset = (btn) => {
      presets.forEach((p) => {
        const on = p === btn;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-pressed', String(on));
      });
    };

    presets.forEach((btn) => btn.addEventListener('click', () => {
      amountInput.value = btn.dataset.amount;
      selectPreset(btn);
      updateTotal();
      setStatus('', '');
    }));

    amountInput.addEventListener('input', () => {
      const n = Number(String(amountInput.value).trim());
      const match = presets.find((p) => Number(p.dataset.amount) === n);
      selectPreset(match || null);
      updateTotal();
      setStatus('', '');
    });

    if (messageEl && counterEl) {
      const updateCounter = () => { counterEl.textContent = `${messageEl.value.length} / 300`; };
      messageEl.addEventListener('input', updateCounter);
      updateCounter();
    }

    const postJson = async (url, body, timeoutMs = 25000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        return { status: res.status, ok: res.ok, data };
      } finally {
        clearTimeout(timer);
      }
    };

    const errorMessage = (data) => {
      if (data && data.error) return data.error[config.lang] || data.error.en || data.error.ar || '';
      return tr('serverError');
    };

    const loadConfig = async () => {
      try {
        const res = await fetch('/api/donations/config', { headers: { Accept: 'application/json' } });
        const data = await res.json();
        if (!data || data.ok !== true) throw new Error('config');
        if (!data.enabled) {
          ready = false;
          setBusy(false, tr('pay'));
          setStatus('info', tr('notConfigured'));
          return;
        }
        ready = true;
        setBusy(false, tr('pay'));
        setStatus('', '');
      } catch {
        ready = false;
        setBusy(false, tr('pay'));
        setStatus('info', tr('configError'));
      }
    };

    donateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!ready || redirecting) return;

      if (!donateForm.reportValidity()) {
        setStatus('error', tr('required'));
        return;
      }

      const amount = parseAmount(amountInput.value);
      if (!amount || amount < (config.minAmount || 10) || amount > (config.maxAmount || 200000)) {
        setStatus('error', tr('amountInvalid'));
        amountInput.focus();
        return;
      }

      const phone = String(donateForm.elements.phone.value || '').replace(/[\s\-().]/g, '');
      if (!/^(?:\+?20|0)?1[0125]\d{8}$/.test(phone)) {
        setStatus('error', tr('phoneInvalid'));
        donateForm.elements.phone.focus();
        return;
      }

      const email = String(donateForm.elements.email.value || '').trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        setStatus('error', tr('emailInvalid'));
        donateForm.elements.email.focus();
        return;
      }

      const data = new FormData(donateForm);
      const payload = {
        amount,
        cause: data.get('cause'),
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        phone: data.get('phone'),
        email,
        anonymous: data.get('anonymous') === 'true',
        message: data.get('message') || '',
        company: data.get('company') || '',
        lang: config.lang,
      };

      setBusy(true, tr('loading'));
      setStatus('info', tr('loading'));

      try {
        const res = await postJson('/api/donations/create', payload);
        if (!res.ok || !res.data || res.data.ok !== true) {
          setBusy(false, tr('pay'));
          setStatus('error', errorMessage(res.data));
          return;
        }
        redirecting = true;
        setStatus('info', tr('redirecting'));
        submitLabel.textContent = tr('redirecting');
        window.location.assign(res.data.checkoutUrl);
      } catch (err) {
        setBusy(false, tr('pay'));
        setStatus('error', err && err.name === 'AbortError' ? tr('offline') : tr('offline'));
      }
    });

    const iconFor = (name) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'i');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#i-${name}`);
      svg.appendChild(use);
      return svg;
    };

    const showResult = (kind, title, text, meta) => {
      gridEl.hidden = true;
      resultEl.hidden = false;
      resultEl.className = `donate-result${kind === 'error' ? ' is-error' : kind === 'pending' ? ' is-pending' : ''}`;
      resultEl.setAttribute('tabindex', '-1');
      resultIcon.replaceChildren(iconFor(kind === 'success' ? 'circle-check' : kind === 'pending' ? 'clock' : 'triangle-alert'));
      resultTitle.textContent = title;
      resultText.textContent = text;

      const hasMeta = meta && (meta.amount || meta.cause || meta.reference);
      resultMeta.hidden = !hasMeta;
      resultAmount.textContent = meta && meta.amount ? formatAmount(meta.amount) : '';
      resultCause.textContent = meta && meta.cause ? meta.cause : '';
      const causeCell = resultCause.closest('div');
      if (causeCell) causeCell.hidden = !(meta && meta.cause);
      resultReference.textContent = meta && meta.reference ? meta.reference : '';

      resultRetry.hidden = false;
      resultRetry.textContent = kind === 'success' ? tr('again') : tr('retry');
      resultHelp.hidden = kind === 'success';
      resultEl.focus({ preventScroll: true });
      scrollToResult();
    };

    const resetToForm = () => {
      resultEl.hidden = true;
      gridEl.hidden = false;
      redirecting = false;
      setBusy(false, tr('pay'));
      setStatus('', '');
      if (location.search) history.replaceState(null, '', `${location.pathname}#donate-online`);
      donateForm.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };

    resultRetry?.addEventListener('click', resetToForm);

    const verifyReturn = async (query) => {
      gridEl.hidden = true;
      resultEl.hidden = false;
      resultEl.className = 'donate-result is-pending';
      resultIcon.replaceChildren(iconFor('clock'));
      resultTitle.textContent = tr('verifying');
      resultText.textContent = '';
      resultMeta.hidden = true;
      resultRetry.hidden = true;
      resultHelp.hidden = true;
      requestAnimationFrame(() => {
        scrollToResult();
        resultEl.focus({ preventScroll: true });
      });

      try {
        const res = await postJson('/api/donations/verify', { query }, 20000);
        const data = res.data || {};
        if (!res.ok || data.ok !== true) {
          resultEl.className = 'donate-result is-error';
          resultIcon.replaceChildren(iconFor('triangle-alert'));
          resultTitle.textContent = tr('verifyErrorTitle');
          resultText.textContent = tr('verifyErrorText');
          resultRetry.hidden = false;
          resultRetry.textContent = tr('retry');
          resultHelp.hidden = false;
          return;
        }

        const meta = {
          amount: data.amount,
          cause: data.cause ? (data.cause[config.lang] || data.cause.en || data.cause.ar) : '',
          reference: data.reference || '',
        };

        if (data.status === 'paid') {
          showResult('success', tr('successTitle'), tr('successText'), meta);
        } else if (data.status === 'pending') {
          showResult('pending', tr('pendingTitle'), tr('pendingText'), meta);
        } else {
          showResult('error', tr('failedTitle'), tr('failedText'), meta);
        }

        if (data.reference && waHelpBase) {
          const text = config.lang === 'ar'
            ? `السلام عليكم، بخصوص تبرعي رقم ${data.reference} — أحتاج مساعدة.`
            : `Hello, regarding my donation ${data.reference} — I need help.`;
          resultHelp.href = `${waHelpBase.split('?')[0]}?text=${encodeURIComponent(text)}`;
        }

        history.replaceState(null, '', `${location.pathname}${data.reference ? `?ref=${encodeURIComponent(data.reference)}` : ''}`);
      } catch {
        resultEl.className = 'donate-result is-error';
        resultIcon.replaceChildren(iconFor('triangle-alert'));
        resultTitle.textContent = tr('verifyErrorTitle');
        resultText.textContent = tr('verifyErrorText');
        resultRetry.hidden = false;
        resultRetry.textContent = tr('retry');
        resultHelp.hidden = false;
      }
    };

    updateTotal();
    loadConfig();

    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'return') {
      verifyReturn(params.toString());
    }
  }
})();
