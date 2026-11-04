import { json as prettyJson, sha256Hex as digest } from "./helpers.mjs";
import { readJsonFile } from "./paths.mjs";
import { docRelative } from "./config.mjs";

import { spawnSync } from "node:child_process";
import {
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  realpathSync,
  rmSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { runGit, parseWorktrees, readGitObjects, spawnGit } from "./git.mjs";
import { dropInventoriedStash } from "./stash-drop.mjs";
import { localReleaseRecords } from "./release-records.mjs";
import {
  environmentWithoutGhRepo,
  resolveGitHubPushTarget,
} from "./github-repository.mjs";
import { activeGateRuns, readGateChecks } from "./gate-evidence.mjs";
import {
  harnessWriterView,
  harnessProcessAlive,
} from "../../packages/skeleton/dist/src/harness-host.js";
import { staleCodexEpisodeHomes } from "../../packages/skeleton/dist/src/worker-transport.js";
import {
  hostStateRoot,
  readHostSnapshot,
  registerProcess,
  recordedHostLaneCapacity,
  withHostLock,
} from "./host-resources.mjs";
import { readHolders } from "./host-lanes.mjs";
import {
  pruneBudget,
  pruneScope,
  PRUNE_BUDGET,
  listTemporaryRoots,
  judgeTemporaryRoot,
  applyTemporaryCandidate,
  pruneCensus,
  observeTemporaryOwnerEnd,
} from "./temporary-prune.mjs";
import {
  nestedTemporaryRoots,
  prepareTemporaryRemoval,
  removeTree,
  RESTRICTED_ENTRY,
  restoreTemporaryRepairs,
  retireTemporaryLedger,
  temporaryRemovalAside,
  TEMPORARY_OWNER_FILE,
} from "./temporary-roots.mjs";

const json = (path) => readJsonFile(path, { rawErrors: true });
const lines = (path) =>
  existsSync(path)
    ? readFileSync(path, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(JSON.parse)
    : [];
const stat = (path) => lstatSync(path, { throwIfNoEntry: false });
const knownOwner = (owner) =>
  owner &&
  Number.isSafeInteger(owner.pid) &&
  owner.pid > 1 &&
  ["CLAUDE_PID", "ancestor", "parent"].includes(owner.source) &&
  (owner.startedAt === undefined ||
    (typeof owner.startedAt === "string" && owner.startedAt.length > 0));

// Reuse the preservation inventory's regular-file byte proof. Snapshot package
// links may record their own relative target bytes, but are never traversed.
// Lanes and caches retain the strict regular-only inventory. A prune's budget
// is checked before each entry, so a large lane cannot hold it past its time.
export function pruneInventory(path, prefix = "", snapshotRoot, budget) {
  budget?.(path);
  const info = stat(path);
  if (info?.isSymbolicLink() && prefix && snapshotRoot) {
    const target = readlinkSync(path);
    if (
      isAbsolute(target) ||
      !resolve(dirname(path), target).startsWith(`${snapshotRoot}${sep}`)
    )
      throw new Error("snapshot symlink target is not contained and relative");
    return [
      {
        path: prefix,
        symlink: target,
        bytes: Buffer.byteLength(target),
        mode: info.mode & 0o777,
        sha256: digest(target),
      },
    ];
  }
  if (!info || info.isSymbolicLink() || (!info.isDirectory() && !info.isFile()))
    throw new Error("unowned or non-regular material");
  if (info.isFile())
    return [
      {
        path: prefix || ".",
        bytes: info.size,
        mode: info.mode & 0o777,
        sha256: digest(readFileSync(path)),
      },
    ];
  if (existsSync(join(path, ".git")))
    throw new Error("nested repository retained");
  return [
    { path: prefix || ".", directory: true, mode: info.mode & 0o777 },
    ...readdirSync(path)
      .sort()
      .flatMap((name) =>
        pruneInventory(
          join(path, name),
          prefix ? `${prefix}/${name}` : name,
          snapshotRoot,
          budget,
        ),
      ),
  ];
}

function safeChild(root, path) {
  const absolute = resolve(root, path);
  if (!absolute.startsWith(`${root}${sep}`))
    throw new Error("prune path outside its root");
  let current = root;
  for (const part of relative(root, absolute).split(sep)) {
    current = join(current, part);
    if (stat(current)?.isSymbolicLink())
      throw new Error("prune path traverses a symlink");
  }
  return absolute;
}

// A listing at its limit may be truncated; a release missing from it retains.
const RELEASE_LISTING_LIMIT = 10000;

function publicationListings(root) {
  const repository = resolveGitHubPushTarget(root);
  const result = spawnSync(
    "gh",
    [
      "release",
      "list",
      "--repo",
      repository.selector,
      "--json",
      "tagName,isDraft",
      "--limit",
      String(RELEASE_LISTING_LIMIT),
    ],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 60000,
      maxBuffer: 16 * 1024 * 1024,
      env: environmentWithoutGhRepo(),
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  if (result.status !== 0) throw new Error("release listing unavailable");
  const published = new Set(
    JSON.parse(result.stdout)
      .filter(
        (row) => row?.isDraft === false && typeof row.tagName === "string",
      )
      .map((row) => row.tagName),
  );
  const tags = new Map(
    runGit(root, ["ls-remote", "--refs", "--tags", "origin"])
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [object, ref] = line.split("\t");
        return [ref.slice("refs/tags/".length), object];
      }),
  );
  return { published, tags, releases: localReleaseRecords(root) };
}

/** Publication is observed once per plan: one release listing and one remote
 * tag listing, joined to the local release records and kept per order. The
 * injectable observation is for fixtures and is likewise asked once per order.
 * Unavailable publication evidence retains every lane and stash. */
function publicationObservation(root, options) {
  const observed = new Map();
  let listings;
  return (order) => {
    if (!observed.has(order)) {
      let release = null;
      try {
        if (options.publishedRelease)
          release = options.publishedRelease(order) ?? null;
        else {
          // One attempt per plan; a failed listing is not retried per order.
          if (listings === undefined) {
            listings = null;
            listings = publicationListings(root);
          }
          release =
            listings?.releases
              .filter((row) => row.workOrders.includes(order))
              .reverse()
              .find(
                (row) =>
                  listings.published.has(row.name) &&
                  listings.tags.get(row.name) === row.object,
              )?.name ?? null;
        }
      } catch {
        /* An absent publication observation never permits deletion. */
      }
      observed.set(order, release);
    }
    return observed.get(order);
  };
}

function integrationStashes(root) {
  const result = spawnGit(
    ["log", "-g", "--format=%H%x00%gs", "refs/stash", "--"],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    if (
      spawnGit(["rev-parse", "--verify", "--quiet", "refs/stash"], {
        cwd: root,
      }).status !== 0
    )
      return [];
    throw new Error("stash inventory unavailable");
  }
  return result.stdout
    .trimEnd()
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      const [stash, subject] = line.split("\0");
      return {
        stash,
        subject,
        selector: `stash@{${index}}`,
        workOrder: subject.match(
          /^On [^:]+: (WO-\d{3}) integrate \d{4}-\d{2}-\d{2}$/u,
        )?.[1],
      };
    });
}

