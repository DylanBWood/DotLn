import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { isDeepStrictEqual } from "node:util";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { decodeLog, type Event } from "@dotln/kernel";
import { compileLoadout, requireCompiled } from "@dotln/compiler";
import { ResidentHost } from "@dotln/skeleton/dist/src/resident-host.js";
import { ResidentStore } from "@dotln/skeleton/dist/src/resident-store.js";
import {
  CONSOLE_COMMANDS_V1,
  consoleChildEnvironment,
  consoleCommandInvocation,
  consoleTerminalCommand,
  type ConsoleCommandId,
  type ConsoleCommandResult,
} from "@dotln/skeleton/dist/src/console-commands.js";
import { replayConsoleResults } from "@dotln/skeleton/dist/src/console-loopback.js";
import { permissionEffect } from "@dotln/skeleton/dist/src/harness-host.js";
import { harnessAuthorization } from "@dotln/skeleton/dist/src/reactor.js";
import {
  decodeResidentConfiguration,
  type ResidentConfiguration,
} from "@dotln/skeleton/dist/src/resident-state.js";
import {
  invokeConsoleCommand,
  readConsoleContract,
  type ConsoleConnection,
} from "../src/console-client.js";
import { readConsoleConnection } from "../src/console-client-node.js";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
// Every terminal and served run below resolves this repository.
delete process.env.DOTLN_LAUNCHPAD;
const { missionConfiguration } = (await import(
  pathToFileURL(join(root, "scripts/resident-bind.mjs")).href
)) as {
  missionConfiguration: (actor: unknown) => ResidentConfiguration;
};
const presenceFixture = JSON.parse(
  readFileSync(
    join(root, "packages/skeleton/fixtures/wo067-presence.json"),
    "utf8",
  ),
);
const actor = (cwd: string) => ({
  kind: "script",
  effect: "repo.read",
  surface: "fixture.source",
  resources: { files: 1, lines: 0, tokens: 0 },
  command: [process.execPath, "-e", "process.stdout.write('ok\\n')"],
  cwd,
  timeoutMs: 1000,
  expectedStdoutSha256: "00".repeat(32),
});
/** The resident `resident-bind WO-NNN` writes: the Contributor build, whose
 * compiled envelope is the one the emitted permission hook applies. */
const bound = (cwd: string) => missionConfiguration(actor(cwd));
/** A current fixture envelope with the evidence the terminal hooks supply.
 * It allows repo.inspect, repo.read and repo.write, so it admits reads and
 * refuses lifecycle.run and shell.run. */
const readOnly = (cwd: string) => {
  const graph = structuredClone(presenceFixture.graph);
  Object.assign(graph.activeMechanics[0].authorityEnvelope, {
    requiredEvidence: ["resolved-worktree"],
    expiresAt: Number.MAX_SAFE_INTEGER,
  });
  return decodeResidentConfiguration({
    ...presenceFixture,
    graph,
    policyId: "fixture.progressive",
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((phase) => [phase, actor(cwd)]),
    ),
    evidence: ["resolved-worktree"],
  });
};

const temporary = (label: string) =>
  mkdtempSync(join(tmpdir(), `dotln-wo115-${label}-`));
const sha256 = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
const logOf = (store: string) =>
  existsSync(join(store, "events.jsonl"))
    ? readFileSync(join(store, "events.jsonl"), "utf8")
    : "";
/** Every event except the console's own two receipt types. */
const domainEvents = (store: string) =>
  decodeLog(logOf(store))
    .filter((event) => !event.type.startsWith("ConsoleCommand"))
    .map(({ type, actorId, workstreamId, payload }: Event) => {
      const { at: _at, ...rest } = payload as Record<string, unknown>;
      return { type, actorId, workstreamId, payload: rest };
    });
/** The launchpad's durable control state that lifecycle commands append to. */
const controlDigest = () => {
  const hash = createHash("sha256");
  for (const path of [
    "docs/control/current.md",
    ...readdirSync(join(root, "docs/control/orders"))
      .sort()
      .map((name) => `docs/control/orders/${name}`),
  ])
    hash.update(`${path}\0`).update(readFileSync(join(root, path)));
  return hash.digest("hex");
};
/** The terminal command run as the console actor runs it: same entrypoint,
 * arguments and working directory, without host-session identity. */
