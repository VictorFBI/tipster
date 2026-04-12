#!/usr/bin/env bash
# Starts Tipster backend: infra (Kafka), logging (Loki/Grafana), then auth, users, content, media.
# Requires: Docker with Compose v2 plugin (`docker compose`).
# Run from anywhere: ./start.sh   or   bash /path/to/backend/start.sh

set -euo pipefail

BACKEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BACKEND_ROOT"

compose() {
  docker-compose "$@"
}

echo "==> Infra: Zookeeper, Kafka, Kafka UI"
compose -f "$BACKEND_ROOT/infra/docker-compose.yaml" up -d

echo "==> Logging: Loki, Promtail, Grafana (http://localhost:3001 admin/admin)"
compose -f "$BACKEND_ROOT/infra/docker-compose.logging.yaml" up -d

echo "==> Service: auth (8080)"
compose -f "$BACKEND_ROOT/services/auth/deployments/docker-compose.yaml" up -d --build

echo "==> Service: users (8081)"
compose -f "$BACKEND_ROOT/services/users/deployments/docker-compose.yaml" up -d --build

echo "==> Service: content (8083)"
compose -f "$BACKEND_ROOT/services/content/deployments/docker-compose.yaml" up -d --build

echo "==> Service: media (8082)"
compose -f "$BACKEND_ROOT/services/media/deployments/docker-compose.yaml" up -d --build

echo ""
echo "Done. Ports: auth 8080, users 8081, media 8082, content 8083, Grafana 3001, Kafka UI 9090"
echo "Ensure each service has .env (e.g. JWT_SECRET) where required."
