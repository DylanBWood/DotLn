#!/usr/bin/env node
// `launchpad export <dir>` materializes a launchpad instance from a
// manifest-listed kit read as Git blobs at the HEAD commit of the checkout
// that holds the running scripts (TOOL_ROOT), the templates included, so the
// manifest never names a commit that lacks a kit file's source. Kit files land
// in the manifest with their SHA-256; instance seeds are written once and
// never listed. Only the local-terms list is the launchpad's (WO-074). The
// export also carries the compiled runtime the kit's scripts and the
// generated hooks import, built from the commit's package sources at export
// time, and the Contributor harness bundle the export's own
// `node scripts/harness.mjs emit` writes, verified against the bundle core's
// compiled packages predict before any file is written (WO-075).
import {
  TOOL_ROOT,
  defaultDocRelative,
  docRelative,
  findLaunchpad,
} from "./lib/config.mjs";
import {
  failureOf,
  readGitObjects,
  runGit,
  runGitPathList,
} from "./lib/git.mjs";
import { parseGitHubTarget } from "./lib/github-repository.mjs";
import { json, sha256Hex } from "./lib/helpers.mjs";
import { hasPackageSources, isMainModule } from "./lib/paths.mjs";
import { checkLocalTerms } from "./lib/terms.mjs";
import { atomicBuild } from "./build.mjs";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

export const KIT_MANIFEST = "KIT-MANIFEST.json";
export const KIT_MANIFEST_SCHEMA_VERSION = 1;
export const UPSTREAM = "UPSTREAM.md";
export const LICENSE_FILES = Object.freeze([
  "LICENSE",
  "LICENSE-docs",
  "NOTICE",
]);
export const LICENSE_PENDING = "LICENSE-PENDING.md";
export const KIT_PACKAGE_NAME = "dotln-launchpad";
// The compiled packages whose dist the kit carries: the hook closure the
// generated hooks and the kit's `resume` and `harness` commands import
// (WO-075). `console` and `browser-evidence` stay out; the kit scripts whose
// import closure needs them fail at import in an export and are named in the
// order's decisions.
export const RUNTIME_PACKAGES = Object.freeze([
  "kernel",
  "compiler",
  "skeleton",
]);
// The compiled output a runtime package ships, relative to its directory.
export const RUNTIME_OUTPUT = "dist/src";
// The workspaces the kit carries, each with its node_modules link in the
// lockfile: the build-free Beacon workspace and the three compiled packages.
export const KIT_WORKSPACES = Object.freeze([
  "packages/beacons",
  ...RUNTIME_PACKAGES.map((name) => `packages/${name}`),
]);
// The paths whose work-tree state must equal HEAD before the runtime is built,
// so the copied build is the commit's: the package trees, the project files and
// the build script a clone of the commit rebuilds with.
export const BUILD_INPUTS = Object.freeze([
  "packages",
  "tsconfig.json",
  "package.json",
  "package-lock.json",
  "scripts/build.mjs",
]);
// scripts/lib/harness.mjs and its static imports under scripts/, which the
// prediction of the harness bundle runs from the work tree while the export's
// own emit runs the commit's blobs of them, plus scripts/harness.mjs, pinned
// because it chooses the emit's options inside the export. A difference from
// HEAD in any of them refuses before any write; the fixture checks this list
// against the import graph.
export const EMIT_CLOSURE = Object.freeze([
  "scripts/harness.mjs",
  "scripts/lib/config.mjs",
  "scripts/lib/git.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/helpers.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/terms.mjs",
]);
// Git's own environment never reaches the export's repository or its emit: an
// inherited GIT_DIR would initialize another repository and leave the export
// without its own.
const GIT_ENVIRONMENT = Object.freeze([
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_COMMON_DIR",
  "GIT_PREFIX",
]);
const exportEnvironment = () => {
  const env = { ...process.env };
  for (const name of [...GIT_ENVIRONMENT, "DOTLN_LAUNCHPAD"]) delete env[name];
  return env;
};
// The one emitted surface that is an instance file: the operating contract
// keeps its hand-written floor, and `harness check` governs the generated
// block through the harness manifest's marked-block hash.
export const INSTRUCTION_FILE = "CLAUDE.md";
export const HARNESS_MANIFEST = ".claude/harness-manifest.json";
export const FIRST_ORDER = "WO-001-environment-truth.md";

// The build-free modules the kit's scripts import from the compiled packages
// (the 2026-10-07 pass). TypeScript source is never a kit file.
export const BUILD_FREE_MODULES = Object.freeze([
  "packages/compiler/src/attribution.mjs",
  "packages/compiler/src/codex-continuation.mjs",
  "packages/compiler/src/operator-control.mjs",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/evidence-editions.mjs",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/writer-teardown.mjs",
]);

/** The kit allowlist. Trees and files are repository paths; documents are
 * [root key, ...segments], read through the kit root's configuration and
 * written at the kit's default layout. Instance files are never here. */
export const KIT_FILES = Object.freeze({
  trees: Object.freeze(["scripts", "packages/beacons"]),
  files: Object.freeze([
    ...BUILD_FREE_MODULES,
    ...RUNTIME_PACKAGES.map((name) => `packages/${name}/package.json`),
  ]),
  licenses: LICENSE_FILES,
  // 08 travels because the emitted reviewer skill directs a read of its
  // "PRs and commits" section (WO-075); harness-context --check inside an
  // export resolves every installed Read directive.
  documents: Object.freeze([
    ["docs", "PLAYBOOK.md"],
    ["product", "07-execution-guide.md"],
    ["product", "08-publication-compiler.md"],
    ["publication", "implementation-overlay-template.md"],
  ]),
});

