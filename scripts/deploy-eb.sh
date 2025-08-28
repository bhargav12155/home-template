#!/usr/bin/env bash
set -euo pipefail

# deploy-eb.sh
# Build and deploy a new Elastic Beanstalk application version via AWS CLI.
# Requirements:
#  - AWS CLI configured (aws configure) with credentials that can access EB & S3
#  - Existing EB Application & Environment already created
#  - An S3 bucket for EB application versions (must exist)
# Usage:
#  APP_NAME=yourApp ENV_NAME=yourEnv EB_BUCKET=your-bucket ./scripts/deploy-eb.sh
# Optional:
#  VERSION_LABEL=v$(date +%Y%m%d-%H%M%S)
#  SKIP_BUILD=1 (reuse existing deploy.zip)

APP_NAME=${APP_NAME:-rest-express}
ENV_NAME=${ENV_NAME:-mikes-template-env}
EB_BUCKET=${EB_BUCKET:-REPLACE_ME_EB_BUCKET}
VERSION_LABEL=${VERSION_LABEL:-v$(date +%Y%m%d-%H%M%S)}
ZIP_NAME=deploy.zip

echo "Deploying version $VERSION_LABEL to $APP_NAME / $ENV_NAME"

if [[ "${EB_BUCKET}" == REPLACE_ME_EB_BUCKET ]]; then
  echo "ERROR: Set EB_BUCKET env var to your S3 bucket name." >&2
  exit 1
fi

if [[ -z "${SKIP_BUILD:-}" ]]; then
  echo "[1/6] Building bundle"
  ./scripts/build-deploy-zip.sh >/dev/null
else
  echo "[1/6] Skipping build (SKIP_BUILD set)"
fi

[[ -f "$ZIP_NAME" ]] || { echo "Missing $ZIP_NAME"; exit 1; }

S3_KEY="${APP_NAME}/${VERSION_LABEL}.zip"

echo "[2/6] Uploading $ZIP_NAME to s3://$EB_BUCKET/$S3_KEY"
aws s3 cp "$ZIP_NAME" "s3://$EB_BUCKET/$S3_KEY" --only-show-errors

echo "[3/6] Creating EB Application Version"
aws elasticbeanstalk create-application-version \
  --application-name "$APP_NAME" \
  --version-label "$VERSION_LABEL" \
  --source-bundle S3Bucket="$EB_BUCKET",S3Key="$S3_KEY" \
  --auto-create-application >/dev/null

echo "[4/6] Updating Environment $ENV_NAME"
aws elasticbeanstalk update-environment \
  --environment-name "$ENV_NAME" \
  --version-label "$VERSION_LABEL" >/dev/null

echo "[5/6] Waiting for environment update to finish (this can take a few minutes)"
aws elasticbeanstalk wait environment-updated --environment-names "$ENV_NAME"

echo "[6/6] Done"
echo "Deployed version: $VERSION_LABEL"
echo "Check status: aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --query 'Environments[0].Status' --output text"

cat <<EOF
Deployment Checklist:
  - [x] Bundle built (or reused)
  - [x] Uploaded to s3://$EB_BUCKET/$S3_KEY
  - [x] EB application version created ($VERSION_LABEL)
  - [x] Environment updated ($ENV_NAME)

If health turns Yellow/Red:
  - Tail logs: aws elasticbeanstalk request-environment-info --environment-name $ENV_NAME --info-type tail ; sleep 5 ; aws elasticbeanstalk retrieve-environment-info --environment-name $ENV_NAME --info-type tail
  - Verify PORT=8080 env var and app listens on it.
  - Check /api/db-health once Green.
EOF
