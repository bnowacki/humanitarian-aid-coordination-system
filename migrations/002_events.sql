-- migrate:up

-- Create event status enum type
create type event_status as enum ('active', 'completed', 'canceled');

-- Create the events table with the necessary fields
create table "events" (
  "id" uuid primary key default gen_random_uuid(),
  "title" text not null,
  "location" text not null,
  "status" event_status not null default 'active',
  "description" text,
  "government_it" uuid default gen_random_uuid(),  -- Default for government_it
  "organization_id" uuid default gen_random_uuid()  -- Default for organization_id
);



-- The table has no row-level security (RLS) and no policies or triggers defined.
-- Any authenticated user with appropriate permissions can insert, update, or select from this table.

-- migrate:down
