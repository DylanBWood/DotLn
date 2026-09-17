import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmdirSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  canonicalStringify,
  fnv1a64,
  HARNESS_START,
  HARNESS_END,
  lowerToHarness,
  mergeHarnessFragments,
} from "../../packages/compiler/dist/src/index.js";
import {
  contributorConfiguredProgram,
  contributorProfiles,
  targetWorkerProfiles,
} from "../../packages/skeleton/dist/src/loadouts/contributor.js";
import { personalFeedback } from "../../packages/skeleton/dist/src/loadouts/feedback.js";
import { checkLocalTerms } from "./terms.mjs";
import { containedRegularFile } from "./paths.mjs";

const manifestPath = ".claude/harness-manifest.json";
const hash = (text) => `fnv1a64:${fnv1a64(text)}`;
const allowed = (path) =>
  path === "CLAUDE.md" ||
  path === ".claude/settings.json" ||
  path === manifestPath ||
  /^\.(?:claude|agents)\/skills\/dotln-[a-z-]+\/SKILL\.md$/.test(path) ||
  /^\.claude\/hooks\/[a-z0-9.-]+\.mjs$/.test(path);
const contained = (root, path) => {
  if (!allowed(path))
    throw new Error("harness output path is not a generated surface");
  const absolute = resolve(root, path);
  let parent = existsSync(absolute) ? absolute : dirname(absolute);
  while (!existsSync(parent)) parent = dirname(parent);
  const physical = realpathSync(parent);
  if (physical !== root && !physical.startsWith(`${root}${sep}`))
    throw new Error("harness output escapes through a symlink");
  if (existsSync(absolute) && !lstatSync(absolute).isFile())
    throw new Error("harness output must be a regular file");
  return absolute;
};
export function harnessInstructionBlock(text) {
  const starts = text.split(HARNESS_START).length - 1;
  const ends = text.split(HARNESS_END).length - 1;
  if (
    starts !== 1 ||
    ends !== 1 ||
    text.indexOf(HARNESS_END) < text.indexOf(HARNESS_START)
  )
    throw new Error("harness instruction requires one ordered marker pair");
  return (
    text.slice(
      text.indexOf(HARNESS_START),
      text.indexOf(HARNESS_END) + HARNESS_END.length,
    ) + "\n"
  );
}
export function harnessInstallation(options = {}) {
  if (options.loadout && options.loadout !== "contributor")
    throw new Error("unknown harness loadout");
  const profiles = contributorProfiles.filter(
    (profile) => !options.profile || profile.profileId === options.profile,
  );
  if (!profiles.length) throw new Error("unknown harness profile");
  const program =
    options.program ?? contributorConfiguredProgram(options.supports);
  const feedback = options.feedback ?? personalFeedback();
  const sourceRoot =
    options.runtimeRoot ?? fileURLToPath(new URL("../../", import.meta.url));
  const runtimeFiles = [
    // Admission compares this module's compiler version. A compiler-only
    // release must install a fresh snapshot even when hook handlers are equal.
    "packages/compiler/dist/src/artifact-identity.js",
    "packages/compiler/dist/src/harness.js",
    "packages/compiler/dist/src/feedback.js",
    "packages/compiler/dist/src/attribution.mjs",
    "packages/skeleton/dist/src/feedback-boundary.js",
    "packages/skeleton/dist/src/feedback-source-comments.js",
    "packages/skeleton/dist/src/harness-host.js",
    "packages/skeleton/dist/src/version.js",
    "packages/skeleton/dist/src/harness-command.js",
    "packages/skeleton/dist/src/gate-evidence.mjs",
    "packages/skeleton/dist/src/gate-deadlines.mjs",
    "packages/skeleton/dist/src/usage-observation.mjs",
    "packages/skeleton/dist/src/writer-teardown.mjs",
    "packages/skeleton/dist/src/reactor.js",
    "packages/skeleton/dist/src/resident-state.js",
    "packages/skeleton/dist/src/presence-signals.js",
    "packages/skeleton/dist/src/presence-heartbeat.js",
    "packages/skeleton/dist/src/resident-store.js",
    "packages/skeleton/dist/src/worker-store.js",
    "packages/skeleton/dist/src/verification-protocol.js",
    "packages/skeleton/dist/src/plan-refutation-protocol.js",
    "packages/skeleton/dist/src/worker-protocol.js",
    "packages/skeleton/dist/src/presence-machine.js",
    "packages/skeleton/dist/src/actor-catalog.js",
    "packages/skeleton/dist/src/actor-contract.js",
    "packages/skeleton/dist/src/work-candidate.js",
    "packages/skeleton/dist/src/script-episode.js",
    "packages/skeleton/dist/src/discovery-sandbox.js",
    "packages/skeleton/dist/src/discovery-actor.js",
    "packages/skeleton/dist/src/discovery-cli.js",
    "packages/skeleton/dist/src/discovery.js",
  ].map((path) => ({
    path,
    hash: hash(readFileSync(join(sourceRoot, path), "utf8")),
  }));
  const runtimeSnapshot = `.runtime/harness/${fnv1a64(JSON.stringify(runtimeFiles))}`;
  const bundles = profiles.map((profile) =>
    lowerToHarness(program, feedback, program.loadout.authorityEnvelope, {
      ...profile,
      runtime: {
        ...profile.runtime,
        files: runtimeFiles,
        snapshot: runtimeSnapshot,
      },
    }),
  );
  const files = bundles.flatMap((bundle) =>
    bundle.files.filter(
      (file) => !["CLAUDE.md", "AGENTS.md"].includes(file.path),
    ),
  );
  const block = mergeHarnessFragments(bundles);
  const origin = {
    ids: [
      ...new Set(
        bundles.flatMap((bundle) =>
          bundle.residue.items.map((item) => item.originId),
        ),
      ),
    ].sort(),
    loadoutId: program.loadout.loadoutId,
    semanticHash: bundles[0].manifest.loadout.semanticHash,
  };
  files.push({ path: "CLAUDE.md", contents: block, origin, rung: 8 });
  files.sort((a, b) => a.path.localeCompare(b.path, "en"));
  const manifest = {
    contractVersion: "harness-v1",
    compilerPackageVersion: bundles[0].manifest.compilerPackageVersion,
    profiles: bundles.map((bundle) => bundle.manifest),
    installed: files.map(({ path, contents, origin, rung }) => ({
      path,
      hash: hash(contents),
      hashScope: path === "CLAUDE.md" ? "marked-block" : "whole-file",
      origin,
      rung,
    })),
    residue: bundles.map((bundle) => ({
      profileId: bundle.manifest.profile.profileId,
      items: bundle.residue.items,
    })),
    origin: {
      ...origin,
      ids: [
        ...new Set(bundles.flatMap((bundle) => bundle.manifest.origin.ids)),
      ].sort(),
    },
  };
  return {
    files,
    manifest,
    bundles,
    runtimeSnapshot,
    runtimeFiles,
    sourceRoot,
  };
}
const walkOwned = (root) => {
  const paths = [];
  const walk = (directory) => {
    if (!existsSync(directory)) return;
    if (
      !lstatSync(directory).isDirectory() ||
      lstatSync(directory).isSymbolicLink()
    )
      throw new Error("harness owned directory must not be a symlink");
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      if (lstatSync(path).isDirectory()) walk(path);
      else paths.push(relative(root, path));
    }
  };
  walk(join(root, ".claude/hooks"));
  for (const skills of [".claude/skills", ".agents/skills"])
    if (existsSync(join(root, skills)))
      for (const name of readdirSync(join(root, skills)))
        if (name.startsWith("dotln-")) walk(join(root, skills, name));
  return paths;
};
export function emitHarness(root, options = {}) {
  root = realpathSync(root);
  const installation = harnessInstallation(options);
  const writes = installation.files.map((file) => ({
    path: contained(root, file.path),
    contents: file.contents,
  }));
  const instruction = writes.find(
    (file) => file.path === join(root, "CLAUDE.md"),
  );
  const floor = existsSync(instruction.path)
    ? readFileSync(instruction.path, "utf8")
    : options.instructionFloor;
  if (typeof floor !== "string" || !floor.trim())
    throw new Error("harness emit requires the hand-written clean-room floor");
  if (floor.includes(HARNESS_START) || floor.includes(HARNESS_END)) {
    const block = harnessInstructionBlock(floor);
    instruction.contents = floor.replace(
      block.trimEnd(),
      instruction.contents.trimEnd(),
    );
  } else instruction.contents = floor.trimEnd() + "\n\n" + instruction.contents;
  const expected = new Set(installation.files.map((file) => file.path));
  const obsolete = walkOwned(root).filter((path) => !expected.has(path));
  const previous = existsSync(join(root, manifestPath))
    ? JSON.parse(readFileSync(contained(root, manifestPath), "utf8"))
    : null;
  for (const path of obsolete)
    if (
      !previous?.installed?.some((file) => file.path === path) ||
      !allowed(path)
    )
      throw new Error(`unowned harness output refuses replacement: ${path}`);
  // Validate every destination before the first write. Never edit user scope.
  const manifestTarget = contained(root, manifestPath);
  const manifestText = JSON.stringify(installation.manifest, null, 2) + "\n";
  const localTerms = checkLocalTerms(options.termsRoot ?? root, [
    ...writes.map((file) => ({
      name: relative(root, file.path),
      text: file.contents,
    })),
    { name: manifestPath, text: manifestText },
  ]);
  preserveHarnessRuntime(root, installation);
  for (const file of writes) {
    if (
      existsSync(file.path) &&
      readFileSync(file.path, "utf8") === file.contents
    )
      continue;
    mkdirSync(dirname(file.path), { recursive: true });
    writeFileSync(file.path, file.contents);
  }
  for (const path of obsolete) unlinkSync(contained(root, path));
  mkdirSync(dirname(manifestTarget), { recursive: true });
  if (
    !existsSync(manifestTarget) ||
    readFileSync(manifestTarget, "utf8") !== manifestText
  )
    writeFileSync(manifestTarget, manifestText);
  return { files: writes.length + 1, localTerms };
}