const terminal = (command: ConsoleCommandId, args: readonly string[]) => {
  const invocation = consoleCommandInvocation(command, args, root);
  const result = spawnSync(invocation.executable, invocation.argv, {
    cwd: invocation.cwd,
    env: consoleChildEnvironment(process.env),
  });
  return {
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};
const bytes = (result: ConsoleCommandResult) => ({
  exitCode: result.exitCode,
  stdout: Buffer.from(result.stdoutBase64, "base64"),
  stderr: Buffer.from(result.stderrBase64, "base64"),
});
const refusalBytes = (reason: string) => ({
  exitCode: 1,
  stdout: Buffer.alloc(0),
  stderr: Buffer.from(`error: ${reason}\n`),
});
const effectOf = (command: ConsoleCommandId, args: readonly string[]) =>
  permissionEffect(
    {
      hook_event_name: "PreToolUse",
      cwd: root,
      session_id: "fixture",
      tool_name: "Bash",
      tool_input: { command: consoleTerminalCommand(command, args) },
    },
    root,
  );

async function until(check: () => boolean, label: string) {
  for (let attempt = 0; attempt < 500; attempt++) {
    if (check()) return;
    await delay(20);
  }
  assert.fail(label);
}
const observedCount = (store: string) =>
  decodeLog(logOf(store)).filter(
    (event) => event.type === "ConsoleCommandObserved",
  ).length;
/** Waits for the next invocation receipt. The in-process resident appends it
 * and spawns the command's child in the same event-loop turn, so once a timer
 * poll sees the receipt the command has started. */
const untilStarted = (store: string, before: number) =>
  until(
    () => invokedCount(store) === before + 1,
    "the blocked command did not start",
  );
/** Starts a resident and waits for its descriptor and its first tick. */
async function serve(store: string, configuration: ResidentConfiguration) {
  const controller = new AbortController();
  const running = new ResidentHost({
    directory: store,
    policyId: configuration.policyId,
    configuration,
    commandRoot: root,
    now: Date.now,
  }).run({ signal: controller.signal, tickMs: 3600000 });
  const descriptor = join(store, "console", "console-loopback-v1.json");
  const stop = async () => {
    controller.abort();
    await running;
  };
  try {
    await until(() => existsSync(descriptor), "resident console did not start");
    let stable = 0,
      previous = -1;
    await until(() => {
      const size = logOf(store).length;
      stable = size === previous ? stable + 1 : 0;
      previous = size;
      return stable >= 10;
    }, "resident first tick did not settle");
  } catch (error) {
    await stop().catch(() => undefined);
    throw error;
  }
  return {
    connection: readConsoleConnection(store),
    descriptor,
    stop,
  };
}
/** Resume reads include live local journals and local checkpoint refs, so a
 * served result must equal a terminal run adjacent to it. */
async function servedMatchesTerminal(
  connection: ConsoleConnection,
  command: ConsoleCommandId,
  args: readonly string[],
) {
  const before = terminal(command, args);
  const served = await invokeConsoleCommand(connection, {
    version: 1,
    command,
    args,
  });
  const after = terminal(command, args);
  assert.ok(
    [before, after].some((direct) => isDeepStrictEqual(bytes(served), direct)),
    `${command}: served bytes differ from both adjacent terminal runs`,
  );
  return { served, direct: before };
}
const invokedCount = (store: string) =>
  decodeLog(logOf(store)).filter(
    (event) => event.type === "ConsoleCommandInvoked",
  ).length;
const invoke = (
  connection: ConsoleConnection,
  command: string,
  args: readonly string[] = [],
  signal?: AbortSignal,
) =>
  signal
    ? fetch(`http://127.0.0.1:${connection.port}/console-commands-v1/invoke`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${connection.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ version: 1, command, args }),
        signal,
      })
    : invokeConsoleCommand(connection, { version: 1, command, args });
const textHost = (args: readonly string[]) =>
  new Promise<{ code: number | null; stdout: Buffer; stderr: Buffer }>(
    (done) => {
      const child = spawn(
        process.execPath,
        [join(root, "packages/console/dist/src/cli.js"), ...args],
        { cwd: root },
      );
      const stdout: Buffer[] = [],
        stderr: Buffer[] = [];
      child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
      child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
      child.once("close", (code) =>
        done({
          code,
          stdout: Buffer.concat(stdout),
          stderr: Buffer.concat(stderr),
        }),
      );
    },
  );

