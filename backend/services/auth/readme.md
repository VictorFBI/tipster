# Auth Service

Structured logs: JSON to stdout via `log/slog` (`service=auth`, `request_id`, `handler`, `http_request` per route).

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

## Run auth in Docker

Kafka must be reachable on the Docker network `tipster-infra_default` (start stack from `backend/infra` first):

```bash
cd ../../infra && docker compose up -d zookeeper kafka
cd ../services/auth
docker compose -f deployments/docker-compose.yaml up -d --build
```

Compose wires `DB_HOST`, `REDIS_ADDR`, `KAFKA_BROKERS` for in-network names. Keep secrets (e.g. `JWT_SECRET`, mail) in `services/auth/.env` (`env_file` in compose).

## Connect to docker databases
PostgreSQL
```
docker exec -it auth_postgres psql -U postgres -d auth
```  
Redis
```
docker exec -it auth_redis redis-cli
```

## Swagger

```
http://localhost:8080/swagger/index.html
```
