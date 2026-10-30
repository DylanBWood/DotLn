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
  ensureTemporaryRoot,
  finishTemporaryRoot,
  hasGateTemporaryLifetime,
  ownerAlive,
  nestedTemporaryRoots,
  readRetention,
  readTemporaryOwner,
  registeredTemporaryRoots,
  removeTemporaryRoot,
  requireTemporaryDirectory,
  temporaryInventory,
  temporaryProcessTable,
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

// A ledger can outlive its path, or disappear with the closing worktree. A
// recorded root still belongs to its checkout only while the owner marker at
// its path carries the recorded token and that checkout's physical path.
const ownerBinds = (saved) => {
  const owner = readTemporaryOwner(saved.path);
  return (
    owner?.token === saved.token && owner.owner.repository === saved.repository
  );
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

export function temporaryPrunePaths(root, options = {}) {
  const scope = pruneScope(options);
  const paths = new Set(
    scope === "close"
      ? [
          ...boundTemporaryRoots(root),
          ...(options.ownedTemporaryRoots ?? []).filter(ownerBinds),
        ].map((saved) => saved.path)
      : registeredTemporaryRoots(root).map((row) => row.path),
  );
  const bases =
    scope === "close"
      ? []
      : (options.temporaryBases ??
        (scope === "all" ? [realpathSync(tmpdir())] : []));
  for (const base of bases) {
    requireTemporaryDirectory(base);
    if (!directory(base)) continue;
    for (const name of readdirSync(base)) {
      const path = join(base, name);
      if (!directory(path)) continue;
      if (name.startsWith("dotln-")) paths.add(path);
      if (name === "dotln")
        for (const session of readdirSync(path)) {
          if (!/^[a-f0-9]{64}$/.test(session)) continue;
          const scratch = join(path, session, "scratch");
          if (directory(scratch)) paths.add(scratch);
        }
    }
  }
  // Warm fixtures have one hash directory beneath their family directory.
  const warm = join(root, ".runtime/fixtures/launchpad");
  if (directory(warm))
    for (const key of readdirSync(warm))
      if (/^[a-f0-9]{64}$/.test(key) && directory(join(warm, key)))
        paths.add(join(warm, key));
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

function terminalGateResult(repository, gateId) {
  const terminal = temporaryGateResultPath(repository, gateId);
  return (
    readGateChecks(repository).findLast(
      (row) => row.temporaryGateId === gateId,
    ) ??
    (existsSync(terminal) ? JSON.parse(readFileSync(terminal, "utf8")) : null)
  );
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
    repositoryGateRuns(fixture.record.owner.repository).some(
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
    if (!existsSync(tree.worktree)) continue;
    if (context.finishingGate?.repository === resolve(tree.worktree)) continue;
    let writer;
    try {
      writer = harnessWriterView(tree.worktree);
    } catch {
      return "writer observation unavailable";
    }
    if (
      writer.reserved &&
      (!context.finishingGate || writer.alive !== false) &&
      (within(path, resolve(tree.worktree)) ||
        record?.owner.repository === resolve(tree.worktree) ||
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
    const active = repositoryGateRuns(record.owner.repository);
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

export function judgeTemporaryRoot(root, path, options = {}, context = {}) {
  const label = relative(root, path).startsWith("..")
    ? path
    : relative(root, path);
  let record;
  let kind = "temporary-root";
  const retain = (reason, extra = {}) => ({
    retained: { kind, path: label, reason, ...extra },
  });
  try {
    requireTemporaryDirectory(path);
    if (!directory(path)) return null;
    record = readTemporaryOwner(path);
    const descendants = nestedTemporaryRoots(path);
    const inventory = [];
    for (const child of descendants) {
      const childJudgment = judgeTemporaryRoot(root, child, options, context);
      if (!childJudgment?.candidate)
        return retain(
          `nested owned root retained: ${relative(path, child)} (${childJudgment?.retained?.reason ?? "ownership unavailable"})`,
        );
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
    if (record?.class === "session-scratch") kind = "session-scratch";
    const fixture = containingFixtureRecord(path, record);
    const use = blockedByUse(path, record, context, fixture);
    if (use) return retain(use);
    const table = context.processes ?? temporaryProcessTable(root);
    const now = options.now ?? Date.now();
    if (!record) {
      kind = "legacy-backfill";
      if (!legacyRootName(basename(path)))
        return retain(
          "unmarked root has no recognized disposable prefix and suffix",
        );
      const retention = readRetention(root);
      const windows = Object.entries(retention)
        .filter(([key]) => key !== "coordination")
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
      return {
        candidate: {
          kind,
          path: label,
          absolute: path,
          class: "legacy-backfill",
          ownerAlive: false,
          ageMs: now - info.mtimeMs,
          bytes: temporaryInventory(path).bytes,
          device: info.dev,
          inode: info.ino,
          inventory,
        },
      };
    }
    const fixtureTerminal = fixture
      ? terminalGateResult(
          fixture.record.owner.repository,
          fixture.record.owner.gateId,
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
        : terminalGateResult(lifetime.owner.repository, lifetime.owner.gateId);
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
    return {
      candidate: {
        kind,
        path: label,
        absolute: path,
        ...detail,
        token: record.token,
        device: record.device,
        inode: record.inode,
        bytes: temporaryInventory(path).bytes,
        inventory,
      },
    };
  } catch (error) {
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

export function applyTemporaryCandidate(root, row) {
  const inventory = [];
  const inspect = (path) => {
    for (const child of nestedTemporaryRoots(path)) {
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
  if (row.kind === "legacy-backfill") {
    const info = lstatSync(row.absolute);
    if (info.dev !== row.device || info.ino !== row.inode)
      throw new Error("Legacy root identity changed; retained");
    ensureTemporaryRoot(row.absolute, {
      class: "gate-fixture",
      repository: root,
      adoptExisting: true,
    });
  }
  return removeTemporaryRoot(row.absolute, row.token);
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
      };
      item[disposition]++;
      if (disposition === "candidates") item.bytes += row.bytes ?? 0;
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
 */
export function finishGateTemporaryRoots(root, gateId, tasks, options = {}) {
  const table = options.processes ?? temporaryProcessTable(root);
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
          (!options.rootPaths ||
            options.rootPaths.some((path) => within(path, row.path))),
      )
      .map((row) => [row.path, row]),
  );
  const includeDescendants = (path) => {
    for (const child of nestedTemporaryRoots(path)) {
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
        const alive = ownerAlive(lifetimeOwner, table);
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
