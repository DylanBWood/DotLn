#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runGit, runGitPathList } from "./lib/git.mjs";
import { containedRegularFile } from "./lib/paths.mjs";

// docs/LEGAL.md, Decision — 2026-09-06. Changing the decision requires review.
const licenseHashes = {
  LICENSE: "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30",
  "LICENSE-docs":
    "9ba9550ad48438d0836ddab3da480b3b69ffa0aac7b7878b5a0039e7ab429411",
  NOTICE: "645cf84db4b0b544bdb8e594d7048ca4ca42da24623b251e6072287ea420d55c",
};
export const publishRefusal =
  "DOTLN_PACKAGE_PUBLISH_REFUSED: packages stay private until a separate publication decision";
export const prepublishOnly = `node -e "console.error('${publishRefusal}'); process.exit(1)"`;

const rule = (surface, observed, expected, pass = observed === expected) => ({
  pass,
  line: `${pass ? "PASS" : "FAIL"} license-surfaces ${surface}: observed ${observed}; expected ${expected}`,
});
const valueOf = (value) => JSON.stringify(value) ?? "missing";
const sourceFile = (root, path, revision) => {
  if (!revision) {
    if (!containedRegularFile(join(root, path), root))
      throw new Error(`${path} is missing or is not a contained regular file`);
    return readFileSync(join(root, path));
  }
  const entry = runGit(root, [
    "ls-tree",
    "-z",
    revision,
    "--",
    `:(literal)${path}`,
  ]);
  if (!/^100(?:644|755) blob [0-9a-f]+\t[^\0]+\0$/.test(entry))
    throw new Error(
      `${path} is missing or is not a regular file in ${revision}`,
    );
  return runGit(root, ["cat-file", "blob", `${revision}:${path}`], {
    trim: false,
    encoding: null,
  });
};
const workspacePaths = (root, revision) => {
  if (revision) {
    const entries = runGitPathList(root, [
      "ls-tree",
      "-z",
      `${revision}:packages`,
    ]);
    if (entries.some((entry) => /^(?:120000|160000) /.test(entry)))
      throw new Error(
        "workspace directories must not be symlinks or submodules",
      );
    return runGitPathList(root, [
      "ls-tree",
      "-r",
      "--name-only",
      "-z",
      revision,
      "--",
      "packages",
    ])
      .filter((path) => /^packages\/[^/]+\/package\.json$/.test(path))
      .sort();
  }
  if (!lstatSync(join(root, "packages")).isDirectory())
    throw new Error("packages must be a directory, not a symlink");
  return readdirSync(join(root, "packages"), { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isSymbolicLink())
        throw new Error("workspace directories must not be symlinks");
      const path = `packages/${entry.name}/package.json`;
      return entry.isDirectory() && existsSync(join(root, path)) ? [path] : [];
    })
    .sort();
};

const dryRunRules = (manifests) => {
  // Only validated manifests enter this scratch snapshot. The exact
  // prepublishOnly command refuses before other lifecycle scripts can run.
  // No source files, .npmrc, or ambient credentials enter it.
  const scratch = mkdtempSync(join(tmpdir(), "dotln-license-surfaces-"));
  try {
    const root = join(scratch, "subject");
    for (const { path, bytes } of manifests) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), bytes);
    }
    const userConfig = join(scratch, "user.npmrc");
    const globalConfig = join(scratch, "global.npmrc");
    writeFileSync(userConfig, "");
    writeFileSync(globalConfig, "");
    return manifests.map(({ path }) => {
      const result = spawnSync(
        "npm",
        [
          "publish",
          "--dry-run",
          "--offline",
          "--workspaces=false",
          "--ignore-scripts=false",
          "--registry=https://registry.invalid",
          "--loglevel=error",
          `--userconfig=${userConfig}`,
          `--globalconfig=${globalConfig}`,
          `--cache=${join(scratch, "cache")}`,
        ],
        {
          cwd: dirname(join(root, path)),
          env: { PATH: process.env.PATH, npm_config_update_notifier: "false" },
          encoding: "utf8",
          timeout: 30_000,
          maxBuffer: 1024 * 1024,
        },
      );
      // A missing npm, auth/config error, or arbitrary failing script is not
      // evidence of the intended refusal. Do not publish raw npm diagnostics.
      const refused = (result.stderr ?? "")
        .split(/\r?\n/)
        .includes(publishRefusal);
      const observed = result.error
        ? `npm execution failed (${result.error.code ?? "unknown"})`
        : `exit ${result.status ?? result.signal}; ${refused ? "DOTLN_PACKAGE_PUBLISH_REFUSED" : "no publication refusal marker"}`;
      return rule(
        `${path} npm publish --dry-run`,
        observed,
        "exit 1; DOTLN_PACKAGE_PUBLISH_REFUSED",
        !result.error && result.status === 1 && refused,
      );
    });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
};

