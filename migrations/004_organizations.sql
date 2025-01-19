-- migrate:up
create table "organizations" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null,
  "description" text
);

-- migrate:down
drop table "organizations";
