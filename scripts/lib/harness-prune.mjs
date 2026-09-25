import { docRelative } from "./config.mjs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
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
import { runGit, parseWorktrees } from "./git.mjs";
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

function publishedRelease(root, order, releases) {
  const repository = resolveGitHubPushTarget(root);
  for (const release of releases
    .filter((row) => row.workOrders.includes(order))
    .reverse()) {
    const result = spawnSync(
      "gh",
      [
        "release",
        "view",
        release.name,
        "--repo",
        repository.selector,
        "--json",
        "tagName,isDraft",
      ],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 15000,
        env: environmentWithoutGhRepo(),
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    if (result.status !== 0) continue;
    try {
      const remote = JSON.parse(result.stdout);
      const remoteTag = runGit(root, [
        "ls-remote",
        "--refs",
        "origin",
        `refs/tags/${release.name}`,
      ]).split(/\s/u)[0];
      if (
        remote.tagName === release.name &&
        remote.isDraft === false &&
        remoteTag === release.object
      )
        return release.name;
    } catch {
      /* Unavailable publication evidence retains the lane. */
    }
  }
  return null;
}

/** Read-only by default. Injectable publication observation is for fixtures. */
export function planHarnessPrune(root, options = {}) {
  root = realpathSync(root);
  if (realpathSync(runGit(root, ["rev-parse", "--show-toplevel"])) !== root)
    throw new Error("harness prune requires the physical Git root");
  const worktrees = parseWorktrees(root);
  const current =
    options.sessionId ??
    process.env.CODEX_THREAD_ID ??
    process.env.CLAUDE_CODE_SESSION_ID ??
    process.env.CLAUDE_SESSION_ID;
  const currentKey = current ? digest(current) : null;
  const directory = safeChild(
    root,
    docRelative(root, "control", "local/harness"),
  );
  const writer = harnessWriterView(root);
  const protectedSessions = new Set([
    currentKey,
    ...(writer.reserved ? [writer.actorId] : []),
  ]);
  const writerEvents = lines(join(directory, "writer-events.jsonl"));
  for (const row of writerEvents)
    if (row.actorId && knownOwner(row.owner) && harnessProcessAlive(row.owner))
      protectedSessions.add(row.actorId);
  const gateLive = worktrees.some(
    (tree) =>
      existsSync(tree.worktree) && activeGateRuns(tree.worktree).length > 0,
  );
  const pinned = new Set();
  let pinsUnknown = false;
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
        pinsUnknown = true;
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
      pinsUnknown = true;
    }
  }
  const candidates = [],
    retained = [];
  const consider = (kind, path, label, reason, extra = {}) => {
    if (reason) {
      retained.push({ kind, path: label, reason });
      return;
    }
    try {
      const inventory = pruneInventory(
        path,
        "",
        kind === "snapshot" ? path : undefined,
      );
      candidates.push({
        kind,
        absolute: path,
        path: label,
        bytes: inventory.reduce((sum, row) => sum + (row.bytes ?? 0), 0),
        inventory,
        ...extra,
      });
    } catch (error) {
      retained.push({ kind, path: label, reason: error.message });
    }
  };
  const snapshots = safeChild(root, ".runtime/harness");
  if (stat(snapshots)?.isDirectory())
    for (const name of readdirSync(snapshots).sort()) {
      const path = join(snapshots, name);
      consider(
        "snapshot",
        path,
        `.runtime/harness/${name}`,
        !/^[a-f0-9]{16}$/.test(name)
          ? "unrecognized snapshot name"
          : pinsUnknown
            ? "installed manifest or target receipt unreadable"
            : pinned.has(path)
              ? "installed manifest or target receipt pins this snapshot"
              : gateLive
                ? "a registered worktree has a live gate"
                : writer.reserved &&
                    writer.actorId !== currentKey &&
                    writer.alive !== false
                  ? "another live or unknown writer may use this snapshot"
                  : null,
      );
    }
  if (stat(directory)?.isDirectory())
    for (const name of readdirSync(directory)
      .filter((name) => name.endsWith(".advisory"))
      .sort()) {
      const path = join(directory, name);
      let reason = null;
      try {
        const marker = json(path);
        if (!/^[a-f0-9]{64}$/.test(marker.sessionKey ?? ""))
          reason = "legacy marker has no session ownership";
        else if (protectedSessions.has(marker.sessionKey))
          reason = "session is current, reserved or live";
        else {
          const owner =
            marker.owner === undefined
              ? writerEvents
                  .filter(
                    (row) =>
                      row.actorId === marker.sessionKey &&
                      row.owner !== undefined,
                  )
                  .at(-1)?.owner
              : marker.owner;
          if (!knownOwner(owner)) reason = "session owner liveness is unknown";
          else if (harnessProcessAlive(owner))
            reason = "session owner is still live";
          const journal = lines(join(directory, `${marker.sessionKey}.jsonl`));
          if (
            !reason &&
            (journal.at(-1)?.event !== "Stop" ||
              !journal.some(
                (row) => row.event === "Stop" && row.finished === true,
              ))
          )
            reason = "session end is not observed";
        }
      } catch {
        reason = "legacy or unreadable marker ownership";
      }
      consider(
        "advisory",
        path,
        docRelative(root, "control", `local/harness/${name}`),
        reason,
      );
    }
  const common = realpathSync(
    resolve(root, runGit(root, ["rev-parse", "--git-common-dir"])),
  );
  const cache = safeChild(common, "dotln/suite-success");
  if (stat(cache))
    consider(
      "dead-cache",
      cache,
      "git-common/dotln/suite-success",
      gateLive ? "a registered worktree has a live gate" : null,
    );
  const lanes = safeChild(root, docRelative(root, "control", "local/retained"));
  let releases;
  if (stat(lanes)?.isDirectory())
    for (const order of readdirSync(lanes)
      .filter((name) => /^WO-\d{3}$/.test(name))
      .sort()) {
      const path = join(lanes, order);
      const registered = worktrees.some(
        (tree) => tree.branch === `refs/heads/${order.toLowerCase()}`,
      );
      let release = null;
      if (!registered) {
        try {
          release = options.publishedRelease
            ? options.publishedRelease(order)
            : publishedRelease(
                root,
                order,
                (releases ??= localReleaseRecords(root)),
              );
        } catch {
          /* An absent publication observation never permits deletion. */
        }
      }
      consider(
        "retained-lane",
        path,
        docRelative(root, "control", `local/retained/${order}`),
        registered
          ? "order still has a registered worktree"
          : !release
            ? "published release is not established"
            : null,
        { workOrder: order, release },
      );
    }
  return {
    root,
    candidates,
    retained,
    bytes: candidates.reduce((sum, row) => sum + row.bytes, 0),
  };
}

