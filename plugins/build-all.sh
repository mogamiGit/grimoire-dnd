#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Building shared ==="
cd "$SCRIPT_DIR/shared" && npm run build

for plugin in "$SCRIPT_DIR"/custom/*/; do
  name=$(basename "$plugin")
  echo "=== Building $name ==="
  cd "$plugin" && npm run build
done

echo "=== All plugins built ==="
