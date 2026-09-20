import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  readlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compileLoadout } from "../../../packages/compiler/dist/src/index.js";
import { decodeLog } from "../../../packages/kernel/dist/src/index.js";
import { SourceChangeHost } from "../../../packages/skeleton/dist/src/source-change-host.js";
import { WorkerStore } from "../../../packages/skeleton/dist/src/worker-store.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import { validateReceipt } from "./receipt.mjs";

export const launchpad = realpathSync(
  fileURLToPath(new URL("../../../", import.meta.url)),
);
const directory = fileURLToPath(new URL("./", import.meta.url));
export const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const save = (path, value) =>
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", {
    flag: "wx",
    mode: 0o600,
  });
export const git = (cwd, ...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15_000,
  }).trim();
const observed = (value) => ({ epistemic: "observed", value });
const unknown = (reason) => ({ epistemic: "unknown", value: null, reason });
const publicValue = (value) =>
  JSON.parse(
    JSON.stringify(value).replaceAll(process.execPath, "<node-executable>"),
  );

export function compileFixture(repo, baseCommit, name) {
  const loadout = json(join(directory, "worker-loadout.json"));
  loadout.activeMechanics[0].workOrder.workOrderId = `wo053_${name}`;
  const result = compileLoadout(loadout, {
    environmentId: "wo053.scratch",
    version: 1,
    capabilities: [],
    repo,
    baseCommit,
  });
  if (!result.ok) throw new Error(JSON.stringify(result.diagnostics));
  return {
    loadoutHash: hash(readFileSync(join(directory, "worker-loadout.json"))),
    workOrder: result.program.workOrder,
    authorityEnvelope: result.program.authorityEnvelope,
    authorityEvidence: [],
    artifactIdentity: result.artifactIdentity,
  };
}

export function createFixture() {
  if (
    realpathSync(process.cwd()) !== launchpad ||
    git(launchpad, "rev-parse", "--show-toplevel") !== launchpad
  )
    throw new Error("Run from the selected launchpad Git root");
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo053-")));
  const repo = join(root, "target");
  mkdirSync(repo);
  mkdirSync(join(root, "trees"));
  mkdirSync(join(root, "trees", "sentinel"));
  writeFileSync(
    join(root, "trees", "sentinel", "keep.txt"),
    "synthetic sentinel\n",
  );
  git(repo, "init", "--initial-branch=main");
  // These settings belong only to this newly created synthetic repository.
  git(repo, "config", "user.name", "Fixture");
  git(repo, "config", "user.email", "fixture@example.invalid");
  git(repo, "config", "commit.gpgsign", "false");
  git(repo, "config", "core.hooksPath", "/dev/null");
  writeFileSync(
    join(repo, "sum.mjs"),
    "export const add = (left, right) => left - right;\n",
  );
  writeFileSync(
    join(repo, "focused-test.mjs"),
    `import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { add } from "./sum.mjs";
process.stdout.write(execFileSync("git", ["diff", "--no-ext-diff", "--no-textconv", "HEAD", "--", "sum.mjs"], { encoding: "utf8" }));
assert.equal(add(2, 3), 5);
assert.equal(add(-4, 7), 3);
assert.equal(add(0, 0), 0);
console.log("Focused addition contract passed");
`,
  );
  writeFileSync(
    join(repo, "README.md"),
    "# Synthetic addition contract\n\nChange only sum.mjs so add(left, right) returns the numeric sum. Do not modify this README or focused-test.mjs. Run node focused-test.mjs and read the diff it prints before committing. Use the host's exact stage and commit commands. No remote effects or other source changes.\n",
  );
  git(repo, "add", "sum.mjs", "focused-test.mjs", "README.md");
  git(repo, "commit", "-m", "Synthetic addition baseline");
  const baseCommit = git(repo, "rev-parse", "HEAD");
  const versions = {};
  for (const harness of ["claude", "codex"]) {
    try {
      versions[harness] = execFileSync(harness, ["--version"], {
        encoding: "utf8",
        timeout: 5000,
      }).match(/\d+\.\d+\.\d+/)[0];
    } catch {
      versions[harness] = null;
    }
  }
  save(join(root, "fixture.json"), { root, repo, baseCommit, versions });
  for (const [name, harness, mode, model] of [
    ["claude-clean", "claude", "clean", "claude-fable-5"],
    ["codex-clean", "codex", "clean", "gpt-6-astra"],
    ["claude-kill", "claude", "kill", "claude-fable-5"],
  ]) {
    if (!versions[harness]) continue;
    const episode = join(root, name);
    mkdirSync(episode);
    save(join(episode, "config.json"), {
      ...compileFixture(repo, baseCommit, name.replaceAll("-", "_")),
      name,
      harness,
      mode,
      model,
      effort: "xhigh",
      version: versions[harness],
      branch: name,
      surfaces: ["sum.mjs"],
      worktreeParent: join(root, "trees"),
      launchpadCheckout: launchpad,
      testCommand: `${process.execPath} focused-test.mjs`,
      commitMessage: "Fix addition in the synthetic module\n",
    });
  }
  return root;
}

