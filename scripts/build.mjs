#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Enumerate before publication so a stale output or symlink cannot redirect a
 * write outside the build tree. TypeScript emits only regular files/directories.
 */
function buildFiles(directory, base = "") {
  if (!existsSync(directory)) return [];
  if (
    !lstatSync(directory).isDirectory() ||
    lstatSync(directory).isSymbolicLink()
  )
    throw new Error("Build output must be a regular directory");
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(base, entry.name);
    if (entry.isSymbolicLink())
      throw new Error("Build output must not contain symlinks");
    if (entry.isDirectory())
      return buildFiles(join(directory, entry.name), path);
    if (!entry.isFile())
      throw new Error("Build output must contain regular files");
    return [path];
  });
}

/** Publish complete files with Node's rename, keeping ordinary dist paths stable.
 * Running hooks use their immutable pinned snapshot, never this changing view.
 * The build barrier completes before any dependent application command starts.
 */
export function publishBuildTree(source, destination, observe = () => {}) {
  const next = buildFiles(source);
  const previous = buildFiles(destination);
  if (!existsSync(destination)) {
    renameSync(source, destination);
    return;
  }
  for (const path of next) {
    const target = join(destination, path);
    mkdirSync(dirname(target), { recursive: true });
    observe("before", path);
    renameSync(join(source, path), target);
    observe("after", path);
  }
  const current = new Set(next);
  for (const path of previous)
    if (!current.has(path)) unlinkSync(join(destination, path));
}

export function atomicBuild(repo = root, observe = () => {}) {
  mkdirSync(join(repo, ".runtime"), { recursive: true });
  const staging = mkdtempSync(join(repo, ".runtime/build-"));
  try {
    cpSync(join(repo, "tsconfig.json"), join(staging, "tsconfig.json"));
    const names = readdirSync(join(repo, "packages")).filter((name) =>
      existsSync(join(repo, "packages", name, "tsconfig.json")),
    );
    mkdirSync(join(staging, "node_modules/@dotln"), { recursive: true });
    for (const dependency of readdirSync(join(repo, "node_modules"))) {
      if (dependency === "@dotln" || dependency === ".bin") continue;
      symlinkSync(
        join(repo, "node_modules", dependency),
        join(staging, "node_modules", dependency),
      );
    }
    for (const name of names) {
      const destination = join(staging, "packages", name);
      mkdirSync(destination, { recursive: true });
      for (const file of ["package.json", "tsconfig.json"])
        cpSync(join(repo, "packages", name, file), join(destination, file));
      // Copies keep TypeScript's resolution inside the staged project graph.
      for (const directory of ["src", "test"])
        if (existsSync(join(repo, "packages", name, directory)))
          cpSync(
            join(repo, "packages", name, directory),
            join(destination, directory),
            { recursive: true },
          );
      symlinkSync(destination, join(staging, "node_modules/@dotln", name));
    }
    observe("building");
    const run = spawnSync(
      process.execPath,
      [join(repo, "node_modules/typescript/bin/tsc"), "-b", "--force"],
      { cwd: staging, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
    );
    if (run.status !== 0)
      throw new Error(
        `Build failed (${run.status ?? run.error?.message}):\n${run.stdout ?? ""}${run.stderr ?? ""}`,
      );
    for (const name of names) {
      const source = join(staging, "packages", name, "dist");
      const destination = join(repo, "packages", name, "dist");
      if (!existsSync(source))
        throw new Error(`Build emitted no ${name} runtime`);
      observe(`before:${name}`);
      publishBuildTree(source, destination);
      observe(`after:${name}`);
    }
    return names;
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  try {
    console.log(
      `Built ${atomicBuild().join(", ")} with atomic file replacement; installed harness snapshots remain immutable`,
    );
    const manifestPath = join(root, ".claude/harness-manifest.json");
    if (existsSync(manifestPath)) {
      const installed = JSON.parse(readFileSync(manifestPath, "utf8"));
      if (
        installed.profiles?.some(
          (profile) => profile.profile?.runtime?.snapshot,
        )
      ) {
        const { harnessInstallation, preserveHarnessRuntime } =
          await import("./lib/harness.mjs");
        const expected = harnessInstallation();
        if (
          installed.profiles.every(
            (profile) =>
              profile.profile.runtime.snapshot === expected.runtimeSnapshot,
          )
        )
          preserveHarnessRuntime(root, expected);
      }
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