// Core inputs the generated kit files derive from; read at the commit, never
// exported as they are.
const KIT_INPUTS = Object.freeze(["package.json", "package-lock.json"]);

// The templates the export renders, blobs at the commit like every kit file;
// their verbatim copies travel in the manifest under scripts/kit as well.
export const KIT_TEMPLATES = "scripts/kit";
export const KIT_TEMPLATE_FILES = Object.freeze([
  "AI-HARNESS-SECURITY.template.md",
  "CLAUDE.template.md",
  "README.client.md",
  "dotln.config.example.json",
  "first-order.template.md",
  "gitignore.template",
  "pending-license.template.md",
  "repository-profile.template.md",
  "workstream.template.md",
]);

// Root keys whose directories the export seeds with a README convention.
const SEEDED_ROOTS = Object.freeze({
  control:
    "Control records of this instance: one JSONL segment per order under orders/, the generated current.md projection, and local/ (ignored) for harness observations, usage and the private local-terms list. Written by the lifecycle commands; never edited by hand.",
  evidence:
    "Per-order directories: decisions.md (structured decisions with evidence, rejected options and reopening conditions), handoff.md (one line per acceptance criterion at implementation-ready) and fixture transcripts. current.json selects evidence editions once this instance records any.",
  verifications:
    "Immutable numbered verifier reports, VER-NNN.md, grouped by work order. A re-verification writes the next unused number; nothing here is edited after filing.",
  finalReviews:
    "Immutable numbered final-review reports, FINAL-NNN.md, with the PR and release-notes handoffs beside them, grouped by work order.",
  planning:
    "Dated planning passes, sequence.md (the proposed order), the follow-up register and immutable refutation receipts under refutations/.",
  publication:
    "The implementation overlay template the kit carries, and this instance's audience outlines and status index once it compiles any publication.",
  product:
    "The kit carries the execution guide (07-execution-guide.md) and the publication compiler (08-publication-compiler.md, which the reviewer skill cites) whole. This instance's product overlay lives here as an instance file; core's other product documents are upstream pointers in UPSTREAM.md.",
  discovery:
    "Machine-audit outputs of this instance. Until environment.json records the harness versions and effort selectors observed here (the first order's deliverable), every lifecycle attestation prints the discovery advisory.",
  decisions:
    "Architecture decision records of this instance, numbered and dated; a settled question lives here, an open one in planning/.",
  releases:
    "Release records: tag manifests and notes for the versions this instance publishes.",
  observations:
    "JSONL observation logs the control plane appends to (host requests, pull-request observations); each is an event stream or a classified protocol.",
});

/** Refuse a destination that exists and is not an empty, readable directory.
 * Nothing is created here: the directory is made only once every refusal,
 * the local-terms check included, has passed. */
export function checkDestination(destination) {
  const path = resolve(destination);
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat) return path;
  if (stat.isSymbolicLink())
    throw new Error(`destination is a symbolic link: ${path}`);
  if (!stat.isDirectory())
    throw new Error(`destination exists and is not a directory: ${path}`);
  let entries;
  try {
    entries = readdirSync(path);
  } catch (error) {
    throw new Error(`destination cannot be read: ${path} (${error.code})`);
  }
  if (entries.length)
    throw new Error(
      `destination is not empty: ${path} (${entries.length} ${entries.length === 1 ? "entry" : "entries"})`,
    );
  return path;
}

/** Every kit source as a Git blob at `commit` in `root`'s repository: the
 * allowlisted trees, files, licenses and documents plus the derivation
 * inputs. Never the work tree. */
export function readKitSources(root, commit, { license = "default" } = {}) {
  const documents = KIT_FILES.documents.map(([key, ...segments]) => ({
    source: docRelative(root, key, ...segments),
    destination: defaultDocRelative(key, ...segments),
  }));
  const explicit = [
    ...KIT_FILES.files,
    ...KIT_TEMPLATE_FILES.map((name) => `${KIT_TEMPLATES}/${name}`),
    ...(license === "none" ? [] : KIT_FILES.licenses),
    ...documents.map((document) => document.source),
    ...KIT_INPUTS,
  ];
  const entries = runGitPathList(root, [
    "ls-tree",
    "-r",
    "-z",
    commit,
    "--",
    ...KIT_FILES.trees,
    ...explicit,
  ]).map((entry) => {
    const match = /^(\d{6}) (\w+) ([0-9a-f]+)\t(.+)$/su.exec(entry);
    if (!match) throw new Error(`unreadable tree entry: ${entry}`);
    return { mode: match[1], type: match[2], object: match[3], path: match[4] };
  });
  const byPath = new Map(entries.map((entry) => [entry.path, entry]));
  const wanted = new Set([
    ...explicit,
    ...entries
      .map((entry) => entry.path)
      .filter((path) =>
        KIT_FILES.trees.some((tree) => path.startsWith(`${tree}/`)),
      ),
  ]);
  for (const path of wanted) {
    const entry = byPath.get(path);
    if (!entry)
      throw new Error(`kit file is absent at ${commit.slice(0, 12)}: ${path}`);
    if (entry.type !== "blob" || !/^100(?:644|755)$/u.test(entry.mode))
      throw new Error(
        `kit file must be a regular file at ${commit.slice(0, 12)}: ${path} (${entry.mode} ${entry.type})`,
      );
  }
  const blobs = readGitObjects(
    root,
    [...wanted].map((path) => byPath.get(path).object),
    "blob",
  );
  const sources = new Map();
  for (const path of [...wanted].sort()) {
    const entry = byPath.get(path);
    const document = documents.find((item) => item.source === path);
    sources.set(path, {
      bytes: blobs.get(entry.object),
      mode: entry.mode === "100755" ? 0o755 : 0o644,
      destination: document ? document.destination : path,
      input: KIT_INPUTS.includes(path),
    });
  }
  return sources;
}

