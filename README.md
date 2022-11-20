# Koal

## Develpment

### Running locally

Install docker and [docker-compose](https://docs.docker.com/compose/).

Run the development docker-compose file `docker-compose -f development.yml up`.
This will run:

1. Mysql instance for application to connect
2. Admin interface so you can browse the database contents

```bash
pnpm install
prisma push db
pnpm dev
```
