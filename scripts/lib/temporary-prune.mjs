import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
  renameSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import {
  closedJournalEntry,
  ensureTemporaryRoot,
  finishTemporaryRoot,
  hasGateTemporaryLifetime,
  TEMPORARY_OWNER_FILE,
  ownerAlive,
  nestedTemporaryRoots,
  readRetention,
  readTemporaryOwner,
  registeredTemporaryRootOf,
  registeredTemporaryRoots,
  removeTemporaryRemovalRemains,
  removeTemporaryRoot,
  requireTemporaryDirectory,
  restoreTemporaryRepairs,
  RESTRICTED_ENTRY,
  temporaryLedgerSegments,
  temporaryRemovalRemains,
  temporaryLedgerContradiction,
  temporaryProcessTable,
  temporaryRemovalAside,
  temporaryRetentionPassed,
  temporaryOutcomeRecord,
  writeTemporaryOwner,
} from "./temporary-roots.mjs";
import { activeGateRuns, readGateChecks } from "./gate-evidence.mjs";
import { createRequire } from "node:module";
import { parseWorktrees } from "./git.mjs";
import { hostStateRoot } from "./host-resources.mjs";
import { readHolders } from "./host-lanes.mjs";

// Runner imports must remain available before their build preflight.
const requireRuntime = createRequire(import.meta.url);
const harnessWriterView = (root) =>
  requireRuntime(
    "../../packages/skeleton/dist/src/harness-host.js",
  ).harnessWriterView(root);

const within = (parent, path) =>
  path === parent || path.startsWith(parent + sep);
const directory = (path) =>
  lstatSync(path, { throwIfNoEntry: false })?.isDirectory() &&
  !lstatSync(path).isSymbolicLink();

// Stable coordination/cache names are not abandoned mkdtemp roots. Backfill
// recognizes the six-character suffix used by the old Node and shell helpers.
const legacyRootName = (name) =>
  /^dotln-.+[-.][A-Za-z0-9_]{6}$/.test(name) &&
  !/^dotln-(?:host-v\d|writer-transition|ctx7-cache)/.test(name);

/** Every prune reader resolves its scope here, so the snapshot, cache and
 * temporary-root walks of one prune always agree on it. */
export const pruneScope = (options = {}) =>
  options.scope ?? process.env.DOTLN_PRUNE_SCOPE ?? "all";

/** Code of the refusal a spent prune budget raises inside a walk or removal. */
export const PRUNE_BUDGET = "PRUNE_BUDGET";
/** The progress floor of a bounded prune: its first root always has the
 * smaller of this and the budget, even when the budget was spent before it. */
export const PRUNE_PROGRESS_FLOOR_MS = 1000;
/** How many entries a prune's listing reads between two asks of its budget:
 * it always lists the first batch, and never reads more than one batch past
 * a spent budget. */
export const PRUNE_LISTING_BATCH = 64;

/** A wall budget for one prune: the returned check throws, with code
 * PRUNE_BUDGET and the path it was asked about, once `budgetMs` has passed
 * since the budget was made; `spent()` says whether it has, and `bounded`
 * whether there is a budget at all. `withFloor()` returns the same check
 * extended, if need be, to the smaller of the budget and one second from now,
 * so the first root has that long whatever came before it. Without a budget
 * the check never throws.
 * @param {number|null|undefined} budgetMs @param {() => number} [now] */
export function pruneBudget(budgetMs, now = () => performance.now()) {
  const bounded = typeof budgetMs === "number" && Number.isFinite(budgetMs);
  const make = (deadline) => {
    const spent = () => now() >= deadline;
    const check = (path) => {
      if (spent())
        throw Object.assign(new Error(`prune budget spent at ${path}`), {
          code: PRUNE_BUDGET,
          path,
        });
    };
    return Object.assign(check, {
      spent,
      bounded,
      budgetMs: bounded ? budgetMs : null,
      withFloor: () =>
        bounded
          ? make(
              Math.max(
                deadline,
                now() +
                  Math.min(Math.max(0, budgetMs), PRUNE_PROGRESS_FLOOR_MS),
              ),
            )
          : check,
    });
  };
  return make(bounded ? now() + Math.max(0, budgetMs) : Infinity);
}

// A captured root that a stopped removal left aside is judged where its
// token puts it.
const resolveSaved = (saved) => {
  const aside = temporaryRemovalAside(saved.path, saved.token);
  return existsSync(aside) ? { ...saved, path: aside } : saved;
};

// A ledger can outlive its path, or disappear with the closing worktree. A
// recorded root still belongs to its checkout only while the owner marker at
// its path carries the recorded token and that checkout's physical path. A
// marker its owner cannot read proves nothing either way; the root is admitted,
// and its judgment keeps it as a restricted entry, never stopping a close.
const ownerBinds = (saved) => {
  try {
    const owner = readTemporaryOwner(saved.path);
    return (
      owner?.token === saved.token &&
      owner.owner.repository === saved.repository
    );
  } catch (error) {
    if (["EACCES", "EPERM"].includes(error?.code)) return true;
    throw error;
  }
};