/** The kit manifest: schema 1, the commit and tag the kit was read at, and
 * every kit file with its SHA-256, sorted by path. Seeds are never listed. */
export function kitManifest({ commit, tag, files }) {
  return {
    schemaVersion: KIT_MANIFEST_SCHEMA_VERSION,
    commit,
    tag,
    files: [...files]
      .map(({ path, sha256: hash }) => ({ path, sha256: hash }))
      .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)),
  };
}

/** The kit's package.json: core's script names and commands, core's exact dev
 * dependency pins and engines, the packages/* workspaces, private. */
export function kitPackage(corePackage, { license = "default" } = {}) {
  return {
    name: KIT_PACKAGE_NAME,
    private: true,
    // npm's UNLICENSED names no license and grants no right (--license none).
    license: license === "none" ? "UNLICENSED" : corePackage.license,
    workspaces: ["packages/*"],
    scripts: { ...corePackage.scripts },
    devDependencies: { ...corePackage.devDependencies },
    engines: { ...corePackage.engines },
  };
}

/** Prune core's lockfile to the kit: the root, each KIT_WORKSPACES entry and
 * its node_modules/@dotln link, and the closure of the kit's dev dependencies
 * at core's exact pins. */
export function kitLockfile(coreLock, kitPackageJson) {
  const packages = coreLock.packages ?? {};
  const resolveDependency = (from, name) => {
    let base = from;
    for (;;) {
      const key = base
        ? `${base}/node_modules/${name}`
        : `node_modules/${name}`;
      if (packages[key]) return key;
      if (!base) return undefined;
      const index = base.lastIndexOf("/node_modules/");
      base = index < 0 ? "" : base.slice(0, index);
    }
  };
  const kept = new Map();
  const visit = (key) => {
    if (kept.has(key)) return;
    const entry = packages[key];
    kept.set(key, entry);
    for (const field of [
      "dependencies",
      "optionalDependencies",
      "peerDependencies",
    ])
      for (const name of Object.keys(entry[field] ?? {})) {
        const target = resolveDependency(key, name);
        if (target) visit(target);
        else if (field === "dependencies")
          throw new Error(`core lockfile lacks ${name}, required by ${key}`);
      }
  };
  for (const name of Object.keys(kitPackageJson.devDependencies)) {
    const key = resolveDependency("", name);
    if (!key) throw new Error(`core lockfile lacks ${name}`);
    visit(key);
  }
  for (const workspace of KIT_WORKSPACES) {
    const link = `node_modules/@dotln/${basename(workspace)}`;
    if (!packages[workspace] || !packages[link]?.link)
      throw new Error(`core lockfile lacks the ${workspace} workspace`);
    visit(workspace);
    kept.set(link, packages[link]);
  }
  const coreRoot = packages[""] ?? {};
  const root = {
    ...coreRoot,
    name: kitPackageJson.name,
    license: kitPackageJson.license,
    workspaces: [...kitPackageJson.workspaces],
    devDependencies: { ...kitPackageJson.devDependencies },
    engines: { ...kitPackageJson.engines },
  };
  delete root.dependencies;
  const ordered = [...kept.keys()].sort();
  return {
    name: kitPackageJson.name,
    lockfileVersion: coreLock.lockfileVersion,
    requires: coreLock.requires,
    packages: Object.fromEntries([
      ["", root],
      ...ordered.map((key) => [key, packages[key]]),
    ]),
  };
}

const describeTag = (root, commit) => {
  const exact = runGit(root, [
    "tag",
    "--points-at",
    commit,
    "--sort=-v:refname",
  ])
    .split("\n")
    .filter(Boolean);
  const nearest = runGit(root, ["describe", "--tags", "--abbrev=0", commit], {
    onFailure: () => null,
  });
  return { tag: exact[0] ?? null, nearest: nearest || null };
};

/** The origin remote as a forge target (host/owner/repo), or null: a local
 * path, a credentialed URL or any other shape the parser refuses never
 * reaches the kit. */
const originTarget = (root) => {
  const url = runGit(root, ["config", "--get", "remote.origin.url"], {
    onFailure: () => "",
  });
  try {
    return url ? parseGitHubTarget(url) : null;
  } catch {
    return null;
  }
};

/** How many kit paths differ from HEAD in the work tree: the export carries
 * the commit, and the operator is told what it does not carry. */
const dirtyKitPathCount = (root, sources) =>
  runGitPathList(root, [
    "status",
    "--porcelain",
    "-z",
    "--no-renames",
    "--untracked-files=all",
    "--",
    ...KIT_FILES.trees,
    ...[...sources.keys()].filter(
      (path) => !KIT_FILES.trees.some((tree) => path.startsWith(`${tree}/`)),
    ),
  ]).length;

