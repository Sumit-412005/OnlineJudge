#!/usr/bin/env sh
# Quick setup for the Online Judge (macOS / Linux).
# Run:  sh setup.sh   then edit .env and run:  docker compose up --build

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "$DIR/.env" ]; then
  cp "$DIR/.env.example" "$DIR/.env"
  echo "Created .env from .env.example."
  echo "ACTION REQUIRED: open .env and paste your MongoDB Atlas string into MONGODB_URL."
else
  echo ".env already exists - leaving it unchanged."
fi

echo ""
echo "When MONGODB_URL is set, start everything with:"
echo "    docker compose up --build"
echo ""
echo "Frontend -> http://localhost:3000    Backend -> http://localhost:4000"