/** The roots a checkout's ledger registers that their owner markers still
 * bind to it, each recorded with the checkout's physical path. Owner markers
 * store physical paths, so a symlinked checkout path still matches; a
 * checkout that no longer exists binds nothing. */
export function boundTemporaryRoots(checkout) {
  let repository;
  try {
    repository = realpathSync(checkout);
  } catch {
    return [];
  }
  return registeredTemporaryRoots(checkout)
    .map((row) => ({ path: row.path, token: row.token, repository }))
    .filter(ownerBinds);
}

/** The roots a prune judges: a close's captured roots, or this checkout's
 * registered roots, the `dotln-*` entries and session scratch in the system
 * temporary directory and the warm fixtures, each listed once. `options.budget`,
 * when given, is asked once every PRUNE_LISTING_BATCH entries read: a listing
 * it stops returns what it found, how many entries it did not examine, each
 * unread ledger segment or directory entry counted as one root, and the first
 * of them as `stoppedAt`.
 * @param {string} root @param {Record<string, any>} [options]
 * @returns {{paths: string[], unexamined: number, stoppedAt: string|null}} */
export function listTemporaryRoots(root, options = {}) {
  const scope = pruneScope(options);
  const paths = new Set();
  let unexamined = 0;
  let examined = 0;
  let stoppedAt = null;
  const visit = (entries, each, pathOf) => {
    for (let index = 0; index < entries.length; index++) {
      if (
        stoppedAt === null &&
        examined > 0 &&
        examined % PRUNE_LISTING_BATCH === 0 &&
        options.budget?.spent()
      )
        stoppedAt = pathOf(entries[index]);
      if (stoppedAt !== null) {
        unexamined += entries.length - index;
        return;
      }
      examined += 1;
      each(entries[index]);
    }
  };
  // A close prunes only the closed order's own roots, which it captured from
  // its worktree's ledger before removing the worktree; this checkout's other
  // roots are the host-wide remainder that plan start's prune takes.
  if (scope === "close")
    visit(
      options.ownedTemporaryRoots ?? [],
      (saved) => {
        const resolved = resolveSaved(saved);
        if (ownerBinds(resolved)) paths.add(resolved.path);
      },
      (saved) => saved.path,
    );
  else
    visit(
      temporaryLedgerSegments(root),
      (file) => {
        const row = registeredTemporaryRootOf(file);
        if (row) paths.add(row.path);
      },
      (file) => file,
    );
  const bases =
    scope === "close"
      ? []
      : (options.temporaryBases ??
        (scope === "all" ? [realpathSync(tmpdir())] : []));
  for (const base of bases) {
    requireTemporaryDirectory(base);
    if (!directory(base)) continue;
    // The listing's own entry types say which names are directories, so
    // thousands of roots cost one listing, not one lstat each; the judgment
    // checks each root's directory and ancestors again before it acts.
    visit(
      readdirSync(base, { withFileTypes: true }),
      (entry) => {
        const { name } = entry;
        if (!entry.isDirectory() || entry.isSymbolicLink()) return;
        const path = join(base, name);
        if (name.startsWith("dotln-")) paths.add(path);
        if (name === "dotln")
          for (const session of readdirSync(path)) {
            if (!/^[a-f0-9]{64}$/.test(session)) continue;
            const scratch = join(path, session, "scratch");
            if (directory(scratch)) paths.add(scratch);
            // A removal stopped after it moved the scratch aside leaves it
            // beside its place; the judgment decides what it is.
            let entries = [];
            try {
              entries = readdirSync(join(path, session));
            } catch {
              entries = [];
            }
            for (const entry of entries)
              if (
                /^dotln-removing-[a-f0-9-]{36}$/.test(entry) &&
                directory(join(path, session, entry))
              )
                paths.add(join(path, session, entry));
          }
      },
      (entry) => join(base, entry.name),
    );
  }
  // Warm fixtures have one hash directory beneath their family directory.
  const warm = join(root, ".runtime/fixtures/launchpad");
  if (directory(warm))
    visit(
      readdirSync(warm),
      (key) => {
        if (/^[a-f0-9]{64}$/.test(key) && directory(join(warm, key)))
          paths.add(join(warm, key));
      },
      (key) => join(warm, key),
    );
  return { paths: [...paths], unexamined, stoppedAt };
}

/** Every root a prune could judge, with every owned root nested in each,
 * longest path first. Fixtures and diagnostics read it; a prune itself lists
 * with listTemporaryRoots and walks a root only once its record lets it go.
 * @param {string} root @param {Record<string, any>} [options] */
