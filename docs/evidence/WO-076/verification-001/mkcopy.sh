#!/bin/zsh
# usage: mkcopy.sh <source-root> <dest>
set -e
src=$1; dest=$2
rm -rf "$dest"; mkdir -p "$dest/packages" "$dest/node_modules/@dotln"
cp -R "$src/scripts" "$dest/scripts"
for f in CLAUDE.md package.json; do cp "$src/$f" "$dest/$f"; done
for d in .claude .agents .codex; do cp -R "$src/$d" "$dest/$d"; done
for p in compiler kernel skeleton browser-evidence console; do
  mkdir -p "$dest/packages/$p"
  cp "$src/packages/$p/package.json" "$dest/packages/$p/"
  [[ -d "$src/packages/$p/dist" ]] && cp -R "$src/packages/$p/dist" "$dest/packages/$p/dist"
  [[ -f "$src/packages/$p/tsconfig.json" ]] && cp "$src/packages/$p/tsconfig.json" "$dest/packages/$p/"
  ln -s "../../packages/$p" "$dest/node_modules/@dotln/$p"
done
cp -R "$src/packages/beacons" "$dest/packages/beacons"
ln -s ../../packages/beacons "$dest/node_modules/@dotln/beacons"
for m in typescript prettier; do ln -s "$src/node_modules/$m" "$dest/node_modules/$m"; done
mkdir -p "$dest/.runtime/harness"
for snap in "$src"/.runtime/harness/*(N); do cp -R "$snap" "$dest/.runtime/harness/"; done
printf 'node_modules/\n.runtime/\n' > "$dest/.gitignore"
git -C "$dest" init -q -b probe