const upstreamDocument = (
  root,
  commit,
  { tag, nearest, target, license, kit, seeds },
) => {
  // owner/repo@commit path, the form the repository-profile references use.
  const slug = target ? target.selector.split("/").slice(1).join("/") : null;
  const pointer = (path) =>
    slug ? `\`${slug}@${commit.slice(0, 12)} ${path}\`` : `\`${path}\``;
  const productRoot = docRelative(root, "product");
  const carried = new Set(kit.map((file) => file.path));
  const candidates = [
    ...runGitPathList(root, [
      "ls-tree",
      "-z",
      "--name-only",
      commit,
      "--",
      `${productRoot}/`,
    ])
      .filter(
        (path) =>
          path.endsWith(".md") &&
          !carried.has(
            defaultDocRelative("product", path.slice(productRoot.length + 1)),
          ),
      )
      .map((path) => [
        path,
        "a product document the kit points to and does not carry",
      ]),
    [
      docRelative(root, "publication", "base-outline.md"),
      "the base outline an implementation overlay narrows",
    ],
    [
      docRelative(root, "publication", "audience-status-index.md"),
      "the audience and status index of the product documents",
    ],
    [
      docRelative(root, "docs", "LEGAL.md"),
      "the license posture, the pinned license hashes and the remaining distribution gates",
    ],
    [
      "CONTRIBUTING.md",
      "outbound licenses, the sign-off rule and the clean-room boundary",
    ],
    [
      docRelative(root, "docs", "AI-HARNESS-SECURITY.md"),
      "the operator record the sanitized harness-security template is derived from",
    ],
    [
      docRelative(
        root,
        "decisions",
        "0006-platform-mechanisms-instance-doctrine.md",
      ),
      "the platform and instance boundary this kit makes physical",
    ],
    [
      docRelative(root, "decisions", "0007-presence-is-a-policy-input.md"),
      "presence as a policy input with no universal direction",
    ],
  ];
  const present = new Set(
    runGitPathList(root, [
      "ls-tree",
      "-r",
      "-z",
      "--name-only",
      commit,
      "--",
      ...candidates.map(([path]) => path),
    ]),
  );
  const pointers = candidates.filter(([path]) => present.has(path));
  // [label, prefixes, what the group is]; a file outside every group is listed
  // on its own line.
  const groups = [
    ["`scripts/**`", ["scripts/"], "byte-identical to the commit"],
    [
      "`packages/beacons/**`",
      ["packages/beacons/"],
      "byte-identical to the commit",
    ],
    ...RUNTIME_PACKAGES.map((name) => [
      `\`packages/${name}/package.json\`, \`packages/${name}/${RUNTIME_OUTPUT}/**\``,
      [`packages/${name}/package.json`, `packages/${name}/${RUNTIME_OUTPUT}/`],
      `the compiled \`@dotln/${name}\` runtime: \`package.json\` byte-identical to the commit, \`${RUNTIME_OUTPUT}/\` built from the commit's sources at export time`,
    ]),
    [
      "`.claude/**`, `.agents/**`, `.codex/**`",
      [".claude/", ".agents/", ".codex/"],
      "the Contributor harness bundle, emitted inside the export by its own `node scripts/harness.mjs emit` and verified by `node scripts/harness.mjs check`",
    ],
  ].map(([label, prefixes, what]) => [
    label,
    kit.filter((file) =>
      prefixes.some((prefix) => file.path.startsWith(prefix)),
    ).length,
    what,
    prefixes,
  ]);
  const rest = kit.filter(
    (file) =>
      !groups.some(([, , , prefixes]) =>
        prefixes.some((prefix) => file.path.startsWith(prefix)),
      ),
  );
  return [
    "# Upstream",
    "",
    "This launchpad was exported from DotLn core by `launchpad export`. The kit is the",
    "manifest-listed set: its verbatim files are Git blobs at the commit below;",
    "`package.json`, `package-lock.json` and this file are generated from them; the",
    "compiled runtime under `packages/<name>/dist/src/` was built at export time from",
    "the work tree after its package sources, project files and build script were",
    "verified equal to the commit; and the harness bundle was emitted inside this",
    "export from that runtime and verified against the bundle core's compiled",
    "packages predicted. No other kit text was read from a work tree.",
    "",
    `- **Commit:** \`${commit}\``,
    `- **Tag:** ${tag ? `\`${tag}\`` : `none at that commit${nearest ? ` (nearest below: \`${nearest}\`)` : ""}`}`,
    `- **Remote:** ${target ? `\`${target.selector}\`` : "unknown (no forge remote recorded)"}`,
    `- **Manifest:** \`${KIT_MANIFEST}\` (schema ${KIT_MANIFEST_SCHEMA_VERSION}; ${kit.length} files with SHA-256)`,
    `- **License files carried:** ${license === "none" ? `\`${LICENSE_PENDING}\` (exported with \`--license none\`; it grants no rights, and the generated \`package.json\` says \`UNLICENSED\`; the verbatim \`packages/beacons/package.json\` keeps upstream's label because it is byte-identical to the commit)` : LICENSE_FILES.map((name) => `\`${name}\``).join(", ")}`,
    "",
    "## Kit files",
    "",
    ...groups.map(
      ([label, count, what]) =>
        `- ${label}: ${count} ${count === 1 ? "file" : "files"}, ${what}`,
    ),
    ...rest.map((file) => `- \`${file.path}\``),
    "",
    "## Instance seeds",
    "",
    "Written once by the export, owned by this instance and never manifest-listed.",
    "`CLAUDE.md` carries the generated harness block after its hand-written floor; the",
    "block is checked by `node scripts/harness.mjs check` through the listed",
    `\`${HARNESS_MANIFEST}\`, not by this manifest:`,
    "",
    ...seeds.map((path) => `- \`${path}\``),
    "",
    "## Upstream pointers",
    "",
    "Core documents the kit does not carry, at the commit above:",
    "",
    ...pointers.map(([path, why]) => `- ${pointer(path)} — ${why}`),
    "",
  ].join("\n");
};

