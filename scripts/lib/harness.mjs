import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
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
  const sourceRoot = fileURLToPath(new URL("../../", import.meta.url));
  const runtimeFiles = [
    "packages/compiler/dist/src/feedback.js",
    "packages/compiler/dist/src/attribution.mjs",
    "packages/skeleton/dist/src/feedback-boundary.js",
    "packages/skeleton/dist/src/feedback-source-comments.js",
    "packages/skeleton/dist/src/harness-host.js",
    "packages/skeleton/dist/src/harness-command.js",
    "packages/skeleton/dist/src/gate-evidence.mjs",
    "packages/skeleton/dist/src/usage-observation.mjs",
    "packages/skeleton/dist/src/reactor.js",
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
  return { files, manifest, bundles, runtimeSnapshot, runtimeFiles };
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
  const source = fileURLToPath(new URL("../../", import.meta.url));
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
