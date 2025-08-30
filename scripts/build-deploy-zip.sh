#!/usr/bin/env bash
set -euo pipefail

# build-deploy-zip.sh
# Purpose: Produce deploy.zip for Elastic Beanstalk without mutating local node_modules (dev deps kept locally).

APP_NAME="rest-express"
ZIP_NAME="deploy.zip"
STAGE_DIR=".deploy-stage"
PRUNE_MEDIA=${PRUNE_MEDIA:-0}
MEDIA_EXTENSIONS="mp4 webm mov jpg jpeg png gif svg avif"

echo "[1/9] Clean previous artifacts"
rm -rf dist "$STAGE_DIR" "$ZIP_NAME"

echo "[2/9] Verify required tools"
command -v node >/dev/null || { echo "Node.js missing"; exit 1; }
command -v npm >/dev/null || { echo "npm missing"; exit 1; }

echo "[3/9] Install (ensure) dependencies for build"
npm install --no-audit --no-fund

echo "[4/9] Build client & server (npm run build)"
NODE_ENV=production npm run build --silent

echo "[5/9] Validate production bundle excludes Vite"
if grep -q "createViteServer" dist/index.js 2>/dev/null || grep -q "from \"vite\"" dist/index.js 2>/dev/null; then
  echo "ERROR: dist/index.js still references Vite. Aborting."
  exit 1
fi

echo "[6/9] Stage files"
mkdir -p "$STAGE_DIR"
cp -R dist "$STAGE_DIR/dist"
cp package.json "$STAGE_DIR/package.json"

if [[ "$PRUNE_MEDIA" == 1 ]]; then
  echo "[6.1/9] PRUNE_MEDIA enabled – removing large static media from dist/public/assets"
  BEFORE_SZ=$(du -sh dist/public/assets 2>/dev/null | awk '{print $1}')
  for ext in $MEDIA_EXTENSIONS; do
    # Keep a tiny placeholder strategy optional later
    find dist/public/assets -maxdepth 1 -type f -name "*.$ext" -size +50k -print -delete 2>/dev/null || true
  done
  AFTER_SZ=$(du -sh dist/public/assets 2>/dev/null | awk '{print $1}')
  echo "      Assets size: $BEFORE_SZ -> $AFTER_SZ (pruned)"
fi

echo "[7/9] Create prod-only node_modules in staging"
pushd "$STAGE_DIR" >/dev/null
  npm install --omit=dev --no-audit --no-fund
  # Note: Static media has been optionally pruned earlier when PRUNE_MEDIA=1.
popd >/dev/null

echo "[8/9] Zip artifact"
pushd "$STAGE_DIR" >/dev/null
  zip -r ../"$ZIP_NAME" dist package.json node_modules >/dev/null
popd >/dev/null

echo "[9/9] Done"
ls -lh "$ZIP_NAME"

cat <<EOF
Checklist:
  - [x] Client assets built (dist/public)
  - [x] Server bundle built (dist/index.js)
  - [x] Prod deps installed in staging node_modules
  - [x] Zip created: $ZIP_NAME

Next:
  1. Upload $ZIP_NAME to Elastic Beanstalk.
  2. Set env vars: PORT=8080, NODE_ENV=production, DATABASE_URL=... etc.
  3. Deploy & test /api/db-health.
EOF

echo "Completed." 