/** Compare pinned files with the named commit's blobs, independent of index
 * flags, and enumerate package inputs on disk, independent of ignore rules.
 * Status adds ordinary untracked-path diagnostics; it never proves equality.
 * Generated dist/install trees are not inputs to atomicBuild. */
const dirtyPinnedInputs = (root, commit) => {
  const paths = [...BUILD_INPUTS, ...EMIT_CLOSURE];
  const dirty = new Set(
    runGitPathList(root, [
      "status",
      "--porcelain",
      "-z",
      "--no-renames",
      "--untracked-files=all",
      "--",
      ...paths,
    ]).map((entry) => entry.slice(3)),
  );
  const entries = runGitPathList(root, [
    "ls-tree",
    "-r",
    "-z",
    commit,
    "--",
    ...paths,
  ]).map((entry) => {
    const match = /^(100(?:644|755)) blob ([0-9a-f]+)\t(.+)$/su.exec(entry);
    if (!match)
      throw new Error(
        `pinned input must be a regular committed file: ${entry}`,
      );
    return { mode: match[1], object: match[2], path: match[3] };
  });
  const blobs = readGitObjects(
    root,
    entries.map((entry) => entry.object),
    "blob",
  );
  const tracked = new Set(entries.map((entry) => entry.path));
  for (const entry of entries) {
    const file = join(root, entry.path);
    const stat = lstatSync(file, { throwIfNoEntry: false });
    if (
      !stat?.isFile() ||
      Boolean(stat.mode & 0o111) !== (entry.mode === "100755") ||
      !readFileSync(file).equals(blobs.get(entry.object))
    )
      dirty.add(entry.path);
  }
  const added = new Set();
  const walk = (path) => {
    const stat = lstatSync(join(root, path), { throwIfNoEntry: false });
    if (!stat) return;
    if (stat.isDirectory()) {
      for (const name of readdirSync(join(root, path))) {
        const child = `${path}/${name}`;
        if (!/^packages\/[^/]+\/(?:dist|node_modules)$/u.test(child))
          walk(child);
      }
    } else if (!stat.isFile()) dirty.add(path);
    // These are the source/module forms the build can consume. Harmless
    // ignored metadata such as .DS_Store stays admitted, even in an ignored
    // directory; untracked compilable files never do.
    else if (
      !tracked.has(path) &&
      /\.(?:[cm]?ts|tsx|[cm]?js|jsx|json)$/u.test(path)
    )
      added.add(path);
  };
  walk("packages");
  // A symlinked ancestor must not make a tracked leaf look like a regular
  // local input. The package walk checks every package directory itself.
  for (const path of ["scripts", "scripts/lib"])
    if (!lstatSync(join(root, path), { throwIfNoEntry: false })?.isDirectory())
      dirty.add(path);
  return {
    buildInputs: [...dirty].filter((path) => !EMIT_CLOSURE.includes(path)),
    emit: [...dirty].filter((path) => EMIT_CLOSURE.includes(path)),
    added: [...added],
  };
};

/** The bin targets of the runtime packages at the commit, written executable
 * so that the fork's own npm ci, which makes them executable, leaves a
 * committed tree clean. */
const binTargets = (sources) =>
  new Set(
    RUNTIME_PACKAGES.flatMap((name) => {
      const manifest = JSON.parse(
        sources.get(`packages/${name}/package.json`).bytes.toString("utf8"),
      );
      const bin =
        typeof manifest.bin === "string"
          ? [manifest.bin]
          : Object.values(manifest.bin ?? {});
      return bin.map(
        (target) => `packages/${name}/${target.replace(/^\.\//u, "")}`,
      );
    }),
  );

/** The compiled runtime the kit carries: every regular file under
 * packages/<name>/dist/src of each runtime package, read from the build
 * atomicBuild just published. A symlink or any other entry refuses. The
 * manifest sorts; this map's order is the walk's. */
const readRuntime = (root) => {
  const files = new Map();
  const walk = (directory) => {
    const absolute = join(root, directory);
    const stat = lstatSync(absolute, { throwIfNoEntry: false });
    if (!stat || stat.isSymbolicLink() || !stat.isDirectory())
      throw new Error(
        `runtime output is not a regular directory: ${directory}`,
      );
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isSymbolicLink())
        throw new Error(`runtime output must not contain symlinks: ${path}`);
      if (entry.isDirectory()) walk(path);
      else if (!entry.isFile())
        throw new Error(`runtime output must contain regular files: ${path}`);
      else if (!entry.name.endsWith(".tsbuildinfo"))
        files.set(path, readFileSync(join(root, path)));
    }
  };
  for (const name of RUNTIME_PACKAGES)
    walk(`packages/${name}/${RUNTIME_OUTPUT}`);
  return files;
};

/** The harness bundle the export's own emit must write: the Contributor emit
 * over the runtime just built, with the operating contract composed by the
 * rule emitHarness uses. Computed before any write, so the local-terms screen
 * covers it and the spawned emit is judged against it. */
