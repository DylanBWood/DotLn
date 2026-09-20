import { randomBytes } from "node:crypto";
import { lstatSync, readFileSync, readlinkSync, realpathSync } from "node:fs";
import { isAbsolute, join, resolve, sep } from "node:path";
import { observedExecFileSync as execFileSync } from "./gate-deadlines.mjs";
import {
  MISSION_CAPSULE_BOUNDS,
  MISSION_SURFACE_CLAUSE,
  type MissionSource,
  missionPath,
  missionSubject,
  type MissionCheckPin,
  type MissionCheckSubject,
  type MissionClause,
  type MissionContract,
  type MissionDecision,
  type MissionExclusion,
  type MissionIgnoredBaselineEntry,
  type MissionIgnoredEntry,
  type MissionObservation,
  type MissionStoryContract,
  type MissionThesis,
} from "./mission-check-protocol.js";
import { sha256Text } from "./sha256.js";
import { WorkerFailure } from "./worker-protocol.js";

export type { MissionSource };

const refuse = (detail: string): never => {
  throw new WorkerFailure("profile-refused", detail);
};
const bounded = (root: string, path: string): string => {
  if (!isAbsolute(root) || resolve(root) !== root)
    refuse("mission source needs a canonical absolute worktree");
  if (!missionPath(path))
    refuse(`mission source path is not repository-relative: ${path}`);
  return join(root, path);
};
/** The canonical path of a file that really sits inside the worktree, or `null`
 * when it resolves anywhere else. A repository-relative name is not proof of
 * containment: any component of it can be a link pointing out of the worktree,
 * and the capsule may only carry bytes the worktree itself holds. */
const insideWorktree = (root: string, absolute: string): string | null => {
  try {
    const canonical = realpathSync(root);
    const resolved = realpathSync(absolute);
    return resolved === canonical || resolved.startsWith(canonical + sep)
      ? resolved
      : null;
  } catch {
    return null;
  }
};
/** A declared source file, read only when it is a contained regular file whose
 * size is already inside the bound. The size is checked before the read, so an
 * enormous or special file fails at the declared boundary instead of being
 * allocated first and measured afterwards. */
const read = (root: string, path: string, limit = 200_000): string => {
  const resolved =
    insideWorktree(root, bounded(root, path)) ??
    refuse(`mission source file resolves outside the worktree: ${path}`);
  const entry = lstatSync(resolved);
  if (!entry.isFile())
    refuse(`mission source file is not a regular file: ${path}`);
  if (entry.size > limit) refuse(`mission source file exceeds ${limit} bytes`);
  const text = readFileSync(resolved, "utf8");
  if (text.length > limit) refuse(`mission source file exceeds ${limit} bytes`);
  return text;
};
const collapse = (value: string): string => value.replace(/\s+/gu, " ").trim();
/** Context the host supplies but never compares byte for byte. Its bound is
 * declared in the text itself, so a judge reading a cut decision or thesis can
 * see that it was cut rather than treat the remainder as the whole. */
const CUT = " […] (truncated by the mission capsule)";
const contextText = (value: string, limit: number): string =>
  value.length <= limit ? value : value.slice(0, limit - CUT.length) + CUT;
/** Content the capsule can carry as diff text; the subject assertion refuses
 * control bytes, so an unrepresentable section is named as omitted instead. */
