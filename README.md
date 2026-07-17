# Shri Navnath Constructions — Website & Admin CMS

A production-ready Next.js + Supabase website for Shri Navnath Constructions
(Akot, Maharashtra), built by Mr. Pundlik Wamanrao Jayale in 2005. Includes
the public marketing site, an "Enquire Now" lead system, Supabase email-OTP
login, and a full admin dashboard/CMS — no code required to run the day-to-day
site once it's deployed.

## What's inside

- **Public site** — Home, About, Services, Gallery, Founder, Contact, Enquire Now
- **Auth** — Supabase email OTP (6-digit code, no passwords, no magic links). Whoever
  signs in with `NEXT_PUBLIC_ADMIN_EMAIL` becomes Admin; everyone else is a normal User.
- **Admin dashboard** (`/admin`) — stats, Enquiries CRM (status pipeline, call/email/export),
  Projects CRUD, Employees CRUD, Media Library, Website Management (edit hero image/text,
  about copy, contact details, footer — no redeploy needed), Activity Log, Settings
- **Enquiry system** — public form, no account required, stored in Supabase, optional
  file attachment, best-effort confirmation email via a Supabase Edge Function + Resend
- **Real photos only** — the 7 photos you provided (1 founder portrait, 6 site photos)
  were enhanced (denoise, local contrast, color/sharpness grading) and are the only
  images used; no stock photos, no fake projects, no invented stats
- **SEO** — metadata, Open Graph/Twitter cards, `robots.txt`, `sitemap.xml`, favicon
- **New logo** — geometric "SNC" mark + wordmark, in `/public/logo` (SVG, PNG, black
  & white, favicon set)

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project (free tier is enough to start).
2. Once created, go to **SQL Editor** → paste the entire contents of
   `supabase/schema.sql` → Run. This creates every table, security policy, and the
   `media` storage bucket. It's safe to re-run if you ever need to.
3. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server-side only)

## 2. Configure email OTP (not magic link)

By default Supabase's email template sends a clickable magic link. To send a
**6-digit code** instead:

1. **Authentication → Email Templates → Magic Link** (this template is used for
   `signInWithOtp`).
2. Edit the body so it displays `{{ .Token }}` (the 6-digit code) instead of / in
   addition to `{{ .ConfirmationURL }}`. Supabase's own docs have a ready-made OTP
   template you can paste in — search "Supabase OTP email template" if you want the
   official copy.
3. **Authentication → Providers → Email** — confirm OTP expiry and rate limits suit you
   (defaults are fine to start).

Until you do this, Supabase will still email a link that also works, but the UI on this
site is built for entering a 6-digit code, so this step matters.

## 3. Set environment variables

Copy `.env.example` to `.env.local` (for local dev) and fill in real values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ADMIN_EMAIL=pundlikwjayale@gmail.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
RESEND_API_KEY=...          # optional, see step 5
RESEND_FROM_EMAIL=...       # optional, see step 5
```

`NEXT_PUBLIC_ADMIN_EMAIL` must exactly match the email you'll sign in with as the
owner — it's also hard-coded once inside `supabase/schema.sql` (the
`handle_new_user` function). If you ever change the admin email, update it in
**both** places and re-run that part of the SQL.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Sign in with the admin email to reach `/admin`.

## 5. (Optional) Enquiry confirmation emails

The enquiry form works fully without this step — every enquiry is saved to Supabase
and visible in `/admin/enquiries` regardless. This step only adds the auto-reply email
to the visitor.

1. Create a free account at [resend.com](https://resend.com) and verify a sending domain
   (or use their test domain while developing).
2. Install the Supabase CLI, then from the project root:
   ```bash
   supabase functions deploy send-enquiry-email
   supabase secrets set RESEND_API_KEY=your-key RESEND_FROM_EMAIL=enquiries@yourdomain.com
   ```
3. That's it — `submitEnquiry` already calls this function automatically.

## 6. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import it in [vercel.com](https://vercel.com) → it auto-detects Next.js.
3. Add the same environment variables from step 3 in Vercel's Project Settings → Environment Variables.
4. Deploy. Update `NEXT_PUBLIC_SITE_URL` to your real domain once it's live (affects
   SEO metadata + sitemap).

## Project structure

```
app/                  Routes (App Router) — public pages + /admin/*
components/           UI components, grouped by area (home, admin, auth, shared...)
lib/actions/          Server actions (all Supabase writes go through here)
lib/supabase/         Supabase client factories (browser / server / middleware / service-role)
supabase/schema.sql   Full DB schema, RLS policies, storage bucket
supabase/functions/   Edge Function for enquiry confirmation emails
public/images/        Your 7 enhanced photos (+ WebP versions)
public/logo/          New SNC logo — SVG, PNG, black/white, favicon
scripts/enhance.py    The photo-enhancement script used on your uploads — reuse it
                       for future site photos (denoise, local contrast, sharpen, resize)
```

## Notes on a few decisions

- **Next.js version**: pinned to `15.5.20` rather than the very latest major (16) —
  it's fully current and secure, and every API used here (async `cookies()`,
  Server Actions, etc.) is verified working against it end-to-end (`npm run build`
  passes clean). Upgrading later is a normal `npm install next@latest`.
- **Fonts**: Inter + Plus Jakarta Sans are self-hosted (`app/fonts/`) rather than
  fetched from Google Fonts at build time — same OFL-licensed files, just bundled
  locally so builds don't depend on an external request.
- **No numbered "Projects #1/#2/#3" page**: per your brief, the public Gallery shows
  your real photos as a craftsmanship showcase, not a counted project list. The admin
  Projects CRUD is there and ready for when you want to start adding real, individual
  projects going forward — it stays empty until you add something.
- **Media/file uploads**: everything (project photos, employee photos, homepage hero,
  logo, enquiry attachments) goes into one Supabase Storage bucket (`media`), so
  "upload once, use everywhere" holds for the whole site.