// A stash's byte inventory: every blob of its worktree, index and untracked
// trees, hashed. A stash can hold a whole worktree, so a bounded prune's budget
// is asked before each tree is listed and before each batch of objects is
// read; a spent one throws with the stash's label.
function stashInventory(root, stash, budget, label = stash) {
  budget?.(label);
  const parents = runGit(root, ["show", "-s", "--format=%P", stash]).split(" ");
  if (![2, 3].includes(parents.length))
    throw new Error("unrecognized stash parents");
  const blobs = new Map();
  const inventory = [];
  for (const [role, revision] of [
    ["worktree", stash],
    ["index", parents[1]],
    ...(parents[2] ? [["untracked", parents[2]]] : []),
  ]) {
    budget?.(label);
    const entries = runGit(root, ["ls-tree", "-r", "-z", revision])
      .split("\0")
      .filter(Boolean);
    for (const entry of entries) {
      const match = /^(\d+) blob ([a-f0-9]+)\t([\s\S]+)$/u.exec(entry);
      if (!match || !["100644", "100755", "120000"].includes(match[1]))
        throw new Error("unsupported stash entry retained");
      const [, mode, object, path] = match;
      inventory.push({ role, path, mode, object });
    }
  }
  const objects = [...new Set(inventory.map((row) => row.object))];
  for (let offset = 0; offset < objects.length; offset += 32) {
    budget?.(label);
    for (const [object, bytes] of readGitObjects(
      root,
      objects.slice(offset, offset + 32),
      "blob",
    ))
      blobs.set(object, { bytes: bytes.length, sha256: digest(bytes) });
  }
  return inventory.map((row) => ({ ...row, ...blobs.get(row.object) }));
}

function installedPins(worktrees) {
  const pinned = new Set();
  let unknown = false;
  for (const tree of worktrees) {
    for (const name of [
      ".claude/harness-manifest.json",
      ".claude/target-worker-manifest.json",
    ]) {
      const path = join(tree.worktree, name);
      if (!existsSync(path)) continue;
      try {
        safeChild(realpathSync(tree.worktree), name);
        if (!stat(path).isFile())
          throw new Error("installed manifest is not regular");
        const manifest = json(path);
        if (name === ".claude/harness-manifest.json") {
          if (
            manifest?.contractVersion !== "harness-v1" ||
            !Array.isArray(manifest.profiles) ||
            manifest.profiles.length === 0
          )
            throw new Error("installed harness manifest shape unavailable");
          for (const profile of manifest.profiles) {
            const runtime = profile?.profile?.runtime;
            if (
              !/^\.runtime\/harness\/[a-f0-9]{16}$/.test(
                runtime?.snapshot ?? "",
              ) ||
              (runtime.importRoot !== undefined &&
                (typeof runtime.importRoot !== "string" ||
                  !isAbsolute(runtime.importRoot)))
            )
              throw new Error("installed harness runtime pin unavailable");
            pinned.add(
              resolve(runtime.importRoot ?? tree.worktree, runtime.snapshot),
            );
          }
        } else {
          // Target manifests contain only their installed path/hash inventory;
          // the launchpad receipt below owns the runtime pin.
          const paths = new Set([
            "CLAUDE.local.md",
            ".claude/target-worker-manifest.json",
            ".claude/settings.json",
            ".claude/hooks/permissions.mjs",
            ".claude/hooks/presence-pretooluse.mjs",
            ".claude/hooks/concurrent-work-requires-worktrees.mjs",
            ".claude/hooks/no-attribution.mjs",
          ]);
          const files = manifest?.installed;
          if (
            !Array.isArray(files) ||
            files.length < 2 ||
            files.some(
              (file) =>
                !file ||
                Object.keys(file).sort().join() !== "hash,path" ||
                !paths.has(file.path) ||
                !/^fnv1a64:[a-f0-9]{16}$/.test(file.hash),
            ) ||
            new Set(files.map((file) => file.path)).size !== files.length ||
            files.filter((file) => file.path === name).length !== 1
          )
            throw new Error("installed target manifest shape unavailable");
        }
      } catch {
        unknown = true;
      }
    }
  }
  // Target manifests contain installed paths/hashes, not the launchpad pin.
  // A target may be a separate repository; its installation receipt lives here.
  for (const tree of worktrees) {
    if (!existsSync(tree.worktree)) continue;
    try {
      const launchpad = realpathSync(tree.worktree);
      const targets = safeChild(
        launchpad,
        docRelative(launchpad, "control", "local/harness/targets"),
      );
      if (!stat(targets)) continue;
      if (!stat(targets).isDirectory())
        throw new Error("target receipt directory unavailable");
      for (const name of readdirSync(targets)) {
        const path = safeChild(
          launchpad,
          docRelative(
            launchpad,
            "control",
            `local/harness/targets/${name}/installation.json`,
          ),
        );
        if (!stat(path)) continue; // Uninstalled target lanes may remain.
        if (!stat(path).isFile() || stat(path).isSymbolicLink())
          throw new Error("target receipt is not regular");
        const receipt = json(path);
        if (
          receipt.contract !== "target-worker-v1" ||
          !/^\.runtime\/harness\/[a-f0-9]{16}$/.test(
            receipt.runtimeSnapshot ?? "",
          )
        )
          throw new Error("target receipt pin unavailable");
        pinned.add(resolve(launchpad, receipt.runtimeSnapshot));
      }
    } catch {
      unknown = true;
    }
  }
  return { pinned, unknown };
}

const currentSessionKey = (options) => {
  const current =
    options.sessionId ??
    process.env.CODEX_THREAD_ID ??
    process.env.CLAUDE_CODE_SESSION_ID ??
    process.env.CLAUDE_SESSION_ID;
  return current ? digest(current) : null;
};

