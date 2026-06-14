create extension if not exists pgcrypto;

create type user_role as enum ('AGENCY_OWNER', 'AGENCY_MEMBER');
create type deliverable_status as enum ('PENDING', 'APPROVED', 'CHANGES_REQUESTED');
create type approval_event_type as enum ('APPROVED', 'REJECTED', 'COMMENTED', 'VIEWED');
create type file_kind as enum ('IMAGE', 'PDF', 'VIDEO', 'URL');

create table agencies (
  id text primary key default encode(gen_random_bytes(12), 'hex'),
  name text not null,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  agency_id text not null references agencies(id) on delete cascade,
  name text not null,
  email text not null,
  role user_role not null default 'AGENCY_MEMBER',
  created_at timestamptz not null default now()
);

create table clients (
  id text primary key default encode(gen_random_bytes(12), 'hex'),
  agency_id text not null references agencies(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table projects (
  id text primary key default encode(gen_random_bytes(12), 'hex'),
  client_id text not null references clients(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);

create table deliverables (
  id text primary key default encode(gen_random_bytes(12), 'hex'),
  project_id text not null references projects(id) on delete cascade,
  title text not null,
  description text,
  file_url text not null,
  file_kind file_kind not null,
  public_id text not null unique,
  version_group_id text not null,
  version integer not null check (version > 0),
  status deliverable_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  unique (version_group_id, version)
);

create table comments (
  id text primary key default encode(gen_random_bytes(12), 'hex'),
  deliverable_id text not null references deliverables(id) on delete cascade,
  author_name text not null,
  message text not null check (char_length(message) between 1 and 1500),
  created_at timestamptz not null default now()
);

create table approval_events (
  id text primary key default encode(gen_random_bytes(12), 'hex'),
  deliverable_id text not null references deliverables(id) on delete cascade,
  event_type approval_event_type not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public_rate_limits (
  id bigint generated always as identity primary key,
  rate_key text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index clients_agency_id_idx on clients(agency_id);
create index projects_client_id_idx on projects(client_id);
create index deliverables_project_id_idx on deliverables(project_id);
create index deliverables_public_id_idx on deliverables(public_id);
create index deliverables_version_group_idx on deliverables(version_group_id, version desc);
create index approval_events_deliverable_created_idx on approval_events(deliverable_id, created_at desc);
create index comments_deliverable_created_idx on comments(deliverable_id, created_at desc);
create index public_rate_limits_key_expiry_idx on public_rate_limits(rate_key, expires_at);

alter table agencies enable row level security;
alter table users enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table deliverables enable row level security;
alter table comments enable row level security;
alter table approval_events enable row level security;
alter table public_rate_limits enable row level security;

create or replace function current_agency_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select agency_id from users where id = auth.uid()
$$;

create policy "members can read own agency"
on agencies for select
to authenticated
using (id = current_agency_id());

create policy "members can read agency users"
on users for select
to authenticated
using (agency_id = current_agency_id());

create policy "members manage clients"
on clients for all
to authenticated
using (agency_id = current_agency_id())
with check (agency_id = current_agency_id());

create policy "members manage projects"
on projects for all
to authenticated
using (
  exists (
    select 1 from clients
    where clients.id = projects.client_id
    and clients.agency_id = current_agency_id()
  )
)
with check (
  exists (
    select 1 from clients
    where clients.id = projects.client_id
    and clients.agency_id = current_agency_id()
  )
);

create policy "members manage deliverables"
on deliverables for all
to authenticated
using (
  exists (
    select 1
    from projects
    join clients on clients.id = projects.client_id
    where projects.id = deliverables.project_id
    and clients.agency_id = current_agency_id()
  )
)
with check (
  exists (
    select 1
    from projects
    join clients on clients.id = projects.client_id
    where projects.id = deliverables.project_id
    and clients.agency_id = current_agency_id()
  )
);

create policy "members read comments"
on comments for select
to authenticated
using (
  exists (
    select 1
    from deliverables
    join projects on projects.id = deliverables.project_id
    join clients on clients.id = projects.client_id
    where deliverables.id = comments.deliverable_id
    and clients.agency_id = current_agency_id()
  )
);

create policy "members read events"
on approval_events for select
to authenticated
using (
  exists (
    select 1
    from deliverables
    join projects on projects.id = deliverables.project_id
    join clients on clients.id = projects.client_id
    where deliverables.id = approval_events.deliverable_id
    and clients.agency_id = current_agency_id()
  )
);

-- Public review pages are served only by Next.js server actions with the service role key.
-- Do not expose direct anonymous table policies for deliverables, comments, or events.

insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;
