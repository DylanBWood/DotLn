import { docRelative } from "./config.mjs";
import {
  appendFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { containedRegularFile } from "./paths.mjs";
import { committedReader, sha256 } from "./plan-subject.mjs";
import { checkLocalTerms } from "./terms.mjs";
import { runGit, runGitPathList } from "./git.mjs";
import { validateAccountLabel } from "./control-actor.mjs";

/**
 * The dispatch host for the compiled Entropy Reducer. It owns what the loadout
 * deliberately does not: freezing a subject, carrying the compiled plan to one
 * fresh worker, binding what comes back with the loadout's own validators,
 * numbering immutable receipts and recording the operator's disposition. The
 * loadout, its residue, actor pin, authority envelope and Program are inputs
 * here and are never edited; this host selects the serial route and drives
 * the compiled manual plan, as the refutation host drives its one-shot order.
 */

const SCHEMA = "entropy-review-receipt-v1";
const PINNED_IDENTITY = "entropy-reducer@1";
const SUBSTITUTE_IDENTITY = "substitute reviewer";
/** A run filed before this mechanism existed carries the 2026-09-04 hand-written
 * shape, not this receipt schema. Its bytes are read and never re-bound. The
 * discriminator is the file's own schema, never its number: the first receipt
 * of a fresh launchpad is also REVIEW-001 and must be bound like any other. */
const preMechanism = (root, name) => {
  const path = join(root, runsRoot(root), `${name}.json`);
  if (!existsSync(path)) return false;
  try {
    return JSON.parse(readFileSync(path, "utf8")).schemaVersion !== SCHEMA;
  } catch {
    return false;
  }
};
const SCRATCH_EXCLUDED = [".git/**", "**/node_modules/**"];
const EPISODE_WINDOW_MS = 24 * 60 * 60 * 1000;
const FILING_TYPES = ["EntropyReviewFiled", "EntropyRefutationFiled"];

const instanceRoot = (root) =>
  docRelative(root, "docs", "instance/entropy-reducer");
export const runsRoot = (root) => `${instanceRoot(root)}/runs`;
export const controlLog = (root) =>
  docRelative(root, "control", "entropy-reducer.jsonl");
const localRoot = (root) => docRelative(root, "control", "local/entropy");
const reviewsRoot = (root) => docRelative(root, "planning", "entropy-reviews");
const proposalsRoot = (root) => docRelative(root, "docs", "proposals");

const check = (condition, reason) => {
  if (!condition) throw new Error(reason);
};
const hex = (value) => sha256(value).slice(7);
const exact = (value, keys) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");
const timestamp = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(value) &&
  Number.isFinite(Date.parse(value));
const validDigest = (value) =>
  typeof value === "string" && /^sha256:[0-9a-f]{64}$/u.test(value);
export const validReceiptId = (value) =>
  typeof value === "string" && /^(REVIEW|REFUTATION)-\d{3}$/u.test(value);
const readJson = (path, label) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(`invalid JSON: ${label}`);
  }
};
const skeleton = (name) =>
  import(`../../packages/skeleton/dist/src/${name}.js`);

const ensureDirectory = (root, path) => {
  let directory = root;
  for (const part of path.split("/")) {
    directory = join(directory, part);
    if (!existsSync(directory)) mkdirSync(directory);
    check(
      lstatSync(directory).isDirectory() &&
        !lstatSync(directory).isSymbolicLink(),
      `entropy evidence directory must not be a symlink: ${path}`,
    );
  }
};

/** One writer at a time, so two sessions cannot claim the same number. */
const locked = async (root, run) => {
  ensureDirectory(root, runsRoot(root));
  const lock = join(root, runsRoot(root), ".writer-lock");
  try {
    mkdirSync(lock);
  } catch {
    throw new Error(
      "entropy evidence writer already active; inspect any interrupted writer before retrying",
    );
  }
  try {
    return await run();
  } finally {
    rmdirSync(lock);
  }
};

/** An operator-named input file. The capture lane sits outside the repository
 * under the granted system-temp root, so containment is checked against either
 * the repository or that lane, and a symbolic link is never followed. */
const namedInput = (root, lane, path) => {
  const absolute = resolve(root, path);
  check(
    existsSync(absolute) && lstatSync(absolute).isFile(),
    `expected a regular file: ${path}`,
  );
  const real = realpathSync(absolute);
  const roots = [
    realpathSync(root),
    ...(lane && existsSync(lane) ? [realpathSync(lane)] : []),
  ];
  check(
    roots.some((base) => real.startsWith(`${base}${sep}`)),
    `entropy input must sit inside the repository or this dispatch's capture lane: ${path}`,
  );
  return absolute;
};

// --------------------------------------------------------------- the subject

const trackedStatus = (root) =>
  runGit(root, ["status", "--porcelain", "--untracked-files=no"]);

/** Paths and sizes under the frozen copy, excluding the Git directory and
 * installed dependencies, as REVIEW-001 recorded its manifest. */
export function scratchInventory(directory) {
  const rows = [];
  const walk = (current, prefix) => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort(
      (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
    )) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) rows.push(`${name}\u0000symlink`);
      else if (entry.isDirectory()) walk(join(current, entry.name), name);
      else if (entry.isFile())
        rows.push(`${name}\u0000${lstatSync(join(current, entry.name)).size}`);
    }
  };
  walk(directory, "");
  return {
    excludedFromManifest: SCRATCH_EXCLUDED,
    count: rows.length,
    sha256: hex(rows.join("\n")),
    paths: rows.map((row) => row.split("\u0000")[0]),
    entries: rows.map((row) => row.split("\u0000")),
  };
}

/** SHA-256 of a sorted path list with each path NUL-terminated. A path may
 * contain a newline but never NUL, so distinct lists never share the hashed
 * bytes (WO-157 VER-001 F2: newline joining mapped ['a\nb', 'c'] and
 * ['a', 'b\nc'] to one hash). */
export const pathListDigest = (paths) =>
  hex(paths.map((path) => `${path}\u0000`).join(""));

/** The frozen copy's path-and-size inventory compared as sets (WO-157 item 9,
 * WO-151 D020): a net count cannot see one path gained and another lost. */
export const SCRATCH_DELTA_LISTED = 100;
export function scratchPathDelta(before, after) {
  const was = new Map(before);
  const now = new Map(after);
  const sets = {
    added: [...now.keys()].filter((path) => !was.has(path)).sort(),
    removed: [...was.keys()].filter((path) => !now.has(path)).sort(),
    resized: [...now.keys()]
      .filter((path) => was.has(path) && was.get(path) !== now.get(path))
      .sort(),
  };
  // A worker names these paths and a build can add hundreds, so a committed
  // receipt lists the first entries of each set and binds the whole set by
  // count and SHA-256 of its sorted paths.
  const listed = Object.fromEntries(
    Object.entries(sets).map(([name, paths]) => [
      name,
      paths.slice(0, SCRATCH_DELTA_LISTED),
    ]),
  );
  return {
    ...listed,
    counts: Object.fromEntries(
      Object.entries(sets).map(([name, paths]) => [name, paths.length]),
    ),
    sha256: Object.fromEntries(
      Object.entries(sets).map(([name, paths]) => [
        name,
        pathListDigest(paths),
      ]),
    ),
    listedPerSet: SCRATCH_DELTA_LISTED,
  };
}

/** The source repository's untracked, non-ignored paths, by count and hash
 * only. It is an observation, never part of the subject and never a refusal:
 * the dispatching session writes untracked evidence during an episode. */
const untrackedListing = (root) => {
  // Untrimmed: a path may begin or end with whitespace (WO-157 repair review).
  const paths = runGitPathList(root, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ]).sort();
  return { count: paths.length, sha256: pathListDigest(paths) };
};

/** The widened witness for a dispatch that recorded its before-state, or null
 * for one pending from before WO-157, which keeps the earlier shape. */
const widenedWitness = (root, pending, inventoryAfter) => {
  if (!pending.scratchInventoryBeforeEntries || !pending.untrackedListingBefore)
    return null;
  const after = untrackedListing(root);
  return {
    untrackedListing: {
      before: pending.untrackedListingBefore,
      after,
      identical: after.sha256 === pending.untrackedListingBefore.sha256,
    },
    scratchDelta: inventoryAfter
      ? {
          observed: true,
          ...scratchPathDelta(
            pending.scratchInventoryBeforeEntries,
            inventoryAfter.entries,
          ),
        }
      : { observed: false, ...scratchPathDelta([], []) },
  };
};
const CLAUDE_WITNESS_EXECUTION =
  "file tools confined to the frozen copy by --restricted; shell commands instructed to stay inside it and checked by the tracked-status hash on either side of the episode";
const CLAUDE_WIDENED_EXECUTION =
  "file tools confined to the frozen copy by --restricted; shell commands instructed to stay inside it and checked by the tracked-path status and untracked-listing hashes on either side of the episode";
/** The witness sentence for a receipt that carries the widened observation;
 * earlier receipts render their original line byte for byte. */
const witnessSentence = (confinement) => {
  const { untrackedListing: listing, scratchDelta: delta } = confinement;
  return `Source repository: tracked-path status unchanged across the episode: **${confinement.trackedStatusByteIdentical}**; untracked, non-ignored path listing unchanged: **${listing.identical}** (${listing.before.count} before, ${listing.after.count} after; recorded, never a refusal condition). Ignored paths and file contents are not observed. Frozen copy path-and-size inventory: ${delta.counts.added} path(s) added, ${delta.counts.removed} removed, ${delta.counts.resized} resized${delta.observed ? "" : " (not observed)"}.`;
};
const scratchDeltaSummary = (delta) =>
  "deltaCount" in delta ? delta.deltaCount : { ...delta.counts };

/**
 * One lane per launchpad, so an abandoned dispatch can be swept without
 * touching another checkout's live frozen copy. A frozen copy of this
 * repository is about 250 MB, so a leaked one is not free.
 */
export const entropyScratchLane = (root) =>
  join(tmpdir(), "dotln-entropy", hex(realpathSync(root)).slice(0, 16));

