# Auth Service

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