// This user's open paths, observed once per prune for the legacy rule; never
// prints command lines or file contents. A failed or truncated observation is
// null, and keeps every legacy root.
function observeOpenPaths() {
  const result = spawnSync(
    "lsof",
    ["-n", "-P", "-u", String(process.getuid?.() ?? ""), "-Fn"],
    { encoding: "utf8", timeout: 10000, maxBuffer: 32 * 1024 * 1024 },
  );
  return result.status === 0 && !result.error
    ? result.stdout
        .split("\n")
        .filter((line) => line.startsWith("n/"))
        .map((line) => line.slice(1))
    : null;
}

// What a temporary root's judgment reads, and nothing else: the worktrees and
// their live gates, the host lane holders, this session, the prune's one
// process table and open-path observation, the gate indexes the prune shares,
// and the writer views and live gates it reads, each once per context. In an
// apply the holders are the ones read under the host lane lock, fixed while
// the prune holds it; the rest the prune reads again at most once a second,
// so a writer or worktree that appears during the prune is seen within that
// time. `repair` and `chmod` say whether, and how, a walk grants the owner
// access to an entry it cannot read; `reads` counts what the prune read.
function temporaryContext(root, options) {
  const worktrees = parseWorktrees(root);
  return {
    root,
    currentKey: currentSessionKey(options),
    worktrees,
    processes: options.processes,
    openPaths: options.openPaths,
    holders:
      options.holders ??
      readHolders(options.hostDirectory ?? hostStateRoot(), {
        worktree: root,
        includeWorktrees: true,
      }).holders,
    gateLive: worktrees.some(
      (tree) =>
        existsSync(tree.worktree) && activeGateRuns(tree.worktree).length > 0,
    ),
    budget: options.budget,
    gateChecks: options.gateChecks,
    writerViews: new Map(),
    gateRuns: new Map(),
    reads: options.reads,
    repair: Boolean(options.repair),
    ...(options.chmodEntry ? { chmod: options.chmodEntry } : {}),
  };
}

// What the planned kinds' judgments read: a temporary root's context and the
// root's writer, its writer-event history, the installed snapshot pins, the
// ref backend and the publication observation. The plan makes one context;
// the pre-delete check makes a fresh one for its single candidate and shares
// only the plan's publication observation and the process table and
// open-path observation the prune read once. The global reads stay eager, as
// in the plan before WO-171, so an unreadable one stops the plan or the apply
// instead of being skipped; only the snapshot pins, which never throw, wait
// for a snapshot, and the ref backend, which only a stash judgment reads,
// waits for a stash.
function pruneContext(root, options, publication) {
  const base = temporaryContext(root, options);
  const directory = safeChild(
    root,
    docRelative(root, "control", "local/harness"),
  );
  let pins;
  let stashBackend;
  if (base.reads) base.reads.writerViews += 1;
  return {
    ...base,
    options,
    directory,
    registered: (order) =>
      base.worktrees.some(
        (tree) => tree.branch === `refs/heads/${order.toLowerCase()}`,
      ),
    writer: harnessWriterView(root),
    writerEvents: lines(join(directory, "writer-events.jsonl")),
    pins: () => (pins ??= installedPins(base.worktrees)),
    stashBackend: () =>
      (stashBackend ??= runGit(root, ["rev-parse", "--show-ref-format"])),
    releaseOf: publication ?? publicationObservation(root, options),
  };
}

// The byte proof's own counter, so a prune reports how many it read.
function byteInventory(context, path, snapshotRoot) {
  if (context?.reads) context.reads.byteInventories += 1;
  return pruneInventory(path, "", snapshotRoot, context?.budget);
}

function assess(context, kind, path, label, reason, extra = {}) {
  if (reason) return { retained: { kind, path: label, reason } };
  try {
    const inventory = byteInventory(
      context,
      path,
      kind === "snapshot" ? path : undefined,
    );
    return {
      candidate: {
        kind,
        absolute: path,
        path: label,
        proof: "inventory",
        bytes: inventory.reduce((sum, row) => sum + (row.bytes ?? 0), 0),
        inventory,
        ...extra,
      },
    };
  } catch (error) {
    return {
      retained: {
        kind,
        path: label,
        reason: error?.code === PRUNE_BUDGET ? "budget" : error.message,
        ...(error?.code === PRUNE_BUDGET ? { budget: true } : {}),
      },
    };
  }
}

function judgeSnapshot(context, name) {
  const path = join(safeChild(context.root, ".runtime/harness"), name);
  return assess(
    context,
    "snapshot",
    path,
    `.runtime/harness/${name}`,
    !/^[a-f0-9]{16}$/.test(name)
      ? "unrecognized snapshot name"
      : context.pins().unknown
        ? "installed manifest or target receipt unreadable"
        : context.pins().pinned.has(path)
          ? "installed manifest or target receipt pins this snapshot"
          : context.gateLive
            ? "a registered worktree has a live gate"
            : context.writer.reserved &&
                context.writer.actorId !== context.currentKey &&
                context.writer.alive !== false
              ? "another live or unknown writer may use this snapshot"
              : null,
  );
}

// Current, reserved, or held by a live owner in the writer history.
const sessionProtected = (context, key) =>
  key === context.currentKey ||
  (context.writer.reserved && context.writer.actorId === key) ||
  context.writerEvents.some(
    (row) =>
      row.actorId === key &&
      knownOwner(row.owner) &&
      harnessProcessAlive(row.owner),
  );

function judgeAdvisory(context, name) {
  const path = join(context.directory, name);
  const { writerEvents } = context;
  let reason = null;
  try {
    const marker = json(path);
    if (!/^[a-f0-9]{64}$/.test(marker.sessionKey ?? ""))
      reason = "legacy marker has no session ownership";
    else if (sessionProtected(context, marker.sessionKey))
      reason = "session is current, reserved or live";
    else {
      const owner =
        marker.owner === undefined
          ? writerEvents
              .filter(
                (row) =>
                  row.actorId === marker.sessionKey && row.owner !== undefined,
              )
              .at(-1)?.owner
          : marker.owner;
      if (!knownOwner(owner)) reason = "session owner liveness is unknown";
      else if (harnessProcessAlive(owner))
        reason = "session owner is still live";
      const journal = lines(
        join(context.directory, `${marker.sessionKey}.jsonl`),
      );
      if (
        !reason &&
        (journal.at(-1)?.event !== "Stop" ||
          !journal.some((row) => row.event === "Stop" && row.finished === true))
      )
        reason = "session end is not observed";
    }
  } catch {
    reason = "legacy or unreadable marker ownership";
  }
  return assess(
    context,
    "advisory",
    path,
    docRelative(context.root, "control", `local/harness/${name}`),
    reason,
  );
}

