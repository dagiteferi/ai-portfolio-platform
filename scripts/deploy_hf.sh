#!/usr/bin/env bash
# Deploy backend from this GitHub repo to the Hugging Face Space.
# GitHub main is the source of truth; this script syncs backend/ + HF Docker config.
#
# Usage:
#   HF_TOKEN=hf_xxx ./scripts/deploy_hf.sh
#
# Optional:
#   HF_DEPLOY_WORKDIR=/tmp/hf-deploy  HF_BRANCH=main

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [[ -z "${HF_TOKEN:-}" ]]; then
  echo "Error: set HF_TOKEN to a Hugging Face token with write access."
  exit 1
fi

HF_SPACE="dagiteferi2011/AI_Portfolio_Platform"
HF_URL="https://__token__:${HF_TOKEN}@huggingface.co/spaces/${HF_SPACE}"
WORK="${HF_DEPLOY_WORKDIR:-/tmp/hf-space-deploy}"
HF_BRANCH="${HF_BRANCH:-main}"
SHORT_SHA="$(git rev-parse --short HEAD)"

echo "Deploying backend @ ${SHORT_SHA} to Hugging Face Space..."

rm -rf "$WORK"
GIT_LFS_SKIP_SMUDGE=1 git -c http.version=HTTP/1.1 clone --depth 1 "$HF_URL" "$WORK"
cd "$WORK"

rsync -a --delete \
  --exclude '__pycache__/' \
  --exclude '*.pyc' \
  --exclude 'logs/' \
  --exclude '.pytest_cache/' \
  "${ROOT}/backend/" "${WORK}/backend/"

cp "${ROOT}/infrastructure/hf/Dockerfile" "${WORK}/Dockerfile"
cp "${ROOT}/infrastructure/hf/.dockerignore" "${WORK}/.dockerignore"
cp "${ROOT}/backend/requirements.txt" "${WORK}/requirements.txt"

git add backend Dockerfile .dockerignore requirements.txt

if git diff --staged --quiet; then
  echo "No backend changes to deploy."
  exit 0
fi

git -c user.name="dagiteferi" -c user.email="dagiteferi2011@gmail.com" commit -m "$(cat <<EOF
Deploy backend from GitHub ${SHORT_SHA}.

Synced from ai-portfolio-platform main (source of truth).
EOF
)"

GIT_LFS_SKIP_SMUDGE=1 git -c http.version=HTTP/1.1 push origin "HEAD:${HF_BRANCH}"
echo "Deployed to https://huggingface.co/spaces/${HF_SPACE}"