const scratchLane = (root) => {
  const lane = entropyScratchLane(root);
  mkdirSync(lane, { recursive: true, mode: 0o700 });
  return lane;
};

/**
 * A copy, never a link or a shared worktree: the reviewer may perturb it.
 * Installed dependencies are copied in beside it when the source has them, so
 * the worker can actually build and test rather than needing the network. They
 * are not part of the subject: the inventory excludes `node_modules`, the
 * workspace links inside it are relative and so resolve to this copy's own
 * packages, and the receipt records whether they were provisioned.
 */
function freezeSubject(root, baseCommit) {
  const parent = mkdtempSync(join(scratchLane(root), "review-"));
  const repository = join(parent, "repo");
  runGit(root, [
    "clone",
    "--no-hardlinks",
    "--quiet",
    "--no-checkout",
    root,
    repository,
  ]);
  runGit(repository, ["checkout", "--quiet", "--detach", baseCommit]);
  let dependencies = "absent";
  if (existsSync(join(root, "node_modules")))
    try {
      cpSync(join(root, "node_modules"), join(repository, "node_modules"), {
        recursive: true,
        // Keep the relative workspace links as links so they resolve here.
        verbatimSymlinks: true,
      });
      dependencies = "copied";
    } catch {
      dependencies = "copy-failed";
    }
  return { parent, repository, dependencies };
}

export function resolveSubject(root, revision) {
  const baseCommit = runGit(root, [
    "rev-parse",
    "--verify",
    `${revision}^{commit}`,
  ]);
  const status = trackedStatus(root);
  return { baseCommit, status, workingTreeDirty: status !== "" };
}

const subjectRecord = (root, baseCommit, status, inventory, repository) => {
  const subject = {
    schemaVersion: "entropy-review-v1",
    baseCommit,
    repository: root,
    scratchRepository: repository,
    trackedStatusSha256: hex(status),
    scratchInventorySha256: inventory.sha256,
    scratchInventoryCount: inventory.count,
    hash: "",
  };
  subject.hash = hex(
    JSON.stringify([
      subject.baseCommit,
      subject.trackedStatusSha256,
      subject.scratchInventorySha256,
      subject.scratchInventoryCount,
    ]),
  );
  return subject;
};

// ----------------------------------------------------------- the pending set

const pendingPath = (root, kind, subjectHash) =>
  `${localRoot(root)}/${kind}-${subjectHash.slice(0, 16)}.json`;
const pointerPath = (root, kind) => `${localRoot(root)}/current-${kind}.json`;

export function currentDispatch(root, kind) {
  const pointer = pointerPath(root, kind);
  if (!existsSync(join(root, pointer))) return null;
  const { path } = readJson(join(root, pointer), pointer);
  check(
    new RegExp(`^${localRoot(root)}/${kind}-[0-9a-f]{16}\\.json$`, "u").test(
      path,
    ),
    "invalid entropy dispatch pointer",
  );
  return existsSync(join(root, path)) ? readJson(join(root, path), path) : null;
}

const writePending = (root, kind, pending) => {
  const path = pendingPath(root, kind, pending.subjectHash);
  ensureDirectory(root, localRoot(root));
  writeFileSync(join(root, path), `${JSON.stringify(pending, null, 2)}\n`, {
    mode: 0o600,
  });
  writeFileSync(
    join(root, pointerPath(root, kind)),
    `${JSON.stringify({ path })}\n`,
    {
      mode: 0o600,
    },
  );
  return path;
};

const clearPending = (root, kind, pending) => {
  for (const path of [
    pendingPath(root, kind, pending.subjectHash),
    pointerPath(root, kind),
  ])
    if (existsSync(join(root, path))) rmSync(join(root, path));
};

/**
 * One dispatch at a time per kind. The pointer is single, so admitting a
 * second dispatch strands the first episode and its frozen copy, which the
 * command can then neither file nor discard. A changed tracked status makes a
 * different subject hash for the same named commit, so hash inequality is not
 * a licence to replace the pointer. Checked before the copy is made, so a
 * refusal costs no clone.
 */
const requireNoPending = (root, kind) => {
  const open = currentDispatch(root, kind);
  check(
    !open,
    `an entropy ${kind} dispatch is already pending (episode ${open?.episodeId}, subject ${open?.subjectHash.slice(0, 16)}, frozen copy ${open?.scratchParent}); file it with npm run entropy -- ${kind === "review" ? "receipt <result.json> --statement <statement.txt>" : "refutation-receipt <attempts.json>"}, or release it with npm run entropy -- discard ${kind}`,
  );
};

export function discardDispatch(root, kind) {
  const pending = currentDispatch(root, kind);
  check(pending !== null, `no entropy ${kind} dispatch is pending`);
  clearPending(root, kind, pending);
  if (pending.scratchParent && existsSync(pending.scratchParent))
    rmSync(pending.scratchParent, { recursive: true, force: true });
  return { discarded: pending.episodeId, subjectHash: pending.subjectHash };
}

// ------------------------------------------------------------ the attestation

export const TRANSPORT_DEFAULTS = {
  "claude-cli-print": {
    model: "claude-opus-5-5",
    effort: "xhigh",
    harness: "claude-code",
  },
  "codex-cli-exec": {
    model: "gpt-6-sol",
    effort: "xhigh",
    harness: "codex-cli",
  },
  fake: { model: "fixture", effort: "max", harness: "other:fixture" },
};

/**
 * A fact, not a claim. The launched route records what the host put on the
 * command line; the background route records a session attestation whose
 * effort is unknown unless the operator supplies one. Neither reports
 * effective readback, which no harness exposes. Only a launched pinned route
 * whose model, effort and harness match the compiled requirement reads
 * `entropy-reducer@1`; everything else is a labelled substitute.
 */
export function buildAttestation(
  {
    transport,
    model,
    effort,
    source,
    accountLabel,
    harness,
    harnessVersion,
    tools,
  },
  requirement,
) {
  if (accountLabel) validateAccountLabel(accountLabel);
  const route = transport ? "launched" : "background";
  const recordedSource =
    source ??
    (transport ? "command-line-readback-and-invocation" : "session-attested");
  const pinned =
    route === "launched" &&
    transport === "claude-cli-print" &&
    recordedSource === "command-line-readback-and-invocation" &&
    harness === requirement.harness &&
    model === requirement.model &&
    effort === requirement.effort;
  return {
    route,
    transport: transport ?? null,
    harness,
    harnessVersion: harnessVersion ?? "unknown",
    model,
    effort,
    source: recordedSource,
    accountLabel: accountLabel ?? null,
    tools: tools ?? [],
    effectiveModel: "unknown",
    effectiveEffort: "unknown",
    identity: pinned ? PINNED_IDENTITY : SUBSTITUTE_IDENTITY,
    substitutionReason: pinned
      ? null
      : route === "background"
        ? `background worker: selection and independence are session-attested, not read back from an invocation, and effective effort is ${effort}`
        : `${transport} at ${model}/${effort} does not match ${requirement.displayModel} at ${requirement.effort} by invocation readback`,
    substitutionPolicy: requirement.substitutionPolicy,
  };
}

// --------------------------------------------------------------- the receipts

const runNames = (root) => {
  const directory = join(root, runsRoot(root));
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => /^(REVIEW|REFUTATION)-\d{3}\.json$/u.test(name))
    .map((name) => name.replace(/\.json$/u, ""))
    .sort();
};

export const nextReceiptId = (root, kind) => {
  const prefix = kind === "review" ? "REVIEW" : "REFUTATION";
  const used = runNames(root)
    .map((name) => new RegExp(`^${prefix}-(\\d{3})$`, "u").exec(name)?.[1])
    .filter((value) => value !== undefined)
    .map(Number);
  const next = (used.length ? Math.max(...used) : 0) + 1;
  check(next <= 999, "entropy receipt numbering is exhausted");
  return `${prefix}-${String(next).padStart(3, "0")}`;
};

export function readEntropyControl(root) {
  const path = controlLog(root);
  const committed = committedReader(root);
  if (!existsSync(join(root, path))) {
    check(
      !committed.paths.includes(path),
      "committed entropy control log is missing",
    );
    return [];
  }
  const source = readFileSync(join(root, path), "utf8");
  check(
    source === "" || source.endsWith("\n"),
    "partial entropy control event",
  );
  if (committed.paths.includes(path))
    check(
      source.startsWith(committed.read(path)),
      "entropy control log is not append-only",
    );
  return source
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        throw new Error(`invalid entropy control event on line ${index + 1}`);
      }
      check(
        event.schemaVersion === 1 && timestamp(event.recordedAt),
        `invalid entropy control event on line ${index + 1}`,
      );
      if (FILING_TYPES.includes(event.type))
        check(
          exact(event, [
            "schemaVersion",
            "type",
            "recordedAt",
            "receiptId",
            "ordinal",
            "receiptHash",
            "renderedHash",
            "subjectHash",
            "baseCommit",
            "identity",
          ]) &&
            validReceiptId(event.receiptId) &&
            Number.isSafeInteger(event.ordinal) &&
            event.ordinal > 0 &&
            [event.receiptHash, event.renderedHash].every(validDigest) &&
            /^[0-9a-f]{64}$/u.test(event.subjectHash) &&
            /^[0-9a-f]{40}$/u.test(event.baseCommit) &&
            [PINNED_IDENTITY, SUBSTITUTE_IDENTITY].includes(event.identity),
          `invalid filing event on line ${index + 1}`,
        );
      else if (event.type === "EntropyFindingDisposed")
        check(
          exact(event, [
            "schemaVersion",
            "type",
            "recordedAt",
            "receiptId",
            "receiptHash",
            "findingId",
            "disposition",
            "reason",
            "survival",
          ]) &&
            validReceiptId(event.receiptId) &&
            validDigest(event.receiptHash) &&
            typeof event.findingId === "string" &&
            event.findingId.length > 0 &&
            ["accept", "defer", "dismiss"].includes(event.disposition) &&
            typeof event.reason === "string" &&
            event.reason.trim().length > 0,
          `invalid disposition event on line ${index + 1}`,
        );
      else if (event.type === "EntropyPacketFiled")
        check(
          exact(event, [
            "schemaVersion",
            "type",
            "recordedAt",
            "receiptId",
            "receiptHash",
            "suggestionId",
            "packetHash",
            "path",
          ]) &&
            validReceiptId(event.receiptId) &&
            [event.receiptHash, event.packetHash].every(validDigest) &&
            typeof event.suggestionId === "string" &&
            typeof event.path === "string",
          `invalid packet event on line ${index + 1}`,
        );
      else throw new Error(`unknown entropy control event ${event.type}`);
      return event;
    });
}

