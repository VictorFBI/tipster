#!/usr/bin/env bash
# Configures MinIO lifecycle rule for dev-temp bucket.
# Requires: Docker and running MinIO on localhost:9000.

set -euo pipefail

docker run --rm -it --network host --entrypoint sh minio/mc:latest -c '
  mc alias set local http://localhost:9000 minioadmin minioadmin &&
  mc ilm rule add --expire-days 1 local/dev-temp &&
  mc ilm rule list local/dev-temp
'
