import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  realpathSync,
  symlinkSync,
  unlinkSync,
  renameSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  EVALUABLE_PROGRAM_KINDS,
  decodeLog,
  type ExecutableProgramV1,
} from "@dotln/kernel";
import {
  discover,
  discoveryProgram,
  type DiscoveryConventions,
} from "../src/discovery.js";
import {
  decodeDiscoveryReport,
  discoveryOutputSha256,
} from "../src/work-candidate.js";
import {
  actorCatalog,
  assertActorSpec,
  scriptResultVerified,
  type ActorSpec,
} from "../src/actor-catalog.js";
import { ResidentHost } from "../src/resident-host.js";
import { recordPresence, replayResident } from "../src/resident-store.js";
import { decodeResidentConfiguration } from "../src/resident-state.js";
const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo119-discovery/repository.json", import.meta.url),
    "utf8",
  ),
);
function seed(root: string): DiscoveryConventions {
  for (const [path, contents] of Object.entries(fixture.files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents as string);
  }
  const conventions: DiscoveryConventions = {
    checks: ["lint", "test"].map((kind) => ({
      kind: kind as "lint" | "test",
      argv: [process.execPath, `checks/${kind}.cjs`],
      paths: ["src/main.js"],
    })),
    ...fixture.conventions,
  };
  writeFileSync(
    join(root, ".dotln/discovery.json"),
    JSON.stringify(conventions),
  );
  return conventions;
}
function scratch(t: { after: (fn: () => void) => void }) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "dotln-discovery-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
const projection = (report: ReturnType<typeof discover>) =>
  report.candidates.map(({ kind, paths, proposedHome }) => ({
    kind,
    paths,
    ...(proposedHome ? { proposedHome } : {}),
  }));

test("WO-119 actual bounded program discovers the pinned six candidates with resolvable evidence", (t) => {
  const root = scratch(t);
  seed(root);
  const report = discover(root);
  assert.deepEqual(projection(report), fixture.expected);
  assert.deepEqual(discover(root), report);
  assert.ok(
    report.candidates.every(
      (c) =>
        c.size.files === c.paths.length &&
        c.evidence.every((id) =>
          report.evidence.some((e) => e.evidenceId === id),
        ),
    ),
  );
  const walk = (p: ExecutableProgramV1) => {
    assert.ok(EVALUABLE_PROGRAM_KINDS.includes(p.kind));
    assert.notEqual(p.kind, "Await");
    if (p.kind === "Sequence") p.programs.forEach(walk);
    if (p.kind === "Guard") {
      walk(p.whenTrue);
      walk(p.whenFalse);
    }
    if (p.kind === "Invoke")
      Object.values(p.continuationByResult).forEach(walk);
  };
  walk(discoveryProgram);
  t.diagnostic(
    JSON.stringify({
      candidates: projection(report),
      evidenceCount: report.evidence.length,
    }),
  );
});

test("WO-119 repo defaults and Markdown profile conventions; empty repository is an empty observation", (t) => {
  const root = scratch(t);
  assert.deepEqual(discover(root).candidates, []);
  const conventions = seed(root);
  unlinkSync(join(root, ".dotln/discovery.json"));
  const defaults = discover(root);
  assert.deepEqual(
    defaults.candidates.map((c) => c.kind),
    ["failing-lint", "failing-test", "repeated-repair"],
  );
  writeFileSync(
    join(root, "profile.md"),
    "# Commands and conventions\n\n```dotln-discovery\n" +
      JSON.stringify(conventions) +
      "\n```\n",
  );
  assert.deepEqual(
    projection(discover(root, undefined, { profilePath: "profile.md" })),
    fixture.expected,
  );
  assert.throws(
    () => discover(root, undefined, { profilePath: "missing.md" }),
    /profile missing/,
  );
});