function judgeShellClaim(context, name) {
  const path = join(context.directory, name);
  const prepared = /^[a-f0-9]{64}\.shell-claim\.prepare-([a-f0-9]{32})$/u.exec(
    name,
  );
  let reason = null,
    ownerFile;
  try {
    const info = stat(path);
    if (!info?.isDirectory() || info.isSymbolicLink())
      throw new Error("claim is not a regular directory");
    const names = readdirSync(path);
    if (
      names.length !== 1 ||
      !/^claim-[a-f0-9]{32}\.json$/u.test(names[0]) ||
      (prepared && names[0] !== `claim-${prepared[1]}.json`)
    )
      throw new Error("claim owner is missing or ambiguous");
    ownerFile = names[0];
    const ownerPath = join(path, ownerFile);
    if (!stat(ownerPath)?.isFile() || stat(ownerPath).isSymbolicLink())
      throw new Error("claim owner is not a regular file");
    const owner = json(ownerPath);
    if (
      !Number.isSafeInteger(owner?.pid) ||
      owner.pid <= 1 ||
      (owner.startedAt !== undefined &&
        (typeof owner.startedAt !== "string" || !owner.startedAt))
    )
      throw new Error("claim owner liveness is unknown");
    if (harnessProcessAlive(owner)) reason = "claim owner is still live";
  } catch {
    reason = "claim owner liveness is unknown or material is not regular";
  }
  return assess(
    context,
    "shell-claim",
    path,
    docRelative(context.root, "control", `local/harness/${name}`),
    reason,
    { ownerFile },
  );
}
// Remove only the observed owner's immutable nonce. A new holder may replace
// the slot after the pre-delete check; an absent old name leaves it untouched.
function retireShellClaim(row) {
  try {
    unlinkSync(join(row.absolute, row.ownerFile));
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  try {
    rmdirSync(row.absolute);
  } catch (error) {
    if (!["ENOENT", "ENOTEMPTY", "EEXIST"].includes(error.code)) throw error;
  }
}

function judgeCache(context) {
  const common = realpathSync(
    resolve(
      context.root,
      runGit(context.root, ["rev-parse", "--git-common-dir"]),
    ),
  );
  const cache = safeChild(common, "dotln/suite-success");
  return stat(cache)
    ? assess(
        context,
        "dead-cache",
        cache,
        "git-common/dotln/suite-success",
        context.gateLive ? "a registered worktree has a live gate" : null,
      )
    : null;
}

// `release list` keeps its per-tag records here (WO-164). Each listing
// rewrites the file to the current tags and subject teardown disposes of the
// lane, so prune names it and never removes it.
function judgeListingCache(context) {
  const path = docRelative(
    context.root,
    "control",
    "local/cache/release-list.json",
  );
  let state;
  try {
    state = stat(safeChild(context.root, path));
  } catch (error) {
    state = error;
  }
  return state
    ? {
        retained: {
          kind: "release-list-cache",
          path,
          reason:
            state instanceof Error
              ? state.message
              : "live release list cache: each listing rewrites it to the current tags, and subject teardown disposes of it",
        },
      }
    : null;
}

// A lane's usage copy may be the order's only usage record (WO-171). The
// order's committed meter snapshot (WO-170) releases the lane only when it names
// the SHA-256 of every usage copy the lane holds, so it provably carries them:
// a whole-meter snapshot such as WO-043's predates most of its lane's rows,
// and one written on main holds only main's own usage file. Worktree
// preservation names a colliding file or directory `<name>.from-WO-NNN[-n]`
// (intake-reconciliation.mjs), so either name may carry that suffix.
const preserved = String.raw`(?:\.from-WO-\d{3,}(?:-\d+)?)*`;
const usageCopy = new RegExp(
  String.raw`(?:^|/)process${preserved}/usage\.jsonl${preserved}$`,
  "u",
);
// The lane's usage copies alone, each hashed, found by listing its
// directories: what the usage judgment needs, before any other byte is read.
// Links are not followed; the lane's full inventory refuses them later.
function laneUsageCopies(path, budget, prefix = "") {
  budget?.(path);
  return readdirSync(path, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = join(path, entry.name);
      if (entry.isSymbolicLink()) return [];
      if (entry.isDirectory())
        return laneUsageCopies(absolute, budget, relativePath);
      if (!entry.isFile() || !usageCopy.test(relativePath)) return [];
      // The budget is asked before each copy is read, as before each listing.
      budget?.(absolute);
      return [{ path: relativePath, sha256: digest(readFileSync(absolute)) }];
    });
}

function usageRetention(root, order, copies) {
  if (!copies.length) return null;
  const snapshot = spawnGit(
    [
      "-C",
      root,
      "cat-file",
      "blob",
      `HEAD:${docRelative(root, "evidence", order, "meta.json")}`,
    ],
    {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    },
  );
  if (snapshot.status !== 0) return "usage has no committed snapshot";
  try {
    // The snapshot names each carried copy in `usageCopies` (WO-170); a digest
    // elsewhere in it (a skipped copy, say) carries nothing (WO-171-D014).
    const carried = JSON.parse(snapshot.stdout)?.usageCopies;
    if (
      Array.isArray(carried) &&
      copies.every((copy) => carried.some((row) => row?.sha256 === copy.sha256))
    )
      return null;
  } catch {
    /* A snapshot that is not JSON carries nothing. */
  }
  return "usage copy is not in the committed snapshot";
}

function judgeLane(context, order) {
  const { root } = context;
  const path = join(
    safeChild(root, docRelative(root, "control", "local/retained")),
    order,
  );
  const label = docRelative(root, "control", `local/retained/${order}`);
  if (context.options.preserveOrders?.includes(order))
    return {
      retained: {
        kind: "retained-lane",
        path: label,
        reason: "active close preserves its own receipt",
      },
    };
  const registered = context.registered(order);
  const release = registered ? null : context.releaseOf(order);
  const retain = (reason, extra = {}) => ({
    retained: { kind: "retained-lane", path: label, reason, ...extra },
  });
  if (registered) return retain("order still has a registered worktree");
  if (!release) return retain("published release is not established");
  // An owned root inside the lane, such as the closed order's journals, keeps
  // its own class and window; the lane waits until that root is gone. The
  // lane's directories are listed to find one, and the usage copies alone are
  // hashed; every byte is read only for a lane this prune will delete.
  // A lane that is not a plain directory is refused by its inventory below.
  let reason;
  if (stat(path)?.isDirectory())
    try {
      const owned = stat(join(path, TEMPORARY_OWNER_FILE))
        ? path
        : nestedTemporaryRoots(path, { budget: context.budget })[0];
      reason = owned
        ? `nested owned root retained: ${relative(path, owned) || "."}`
        : usageRetention(root, order, laneUsageCopies(path, context.budget));
    } catch (error) {
      if (error?.code === PRUNE_BUDGET)
        return retain("budget", { budget: true });
      reason = error.message;
    }
  if (reason) return retain(reason);
  return assess(context, "retained-lane", path, label, null, {
    workOrder: order,
    release,
  });
}

