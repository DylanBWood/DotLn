import { existsSync, lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { containedRegularFile } from "./paths.mjs";

// Source-only: startup and close must diagnose a missing build before importing it.
const hash = (text) => {
  let value = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(text)) {
    value ^= BigInt(byte);
    value = BigInt.asUintN(64, value * 0x100000001b3n);
  }
  return `fnv1a64:${value.toString(16).padStart(16, "0")}`;
};
export function harnessRuntimeCause(root) {
  const manifest = join(root, ".claude/harness-manifest.json");
  // A fixture or consumer that has never installed hooks has no pins to compare.
  if (!existsSync(manifest)) return null;
  try {
    const profiles = JSON.parse(readFileSync(manifest, "utf8")).profiles;
    if (!Array.isArray(profiles) || !profiles.length)
      return "runtime-unavailable";
    for (const entry of profiles) {
      const runtime = entry.profile?.runtime;
      if (!runtime?.files?.length) return "runtime-unavailable";
      for (const file of runtime.files) {
        if (
          !/^packages\/(?:compiler|skeleton)\/dist\/src\/[a-z-]+\.(?:js|mjs)$/.test(
            file.path,
          )
        )
          return "runtime-unavailable";
        const built = join(root, file.path);
        if (!containedRegularFile(built, root)) return "runtime-unavailable";
        if (hash(readFileSync(built, "utf8")) !== file.hash)
          return "pins-differ";
      }
      if (runtime.snapshot) {
        if (!/^\.runtime\/harness\/[a-f0-9]{16}$/.test(runtime.snapshot))
          return "runtime-unavailable";
        for (const directory of [
          ".runtime",
          ".runtime/harness",
          runtime.snapshot,
        ])
          if (
            existsSync(join(root, directory)) &&
            lstatSync(join(root, directory)).isSymbolicLink()
          )
            return "runtime-unavailable";
        for (const file of runtime.files) {
          const saved = join(root, runtime.snapshot, file.path);
          if (!containedRegularFile(saved, root)) return "snapshot-missing";
          if (hash(readFileSync(saved, "utf8")) !== file.hash)
            return "pins-differ";
        }
      }
    }
    return null;
  } catch {
    return "runtime-unavailable";
  }
}

export function reportHarnessRuntime(root) {
  const cause = harnessRuntimeCause(root);
  if (cause)
    process.stderr.write(
      `DotLn advisory: ${cause}; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide.\n`,
    );
  return cause;
}

export function refreshHarnessRuntime(root, build) {
  const cause = harnessRuntimeCause(root);
  if (!cause) return false;
  process.stdout.write(
    `Refreshing pinned runtime (${cause}); npm run build.\n`,
  );
  build();
  const remaining = harnessRuntimeCause(root);
  if (remaining)
    throw new Error(
      `Built runtime still ${remaining}; checkout preserved; run node scripts/bootstrap.mjs`,
    );
  return true;
}