test("WO-119 observations disappear when facts change; references and one-off repairs are not candidates", (t) => {
  const root = scratch(t);
  seed(root);
  writeFileSync(join(root, "src/main.js"), "module.exports = 1;\n");
  writeFileSync(join(root, "README.md"), "Uses generated/obsolete.txt\n");
  writeFileSync(
    join(root, ".dotln/repairs.jsonl"),
    JSON.stringify({
      eventId: "once",
      repairId: "main-regression",
      paths: ["src/main.js"],
    }) + "\n",
  );
  assert.deepEqual(
    discover(root).candidates.map((c) => c.kind),
    ["misplaced-file", "misplaced-file"],
  );
});

test("WO-119 refuses unsafe paths, incomplete inventory, malformed history and invalid declarations", (t) => {
  const root = scratch(t);
  const conventions = seed(root);
  assert.throws(
    () =>
      discover(root, { placements: [{ path: "../outside", home: "safe" }] }),
    /relative path/,
  );
  symlinkSync("/tmp", join(root, "escape"));
  assert.throws(() => discover(root), /symlink/);
  unlinkSync(join(root, "escape"));
  writeFileSync(join(root, "too-large"), Buffer.alloc(4 * 1024 * 1024));
  assert.throws(() => discover(root), /byte limit/);
  unlinkSync(join(root, "too-large"));
  writeFileSync(
    join(root, ".dotln/repairs.jsonl"),
    fixture.files[".dotln/repairs.jsonl"].repeat(2),
  );
  assert.throws(
    () => discover(root, { repairHistory: conventions.repairHistory! }),
    /duplicate repair event/,
  );
  assert.throws(
    () =>
      discover(root, {
        checks: [{ kind: "lint", argv: ["relative"], paths: ["src/main.js"] }],
      }),
    /absolute argv/,
  );
  assert.throws(
    () =>
      discover(root, {
        checks: [
          { kind: "lint", argv: ["/does-not-exist"], paths: ["src/main.js"] },
        ],
      }),
    /launch refused/,
  );
  assert.throws(
    () =>
      discover(root, {
        placements: [{ path: "loose/guide.md", home: "src/main.js" }],
      }),
    /already exists/,
  );
  assert.throws(
    () => discover(root, conventions, { profilePath: "profile.md" }),
    /choose direct/,
  );
  assert.throws(
    () =>
      discover(root, {
        placements: [{ path: "loose/guide.md", home: "src/main.js/child" }],
      }),
    /ancestor/,
  );
  writeFileSync(join(root, "direct-conventions"), "generated/obsolete.txt");
  unlinkSync(join(root, ".dotln/discovery.json"));
  assert.equal(
    discover(root, { generated: conventions.generated! }).candidates.length,
    0,
  );
});

test("WO-119 check confinement denies outside writes, outside reads and network; timeout is not a candidate", (t) => {
  const root = scratch(t);
  seed(root);
  const outside = scratch(t);
  const path = join(outside, "sentinel");
  writeFileSync(path, "private-fixture");
  const code = `const fs=require('node:fs'); for(const op of [()=>fs.readFileSync(${JSON.stringify(path)}),()=>fs.writeFileSync(${JSON.stringify(join(outside, "written"))},'x')]) { try {op();process.exit(9)} catch(e) {if(e.code!=='EPERM')throw e} } const net=require('node:net');const s=net.connect(9,'127.0.0.1');s.on('error',e=>process.exit(e.code==='EPERM'?0:8));`;
  const checks: DiscoveryConventions["checks"] = [
    {
      kind: "lint",
      argv: [process.execPath, "-e", code],
      paths: ["src/main.js"],
    },
  ];
  assert.equal(discover(root, { checks }).candidates.length, 0);
  assert.equal(existsSync(join(outside, "written")), false);
  assert.throws(
    () =>
      discover(root, {
        checks: [
          {
            ...checks[0]!,
            argv: [
              process.execPath,
              "-e",
              "process.on('SIGTERM',()=>{});setInterval(()=>{},1000)",
            ],
          },
        ],
      }),
    /within its bound/,
  );
});

