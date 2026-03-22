# Users Service

Structured logs: JSON to stdout via `log/slog` (`service=users`, `request_id`, `handler`, `http_request` per route).

On startup the process runs DB migrations from `migrations/postgresql` (golang-migrate). Override directory with env `MIGRATIONS_PATH` if needed.

## Start server

1. Start PostgreSQL:
```bash
docker compose -f deployments/docker-compose.yaml up -d postgres
```

2. Run codegen:
```
go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest -package api -generate types api/openapi.yaml > internal/generated/api.go
```

3. Run the server
```bash
go run cmd/server/main.go
```

## Run users in Docker

Kafka must be on network `tipster-infra_default`:

```bash
cd ../../infra && docker compose up -d zookeeper kafka
cd ../services/users
docker compose -f deployments/docker-compose.yaml up -d --build
```

`DB_*` and `KAFKA_BROKERS` are set for compose; add `JWT_SECRET` etc. in `services/users/.env`.

## Connect to docker database

```
docker exec -it users_postgres psql -U postgres -d users
```

## Swagger

```
http://localhost:8081/swagger/index.html
```
