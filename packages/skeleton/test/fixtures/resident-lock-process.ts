// Test-only native-filesystem instrumentation. The production store has no
// crash hooks: stop after each completed call and let the parent send SIGKILL.
import fs from "node:fs";
import { join, relative } from "node:path";
import { syncBuiltinESMExports } from "node:module";

const input = JSON.parse(process.argv[2]!) as {
  directory: string;
  target: string;
  trace: string;
  pause: string;
  resume: string;
  stop?: number;
  mode: "once" | "loop";
  at?: number;
  poll?: boolean;
};
const append = fs.appendFileSync;
const write = fs.writeFileSync;
const rename = fs.renameSync;
const exists = fs.existsSync;
const native = fs as unknown as Record<string, (...args: unknown[]) => unknown>;
const fds = new Map<number, string>();
let prepared: string | undefined;
let done = false;
let index = 0;
let inside = false;
let acquisitions = 0;
for (const op of [
  "mkdirSync",
  "openSync",
  "writeFileSync",
  "fsyncSync",
  "closeSync",
  "symlinkSync",
  "linkSync",
  "unlinkSync",
  "lstatSync",
  "readFileSync",
  "readlinkSync",
  "readdirSync",
  "rmSync",
]) {
  const original = native[op]!;
  native[op] = (...args: unknown[]) => {
    if (inside) return original(...args);
    const path =
      typeof args[0] === "number"
        ? fds.get(args[0])
        : typeof args[0] === "string"
          ? args[0]
          : undefined;
    if (
      op === "mkdirSync" &&
      path?.startsWith(join(input.target, ".host-lock-")) &&
      !relative(input.target, path).includes("/")
    ) {
      acquisitions++;
      if (!prepared && acquisitions === (input.poll ? 4 : 1)) prepared = path;
    }
    let value: unknown;
    let failure: unknown;
    try {
      inside = true;
      value = original(...args);
    } catch (error) {
      failure = error;
    } finally {
      inside = false;
    }
    if (op === "openSync" && typeof value === "number" && path)
      fds.set(value, path);
    if (op === "closeSync") fds.delete(args[0] as number);
    if (prepared && !done) {
      const normalized = args.map((arg) => {
        const name = typeof arg === "number" ? path : arg;
        return typeof name === "string" && name.startsWith(input.directory)
          ? relative(input.directory, name).replace(
              /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/gu,
              "<owner>",
            )
          : undefined;
      });
      const row = {
        index: index++,
        op,
        paths: normalized.filter((part) => part !== undefined),
        error: (failure as NodeJS.ErrnoException | undefined)?.code ?? null,
      };
      inside = true;
      try {
        append(input.trace, JSON.stringify(row) + "\n");
        if (row.index === input.stop) {
          // Existence is the parent's ready signal: publish only complete JSON.
          write(`${input.pause}.tmp`, JSON.stringify(row));
          rename(`${input.pause}.tmp`, input.pause);
          while (!exists(input.resume))
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
        }
      } finally {
        inside = false;
      }
      if (op === "rmSync" && path === prepared) done = true;
    }
    if (failure) throw failure;
    return value;
  };
}
syncBuiltinESMExports();

const { ResidentHost } = await import("../../src/resident-host.js");
const { actorCatalog } = await import("../../src/actor-catalog.js");
const configuration = JSON.parse(
  fs.readFileSync(join(input.directory, "resident.json"), "utf8"),
);
let at = input.at ?? 11;
const host = new ResidentHost({
  directory: input.directory,
  policyId: configuration.policyId,
  configuration,
  now: () => {
    const sampled = at;
    at += input.poll ? 100 : 1;
    return sampled;
  },
  capabilities: () => ["adapter.fixture"],
  catalog: {
    ...actorCatalog,
    script: {
      kind: "script",
      available: () =>
        input.poll ? null : "crash fixture has no external actor",
      run: () => {
        if (!input.poll) throw new Error("unexpected fixture actor launch");
        let finish!: () => void;
        return {
          completed: new Promise((resolve) => {
            finish = () =>
              resolve({
                exitCode: null,
                signal: "SIGKILL",
                stdoutSha256: "0".repeat(64),
                firstLine: "",
                verified: false,
                reason: "operator-return",
              });
            setTimeout(finish, 150);
          }),
          kill: () => finish(),
        };
      },
    },
  },
});
await host.run({ once: input.mode === "once", cycles: 2, tickMs: 1 });