export function preserveHarnessRuntime(
  root,
  installation = harnessInstallation(),
) {
  const snapshot = installation.runtimeSnapshot;
  const destination = join(root, snapshot);
  for (const path of [".runtime", ".runtime/harness", snapshot])
    if (
      existsSync(join(root, path)) &&
      lstatSync(join(root, path)).isSymbolicLink()
    )
      throw new Error(
        "Harness runtime snapshot must remain inside its worktree",
      );
  if (existsSync(destination)) {
    for (const file of installation.runtimeFiles)
      if (
        hash(readFileSync(join(destination, file.path), "utf8")) !== file.hash
      )
        throw new Error(
          "Installed harness snapshot differs from its pinned bytes",
        );
    return;
  }
  const source =
    installation.sourceRoot ??
    fileURLToPath(new URL("../../", import.meta.url));
  const staging = `${destination}.preparing-${process.pid}`;
  mkdirSync(join(staging, "node_modules/@dotln"), { recursive: true });
  for (const name of readdirSync(join(source, "packages"))) {
    if (!existsSync(join(source, "packages", name, "dist"))) continue;
    const target = join(staging, "packages", name);
    mkdirSync(target, { recursive: true });
    cpSync(
      join(source, "packages", name, "package.json"),
      join(target, "package.json"),
    );
    cpSync(join(source, "packages", name, "dist"), join(target, "dist"), {
      recursive: true,
      // Installed roots may be replica mounts; snapshots own their bytes.
      dereference: true,
    });
    symlinkSync(
      `../../packages/${name}`,
      join(staging, "node_modules/@dotln", name),
    );
  }
  renameSync(staging, destination);
}
export function checkHarness(root, options = {}) {
  root = realpathSync(root);
  const expected = harnessInstallation(options);
  for (const file of expected.runtimeFiles) {
    const path = join(root, expected.runtimeSnapshot, file.path);
    if (
      !containedRegularFile(path, root) ||
      hash(readFileSync(path, "utf8")) !== file.hash
    )
      throw new Error(
        `harness drift: pinned snapshot missing or changed (${file.path}); run the build bootstrap`,
      );
  }
  for (const file of expected.files) {
    const path = contained(root, file.path);
    if (!existsSync(path))
      throw new Error(`harness drift: missing ${file.path}`);
    const actual = readFileSync(path, "utf8");
    if (
      (file.path === "CLAUDE.md" ? harnessInstructionBlock(actual) : actual) !==
      file.contents
    )
      throw new Error(`harness drift: ${file.path}`);
  }
  const expectedPaths = new Set(expected.files.map((file) => file.path));
  for (const path of walkOwned(root))
    if (!expectedPaths.has(path))
      throw new Error(`harness drift: unexpected ${path}`);
  const manifest = contained(root, manifestPath);
  if (
    !existsSync(manifest) ||
    readFileSync(manifest, "utf8") !==
      JSON.stringify(expected.manifest, null, 2) + "\n"
  )
    throw new Error("harness drift: manifest");
  return {
    files: expected.files.length + 1,
    localTerms: checkLocalTerms(options.termsRoot ?? root, [
      ...expected.files.map((file) => ({
        name: file.path,
        text: readFileSync(contained(root, file.path), "utf8"),
      })),
      { name: manifestPath, text: readFileSync(manifest, "utf8") },
    ]),
  };
}

