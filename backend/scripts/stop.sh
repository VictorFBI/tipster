#!/usr/bin/env bash
# Stops Tipster backend: media, content, users, auth, logging, infra (reverse of start.sh).
# Requires: Docker with Compose v2 plugin (`docker compose`).
# Run from anywhere: ./stop.sh   or   bash /path/to/backend/scripts/stop.sh

set -euo pipefail

BACKEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$BACKEND_ROOT"

compose() {
  docker-compose "$@"
}

echo "==> Service: media"
compose -f "$BACKEND_ROOT/services/media/deployments/docker-compose.yaml" down

echo "==> Service: content"
compose -f "$BACKEND_ROOT/services/content/deployments/docker-compose.yaml" down

echo "==> Service: users"
compose -f "$BACKEND_ROOT/services/users/deployments/docker-compose.yaml" down

echo "==> Service: auth"
compose -f "$BACKEND_ROOT/services/auth/deployments/docker-compose.yaml" down

echo "==> Logging: Loki, Promtail, Grafana"
compose -f "$BACKEND_ROOT/infra/docker-compose.logging.yaml" down

echo "==> Infra: Zookeeper, Kafka, Kafka UI"
compose -f "$BACKEND_ROOT/infra/docker-compose.yaml" down

echo ""
echo "Done. All Tipster backend stacks stopped."