function judgeStash(context, stash) {
  const { root, options } = context;
  const label = `${stash.selector} ${stash.subject}`;
  let reason = !stash.workOrder
    ? "unnamed or unrecognized integration stash"
    : context.stashBackend() !== "files"
      ? "unsupported Git ref backend"
      : null;
  if (!reason && context.registered(stash.workOrder))
    reason = "order still has a registered worktree";
  if (!reason && context.gateLive)
    reason = "a registered worktree has a live gate";
  if (!reason)
    for (const tree of context.worktrees) {
      const receipt = join(
        tree.worktree,
        docRelative(tree.worktree, "control", "local/integration.json"),
      );
      if (existsSync(receipt)) {
        try {
          const pending = json(receipt);
          if (
            !pending.complete &&
            (pending.stash === stash.stash ||
              pending.workOrder === stash.workOrder)
          )
            reason = "pending integration retains this stash";
        } catch {
          reason = "integration ownership unavailable";
        }
      }
    }
  let release = null;
  if (!reason) {
    release = context.releaseOf(stash.workOrder);
    if (!release) reason = "published release is not established";
  }
  if (!reason) {
    try {
      let inventory = options.inventoryCache?.get(stash.stash);
      if (!inventory) {
        if (context.reads) context.reads.byteInventories += 1;
        inventory = stashInventory(root, stash.stash, context.budget, label);
      }
      options.inventoryCache?.set(stash.stash, inventory);
      return {
        candidate: {
          kind: "integration-stash",
          path: label,
          proof: "inventory",
          stash: stash.stash,
          workOrder: stash.workOrder,
          release,
          inventory,
          bytes: inventory.reduce((sum, row) => sum + row.bytes, 0),
        },
      };
    } catch (error) {
      // A budget spent inside the inventory keeps the stash as `budget`, so
      // the plan stops there and the stash counts as remaining.
      if (error?.code === PRUNE_BUDGET)
        return {
          retained: {
            kind: "integration-stash",
            path: label,
            stash: stash.stash,
            reason: "budget",
            budget: true,
          },
        };
      reason = error.message;
    }
  }
  return {
    retained: {
      kind: "integration-stash",
      path: label,
      stash: stash.stash,
      reason,
    },
  };
}

// How long since the prune began, for where it stopped.
const elapsedMs = (options) =>
  Math.round(performance.now() - (options.startedAt ?? performance.now()));

/** Read-only. Judges the snapshots, advisories, claims, caches, lanes and
 * stashes, which are few; the prune judges the temporary roots itself, one at
 * a time (pruneUnderLock). The prune's budget is asked before each item and
 * inside its walks and byte inventories: an item it cuts short is kept as
 * `budget` and the judging stops there, and every item after it is named as
 * unjudged. `listOnly` judges nothing and names every item as unjudged, for a
 * prune whose temporary roots already spent its budget. Injectable
 * publication observation is for fixtures. */
function planHarnessPrune(root, options) {
  const closeScope = pruneScope(options) === "close";
  const candidates = [],
    retained = [],
    unjudged = [];
  let stoppedAt = null;
  // Read only once there is an item to judge.
  let context;
  const judge = (label, judgment) => {
    if (!stoppedAt && !options.listOnly && options.budget?.spent())
      stoppedAt = { step: "plan", path: label, afterMs: elapsedMs(options) };
    if (stoppedAt || options.listOnly) {
      unjudged.push(label);
      return;
    }
    context ??= pruneContext(root, options);
    const judged = judgment(context);
    if (judged?.candidate) candidates.push(judged.candidate);
    else if (judged) {
      retained.push(judged.retained);
      if (judged.retained.budget)
        stoppedAt = { step: "plan", path: label, afterMs: elapsedMs(options) };
    }
  };
  const harness = docRelative(root, "control", "local/harness");
  const snapshots = safeChild(root, ".runtime/harness");
  if (!closeScope && stat(snapshots)?.isDirectory())
    for (const name of readdirSync(snapshots).sort())
      judge(`.runtime/harness/${name}`, (context) =>
        judgeSnapshot(context, name),
      );
  const directory = safeChild(root, harness);
  const names =
    !closeScope && stat(directory)?.isDirectory()
      ? readdirSync(directory).sort()
      : [];
  for (const name of names.filter((name) => name.endsWith(".advisory")))
    judge(`${harness}/${name}`, (context) => judgeAdvisory(context, name));
  for (const name of names.filter((name) =>
    /^[a-f0-9]{64}\.shell-claim(?:\.prepare-[a-f0-9]{32})?$/u.test(name),
  ))
    judge(`${harness}/${name}`, (context) => judgeShellClaim(context, name));
  // Whether the caches exist at all is unknown until they are judged, so a
  // judging already stopped, or a budget already spent, does not count them.
  if (
    !closeScope &&
    !stoppedAt &&
    !options.listOnly &&
    !options.budget?.spent()
  ) {
    judge("git-common/dotln/suite-success", (context) => judgeCache(context));
    judge("release-list-cache", (context) => judgeListingCache(context));
  }
  // Other orders' lanes are not the closing order's; plan start judges them.
  const lanes = safeChild(root, docRelative(root, "control", "local/retained"));
  if (!closeScope && stat(lanes)?.isDirectory())
    for (const order of readdirSync(lanes)
      .filter((name) => /^WO-\d{3}$/.test(name))
      .sort())
      judge(
        docRelative(root, "control", `local/retained/${order}`),
        (context) => judgeLane(context, order),
      );
  for (const stash of integrationStashes(root))
    if (!closeScope || options.preserveOrders?.includes(stash.workOrder))
      judge(`${stash.selector} ${stash.subject}`, (context) =>
        judgeStash(context, stash),
      );
  return {
    root,
    candidates,
    retained,
    unjudged,
    stoppedAt,
    publication: context?.releaseOf,
  };
}

