import {
  HARNESS_START,
  HARNESS_END,
  NO_COMPILED_HARNESS,
  migrateHarnessFloor,
  harnessInstructionBlock,
  composeHarnessInstruction,
} from "./harness-instruction.mjs";
export {
  harnessInstructionBlock,
  composeHarnessInstruction,
} from "./harness-instruction.mjs";
import { spawnGit, runGit } from "./git.mjs";
import {
  json as targetJson,
  json as prettyJson,
  sha256Hex as targetDigest,
} from "./helpers.mjs";
import {
  TOOL_ROOT,
  docRelative,
  findLaunchpad,
  loadConfig,
} from "./config.mjs";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

import {
  canonicalStringify,
  COMPILER_PACKAGE_VERSION,
  fnv1a64,
  lowerToHarness,
  mergeHarnessFragments,
} from "../../packages/compiler/dist/src/index.js";
import {
  contributorConfiguredProgram,
  contributorSupportIds,
  contributorProfiles,
  targetWorkerProfiles,
} from "../../packages/skeleton/dist/src/loadouts/contributor.js";
import { personalFeedback } from "../../packages/skeleton/dist/src/loadouts/feedback.js";
import { checkLocalTerms } from "./terms.mjs";
import { containedRegularFile } from "./paths.mjs";
import {
  runtimeDirectoryNames,
  runtimeEntryName,
  runtimeInfo,
  runtimeModuleDirectory as packageModuleDirectory,
  runtimePackageNames,
  runtimeRead,
} from "../../packages/skeleton/src/runtime-inputs.mjs";

const manifestPath = ".claude/harness-manifest.json";
export const OVERLAY_KEYS = [
  "version",
  "build",
  "identity",
  "unequip",
  "equip",
  "narrow",
  "grants",
];
const overlayError = (path, detail) =>
  new Error(`invalid build overlay in ${path}: ${detail}`);

