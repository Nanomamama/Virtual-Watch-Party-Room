create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  name text not null default 'late-night cinema',
  video_url text,
  host_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.room_members (
  room_id uuid references public.rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;

create policy "authenticated can read rooms" on public.rooms for select to authenticated using (true);
create policy "users can create rooms" on public.rooms for insert to authenticated with check (auth.uid() = host_id);
create policy "members can join rooms" on public.room_members for insert to authenticated with check (auth.uid() = user_id);
create policy "members can read membership" on public.room_members for select to authenticated using (auth.uid() = user_id);
create policy "members can read messages" on public.messages for select to authenticated using (
  exists (select 1 from public.room_members m where m.room_id = messages.room_id and m.user_id = auth.uid())
);
create policy "members can send messages" on public.messages for insert to authenticated with check (
  auth.uid() = user_id and exists (select 1 from public.room_members m where m.room_id = messages.room_id and m.user_id = auth.uid())
);

create or replace function public.make_invite_code()
returns text language sql volatile as $$
  select upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6));
$$;