// Re-judge one planned candidate from fresh local observations; only the
// plan's publication observation and the prune's process table and open-path
// observation are shared, so no listing is repeated. A spent budget comes
// back as such, so the apply stops there instead of calling the subject
// changed.
function recheckCandidate(plan, row, options) {
  const context = pruneContext(plan.root, options, plan.publication);
  let judged;
  if (row.kind === "snapshot")
    judged = judgeSnapshot(context, basename(row.absolute));
  else if (row.kind === "advisory")
    judged = judgeAdvisory(context, basename(row.absolute));
  else if (row.kind === "dead-cache") judged = judgeCache(context);
  else if (row.kind === "shell-claim")
    judged = judgeShellClaim(context, basename(row.absolute));
  else if (row.kind === "retained-lane")
    judged = judgeLane(context, row.workOrder);
  else {
    const entry = integrationStashes(plan.root).find(
      (entry) => entry.stash === row.stash,
    );
    judged = entry && judgeStash(context, entry);
  }
  if (judged?.retained?.budget) return { budget: true };
  const fresh = judged?.candidate;
  return {
    fresh:
      fresh && (fresh.absolute ?? fresh.stash) === (row.absolute ?? row.stash)
        ? fresh
        : undefined,
  };
}

// Durable form of the existing preservation byte inventory, emitted only by
// this operator command and kept beside what it proves, outside it. Published
// whole by a link, so a stopped apply never leaves a partial proof that every
// later apply would refuse; an identical proof already there is the same
// proof. Returns whether this call created it.
function publishByteProof(root, proofPath, proof, label) {
  safeChild(root, proofPath);
  mkdirSync(dirname(proofPath), { recursive: true, mode: 0o700 });
  let created = false;
  if (!existsSync(proofPath)) {
    const partial = `${proofPath}.partial`;
    rmSync(partial, { force: true });
    writeFileSync(partial, proof, {
      flag: "wx",
      mode: 0o600,
      flush: true,
    });
    try {
      linkSync(partial, proofPath);
      created = true;
    } finally {
      rmSync(partial, { force: true });
    }
  }
  if (readFileSync(proofPath, "utf8") !== proof)
    throw new Error(`Preservation byte proof differs; retained ${label}`);
  // A stop between the link and the partial's removal leaves the partial
  // beside a whole proof; once the proof matches it is residue.
  const leftover = `${proofPath}.partial`;
  if (stat(leftover)?.isFile()) rmSync(leftover);
  return created;
}

// What one removal is given: the budget when the prune is bounded, so an
// unbounded removal deletes each tree with one recursive rmSync, and a
// fixture's replacement for the permission grant.
const removalOptions = (budget, options) => ({
  ...(budget?.bounded ? { budget } : {}),
  ...(options.chmodEntry ? { chmod: options.chmodEntry } : {}),
});

// A planned snapshot, advisory, claim, cache, lane or stash: re-checked alone,
// its byte proof published first where its kind keeps one, then removed. A
// bounded prune's budget is asked before each entry of the re-check, of the
// permission walk and of the deletion; a spent budget stops the apply there.
// The tree it stopped in stays partly deleted at its path, and the next prune
// judges what remains: a lane's first byte proof, of every file, stays beside
// it and the finishing prune publishes a second for the files left, and a
// partial snapshot that an install selects again before then is refused with
// its remedy (preserveHarnessRuntime).
function applyPlannedCandidate(plan, row, options) {
  const { fresh, budget } = recheckCandidate(plan, row, options);
  if (budget)
    throw Object.assign(new Error(`prune budget spent at ${row.path}`), {
      code: PRUNE_BUDGET,
      path: row.path,
    });
  if (
    !fresh ||
    fresh.release !== row.release ||
    fresh.workOrder !== row.workOrder ||
    JSON.stringify(fresh.inventory) !== JSON.stringify(row.inventory)
  )
    throw new Error(`Prune subject changed; retained ${row.path}`);
  let proofCreated = false;
  let proofPath;
  if (["retained-lane", "integration-stash"].includes(row.kind)) {
    const proof = prettyJson({
      workOrder: row.workOrder,
      release: row.release,
      retainedControl: true,
      ...(row.stash ? { stash: row.stash } : {}),
      bytes: row.bytes,
      files: row.inventory,
    });
    const proofBase =
      row.kind === "integration-stash"
        ? join(
            plan.root,
            docRelative(
              plan.root,
              "control",
              `local/retained/integration-stashes/${row.stash}`,
            ),
          )
        : row.absolute;
    proofPath = `${proofBase}.bytes-${digest(proof).slice(0, 16)}.json`;
    proofCreated = publishByteProof(plan.root, proofPath, proof, row.path);
    row.byteProof = relative(plan.root, proofPath);
  }
  if (row.kind === "integration-stash") {
    let recoveryPath;
    try {
      const entries = integrationStashes(plan.root).filter(
        (entry) =>
          entry.stash === row.stash && entry.workOrder === row.workOrder,
      );
      if (entries.length !== 1)
        throw new Error(`Stash identity changed; retained ${row.path}`);
      recoveryPath = safeChild(plan.root, `${row.byteProof}.recovery.json`);
      dropInventoriedStash(
        plan.root,
        row.stash,
        entries[0].subject,
        recoveryPath,
      );
    } catch (error) {
      // A precondition refusal changed no stash. Keep prior proofs and any
      // recovery snapshot, but remove a proof created for this failed try.
      if (proofCreated && (!recoveryPath || !existsSync(recoveryPath)))
        rmSync(proofPath);
      throw error;
    }
    row.recoveryProof = relative(plan.root, recoveryPath);
  } else if (row.kind === "shell-claim") retireShellClaim(row);
  else removeTree(row.absolute, removalOptions(options.budget, options));
}

// Code of a closed-journal root's byte proof that could not be taken: the
// root is kept by that reason and the prune goes on.
const PRUNE_PROOF = "PRUNE_PROOF";

// A closed-journal root holds a closed order's journals, the kit's evidence of
// what its sessions did; before it goes, the bytes of every file are proven,
// as a lane's are. The proof is kept beside the order's lane, outside it and
// named for the root, so it outlives the lane, which follows its journal root
// once that is gone. The removal's preparing walk runs first, granting the
// owner read on an entry that lacks it, so an unreadable journal is proven
// like any other, with the mode it had. A proof that cannot be taken or kept
// puts those grants back and keeps the root by its reason; the prune goes on.
function proveJournalBytes(root, row, context, removal) {
  const repaired = [];
  try {
    prepareTemporaryRemoval(row.absolute, { ...removal, repaired });
    const modes = new Map(
      repaired.map(({ path, mode }) => [
        relative(row.absolute, path) || ".",
        mode & 0o777,
      ]),
    );
    const files = byteInventory(context, row.absolute).map((file) =>
      modes.has(file.path) ? { ...file, mode: modes.get(file.path) } : file,
    );
    const proof = prettyJson({
      workOrder: row.workOrder ?? null,
      class: row.class,
      token: row.token,
      bytes: files.reduce((sum, file) => sum + (file.bytes ?? 0), 0),
      files,
    });
    const proofPath = `${dirname(row.absolute)}.${basename(row.absolute)}.bytes-${digest(proof).slice(0, 16)}.json`;
    publishByteProof(root, proofPath, proof, row.path);
    row.byteProof = relative(root, proofPath);
  } catch (error) {
    restoreTemporaryRepairs(repaired);
    if ([PRUNE_BUDGET, RESTRICTED_ENTRY].includes(error?.code)) throw error;
    throw Object.assign(
      new Error(`byte proof unavailable: ${error.message}`, { cause: error }),
      { code: PRUNE_PROOF },
    );
  }
}