test("WO-119 real script episode through fake-clock resident persists candidates and replays; live scratch Git row", async (t) => {
  const root = scratch(t);
  seed(root);
  assert.equal(
    spawnSync("/usr/bin/git", ["init", "-q", root], {
      env: {},
      encoding: "utf8",
    }).status,
    0,
  );
  const outside = scratch(t);
  const sentinel = join(outside, "sentinel");
  writeFileSync(sentinel, "synthetic-private-sentinel");
  const targetCheck = readFileSync(join(root, "checks/lint.cjs"), "utf8");
  writeFileSync(
    join(root, "checks/lint.cjs"),
    `const f = require('node:fs'); for (const op of [()=>f.readFileSync(${JSON.stringify(sentinel)}),()=>f.writeFileSync(${JSON.stringify(join(outside, "write"))},'x')]) { try { op(); process.exit(0); } catch(e) { if (e.code !== 'EPERM') throw e; } }\n` +
      targetCheck,
  );
  const store = scratch(t);
  const spec: ActorSpec = {
    kind: "script",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: { files: 1, lines: 0, tokens: 0 },
    command: [
      process.execPath,
      fileURLToPath(new URL("../src/discovery-cli.js", import.meta.url)),
      root,
    ],
    cwd: root,
    timeoutMs: 20000,
    outputContract: "work-candidates-v1",
  };
  const config = JSON.parse(
    readFileSync(
      new URL("../../fixtures/wo067-presence.json", import.meta.url),
      "utf8",
    ),
  );
  const configuration = decodeResidentConfiguration({
    ...config,
    policyId: "fixture.progressive",
    actors: Object.fromEntries(
      ["probe", "widen", "peak"].map((p) => [p, spec]),
    ),
    evidence: ["verified-input"],
  });
  let at = 0;
  const host = new ResidentHost({
    directory: store,
    policyId: configuration.policyId,
    configuration,
    now: () => at,
    capabilities: () => ["adapter.fixture"],
  });
  await host.start();
  try {
    await recordPresence(store, "away", () => at);
    at = 10;
    await host.tick();
    const events = decodeLog(host.store.read());
    const observations = events.filter(
      (e) => e.type === "ScriptEpisodeObserved",
    );
    assert.equal(observations.length, 1);
    const result = observations[0]!.payload as Record<string, unknown>;
    assert.equal(result.verified, true, JSON.stringify(result));
    const report = decodeDiscoveryReport(result.discovery);
    assert.deepEqual(projection(report), fixture.expected);
    assert.equal(existsSync(join(outside, "write")), false);
    const tampered =
      host.store
        .read()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const event = JSON.parse(line);
          if (event.type === "ScriptEpisodeObserved")
            event.payload.discovery.evidence[0].facts.exitCode = 0;
          return JSON.stringify(event);
        })
        .join("\n") + "\n";
    assert.throws(() => replayResident(tampered), /digest differs/);
    const replay = JSON.stringify(replayResident(host.store.read()));
    assert.equal(JSON.stringify(replayResident(host.store.read())), replay);
    await recordPresence(store, "returned", () => ++at);
    at += 10;
    await host.tick();
    assert.equal(
      decodeLog(host.store.read()).filter(
        (e) => e.type === "ScriptEpisodeDispatched",
      ).length,
      1,
    );
    t.diagnostic(
      JSON.stringify({
        live: "native-script-scratch-git",
        clock: "fake",
        event: "ScriptEpisodeObserved",
        candidates: projection(report),
        verified: result.verified,
        operatorAwait: false,
      }),
    );
  } finally {
    host.close();
  }
});