const appendControl = (root, event) => {
  ensureDirectory(root, docRelative(root, "control"));
  appendFileSync(join(root, controlLog(root)), `${JSON.stringify(event)}\n`, {
    mode: 0o644,
  });
  return event;
};

const paragraph = (value, limit) =>
  value.replace(/\s+/gu, " ").trim().slice(0, limit);

export function renderReviewReceipt(receipt) {
  const actor = receipt.actorAttestation;
  const counts = receipt.findingSummary;
  const confinement = receipt.confinement;
  return [
    `# Entropy Reducer review — ${receipt.receiptId}`,
    "",
    `Subject: commit \`${receipt.subject.baseCommit}\`; subject hash \`${receipt.subject.hash}\`; frozen copy inventoried at ${receipt.subject.scratchInventoryCount} path(s).`,
    "",
    `Reviewer: **${actor.identity}** — \`${actor.model}\` at effort \`${actor.effort}\` on \`${actor.harness}\` ${actor.harnessVersion}; route \`${actor.route}\`; transport \`${actor.transport ?? "none"}\`; source \`${actor.source}\`. Effective model and effort: unknown.`,
    "",
    actor.identity === PINNED_IDENTITY
      ? `This reviewer satisfies the compiled actor requirement by invocation readback. Substitution policy: ${actor.substitutionPolicy}.`
      : `**Substitute reviewer.** ${actor.substitutionReason}. Substitution policy: ${actor.substitutionPolicy}.`,
    "",
    `Episode \`${receipt.episodeId}\` ran ${receipt.startedAt} to ${receipt.endedAt}. Compiled semantic hash \`${receipt.compilation.semanticHash}\`; work order \`${receipt.compilation.workOrderId}\`; authority \`${receipt.compilation.authorityEnvelopeId}\`. Execution boundary: ${receipt.compilation.executionBoundary.mode}, ${receipt.compilation.executionBoundary.deferredProgramKind === null ? "no deferred Program kind" : `deferred Program kind ${receipt.compilation.executionBoundary.deferredProgramKind}`}.`,
    "",
    `Findings: ${counts.total} — ${counts.measured} measured, ${counts.byInspection} by inspection; ${counts.blocking} blocking, ${counts.major} major, ${counts.minor} minor. Proposal packets: ${counts.proposalPackets}.`,
    "",
    confinement.untrackedListing === undefined
      ? `Subject binding: ${confinement.subjectBinding}. Tracked status byte-identical across the episode: **${confinement.trackedStatusByteIdentical}**. Scratch delta: ${confinement.scratchDelta.deltaCount} path(s)${confinement.scratchDelta.observed ? "" : " (not observed)"}. Installed dependencies: ${confinement.dependencies}. Command execution: ${confinement.commandExecution}. Denied tool calls: ${confinement.permissionDenials}.`
      : `Subject binding: ${confinement.subjectBinding}. ${witnessSentence(confinement)} Installed dependencies: ${confinement.dependencies}. Command execution: ${confinement.commandExecution}. Denied tool calls: ${confinement.permissionDenials}.`,
    "",
    ...(receipt.compilation?.compileInputs?.route
      ? [
          `Compiled review confinement (execution rule): lenses worked serially by the reviewer; no delegate grant or delegate resource limit. Checklist completion is not independently observed; worker result: ${receipt.reviewerOutput.resultEnvelope.status}.`,
          "",
        ]
      : []),
    `**Process cost:** ${receipt.cost.line}`,
    "",
    "## Result envelope summary",
    "",
    paragraph(receipt.reviewerOutput.resultEnvelope.summary, 2000),
    "",
    "## Worker statement",
    "",
    paragraph(receipt.statement, 4000) || "(none returned)",
    "",
    "## Validated reviewer output",
    "",
    "```json",
    JSON.stringify(receipt.reviewerOutput, null, 2),
    "```",
    "",
    "## Disposition",
    "",
    "```json",
    JSON.stringify(receipt.disposition, null, 2),
    "```",
    "",
    "Findings never authorize a fix. Proposal filing and promotion to a work order remain separate operator acts, and this receipt stops at disposition. The JSON and this rendering are immutable; a later attempt files the next number.",
    "",
    `Local-terms list: **${receipt.localTerms.status}**. Receipt hash: \`${receipt.receiptHash}\`.`,
    "",
  ].join("\n");
}

export function renderRefutationReceipt(receipt) {
  const actor = receipt.actorAttestation;
  const selection = receipt.report.selection;
  const confinement = receipt.confinement;
  // A receipt filed before the after-state was recorded (VER-001 finding 3)
  // keeps its bytes, so this line renders only for a receipt that carries the
  // observation. An immutable pair must still project to itself.
  const afterState =
    confinement.untrackedListing !== undefined
      ? [
          `Subject binding: ${confinement.subjectBinding}. ${witnessSentence(confinement)} Frozen copy inventoried at ${confinement.scratchInventoryBefore.count} path(s) before and ${confinement.scratchInventoryAfter?.count ?? "unobserved"} after.`,
          "",
        ]
      : confinement.scratchInventoryBefore
        ? [
            `Subject binding: ${confinement.subjectBinding}. Tracked status byte-identical across the episode: **${confinement.trackedStatusByteIdentical}**. Frozen copy inventoried at ${confinement.scratchInventoryBefore.count} path(s) before and ${confinement.scratchInventoryAfter?.count ?? "unobserved"} after; scratch delta ${confinement.scratchDelta.deltaCount} path(s)${confinement.scratchDelta.observed ? "" : " (not observed)"}.`,
            "",
          ]
        : [];
  // A refutation filed since WO-157 records no separate worker statement: the
  // typed report's reasons and evidence references are its evidence (WO-151
  // D017). Earlier receipts carry the key and keep their rendering.
  const statementSection =
    "statement" in receipt
      ? [
          "## Worker statement",
          "",
          paragraph(receipt.statement, 4000) || "(none returned)",
          "",
        ]
      : [
          "## Attempt reasons",
          "",
          ...receipt.report.attempts.map(
            (attempt) =>
              `- \`${attempt.findingId}\` ${attempt.result}: ${paragraph(attempt.reason, 2000)} Evidence: ${attempt.evidenceRefs.map((ref) => paragraph(ref, 500)).join("; ") || "none"}.`,
          ),
          "",
        ];
  return [
    `# Entropy Reducer refutation — ${receipt.receiptId}`,
    "",
    `Challenges \`${receipt.reviewReceiptId}\` (receipt hash \`${receipt.reviewReceiptHash}\`) over subject hash \`${receipt.subject.hash}\` at commit \`${receipt.subject.baseCommit}\`.`,
    "",
    `Refuter: **${actor.identity}** — \`${actor.model}\` at effort \`${actor.effort}\` on \`${actor.harness}\` ${actor.harnessVersion}; route \`${actor.route}\`; transport \`${actor.transport ?? "none"}\`; source \`${actor.source}\`. Effective model and effort: unknown.`,
    "",
    actor.identity === PINNED_IDENTITY
      ? "This refuter satisfies the compiled actor requirement by invocation readback."
      : `**Substitute reviewer.** ${actor.substitutionReason}.`,
    "",
    "Blinding: the refuter received only the typed subjects the compiled selection rule chose — a reproduction command for each `measured` finding and steps for each selected `by inspection` finding. No reviewer narrative, observed-versus-expected conclusion, severity argument, proposal or target survival count crossed the boundary. Finding identifiers exist only for attribution.",
    "",
    `Measured denominator: ${selection.measuredDenominator} (**${selection.measuredStatus}**). By-inspection denominator: ${selection.inspectionDenominator} (**${selection.inspectionStatus}**); sample size ${selection.inspectionSampleSize}. Rule: ${selection.selectionRule}.`,
    "",
    `Survived: ${receipt.report.promotedFindingIds.length}. Refuted: ${receipt.report.refutedFindingIds.length}. Blocked: ${receipt.report.blockedFindingIds.length}. Unselected: ${receipt.report.unselectedFindingIds.length}. Installed dependencies: ${confinement.dependencies}. Command execution: ${confinement.commandExecution}. Denied tool calls: ${confinement.permissionDenials}.`,
    "",
    ...afterState,
    `**Process cost:** ${receipt.cost.line}`,
    "",
    ...statementSection,
    "## Bound report",
    "",
    "```json",
    JSON.stringify(receipt.report, null, 2),
    "```",
    "",
    "A refuted finding leaves the promoted set and stays in this report with reviewer and refuter attribution. A blocked attempt stays blocked and an unselected finding stays unselected; neither is laundered into a pass or called refuted. There is no survival quota and no vote. This refutation does not replace a work order's independent lifecycle verification.",
    "",
    `Local-terms list: **${receipt.localTerms.status}**. Receipt hash: \`${receipt.receiptHash}\`.`,
    "",
  ].join("\n");
}

export const renderReceipt = (receipt) =>
  receipt.kind === "EntropyReducerReviewRun"
    ? renderReviewReceipt(receipt)
    : renderRefutationReceipt(receipt);

/**
 * The control event is appended first and the immutable pair second, both
 * under the writer lock. A crash between them leaves a trailing event with no
 * pair, which `checkEntropyReceipts` reports as an interrupted filing to
 * complete rather than a shared-gate failure for unrelated work; a pair whose
 * event is absent, or whose bytes moved after filing, always fails.
 */
