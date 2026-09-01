#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { release as osRelease } from "node:os";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const evidenceCommands = ["npm ci", "npm test", "node packages/skeleton/dist/src/cli.js", "git status --porcelain"];
const templateShape = {
  schemaVersion: 1,
  release: { application: null, commit: null, subject: null, committedAt: null, previousRelease: null, distribution: null },
  workOrder: { id: null, path: null },
  versions: { root: null, components: {} },
  schemas: { eventEnvelope: null, controlLog: null, ir: null, artifactConfiguration: null, transformationSet: null },
  cadence: { evaluable: [], deferred: [] },
  toolchain: { node: null, npm: null, typescript: null, platform: null },
  evidence: [],
  notes: { visiblePayoff: null, critical: [], operatorActions: [], changes: [], changedFiles: [], reviewArtifacts: [], knownLimitations: [] },
};
const sha256 = value => createHash("sha256").update(value).digest("hex");
const execute = (command, args, options = {}) => spawnSync(command, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, ...options });
const outputOf = result => `${result.stdout ?? ""}${result.stderr ?? ""}`;
const failureOf = (result, fallback) => (result.stderr || result.stdout || result.error?.message || fallback).trim();
const runGit = (cwd, args, options = {}) => {
  const result = execute("git", ["-C", cwd, ...args], options);
  if (result.status !== 0) throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
  return result.stdout.trim();
};
const ensureClean = path => {
  const dirty = runGit(path, ["status", "--porcelain", "--untracked-files=all"]);
  if (dirty !== "") throw new Error(`working tree is not clean: ${path} (${dirty.split("\n")[0]})`);
};
const ensureNoIgnoredInfluence = path => {
  const allowed = candidate => candidate.startsWith("docs/intake/") || candidate.split("/").some(segment => segment === "node_modules" || segment === "dist") || basename(candidate) === ".DS_Store" || candidate.endsWith(".tsbuildinfo");
  const ignored = runGit(path, ["ls-files", "--others", "--ignored", "--exclude-standard"]).split("\n").filter(Boolean).filter(candidate => !allowed(candidate));
  if (ignored.length > 0) throw new Error(`main checkout contains ignored material that can contaminate release evidence: ${ignored[0]}`);
};
const containedRegularFile = (path, root) => existsSync(path) && lstatSync(path).isFile() && realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);
const parseWorktrees = root => runGit(root, ["worktree", "list", "--porcelain"]).split("\n\n").filter(Boolean).map(record => Object.fromEntries(record.split("\n").map(line => {
  const at = line.indexOf(" ");
  return at < 0 ? [line, true] : [line.slice(0, at), line.slice(at + 1)];
})));
const mainWorktree = () => {
  const main = parseWorktrees(toolRoot).find(item => item.branch === "refs/heads/main");
  if (!main?.worktree) throw new Error("no main-branch control-plane worktree found");
  return resolve(main.worktree);
};
const semver = value => {
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
  const parts = match?.slice(1).map(Number);
  return parts?.every(Number.isSafeInteger) ? parts : undefined;
};
const compareVersions = (left, right) => {
  const a = semver(left);
  const b = semver(right);
  if (!a || !b) throw new Error(`cannot compare malformed release versions: ${left}, ${right}`);
  for (let index = 0; index < 3; index += 1) if (a[index] !== b[index]) return a[index] - b[index];
  return 0;
};
const localTags = root => {
  const rows = runGit(root, ["for-each-ref", "--format=%(refname:strip=2)%00%(objecttype)%00%(objectname)%00%(*objectname)", "refs/tags"]);
  return new Map(rows.split("\n").filter(Boolean).map(row => {
    const [name, objectType, object, peeled] = row.split("\0");
    return [name, { name, objectType, object, target: peeled || object }];
  }));
};
const remoteTags = root => {
  const rows = runGit(root, ["ls-remote", "--tags", "origin"]);
  const tags = new Map();
  for (const row of rows.split("\n").filter(Boolean)) {
    const [object, ref] = row.split(/\s+/);
    const peeled = /\^\{\}$/.test(ref);
    const name = ref.replace(/^refs\/tags\//, "").replace(/\^\{\}$/, "");
    const prior = tags.get(name) ?? { name };
    tags.set(name, peeled ? { ...prior, target: object, annotated: true } : { ...prior, object, target: prior.target ?? object });
  }
  return tags;
};
const latestVersion = (...maps) => {
  const versions = [...new Set(maps.flatMap(map => [...map.keys()]).filter(name => semver(name)))];
  return versions.sort(compareVersions).at(-1);
};
const assertShape = (actual, expected, path = "$") => {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) throw new Error(`release manifest template has wrong shape at ${path}`);
    return;
  }
  if (expected !== null && typeof expected === "object") {
    if (actual === null || typeof actual !== "object" || Array.isArray(actual)) throw new Error(`release manifest template has wrong shape at ${path}`);
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    if (expectedKeys.length !== actualKeys.length || expectedKeys.some((key, index) => key !== actualKeys[index])) throw new Error(`release manifest template has wrong fields at ${path}`);
    for (const key of expectedKeys) assertShape(actual[key], expected[key], `${path}.${key}`);
  }
};
const parseControlState = root => {
  const result = execute(process.execPath, [join(root, "scripts/resume.mjs"), "status"], { cwd: root });
  if (result.status !== 0) throw new Error(`cannot read control state: ${failureOf(result, "resume status failed")}`);
  const read = label => new RegExp(`^- ${label}: (.+)$`, "m").exec(result.stdout)?.[1];
  return { workOrderId: read("Work order"), workOrderPath: read("Work-order path"), phase: read("Phase") };
};
const paragraph = (markdown, label) => {
  const match = new RegExp(`\\*\\*${label}:\\*\\*\\s+([^\\n]+(?:\\n(?!\\n|\\*\\*|#)[^\\n]+)*)`).exec(markdown);
  return match?.[1].replace(/\s+/g, " ").trim();
};
const workOrderAuthority = (root, state) => {
  if (!/^WO-\d{3}$/.test(state.workOrderId ?? "") || state.phase !== "closed") throw new Error(`release close requires a closed work order; observed ${state.workOrderId ?? "none"} in phase ${state.phase ?? "unknown"}`);
  const authorityRoot = join(root, "docs/work-orders");
  const path = resolve(root, state.workOrderPath ?? "");
  if (!path.startsWith(`${authorityRoot}${sep}`) || !containedRegularFile(path, authorityRoot) || !basename(path).startsWith(`${state.workOrderId}-`)) throw new Error(`invalid closed work-order authority path: ${state.workOrderPath ?? "none"}`);
  const markdown = readFileSync(path, "utf8");
  const heading = markdown.split("\n", 1)[0];
  const versions = [...heading.matchAll(/\bv\d+(?:\.\d+){2}\b/g)].map(match => match[0]);
  if (versions.length !== 1 || !semver(versions[0])) throw new Error(`work-order heading must contain exactly one strict vX.Y.Z version: ${heading}`);
  return {
    id: state.workOrderId,
    path: state.workOrderPath,
    version: versions[0],
    title: heading.replace(/^#\s*/, ""),
    objective: paragraph(markdown, "Objective") ?? "No objective paragraph was found in the work-order authority.",
    nonGoals: paragraph(markdown, "Non-goals") ?? "No non-goals paragraph was found in the work-order authority.",
  };
};
const packageVersions = root => {
  const packageRoot = join(root, "packages");
  const components = {};
  for (const directory of readdirSync(packageRoot, { withFileTypes: true }).filter(item => item.isDirectory()).map(item => item.name).sort()) {
    const path = join(packageRoot, directory, "package.json");
    if (!existsSync(path)) continue;
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    if (typeof manifest.name !== "string" || typeof manifest.version !== "string") throw new Error(`component package lacks name/version: ${path}`);
    components[manifest.name] = manifest.version;
  }
  const rootPackage = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  return { root: typeof rootPackage.version === "string" ? rootPackage.version : null, components };
};
const exactSchemaVersion = (source, pattern, name) => {
  const match = pattern.exec(source);
  if (!match) throw new Error(`cannot derive ${name} schema version from source`);
  return Number(match[1]);
};
const compatibility = root => {
  const types = readFileSync(join(root, "packages/kernel/src/types.ts"), "utf8");
  const control = readFileSync(join(root, "scripts/resume.mjs"), "utf8");
  const core = readFileSync(join(root, "packages/kernel/src/core.ts"), "utf8");
  const eventEnvelope = exactSchemaVersion(types, /export interface EventEnvelope[^\{]*\{\s*readonly schemaVersion:\s*(\d+)/s, "event-envelope");
  const controlLog = exactSchemaVersion(control, /const record = \{ schemaVersion:\s*(\d+), \.\.\.event \}/, "control-log");
  const cadenceUnion = /export namespace Cadence\s*\{\s*export type T = ([^;]+);/s.exec(types)?.[1];
  if (!cadenceUnion) throw new Error("cannot derive cadence kinds from source");
  const allKinds = cadenceUnion.split("|").map(value => value.trim()).filter(Boolean);
  const cadenceSwitch = /export function evaluateCadence[\s\S]+?switch \(cadence\.kind\) \{([\s\S]+?)\n\s*\}/.exec(core)?.[1];
  if (!cadenceSwitch) throw new Error("cannot derive cadence evaluator cases from source");
  const evaluable = [...cadenceSwitch.matchAll(/case "([^"]+)"/g)].map(match => match[1]);
  return {
    schemas: {
      eventEnvelope: { min: eventEnvelope, max: eventEnvelope },
      controlLog: { min: controlLog, max: controlLog },
      ir: null,
      artifactConfiguration: null,
      transformationSet: null,
    },
    cadence: { evaluable, deferred: allKinds.filter(kind => !evaluable.includes(kind)) },
  };
};
const versionOutput = (command, args, cwd, label) => {
  const result = execute(command, args, { cwd });
  if (result.status !== 0) throw new Error(`cannot derive ${label}: ${failureOf(result, `${command} failed`)}`);
  return result.stdout.trim();
};
const toolchain = root => {
  const typescript = versionOutput(join(root, "node_modules/.bin/tsc"), ["--version"], root, "TypeScript version").replace(/^Version\s+/, "");
  const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  const lockedTypescript = lock.packages?.["node_modules/typescript"]?.version ?? lock.packages?.[""]?.devDependencies?.typescript;
  if (typescript !== lockedTypescript) throw new Error(`installed TypeScript ${typescript} does not match lockfile ${lockedTypescript ?? "missing"}`);
  return { node: process.version, npm: versionOutput("npm", ["--version"], root, "npm version"), typescript, platform: `${process.platform} ${osRelease()}` };
};
const gitIdentity = root => ({
  commit: runGit(root, ["rev-parse", "HEAD"]),
  subject: runGit(root, ["log", "-1", "--format=%s"]),
  committedAt: runGit(root, ["log", "-1", "--format=%cI"]),
});
const changedSubjects = (root, previousRelease) => {
  const range = previousRelease ? `${previousRelease}..HEAD` : "HEAD";
  return runGit(root, ["log", "--reverse", "--format=%s", range]).split("\n").filter(Boolean);
};
const changedFiles = (root, previousRelease) => {
  const args = previousRelease ? ["diff", "--name-only", `${previousRelease}..HEAD`] : ["ls-tree", "-r", "--name-only", "HEAD"];
  return runGit(root, args).split("\n").filter(Boolean).sort();
};
const reviewArtifacts = (root, workOrderId) => ["docs/verifications", "docs/final-reviews"].flatMap(parent => {
  const directory = join(root, parent, workOrderId);
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter(name => name.endsWith(".md") && containedRegularFile(join(directory, name), directory)).sort().map(name => `${parent}/${workOrderId}/${name}`);
});
const criticalNotes = files => {
  const notes = ["Source-only release: no package, binary, container, or hosted artifact is published."];
  if (files.some(path => /^packages\/[^/]+\/package\.json$/.test(path))) notes.push("Component version metadata changed; inspect the manifest's separate version axes.");
  if (files.some(path => path === "packages/kernel/src/types.ts" || /schema|compatibility/i.test(path))) notes.push("Schema or compatibility surfaces changed; inspect the manifest ranges and complete changed-file list.");
  if (files.some(path => /^scripts\/(resume|worktree|release)\./.test(path))) notes.push("Workflow authority, recovery, or publication tooling changed; inspect the operator guide and release evidence.");
  if (files.includes("package-lock.json")) notes.push("The locked dependency graph changed; release evidence was run after a fresh npm ci.");
  return notes;
};
const baseManifest = (root, authority, previousRelease, evidence, recordedToolchain) => {
  const templatePath = join(root, "docs/releases/tag-manifest.template.json");
  const template = JSON.parse(readFileSync(templatePath, "utf8"));
  if (template.schemaVersion !== 1) throw new Error(`unsupported release manifest template: ${templatePath}`);
  assertShape(template, templateShape);
  const identity = gitIdentity(root);
  const compatible = compatibility(root);
  const files = changedFiles(root, previousRelease);
  return {
    ...template,
    release: { ...template.release, application: authority.version, commit: identity.commit, subject: identity.subject, committedAt: identity.committedAt, previousRelease: previousRelease ?? null, distribution: "source-only" },
    workOrder: { ...template.workOrder, id: authority.id, path: authority.path },
    versions: { ...template.versions, ...packageVersions(root) },
    ...compatible,
    toolchain: { ...template.toolchain, ...(recordedToolchain ?? toolchain(root)) },
    evidence,
    notes: {
      visiblePayoff: authority.objective,
      critical: criticalNotes(files),
      operatorActions: ["Read the compatibility fields and known limitations before consuming this source release."],
      changes: changedSubjects(root, previousRelease),
      changedFiles: files,
      reviewArtifacts: reviewArtifacts(root, authority.id),
      knownLimitations: [authority.nonGoals],
    },
  };
};
const firstDifference = (expected, actual, path = "$") => {
  if (Object.is(expected, actual)) return undefined;
  if (typeof expected !== "object" || expected === null || typeof actual !== "object" || actual === null) return path;
  if (Array.isArray(expected) !== Array.isArray(actual)) return path;
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (expectedKeys.length !== actualKeys.length || expectedKeys.some((key, index) => key !== actualKeys[index])) return `${path}<keys>`;
  for (const key of expectedKeys) {
    const difference = firstDifference(expected[key], actual[key], `${path}${Array.isArray(expected) ? `[${key}]` : `.${key}`}`);
    if (difference) return difference;
  }
  return undefined;
};
const validateEvidence = evidence => {
  if (!Array.isArray(evidence) || evidence.length !== evidenceCommands.length) throw new Error("manifest evidence rows do not match the declared release gate");
  evidence.forEach((row, index) => {
    if (row.command !== evidenceCommands[index] || row.exitCode !== 0 || !/^[a-f0-9]{64}$/.test(row.outputSha256 ?? "")) throw new Error(`invalid evidence row ${index + 1}: ${evidenceCommands[index]}`);
  });
};
const validateManifest = (root, manifest) => {
  validateEvidence(manifest.evidence);
  const state = parseControlState(root);
  const authority = workOrderAuthority(root, state);
  const expected = baseManifest(root, authority, manifest.release?.previousRelease ?? undefined, manifest.evidence);
  const difference = firstDifference(expected, manifest);
  if (difference) throw new Error(`release manifest differs from repository truth at ${difference}`);
  return manifest;
};
const validatePublishedManifest = (root, manifest) => {
  validateEvidence(manifest.evidence);
  const recorded = manifest.toolchain;
  const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  const lockedTypescript = lock.packages?.["node_modules/typescript"]?.version ?? lock.packages?.[""]?.devDependencies?.typescript;
  if (!recorded || !/^v\d+/.test(recorded.node ?? "") || !/^\d+\.\d+\.\d+/.test(recorded.npm ?? "") || recorded.typescript !== lockedTypescript || typeof recorded.platform !== "string" || recorded.platform.length === 0) throw new Error("published manifest contains an invalid recorded toolchain");
  const state = parseControlState(root);
  const authority = workOrderAuthority(root, state);
  const expected = baseManifest(root, authority, manifest.release?.previousRelease ?? undefined, manifest.evidence, recorded);
  const difference = firstDifference(expected, manifest);
  if (difference) throw new Error(`published manifest differs from tagged source truth at ${difference}`);
  return manifest;
};
const evidenceRow = (root, command, executable, args) => {
  process.stdout.write(`Running ${command}...\n`);
  const result = execute(executable, args, { cwd: root });
  const output = outputOf(result);
  if (result.status !== 0) {
    const tail = output.trim().slice(-1600);
    throw new Error(`${command} failed (exit ${result.status ?? "spawn"})${tail ? `:\n${tail}` : ""}`);
  }
  return { command, exitCode: 0, outputSha256: sha256(output) };
};
const runEvidence = root => {
  const evidence = [];
  evidence.push(evidenceRow(root, evidenceCommands[0], "npm", ["ci"]));
  ensureClean(root);
  evidence.push(evidenceRow(root, evidenceCommands[1], "npm", ["test"]));
  ensureClean(root);
  evidence.push(evidenceRow(root, evidenceCommands[2], process.execPath, [join(root, "packages/skeleton/dist/src/cli.js")]));
  ensureClean(root);
  const cleanOutput = runGit(root, ["status", "--porcelain"]);
  evidence.push({ command: evidenceCommands[3], exitCode: 0, outputSha256: sha256(cleanOutput) });
  return evidence;
};
const tagMessage = manifest => {
  const notes = manifest.notes;
  const changes = notes.changes.length > 0 ? notes.changes.map(change => `- ${change}`).join("\n") : "- No commit subjects were found after the preceding release.";
  const reviews = notes.reviewArtifacts.length > 0 ? notes.reviewArtifacts.map(path => `- ${path}`).join("\n") : "- No work-order review artifacts were found in the tagged commit.";
  return `DotLn ${manifest.release.application}\n\n## Visible payoff\n\n${notes.visiblePayoff}\n\n## Critical information\n\n${notes.critical.map(item => `- ${item}`).join("\n")}\n\n## Operator actions\n\n${notes.operatorActions.map(item => `- ${item}`).join("\n")}\n\n## Changes\n\n${changes}\n\n## Known limitations\n\n${notes.knownLimitations.map(item => `- ${item}`).join("\n")}\n\n## Review lineage\n\n${reviews}\n\nThe canonical JSON manifest below contains the complete changed-file list.\n\nDOTLN-MANIFEST-BEGIN\n${JSON.stringify(manifest, null, 2)}\nDOTLN-MANIFEST-END\n`;
};
const tagContents = (root, tag) => runGit(root, ["cat-file", "-p", tag]);
const manifestFromTag = (root, tag) => {
  const object = tagContents(root, tag);
  const match = /DOTLN-MANIFEST-BEGIN\n([\s\S]+)\nDOTLN-MANIFEST-END/.exec(object);
  if (!match) throw new Error(`${tag} does not contain a DotLn release manifest`);
  try { return JSON.parse(match[1]); } catch { throw new Error(`${tag} contains invalid manifest JSON`); }
};
const ensureExistingRelease = (root, tag, head, local, remote) => {
  const localTag = local.get(tag);
  const remoteTag = remote.get(tag);
  if (!remoteTag) throw new Error(`${tag} exists only locally; inspect it and publish or remove it manually`);
  if (!remoteTag.annotated || remoteTag.target !== head) throw new Error(`${tag} already exists remotely for a different or non-annotated object`);
  if (localTag && (localTag.objectType !== "tag" || localTag.target !== head || localTag.object !== remoteTag.object)) throw new Error(`${tag} differs between local and origin`);
  if (!localTag) runGit(root, ["fetch", "origin", `refs/tags/${tag}:refs/tags/${tag}`]);
  const manifest = validatePublishedManifest(root, manifestFromTag(root, tag));
  const object = tagContents(root, tag);
  const message = object.slice(object.indexOf("\n\n") + 2);
  if (message !== tagMessage(manifest).trimEnd()) throw new Error(`${tag} annotation differs from its generated manifest and notes`);
};
const publishedTag = (name, local, remote) => {
  const remoteTag = remote.get(name);
  const localTag = local.get(name);
  if (!remoteTag?.annotated) throw new Error(`latest published version ${name} is absent or is not an annotated origin tag`);
  if (localTag && (localTag.objectType !== "tag" || localTag.object !== remoteTag.object || localTag.target !== remoteTag.target)) throw new Error(`${name} differs between local and origin`);
  return remoteTag;
};
const updateMainAndFinish = (root, workOrderId) => {
  ensureClean(root);
  ensureNoIgnoredInfluence(root);
  if (runGit(root, ["symbolic-ref", "--short", "HEAD"]) !== "main") throw new Error("release close must run from the main branch checkout");
  const branch = `wo-${workOrderId.slice(3)}`;
  const subject = parseWorktrees(root).find(item => item.branch === `refs/heads/${branch}`);
  if (subject?.worktree) {
    const finished = execute(process.execPath, [join(root, "scripts/worktree.mjs"), "finish", workOrderId], { cwd: root });
    if (finished.status !== 0) throw new Error(`cannot finish merged worktree: ${failureOf(finished, "worktree finish failed")}`);
    process.stdout.write(finished.stdout);
  } else {
    runGit(root, ["fetch", "origin", "main"]);
    runGit(root, ["merge", "--ff-only", "origin/main"]);
    const localBranch = runGit(root, ["branch", "--list", branch]);
    if (localBranch) {
      const merged = execute("git", ["-C", root, "merge-base", "--is-ancestor", branch, "origin/main"]);
      if (merged.status !== 0) throw new Error(`${branch} exists locally but is not merged into origin/main`);
      const upstream = execute("git", ["-C", root, "rev-parse", "--verify", `${branch}@{upstream}`]);
      if (upstream.status === 0) runGit(root, ["branch", "--unset-upstream", branch]);
      runGit(root, ["branch", "-d", branch]);
    }
  }
  ensureClean(root);
  const head = runGit(root, ["rev-parse", "HEAD"]);
  const originMain = runGit(root, ["rev-parse", "origin/main"]);
  if (head !== originMain) throw new Error(`main is not synchronized with origin/main (${head} != ${originMain})`);
};
const publishTag = (root, tag, commit, message, tagger) => {
  const body = `object ${commit}\ntype commit\ntag ${tag}\ntagger ${tagger}\n\n${message}`;
  const made = execute("git", ["-C", root, "mktag"], { input: body });
  if (made.status !== 0) throw new Error(`cannot create annotated tag object: ${failureOf(made, "git mktag failed")}`);
  const object = made.stdout.trim();
  const pushed = execute("git", ["-C", root, "push", "--no-follow-tags", "origin", `${object}:refs/tags/${tag}`]);
  if (pushed.status !== 0) throw new Error(`tag push failed; no local tag ref was created: ${failureOf(pushed, "git push failed")}`);
  runGit(root, ["update-ref", `refs/tags/${tag}`, object, ""]);
  return object;
};
const close = (workOrderId, args) => {
  if (!/^WO-\d{3}$/.test(workOrderId ?? "") || args.some(arg => arg !== "--publish") || args.filter(arg => arg === "--publish").length > 1) throw new Error("usage: release close WO-NNN [--publish]");
  const publish = args.includes("--publish");
  const root = mainWorktree();
  if (resolve(process.cwd()) !== root) throw new Error(`release close must run from the main control-plane checkout: ${root}`);
  updateMainAndFinish(root, workOrderId);
  const state = parseControlState(root);
  if (state.workOrderId !== workOrderId) throw new Error(`merged control state is for ${state.workOrderId ?? "none"}, not ${workOrderId}`);
  const authority = workOrderAuthority(root, state);
  const local = localTags(root);
  const remote = remoteTags(root);
  const latest = latestVersion(remote);
  const head = runGit(root, ["rev-parse", "HEAD"]);
  const previous = latest ? publishedTag(latest, local, remote) : undefined;
  if (latest && compareVersions(authority.version, latest) < 0) {
    process.stdout.write(`${workOrderId} closes ${authority.version}, below latest release ${latest}; no release tag is due. Main is clean and between work orders.\n`);
    return;
  }
  if (latest && compareVersions(authority.version, latest) === 0) {
    ensureExistingRelease(root, authority.version, head, local, remote);
    process.stdout.write(`${authority.version} is already published from ${head}; main is clean and between work orders.\n`);
    return;
  }
  if (latest) {
    const ancestor = execute("git", ["-C", root, "merge-base", "--is-ancestor", previous.target, head]);
    if (ancestor.status !== 0) throw new Error(`latest release ${latest} is not an ancestor of ${head}`);
  }
  if (local.has(authority.version) || remote.has(authority.version)) throw new Error(`release tag already exists: ${authority.version}`);
  const tagger = publish ? runGit(root, ["var", "GIT_COMMITTER_IDENT"]) : undefined;
  const evidence = runEvidence(root);
  const manifest = validateManifest(root, baseManifest(root, authority, latest, evidence));
  const message = tagMessage(manifest);
  if (!publish) {
    process.stdout.write(`Prepared and validated ${authority.version} for ${head}. To create and push only the annotated tag, run:\n  npm run release -- close ${workOrderId} --publish\n`);
    return;
  }
  const tagObject = publishTag(root, authority.version, head, message, tagger);
  ensureClean(root);
  process.stdout.write(`Published annotated ${authority.version} (${tagObject}) for ${head}. Main is clean and between work orders.\n`);
};

const main = () => {
  const [action, ...args] = process.argv.slice(2);
  if (action === "close") return close(args[0], args.slice(1));
  if (action === "validate") {
    const [path] = args;
    if (!path || args.length !== 1) throw new Error("usage: release validate <manifest.json>");
    validateManifest(toolRoot, JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8")));
    process.stdout.write(`Validated ${path}.\n`);
    return;
  }
  if (action === "manifest-from-tag") {
    const [tag] = args;
    if (!tag || args.length !== 1) throw new Error("usage: release manifest-from-tag vX.Y.Z");
    process.stdout.write(`${JSON.stringify(manifestFromTag(toolRoot, tag), null, 2)}\n`);
    return;
  }
  throw new Error("usage: release close WO-NNN [--publish] | release validate <manifest.json> | release manifest-from-tag vX.Y.Z");
};

try { main(); } catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
