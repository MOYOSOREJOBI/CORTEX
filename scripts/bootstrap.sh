#!/bin/bash
# bootstrap.sh — One-command setup for CORTEX development.
# Usage: ./scripts/bootstrap.sh

set -e

echo "=== CORTEX Bootstrap ==="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Install Node.js 20+ first."
  exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Warning: Node.js 20+ recommended. Current: $(node -v)"
fi

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm@9
fi

echo "Installing dependencies..."
pnpm install

echo ""
echo "=== Setup Complete ==="
echo "Run 'pnpm dev' to start the development server."
echo "Visit http://localhost:3000"
