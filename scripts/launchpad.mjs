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
  CONFIG_FILENAME,
  ROOT_KEYS,
  loadConfig,
  validateConfig,
  defaultDocRelative,
  docRelative,
  findLaunchpad,
} from "./lib/config.mjs";
import {
  describeTag,
  failureOf,
  readGitObjects,
  runGit as ordinaryRunGit,
  runGitPathList as ordinaryRunGitPathList,
} from "./lib/git.mjs";
// Export provenance names original objects, independent of local replacements.
const runGit = (root, args, options) =>
  ordinaryRunGit(root, ["--no-replace-objects", ...args], options);
const runGitPathList = (root, args, options) =>
  ordinaryRunGitPathList(root, ["--no-replace-objects", ...args], options);
import { parseGitHubTarget } from "./lib/github-repository.mjs";
import { json, sha256Hex } from "./lib/helpers.mjs";
import { isMainModule } from "./lib/paths.mjs";
import {
  hasPackageSources,
  runtimeEntryName,
} from "../packages/skeleton/src/runtime-inputs.mjs";
import { checkLocalTerms } from "./lib/terms.mjs";
import {
  buildHashOf,
  manifestBuildHash,
  receiptPath,
  resolveReceipt,
  writeReceipt,
} from "./lib/siblings.mjs";
import { writeRegistry } from "./siblings.mjs";
import { atomicBuild } from "./build.mjs";
import {
  inspectLedger,
  renderIndex as renderLineageIndex,
} from "./lineage.mjs";
import { spawnSync } from "node:child_process";
import {
  closeSync,
  constants,
  existsSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, posix, resolve } from "node:path";
import { randomUUID } from "node:crypto";

export { manifestBuildHash } from "./lib/siblings.mjs";

export const KIT_MANIFEST = "KIT-MANIFEST.json";
// The manifest an update plans, written beside the current one before the
// first kit write and removed after the last, so a retry after an interrupted
// update knows which bytes the interrupted run wrote.
export const KIT_MANIFEST_PENDING = "KIT-MANIFEST.pending.json";
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
// and the operator console. The browser-evidence adapter stays separate.
export const RUNTIME_PACKAGES = Object.freeze([
  "kernel",
  "compiler",
  "skeleton",
  "console",
]);
// The compiled output a runtime package ships, relative to its directory.
export const RUNTIME_OUTPUT = "dist/src";
export const RUNTIME_TEST_OUTPUT = "dist/test";
export const TEST_FIXTURE_TREES = Object.freeze([
  "packages/kernel/test/fixtures",
  "packages/compiler/fixtures",
  "packages/skeleton/fixtures",
]);
export const TEST_SUPPORT_FILES = Object.freeze([
  "packages/skeleton/test/control-beacon-cli.fixture-inputs.json",
  ".prettierignore",
  ".prettierrc.json",
  "corpus/harness/id-corpus-lib.mjs",
  "corpus/harness/wo101-support.mjs",
  "corpus/harness/wo101-id-corpus.test.mjs",
  "corpus/manifests/WO-101.json",
  "corpus/fixtures/ids/stable-hash-vectors.jsonl",
  "corpus/fixtures/ids/command-id-vectors.jsonl",
  "corpus/mutation/enumerate.mjs",
  "corpus/mutation/mutate.mjs",
  "corpus/mutation/wo108-selftest.test.mjs",
]);
// The workspaces the kit carries, each with its node_modules link in the
// lockfile: the build-free Beacon workspace and the compiled packages.
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
  "scripts/lib/build-freshness.mjs",
  "scripts/lib/gate-reuse.mjs",
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
  "scripts/lib/harness-instruction.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/helpers.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/terms.mjs",
  "scripts/lib/validation.mjs",
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
  "packages/skeleton/src/runtime-inputs.mjs",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/writer-teardown.mjs",
]);

/** The kit allowlist. Trees and files are repository paths; documents are
 * [root key, ...segments], read through the kit root's configuration and
 * written at the kit's default layout. Instance files are never here. */