export function treeDigest(root) {
  const rows = [];
  function visit(path, prefix = "") {
    for (const name of readdirSync(path).sort()) {
      const full = join(path, name),
        relative = prefix + name,
        stat = lstatSync(full);
      if (stat.isSymbolicLink()) throw new Error("Unexpected sentinel symlink");
      if (stat.isDirectory()) {
        rows.push([relative, "directory"]);
        visit(full, relative + "/");
      } else rows.push([relative, stat.mode, hash(readFileSync(full))]);
    }
  }
  visit(root);
  return hash(JSON.stringify(rows));
}

export function checkoutSnapshot(root) {
  const paths = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    { cwd: root },
  )
    .toString()
    .split("\0")
    .filter(Boolean);
  const rows = [...new Set(paths)].sort().map((path) => {
    const full = join(root, path),
      stat = lstatSync(full, { throwIfNoEntry: false });
    return [
      path,
      stat?.mode ?? null,
      !stat
        ? "absent"
        : stat.isFile()
          ? hash(readFileSync(full))
          : stat.isSymbolicLink()
            ? hash(readlinkSync(full))
            : "non-file",
    ];
  });
  return {
    head: git(root, "rev-parse", "HEAD"),
    tree: git(root, "rev-parse", "HEAD^{tree}"),
    workingBytes: hash(JSON.stringify(rows)),
    index: hash(git(root, "ls-files", "--stage")),
    status: hash(
      git(root, "status", "--porcelain=v1", "--untracked-files=all"),
    ),
  };
}

// Reduce private vendor output to closed structural facts before discarding it.
export function wireFacts(stdout) {
  let invalidLines = 0;
  let events;
  try {
    const whole = JSON.parse(stdout);
    events = Array.isArray(whole) ? whole : [whole];
  } catch {
    events = stdout
      .trim()
      .split("\n")
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch {
          invalidLines++;
          return [];
        }
      });
  }
  const terminals = events.filter((event) => event.type === "result");
  const terminal = terminals[0];
  const result = terminal?.result;
  let format = "absent",
    containsEnvelope = false;
  if (typeof result === "string") {
    try {
      containsEnvelope = Boolean(JSON.parse(result)?.envelope);
      format = "json";
    } catch {
      const fenced = /^\s*```(?:json)?\s*\n([\s\S]*?)\n```\s*$/u.exec(result);
      try {
        containsEnvelope = Boolean(JSON.parse(fenced?.[1] ?? "")?.envelope);
        format = "fenced-json";
      } catch {
        format = "non-json";
      }
    }
  }
  return {
    lines: events.length,
    invalidLines,
    terminals: terminals.length,
    terminalSuccess: terminal?.subtype === "success",
    denialArrayPresent: Array.isArray(terminal?.permission_denials),
    resultFormat: format,
    containsEnvelope,
    structuredEnvelopePresent: Boolean(terminal?.structured_output?.envelope),
  };
}

