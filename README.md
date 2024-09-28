# luna

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

##

### Database:

1. instal postgressql

2. create db

```bash
createdb luna
```

run init command

```bash
npx prisma init --datasource-provider mysql --url postgresql://user:password@localhost:5432/luna
```

run push to db command

```bash
npx prisma db push
```