test("WO-115 the console names terminal commands as typed and strips host-session identity", async () => {
  // A browser shell's entry point: the client functions, with no Node API.
  const specifier: string = "@dotln/console/client";
  const client = (await import(specifier)) as Record<string, unknown>;
  assert.deepEqual(Object.keys(client).sort(), [
    "invokeConsoleCommand",
    "readConsoleContract",
  ]);
  assert.doesNotMatch(
    readFileSync(
      join(root, "packages/console/dist/src/console-client.js"),
      "utf8",
    ),
    /\bfrom\s+["']node:|\bimport\(\s*["']node:|\brequire\(/u,
  );
  // Every ID's fixed terminal text, independent of the console's own mapping.
  assert.deepEqual(
    Object.fromEntries(
      Object.keys(CONSOLE_COMMANDS_V1).map((command) => [
        command,
        consoleTerminalCommand(command as ConsoleCommandId, []),
      ]),
    ),
    {
      "resume.next": "node scripts/resume.mjs next",
      "resume.fix": "node scripts/resume.mjs fix",
      "resume.verify": "node scripts/resume.mjs verify",
      "resume.final-review": "node scripts/resume.mjs final-review",
      "resume.release-close": "node scripts/resume.mjs release-close",
      "resume.status": "node scripts/resume.mjs status",
      "resume.times": "node scripts/resume.mjs times",
      "resume.activate": "node scripts/resume.mjs activate",
      "release.close": "node scripts/release.mjs close",
      "worktree.start": "node scripts/worktree.mjs start",
      "worktree.integrate": "node scripts/worktree.mjs integrate",
      "worktree.publish": "node scripts/worktree.mjs publish",
      "worktree.finish": "node scripts/worktree.mjs finish",
      "worktree.settle": "node scripts/worktree.mjs settle",
      "harness.emit": "node scripts/harness.mjs emit",
      "harness.check": "node scripts/harness.mjs check",
      "skeleton.compiled-diff":
        "node packages/skeleton/dist/src/cli.js --compiled-diff",
      "dotln.intent": "node packages/skeleton/dist/src/dotln.js intent",
      "dotln.presence-away":
        "node packages/skeleton/dist/src/dotln.js presence away",
      "dotln.presence-back":
        "node packages/skeleton/dist/src/dotln.js presence back",
      "dotln.status": "node packages/skeleton/dist/src/dotln.js status",
      "console.status": "node packages/console/dist/src/cli.js status",
      "resident.bind-portfolio": "node scripts/resident-bind.mjs --portfolio",
    },
  );
  assert.equal(
    consoleTerminalCommand("resume.status", ["--json"]),
    "node scripts/resume.mjs status --json",
  );
  assert.equal(
    consoleTerminalCommand("dotln.intent", ["fix it's && done"]),
    "node packages/skeleton/dist/src/dotln.js intent 'fix it'\\''s && done'",
  );
  // The terminal classifier's own answers, stated in product 04.
  assert.deepEqual(
    Object.fromEntries(
      (
        [
          ["resume.status", ["--json"]],
          ["resume.status", ["--work-order", "WO-115"]],
          ["resume.times", []],
          ["resume.times", ["--json"]],
          ["resume.next", []],
          ["resume.next", ["--work-order", "WO-115"]],
          ["resume.activate", ["WO-115"]],
          ["release.close", ["WO-115", "--publish"]],
          ["worktree.start", ["WO-115"]],
          ["harness.check", []],
          ["skeleton.compiled-diff", []],
          ["dotln.intent", ["a request"]],
          ["console.status", ["--store", "/tmp/x"]],
          ["resident.bind-portfolio", ["name"]],
        ] as const
      ).map(([command, args]) => [
        consoleTerminalCommand(command, args),
        effectOf(command, args),
      ]),
    ),
    {
      "node scripts/resume.mjs status --json": "repo.read",
      "node scripts/resume.mjs status --work-order WO-115": "lifecycle.run",
      "node scripts/resume.mjs times": "repo.read",
      "node scripts/resume.mjs times --json": "lifecycle.run",
      "node scripts/resume.mjs next": "repo.read",
      "node scripts/resume.mjs next --work-order WO-115": "lifecycle.run",
      "node scripts/resume.mjs activate WO-115": "lifecycle.run",
      "node scripts/release.mjs close WO-115 --publish": "lifecycle.run",
      "node scripts/worktree.mjs start WO-115": "lifecycle.run",
      "node scripts/harness.mjs check": "shell.run",
      "node packages/skeleton/dist/src/cli.js --compiled-diff": "shell.run",
      "node packages/skeleton/dist/src/dotln.js intent 'a request'":
        "shell.run",
      "node packages/console/dist/src/cli.js status --store /tmp/x":
        "shell.run",
      "node scripts/resident-bind.mjs --portfolio name": "shell.run",
    },
  );
  assert.deepEqual(
    consoleChildEnvironment({
      PATH: "/bin",
      DOTLN_LAUNCHPAD: "/launchpad",
      CODEX_HOME: "/codex",
      CLAUDECODE: "1",
      CLAUDE_PID: "7",
      CLAUDE_EFFORT: "xhigh",
      CODEX_THREAD_ID: "thread",
      COPILOT_AGENT_SESSION_ID: "session",
      DOTLN_RESIDENT_EPISODE_ID: "episode",
      DOTLN_RESIDENT_STORE: "/store",
    }),
    { PATH: "/bin", DOTLN_LAUNCHPAD: "/launchpad", CODEX_HOME: "/codex" },
  );
});

test("WO-115 a bound resident serves terminal bytes and events under the terminal's compiled authority, refuses in terminal shape and replays its receipts", async (t) => {
  const store = temporary("bound");
  const quiet = temporary("quiet");
  const hanging = temporary("hanging");
  const empty = temporary("empty");
  t.after(() => {
    for (const directory of [store, quiet, hanging, empty])
      rmSync(directory, { recursive: true, force: true });
  });
  // An ordinary 0755 store serves; only the console's own directory is private.
  chmodSync(store, 0o755);
  // A configured store no request touches, for byte-stable reads.
  await new ResidentHost({
    directory: quiet,
    policyId: "fixture.progressive",
    configuration: readOnly(quiet),
    commandRoot: root,
  }).run({ once: true });
  assert.equal(existsSync(join(quiet, "runtime-status-v1.json")), true);
  // A status file that blocks its reader: a command that never exits.
  chmodSync(hanging, 0o700);
  assert.equal(
    spawnSync("mkfifo", [join(hanging, "runtime-status-v1.json")]).status,
    0,
  );

  const configuration = bound(store);
  const envelope = requireCompiled(
    compileLoadout(configuration.graph, configuration.environment),
  ).authorityEnvelope;
  const resident = await serve(store, configuration);
  const expected: ConsoleCommandResult[] = [];
  let stopped = false;
  try {
    const { connection } = resident;
    assert.equal(statSync(join(store, "console")).mode & 0o777, 0o700);
    assert.equal(statSync(resident.descriptor).mode & 0o777, 0o600);
    const contract = (await readConsoleContract(connection)) as {
      version: number;
      commands: Record<string, Record<string, unknown>>;
    };
    assert.equal(contract.version, 1);
    assert.deepEqual(
      contract.commands,
      JSON.parse(JSON.stringify(CONSOLE_COMMANDS_V1)),
    );
    assert.ok(Object.hasOwn(contract.commands, "release.close"));
    assert.ok(!Object.hasOwn(contract.commands, "portfolio.declare"));
    assert.ok(
      Object.values(contract.commands).every(
        (entry) => !Object.hasOwn(entry, "effect"),
      ),
    );

    // Reads: exact terminal bytes, and no event beyond the console receipts.
    for (const [command, args] of [
      // Plain status tolerates several open orders, as on main.
      ["resume.status", []],
      ["resume.times", []],
      ["skeleton.compiled-diff", []],
      ["dotln.status", ["--store", quiet]],
      ["console.status", ["--store", quiet, "--json"]],
    ] as const) {
      const control = controlDigest();
      const events = domainEvents(store);
      const { served, direct } = await servedMatchesTerminal(
        connection,
        command,
        args,
      );
      // Resume reads need local checkpoint refs a fresh clone lacks.
      if (!command.startsWith("resume."))
        assert.equal(direct.exitCode, 0, `${command}: ${direct.stderr}`);
      expected.push(served);
      assert.equal(controlDigest(), control, command);
      assert.deepEqual(domainEvents(store), events, command);
    }

    // Effects: the same bytes and the same domain events either way. Presence
    // back runs while the operator is away; the away phase's actor envelope
    // does not judge the operator's own commands.
    for (const command of [
      "dotln.presence-away",
      "dotln.presence-back",
    ] as const) {
      const args = ["--store", store];
      const before = domainEvents(store).length;
      const served = await invokeConsoleCommand(connection, {
        version: 1,
        command,
        args,
      });
      expected.push(served);
      const servedEvents = domainEvents(store).slice(before);
      const direct = terminal(command, args);
      const directEvents = domainEvents(store).slice(
        before + servedEvents.length,
      );
      assert.equal(served.exitCode, 0, command);
      assert.deepEqual(bytes(served), direct, command);
      assert.deepEqual(servedEvents, directEvents, command);
      assert.deepEqual(
        servedEvents.map((event) => event.type),
        ["OperatorPresenceObserved", "ClockSampled"],
        command,
      );
      assert.deepEqual(
        servedEvents[0]!.payload,
        {
          signal: { kind: command.endsWith("away") ? "away" : "back" },
          origin: "human",
        },
        command,
      );
    }

    const shown = await textHost([
      "invoke",
      "--store",
      store,
      "skeleton.compiled-diff",
    ]);
    const preview = terminal("skeleton.compiled-diff", []);
    assert.deepEqual(
      { exitCode: shown.code, stdout: shown.stdout, stderr: shown.stderr },
      preview,
    );
    expected.push({
      version: 1,
      command: "skeleton.compiled-diff",
      exitCode: 0,
      stdoutBase64: shown.stdout.toString("base64"),
      stderrBase64: shown.stderr.toString("base64"),
    });
    const listed = await textHost(["commands", "--store", store]);
    assert.equal(listed.code, 0);
    assert.deepEqual(
      Object.keys(JSON.parse(listed.stdout.toString()).commands),
      Object.keys(CONSOLE_COMMANDS_V1),
    );
    const absent = await textHost(["invoke", "--store", empty, "resume.times"]);
    assert.equal(absent.code, 1);
    assert.equal(
      absent.stderr.toString(),
      "console refused: no running resident console in this store\n",
    );

    // Recorded refusals: outside the contract, whatever the name, and a
    // streaming option the complete-result transport cannot serve.
    for (const [command, args, reason] of [
      ["unknown.command", [], "unknown console command"],
      ["Resume.Next", [], "unknown console command"],
      ["resume next!", [], "unknown console command"],
      [
        "console.status",
        ["--store", store, "--watch"],
        "console results are complete; a streaming option runs in the terminal",
      ],
      // Text the terminal classifier cannot classify: the hook defers it to
      // host permissions; the console, which has none, refuses it.
      [
        "dotln.status",
        ["--store", join(empty, "no such git push dir")],
        "command classification: Opaque program contains a denied invocation; an explicit effect adapter is required",
      ],
    ] as const) {
      const served = await invokeConsoleCommand(connection, {
        version: 1,
        command,
        args,
      });
      expected.push(served);
      assert.deepEqual(bytes(served), refusalBytes(reason), command);
      const receipt = decodeLog(logOf(store))
        .filter((event) => event.type === "ConsoleCommandInvoked")
        .at(-1)!.payload as Record<string, unknown>;
      assert.equal(receipt["authorized"], false, command);
      assert.equal(receipt["effect"], undefined, command);
      assert.equal(receipt["refusal"], reason, command);
    }

    // Transport refusals: terminal shape, no command decoded, no receipt.
    const receipts = decodeLog(logOf(store)).length;
    const endpoint = `http://127.0.0.1:${connection.port}/console-commands-v1/invoke`;
    const body = JSON.stringify({
      version: 1,
      command: "resume.times",
      args: [],
    });
    for (const [headers, payload, status, reason] of [
      [{}, body, 403, "console caller refused"],
      [
        {
          authorization: `Bearer ${connection.token}`,
          origin: "https://elsewhere.invalid",
        },
        body,
        403,
        "console caller refused",
      ],
      [
        { authorization: `Bearer ${connection.token}` },
        "{",
        400,
        "invalid console-commands-v1 request",
      ],
      [
        { authorization: `Bearer ${connection.token}` },
        JSON.stringify({
          version: 1,
          command: "resume.times",
          args: ["x".repeat(1024 * 1024)],
        }),
        413,
        "console request exceeds 1 MiB",
      ],
    ] as const) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: payload,
      });
      assert.equal(response.status, status, reason);
      assert.deepEqual(
        bytes((await response.json()) as ConsoleCommandResult),
        refusalBytes(reason),
      );
    }
    // A rebinding page that reaches the port under another host name.
    const rebound = await new Promise<{
      status: number | undefined;
      body: string;
    }>((done, fail) => {
      const request = httpRequest(
        {
          host: "127.0.0.1",
          port: connection.port,
          method: "POST",
          path: "/console-commands-v1/invoke",
          headers: {
            host: `localhost:${connection.port}`,
            authorization: `Bearer ${connection.token}`,
            "content-type": "application/json",
          },
        },
        (response) => {
          const chunks: Buffer[] = [];
          response.on("data", (chunk: Buffer) => chunks.push(chunk));
          response.on("end", () =>
            done({
              status: response.statusCode,
              body: Buffer.concat(chunks).toString(),
            }),
          );
        },
      );
      request.on("error", fail);
      request.end(body);
    });
    assert.equal(rebound.status, 403);
    assert.deepEqual(
      bytes(JSON.parse(rebound.body) as ConsoleCommandResult),
      refusalBytes("console caller refused"),
    );
    const forged = await invokeConsoleCommand(
      { ...connection, token: "0".repeat(64) },
      { version: 1, command: "resume.times", args: [] },
    );
    assert.equal(forged.command, "resume.times");
    assert.deepEqual(bytes(forged), refusalBytes("console caller refused"));
    await assert.rejects(
      readConsoleContract({ ...connection, token: "0".repeat(64) }),
      /console contract refused \(403\)/u,
    );
    assert.equal(decodeLog(logOf(store)).length, receipts);

    // Headers arrive once the request is decoded, so no client idle timeout
    // waits on a long command; a caller that leaves interrupts it and the
    // lane moves on.
    const leaving = new AbortController();
    const startedAt = invokedCount(store);
    const started = (await invoke(
      connection,
      "console.status",
      ["--store", hanging, "--json"],
      leaving.signal,
    )) as Response;
    assert.equal(started.status, 200);
    await untilStarted(store, startedAt);
    leaving.abort();
    await assert.rejects(started.text());
    const { served: after } = await servedMatchesTerminal(
      connection,
      "resume.times",
      [],
    );
    expected.push(
      {
        version: 1,
        command: "console.status",
        exitCode: 143,
        stdoutBase64: "",
        stderrBase64: "",
      },
      after,
    );

    // A decoded request waiting behind a long command is answered at once
    // and returns its terminal result when the lane frees; a caller that
    // leaves while queued keeps its invocation and refusal in the receipts
    // (VER-001 F1).
    const blocking = new AbortController();
    const blockedAt = invokedCount(store);
    const blocked = (await invoke(
      connection,
      "console.status",
      ["--store", hanging, "--json"],
      blocking.signal,
    )) as Response;
    assert.equal(blocked.status, 200);
    const blockedBody = blocked.text().catch(() => null);
    await untilStarted(store, blockedAt);
    const queuedAt = invokedCount(store);
    const queuedArgs = ["--store", quiet];
    const queuedBefore = terminal("dotln.status", queuedArgs);
    const queued = (await Promise.race([
      invoke(
        connection,
        "dotln.status",
        queuedArgs,
        new AbortController().signal,
      ),
      delay(10000, undefined, { ref: false }).then(() =>
        assert.fail("a queued request got no response while the lane was busy"),
      ),
    ])) as Response;
    assert.equal(queued.status, 200);
    const queuedBody = queued.text();
    const leavingQueued = new AbortController();
    const left = (await invoke(
      connection,
      "resume.times",
      [],
      leavingQueued.signal,
    )) as Response;
    assert.equal(left.status, 200);
    leavingQueued.abort();
    await assert.rejects(left.text());
    // Admission is one at a time: neither waiting request has a receipt.
    assert.equal(invokedCount(store), queuedAt);
    blocking.abort();
    await blockedBody;
    const queuedServed = JSON.parse(await queuedBody) as ConsoleCommandResult;
    const queuedAfter = terminal("dotln.status", queuedArgs);
    assert.ok(
      [queuedBefore, queuedAfter].some((direct) =>
        isDeepStrictEqual(bytes(queuedServed), direct),
      ),
      "the queued command's served bytes differ from both adjacent terminal runs",
    );
    await until(
      () =>
        invokedCount(store) === queuedAt + 2 &&
        observedCount(store) === queuedAt + 2,
      "the waiting requests did not record their receipts",
    );
    expected.push(
      {
        version: 1,
        command: "console.status",
        exitCode: 143,
        stdoutBase64: "",
        stderrBase64: "",
      },
      queuedServed,
      {
        version: 1,
        command: "resume.times",
        exitCode: 1,
        stdoutBase64: "",
        stderrBase64: Buffer.from(
          "error: the caller left before the command started\n",
        ).toString("base64"),
      },
    );

    // Every receipt names the console actor; each admitted contract command
    // was judged by the terminal classifier and the terminal hooks' decider.
    const invoked = decodeLog(logOf(store)).filter(
      (event) => event.type === "ConsoleCommandInvoked",
    );
    assert.equal(invoked.length, expected.length);
    assert.ok(
      decodeLog(logOf(store))
        .filter((event) => event.type.startsWith("ConsoleCommand"))
        .every((event) => event.actorId === "console"),
    );
    for (const event of invoked) {
      const payload = event.payload as Record<string, unknown>;
      if (payload["effect"] === undefined) continue;
      assert.equal(payload["authorized"], true);
      assert.equal(
        harnessAuthorization(envelope, String(payload["effect"]), Date.now())
          .authorized,
        true,
      );
    }
    assert.deepEqual(
      invoked.map(
        (event) => (event.payload as Record<string, unknown>)["command"],
      ),
      expected.map((result) =>
        result.command === "resume next!"
          ? `sha256:${sha256("resume next!")}`
          : result.command,
      ),
    );

    // Orderly shutdown interrupts an in-flight command, refuses the request
    // waiting behind it, and records both results.
    const admitted = invokedCount(store);
    const running = (await invoke(
      connection,
      "console.status",
      ["--store", hanging, "--json"],
      new AbortController().signal,
    )) as Response;
    await untilStarted(store, admitted);
    const pending = running.text().catch((error: unknown) => error);
    const waiting = (await invoke(
      connection,
      "resume.times",
      [],
      new AbortController().signal,
    )) as Response;
    assert.equal(waiting.status, 200);
    assert.equal(invokedCount(store), admitted + 1);
    const waitingBody = waiting.text().catch((error: unknown) => error);
    await resident.stop();
    stopped = true;
    await pending;
    await waitingBody;
    expected.push(
      {
        version: 1,
        command: "console.status",
        exitCode: 143,
        stdoutBase64: "",
        stderrBase64: "",
      },
      {
        version: 1,
        command: "resume.times",
        exitCode: 1,
        stdoutBase64: "",
        stderrBase64: Buffer.from("error: the resident is stopping\n").toString(
          "base64",
        ),
      },
    );
  } finally {
    if (!stopped) await resident.stop();
  }
  assert.equal(existsSync(resident.descriptor), false);

  // Replay reproduces every result from the receipts, without rerunning.
  const replayed = replayConsoleResults(store);
  assert.deepEqual(replayed.incomplete, []);
  assert.deepEqual(
    replayed.results,
    expected.map((result) =>
      result.command === "resume next!"
        ? { ...result, command: `sha256:${sha256("resume next!")}` }
        : result,
    ),
  );
  // An interrupted process leaves an invocation without a result: named.
  const truncated = temporary("truncated");
  t.after(() => rmSync(truncated, { recursive: true, force: true }));
  const lines = logOf(store).trimEnd().split("\n");
  const lastResult = lines.findLastIndex((line) =>
    line.includes('"ConsoleCommandObserved"'),
  );
  cpSync(join(store, "console"), join(truncated, "console"), {
    recursive: true,
  });
  writeFileSync(
    join(truncated, "events.jsonl"),
    lines.slice(0, lastResult).join("\n") + "\n",
  );
  const lastId = String(
    (JSON.parse(lines[lastResult]!).payload as Record<string, unknown>)[
      "commandId"
    ],
  );
  assert.deepEqual(replayConsoleResults(truncated).incomplete, [lastId]);

  // A descriptor left by a resident that could not remove it never blocks
  // the next start: the lifetime lock proves its owner exited.
  writeFileSync(resident.descriptor, "stale\n", { mode: 0o600 });
  await new ResidentHost({
    directory: store,
    policyId: configuration.policyId,
    configuration,
    commandRoot: root,
  }).run({ once: true });
  assert.equal(existsSync(resident.descriptor), false);
});