async function episode(episodeRoot, recover) {
  const config = json(join(episodeRoot, "config.json"));
  const Transport =
    config.harness === "claude"
      ? ClaudeCliPrintWorkOrderTransport
      : CodexCliExecWorkOrderTransport;
  const runner = (launch) => {
    const running = runWorkerProcess(launch);
    return {
      ...running,
      completed: running.completed.then((output) => {
        save(join(episodeRoot, "wire-facts.json"), wireFacts(output.stdout));
        return output;
      }),
    };
  };
  const transport = new Transport(runner, config.version, (usage) => {
    const path = join(episodeRoot, "usage.json");
    if (!existsSync(path)) save(path, usage);
  });
  const originalDispatch = transport.dispatch.bind(transport);
  transport.dispatch = (request, now) => {
    if (recover) throw new Error("Recovery attempted a second worker dispatch");
    const running = originalDispatch(request, now);
    return {
      ...running,
      completed: running.completed.then((result) => {
        save(join(episodeRoot, "envelope.json"), result.envelope);
        return result;
      }),
    };
  };
  const host = new SourceChangeHost({
    ...config,
    store: new WorkerStore(join(episodeRoot, "store")),
    transport,
    afterResult: () => {
      if (config.mode === "kill" && !recover) {
        save(join(episodeRoot, "kill-point.json"), {
          commit: git(host.tree.path, "rev-parse", "HEAD"),
          attempts: decodeLog(host.options.store.read()).filter(
            (e) => e.type === "WorkerAttemptStarted",
          ).length,
          sourceObserved: decodeLog(host.options.store.read()).some(
            (e) => e.type === "SourceChangeObserved",
          ),
          sourceReceiptPresent: readdirSync(join(episodeRoot, "store")).some(
            (name) => name.endsWith(".source-change.json"),
          ),
          recordedAt: new Date().toISOString(),
        });
        process.kill(process.pid, "SIGKILL");
      }
    },
  });
  const outcome = await host.run();
  save(join(episodeRoot, "outcome.json"), outcome);
  if (existsSync(join(episodeRoot, "envelope.json")))
    process.stdout.write(
      JSON.stringify(publicValue(json(join(episodeRoot, "envelope.json")))) +
        "\n",
    );
  if (outcome.status !== "observed") process.exitCode = 1;
}

function childRun(episodeRoot, recover = false) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(
      process.execPath,
      [
        fileURLToPath(import.meta.url),
        "episode",
        episodeRoot,
        ...(recover ? ["recover"] : []),
      ],
      { cwd: launchpad, stdio: ["ignore", "pipe", "pipe"] },
    );
    let stdout = "",
      stderr = "";
    child.stdout.on("data", (part) => {
      stdout += part;
      appendFileSync(join(episodeRoot, "parent-envelope-transcript.txt"), part);
    });
    child.stderr.on("data", (part) => {
      stderr += part;
    });
    child.on("close", (code, signal) =>
      resolve({
        code,
        signal,
        durationMs: Date.now() - start,
        stdout,
        stderrBytes: Buffer.byteLength(stderr),
      }),
    );
  });
}