async function expectedHarnessBundle(root, floor) {
  // Imported after the build: a checkout that has never built has no dist for
  // scripts/lib/harness.mjs to load.
  const { composeHarnessInstruction, harnessInstallation } =
    await import("./lib/harness.mjs");
  const installation = harnessInstallation({ runtimeRoot: root });
  const surfaces = new Map();
  for (const file of installation.files)
    surfaces.set(
      file.path,
      file.path === INSTRUCTION_FILE
        ? composeHarnessInstruction(floor, file.contents)
        : file.contents,
    );
  surfaces.set(HARNESS_MANIFEST, json(installation.manifest));
  return { surfaces, snapshot: installation.runtimeSnapshot };
}

/** The export's own emit, run from its scripts and its copied runtime with the
 * export as its launchpad. It needs the export to be a Git top level and the
 * workspace links npm ci will recreate. */
const harnessInExport = (target, action) => {
  const result = spawnSync(process.execPath, ["scripts/harness.mjs", action], {
    cwd: target,
    env: exportEnvironment(),
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0)
    throw new Error(
      `the export's own harness ${action} failed (${result.status ?? result.error?.message}):\n${result.stdout ?? ""}${result.stderr ?? ""}`,
    );
  return result.stdout.trim();
};

/** The manifest-listed paths the fork's Git would ignore (its own .gitignore
 * seed or the host's excludes), so its first commit would lack them. */
const ignoredKitPaths = (target, paths) =>
  runGit(target, ["check-ignore", "-z", "--stdin"], {
    env: exportEnvironment(),
    input: paths.map((path) => `${path}\0`).join(""),
    trim: false,
    onFailure: (result) => {
      if (result.status === 1) return "";
      throw new Error(
        `git check-ignore failed in the export: ${failureOf(result)}`,
      );
    },
  })
    .split("\0")
    .filter(Boolean);

const rootReadme = (key, convention) =>
  `# ${defaultDocRelative(key)}\n\n${convention}\n`;

/** Export the kit of the running checkout's HEAD into `destination`; the kit
 * root is TOOL_ROOT, because the bundle prediction and the build load that
 * checkout's compiled packages, and `launchpad` is the one whose local-terms
 * list judges the texts. Refuses before any write to the destination (the
 * build first refreshes this checkout's ignored packages/*\/dist): a non-empty
 * or unreadable destination, a kit file absent at the commit, a pinned input
 * (package sources, project files, the build script, the emit closure) that
 * differs from HEAD, an installed development dependency that is not the
 * commit's pin, and a local-terms refusal. Then it writes the kit,
 * initializes the export's repository, refuses a kit file the fork's Git
 * would ignore, runs the export's own harness emit and check and refuses,
 * naming the path, if the emit's bytes differ from the bundle core's compiled
 * packages predicted; a refusal after the write leaves the destination for
 * inspection without KIT-MANIFEST.json. Returns what it wrote. */
export async function exportKit(
  destination,
  { license = "default", launchpad = TOOL_ROOT } = {},
) {
  const root = TOOL_ROOT;
  if (!["default", "none"].includes(license))
    throw new Error(`unknown license option: ${license}`);
  if (!hasPackageSources(root))
    throw new Error(
      "launchpad export builds the runtime from package sources, which this checkout lacks: a kit export carries only the compiled runtime; export from the core commit UPSTREAM.md names",
    );
  const target = checkDestination(destination);
  const commit = runGit(root, ["rev-parse", "HEAD"]);
  const { tag, nearest } = describeTag(root, commit);
  const forge = originTarget(root);
  const sources = readKitSources(root, commit, { license });
  const dirty = dirtyKitPathCount(root, sources);
  const pinned = dirtyPinnedInputs(root, commit);
  if (pinned.buildInputs.length || pinned.emit.length || pinned.added.length)
    throw new Error(
      `the export builds and emits from the commit, but the work tree differs from HEAD: ${[
        pinned.buildInputs.length &&
          `build inputs: ${pinned.buildInputs.sort().join(", ")}`,
        pinned.emit.length &&
          `harness emit scripts (the export's own emit runs the commit's copies): ${pinned.emit.sort().join(", ")}`,
        pinned.added.length &&
          `uncommitted compilable package files (including ignored paths): ${pinned.added.sort().join(", ")}`,
      ]
        .filter(Boolean)
        .join(
          "; ",
        )}. Commit or stash them (remove the uncommitted files), or export from a clean checkout of the commit.`,
    );
  const corePackage = JSON.parse(
    sources.get("package.json").bytes.toString("utf8"),
  );
  const coreLock = JSON.parse(
    sources.get("package-lock.json").bytes.toString("utf8"),
  );
  // The build runs the installed toolchain; the commit pins it. Every root
  // development dependency shapes the output (TypeScript the code, the Node
  // types the declarations), so each installed version must be the pin's.
  for (const name of Object.keys(corePackage.devDependencies ?? {})) {
    const pin = coreLock.packages?.[`node_modules/${name}`]?.version;
    const manifest = join(root, "node_modules", name, "package.json");
    const installed = existsSync(manifest)
      ? JSON.parse(readFileSync(manifest, "utf8")).version
      : null;
    if (!pin || installed !== pin)
      throw new Error(
        `the installed ${name} (${installed ?? "absent"}) is not the commit's pin (${pin ?? "unpinned"}); run npm ci so the runtime is the commit's build`,
      );
  }
  const packageJson = kitPackage(corePackage, { license });
  const lock = kitLockfile(coreLock, packageJson);
  const template = (name) =>
    sources.get(`${KIT_TEMPLATES}/${name}`).bytes.toString("utf8");
  // The runtime is the commit's build: the package sources equal HEAD, and the
  // build replaces dist atomically before the copy is read.
  atomicBuild(root);
  const runtime = readRuntime(root);
  const floor = template("CLAUDE.template.md");
  const bundle = await expectedHarnessBundle(root, floor);

  const kit = [];
  const seeds = [];
  const writes = [];
  const addKit = (path, bytes, mode = 0o644) => {
    const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes, "utf8");
    kit.push({ path, sha256: sha256Hex(buffer) });
    writes.push({ path, bytes: buffer, mode });
  };
  const addSeed = (path, bytes) => {
    seeds.push(path);
    writes.push({ path, bytes: Buffer.from(bytes, "utf8"), mode: 0o644 });
  };
  for (const [, source] of sources)
    if (!source.input) addKit(source.destination, source.bytes, source.mode);
  const bins = binTargets(sources);
  for (const [path, bytes] of runtime)
    addKit(path, bytes, bins.has(path) ? 0o755 : 0o644);
  addKit("package.json", json(packageJson));
  addKit("package-lock.json", json(lock));
  addKit("dotln.config.example.json", template("dotln.config.example.json"));
  if (license === "none")
    addKit(LICENSE_PENDING, template("pending-license.template.md"));
  // The harness bundle is written by the export's own emit after the kit
  // lands; every surface but the operating contract is a kit file, listed at
  // the bytes that emit must reproduce.
  const emitted = [...bundle.surfaces]
    .filter(([path]) => path !== INSTRUCTION_FILE)
    .map(([path, contents]) => ({
      path,
      sha256: sha256Hex(Buffer.from(contents, "utf8")),
    }));
  kit.push(...emitted);

  // A fork edits its front door, its ignore rules and its contract: seeds,
  // whose upstream sources stay kit files under scripts/kit for a later
  // revision to refresh (WO-077).
  addSeed("README.md", template("README.client.md"));
  addSeed(".gitignore", template("gitignore.template"));
  addSeed(INSTRUCTION_FILE, floor);
  addSeed(
    "AI-HARNESS-SECURITY.md",
    template("AI-HARNESS-SECURITY.template.md"),
  );
  // Root READMEs under instance roots are seeds; their templates stay kit
  // files under scripts/kit, so a convention change reaches a fork there.
  addSeed(
    defaultDocRelative("workstreams", "README.md"),
    template("workstream.template.md"),
  );
  addSeed(
    defaultDocRelative("docs", "repositories", "README.md"),
    template("repository-profile.template.md"),
  );
  addSeed(
    defaultDocRelative("workOrders", FIRST_ORDER),
    template("first-order.template.md"),
  );
  addSeed(
    defaultDocRelative("docs", "README.md"),
    [
      `# ${defaultDocRelative("docs")}`,
      "",
      "The document roots of this launchpad, at the default layout (`dotln.config.json`",
      "is absent). Each root's README states its convention; `UPSTREAM.md` at the",
      "repository root names the kit's commit and the upstream documents the kit",
      "points to.",
      "",
      ...Object.keys(SEEDED_ROOTS).map(
        (key) => `- \`${defaultDocRelative(key)}/\``,
      ),
      `- \`${defaultDocRelative("workOrders")}/\` — one scope authority per order, WO-NNN-<slug>.md, with **Model:** and **Effort:** as its leading metadata; its README is the index \`npm run work-orders -- index\` generates at the first lifecycle transition (activate)`,
      `- \`${defaultDocRelative("lineage")}/\` — idea-ledger.md, an append-only idea history; its README is generated by \`node scripts/lineage.mjs index\` once a ledger exists`,
      `- \`${defaultDocRelative("intake")}/\` — ignored, single-copy raw material`,
      `- \`${defaultDocRelative("workstreams")}/\` — one document per outcome; the README holds the convention and template`,
      `- \`${defaultDocRelative("docs", "repositories")}/\` — one profile per registered repository; the README holds the convention and template`,
      "",
    ].join("\n"),
  );
  for (const [key, convention] of Object.entries(SEEDED_ROOTS))
    addSeed(defaultDocRelative(key, "README.md"), rootReadme(key, convention));
  // The generated index reads the proposed sequence at every lifecycle
  // transition; the first order is this instance's whole proposed order.
  addSeed(
    defaultDocRelative("planning", "sequence.md"),
    [
      "# Proposed work-order sequence",
      "",
      "The operator-authored sequence between the markers is the single editable",
      "input to the generated work-order index. It grants no activation authority.",
      "Two entries between blank lines are a lane pair; the entries after the last",
      "pair run one at a time.",
      "",
      "<!-- dotln-work-order-sequence:start -->",
      "- WO-001 — Environment truth for this launchpad",
      "<!-- dotln-work-order-sequence:end -->",
      "",
    ].join("\n"),
  );
  addSeed(defaultDocRelative("intake", ".gitkeep"), "");
  // scripts/lib/authority-grants.mjs reads the committed registry with no
  // optional fallback; the empty registry is instance authority data.
  addSeed("packages/skeleton/loadouts/grants.json", "[]\n");
  const upstream = upstreamDocument(root, commit, {
    tag,
    nearest,
    target: forge,
    license,
    kit: [...kit, { path: UPSTREAM }],
    seeds: [...seeds, "AGENTS.md"],
  });
  addKit(UPSTREAM, upstream);
  const manifest = kitManifest({ commit, tag, files: kit });
  const manifestBytes = Buffer.from(json(manifest), "utf8");

  // The private list never leaves this process; a match refuses the export
  // before any write, reported by file and line. The harness bundle is
  // screened at the bytes the export's emit must reproduce; the composed
  // operating contract covers its floor, so the floor seed is not screened
  // twice.
  const surfaces = [];
  for (const { path, bytes } of [
    ...writes.filter(({ path }) => path !== INSTRUCTION_FILE),
    ...[...bundle.surfaces].map(([path, contents]) => ({
      path,
      bytes: Buffer.from(contents, "utf8"),
    })),
    { path: KIT_MANIFEST, bytes: manifestBytes },
  ]) {
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      continue;
    }
    surfaces.push({ name: path, text });
  }
  const terms = checkLocalTerms(launchpad, surfaces);

  mkdirSync(target, { recursive: true });
  for (const { path, bytes, mode } of writes) {
    const file = join(target, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, bytes, { mode });
  }
  symlinkSync(INSTRUCTION_FILE, join(target, "AGENTS.md"));
  // From here a refusal leaves the written destination for inspection; the
  // absent KIT-MANIFEST.json marks it.
  try {
    // The harness commands run only at a physical Git top level, and the
    // ascent in scripts/lib/config.mjs stops at this .git, so the export is
    // its own launchpad from here on; the fork's first commit is its own.
    runGit(target, ["init", "-q", "-b", "main"], { env: exportEnvironment() });
    if (
      !lstatSync(join(target, ".git"), { throwIfNoEntry: false })?.isDirectory()
    )
      throw new Error("git init left the export without its own repository");
    const ignored = ignoredKitPaths(
      target,
      manifest.files.map((file) => file.path),
    );
    if (ignored.length)
      throw new Error(
        `the fork's Git would ignore ${ignored.length} kit ${ignored.length === 1 ? "file" : "files"}, so its first commit would lack them: ${ignored.slice(0, 5).join(", ")}${ignored.length > 5 ? ", ..." : ""}. A host excludes file (core.excludesFile) is the usual cause; remove its pattern or negate it in the export's .gitignore`,
      );
    // The workspace links npm ci will recreate, so the export's own emit can
    // import its runtime before the fork installs anything.
    mkdirSync(join(target, "node_modules/@dotln"), { recursive: true });
    for (const workspace of KIT_WORKSPACES)
      symlinkSync(
        `../../${workspace}`,
        join(target, "node_modules/@dotln", basename(workspace)),
      );
    harnessInExport(target, "emit");
    for (const [path, contents] of bundle.surfaces) {
      const file = join(target, path);
      if (!lstatSync(file, { throwIfNoEntry: false })?.isFile())
        throw new Error(
          `the export's harness emit wrote no regular file at a predicted surface: ${path}`,
        );
      if (readFileSync(file, "utf8") !== contents)
        throw new Error(
          `the export's harness emit differs from the bundle core's compiled packages predicted: ${path}`,
        );
    }
    // The export verifies itself: its own check over the snapshot its emit
    // installed and every generated surface.
    harnessInExport(target, "check");
  } catch (error) {
    throw new Error(
      `${error.message}; the partial export at ${target} has no ${KIT_MANIFEST}: remove it before exporting again`,
    );
  }
  writeFileSync(join(target, KIT_MANIFEST), manifestBytes);
  return {
    destination: target,
    commit,
    tag,
    nearest,
    files: manifest.files.length,
    runtimeFiles: runtime.size,
    harnessSurfaces: emitted.length,
    snapshot: bundle.snapshot,
    seeds: [...seeds, "AGENTS.md"],
    surfaces: surfaces.length,
    terms: terms.status,
    dirty,
  };
}