export function temporaryPrunePaths(root, options = {}) {
  const paths = new Set(listTemporaryRoots(root, options).paths);
  const includeDescendants = (path) => {
    for (const child of nestedTemporaryRoots(path)) {
      if (paths.has(child)) continue;
      paths.add(child);
      includeDescendants(child);
    }
  };
  for (const path of [...paths]) if (directory(path)) includeDescendants(path);
  return [...paths].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

// An inner gate's result cannot end its containing fixture's use. Resolve
// that lifetime through the existing physical ancestor and owner token.
function containingFixtureRecord(path, record) {
  if (!record?.fixtureOwner) return null;
  for (let at = dirname(path); ;) {
    const parent = readTemporaryOwner(at);
    if (
      parent?.class === "gate-fixture" &&
      parent.token === record.fixtureOwner.token &&
      parent.owner.gateId === record.fixtureOwner.gateId
    )
      return { path: at, record: parent };
    const next = dirname(at);
    if (next === at)
      throw new Error("Containing fixture ownership is unavailable");
    at = next;
  }
}

// Removing a worktree ends its ability to host a gate. Only observed absence
// establishes that fact; inaccessible paths, aliases and invalid markers still
// propagate to the conservative retention judgment.
function repositoryGateRuns(repository) {
  try {
    return activeGateRuns(repository);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    requireTemporaryDirectory(repository);
    if (lstatSync(repository, { throwIfNoEntry: false })) throw error;
    return [];
  }
}

// A context may carry `gateChecks`, a map a whole prune shares: a gate index
// can run to tens of megabytes, and a prune judging thousands of one
// repository's roots reads it once. A gate's terminal row never changes once
// written, and no gate starts while a prune holds the host lanes.
function terminalGateResult(repository, gateId, context = {}) {
  const terminal = temporaryGateResultPath(repository, gateId);
  let rows = context.gateChecks?.get(repository);
  if (!rows) {
    rows = readGateChecks(repository);
    context.gateChecks?.set(repository, rows);
  }
  return (
    rows.findLast((row) => row.temporaryGateId === gateId) ??
    (existsSync(terminal) ? JSON.parse(readFileSync(terminal, "utf8")) : null)
  );
}

// One writer view per worktree for each context, and only for a worktree that
// can protect the root being judged. A live writer's view lists the process
// table, so reading every worktree's view for every root once cost a process
// listing per root; a prune counts the views it reads.
function writerViewOf(context, worktree) {
  context.writerViews ??= new Map();
  if (!context.writerViews.has(worktree)) {
    if (context.reads) context.reads.writerViews += 1;
    let view;
    try {
      view = { view: harnessWriterView(worktree) };
    } catch (error) {
      view = { error };
    }
    context.writerViews.set(worktree, view);
  }
  const { view, error } = context.writerViews.get(worktree);
  if (error) throw error;
  return view;
}

// A context's live-gate readings per repository, read once per context.
function gateRunsOf(context, repository) {
  context.gateRuns ??= new Map();
  if (!context.gateRuns.has(repository)) {
    let rows;
    try {
      rows = { rows: repositoryGateRuns(repository) };
    } catch (error) {
      rows = { error };
    }
    context.gateRuns.set(repository, rows);
  }
  const { rows, error } = context.gateRuns.get(repository);
  if (error) throw error;
  return rows;
}

// A directly assigned suite owns its outcome within this gate. An inner
// instance inherits the containing suite when the outer gate ends.
function gateOutcome(record, fixture, gateId, tasks) {
  const suite =
    record.owner.gateId === gateId && record.owner.suite
      ? record.owner.suite
      : (fixture?.owner.suite ?? record.owner.suite);
  const task = tasks.find((task) => task.name === suite);
  return (
    task
      ? task.exitCode === 0 && !task.stopped
      : !suite &&
        tasks.length > 0 &&
        tasks.every((task) => task.exitCode === 0 && !task.stopped)
  )
    ? "passed"
    : "failed";
}

function blockedByUse(
  path,
  record,
  context,
  fixture = containingFixtureRecord(path, record),
) {
  if (
    fixture &&
    context.finishingGate?.id !== fixture.record.owner.gateId &&
    gateRunsOf(context, fixture.record.owner.repository).some(
      (row) => row.runId === fixture.record.owner.gateId,
    )
  )
    return "containing fixture gate is live";
  const trees = [...(context.worktrees ?? [])];
  if (
    record?.owner.repository &&
    !trees.some((tree) => tree.worktree === record.owner.repository)
  )
    trees.push({ worktree: record.owner.repository });
  for (const tree of trees) {
    const worktree = resolve(tree.worktree);
    // A writer protects a root only when the root holds its worktree, the
    // root's owner is that worktree, or the root names a session, which any
    // writer might hold; no other worktree's writer is read for this root.
    if (
      !within(path, worktree) &&
      record?.owner.repository !== worktree &&
      !record?.owner.session
    )
      continue;
    if (!existsSync(tree.worktree)) continue;
    if (context.finishingGate?.repository === worktree) continue;
    let writer;
    try {
      writer = writerViewOf(context, tree.worktree);
    } catch {
      return "writer observation unavailable";
    }
    if (
      writer.reserved &&
      (!context.finishingGate || writer.alive !== false) &&
      (within(path, worktree) ||
        record?.owner.repository === worktree ||
        (record?.owner.session && record.owner.session === writer.actorId))
    )
      return "writer reservation names this root or session";
  }
  if (
    (context.holders ?? []).some(
      (row) =>
        row.worktree &&
        context.finishingGate?.repository !== resolve(row.worktree) &&
        (within(path, resolve(row.worktree)) ||
          record?.owner.repository === resolve(row.worktree)),
    )
  )
    return "live host lane names this root";
  if (record?.owner.session && record.owner.session === context.currentKey)
    return "current session retains its temporary root";
  // The completing gate already supplies its own liveness decision. Later
  // prunes also observe removed repositories without inventing a live gate.
  if (
    record?.owner.gateId &&
    context.finishingGate?.id !== record.owner.gateId
  ) {
    const active = gateRunsOf(context, record.owner.repository);
    if (
      active.some(
        (row) =>
          row.checkId === record.owner.gateId ||
          row.runId === record.owner.gateId,
      )
    )
      return "owning gate is live";
  }
  return null;
}

/** Judges one root by what its owner record says, reading nothing else of it:
 * its class, token and inode, its ledger registration, its owner's liveness
 * and its outcome and retention window. Only a root the record already lets go
 * is walked, for the owned roots nested in it, each of which must be removable
 * too; the walk lists directories and reads no file. A retained root is never
 * walked. The returned candidate names its proof: `record`, or `inventory` for
 * a closed-journal root, whose journals the kit keeps a byte proof of before
 * they go; an unmarked root is judged by the legacy rule, and the empty
 * remains of a stopped removal by being empty.
 *
 * The context may carry `processes`, the prune's one process table;
 * `budget`, which throws once the prune's time is spent, so the walk stops
 * inside a large root and the root is retained as `budget`; and `repair`,
 * which an apply sets so that an entry its owner cannot list is made listable
 * instead of retaining the root as a restricted entry, with `chmod` replacing
 * the grant for a fixture. A root the judgment then keeps gets the modes the
 * walk changed put back, so a kept root ends as it was found. `grants` is the
 * list a parent's judgment shares with the roots nested in it, so a parent it
 * keeps also puts back what it granted inside a nested root it let go.
 * @param {string} root @param {string} path @param {Record<string, any>} [options]
 * @param {Record<string, any>} [context]
 * @param {Array<{path: string, mode: number}>} [grants] */
export function judgeTemporaryRoot(
  root,
  path,
  options = {},
  context = {},
  grants = [],
) {
  const label = relative(root, path).startsWith("..")
    ? path
    : relative(root, path);
  let record;
  let kind = "temporary-root";
  const retain = (reason, extra = {}) => ({
    retained: { kind, path: label, reason, ...extra },
  });
  // The owned roots nested in a root about to be let go: each must be
  // removable too, and their identities are checked again at removal. A
  // retained one names every nested root the walk found, so the prune can
  // judge each on its own; a budget spent judging one keeps this root, the
  // one being judged, as `budget`.
  const nestedInventory = () => {
    const repaired = grants;
    let nested;
    try {
      nested = nestedTemporaryRoots(path, {
        budget: context.budget,
        repair: context.repair,
        chmod: context.chmod,
        repaired,
      });
    } catch (error) {
      restoreTemporaryRepairs(repaired);
      throw error;
    }
    const inventory = [];
    for (const child of nested) {
      const childJudgment = judgeTemporaryRoot(
        root,
        child,
        options,
        context,
        repaired,
      );
      if (childJudgment?.retained?.budget) {
        restoreTemporaryRepairs(repaired);
        return {
          retained: retain("budget", {
            budget: true,
            ...(record ? { class: record.class } : {}),
          }),
        };
      }
      if (!childJudgment?.candidate) {
        restoreTemporaryRepairs(repaired);
        return {
          retained: retain(
            `nested owned root retained: ${relative(path, child)} (${childJudgment?.retained?.reason ?? "ownership unavailable"})`,
            { nested },
          ),
        };
      }
      const childRow = childJudgment.candidate;
      inventory.push(
        {
          path: child,
          token: childRow.token,
          device: childRow.device,
          inode: childRow.inode,
        },
        ...childRow.inventory,
      );
    }
    return { inventory };
  };
  try {
    requireTemporaryDirectory(path);
    if (!directory(path)) return null;
    record = readTemporaryOwner(path);
    if (record?.class === "session-scratch") kind = "session-scratch";
    // A marker is believed only as far as its owner's ledger registers it.
    const contradiction = record && temporaryLedgerContradiction(path, record);
    if (contradiction) return retain(contradiction, { class: record.class });
    // A closed-journal root holds only what a close moves into it; anything
    // else was put there by someone else and is not the prune's to remove.
    if (record?.class === "closed-journal") {
      const undeclared = readdirSync(path, { withFileTypes: true }).find(
        (entry) =>
          entry.name !== TEMPORARY_OWNER_FILE &&
          !(entry.isDirectory()
            ? closedJournalEntry(entry.name, true)
            : entry.isFile() && closedJournalEntry(entry.name, false)),
      );
      if (undeclared)
        return retain(
          `closed-journal root holds an entry its class does not declare: ${undeclared.name}`,
          { class: record.class },
        );
    }
    const fixture = containingFixtureRecord(path, record);
    const use = blockedByUse(path, record, context, fixture);
    if (use) return retain(use);
    // A prune passes its one table; null is an unavailable one, never read
    // again for each root.
    const table =
      context.processes !== undefined
        ? context.processes
        : temporaryProcessTable(root);
    const now = options.now ?? Date.now();
    // A removal that stopped after deleting its owner record and before its
    // directory leaves an empty directory under its token's aside name; with
    // nothing in it to retain, it is removed with rmdir, which refuses
    // anything that appears in it since.
    if (!record && temporaryRemovalRemains(path)) {
      const info = lstatSync(path);
      return {
        candidate: {
          kind: "removal-remains",
          path: label,
          absolute: path,
          class: "removal-remains",
          proof: "remains",
          ownerAlive: false,
          ageMs: now - info.mtimeMs,
          bytes: 0,
          device: info.dev,
          inode: info.ino,
          inventory: [],
        },
      };
    }
    if (!record) {
      kind = "legacy-backfill";
      if (!legacyRootName(basename(path)))
        return retain(
          "unmarked root has no recognized disposable prefix and suffix",
        );
      const retention = readRetention(root);
      // An unmarked root may be any disposable class, so it waits for the
      // longest of their windows. Coordination and closed journals are always
      // marked and never named like an abandoned temporary root.
      const windows = Object.entries(retention)
        .filter(([key]) => !["coordination", "closed-journal"].includes(key))
        .map(([, hours]) => hours);
      if (windows.includes(null))
        return retain(
          "a null retention window disables unclassified legacy backfill",
        );
      const hours = Math.max(...windows);
      const info = lstatSync(path);
      if (now - info.mtimeMs < hours * 3_600_000)
        return retain("legacy backfill window has not passed");
      if (!table || context.gateLive || context.holders?.length)
        return retain(
          "legacy ownership is uncertain while a gate/lane is live or the process table is unavailable",
        );
      // Old shell records include the creating PID. Other legacy roots require
      // a complete open-path observation; absence of that observation retains.
      const shell = join(path, ".dotln-test-root-owner");
      const shellPid = existsSync(shell)
        ? Number(readFileSync(shell, "utf8").trim().split(":")[1])
        : null;
      if (shellPid && table.some((row) => row.pid === shellPid))
        return retain("legacy shell owner is live");
      if (!Array.isArray(context.openPaths))
        return retain("legacy open-path observation unavailable");
      if (context.openPaths.some((open) => within(path, open)))
        return retain("a live process has material open in this root");
      const nested = nestedInventory();
      if (!nested.inventory) return nested.retained;
      return {
        candidate: {
          kind,
          path: label,
          absolute: path,
          class: "legacy-backfill",
          proof: "legacy",
          ownerAlive: false,
          ageMs: now - info.mtimeMs,
          // Measured when it is removed, by the walk the removal makes anyway.
          bytes: null,
          device: info.dev,
          inode: info.ino,
          inventory: nested.inventory,
        },
      };
    }
    const fixtureTerminal = fixture
      ? terminalGateResult(
          fixture.record.owner.repository,
          fixture.record.owner.gateId,
          context,
        )
      : null;
    const fixtureAlive = fixture ? ownerAlive(fixture.record, table) : null;
    const alive =
      fixture && ["session-scratch", "coordination"].includes(record.class)
        ? fixtureAlive
        : ownerAlive(record, table);
    const detail = {
      class: record.class,
      ownerAlive: alive,
      ageMs: now - Date.parse(record.createdAt),
    };
    if (record.class === "coordination" && !record.fixtureOwner)
      return retain(
        "coordination root is retained by its owning protocol",
        detail,
      );
    if (alive !== false)
      return retain(
        alive ? "owner is live" : "owner identity is unavailable",
        detail,
      );
    if (
      fixture &&
      !fixtureTerminal &&
      !fixture.record.endedAt &&
      fixtureAlive !== false
    )
      return retain("containing fixture owner is live or unavailable", detail);
    // A cache inside a disposable fixture shares that fixture's lifetime;
    // only an independent cache remains subject to its freshness protocol.
    if (record.class === "warm-fixture" && !fixture) {
      const current = join(
        record.owner.repository,
        ".runtime/fixtures/launchpad/current.json",
      );
      const key =
        options.currentWarmKey ??
        (existsSync(current)
          ? JSON.parse(readFileSync(current, "utf8")).key
          : null);
      if (!key || key === record.cacheKey)
        return retain(
          "warm fixture is current or its current key is unavailable",
          detail,
        );
    }
    // A recorded terminal gate supplies the suite outcome even after a crash
    // between recording the row and running cleanup. Never rewrite on preview.
    let judged = {
      ...record,
      retentionHours: temporaryOutcomeRecord(
        record,
        record.outcome ?? "abandoned",
        record.endedAt ?? new Date(now).toISOString(),
      ).retentionHours,
    };
    if (
      fixture ||
      (hasGateTemporaryLifetime(record) &&
        record.owner.gateId &&
        (!record.endedAt || record.endSource === "owner-death-observation"))
    ) {
      const lifetime = fixture?.record ?? record;
      const row = fixture
        ? fixtureTerminal
        : terminalGateResult(
            lifetime.owner.repository,
            lifetime.owner.gateId,
            context,
          );
      if (row)
        judged = temporaryOutcomeRecord(
          record,
          gateOutcome(
            record,
            fixture?.record,
            lifetime.owner.gateId,
            row.taskTimeline ?? [],
          ),
          row.recordedAt,
        );
      else if (fixture) {
        const outcomeOwner =
          record.owner.gateId === lifetime.owner.gateId && record.owner.suite
            ? record
            : lifetime;
        judged = {
          ...temporaryOutcomeRecord(
            record,
            outcomeOwner.outcome ?? "abandoned",
            outcomeOwner.endedAt ?? new Date(now).toISOString(),
          ),
          endedAt: outcomeOwner.endedAt,
        };
      }
    }
    if (
      !judged.endedAt &&
      (fixture ||
        ["gate-fixture", "session-scratch", "worker-capture"].includes(
          judged.class,
        )) &&
      judged.retentionHours !== null
    )
      return {
        retained: {
          kind,
          path: label,
          reason:
            "owner end time unavailable; apply starts the orphan retention window",
          ...detail,
        },
        observation: {
          absolute: path,
          path: label,
          token: record.token,
          retentionHours: judged.retentionHours,
          ...(fixture
            ? { fixture: { path: fixture.path, token: fixture.record.token } }
            : {}),
          ...(hasGateTemporaryLifetime(record) ? { outcome: "abandoned" } : {}),
        },
      };
    if (!temporaryRetentionPassed(judged, now))
      return retain(
        judged.retentionHours === null
          ? "class is retained indefinitely"
          : "retention window has not passed",
        detail,
      );
    const nested = nestedInventory();
    if (!nested.inventory) return nested.retained;
    return {
      candidate: {
        kind,
        path: label,
        absolute: path,
        ...detail,
        proof: record.class === "closed-journal" ? "inventory" : "record",
        ...(record.owner.workOrder
          ? { workOrder: record.owner.workOrder }
          : {}),
        token: record.token,
        device: record.device,
        inode: record.inode,
        // Measured when it is removed, by the walk the removal makes anyway.
        bytes: null,
        inventory: nested.inventory,
      },
    };
  } catch (error) {
    // A prune's spent budget retains the root as `budget`, and the prune
    // stops with it; an entry of the root its owner cannot list or read, the
    // owner record itself included, retains it by that entry's path, and any
    // other refusal, such as a ledger that refuses a write, by its message.
    if (error?.code === PRUNE_BUDGET)
      return retain("budget", {
        budget: true,
        ...(record ? { class: record.class } : {}),
      });
    if (
      ["EACCES", "EPERM"].includes(error?.code) &&
      within(path, error.path ?? path)
    )
      return retain(`restricted-entry: ${error.path ?? path}`);
    return retain(error.message);
  }
}

/** Read-only planning never guesses an exit time or writes a marker. Apply
 * records the first proven-dead observation, conservatively starting the
 * full orphan window then, and never deletes that root in the same plan.
 */
export function observeTemporaryOwnerEnd(root, observation, options, context) {
  const fresh = judgeTemporaryRoot(
    root,
    observation.absolute,
    options,
    context,
  );
  if (fresh?.observation?.token !== observation.token) return null;
  const record = readTemporaryOwner(observation.absolute);
  if (!record || record.token !== observation.token) return null;
  const fixture = fresh.observation.fixture;
  const target = fixture ? readTemporaryOwner(fixture.path) : record;
  if (!target || (fixture && target.token !== fixture.token)) return null;
  const endedAt = new Date(options.now ?? Date.now()).toISOString();
  // Nested roots share one end observation on their containing fixture.
  const outcome = fixture
    ? temporaryOutcomeRecord(target, "abandoned", endedAt)
    : target;
  writeTemporaryOwner(fixture?.path ?? observation.absolute, {
    ...outcome,
    endedAt,
    endSource: "owner-death-observation",
    retentionHours: fixture
      ? outcome.retentionHours
      : fresh.observation.retentionHours,
    ...(fresh.observation.outcome
      ? { outcome: fresh.observation.outcome }
      : {}),
  });
  return { path: observation.path, endedAt };
}

/** Removes a judged candidate after checking that its nested owners are the
 * ones judged. `options` carries a bounded prune's budget to the walk and the
 * removal, and `chmod`, a fixture's replacement for the grant of access to an
 * entry the owner cannot read; the walk and the removal grant that access.
 * @param {string} root @param {Record<string, any>} row
 * @param {{budget?: (path: string) => void, chmod?: (path: string, mode: number) => void}} [options] */
export function applyTemporaryCandidate(root, row, options = {}) {
  const inventory = [];
  const removal = {
    ...(options.budget ? { budget: options.budget } : {}),
    ...(options.chmod ? { chmod: options.chmod } : {}),
  };
  const inspect = (path) => {
    for (const child of nestedTemporaryRoots(path, {
      ...removal,
      repair: true,
    })) {
      const owner = readTemporaryOwner(child);
      if (!owner) throw new Error("Nested owner disappeared; retained");
      inventory.push({
        path: child,
        token: owner.token,
        device: owner.device,
        inode: owner.inode,
      });
      inspect(child);
    }
  };
  inspect(row.absolute);
  if (JSON.stringify(inventory) !== JSON.stringify(row.inventory))
    throw new Error("Nested ownership changed; retained");
  if (row.kind === "removal-remains") {
    removeTemporaryRemovalRemains(row.absolute, row.inode, root);
    return { files: 0, bytes: 0, directories: 1 };
  }
  if (row.kind === "legacy-backfill") {
    // As for owned roots, the inode says the directory judged is the one
    // present; the device number is kept for diagnosis, since a renumbered
    // volume does not replace a directory.
    const info = lstatSync(row.absolute);
    if (info.ino !== row.inode)
      throw new Error("Legacy root identity changed; retained");
    ensureTemporaryRoot(row.absolute, {
      class: "gate-fixture",
      repository: root,
      adoptExisting: true,
    });
    // The adopted token names where a stopped removal leaves the root, so a
    // stopped apply reports it by its actual places.
    row.token = readTemporaryOwner(row.absolute)?.token;
  }
  return removeTemporaryRoot(row.absolute, row.token, removal);
}

export function pruneCensus(candidates, retained) {
  const kinds = new Map();
  for (const [disposition, rows] of [
    ["candidates", candidates],
    ["retained", retained],
  ])
    for (const row of rows) {
      const key = `${row.kind}/${row.class ?? "unclassified"}`;
      const item = kinds.get(key) ?? {
        kind: row.kind,
        class: row.class ?? null,
        candidates: 0,
        retained: 0,
        bytes: 0,
        unmeasured: 0,
      };
      item[disposition]++;
      // A root judged on its record is measured only by its removal.
      if (disposition === "candidates")
        if (row.bytes === null || row.bytes === undefined) item.unmeasured++;
        else item.bytes += row.bytes;
      kinds.set(key, item);
    }
  return [...kinds.values()];
}

const temporaryGateResultPath = (root, id) => {
  if (!/^[a-f0-9-]{36}$/.test(id))
    throw new Error("Invalid temporary gate identity");
  return join(root, ".runtime/temporary-roots/gate-ends", `${id}.json`);
};
export function recordTemporaryGateResult(root, row) {
  const file = temporaryGateResultPath(root, row.temporaryGateId);
  const parent = join(root, ".runtime/temporary-roots/gate-ends");
  requireTemporaryDirectory(parent);
  mkdirSync(parent, { recursive: true });
  writeFileSync(`${file}.partial`, JSON.stringify(row) + "\n");
  renameSync(`${file}.partial`, file);
}
export function removeTemporaryGateResult(root, id) {
  rmSync(temporaryGateResultPath(root, id), { force: true });
}

/** The gate has already durably recorded its result. Creator teardown may
 * remove the runner's own marker root; other live/unknown processes retain.
 * With `options.suite`, only the roots that suite registered under this gate
 * are finished, by the runner as the suite ends: a passed suite's leave then,
 * a failed suite's take their diagnosis window from that moment, and the
 * gate's end finishes whatever remains. The process table is read once, and
 * only when some root needs an owner's liveness.
 */
export function finishGateTemporaryRoots(root, gateId, tasks, options = {}) {
  // An unavailable table is null and is not read again.
  let table = options.processes;
  let tableRead = table !== undefined;
  const processTable = () => {
    if (!tableRead) {
      table = temporaryProcessTable(root);
      tableRead = true;
    }
    return table;
  };
  const removed = [],
    retained = [],
    blockers = [];
  let context;
  try {
    context = {
      finishingGate: { repository: resolve(root), id: gateId },
      worktrees:
        options.worktrees ??
        (existsSync(join(root, ".git")) ? parseWorktrees(root) : []),
      holders:
        options.holders ??
        readHolders(options.hostDirectory ?? hostStateRoot(), {
          worktree: root,
          includeWorktrees: true,
        }).holders,
    };
  } catch (error) {
    return {
      removed,
      retained,
      blockers: [{ path: root, reason: error.message }],
    };
  }
  const found = new Map(
    registeredTemporaryRoots(root)
      .filter(
        (row) =>
          row.owner?.gateId === gateId &&
          (options.suite === undefined || row.owner.suite === options.suite) &&
          (!options.rootPaths ||
            options.rootPaths.some((path) => within(path, row.path))),
      )
      .map((row) => [row.path, row]),
  );
  const includeDescendants = (path) => {
    // A directory a test left unlistable hides what is nested in it; the
    // root it is in stays, named as a cleanup blocker, never thrown past the
    // gate's record.
    let children;
    try {
      children = nestedTemporaryRoots(path);
    } catch (error) {
      blockers.push({ path, reason: error.message });
      return;
    }
    for (const child of children) {
      try {
        const owner = readTemporaryOwner(child);
        if (
          owner?.owner.gateId === gateId ||
          owner?.fixtureOwner?.gateId === gateId
        )
          found.set(child, { ...owner, path: child });
        includeDescendants(child);
      } catch (error) {
        // Invalid metadata still protects the tree, but cannot silently
        // qualify a passing gate that failed to clean up its own fixtures.
        blockers.push({ path: child, reason: error.message });
      }
    }
  };
  for (const row of [...found.values()])
    if (existsSync(row.path)) includeDescendants(row.path);
  const roots = [...found.values()].sort(
    (a, b) => b.path.length - a.path.length,
  );
  const endedAt = options.endedAt ?? new Date().toISOString();
  let pending = roots;
  while (pending.length) {
    const removedBefore = removed.length;
    retained.length = 0;
    for (const row of pending) {
      if (!existsSync(row.path)) continue;
      try {
        const owner = readTemporaryOwner(row.path);
        if (!owner || owner.token !== row.token) {
          retained.push({
            path: row.path,
            reason: "temporary root identity changed",
          });
          continue;
        }
        const use = blockedByUse(row.path, owner, context);
        if (use) {
          retained.push({ path: row.path, reason: use });
          continue;
        }
        // Reusable caches and independent coordination may carry this gate's
        // metrics identity without ending their lifetime at its completion.
        if (!hasGateTemporaryLifetime(owner)) {
          retained.push({
            path: row.path,
            reason: `${owner.class} retains its owning protocol`,
          });
          continue;
        }
        const containingFixture =
          owner.fixtureOwner?.gateId === gateId
            ? roots.find((row) => row.token === owner.fixtureOwner.token)
            : undefined;
        const outcome = gateOutcome(owner, containingFixture, gateId, tasks);
        const passed = outcome === "passed";
        const record = finishTemporaryRoot(row.path, outcome, endedAt);
        // Fixture scratch and coordination may be staged by a synthetic host
        // that is the still-live outer CLI. The containing test owns their use.
        // Captures keep their actual worker's independent process lifetime.
        const lifetimeOwner =
          ["session-scratch", "coordination"].includes(record.class) &&
          containingFixture
            ? (readTemporaryOwner(containingFixture.path) ?? record)
            : record;
        const alive = ownerAlive(lifetimeOwner, processTable());
        const creatorMayFinish =
          record.class !== "worker-capture" &&
          lifetimeOwner.owner.pid === process.pid;
        if (nestedTemporaryRoots(row.path).length) {
          retained.push({
            path: row.path,
            reason: "nested owned root is retained",
          });
          continue;
        }
        if (
          !passed ||
          !temporaryRetentionPassed(record) ||
          (!creatorMayFinish && alive !== false)
        ) {
          retained.push({
            path: row.path,
            reason: !passed
              ? "failed suite diagnosis window"
              : alive !== false
                ? "live or unknown owner"
                : "configured retention",
          });
          continue;
        }
        removeTemporaryRoot(row.path, record.token);
        removed.push(row.path);
      } catch (error) {
        blockers.push({ path: row.path, reason: error.message });
      }
    }
    // A fixture repository may disappear after its scratch was retained for
    // that repository's writer. Recheck only retained roots after progress;
    // independent writers, workers and retention windows still protect them.
    if (removed.length === removedBefore || !retained.length) break;
    const retainedPaths = new Set(retained.map((row) => row.path));
    pending = roots.filter((row) => retainedPaths.has(row.path));
  }
  return { removed, retained, blockers };
}
