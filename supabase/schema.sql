-- ============================================================================
-- SHRI NAVNATH CONSTRUCTIONS — Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor (or via `supabase db push`)
-- Safe to re-run: every statement is idempotent (create-if-not-exists / or-replace).
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- PROFILES  (one row per authenticated user; role decides admin access)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone verifies an OTP for the first time.
-- The single admin account is whoever signs in with ADMIN_EMAIL below —
-- keep this in sync with NEXT_PUBLIC_ADMIN_EMAIL in your .env.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when lower(new.email) = lower('pundlikwjayale@gmail.com') then 'admin' else 'user' end
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used throughout RLS policies below.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- PROJECTS  (admin-managed; public sees only non-hidden rows)
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  location text,
  construction_type text,
  status text not null default 'ongoing' check (status in ('ongoing', 'completed')),
  cover_image text,
  images text[] not null default '{}',
  is_hidden boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects for select using (is_hidden = false or public.is_admin());
drop policy if exists "projects_admin_insert" on public.projects;
create policy "projects_admin_insert" on public.projects for insert with check (public.is_admin());
drop policy if exists "projects_admin_update" on public.projects;
create policy "projects_admin_update" on public.projects for update using (public.is_admin());
drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete" on public.projects for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- EMPLOYEES
-- ----------------------------------------------------------------------------
create table if not exists public.employees (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  designation text,
  experience_years int,
  phone text,
  email text,
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.employees enable row level security;
drop policy if exists "employees_public_read" on public.employees;
create policy "employees_public_read" on public.employees for select using (true);
drop policy if exists "employees_admin_insert" on public.employees;
create policy "employees_admin_insert" on public.employees for insert with check (public.is_admin());
drop policy if exists "employees_admin_update" on public.employees;
create policy "employees_admin_update" on public.employees for update using (public.is_admin());
drop policy if exists "employees_admin_delete" on public.employees;
create policy "employees_admin_delete" on public.employees for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- MEDIA LIBRARY  (metadata for files stored in the `media` storage bucket)
-- ----------------------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  filename text not null,
  folder text not null default 'general',
  size_kb int,
  uploaded_at timestamptz not null default now()
);

alter table public.media enable row level security;
drop policy if exists "media_public_read" on public.media;
create policy "media_public_read" on public.media for select using (true);
drop policy if exists "media_admin_insert" on public.media;
create policy "media_admin_insert" on public.media for insert with check (public.is_admin());
drop policy if exists "media_admin_update" on public.media;
create policy "media_admin_update" on public.media for update using (public.is_admin());
drop policy if exists "media_admin_delete" on public.media;
create policy "media_admin_delete" on public.media for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- ENQUIRIES  (public can insert only; admin manages the CRM)
-- ----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  mobile text not null,
  email text,
  project_location text,
  construction_type text,
  budget text,
  description text,
  attachment_url text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quotation_sent', 'project_started', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;
drop policy if exists "enquiries_public_insert" on public.enquiries;
create policy "enquiries_public_insert" on public.enquiries for insert with check (true);
drop policy if exists "enquiries_admin_select" on public.enquiries;
create policy "enquiries_admin_select" on public.enquiries for select using (public.is_admin());
drop policy if exists "enquiries_admin_update" on public.enquiries;
create policy "enquiries_admin_update" on public.enquiries for update using (public.is_admin());
drop policy if exists "enquiries_admin_delete" on public.enquiries;
create policy "enquiries_admin_delete" on public.enquiries for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- ACTIVITY LOG  (admin-only, written automatically by server actions)
-- ----------------------------------------------------------------------------
create table if not exists public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  actor_email text,
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;
drop policy if exists "activity_admin_select" on public.activity_log;
create policy "activity_admin_select" on public.activity_log for select using (public.is_admin());
drop policy if exists "activity_admin_insert" on public.activity_log;
create policy "activity_admin_insert" on public.activity_log for insert with check (public.is_admin());
drop policy if exists "activity_admin_delete" on public.activity_log;
create policy "activity_admin_delete" on public.activity_log for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- SITE CONTENT  (key -> jsonb; powers the no-code Website Management screens)
-- ----------------------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
drop policy if exists "content_public_read" on public.site_content;
create policy "content_public_read" on public.site_content for select using (true);
drop policy if exists "content_admin_insert" on public.site_content;
create policy "content_admin_insert" on public.site_content for insert with check (public.is_admin());
drop policy if exists "content_admin_update" on public.site_content;
create policy "content_admin_update" on public.site_content for update using (public.is_admin());

-- ----------------------------------------------------------------------------
-- STORAGE — single public "media" bucket for hero images, gallery, employee
-- photos, logos, and (via the service-role key, server-side only) public
-- enquiry attachments.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_bucket_public_read" on storage.objects;
create policy "media_bucket_public_read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media_bucket_admin_insert" on storage.objects;
create policy "media_bucket_admin_insert" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_bucket_admin_update" on storage.objects;
create policy "media_bucket_admin_update" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_bucket_admin_delete" on storage.objects;
create policy "media_bucket_admin_delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- Public enquiry attachments are written by the send-enquiry server action
-- using the SERVICE ROLE key, which bypasses RLS entirely — so no public
-- INSERT policy on storage is needed or created here. This keeps the bucket
-- free of any anonymous write surface.

-- ----------------------------------------------------------------------------
-- INDEXES
-- ----------------------------------------------------------------------------
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created on public.enquiries(created_at desc);
create index if not exists idx_projects_hidden on public.projects(is_hidden);
create index if not exists idx_activity_created on public.activity_log(created_at desc);

-- ============================================================================
-- Done. Next steps (see README.md for full detail):
--   1. Authentication -> Email Templates -> switch Magic Link template to
--      use {{ .Token }} so Supabase sends a 6-digit OTP code instead of a link.
--   2. Authentication -> Providers -> Email -> confirm OTP expiry / rate limits.
--   3. Copy Project URL + anon key + service_role key into your .env (see .env.example).
-- ============================================================================