test("WO-115 the compiled envelope admits or refuses each command by the terminal classifier's effect, through the terminal hooks' decider", async (t) => {
  const store = temporary("read-only");
  const presence = temporary("presence");
  t.after(() => {
    for (const directory of [store, presence])
      rmSync(directory, { recursive: true, force: true });
  });
  const configuration = readOnly(store);
  const envelope = requireCompiled(
    compileLoadout(configuration.graph, configuration.environment),
  ).authorityEnvelope;
  const resident = await serve(store, configuration);
  try {
    // Admitted: a repo.read command runs with the terminal's bytes.
    assert.equal(effectOf("resume.times", []), "repo.read");
    assert.equal(
      harnessAuthorization(envelope, "repo.read", Date.now()).authorized,
      true,
    );
    await servedMatchesTerminal(resident.connection, "resume.times", []);
    const admitted = decodeLog(logOf(store))
      .filter((event) => event.type === "ConsoleCommandInvoked")
      .at(-1)!.payload as Record<string, unknown>;
    assert.equal(admitted["effect"], "repo.read");
    assert.equal(admitted["authorized"], true);
    // Refused: the same current envelope does not allow these effects.
    for (const [command, args] of [
      ["worktree.start", ["WO-999"]],
      ["dotln.presence-back", ["--store", presence]],
    ] as const) {
      const effect = effectOf(command, args);
      const decision = harnessAuthorization(envelope, effect, Date.now());
      assert.equal(decision.authorized, false);
      assert.equal(
        (decision as { refusal: { payload: { reason: unknown } } }).refusal
          .payload.reason,
        "effect not allowed",
      );
      const before = domainEvents(store);
      const served = await invokeConsoleCommand(resident.connection, {
        version: 1,
        command,
        args,
      });
      assert.deepEqual(
        bytes(served),
        refusalBytes(`compiled authority does not permit ${effect}`),
      );
      assert.deepEqual(domainEvents(store), before);
      const receipt = decodeLog(logOf(store))
        .filter((event) => event.type === "ConsoleCommandInvoked")
        .at(-1)!.payload as Record<string, unknown>;
      assert.equal(receipt["effect"], effect);
      assert.equal(receipt["authorized"], false);
      assert.equal(
        receipt["refusal"],
        `compiled authority does not permit ${effect}`,
      );
    }
    assert.equal(existsSync(join(presence, "events.jsonl")), false);
  } finally {
    await resident.stop();
  }
});

