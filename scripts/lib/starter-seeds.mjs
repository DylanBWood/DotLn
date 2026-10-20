import {
  HARNESS_START as start,
  HARNESS_END as end,
  harnessInstructionBlock,
  composeHarnessInstruction,
  migrateHarnessFloor,
} from "./harness-instruction.mjs";
import { runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { sha256Hex } from "./helpers.mjs";
import {
  defaultDocRelative,
  CONFIG_FILENAME,
  validateConfig,
} from "./config.mjs";
import { releaseClaimLine } from "./release-preparation.mjs";

// These are the direct template seeds emitted by prepareKit. Generated
// indexes, control records and planning history are never refresh inputs.
const seeds = [
  ["README.md", "README.client.md"],
  [".gitignore", "gitignore.template"],
  ["CLAUDE.md", "CLAUDE.template.md"],
  ["AI-HARNESS-SECURITY.md", "AI-HARNESS-SECURITY.template.md"],
  [defaultDocRelative("workstreams", "README.md"), "workstream.template.md"],
  [
    defaultDocRelative("docs", "repositories", "README.md"),
    "repository-profile.template.md",
  ],
  [
    defaultDocRelative("workOrders", "WO-001-environment-truth.md"),
    "first-order.template.md",
  ],
  [defaultDocRelative("control", "budgets.json"), "budgets.template.json"],
];
const git = (root, args, options) =>
  runGit(root, [...HOST_GIT_READ, ...args], options);
const blob = (root, ref, path) =>
  git(root, ["show", `${ref}:${path}`], {
    trim: false,
    onFailure: () => null,
  });
const releaseName = (root, ref) => {
  const configuration = blob(root, ref, CONFIG_FILENAME);
  return configuration === null
    ? "DotLn"
    : validateConfig(CONFIG_FILENAME, configuration).release.displayName;
};
export const namedStarterSeed = (path, source, name) =>
  path === "README.md"
    ? source.replace(
        /^(This source prepares .+) `(v\d+\.\d+\.\d+)`\.$/mu,
        (_line, _prefix, version) => releaseClaimLine(version, name),
      )
    : source;
// A tree entry's mode: 100644 is a regular file, 100755 an executable file,
// 120000 a symbolic link; null when the path is absent from the tree.
const entryMode = (root, ref, path) =>
  git(root, ["ls-tree", ref, "--", path]).split(" ")[0] || null;
const markerPair = (text) => {
  try {
    harnessInstructionBlock(text);
    return true;
  } catch {
    return false;
  }
};
// The refresh's own harness emit composes its block onto CLAUDE.md. It
// refuses markers that are not one ordered pair, and a text with no
// hand-written words outside that pair. Each fault has its own remedy.
// Exported so a case can hold this rule to the harness's own composition.
export const floorFault = (text) => {
  if ((text.includes(start) || text.includes(end)) && !markerPair(text))
    return "markers";
  const outside = markerPair(text)
    ? text.slice(0, text.indexOf(start)) +
      text.slice(text.indexOf(end) + end.length)
    : text;
  return migrateHarnessFloor(outside).trim() ? null : "floor";
};
// The refresh's own verification reads these two seeds: CLAUDE.md is the
// emit's floor and .gitignore keeps verification's links out of the commit.
const verificationSeeds = new Set(["CLAUDE.md", ".gitignore"]);
const matches = (path, actual, template) => {
  if (path !== "CLAUDE.md") return actual === template;
  if (actual === null || template === null) return false;
  if (!markerPair(actual)) return false;
  const block = harnessInstructionBlock(actual);
  const normalized = (text) => {
    const composed = composeHarnessInstruction(text, block);
    const at = composed.indexOf(start);
    return composed.slice(0, at).trimEnd() + "\n\n" + composed.slice(at);
  };
  // Emit appends one generated block to the template floor. Compare the whole
  // exported contract, so instructions after the block cannot be discarded.
  try {
    return normalized(actual) === normalized(template);
  } catch {
    return false;
  }
};

/** Plan all seed replacements from committed trees before any checkout write.
 * Historical manifests are needed because a kit-only update may have left a
 * seed several exports behind. A baseline is admitted only when both its
 * manifest hash and the corresponding ancestor core template agree.
 * updatesKit is false only when the starter already carries this release, so
 * the refresh verifies nothing unless a seed is rewritten. */
export function planStarterSeeds({
  main,
  head,
  checkout,
  remote,
  updatesKit = true,
}) {
  const pending = [];
  const displayName = releaseName(checkout, remote);
  for (const [path, name] of seeds) {
    const template = `scripts/kit/${name}`;
    const incoming = blob(main, head, template);
    if (incoming === null)
      throw new Error(`seed template unavailable: ${template}`);
    const current = blob(checkout, remote, path);
    // The display name belongs to the destination. Updating instructions must
    // not change a legacy default or overwrite its instance configuration.
    const bytes = namedStarterSeed(path, incoming, displayName);
    const mode = entryMode(checkout, remote, path);
    const regularFile = mode === "100644";
    if (!regularFile || !matches(path, current, bytes))
      pending.push({
        path,
        template,
        current,
        bytes,
        templateBytes: incoming,
        mode,
        regularFile,
      });
  }
  if (!pending.length) return [];
  const history = git(checkout, [
    "log",
    "--format=%H",
    remote,
    "--",
    "KIT-MANIFEST.json",
  ])
    .split("\n")
    .filter(Boolean);
  const proven = new Set();
  const latestTemplates = new Map();
  for (const revision of history) {
    let manifest;
    try {
      manifest = JSON.parse(blob(checkout, revision, "KIT-MANIFEST.json"));
    } catch {
      continue;
    }
    if (
      !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(manifest?.commit ?? "") ||
      !Array.isArray(manifest.files) ||
      git(main, ["merge-base", "--is-ancestor", manifest.commit, head], {
        onFailure: () => false,
      }) === false
    )
      continue;
    for (const item of pending) {
      if (proven.has(item.path)) continue;
      const source = blob(checkout, revision, item.template);
      const expected = blob(main, manifest.commit, item.template);
      if (
        source === null ||
        source !== expected ||
        manifest.files.find((file) => file.path === item.template)?.sha256 !==
          sha256Hex(Buffer.from(source))
      )
        continue;
      if (!latestTemplates.has(item.path))
        latestTemplates.set(item.path, source);
      const previousSeed = blob(checkout, revision, item.path);
      const rendered = namedStarterSeed(
        item.path,
        source,
        releaseName(checkout, revision),
      );
      if (
        item.regularFile &&
        entryMode(checkout, revision, item.path) === "100644" &&
        (item.path === "README.md"
          ? item.current === previousSeed
          : matches(item.path, item.current, source)) &&
        (matches(item.path, previousSeed, source) ||
          matches(item.path, previousSeed, rendered))
      )
        proven.add(item.path);
    }
    if (proven.size === pending.length) break;
  }
  // Unchanged templates do not make unrelated customization block a kit
  // refresh. A known older exported copy still advances to the incoming seed.
  const refused = pending.filter(
    (item) =>
      !proven.has(item.path) &&
      latestTemplates.get(item.path) !== item.templateBytes,
  );
  if (refused.length)
    throw new Error(
      `starter seed differs from prior export: ${refused.map((item) => item.path).join(", ")}; no seed replaced or pushed. Preserve the customized bytes, restore each affected starter copy from its prior exported template in a reviewed change, then retry refresh`,
    );
  // A kept copy of a seed that verification reads must stay usable by it, or
  // the same refresh would fail later at emit or staging without its path.
  const verifies = updatesKit || proven.size > 0;
  const unusable = pending.flatMap((item) => {
    if (!verifies || proven.has(item.path) || !verificationSeeds.has(item.path))
      return [];
    const restore = `restore ${item.path} from ${item.template}`;
    const fault =
      item.current === null
        ? "missing"
        : !["100644", "100755"].includes(item.mode)
          ? "not a regular file"
          : item.path === "CLAUDE.md"
            ? floorFault(item.current)
            : null;
    // Broken markers keep their hand-written text: repairing them keeps the
    // operator's words, which restoring the template would discard.
    if (fault === "markers")
      return [
        {
          reason: `${item.path} (harness markers are not one ordered pair)`,
          remedy: `repair ${item.path} to keep its hand-written text with one ordered ${start} … ${end} pair or no markers, or ${restore}`,
        },
      ];
    if (fault === "floor")
      return [
        {
          reason: `${item.path} (no hand-written floor outside the generated block)`,
          remedy: restore,
        },
      ];
    return fault
      ? [{ reason: `${item.path} (${fault})`, remedy: restore }]
      : [];
  });
  if (unusable.length) {
    const remedies = unusable.map((item) => item.remedy).join(" and ");
    throw new Error(
      `starter seed unusable by the refresh's own verification: ${unusable.map((item) => item.reason).join(", ")}; no seed replaced or pushed. ${remedies[0].toUpperCase()}${remedies.slice(1)} in a reviewed starter change, then retry refresh`,
    );
  }
  return pending
    .filter((item) => proven.has(item.path))
    .sort((left, right) => left.path.localeCompare(right.path));
}