export async function collect(root, name) {
  if (process.env.DOTLN_LIVE_WORKERS !== "1")
    throw new Error("Live runs require DOTLN_LIVE_WORKERS=1");
  const fixture = json(join(root, "fixture.json")),
    episodeRoot = join(root, name);
  const config = json(join(episodeRoot, "config.json"));
  const output = join(directory, `${name}.json`);
  if (existsSync(output))
    throw new Error(
      "Preserve the existing receipt; do not overwrite an attempt",
    );
  const sourceHash = hash(readFileSync(join(directory, "worker-loadout.json")));
  if (config.loadoutHash && config.loadoutHash !== sourceHash)
    throw new Error(
      "Compiled loadout source bytes drifted; preserve the launch edition",
    );
  const snapshot = () => {
    try {
      return {
        launchpad: checkoutSnapshot(launchpad),
        targetMain: checkoutSnapshot(fixture.repo),
        sentinel: treeDigest(join(root, "trees", "sentinel")),
      };
    } catch {
      return { error: "protected-snapshot-unavailable" };
    }
  };
  const before = snapshot(),
    startedAt = new Date().toISOString();
  if (before.error)
    throw new Error(
      "Cannot establish protected baseline; no worker dispatched",
    );
  const transcript = join(episodeRoot, "parent-envelope-transcript.txt");
  writeFileSync(transcript, "", { flag: "wx", mode: 0o600 });
  const beforeTranscriptBytes = lstatSync(transcript).size;
  const first = await childRun(episodeRoot);
  let recovery = null;
  if (
    config.mode === "kill" &&
    first.signal === "SIGKILL" &&
    existsSync(join(episodeRoot, "kill-point.json"))
  ) {
    const events = decodeLog(
      new WorkerStore(join(episodeRoot, "store")).read(),
    );
    const expiry = Math.max(
      ...events.map((e) => e.payload?.leaseExpiresAt ?? 0),
    );
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, expiry - Date.now()) + 100),
    );
    recovery = await childRun(episodeRoot, true);
  }
  const after = snapshot();
  const events = decodeLog(new WorkerStore(join(episodeRoot, "store")).read());
  const outcome = existsSync(join(episodeRoot, "outcome.json"))
    ? json(join(episodeRoot, "outcome.json"))
    : null;
  const envelope = existsSync(join(episodeRoot, "envelope.json"))
    ? publicValue(json(join(episodeRoot, "envelope.json")))
    : null;
  const interruption = existsSync(join(episodeRoot, "kill-point.json"))
    ? json(join(episodeRoot, "kill-point.json"))
    : null;
  let gitEffect = null;
  try {
    const commit = git(
      fixture.repo,
      "rev-parse",
      `refs/heads/${config.branch}`,
    );
    gitEffect = {
      commit,
      changedPaths: git(
        fixture.repo,
        "diff",
        "--name-only",
        fixture.baseCommit,
        commit,
      )
        .split("\n")
        .filter(Boolean),
      commitCount: Number(
        git(
          fixture.repo,
          "rev-list",
          "--count",
          `${fixture.baseCommit}..${commit}`,
        ),
      ),
    };
  } catch {
    /* Absence or inspection failure remains null, never a zero-commit claim. */
  }
  const paths = gitEffect?.changedPaths ?? [],
    commitCount = gitEffect?.commitCount ?? null;
  const parentOutput = first.stdout + (recovery?.stdout ?? "");
  const afterTranscriptBytes = lstatSync(transcript).size;
  const unchanged =
    !after.error && JSON.stringify(before) === JSON.stringify(after);
  const observation = outcome?.observation;
  const envelopeOnly =
    envelope !== null && parentOutput === JSON.stringify(envelope) + "\n";
  const functionalPass =
    outcome?.status === "observed" &&
    Number.isInteger(observation.testBefore.exitCode) &&
    observation.testBefore.exitCode > 0 &&
    observation.testBefore.signal === null &&
    observation.testAfter.exitCode === 0 &&
    observation.testAfter.signal === null &&
    commitCount === 1 &&
    paths.join() === "sum.mjs" &&
    gitEffect.commit === observation.commit &&
    envelope?.status === "completed" &&
    envelope?.observedCommit?.sha === observation.commit &&
    envelope.observedCommit.branch === config.branch &&
    unchanged &&
    envelopeOnly;
  const attempts = events.filter(
    (e) => e.type === "WorkerAttemptStarted",
  ).length;
  const recoveryPass =
    config.mode !== "kill" ||
    (first.signal === "SIGKILL" &&
      recovery?.code === 0 &&
      interruption?.commit === observation?.commit &&
      interruption?.sourceObserved === false &&
      interruption?.sourceReceiptPresent === false &&
      attempts === 1);
  const failurePath = join(episodeRoot, "failure.json");
  const receipt = publicValue({
    schemaVersion: 1,
    kind: "wo053-live-source-change",
    episode: name,
    recordedAt: new Date().toISOString(),
    launch: {
      epistemic: "launch-claim",
      value: {
        harness: config.harness,
        version: config.version,
        model: config.model,
        effort: config.effort,
      },
      effectiveReadback: "unknown",
    },
    fixture: observed({
      target: "<scratch-repository>",
      worktree: "<scratch-repository-worktree>",
      launchpad: "<selected-dotln-worktree>",
      store: "<episode-store>",
      baseCommit: fixture.baseCommit,
      loadoutHash: sourceHash,
      semanticHash: config.artifactIdentity.semanticHash,
      allowedEffects: config.authorityEnvelope.allowedEffects,
      grants: [],
    }),
    boundary: observed({ before, after, unchanged }),
    host: observed({
      outcome,
      changedPaths: paths,
      commitCount,
      attempts,
      eventTypes: [...new Set(events.map((e) => e.type))],
    }),
    gitEffect: observed(gitEffect),
    wire: existsSync(join(episodeRoot, "wire-facts.json"))
      ? observed(json(join(episodeRoot, "wire-facts.json")))
      : unknown("No bounded wire diagnostic returned"),
    envelope: observed(envelope),
    parentHandoff: observed({
      scope: "evidence collector's child-stdout transcript",
      beforeBytes: beforeTranscriptBytes,
      afterBytes: afterTranscriptBytes,
      envelopeOnly,
      rawWorkerTranscriptForwarded: false,
    }),
    executorSessionTranscript: unknown(
      "The complete Codex conversation was not measured; the isolated parent stdout sink is the observed boundary",
    ),
    recovery: observed({
      requested: config.mode === "kill",
      first: {
        exitCode: first.code,
        signal: first.signal,
        durationMs: first.durationMs,
        stderrBytes: first.stderrBytes,
      },
      interruption,
      second: recovery
        ? {
            exitCode: recovery.code,
            signal: recovery.signal,
            durationMs: recovery.durationMs,
            stderrBytes: recovery.stderrBytes,
          }
        : null,
      recoveryByCommitWithoutRedispatch:
        config.mode === "kill" ? recoveryPass : null,
    }),
    usage: existsSync(join(episodeRoot, "usage.json"))
      ? observed(json(join(episodeRoot, "usage.json")))
      : unknown("No transport usage observation returned"),
    failure: observed(existsSync(failurePath) ? json(failurePath) : null),
    result: observed({
      functionalPass: Boolean(functionalPass),
      recoveryPass,
      containmentPass: unchanged,
      startedAt,
    }),
  });
  try {
    validateReceipt(receipt);
  } catch (error) {
    if (!error.message.includes("Receipt privacy screen refused")) throw error;
    receipt.envelope.value = null;
    receipt.failure.value = {
      code: "receipt-privacy-screen",
      detail: "Worker envelope withheld; local evidence retained",
    };
    receipt.result.value.functionalPass = false;
    receipt.parentHandoff.value.envelopeOnly = false;
    validateReceipt(receipt);
  }
  save(output, receipt);
  return receipt;
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [action, root, name] = process.argv.slice(2);
  if (action === "prepare") {
    const scratch = createFixture();
    mkdirSync(join(launchpad, "docs/control/local/wo053"), { recursive: true });
    save(join(launchpad, "docs/control/local/wo053/location.json"), {
      root: scratch,
    });
    console.log(
      "Prepared one synthetic target; location retained in ignored local state",
    );
  } else if (action === "add") {
    const harness = name,
      mode = process.argv[5];
    if (
      !/^[a-z][a-z0-9-]+$/u.test(root) ||
      !["claude", "codex"].includes(harness) ||
      !["clean", "kill"].includes(mode)
    )
      throw new Error(
        "usage: fixture.mjs add <episode-name> claude|codex clean|kill",
      );
    const location = json(
      join(launchpad, "docs/control/local/wo053/location.json"),
    );
    const fixture = json(join(location.root, "fixture.json"));
    const version = execFileSync(harness, ["--version"], {
      encoding: "utf8",
      timeout: 5000,
    }).match(/\d+\.\d+\.\d+/)[0];
    const episodeRoot = join(location.root, root);
    mkdirSync(episodeRoot);
    save(join(episodeRoot, "config.json"), {
      ...compileFixture(
        fixture.repo,
        fixture.baseCommit,
        root.replaceAll("-", "_"),
      ),
      name: root,
      harness,
      mode,
      model: harness === "claude" ? "claude-fable-5" : "gpt-6-astra",
      effort: "xhigh",
      version,
      branch: root,
      surfaces: ["sum.mjs"],
      worktreeParent: join(location.root, "trees"),
      launchpadCheckout: launchpad,
      testCommand: `${process.execPath} focused-test.mjs`,
      commitMessage: "Fix addition in the synthetic module\n",
    });
    console.log(`Prepared ${root} in the existing synthetic repository`);
  } else if (action === "episode") {
    try {
      await episode(root, name === "recover");
    } catch (error) {
      // No raw vendor diagnostic, private path or credential enters the receipt.
      save(join(root, "failure.json"), {
        code: error.code ?? "host-error",
        detail: typeof error.detail === "string" ? error.detail : null,
      });
      process.exitCode = 1;
    }
  } else if (action === "run") {
    const location = json(
      join(launchpad, "docs/control/local/wo053/location.json"),
    );
    const receipt = await collect(location.root, root);
    if (receipt.envelope.value)
      console.log(JSON.stringify(receipt.envelope.value));
    if (
      !receipt.result.value.functionalPass ||
      !receipt.result.value.recoveryPass
    )
      process.exitCode = 1;
  } else
    throw new Error(
      "usage: fixture.mjs prepare | add <episode-name> claude|codex clean|kill | run <episode-name>",
    );
}
