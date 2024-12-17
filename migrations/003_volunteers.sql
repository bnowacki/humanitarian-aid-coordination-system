-- migrate:up
create table "volunteers" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references public."users"("id") on delete cascade,
  "aid_organization_id" uuid not null references public."organizations"("id") on delete cascade,
  "location" text,
  "availability" boolean not null default true
);

-- migrate:down
drop table "volunteers";
