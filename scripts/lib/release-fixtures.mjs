import { createHash, randomUUID } from "node:crypto";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const marker = "release-fixture-template.json";
const roots = ["origin.git", "project"];

/** The executable case functions are the inventory, not a second shell list. */
export function releaseCases(repo) {
  const source = readFileSync(join(repo, "scripts/test-release.sh"), "utf8");
  const names = [
    ...source.matchAll(/^release_case_([a-z][a-z0-9_]*)\(\) \{$/gm),
  ].map((match) => match[1]);
  if (!names.length || new Set(names).size !== names.length)
    throw new Error("Release case inventory is empty or duplicated");
  return names;
}

function fingerprint(root) {
  const hash = createHash("sha256");
  let files = 0;
  const visit = (relative) => {
    const path = join(root, relative);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink())
      throw new Error("Fixture template contains a symlink");
    if (stat.isDirectory()) {
      hash.update(JSON.stringify([relative, "directory"]));
      for (const name of readdirSync(path).sort()) visit(`${relative}/${name}`);
    } else if (stat.isFile()) {
      hash.update(JSON.stringify([relative, stat.mode & 0o777, stat.size]));
      hash.update(readFileSync(path));
      files++;
    } else throw new Error("Unsupported fixture template entry");
  };
  for (const name of roots) visit(name);
  return { hash: hash.digest("hex"), files };
}

export function saveReleaseTemplate(fixture, destination) {
  if (existsSync(destination))
    throw new Error("Fixture template already exists");
  // Validate before copying, and never copy arbitrary material outside these
  // two repositories. They contain synthetic fixture data only.
  const expected = fingerprint(fixture);
  mkdirSync(destination);
  for (const name of roots)
    cpSync(join(fixture, name), join(destination, name), { recursive: true });
  if (fingerprint(destination).hash !== expected.hash)
    throw new Error("Fixture template copy changed bytes");
  writeFileSync(
    join(destination, marker),
    JSON.stringify({ version: 1, ...expected }) + "\n",
    { flag: "wx" },
  );
  return expected;
}

export function copyReleaseTemplate(template, destination) {
  const info = lstatSync(template);
  if (!info.isDirectory() || info.isSymbolicLink())
    throw new Error("Fixture template must be a regular directory");
  const sealPath = join(template, marker);
  if (!lstatSync(sealPath).isFile() || lstatSync(sealPath).isSymbolicLink())
    throw new Error("Fixture template seal must be a regular file");
  const seal = JSON.parse(readFileSync(sealPath, "utf8"));
  const observed = fingerprint(template);
  if (
    seal.version !== 1 ||
    observed.hash !== seal.hash ||
    observed.files !== seal.files
  )
    throw new Error("Fixture template changed after preparation");
  for (const name of roots)
    if (existsSync(join(destination, name)))
      throw new Error("Fixture destination already contains a repository");
  mkdirSync(destination, { recursive: true });
  for (const name of roots)
    cpSync(join(template, name), join(destination, name), { recursive: true });
  // The copied local URL mapping belongs to the template. Each shell case
  // installs its own local origin after this copy; no refs or writable files
  // are shared with the template or another case.
  const repo = join(destination, "project");
  const mapping = spawnSync(
    "git",
    [
      "-C",
      repo,
      "config",
      "--local",
      "--name-only",
      "--get-regexp",
      "^url\\..*\\.insteadof$",
    ],
    { encoding: "utf8" },
  );
  if (![0, 1].includes(mapping.status))
    throw new Error("Fixture URL mapping unavailable");
  for (const key of mapping.stdout.trim().split("\n").filter(Boolean)) {
    const result = spawnSync("git", [
      "-C",
      repo,
      "config",
      "--local",
      "--unset-all",
      key,
    ]);
    if (result.status !== 0)
      throw new Error("Fixture URL mapping could not be isolated");
  }
  return observed;
}

export function createReleaseFixtureContext() {
  const base = realpathSync(tmpdir());
  const directory = mkdtempSync(join(base, "dotln-release-shared-"));
  const token = randomUUID();
  const ownership = join(directory, ".owner");
  writeFileSync(ownership, token, { flag: "wx", mode: 0o600 });
  return {
    template: join(directory, "template"),
    cleanup() {
      if (
        lstatSync(directory).isSymbolicLink() ||
        realpathSync(directory) !== directory ||
        lstatSync(ownership).isSymbolicLink() ||
        readFileSync(ownership, "utf8") !== token
      )
        throw new Error("Refusing cleanup of changed release fixture context");
      rmSync(directory, { recursive: true });
    },
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [action, from, to, ...rest] = process.argv.slice(2);
  try {
    if (action === "list" && from && !to && !rest.length)
      console.log(releaseCases(from).join("\n"));
    else {
      if (!["save", "copy"].includes(action) || !from || !to || rest.length)
        throw new Error(
          "usage: release-fixtures.mjs list <repo> | save|copy <source> <destination>",
        );
      (action === "save" ? saveReleaseTemplate : copyReleaseTemplate)(from, to);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
