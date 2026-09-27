import { docRelative } from "./config.mjs";
import { createHash } from "node:crypto";
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
import { runGit, parseWorktrees, readGitObjects } from "./git.mjs";
import { dropInventoriedStash } from "./stash-drop.mjs";
import { localReleaseRecords } from "./release-records.mjs";
import {
  environmentWithoutGhRepo,
  resolveGitHubPushTarget,
} from "../github-repository.mjs";
import { activeGateRuns } from "./gate-evidence.mjs";
import {
  harnessWriterView,
  harnessProcessAlive,
} from "../../packages/skeleton/dist/src/harness-host.js";
import { staleCodexEpisodeHomes } from "../../packages/skeleton/dist/src/worker-transport.js";

const digest = (value) => createHash("sha256").update(value).digest("hex");
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
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
// Lanes and caches retain the strict regular-only inventory.
export function pruneInventory(path, prefix = "", snapshotRoot) {
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
  const result = spawnSync(
    "git",
    ["log", "-g", "--format=%H%x00%gs", "refs/stash", "--"],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    if (
      spawnSync("git", ["rev-parse", "--verify", "--quiet", "refs/stash"], {
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

function stashInventory(root, stash) {
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
  for (let offset = 0; offset < objects.length; offset += 32)
    for (const [object, bytes] of readGitObjects(
      root,
      objects.slice(offset, offset + 32),
      "blob",
    ))
      blobs.set(object, { bytes: bytes.length, sha256: digest(bytes) });
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

// What the judgments read. The plan makes one context; the pre-delete check
// makes a fresh one for its single candidate and shares only the plan's
// publication observation. The global reads stay eager, as in the plan before
// WO-171, so an unreadable one stops the plan or the apply instead of being
// skipped; only the snapshot pins, which never throw, wait for a snapshot.
function pruneContext(root, options, publication) {
  const current =
    options.sessionId ??
    process.env.CODEX_THREAD_ID ??
    process.env.CLAUDE_CODE_SESSION_ID ??
    process.env.CLAUDE_SESSION_ID;
  const directory = safeChild(
    root,
    docRelative(root, "control", "local/harness"),
  );
  const worktrees = parseWorktrees(root);
  let pins;
  return {
    root,
    options,
    directory,
    currentKey: current ? digest(current) : null,
    worktrees,
    registered: (order) =>
      worktrees.some(
        (tree) => tree.branch === `refs/heads/${order.toLowerCase()}`,
      ),
    writer: harnessWriterView(root),
    writerEvents: lines(join(directory, "writer-events.jsonl")),
    gateLive: worktrees.some(
      (tree) =>
        existsSync(tree.worktree) && activeGateRuns(tree.worktree).length > 0,
    ),
    pins: () => (pins ??= installedPins(worktrees)),
    stashBackend: runGit(root, ["rev-parse", "--show-ref-format"]),
    releaseOf: publication ?? publicationObservation(root, options),
  };
}

function assess(kind, path, label, reason, extra = {}) {
  if (reason) return { retained: { kind, path: label, reason } };
  try {
    const inventory = pruneInventory(
      path,
      "",
      kind === "snapshot" ? path : undefined,
    );
    return {
      candidate: {
        kind,
        absolute: path,
        path: label,
        bytes: inventory.reduce((sum, row) => sum + (row.bytes ?? 0), 0),
        inventory,
        ...extra,
      },
    };
  } catch (error) {
    return { retained: { kind, path: label, reason: error.message } };
  }
}

function judgeSnapshot(context, name) {
  const path = join(safeChild(context.root, ".runtime/harness"), name);
  return assess(
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
    "advisory",
    path,
    docRelative(context.root, "control", `local/harness/${name}`),
    reason,
  );
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
function usageRetention(root, order, inventory) {
  const copies = inventory.filter(
    (row) => !row.directory && usageCopy.test(row.path),
  );
  if (!copies.length) return null;
  const snapshot = spawnSync(
    "git",
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
    // WO-170 names each carried copy in `usageCopies`; a digest elsewhere in
    // the snapshot (a skipped copy, say) carries nothing (WO-171-D014).
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
  const registered = context.registered(order);
  const release = registered ? null : context.releaseOf(order);
  const judged = assess(
    "retained-lane",
    path,
    label,
    registered
      ? "order still has a registered worktree"
      : !release
        ? "published release is not established"
        : null,
    { workOrder: order, release },
  );
  const usage =
    judged.candidate && usageRetention(root, order, judged.candidate.inventory);
  return usage
    ? { retained: { kind: "retained-lane", path: label, reason: usage } }
    : judged;
}

function judgeStash(context, stash) {
  const { root, options } = context;
  const label = `${stash.selector} ${stash.subject}`;
  let reason = !stash.workOrder
    ? "unnamed or unrecognized integration stash"
    : context.stashBackend !== "files"
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
      const inventory =
        options.inventoryCache?.get(stash.stash) ??
        stashInventory(root, stash.stash);
      options.inventoryCache?.set(stash.stash, inventory);
      return {
        candidate: {
          kind: "integration-stash",
          path: label,
          stash: stash.stash,
          workOrder: stash.workOrder,
          release,
          inventory,
          bytes: inventory.reduce((sum, row) => sum + row.bytes, 0),
        },
      };
    } catch (error) {
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

/** Read-only by default. Injectable publication observation is for fixtures. */
export function planHarnessPrune(root, options = {}) {
  root = realpathSync(root);
  if (realpathSync(runGit(root, ["rev-parse", "--show-toplevel"])) !== root)
    throw new Error("harness prune requires the physical Git root");
  const context = pruneContext(root, options);
  const candidates = [],
    retained = [];
  const record = (judged) => {
    if (judged?.candidate) candidates.push(judged.candidate);
    else if (judged) retained.push(judged.retained);
  };
  const snapshots = safeChild(root, ".runtime/harness");
  if (stat(snapshots)?.isDirectory())
    for (const name of readdirSync(snapshots).sort())
      record(judgeSnapshot(context, name));
  if (stat(context.directory)?.isDirectory())
    for (const name of readdirSync(context.directory)
      .filter((name) => name.endsWith(".advisory"))
      .sort())
      record(judgeAdvisory(context, name));
  record(judgeCache(context));
  record(judgeListingCache(context));
  const lanes = safeChild(root, docRelative(root, "control", "local/retained"));
  if (stat(lanes)?.isDirectory())
    for (const order of readdirSync(lanes)
      .filter((name) => /^WO-\d{3}$/.test(name))
      .sort())
      record(judgeLane(context, order));
  for (const stash of integrationStashes(root))
    record(judgeStash(context, stash));
  return {
    root,
    candidates,
    retained,
    bytes: candidates.reduce((sum, row) => sum + row.bytes, 0),
    publication: context.releaseOf,
  };
}

// Re-judge one planned candidate from fresh local observations; only the
// plan's publication observation is shared, so no listing is repeated.
function recheckCandidate(plan, row, options) {
  const context = pruneContext(plan.root, options, plan.publication);
  let judged;
  if (row.kind === "snapshot")
    judged = judgeSnapshot(context, basename(row.absolute));
  else if (row.kind === "advisory")
    judged = judgeAdvisory(context, basename(row.absolute));
  else if (row.kind === "dead-cache") judged = judgeCache(context);
  else if (row.kind === "retained-lane")
    judged = judgeLane(context, row.workOrder);
  else {
    const entry = integrationStashes(plan.root).find(
      (entry) => entry.stash === row.stash,
    );
    judged = entry && judgeStash(context, entry);
  }
  const fresh = judged?.candidate;
  return fresh &&
    (fresh.absolute ?? fresh.stash) === (row.absolute ?? row.stash)
    ? fresh
    : undefined;
}

// One plan per apply. Each deletion follows a re-check of that candidate alone,
// and its byte proof precedes it, so a stopped apply resumes by running again.
export function pruneHarness(root, { apply = false, ...options } = {}) {
  options = { ...options, inventoryCache: new Map() };
  const plan = planHarnessPrune(root, options);
  if (apply) {
    for (const row of plan.candidates) {
      let proofCreated = false;
      let proofPath;
      const fresh = recheckCandidate(plan, row, options);
      if (
        !fresh ||
        fresh.release !== row.release ||
        fresh.workOrder !== row.workOrder ||
        JSON.stringify(fresh.inventory) !== JSON.stringify(row.inventory)
      )
        throw new Error(`Prune subject changed; retained ${row.path}`);
      if (["retained-lane", "integration-stash"].includes(row.kind)) {
        // Durable form of the existing preservation byte inventory, emitted
        // only by this operator command and kept outside the removed lane.
        const proof =
          JSON.stringify(
            {
              workOrder: row.workOrder,
              release: row.release,
              retainedControl: true,
              ...(row.stash ? { stash: row.stash } : {}),
              bytes: row.bytes,
              files: row.inventory,
            },
            null,
            2,
          ) + "\n";
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
        safeChild(plan.root, proofPath);
        mkdirSync(dirname(proofPath), { recursive: true, mode: 0o700 });
        if (!existsSync(proofPath)) {
          // Published whole by a link, so a stopped apply never leaves a
          // partial proof that every later apply would refuse.
          const partial = `${proofPath}.partial`;
          rmSync(partial, { force: true });
          writeFileSync(partial, proof, {
            flag: "wx",
            mode: 0o600,
            flush: true,
          });
          try {
            linkSync(partial, proofPath);
            proofCreated = true;
          } finally {
            rmSync(partial, { force: true });
          }
        }
        if (readFileSync(proofPath, "utf8") !== proof)
          throw new Error(
            `Preservation byte proof differs; retained ${row.path}`,
          );
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
      } else rmSync(row.absolute, { recursive: true });
    }
  }
  return {
    apply,
    bytes: plan.bytes,
    candidates: plan.candidates.map(({ absolute, inventory, ...row }) => row),
    retained: plan.retained,
    // WO-159: listed, not pruned here; the next Codex launch removes them.
    staleCodexEpisodeHomes: staleCodexEpisodeHomes(options.codexHomeRoot).map(
      (path) => basename(path),
    ),
  };
}
