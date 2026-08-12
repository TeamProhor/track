#!/usr/bin/env bash

set -e

echo "🚀 Starting deployment for track.prohor.dev..."

CDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CDIR"

echo "📦 Pulling latest changes from git..."
git pull origin main || echo "⚠️ Git pull skipped"

echo "📥 Installing dependencies with Bun..."
bun install

echo "🏗️ Building Next.js standalone production bundle..."
bun run build

echo "📁 Copying static assets to standalone directory..."
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

echo "🔄 Managing PM2 processes..."

if pm2 describe prohor-track-web > /dev/null 2>&1; then
    echo "Reloading prohor-track-web (1 instance)..."
    PORT=3001 pm2 reload prohor-track-web
else
    echo "Starting prohor-track-web (1 instance) on port 3001..."
    PORT=3001 pm2 start .next/standalone/server.js -i 1 --name "prohor-track-web"
fi

if pm2 describe prohor-track-worker > /dev/null 2>&1; then
    echo "Reloading prohor-track-worker (1 instance)..."
    pm2 reload prohor-track-worker
else
    echo "Starting prohor-track-worker (1 instance)..."
    pm2 start "bun run worker/index.ts" --name "prohor-track-worker"
fi

pm2 save

echo "⚡ Reloading Caddy web server..."
systemctl reload caddy

echo "✅ Redeployment complete! App is live at https://track.prohor.dev"
