-- Run once in Supabase → SQL Editor.
-- Table with one row per parcel ("gush/helka"); hidden = hatch switched off.

create table if not exists public.parcel_status (
  parcel_id  text primary key,
  hidden     boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Open access for the page's anon key (no login, by design).
alter table public.parcel_status enable row level security;
drop policy if exists "open access" on public.parcel_status;
create policy "open access" on public.parcel_status
  for all to anon, authenticated using (true) with check (true);
grant select, insert, update, delete on public.parcel_status to anon, authenticated;

-- Live updates between open tabs / computers.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'parcel_status'
  ) then
    alter publication supabase_realtime add table public.parcel_status;
  end if;
end $$;
