#!/bin/bash
# Dev server: build + serve + auto-rebuild on content/plugin changes

# Build plugins + Quartz
./plugins/build-all.sh
npx quartz build -d .

# Start serve in background
npx serve public -p 3000 &
SERVE_PID=$!

echo "Server running at http://localhost:3000"
echo "Watching for changes... (Ctrl+C to stop)"

# Watch content dirs AND plugin source, rebuild on change
npx chokidar-cli \
  'diario/**/*.md' \
  'wiki/**/*.md' \
  'reglas/**/*.md' \
  'index.md' \
  'quartz.config.yaml' \
  'plugins/shared/src/**/*.{ts,tsx,scss}' \
  'plugins/custom/**/src/**/*.{ts,tsx,scss}' \
  -c './plugins/build-all.sh && npx quartz build -d .'

# Cleanup on exit
kill $SERVE_PID 2>/dev/null
