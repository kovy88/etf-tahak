-- Leady z landing page „ETF tahák“ (PLAN §11). Region Supabase: EU (Frankfurt).
create extension if not exists citext;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- zdroj a varianta (first-touch)
  variant text,
  form_location text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_path text,
  in_app_browser text,
  user_agent text,
  posthog_id text,

  -- co návštěvník dělal
  calc jsonb,
  journey jsonb,

  -- dobrovolná odpověď na 1 ťuk
  broker text,

  -- souhlas a e-mail
  consent_text_version text,
  email_sent_at timestamptz,
  unsubscribed_at timestamptz,

  -- antispam: např. ['too_fast']
  flags text[] not null default '{}',

  constraint leads_email_len check (char_length(email::text) between 5 and 254)
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_variant_idx on public.leads (variant);
create index leads_utm_content_idx on public.leads (utm_content);

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- RLS zapnuté, žádné veřejné policies. Zapisuje jen service role ze serveru (obchází RLS).
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
