#!/usr/bin/env bash
# Stops Tipster backend and removes named volumes (docker-compose down -v). Destroys DB/redis data etc.
# Same order as stop.sh; requires Docker Compose v2 plugin (`docker compose`).
# Run from anywhere: ./stop-v.sh   or   bash /path/to/backend/scripts/stop-v.sh

set -euo pipefail

BACKEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$BACKEND_ROOT"

compose() {
  docker compose "$@"
}

echo "==> Service: media (remove volumes)"
compose -f "$BACKEND_ROOT/services/media/deployments/docker-compose.yaml" down -v

echo "==> Service: content (remove volumes)"
compose -f "$BACKEND_ROOT/services/content/deployments/docker-compose.yaml" down -v

echo "==> Service: users (remove volumes)"
compose -f "$BACKEND_ROOT/services/users/deployments/docker-compose.yaml" down -v

echo "==> Service: auth (remove volumes)"
compose -f "$BACKEND_ROOT/services/auth/deployments/docker-compose.yaml" down -v

echo "==> Logging: Loki, Promtail, Grafana (remove volumes)"
compose -f "$BACKEND_ROOT/infra/docker-compose.logging.yaml" down -v

echo "==> Infra: Zookeeper, Kafka, Kafka UI (remove volumes)"
compose -f "$BACKEND_ROOT/infra/docker-compose.yaml" down -v

echo ""
echo "Done. Stacks stopped and Compose-named volumes removed."
