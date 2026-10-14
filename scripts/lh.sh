#!/usr/bin/env bash
# Lighthouse mobile pro dané cesty. Použití: scripts/lh.sh http://localhost:3200 poplatky srovnani
set -e
BASE=$1; shift
CH="${CHROME_PATH:-$HOME/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing}"
mkdir -p /tmp/lh
for p in "$@"; do
  CHROME_PATH="$CH" npx lighthouse "$BASE/$p" --only-categories=performance,accessibility,best-practices,seo \
    --form-factor=mobile --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="/tmp/lh/$p.json" --quiet >/dev/null 2>&1
  node -e "
const r=require('/tmp/lh/$p.json');const c=r.categories;const a=r.audits;
console.log('$p',JSON.stringify(Object.fromEntries(Object.entries(c).map(([k,v])=>[k,Math.round(v.score*100)]))),'LCP',a['largest-contentful-paint'].displayValue,'CLS',a['cumulative-layout-shift'].displayValue,'TBT',a['total-blocking-time'].displayValue);
for(const [k,v] of Object.entries(a)) if(v.score!==null&&v.score<0.9&&!['informative','notApplicable','manual'].includes(v.scoreDisplayMode)) console.log('  -',k,v.score,(v.displayValue||''))"
done
