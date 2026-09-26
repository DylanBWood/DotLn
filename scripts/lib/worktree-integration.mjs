import { docRelative } from "./config.mjs";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { createCheckpoint } from "./checkpoint.mjs";
import { failureOf, runGit, runGitPathList, shellQuote } from "./git.mjs";
import { containedRegularFile } from "./paths.mjs";
import { readControl } from "./control-store.mjs";
import { followupsPath, unionFollowups } from "./planning-followups.mjs";
import { strictVersionsIn } from "./release-records.mjs";
import { refreshControlProjection } from "../resume.mjs";

const receiptFile = (root) =>
  docRelative(root, "control", "local/integration.json");
const manifest = ".claude/harness-manifest.json";
const editionPages = (root) =>
  ["everyday-ai-user-toc.md", "software-engineer-toc.md"].map((name) =>
    docRelative(root, "publication", name),
  );
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const conflicts = (root) =>
  runGitPathList(root, ["diff", "--name-only", "--diff-filter=U", "-z"]);
// `git add -N` entries: an include-untracked stash cannot save or re-apply
// them (WO-100 D017). Porcelain v2 reports only intent-to-add as a
// worktree-side `A`; no optional lock lets the refusal path rewrite the index.
const intentToAdd = (root) =>
  runGit(root, [
    "--no-optional-locks",
    "status",
    "--porcelain=v2",
    "-z",
    "--no-renames",
    "--untracked-files=no",
  ])
    .split("\0")
    .filter((row) => row.startsWith("1 ") && row[3] === "A")
    .map((row) => row.split(" ").slice(8).join(" "));
const gitResult = (root, args) =>
  spawnSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
const blob = (root, revision, path) => {
  const result = gitResult(root, ["show", `${revision}:${path}`]);
  return result.status === 0 ? result.stdout : null;
};
const put = (root, path, text) => {
  let parent = join(root, path);
  while (!existsSync(parent)) parent = dirname(parent);
  if (
    lstatSync(parent).isSymbolicLink() ||
    !(
      realpathSync(parent) === root ||
      realpathSync(parent).startsWith(root + sep)
    )
  )
    throw new Error(`integration destination escapes its worktree: ${path}`);
  if (
    existsSync(join(root, path)) &&
    !containedRegularFile(join(root, path), root)
  )
    throw new Error(`integration destination is not a regular file: ${path}`);
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};

function unrestoredUntracked(root, stash) {
  if (gitResult(root, ["rev-parse", "--verify", `${stash}^3`]).status !== 0)
    return [];
  return runGitPathList(root, [
    "ls-tree",
    "-r",
    "--name-only",
    "-z",
    `${stash}^3`,
  ]).filter((path) => {
    const original = spawnSync(
      "git",
      ["-C", root, "show", `${stash}^3:${path}`],
      { maxBuffer: 32 * 1024 * 1024 },
    );
    try {
      const file = join(root, path);
      const actual = lstatSync(file).isSymbolicLink()
        ? Buffer.from(readlinkSync(file))
        : readFileSync(file);
      return original.status !== 0 || !actual.equals(original.stdout);
    } catch {
      return true;
    }
  });
}
const pureProjection = (root, path) =>
  [
    manifest,
    docRelative(root, "control", "current.md"),
    docRelative(root, "workOrders", "README.md"),
    docRelative(root, "lineage", "decisions-index.md"),
    ".claude/settings.json",
    ".codex/config.toml",
    ".codex/hooks.json",
  ].includes(path) ||
  /^\.(?:claude|codex)\/hooks\/[a-z0-9.-]+\.mjs$/.test(path) ||
  /^\.(?:claude|agents)\/skills\/dotln-[a-z-]+\/SKILL\.md$/.test(path) ||
  /^packages\/console\/fixtures\/expected\//.test(path);