const representable = (value: string): boolean =>
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value);
const missionGit = (source: MissionSource, ...args: string[]): string =>
  execFileSync("git", args, {
    cwd: source.root,
    timeout: 15_000,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).toString();
const zero = (value: string): string[] => value.split("\0").filter(Boolean);
const surfaceCovers = (surface: string, path: string): boolean =>
  path === surface || path.startsWith(`${surface}/`);
type IgnoredInventoryEntry = Omit<MissionIgnoredBaselineEntry, "evidence"> & {
  readonly path: string;
};
const ignoredEvidence = (salt: string, path: string): string =>
  `ignored-entry:sha256:${sha256Text(`${salt}\u0000${path}`)}`;
/** Git collapses excluded directories to one entry. The inventory records only
 * an opaque path id and bounded lstat metadata: private ignored names and file
 * contents never enter the capsule or its pin. */
const ignoredInventory = (
  source: MissionSource,
  surfaces: readonly string[],
): readonly IgnoredInventoryEntry[] => {
  const listed = zero(
    missionGit(
      source,
      "ls-files",
      "--others",
      "--ignored",
      "--exclude-standard",
      "--directory",
      "--full-name",
      "-z",
    ),
  ).map((path) => (path.endsWith("/") ? path.slice(0, -1) : path));
  // Negated directory rules can make Git report a directory beside the
  // ignored descendants it contains. Keep the leaf entries: the parent adds
  // no distinct work and would count the same change twice.
  const parents = new Set<string>();
  for (const path of listed) {
    const parts = path.split("/");
    for (let index = 1; index < parts.length; index++)
      parents.add(parts.slice(0, index).join("/"));
  }
  const paths = listed.filter((path) => !parents.has(path));
  if (paths.length > MISSION_CAPSULE_BOUNDS.paths)
    refuse(
      `mission source found ${paths.length} collapsed ignored entries, more than the ${MISSION_CAPSULE_BOUNDS.paths} the capsule can name`,
    );
  if (new Set(paths).size !== paths.length)
    refuse("mission source listed an ignored entry twice");
  return paths.map((path) => {
    if (!missionPath(path))
      refuse("mission source found an ignored entry the capsule cannot name");
    const entry = (() => {
      try {
        return lstatSync(bounded(source.root, path));
      } catch {
        return refuse("mission source could not inspect an ignored entry");
      }
    })();
    const kind = entry.isFile()
      ? "file"
      : entry.isDirectory()
        ? "directory"
        : entry.isSymbolicLink()
          ? "symlink"
          : "other";
    // A collapsed directory's only metadata is its own, and creating or
    // removing a direct child moves its mtime and size. Ordinary rebuilds do
    // exactly that — the build stages a directory directly under `.runtime/`
    // and publishes files into each `dist/` — while the pin is fixed at actor
    // declaration, so a collapsed root fingerprinted by mtime never matches
    // its baseline again and every later pulse holds over the tooling's own
    // residue, which no human answer or verified repair can retire (WO-099
    // VER-005 F1). A directory is therefore fingerprinted by kind and mode
    // alone: it still drifts when it appears, disappears, changes kind or
    // changes mode, and what happens inside it remains the collapsed-directory
    // boundary this design already discloses. Files, symlinks and other kinds
    // keep size and mtime, so a baselined ignored file whose bytes move is
    // still observed as work.
    const metadata =
      kind === "directory"
        ? [kind, entry.mode]
        : [kind, entry.mode, entry.size, entry.mtimeMs];
    return {
      path,
      fingerprint: `sha256:${sha256Text(JSON.stringify(metadata))}`,
      outsideDeclaredSurfaces: !surfaces.some((surface) =>
        surfaceCovers(surface, path),
      ),
    };
  });
};

/** Bounded projection of the documented work-order shape. Prose that is not
 * one of these clauses never becomes a contract clause. */
export function missionClauses(
  markdown: string,
  declaredSurfaces: readonly string[],
): readonly MissionClause[] {
  const surfaces = `Declared surfaces: ${[...declaredSurfaces].join(", ")}`;
  if (surfaces.length > MISSION_CAPSULE_BOUNDS.clauseChars)
    refuse("mission contract declares more surfaces than one clause can name");
  const clauses: MissionClause[] = [
    { id: MISSION_SURFACE_CLAUSE, kind: "surface", text: surfaces },
  ];
  // A clause longer than the bound is carried in parts, never cut: the pinned
  // and observed projections must still differ when the operator edits a
  // contract past that bound, which is the whole mid-episode change rule.
  const push = (id: string, kind: MissionClause["kind"], text: string) => {
    const limit = MISSION_CAPSULE_BOUNDS.clauseChars;
    if (text.length <= limit) {
      clauses.push({ id, kind, text });
      return;
    }
    for (let at = 0, part = 1; at < text.length; at += limit, part++)
      clauses.push({
        id: `${id}:part:${part}`,
        kind,
        text: text.slice(at, at + limit),
      });
  };
  // `$` means end of line under the m flag, which would truncate every block
  // at its first newline. End of input is the explicit alternative here.
  const END = "(?![\\s\\S])";
  const block = (label: string): string | undefined => {
    const match = markdown.match(
      new RegExp(
        `^\\*\\*${label}:?\\*\\*([\\s\\S]*?)(?=\\n\\n\\*\\*|\\n\\n#|${END})`,
        "mu",
      ),
    );
    const text = match?.[1] && collapse(match[1]);
    return text || undefined;
  };
  const objective = block("Objective");
  if (objective) push("contract:objective", "objective", objective);
  const criteria = markdown.match(
    new RegExp(
      `^\\*\\*Acceptance criteria[^*]*\\*\\*\\r?\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n## |${END})`,
      "mu",
    ),
  )?.[1];
  for (const [, index, text] of (criteria ?? "").matchAll(
    new RegExp(`^(\\d+)\\.\\s([\\s\\S]*?)(?=\\n\\d+\\.\\s|${END})`, "gmu"),
  ))
    push(`contract:criterion:${index}`, "criterion", collapse(text!));
  const nonGoals = block("Non-goals");
  if (nonGoals) push("contract:non-goals", "non-goal", nonGoals);
  const evidence = block("Evidence gate");
  if (evidence) push("contract:evidence-gate", "constraint", evidence);
  if (clauses.length < 2)
    refuse("mission contract projection found no objective or criterion");
  return clauses;
}
/** Structured decision receipts, newest last, bounded to the declared window. */
export function missionDecisions(
  markdown: string,
  limit: number,
): readonly MissionDecision[] {
  const rows: MissionDecision[] = [];
  for (const [, block] of markdown.matchAll(/```json\r?\n([\s\S]*?)```/gu)) {
    let decision: { id?: unknown; decision?: unknown };
    try {
      decision = JSON.parse(block!) as typeof decision;
    } catch {
      continue;
    }
    if (
      typeof decision.id === "string" &&
      typeof decision.decision === "string"
    )
      rows.push({
        id: decision.id,
        text: contextText(
          collapse(decision.decision),
          MISSION_CAPSULE_BOUNDS.decisionChars,
        ),
      });
  }
  // `slice(-0)` is the whole list, not the empty window a zero limit declares.
  const window = Math.min(limit, MISSION_CAPSULE_BOUNDS.decisions);
  return window > 0 ? rows.slice(-window) : [];
}
export function missionTheses(
  markdown: string,
  headings: readonly (readonly [string, string])[],
): readonly MissionThesis[] {
  const theses = headings.flatMap(([id, title]) => {
    const text = section(markdown, title);
    return text
      ? [
          {
            id,
            title,
            text: contextText(text, MISSION_CAPSULE_BOUNDS.thesisChars),
          },
        ]
      : [];
  });
  if (!theses.length) refuse("mission capsule found no vision thesis");
  return theses;
}
export function missionExclusions(
  markdown: string,
): readonly MissionExclusion[] {
  const source = section(markdown, "What DotLn is not");
  const exclusions = [
    ...(source ?? "").matchAll(/^- ([\s\S]*?)(?=^- |\n\n|(?![\s\S]))/gmu),
  ].map((match, index) => ({
    id: `what-dotln-is-not:${index + 1}`,
    text: contextText(collapse(match[1]!), MISSION_CAPSULE_BOUNDS.clauseChars),
  }));
  if (!exclusions.length) refuse("mission capsule found no vision exclusion");
  return exclusions.slice(0, 50);
}
function section(markdown: string, title: string): string | undefined {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return markdown.match(
    new RegExp(
      `^#{2,3} ${escaped}\\s*\\n([\\s\\S]*?)(?=\\n#{2,3} |(?![\\s\\S]))`,
      "mu",
    ),
  )?.[1];
}

const contractOf = (
  source: MissionSource,
  workOrderId: string,
): MissionContract => ({
  workOrderId,
  clauses: missionClauses(
    read(source.root, source.contractPath),
    source.declaredSurfaces,
  ),
  declaredSurfaces: [...source.declaredSurfaces],
});
const storyOf = (source: MissionSource): MissionStoryContract | null =>
  source.storyPath
    ? {
        storyId: source.storyPath,
        clauses: missionClauses(
          read(source.root, source.storyPath),
          source.declaredSurfaces,
        ),
      }
    : null;

/** Pinned when the actor is declared: what the episode is told the work is. */
export function missionPinFromSource(
  source: MissionSource,
  workOrderId: string,
): MissionCheckPin {
  const vision = read(source.root, source.visionPath);
  const ignoredSalt = randomBytes(32).toString("hex");
  return {
    schemaVersion: "mission-check-v1",
    contract: contractOf(source, workOrderId),
    storyContract: storyOf(source),
    theses: missionTheses(vision, source.thesisHeadings),
    exclusions: missionExclusions(vision),
    ignoredSalt,
    ignoredBaseline: ignoredInventory(source, source.declaredSurfaces).map(
      ({ path, ...entry }) => ({
        evidence: ignoredEvidence(ignoredSalt, path),
        ...entry,
      }),
    ),
  };
}
/** Observed at dispatch: the contract as it reads now, the current diff and
 * the last N decisions. Nothing here is a model claim. */
export function observeMission(
  source: MissionSource,
  pin: MissionCheckPin,
): MissionObservation {
  const tracked = zero(
    missionGit(
      source,
      "diff",
      "--no-ext-diff",
      "--no-textconv",
      "--no-renames",
      "--name-only",
      "-z",
      source.baseCommit,
      "--",
    ),
  );
  // Branch commits are forbidden before final review, so new work is ordinarily
  // untracked during the very interval this episode supervises. A diff that
  // cannot see it would certify an out-of-surface new file as on-mission.
  const untracked = zero(
    missionGit(
      source,
      "ls-files",
      "--others",
      "--exclude-standard",
      "--full-name",
      "-z",
    ),
  );
  const changedPaths = [...tracked, ...untracked];
  const ignored = ignoredInventory(source, pin.contract.declaredSurfaces).map(
    ({ path, ...entry }) => ({
      evidence: ignoredEvidence(pin.ignoredSalt, path),
      ...entry,
    }),
  );
  const baseline = new Map(
    pin.ignoredBaseline.map((entry) => [entry.evidence, entry]),
  );
  const current = new Map(ignored.map((entry) => [entry.evidence, entry]));
  const ignoredEntries: MissionIgnoredEntry[] = [
    ...ignored
      .filter((entry) => {
        const prior = baseline.get(entry.evidence);
        return (
          !prior ||
          prior.fingerprint !== entry.fingerprint ||
          prior.outsideDeclaredSurfaces !== entry.outsideDeclaredSurfaces
        );
      })
      .map(({ evidence, outsideDeclaredSurfaces }) => ({
        evidence,
        outsideDeclaredSurfaces,
      })),
    ...pin.ignoredBaseline
      .filter((entry) => !current.has(entry.evidence))
      .map(({ evidence, outsideDeclaredSurfaces }) => ({
        evidence,
        outsideDeclaredSurfaces,
      })),
  ];
  if (
    changedPaths.length + ignoredEntries.length >
    MISSION_CAPSULE_BOUNDS.paths
  )
    refuse(
      `mission source changed ${changedPaths.length + ignoredEntries.length} paths and ignored entries, more than the ${MISSION_CAPSULE_BOUNDS.paths} the capsule can name`,
    );
  if (new Set(changedPaths).size !== changedPaths.length)
    refuse("mission source listed a changed path twice");
  for (const path of changedPaths)
    if (!missionPath(path))
      refuse(`mission source changed a path the capsule cannot name: ${path}`);
  const whole = missionGit(
    source,
    "diff",
    "--no-ext-diff",
    "--no-textconv",
    "--no-renames",
    source.baseCommit,
    "--",
  );
  // One section per changed path, in the order git listed them, so a path whose
  // text will not fit can be named instead of cut out of the middle of a diff.
  const split = whole ? whole.split(/^diff --git /mu).slice(1) : [];
  if (split.length !== tracked.length)
    refuse(
      `mission source produced ${split.length} diff sections for ${tracked.length} tracked changes`,
    );
  const sections = new Map<string, string | null>(
    tracked.map((path, index) => [path, `diff --git ${split[index]!}`]),
  );
  for (const path of untracked)
    sections.set(path, untrackedSection(source.root, path));
  // Smallest first, so one generated log cannot crowd every source change out
  // of the capsule; the text itself stays in the order git listed the paths.
  const carried = new Set<string>();
  let budget = MISSION_CAPSULE_BOUNDS.diffChars;
  for (const path of [...changedPaths].sort(
    (left, right) =>
      (sections.get(left)?.length ?? Infinity) -
      (sections.get(right)?.length ?? Infinity),
  )) {
    const section = sections.get(path) ?? null;
    if (section === null || !representable(section)) continue;
    if (section.length > budget) break;
    budget -= section.length;
    carried.add(path);
  }
  const text = changedPaths
    .filter((path) => carried.has(path))
    .map((path) => sections.get(path)!)
    .join("");
  const omittedPaths = changedPaths.filter((path) => !carried.has(path));
  // A zero window declares that no decision is required, so none is read.
  const history =
    source.decisionsPath && source.decisionLimit > 0
      ? readDecisions(source)
      : { text: "", omitted: null };
  return {
    contract: contractOf(source, pin.contract.workOrderId),
    diff: {
      baseCommit: missionGit(source, "rev-parse", source.baseCommit).trim(),
      revision: missionGit(source, "rev-parse", "--short", "HEAD").trim(),
      changedPaths,
      text,
      omittedPaths,
      ignoredEntries,
    },
    decisions: missionDecisions(history.text, source.decisionLimit),
    omittedDecisions: history.omitted,
  };
}
/** Untracked work rendered as the new file Git would record. `null` when the
 * bytes cannot be read or carried, in which case the path is named as omitted.
 * The capsule never follows a link out of the worktree: a symlink is carried as
 * the link it is, exactly as Git records one, and its target's bytes stay where
 * they are. */
function untrackedSection(root: string, path: string): string | null {
  const absolute = join(root, path);
  let entry;
  try {
    entry = lstatSync(absolute);
  } catch {
    return null;
  }
  const header = (mode: string) =>
    `diff --git a/${path} b/${path}\nnew file mode ${mode}\n`;
  if (entry.isSymbolicLink()) {
    let target: string;
    try {
      target = readlinkSync(absolute);
    } catch {
      return null;
    }
    // Git stores a link's target as its content, so this is the whole change
    // the work made. Reading through the link would put a file the worktree
    // does not contain in front of the judge.
    const link = `${header("120000")}--- /dev/null\n+++ b/${path}\n@@ -0,0 +1 @@\n+${target}\n\\ No newline at end of file\n`;
    return representable(link) &&
      link.length <= MISSION_CAPSULE_BOUNDS.diffChars
      ? link
      : null;
  }
  // A directory, device, socket or fifo is not work the capsule can carry, and
  // reading one is not bounded by its size: name the path as omitted instead.
  if (!entry.isFile()) return null;
  const mode = entry.mode & 0o111 ? "100755" : "100644";
  // Bounded before allocation: a byte count is never below the character count
  // the capsule measures, so an oversized file is left out unread.
  if (header(mode).length + entry.size > MISSION_CAPSULE_BOUNDS.diffChars)
    return null;
  // A parent component can still be a link out of the worktree, and Git lists
  // what it finds under one as an ordinary path.
  const resolved = insideWorktree(root, absolute);
  if (resolved === null) return null;
  let text: string;
  try {
    text = readFileSync(resolved, "utf8");
  } catch {
    return null;
  }
  if (!text) return header(mode);
  if (header(mode).length + text.length > MISSION_CAPSULE_BOUNDS.diffChars)
    return null;
  const lines = text.split("\n");
  const terminated = lines.at(-1) === "";
  if (terminated) lines.pop();
  return (
    `${header(mode)}--- /dev/null\n+++ b/${path}\n@@ -0,0 +1,${lines.length} @@\n` +
    lines.map((line) => `+${line}`).join("\n") +
    (terminated ? "\n" : "\n\\ No newline at end of file\n")
  );
}
/** The declared decision history, or why it could not be carried. A work order
 * whose decisions file does not exist yet has an empty history, which is not a
 * drift. A file that exists but cannot be read inside the declared boundary —
 * past the size bound, resolving outside the worktree, not a regular file —
 * is a different thing: the judge is told the history exists and was not
 * shown, and no pass is certified over it. Absence is never inferred from a
 * failed read. */
const readDecisions = (
  source: MissionSource,
): { text: string; omitted: string | null } => {
  const path = source.decisionsPath!;
  const omitted = (error: unknown) => ({
    text: "",
    omitted: `decision history ${path} was not carried: ${
      error instanceof WorkerFailure
        ? (error.detail ?? error.code)
        : String((error as { code?: unknown }).code ?? "unreadable")
    }`,
  });
  try {
    lstatSync(bounded(source.root, path));
  } catch (error) {
    // Only a missing entry is absence; a stat the host cannot make is named.
    return ["ENOENT", "ENOTDIR"].includes(
      String((error as { code?: unknown }).code),
    )
      ? { text: "", omitted: null }
      : omitted(error);
  }
  try {
    return { text: read(source.root, path), omitted: null };
  } catch (error) {
    return omitted(error);
  }
};
export const observeMissionSubject = (
  source: MissionSource,
  pin: MissionCheckPin,
): MissionCheckSubject => missionSubject(pin, observeMission(source, pin));
