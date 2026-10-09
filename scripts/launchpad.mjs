#!/usr/bin/env node
// `launchpad export <dir>` materializes a launchpad instance from a
// manifest-listed kit read as Git blobs at the HEAD commit of the checkout
// that holds the running scripts (TOOL_ROOT), the templates included, so the
// manifest never names a commit that lacks a kit file's source. Kit files land
// in the manifest with their SHA-256; instance seeds are written once and
// never listed. Only the local-terms list is the launchpad's (WO-074).
import {
  TOOL_ROOT,
  defaultDocRelative,
  docRelative,
  findLaunchpad,
} from "./lib/config.mjs";
import { readGitObjects, runGit, runGitPathList } from "./lib/git.mjs";
import { parseGitHubTarget } from "./lib/github-repository.mjs";
import { json, sha256Hex } from "./lib/helpers.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { checkLocalTerms } from "./lib/terms.mjs";
import {
  lstatSync,
  mkdirSync,
  readdirSync,
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
// The build-free workspaces the kit carries, each with its node_modules link
// in the lockfile; WO-075 adds the compiled packages here.
export const KIT_WORKSPACES = Object.freeze(["packages/beacons"]);
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
  files: BUILD_FREE_MODULES,
  licenses: LICENSE_FILES,
  documents: Object.freeze([
    ["docs", "PLAYBOOK.md"],
    ["product", "07-execution-guide.md"],
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
    "The kit carries the execution guide, 07-execution-guide.md, whole. This instance's product overlay lives here as an instance file; core's other product documents are upstream pointers in UPSTREAM.md.",
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
 * dependency pins and engines, the beacons workspace, private. */
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

/** Prune core's lockfile to the kit: the root, packages/beacons and its link,
 * and the closure of the kit's dev dependencies at core's exact pins. */
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

/** The launchpad the copied scripts would resolve from the destination
 * before `git init` runs there: the ascent in scripts/lib/config.mjs stops at
 * an enclosing dotln.config.json or Git top level. */
const enclosingLaunchpad = (target) => {
  const resolved = findLaunchpad({ toolRoot: target, env: {} });
  return resolved === target ? null : resolved;
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
  const groups = [
    ["scripts/", kit.filter((file) => file.path.startsWith("scripts/")).length],
    [
      "packages/beacons/",
      kit.filter((file) => file.path.startsWith("packages/beacons/")).length,
    ],
  ];
  const rest = kit.filter(
    (file) => !groups.some(([prefix]) => file.path.startsWith(prefix)),
  );
  return [
    "# Upstream",
    "",
    "This launchpad was exported from DotLn core by `launchpad export`. The kit is the",
    "manifest-listed set: its verbatim files are Git blobs at the commit below, and",
    "`package.json`, `package-lock.json` and this file are generated from them; nothing",
    "was read from a work tree.",
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
      ([prefix, count]) =>
        `- \`${prefix}**\`: ${count} files, byte-identical to the commit`,
    ),
    ...rest.map((file) => `- \`${file.path}\``),
    "",
    "## Instance seeds",
    "",
    "Written once by the export, owned by this instance and never manifest-listed:",
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

const rootReadme = (key, convention) =>
  `# ${defaultDocRelative(key)}\n\n${convention}\n`;

/** Export the kit of `root`'s HEAD into `destination`; `root` is the checkout
 * that holds the scripts (TOOL_ROOT from the command line) and `launchpad`
 * the one whose local-terms list judges the texts. Refuses before any write:
 * a non-empty or unreadable destination, a kit file absent at the commit, and
 * a local-terms refusal. Returns what it wrote. */
export function exportKit(
  root,
  destination,
  { license = "default", launchpad = root } = {},
) {
  if (!["default", "none"].includes(license))
    throw new Error(`unknown license option: ${license}`);
  const target = checkDestination(destination);
  const commit = runGit(root, ["rev-parse", "HEAD"]);
  const { tag, nearest } = describeTag(root, commit);
  const forge = originTarget(root);
  const sources = readKitSources(root, commit, { license });
  const dirty = dirtyKitPathCount(root, sources);
  const enclosing = enclosingLaunchpad(target);
  const corePackage = JSON.parse(
    sources.get("package.json").bytes.toString("utf8"),
  );
  const coreLock = JSON.parse(
    sources.get("package-lock.json").bytes.toString("utf8"),
  );
  const packageJson = kitPackage(corePackage, { license });
  const lock = kitLockfile(coreLock, packageJson);
  const template = (name) =>
    sources.get(`${KIT_TEMPLATES}/${name}`).bytes.toString("utf8");

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
  addKit("package.json", json(packageJson));
  addKit("package-lock.json", json(lock));
  addKit("dotln.config.example.json", template("dotln.config.example.json"));
  if (license === "none")
    addKit(LICENSE_PENDING, template("pending-license.template.md"));

  // A fork edits its front door, its ignore rules and its contract: seeds,
  // whose upstream sources stay kit files under scripts/kit for a later
  // revision to refresh (WO-077).
  addSeed("README.md", template("README.client.md"));
  addSeed(".gitignore", template("gitignore.template"));
  addSeed("CLAUDE.md", template("CLAUDE.template.md"));
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
  // before any write, reported by file and line.
  const surfaces = [];
  for (const { path, bytes } of [
    ...writes,
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
  symlinkSync("CLAUDE.md", join(target, "AGENTS.md"));
  writeFileSync(join(target, KIT_MANIFEST), manifestBytes);
  return {
    destination: target,
    commit,
    tag,
    nearest,
    files: manifest.files.length,
    seeds: [...seeds, "AGENTS.md"],
    surfaces: surfaces.length,
    terms: terms.status,
    dirty,
    enclosing,
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
    const result = exportKit(TOOL_ROOT, destination, {
      license,
      launchpad: findLaunchpad(),
    });
    console.log(
      `Exported the DotLn kit of ${result.commit} (${result.tag ? `tag ${result.tag}` : "untagged"}) to ${result.destination}: ${result.files} kit files in ${KIT_MANIFEST}, ${result.seeds.length} instance seeds.`,
    );
    console.log(
      `local-terms list: ${result.terms}${result.terms === "present" ? ` (${result.surfaces} texts checked)` : "; no text was checked against a local-terms list"}`,
    );
    if (result.dirty)
      console.log(
        `advisory: ${result.dirty} kit ${result.dirty === 1 ? "path differs" : "paths differ"} from HEAD in the work tree; the export carries commit ${result.commit}, not those changes.`,
      );
    if (result.enclosing)
      console.log(
        `advisory: the destination lies inside the Git work tree ${result.enclosing}; run git init in the export before any control-plane command, or its scripts resolve that repository as their launchpad.`,
      );
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