// How long a prune judges temporary roots on one reading of their local
// observations (worktrees, live gates, writer views) before it reads them
// again; an apply's lane holders stay the ones read under the host lane lock.
const TEMPORARY_CONTEXT_MS = 1000;

// The one process table a prune reads: the host's, or a fixture's reader.
const readPruneProcesses = (options) =>
  (
    options.readProcesses ??
    (() =>
      readHostSnapshot({ footprint: false, directory: options.hostDirectory })
        .processes)
  )();

// A report row carries no absolute path, inventory, nested list or flag.
const reported = ({ absolute, inventory, nested, budget, ...row }) => row;

/** One prune, in two phases under one budget. The temporary roots, which may
 * be thousands, go first: listed, then judged one at a time, parents first,
 * and in an apply each candidate is removed as soon as it is judged, on that
 * judgment; their local observations are read again at most once a second.
 * The few snapshots, advisories, claims, caches, lanes and stashes follow
 * with what the budget leaves: planned together, each deleted after a
 * re-check of that candidate alone, with its byte proof first, so a stopped
 * apply resumes by running again. The host process table is read once and
 * serves every owner-liveness judgment of the prune.
 *
 * `budgetMs` bounds the prune: it stops between items, or inside a listing, a
 * walk, a byte inventory or a deletion, keeping an item it cut short as
 * `budget`. The listing always reads its first batch of entries and the first
 * root has the smaller of the budget and one second, so a prune whose budget
 * its fixed reads spent still lists roots and judges one. The report says what it
 * removed, how many items remain unjudged or unremoved and where it stopped;
 * running again resumes there, and `harness prune --apply`, which sets no
 * budget, finishes them. A stopped apply leaves the ledger's retirement to
 * the prune that finishes. `budgetClock` replaces the budget's clock for a
 * fixture. */
