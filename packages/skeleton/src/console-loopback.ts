import { spawn, type ChildProcess } from "node:child_process";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { constants } from "node:os";
import { join, resolve } from "node:path";
import { decodeLog } from "@dotln/kernel";
import {
  compileLoadout,
  requireCompiled,
  type AuthorityEnvelope,
} from "@dotln/compiler";
import {
  CONSOLE_COMMANDS_V1,
  CONSOLE_STREAMING_OPTIONS,
  consoleChildEnvironment,
  consoleCommandInvocation,
  consoleTerminalCommand,
  decodeConsoleCommandRequest,
  isConsoleCommandId,
  type ConsoleCommandId,
  type ConsoleCommandResult,
} from "./console-commands.js";
import { permissionEffect } from "./harness-host.js";
import { harnessAuthorization } from "./reactor.js";
import { ResidentStore } from "./resident-store.js";

export const CONSOLE_DIRECTORY = "console";
export const CONSOLE_CONNECTION_FILE = "console-loopback-v1.json";
const RESULTS = "results";
const REQUEST_LIMIT = 1024 * 1024;
const TERMINATION_GRACE_MS = 2000;
/** After the command's own process exits, a descendant still holding its
 * pipes no longer holds the result, as a terminal prompt returns. */
const PIPE_GRACE_MS = 5000;
/** Below any HTTP client's idle timeout (Node's fetch waits 300 s). */
const KEEP_ALIVE_MS = 30000;
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

type Connection = Readonly<{
  version: 1;
  host: "127.0.0.1";
  port: number;
  token: string;
}>;
type Output = Readonly<{ sha256: string; bytes: number }>;
type Running = { readonly child: ChildProcess; settled: boolean };
type Decoded = Readonly<{ command: string; args: readonly string[] }>;

const sha256 = (bytes: Buffer | string) =>
  createHash("sha256").update(bytes).digest("hex");

/** The console's owner-only directory inside a resident store: the connection
 * descriptor and the content-addressed result bytes its receipts name. */
export function consoleDirectory(store: string): string {
  return join(store, CONSOLE_DIRECTORY);
}

