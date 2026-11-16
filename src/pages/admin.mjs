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
  ['pencil', 'trash-2', 'copy', 'check', 'search', 'eye', 'circle-check', 'plus', 'refresh-cw', 'log-out', 'sparkles', 'x'].forEach((name) => ctx.usedIcons.add(name));

  const body = html`
<section class="section admin-page" data-admin>
  <div class="admin-top-loader" data-admin-top-loader hidden aria-hidden="true">
    <div class="admin-top-loader__bar"></div>
  </div>
  <div class="admin-process-pill" data-admin-process-pill hidden role="status" aria-live="polite">
    <span class="admin-spinner" aria-hidden="true"></span>
    <span class="admin-process-pill__text" data-admin-process-text>جارٍ تنفيذ العملية...</span>
  </div>
  <div class="container">
    <div class="admin-head">
      <p class="eyebrow">إدارة المحتوى</p>
      <h1>لوحة الإعلانات</h1>
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
        <button class="btn btn--secondary btn--sm" type="button" data-admin-bulk-enable title="تفعيل جميع الإعلانات دفعة واحدة">${icon(ctx, 'check')}<span>تفعيل الكل</span></button>
        <button class="btn btn--ghost btn--sm admin-toolbar__btn-off" type="button" data-admin-bulk-disable title="إيقاف جميع الإعلانات دفعة واحدة">${icon(ctx, 'x')}<span>إيقاف الكل</span></button>
        <button class="btn btn--ghost btn--sm" type="button" data-admin-refresh title="تحديث القائمة">${icon(ctx, 'refresh-cw')}<span>تحديث</span></button>
        <button class="btn btn--ghost btn--sm" type="button" data-admin-logout title="تسجيل الخروج">${icon(ctx, 'log-out')}<span>خروج</span></button>
        <p class="admin-status" data-admin-status-panel role="status" aria-live="polite"></p>
      </div>

      <div class="admin-progress" data-admin-progress role="progressbar" aria-label="تقدم العملية" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" hidden>
        <span class="admin-progress__bar" data-admin-progress-bar></span>
      </div>

      <div class="admin-filter-bar" data-admin-filter-bar>
        <div class="admin-search">
          <span class="admin-search__icon" aria-hidden="true">${icon(ctx, 'search')}</span>
          <input id="admin-search-input" type="search" placeholder="ابحث في الإعلانات بالنص أو الوسم أو الرابط..." data-admin-search autocomplete="off">
          <button type="button" class="admin-search__clear" data-admin-search-clear aria-label="مسح البحث" hidden>${icon(ctx, 'x')}</button>
        </div>
        <div class="admin-filter-pills" role="tablist" aria-label="تصفية الإعلانات">
          <button type="button" class="admin-pill is-active" data-filter="all" role="tab" aria-selected="true">
            <span>الكل</span>
            <span class="admin-pill__count" data-count-all>0</span>
          </button>
          <button type="button" class="admin-pill" data-filter="live" role="tab" aria-selected="false">
            <span>النشطة</span>
            <span class="admin-pill__count" data-count-live>0</span>
          </button>
          <button type="button" class="admin-pill" data-filter="off" role="tab" aria-selected="false">
            <span>الموقوفة</span>
            <span class="admin-pill__count" data-count-off>0</span>
          </button>
        </div>
      </div>

      <form class="admin-form" data-admin-form hidden novalidate>
        <input type="hidden" name="id">
        <div class="admin-form__head">
          <h2 data-admin-form-title>إعلان جديد</h2>
          <p class="admin-hint">النص العربي مطلوب. لو النص الإنجليزي فارغ، يظهر العربي في الصفحة الإنجليزية.</p>
        </div>

        <div class="admin-preview-box">
          <div class="admin-preview-box__head">
            <span class="admin-preview-box__title">${icon(ctx, 'eye')}<span>معاينة حية لشريط الموقع</span></span>
            <span class="admin-preview-box__hint">تتحدث فورياً مع الكتابة</span>
          </div>
          <div class="admin-preview-bar">
            <div class="admin-preview-ticker" data-preview-bar>
              <span class="admin-preview-tag" data-preview-tag>إعلان</span>
              <span class="admin-preview-text" data-preview-text>اكتب نص الإعلان لترى المعاينة هنا...</span>
              <span class="admin-preview-link" data-preview-link hidden></span>
            </div>
          </div>
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
            <div class="admin-quick-links">
              <span class="admin-quick-links__label">وجهات سريعة:</span>
              <div class="admin-quick-links__chips">
                <button type="button" class="admin-chip" data-quick-url="/causes" data-quick-label="عرض الحالات">حالات التبرع</button>
                <button type="button" class="admin-chip" data-quick-url="/donations" data-quick-label="تبرع الآن">التبرع العام</button>
                <button type="button" class="admin-chip" data-quick-url="/activities" data-quick-label="تعرف على أنشطتنا">أنشطتنا</button>
                <button type="button" class="admin-chip" data-quick-url="/stories" data-quick-label="قصص الأثر">قصص الأثر</button>
                <button type="button" class="admin-chip" data-quick-url="/branches" data-quick-label="فروعنا">فروعنا</button>
                <button type="button" class="admin-chip" data-quick-url="/contact" data-quick-label="تواصل معنا">تواصل معنا</button>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="admin-link-ar">نص الرابط بالعربية</label>
            <input id="admin-link-ar" name="link_ar" maxlength="40" placeholder="التفاصيل">
          </div>
          <div class="field">
            <label for="admin-link-en">نص الرابط بالإنجليزية</label>
            <input id="admin-link-en" name="link_en" maxlength="40" dir="ltr" placeholder="Details">
          </div>
          <div class="field field--full admin-form__switch-field">
            <label class="admin-switch admin-switch--inline">
              <input id="admin-active" name="active" type="checkbox" checked class="admin-switch__input">
              <span class="admin-switch__track">
                <span class="admin-switch__thumb"></span>
              </span>
              <span class="admin-switch__label">
                <strong>ظاهر في شريط الإعلانات</strong>
                <small>عند إيقافه لن يظهر للزوار في الشريط العلوي</small>
              </span>
            </label>
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