function pruneUnderLock(root, { apply = false, ...options } = {}) {
  const started = performance.now();
  root = realpathSync(root);
  if (realpathSync(runGit(root, ["rev-parse", "--show-toplevel"])) !== root)
    throw new Error("harness prune requires the physical Git root");
  const budget = pruneBudget(options.budgetMs, options.budgetClock);
  const reads = { snapshots: 0, byteInventories: 0, writerViews: 0 };
  let processes = options.processes;
  if (processes === undefined) {
    reads.snapshots += 1;
    processes = readPruneProcesses(options);
  }
  // The legacy rule's open-path observation, which only a host-wide prune
  // needs, is likewise read once.
  const openPaths =
    options.openPaths !== undefined || pruneScope(options) !== "all"
      ? options.openPaths
      : observeOpenPaths();
  options = {
    ...options,
    processes,
    openPaths,
    budget,
    reads,
    startedAt: started,
    inventoryCache: new Map(),
    gateChecks: new Map(),
  };
  const candidates = [];
  const retained = [];
  const removed = [];
  const retentionsStarted = [];
  // What the prune never judged, by label, and the listing entries it never
  // read.
  const unjudged = [];
  let unexamined = 0;
  let stoppedAt = null;
  const stopAt = (step, path) => {
    stoppedAt = {
      step,
      path,
      afterMs: Math.round(performance.now() - started),
    };
  };
  const label = (path) =>
    relative(root, path).startsWith("..") ? path : relative(root, path);
  // A candidate whose removal stopped or was refused is kept: a spent budget
  // keeps it as `budget`, anything else by its reason.
  const keep = (row, error) => {
    candidates.splice(candidates.indexOf(row), 1);
    retained.push({
      kind: row.kind,
      path: row.path,
      class: row.class,
      reason: error.code === PRUNE_BUDGET ? "budget" : error.message,
      ...(error.code === PRUNE_BUDGET ? { budget: true } : {}),
    });
  };
  let current;
  try {
    const listing = listTemporaryRoots(root, options);
    unexamined = listing.unexamined;
    if (listing.stoppedAt) stopAt("listing", label(listing.stoppedAt));
    // Parents before the roots nested in them: a parent that goes takes them
    // with it, and deleting a child first would change a legacy parent's age.
    const queue = listing.paths.sort(
      (a, b) => a.length - b.length || a.localeCompare(b),
    );
    const queued = new Set(queue);
    const taken = [];
    const inside = (path) =>
      taken.some((parent) => path.startsWith(parent + sep));
    let context;
    let contextAt = -Infinity;
    let attempted = 0;
    // The first root a stop leaves unjudged, or null when no stop ends the
    // loop: the queue grows by the roots nested in a kept parent, and those
    // are judged in turn, so the end of the queue is read when the loop ends.
    let resumeAt = null;
    for (let index = 0; index < queue.length; index += 1) {
      const path = queue[index];
      if (inside(path)) continue;
      // The first root has the progress floor, the smaller of the budget and
      // one second, so a prune whose budget was spent before it still judges,
      // and in an apply removes, one root that fits in that time.
      const check = attempted++ === 0 ? budget.withFloor() : budget;
      if (check.spent()) {
        stopAt("judgment", label(path));
        resumeAt = index;
        break;
      }
      if (performance.now() - contextAt >= TEMPORARY_CONTEXT_MS) {
        context = temporaryContext(root, { ...options, repair: apply });
        contextAt = performance.now();
      }
      context.budget = check;
      const judged = judgeTemporaryRoot(root, path, options, context);
      if (!judged) continue;
      if (judged.retained?.budget) {
        retained.push(judged.retained);
        stopAt("judgment", judged.retained.path);
        resumeAt = index + 1;
        break;
      }
      if (judged.retained) {
        const row = judged.retained;
        if (apply && judged.observation) {
          const observed = observeTemporaryOwnerEnd(
            root,
            judged.observation,
            options,
            context,
          );
          if (observed) {
            retentionsStarted.push(observed);
            row.reason = "owner death first observed; retention window started";
          }
        }
        retained.push(row);
        // A root kept for an owned root nested in it names every one it
        // found; each is judged on its own.
        for (const child of row.nested ?? [])
          if (!queued.has(child)) {
            queued.add(child);
            queue.push(child);
          }
        continue;
      }
      const row = judged.candidate;
      taken.push(row.absolute);
      candidates.push(row);
      if (!apply) continue;
      current = row;
      try {
        const removal = removalOptions(check, options);
        if (row.proof === "inventory")
          proveJournalBytes(root, row, context, removal);
        row.bytes = applyTemporaryCandidate(root, row, removal)?.bytes ?? 0;
        removed.push(row);
      } catch (error) {
        if (
          ![PRUNE_BUDGET, RESTRICTED_ENTRY, PRUNE_PROOF].includes(error?.code)
        )
          throw error;
        // The removal put the root back where its marker names it, and the
        // roots nested in it are judged on their own: a spent budget stops
        // the prune there; an entry its owner cannot make readable, or a
        // journal whose bytes cannot be proven, keeps it by that reason.
        taken.pop();
        keep(row, error);
        if (error.code === PRUNE_BUDGET) {
          stopAt("removal", row.path);
          resumeAt = index + 1;
          current = undefined;
          break;
        }
      }
      current = undefined;
    }
    // The roots the stop left, except those inside a root this prune took.
    unjudged.push(
      ...queue
        .slice(resumeAt ?? queue.length)
        .filter((path) => !inside(path))
        .map(label),
    );
    // The planned kinds, with what the budget leaves; a prune it already
    // stopped names them as unjudged without judging any.
    const plan = planHarnessPrune(root, {
      ...options,
      listOnly: stoppedAt !== null,
    });
    candidates.push(...plan.candidates);
    retained.push(...plan.retained);
    unjudged.push(...plan.unjudged);
    if (plan.stoppedAt) stoppedAt = plan.stoppedAt;
    if (apply)
      for (const row of plan.candidates) {
        if (!stoppedAt && budget.spent()) stopAt("removal", row.path);
        // A candidate the stop leaves stays one, unremoved.
        if (stoppedAt) break;
        current = row;
        try {
          applyPlannedCandidate(plan, row, options);
        } catch (error) {
          if (error?.code !== PRUNE_BUDGET) throw error;
          keep(row, error);
          stopAt("removal", row.path);
          current = undefined;
          break;
        }
        removed.push(row);
        current = undefined;
      }
    if (apply && !stoppedAt) {
      // Ledger segments retire in two readings with the prune's one table:
      // those outside any gate, and those of every gate no longer running.
      const active = new Set(activeGateRuns(root).map((row) => row.runId));
      const checks = options.gateChecks.get(root) ?? readGateChecks(root);
      const finished = new Set(
        checks
          .map((row) => row.temporaryGateId)
          .filter((id) => id && !active.has(id)),
      );
      retireTemporaryLedger(root, undefined, { table: processes });
      if (finished.size)
        retireTemporaryLedger(root, undefined, {
          table: processes,
          gateIds: finished,
        });
    }
  } catch (error) {
    // What was removed before a failure stays reported, including a root
    // whose directory is gone although its bookkeeping then failed: the
    // caller prints it beside the census of what remains. Only an observed
    // absence counts, of the root and of the place its removal moves it; a
    // path this process cannot inspect is not proof of a deletion.
    const absent = (path) => {
      try {
        return !lstatSync(path, { throwIfNoEntry: false });
      } catch {
        return false;
      }
    };
    if (
      current?.absolute &&
      absent(current.absolute) &&
      (typeof current.token !== "string" ||
        absent(temporaryRemovalAside(current.absolute, current.token)))
    )
      removed.push(current);
    error.pruneRemoved = removed.map(reported);
    throw error;
  }
  // Listed, not pruned here; the next Codex launch removes them (WO-159). A
  // listing that cannot inspect an entry is reported as unavailable; it never
  // replaces the result of a prune that already ran.
  let staleHomes = [];
  let staleHomesUnavailable;
  try {
    staleHomes = staleCodexEpisodeHomes(options.codexHomeRoot).map((path) =>
      basename(path),
    );
  } catch (error) {
    staleHomesUnavailable = error.message;
  }
  return {
    apply,
    bytes: candidates.reduce((sum, row) => sum + (row.bytes ?? 0), 0),
    // Candidates judged on their record are measured only by their removal.
    unmeasured: candidates.filter((row) => typeof row.bytes !== "number")
      .length,
    candidates: candidates.map(reported),
    removed: removed.map(reported),
    retained: retained.map(reported),
    retentionsStarted,
    census: pruneCensus(candidates, retained),
    blockers: [],
    budgetMs: budget.budgetMs,
    // Unjudged or unremoved: what a stop left unjudged or unlisted, what a
    // budget cut short, and every candidate not removed, as all of a
    // preview's are.
    remaining:
      unjudged.length +
      unexamined +
      retained.filter((row) => row.budget).length +
      candidates.length -
      removed.length,
    unexamined,
    stoppedAt,
    reads,
    staleCodexEpisodeHomes: staleHomes,
    ...(staleHomesUnavailable === undefined
      ? {}
      : { staleCodexEpisodeHomesUnavailable: staleHomesUnavailable }),
  };
}

/** Apply and host-lane admission share the same kernel lock. Inventory starts
 * only after admission, so a gate cannot change the plan halfway through.
 * A repository-scoped prune touches only that repository's registered roots;
 * fixture children use it without examining the host's other repositories.
 */
export async function pruneHarness(root, { apply = false, ...options } = {}) {
  if (!apply) return pruneUnderLock(root, { ...options, apply });
  const directory = options.hostDirectory ?? hostStateRoot();
  const scope = pruneScope(options);
  return withHostLock(directory, "lanes", async () => {
    const observation = readHolders(directory, { worktree: root });
    const holders = observation.holders.filter(
      (row) => scope === "all" || row.relation === "this-checkout",
    );
    if (holders.length)
      throw new Error(
        `Prune refused: running gate ${holders.map((row) => row.task).join(", ")} holds host lanes; retry after they are released`,
      );
    const lease = registerProcess(
      "lanes",
      process.pid,
      {
        task: "harness prune",
        worktree: root,
        slots: recordedHostLaneCapacity(directory),
        prune: true,
      },
      directory,
    );
    try {
      await options.beforeApply?.();
      return pruneUnderLock(root, {
        ...options,
        scope,
        holders: observation.holders,
        apply,
      });
    } finally {
      lease.release();
    }
  });
}
