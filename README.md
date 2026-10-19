# جمعية أخوين الخيرية — Akhawein Charity website

Static, bilingual (Arabic RTL at `/`, English LTR at `/en/`) site with light and dark themes. Deployed on Vercel as plain files — Vercel does not run a build; the generated HTML is committed.

## Editing content

All text lives in `src/content/` as `{ ar: '…', en: '…' }` pairs. Never edit the generated `*.html` files — they are overwritten by the build.

| What | File |
|---|---|
| Organisation details, nav, footer, impact numbers | `src/content/site.mjs` |
| Bank accounts (IBANs are checksum-validated; invalid ones are not published) | `src/content/accounts.mjs` |
| Causes / donation cases | `src/content/causes.mjs` |
| 16 fields of work | `src/content/programs.mjs` |
| Gallery photos and videos | `src/content/gallery.mjs` |
| Protocols and partner logos | `src/content/partners.mjs` |
| Branches | `src/content/branches.mjs` |
| About page, board, vision/mission | `src/content/about.mjs` |
| Certificates of appreciation | `src/content/certificates.json` |

Page layouts are in `src/pages/`, shared markup in `src/lib/`, styles in `assets/css/site.css`, behaviour in `assets/js/site.js`.

## Building

```bash
npm install          # once (Node 20+)
npm run build        # regenerate all pages + minified CSS/JS
npm start            # preview at http://localhost:5500
```

When you add or replace a photo:

1. Put the original in `images/` and register it in `src/images.mjs` (an id → source path).
2. `npm run images` — writes responsive WebP files to `assets/img/`.
3. Reference the id from content, then `npm run build`.

Other generators: `npm run icons` (adds Lucide/Simple Icons names listed in `src/icons.mjs`), `npm run fonts` (re-downloads the self-hosted fonts into `assets/fonts/`).

## Notes

- Only optimised files under `assets/` are deployed. `images/` holds the originals (some are unblurred photos of beneficiaries) and is excluded in `.vercelignore`.
- Old Arabic URLs (`/عن-الجمعية`, `/وسائل-التبرع`, …) still work through the rewrites in `vercel.json`.
- The contact form posts to FormSubmit (`info@akhawein.org`); if that fails it opens WhatsApp with the message pre-filled. FormSubmit needs a one-time confirmation from the inbox the first time it is used.
- `/webmail` redirects to the existing email login at `https://mail.akhawein.org:2096/`. Use the full email address and existing mailbox password; cPanel administration on port 2083 uses a separate hosting-account login.
- Vercel hosts the website, not the mailboxes. Keep the existing email hosting active and preserve the mail server's A, MX, SPF, and DKIM records when changing DNS providers.
