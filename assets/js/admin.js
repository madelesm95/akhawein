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

  // Enhanced Toolbar & Filter Controls
  const bulkEnableButton = $('[data-admin-bulk-enable]');
  const bulkDisableButton = $('[data-admin-bulk-disable]');
  const progressWrap = $('[data-admin-progress]');
  const progressBar = $('[data-admin-progress-bar]');
  const searchInput = $('[data-admin-search]');
  const searchClear = $('[data-admin-search-clear]');
  const filterPills = Array.from(root.querySelectorAll('[data-filter]'));
  const countAll = $('[data-count-all]');
  const countLive = $('[data-count-live]');
  const countOff = $('[data-count-off]');

  // Loading & Process Indicator Elements
  const topLoader = $('[data-admin-top-loader]');
  const processPill = $('[data-admin-process-pill]');
  const processPillText = $('[data-admin-process-text]');

  let activeProcessCount = 0;

  function showBusy(message = 'جارٍ تنفيذ العملية…') {
    activeProcessCount++;
    if (topLoader) topLoader.hidden = false;
    if (processPill) {
      if (processPillText) processPillText.textContent = message;
      processPill.hidden = false;
    }
  }

  function updateBusyMessage(message) {
    if (processPillText && message) processPillText.textContent = message;
  }

  function hideBusy() {
    activeProcessCount = Math.max(0, activeProcessCount - 1);
    if (activeProcessCount === 0) {
      if (topLoader) topLoader.hidden = true;
      if (processPill) processPill.hidden = true;
    }
  }

  // Live Preview Elements
  const previewTag = $('[data-preview-tag]');
  const previewText = $('[data-preview-text]');
  const previewLink = $('[data-preview-link]');

  // Quick Destination Chips
  const quickChips = Array.from(root.querySelectorAll('[data-quick-url]'));

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

  let allItems = [];
  let currentFilter = 'all';
  let searchQuery = '';

  function storeToken(value) {
    token = value || '';
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch { /* storage unavailable */ }
  }

  function setStatus(node, message, kind, busy) {
    if (!node) return;
    node.textContent = message || '';
    if (kind) node.dataset.kind = kind;
    else delete node.dataset.kind;
    if (busy) node.dataset.busy = 'true';
    else delete node.dataset.busy;
  }

  function setProgress(completed, total) {
    if (!progressWrap || !progressBar) return;
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    progressWrap.hidden = false;
    progressWrap.setAttribute('aria-valuenow', String(percent));
    progressBar.style.width = `${percent}%`;
  }

  function hideProgress() {
    if (progressWrap) {
      progressWrap.hidden = true;
      progressWrap.setAttribute('aria-valuenow', '0');
    }
    if (progressBar) progressBar.style.width = '0%';
  }

  async function api(path, options = {}) {
    const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    let response;
    try {
      response = await fetch(path, { ...options, headers, cache: 'no-store', signal: controller.signal });
    } catch {
      return { ok: false, offline: true, data: null };
    } finally {
      clearTimeout(timer);
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

  function updateLivePreview() {
    if (!previewText) return;
    const fields = form.elements;
    const tag = String(fields.tag_ar.value || fields.tag_en.value || '').trim();
    const text = String(fields.text_ar.value || fields.text_en.value || '').trim();
    const tone = TONES.includes(String(fields.tone.value)) ? String(fields.tone.value) : 'gold';
    const url = String(fields.url.value || '').trim();
    const linkLabel = String(fields.link_ar.value || fields.link_en.value || 'التفاصيل').trim();

    if (previewTag) {
      previewTag.textContent = tag || 'إعلان';
      previewTag.dataset.tone = tone;
    }
    if (previewText) {
      previewText.textContent = text || 'اكتب نص الإعلان لترى المعاينة هنا...';
    }
    if (previewLink) {
      if (url) {
        previewLink.hidden = false;
        previewLink.textContent = `${linkLabel} ›`;
      } else {
        previewLink.hidden = true;
      }
    }
  }

  function openForm(item, isClone = false) {
    const data = item || {};
    const fields = form.elements;
    if (isClone) {
      formTitle.textContent = 'نسخ إعلان جديد';
      fields.id.value = '';
    } else {
      formTitle.textContent = item && item.id ? 'تعديل الإعلان' : 'إعلان جديد';
      fields.id.value = data.id || '';
    }
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

    updateLivePreview();
    form.hidden = false;
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    fields.text_ar.focus({ preventScroll: true });
  }

  function renderItem(item, today) {
    const li = document.createElement('li');
    const active = isActive(item.active);
    li.className = `admin-item${active ? '' : ' admin-item--off'}`;
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

    // Interactive One-Click Toggle Switch
    const switchWrap = document.createElement('div');
    switchWrap.className = 'admin-item__switch-wrap';

    const switchLabel = document.createElement('label');
    switchLabel.className = 'admin-switch';
    switchLabel.title = active ? 'إيقاف الإعلان فورياً' : 'تفعيل الإعلان فورياً';

    const switchInput = document.createElement('input');
    switchInput.type = 'checkbox';
    switchInput.className = 'admin-switch__input';
    switchInput.checked = active;

    const switchTrack = document.createElement('span');
    switchTrack.className = 'admin-switch__track';
    const switchThumb = document.createElement('span');
    switchThumb.className = 'admin-switch__thumb';
    switchTrack.appendChild(switchThumb);

    const switchText = document.createElement('span');
    switchText.className = 'admin-switch__label';
    switchText.textContent = active ? 'نشط' : 'موقوف';

    switchLabel.append(switchInput, switchTrack, switchText);
    switchWrap.appendChild(switchLabel);

    switchInput.addEventListener('change', async () => {
      const nextActive = switchInput.checked;
      switchLabel.classList.add('is-loading');
      switchInput.disabled = true;
      setStatus(panelStatus, 'جارٍ تحديث حالة الإعلان…', undefined, true);
      showBusy(nextActive ? 'جارٍ تفعيل الإعلان…' : 'جارٍ إيقاف الإعلان…');

      try {
        const updated = { ...item, active: nextActive ? 'TRUE' : 'FALSE' };
        const { ok, data } = await api('/api/announcements', {
          method: 'POST',
          body: JSON.stringify({ action: 'save', item: updated }),
        });

        if (!ok) {
          switchInput.checked = !nextActive;
          setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر تحديث الحالة.', 'error');
          return;
        }

        item.active = nextActive ? 'TRUE' : 'FALSE';
        switchText.textContent = nextActive ? 'نشط' : 'موقوف';
        switchLabel.title = nextActive ? 'إيقاف الإعلان فورياً' : 'تفعيل الإعلان فورياً';
        li.classList.toggle('admin-item--off', !nextActive);

        const newState = stateOf(item, todayISO());
        stateEl.className = `admin-state admin-state--${newState.cls}`;
        stateEl.textContent = newState.label;

        notifyTickerUpdate();
        updateFilterCounts();
        setStatus(panelStatus, nextActive ? 'تم تفعيل الإعلان فورياً.' : 'تم إيقاف الإعلان فورياً.', 'ok');
      } finally {
        switchLabel.classList.remove('is-loading');
        switchInput.disabled = false;
        hideBusy();
      }
    });

    const edit = actionButton('تعديل', 'pencil', 'btn btn--secondary btn--sm');
    edit.addEventListener('click', () => openForm(item));

    const copy = actionButton('نسخ', 'copy', 'btn btn--ghost btn--sm');
    copy.title = 'نسخ هذا الإعلان لإنشاء إعلان جديد منه';
    copy.addEventListener('click', () => openForm(item, true));

    const remove = actionButton('حذف', 'trash-2', 'btn btn--ghost btn--sm admin-item__delete');
    remove.addEventListener('click', () => deleteItem(item, remove));

    actions.append(switchWrap, edit, copy, remove);
    li.append(main, actions);
    return li;
  }

  function updateFilterCounts() {
    const today = todayISO();
    let liveCount = 0;
    let offCount = 0;
    allItems.forEach((item) => {
      const s = stateOf(item, today);
      if (s.cls === 'live') liveCount += 1;
      else if (s.cls === 'off') offCount += 1;
    });

    if (countAll) countAll.textContent = String(allItems.length);
    if (countLive) countLive.textContent = String(liveCount);
    if (countOff) countOff.textContent = String(offCount);
  }

  function filterAndRender() {
    const today = todayISO();
    updateFilterCounts();

    let items = allItems.slice();

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((item) => {
        const textAr = String(item.text_ar || '').toLowerCase();
        const textEn = String(item.text_en || '').toLowerCase();
        const tagAr = String(item.tag_ar || '').toLowerCase();
        const tagEn = String(item.tag_en || '').toLowerCase();
        const url = String(item.url || '').toLowerCase();
        return textAr.includes(q) || textEn.includes(q) || tagAr.includes(q) || tagEn.includes(q) || url.includes(q);
      });
    }

    if (currentFilter === 'live') {
      items = items.filter((item) => stateOf(item, today).cls === 'live');
    } else if (currentFilter === 'off') {
      items = items.filter((item) => !isActive(item.active));
    }

    // Sort by priority descending (highest first)
    items.sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0));

    list.replaceChildren();
    items.forEach((item) => list.appendChild(renderItem(item, today)));

    if (allItems.length === 0) {
      empty.hidden = false;
      const p = empty.querySelector('p');
      if (p) p.textContent = 'لا توجد إعلانات بعد. ابدأ بـ «إعلان جديد» أو أضف الإعلانات الجاهزة المبنية على محتوى الموقع.';
    } else if (items.length === 0) {
      empty.hidden = false;
      const p = empty.querySelector('p');
      if (p) p.textContent = 'لا توجد إعلانات مطابقة لخيارات البحث والفلترة.';
    } else {
      empty.hidden = true;
    }
  }

  function notifyTickerUpdate() {
    try { sessionStorage.removeItem('akh_announcements_cache_v1'); } catch {}
    window.dispatchEvent(new CustomEvent('akh:announcements-refresh'));
  }

  async function loadList(isUserRefresh = false) {
    if (refreshButton) {
      refreshButton.disabled = true;
      refreshButton.classList.add('is-loading');
    }
    if (list) list.classList.add('is-busy');
    setStatus(panelStatus, isUserRefresh ? 'جارٍ تحديث الإعلانات…' : 'جارٍ التحميل…', undefined, true);
    showBusy(isUserRefresh ? 'جارٍ تحديث قائمة الإعلانات…' : 'جارٍ تحميل الإعلانات…');

    try {
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
      allItems = Array.isArray(data.items) ? data.items : [];
      filterAndRender();
      setStatus(panelStatus, allItems.length ? `عدد الإعلانات: ${allItems.length}` : '');
      notifyTickerUpdate();
    } finally {
      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.classList.remove('is-loading');
      }
      if (list) list.classList.remove('is-busy');
      hideBusy();
    }
  }

  async function deleteItem(item, buttonEl) {
    if (!item || !item.id) return;
    if (!window.confirm('حذف هذا الإعلان نهائيًا؟')) return;
    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.classList.add('is-loading');
    }
    setStatus(panelStatus, 'جارٍ الحذف…', undefined, true);
    showBusy('جارٍ حذف الإعلان…');

    try {
      const { ok, data } = await api('/api/announcements', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', id: item.id }),
      });
      if (!ok) {
        setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر الحذف.', 'error');
        return;
      }
      await loadList();
      setStatus(panelStatus, 'تم الحذف بنجاح.', 'ok');
      notifyTickerUpdate();
    } finally {
      if (buttonEl) {
        buttonEl.disabled = false;
        buttonEl.classList.remove('is-loading');
      }
      hideBusy();
    }
  }

  async function toggleAll(enable) {
    const targets = allItems.filter((item) => (enable ? !isActive(item.active) : isActive(item.active)));
    if (!targets.length) {
      setStatus(panelStatus, enable ? 'جميع الإعلانات مفعّلة بالفعل.' : 'جميع الإعلانات موقوفة بالفعل.', 'ok');
      return;
    }

    const confirmMsg = enable
      ? `هل تريد تفعيل جميع الإعلانات الموقوفة (${targets.length} إعلان)؟`
      : `هل تريد إيقاف جميع الإعلانات النشطة (${targets.length} إعلان)؟`;

    if (!window.confirm(confirmMsg)) return;

    if (bulkEnableButton) bulkEnableButton.disabled = true;
    if (bulkDisableButton) bulkDisableButton.disabled = true;
    const activeBulkBtn = enable ? bulkEnableButton : bulkDisableButton;
    if (activeBulkBtn) activeBulkBtn.classList.add('is-loading');

    const total = targets.length;
    let done = 0;
    const failures = [];

    setProgress(0, total);
    showBusy(`جارٍ ${enable ? 'تفعيل' : 'إيقاف'} الإعلانات (0/${total})…`);

    try {
      for (let i = 0; i < targets.length; i += 1) {
        const item = targets[i];
        setProgress(i, total);
        const msg = `${enable ? 'جارٍ تفعيل' : 'جارٍ إيقاف'} ${i + 1} من ${total}…`;
        setStatus(panelStatus, msg, undefined, true);
        updateBusyMessage(msg);
        const updated = { ...item, active: enable ? 'TRUE' : 'FALSE' };
        const { ok, data } = await api('/api/announcements', {
          method: 'POST',
          body: JSON.stringify({ action: 'save', item: updated }),
        });
        if (ok) {
          item.active = enable ? 'TRUE' : 'FALSE';
          done += 1;
        } else {
          failures.push((data && data.error && data.error.ar) || 'تعذّر الحفظ.');
        }
        setProgress(i + 1, total);
      }
    } finally {
      if (bulkEnableButton) bulkEnableButton.disabled = false;
      if (bulkDisableButton) bulkDisableButton.disabled = false;
      if (activeBulkBtn) activeBulkBtn.classList.remove('is-loading');
      hideBusy();
    }

    // Reload from the source of truth so the panel never shows a state the
    // sheet did not actually save.
    try {
      await loadList();
    } finally {
      hideProgress();
    }
    notifyTickerUpdate();

    if (failures.length) {
      setStatus(
        panelStatus,
        `تم ${enable ? 'تفعيل' : 'إيقاف'} ${done} من ${total}، وفشل ${failures.length}. ${failures[0]}`,
        'error',
      );
    } else {
      setStatus(
        panelStatus,
        `تم ${enable ? 'تفعيل' : 'إيقاف'} ${done} ${done === 1 ? 'إعلان' : 'إعلانات'} بنجاح.`,
        'ok',
      );
    }
  }

  async function init() {
    showBusy('جارٍ التحقق وتجهيز لوحة الإعلانات…');
    try {
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
    } finally {
      hideBusy();
    }
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = String(loginForm.elements.password.value || '');
    if (!password) {
      setStatus(loginStatus, 'أدخل كلمة المرور.', 'error');
      return;
    }
    const submit = loginForm.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = true;
      submit.classList.add('is-loading');
    }
    setStatus(loginStatus, 'جارٍ التحقق…', undefined, true);
    showBusy('جارٍ تسجيل الدخول…');

    try {
      const { ok, data } = await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });

      if (!ok) {
        setStatus(loginStatus, (data && data.error && data.error.ar) || 'تعذّر الدخول. حاول مرة أخرى.', 'error');
        return;
      }

      storeToken(String(data.token || ''));
      loginForm.reset();
      setStatus(loginStatus, '');
      showPanel();
      await loadList();
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.classList.remove('is-loading');
      }
      hideBusy();
    }
  });

  newButton.addEventListener('click', () => openForm(null));

  if (bulkEnableButton) {
    bulkEnableButton.addEventListener('click', () => toggleAll(true));
  }

  if (bulkDisableButton) {
    bulkDisableButton.addEventListener('click', () => toggleAll(false));
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim();
      if (searchClear) searchClear.hidden = !searchQuery;
      filterAndRender();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.hidden = true;
      filterAndRender();
      searchInput.focus();
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');
      currentFilter = pill.dataset.filter || 'all';
      filterAndRender();
    });
  });

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const url = chip.dataset.quickUrl;
      const label = chip.dataset.quickLabel;
      if (url) form.elements.url.value = url;
      if (label && !form.elements.link_ar.value.trim()) {
        form.elements.link_ar.value = label;
      }
      updateLivePreview();
      form.elements.url.focus();
    });
  });

  ['input', 'change'].forEach((evt) => {
    form.addEventListener(evt, updateLivePreview);
  });

  if (seedButton) {
    seedButton.addEventListener('click', async () => {
      if (!seedItems.length) return;
      seedButton.disabled = true;
      seedButton.classList.add('is-loading');
      let saved = 0;
      showBusy(`جارٍ إضافة الإعلانات الجاهزة… (0/${seedItems.length})`);
      try {
        for (const item of seedItems) {
          const msg = `جارٍ إضافة الإعلانات الجاهزة… (${saved + 1}/${seedItems.length})`;
          setStatus(panelStatus, msg, undefined, true);
          updateBusyMessage(msg);
          const { ok, data } = await api('/api/announcements', {
            method: 'POST',
            body: JSON.stringify({ action: 'save', item }),
          });
          if (!ok) {
            setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر إضافة الإعلانات الجاهزة.', 'error');
            return;
          }
          saved += 1;
        }
        await loadList();
        setStatus(panelStatus, `تمت إضافة ${saved} إعلانات جاهزة.`, 'ok');
        notifyTickerUpdate();
      } finally {
        seedButton.disabled = false;
        seedButton.classList.remove('is-loading');
        hideBusy();
      }
    });
  }

  refreshButton.addEventListener('click', () => loadList(true));
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
    if (submit) {
      submit.disabled = true;
      submit.classList.add('is-loading');
    }
    setStatus(panelStatus, 'جارٍ الحفظ…', undefined, true);
    showBusy('جارٍ حفظ الإعلان…');

    try {
      const { ok, data } = await api('/api/announcements', {
        method: 'POST',
        body: JSON.stringify({ action: 'save', item }),
      });

      if (!ok) {
        setStatus(panelStatus, (data && data.error && data.error.ar) || 'تعذّر الحفظ.', 'error');
        return;
      }

      closeForm();
      await loadList();
      setStatus(panelStatus, 'تم الحفظ بنجاح.', 'ok');
      notifyTickerUpdate();
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.classList.remove('is-loading');
      }
      hideBusy();
    }
  });

  init();
})();
