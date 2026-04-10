#!/bin/bash
# Build services one at a time to avoid OOM on low-memory servers
set -e

echo "==> Current commit:"
git rev-parse --short HEAD

echo "==> Stopping running services..."
docker compose down --remove-orphans

echo "==> Building backend..."
docker compose build backend

echo "==> Building frontend..."
docker compose build frontend

echo "==> Starting backend..."
docker compose up -d backend

echo "==> Starting frontend..."
docker compose up -d frontend

echo "==> Restarting nginx to reload config and static routes..."
docker compose up -d --force-recreate nginx

echo "==> Container status:"
docker compose ps
