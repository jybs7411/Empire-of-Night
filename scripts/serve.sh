#!/usr/bin/env bash
# 로컬 개발 서버 (기본 포트 8000, 다른 포트: ./scripts/serve.sh 3000)
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${1:-8000}"
echo "밤의 균형 → http://localhost:${PORT}"
exec python3 -m http.server "$PORT"