if (isMainModule(import.meta.url)) {
  try {
    const [action, destination, ...rest] = process.argv.slice(2);
    let license = "default";
    for (let index = 0; index < rest.length; index += 2) {
      if (rest[index] === "--license" && rest[index + 1] === "none")
        license = "none";
      else throw new Error("usage: launchpad export <dir> [--license none]");
    }
    if (action !== "export" || !destination)
      throw new Error("usage: launchpad export <dir> [--license none]");
    // The kit is the running checkout's commit; the list is the launchpad's.
    const result = await exportKit(destination, {
      license,
      launchpad: findLaunchpad(),
    });
    console.log(
      `Exported the DotLn kit of ${result.commit} (${result.tag ? `tag ${result.tag}` : "untagged"}) to ${result.destination}: ${result.files} kit files in ${KIT_MANIFEST}, ${result.seeds.length} instance seeds.`,
    );
    console.log(
      `runtime: ${result.runtimeFiles} compiled files built from the commit's package sources; harness bundle: ${result.harnessSurfaces + 1} surfaces emitted and checked inside the export, ${result.harnessSurfaces} manifest-listed (${INSTRUCTION_FILE}'s block is checked through ${HARNESS_MANIFEST}); snapshot ${result.snapshot}.`,
    );
    console.log(
      `local-terms list: ${result.terms}${result.terms === "present" ? ` (${result.surfaces} texts checked)` : "; no text was checked against a local-terms list"}`,
    );
    if (result.dirty)
      console.log(
        `advisory: ${result.dirty} kit ${result.dirty === 1 ? "path differs" : "paths differ"} from HEAD in the work tree; the export carries commit ${result.commit}, not those changes.`,
      );
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
