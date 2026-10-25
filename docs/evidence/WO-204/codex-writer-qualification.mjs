import { execFileSync, spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  canonicalWorkerArgs,
  CodexCliExecWorkOrderTransport,
  runWorkerProcess,
} from "../../../packages/skeleton/dist/src/worker-transport.js";
import {
  createQualificationFixture,
  git,
  hostFacts,
  makeHost,
  objectLocations,
  qualificationPaths,
  qualificationRequest,
  readRecord,
  relativize,
  requireNextEpisode,
  safeUsage,
  saveRecord,
  version,
} from "./qualification-fixture.mjs";

const output = fileURLToPath(
  new URL("./codex-writer-qualification.json", import.meta.url),
);
const decisions = fileURLToPath(new URL("./decisions.md", import.meta.url));
const documentationAddress = "192.0.2.1";
export function commandExits(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    const item = event.item;
    if (
      event.type === "item.completed" &&
      item?.type === "command_execution" &&
      typeof item.command === "string"
    )
      rows.push({
        command: item.command,
        exitCode: Number.isInteger(item.exit_code) ? item.exit_code : null,
      });
  }
  return rows;
}
export function parseDenials(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    let message = line;
    try {
      const row = JSON.parse(line);
      message = row.eventMessage ?? row.message ?? "";
    } catch {}
    const match =
      /Sandbox:\s*[^\n(]+\(\d+\)\s+(?:deny\(\d+\)\s+)?([a-z][a-z0-9-]+)\s+([^\n]+)/u.exec(
        message,
      ) ?? /^\([^)]+\)\s+([a-z][a-z0-9-]+)\s+([^\n]+)$/u.exec(message);
    if (match)
      rows.push({ operation: match[1], target: (match[2] ?? "").trim() });
  }
  return rows;
}
export function classifyDenial(row, paths) {
  if (row.target === `${paths.common}/packed-refs.lock`)
    return "expected-packed-refs-lock";
  if (
    [paths.common, paths.gitdir, paths.store, paths.worktree].some(
      (root) =>
        root && (row.target === root || row.target.startsWith(`${root}/`)),
    )
  )
    return "repository";
  if (row.operation.startsWith("network-")) return "network";
  return "outside";
}
export function denialSummary(rows, paths) {
  const counts = new Map();
  for (const row of rows) {
    const path = relativize(row.target, paths).replace(
      /(<home>\/Library\/Preferences\/ByHost\/)[^/]+/u,
      "$1<redacted>",
    );
    const value = {
      operation: row.operation,
      path,
      classification: classifyDenial(row, paths),
    };
    const key = JSON.stringify(value);
    const previous = counts.get(key);
    counts.set(key, { ...value, count: (previous?.count ?? 0) + 1 });
  }
  return [...counts.values()].sort(
    (a, b) =>
      a.path.localeCompare(b.path) || a.operation.localeCompare(b.operation),
  );
}
export function calibrated(printed, observed) {
  const count = (rows) => {
    const result = new Map();
    for (const row of rows) {
      const key = JSON.stringify(row);
      result.set(key, (result.get(key) ?? 0) + 1);
    }
    return result;
  };
  const actual = count(observed);
  return (
    printed.length > 0 &&
    [...count(printed)].every(([key, n]) => (actual.get(key) ?? 0) >= n)
  );
}
export function shellEnvironment(args) {
  const table = args.find((arg) =>
    arg.startsWith("shell_environment_policy.set="),
  );
  if (!table) throw new Error("writer environment table is absent");
  return Object.fromEntries(
    [...table.matchAll(/([A-Z][A-Z0-9_]*)=("(?:[^"\\]|\\.)*")/gu)].map(
      ([, key, value]) => [key, JSON.parse(value)],
    ),
  );
}
function sandboxArguments(args, withoutConfig = false) {
  const values = [];
  for (let index = 0; index < args.length - 1; index++) {
    if (args[index] !== "-c") continue;
    let value = args[index + 1];
    if (
      !/^(?:permissions\.|default_permissions=|shell_environment_policy\.)/u.test(
        value,
      )
    )
      continue;
    if (withoutConfig && value.startsWith("shell_environment_policy.set=")) {
      const environment = shellEnvironment(args);
      for (const key of Object.keys(environment))
        if (key.startsWith("GIT_CONFIG_")) delete environment[key];
      value = `shell_environment_policy.set={${Object.entries(environment)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(",")}}`;
    }
    values.push("-c", value);
  }
  return values;
}
function unifiedDenialReader(paths, calibration = false) {
  // These denials appear in the live stream but are not retained by log show.
  const predicate =
    '(((processID == 0) AND (senderImagePath CONTAINS "/Sandbox")) OR (subsystem == "com.apple.sandbox.reporting"))';
  const process = spawn(
    "/usr/bin/log",
    ["stream", "--style", "ndjson", "--predicate", predicate],
    {
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let partial = "",
    rows = [],
    error = null,
    overflow = false;
  process.stdout.on("data", (chunk) => {
    partial += chunk;
    let end;
    while ((end = partial.indexOf("\n")) >= 0) {
      const line = partial.slice(0, end);
      partial = partial.slice(end + 1);
      for (const row of parseDenials(line))
        if (
          calibration ||
          Object.values(paths).some(
            (root) => row.target === root || row.target.startsWith(`${root}/`),
          ) ||
          row.target.includes(documentationAddress)
        )
          rows.push(row);
    }
    if (partial.length > 1024 * 1024 || rows.length > 10000) {
      overflow = true;
      process.kill("SIGTERM");
    }
  });
  process.stderr.resume();
  process.on("error", (failure) => {
    error = failure;
  });
  const closed = new Promise((resolve) =>
    process.on("close", (exitCode, signal) => resolve({ exitCode, signal })),
  );
  let stopped = null;
  return {
    ready: new Promise((resolve) => setTimeout(resolve, 750)),
    stop(paths, controls = []) {
      stopped ??= (async () => {
        if (process.exitCode === null) process.kill("SIGTERM");
        const { exitCode, signal } = await closed;
        const expected = new Set(controls.map((row) => JSON.stringify(row)));
        return {
          available:
            !error && !overflow && (signal === "SIGTERM" || exitCode === 0),
          exitCode,
          signal,
          overflow,
          rows: rows.filter(
            (row) =>
              expected.size === 0 ||
              expected.has(JSON.stringify(row)) ||
              Object.values(paths).some(
                (root) =>
                  row.target === root || row.target.startsWith(`${root}/`),
              ) ||
              row.target.includes(documentationAddress),
          ),
        };
      })();
      return stopped;
    },
  };
}
const networkProgram = `import {connect} from 'node:net';
const result = await new Promise(resolve => { const socket=connect({host:'192.0.2.1',port:9});
const end=code=>{socket.destroy();resolve({code});}; socket.setTimeout(1500);
socket.on('connect',()=>end('connected')); socket.on('error',error=>end(error.code ?? 'unknown')); socket.on('timeout',()=>end('timeout')); });
console.log(JSON.stringify(result));\n`;
const codeFromNetwork = (result) => {
  for (const line of (result.stdout ?? "").split("\n"))
    try {
      const value = JSON.parse(line);
      if (typeof value.code === "string") return value.code;
    } catch {}
  return "unavailable";
};
const failureFacts = (error) => ({
  kind: error?.constructor?.name ?? "unknown",
  code: typeof error?.code === "string" ? error.code : null,
});

async function sandboxPhase() {
  const startedAt = Date.now(),
    record = readRecord(output);
  let fixture, outside, row, reader;
  try {
    const cliVersion = version("codex");
    const codexBinary = realpathSync(
      execFileSync("/usr/bin/which", ["codex"], { encoding: "utf8" }).trim(),
    );
    const help = execFileSync("codex", ["sandbox", "--help"], {
      encoding: "utf8",
      timeout: 5000,
    });
    if (
      !help.includes("--log-denials") ||
      !help.includes("--permission-profile")
    )
      throw new Error("installed sandbox helper is unavailable");
    fixture = createQualificationFixture("codex-sandbox");
    const host = makeHost(
      fixture,
      new CodexCliExecWorkOrderTransport(undefined, cliVersion),
    );
    host.tree.prepare();
    const request = qualificationRequest(fixture, host);
    const paths = qualificationPaths(fixture, host);
    outside = realpathSync(mkdtempSync(join(tmpdir(), "dotln-wo204-outside-")));
    paths.outside = outside;
    const args = canonicalWorkerArgs(
      "codex-cli-exec",
      request,
      join(fixture.root, "schema.json"),
      cliVersion,
    );
    const inherited = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) => !key.startsWith("GIT_CONFIG_"),
      ),
    );
    reader = unifiedDenialReader(paths, true);
    await reader.ready;
    const printed = [];
    const run = (command, withoutConfig = false) => {
      const environment = shellEnvironment(args);
      if (withoutConfig)
        for (const key of Object.keys(environment))
          if (key.startsWith("GIT_CONFIG_")) delete environment[key];
      const result = spawnSync(
        codexBinary,
        [
          "sandbox",
          "-P",
          "dotln-writer",
          "-C",
          host.tree.path,
          "--log-denials",
          ...sandboxArguments(args, withoutConfig),
          "--",
          "/bin/sh",
          "-c",
          'sleep 0.5; "$@"; result=$?; sleep 1; exit "$result"',
          "qualification",
          ...command,
        ],
        {
          cwd: host.tree.path,
          env: { ...inherited, ...environment },
          encoding: "utf8",
          timeout: 45_000,
          maxBuffer: 8 * 1024 * 1024,
        },
      );
      const denials = parseDenials(
        `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
      );
      printed.push(...denials);
      return { ...result, denials };
    };
    writeFileSync(
      join(host.tree.path, "fixture.txt"),
      "changed by synthetic worker\n",
    );
    const add = run(["git", "add", "-A"]),
      commit = run(["git", "commit", "-F", host.tree.messagePath]);
    writeFileSync(
      join(host.tree.path, "fixture.txt"),
      "second synthetic control\n",
    );
    const controlAdd = run(["git", "add", "-A"], true),
      controlCommit = run(["git", "commit", "-F", host.tree.messagePath], true);
    const deniedFiles = [
      join(fixture.common, "qualification-write"),
      join(fixture.common, "hooks/qualification-write"),
      join(outside, "qualification-write"),
    ];
    const writes = deniedFiles.map((file) => {
      const result = run(["/usr/bin/touch", file]);
      return {
        path: relativize(file, paths),
        exitCode: result.status,
        exists: existsSync(file),
        denials: denialSummary(
          result.denials.filter((row) => row.target === file),
          paths,
        ),
      };
    });
    writeFileSync(join(host.tree.path, "network.mjs"), networkProgram);
    const network = run([process.execPath, "network.mjs"]);
    const controlNetwork = spawnSync(process.execPath, ["network.mjs"], {
      cwd: host.tree.path,
      encoding: "utf8",
      timeout: 5000,
    });
    const stoppedAt = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const controls = printed;
    const observed = await reader.stop(paths, controls);
    const readerCalibrated =
      observed.available && calibrated(controls, observed.rows);
    row = {
      cliVersion,
      startedAt: new Date(startedAt).toISOString(),
      stoppedAt: new Date(stoppedAt).toISOString(),
      durationMs: Date.now() - startedAt,
      helper: "codex sandbox -P dotln-writer --log-denials",
      arguments: relativize(sandboxArguments(args), paths),
      fixture: {
        rerereEnabled:
          git(fixture.repo, ["config", "--get", "rerere.enabled"]) === "true",
        packedRefsPresent: existsSync(join(fixture.common, "packed-refs")),
      },
      addExitCode: add.status,
      commitExitCode: commit.status,
      withoutGitConfig: {
        addExitCode: controlAdd.status,
        commitExitCode: controlCommit.status,
        denials: denialSummary(
          controlCommit.denials.filter(
            (row) => classifyDenial(row, paths) !== "outside",
          ),
          paths,
        ),
      },
      writes,
      network: {
        sandboxCode: codeFromNetwork(network),
        controlCode: codeFromNetwork(controlNetwork),
      },
      calibration: {
        reader: "/usr/bin/log stream --style ndjson",
        readerExitCode: observed.exitCode,
        calibrated: readerCalibrated,
        printedDenials: denialSummary(controls, paths),
        observedDenials: denialSummary(
          observed.rows.filter((row) =>
            controls.some(
              (control) =>
                control.operation === row.operation &&
                control.target === row.target,
            ),
          ),
          paths,
        ),
      },
    };
    row.passed =
      row.addExitCode === 0 &&
      row.commitExitCode === 0 &&
      controlAdd.status === 0 &&
      controlCommit.status === 128 &&
      writes.every(
        (item) =>
          item.exitCode !== 0 &&
          item.exists === false &&
          item.denials.length > 0,
      ) &&
      ["EPERM", "EACCES"].includes(row.network.sandboxCode) &&
      row.network.sandboxCode !== row.network.controlCode &&
      readerCalibrated;
  } catch (error) {
    row = {
      passed: false,
      unavailable: true,
      failure: failureFacts(error),
      durationMs: Date.now() - startedAt,
    };
  } finally {
    if (reader) await reader.stop({}, []);
    fixture?.dispose();
    if (outside) rmSync(outside, { recursive: true, force: true });
  }
  const previous = record.sandbox?.attempts ?? [];
  record.sandbox = { ...row, attempts: [...previous, row] };
  saveRecord(output, record);
  return row;
}

async function livePhase(decision) {
  const record = readRecord(output);
  if (!record.sandbox?.passed || !record.sandbox.calibration.calibrated)
    throw new Error("a passing calibrated sandbox phase is required");
  const number = requireNextEpisode(record.live, decision, decisions),
    startedAt = Date.now();
  const fixture = createQualificationFixture("codex", number);
  let commands = [],
    usage,
    outcome,
    failure,
    locations,
    processStartedAt,
    processStoppedAt,
    paths;
  const cliVersion = version("codex");
  const runner = (launch) => {
    const running = runWorkerProcess(launch);
    return {
      ...running,
      completed: running.completed.then((result) => {
        commands = commandExits(result.stdout);
        return result;
      }),
    };
  };
  const transport = new CodexCliExecWorkOrderTransport(
    runner,
    cliVersion,
    (value) => {
      usage = value;
    },
  );
  const host = makeHost(fixture, transport, {
    onEvent(event) {
      if (event.type === "SourceChangeProcessStarted") {
        processStartedAt = Date.now();
        Object.assign(paths, qualificationPaths(fixture, host));
      }
      if (event.type === "SourceChangeProcessStopped")
        processStoppedAt = Date.now();
    },
    afterResult() {
      locations = objectLocations(fixture, host);
      if (
        ["shared-before-import", "candidate-unreadable"].includes(
          locations.classification,
        )
      )
        throw new Error("private object environment qualification failed");
    },
  });
  let row, reader;
  try {
    paths = {
      scratch: fixture.root,
      common: fixture.common,
      worktree: host.tree.path,
    };
    reader = unifiedDenialReader(paths);
    await reader.ready;
    try {
      outcome = await host.run();
    } catch (error) {
      failure = failureFacts(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const denials = await reader.stop(paths);
    const facts = hostFacts(host, outcome);
    const commitCommands = commands.filter((row) =>
      /\bgit\s+commit\s+-F\s/u.test(row.command),
    );
    row = {
      episode: number,
      causeDecision: decision ?? null,
      cliVersion,
      model: "gpt-6.1-sol",
      effort: "max",
      effectiveReadback: "unknown",
      startedAt: new Date(startedAt).toISOString(),
      durationMs: Date.now() - startedAt,
      processWindow: {
        startedAt: processStartedAt
          ? new Date(processStartedAt).toISOString()
          : null,
        stoppedAt: processStoppedAt
          ? new Date(processStoppedAt).toISOString()
          : null,
      },
      commands: relativize(commands, paths),
      commitCommandCount: commitCommands.length,
      objectLocation: locations ?? null,
      host: facts,
      denials: {
        available: denials.available,
        readerExitCode: denials.exitCode,
        paths: denialSummary(denials.rows, paths),
        packedRefsLockCount: denials.rows.filter(
          (row) => classifyDenial(row, paths) === "expected-packed-refs-lock",
        ).length,
      },
      usage: safeUsage(usage),
      failure: failure ?? null,
    };
    row.passed =
      !failure &&
      facts.outcome === "observed" &&
      facts.writer?.status === "completed" &&
      facts.writer.requiresHuman === false &&
      facts.candidateImported === 1 &&
      facts.sourceChangeObserved === 1 &&
      facts.importPrecedesObservation &&
      facts.focusedAfterExit === 0 &&
      locations?.classification === "private-only" &&
      commitCommands.length === 1 &&
      commitCommands[0].exitCode === 0 &&
      denials.available &&
      denials.rows.every((row) => classifyDenial(row, paths) !== "repository");
    row.stopReason =
      locations &&
      ["shared-before-import", "candidate-unreadable"].includes(
        locations.classification,
      )
        ? "object-directory-environment"
        : null;
    record.live = processStartedAt
      ? {
          ...record.live,
          passed: row.passed,
          episodes: [...(record.live?.episodes ?? []), row],
        }
      : {
          ...record.live,
          passed: false,
          setupFailures: [...(record.live?.setupFailures ?? []), row],
        };
    saveRecord(output, relativize(record, paths));
  } finally {
    if (reader) await reader.stop(paths ?? {});
    fixture.dispose();
  }
  return row;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2),
    phase = args[args.indexOf("--phase") + 1];
  const decision = args.includes("--decision")
    ? args[args.indexOf("--decision") + 1]
    : undefined;
  try {
    const row =
      phase === "sandbox"
        ? await sandboxPhase()
        : phase === "live"
          ? await livePhase(decision)
          : (() => {
              throw new Error("use --phase sandbox|live");
            })();
    console.log(
      JSON.stringify({
        phase,
        passed: row.passed,
        durationMs: row.durationMs,
        failure: row.failure ?? null,
      }),
    );
    if (!row.passed) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
