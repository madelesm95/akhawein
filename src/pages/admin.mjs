import { html, raw } from '../lib/html.mjs';
import { icon } from '../lib/components.mjs';
import { announcements } from '../content/announcements.mjs';

// Flat rows for the sheet, built from the fallback announcements already
// published with the site. The panel offers a one-click import when the sheet
// is empty, and re-running it is safe because saving upserts by id.
const seedItems = announcements.fallback.map((item) => ({
  id: item.id,
  text_ar: item.text?.ar || '',
  text_en: item.text?.en || '',
  tag_ar: item.tag?.ar || '',
  tag_en: item.tag?.en || '',
  url: item.url || '',
  link_ar: item.linkLabel?.ar || '',
  link_en: item.linkLabel?.en || '',
  tone: item.tone || 'gold',
  priority: item.priority || 0,
}));

// Arabic-only, password-protected panel at /admin.
// It renders empty shells; assets/js/admin.js fills the list and the form.
export default function adminPage(ctx, { assets } = {}) {
  // Icons used by client-rendered rows must exist in the shared sprite.
  ['pencil', 'trash-2'].forEach((name) => ctx.usedIcons.add(name));

  const body = html`
<section class="section admin-page" data-admin>
  <div class="container">
    <div class="admin-head">
      <p class="eyebrow">إدارة المحتوى</p>
      <h1>لوحة الإعلانات</h1>
      <p class="admin-head__lead">أضف إعلانات شريط «آخر الإعلانات» وعدّلها من هنا. تُحفظ في Google Sheets وتظهر في الموقع خلال دقائق، بدون إعادة نشر.</p>
    </div>

    <div class="admin-card" data-admin-login>
      <form class="admin-login" data-admin-login-form novalidate>
        <div class="field">
          <label for="admin-password">كلمة المرور</label>
          <input id="admin-password" name="password" type="password" autocomplete="current-password" required minlength="8" dir="ltr">
        </div>
        <button class="btn btn--primary" type="submit">${icon(ctx, 'lock')}<span>دخول</span></button>
      </form>
      <p class="admin-status" data-admin-status role="status" aria-live="polite"></p>
    </div>

    <div class="admin-panel" data-admin-panel hidden>
      <div class="admin-toolbar">
        <button class="btn btn--primary btn--sm" type="button" data-admin-new>${icon(ctx, 'plus')}<span>إعلان جديد</span></button>
        <button class="btn btn--secondary btn--sm" type="button" data-admin-refresh>${icon(ctx, 'refresh-cw')}<span>تحديث القائمة</span></button>
        <button class="btn btn--ghost btn--sm" type="button" data-admin-logout>${icon(ctx, 'log-out')}<span>خروج</span></button>
        <p class="admin-status" data-admin-status-panel role="status" aria-live="polite"></p>
      </div>

      <form class="admin-form" data-admin-form hidden novalidate>
        <input type="hidden" name="id">
        <div class="admin-form__head">
          <h2 data-admin-form-title>إعلان جديد</h2>
          <p class="admin-hint">النص العربي مطلوب. لو النص الإنجليزي فارغ، يظهر العربي في الصفحة الإنجليزية.</p>
        </div>
        <div class="form-grid">
          <div class="field field--full">
            <label for="admin-text-ar">النص بالعربية <span class="req" aria-hidden="true">*</span></label>
            <textarea id="admin-text-ar" name="text_ar" rows="2" maxlength="600" required></textarea>
          </div>
          <div class="field field--full">
            <label for="admin-text-en">النص بالإنجليزية</label>
            <textarea id="admin-text-en" name="text_en" rows="2" maxlength="600" dir="ltr"></textarea>
          </div>
          <div class="field">
            <label for="admin-tag-ar">الوسم بالعربية</label>
            <input id="admin-tag-ar" name="tag_ar" maxlength="40" placeholder="قادم">
          </div>
          <div class="field">
            <label for="admin-tag-en">الوسم بالإنجليزية</label>
            <input id="admin-tag-en" name="tag_en" maxlength="40" dir="ltr" placeholder="Upcoming">
          </div>
          <div class="field">
            <label for="admin-tone">لون الوسم</label>
            <select id="admin-tone" name="tone">
              <option value="gold">ذهبي</option>
              <option value="green">أخضر</option>
              <option value="red">أحمر</option>
              <option value="navy">كحلي</option>
            </select>
          </div>
          <div class="field">
            <label for="admin-priority">الأولوية</label>
            <input id="admin-priority" name="priority" type="number" min="0" max="1000" step="1" value="0" dir="ltr">
          </div>
          <div class="field">
            <label for="admin-start">تبدأ في</label>
            <input id="admin-start" name="start" type="date" dir="ltr">
          </div>
          <div class="field">
            <label for="admin-end">تنتهي في</label>
            <input id="admin-end" name="end" type="date" dir="ltr">
          </div>
          <div class="field field--full">
            <label for="admin-url">الرابط (اختياري)</label>
            <input id="admin-url" name="url" maxlength="500" dir="ltr" placeholder="/activities أو https://...">
          </div>
          <div class="field">
            <label for="admin-link-ar">نص الرابط بالعربية</label>
            <input id="admin-link-ar" name="link_ar" maxlength="40" placeholder="التفاصيل">
          </div>
          <div class="field">
            <label for="admin-link-en">نص الرابط بالإنجليزية</label>
            <input id="admin-link-en" name="link_en" maxlength="40" dir="ltr" placeholder="Details">
          </div>
          <div class="admin-check">
            <input id="admin-active" name="active" type="checkbox" checked>
            <label for="admin-active">ظاهر في الشريط</label>
          </div>
        </div>
        <div class="admin-form__actions">
          <button class="btn btn--primary" type="submit">${icon(ctx, 'check')}<span>حفظ</span></button>
          <button class="btn btn--ghost" type="button" data-admin-cancel>إلغاء</button>
        </div>
      </form>

      <ul class="admin-list" data-admin-list></ul>
      <div class="admin-empty" data-admin-empty hidden>
        <p>لا توجد إعلانات بعد. ابدأ بـ «إعلان جديد» أو أضف الإعلانات الجاهزة المبنية على محتوى الموقع.</p>
        <button class="btn btn--secondary btn--sm" type="button" data-admin-seed>${icon(ctx, 'sparkles')}<span>إضافة ${seedItems.length} إعلانات جاهزة</span></button>
      </div>
    </div>
  </div>
  <script type="application/json" data-admin-seed-data>${raw(JSON.stringify(seedItems).replace(/</g, '\\u003c'))}</script>
</section>
${assets && assets.adminJs ? html`<script src="/assets/js/admin.min.js?v=${assets.adminJs}" defer></script>` : ''}
`;

  return {
    title: { ar: 'لوحة الإعلانات' },
    description: { ar: 'لوحة إدارة إعلانات شريط الموقع.' },
    noindex: true,
    body,
  };
}
