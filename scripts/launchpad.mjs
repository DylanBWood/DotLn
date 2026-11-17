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
  EXTENSIONS_ROOT,
  ROOT_KEYS,
  spellsExtensionRoot,
  loadConfig,
  validateConfig,
  defaultDocRelative,
  docRelative,
  findLaunchpad,
} from "./lib/config.mjs";
import {
  describeTag,
  failureOf,
  readGitObjectsInBatches,
  runGit as ordinaryRunGit,
  runGitPathList as ordinaryRunGitPathList,
} from "./lib/git.mjs";
// Export provenance names original objects, independent of local replacements.
const runGit = (root, args, options) =>
  ordinaryRunGit(root, ["--no-replace-objects", ...args], options);
const runGitPathList = (root, args, options) =>
  ordinaryRunGitPathList(root, ["--no-replace-objects", ...args], options);
import {
  fetchIntoCheckout,
  parseGitHubTarget,
} from "./lib/github-repository.mjs";
import { readSettingsFragment } from "./lib/build-overlay.mjs";
import { formatDuration } from "./lib/duration.mjs";
import { bootstrapWorktree } from "./bootstrap.mjs";
import { moveIndex, referencePath } from "./lib/document-moves.mjs";
import {
  markdownFields,
  markdownLinks,
  markdownNodes,
  nodeSource,
  parseMarkdown,
  replaceMarkerBlocks,
} from "./lib/markdown-links.mjs";
import { json, pairedFlags, sha256Hex } from "./lib/helpers.mjs";
import {
  judgeGitRuntime,
  judgeNodeRuntime,
  readGitVersion,
} from "./lib/node-engines.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { dispatchSession } from "./lib/dispatch-bound.mjs";
import { requireOperatorCapture } from "./lib/off-ramps.mjs";
import {
  DOCS_MAP_SEED,
  DOCS_MAP_TEMPLATE,
  TIME_LIMITS_SEED,
  TIME_LIMITS_TEMPLATE,
  docsMapUnlinked,
  exportConfiguration,
  exportSeedPaths,
} from "./lib/starter-seeds.mjs";
import {
  freshHostFeatures,
  readFeatures,
  readHostFeatures,
} from "./lib/features.mjs";
import { dispatchJournalDirectory } from "../packages/skeleton/src/dispatch-journal.mjs";
import {
  hasPackageSources,
  runtimeEntryName,
} from "../packages/skeleton/src/runtime-inputs.mjs";
import { checkLocalTerms, localTermContextLines } from "./lib/terms.mjs";
import { VENDORED_RECORD, vendoredProof } from "./lib/vendored-parser.mjs";
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
  appendFileSync,
  closeSync,
  constants,
  existsSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
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
  "scripts/lib/build-overlay.mjs",
  "scripts/lib/config.mjs",
  "scripts/lib/control-actor.mjs",
  "scripts/lib/control-store.mjs",
  "scripts/lib/control-time.mjs",
  "scripts/lib/control.mjs",
  "scripts/lib/dependencies.mjs",
  "scripts/lib/derived-contract.mjs",
  "scripts/lib/dispatch-bound.mjs",
  "scripts/lib/duration.mjs",
  "scripts/lib/feature-registry.mjs",
  "scripts/lib/features.mjs",
  "scripts/lib/gate-evidence.mjs",
  "scripts/lib/git.mjs",
  "scripts/lib/harness-context.mjs",
  "scripts/lib/harness-instruction.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/helpers.mjs",
  "scripts/lib/markdown-links.mjs",
  "scripts/lib/node-engines.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/process-budget.mjs",
  "scripts/lib/release-tags.mjs",
  "scripts/lib/retained-session.mjs",
  "scripts/lib/temporary-roots.mjs",
  "scripts/lib/terms.mjs",
  "scripts/lib/validation.mjs",
  "scripts/lib/vendor/prettier-markdown.mjs",
  "scripts/lib/work-order-document.mjs",
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
  "packages/skeleton/src/temporary-root-records.mjs",
  "packages/skeleton/src/duration.mjs",
  "packages/skeleton/src/dispatch-journal.mjs",
  "packages/skeleton/src/test-selection.mjs",
  // The table of the gate path's time limits and its resolver, which the
  // runner, the structural checks and the host modules read with no build.
  "packages/skeleton/src/time-limits.mjs",
  "packages/compiler/src/attribution.mjs",
  "packages/compiler/src/codex-continuation.mjs",
  "packages/compiler/src/operator-control.mjs",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/evidence-editions.mjs",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/runtime-inputs.mjs",
  // The one reader of shell text and the one of JavaScript and TypeScript
  // source, which the scripts' checks import with no build (WO-276).
  "packages/skeleton/src/shell-reading.mjs",
  "packages/skeleton/src/source-reading.mjs",
  "packages/skeleton/src/usage-observation.mjs",
  // The reading of usage rows by token class and by day, which the meter
  // and the usage report import with no build (WO-276).
  "packages/skeleton/src/usage-reading.mjs",
  // The worker table and the kit's own model list, which the configuration
  // and every launcher read with no build (WO-276).
  "packages/skeleton/src/worker-catalog.mjs",
  "packages/skeleton/src/worker-models.mjs",
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
    "packages/console/uifa-board-v1.schema.json",
    "packages/console/runtime-status-v1.schema.json",
    // Names the third-party files the scripts tree carries (the pinned
    // Markdown parser). It travels under either license option, since the
    // carried files do.
    "THIRD_PARTY_NOTICES",
  ]),
  excluded: Object.freeze([
    // This core-only history includes a prior kit. Exporting it would nest
    // earlier bundles each time the fixture is regenerated.
    "scripts/fixtures/instance-with-history/instance.bundle",
    "scripts/fixtures/instance-with-history/manifest.json",
    "scripts/fixtures/instance-with-history/generate.mjs",
    "scripts/fixtures/instance-with-history/support.mjs",
    "scripts/test-instance-history.mjs",
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
    ["docs", "KIT.md"],
    // The operator's commands page, generated in core from the kit guide's
    // marked command blocks; `launchpad commands` prints it (WO-275).
    ["docs", "OPERATOR.md"],
    ["product", "07-execution-guide.md"],
    // The execution guide's cold-start section names the operator reference.
    ["product", "operator-reference.md"],
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
  DOCS_MAP_TEMPLATE,
  "dotln.config.example.json",
  "first-order.template.md",
  "for-core.template.md",
  "gitattributes.template",
  "gitignore.template",
  "pending-license.template.md",
  "repository-profile.template.md",
  TIME_LIMITS_TEMPLATE,
  "workstream.template.md",
]);

// Root keys whose directories the export seeds with a README convention.
// The documentation map (scripts/kit/docs-map.template.md) says in a few
// words what each root holds: change a convention here and its row there.
const SEEDED_ROOTS = Object.freeze({
  control:
    "Control records of this instance: one JSONL segment per order under orders/, the generated current.md projection, and local/ (ignored) for harness observations, usage and the private local-terms list. Written by the lifecycle commands; never edited by hand. Two files here are this instance's own settings, which its owner edits: budgets.json, the bounds of a dispatch and the kit's other budgets, and time-limits.json, the time limits of the gate, which npm run limits lists.",
  evidence:
    "Per-order directories: decisions.md (structured decisions with evidence, rejected options and reopening conditions), handoff.md (one line per acceptance criterion at implementation-ready) and fixture transcripts. current.json selects evidence editions once this instance records any.",
  verifications:
    "Immutable numbered verifier reports, VER-NNN.md, grouped by work order. A re-verification writes the next unused number; nothing here is edited after filing.",
  finalReviews:
    "Immutable numbered final-review reports, FINAL-NNN.md, with the PR and release-notes handoffs beside them, grouped by work order.",
  planning:
    "sequence.md (the proposed order), the follow-up register, each planning pass's dated record under passes/, which npm run plan -- start creates, and immutable refutation receipts under refutations/.",
  publication:
    "The implementation overlay template the kit carries, and this instance's audience outlines and status index once it compiles any publication.",
  product:
    "The kit carries the execution guide (07-execution-guide.md), the operator reference it names (operator-reference.md) and the publication compiler (08-publication-compiler.md, which the reviewer skill cites) whole. This instance's product overlay lives here as an instance file; core's other product documents are upstream pointers in UPSTREAM.md.",
  discovery:
    "Machine-audit outputs of this instance. Until environment.json records the harness versions and effort selectors observed here (the first order's deliverable), every lifecycle attestation prints the discovery advisory.",
  decisions:
    "Architecture decision records of this instance, numbered and dated; a settled question lives here, an open one in planning/.",
  releases:
    "Release records: tag manifests and notes for the versions this instance publishes.",
  observations:
    "JSONL observation logs the control plane appends to (host requests, pull-request observations); each is an event stream or a classified protocol.",
});