async function fileReceipt(root, { payload, kind }) {
  return locked(root, async () => {
    const receiptId = nextReceiptId(root, kind);
    const filings = readEntropyControl(root).filter((event) =>
      FILING_TYPES.includes(event.type),
    );
    const previous = filings.at(-1) ?? null;
    const localTerms = checkLocalTerms(root, [
      { name: `${receiptId}.payload`, text: JSON.stringify(payload) },
    ]);
    const body = {
      schemaVersion: SCHEMA,
      receiptId,
      ordinal: filings.length + 1,
      previousReceiptHash: previous?.receiptHash ?? null,
      ...payload,
      localTerms,
    };
    const receipt = { ...body, receiptHash: sha256(JSON.stringify(body)) };
    const rendered = renderReceipt(receipt);
    // Copied standard prose travels beside validated model text; screen both.
    checkLocalTerms(root, [
      { name: `${receiptId}.json`, text: JSON.stringify(receipt) },
      { name: `${receiptId}.md`, text: rendered },
    ]);
    ensureDirectory(root, runsRoot(root));
    for (const extension of ["json", "md"])
      check(
        !existsSync(join(root, runsRoot(root), `${receiptId}.${extension}`)),
        `entropy receipt address already exists: ${receiptId}.${extension}`,
      );
    appendControl(root, {
      schemaVersion: 1,
      type: kind === "review" ? "EntropyReviewFiled" : "EntropyRefutationFiled",
      recordedAt: new Date().toISOString(),
      receiptId,
      ordinal: receipt.ordinal,
      receiptHash: receipt.receiptHash,
      renderedHash: sha256(rendered),
      subjectHash: receipt.subject.hash,
      baseCommit: receipt.subject.baseCommit,
      identity: receipt.actorAttestation.identity,
    });
    writeFileSync(
      join(root, runsRoot(root), `${receiptId}.json`),
      `${JSON.stringify(receipt, null, 2)}\n`,
      { flag: "wx", mode: 0o644 },
    );
    writeFileSync(join(root, runsRoot(root), `${receiptId}.md`), rendered, {
      flag: "wx",
      mode: 0o644,
    });
    return receipt;
  });
}

export function readReceipt(root, receiptId) {
  check(validReceiptId(receiptId), `unknown entropy receipt ${receiptId}`);
  const path = join(root, runsRoot(root), `${receiptId}.json`);
  check(
    containedRegularFile(path, root),
    `entropy receipt ${receiptId} is not a contained regular file`,
  );
  return readJson(path, `${runsRoot(root)}/${receiptId}.json`);
}

// ------------------------------------------------------------------- the cost

/** Counters when the transport exposes them, a WO-140 cause code when it
 * cannot. No dispatch meter column is added for the reviewer. */
export function costFrom(usage, durationMs, wire) {
  const seconds = Math.round(durationMs / 1000);
  const tokens = usage?.totals?.totalTokens ?? null;
  const costUsd = wire?.costUsd ?? usage?.totals?.costUsd ?? null;
  const turns = wire?.turns ?? null;
  // Never write `unknown` beside a counter that was observed. The WO-140
  // cause code names what the harness did not expose; anything it did expose
  // is stated on the same line.
  const observed = [
    `episode wall clock ${seconds} s`,
    ...(turns === null ? [] : [`${turns} turns`]),
    ...(costUsd === null ? [] : [`USD ${costUsd}`]),
  ].join(", ");
  return {
    line:
      tokens === null || tokens === undefined
        ? `tokens unknown; cause harness-no-readback; observed ${observed}${usage?.source ? `; source ${usage.source}` : ""}`
        : `${tokens} tokens; source ${usage.source}; observed ${observed}`,
    tokens: tokens ?? null,
    costUsd,
    durationMs,
    turns,
    source: usage?.source ?? "unavailable",
  };
}

/** Claude's terminal result carries the denial count, turn count and list
 * cost the cost line and the confinement block report. Codex exposes none of
 * them, so both stay `unobserved` there rather than being invented. */
