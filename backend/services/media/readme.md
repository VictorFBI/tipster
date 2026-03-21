# Media Service

Structured logs: JSON to stdout via `log/slog` (fields: `time`, `level`, `msg`, `request_id`, `service`, handler-specific attrs).

## Start dependencies (MinIO)

```bash
docker compose -f deployments/docker-compose.yaml up -d minio
```

## Codegen

```
go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest -package api -generate types api/openapi.yaml > internal/generated/api.go
```

## Run server locally

From `services/media` with `.env` present:

```bash
go run ./cmd/server
```

## Run media in Docker (logs visible to Promtail / Loki)

```bash
docker compose -f deployments/docker-compose.yaml up -d --build
```

`media` uses `network_mode: service:minio`: same network namespace as MinIO, so `S3_ENDPOINT=127.0.0.1:9000` is MinIO for both API and presigned URLs. No `S3_PUBLIC_ENDPOINT` or `/etc/hosts`. From the host, `curl`/`PUT` to `http://127.0.0.1:9000/...` matches the signed `Host`. HTTP for the app is on `8082` via ports declared on the `minio` service (shared netns).

When media runs on the host (`go run`) with MinIO in Docker, use `S3_ENDPOINT=localhost:9000` and optional `S3_PUBLIC_ENDPOINT` only if clients need another host.

## Centralized logs (Loki + Grafana + Promtail)

Stack lives in `backend/infra/docker-compose.logging.yaml` (Promtail reads Docker container logs and pushes to Loki; Grafana is the UI).

```bash
cd ../../infra
docker compose -f docker-compose.logging.yaml up -d
```

- Grafana: http://localhost:3001 (admin / admin)
- Explore -> datasource Loki -> LogQL example: `{container="tipster_media"}`

Promtail only ingests logs from **Docker** containers on this machine. Local `go run` stdout is not shipped unless you run the app in a container or add another Promtail scrape (e.g. file).

## Swagger

```
http://localhost:8082/swagger/index.html
```
