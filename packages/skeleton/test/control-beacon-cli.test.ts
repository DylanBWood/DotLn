import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeLog } from "@dotln/kernel";
import {
  controlBeaconAddress,
  controlBeaconDirectory,
} from "../src/control-beacon-fs.mjs";
import { replayBeaconSweep } from "../src/beacon-observe.js";
import type { BeaconSweepRequest } from "../src/control-beacon.js";

test("WO-021 agent constellation CLI persists permission/refusal and one metadata perception through the reactor", (t) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-beacon-cli-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const repository = fileURLToPath(new URL("../../../../", import.meta.url));
  const run = (file: string, args: readonly string[]) =>
    spawnSync(file, args, { cwd: root, encoding: "utf8" });
  const ok = (result: ReturnType<typeof run>) => {
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  ok(run("git", ["init", "-b", "main"]));
  assert.equal(ok(run("git", ["rev-parse", "--show-toplevel"])).trim(), root);
  cpSync(join(repository, "scripts"), join(root, "scripts"), {
    recursive: true,
  });
  cpSync(join(repository, ".gitignore"), join(root, ".gitignore"));
  mkdirSync(join(root, "node_modules/@dotln"), { recursive: true });
  for (const name of ["kernel", "compiler", "skeleton"]) {
    const pkg = join(root, "packages", name);
    mkdirSync(pkg, { recursive: true });
    cpSync(
      join(repository, "packages", name, "package.json"),
      join(pkg, "package.json"),
    );
    cpSync(join(repository, "packages", name, "dist"), join(pkg, "dist"), {
      recursive: true,
    });
    symlinkSync(pkg, join(root, "node_modules/@dotln", name), "dir");
  }
  // Source leaves are the bootstrap reader; dist supplies the typed reactor.
  mkdirSync(join(root, "packages/skeleton/src"));
  for (const name of [
    "beacon-codebook.mjs",
    "beacon-io.mjs",
    "control-codebook.mjs",
    "control-beacon-fs.mjs",
  ])
    cpSync(
      join(repository, "packages/skeleton/src", name),
      join(root, "packages/skeleton/src", name),
    );
  mkdirSync(join(root, "docs/work-orders"), { recursive: true });
  writeFileSync(
    join(root, "docs/work-orders/WO-099-fixture.md"),
    "# fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n",
  );
  const command = (tool: string, args: readonly string[]) =>
    run(process.execPath, [join(root, `scripts/${tool}.mjs`), ...args]);
  ok(
    command("resume", [
      "activate",
      "WO-099",
      "docs/work-orders/WO-099-fixture.md",
    ]),
  );
  const request: BeaconSweepRequest = {
    intent: { kind: "Observe", subject: "control-beacons" },
    audience: "public",
    staleAfterMs: 1200000,
    authority: {
      authorityEnvelopeId: "fixture-host-grant",
      allowedEffects: [],
      deniedEffects: [],
      requiredEvidence: [],
      resourceLimits: { beaconSweeps: 1 },
      expiresAt: Number.MAX_SAFE_INTEGER,
      revocationEventTypes: [],
    },
    evidence: [],
    revokedBy: [],
  };
  const requestFile = join(root, "request.json");
  const writeRequest = (value: BeaconSweepRequest) =>
    writeFileSync(requestFile, JSON.stringify(value));
  writeRequest(request);
  const directory = controlBeaconDirectory(root);
  chmodSync(directory, 0o000); // An attempted directory read would fail with EACCES.
  try {
    const denied = command("worktree", [
      "constellation",
      "--agent",
      "request.json",
      "--log",
      "docs/observations/denied.jsonl",
    ]);
    assert.equal(denied.status, 1);
    assert.match(
      denied.stdout,
      /sweep refused; CommandRefused recorded; no beacon metadata read/,
    );
    const events = decodeLog(
      readFileSync(join(root, "docs/observations/denied.jsonl"), "utf8"),
    );
    assert.deepEqual(
      events.map(({ type }) => type),
      ["BeaconSweepRequested", "CommandRefused"],
    );
    t.diagnostic(denied.stdout.trim());
  } finally {
    chmodSync(directory, 0o700);
  }
  const path = join(directory, controlBeaconAddress("WO-099"));
  writeFileSync(path, Buffer.alloc(lstatSync(path).size, 120));
  chmodSync(path, 0o000);
  writeRequest({
    ...request,
    authority: {
      ...request.authority,
      allowedEffects: ["observe.beacons.public"],
    },
  });
  const controlBefore = readFileSync(
    join(root, "docs/control/orders/WO-099.jsonl"),
  );
  const allowed = command("worktree", [
    "constellation",
    "--agent",
    "request.json",
    "--log",
    "docs/observations/allowed.jsonl",
  ]);
  ok(allowed);
  assert.match(allowed.stdout, /active.*host-projected.*fresh/);
  const log = readFileSync(
    join(root, "docs/observations/allowed.jsonl"),
    "utf8",
  );
  assert.deepEqual(
    decodeLog(log).map(({ type }) => type),
    [
      "BeaconSweepRequested",
      "CommandPersisted",
      "BeaconObserved",
      "CommandResult",
    ],
  );
  assert.equal(replayBeaconSweep(log).state.beaconObservations.length, 1);
  assert.deepEqual(
    readFileSync(join(root, "docs/control/orders/WO-099.jsonl")),
    controlBefore,
  );
  assert.equal(
    lstatSync(join(root, "docs/observations/allowed.jsonl")).mode & 0o777,
    0o600,
  );
  t.diagnostic(
    "authorized CLI: unreadable garbage beacon decoded; exactly one BeaconObserved; replay succeeded; lifecycle bytes unchanged",
  );
  const escape = command("worktree", [
    "constellation",
    "--agent",
    "request.json",
    "--log",
    "docs/intake/escaped.jsonl",
  ]);
  assert.equal(escape.status, 1);
  assert.ok(!existsSync(join(root, "docs/intake/escaped.jsonl")));
  const benchmark = JSON.parse(
    ok(
      run(process.execPath, [
        join(root, "scripts/benchmark-beacon.mjs"),
        "--smoke",
      ]),
    ),
  );
  assert.deepEqual(
    benchmark.results.map((result: { members: number }) => result.members),
    [3, 12],
  );
  assert.ok(
    benchmark.results.every(
      (result: { equalObservationPayloads: boolean }) =>
        result.equalObservationPayloads,
    ),
  );
  assert.equal(benchmark.rounds, 3);
  assert.equal(
    run(process.execPath, [
      join(root, "scripts/benchmark-beacon.mjs"),
      "--invalid",
    ]).status,
    1,
  );
  const contention = JSON.parse(
    ok(
      run(process.execPath, [
        join(root, "scripts/benchmark-beacon-contention.mjs"),
        "--smoke",
      ]),
    ),
  );
  assert.deepEqual(
    contention.results.map((result: { readers: number }) => result.readers),
    [1, 2],
  );
  for (const result of contention.results)
    for (const kind of ["metadataSweep", "singleJsonIndex"]) {
      assert.equal(result[kind].requests, 8);
      assert.equal(result[kind].equalObservationPayloads, true);
      assert.ok(result[kind].elapsedMs > 0);
    }
  assert.equal(
    run(process.execPath, [
      join(root, "scripts/benchmark-beacon-contention.mjs"),
      "--invalid",
    ]).status,
    1,
  );
});
