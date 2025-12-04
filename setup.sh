#!/bin/bash
# SAAT Setup Script
# Installs SAAT and runs audit on the parent project's components

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 SAAT - Static Application Accessibility Testing Setup"
echo "========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "$SCRIPT_DIR/package.json" ]; then
    echo "❌ Error: package.json not found in saat directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd "$SCRIPT_DIR"
npm install

# Build TypeScript
echo ""
echo "🏗️  Building TypeScript..."
npm run build

# Run audit
echo ""
echo "🔍 Running accessibility audit on parent project..."
npm run audit -- "$PROJECT_ROOT"

echo ""
echo "✅ Setup and audit complete!"
