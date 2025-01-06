-- migrate:up

-- Create request status enum type
create type request_status as enum ('pending', 'approved', 'rejected', 'fulfilled');

-- Create the interface for requests (optional, for code structure guidance)
-- Note: SQL does not directly support interfaces. They are conceptual for programming.

-- Create help_requests table
create table "help_requests" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references public."users"("id") on delete cascade,
  "event_id" uuid not null references public."events"("id") on delete cascade,
  "name" text not null,
  "description" text,
  "status" request_status not null default 'pending',
  "created_at" timestamptz default now()
);

-- Create resource_requests table
create table "resource_requests" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references public."users"("id") on delete cascade,
  "event_id" uuid not null references public."events"("id") on delete cascade,
  "name" text not null,
  "description" text,
  "quantity" int not null check ("quantity" > 0),
  "status" request_status not null default 'pending',
  "created_at" timestamptz default now()
);

-- No row-level security (RLS) defined by default; can add policies later.

-- migrate:down
