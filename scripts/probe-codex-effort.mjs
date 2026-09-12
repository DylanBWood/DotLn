import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalWorkerArgs } from "../packages/skeleton/dist/src/worker-transport.js";
import {
  LiveReactorDriver,
  startScenario,
} from "../packages/skeleton/dist/src/scenario.js";
import {
  commandFromState,
  workOrderFromState,
} from "../packages/skeleton/dist/src/reactor.js";
import {
  decodeUsageSource,
  usageObservation,
} from "../packages/skeleton/src/usage-observation.mjs";

// Live, operator-approved discovery only. Raw CLI output stays in memory;
// positive projections exclude credentials, provider ids and private paths.
const root = realpathSync(
  resolve(dirname(fileURLToPath(import.meta.url)), ".."),
);
const [flag, output, ...extra] = process.argv.slice(2);
assert.equal(
  flag,
  "--out",
  "usage: node scripts/probe-codex-effort.mjs --out <new-json-file>",
);
assert.ok(output && !extra.length);
const destination = resolve(root, output);
assert.ok(destination.startsWith(root + "/") && !existsSync(destination));
const run = (args, cwd, input) =>
  spawnSync("codex", args, {
    cwd,
    input,
    encoding: "utf8",
    timeout: 90_000,
    maxBuffer: 1_000_000,
  });
const versionRun = run(["--version"], root);
assert.equal(versionRun.status, 0);
const version = versionRun.stdout.match(/\b\d+\.\d+\.\d+\b/u)?.[0];
assert.ok(version);
const cwd = realpathSync(mkdtempSync(join(tmpdir(), "dotln-effort-probe-")));
const startedAt = new Date().toISOString();
try {
  assert.equal(spawnSync("git", ["init", "--quiet", cwd]).status, 0);
  const schemaPath = join(cwd, "result.json");
  const schema = {
    type: "object",
    properties: { ok: { type: "boolean", enum: [true] } },
    required: ["ok"],
    additionalProperties: false,
  };
  writeFileSync(schemaPath, JSON.stringify(schema), { mode: 0o600 });
  const driver = new LiveReactorDriver();
  startScenario(driver);
  const request = {
    command: commandFromState(driver.state),
    workOrder: workOrderFromState(driver.state),
    artifactIdentity: driver.state.artifactIdentity,
    episodeId: "effort_probe",
    model: "gpt-6-astra",
    effort: "unknown",
    cwd,
    fixture: JSON.parse(
      readFileSync(
        join(root, "packages/skeleton/fixtures/repo-tree.json"),
        "utf8",
      ),
    ),
    profile: {
      profileId: "fixture-inspection-v1",
      mounts: [{ path: cwd, access: "read" }],
    },
  };
  const baseline = canonicalWorkerArgs("codex-cli-exec", request, schemaPath);
  const rows = [];
  for (const effort of ["low", "medium", "high", "xhigh", "max"]) {
    const args = [
      ...baseline.slice(0, -1),
      "-c",
      `model_reasoning_effort="${effort}"`,
      "-",
    ];
    const start = Date.now();
    const result = run(
      args,
      cwd,
      'Return exactly {"ok":true}. Do not use tools.\n',
    );
    const events = decodeUsageSource(result.stdout ?? "");
    const messages = events.filter(
      (e) => e.type === "item.completed" && e.item?.type === "agent_message",
    );
    let validResult = false;
    try {
      validResult =
        JSON.stringify(JSON.parse(messages.at(-1)?.item?.text)) ===
        '{"ok":true}';
    } catch {
      /* retain a refused/blocked row */
    }
    const complete = events.some((e) => e.type === "turn.completed");
    const failure = events.some((e) =>
      ["error", "turn.failed"].includes(e.type),
    );
    const effortFields = [];
    const visit = (value, path = "") => {
      if (!value || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        if (/effort/i.test(key))
          effortFields.push({
            field: path + key,
            value: [
              "low",
              "medium",
              "high",
              "xhigh",
              "max",
              "unknown",
            ].includes(child)
              ? child
              : "unrecognized",
          });
        visit(child, path + key + ".");
      }
    };
    events.forEach((e) => visit(e));
    const diagnostic = (result.stderr ?? "") + (result.stdout ?? "");
    const unavailable =
      /(?:invalid|unsupported|not supported|unknown variant).{0,100}(?:effort|low|medium|high|xhigh|max)|effort.{0,100}(?:invalid|unsupported|not supported)/isu.test(
        diagnostic,
      );
    const accepted = result.status === 0 && validResult && complete && !failure;
    const row = {
      effort,
      classification: accepted
        ? "observed"
        : unavailable
          ? "unavailable"
          : "blocked",
      accepted,
      exitCode: result.status,
      durationMs: Date.now() - start,
      command: [
        "codex",
        ...args.map((a) =>
          a === cwd
            ? "<temporary-git-root>"
            : a === schemaPath
              ? "<schema.json>"
              : a,
        ),
      ],
      eventTypes: [
        ...new Set(
          events
            .map((e) => e.type)
            .filter((t) =>
              [
                "thread.started",
                "turn.started",
                "item.started",
                "item.completed",
                "turn.completed",
                "turn.failed",
                "error",
              ].includes(t),
            ),
        ),
      ],
      result: validResult ? { ok: true } : null,
      effortFields,
      effectiveEffort: "unknown",
      selectionSource: "host-launch",
      stderrPresent: Boolean(result.stderr),
      timedOut: result.error?.code === "ETIMEDOUT",
      usage: usageObservation(events).usage,
    };
    rows.push(row);
    console.log(
      JSON.stringify({
        effort,
        classification: row.classification,
        exitCode: row.exitCode,
        durationMs: row.durationMs,
        effortFields,
      }),
    );
  }
  writeFileSync(
    destination,
    JSON.stringify(
      {
        schemaVersion: 1,
        workOrder: "WO-125",
        startedAt,
        completedAt: new Date().toISOString(),
        harness: "codex-cli",
        harnessVersion: version,
        model: "gpt-6-astra",
        scope:
          "five operator-approved synthetic CLI launches outside the parent sandbox; no effective-effort claim",
        prompt: 'Return exactly {"ok":true}. Do not use tools.',
        schema,
        rows,
      },
      null,
      2,
    ) + "\n",
    { flag: "wx" },
  );
  if (rows.some((row) => !row.accepted)) process.exitCode = 1;
} finally {
  rmSync(cwd, { recursive: true });
}
