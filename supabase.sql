-- Moin's Style Studio backend: run this once in Supabase (SQL Editor > New query > Run).
--
-- Every record the admin panel keeps (site content, bookings, admin users, the photo
-- library list and the undo history) is stored as one JSON document per row.

create table if not exists public.admin_documents (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security on, with no policies: only the admin server, using the secret key,
-- can read or write this table. The public "anon" key gets nothing (it holds password hashes).
alter table public.admin_documents enable row level security;
revoke all on public.admin_documents from anon, authenticated;
grant all on public.admin_documents to service_role;