// The export's seed list is declared beside the starter refresh's seed rules
// (scripts/lib/starter-seeds.mjs), which a release fixture carries without
// this module; prepareKit refuses an export whose seeds differ from it.
export { exportSeedPaths };

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
  const blobs = readGitObjectsInBatches(
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
  // The reserved root is an instance's own: a manifest that listed a path
  // under it would make the next update overwrite an owner's file.
  const reserved = [...files].find(({ path }) => spellsExtensionRoot(path));
  if (reserved)
    throw new Error(
      `a kit manifest lists no path under ${EXTENSIONS_ROOT}/, the instance's own root: ${reserved.path}`,
    );
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
  // A carried document keeps its bytes when a document it links moves, so
  // its pointer names where that document lives at the exported commit, by
  // the reference resolution the document check uses and the commit's map.
  let moved = moveIndex(root, []);
  try {
    const moves = runGit(
      root,
      [
        "show",
        `${commit}:${docRelative(root, "control", "document-moves.json")}`,
      ],
      { onFailure: () => "" },
    );
    if (moves) moved = moveIndex(root, JSON.parse(moves).moves);
  } catch {
    // An unreadable map leaves each link as written.
  }
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
      const original = referencePath(moved, sourcePath, linkPath);
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
      "`packages/console/*.schema.json`",
      [
        "packages/console/uifa-board-v1.schema.json",
        "packages/console/runtime-status-v1.schema.json",
      ],
      "the versioned actor-board and runtime-status contracts, byte-identical to the commit",
    ],
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
  const blobs = readGitObjectsInBatches(
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
async function expectedHarnessBundle(
  root,
  floor,
  runtimePackageFiles,
  hosts,
  workers,
  settingsFragment,
) {
  // Imported after the build: a checkout that has never built has no dist for
  // scripts/lib/harness.mjs to load.
  const { composeHarnessInstruction, harnessInstallation } =
    await import("./lib/harness.mjs");
  // The destination's host rows select the profiles, as its own emit will:
  // a host it has not elected or shown has no surface to predict (WO-258).
  // Its workers section is taken the same way: the definitions its emit
  // will write from its own configuration are the ones predicted. So is
  // its settings fragment, which that emit merges into the settings.
  const installation = harnessInstallation({
    runtimeRoot: root,
    runtimePackageFiles,
    features: hosts,
    workers,
    settingsFragment,
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
  hosts = freshHostFeatures(),
  workers,
  settingsFragment,
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
  const bundle = await expectedHarnessBundle(
    root,
    floor,
    writes,
    hosts,
    workers,
    settingsFragment,
  );
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
  addSeed("dotln.config.json", exportConfiguration());
  addSeed(".gitignore", template("gitignore.template"));
  // Git converts no line ending in an instance's tree, so the bytes the
  // kit's verification hashes are the bytes checked out. A seed: a new
  // export carries it, the starter refresh adds it where absent and an
  // instance that has its own keeps it.
  addSeed(".gitattributes", template("gitattributes.template"));
  addSeed(INSTRUCTION_FILE, floor);
  addSeed(
    "AI-HARNESS-SECURITY.md",
    template("AI-HARNESS-SECURITY.template.md"),
  );
  // What this instance has learned that core should hear: one file its
  // final reviews and planning passes write, seeded with the entry form and
  // no entry; the starter refresh adds it where absent and never rewrites
  // it (WO-275).
  addSeed("FOR-CORE.md", template("for-core.template.md"));
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
  // The map is a template, so that a starter refresh can tell a copy an
  // export wrote from one its owner changed (starter-seeds.mjs). It links
  // each root's README the export seeds, so every one of them is a page a
  // reader reaches from the front page; a root whose README does not exist
  // yet (the generated work-order index, ignored intake) is named as a code
  // span in the template. The template is written for the default layout,
  // as every seed is: an export whose seeded roots it does not link is
  // refused here, by the seed list's own roots.
  const map = template(DOCS_MAP_TEMPLATE);
  const unlinked = docsMapUnlinked(markdownLinks(map).map(({ href }) => href));
  if (unlinked.length)
    throw new Error(
      `${KIT_TEMPLATES}/${DOCS_MAP_TEMPLATE} links no ${unlinked.join(", ")}; the map links the README of every root the export seeds`,
    );
  addSeed(DOCS_MAP_SEED, map);
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
    defaultDocRelative("control", "doc-baseline.json"),
    json({ schemaVersion: 1, products: {}, dispatches: {}, links: [] }),
  );
  addSeed(
    defaultDocRelative("control", "budgets.json"),
    template("budgets.template.json"),
  );
  // Every time limit of the instance's gate at the kit's figure: the file is
  // the instance's from here on.
  addSeed(TIME_LIMITS_SEED, template(TIME_LIMITS_TEMPLATE));
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
  if (
    JSON.stringify([...seeds, "AGENTS.md"]) !==
    JSON.stringify(exportSeedPaths())
  )
    throw new Error(
      "the export's seeds differ from exportSeedPaths; declare a new seed there so UPSTREAM.md and the starter refresh name it",
    );
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
  // The carried parser is the pinned package's text: exactly the files the
  // exported record proves are left out, and a copy that differs from its
  // recorded hash is screened as any file is.
  const carried = vendoredProof(
    writes.find(({ path }) => path === VENDORED_RECORD)?.bytes.toString("utf8"),
  );
  for (const { path, bytes } of [
    ...writes.filter(({ path }) => path !== INSTRUCTION_FILE),
    ...[...bundle.surfaces].map(([path, contents]) => ({
      path,
      bytes: Buffer.from(contents, "utf8"),
    })),
    { path: KIT_MANIFEST, bytes: manifestBytes },
  ]) {
    if (carried(path, bytes)) continue;
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
      termContext: localTermContextLines(terms),
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
/** Whether a path is one of the kit's own, by the allowlist: never a path
 * under the reserved root, whatever the lists below come to hold. */
export const kitPath = (path) =>
  contained(path) &&
  !spellsExtensionRoot(path) &&
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
  let emitted = 0;
  // A generated harness surface is the instance's own emit's to write: one
  // that differs from the manifest because the instance's configuration
  // resolves to it is verified where the instance's own harness check
  // passes, which compares every surface with a fresh emit. The check runs
  // as a child process and only when such a surface differs.
  const surfaces = harnessSurfaces(root);
  const harnessCheck = instanceHarnessCheck(root);
  // Every listed file is compared first. The instance's harness check loads
  // the carried compiled runtime, so a runtime file that differs is refused
  // before any of the instance's code runs, whatever the order of the paths.
  const unmatched = manifest.files.filter((entry) => {
    try {
      return sha256Hex(readDestination(root, entry.path)) !== entry.sha256;
    } catch {
      // An unreadable listed file differs just as a changed file does.
      return true;
    }
  });
  const runtime = unmatched.find((entry) => COMPILED_RUNTIME.test(entry.path));
  if (runtime)
    throw new Error(`kit runtime differs from the manifest: ${runtime.path}`);
  for (const entry of unmatched) {
    if (surfaces().has(entry.path) && harnessCheck() === "passes") {
      emitted++;
      continue;
    }
    differing++;
  }
  if (emitted)
    console.log(
      `kit: ${emitted} harness ${emitted === 1 ? "surface" : "surfaces"} written by this instance's own emit, which its harness check accepts`,
    );
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

/** The surfaces the instance's own emit wrote, read at most once: the paths
 * its harness manifest lists as installed, and that manifest. */
const harnessSurfaces = (directory) => {
  let listed;
  return () => {
    if (!listed) {
      listed = new Set([HARNESS_MANIFEST]);
      try {
        for (const { path } of JSON.parse(
          readDestination(directory, HARNESS_MANIFEST).toString("utf8"),
        ).installed)
          if (typeof path === "string") listed.add(path);
      } catch {
        /* An unreadable harness manifest lists nothing but itself. */
      }
    }
    return listed;
  };
};

// A carried compiled runtime file: a package's built output, which the
// instance's own harness check loads when it runs.
const COMPILED_RUNTIME = /^packages\/[^/]+\/dist\//u;

// Why an update's preview does not take a generated surface's bytes for the
// instance's own emit, by what its harness check answered.
const HARNESS_CHECK_REASONS = {
  fails:
    "the instance's harness check fails, so these bytes are not taken for its own emit; ",
  unavailable:
    "the instance's harness check could not run, nothing being installed, so these bytes are not taken for its own emit; ",
  "runtime-differs":
    "the instance's harness check was not run, since a carried compiled runtime file differs from what a kit wrote, so these bytes are not taken for its own emit; ",
};

/** Whether the instance's own harness check passes, asked at most once: the
 * destination's `node scripts/harness.mjs check` as a child process, with
 * the destination as its launchpad. `unavailable` where nothing is
 * installed there to run it. */
const instanceHarnessCheck = (directory) => {
  let result;
  return () => {
    if (result === undefined) {
      const script = join(directory, "scripts/harness.mjs");
      // A check that was itself started by this question does not ask it
      // again: the harness restores its runtime through the kit verifier,
      // which asks here.
      if (
        process.env.DOTLN_INSTANCE_HARNESS_CHECK ||
        !existsSync(script) ||
        !existsSync(join(directory, "node_modules"))
      )
        result = "unavailable";
      else {
        result =
          spawnSync(process.execPath, [script, "check"], {
            cwd: directory,
            // Neither an inherited launchpad nor inherited Git routing names
            // another checkout to the instance's check.
            env: { ...exportEnvironment(), DOTLN_INSTANCE_HARNESS_CHECK: "1" },
            encoding: "utf8",
            maxBuffer: 16 * 1024 * 1024,
          }).status === 0
            ? "passes"
            : "fails";
      }
    }
    return result;
  };
};

/** Plan the whole update before writing. A prior file the incoming kit
 * still carries must be present, and every present path must be a readable
 * regular file; otherwise the plan refuses as an input failure. A file whose
 * bytes already equal the incoming kit's, or equal what the pending manifest
 * of an interrupted update planned for it, is kept: never refused, and the
 * manifest records the incoming hash. A readable local edit is a refusal
 * retained in the plan. A dropped prior path that is already absent counts as
 * removed, and a path the interrupted update dropped that the incoming kit
 * carries again is added, so a retry completes at any later commit.
 *
 * A generated harness surface (`generated`: the incoming bundle's surfaces
 * and the harness manifest) is the one kit file an instance's own command
 * rewrites: its emit, under its own configuration. Where such a file holds
 * neither manifest's bytes and the instance's harness check passes, the
 * bytes are that emit's and the file is planned as re-emitted, replaced and
 * written again by the emit an update ends with. Where the check fails or
 * cannot run, it is refused as locally modified, as any kit file is, and
 * the entry says which. The check is asked only when a plan meets such a
 * file. */
export function planUpdate(
  prior,
  next,
  directory,
  pending = null,
  {
    generated = new Set(),
    harnessCheck = instanceHarnessCheck(directory),
  } = {},
) {
  const previous = new Map(prior.files.map((entry) => [entry.path, entry]));
  const following = new Map(next.files.map((entry) => [entry.path, entry]));
  const planned = new Map(
    (pending?.files ?? []).map((entry) => [entry.path, entry.sha256]),
  );
  const plan = [];
  const surfaces = harnessSurfaces(directory);
  // The instance's harness check loads the carried compiled runtime, so it
  // is asked only where every present compiled runtime file any kit listed
  // holds bytes a kit wrote (the prior kit's, the incoming kit's or an
  // interrupted update's): carried compiled code is verified before any of
  // the instance's code runs. Otherwise a surface is refused as locally
  // modified with that reason, and the runtime file with its own.
  const runtimeVerified = [
    ...new Set([...previous.keys(), ...following.keys(), ...planned.keys()]),
  ]
    .filter((path) => COMPILED_RUNTIME.test(path))
    .every((path) => {
      if (!destinationStat(directory, path))
        return !previous.has(path) || (pending !== null && !planned.has(path));
      const current = sha256Hex(readDestination(directory, path));
      return (
        current === following.get(path)?.sha256 ||
        current === previous.get(path)?.sha256 ||
        current === planned.get(path)
      );
    });
  let listed;
  const emitted = () => {
    if (!listed) {
      listed = surfaces();
    }
    return listed;
  };
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
    else if (!kept) {
      // The instance's check vouches for the files its own harness manifest
      // lists, and for that manifest: a generated path it does not list is
      // judged as any kit file is.
      const check =
        incoming && generated.has(path) && emitted().has(path)
          ? runtimeVerified
            ? harnessCheck()
            : "runtime-differs"
          : null;
      entry =
        check === "passes"
          ? { path, kind: "replace", reEmitted: true }
          : {
              path,
              kind: "refuse",
              reason: "locally modified",
              retained: old,
              ...(check ? { harnessCheck: check } : {}),
            };
    } else entry = { path, kind: incoming ? "replace" : "remove" };
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
        overlaps(action.from, action.to) ||
        // The kit moves no root of its own into the instance's, or out.
        spellsExtensionRoot(action.from) ||
        spellsExtensionRoot(action.to))
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
        // The extensions section is the instance's to write.
        action.field.split(".")[0] === EXTENSIONS_ROOT ||
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
      spellsExtensionRoot(path) ||
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
    hosts: readHostFeatures(target),
    workers: loadConfig(target).workers,
    settingsFragment: readSettingsFragment(target),
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
  const plan = planUpdate(prior, prepared.manifest, target, pending, {
    generated: new Set([HARNESS_MANIFEST, ...prepared.bundle.surfaces.keys()]),
  });
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
  const { temporaryPruneSummary } =
    await import("./lib/temporary-prune-summary.mjs");
  return {
    destination: target,
    pruneSummary: await temporaryPruneSummary(target, { scope: "repository" }),
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
  // A host the destination does not elect loses its surfaces; remove each
  // directory that leaves empty, up to the host's top directory, and never one
  // holding other files, as the emit does (scripts/lib/harness.mjs
  // emitHarness; WO-258-D031).
  for (const entry of plan)
    if (entry.kind === "remove" && !entry.absent)
      for (
        let directory = posix.dirname(entry.path);
        /^\.(?:codex|agents)(?:\/|$)/u.test(directory);
        directory = posix.dirname(directory)
      ) {
        const absolute = join(target, directory);
        const stat = lstatSync(absolute, { throwIfNoEntry: false });
        if (!stat?.isDirectory() || readdirSync(absolute).length) break;
        rmdirSync(absolute);
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
        ...(planned.operatorRequest
          ? { operatorRequest: planned.operatorRequest }
          : {}),
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
  const { operatorRequest = null, ...planning } = options;
  // The hold is this launchpad's session's: a from-core update runs under
  // core's dispatch, and the receipt it writes records the request.
  const request = admitUpdate(
    planning.launchpad ?? TOOL_ROOT,
    "export --update",
    operatorRequest,
  );
  const planned = await planKitUpdate(destination, planning);
  return applyKitUpdate({ ...planned, operatorRequest: request });
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

/** One line for each floor an incoming revision's package.json declares
 * that this host does not meet, naming the floor and what this host runs,
 * or one line saying that file could not be read.
 * It judges with the functions the host task and the host report call, and
 * it refuses nothing: an operator may preview on one machine for another. */
export function unmetIncomingFloors(
  packageText,
  { nodeVersion = process.version, gitVersion = readGitVersion() } = {},
) {
  let engines;
  try {
    // A byte-order mark is no part of the JSON, as the kit's own readers of
    // this file hold.
    engines = JSON.parse(packageText.replace(/^\uFEFF/u, "")).engines ?? {};
  } catch {
    // The incoming kit's own judges refuse on every host where they cannot
    // read this file, so the preview says so in place of printing no line.
    return [
      "incoming floors not read: the incoming package.json is not JSON this preview can read, and the incoming kit's commands refuse where they cannot read it. Read the revision's package.json before taking it.",
    ];
  }
  const lines = [];
  if (!judgeNodeRuntime(nodeVersion, engines.node).admitted)
    lines.push(
      `incoming floor not met on this host: engines.node ${engines.node}; this host runs Node ${nodeVersion}. The incoming kit's commands refuse below it: run them under a Node that range admits, or take the update on the host that will.`,
    );
  if (!judgeGitRuntime(gitVersion, engines.git).admitted)
    lines.push(
      `incoming floor not met on this host: engines.git ${engines.git}; this host runs ${gitVersion?.replace(/^git version /u, "Git ") ?? "no Git that could be read"}. The incoming kit's commands refuse below it: put a Git at or above that floor first on PATH, or take the update on the host that has one.`,
    );
  return lines;
}

/** Inspect a fetched starter revision. Git performs no merge, and action
 * results describe the manual work after it, never permission to apply it. */
export async function previewFromRevision(root, ref, host = {}) {
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
  // The incoming harness manifest names the surfaces the incoming emit
  // writes; with itself they are the generated files of this plan.
  const generated = new Set([HARNESS_MANIFEST]);
  try {
    for (const { path } of JSON.parse(blob(HARNESS_MANIFEST).toString("utf8"))
      .installed)
      if (typeof path === "string") generated.add(path);
  } catch {
    /* An unreadable harness manifest names no surface of its own. */
  }
  const plan = planUpdate(prior, incoming, root, pending, { generated });
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
    // The incoming floors this host does not meet, read from the incoming
    // revision's own package.json.
    floors: unmetIncomingFloors(blob("package.json").toString("utf8"), host),
    // The instance files a merge of this revision would meet changed on both
    // sides; a base that cannot be read is said, and refuses nothing here.
    bothChanged: (() => {
      try {
        const head = runGit(root, ["rev-parse", "--verify", "HEAD^{commit}"], {
          env,
        });
        const { base, paths } = changedOnBothSides(root, head, revision, {
          env,
        });
        return { base, paths };
      } catch (error) {
        return { unreadable: error.message };
      }
    })(),
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

/** The commit UPSTREAM.md's `**Commit:**` field names: the field's whole
 * value is one code span holding the commit's hex name. Null otherwise. */
const upstreamCommit = (text) => {
  const tree = parseMarkdown(text);
  const field = markdownFields(text, tree).find(
    (row) => row.label === "Commit",
  );
  if (!field) return null;
  const code = [...markdownNodes(tree)].find(
    (node) =>
      node.type === "inlineCode" &&
      node.position.start.offset >= field.valueStart &&
      node.position.end.offset <= field.end,
  );
  return code &&
    nodeSource(text, code) === field.value &&
    /^[0-9a-f]{40,64}$/u.test(code.value)
    ? code.value
    : null;
};

/** The kit commit a revision's provenance names: UPSTREAM.md's Commit field
 * and the manifest's, which an update moves together. */
const kitProvenance = (root, revision, options = {}) => {
  const show = (path) =>
    runGit(root, ["show", `${revision}:${path}`], {
      ...options,
      trim: false,
      onFailure: () => null,
    });
  const named = upstreamCommit(show(UPSTREAM) ?? "");
  let manifest = null;
  try {
    manifest = JSON.parse(show(KIT_MANIFEST) ?? "null")?.commit;
  } catch {
    /* A malformed manifest names no commit. */
  }
  return { named: named ?? null, manifest: manifest ?? null };
};

const shortCommit = (commit) => commit.slice(0, 12);
/** A path as one word of a printed Git command: quoted for the shell, and
 * marked literal where Git would otherwise read it as a pattern, so the
 * command touches that file and no other. */
const pathWord = (path) => {
  const literal = /[*?[\]\\]|^:/u.test(path) ? `:(literal)${path}` : path;
  return /^[\w./@+-]+$/u.test(literal)
    ? literal
    : `'${literal.replaceAll("'", "'\\''")}'`;
};

/** The instruction file outside its generated blocks. The harness block is
 * the emit's and the kit block the export's, so an update may move both;
 * what an instance owns of that file is the rest. */
const instructionFloor = (text) =>
  [
    ["dotln-harness:start", "dotln-harness:end"],
    ["dotln-kit:start", "dotln-kit:end"],
  ].reduce(
    (floor, [opens, closes]) =>
      replaceMarkerBlocks(floor, opens, closes, () => ""),
    text,
  );

/** What a revision holds at each path: its kind and object, or null where
 * the revision has no such path. The instruction file is read as its floor
 * (its bytes outside the generated blocks), so that a block the emit or
 * the kit rewrote is no change of the instance's. */
const pathStates = (root, revision, paths, options = {}) => {
  const states = new Map(paths.map((path) => [path, null]));
  for (const path of paths) {
    const entry = runGit(
      root,
      ["--literal-pathspecs", "ls-tree", "-z", revision, "--", path],
      { ...options, trim: false },
    );
    if (entry === "") continue;
    // A regular file's executable bit is no part of its bytes: a side that
    // changed the bit alone changed nothing this rule protects.
    const state = entry
      .slice(0, entry.indexOf("\t"))
      .replace(/^100755 /u, "100644 ");
    states.set(
      path,
      path === INSTRUCTION_FILE && state.startsWith("100")
        ? `floor ${sha256Hex(
            instructionFloor(
              runGit(root, ["show", `${revision}:${path}`], {
                ...options,
                trim: false,
              }),
            ),
          )}`
        : state,
    );
  }
  return states;
};

/** The files outside the incoming kit's manifest that both sides of an
 * update changed since their merge base: each differs between the base and
 * the instance's side and between the base and the starter's, a file both
 * added among them, and the two sides do not hold the same bytes for it. A
 * file only the starter changed or added flows in as Git merges it and is
 * never among them; neither is a kit file, which the manifest's own plan
 * judges. Where Git names more than one merge base the first is read, and
 * the result names the base used. A base that cannot be read (a shallow or
 * grafted clone, or two histories that share no commit) throws, naming
 * the observed cause and what to do. `options` reaches
 * every Git read: the preview passes the environment that keeps an inherited
 * GIT_DIR from naming another repository. */
export function changedOnBothSides(root, instance, starter, options = {}) {
  const base = runGit(root, ["merge-base", instance, starter], {
    ...options,
    onFailure: () => null,
  });
  if (!base) {
    const graftsPath = runGit(
      root,
      ["rev-parse", "--git-path", "info/grafts"],
      {
        ...options,
        onFailure: () => null,
      },
    );
    const graftsOverride = (options.env ?? process.env).GIT_GRAFT_FILE;
    if (
      [graftsPath, graftsOverride].some(
        (path) => path && existsSync(resolve(root, path)),
      )
    )
      throw new Error(
        "the update's merge base cannot be read while this clone has a grafts file (info/grafts or GIT_GRAFT_FILE). Set the grafts file aside and run this again against the original history",
      );
    const shallow =
      runGit(root, ["rev-parse", "--is-shallow-repository"], {
        ...options,
        onFailure: () => "false",
      }) === "true";
    throw new Error(
      `the update's merge base cannot be read: this clone holds no commit that ${shortCommit(instance)} and the starter's revision ${shortCommit(starter)} share (${shallow ? "a shallow clone). Fetch the history the clone lacks, by an unshallow fetch from the remote that holds it, and run this again" : "the clone is whole, so the two histories share nothing: an instance whose first commit was its own, or a starter whose history was written again). Without a shared commit nothing tells this instance's changes from the starter's, and this command cannot judge the merge: compare this instance's own files with the commit before the merge by hand, and open the pull request yourself"}`,
    );
  }
  let listed = [];
  try {
    listed = JSON.parse(
      runGit(root, ["show", `${starter}:${KIT_MANIFEST}`], {
        ...options,
        trim: false,
      }),
    ).files.map(({ path }) => path);
  } catch {
    /* A revision with no readable manifest lists no kit file. */
  }
  const kit = new Set([KIT_MANIFEST, KIT_MANIFEST_PENDING, ...listed]);
  const changed = (side) =>
    new Set(
      runGitPathList(
        root,
        ["diff", "--name-only", "--no-renames", "-z", base, side, "--"],
        options,
      ),
    );
  const theirs = changed(starter);
  const candidates = [...changed(instance)]
    .filter((path) => theirs.has(path) && !kit.has(path))
    .sort();
  const [origin, mine, incoming] = [base, instance, starter].map((revision) =>
    pathStates(root, revision, candidates, options),
  );
  return {
    base,
    instance,
    starter,
    // Each side's state differs from the base's and from the other's: a
    // file whose bytes moved only inside a generated block is on no list.
    paths: candidates.filter(
      (path) =>
        mine.get(path) !== origin.get(path) &&
        incoming.get(path) !== origin.get(path) &&
        mine.get(path) !== incoming.get(path),
    ),
    states: mine,
  };
}

/** The update's own merge, with the instance's side and the starter's.
 * `named` is the kit commit HEAD's UPSTREAM.md and manifest name.
 *
 * What tells the update's merge from every other merge in the history is
 * one observation: it is the oldest commit in which a line that holds the
 * starter's incoming revision meets a line that does not, and its parent
 * that does not is the instance's side. Later merges on the branch (main
 * again, another branch, a merge of the branch that made the update's
 * merge) hold that commit; a merge inside the starter's history is below
 * the revision. A branch that reaches the revision with no such commit (a
 * fast-forward) met no commit of the instance's own, and there is nothing
 * to judge.
 *
 * That needs the revision, and which commits are the starter's is not
 * written in the commits: the starter merges lines of its own, and a merge
 * of the starter's and a merge of the instance's have one shape and name
 * their kit commits alike. The fact the commits lack is where a commit
 * came from. The operator knows it and may say it: `from` names the ref or
 * the commit the branch merged, the one the preview was given, and is held
 * only to what a revision must be (this branch holds it, it names `named`,
 * main does not hold it). Where it is not said, the operator's fetch is
 * read for it: the revision
 * is the commit HEAD shares with a ref of the starter's that names `named`
 * and that neither main nor origin's main holds, a ref of the starter's
 * being the `main` (or the remote's HEAD) of a remote other than origin,
 * or any ref under refs/upstream-releases/: the guide's two routes. Any
 * other branch of another remote is not trusted, since a mirror, a
 * colleague's fork or a second remote of the instance's holds this
 * branch's own commits under such a name. Where no ref gives one the
 * publish is refused, since nothing here can then tell a merge of the
 * revision from a squash of it or a copy of its files; the refusal names
 * how to say which commit the revision is.
 *
 * Refused as well: a revision that met the instance's lines in two merges
 * neither of which holds the other, a merge of more than two lines, and an
 * instance side that names a kit commit neither main nor origin's main
 * names (a branch that already held another update, or one cut before
 * main's last), and a commit of the branch whose parent is a commit of the
 * starter's below the revision that main does not hold (another revision
 * taken by a road of its own). None has one instance side to judge.
 *
 * One shape of what the refs give is refused and `from` asked for: a
 * commit whose history beyond main holds a merge with one side that main
 * holds. It is the starter's own merge over a commit this instance already
 * has, or this branch's update merge as another remote's main holds it, and
 * the commits do not say which. What the refs still cannot show, stated in
 * the decision: another remote's main that holds this branch's merge where
 * the instance's side of it was a commit main never held. `from` says. */
const updateMerge = (root, named, options, from = null) => {
  const read = (args, extra = {}) =>
    runGit(root, args, { ...options, ...extra });
  const ancestor = (older, newer) =>
    read(["merge-base", "--is-ancestor", older, newer], {
      onFailure: () => false,
    }) !== false;
  const kitOf = (revision) => {
    const provenance = kitProvenance(root, revision, options);
    return provenance.named && provenance.named === provenance.manifest
      ? provenance.named
      : null;
  };
  const origin = read(
    ["rev-parse", "--verify", "--quiet", "refs/remotes/origin/main"],
    { onFailure: () => null },
  );
  const lines = [...(origin ? [origin] : []), "main"];
  const published = (commit) => lines.some((line) => ancestor(commit, line));
  const heldAbroad = new Map();
  /** Whether a commit of the starter's history is one the instance's
   * published lines hold: shared history, and no revision of its own. */
  const shared = (commit) => {
    if (!heldAbroad.has(commit)) heldAbroad.set(commit, published(commit));
    return heldAbroad.get(commit);
  };
  // Every ref a fetch from somewhere other than origin left, and of those
  // the ones read as the starter's without being told.
  const abroad = read([
    "for-each-ref",
    "--format=%(objectname) %(refname)",
    "refs/remotes",
    "refs/upstream-releases",
  ])
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(" "))
    .filter(([, ref]) => !ref.startsWith("refs/remotes/origin/"));
  const fetched = [
    ...new Set(
      abroad
        .filter(
          ([, ref]) =>
            ref.startsWith("refs/upstream-releases/") ||
            /^refs\/remotes\/[^/]+\/(?:main|HEAD)$/u.test(ref),
        )
        .map(([tip]) => tip),
    ),
  ];
  const candidates = [
    ...new Set(
      fetched
        .map((tip) =>
          read(["merge-base", "HEAD", tip], { onFailure: () => null }),
        )
        .filter(Boolean),
    ),
  ].filter((commit) => kitOf(commit) === named && !published(commit));
  const revision = from === null ? inferred() : stated(from);
  return meeting(revision);

  /** The revision the operator names: the ref or the commit this branch
   * merged, which is what the preview was given. It is held to what a
   * revision must be and to nothing a ref's place could add. */
  function stated(name) {
    const commit = read(
      [
        "rev-parse",
        "--verify",
        "--quiet",
        "--end-of-options",
        `${name}^{commit}`,
      ],
      { onFailure: () => null },
    );
    if (!commit)
      throw new Error(
        `--from names ${name}, which is no commit this clone holds: name the ref or the commit this branch merged`,
      );
    if (!ancestor(commit, "HEAD"))
      throw new Error(
        `--from names ${shortCommit(commit)}, which this branch does not hold: merge it first, or name the revision this branch did merge`,
      );
    if (published(commit))
      throw new Error(
        `--from names ${shortCommit(commit)}, which main already holds: it is no incoming revision of the starter's`,
      );
    const kit = kitOf(commit);
    if (kit !== named)
      throw new Error(
        `--from names ${shortCommit(commit)}, which names ${kit ? `the kit commit ${shortCommit(kit)}` : "no one kit commit"}, and this branch names ${shortCommit(named)}: name the revision this branch merged`,
      );
    // Where a commit came from is what a fetch records: one no fetched ref
    // holds was made here, by a rebase or a copy of the revision, and is
    // not the starter's whatever it holds.
    if (
      ![...new Set(abroad.map(([tip]) => tip))].some((tip) =>
        ancestor(commit, tip),
      )
    )
      throw new Error(
        `--from names ${shortCommit(commit)}, which no ref fetched from a remote other than origin holds: a commit made here, by a rebase or a copy of the revision, is not the starter's. Merge the starter's ref again on a branch cut from main and name that ref`,
      );
    return commit;
  }

  function inferred() {
    if (!candidates.length)
      throw new Error(
        `the starter's incoming revision is not known here: no ref of the starter's (the main of a remote other than origin, or a ref under refs/upstream-releases/) shares with this branch a commit that names the kit commit ${shortCommit(named)}. A revision is taken by a merge of a fetched ref, never by a squash or a copy of its files. Where this branch did merge the revision, say which commit it is and run this again with --from <the ref or the commit it merged>; a branch rebased since no longer holds it, and is merged again from the starter's ref`,
      );
    const newest = candidates.find((commit) =>
      candidates.every((other) => ancestor(other, commit)),
    );
    if (!newest)
      throw new Error(
        `the starter's incoming revision is ambiguous: ${candidates.map(shortCommit).join(", ")} each name the kit commit ${shortCommit(named)} and none holds the others. Merge one revision of the starter on a branch cut from main, or say which this branch merged with --from <the ref or the commit>`,
      );
    // One shape of what the refs give cannot be told from this branch's own
    // work: a commit whose history, beyond what main holds, has a merge with
    // one side that main holds. That is a merge of the starter's own over a
    // commit this instance already has, or this branch's update merge as
    // another remote's main holds it. The operator says which.
    const beyond = read([
      "rev-list",
      "--parents",
      newest,
      ...lines.map((line) => `^${line}`),
    ])
      .split("\n")
      .filter(Boolean)
      .map((row) => row.split(" "));
    const unpublished = new Set(beyond.map(([commit]) => commit));
    const joining = beyond.find(
      ([, ...parents]) =>
        parents.length > 1 &&
        parents.some((parent) => unpublished.has(parent)) &&
        parents.some((parent) => !unpublished.has(parent)),
    );
    if (joining)
      throw new Error(
        `the commit ${shortCommit(newest)} that the fetched refs give as the starter's revision holds the merge ${shortCommit(joining[0])}, one side of which main holds: that is a merge of the starter's own over a commit this instance already has, or this branch's own merge as another remote's main holds it, and the commits do not say which. Say which commit this branch merged with --from <the ref or the commit>`,
      );
    return newest;
  }

  function meeting(revision) {
    // Every commit of HEAD's that the revision does not hold, oldest first,
    // with whether it holds the revision and whether a meeting of the two
    // kinds of line is at or below it.
    const holds = new Map();
    const below = new Map();
    const meetings = [];
    const rows = [];
    for (const row of read([
      "rev-list",
      "--topo-order",
      "--reverse",
      "--parents",
      "HEAD",
      `^${revision}`,
    ])
      .split("\n")
      .filter(Boolean)) {
      const [commit, ...parents] = row.split(" ");
      rows.push({ commit, parents });
      const holding = (parent) =>
        parent === revision || holds.get(parent) === true;
      holds.set(commit, parents.some(holding));
      const meets = holds.get(commit) && !parents.every(holding);
      const under = parents.some((parent) => below.get(parent) === true);
      below.set(commit, meets || under);
      if (meets && !under) meetings.push({ commit, parents, holding });
    }
    if (!meetings.length) return null;
    if (meetings.length > 1)
      throw new Error(
        `the starter's revision ${shortCommit(revision)} meets this instance's own lines in ${meetings.length} merges, none of which holds another (${meetings.map(({ commit }) => shortCommit(commit)).join(", ")}), so no one merge is the update's. Merge the revision once, on a branch cut from main`,
      );
    const [{ commit, parents, holding }] = meetings;
    if (parents.length > 2)
      throw new Error(
        `the merge ${shortCommit(commit)} joins ${parents.length} lines where it meets the starter's revision ${shortCommit(revision)}, so it has no one instance side to judge. Take the starter's revision in a merge of its own, on a branch cut from main`,
      );
    const merge = {
      commit,
      instance: parents.find((parent) => !holding(parent)),
      starter: parents.find(holding),
    };
    const kit = kitOf(merge.instance);
    if (!lines.some((ref) => kitOf(ref) === kit))
      throw new Error(
        `the instance's side of the update's merge ${shortCommit(merge.commit)} is ${shortCommit(merge.instance)}, which names ${kit ? `the kit commit ${shortCommit(kit)}` : "no one kit commit"}, and main does not: this branch already held another update when ${shortCommit(revision)} was merged, local main is behind the remote's, or the branch was cut before main's last update. An update branch takes one revision: bring main up to date, cut a branch from it and merge the revision you mean to take once`,
      );
    // A commit of this branch whose parent is a commit of the starter's
    // history, below the revision, that the instance's published lines do
    // not hold took another revision of the starter's by a road of its own:
    // an older revision merged on a branch that joined this one, or a branch
    // cut from the starter. Its merge is no meeting with this revision, and
    // would bring starter bytes in unjudged.
    const other = rows
      .flatMap(({ commit: child, parents: above }) =>
        above
          .filter(
            (parent) =>
              parent !== revision && !holds.has(parent) && !shared(parent),
          )
          .map((parent) => ({ child, parent })),
      )
      .at(0);
    if (other)
      throw new Error(
        `the commit ${shortCommit(other.child)} on this branch has the parent ${shortCommit(other.parent)}, a commit of the starter's below the revision ${shortCommit(revision)} that main does not hold: this branch took another revision of the starter's beside the one it merged. An update branch takes one revision: cut a branch from main and merge the revision you mean to take once`,
      );
    return {
      ...merge,
      revision,
      // The instance's published lines by name: where one has moved on from
      // the instance's side and HEAD has taken it in, its bytes are the
      // instance's.
      lines: [
        ...(origin ? [{ name: "origin/main", commit: origin }] : []),
        {
          name: "main",
          commit: read(["rev-parse", "--verify", "main^{commit}"]),
        },
      ],
    };
  }
};

/** The files of an update's merge commit that no longer hold what the
 * instance had: of the files both sides changed, those whose bytes in the
 * merge commit differ from the instance's side. */
export function instanceChangesNotKept(root, merge, options = {}) {
  const both = changedOnBothSides(root, merge.instance, merge.starter, options);
  const merged = pathStates(root, merge.commit, both.paths, options);
  return {
    ...both,
    commit: merge.commit,
    merged,
    paths: both.paths.filter(
      (path) => merged.get(path) !== both.states.get(path),
    ),
  };
}

/** Judge the update's merge before a publish. A file both sides changed
 * must hold the instance's bytes in HEAD itself: the merge commit held
 * them, or a later commit put them back, which is where the restore this
 * refusal prints puts them, and nothing since has changed the file again.
 * A restore that a later commit or a later merge undid is not kept,
 * whatever bytes the file ended at.
 *
 * The instance's bytes are what the instance's own lines say, as far as
 * HEAD holds them: the merge's instance side, and the newest commit of main
 * and of origin's main that HEAD has taken in. A line's tip may have moved
 * on since, and what the branch has not taken in it does not answer for.
 * Where such a commit holds the instance side, its bytes are the
 * instance's now, since a branch that holds the instance's later commits
 * and an older state of the file would take the later change back out of
 * main. Where the two have parted (the instance side is a commit of the
 * branch's own), the bytes are those of whichever changed the file since
 * they parted; a file both changed has no one commit that holds the
 * instance's bytes, and is set by hand and named by `--take`. Where two
 * such commits were taken in and neither holds the other, either's bytes
 * are the instance's. Every commit the refusal prints is printed by its
 * id, so a branch or a tag of a line's name cannot stand in for it.
 *
 * `--take` admits one named file whose bytes in HEAD the operator means to
 * keep, and is refused for a file that already holds the instance's bytes.
 * `from` is the revision the operator says the branch merged, or null
 * where the fetched refs are to say. `named` is the kit commit HEAD's
 * provenance names. Returns the taken paths; throws naming every other
 * file, the command that restores it and `--take`. */
export function judgeUpdateMerge(root, named, takes = [], from = null) {
  // No inherited variable routes these reads to another repository, and a
  // path is read as written: `--literal-pathspecs` on the command line holds
  // whatever the environment says, and a setting that conflicts with it
  // fails the read, and so the publish, with Git's own message.
  const options = { env: exportEnvironment() };
  const merge = updateMerge(root, named, options, from);
  if (!merge) {
    if (takes.length)
      throw new Error(
        `--take names ${takes.join(", ")}, and this branch holds no update merge to take it from`,
      );
    return [];
  }
  const judged = instanceChangesNotKept(root, merge, options);
  const stray = takes.filter((path) => !judged.paths.includes(path));
  if (stray.length)
    throw new Error(
      `--take names ${stray.join(", ")}, which the update's merge ${shortCommit(merge.commit)} did not change against this instance's bytes; it changed ${judged.paths.length ? judged.paths.join(", ") : "none"}`,
    );
  const states = (revision) =>
    pathStates(root, revision, judged.paths, options);
  const read = (args) =>
    runGit(root, args, { ...options, onFailure: () => null });
  const ancestor = (older, newer) =>
    runGit(root, ["merge-base", "--is-ancestor", older, newer], {
      ...options,
      onFailure: () => false,
    }) !== false;
  // The newest commit of each published line that HEAD holds, where it adds
  // anything to the instance side, and of those the ones no other holds.
  const taken = [
    ...new Map(
      merge.lines
        .map(({ name, commit }) => ({
          name,
          commit: read(["merge-base", "HEAD", commit]),
        }))
        .filter(({ commit }) => commit && !ancestor(commit, merge.instance))
        .map((line) => [line.commit, line]),
    ).values(),
  ];
  const tips = taken.filter(
    (line) =>
      !taken.some(
        (other) =>
          other.commit !== line.commit && ancestor(line.commit, other.commit),
      ),
  );
  const own = (path) => ({
    state: judged.states.get(path),
    source: merge.instance,
  });
  // For each such commit, what it makes the instance's bytes of a path and
  // the commit that holds them, or null where no one commit does.
  const sides = tips.length
    ? tips.map((tip) => {
        const at = states(tip.commit);
        if (ancestor(merge.instance, tip.commit))
          return {
            ...tip,
            wanted: (path) =>
              at.get(path) === judged.states.get(path)
                ? own(path)
                : { state: at.get(path), source: tip.commit },
          };
        const parted = read(["merge-base", merge.instance, tip.commit]);
        const before = parted ? states(parted) : new Map();
        return {
          ...tip,
          wanted: (path) =>
            at.get(path) === before.get(path)
              ? own(path)
              : judged.states.get(path) === before.get(path)
                ? { state: at.get(path), source: tip.commit }
                : null,
        };
      })
    : [{ name: null, wanted: own }];
  const atHead = states("HEAD");
  const kept = (path) =>
    sides.some((side) => side.wanted(path)?.state === atHead.get(path));
  const needless = takes.filter(kept);
  if (needless.length)
    throw new Error(
      `--take names ${needless.join(", ")}, which holds this instance's bytes already: a taken file is one whose merged bytes are kept, and there is nothing of the merge's to keep there`,
    );
  const lost = judged.paths.filter(
    (path) => !takes.includes(path) && !kept(path),
  );
  if (lost.length) {
    const sources = new Map();
    const byHand = [];
    for (const path of lost) {
      const side = sides.find((candidate) => candidate.wanted(path));
      if (!side) {
        byHand.push(path);
        continue;
      }
      const { state, source } = side.wanted(path);
      const key = `${state === null ? "rm" : "checkout"} ${source}`;
      sources.set(key, [...(sources.get(key) ?? []), path]);
    }
    const restore = [...sources]
      .map(([key, paths]) => {
        const [verb, source] = key.split(" ");
        const words = paths.map(pathWord).join(" ");
        return verb === "rm"
          ? `git rm -- ${words}`
          : `git checkout ${source} -- ${words}`;
      })
      .join(" && ");
    // An earlier update that reached main without the starter's commits
    // leaves a base that names an older kit commit than the instance side.
    const kitAt = (revision) =>
      kitProvenance(root, revision, options).named ?? null;
    const squashed =
      kitAt(judged.base) !== kitAt(merge.instance)
        ? ` The base names ${kitAt(judged.base) ? `the kit commit ${shortCommit(kitAt(judged.base))}` : "no kit commit"} and the instance's side names ${kitAt(merge.instance) ? shortCommit(kitAt(merge.instance)) : "none"}: an earlier update reached main without the starter's own commits (a squash merge, or a copy of its files), so a file named here may hold that update's change and no change of this instance's. Where it does, keep the merged bytes with --take.`
        : "";
    throw new Error(
      `the update's merge ${shortCommit(merge.commit)} changed ${lost.length === 1 ? "a file" : `${lost.length} files`} this instance had changed since ${shortCommit(judged.base)}, the base it shares with the starter's revision ${shortCommit(merge.revision)}: ${lost.join(", ")}. An update keeps the instance's bytes for a file both sides changed.${restore ? ` Restore ${sources.size === 1 && [...sources.values()][0].length === 1 ? "it" : "them"} from the instance's side, ${shortCommit(merge.instance)}${[...sources.keys()].some((key) => !key.endsWith(` ${merge.instance}`)) ? ", or from the commit of main this branch holds where main changed the file again" : ""}, and commit: ${restore}.` : ""}${byHand.length ? ` ${byHand.join(", ")} changed on the instance's side of the merge and again on main since the two parted, so no one commit holds this instance's bytes for ${byHand.length === 1 ? "it" : "them"}: set ${byHand.length === 1 ? "it" : "them"} by hand and pass --take.` : ""}${lost.includes(INSTRUCTION_FILE) ? ` Then run node scripts/harness.mjs emit, which writes ${INSTRUCTION_FILE}'s generated block again, and commit that.` : ""}${squashed} For a file whose merged bytes you mean to keep, pass --take <path> instead`,
    );
  }
  return takes;
}

/** Publish an instance's update branch once it holds the update whole: the
 * merge of the previewed revision, the re-emit and the lineage index, each
 * committed. The helper refuses a dirty tree before this proof runs. */
async function publishUpdate(
  root,
  { title, bodyFile, takes = [], from = null, operatorRequest = null },
) {
  admitUpdate(root, "update --publish", operatorRequest, (text) =>
    process.stdout.write(text),
  );
  const { publishLaunchpadBranch } =
    await import("./lib/launchpad-publish.mjs");
  return publishLaunchpadBranch(root, {
    kind: "update",
    title,
    bodyFile,
    ready(branch, fail) {
      const head = kitProvenance(root, "HEAD");
      if (!head.named || head.named !== head.manifest)
        throw fail(
          `${branch} carries no update: ${UPSTREAM} names ${head.named ?? "no commit"} and ${KIT_MANIFEST} names ${head.manifest ?? "no commit"}; merge the previewed revision and commit it`,
        );
      // Judged where the branch left main as well as at main's tip: a branch
      // behind main names an older kit commit, which differs from the tip with
      // no update on it, and one main already holds has nothing left to bring.
      const left = runGit(root, ["merge-base", "main", "HEAD"], {
        onFailure: () => null,
      });
      if (!left) throw fail(`${branch} has no merge base with a local main`);
      if (kitProvenance(root, left).named === head.named)
        throw fail(
          `${branch} carries no update: ${UPSTREAM} names ${head.named}, the commit it named where the branch left main; merge the previewed revision and commit it`,
        );
      if (kitProvenance(root, "main").named === head.named)
        throw fail(
          `${branch} carries no update: main already names ${head.named}`,
        );
      // The update's own merge: a file both sides changed keeps the
      // instance's bytes, or is named by --take.
      let taken;
      try {
        taken = judgeUpdateMerge(root, head.named, takes, from);
      } catch (error) {
        throw fail(error.message);
      }
      for (const path of taken)
        console.log(
          `taken: ${path} (the merge's bytes are kept at the operator's word)`,
        );
      for (const [what, script, ...args] of [
        ["the re-emit", "scripts/harness.mjs", "check"],
        ["the lineage index", "scripts/lineage.mjs", "index", "--check"],
      ]) {
        const checked = spawnSync(
          process.execPath,
          [join(root, script), ...args],
          { cwd: root, encoding: "utf8" },
        );
        if (checked.status !== 0)
          throw fail(
            `${what} is not committed on ${branch}: ${(checked.stderr || checked.stdout).trim()}`,
          );
      }
    },
  });
}

// The operator's rule of 2026-11-03: no planning or entropy pass takes a
// newer starter release or merges upstream; only the operator's words in that
// session do. The session's own journal shows the dispatch it runs under, and
// a pending entropy dispatch shows an entropy pass in progress, so an update
// under either is refused unless the operator's in-session request is named
// by its capture. A session with no journaled dispatch is admitted as before.
const UPDATE_REQUEST_FLAGS =
  "--operator-request --capture <ignored intake file> --capture-hash sha256:<digest>";
const sessionJournalFile = (root, session) =>
  join(dispatchJournalDirectory(root), `${sha256Hex(session)}.jsonl`);
/** Why an update is held in this launchpad for this session, or null. */
export function updateDispatchHold(root, env = process.env) {
  const session = dispatchSession(env);
  if (session) {
    const file = sessionJournalFile(root, session);
    if (lstatSync(file, { throwIfNoEntry: false })?.isFile()) {
      const dispatch = readFileSync(file, "utf8")
        .split("\n")
        .filter(Boolean)
        .flatMap((line) => {
          try {
            return [JSON.parse(line)];
          } catch {
            return [];
          }
        })
        .find(
          (row) =>
            row.typedEvent === "OperatorMessageObserved" &&
            ["planning:", "ideation:"].includes(row.prefix),
        );
      if (dispatch)
        return `this session's journal holds a ${dispatch.prefix} dispatch (${dispatch.recordedAt})`;
    }
  }
  for (const kind of ["review", "refutation"]) {
    const pointer = docRelative(
      root,
      "control",
      `local/entropy/current-${kind}.json`,
    );
    try {
      const { path } = JSON.parse(readFileSync(join(root, pointer), "utf8"));
      if (typeof path === "string" && existsSync(join(root, path)))
        return `an entropy ${kind} dispatch is pending in this launchpad (${pointer})`;
    } catch {
      // No pointer, or one naming no pending file, holds no dispatch.
    }
  }
  return null;
}
/** Admit an update: under a hold the operator's in-session request must be
 * named by its capture, unless this instance elects features.auto-update-upstream,
 * its standing opt-out of that rule; either admission is journaled in the
 * session journal that holds the dispatch, the request with its capture's
 * hash and the election by name. Without a hold the update runs as before,
 * and a request given anyway is still recorded. Only a recorded request is
 * returned, for the sibling receipt; the election is no operator request. */
function admitUpdate(root, command, operatorRequest, write) {
  const hold = updateDispatchHold(root);
  if (!hold && !operatorRequest) return null;
  const journal = (fields) => {
    const session = dispatchSession();
    if (!session) return;
    const file = sessionJournalFile(root, session);
    mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
    appendFileSync(
      file,
      `${JSON.stringify({
        recordedAt: new Date().toISOString(),
        event: "LaunchpadUpdateAdmitted",
        session: sha256Hex(session),
        command,
        hold,
        ...fields,
      })}\n`,
      { mode: 0o600 },
    );
  };
  if (!operatorRequest) {
    if (readFeatures(root)["auto-update-upstream"]) {
      journal({ election: "features.auto-update-upstream" });
      write?.(
        `${command} admitted under ${hold}: features.auto-update-upstream is on\n`,
      );
      return null;
    }
    throw new Error(
      `${command} refused: ${hold}; no planning or entropy pass takes a newer starter release or merges upstream unless the operator asks for it in that session. Record the operator's in-session request with ${UPDATE_REQUEST_FLAGS} and rerun.`,
    );
  }
  const request = requireOperatorCapture(
    root,
    operatorRequest.capture,
    operatorRequest.captureHash,
  );
  journal(request);
  write?.(
    `operator request recorded: ${request.capture} ${request.captureHash}\n`,
  );
  return { ...request, hold };
}
/** The `--operator-request --capture <file> --capture-hash <digest>` flags
 * any update form may carry, taken out of its arguments. */
const takeOperatorRequest = (args) => {
  const at = args.indexOf("--operator-request");
  if (at < 0) return { args, operatorRequest: null };
  const rest = [...args];
  rest.splice(at, 1);
  const values = {};
  for (const flag of ["--capture", "--capture-hash"]) {
    const index = rest.indexOf(flag);
    if (index < 0 || !rest[index + 1] || rest[index + 1].startsWith("--"))
      throw new Error(`--operator-request needs ${flag} <value>`);
    values[flag] = rest.splice(index, 2)[1];
  }
  return {
    args: rest,
    operatorRequest: {
      capture: values["--capture"],
      captureHash: values["--capture-hash"],
    },
  };
};

/** Finish an operator-merged update without changing a refused checkout. */
export function finishUpdate(
  root,
  write = (text) => process.stdout.write(text),
  { fetchTimeoutMs, operatorRequest = null } = {},
) {
  root = realpathSync(root);
  const read = (args) => runGit(root, ["--no-optional-locks", ...args]);
  const ready = () => {
    if (realpathSync(read(["rev-parse", "--show-toplevel"])) !== root)
      throw new Error("update --finish requires the physical Git root");
    const branch = read(["rev-parse", "--abbrev-ref", "HEAD"]);
    if (branch !== "main")
      throw new Error(
        `update --finish requires main; current checkout is ${branch}`,
      );
    if (read(["status", "--porcelain", "--untracked-files=all"]))
      throw new Error(
        "update --finish requires a clean tree; checkout is dirty",
      );
  };
  ready();
  admitUpdate(root, "update --finish", operatorRequest, write);
  const origins = read(["remote", "get-url", "--all", "origin"])
    .split("\n")
    .filter(Boolean);
  if (origins.length !== 1)
    throw new Error("update --finish requires exactly one origin fetch URL");
  // Local paths are relative to this checkout, while URLs, scp spellings
  // and explicit transport helpers retain their transport interpretation.
  const origin = /^[^/]+:/u.test(origins[0])
    ? origins[0]
    : resolve(root, origins[0]);
  const before = read(["rev-parse", "HEAD"]);
  let downloaded = true;
  const fetchMain = (options) => {
    try {
      return fetchIntoCheckout(root, origin, "main", options);
    } catch (error) {
      if (!error.boundMs) throw error;
      throw new Error(
        [
          `update --finish refused: reading origin main passed its bound of ${formatDuration(error.boundMs)} (--fetch-timeout ${Math.ceil(error.boundMs / 1000)}); checkout preserved. Raise the bound or finish by hand:`,
          "  git fetch origin main",
          "  git merge --ff-only origin/main",
          "  node scripts/bootstrap.mjs",
        ].join("\n"),
      );
    }
  };
  const commit = fetchMain({
    ...(fetchTimeoutMs ? { timeoutMs: fetchTimeoutMs } : {}),
    beforeImport(inLane, _commit, { fetched }) {
      downloaded = fetched;
      inLane(["fetch", "--quiet", "--no-tags", root, "HEAD:refs/heads/local"]);
      // rev-list returns a count, so a divergence is an ordinary named
      // refusal, not an opaque failing merge command.
      if (
        inLane([
          "rev-list",
          "--count",
          "refs/heads/local",
          "--not",
          "refs/heads/fetched",
        ]) !== "0"
      )
        throw new Error(
          "update --finish refused: main is not a fast-forward to origin/main; checkout preserved",
        );
      ready();
      if (read(["rev-parse", "HEAD"]) !== before)
        throw new Error(
          "update --finish refused: main changed during fetch; retry from the current checkout",
        );
    },
  });
  write(
    downloaded
      ? "Fetched origin main; fast-forward checked before checkout writes.\n"
      : "The checkout already holds origin main, so nothing was fetched; fast-forward checked before checkout writes.\n",
  );
  runGit(root, ["update-ref", "refs/remotes/origin/main", commit]);
  runGit(root, ["merge", "--ff-only", "origin/main"]);
  write("Fast-forwarded main to origin/main.\n");
  const steps = bootstrapWorktree(root);
  write(`Prepared main with bootstrap (${steps} preparation steps).\n`);
  return { before, commit, steps };
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
  // Above the file sections: each incoming floor this host does not meet.
  lines.push(...(planned.floors ?? []));
  if (planned.pruneSummary) lines.push(planned.pruneSummary);
  if (planned.operatorRequest)
    lines.push(
      `operator request recorded: ${planned.operatorRequest.capture} ${planned.operatorRequest.captureHash}`,
    );
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
  // Before the kit's rows: the instance's own files a merge would meet.
  if (planned.bothChanged?.unreadable)
    lines.push(
      `instance files both sides changed: unknown (${planned.bothChanged.unreadable})`,
    );
  else if (planned.bothChanged?.paths.length)
    lines.push(
      `instance files both sides changed since their merge base ${shortCommit(planned.bothChanged.base)}, outside the kit's manifest: keep this instance's bytes for each when merging. Git may merge such a file in silence, and update --publish refuses a merge that changed one unless --take names it.`,
      ...planned.bothChanged.paths.map((path) => `both changed: ${path}`),
    );
  else if (planned.bothChanged)
    lines.push("instance files both sides changed: none");
  if (
    planned.plan.some(
      (entry) => entry.reEmitted && entry.path === HARNESS_MANIFEST,
    )
  )
    lines.push(
      `If the merge conflicts in ${HARNESS_MANIFEST}, keep this instance's side: the emit rewrites it under this instance's configuration.`,
    );
  for (const entry of planned.plan)
    lines.push(
      entry.reEmitted
        ? `re-emitted: ${entry.path}`
        : entry.kind === "refuse"
          ? `refused: ${entry.path} (${entry.reason}; ${HARNESS_CHECK_REASONS[entry.harnessCheck] ?? ""}${entry.retained ? `prior hash retained: ${entry.retained.sha256}` : "remains instance-owned; retained hash: none"}${planned.revision && entry.upstreamUnchanged ? "; unchanged upstream; no merge conflict expected" : ""})`
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
    const [action, ...given] = process.argv.slice(2);
    const { args, operatorRequest } = takeOperatorRequest(given);
    const updating = args[0] === "--update";
    const [destination, ...rest] = updating ? args.slice(1) : args;
    const usage = `usage: launchpad export <dir> [--license none] | launchpad export --update <dir> [--apply] [--preview] | launchpad update --finish [<dir>] [--fetch-timeout <seconds>] | launchpad update --publish --title <title> --body-file <path> [--from <revision>] [--take <path>]... | launchpad preview --from <ref> | launchpad verify [<dir>] | launchpad commands; an update under a journaled planning or entropy dispatch adds ${UPDATE_REQUEST_FLAGS}`;
    if (action === "update" && args[0] === "--publish") {
      // Each --take names one file and --from the revision the branch
      // merged; the rest are the two paired flags.
      const takes = [];
      const others = [];
      let from = null;
      for (let at = 1; at < args.length; at++)
        if (args[at] === "--from") {
          const revision = args[++at];
          if (!revision || revision.startsWith("-") || from !== null)
            throw new Error(usage);
          from = revision;
        } else if (args[at] === "--take") {
          // A file whose name opens with two hyphens is named behind ./,
          // which is no part of the path compared.
          const path = args[++at]?.replace(/^\.\//u, "");
          if (
            !path ||
            (args[at].startsWith("--") && !args[at].startsWith("./")) ||
            takes.includes(path)
          )
            throw new Error(usage);
          takes.push(path);
        } else others.push(args[at]);
      const values = pairedFlags(others, ["--title", "--body-file"]);
      if (!values) throw new Error(usage);
      const { url } = await publishUpdate(findLaunchpad(), {
        title: values["--title"],
        bodyFile: values["--body-file"],
        takes,
        from,
        operatorRequest,
      });
      console.log(url);
    } else if (action === "update") {
      const rest = args.slice(1);
      const bound = rest.indexOf("--fetch-timeout");
      const seconds = bound < 0 ? null : rest.splice(bound, 2)[1];
      if (
        args[0] !== "--finish" ||
        rest.length > 1 ||
        rest[0]?.startsWith("--") ||
        (bound >= 0 && !/^[1-9][0-9]*$/u.test(seconds ?? ""))
      )
        throw new Error(usage);
      finishUpdate(rest[0] ?? process.cwd(), undefined, {
        ...(seconds ? { fetchTimeoutMs: Number(seconds) * 1000 } : {}),
        operatorRequest,
      });
    } else if (action === "preview") {
      if (args.length !== 2 || args[0] !== "--from") throw new Error(usage);
      console.log(
        renderUpdatePlan(await previewFromRevision(process.cwd(), args[1]), {
          preview: true,
        }),
      );
    } else if (action === "verify") {
      if (args.length > 1 || args[0]?.startsWith("--")) throw new Error(usage);
      verifyKit(args[0] ?? process.cwd());
    } else if (action === "commands") {
      // The page the kit ships, printed as it is, before any install: it
      // names the kit's own version, which an instance's README does not,
      // and printing it needs no Markdown parser.
      if (args.length) throw new Error(usage);
      const root = findLaunchpad();
      const page = docRelative(root, "docs", "OPERATOR.md");
      if (!existsSync(join(root, page)))
        throw new Error(
          `this launchpad carries no operator commands page at ${page}; a kit release that ships it adds it`,
        );
      process.stdout.write(readFileSync(join(root, page), "utf8"));
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
            // A preview reads and writes nothing, so it needs no request.
            ...(preview ? {} : { operatorRequest }),
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
      for (const line of result.termContext ?? []) console.log(line);
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