function readWire(capture, transport) {
  const path = join(capture, "wire.jsonl");
  if (transport !== "claude-cli-print" || !existsSync(path)) return null;
  try {
    const wire = JSON.parse(readFileSync(path, "utf8"));
    return {
      turns: typeof wire.num_turns === "number" ? wire.num_turns : null,
      costUsd:
        typeof wire.total_cost_usd === "number" ? wire.total_cost_usd : null,
      permissionDenials: Array.isArray(wire.permission_denials)
        ? wire.permission_denials.length
        : "unobserved",
      deniedTools: Array.isArray(wire.permission_denials)
        ? wire.permission_denials.map(
            (denial) => denial?.tool_name ?? "unknown",
          )
        : [],
      subtype: typeof wire.subtype === "string" ? wire.subtype : null,
    };
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------- dispatching

const transportFor = async (name, onUsage) => {
  if (name === "fake") {
    const { FakeEntropyTransport } = await skeleton("entropy-review-fake");
    return new FakeEntropyTransport();
  }
  const { ClaudeCliPrintWorkOrderTransport, CodexCliExecWorkOrderTransport } =
    await skeleton("worker-transport");
  if (name === "claude-cli-print")
    return new ClaudeCliPrintWorkOrderTransport(undefined, undefined, onUsage);
  if (name === "codex-cli-exec")
    return new CodexCliExecWorkOrderTransport(undefined, undefined, onUsage);
  throw new Error(`unknown entropy transport ${name}`);
};

const retentionLane = (root) => {
  const lane = join(root, localRoot(root), "rejected");
  mkdirSync(lane, { recursive: true, mode: 0o700 });
  return lane;
};

/** Launch one fresh worker and leave its return in the capture lane for the
 * receipt step. A rejected return is retained under the local control lane
 * with its statement, as the planning refutation host retains its own. */
async function runEpisode(root, request, pending, role) {
  const { recordUsageObservation } =
    await import("../../packages/skeleton/src/usage-observation.mjs");
  const startedAt = new Date().toISOString();
  let usage = null;
  const transport = await transportFor(pending.transport, (observation) => {
    usage = observation;
    try {
      recordUsageObservation(root, {
        workOrder: null,
        role,
        dispatch: pending.episodeId,
        startedAt,
        durationMs: Date.now() - Date.parse(startedAt),
        observation,
      });
    } catch {
      /* usage recording is advisory and never fails an episode */
    }
  });
  const dispatch = transport.dispatch(request, Date.now);
  try {
    const accepted = await dispatch.receipt;
    check(
      accepted.commandId === request.command.commandId &&
        accepted.transport === transport.name,
      "entropy transport returned another command's receipt",
    );
    const returned = await dispatch.completed;
    const endedAt = new Date().toISOString();
    mkdirSync(request.capture, { recursive: true, mode: 0o700 });
    const resultPath = join(request.capture, "result.json");
    if (!existsSync(resultPath))
      writeFileSync(resultPath, `${JSON.stringify(returned, null, 2)}\n`, {
        mode: 0o600,
      });
    const statementPath = join(request.capture, "statement.txt");
    if (!existsSync(statementPath))
      writeFileSync(
        statementPath,
        `Transport ${transport.name} returned this result for episode ${request.episodeId}; the host validation follows.\n`,
        { mode: 0o600 },
      );
    return {
      transport: transport.name,
      harnessVersion: transport.harnessVersion,
      startedAt,
      endedAt,
      durationMs: Date.parse(endedAt) - Date.parse(startedAt),
      usage,
      wire: readWire(request.capture, transport.name),
      resultPath,
      statementPath,
    };
  } catch (error) {
    dispatch.kill();
    let retained = null;
    try {
      retained = mkdtempSync(join(retentionLane(root), "rejected-"));
      for (const name of ["result.json", "statement.txt", "wire.jsonl"])
        if (existsSync(join(request.capture, name)))
          writeFileSync(
            join(retained, name),
            readFileSync(join(request.capture, name)),
            { mode: 0o600 },
          );
    } catch {
      retained = null;
    }
    throw new Error(
      `entropy ${role} episode rejected: ${error instanceof Error ? error.message : "unknown failure"}${
        retained
          ? `; rejected return retained at ${retained}`
          : "; retention lane unavailable"
      }`,
    );
  }
}

// ------------------------------------------------------------------ the review

/**
 * Freeze, compile and hand the canonical prompt to one fresh worker. Without a
 * transport the prompt and closed schema are printed for a background worker
 * the session spawns and the parent stays the sole repository writer; with one,
 * the host launches the CLI and leaves the return in the capture lane for
 * `entropy receipt`. Either way the pending dispatch is retained.
 */
export async function beginEntropyReview(
  root,
  {
    revision = "HEAD",
    transport = null,
    model,
    effort,
    source,
    accountLabel,
    concern = null,
    now = () => new Date().toISOString(),
    fixture = process.env.DOTLN_ENTROPY_FIXTURE === "1",
  } = {},
) {
  check(
    transport !== "fake" || fixture,
    "the fake transport drives executable fixtures only and cannot satisfy a live row",
  );
  const explicit = revision !== "HEAD";
  const state = resolveSubject(root, revision);
  check(
    !state.workingTreeDirty || explicit,
    `entropy review refuses a dirty tree: ${trackedStatus(root).split("\n").filter(Boolean).length} tracked path(s) differ from ${revision}. Commit them, or name the committed subject explicitly (npm run entropy -- review <commit>) so the receipt cannot be read as a review of the working tree.`,
  );
  requireNoPending(root, "review");
  const untrackedAtDispatch = untrackedListing(root);
  const { parent, repository, dependencies } = freezeSubject(
    root,
    state.baseCommit,
  );
  let retained = false;
  try {
    const inventory = scratchInventory(repository);
    const subject = subjectRecord(
      root,
      state.baseCommit,
      state.status,
      inventory,
      repository,
    );
    const dispatchedAtMs = Date.now();
    const episodeId = `ep_entropy_${subject.hash.slice(0, 16)}`;
    const { compileReviewerWorkOrder } = await skeleton(
      "loadouts/entropy-reducer",
    );
    const compiled = compileReviewerWorkOrder({
      route: transport ?? "background",
      repo: repository,
      baseCommit: state.baseCommit,
      episodeId,
      dispatchedAt: dispatchedAtMs,
      episodeEndsAt: dispatchedAtMs + EPISODE_WINDOW_MS,
    });
    const { entropyReviewAuthorization } = await skeleton("reactor");
    const grant = entropyReviewAuthorization(
      compiled.authorityEnvelope,
      subject.hash,
      episodeId,
      "census",
      dispatchedAtMs,
    );
    check(grant.authorized, "the compiled authority refused the review census");
    const { ENTROPY_REVIEW_TOOLS } = await skeleton("entropy-review-protocol");
    const capture = join(parent, "capture");
    mkdirSync(capture, { recursive: true, mode: 0o700 });
    const defaults = TRANSPORT_DEFAULTS[transport ?? "claude-cli-print"];
    const request = {
      kind: "entropy-review",
      command: grant.command,
      workOrder: compiled.workOrder,
      subject,
      episodeId,
      model: model ?? (transport ? defaults.model : "unknown"),
      effort: effort ?? (transport ? defaults.effort : "unknown"),
      cwd: repository,
      capture,
      residue: compiled.residue,
      lensBriefs: compiled.lensBriefs,
      concern,
      profile: {
        profileId: "entropy-review-v1",
        modelTools: [...ENTROPY_REVIEW_TOOLS],
      },
    };
    const pending = {
      schemaVersion: 1,
      kind: "review",
      episodeId,
      subjectHash: subject.hash,
      subject,
      workingTreeDirtyAtDispatch: state.workingTreeDirty,
      untrackedListingBefore: untrackedAtDispatch,
      scratchInventoryBeforeEntries: inventory.entries,
      namedRevision: revision,
      scratchParent: parent,
      capture,
      dependencies,
      dispatchedAt: now(),
      semanticHash: compiled.semanticHash,
      compileInputs: compiled.compileInputs,
      workOrderId: compiled.workOrder.workOrderId,
      authorityEnvelopeId: compiled.authorityEnvelope.authorityEnvelopeId,
      commandId: grant.command.commandId,
      reviewerRequirement: compiled.reviewerRequirement,
      executionBoundary: compiled.executionBoundary,
      concern,
      route: transport ? "launched" : "background",
      transport,
      requestedModel: request.model,
      requestedEffort: request.effort,
      source: source ?? null,
      accountLabel: accountLabel ?? null,
      tools: [...ENTROPY_REVIEW_TOOLS],
      fixture: fixture || transport === "fake",
      episode: null,
    };
    writePending(root, "review", pending);
    retained = true;
    const { transportPrompt, transportResultSchema } = await skeleton(
      "verification-protocol",
    );
    if (!transport)
      return {
        route: "background",
        episodeId,
        subjectHash: subject.hash,
        frozenSubject: repository,
        prompt: JSON.parse(transportPrompt(request)),
        resultSchema: transportResultSchema(request),
        workerInstructions:
          "Run this review as one fresh worker whose working directory is the frozen subject path, and run commands nowhere else. Return the schema object plus a truthful public session statement of at most 4000 characters naming what you actually read and ran. Return both to the parent; do not edit the repository, file a receipt or advance any lifecycle.",
        file: "npm run entropy -- receipt <result.json> --statement <statement.txt>",
      };
    const episode = await runEpisode(root, request, pending, "reviewer");
    writePending(root, "review", { ...pending, episode });
    return {
      route: "launched",
      episodeId,
      subjectHash: subject.hash,
      frozenSubject: repository,
      transport: episode.transport,
      harnessVersion: episode.harnessVersion,
      model: request.model,
      effort: request.effort,
      durationMs: episode.durationMs,
      permissionDenials: episode.wire?.permissionDenials ?? "unobserved",
      file: `npm run entropy -- receipt ${episode.resultPath} --statement ${episode.statementPath}`,
    };
  } catch (error) {
    if (!retained) rmSync(parent, { recursive: true, force: true });
    throw error;
  }
}

/**
 * Bind a returned review with the loadout's own validators against the exact
 * WorkOrder and episode, refuse a subject whose tracked status moved, and file
 * the next numbered immutable pair with its attestation, cost and confinement.
 */
export async function fileEntropyReview(
  root,
  resultPath,
  statementPath,
  { now = () => new Date().toISOString(), keepScratch = false } = {},
) {
  const pending = currentDispatch(root, "review");
  check(pending !== null, "no entropy review dispatch is pending");
  const result = namedInput(root, pending.scratchParent, resultPath);
  const statementFile = namedInput(root, pending.scratchParent, statementPath);
  const returned = readJson(result, resultPath);
  const statement = readFileSync(statementFile, "utf8").trim();
  const { validateReviewerOutput, selectFindingsForRefutation } =
    await skeleton("loadouts/entropy-reducer");
  let reviewerOutput;
  try {
    reviewerOutput = validateReviewerOutput(returned, {
      workOrderId: pending.workOrderId,
      episodeId: pending.episodeId,
    });
  } catch (error) {
    const lane = mkdtempSync(join(retentionLane(root), "rejected-"));
    writeFileSync(join(lane, "result.json"), readFileSync(result), {
      mode: 0o600,
    });
    writeFileSync(join(lane, "statement.txt"), statement, { mode: 0o600 });
    throw new Error(
      `entropy review result rejected: ${error instanceof Error ? error.message : "invalid output"}; rejected result and statement retained at ${lane}`,
    );
  }
  const trackedStatusAfterSha256 = hex(trackedStatus(root));
  const trackedStatusByteIdentical =
    trackedStatusAfterSha256 === pending.subject.trackedStatusSha256;
  // What must not move is the subject. On the default route the subject is
  // HEAD of a clean tree, so any tracked change moves it and is refused, as
  // the order requires. On the explicit route the subject is the named
  // commit, which the working tree cannot move; the binding there is that the
  // commit still resolves to the tree the frozen copy was reviewed from, and
  // the working tree's own drift is recorded rather than refused.
  if (pending.namedRevision === "HEAD" || !pending.namedRevision)
    check(
      trackedStatusByteIdentical,
      "tracked status changed during the review episode; the receipt would name a subject that moved. Restore the subject or dispatch a fresh review.",
    );
  else {
    let sourceTree = null;
    let frozenTree = null;
    try {
      sourceTree = runGit(root, [
        "rev-parse",
        `${pending.subject.baseCommit}^{tree}`,
      ]);
      frozenTree = runGit(pending.subject.scratchRepository, [
        "rev-parse",
        `${pending.subject.baseCommit}^{tree}`,
      ]);
    } catch {
      sourceTree = null;
    }
    check(
      sourceTree !== null && sourceTree === frozenTree,
      `the reviewed commit ${pending.subject.baseCommit} no longer resolves to the tree the frozen copy was reviewed from; the receipt would name a subject that moved.`,
    );
  }
  const inventoryAfter = existsSync(pending.subject.scratchRepository)
    ? scratchInventory(pending.subject.scratchRepository)
    : null;
  const widened = widenedWitness(root, pending, inventoryAfter);
  const episode = pending.episode ?? null;
  const attestation = buildAttestation(
    {
      transport: pending.transport,
      model: pending.requestedModel,
      effort: pending.requestedEffort,
      source: pending.source,
      accountLabel: pending.accountLabel,
      harness: pending.transport
        ? TRANSPORT_DEFAULTS[pending.transport].harness
        : "claude-code",
      harnessVersion: episode?.harnessVersion ?? "unknown",
      tools: pending.tools,
    },
    pending.reviewerRequirement,
  );
  const selection = selectFindingsForRefutation(reviewerOutput.findings);
  const findings = reviewerOutput.findings;
  const receipt = await fileReceipt(root, {
    kind: "review",
    payload: {
      kind: "EntropyReducerReviewRun",
      episodeId: pending.episodeId,
      startedAt: episode?.startedAt ?? pending.dispatchedAt,
      endedAt: episode?.endedAt ?? now(),
      subject: pending.subject,
      workingTreeDirtyAtDispatch: pending.workingTreeDirtyAtDispatch === true,
      namedRevision: pending.namedRevision,
      actorAttestation: attestation,
      compilation: {
        semanticHash: pending.semanticHash,
        compileInputs: pending.compileInputs,
        workOrderId: pending.workOrderId,
        authorityEnvelopeId: pending.authorityEnvelopeId,
        reviewerRequirement: pending.reviewerRequirement,
        executionBoundary: pending.executionBoundary,
      },
      concern: pending.concern,
      reviewerOutput,
      selection,
      findingSummary: {
        total: findings.length,
        measured: findings.filter((f) => f.evidenceLabel === "measured").length,
        byInspection: findings.filter(
          (f) => f.evidenceLabel === "by inspection",
        ).length,
        blocking: findings.filter((f) => f.severity === "blocking").length,
        major: findings.filter((f) => f.severity === "major").length,
        minor: findings.filter((f) => f.severity === "minor").length,
        proposalPackets: reviewerOutput.proposalPackets.length,
      },
      confinement: {
        subjectBinding:
          pending.namedRevision === "HEAD" || !pending.namedRevision
            ? "HEAD of a clean tree; any tracked change refuses the receipt"
            : "an explicitly named commit; bound by its tree object, with the working tree's own drift recorded rather than refused",
        trackedStatusBeforeSha256: pending.subject.trackedStatusSha256,
        trackedStatusAfterSha256,
        trackedStatusByteIdentical,
        scratchInventoryBefore: {
          count: pending.subject.scratchInventoryCount,
          sha256: pending.subject.scratchInventorySha256,
        },
        scratchInventoryAfter: inventoryAfter
          ? { count: inventoryAfter.count, sha256: inventoryAfter.sha256 }
          : null,
        ...(widened
          ? widened
          : {
              scratchDelta: inventoryAfter
                ? {
                    deltaCount: Math.abs(
                      inventoryAfter.count -
                        pending.subject.scratchInventoryCount,
                    ),
                    observed: true,
                  }
                : { deltaCount: 0, observed: false },
            }),
        excludedFromManifest: SCRATCH_EXCLUDED,
        dependencies: pending.dependencies ?? "unobserved",
        commandExecution:
          pending.transport === "codex-cli-exec"
            ? "host-enforced workspace sandbox rooted at the frozen copy"
            : pending.transport === "claude-cli-print"
              ? widened
                ? CLAUDE_WIDENED_EXECUTION
                : CLAUDE_WITNESS_EXECUTION
              : "session-attested; this host enforced no boundary on a worker it did not launch",
        permissionDenials: episode?.wire?.permissionDenials ?? "unobserved",
        deniedTools: episode?.wire?.deniedTools ?? [],
      },
      cost: costFrom(
        episode?.usage ?? null,
        episode?.durationMs ?? 0,
        episode?.wire,
      ),
      statement,
      disposition: {
        findingCount: findings.length,
        proposalPacketCount: reviewerOutput.proposalPackets.length,
        proposalFiling: "awaiting operator disposition; not filed",
        nextStep: "Fresh blinded refutation before any disposition.",
      },
      liveness: pending.fixture ? "fixture" : "live",
    },
  });
  clearPending(root, "review", pending);
  if (
    !keepScratch &&
    pending.scratchParent &&
    existsSync(pending.scratchParent)
  )
    rmSync(pending.scratchParent, { recursive: true, force: true });
  return {
    receipt: `${runsRoot(root)}/${receipt.receiptId}.md`,
    receiptId: receipt.receiptId,
    identity: attestation.identity,
    findings: receipt.findingSummary,
    trackedStatusByteIdentical,
    selection: {
      measuredDenominator: selection.measuredDenominator,
      measuredStatus: selection.measuredStatus,
      inspectionDenominator: selection.inspectionDenominator,
      inspectionStatus: selection.inspectionStatus,
      inspectionSampleSize: selection.inspectionSampleSize,
      selected: selection.selectedFindingIds.length,
    },
    confinement: {
      subjectBinding: receipt.confinement.subjectBinding,
      scratchDelta: scratchDeltaSummary(receipt.confinement.scratchDelta),
      permissionDenials: receipt.confinement.permissionDenials,
    },
    cost: receipt.cost.line,
    next: `npm run entropy -- refute ${receipt.receiptId}`,
  };
}

// -------------------------------------------------------------- the refutation

/** Print only the blinded subjects the compiled selection rule chose, for a
 * second fresh worker that never sees the first one's reasoning. */
export async function beginEntropyRefutation(
  root,
  reviewReceiptId,
  {
    transport = null,
    model,
    effort,
    source,
    accountLabel,
    now = () => new Date().toISOString(),
    fixture = process.env.DOTLN_ENTROPY_FIXTURE === "1",
  } = {},
) {
  check(
    transport !== "fake" || fixture,
    "the fake transport drives executable fixtures only and cannot satisfy a live row",
  );
  const review = readReceipt(root, reviewReceiptId);
  check(
    review.kind === "EntropyReducerReviewRun",
    `${reviewReceiptId} is not a review receipt`,
  );
  const selection = review.selection;
  check(
    selection.selectedFindingIds.length > 0,
    `${reviewReceiptId} selected no findings: measured ${selection.measuredStatus}, by inspection ${selection.inspectionStatus}. There is nothing to refute and no synthetic pass is recorded.`,
  );
  requireNoPending(root, "refutation");
  // The refuter runs commands by design and Claude's shell is instructed
  // rather than path-confined, so this episode needs the same before-and-after
  // witness the review records: the source repository's tracked status here,
  // and the frozen copy's inventory on either side of the episode.
  const statusAtDispatch = trackedStatus(root);
  const untrackedAtDispatch = untrackedListing(root);
  const { parent, repository, dependencies } = freezeSubject(
    root,
    review.subject.baseCommit,
  );
  let retained = false;
  try {
    const inventory = scratchInventory(repository);
    const subject = {
      ...review.subject,
      scratchRepository: repository,
      scratchInventorySha256: inventory.sha256,
      scratchInventoryCount: inventory.count,
    };
    const dispatchedAtMs = Date.now();
    const episodeId = `ep_entropy_ref_${subject.hash.slice(0, 12)}`;
    const { compileReviewerWorkOrder } = await skeleton(
      "loadouts/entropy-reducer",
    );
    const compiled = compileReviewerWorkOrder({
      route: transport ?? "background",
      repo: repository,
      baseCommit: review.subject.baseCommit,
      episodeId,
      dispatchedAt: dispatchedAtMs,
      episodeEndsAt: dispatchedAtMs + EPISODE_WINDOW_MS,
    });
    const { entropyReviewAuthorization } = await skeleton("reactor");
    const grant = entropyReviewAuthorization(
      compiled.authorityEnvelope,
      subject.hash,
      episodeId,
      "probe",
      dispatchedAtMs,
    );
    check(
      grant.authorized,
      "the compiled authority refused the refutation probe",
    );
    const { ENTROPY_REVIEW_TOOLS } = await skeleton("entropy-review-protocol");
    const capture = join(parent, "capture");
    mkdirSync(capture, { recursive: true, mode: 0o700 });
    const defaults = TRANSPORT_DEFAULTS[transport ?? "claude-cli-print"];
    const request = {
      kind: "entropy-refutation",
      command: grant.command,
      workOrder: compiled.workOrder,
      subject,
      subjects: {
        measured: selection.measuredSubjects,
        inspection: selection.inspectionSubjects,
      },
      episodeId,
      model: model ?? (transport ? defaults.model : "unknown"),
      effort: effort ?? (transport ? defaults.effort : "unknown"),
      cwd: repository,
      capture,
      profile: {
        profileId: "entropy-refutation-v1",
        modelTools: [...ENTROPY_REVIEW_TOOLS],
      },
    };
    const pending = {
      schemaVersion: 1,
      kind: "refutation",
      compileInputs: compiled.compileInputs,
      semanticHash: compiled.semanticHash,
      executionBoundary: compiled.executionBoundary,
      episodeId,
      subjectHash: subject.hash,
      subject,
      trackedStatusBeforeSha256: hex(statusAtDispatch),
      untrackedListingBefore: untrackedAtDispatch,
      scratchInventoryBeforeEntries: inventory.entries,
      reviewReceiptId,
      reviewReceiptHash: review.receiptHash,
      scratchParent: parent,
      capture,
      dependencies,
      dispatchedAt: now(),
      commandId: grant.command.commandId,
      reviewerRequirement: compiled.reviewerRequirement,
      route: transport ? "launched" : "background",
      transport,
      requestedModel: request.model,
      requestedEffort: request.effort,
      source: source ?? null,
      accountLabel: accountLabel ?? null,
      tools: [...ENTROPY_REVIEW_TOOLS],
      fixture: fixture || transport === "fake",
      episode: null,
    };
    writePending(root, "refutation", pending);
    retained = true;
    const { transportPrompt, transportResultSchema } = await skeleton(
      "verification-protocol",
    );
    if (!transport)
      return {
        route: "background",
        episodeId,
        reviewReceiptId,
        frozenSubject: repository,
        selection: {
          measuredDenominator: selection.measuredDenominator,
          measuredStatus: selection.measuredStatus,
          inspectionDenominator: selection.inspectionDenominator,
          inspectionStatus: selection.inspectionStatus,
          inspectionSampleSize: selection.inspectionSampleSize,
          selectionRule: selection.selectionRule,
        },
        prompt: JSON.parse(transportPrompt(request)),
        resultSchema: transportResultSchema(request),
        workerInstructions:
          "Run this refutation as one fresh worker that has seen no part of the review it challenges. Its working directory is the frozen subject path. Return only the schema object to the parent; its reasons and evidence references are the receipt's evidence, so no separate statement is asked for. Do not edit the repository or file a receipt.",
        file: "npm run entropy -- refutation-receipt <attempts.json>",
      };
    const episode = await runEpisode(root, request, pending, "refuter");
    writePending(root, "refutation", { ...pending, episode });
    return {
      route: "launched",
      episodeId,
      reviewReceiptId,
      frozenSubject: repository,
      transport: episode.transport,
      harnessVersion: episode.harnessVersion,
      durationMs: episode.durationMs,
      file: `npm run entropy -- refutation-receipt ${episode.resultPath}`,
    };
  } catch (error) {
    if (!retained) rmSync(parent, { recursive: true, force: true });
    throw error;
  }
}

/** Bind the attempts with the loadout's own report builder and file the next
 * numbered immutable pair. */
export async function fileEntropyRefutation(
  root,
  attemptsPath,
  statementPath = null,
  { now = () => new Date().toISOString(), keepScratch = false } = {},
) {
  const pending = currentDispatch(root, "refutation");
  check(pending !== null, "no entropy refutation dispatch is pending");
  const attemptsFile = namedInput(root, pending.scratchParent, attemptsPath);
  // A statement is accepted from a dispatch made under the earlier instruction
  // and kept only beside a rejected return; the receipt does not record it.
  const statement = statementPath
    ? readFileSync(
        namedInput(root, pending.scratchParent, statementPath),
        "utf8",
      ).trim()
    : null;
  const returned = readJson(attemptsFile, attemptsPath);
  const review = readReceipt(root, pending.reviewReceiptId);
  check(
    review.receiptHash === pending.reviewReceiptHash,
    "the review receipt changed after this refutation was dispatched",
  );
  const { buildRefutationReport } = await skeleton("loadouts/entropy-reducer");
  const attempts = Array.isArray(returned) ? returned : returned?.attempts;
  check(
    Array.isArray(attempts),
    "entropy refutation result must carry an attempts array",
  );
  let report;
  try {
    report = buildRefutationReport(review.reviewerOutput.findings, attempts);
  } catch (error) {
    const lane = mkdtempSync(join(retentionLane(root), "rejected-"));
    writeFileSync(join(lane, "result.json"), readFileSync(attemptsFile), {
      mode: 0o600,
    });
    if (statement !== null)
      writeFileSync(join(lane, "statement.txt"), statement, { mode: 0o600 });
    throw new Error(
      `entropy refutation result rejected: ${error instanceof Error ? error.message : "invalid attempts"}; rejected result${statement !== null ? " and statement" : ""} retained at ${lane}`,
    );
  }
  // The subject of a refutation is the review's named commit, which the
  // working tree cannot move, so drift is recorded rather than refused, as the
  // explicit review route records it.
  const trackedStatusBeforeSha256 =
    pending.trackedStatusBeforeSha256 ?? pending.subject.trackedStatusSha256;
  const trackedStatusAfterSha256 = hex(trackedStatus(root));
  const trackedStatusByteIdentical =
    trackedStatusAfterSha256 === trackedStatusBeforeSha256;
  const inventoryAfter = existsSync(pending.subject.scratchRepository)
    ? scratchInventory(pending.subject.scratchRepository)
    : null;
  const widened = widenedWitness(root, pending, inventoryAfter);
  const episode = pending.episode ?? null;
  const attestation = buildAttestation(
    {
      transport: pending.transport,
      model: pending.requestedModel,
      effort: pending.requestedEffort,
      source: pending.source,
      accountLabel: pending.accountLabel,
      harness: pending.transport
        ? TRANSPORT_DEFAULTS[pending.transport].harness
        : "claude-code",
      harnessVersion: episode?.harnessVersion ?? "unknown",
      tools: pending.tools,
    },
    pending.reviewerRequirement,
  );
  const receipt = await fileReceipt(root, {
    kind: "refutation",
    payload: {
      kind: "EntropyReducerRefutationRun",
      ...(pending.compileInputs
        ? {
            compilation: {
              compileInputs: pending.compileInputs,
              semanticHash: pending.semanticHash,
              executionBoundary: pending.executionBoundary,
            },
          }
        : {}),
      episodeId: pending.episodeId,
      startedAt: episode?.startedAt ?? pending.dispatchedAt,
      endedAt: episode?.endedAt ?? now(),
      subject: pending.subject,
      reviewReceiptId: pending.reviewReceiptId,
      reviewReceiptHash: pending.reviewReceiptHash,
      actorAttestation: attestation,
      confinement: {
        subjectBinding:
          "the commit the challenged review receipt names, re-frozen for this episode; the working tree's own drift is recorded rather than refused",
        trackedStatusBeforeSha256,
        trackedStatusAfterSha256,
        trackedStatusByteIdentical,
        scratchInventoryBefore: {
          count: pending.subject.scratchInventoryCount,
          sha256: pending.subject.scratchInventorySha256,
        },
        scratchInventoryAfter: inventoryAfter
          ? { count: inventoryAfter.count, sha256: inventoryAfter.sha256 }
          : null,
        ...(widened
          ? widened
          : {
              scratchDelta: inventoryAfter
                ? {
                    deltaCount: Math.abs(
                      inventoryAfter.count -
                        pending.subject.scratchInventoryCount,
                    ),
                    observed: true,
                  }
                : { deltaCount: 0, observed: false },
            }),
        excludedFromManifest: SCRATCH_EXCLUDED,
        dependencies: pending.dependencies ?? "unobserved",
        commandExecution:
          pending.transport === "codex-cli-exec"
            ? "host-enforced workspace sandbox rooted at the frozen copy"
            : pending.transport === "claude-cli-print"
              ? widened
                ? CLAUDE_WIDENED_EXECUTION
                : CLAUDE_WITNESS_EXECUTION
              : "session-attested; this host enforced no boundary on a worker it did not launch",
        permissionDenials: episode?.wire?.permissionDenials ?? "unobserved",
        deniedTools: episode?.wire?.deniedTools ?? [],
      },
      blinding: {
        supplied: "typed selection subjects only",
        withheld: [
          "reviewer narrative",
          "observed-versus-expected conclusion",
          "severity argument",
          "proposal packets",
          "target survival count",
        ],
        measuredSubjects: review.selection.measuredSubjects.length,
        inspectionSubjects: review.selection.inspectionSubjects.length,
      },
      report,
      cost: costFrom(
        episode?.usage ?? null,
        episode?.durationMs ?? 0,
        episode?.wire,
      ),
      liveness: pending.fixture ? "fixture" : "live",
    },
  });
  clearPending(root, "refutation", pending);
  if (
    !keepScratch &&
    pending.scratchParent &&
    existsSync(pending.scratchParent)
  )
    rmSync(pending.scratchParent, { recursive: true, force: true });
  return {
    receipt: `${runsRoot(root)}/${receipt.receiptId}.md`,
    receiptId: receipt.receiptId,
    identity: attestation.identity,
    survived: report.promotedFindingIds,
    refuted: report.refutedFindingIds,
    blocked: report.blockedFindingIds,
    unselected: report.unselectedFindingIds,
    trackedStatusByteIdentical,
    confinement: {
      scratchDelta: scratchDeltaSummary(receipt.confinement.scratchDelta),
      permissionDenials: receipt.confinement.permissionDenials,
    },
    cost: receipt.cost.line,
    next: `npm run entropy -- dispose ${pending.reviewReceiptId} <id> accept|defer|dismiss '<reason>'`,
  };
}

// ------------------------------------------------------------- the disposition

const latestRefutationFor = (root, reviewReceiptId) => {
  const receipts = runNames(root)
    .filter((name) => name.startsWith("REFUTATION-"))
    .map((name) => readReceipt(root, name))
    .filter((receipt) => receipt.reviewReceiptId === reviewReceiptId);
  return receipts.at(-1) ?? null;
};

const candidateHeading = (reviewReceiptId, date) =>
  `## Candidates — accepted Entropy Reducer findings, review ${reviewReceiptId} (recorded ${date})`;

/** The follow-up collector harvests formal candidate headings and their
 * top-level list items from the planning root; an accepted finding becomes one
 * such item, and `npm run meta` then lists it as a register row. Promotion to
 * a work order stays a planning act. */
function appendCandidate(root, reviewReceiptId, finding, reason, date) {
  ensureDirectory(root, reviewsRoot(root));
  const path = `${reviewsRoot(root)}/${reviewReceiptId}.md`;
  const absolute = join(root, path);
  const heading = candidateHeading(reviewReceiptId, date);
  const item = [
    `- **${finding.findingId} — ${paragraph(finding.criterion, 160)}**`,
    `  Surface \`${finding.surface}\`, severity ${finding.severity}, altitude ${finding.altitude}, evidence ${finding.evidenceLabel}.`,
    `  Observed: ${paragraph(finding.observed, 400)}`,
    `  Expected: ${paragraph(finding.expected, 400)}`,
    `  Reproduction: ${
      finding.reproduction.kind === "command"
        ? `\`${finding.reproduction.command}\``
        : finding.reproduction.steps
            .map((step) => paragraph(step, 200))
            .join(" ")
    }`,
    `  Operator disposition: accepted — ${paragraph(reason, 400)}`,
    `  Source: \`${runsRoot(root)}/${reviewReceiptId}.md\`; survived its blinded refutation.`,
  ].join("\n");
  if (!existsSync(absolute)) {
    writeFileSync(
      absolute,
      [
        `# Accepted Entropy Reducer findings — ${reviewReceiptId}`,
        "",
        `Generated by \`npm run entropy -- dispose\`. Each item below is a finding the operator accepted after it survived its blinded refutation; the follow-up collector reads these headings, and \`npm run meta\` lists them as register candidates. Nothing here is activated work: promotion to a work order remains a planning act.`,
        "",
        heading,
        "",
        item,
        "",
      ].join("\n"),
      { mode: 0o644 },
    );
    return path;
  }
  const body = readFileSync(absolute, "utf8");
  writeFileSync(
    absolute,
    body.includes(heading)
      ? `${body.replace(/\n*$/u, "\n")}\n${item}\n`
      : `${body.replace(/\n*$/u, "\n")}\n${heading}\n\n${item}\n`,
    { mode: 0o644 },
  );
  return path;
}

function filePacket(root, reviewReceiptId, packet, reason, date) {
  const suggestionId = packet.suggestion.suggestionId;
  check(
    /^(?!\.{1,2}$)[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(suggestionId),
    `unsafe suggestion identifier ${suggestionId}`,
  );
  ensureDirectory(root, `${proposalsRoot(root)}/${suggestionId}`);
  const path = `${proposalsRoot(root)}/${suggestionId}/packet.json`;
  const absolute = join(root, path);
  check(
    !existsSync(absolute),
    `a packet is already filed at ${path}; a later acceptance never overwrites it`,
  );
  const filed = {
    schemaVersion: 1,
    kind: "FiledProductSuggestionPacket",
    filedAt: date,
    sourceReceiptId: reviewReceiptId,
    sourceReceiptPath: `${runsRoot(root)}/${reviewReceiptId}.md`,
    operatorReason: reason,
    promotion:
      "Filing records the packet. Promotion to a work order remains an operator-authorized planning act.",
    packet,
  };
  const bytes = `${JSON.stringify(filed, null, 2)}\n`;
  checkLocalTerms(root, [{ name: path, text: bytes }]);
  writeFileSync(absolute, bytes, { flag: "wx", mode: 0o644 });
  return { path, packetHash: sha256(bytes) };
}

/**
 * The operator's act, and it stops here. An accepted finding must have
 * survived its blinded refutation; a refuted, blocked, unselected or unknown
 * identifier is refused rather than quietly promoted.
 */
export async function disposeEntropyFinding(
  root,
  { receiptId, id, disposition, reason, now = () => new Date().toISOString() },
) {
  check(
    ["accept", "defer", "dismiss"].includes(disposition),
    "disposition must be accept, defer or dismiss",
  );
  check(
    typeof reason === "string" && reason.trim().length > 0,
    "a disposition needs a reason",
  );
  const review = readReceipt(root, receiptId);
  check(
    review.kind === "EntropyReducerReviewRun",
    `${receiptId} is not a review receipt`,
  );
  const recordedAt = now();
  const date = recordedAt.slice(0, 10);
  const packet = review.reviewerOutput.proposalPackets.find(
    (candidate) => candidate.suggestion.suggestionId === id,
  );
  const finding = review.reviewerOutput.findings.find(
    (candidate) => candidate.findingId === id,
  );
  check(
    packet !== undefined || finding !== undefined,
    `${id} names neither a finding nor a proposal packet in ${receiptId}`,
  );
  if (packet && !finding) {
    const events = [
      {
        schemaVersion: 1,
        type: "EntropyFindingDisposed",
        recordedAt,
        receiptId,
        receiptHash: review.receiptHash,
        findingId: id,
        disposition,
        reason,
        survival: "proposal-packet",
      },
    ];
    let filed = null;
    if (disposition === "accept") {
      filed = filePacket(root, receiptId, packet, reason, recordedAt);
      events.push({
        schemaVersion: 1,
        type: "EntropyPacketFiled",
        recordedAt,
        receiptId,
        receiptHash: review.receiptHash,
        suggestionId: id,
        packetHash: filed.packetHash,
        path: filed.path,
      });
    }
    for (const event of events) appendControl(root, event);
    return {
      receiptId,
      id,
      disposition,
      kind: "proposal-packet",
      ...(filed ? { filed: filed.path } : {}),
      promotion:
        "Filing is not promotion; a work order still needs an operator-authorized planning act.",
    };
  }
  check(finding !== undefined, `${id} is not a finding in ${receiptId}`);
  const refutation = latestRefutationFor(root, receiptId);
  const survival = !refutation
    ? "unrefuted"
    : refutation.report.promotedFindingIds.includes(id)
      ? "survived"
      : refutation.report.refutedFindingIds.includes(id)
        ? "refuted"
        : refutation.report.blockedFindingIds.includes(id)
          ? "blocked"
          : "unselected";
  if (disposition === "accept")
    check(
      survival === "survived",
      survival === "unrefuted"
        ? `${id} cannot be accepted before a refutation of ${receiptId} is filed: run npm run entropy -- refute ${receiptId} first`
        : `${id} is ${survival} in ${refutation.receiptId} and cannot be accepted; it stays visible in that report`,
    );
  const events = [
    {
      schemaVersion: 1,
      type: "EntropyFindingDisposed",
      recordedAt,
      receiptId,
      receiptHash: review.receiptHash,
      findingId: id,
      disposition,
      reason,
      survival,
    },
  ];
  let candidate = null;
  if (disposition === "accept")
    candidate = appendCandidate(root, receiptId, finding, reason, date);
  for (const event of events) appendControl(root, event);
  return {
    receiptId,
    id,
    disposition,
    survival,
    ...(candidate ? { candidate } : {}),
    next:
      disposition === "accept"
        ? "npm run meta -- to list the new candidate as a register row"
        : "recorded; no register row is created",
  };
}

// -------------------------------------------------------------- the pass input

/**
 * The review a planning pass should consume before it pays for another one: the
 * most recently filed review that has a bound refutation and no disposition
 * yet. A pass that finds one works from it; only when there is none does a
 * fresh review earn its episode.
 */
export function unconsumedReview(root) {
  const events = readEntropyControl(root);
  const disposed = new Set(
    events
      .filter((event) => event.type === "EntropyFindingDisposed")
      .map((event) => event.receiptId),
  );
  const filed = new Set(
    events
      .filter((event) => event.type === "EntropyReviewFiled")
      .map((event) => event.receiptId),
  );
  const reviews = runNames(root)
    .filter((name) => filed.has(name))
    .map((name) => readReceipt(root, name))
    .filter((receipt) => receipt.kind === "EntropyReducerReviewRun");
  for (const review of reviews.reverse()) {
    if (disposed.has(review.receiptId)) continue;
    const refutation = latestRefutationFor(root, review.receiptId);
    if (!refutation) continue;
    return {
      receiptId: review.receiptId,
      receiptPath: `${runsRoot(root)}/${review.receiptId}.md`,
      refutationReceiptId: refutation.receiptId,
      refutationPath: `${runsRoot(root)}/${refutation.receiptId}.md`,
      baseCommit: review.subject.baseCommit,
      reviewer: review.actorAttestation.identity,
      findings: review.findingSummary,
      survived: refutation.report.promotedFindingIds,
      refuted: refutation.report.refutedFindingIds,
      blocked: refutation.report.blockedFindingIds,
      unselected: refutation.report.unselectedFindingIds,
      proposalPackets: review.reviewerOutput.proposalPackets.map(
        (packet) => packet.suggestion.suggestionId,
      ),
    };
  }
  return null;
}

/** What `planning: entropy reducer` should do next, without doing it. */
export function entropySubject(root) {
  const unconsumed = unconsumedReview(root);
  const pending = {
    review: currentDispatch(root, "review"),
    refutation: currentDispatch(root, "refutation"),
  };
  if (pending.review || pending.refutation)
    return {
      action: "finish-pending-dispatch",
      pendingReview: pending.review?.episodeId ?? null,
      pendingRefutation: pending.refutation?.episodeId ?? null,
      reason:
        "a dispatch is already pending; file its receipt or discard it before opening a pass",
    };
  if (unconsumed)
    return {
      action: "consume",
      reason:
        "this review is bound by a refutation and nothing has been disposed from it; consume it rather than paying for another episode",
      ...unconsumed,
    };
  return {
    action: "review",
    latestFiledReview:
      readEntropyControl(root)
        .filter((event) => event.type === "EntropyReviewFiled")
        .at(-1)?.receiptId ?? null,
    reason:
      "no filed review is both refuted and undisposed, so a fresh episode earns its cost",
    command: "npm run entropy -- review --transport claude-cli-print",
  };
}

// ------------------------------------------------------------------- the check

/**
 * Proves the receipt chain and the immutability of every filed pair. A
 * hand-edited receipt, a missing control event and a committed fixture receipt
 * all fail. A trailing event whose pair never landed is an interrupted filing
 * the operator completes; it is reported, not failed, so a crash between the
 * two writes never reddens the shared document gate for unrelated work.
 */
export function checkEntropyReceipts(root) {
  const events = readEntropyControl(root);
  const filings = events.filter((event) => FILING_TYPES.includes(event.type));
  const committed = committedReader(root);
  const names = runNames(root);
  const byId = new Map(filings.map((event) => [event.receiptId, event]));
  const interrupted = [];
  const checked = [];

  filings.forEach((event, index) => {
    check(
      event.ordinal === index + 1,
      `entropy filing ordinals are not contiguous at ${event.receiptId}`,
    );
  });

  for (const [index, event] of filings.entries()) {
    const jsonPath = `${runsRoot(root)}/${event.receiptId}.json`;
    const renderedPath = `${runsRoot(root)}/${event.receiptId}.md`;
    const present =
      existsSync(join(root, jsonPath)) && existsSync(join(root, renderedPath));
    if (!present) {
      check(
        index === filings.length - 1,
        `entropy receipt ${event.receiptId} is recorded in the control log but its pair is missing`,
      );
      interrupted.push(event.receiptId);
      continue;
    }
    const source = readFileSync(join(root, jsonPath), "utf8");
    const receipt = JSON.parse(source);
    const { receiptHash, ...body } = receipt;
    check(
      sha256(JSON.stringify(body)) === receiptHash,
      `entropy receipt ${event.receiptId} was hand-edited: its recomputed hash does not match`,
    );
    check(
      receiptHash === event.receiptHash,
      `entropy receipt ${event.receiptId} does not match the hash its control event bound`,
    );
    const rendered = readFileSync(join(root, renderedPath), "utf8");
    check(
      rendered === renderReceipt(receipt),
      `entropy receipt ${event.receiptId}.md is not the current projection of its JSON`,
    );
    check(
      sha256(rendered) === event.renderedHash,
      `entropy receipt ${event.receiptId}.md does not match the hash its control event bound`,
    );
    check(
      receipt.liveness !== "fixture" || !committed.paths.includes(jsonPath),
      `entropy receipt ${event.receiptId} is fixture evidence and must never be committed as a run`,
    );
    const previous = filings[index - 1] ?? null;
    check(
      receipt.previousReceiptHash === (previous?.receiptHash ?? null),
      `entropy receipt ${event.receiptId} does not continue the receipt chain`,
    );
    for (const path of [jsonPath, renderedPath])
      if (committed.paths.includes(path))
        check(
          readFileSync(join(root, path), "utf8") === committed.read(path),
          `committed entropy receipt ${path} was edited; file a new receipt instead`,
        );
    checked.push(event.receiptId);
  }

  for (const name of names) {
    if (byId.has(name)) continue;
    check(
      preMechanism(root, name),
      `entropy receipt ${name} is filed with no control event; the chain cannot admit it`,
    );
  }

  for (const event of events.filter(
    (row) =>
      row.type === "EntropyFindingDisposed" ||
      row.type === "EntropyPacketFiled",
  )) {
    const filing = byId.get(event.receiptId);
    check(
      filing !== undefined && filing.receiptHash === event.receiptHash,
      `entropy disposition on line for ${event.receiptId} does not bind a filed receipt`,
    );
    if (event.type === "EntropyPacketFiled") {
      const absolute = join(root, event.path);
      check(
        containedRegularFile(absolute, root),
        `filed packet ${event.path} is missing`,
      );
      check(
        sha256(readFileSync(absolute, "utf8")) === event.packetHash,
        `filed packet ${event.path} no longer matches the hash its event bound`,
      );
    }
  }

  return {
    receipts: checked,
    preMechanism: names.filter(
      (name) => !byId.has(name) && preMechanism(root, name),
    ),
    dispositions: events.filter((row) => row.type === "EntropyFindingDisposed")
      .length,
    packets: events.filter((row) => row.type === "EntropyPacketFiled").length,
    interruptedFilings: interrupted,
    status: interrupted.length ? "interrupted-filing" : "ok",
  };
}