export const licenseSurfaceRules = (root, revision) => {
  const rules = [];
  const manifests = [];
  try {
    const rootManifest = JSON.parse(sourceFile(root, "package.json", revision));
    // This is the repository's current bounded workspace layout. Refuse a new
    // pattern until discovery is extended, rather than silently omitting it.
    rules.push(
      rule(
        "package.json workspaces",
        valueOf(rootManifest.workspaces),
        '["packages/*"]',
      ),
    );
    const workspaces = workspacePaths(root, revision);
    rules.push(
      rule(
        "workspace count",
        String(workspaces.length),
        "at least one",
        workspaces.length > 0,
      ),
    );
    for (const path of ["package.json", ...workspaces]) {
      const bytes = sourceFile(root, path, revision);
      const manifest = JSON.parse(bytes);
      manifests.push({ path, bytes });
      rules.push(
        rule(`${path} license`, valueOf(manifest.license), '"Apache-2.0"'),
        rule(`${path} private`, valueOf(manifest.private), "true"),
        rule(
          `${path} prepublishOnly`,
          valueOf(manifest.scripts?.prepublishOnly),
          valueOf(prepublishOnly),
        ),
        // npm merges publishConfig into its publication options. Keep it out
        // until the separate publication decision, including for dry runs.
        rule(
          `${path} publishConfig`,
          valueOf(manifest.publishConfig),
          "missing",
        ),
      );
    }
  } catch (error) {
    rules.push(
      rule(
        "manifests",
        error.message,
        "readable root and workspace manifests",
        false,
      ),
    );
  }
  const manifestsValid = rules.every(({ pass }) => pass);
  for (const [path, hash] of Object.entries(licenseHashes)) {
    try {
      const observed = createHash("sha256")
        .update(sourceFile(root, path, revision))
        .digest("hex");
      rules.push(rule(path, `sha256:${observed}`, `sha256:${hash}`));
    } catch (error) {
      rules.push(rule(path, error.message, `sha256:${hash}`, false));
    }
  }
  try {
    const legal = sourceFile(root, "docs/LEGAL.md", revision).toString("utf8");
    for (const [path, hash] of Object.entries(licenseHashes)) {
      const pins = [
        ...legal.matchAll(
          new RegExp("- `" + path + "` — `sha256:([a-f0-9]{64})`", "g"),
        ),
      ];
      rules.push(
        rule(
          `docs/LEGAL.md ${path} pin`,
          pins.map((pin) => pin[1]).join(", ") || "missing",
          hash,
        ),
      );
    }
  } catch (error) {
    rules.push(
      rule(
        "docs/LEGAL.md pins",
        error.message,
        "the three decided SHA-256 pins",
        false,
      ),
    );
  }
  if (manifestsValid) rules.push(...dryRunRules(manifests));
  else
    rules.push(
      rule(
        "npm publish --dry-run",
        "not run: invalid manifest policy",
        "validated manifests before executing lifecycle scripts",
        false,
      ),
    );
  return rules;
};

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args.length === 1 && args[0] !== "--committed"))
      throw new Error("usage: license-surfaces [--committed]");
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
    const rules = licenseSurfaceRules(root, args.length ? "HEAD" : undefined);
    process.stdout.write(`${rules.map(({ line }) => line).join("\n")}\n`);
    if (rules.some(({ pass }) => !pass)) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`error: ${error.message}\n`);
    process.exitCode = 1;
  }
}
