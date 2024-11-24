Warning: The project was created to work on WSL Ubuntu 20.04. There is a chance it won't work on other operating systems.

# Humanitarian Aid Coordination System

- [Supabase](https://supabase.com/docs)
- [Next.js](https://nextjs.org/)
- [Chakra UI](https://www.chakra-ui.com/)
- [Tabler Icons](https://tabler.io/icons)
- Aethentication
  - Password
  - Magic link
  - Google
  - LinkedIn

## Starting

### To start all Supabase services locally (Docker required)

Install [Docker](https://www.docker.com/products/docker-desktop/)

```bash
# only on the first run
cp .env.example .env # ask repo admin for proper env values for google and linkedin auth to work
npm install
npx supabase login

npx supabase start

# when you are done coding use
npx supabase stop
```

if you have trouble running supabase locally you can create your own hosted project on [Supabase](https://supabase.com/) and change frontend env accordingly.

### Set up the database

```bash
make migrate DB_URI=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Start frontend

```bash
cd web

# only on the first run
npm install
cp .env.example .env.local

npm run dev
```

### Mark yourself as an admin

```bash
psql -h 127.0.0.1 -p 54322 -U postgres
# password is "postgres"

UPDATE public.users SET role = 'admin' FROM auth.users WHERE public.users.id = auth.users.id AND auth.users.email = 'YOUR_EMAIL';

exit
```

Now upon logging in you should be able to acces the admin panel.

## Database development

The `migrations` folder contains all changes to the database schema as `.sql` files in chronological order - based on these files the database schema can be rebuild from scratch.

[dbmate](https://github.com/amacneil/dbmate) is used to regenerate the database. It is installed with `npm`, so if you have ran `npm install` you already have it.

To regenerate the database from migrations files run:

```bash
make migrate DB_URI=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

To reset the database to initial supabase state (all data and changes from `migrations` will be removed)

```bash
npx supabase db reset
```

migration files must start with with `-- migrate:up` and end with `-- migrate:down`

Generating typescript types from database schema:

```bash
cd web
npm run gen_types
```

## Email testing server

Emails sent with the local dev setup are not actually sent - rather, they
are monitored, and you can view the emails that would have been sent from the web interface hosted at
`http://localhost:54324`

## Internationalizatioin

[next-intl](https://next-intl-docs.vercel.app/) is used for i18n.

Translations are kept as json files in `web/src/i18n/locales` - a file for each language.

Please use `kebab-case` for key names, try to keep the key names short and use sensible namespaces (component name e.g. `header` or function e.g. `auth`)

I highly recommend installing [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) VS Code extension to make managing the translation keys more efficient.
It is already configured to work with `next-intl` in `.vscode/i18n-ally-custom-framework.yml`.

Please use export from `@/i18n/navigation` insted of `next/navigation`.