/** Instance-owned data has a closed schema; it cannot replace kit code or the floor. */
export function decodeBuildOverlay(path, text) {
  const fail = (detail) => {
    throw overlayError(path, detail);
  };
  const object = (value, keys, label) => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail(`${label} must be an object`);
    for (const key of Object.keys(value))
      if (!keys.includes(key)) fail(`unknown key ${label}.${key}`);
  };
  const string = (value, label) => {
    if (
      typeof value !== "string" ||
      !value.trim() ||
      /[\u0000-\u001f\u007f\u2028\u2029]/u.test(value)
    )
      fail(`${label} must be a non-empty string without control characters`);
    if (/<!--\s*dotln-harness:(?:start|end)\s*-->/u.test(value))
      fail(`${label} must not contain harness block markers`);
  };
  const integer = (value, label, min = 0) => {
    if (!Number.isSafeInteger(value) || value < min)
      fail(`${label} must be a safe integer >= ${min}`);
  };
  const strings = (value, label, pattern) => {
    if (!Array.isArray(value)) fail(`${label} must be an array`);
    for (const [index, entry] of value.entries()) {
      string(entry, `${label}[${index}]`);
      if (pattern && !pattern.test(entry))
        fail(`${label}[${index}] has an invalid effect pattern`);
    }
    if (new Set(value).size !== value.length) fail(`${label} has duplicates`);
  };
  const exactEffect = /^[^\s*\u0000-\u001f\u007f]+$/u;
  const effectPattern = /^[^\s*\u0000-\u001f\u007f]+\*?$/u;
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("root must be JSON");
  }
  const screenMarkers = (node, key) => {
    if (
      typeof node === "string" &&
      /<!--\s*dotln-harness:(?:start|end)\s*-->/u.test(node)
    )
      fail(`${key} must not contain harness block markers`);
    if (node && typeof node === "object")
      for (const [name, child] of Object.entries(node)) {
        screenMarkers(name, `${key} property name`);
        screenMarkers(child, `${key}.${name}`);
      }
  };
  screenMarkers(value, "overlay");
  object(value, OVERLAY_KEYS, "overlay");
  if (value.version !== 1) fail("version must be 1");
  if (
    value.build !== undefined &&
    !["contributor", "none"].includes(value.build)
  )
    fail('build must be "contributor" or "none"');
  if (
    value.build === "none" &&
    Object.keys(value).some((key) => !["version", "build"].includes(key))
  )
    fail('build "none" accepts only version and build');
  for (const key of ["equip", "unequip"]) {
    if (value[key] === undefined) continue;
    strings(value[key], key);
    for (const id of value[key])
      if (!contributorSupportIds.includes(id))
        fail(`${key} names unknown support ${id}`);
  }
  if (value.equip?.some((id) => value.unequip?.includes(id)))
    fail("equip and unequip must not name the same support");
  if (value.identity !== undefined) {
    object(
      value.identity,
      [
        "identityId",
        "version",
        "name",
        "dispositions",
        "invariants",
        "updateLaws",
        "lineage",
      ],
      "identity",
    );
    for (const key of ["identityId", "name"])
      string(value.identity[key], `identity.${key}`);
    integer(value.identity.version, "identity.version", 1);
    for (const key of ["dispositions", "invariants", "updateLaws", "lineage"])
      strings(value.identity[key], `identity.${key}`);
  }
  if (value.narrow !== undefined) {
    const narrow = value.narrow;
    object(
      narrow,
      [
        "allowedEffects",
        "deniedEffects",
        "resourceLimits",
        "requiredEvidence",
        "expiresAt",
        "revocationEventTypes",
        "revocationConditions",
      ],
      "narrow",
    );
    for (const key of [
      "allowedEffects",
      "deniedEffects",
      "requiredEvidence",
      "revocationEventTypes",
    ])
      if (narrow[key] !== undefined)
        strings(
          narrow[key],
          `narrow.${key}`,
          key.endsWith("Effects") ? effectPattern : undefined,
        );
    if (narrow.resourceLimits !== undefined) {
      const limits = narrow.resourceLimits;
      object(limits, Object.keys(limits ?? {}), "narrow.resourceLimits");
      for (const [key, quantity] of Object.entries(limits)) {
        string(key, "narrow.resourceLimits key");
        integer(quantity, `narrow.resourceLimits.${key}`);
      }
    }
    if (narrow.expiresAt !== undefined)
      integer(narrow.expiresAt, "narrow.expiresAt");
    if (narrow.revocationConditions !== undefined) {
      if (!Array.isArray(narrow.revocationConditions))
        fail("narrow.revocationConditions must be an array");
      for (const [index, condition] of narrow.revocationConditions.entries()) {
        const label = `narrow.revocationConditions[${index}]`;
        object(condition, ["registryId", "version", "params"], label);
        string(condition.registryId, `${label}.registryId`);
        integer(condition.version, `${label}.version`, 1);
        if (condition.params !== undefined)
          object(
            condition.params,
            Object.keys(condition.params ?? {}),
            `${label}.params`,
          );
      }
    }
  }
  if (value.grants !== undefined) {
    if (!Array.isArray(value.grants)) fail("grants must be an array");
    const ids = new Set();
    for (const [index, grant] of value.grants.entries()) {
      const label = `grants[${index}]`;
      object(
        grant,
        [
          "grantId",
          "version",
          "grantedBy",
          "effects",
          "operations",
          "repo",
          "reason",
        ],
        label,
      );
      for (const key of ["grantId", "reason"])
        string(grant[key], `${label}.${key}`);
      integer(grant.version, `${label}.version`, 1);
      if (!["operator", "host-policy"].includes(grant.grantedBy))
        fail(`${label}.grantedBy must be operator or host-policy`);
      if (grant.repo !== "project") fail(`${label}.repo must be project`);
      strings(grant.effects, `${label}.effects`, exactEffect);
      if (grant.operations !== undefined)
        strings(grant.operations, `${label}.operations`, exactEffect);
      if (ids.has(grant.grantId)) fail(`${label}.grantId must be unique`);
      ids.add(grant.grantId);
    }
  }
  return value;
}

