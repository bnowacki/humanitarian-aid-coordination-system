-- migrate:up

-- users table

create type user_role as enum ('user', 'admin');

create table "users" (
  "id" uuid references auth."users" on delete cascade primary key,
  "role" user_role not null default 'user',
  "full_name" text
);
alter table "users" enable row level security;

create function handle_new_user()
  returns trigger
  language plpgsql
  security definer
as $$
begin
  insert into public."users" (
    "id",
    "full_name",
    "role"
  ) values (
    new."id",
    new."raw_user_meta_data"->>'full_name',
    'user'
  ) on conflict ("id") do update set
    "full_name" = excluded."full_name";

  return new;
end;
$$;

create trigger "on_auth_user_created"
after insert or update on auth."users"
for each row execute procedure public."handle_new_user"();

create or replace function get_user_role("user_id" uuid)
  returns text
  stable
  language sql
  security definer
as $$
  select "role"
  from public."users"
  where "id" = $1
$$;

create or replace function is_admin()
  returns boolean
  stable
  language sql
  security definer
as $$
  select "role" = 'admin' or auth.jwt() ->> 'role' = 'service_role'
  from public."users"
  where "id" = auth.uid()
$$;

create policy "Admins have full control over users." on "users" 
for all using (is_admin());

create policy "Users can view their own profiles." on "users"
for select using (auth.uid() = "id");

create policy "Users can insert their own profile." on "users"
for insert with check ((select auth.uid()) = "id");

create policy "Users can update own profile." on "users"
for update using ((select auth.uid()) = "id");

create view user_profile as
select
  u."id",
  u."role",
  au."email",
  u."full_name"
from "users" as u
join auth."users" as au on au."id" = u."id"
where auth.uid() = u."id";

create view admin_users as
select
  u."id",
  u."role",
  au."email",
  u."full_name",
  au."invited_at",
  au."created_at",
  au."last_sign_in_at",
  au."phone"
from "users" as u
join auth."users" as au on au."id" = u."id"
where is_admin();

-- migrate:down