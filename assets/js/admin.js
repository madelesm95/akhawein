(() => {
  'use strict';

  const root = document.querySelector('[data-admin]');
  if (!root) return;

  const TOKEN_KEY = 'akh_admin_token';
  const TONES = ['gold', 'green', 'red', 'navy'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, node = root) => node.querySelector(selector);

  const loginBox = $('[data-admin-login]');
  const loginForm = $('[data-admin-login-form]');
  const loginStatus = $('[data-admin-status]');
  const panel = $('[data-admin-panel]');
  const panelStatus = $('[data-admin-status-panel]');
  const list = $('[data-admin-list]');
  const empty = $('[data-admin-empty]');
  const form = $('[data-admin-form]');
  const formTitle = $('[data-admin-form-title]');
  const newButton = $('[data-admin-new]');
  const refreshButton = $('[data-admin-refresh]');
  const logoutButton = $('[data-admin-logout]');
  const cancelButton = $('[data-admin-cancel]');
  const seedButton = $('[data-admin-seed]');
  const seedNode = $('[data-admin-seed-data]');

  const seedItems = (() => {
    if (!seedNode) return [];
    try {
      const parsed = JSON.parse(seedNode.textContent || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  let token = '';
  try { token = sessionStorage.getItem(TOKEN_KEY) || ''; } catch { token = ''; }

  function storeToken(value) {
    token = value || '';
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch { /* storage unavailable */ }
  }

  function setStatus(node, message, kind) {
    if (!node) return;
    node.textContent = message || '';
    if (kind) node.dataset.kind = kind;
    else delete node.dataset.kind;
  }

  async function api(path, options = {}) {
    const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(path, { ...options, headers, cache: 'no-store' });
    } catch {
      return { ok: false, offline: true, data: null };
    }

    let data = null;
    try { data = await response.json(); } catch { data = null; }

    if (response.status === 401) {
      storeToken('');
      showLogin('انتهت الجلسة. سجّل الدخول من جديد.');
    }

    return { ok: response.ok && !!data && data.ok === true, status: response.status, data };
  }

  function isActive(value) {
    const text = String(value === null || value === undefined ? '' : value).trim().toLowerCase();
    return !/^(false|0|no|off|لا|معطل|مغلق)$/.test(text);
  }

  function todayISO() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function stateOf(item, today) {
    if (!isActive(item.active)) return { label: 'موقوف', cls: 'off' };
    if (item.start && String(item.start) > today) return { label: 'لم يبدأ', cls: 'future' };
    if (item.end && String(item.end) < today) return { label: 'منتهي', cls: 'past' };
    return { label: 'ظاهر الآن', cls: 'live' };
  }

  function icon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `i i-${name}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#i-${name}`);
    svg.appendChild(use);
    return svg;
  }

  function actionButton(label, iconName, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.appendChild(icon(iconName));
    const text = document.createElement('span');
    text.textContent = label;
    button.appendChild(text);
    return button;
  }

  function showLogin(message) {
    loginBox.hidden = false;
    panel.hidden = true;
    form.hidden = true;
    setStatus(loginStatus, message || '');
    setStatus(panelStatus, '');
    const input = loginForm.elements.password;
    if (input) {
      input.value = '';
      input.focus({ preventScroll: true });
    }
  }

  function showPanel() {
    loginBox.hidden = true;
    panel.hidden = false;
    setStatus(loginStatus, '');
  }

  function closeForm() {
    form.hidden = true;
    form.reset();
    form.elements.id.value = '';
  }

  function openForm(item) {
    const data = item || {};
    const fields = form.elements;
    formTitle.textContent = item ? 'تعديل الإعلان' : 'إعلان جديد';
    fields.id.value = data.id || '';
    fields.text_ar.value = data.text_ar || '';
    fields.text_en.value = data.text_en || '';
    fields.tag_ar.value = data.tag_ar || '';
    fields.tag_en.value = data.tag_en || '';
    fields.tone.value = TONES.includes(String(data.tone)) ? String(data.tone) : 'gold';
    fields.priority.value = Number.isFinite(Number(data.priority)) ? String(Number(data.priority)) : '0';
    fields.start.value = data.start || '';
    fields.end.value = data.end || '';
    fields.url.value = data.url || '';
    fields.link_ar.value = data.link_ar || '';
    fields.link_en.value = data.link_en || '';
    fields.active.checked = item ? isActive(data.active) : true;
    form.hidden = false;
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    fields.text_ar.focus({ preventScroll: true });
  }

  function renderItem(item, today) {
    const li = document.createElement('li');
    li.className = 'admin-item';
    li.dataset.id = item.id || '';

    const main = document.createElement('div');
    main.className = 'admin-item__main';

    const badges = document.createElement('div');
    badges.className = 'admin-item__badges';

    const state = stateOf(item, today);
    const stateEl = document.createElement('span');
    stateEl.className = `admin-state admin-state--${state.cls}`;
    stateEl.textContent = state.label;
    badges.appendChild(stateEl);

    const tagText = String(item.tag_ar || item.tag_en || '').trim();
    if (tagText) {
      const tag = document.createElement('span');
      tag.className = 'admin-tag';
      tag.textContent = tagText;
      badges.appendChild(tag);
    }
    main.appendChild(badges);

    const text = document.createElement('p');
    text.className = 'admin-item__text';
    text.textContent = String(item.text_ar || item.text_en || 'بدون نص');
    if (!item.text_ar && item.text_en) {
      text.lang = 'en';
      text.dir = 'ltr';
    }
    main.appendChild(text);

    const meta = document.createElement('p');
    meta.className = 'admin-item__meta';
    const parts = [];
    if (item.start || item.end) parts.push(`${item.start || '…'} ← ${item.end || '…'}`);
    parts.push(`الأولوية ${Number(item.priority) || 0}`);
    if (item.url) parts.push(`\u2066${String(item.url)}\u2069`);
    meta.textContent = parts.join(' · ');
    main.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'admin-item__actions';

    const edit = actionButton('تعديل', 'pencil', 'btn btn--secondary btn--sm');
    edit.addEventListener('click', () => openForm(item));

    const remove = actionButton('حذف', 'trash-2', 'btn btn--ghost btn--sm admin-item__delete');
    remove.addEventListener('click', () => deleteItem(item));

    actions.append(edit, remove);
    li.append(main, actions);
    return li;
  }

  function renderList(items) {
    const today = todayISO();
    list.replaceChildren();
    items.forEach((item) => list.appendChild(renderItem(item, today)));
    empty.hidden = items.length > 0;
  }

  function notifyTickerUpdate() {
    try { sessionStorage.removeItem('akh_announcements_cache_v1'); } catch {}
    window.dispatchEvent(new CustomEvent('akh:announcements-refresh'));
  }

  async function loadList() {
    setStatus(panelStatus, 'جارٍ التحميل…');
    const { ok, data } = await api('/api/announcements');
    if (!ok) {
      setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر تحميل الإعلانات.', 'error');
      return;
    }
    if (!data || data.admin !== true) {
      storeToken('');
      showLogin('انتهت الجلسة. سجّل الدخول من جديد.');
      return;
    }
    const items = Array.isArray(data.items) ? data.items : [];
    renderList(items);
    setStatus(panelStatus, items.length ? `عدد الإعلانات: ${items.length}` : '');
    notifyTickerUpdate();
  }

  async function deleteItem(item) {
    if (!item || !item.id) return;
    if (!window.confirm('حذف هذا الإعلان نهائيًا؟')) return;
    setStatus(panelStatus, 'جارٍ الحذف…');
    const { ok, data } = await api('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id: item.id }),
    });
    if (!ok) {
      setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر الحذف.', 'error');
      return;
    }
    await loadList();
    setStatus(panelStatus, 'تم الحذف.', 'ok');
    notifyTickerUpdate();
  }

  async function init() {
    const { ok, data } = await api('/api/admin/login');
    if (ok && data && data.ready === false) {
      showLogin('لوحة التحكم غير مفعّلة حالياً.');
      const submit = loginForm.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;
      return;
    }
    if (ok && data && data.authenticated === true && token) {
      showPanel();
      await loadList();
      return;
    }
    if (token) storeToken('');
    showLogin();
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = String(loginForm.elements.password.value || '');
    if (!password) {
      setStatus(loginStatus, 'أدخل كلمة المرور.', 'error');
      return;
    }
    const submit = loginForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setStatus(loginStatus, 'جارٍ التحقق…');

    const { ok, data } = await api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (submit) submit.disabled = false;
    if (!ok) {
      setStatus(loginStatus, (data && data.error && data.error.ar) || 'تعذّر الدخول. حاول مرة أخرى.', 'error');
      return;
    }

    storeToken(String(data.token || ''));
    loginForm.reset();
    setStatus(loginStatus, '');
    showPanel();
    await loadList();
  });

  newButton.addEventListener('click', () => openForm(null));
  if (seedButton) {
    seedButton.addEventListener('click', async () => {
      if (!seedItems.length) return;
      seedButton.disabled = true;
      let saved = 0;
      for (const item of seedItems) {
        setStatus(panelStatus, `جارٍ إضافة الإعلانات الجاهزة… (${saved + 1}/${seedItems.length})`);
        const { ok, data } = await api('/api/announcements', {
          method: 'POST',
          body: JSON.stringify({ action: 'save', item }),
        });
        if (!ok) {
          seedButton.disabled = false;
          setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر إضافة الإعلانات الجاهزة.', 'error');
          return;
        }
        saved += 1;
      }
      await loadList();
      setStatus(panelStatus, `تمت إضافة ${saved} إعلانات جاهزة.`, 'ok');
      notifyTickerUpdate();
    });
  }
  refreshButton.addEventListener('click', () => loadList());
  cancelButton.addEventListener('click', () => closeForm());
  logoutButton.addEventListener('click', () => {
    storeToken('');
    closeForm();
    showLogin('تم تسجيل الخروج.');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !form.hidden) closeForm();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = form.elements;
    const url = String(fields.url.value || '').trim();
    if (url && !/^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)/i.test(url)) {
      setStatus(panelStatus, 'الرابط يجب أن يبدأ بـ / أو https://', 'error');
      fields.url.focus();
      return;
    }

    const item = {
      id: fields.id.value,
      text_ar: fields.text_ar.value,
      text_en: fields.text_en.value,
      tag_ar: fields.tag_ar.value,
      tag_en: fields.tag_en.value,
      tone: fields.tone.value,
      priority: Number(fields.priority.value) || 0,
      start: fields.start.value,
      end: fields.end.value,
      url,
      link_ar: fields.link_ar.value,
      link_en: fields.link_en.value,
      active: fields.active.checked,
    };

    if (!item.text_ar.trim() && !item.text_en.trim()) {
      setStatus(panelStatus, 'اكتب نص الإعلان بالعربية أو الإنجليزية.', 'error');
      fields.text_ar.focus();
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setStatus(panelStatus, 'جارٍ الحفظ…');

    const { ok, data } = await api('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({ action: 'save', item }),
    });

    if (submit) submit.disabled = false;
    if (!ok) {
      setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر الحفظ.', 'error');
      return;
    }

    closeForm();
    await loadList();
    setStatus(panelStatus, 'تم الحفظ.', 'ok');
    notifyTickerUpdate();
  });

  init();
})();
