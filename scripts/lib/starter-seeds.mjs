import {
  HARNESS_START as start,
  HARNESS_END as end,
  harnessInstructionBlock,
  composeHarnessInstruction,
  migrateHarnessFloor,
} from "./harness-instruction.mjs";
import { runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import { json, sha256Hex } from "./helpers.mjs";
import {
  defaultDocRelative,
  CONFIG_FILENAME,
  validateConfig,
} from "./config.mjs";
import { releaseClaimLine } from "./release-preparation.mjs";
import { posix } from "node:path";

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
/** The documentation map every instance carries, and the kit template the
 * export writes it from. It follows the front page's rule, not a template
 * seed's: a starter that lacks it has it added with the other absent seeds,
 * one that still holds an export's bytes is brought to the current map, and
 * one its owner changed is kept with the reason and never refuses a
 * refresh. */
export const DOCS_MAP_SEED = defaultDocRelative("docs", "README.md");
export const DOCS_MAP_TEMPLATE = "docs-map.template.md";
/** The SHA-256 of each map an export wrote before the map had a template,
 * when the export rendered it in code and no kit file held its text. A
 * starter's copy at one of these is an export's own output. The list is
 * closed: a map written from the template is proven as a template seed is,
 * by the template the starter carried at the export that wrote it. Each
 * was computed from scripts/launchpad.mjs as it stood at every commit of
 * main in the range named, and the first equals the copy the starter held
 * (docs/evidence/WO-281/map-renderings.md). */
export const LEGACY_DOCS_MAPS = Object.freeze([
  // 57a35d9dc to 21b94f251 (2026-10-09 to 2026-10-14).
  "46020271d73a06bab3e77fa25885f4bffadc454079bd266f27e7c0edd50eed82",
  // 7f539327e (2026-10-15).
  "e9de062a7df85478fe0afe986114b5377a8af797072b3a62b34920f47e03a970",
  // d77886704 to 61aa912c3 (2026-10-17 to 2026-11-01).
  "b3585265990a24797fff18959d428485363f278b494a89198b4d129737156272",
  // 5b1130e30 to aeabb70a1 (2026-11-02 to 2026-11-06).
  "aa84b05470d80c7d70f14319903af815d4160a6ff196a00b7f763abbba406ead",
  // 7a9c290cd to 1763a2e28 (2026-11-08 to 2026-11-14), the last in code.
  "f7e227382649b6516b77e9921f858760f6aff9edc58f6a7cf457434018fca49d",
]);
/** The file in which an instance sets the time limits of its gate, and the
 * kit template the export writes it from: every key at the kit's figure. It
 * follows the documentation map's rule. A starter that lacks it has it added
 * with the other absent seeds, one that still holds an export's bytes is
 * brought to the current template, so that the starter lists a release's new
 * keys, and one its owner changed is kept with the reason and never refuses
 * a refresh. */
export const TIME_LIMITS_SEED = defaultDocRelative(
  "control",
  "time-limits.json",
);
export const TIME_LIMITS_TEMPLATE = "time-limits.template.json";
// The seeds that follow that rule, each with its template.
const FOLLOWING_SEEDS = [
  [DOCS_MAP_SEED, DOCS_MAP_TEMPLATE],
  [TIME_LIMITS_SEED, TIME_LIMITS_TEMPLATE],
];
// The seeds a refresh keeps, with the reason, where their owner changed
// them: the two pages a person edits first, and the owner's time limits.
const KEPT_WHEN_CUSTOMIZED = new Set([
  "README.md",
  DOCS_MAP_SEED,
  TIME_LIMITS_SEED,
]);

/** Every seed path the export writes, in its order: UPSTREAM.md's
 * `## Instance seeds` list and the starter refresh's absent-seed additions
 * read this one list, and the export refuses when its seeds differ from it
 * (WO-258). The roots named here are the export's seeded document roots. */
export const exportSeedPaths = () => [
  "README.md",
  CONFIG_FILENAME,
  ".gitignore",
  // An absent-seed addition like the file for core: the refresh adds it to a
  // starter that has none and never rewrites one that exists.
  ".gitattributes",
  "CLAUDE.md",
  "AI-HARNESS-SECURITY.md",
  // The instance's own file from its first byte: an absent-seed addition,
  // never a template seed, so no refresh rewrites or refuses its entries.
  "FOR-CORE.md",
  defaultDocRelative("workstreams", "README.md"),
  defaultDocRelative("docs", "repositories", "README.md"),
  defaultDocRelative("workOrders", "WO-001-environment-truth.md"),
  defaultDocRelative("docs", "README.md"),
  ...[
    "control",
    "evidence",
    "verifications",
    "finalReviews",
    "planning",
    "publication",
    "product",
    "discovery",
    "decisions",
    "releases",
    "observations",
  ].map((key) => defaultDocRelative(key, "README.md")),
  defaultDocRelative("planning", "sequence.md"),
  defaultDocRelative("intake", ".gitkeep"),
  defaultDocRelative("planning", "followups.json"),
  defaultDocRelative("control", "doc-baseline.json"),
  defaultDocRelative("control", "budgets.json"),
  TIME_LIMITS_SEED,
  defaultDocRelative("lineage", "idea-ledger.md"),
  defaultDocRelative("lineage", "README.md"),
  "packages/skeleton/loadouts/grants.json",
  "AGENTS.md",
];

/** The READMEs of the export's seeded roots that the documentation map
 * does not link, each by its path from the map: `links` are the map's link
 * targets. The roots are exportSeedPaths' own, so a root added to the seeds
 * is one the map must link, and the export refuses a map that links fewer. */
export const docsMapUnlinked = (links) => {
  const linked = new Set(links);
  return exportSeedPaths()
    .filter((path) => path.endsWith("/README.md") && path !== DOCS_MAP_SEED)
    .map((path) => posix.relative(posix.dirname(DOCS_MAP_SEED), path))
    .filter((target) => !linked.has(target));
};

/** The configuration the export seeds; a starter refresh adds the same
 * bytes where a starter lacks it (WO-258). */
export const exportConfiguration = () =>
  json({ version: 1, release: { displayName: "DotLn-Enterprise-Starter" } });

/** The template seeds' paths: each keeps its own rewrite and proof rules. */
export const TEMPLATE_SEED_PATHS = Object.freeze(seeds.map(([path]) => path));

/** Seeds the export once wrote and has since retired, each with every
 * rendering the kit wrote for it. A starter copy still at one of them is the
 * kit's own output and the refresh removes it; a customized copy is kept and
 * named in keptSeeds (WO-258). */
export const RETIRED_SEEDS = Object.freeze([
  {
    // Seeded from cbd0b4b6 until 4a09509b retired the document byte ceilings.
    path: defaultDocRelative("control", "doc-ceilings.json"),
    renderings: [json({ schemaVersion: 1, documents: {} })],
  },
]);
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
/** The seeds a refresh adds and removes beside its template rewrites: every
 * export seed the starter lacks, other than a template seed (whose own rules
 * keep or refuse a missing copy), and every retired seed still at a kit
 * rendering; a customized retired seed is kept with its reason. Planned from
 * the starter's committed tree before any write. */
export function planSeedChanges({ checkout, remote, exportSeeds }) {
  const added = exportSeeds.filter(
    (path) =>
      !TEMPLATE_SEED_PATHS.includes(path) &&
      entryMode(checkout, remote, path) === null,
  );
  const removed = [];
  const kept = [];
  for (const seed of RETIRED_SEEDS) {
    const mode = entryMode(checkout, remote, seed.path);
    if (mode === null) continue;
    if (
      mode === "100644" &&
      seed.renderings.includes(blob(checkout, remote, seed.path))
    )
      removed.push(seed.path);
    else
      kept.push({
        path: seed.path,
        reason:
          mode === "100644"
            ? "a retired seed, customized; differs from every rendering the kit wrote"
            : "a retired seed that is not a regular seed file (expected mode 100644)",
      });
  }
  return { added, removed, kept };
}

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
  // The name a configuration the same refresh adds gives the starter, so the
  // README it rewrites names the starter as that configuration does.
  addedDisplayName,
}) {
  const pending = [];
  const displayName = addedDisplayName ?? releaseName(checkout, remote);
  for (const [path, name] of [...seeds, ...FOLLOWING_SEEDS]) {
    const template = `scripts/kit/${name}`;
    const incoming = blob(main, head, template);
    if (incoming === null)
      throw new Error(`seed template unavailable: ${template}`);
    const current = blob(checkout, remote, path);
    // The display name belongs to the destination. Updating instructions must
    // not change a legacy default or overwrite its instance configuration.
    const bytes = namedStarterSeed(path, incoming, displayName);
    const mode = entryMode(checkout, remote, path);
    // A starter that lacks the map or the time limits has the file added
    // with the other absent seeds.
    if (FOLLOWING_SEEDS.some(([seed]) => seed === path) && mode === null)
      continue;
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
  if (!pending.length) return { rewrites: [], kept: [] };
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
  // A map that an export rendered in code, before the map had a template to
  // be proven by, is that export's output by its bytes.
  for (const item of pending)
    if (
      item.path === DOCS_MAP_SEED &&
      item.regularFile &&
      LEGACY_DOCS_MAPS.includes(sha256Hex(Buffer.from(item.current)))
    )
      proven.add(item.path);
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
      !KEPT_WHEN_CUSTOMIZED.has(item.path) &&
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
  return {
    rewrites: pending
      .filter((item) => proven.has(item.path))
      .sort((left, right) => left.path.localeCompare(right.path)),
    kept: pending
      .filter(
        (item) => KEPT_WHEN_CUSTOMIZED.has(item.path) && !proven.has(item.path),
      )
      .map((item) => ({
        path: item.path,
        reason:
          item.mode === null
            ? "missing"
            : !item.regularFile
              ? "not a regular seed file (expected mode 100644)"
              : "customized; differs from proven prior exports",
      })),
  };
}