export function readBuildOverlay(launchpad) {
  const path = loadConfig(launchpad).build.overlay;
  if (path === null) return undefined;
  const absolute = resolve(launchpad, path);
  let text;
  try {
    if (!containedRegularFile(absolute, launchpad)) throw new Error();
    text = readFileSync(absolute);
  } catch {
    throw overlayError(
      path,
      "build.overlay must name a readable regular file inside the launchpad",
    );
  }
  decodeBuildOverlay(path, text.toString("utf8"));
  return { path, bytes: text };
}
const hash = (text) => `fnv1a64:${fnv1a64(text)}`;
const allowed = (path) =>
  path === "CLAUDE.md" ||
  path === ".claude/settings.json" ||
  path === ".codex/config.toml" ||
  path === ".codex/hooks.json" ||
  path === manifestPath ||
  /^\.claude\/agents\/dotln-[a-z-]+\.md$/.test(path) ||
  /^\.(?:claude|agents)\/skills\/dotln-[a-z-]+\/SKILL\.md$/.test(path) ||
  /^\.(?:claude|codex)\/hooks\/[a-z0-9.-]+\.mjs$/.test(path);
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
export function harnessInstallation(options = {}) {
  if (options.loadout && options.loadout !== "contributor")
    throw new Error("unknown harness loadout");
  const profiles = contributorProfiles.filter(
    (profile) => !options.profile || profile.profileId === options.profile,
  );
  if (!profiles.length) throw new Error("unknown harness profile");
  const overlay = options.overlay;
  if (overlay && !Buffer.isBuffer(overlay.bytes))
    throw overlayError(overlay.path, "overlay bytes must be a Buffer");
  const value =
    overlay && decodeBuildOverlay(overlay.path, overlay.bytes.toString("utf8"));
  const overlayManifest = overlay && {
    overlay: { path: overlay.path, sha256: targetDigest(overlay.bytes) },
  };
  if (overlay && options.program)
    throw overlayError(
      overlay.path,
      "cannot combine an overlay with a program override",
    );
  if (value?.build === "none")
    return {
      files: [],
      bundles: [],
      runtimeFiles: [],
      runtimeSnapshot: null,
      manifest: {
        contractVersion: "harness-v1",
        compilerPackageVersion: COMPILER_PACKAGE_VERSION,
        build: "none",
        profiles: [],
        installed: [],
        residue: [],
        ...overlayManifest,
      },
    };
  const switches = { ...options.supports };
  for (const id of value?.unequip ?? []) switches[id] = false;
  for (const id of value?.equip ?? []) switches[id] = true;
  let program;
  try {
    program = options.program ?? contributorConfiguredProgram(switches, value);
  } catch (error) {
    if (overlay) throw overlayError(overlay.path, error.message);
    throw error;
  }
  const feedback = options.feedback ?? personalFeedback();
  const sourceRoot = options.runtimeRoot ?? TOOL_ROOT;
  const runtimeFiles = [
    // Admission compares this module's compiler version. A compiler-only
    // release must install a fresh snapshot even when hook handlers are equal.
    "packages/compiler/dist/src/artifact-identity.js",
    "packages/compiler/dist/src/harness.js",
    "packages/compiler/dist/src/codex-continuation.mjs",
    "packages/compiler/dist/src/feedback.js",
    "packages/compiler/dist/src/attribution.mjs",
    "packages/skeleton/dist/src/feedback-boundary.js",
    "packages/skeleton/dist/src/feedback-source-comments.js",
    "packages/skeleton/dist/src/harness-host.js",
    "packages/skeleton/dist/src/subagent-budget.js",
    "packages/skeleton/dist/src/observed-facts.js",
    "packages/skeleton/dist/src/correction-observation.mjs",
    "packages/skeleton/dist/src/source-change-command.js",
    "packages/skeleton/dist/src/source-change-state.js",
    "packages/skeleton/dist/src/version.js",
    "packages/skeleton/dist/src/harness-command.js",
    "packages/skeleton/dist/src/gate-evidence.mjs",
    "packages/skeleton/dist/src/gate-deadlines.mjs",
    "packages/skeleton/dist/src/runtime-inputs.mjs",
    "packages/skeleton/dist/src/usage-observation.mjs",
    "packages/skeleton/dist/src/writer-teardown.mjs",
    "packages/skeleton/dist/src/reactor.js",
    "packages/skeleton/dist/src/repair.js",
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
    "packages/skeleton/dist/src/cli-actor-contract.js",
    "packages/skeleton/dist/src/handoff-contract.js",
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
  const runtimeInventory = options.runtimePackageFiles
    ? runtimePackageInventoryFromFiles(options.runtimePackageFiles)
    : runtimePackageInventory(sourceRoot);
  const runtimeSnapshot = runtimeSnapshotPath(runtimeFiles, runtimeInventory);
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
  const shared = new Map();
  for (const bundle of bundles)
    for (const file of bundle.files) {
      if (["CLAUDE.md", "AGENTS.md"].includes(file.path)) continue;
      const previous = shared.get(file.path);
      if (previous && previous.contents !== file.contents)
        throw new Error(
          `Harness profiles disagree on shared output: ${file.path}`,
        );
      if (!previous) shared.set(file.path, file);
    }
  const files = [...shared.values()];
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
    ...overlayManifest,
  };
  return {
    files,
    manifest,
    bundles,
    runtimeSnapshot,
    runtimeFiles,
    runtimeInventory,
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
  const manifest = join(root, manifestPath);
  const previous = existsSync(manifest)
    ? JSON.parse(readFileSync(manifest, "utf8"))
    : null;
  for (const file of previous?.installed ?? [])
    if (file.path !== "CLAUDE.md" && existsSync(join(root, file.path)))
      paths.push(file.path);
  for (const skills of [".claude/skills", ".agents/skills"])
    if (existsSync(join(root, skills)))
      for (const name of readdirSync(join(root, skills)))
        if (name.startsWith("dotln-")) walk(join(root, skills, name));
  return [...new Set(paths)];
};
export function emitHarness(
  root,
  options = {},
  installation = harnessInstallation(options),
) {
  root = realpathSync(root);
  const writes = installation.files.map((file) => ({
    path: contained(root, file.path),
    contents: file.contents,
  }));
  let instruction = writes.find(
    (file) => file.path === join(root, "CLAUDE.md"),
  );
  if (!instruction) {
    instruction = { path: contained(root, "CLAUDE.md"), contents: "" };
    writes.push(instruction);
  }
  const originalFloor = existsSync(instruction.path)
    ? readFileSync(instruction.path, "utf8")
    : options.instructionFloor;
  // Only the known legacy lines outside the generated block are migrated.
  const priorBlock =
    typeof originalFloor === "string" &&
    (originalFloor.includes(HARNESS_START) ||
      originalFloor.includes(HARNESS_END))
      ? harnessInstructionBlock(originalFloor).trimEnd()
      : null;
  const floor =
    typeof originalFloor !== "string"
      ? originalFloor
      : priorBlock
        ? originalFloor
            .replace(priorBlock, "\u0000")
            .split("\u0000")
            .map(migrateHarnessFloor)
            .join(priorBlock)
        : migrateHarnessFloor(originalFloor);
  if (installation.manifest.build === "none") {
    if (typeof floor !== "string" || !floor.trim())
      throw new Error(
        "harness emit requires the hand-written clean-room floor",
      );
    instruction.contents =
      (floor.includes(HARNESS_START) || floor.includes(HARNESS_END)
        ? floor.replace(harnessInstructionBlock(floor).trimEnd(), "")
        : floor
      ).trimEnd() + "\n";
    if (!instruction.contents.trim())
      throw new Error(
        "harness emit requires the hand-written clean-room floor outside the generated block",
      );
    if (!instruction.contents.includes(NO_COMPILED_HARNESS))
      instruction.contents =
        instruction.contents.trimEnd() + "\n\n" + NO_COMPILED_HARNESS + "\n";
  } else
    instruction.contents = composeHarnessInstruction(
      floor?.replace(NO_COMPILED_HARNESS + "\n", ""),
      instruction.contents,
    );
  const expected = new Set(installation.files.map((file) => file.path));
  const obsolete = walkOwned(root).filter((path) => !expected.has(path));
  const previous = existsSync(join(root, manifestPath))
    ? JSON.parse(readFileSync(contained(root, manifestPath), "utf8"))
    : null;
  for (const file of writes)
    if (
      relative(root, file.path).startsWith(".codex/") &&
      existsSync(file.path) &&
      !previous?.installed?.some(
        (entry) => entry.path === relative(root, file.path),
      )
    )
      throw new Error(
        `unowned Codex output refuses replacement: ${relative(root, file.path)}`,
      );
  for (const path of obsolete)
    if (
      !previous?.installed?.some((file) => file.path === path) ||
      !allowed(path)
    )
      throw new Error(`unowned harness output refuses replacement: ${path}`);
  // Validate every destination before the first write. Never edit user scope.
  const manifestTarget = contained(root, manifestPath);
  const manifestText = prettyJson(installation.manifest);
  const localTerms = checkLocalTerms(options.termsRoot ?? root, [
    ...writes.map((file) => ({
      name: relative(root, file.path),
      text: file.contents,
    })),
    { name: manifestPath, text: manifestText },
  ]);
  if (installation.runtimeSnapshot) preserveHarnessRuntime(root, installation);
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

/** The module directory a package ships at runtime: built packages ship dist;
 * build-free workspaces (package.json, no tsconfig.json) ship src. */
export function runtimeModuleDirectory(packageRoot) {
  return packageModuleDirectory(packageRoot, ".");
}

const sortedRuntimeInventory = (entries) =>
  entries.sort((a, b) => a.path.localeCompare(b.path, "en"));
// One boolean for the executable bit: a restrictive umask leaves 700 where
// another host leaves 755, the same executable file. The build marks bin
// targets executable, so npm's bin links do not flip the bit either.
const runtimeFileEntry = (path, bytes, mode) => ({
  path,
  kind: "file",
  bytes: bytes.length,
  sha256: targetDigest(bytes),
  executable: (mode & 0o111) !== 0,
});

/** Every package byte copied into a snapshot, including build-free workspaces
 * and compiled tests. Aliases are refused before any traversal or file read. */
export function runtimePackageInventory(root) {
  const entries = [];
  const directory = (path) => {
    const info = runtimeInfo(root, path);
    if (!info?.isDirectory() || info.isSymbolicLink())
      throw new Error(
        `Runtime inventory requires a regular directory: ${path}`,
      );
    entries.push({ path, kind: "directory" });
  };
  const visit = (path) => {
    const info = runtimeInfo(root, path);
    if (!info)
      throw new Error(`Runtime inventory is missing an input: ${path}`);
    if (info.isDirectory()) {
      directory(path);
      for (const name of runtimeDirectoryNames(root, path))
        if (runtimeEntryName(name)) visit(`${path}/${name}`);
    } else if (info.isFile())
      entries.push(
        runtimeFileEntry(
          path,
          runtimeRead(path, () => readFileSync(join(root, path))),
          info.mode,
        ),
      );
    else
      throw new Error(`Runtime inventory refuses a non-regular entry: ${path}`);
  };
  directory("packages");
  // Use declared workspace roots, without consulting adjacent source or
  // documentation directory names. Snapshot copying uses this same inventory.
  for (const name of runtimePackageNames(root)) {
    const path = `packages/${name}`;
    const info = runtimeInfo(root, path);
    // The lockfile names the workspace; its absence is reported by that name,
    // never by the absolute path a system error would carry.
    if (!info)
      throw new Error(
        `Runtime package declared in package-lock.json is missing on disk: ${path}; restore the workspace or run npm install before building`,
      );
    if (!info.isDirectory() || info.isSymbolicLink())
      throw new Error(`Runtime package must be a regular directory: ${path}`);
    const modules = packageModuleDirectory(root, path);
    if (!modules) continue;
    directory(path);
    visit(`${path}/package.json`);
    visit(`${path}/${modules}`);
  }
  return sortedRuntimeInventory(entries);
}

/** Predict the same inventory from an export's planned writes. Exported
 * package selection and modes can differ from those of its source checkout. */
export function runtimePackageInventoryFromFiles(files) {
  const byPath = new Map(files.map((file) => [file.path, file]));
  const entries = new Map([
    ["packages", { path: "packages", kind: "directory" }],
  ]);
  const add = (file) => {
    entries.set(file.path, runtimeFileEntry(file.path, file.bytes, file.mode));
    for (let path = dirname(file.path); path !== "."; path = dirname(path))
      entries.set(path, { path, kind: "directory" });
  };
  for (const file of files) {
    const match = /^packages\/([^/]+)\/package\.json$/u.exec(file.path);
    if (!match) continue;
    const prefix = `packages/${match[1]}/`;
    const candidates = files.filter((candidate) =>
      candidate.path.startsWith(prefix),
    );
    const modules = candidates.some((candidate) =>
      candidate.path.startsWith(`${prefix}dist/`),
    )
      ? "dist"
      : !byPath.has(`${prefix}tsconfig.json`) &&
          candidates.some((candidate) =>
            candidate.path.startsWith(`${prefix}src/`),
          )
        ? "src"
        : null;
    if (!modules) continue;
    add(file);
    for (const candidate of candidates)
      if (
        candidate.path.startsWith(`${prefix}${modules}/`) &&
        candidate.path
          .slice(`${prefix}${modules}/`.length)
          .split("/")
          .every(runtimeEntryName)
      )
        add(candidate);
  }
  return sortedRuntimeInventory([...entries.values()]);
}

export const runtimeSnapshotPath = (files, inventory) =>
  `.runtime/harness/${fnv1a64(canonicalStringify({ files, inventory }))}`;

// A snapshot that no longer matches is replaced, never repaired in place; the
// refusal says so and names the directory, which is inside the worktree.
const snapshotRemedy = (snapshot) =>
  `; remove ${snapshot} and run node scripts/bootstrap.mjs to install it again`;
function checkRuntimeSnapshot(
  root,
  installation,
  inventory,
  remedyFor = installation.runtimeSnapshot,
) {
  const destination = join(root, installation.runtimeSnapshot);
  let parent = root;
  for (const part of installation.runtimeSnapshot.split("/")) {
    parent = join(parent, part);
    const info = runtimeInfo(root, relative(root, parent));
    if (!info?.isDirectory() || info.isSymbolicLink())
      throw new Error(
        "Harness runtime snapshot must remain inside its worktree",
      );
  }
  const expected = [
    ...inventory,
    { path: "node_modules", kind: "directory" },
    { path: "node_modules/@dotln", kind: "directory" },
  ];
  const links = new Map();
  for (const entry of inventory)
    if (/^packages\/[^/]+$/u.test(entry.path) && entry.kind === "directory") {
      const name = entry.path.slice("packages/".length);
      const path = `node_modules/@dotln/${name}`;
      const target = `../../packages/${name}`;
      links.set(path, target);
      expected.push({ path, kind: "link", target });
    }
  const actual = [];
  const visit = (path) => {
    const absolute = join(destination, path);
    const info = runtimeInfo(destination, path);
    if (!info)
      throw new Error(
        `Installed harness snapshot is missing ${path}${snapshotRemedy(remedyFor)}`,
      );
    if (info.isDirectory()) {
      actual.push({ path, kind: "directory" });
      for (const name of runtimeDirectoryNames(destination, path))
        if (runtimeEntryName(name)) visit(`${path}/${name}`);
    } else if (info.isFile())
      actual.push(
        runtimeFileEntry(
          path,
          runtimeRead(path, () => readFileSync(absolute)),
          info.mode,
        ),
      );
    else if (
      info.isSymbolicLink() &&
      links.get(path) === runtimeRead(path, () => readlinkSync(absolute))
    )
      actual.push({ path, kind: "link", target: links.get(path) });
    else
      throw new Error(
        `Installed harness snapshot contains an unexpected alias or entry${snapshotRemedy(remedyFor)}`,
      );
  };
  for (const name of runtimeDirectoryNames(root, installation.runtimeSnapshot))
    if (runtimeEntryName(name)) visit(name);
  if (
    JSON.stringify(sortedRuntimeInventory(actual)) !==
    JSON.stringify(sortedRuntimeInventory(expected))
  )
    throw new Error(
      `Installed harness snapshot differs from its complete runtime inventory${snapshotRemedy(remedyFor)}`,
    );
}

export function preserveHarnessRuntime(
  root,
  installation = harnessInstallation(),
) {
  const snapshot = installation.runtimeSnapshot;
  if (!/^\.runtime\/harness\/[a-f0-9]{16}$/u.test(snapshot))
    throw new Error("Harness runtime snapshot selection is invalid");
  const destination = join(root, snapshot);
  for (const path of [".runtime", ".runtime/harness", snapshot])
    if (
      existsSync(join(root, path)) &&
      lstatSync(join(root, path)).isSymbolicLink()
    )
      throw new Error(
        "Harness runtime snapshot must remain inside its worktree",
      );
  const source = installation.sourceRoot ?? TOOL_ROOT;
  const inventory =
    installation.runtimeInventory ?? runtimePackageInventory(source);
  if (snapshot !== runtimeSnapshotPath(installation.runtimeFiles, inventory))
    throw new Error(
      "Selected harness snapshot cannot be reproduced from the carried runtime; refresh the harness",
    );
  if (existsSync(destination)) {
    checkRuntimeSnapshot(root, installation, inventory);
    for (const file of installation.runtimeFiles)
      if (
        hash(readFileSync(join(destination, file.path), "utf8")) !== file.hash
      )
        throw new Error(
          `Installed harness snapshot differs from its pinned bytes${snapshotRemedy(snapshot)}`,
        );
    return;
  }
  mkdirSync(dirname(destination), { recursive: true });
  const staging = mkdtempSync(`${destination}.preparing-`);
  try {
    mkdirSync(join(staging, "node_modules/@dotln"), { recursive: true });
    for (const entry of inventory) {
      const target = join(staging, entry.path);
      runtimeRead(entry.path, () => {
        if (entry.kind === "directory") mkdirSync(target, { recursive: true });
        else {
          const info = runtimeInfo(source, entry.path);
          if (!info?.isFile())
            throw new Error("Runtime input changed during copy");
          cpSync(join(source, entry.path), target, { dereference: false });
        }
      });
      if (entry.kind === "directory" && /^packages\/[^/]+$/u.test(entry.path)) {
        const name = entry.path.slice("packages/".length);
        symlinkSync(
          `../../packages/${name}`,
          join(staging, "node_modules/@dotln", name),
        );
      }
    }
    // A staging tree that disagrees is removed below; the remedy names the
    // snapshot it was meant to become.
    checkRuntimeSnapshot(
      root,
      { ...installation, runtimeSnapshot: relative(root, staging) },
      inventory,
      snapshot,
    );
    renameSync(staging, destination);
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}
export function checkHarness(root, options = {}) {
  root = realpathSync(root);
  const expected = harnessInstallation(options);
  if (expected.manifest.build === "none") {
    const floor = contained(root, "CLAUDE.md");
    const text = existsSync(floor) ? readFileSync(floor, "utf8") : "";
    if (
      !text.trim() ||
      text.includes(HARNESS_START) ||
      text.includes(HARNESS_END) ||
      !text.includes(NO_COMPILED_HARNESS)
    )
      throw new Error(
        "harness drift: build none requires the hand-written floor alone",
      );
  }
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
  if (expected.runtimeSnapshot)
    checkRuntimeSnapshot(root, expected, expected.runtimeInventory);
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
    readFileSync(manifest, "utf8") !== prettyJson(expected.manifest)
  )
    throw new Error("harness drift: manifest");
  return {
    files: expected.files.length + 1,
    localTerms: checkLocalTerms(options.termsRoot ?? root, [
      ...(expected.manifest.build === "none"
        ? [
            {
              name: "CLAUDE.md",
              text: readFileSync(contained(root, "CLAUDE.md"), "utf8"),
            },
          ]
        : []),
      ...expected.files.map((file) => ({
        name: file.path,
        text: readFileSync(contained(root, file.path), "utf8"),
      })),
      { name: manifestPath, text: readFileSync(manifest, "utf8") },
    ]),
  };
}

const targetManifest = ".claude/target-worker-manifest.json";
const targetGitOptions = {
  exec: true,
  stdio: ["ignore", "pipe", "pipe"],
  timeout: 10000,
};
const targetStat = (path) => lstatSync(path, { throwIfNoEntry: false });
function targetIgnore(context, path, installed = false) {
  const result = spawnGit(
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
  if (
    realpathSync(
      runGit(root, ["rev-parse", "--show-toplevel"], targetGitOptions),
    ) !== root
  )
    throw new Error("target requires the physical Git worktree root");
  const launchpad = realpathSync(options.runtimeRoot ?? findLaunchpad());
  if (
    root === launchpad ||
    root.startsWith(`${launchpad}${sep}`) ||
    launchpad.startsWith(`${root}${sep}`)
  )
    throw new Error("target and launchpad must be separate worktrees");
  const id = targetDigest(root);
  const lane = safeLocalDirectory(
    launchpad,
    docRelative(launchpad, "control", `local/harness/targets/${id}`),
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
    runGit(root, ["rev-parse", "--git-path", "info/exclude"], targetGitOptions),
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
    docRelative(launchpad, "control", "local/harness/excludes"),
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
    if (runGit(context.root, ["ls-files", "--", file.path], targetGitOptions))
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
    if (runGit(context.root, ["ls-files", "--", file.path], targetGitOptions))
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
    if (runGit(context.root, ["ls-files", "--", file.path], targetGitOptions))
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
