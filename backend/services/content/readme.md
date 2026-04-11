# Auth Service

Structured logs: JSON to stdout via `log/slog` (`service=content`, `request_id`, `handler`, `http_request` per route).

On startup the process runs DB migrations from `migrations/postgresql` (golang-migrate). Override directory with env `MIGRATIONS_PATH` if needed.

## Start server

1. Start PostgreSQL and Redis using Docker Compose:
```bash
docker-compose -f deployments/docker-compose.yaml up -d
```

2. Run codegen:
```
go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest -package api -generate types api/openapi.yaml > internal/generated/api.go
```

3. Run the server
```bash
go run cmd/server/main.go
```

## Run content in Docker

Kafka must be reachable on the Docker network `tipster-infra_default` (start stack from `backend/infra` first):

```bash
cd ../../infra && docker compose up -d zookeeper kafka
cd ../services/content
docker compose -f deployments/docker-compose.yaml up -d --build
```

Compose wires `DB_HOST`, `REDIS_ADDR`, `KAFKA_BROKERS` for in-network names. Keep secrets (e.g. `JWT_SECRET`, mail) in `services/content/.env` (`env_file` in compose).

## Connect to docker databases
PostgreSQL
```
docker exec -it content_postgres psql -U postgres -d content
```  
Redis
```
docker exec -it content_redis redis-cli
```

## Swagger

```
http://localhost:8080/swagger/index.html
```
