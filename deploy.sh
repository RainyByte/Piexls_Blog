#!/bin/bash
# Build services one at a time to avoid OOM on low-memory servers
set -e

echo "==> Building backend..."
docker compose build backend

echo "==> Building frontend..."
docker compose build frontend

echo "==> Starting services..."
docker compose up -d