test("WO-119 wire rejects malformed or oversized output, wrong modes and unresolved evidence", async (t) => {
  const root = scratch(t);
  const valid = { schemaVersion: 1 as const, candidates: [], evidence: [] };
  const spec: ActorSpec = {
    kind: "script",
    effect: "repo.inspect",
    surface: "fixture.source",
    resources: {},
    command: [process.execPath, "-e", ""],
    cwd: root,
    timeoutMs: 5000,
    outputContract: "work-candidates-v1",
  };
  assert.throws(() =>
    assertActorSpec({ ...spec, expectedStdoutSha256: "a".repeat(64) }),
  );
  assert.throws(
    () =>
      decodeDiscoveryReport({
        ...valid,
        candidates: [
          {
            candidateId: "x",
            kind: "stale-generated",
            paths: ["x"],
            evidence: ["absent"],
            size: { files: 1 },
          },
        ],
      }),
    /unresolved/,
  );
  for (const output of [
    "{}\n",
    " " + JSON.stringify(valid) + "\n",
    "x".repeat(70000),
  ]) {
    const result = await actorCatalog.script.run({
      ...spec,
      command: [
        process.execPath,
        "-e",
        output.length > 65536
          ? "process.stdout.write('x'.repeat(70000))"
          : `process.stdout.write(${JSON.stringify(output)})`,
      ],
    }).completed;
    assert.equal(result.verified, false);
    assert.equal(result.discovery, undefined);
  }
  const result = await actorCatalog.script.run({
    ...spec,
    command: [
      process.execPath,
      "-e",
      `process.stdout.write(${JSON.stringify(JSON.stringify(valid) + "\n")})`,
    ],
  }).completed;
  assert.equal(result.verified, true);
  assert.equal(scriptResultVerified(spec, result), true);
  assert.throws(
    () =>
      scriptResultVerified(
        { ...spec, outputContract: undefined } as unknown as ActorSpec,
        result,
      ),
    /digest-only/,
  );
  assert.throws(
    () => scriptResultVerified(spec, { ...result, firstLine: "wrong" }),
    /first line/,
  );
});

test("WO-119 canonical output digest binds every byte and matches native SHA-256", () => {
  for (let length = 0; length < 150; length++) {
    const report = {
      schemaVersion: 1 as const,
      candidates: [],
      evidence: [
        {
          evidenceId: "test",
          source: "fixture",
          facts: { value: "漢🙂".repeat(length) },
        },
      ],
    };
    assert.equal(
      discoveryOutputSha256(report),
      createHash("sha256")
        .update(JSON.stringify(report) + "\n")
        .digest("hex"),
    );
  }
  const report = {
    schemaVersion: 1 as const,
    candidates: [],
    evidence: [
      {
        evidenceId: "test",
        source: "fixture",
        facts: { value: "x".repeat(200), exitCode: 1 },
      },
    ],
  };
  const result = {
    exitCode: 0,
    signal: null,
    reason: "completed",
    verified: true,
    stdoutSha256: discoveryOutputSha256(report),
    firstLine: JSON.stringify(report).slice(0, 160),
    discovery: report,
  };
  report.evidence[0]!.facts.exitCode = 0;
  assert.throws(
    () =>
      scriptResultVerified(
        {
          kind: "script",
          effect: "repo.inspect",
          surface: "fixture.source",
          resources: {},
          command: [process.execPath, "-e", ""],
          cwd: process.cwd(),
          outputContract: "work-candidates-v1",
        },
        result,
      ),
    /digest differs/,
  );
});

test("WO-119 default npm checks honor lifecycle scripts and package environment", (t) => {
  const root = scratch(t);
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "discovery-fixture",
      private: true,
      scripts: {
        lint: "node -e \"process.exit(process.env.npm_package_name === 'discovery-fixture' && process.env.npm_lifecycle_event === 'lint' ? 0 : 1)\"",
        pretest: 'node -e "process.exit(1)"',
        test: 'node -e "process.exit(0)"',
      },
    }),
  );
  assert.deepEqual(
    discover(root).candidates.map((c) => c.kind),
    ["failing-test"],
  );
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      private: true,
      scripts: {
        test: 'node -e "process.exit(0)"',
        posttest: 'node -e "process.exit(1)"',
      },
    }),
  );
  assert.deepEqual(
    discover(root).candidates.map((c) => c.kind),
    ["failing-test"],
  );
});

test("WO-119 resolved placements and removed generated outputs cease to be candidates", (t) => {
  const root = scratch(t);
  seed(root);
  mkdirSync(join(root, "docs"));
  renameSync(join(root, "loose/guide.md"), join(root, "docs/guide.md"));
  renameSync(join(root, "loose/helper.js"), join(root, "src/helper.js"));
  unlinkSync(join(root, "generated/obsolete.txt"));
  assert.deepEqual(
    discover(root).candidates.map((c) => c.kind),
    ["failing-lint", "failing-test", "repeated-repair"],
  );
});
