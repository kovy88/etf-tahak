-- Funnel a atribuce nad tabulkou leads (PLAN §12). Pravdivý počet leadů je v DB, i když někdo blokuje tracking.
-- Spouštět v Supabase SQL editoru nebo přes `psql`.
-- Horní kroky funnelu (zobrazení, formulář) jsou jen v PostHogu, tady je poslední krok a jeho rozpad.

-- 1) Leady podle varianty a reklamy (základ pro CPL: vydělte útratou z Mety za stejnou reklamu)
select
  coalesce(variant, '(neznámá)')          as variant,
  coalesce(utm_content, '(bez utm)')      as utm_content,
  count(*)                                as leads,
  count(*) filter (where flags = '{}')    as leads_clean
from public.leads
group by 1, 2
order by leads desc;

-- 2) Leady po dnech a v in-app prohlížečích
select
  date_trunc('day', created_at at time zone 'Europe/Prague')::date as den,
  coalesce(in_app_browser, 'none')                                  as in_app,
  count(*)                                                          as leads
from public.leads
group by 1, 2
order by 1 desc, 3 desc;

-- 3) Kde se formulář odeslal (hero, sticky, calc, compare_gate, tahak, final)
select form_location, count(*) as leads
from public.leads
group by 1
order by leads desc;

-- 4) Cesta k leadu: kolik jich použilo kalkulačku, odemklo srovnání, jak dlouho jim to trvalo
select
  variant,
  count(*)                                                                     as leads,
  round(100.0 * avg((journey->>'calc_used')::boolean::int), 1)                 as pct_calc_used,
  round(100.0 * avg((journey->>'compare_unlock_clicked')::boolean::int), 1)    as pct_compare_unlock,
  round(avg((journey->>'cta_clicks')::int), 2)                                 as avg_cta_clicks,
  percentile_cont(0.5) within group (order by (journey->>'time_to_submit_ms')::numeric) / 1000
                                                                               as median_s_to_submit
from public.leads
where journey is not null
group by 1;

-- 5) Dobrovolná otázka: jaký broker lidé používají
select coalesce(broker, '(neodpověděli)') as broker, count(*) as leads
from public.leads
group by 1
order by leads desc;

-- 6) Posledních 20 leadů bez e-mailu (kontrola, že se ukládá atribuce)
select created_at, variant, form_location, utm_source, utm_campaign, utm_content, in_app_browser
from public.leads
order by created_at desc
limit 20;
