#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
fail() { echo "✗ $1" >&2; exit 1; }
ok() { echo "✓ $1"; }

command -v node >/dev/null || fail "需要 Node"
[[ -f package.json && -f vite.config.js && -f index.html ]] || fail "缺少 Vite 入口"
[[ -f src/main.jsx || -f src/main.tsx ]] || fail "缺少 main"
[[ -f .env.example ]] || fail "缺少 .env.example"
ok "核心文件齐全"

if [[ ! -d node_modules ]]; then
  npm install --no-fund --no-audit
fi
npm run build
ok "vite build 通过"

echo ""; echo "smoke: ok"
echo "提示：npm run dev 本地预览"