export function pruneHarness(root, { apply = false, ...options } = {}) {
  const plan = planHarnessPrune(root, options);
  if (apply) {
    for (const row of plan.candidates) {
      const fresh = planHarnessPrune(root, options).candidates.find(
        (candidate) => candidate.absolute === row.absolute,
      );
      if (
        !fresh ||
        fresh.release !== row.release ||
        JSON.stringify(fresh.inventory) !== JSON.stringify(row.inventory)
      )
        throw new Error(`Prune subject changed; retained ${row.path}`);
      if (row.kind === "retained-lane") {
        // Durable form of the existing preservation byte inventory, emitted
        // only by this operator command and kept outside the removed lane.
        const proof =
          JSON.stringify(
            {
              workOrder: row.workOrder,
              release: row.release,
              retainedControl: true,
              bytes: row.bytes,
              files: row.inventory,
            },
            null,
            2,
          ) + "\n";
        const proofPath = `${row.absolute}.bytes-${digest(proof).slice(0, 16)}.json`;
        safeChild(plan.root, proofPath);
        mkdirSync(dirname(proofPath), { recursive: true, mode: 0o700 });
        if (!existsSync(proofPath))
          writeFileSync(proofPath, proof, {
            flag: "wx",
            mode: 0o600,
            flush: true,
          });
        if (readFileSync(proofPath, "utf8") !== proof)
          throw new Error(
            `Preservation byte proof differs; retained ${row.path}`,
          );
        row.byteProof = relative(plan.root, proofPath);
      }
      rmSync(row.absolute, { recursive: true });
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