const targetManifest = ".claude/target-worker-manifest.json";
const targetDigest = (value) =>
  createHash("sha256").update(value).digest("hex");
const targetGit = (root, ...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 10000,
  }).trim();
const targetStat = (path) => lstatSync(path, { throwIfNoEntry: false });
function targetIgnore(context, path, installed = false) {
  const result = spawnSync(
    "git",
    ["check-ignore", "--no-index", "-z", "-v", "--stdin"],
    {
      cwd: context.root,
      input: `${path}\0`,
      encoding: "utf8",
      timeout: 10000,
    },
  );
  if (![0, 1].includes(result.status))
    throw new Error("target ignore observation unavailable");
  const [source, , pattern] = result.stdout.split("\0");
  if (
    pattern?.startsWith("!") &&
    resolve(context.root, source) !== context.exclude
  )
    throw new Error(`target ignore rule exposes bundle: ${path}`);
  if (installed && (!pattern || pattern.startsWith("!")))
    throw new Error(`target bundle is Git-visible: ${path}`);
}
const targetPaths = new Set([
  "CLAUDE.local.md",
  targetManifest,
  ".claude/settings.json",
  ".claude/hooks/permissions.mjs",
  ".claude/hooks/presence-pretooluse.mjs",
  ".claude/hooks/concurrent-work-requires-worktrees.mjs",
  ".claude/hooks/no-attribution.mjs",
]);
function targetFile(root, path) {
  if (!targetPaths.has(path))
    throw new Error("target manifest contains an unsupported path");
  let candidate = root;
  for (const part of path.split("/")) {
    candidate = join(candidate, part);
    const info = targetStat(candidate);
    if (
      info &&
      (info.isSymbolicLink() ||
        (candidate === join(root, path) ? !info.isFile() : !info.isDirectory()))
    )
      throw new Error(
        `target output is not a regular contained surface: ${path}`,
      );
  }
  return candidate;
}
function safeLocalDirectory(root, path) {
  let candidate = root;
  for (const part of path.split("/")) {
    candidate = join(candidate, part);
    const info = targetStat(candidate);
    if (info && (!info.isDirectory() || info.isSymbolicLink()))
      throw new Error("target launchpad state is not a regular directory");
  }
  return candidate;
}
function targetContext(target, options = {}) {
  const root = realpathSync(target);
  if (realpathSync(targetGit(root, "rev-parse", "--show-toplevel")) !== root)
    throw new Error("target requires the physical Git worktree root");
  const launchpad = realpathSync(
    options.runtimeRoot ?? fileURLToPath(new URL("../../", import.meta.url)),
  );
  if (
    root === launchpad ||
    root.startsWith(`${launchpad}${sep}`) ||
    launchpad.startsWith(`${root}${sep}`)
  )
    throw new Error("target and launchpad must be separate worktrees");
  const id = targetDigest(root);
  const lane = safeLocalDirectory(
    launchpad,
    `docs/control/local/harness/targets/${id}`,
  );
  const receiptPath = join(lane, "installation.json");
  if (
    targetStat(receiptPath) &&
    (!targetStat(receiptPath).isFile() ||
      targetStat(receiptPath).isSymbolicLink())
  )
    throw new Error("target installation receipt is not a regular file");
  const exclude = resolve(
    root,
    targetGit(root, "rev-parse", "--git-path", "info/exclude"),
  );
  // Git may legitimately put info/exclude in a shared repository outside this worktree.
  // Check every existing ancestor without following user-created symlinks.
  let parent = exclude;
  while (parent !== dirname(parent)) {
    const info = targetStat(parent);
    if (info?.isSymbolicLink())
      throw new Error("target exclude must not follow symlinks");
    parent = dirname(parent);
  }
  if (targetStat(exclude) && !targetStat(exclude).isFile())
    throw new Error("target exclude is not a regular file");
  const excludeKey = targetDigest(exclude);
  const registryDir = safeLocalDirectory(
    launchpad,
    "docs/control/local/harness/excludes",
  );
  const registryPath = join(registryDir, `${excludeKey}.json`);
  if (
    targetStat(registryPath) &&
    (!targetStat(registryPath).isFile() ||
      targetStat(registryPath).isSymbolicLink())
  )
    throw new Error("target exclude registry is not a regular file");
  return {
    root,
    launchpad,
    id,
    lane,
    receiptPath,
    exclude,
    excludeKey,
    registryDir,
    registryPath,
  };
}
const targetJson = (value) => JSON.stringify(value, null, 2) + "\n";
const readTargetReceipt = (context) =>
  existsSync(context.receiptPath)
    ? JSON.parse(readFileSync(context.receiptPath, "utf8"))
    : null;