export const KIT_FILES = Object.freeze({
  trees: Object.freeze(["scripts", "packages/beacons", ...TEST_FIXTURE_TREES]),
  files: Object.freeze([
    ...TEST_SUPPORT_FILES,
    ...BUILD_FREE_MODULES,
    ...RUNTIME_PACKAGES.map((name) => `packages/${name}/package.json`),
  ]),
  excluded: Object.freeze([
    "scripts/fixtures/wo138-local-role-qualification.json",
    "scripts/test-runner.test.mjs",
    "scripts/test-gate-deadlines.mjs",
    "scripts/test-host-guard.test.mjs",
    "scripts/test-host-guard.test.fixture-inputs.json",
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
    ["releases", "tag-manifest.template.json"],
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
  "budgets.template.json",
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
      .filter(
        (path) =>
          KIT_FILES.trees.some((tree) => path.startsWith(`${tree}/`)) &&
          !KIT_FILES.excluded.includes(path),
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
  { tag, nearest, target, license, kit, seeds, sources, markdownLinks },
) => {
  // owner/repo@commit path, the form the repository-profile references use.
  const slug = target ? target.selector.split("/").slice(1).join("/") : null;
  const pointer = (path) =>
    slug ? `\`${slug}@${commit.slice(0, 12)} ${path}\`` : `\`${path}\``;
  const productRoot = docRelative(root, "product");
  const carried = new Set(kit.map((file) => file.path));
  const available = new Set([...carried, ...seeds]);
  const availablePath = (path) =>
    available.has(path) ||
    [...available].some((file) => file.startsWith(`${path}/`));
  const linked = new Map();
  for (const [sourcePath, source] of sources) {
    if (
      !KIT_FILES.documents.some(
        ([key, ...parts]) => docRelative(root, key, ...parts) === sourcePath,
      ) ||
      !sourcePath.endsWith(".md")
    )
      continue;
    for (const { href } of markdownLinks(
      kitDocumentBytes(source).toString("utf8"),
    )) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\/|^#/iu.test(href)) continue;
      const linkPath = decodeURIComponent(href.split(/[?#]/u)[0]);
      if (!linkPath) continue;
      const destination = posix.normalize(
        posix.join(posix.dirname(source.destination), linkPath),
      );
      if (availablePath(destination)) continue;
      const original = posix.normalize(
        posix.join(posix.dirname(sourcePath), linkPath),
      );
      linked.set(
        original,
        `referenced by \`${source.destination}\`; not carried in this instance`,
      );
    }
  }
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
    ...linked,
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
  const presentPath = (path) =>
    present.has(path) ||
    [...present].some((file) => file.startsWith(`${path}/`));
  const pointers = [
    ...new Map(
      candidates.filter(([path]) => presentPath(path) || linked.has(path)),
    ).entries(),
  ];
  // [label, prefixes, what the group is]; a file outside every group is listed
  // on its own line.
  const groups = [
    [
      "`scripts/**`",
      ["scripts/"],
      "byte-identical to the commit except excluded core qualification and runner-fixtures tests",
    ],
    [
      "`packages/beacons/**`",
      ["packages/beacons/"],
      "byte-identical to the commit",
    ],
    ...RUNTIME_PACKAGES.map((name) => [
      `\`packages/${name}/package.json\`, \`packages/${name}/dist/{src,test}/**\``,
      [
        `packages/${name}/package.json`,
        `packages/${name}/${RUNTIME_OUTPUT}/`,
        `packages/${name}/${RUNTIME_TEST_OUTPUT}/`,
      ],
      `the compiled \`@dotln/${name}\` runtime and tests: \`package.json\` byte-identical to the commit, \`dist/{src,test}/\` built from the commit's sources at export time`,
    ]),
    [
      "test fixtures",
      TEST_FIXTURE_TREES.map((tree) => `${tree}/`),
      "byte-identical fixture data and executable doubles from the commit",
    ],
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
    "compiled runtime and tests under `packages/<name>/dist/{src,test}/` were built at export time from",
    "the work tree after its package sources, project files and build script were",
    "verified equal to the commit; and the harness bundle was emitted inside this",
    "export from that runtime and verified against the bundle core's compiled",
    "packages predicted. No other kit text was read from a work tree.",
    "Carried operating documents rebase their harness-security links to the instance's",
    "root `AI-HARNESS-SECURITY.md`; core-only section fragments are omitted there.",
    "An update can retain locally modified files at their prior manifest hashes;",
    "its dated output lists those exceptions to this source commit.",
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
    ...pointers.map(
      ([path, why]) =>
        `- ${pointer(path)} — ${why}${presentPath(path) ? "" : "; this referenced path is also absent at the pinned core commit"}`,
    ),
    "",
  ].join("\n");
};

// The sanitized instance security record lives at the repository root and has
// instance-owned headings. Rebase the carried documents' inline links only;
// retain all other source bytes, including the marked goal-rule blocks.
const kitDocumentBytes = (source) => {
  if (
    !KIT_FILES.documents.some(
      ([key, ...parts]) =>
        defaultDocRelative(key, ...parts) === source.destination,
    ) ||
    !source.destination.endsWith(".md")
  )
    return source.bytes;
  const security = posix.relative(
    posix.dirname(source.destination),
    "AI-HARNESS-SECURITY.md",
  );
  return Buffer.from(
    source.bytes
      .toString("utf8")
      .replace(
        /\]\((?:\.\.\/)*AI-HARNESS-SECURITY\.md(?:#[^\s)]*)?\)/gu,
        `](${security})`,
      ),
  );
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
 * packages/<name>/dist/src and dist/test of each runtime package, read from the build
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
      if (!runtimeEntryName(entry.name)) continue;
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
    for (const output of [RUNTIME_OUTPUT, RUNTIME_TEST_OUTPUT])
      walk(`packages/${name}/${output}`);
  return files;
};

/** The harness bundle the export's own emit must write: the Contributor emit
 * over the runtime just built, with the operating contract composed by the
 * rule emitHarness uses. Computed before any write, so the local-terms screen
 * covers it and the spawned emit is judged against it. */
async function expectedHarnessBundle(root, floor, runtimePackageFiles) {
  // Imported after the build: a checkout that has never built has no dist for
  // scripts/lib/harness.mjs to load.
  const { composeHarnessInstruction, harnessInstallation } =
    await import("./lib/harness.mjs");
  const installation = harnessInstallation({
    runtimeRoot: root,
    runtimePackageFiles,
  });
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

/** Prepare the commit's complete kit in memory, including its runtime and
 * predicted harness bundle. Export and update share the same pinned-input
 * and local-terms checks; neither writes a destination during preparation. */
export async function prepareKit({
  license = "default",
  launchpad = TOOL_ROOT,
  preflight = () => {},
} = {}) {
  const root = TOOL_ROOT;
  if (!["default", "none"].includes(license))
    throw new Error(`unknown license option: ${license}`);
  if (!hasPackageSources(root))
    throw new Error(
      "launchpad export builds the runtime from package sources, which this checkout lacks: a kit export carries only the compiled runtime; export from the core commit UPSTREAM.md names",
    );
  const commit = runGit(root, ["rev-parse", "HEAD"]);
  const { tag, nearest } = describeTag(root, commit);
  const forge = originTarget(root);
  const sources = readKitSources(root, commit, { license });
  preflight(sources);
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
    if (!source.input)
      addKit(source.destination, kitDocumentBytes(source), source.mode);
  const bins = binTargets(sources);
  for (const [path, bytes] of runtime)
    addKit(path, bytes, bins.has(path) ? 0o755 : 0o644);
  addKit("package.json", json(packageJson));
  addKit("package-lock.json", json(lock));
  addKit("dotln.config.example.json", template("dotln.config.example.json"));
  if (license === "none")
    addKit(LICENSE_PENDING, template("pending-license.template.md"));
  const bundle = await expectedHarnessBundle(root, floor, writes);
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
  addSeed(
    "dotln.config.json",
    json({ version: 1, release: { displayName: "DotLn-Enterprise-Starter" } }),
  );
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
      "The document roots of this launchpad use the default layout; its instance-owned",
      "`dotln.config.json` can override them. Each root's README states its convention; `UPSTREAM.md` at the",
      "repository root names the kit's commit and the upstream documents the kit",
      "points to.",
      "",
      ...Object.keys(SEEDED_ROOTS).map(
        (key) => `- \`${defaultDocRelative(key)}/\``,
      ),
      `- \`${defaultDocRelative("workOrders")}/\` — one scope authority per order, WO-NNN-<slug>.md, with **Model:** and **Effort:** as its leading metadata; its README is the index \`npm run work-orders -- index\` generates at the first lifecycle transition (activate)`,
      `- \`${defaultDocRelative("lineage")}/\` — idea-ledger.md, an append-only idea history; its README is the index the export seeds and \`node scripts/lineage.mjs index\` regenerates after ledger edits; an older export generates it on its update branch or in its first steps, and bootstrap never writes it`,
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
  addSeed(
    defaultDocRelative("planning", "followups.json"),
    json({ schemaVersion: 1, entries: [] }),
  );
  addSeed(
    defaultDocRelative("control", "doc-ceilings.json"),
    json({ schemaVersion: 1, documents: {} }),
  );
  addSeed(
    defaultDocRelative("control", "doc-baseline.json"),
    json({ schemaVersion: 1, products: {}, dispatches: {}, links: [] }),
  );
  addSeed(
    defaultDocRelative("control", "budgets.json"),
    template("budgets.template.json"),
  );
  const initialLedger =
    "# Idea ledger\n\nStatuses: `adopted`, `preserved`, `raw`, `superseded`, `transformed`, `rejected`, `deferred`, `candidate`, `open`, `specified`.\n\nInsert this instance's dated sessions below, newest first.\n";
  addSeed(defaultDocRelative("lineage", "idea-ledger.md"), initialLedger);
  addSeed(
    defaultDocRelative("lineage", "README.md"),
    renderLineageIndex(inspectLedger(initialLedger), {
      resolutions: false,
      inspirations: false,
    }),
  );
  // scripts/lib/authority-grants.mjs reads the committed registry with no
  // optional fallback; the empty registry is instance authority data.
  addSeed("packages/skeleton/loadouts/grants.json", "[]\n");
  // Verification and preview must load without an install. Only export
  // preparation (which already requires the pinned toolchain) parses Markdown.
  const { markdownLinks } = await import("./docs-check.mjs");
  const upstream = upstreamDocument(root, commit, {
    tag,
    nearest,
    target: forge,
    license,
    kit: [...kit, { path: UPSTREAM }],
    seeds: [...seeds, "AGENTS.md"],
    sources,
    markdownLinks,
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

  return {
    manifest,
    manifestBytes,
    writes,
    bundle,
    summary: {
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
    },
  };
}

/** The destination's own repository name, read from its origin remote when
 * it has one: an update into a clone or worktree named otherwise still
 * records its receipt under the declared sibling. */
const destinationNames = (target) => {
  if (!lstatSync(join(target, ".git"), { throwIfNoEntry: false })) return [];
  const url = runGit(target, ["config", "--get", "remote.origin.url"], {
    env: exportEnvironment(),
    onFailure: () => "",
  });
  try {
    return url ? [parseGitHubTarget(url).selector.split("/").at(-1)] : [];
  } catch {
    return [];
  }
};

/** The receipt that closes a complete export or update, and the registry page
 * regenerated from it: written when the destination resolved to a declared
 * sibling, otherwise the reason none is. The manifest is already in place, so
 * a failure here names the complete command rather than a partial one. */
const closeWithReceipt = (launchpad, resolved, fields, command, target) => {
  if (!resolved.sibling)
    return { path: null, reason: resolved.reason, registry: null };
  let receipt;
  try {
    receipt = writeReceipt(launchpad, { sibling: resolved.sibling, ...fields });
  } catch (error) {
    throw new Error(
      `the ${command} at ${target} is complete, but its sibling receipt was not written: ${error.message}`,
    );
  }
  try {
    return { ...receipt, registry: writeRegistry(launchpad) };
  } catch (error) {
    throw new Error(
      `the ${command} at ${target} is complete and its receipt ${receipt.path} is written, but the sibling registry was not regenerated: ${error.message}`,
    );
  }
};

/** Reproduce and check the predicted bundle inside an exported tree. Existing
 * instances keep their seed floor; only its generated block must match. */
export async function verifyExportTree(
  target,
  bundle,
  { instructionBlock = false } = {},
) {
  // The workspace links npm ci will recreate, so the export's own emit can
  // import its runtime before the fork installs anything.
  mkdirSync(join(target, "node_modules/@dotln"), { recursive: true });
  for (const workspace of KIT_WORKSPACES) {
    const link = join(target, "node_modules/@dotln", basename(workspace));
    if (lstatSync(link, { throwIfNoEntry: false })) continue;
    symlinkSync(`../../${workspace}`, link);
  }
  const { harnessInstructionBlock } = await import("./lib/harness.mjs");
  harnessInExport(target, "emit");
  for (const [path, contents] of bundle.surfaces) {
    const file = join(target, path);
    if (!lstatSync(file, { throwIfNoEntry: false })?.isFile())
      throw new Error(
        `the export's harness emit wrote no regular file at a predicted surface: ${path}`,
      );
    const actual = readFileSync(file, "utf8");
    const compare =
      instructionBlock && path === INSTRUCTION_FILE
        ? harnessInstructionBlock
        : (text) => text;
    if (compare(actual) !== compare(contents))
      throw new Error(
        `the export's harness emit differs from the bundle core's compiled packages predicted: ${path}`,
      );
  }
  // The export verifies itself: its own check over the snapshot its emit
  // installed and every generated surface.
  harnessInExport(target, "check");
}

/** Export into an empty destination, initialize its repository and run its
 * own harness emit/check. A post-write failure leaves a partial export for
 * inspection without a manifest; a receipt failure leaves a complete one. */
export async function exportKit(destination, options = {}) {
  const target = checkDestination(destination);
  const { launchpad = TOOL_ROOT } = options;
  // Resolved before the build and before any write, so a malformed sibling
  // declaration refuses here and never after a complete export.
  const resolved = resolveReceipt(launchpad, target);
  const { manifest, manifestBytes, writes, bundle, summary } =
    await prepareKit(options);
  const buildHash = buildHashOf(bundle.snapshot);
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
    await verifyExportTree(target, bundle);
  } catch (error) {
    throw new Error(
      `${error.message}; the partial export at ${target} has no ${KIT_MANIFEST}: remove it before exporting again`,
    );
  }
  writeFileSync(join(target, KIT_MANIFEST), manifestBytes);
  // The receipt closes the manifest step: once the manifest is written the
  // export is complete, and a destination named as a declared sibling leaves
  // the record of what it carries under the launchpad's evidence root.
  const receipt = closeWithReceipt(
    launchpad,
    resolved,
    { coreCommit: manifest.commit, manifestBytes, buildHash },
    "export",
    target,
  );
  return { destination: target, ...summary, receipt, bundle };
}

export const KIT_ACTIONS = "scripts/kit/KIT-ACTIONS.json";
const HEX_64 = /^[0-9a-f]{64}$/u;
const object = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const contained = (path) =>
  typeof path === "string" &&
  path.length > 0 &&
  !/[\\\x00-\x1f:]/u.test(path) &&
  path.split("/").every((part) => part && ![".", "..", ".git"].includes(part));
const overlaps = (left, right) =>
  left === right ||
  left.startsWith(`${right}/`) ||
  right.startsWith(`${left}/`);
const knownKeys = (value, keys, label) => {
  if (!object(value) || Object.keys(value).some((key) => !keys.includes(key)))
    throw new Error(
      `${label}: expected an object with only ${keys.join(", ")}`,
    );
};
// A manifest can retain removed kit paths, but cannot claim instance-owned
// roots, the operating contract, local settings, or an arbitrary destination.
const kitPath = (path) =>
  contained(path) &&
  ([
    UPSTREAM,
    LICENSE_PENDING,
    ...LICENSE_FILES,
    "package.json",
    "package-lock.json",
    "dotln.config.example.json",
    ...KIT_FILES.files,
    ...KIT_FILES.documents.map(([key, ...parts]) =>
      defaultDocRelative(key, ...parts),
    ),
    HARNESS_MANIFEST,
    ".claude/settings.json",
  ].includes(path) ||
    [
      ...KIT_FILES.trees,
      ...RUNTIME_PACKAGES.flatMap((name) =>
        [RUNTIME_OUTPUT, RUNTIME_TEST_OUTPUT].map(
          (output) => `packages/${name}/${output}`,
        ),
      ),
      ".claude/hooks",
      ".claude/skills",
      ".claude/agents",
      ".agents/skills",
      ".codex",
    ].some((prefix) => path.startsWith(`${prefix}/`)));

/** Inspect every ancestor without following a destination symlink. Missing
 * suffixes are allowed for additions; existing parents must be directories. */
const destinationStat = (root, path) => {
  if (!contained(path)) throw new Error(`invalid destination path: ${path}`);
  const parts = path.split("/");
  for (let index = 0; index < parts.length; index++) {
    const file = join(root, ...parts.slice(0, index + 1));
    let stat;
    try {
      stat = lstatSync(file, { throwIfNoEntry: false });
    } catch (error) {
      throw new Error(`cannot inspect ${file}: ${error.code}`);
    }
    if (!stat) return undefined;
    if (
      stat.isSymbolicLink() ||
      (index < parts.length - 1 && !stat.isDirectory())
    )
      throw new Error(
        `destination is not a regular ${index < parts.length - 1 ? "directory" : "file"}: ${file}`,
      );
    if (index === parts.length - 1) return stat;
  }
};
const readDestination = (root, path) => {
  const file = join(root, path);
  if (!destinationStat(root, path)?.isFile())
    throw new Error(`cannot read regular file: ${file}`);
  let fd;
  try {
    fd = openSync(
      file,
      constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW,
    );
    if (!fstatSync(fd).isFile()) throw new Error("not a regular file");
    return readFileSync(fd);
  } catch (error) {
    throw new Error(`cannot read ${file}: ${error.code ?? error.message}`);
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
};
const readJson = (bytes, path) => {
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error(`malformed JSON: ${path}`);
  }
};

/** The manifest an interrupted update planned, or null when none is pending. */
export function readPendingManifest(destination) {
  const root = resolve(destination);
  if (!destinationStat(root, KIT_MANIFEST_PENDING)) return null;
  return readManifestFile(root, KIT_MANIFEST_PENDING);
}

export function readPriorManifest(destination) {
  const root = resolve(destination);
  if (!lstatSync(root, { throwIfNoEntry: false })?.isDirectory())
    throw new Error(`update destination is not a regular directory: ${root}`);
  return readManifestFile(root, KIT_MANIFEST);
}

/** Verify carried compiled code before running it. Other kit edits belong to
 * the instance and are advisory, including missing or nonregular files. */
export function verifyKit(root = process.cwd()) {
  root = resolve(root);
  const manifest = readPriorManifest(root);
  let differing = 0;
  for (const entry of manifest.files) {
    let matches = false;
    try {
      matches = sha256Hex(readDestination(root, entry.path)) === entry.sha256;
    } catch {
      // An unreadable listed file differs just as a changed file does.
    }
    if (matches) continue;
    if (/^packages\/[^/]+\/dist\//u.test(entry.path))
      throw new Error(`kit runtime differs from the manifest: ${entry.path}`);
    differing++;
  }
  if (differing)
    console.log(`kit: ${differing} kit files differ from the manifest`);
  console.log(
    `kit: ${manifest.files.length - differing} files verified at ${manifest.commit}`,
  );
  return {
    commit: manifest.commit,
    verified: manifest.files.length - differing,
    differing,
  };
}

const readManifestFile = (root, name) => {
  return readManifest(readDestination(root, name), join(root, name));
};

// Disk manifests and revision previews accept exactly the same schema.
const readManifest = (bytes, label) => {
  const prior = readJson(bytes, label);
  knownKeys(prior, ["schemaVersion", "commit", "tag", "files"], label);
  if (
    prior.schemaVersion !== KIT_MANIFEST_SCHEMA_VERSION ||
    typeof prior.commit !== "string" ||
    !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(prior.commit ?? "") ||
    !(
      prior.tag === null ||
      (typeof prior.tag === "string" &&
        prior.tag.length &&
        !/[\x00-\x1f]/u.test(prior.tag))
    ) ||
    !Array.isArray(prior.files) ||
    !prior.files.length
  )
    throw new Error(`malformed prior manifest: ${label}`);
  const paths = new Set();
  for (const entry of prior.files) {
    knownKeys(entry, ["path", "sha256"], label);
    if (
      !kitPath(entry.path) ||
      typeof entry.sha256 !== "string" ||
      !HEX_64.test(entry.sha256 ?? "") ||
      paths.has(entry.path)
    )
      throw new Error(
        `malformed prior manifest entry in ${label}: ${entry.path}`,
      );
    paths.add(entry.path);
  }
  for (const path of paths) {
    const parts = path.split("/");
    while (parts.pop() && parts.length)
      if (paths.has(parts.join("/")))
        throw new Error(`overlapping paths in ${label}: ${path}`);
  }
  return prior;
};

/** Plan the whole update before writing. A prior file the incoming kit
 * still carries must be present, and every present path must be a readable
 * regular file; otherwise the plan refuses as an input failure. A file whose
 * bytes already equal the incoming kit's, or equal what the pending manifest
 * of an interrupted update planned for it, is kept: never refused, and the
 * manifest records the incoming hash. A readable local edit is a refusal
 * retained in the plan. A dropped prior path that is already absent counts as
 * removed, and a path the interrupted update dropped that the incoming kit
 * carries again is added, so a retry completes at any later commit. */
export function planUpdate(prior, next, directory, pending = null) {
  const previous = new Map(prior.files.map((entry) => [entry.path, entry]));
  const following = new Map(next.files.map((entry) => [entry.path, entry]));
  const planned = new Map(
    (pending?.files ?? []).map((entry) => [entry.path, entry.sha256]),
  );
  const plan = [];
  for (const path of [
    ...new Set([...previous.keys(), ...following.keys()]),
  ].sort()) {
    if (!kitPath(path)) throw new Error(`invalid kit path: ${path}`);
    const old = previous.get(path);
    const incoming = following.get(path);
    const stat = destinationStat(directory, path);
    // Absence is expected only where the interrupted update removed the file.
    const dropped = pending !== null && !planned.has(path);
    if (!stat && old && incoming && !dropped)
      throw new Error(`cannot read regular file: ${join(directory, path)}`);
    const current = stat ? sha256Hex(readDestination(directory, path)) : null;
    const kept =
      current !== null &&
      (current === incoming?.sha256 ||
        current === old?.sha256 ||
        current === planned.get(path));
    let entry;
    if (!old)
      entry =
        stat && !kept
          ? { path, kind: "refuse", reason: "instance-owned collision" }
          : { path, kind: "add" };
    else if (!stat)
      entry = incoming
        ? { path, kind: "add" }
        : { path, kind: "remove", absent: true };
    else if (!kept)
      entry = {
        path,
        kind: "refuse",
        reason: "locally modified",
        retained: old,
      };
    else entry = { path, kind: incoming ? "replace" : "remove" };
    // Byte comparisons distinguish revision changes without altering the
    // mutation kinds or retained hashes the core update applies.
    plan.push({
      ...entry,
      unchanged: current === (incoming?.sha256 ?? null),
      upstreamUnchanged: !!old && old.sha256 === incoming?.sha256,
    });
  }
  return plan;
}

/** Action declarations are structured kit data, never commands parsed out of
 * prose. Phrase changes are deliberately limited to the instance contract. */
export function readKitActions(bytes) {
  const document = readJson(bytes, KIT_ACTIONS);
  knownKeys(document, ["schemaVersion", "actions"], KIT_ACTIONS);
  if (document.schemaVersion !== 1 || !Array.isArray(document.actions))
    throw new Error(`malformed ${KIT_ACTIONS}`);
  const ids = new Set();
  for (const action of document.actions) {
    const fields = {
      "rename-root": ["root", "from", "to"],
      "add-config-field": ["field", "value"],
      "change-phrase": ["from", "to"],
    };
    if (!object(action) || !Object.hasOwn(fields, action.kind))
      throw new Error(`${KIT_ACTIONS}: undeclared action kind ${action?.kind}`);
    knownKeys(
      action,
      ["id", "date", "kind", ...fields[action.kind]],
      KIT_ACTIONS,
    );
    if (
      typeof action.id !== "string" ||
      typeof action.date !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(action.id) ||
      ids.has(action.id) ||
      !/^\d{4}-\d{2}-\d{2}$/u.test(action.date ?? "") ||
      !Number.isFinite(Date.parse(action.date)) ||
      new Date(action.date).toISOString().slice(0, 10) !== action.date
    )
      throw new Error(`${KIT_ACTIONS}: invalid action id/date: ${action.id}`);
    ids.add(action.id);
    if (
      action.kind === "rename-root" &&
      (!ROOT_KEYS.includes(action.root) ||
        !contained(action.from) ||
        !contained(action.to) ||
        overlaps(action.from, action.to))
    )
      throw new Error(`${KIT_ACTIONS}: invalid rename-root ${action.id}`);
    if (
      action.kind === "add-config-field" &&
      (typeof action.field !== "string" ||
        !/^[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)*$/u.test(
          action.field,
        ) ||
        action.field
          .split(".")
          .some((key) =>
            ["__proto__", "prototype", "constructor"].includes(key),
          ) ||
        !Object.hasOwn(action, "value"))
    )
      throw new Error(`${KIT_ACTIONS}: invalid add-config-field ${action.id}`);
    if (
      action.kind === "change-phrase" &&
      (typeof action.from !== "string" ||
        !action.from ||
        typeof action.to !== "string" ||
        !action.to ||
        action.from === action.to)
    )
      throw new Error(`${KIT_ACTIONS}: invalid change-phrase ${action.id}`);
  }
  return document.actions;
}

const writeReplacement = (root, path, bytes, mode = 0o644) => {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.dotln-update-${randomUUID()}`;
  try {
    writeFileSync(temporary, bytes, { flag: "wx", mode });
    renameSync(temporary, file);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
};

/** Preflight every declared instance action, then return its mutations. The
 * caller applies this plan only after the kit plan has also been validated.
 * Report-only failures describe manual work and leave later actions intact. */
function planInstanceActions(
  directory,
  actions,
  kitPaths,
  { reportOnly = false } = {},
) {
  const config = loadConfig(directory);
  if (!reportOnly && !config.kit.applyInstanceActions)
    throw new Error(
      `${join(directory, CONFIG_FILENAME)}: --apply requires kit.applyInstanceActions: true`,
    );
  const before =
    reportOnly && !destinationStat(directory, CONFIG_FILENAME)
      ? Buffer.from(json({ version: 1 }))
      : readDestination(directory, CONFIG_FILENAME);
  let draft = readJson(before, join(directory, CONFIG_FILENAME));
  const original = JSON.stringify(draft);
  const renames = [];
  const writes = new Map();
  const results = [];
  const instancePath = (path) => {
    if (
      !contained(path) ||
      [
        KIT_MANIFEST,
        KIT_MANIFEST_PENDING,
        CONFIG_FILENAME,
        INSTRUCTION_FILE,
        "AGENTS.md",
        "node_modules",
        ".runtime",
      ].some((reserved) => overlaps(path, reserved)) ||
      kitPath(path) ||
      kitPaths.some((kit) => overlaps(kit, path))
    )
      throw new Error(`instance root overlaps a protected path: ${path}`);
  };
  const inspectTree = (path) => {
    if (!destinationStat(directory, path)?.isDirectory())
      throw new Error(`cannot read instance root: ${join(directory, path)}`);
    for (const entry of readdirSync(join(directory, path), {
      withFileTypes: true,
    })) {
      const child = `${path}/${entry.name}`;
      if (entry.isDirectory()) inspectTree(child);
      else readDestination(directory, child);
    }
  };
  const planAction = (action) => {
    let changed = false;
    if (action.kind === "rename-root") {
      instancePath(action.from);
      instancePath(action.to);
      if (
        renames.some(({ from, to }) =>
          [from, to].some(
            (path) => overlaps(path, action.from) || overlaps(path, action.to),
          ),
        )
      )
        throw new Error(`overlapping root actions: ${action.id}`);
      const current = validateConfig(CONFIG_FILENAME, json(draft)).roots[
        action.root
      ];
      const from = destinationStat(directory, action.from);
      const to = destinationStat(directory, action.to);
      const adopt = () => {
        draft.roots ??= {};
        for (const [key, path] of Object.entries(draft.roots))
          if (path === action.from || path.startsWith(`${action.from}/`))
            draft.roots[key] = action.to + path.slice(action.from.length);
        draft.roots[action.root] = action.to;
        changed = true;
      };
      if (current === action.to && !from && to?.isDirectory()) {
        inspectTree(action.to);
      } else if (current === action.from && !from && to?.isDirectory()) {
        // The directory moved and the configuration did not, as after an
        // update interrupted between the two: record the root, move nothing.
        inspectTree(action.to);
        adopt();
      } else {
        if (current !== action.from || !from?.isDirectory() || to)
          throw new Error(
            `cannot apply ${action.id}: expected root ${action.root} at ${action.from} and absent ${action.to}`,
          );
        inspectTree(action.from);
        renames.push(action);
        adopt();
      }
    } else if (action.kind === "add-config-field") {
      const parts = action.field.split(".");
      let parent = draft;
      for (const part of parts.slice(0, -1)) {
        if (!Object.hasOwn(parent, part)) parent[part] = {};
        if (!object(parent[part]))
          throw new Error(
            `cannot apply ${action.id}: ${action.field} has a non-object parent`,
          );
        parent = parent[part];
      }
      const key = parts.at(-1);
      if (!Object.hasOwn(parent, key)) {
        parent[key] = structuredClone(action.value);
        changed = true;
      }
    } else if (action.kind === "change-phrase") {
      const bytes =
        writes.get(INSTRUCTION_FILE)?.bytes ??
        readDestination(directory, INSTRUCTION_FILE);
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      const count = text.split(action.from).length - 1;
      const targetCount = text.split(action.to).length - 1;
      const alreadyApplied =
        targetCount === 1 &&
        (count === 0 ||
          (action.to.includes(action.from) &&
            !text.replace(action.to, "").includes(action.from)));
      if (alreadyApplied) {
        // A replacement can include its old phrase; do not append it again.
      } else if (count === 1) {
        writes.set(INSTRUCTION_FILE, {
          bytes: Buffer.from(text.replace(action.from, () => action.to)),
          mode: destinationStat(directory, INSTRUCTION_FILE).mode & 0o777,
        });
        changed = true;
      } else
        throw new Error(
          `cannot apply ${action.id}: expected one phrase in ${join(directory, INSTRUCTION_FILE)}`,
        );
    } else
      throw new Error(`${KIT_ACTIONS}: undeclared action kind ${action.kind}`);
    return changed;
  };
  for (const action of actions) {
    const checkpoint = reportOnly
      ? {
          draft: structuredClone(draft),
          renames: renames.length,
          writes: new Map(writes),
        }
      : null;
    try {
      const changed = planAction(action);
      if (reportOnly)
        validateConfig(join(directory, CONFIG_FILENAME), json(draft));
      results.push(
        `${changed ? "applied" : "preserved/already applied"}: ${action.id} (${action.date}, ${action.kind})`,
      );
    } catch (error) {
      if (!reportOnly) throw error;
      // Failed hypothetical actions must not contaminate subsequent results.
      draft = checkpoint.draft;
      renames.length = checkpoint.renames;
      writes.clear();
      for (const [path, write] of checkpoint.writes) writes.set(path, write);
      results.push(
        `cannot apply: ${action.id} (${action.date}, ${action.kind}; ${error.message})`,
      );
    }
  }
  // Validate new defaults and root declarations through the same closed
  // configuration loader before a single instance or kit mutation.
  validateConfig(join(directory, CONFIG_FILENAME), json(draft));
  if (JSON.stringify(draft) !== original)
    writes.set(CONFIG_FILENAME, {
      bytes: Buffer.from(json(draft)),
      mode:
        (destinationStat(directory, CONFIG_FILENAME)?.mode ?? 0o644) & 0o777,
    });
  return { renames, writes, results };
}

/** Plan from core without changing the destination, receipts or registry.
 * Preparation still builds core's pinned runtime. Apply the returned plan
 * immediately, while its destination inputs are still current. */
export async function planKitUpdate(
  destination,
  { apply = false, launchpad = TOOL_ROOT } = {},
) {
  const target = resolve(destination);
  const prior = readPriorManifest(target);
  const pending = readPendingManifest(target);
  const resolved = resolveReceipt(launchpad, target, {
    names: destinationNames(target),
  });
  // Establish readable prior inputs and opt-in before the source build.
  for (const { path } of prior.files)
    if (destinationStat(target, path)) readDestination(target, path);
  if (apply) {
    if (destinationStat(target, CONFIG_FILENAME))
      readDestination(target, CONFIG_FILENAME);
    if (!loadConfig(target).kit.applyInstanceActions)
      throw new Error(
        `${join(target, CONFIG_FILENAME)}: --apply requires kit.applyInstanceActions: true`,
      );
  }
  // Retain the instance's original export license posture automatically.
  const license = prior.files.some(({ path }) => path === LICENSE_PENDING)
    ? "none"
    : "default";
  const prepared = await prepareKit({
    launchpad,
    license,
    preflight(sources) {
      const carried = new Set([
        ...[...sources.values()]
          .filter((file) => !file.input)
          .map((file) => file.destination),
        "package.json",
        "package-lock.json",
        "dotln.config.example.json",
        UPSTREAM,
        ...(license === "none" ? [LICENSE_PENDING] : []),
      ]);
      const pendingPaths = new Set(pending?.files.map(({ path }) => path));
      for (const { path } of prior.files)
        if (
          carried.has(path) &&
          (!pending || pendingPaths.has(path)) &&
          !destinationStat(target, path)
        )
          throw new Error(`cannot read regular file: ${join(target, path)}`);
    },
  });
  const buildHash = buildHashOf(prepared.bundle.snapshot);
  const candidates = new Map(prepared.writes.map((file) => [file.path, file]));
  for (const [path, contents] of prepared.bundle.surfaces)
    if (path !== INSTRUCTION_FILE)
      candidates.set(path, { path, bytes: Buffer.from(contents), mode: 0o644 });
  const actions = readKitActions(candidates.get(KIT_ACTIONS).bytes);
  const plan = planUpdate(prior, prepared.manifest, target, pending);
  const instance = apply
    ? planInstanceActions(target, actions, [
        ...new Set(
          [...prior.files, ...prepared.manifest.files].map(({ path }) => path),
        ),
      ])
    : null;
  const retained = plan.flatMap((entry) =>
    entry.kind === "refuse"
      ? entry.retained
        ? [entry.retained]
        : []
      : entry.kind === "remove"
        ? []
        : [
            {
              path: entry.path,
              sha256: sha256Hex(candidates.get(entry.path).bytes),
            },
          ],
  );
  const manifest = kitManifest({ ...prepared.manifest, files: retained });
  const date = new Date().toISOString();
  return {
    destination: target,
    launchpad,
    ...prepared.summary,
    prior,
    prepared,
    plan,
    actions,
    instance,
    manifest,
    candidates,
    buildHash,
    priorBuildHash: installedBuildHash(target),
    applied: instance?.results ?? [],
    optedIn: apply,
    receipt: {
      ...resolved,
      date,
      path: resolved.sibling
        ? receiptPath(launchpad, resolved.sibling, date)
        : null,
    },
  };
}

/** Apply the exact plan used by the preview, retaining the interrupted-update
 * journal and the existing last-step receipt/registry ordering. */
export function applyKitUpdate(planned) {
  const {
    destination: target,
    launchpad,
    manifest,
    plan,
    candidates,
    instance,
    buildHash,
  } = planned;
  // The planned manifest is journaled before the first write and removed
  // after the last, so an interrupted run leaves its plan for the retry.
  writeReplacement(target, KIT_MANIFEST_PENDING, json(manifest));
  for (const entry of plan) {
    if (entry.kind === "remove" && !entry.absent)
      unlinkSync(join(target, entry.path));
    if (entry.kind === "add" || entry.kind === "replace") {
      const file = candidates.get(entry.path);
      writeReplacement(target, entry.path, file.bytes, file.mode);
    }
  }
  if (instance) {
    for (const { from, to } of instance.renames) {
      mkdirSync(dirname(join(target, to)), { recursive: true });
      renameSync(join(target, from), join(target, to));
    }
    for (const [path, { bytes, mode }] of instance.writes)
      writeReplacement(target, path, bytes, mode);
  }
  const manifestBytes = Buffer.from(json(manifest), "utf8");
  writeReplacement(target, KIT_MANIFEST, manifestBytes);
  try {
    unlinkSync(join(target, KIT_MANIFEST_PENDING));
  } catch (error) {
    const failure = new Error(
      `the update at ${target} has written ${KIT_MANIFEST}, but its pending manifest was not removed; sibling receipt not written: ${error.message}`,
    );
    failure.updatePlan = planned;
    throw failure;
  }
  try {
    const receipt = closeWithReceipt(
      launchpad,
      planned.receipt,
      {
        coreCommit: manifest.commit,
        manifestBytes,
        buildHash,
        date: planned.receipt.date,
      },
      "update",
      target,
    );
    return { ...planned, receipt };
  } catch (error) {
    error.updatePlan = planned;
    throw error;
  }
}

export async function updateKit(destination, options = {}) {
  return applyKitUpdate(await planKitUpdate(destination, options));
}

const installedBuildHash = (root) => {
  try {
    return manifestBuildHash(
      readDestination(root, HARNESS_MANIFEST),
      join(root, HARNESS_MANIFEST),
    );
  } catch {
    // A locally edited harness manifest is an ordinary retained kit refusal;
    // missing snapshot metadata must not prevent updating the remaining kit.
    return `unknown (${HARNESS_MANIFEST} has no readable runtime snapshot)`;
  }
};

/** Inspect a fetched starter revision. Git performs no merge, and action
 * results describe the manual work after it, never permission to apply it. */
export async function previewFromRevision(root, ref) {
  root = resolve(root);
  const prior = readPriorManifest(root);
  const pending = readPendingManifest(root);
  if (typeof ref !== "string" || !ref || /[\x00-\x1f]/u.test(ref))
    throw new Error("preview requires a Git revision");
  const env = exportEnvironment();
  const revision = runGit(
    root,
    ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`],
    { env },
  );
  const blob = (path) =>
    runGit(root, ["show", `${revision}:${path}`], {
      env,
      trim: false,
      encoding: null,
    });
  const incoming = readManifest(blob(KIT_MANIFEST), `${ref}:${KIT_MANIFEST}`);
  // A starter may itself be a true fork or have re-emitted its harness.
  // Its manifest deliberately retains old kit hashes for those edits; the
  // pinned revision's typed metadata is what the operator is taking.
  const actions = readKitActions(blob(KIT_ACTIONS));
  const plan = planUpdate(prior, incoming, root, pending);
  const instance = planInstanceActions(
    root,
    actions,
    [...new Set([...prior.files, ...incoming.files].map(({ path }) => path))],
    { reportOnly: true },
  );
  return {
    destination: root,
    prior,
    manifest: incoming,
    commit: incoming.commit,
    tag: incoming.tag,
    revision,
    plan,
    actions,
    instance,
    applied: instance.results,
    optedIn: false,
    manualActions: true,
    priorBuildHash: installedBuildHash(root),
    buildHash: manifestBuildHash(
      blob(HARNESS_MANIFEST),
      `${ref}:${HARNESS_MANIFEST}`,
    ),
    receipt: {
      path: null,
      reason: "a starter merge writes no core sibling receipt",
    },
  };
}

/** The preview and completed update share every plan row. Metadata says
 * whether these judgments are proposed or have been applied. */
export function renderUpdatePlan(planned, { preview = false } = {}) {
  const rowKind = (entry) =>
    planned.revision && entry.kind !== "refuse" && entry.unchanged
      ? "unchanged"
      : entry.kind;
  const counts = Object.fromEntries(
    ["replace", "add", "remove", "refuse", "unchanged"].map((kind) => [
      kind,
      planned.plan.filter((entry) => rowKind(entry) === kind).length,
    ]),
  );
  const lines = [
    `${preview ? "Preview of" : "Updated"} the DotLn kit ${preview ? "at" : "to"} ${planned.commit} in ${planned.destination}.`,
    `kit files: ${counts.replace} replaced; ${counts.add} added; ${counts.remove} removed; ${counts.refuse} refused${planned.revision ? `; ${counts.unchanged} unchanged` : ""}.`,
  ];
  if (preview)
    lines.push(
      `incoming: ${planned.commit} (${planned.tag ?? "untagged"})`,
      ...(planned.revision
        ? [
            `starter revision: ${planned.revision}`,
            "scope: manifest-listed kit files; Git merge results may differ; instance actions are manual after the merge.",
          ]
        : []),
      `build: ${planned.priorBuildHash} -> ${planned.buildHash}`,
      planned.receipt.path
        ? `receipt: would write ${planned.receipt.path}`
        : `receipt: none (${planned.receipt.reason})`,
    );
  for (const entry of planned.plan)
    lines.push(
      entry.kind === "refuse"
        ? `refused: ${entry.path} (${entry.reason}; ${entry.retained ? `prior hash retained: ${entry.retained.sha256}` : "remains instance-owned; retained hash: none"}${planned.revision && entry.upstreamUnchanged ? "; unchanged upstream; no merge conflict expected" : ""})`
        : `${rowKind(entry)}: ${entry.path}`,
    );
  lines.push(
    `Instance-actions note (${new Date().toISOString().slice(0, 10)}): ${planned.manualActions ? "manual after merge" : planned.optedIn ? "opted-in update" : "update without opt-in"}.`,
  );
  for (const action of planned.actions)
    lines.push(`action: ${JSON.stringify(action)}`);
  if (!planned.actions.length) lines.push("No instance actions declared.");
  const results =
    planned.instance?.results ??
    planned.actions.map(
      (action) =>
        `preserved/no opt-in: ${action.id} (${action.date}, ${action.kind})`,
    );
  for (const result of results)
    lines.push(`action plan: ${result.replace(/^applied:/u, "apply:")}`);
  if (!preview) lines.push(...planned.applied);
  lines.push("re-emit: node scripts/harness.mjs emit");
  if (preview)
    lines.push("Preview only: no destination, receipt or registry writes.");
  return lines.join("\n");
}

if (isMainModule(import.meta.url)) {
  try {
    const [action, ...args] = process.argv.slice(2);
    const updating = args[0] === "--update";
    const [destination, ...rest] = updating ? args.slice(1) : args;
    const usage =
      "usage: launchpad export <dir> [--license none] | launchpad export --update <dir> [--apply] [--preview] | launchpad preview --from <ref> | launchpad verify [<dir>]";
    if (action === "preview") {
      if (args.length !== 2 || args[0] !== "--from") throw new Error(usage);
      console.log(
        renderUpdatePlan(await previewFromRevision(process.cwd(), args[1]), {
          preview: true,
        }),
      );
    } else if (action === "verify") {
      if (args.length > 1 || args[0]?.startsWith("--")) throw new Error(usage);
      verifyKit(args[0] ?? process.cwd());
    } else {
      if (action !== "export" || !destination || destination.startsWith("--"))
        throw new Error(usage);
      if (
        updating
          ? !(
              new Set(rest).size === rest.length &&
              rest.every((flag) => ["--apply", "--preview"].includes(flag))
            )
          : !(
              rest.length === 0 ||
              (rest.length === 2 &&
                rest[0] === "--license" &&
                rest[1] === "none")
            )
      )
        throw new Error(usage);
      const preview = rest.includes("--preview");
      const result = updating
        ? await (preview ? planKitUpdate : updateKit)(destination, {
            apply: rest.includes("--apply"),
            launchpad: findLaunchpad(),
          })
        : await exportKit(destination, {
            license: rest.length ? "none" : "default",
            launchpad: findLaunchpad(),
          });
      if (updating) {
        console.log(renderUpdatePlan(result, { preview }));
      } else {
        console.log(
          `Exported the DotLn kit of ${result.commit} (${result.tag ? `tag ${result.tag}` : "untagged"}) to ${result.destination}: ${result.files} kit files in ${KIT_MANIFEST}, ${result.seeds.length} instance seeds.`,
        );
        console.log(
          `runtime: ${result.runtimeFiles} compiled files built from the commit's package sources; harness bundle: ${result.harnessSurfaces + 1} surfaces emitted and checked inside the export, ${result.harnessSurfaces} manifest-listed (${INSTRUCTION_FILE}'s block is checked through ${HARNESS_MANIFEST}); snapshot ${result.snapshot}.`,
        );
      }
      console.log(
        `local-terms list: ${result.terms}${result.terms === "present" ? ` (${result.surfaces} texts checked)` : "; no text was checked against a local-terms list"}`,
      );
      if (!preview)
        console.log(
          result.receipt.path
            ? `sibling receipt: ${result.receipt.path}; sibling registry: ${result.receipt.registry.path} ${result.receipt.registry.written ? "regenerated" : "unchanged"}`
            : `sibling receipt: none (${result.receipt.reason})`,
        );
      if (result.dirty)
        console.log(
          `advisory: ${result.dirty} kit ${result.dirty === 1 ? "path differs" : "paths differ"} from HEAD in the work tree; the export carries commit ${result.commit}, not those changes.`,
        );
    }
  } catch (error) {
    if (error.updatePlan) console.log(renderUpdatePlan(error.updatePlan));
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
