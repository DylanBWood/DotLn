import { existsSync, readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { verifyKit } from "../launchpad.mjs";
import { gateInstanceInputDigest } from "../../packages/skeleton/src/gate-evidence.mjs";
import { harnessRuntimeCause } from "./harness-runtime.mjs";
import { isMainModule } from "./paths.mjs";

/** Restore a missing selected snapshot from verified carried packages. Existing
 * snapshots and generated surfaces are preserved so actual drift still refuses. */
export async function prepareKitReleaseRuntime(root) {
  root = realpathSync(root);
  verifyKit(root);
  gateInstanceInputDigest(root);
  const { preserveHarnessRuntime } = await import("./harness.mjs");
  const manifestPath = join(root, ".claude/harness-manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (!Array.isArray(manifest.profiles) || !manifest.profiles.length)
      throw new Error("Release harness runtime selection is unavailable");
    for (const profile of manifest.profiles) {
      const runtime = profile.profile?.runtime;
      if (
        !/^\.runtime\/harness\/[a-f0-9]{16}$/u.test(runtime?.snapshot ?? "") ||
        !Array.isArray(runtime.files) ||
        !runtime.files.length ||
        runtime.files.some(
          (file) =>
            !/^packages\/(?:compiler|skeleton)\/dist\/src\/[A-Za-z0-9_-]+\.(?:js|mjs)$/u.test(
              file.path,
            ) || !/^fnv1a64:[a-f0-9]{16}$/u.test(file.hash),
        )
      )
        throw new Error("Release harness runtime selection is invalid");
      preserveHarnessRuntime(root, {
        runtimeSnapshot: runtime.snapshot,
        runtimeFiles: runtime.files,
        sourceRoot: root,
      });
    }
  }
  const remaining = harnessRuntimeCause(root);
  if (remaining)
    throw new Error(`Carried release runtime remains ${remaining}`);
}

if (isMainModule(import.meta.url)) {
  try {
    await prepareKitReleaseRuntime(process.argv[2] ?? process.cwd());
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
