# Project Description

This project was built on Express and Node JS.

Build docker container via: (Docker Desktop must be open while running these commands)

```powershell
docker compose build
docker compose run app npx prisma migrate dev --name init
docker compose up
```

**NOTICE:** The prisma migrate command simply loads and initializes the prisma database