// Re-merge mixed documents after masking only their generated fragment. The
// authored text still goes through Git's three-way merge and may conflict.
function mixedProjection(root, path) {
  const mask =
    path === "CLAUDE.md"
      ? (s) =>
          s.replace(
            /<!-- dotln-harness:start -->[\s\S]*?<!-- dotln-harness:end -->/g,
            "<!-- dotln-harness:start -->\n<!-- dotln-harness:end -->",
          )
      : editionPages(root).includes(path)
        ? (s) =>
            s.replace(
              /^Source lock:.*$/gm,
              "Source lock: `sha256:" + "0".repeat(64) + "`",
            )
        : path === "README.md"
          ? (s) =>
              s.replace(
                /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/g,
                (block) => {
                  const versions = strictVersionsIn(block);
                  return versions.length === 1
                    ? block.replace(versions[0], "v0.0.0")
                    : block;
                },
              )
          : null;
  if (!mask) return false;
  const sources = [":2", ":1", ":3"].map((stage) => blob(root, stage, path));
  if (sources.some((s) => s === null)) return false;
  const temporary = mkdtempSync(join(tmpdir(), "dotln-integrate-merge-"));
  try {
    const files = sources.map((s, i) => {
      const file = join(temporary, String(i));
      writeFileSync(file, mask(s));
      return file;
    });
    const merged = spawnSync(
      "git",
      [
        "merge-file",
        "-p",
        "-L",
        "local",
        "-L",
        "base",
        "-L",
        "upstream",
        ...files,
      ],
      { encoding: "utf8" },
    );
    if (merged.status !== 0) return false;
    let contents = merged.stdout;
    if (path === "README.md") {
      const id = runGit(root, ["branch", "--show-current"]).toUpperCase();
      const authority = readControl(root).orders.get(id)?.state.workOrderPath;
      if (!authority) return false;
      const versions = strictVersionsIn(
        readFileSync(join(root, authority), "utf8").split("\n")[0],
      );
      if (versions.length !== 1) return false;
      contents = contents.replace(
        /<!-- DOTLN-RELEASE-BEGIN -->[\s\S]*?<!-- DOTLN-RELEASE-END -->/g,
        (block) => block.replace("v0.0.0", versions[0]),
      );
    }
    put(root, path, contents);
    return true;
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

function resolveProjections(root, receipt) {
  for (const path of conflicts(root)) {
    let resolved = false;
    if (path === followupsPath(root)) {
      try {
        put(
          root,
          path,
          json(
            unionFollowups(
              JSON.parse(blob(root, ":2", path)),
              JSON.parse(blob(root, ":3", path)),
              root,
            ),
          ),
        );
        resolved = true;
      } catch (error) {
        console.log(`Authored register conflict: ${error.message}`);
      }
    } else if (pureProjection(root, path)) {
      const seed = blob(root, ":2", path) ?? blob(root, ":3", path);
      if (seed !== null) {
        put(root, path, seed);
        resolved = true;
      }
    } else resolved = mixedProjection(root, path);
    if (resolved) {
      // This clears Git's unmerged stages so stash apply can run; generation
      // below is still mandatory, and its failure leaves a pending receipt.
      runGit(root, ["add", "--", path]);
      receipt.resolved = [...new Set([...receipt.resolved, path])];
    }
  }
}

function verifyIntake(root, backup) {
  const intake = runGitPathList(root, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
    "--",
    `${docRelative(root, "intake")}/`,
  ]).filter((path) => !path.endsWith("/.DS_Store"));
  if (!intake.length) return;
  if (!backup || !existsSync(backup) || !lstatSync(backup).isFile())
    throw new Error(
      "ignored intake requires --intake-backup <named archive.zip>; use npm run backup:intake first",
    );
  const archive = realpathSync(backup);
  if (archive.startsWith(root + sep))
    throw new Error("intake backup must be outside the worktree");
  const checked = spawnSync("unzip", ["-tq", archive], { encoding: "utf8" });
  if (checked.status !== 0)
    throw new Error("intake backup archive is unreadable");
  for (const path of intake) {
    if (!containedRegularFile(join(root, path), root))
      throw new Error("intake contains a non-regular source");
    const saved = spawnSync("unzip", ["-p", archive, path], {
      maxBuffer: 64 * 1024 * 1024,
    });
    if (
      saved.status !== 0 ||
      !saved.stdout.equals(readFileSync(join(root, path)))
    )
      throw new Error(
        "intake backup does not preserve all current intake bytes",
      );
  }
}

function command(root, program, args) {
  const result = spawnSync(program, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0)
    throw new Error(
      `${program} ${args.join(" ")}: ${(result.stderr || result.stdout || result.error?.message || "failed").trim()}`,
    );
  return result.stdout;
}

function decisionStub(root, receipt) {
  const path = docRelative(
    root,
    "evidence",
    `${receipt.workOrder}/decisions.md`,
  );
  if (conflicts(root).includes(path))
    throw new Error("decisions record has an authored conflict");
  const before = existsSync(join(root, path))
    ? readFileSync(join(root, path), "utf8")
    : `# ${receipt.workOrder} decisions\n`;
  const marker = `<!-- integration ${receipt.checkpointRef} -->`;
  if (before.includes(marker)) return;
  const used = [
    ...before.matchAll(new RegExp(`${receipt.workOrder}-D(\\d{3})`, "g")),
  ].map((match) => Number(match[1]));
  const id = `${receipt.workOrder}-D${String(Math.max(0, ...used) + 1).padStart(3, "0")}`;
  const row = {
    id,
    date: receipt.date,
    dispatch: `resume: ${receipt.phase === "repairing" ? "fix" : "final review"}; worktree integrate ${receipt.workOrder}`,
    decision:
      "Draft integration record: preserve both bases and recovery material; reviewer must assess carried-forward claims and complete this record.",
    evidence: [
      receipt.checkpointRef,
      `base ${receipt.before}`,
      `upstream ${receipt.upstream}`,
    ],
    rejected: [
      {
        option: "Rewrite reviewed commits or discard the integration stash",
        reason: "Both histories and recovery material must remain available.",
      },
    ],
    reopenWhen:
      "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification.",
  };
  put(
    root,
    path,
    `${before.trimEnd()}\n\n## ${id}\n\n${marker}\n\n\`\`\`json\n${json(row)}\`\`\`\n\nIntegration date: ${receipt.date}. Original base: \`${receipt.before}\`.
Fetched main: \`${receipt.upstream}\`. Checkpoint: \`${receipt.checkpointRef}\`.
Named stash retained: ${receipt.stash ? `\`${receipt.stash}\` (${receipt.stashName})` : "none needed (clean tree)"}.
Resolved projections: ${receipt.resolved.join(", ") || "none"}.
Release preparation: ${receipt.release ?? "pending"}.
Carried-forward claims: **reviewer to complete; no acceptance judgment recorded**.
Authored conflicts observed: ${receipt.authored.join(", ") || "none"}.
Affected checks are printed by the command; results remain untested until executed.\n`,
  );
}

function regenerate(root, receipt) {
  const pending = [];
  const run = (label, fn) => {
    try {
      fn();
      console.log(`Regenerated: ${label}`);
    } catch (error) {
      pending.push(`${label}: ${error.message}`);
    }
  };
  const node = (script, ...args) =>
    command(root, process.execPath, [script, ...args]);
  run("runtime", () => command(root, "npm", ["run", "build", "--silent"]));
  if (!pending.length && existsSync(join(root, manifest)))
    run("harness bundle and manifest", () =>
      node("scripts/harness.mjs", "emit"),
    );
  run("current control projection", () => refreshControlProjection(root));
  run("release preparation", () => {
    receipt.release = node("scripts/release.mjs", "prepare", "--local").trim();
  });
  run("integration decision stub", () => decisionStub(root, receipt));
  run("decisions index, follow-up register and meta", () =>
    node("scripts/meta.mjs"),
  );
  run("work-order index", () => node("scripts/work-orders.mjs", "index"));
  run("publication locks", () => {
    const output = node("scripts/check-publication.mjs", "--print-locks");
    for (const path of editionPages(root)) {
      const name = path.split("/").at(-1);
      const hash = output
        .split("\n")
        .find((line) => line.startsWith(`LOCK ${name}: sha256:`))
        ?.split("sha256:")[1];
      if (!/^[a-f0-9]{64}$/.test(hash ?? ""))
        throw new Error(`missing lock for ${path}`);
      const before = readFileSync(join(root, path), "utf8");
      if (!/^Source lock:.*$/m.test(before))
        throw new Error(`missing lock line in ${path}`);
      put(
        root,
        path,
        before.replace(/^Source lock:.*$/m, `Source lock: \`sha256:${hash}\``),
      );
    }
  });
  // The fixture manifest is authored selection. Regenerate only its selected
  // expected cases; never repoint it to a different evidence edition.
  if (
    receipt.consoleSelected &&
    !pending.some((row) => row.startsWith("runtime:"))
  )
    run("selected console fixtures", () =>
      node("scripts/console-fixtures.mjs", "--write"),
    );
  return pending;
}

