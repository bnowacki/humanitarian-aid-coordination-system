-- migrate:up

create table "resources" (
    id uuid not null default gen_random_uuid (),
    name text not null,
    quantity bigint null,
    created_at timestamp with time zone null default now(),
    warehouse_id uuid null,
    description text null,
    constraint resources_pkey primary key (id)
  );

-- migrate:down