function manifestFiles(context, receipt) {
  if (
    !receipt ||
    receipt.contract !== "target-worker-v1" ||
    receipt.targetId !== context.id ||
    receipt.excludeKey !== context.excludeKey
  )
    throw new Error("target installation receipt missing or differs");
  const contents = readFileSync(
    targetFile(context.root, targetManifest),
    "utf8",
  );
  if (hash(contents) !== receipt.manifestHash)
    throw new Error("target manifest drift");
  const manifest = JSON.parse(contents);
  const files = manifest.installed;
  if (
    !Array.isArray(files) ||
    files.length < 2 ||
    files.some(
      (file) =>
        !file ||
        Object.keys(file).sort().join() !== "hash,path" ||
        !targetPaths.has(file.path) ||
        !/^fnv1a64:[a-f0-9]{16}$/.test(file.hash),
    ) ||
    new Set(files.map((file) => file.path)).size !== files.length ||
    files.filter((file) => file.path === targetManifest).length !== 1
  )
    throw new Error("target manifest shape differs");
  const payload = files.filter((file) => file.path !== targetManifest);
  // Its self entry binds the payload list; the receipt binds the full manifest bytes.
  if (
    files.find((file) => file.path === targetManifest).hash !==
    hash(targetJson({ installed: payload }))
  )
    throw new Error("target manifest self entry differs");
  return files;
}
function excludeRegistry(context) {
  const contents = existsSync(context.exclude)
    ? readFileSync(context.exclude, "utf8")
    : "";
  if (
    !existsSync(context.registryPath) &&
    contents.includes("# target-worker ")
  )
    throw new Error("target exclude is managed by another launchpad");
  let registry = existsSync(context.registryPath)
    ? JSON.parse(readFileSync(context.registryPath, "utf8"))
    : null;
  if (!registry || (!registry.block && !Object.keys(registry.members).length)) {
    if (contents.includes("# target-worker "))
      throw new Error("target exclude block drift");
    registry = {
      originalLines: contents
        .split(/\r?\n/)
        .filter(
          (line) =>
            [...targetPaths].some((path) => line === `/${path}`) ||
            line === "/.dotln/",
        ),
      needsNewline: Boolean(contents && !contents.endsWith("\n")),
      prefixHash: hash(contents),
      members: {},
      block: "",
    };
  }
  const marker = `# target-worker ${context.excludeKey}`;
  const begins = [...contents.matchAll(new RegExp(`^${marker} begin$`, "gm"))];
  const ends = [...contents.matchAll(new RegExp(`^${marker} end$`, "gm"))];
  let blockStart = null;
  let blockEnd = null;
  if (registry.block) {
    blockStart = begins[0]?.index;
    blockEnd = (ends[0]?.index ?? -1) + `${marker} end\n`.length;
    // Older receipts included the optional separator in their owned block.
    const expected = registry.block.replace(/^\n/, "");
    if (
      begins.length !== 1 ||
      ends.length !== 1 ||
      (blockStart !== 0 && contents[blockStart - 1] !== "\n") ||
      contents.slice(blockStart, blockEnd) !== expected
    )
      throw new Error("target exclude block drift");
  } else if (begins.length || ends.length) {
    throw new Error("target exclude block drift");
  }
  return { registry, contents, blockStart, blockEnd };
}
function updateTargetExclude(context, files, remove = false) {
  const { registry, contents, blockStart, blockEnd } = excludeRegistry(context);
  if (remove) delete registry.members[context.id];
  else
    registry.members[context.id] = files
      .map((file) => `/${file.path}`)
      .concat("/.dotln/");
  const baseLines = new Set(registry.originalLines);
  const lines = [...new Set(Object.values(registry.members).flat())]
    .filter((line) => !baseLines.has(line))
    .sort();
  const marker = `# target-worker ${context.excludeKey}`;
  const nextBlock = lines.length
    ? `${marker} begin\n${lines.join("\n")}\n${marker} end\n`
    : "";
  let next;
  if (registry.block) {
    let start = blockStart;
    // A suffix needs this separator. At EOF only reclaim it while the
    // original prefix is unchanged; older receipts lack that ownership proof.
    if (
      !nextBlock &&
      blockEnd === contents.length &&
      registry.needsNewline &&
      start > 0 &&
      contents[start - 1] === "\n" &&
      registry.prefixHash === hash(contents.slice(0, start - 1))
    )
      start -= 1;
    next = contents.slice(0, start) + nextBlock + contents.slice(blockEnd);
  } else {
    registry.needsNewline = Boolean(contents && !contents.endsWith("\n"));
    registry.prefixHash = hash(contents);
    next =
      contents + (nextBlock && registry.needsNewline ? "\n" : "") + nextBlock;
  }
  return { registry: { ...registry, block: nextBlock }, contents: next };
}
function writeTargetExclude(context, next) {
  mkdirSync(dirname(context.exclude), { recursive: true });
  writeFileSync(context.exclude, next.contents);
  mkdirSync(context.registryDir, { recursive: true, mode: 0o700 });
  writeFileSync(context.registryPath, targetJson(next.registry), {
    mode: 0o600,
  });
}
function emitTargetUnlocked(context, options) {
  const profile = targetWorkerProfiles.find(
    (entry) => entry.profileId === (options.profile ?? "target-worker-claude"),
  );
  if (!profile) throw new Error("unknown target worker profile");
  const runtime = harnessInstallation({ runtimeRoot: context.launchpad });
  if (
    canonicalStringify(runtime.runtimeFiles) !==
    canonicalStringify(harnessInstallation().runtimeFiles)
  )
    throw new Error(
      "target launchpad runtime differs from the emitting compiler; run its matching emitter",
    );
  const program =
    options.program ?? contributorConfiguredProgram(options.supports);
  const feedback = options.feedback ?? personalFeedback();
  const bundle = lowerToHarness(
    program,
    feedback,
    program.loadout.authorityEnvelope,
    {
      ...profile,
      runtime: {
        ...profile.runtime,
        snapshot: runtime.runtimeSnapshot,
        files: runtime.runtimeFiles,
        importRoot: context.launchpad,
        targetId: context.id,
      },
    },
  );
  const payload = bundle.files.map(({ path, contents }) => ({
    path,
    hash: hash(contents),
  }));
  const installed = [
    ...payload,
    { path: targetManifest, hash: hash(targetJson({ installed: payload })) },
  ];
  const manifestText = targetJson({ installed });
  const previous = readTargetReceipt(context);
  let owned = [];
  if (previous) {
    checkTargetHarness(context.root, options);
    owned = manifestFiles(context, previous).map((file) => file.path);
  }
  for (const file of installed) {
    const path = targetFile(context.root, file.path);
    if (targetGit(context.root, "ls-files", "--", file.path))
      throw new Error(`target output is tracked: ${file.path}`);
    if (targetStat(path) && !owned.includes(file.path))
      throw new Error(
        `unowned target output refuses replacement: ${file.path}`,
      );
    targetIgnore(context, file.path);
  }
  const nextExclude = updateTargetExclude(context, installed);
  const receipt = {
    contract: "target-worker-v1",
    targetId: context.id,
    profileId: profile.profileId,
    manifestHash: hash(manifestText),
    excludeKey: context.excludeKey,
    importRoot: "<launchpad>",
    runtimeSnapshot: runtime.runtimeSnapshot,
    runtimeFiles: runtime.runtimeFiles,
    compilerPackageVersion: bundle.manifest.compilerPackageVersion,
    grants: bundle.manifest.grants,
    authorityGrantRegistryHash: bundle.manifest.authorityGrantRegistryHash,
    envelope: program.loadout.authorityEnvelope,
  };
  // Validate all paths/ownership before first mutation. Preserve immutable runtime first.
  preserveHarnessRuntime(context.launchpad, runtime);
  writeTargetExclude(context, nextExclude);
  for (const file of bundle.files) {
    const path = targetFile(context.root, file.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, file.contents);
  }
  for (const path of owned.filter(
    (path) => !installed.some((file) => file.path === path),
  ))
    unlinkSync(targetFile(context.root, path));
  mkdirSync(dirname(targetFile(context.root, targetManifest)), {
    recursive: true,
  });
  writeFileSync(targetFile(context.root, targetManifest), manifestText);
  mkdirSync(context.lane, { recursive: true, mode: 0o700 });
  writeFileSync(context.receiptPath, targetJson(receipt), { mode: 0o600 });
  return { files: installed.length, localTerms: { status: "not-applicable" } };
}
export function checkTargetHarness(target, options = {}) {
  const context = targetContext(target, options);
  const receipt = readTargetReceipt(context);
  const files = manifestFiles(context, receipt);
  const { registry, contents } = excludeRegistry(context);
  if (!registry.members[context.id])
    throw new Error("target exclude ownership missing");
  const lines = contents.split(/\r?\n/);
  for (const file of files) {
    const path = targetFile(context.root, file.path);
    if (!targetStat(path))
      throw new Error(`target drift: missing ${file.path}`);
    if (
      file.path !== targetManifest &&
      hash(readFileSync(path, "utf8")) !== file.hash
    )
      throw new Error(`target drift: ${file.path}`);
    if (!lines.includes(`/${file.path}`))
      throw new Error(`target exclude missing: ${file.path}`);
    if (targetGit(context.root, "ls-files", "--", file.path))
      throw new Error(`target output is tracked: ${file.path}`);
    targetIgnore(context, file.path, true);
  }
  if (!lines.includes("/.dotln/"))
    throw new Error("target scratch exclude missing");
  for (const file of receipt.runtimeFiles) {
    const path = join(context.launchpad, receipt.runtimeSnapshot, file.path);
    if (
      !containedRegularFile(path, context.launchpad) ||
      hash(readFileSync(path, "utf8")) !== file.hash
    )
      throw new Error("target pinned runtime drift");
  }
  return { files: files.length, localTerms: { status: "not-applicable" } };
}
function removeTargetUnlocked(context) {
  // Runtime availability is irrelevant to removal; owned file bytes must still match.
  const receipt = readTargetReceipt(context);
  const files = manifestFiles(context, receipt);
  for (const file of files) {
    const path = targetFile(context.root, file.path);
    if (
      file.path !== targetManifest &&
      hash(readFileSync(path, "utf8")) !== file.hash
    )
      throw new Error(`target drift: ${file.path}`);
    if (targetGit(context.root, "ls-files", "--", file.path))
      throw new Error(`target output is tracked: ${file.path}`);
  }
  const nextExclude = updateTargetExclude(context, files, true);
  for (const file of files) unlinkSync(targetFile(context.root, file.path));
  writeTargetExclude(context, nextExclude);
  unlinkSync(context.receiptPath);
  return { files: files.length, localTerms: { status: "not-applicable" } };
}

function targetMutation(target, options, operation) {
  const context = targetContext(target, options);
  mkdirSync(context.registryDir, { recursive: true, mode: 0o700 });
  const lock = join(context.registryDir, `${context.excludeKey}.lock`);
  try {
    mkdirSync(lock, { mode: 0o700 });
  } catch {
    throw new Error("target exclude mutation is active or requires recovery");
  }
  try {
    return operation(context, options);
  } finally {
    rmdirSync(lock);
  }
}
export const emitTargetHarness = (target, options = {}) =>
  targetMutation(target, options, emitTargetUnlocked);
export const removeTargetHarness = (target, options = {}) =>
  targetMutation(target, options, removeTargetUnlocked);
