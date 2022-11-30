# Koal

Manage your time & energy.

- [Development](#develpment)
  - [Running locally](#running-locally)

## Development

### Running locally

Install docker and [docker-compose](https://docs.docker.com/compose/).

Run the development docker-compose file `docker-compose -f development.yml up`.
This will run:

1. Mysql instance for application to connect
2. Admin interface so you can browse the database contents

Create a file named `.env` from `.env-example`.
This file has the connection string to mysql.

```bash
DATABASE_URL='mysql://root:pass@localhost:3306/koal'
```

Now install the project dependencies and run migrations on DB:

```bash
pnpm i
pnpx prisma db push
```

Then run the project with `pnpm dev`.