test("WO-115 every contract command keeps its terminal parser, refusal bytes and events over loopback", async (t) => {
  const store = temporary("inventory");
  t.after(() => rmSync(store, { recursive: true, force: true }));
  // Each refusal is decided by the parser before any control read or write,
  // whatever phase the launchpad's selected order is in.
  const refusing: Record<ConsoleCommandId, string[]> = {
    "resume.next": ["--work-order", "BAD"],
    "resume.fix": ["--work-order", "BAD"],
    "resume.verify": ["--work-order", "BAD"],
    "resume.final-review": ["--work-order", "BAD"],
    "resume.release-close": ["--work-order", "BAD"],
    "resume.status": ["--work-order", "BAD"],
    "resume.times": ["--work-order", "BAD"],
    "resume.activate": ["--work-order", "BAD"],
    "release.close": ["BAD"],
    "worktree.start": ["BAD"],
    "worktree.integrate": ["BAD"],
    "worktree.publish": ["BAD"],
    "worktree.finish": ["BAD"],
    "worktree.settle": ["BAD"],
    "harness.emit": ["--invalid"],
    "harness.check": ["--invalid"],
    "skeleton.compiled-diff": ["--invalid"],
    "dotln.intent": [],
    "dotln.presence-away": [],
    "dotln.presence-back": [],
    "dotln.status": [],
    "console.status": [],
    "resident.bind-portfolio": [],
  };
  assert.deepEqual(Object.keys(refusing), Object.keys(CONSOLE_COMMANDS_V1));
  const resident = await serve(store, bound(store));
  try {
    for (const command of Object.keys(refusing) as ConsoleCommandId[]) {
      const args = refusing[command];
      const control = controlDigest();
      const events = domainEvents(store);
      const direct = terminal(command, args);
      assert.equal(direct.exitCode, 1, `${command}: expected a parser refusal`);
      assert.equal(controlDigest(), control, `${command}: terminal wrote`);
      const served = await invokeConsoleCommand(resident.connection, {
        version: 1,
        command,
        args,
      });
      assert.deepEqual(bytes(served), direct, command);
      assert.equal(controlDigest(), control, `${command}: console wrote`);
      assert.deepEqual(domainEvents(store), events, command);
      const receipt = decodeLog(logOf(store))
        .filter((event) => event.type === "ConsoleCommandInvoked")
        .at(-1)!.payload as Record<string, unknown>;
      assert.equal(receipt["command"], command);
      assert.equal(receipt["effect"], effectOf(command, args), command);
      assert.equal(receipt["authorized"], true, command);
    }
  } finally {
    await resident.stop();
  }
  const replayed = replayConsoleResults(store);
  assert.equal(
    replayed.results.length,
    Object.keys(CONSOLE_COMMANDS_V1).length,
  );
  assert.deepEqual(replayed.incomplete, []);
});

test("WO-115 console receipts leave the resident host's change baseline to the host", async (t) => {
  const store = temporary("baseline");
  t.after(() => rmSync(store, { recursive: true, force: true }));
  await new ResidentHost({
    directory: store,
    policyId: "fixture.progressive",
    configuration: readOnly(store),
    commandRoot: root,
  }).run({ once: true });
  const resident = new ResidentStore(store);
  await resident.transaction(() => undefined);
  assert.equal(resident.changed(), false);
  // A console receipt must not absorb a concurrent append, such as a served
  // presence change, before a running tick sees it.
  await resident.transaction(
    (tx) =>
      tx.append("ConsoleCommandProbe", { probe: true }, Date.now(), "console"),
    { observe: false },
  );
  assert.equal(resident.changed(), true);
  await resident.transaction(() => undefined);
  assert.equal(resident.changed(), false);
});
