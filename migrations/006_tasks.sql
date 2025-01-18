-- migrate:up
create table "tasks" (
  "id" uuid primary key default gen_random_uuid(),
  "volunteer_id" uuid not null references public."volunteers"("id") on delete cascade,
  "title" text not null,
  "description" text,
  "status" text not null check (status in ('pending', 'in_progress', 'completed')),
  "deadline" timestamp
);

-- migrate:down
drop table "tasks";