function ownerOnlyDirectory(directory: string): void {
  try {
    mkdirSync(directory, { mode: 0o700 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
  const stat = lstatSync(directory);
  if (
    !stat.isDirectory() ||
    (process.getuid !== undefined && stat.uid !== process.getuid()) ||
    (stat.mode & 0o077) !== 0
  )
    throw new Error(
      "console loopback requires an owner-only console directory in the resident store",
    );
}

/** A console-originated refusal has the lifecycle CLIs' refusal shape: exit 1,
 * no stdout, one `error:` line on stderr (WO-115 D007). */
export function consoleRefusal(
  command: string,
  reason: string,
): ConsoleCommandResult {
  return {
    version: 1,
    command,
    exitCode: 1,
    stdoutBase64: "",
    stderrBase64: Buffer.from(`error: ${reason}\n`).toString("base64"),
  };
}

function send(response: ServerResponse, status: number, value: unknown): void {
  if (response.destroyed || response.headersSent) return;
  response.writeHead(status, JSON_HEADERS);
  response.end(JSON.stringify(value) + "\n");
}

/** A result goes out as the body of the response already opened for it. */
function reply(response: ServerResponse, value: unknown): void {
  if (response.destroyed || response.writableEnded) return;
  if (!response.headersSent) return send(response, 200, value);
  response.end(JSON.stringify(value) + "\n");
}

function sameToken(header: string | undefined, token: string): boolean {
  const actual = Buffer.from(header ?? "", "utf8");
  const expected = Buffer.from(`Bearer ${token}`, "utf8");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Reads at most the request limit and drains the remainder, so an oversized
 * body is refused in terminal shape instead of resetting the connection. */
async function readBody(request: IncomingMessage): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += part.length;
    if (size <= REQUEST_LIMIT) chunks.push(part);
  }
  return size > REQUEST_LIMIT ? null : Buffer.concat(chunks);
}

/** A name outside the safe charset is recorded by digest, not verbatim. */
const recordedCommand = (command: string) =>
  /^[A-Za-z0-9._-]{1,64}$/u.test(command)
    ? command
    : `sha256:${sha256(command)}`;

/** Result bytes are durable, including their directory entry, before the
 * receipt that names them. */
function storeOutput(directory: string, bytes: Buffer): Output {
  const digest = sha256(bytes);
  const temporary = join(
    directory,
    `.${digest}.${randomBytes(6).toString("hex")}`,
  );
  try {
    const fd = openSync(temporary, "wx", 0o600);
    try {
      writeFileSync(fd, bytes);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    renameSync(temporary, join(directory, digest));
  } finally {
    rmSync(temporary, { force: true });
  }
  const fd = openSync(directory, "r");
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  return { sha256: digest, bytes: bytes.length };
}

function signalGroup(child: ChildProcess, name: NodeJS.Signals): void {
  try {
    process.kill(-child.pid!, name);
  } catch {
    try {
      child.kill(name);
    } catch {
      // Already gone.
    }
  }
}

/** Ctrl-C in a terminal interrupts the command's whole process group. The
 * group is killed after a grace unless the result has settled. */
function terminate(running: Running): void {
  if (running.child.pid === undefined || running.settled) return;
  signalGroup(running.child, "SIGTERM");
  setTimeout(() => {
    if (!running.settled) signalGroup(running.child, "SIGKILL");
  }, TERMINATION_GRACE_MS).unref();
}

export type ConsoleReplay = Readonly<{
  results: ConsoleCommandResult[];
  incomplete: string[];
}>;

/** Results are reproduced from the durable console receipts and their
 * digest-checked bytes without rerunning a terminal command. An invocation
 * without a result, such as one interrupted by a process failure, is named. */
export function replayConsoleResults(store: string): ConsoleReplay {
  const logPath = join(store, "events.jsonl");
  const log = existsSync(logPath) ? readFileSync(logPath, "utf8") : "";
  const directory = join(consoleDirectory(store), RESULTS);
  const bytes = (commandId: string, value: unknown) => {
    const output = value as Record<string, unknown> | null;
    if (
      !output ||
      typeof output !== "object" ||
      typeof output["sha256"] !== "string" ||
      !/^[a-f0-9]{64}$/u.test(output["sha256"]) ||
      !Number.isSafeInteger(output["bytes"])
    )
      throw new Error(`invalid console result digest for ${commandId}`);
    let body: Buffer;
    try {
      body = readFileSync(join(directory, output["sha256"]));
    } catch {
      throw new Error(`console result bytes for ${commandId} are missing`);
    }
    if (body.length !== output["bytes"] || sha256(body) !== output["sha256"])
      throw new Error(
        `console result bytes for ${commandId} differ from their receipt`,
      );
    return body.toString("base64");
  };
  const invoked = new Map<string, string>();
  const observed = new Set<string>();
  const results: ConsoleCommandResult[] = [];
  for (const event of decodeLog(log)) {
    if (
      event.type !== "ConsoleCommandInvoked" &&
      event.type !== "ConsoleCommandObserved"
    )
      continue;
    const payload = event.payload as Record<string, unknown>;
    const commandId = payload["commandId"];
    if (
      event.actorId !== "console" ||
      typeof commandId !== "string" ||
      !/^console_[0-9]+$/u.test(commandId)
    )
      throw new Error("invalid console receipt");
    if (event.type === "ConsoleCommandInvoked") {
      if (invoked.has(commandId) || typeof payload["command"] !== "string")
        throw new Error("invalid console invocation receipt");
      invoked.set(commandId, payload["command"]);
      continue;
    }
    const command = invoked.get(commandId);
    if (
      command === undefined ||
      observed.has(commandId) ||
      !Number.isSafeInteger(payload["exitCode"])
    )
      throw new Error("console result has no single invocation");
    observed.add(commandId);
    results.push({
      version: 1,
      command,
      exitCode: payload["exitCode"] as number,
      stdoutBase64: bytes(commandId, payload["stdout"]),
      stderrBase64: bytes(commandId, payload["stderr"]),
    });
  }
  return {
    results,
    incomplete: [...invoked.keys()].filter((id) => !observed.has(id)),
  };
}

/** The resident's local command surface. Caller, route and request checks run
 * on arrival and a decoded request's response opens at once; admission and
 * execution run one command at a time, and each decoded request records a
 * console invocation and its result or refusal, whether or not its caller
 * stays. Start it only while holding the store's lifetime lock. */
export class ConsoleLoopback {
  private readonly server: Server;
  private readonly token = randomBytes(32).toString("hex");
  private readonly directory: string;
  private readonly descriptor: string;
  private readonly children = new Set<Running>();
  private serial: Promise<unknown> = Promise.resolve();
  private connection?: Connection;
  private envelope?: AuthorityEnvelope;
  private closing = false;
  private closed?: Promise<void>;

  constructor(
    private readonly store: ResidentStore,
    private readonly root: string,
    private readonly now: () => number = Date.now,
  ) {
    this.directory = consoleDirectory(store.store.directory);
    this.descriptor = join(this.directory, CONSOLE_CONNECTION_FILE);
    this.server = createServer((request, response) => {
      response.on("error", () => undefined);
      this.accept(request, response).catch(() => {
        const failure = consoleRefusal(
          "",
          "console command could not complete",
        );
        if (response.headersSent) reply(response, failure);
        else send(response, 500, failure);
      });
    });
  }

  async start(): Promise<Connection> {
    ownerOnlyDirectory(this.directory);
    ownerOnlyDirectory(join(this.directory, RESULTS));
    // The lifetime lock is held, so a descriptor here belongs to an exited
    // resident; a SIGKILL cannot remove its own.
    rmSync(this.descriptor, { force: true });
    await new Promise<void>((resolveStart, rejectStart) => {
      this.server.once("error", rejectStart);
      this.server.listen(0, "127.0.0.1", () => {
        this.server.removeListener("error", rejectStart);
        resolveStart();
      });
    });
    const address = this.server.address();
    if (!address || typeof address === "string")
      throw new Error("console loopback has no TCP address");
    const connection: Connection = {
      version: 1,
      host: "127.0.0.1",
      port: address.port,
      token: this.token,
    };
    try {
      const fd = openSync(this.descriptor, "wx", 0o600);
      try {
        writeFileSync(fd, JSON.stringify(connection) + "\n");
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      this.connection = connection;
      return connection;
    } catch (error) {
      this.server.close();
      throw error;
    }
  }

  /** Stops admission, interrupts in-flight commands, records their results
   * and stops serving. Repeated calls share one shutdown. */
  close(): Promise<void> {
    return (this.closed ??= this.shutdown());
  }

  private async shutdown(): Promise<void> {
    this.closing = true;
    if (this.connection && existsSync(this.descriptor)) {
      const current = readFileSync(this.descriptor, "utf8");
      if (current === JSON.stringify(this.connection) + "\n")
        unlinkSync(this.descriptor);
    }
    for (const running of this.children) terminate(running);
    const closed = this.server.listening
      ? new Promise<void>((done) => this.server.close(() => done()))
      : Promise.resolve();
    this.server.closeAllConnections();
    await closed;
    await this.serial;
  }

  private async accept(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    const decoded = await this.decode(request, response);
    if (!decoded) return;
    // Headers go out at once and whitespace keeps an idle connection open
    // while the request waits in the lane and while its command runs, so no
    // client idle timeout interrupts a queued or long terminal command
    // (VER-001 F1).
    const gone = () => response.destroyed || request.socket.destroyed;
    response.writeHead(200, JSON_HEADERS);
    response.flushHeaders();
    const keepAlive = setInterval(() => {
      if (!gone()) response.write(" ");
    }, KEEP_ALIVE_MS);
    const next = this.serial.then(() => this.run(decoded, response, gone));
    this.serial = next.catch(() => undefined);
    try {
      reply(response, await next);
    } catch {
      reply(
        response,
        consoleRefusal(decoded.command, "console command could not complete"),
      );
    } finally {
      clearInterval(keepAlive);
    }
  }

  /** Caller, route and request checks; each refusal is answered here, before
   * the command lane, so none waits behind a running command. */
  private async decode(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<Decoded | null> {
    const origin = request.headers.origin;
    const localOrigin =
      typeof origin === "string" &&
      /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::[0-9]{1,5})?$/u.test(origin);
    if (
      request.socket.remoteAddress !== "127.0.0.1" ||
      !/^127\.0\.0\.1:[0-9]{1,5}$/u.test(request.headers.host ?? "") ||
      (origin !== undefined && !localOrigin)
    ) {
      send(response, 403, consoleRefusal("", "console caller refused"));
      return null;
    }
    if (localOrigin) {
      response.setHeader("access-control-allow-origin", origin);
      response.setHeader("vary", "Origin");
      response.setHeader(
        "access-control-allow-headers",
        "authorization, content-type",
      );
      response.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
    }
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return null;
    }
    if (!sameToken(request.headers.authorization, this.token)) {
      send(response, 403, consoleRefusal("", "console caller refused"));
      return null;
    }
    if (request.method === "GET" && request.url === "/console-commands-v1") {
      send(response, 200, { version: 1, commands: CONSOLE_COMMANDS_V1 });
      return null;
    }
    if (
      request.method !== "POST" ||
      request.url !== "/console-commands-v1/invoke"
    ) {
      send(response, 404, consoleRefusal("", "console route refused"));
      return null;
    }
    const body = await readBody(request);
    if (body === null) {
      send(response, 413, consoleRefusal("", "console request exceeds 1 MiB"));
      return null;
    }
    try {
      const { command, args } = decodeConsoleCommandRequest(
        JSON.parse(body.toString("utf8")),
      );
      return { command, args };
    } catch {
      send(
        response,
        400,
        consoleRefusal("", "invalid console-commands-v1 request"),
      );
      return null;
    }
  }

  /** One turn of the lane: the invocation receipt, the command unless its
   * caller left while queued or the resident is stopping, and the result
   * receipt. A decoded request keeps its receipts either way. */
  private async run(
    { command, args }: Decoded,
    response: ServerResponse,
    gone: () => boolean,
  ): Promise<ConsoleCommandResult> {
    const { commandId, refusal } = await this.admit(command, args);
    let result: ConsoleCommandResult;
    if (refusal !== null || !isConsoleCommandId(command))
      result = consoleRefusal(command, refusal ?? "unknown console command");
    else if (this.closing || gone())
      result = consoleRefusal(
        command,
        this.closing
          ? "the resident is stopping"
          : "the caller left before the command started",
      );
    else result = await this.execute(command, args, response);
    const results = join(this.directory, RESULTS);
    await this.store.transaction(
      (tx) =>
        tx.append(
          "ConsoleCommandObserved",
          {
            commandId,
            exitCode: result.exitCode,
            stdout: storeOutput(
              results,
              Buffer.from(result.stdoutBase64, "base64"),
            ),
            stderr: storeOutput(
              results,
              Buffer.from(result.stderrBase64, "base64"),
            ),
          },
          this.now(),
          "console",
        ),
      { observe: false },
    );
    return result;
  }

  /** The terminal's classifier names the effect of the equivalent terminal
   * command; the terminal hooks' decider judges it against the resident's
   * compiled program envelope (WO-115 D005). Text the classifier cannot
   * classify is refused: the hook defers it to host permissions, and the
   * console has no host-permission layer (WO-115 D010). */
  private async admit(
    command: string,
    args: readonly string[],
  ): Promise<{ commandId: string; refusal: string | null }> {
    let refusal: string | null = null;
    let effect: string | null = null;
    if (!isConsoleCommandId(command)) refusal = "unknown console command";
    else if (
      args.some((arg) => CONSOLE_STREAMING_OPTIONS[command]?.includes(arg))
    )
      refusal =
        "console results are complete; a streaming option runs in the terminal";
    else
      try {
        effect = permissionEffect(
          {
            hook_event_name: "PreToolUse",
            cwd: resolve(this.root),
            session_id: "console",
            tool_name: "Bash",
            tool_input: { command: consoleTerminalCommand(command, args) },
          },
          resolve(this.root),
        );
      } catch (error) {
        refusal = `command classification: ${
          error instanceof Error ? error.message : "unclassified command"
        }`;
      }
    let commandId = "";
    await this.store.transaction(
      (tx) => {
        const configuration = tx.resident?.configuration;
        if (!configuration)
          throw new Error("console requires a configured resident");
        if (effect !== null && refusal === null) {
          this.envelope ??= requireCompiled(
            compileLoadout(configuration.graph, configuration.environment),
          ).authorityEnvelope;
          if (
            !harnessAuthorization(this.envelope, effect, this.now()).authorized
          )
            refusal = `compiled authority does not permit ${effect}`;
        }
        commandId = `console_${tx.events.length + 1}`;
        tx.append(
          "ConsoleCommandInvoked",
          {
            commandId,
            command: recordedCommand(command),
            argsSha256: sha256(JSON.stringify(args)),
            ...(effect === null ? {} : { effect }),
            authorized: refusal === null,
            ...(refusal === null ? {} : { refusal }),
          },
          this.now(),
          "console",
        );
      },
      { observe: false },
    );
    return { commandId, refusal };
  }

  private execute(
    command: ConsoleCommandId,
    args: readonly string[],
    response: ServerResponse,
  ): Promise<ConsoleCommandResult> {
    const invocation = consoleCommandInvocation(command, args, this.root);
    return new Promise((done) => {
      const stdout: Buffer[] = [],
        stderr: Buffer[] = [];
      const child = spawn(invocation.executable, invocation.argv, {
        cwd: invocation.cwd,
        env: consoleChildEnvironment(process.env),
        stdio: ["ignore", "pipe", "pipe"],
        detached: true,
      });
      const running: Running = { child, settled: false };
      this.children.add(running);
      // A caller that disconnects interrupts its command, as Ctrl-C would.
      const abandon = () => {
        if (!response.writableFinished) terminate(running);
      };
      response.once("close", abandon);
      const finish = (
        code: number | null,
        signal: NodeJS.Signals | null,
        failed = false,
      ) => {
        if (running.settled) return;
        running.settled = true;
        this.children.delete(running);
        response.removeListener("close", abandon);
        done(
          failed
            ? consoleRefusal(command, "terminal command could not start")
            : {
                version: 1,
                command,
                exitCode:
                  code ?? (signal ? 128 + constants.signals[signal] : 1),
                stdoutBase64: Buffer.concat(stdout).toString("base64"),
                stderrBase64: Buffer.concat(stderr).toString("base64"),
              },
        );
      };
      child.stdout!.on("data", (chunk: Buffer) => stdout.push(chunk));
      child.stderr!.on("data", (chunk: Buffer) => stderr.push(chunk));
      child.once("error", () => finish(null, null, true));
      child.once("exit", (code, signal) =>
        setTimeout(() => {
          if (running.settled) return;
          child.stdout!.destroy();
          child.stderr!.destroy();
          finish(code, signal);
        }, PIPE_GRACE_MS).unref(),
      );
      child.once("close", (code, signal) => finish(code, signal));
      if (this.closing || response.destroyed) terminate(running);
    });
  }
}
