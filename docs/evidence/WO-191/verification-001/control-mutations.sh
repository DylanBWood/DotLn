#!/bin/zsh
# Criterion 1: mutate a scratch clone's control file and run the document check.
R="$1"
case "$R" in
  "${TMPDIR:-/tmp}"*|/tmp/*|/private/tmp/*|/var/folders/*) ;;
  *) print -u2 "refusing: $R is not under the system temporary directory"; exit 2 ;;
esac
cd "$R" || exit 2
orig=$(cat docs/control/reader-profiles.json)
run() {
  local label="$1" js="$2"
  node -e "
const fs=require('fs');const p='docs/control/reader-profiles.json';
const v=JSON.parse(fs.readFileSync(p,'utf8'));
$js
fs.writeFileSync(p, typeof out==='string'?out:JSON.stringify(v));
"
  local msg
  msg=$(node scripts/reader.mjs check 2>&1 >/dev/null)
  print -r -- "$label | exit=$? | ${msg}"
  print -r -- "$orig" > docs/control/reader-profiles.json
}
run "unknown surface" "v.surfaces.frontPage={...v.surfaces.prTitle};"
run "missing surface" "delete v.surfaces.commitSubject;"
run "unknown dimension" "v.surfaces.prBody.tone='plain';"
run "missing dimension" "delete v.surfaces.prBody.voice;"
run "unknown position" "v.surfaces.releasePage.voice='loud';"
run "wrong-case position" "v.surfaces.releasePage.voice='Plain';"
run "array position" "v.surfaces.releasePage.voice=['plain'];"
run "schemaVersion 2" "v.schemaVersion=2;"
run "extra top key" "v.extra=1;"
run "__proto__ surface key" "var out=JSON.stringify(v).replace('\"surfaces\":{','\"surfaces\":{\"__proto__\":{},');"
run "surfaces is array" "v.surfaces=[];"
run "unchanged control (control)" ""
