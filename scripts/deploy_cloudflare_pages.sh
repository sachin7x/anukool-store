#!/usr/bin/env bash
# ==============================================================================
# Anukool — Permanent Cloudflare Pages Deployment Script
# Deploys production build to anukool.pages.dev
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "=========================================================="
echo "✦ ANUKOOL (अनुकूल) — CLOUDFLARE PAGES PERMANENT DEPLOYMENT"
echo "=========================================================="

echo "1. Running production test suite (RLVR gate)..."
npm test

echo "2. Building optimized production bundle..."
npm run build

echo "3. Verifying Cloudflare Pages authentication..."
if ! npx wrangler whoami >/dev/null 2>&1; then
  echo ""
  echo "⚠️ Cloudflare login required for permanent deployment."
  echo "Please run: npx wrangler login"
  echo "Once logged in, re-run this script to deploy directly to anukool.pages.dev."
  echo ""
  echo "Alternatively, you can provide CLOUDFLARE_API_TOKEN environment variable:"
  echo "export CLOUDFLARE_API_TOKEN=\"your-token\""
  echo ""
  exit 1
fi

echo "4. Deploying to Cloudflare Pages (anukool)..."
npx wrangler pages deploy dist --project-name anukool --branch main

echo "=========================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "Production URL: https://anukool.pages.dev"
echo "=========================================================="