export async function integrationTestCommand(root, before) {
  try {
    const { changedMachinery } = await import("../test-runner.mjs");
    return changedMachinery(root, undefined, before).length
      ? "npm test -- --review"
      : "npm test";
  } catch {
    // An authored runner conflict cannot justify omitting machinery. --review
    // will make the ordinary selection when that source has been resolved.
    return "npm test -- --review";
  }
}

export async function integrateWorktree(root, workOrder, args = []) {
  let backup,
    continuation = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--continue" && !continuation) continuation = true;
    else if (args[i] === "--intake-backup" && !backup && args[i + 1])
      backup = resolve(root, args[++i]);
    else
      throw new Error(
        "usage: worktree integrate WO-NNN [--intake-backup <archive.zip>] [--continue]",
      );
  }
  root = realpathSync(root);
  if (
    !/^WO-\d{3}$/.test(workOrder ?? "") ||
    realpathSync(runGit(root, ["rev-parse", "--show-toplevel"])) !== root ||
    runGit(root, ["branch", "--show-current"]) !== workOrder.toLowerCase()
  )
    throw new Error("integrate requires the matching wo-NNN worktree root");
  const receiptPath = receiptFile(root);
  const file = join(root, receiptPath);
  const previousBytes = existsSync(file) ? readFileSync(file) : null;
  const previous = previousBytes
    ? JSON.parse(previousBytes.toString("utf8"))
    : null;
  if (previous && !previous.complete && !continuation)
    throw new Error(
      `integration is pending; resolve its authored conflicts, git add those paths, then run npm run worktree -- integrate ${workOrder} --continue`,
    );
  if (
    continuation &&
    (!previous || previous.complete || previous.workOrder !== workOrder)
  )
    throw new Error("no pending integration for this worktree");
  const { activeGateRuns } = await import("./gate-evidence.mjs");
  if (activeGateRuns(root).length)
    throw new Error("integration refuses during a live test gate");
  const state = readControl(root).orders.get(workOrder)?.state;
  if (!state || !["repairing", "final-review"].includes(state.phase))
    throw new Error(
      "integrate requires the selected order in repairing or final-review",
    );
  verifyIntake(root, backup ?? previous?.backup);
  if (gitResult(root, ["check-ignore", "-q", receiptPath]).status !== 0)
    throw new Error("integration receipt must be ignored by Git");
  let receipt;
  const save = () => put(root, receiptPath, json(receipt));
  const refuseIntentToAdd = () => {
    const marked = intentToAdd(root);
    if (marked.length)
      throw new Error(
        `integration refuses intent-to-add entries, which its include-untracked stash cannot preserve: ${marked.map(shellQuote).join(", ")}; stage them fully with git add -- ${marked.map(shellQuote).join(" ")}, then run npm run worktree -- integrate ${workOrder}${continuation ? " --continue" : ""} again`,
      );
  };
  // The stash stack is shared by every worktree and session, so only a new
  // entry carrying this integration's name and first parent is its own.
  const stashEntries = () =>
    gitResult(root, ["log", "-g", "--format=%H%x00%gs", "refs/stash", "--"])
      .stdout.split("\n")
      .filter(Boolean)
      .map((line) => line.split("\0"));
  const ownStash = (seen) => {
    const matches = stashEntries().filter(
      ([sha, subject]) =>
        !seen.has(sha) &&
        subject.endsWith(`: ${receipt.stashName}`) &&
        gitResult(root, [
          "rev-parse",
          "--verify",
          "--quiet",
          `${sha}^1`,
        ]).stdout.trim() === receipt.before,
    );
    if (matches.length > 1)
      throw new Error(
        "ambiguous integration stash; recovery retained for explicit inspection",
      );
    return matches[0]?.[0] ?? null;
  };
  const recovery = () =>
    `npm run worktree -- integrate ${workOrder} --continue once the tree is clean (the stash holds its content), or git stash apply ${receipt.stash} and remove ${receiptPath} to start again`;
  // Stash the work (unless a retained stash already holds it), then merge.
  // A fresh run and a --continue from stage `preserved` share this step.
  const preserveAndMerge = () => {
    const dirty = runGit(root, [
      "status",
      "--porcelain",
      "--untracked-files=all",
    ]);
    if (!dirty && !receipt.stash) {
      receipt.stash = ownStash(new Set(receipt.stashesBefore ?? []));
      if (receipt.stash) save();
    }
    if (dirty && receipt.stash)
      throw new Error(
        `the retained stash ${receipt.stash} holds this integration's work but the tree is not clean; run ${recovery()}`,
      );
    if (dirty) {
      const seen = new Set(stashEntries().map(([sha]) => sha));
      receipt.stashesBefore = [...seen];
      save();
      const stashed = gitResult(root, [
        "stash",
        "push",
        "--include-untracked",
        "-m",
        receipt.stashName,
      ]);
      const created = ownStash(seen);
      if (stashed.status !== 0) {
        if (!created) {
          // Nothing moved: a fresh run drops its pending receipt (restoring a
          // completed predecessor) so the next run proceeds; a continuation
          // keeps its receipt at `preserved`, which --continue resumes.
          if (!continuation)
            if (previousBytes) writeFileSync(file, previousBytes);
            else rmSync(file);
          throw new Error(
            `stash push failed; nothing was stashed and ${continuation ? "the pending receipt still resumes with --continue" : "no pending receipt remains"}; checkpoint ${receipt.checkpointRef} retained: ${failureOf(stashed, "git stash push failed")}`,
          );
        }
        // Git stored the stash and then failed (for example cleaning a file
        // it could not remove); nothing was merged.
        receipt.stash = created;
        save();
        throw new Error(
          `stash push stored ${created} and then failed; nothing was merged; checkpoint ${receipt.checkpointRef} retained: ${failureOf(stashed, "git stash push failed")}; run ${recovery()}`,
        );
      }
      if (!created)
        throw new Error(
          `stash push succeeded but no stash entry named ${receipt.stashName} on ${receipt.before} was found; inspect git stash list before continuing`,
        );
      receipt.stash = created;
      console.log(`Retained stash: ${receipt.stashName} (${receipt.stash})`);
    }
    receipt.stage = "merging";
    save();
    const fastForward =
      gitResult(root, [
        "merge-base",
        "--is-ancestor",
        receipt.before,
        receipt.upstream,
      ]).status === 0;
    const merged = gitResult(root, [
      "-c",
      "core.hooksPath=/dev/null",
      "merge",
      ...(fastForward ? ["--ff-only"] : ["--no-commit", "--no-ff"]),
      receipt.upstream,
    ]);
    if (merged.status !== 0 && !conflicts(root).length)
      throw new Error(
        `merge failed; checkpoint and stash retained: ${merged.stderr || merged.stdout}`,
      );
  };
  if (continuation) {
    // Stash application meets the same entry the push cannot save.
    refuseIntentToAdd();
    receipt = previous;
    // --continue is the actor's explicit resolution boundary for a collision
    // that Git cannot express as unmerged stages (untracked stash content).
    if (receipt.untrackedConflicts?.length) {
      for (const path of receipt.untrackedConflicts) {
        if (
          gitResult(root, ["diff", "--exit-code", "--", path]).status !== 0 ||
          gitResult(root, ["ls-files", "--error-unmatch", "--", path])
            .status !== 0
        )
          throw new Error(
            `stage the explicit untracked-file resolution before continuing: ${path}`,
          );
      }
      receipt.untrackedConflicts = [];
    }
    // A receipt left at `preserved` resumes at the stash and merge step.
    if (receipt.stage === "preserved") preserveAndMerge();
  } else {
    if (
      conflicts(root).length ||
      existsSync(
        resolve(root, runGit(root, ["rev-parse", "--git-path", "MERGE_HEAD"])),
      )
    )
      throw new Error("finish the existing merge before starting integration");
    refuseIntentToAdd();
    // Resolve upstream before minting recovery refs or moving any work.
    runGit(root, ["ls-remote", "--exit-code", "origin", "refs/heads/main"]);
    runGit(root, [
      "fetch",
      "--no-auto-maintenance",
      "--tags",
      "origin",
      "+refs/heads/main:refs/remotes/origin/main",
    ]);
    const before = runGit(root, ["rev-parse", "HEAD"]);
    const upstream = runGit(root, [
      "rev-parse",
      "--verify",
      "refs/remotes/origin/main^{commit}",
    ]);
    runGit(root, ["merge-base", before, upstream]);
    const date = new Date().toISOString().slice(0, 10);
    const changed = runGitPathList(root, [
      "diff",
      "--name-only",
      "-z",
      before,
      upstream,
    ]);
    const checkpoint = createCheckpoint(root, "integrate", workOrder, {
      hookless: true,
    });
    const local = runGitPathList(root, [
      "diff",
      "--name-only",
      "-z",
      before,
      checkpoint.checkpointSha,
    ]);
    receipt = {
      workOrder,
      phase: state.phase,
      preservationCommit: checkpoint.checkpointSha,
      mergeCommit: null,
      stashesBefore: stashEntries().map(([sha]) => sha),
      date,
      before,
      upstream,
      backup,
      resolved: [],
      authored: [],
      ...checkpoint,
      complete: false,
      consoleSelected: [...changed, ...local].some(
        (path) =>
          path.startsWith("packages/console/") ||
          path === "scripts/console-fixtures.mjs",
      ),
      stashName: `${workOrder} integrate ${date}`,
      stash: null,
      stage: "preserved",
    };
    console.log(`Checkpoint: ${receipt.checkpointRef}`);
    save();
    preserveAndMerge();
  }
  resolveProjections(root, receipt);
  if (receipt.stage === "merging" && conflicts(root).length === 0) {
    const mergedHead = gitResult(root, ["rev-parse", "--verify", "MERGE_HEAD"]);
    if (
      gitResult(root, ["merge-base", "--is-ancestor", receipt.upstream, "HEAD"])
        .status !== 0 &&
      mergedHead.stdout.trim() !== receipt.upstream
    )
      throw new Error(
        `recorded upstream is not integrated; complete the merge of ${receipt.upstream} before continuing; recovery is retained`,
      );
    if (mergedHead.status === 0) {
      if (
        mergedHead.stdout.trim() !== receipt.upstream ||
        runGit(root, ["rev-parse", "HEAD"]) !== receipt.before
      )
        throw new Error(
          "pending merge does not match this integration's recorded parents; recovery retained",
        );
      runGit(root, [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "commit.gpgsign=false",
        "commit",
        "--no-verify",
        "-m",
        `Merge main for ${workOrder} integration`,
      ]);
      receipt.mergeCommit = runGit(root, ["rev-parse", "HEAD"]);
      save();
    } else if (!receipt.mergeCommit) {
      const parents = runGit(root, ["show", "-s", "--format=%P", "HEAD"]).split(
        " ",
      );
      if (
        parents.length === 2 &&
        parents[0] === receipt.before &&
        parents[1] === receipt.upstream
      ) {
        receipt.mergeCommit = runGit(root, ["rev-parse", "HEAD"]);
        save();
      }
    }
    receipt.stage = "applying";
    save();
    if (receipt.stash) {
      const applied = gitResult(root, ["stash", "apply", receipt.stash]);
      receipt.untrackedConflicts = unrestoredUntracked(root, receipt.stash);
      if (
        applied.status !== 0 &&
        !conflicts(root).length &&
        !receipt.untrackedConflicts.length
      )
        throw new Error(
          `stash apply failed; retained ${receipt.stash}; inspect recovery before continuing: ${applied.stderr || applied.stdout}`,
        );
    }
    receipt.stage = "applied";
    save();
    resolveProjections(root, receipt);
  }
  if (receipt.stage === "applying")
    throw new Error(
      "interrupted stash application; inspect retained recovery before continuing",
    );
  receipt.authored = [
    ...new Set([
      ...receipt.authored,
      ...conflicts(root),
      ...(receipt.untrackedConflicts ?? []),
    ]),
  ];
  const pending =
    receipt.stage === "applied"
      ? regenerate(root, receipt)
      : ["stash apply and generation await authored merge resolution"];
  if (!pending.length && receipt.resolved.length)
    runGit(root, ["add", "--", ...receipt.resolved]);
  const remaining = [
    ...new Set([...conflicts(root), ...(receipt.untrackedConflicts ?? [])]),
  ];
  receipt.complete =
    receipt.stage === "applied" && !pending.length && !remaining.length;
  receipt.pending = pending;
  save();
  console.log(`Bases: ${receipt.before} -> ${receipt.upstream}`);
  console.log(
    `Authored conflicts: ${remaining.length ? remaining.map(shellQuote).join(", ") : "none"}`,
  );
  for (const item of pending) console.log(`Pending: ${item}`);
  if (receipt.untrackedConflicts?.length)
    console.log(
      `Untracked stash collisions require explicit resolution; original bytes remain at ${receipt.stash}^3. Stage the chosen content and use --continue to acknowledge the resolution.`,
    );
  console.log(
    `Affected checks (not run):\n  ${await integrationTestCommand(root, receipt.before)}\n  npm run publication:check\n  node scripts/harness.mjs check\n  npm run release -- check-surfaces --local`,
  );
  console.log(
    "Reviewer: complete the integration decision's carried-forward claims; assess component-version collisions and changed evidence inputs. No lifecycle event or acceptance result was appended.",
  );
  if (!receipt.complete)
    console.log(
      `Resolve authored conflicts explicitly, git add resolved paths, then run npm run worktree -- integrate ${workOrder} --continue`,
    );
  else
    console.log(
      "Integration mechanics complete. Preservation and merge identities are in the receipt; recovery refs and stash retained.",
    );
  return receipt;
}
