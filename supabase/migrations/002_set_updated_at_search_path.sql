-- Pevný search_path pro trigger (Supabase security advisor 0011).
alter function public.set_updated_at() set search_path = '';
