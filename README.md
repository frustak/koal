# Koal

Manage your time & energy.

-   [Development](#develpment)
    -   [Running locally](#running-locally)

## Development

### Running locally

Create a file named `.env` from `.env-example`.
This file has the connection string to mysql.

```bash
DATABASE_URL=file:./db.sqlite
```

Now install the project dependencies and run migrations on DB:

```bash
pnpm i
pnpx prisma db push
```

Then run the project with `pnpm dev`.
