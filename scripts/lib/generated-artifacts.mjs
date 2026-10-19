import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { isKitRoot } from "../../packages/skeleton/src/runtime-inputs.mjs";
import { buildFreshness } from "./build-freshness.mjs";

export const STRUCTURAL_TASKS = [
  "format",
  "configuration-root",
  "registrations",
  "declarations",
  "generated",
  "host",
];

/** The generated artifacts a selection's own build phase makes current: the
 * compiled runtime and the installed harness. A focused selection judges
 * only these; publication and bookkeeping artifacts are inputs of the
 * complete and document selections, not of one suite. */
export const BUILD_PHASE_ARTIFACTS = Object.freeze(["runtime", "harness"]);
const node = (file, ...args) => [process.execPath, file, ...args];
const artifact = (name, file, checkArgs, writeArgs, extra = {}) => ({
  name,
  check: node(file, ...checkArgs),
  ...(writeArgs ? { write: node(file, ...writeArgs) } : {}),
  timeoutMs: 30_000,
  ...extra,
});

/** The gate and sync share this inventory: sync uses its writers, and a
 * selection compiles a stale runtime with the runtime writer before
 * capturing its subject. */
export function generatedArtifacts(root) {
  const core = !isKitRoot(root);
  return [
    ...(core
      ? [
          {
            name: "runtime",
            inspect: () => buildFreshness(root),
            write: node("scripts/build.mjs"),
            timeoutMs: 120_000,
          },
        ]
      : [
          artifact("runtime", "scripts/launchpad.mjs", ["verify"], null, {
            route:
              "Restore the compiled runtime from its verified kit export or update; this kit does not carry package sources to rebuild it.",
          }),
        ]),
    artifact("meta", "scripts/meta.mjs", ["--check"], []),
    artifact("lineage", "scripts/lineage.mjs", ["index", "--check"], ["index"]),
    artifact(
      "index",
      "scripts/work-orders.mjs",
      ["index", "--check"],
      ["index"],
    ),
    artifact(
      "release-surfaces",
      "scripts/release.mjs",
      ["check-surfaces", "--local"],
      ["sync-surfaces"],
    ),
    artifact(
      "siblings",
      "scripts/siblings.mjs",
      ["index", "--check"],
      ["index"],
    ),
    artifact("harness", "scripts/harness.mjs", ["check"], ["emit"]),
    ...(core
      ? [
          {
            name: "role-oracle",
            check: node("scripts/check-role-oracle.mjs"),
            timeoutMs: 30_000,
            route:
              "Record the authorizing role-change decision and mint a new linked role oracle; historical snapshots stay byte-exact.",
          },
          ...[
            [
              "authority-evidence",
              "authority",
              "scripts/authority-evidence.mjs",
            ],
            [
              "artifact-evidence",
              "artifact-identity",
              "scripts/artifact-identity-evidence.mjs",
            ],
            [
              "verification-evidence",
              "verification",
              "scripts/verification-evidence.mjs",
            ],
            ["feedback-evidence", "feedback", "scripts/feedback-evidence.mjs"],
          ].map(([name, kind, file]) =>
            artifact(name, file, ["--check"], null, { kind, file }),
          ),
          artifact(
            "harness-evidence",
            "scripts/harness-evidence.mjs",
            [],
            null,
            {
              route:
                "Repair the generated harness or its evidence inputs; the historical live harness observations are immutable.",
            },
          ),
          artifact(
            "console-fixtures",
            "scripts/console-fixtures.mjs",
            ["--check-current-selfhost"],
            null,
            {
              regenerate(root, run) {
                const pin = run(
                  node(
                    "scripts/console-fixtures.mjs",
                    "--record-current-selfhost",
                  ),
                  root,
                  30_000,
                );
                return pin.exitCode
                  ? pin
                  : run(
                      node("scripts/console-fixtures.mjs", "--write"),
                      root,
                      30_000,
                    );
              },
            },
          ),
          artifact(
            "baseline-fingerprints",
            "scripts/comment-labels.mjs",
            [],
            null,
            {
              route:
                "Repair the source or use the authorized baseline-review route; sync never mints baseline fingerprints.",
            },
          ),
        ]
      : []),
    artifact("publication", "scripts/check-publication.mjs", [], null, {
      publication: true,
    }),
  ];
}

export function runArtifactCommand(command, root, timeoutMs = 30_000) {
  const started = Date.now();
  const env = { ...process.env };
  // A child --test invocation must discover its own tests, even when sync
  // is exercised by a parent test process.
  delete env.NODE_TEST_CONTEXT;
  const run = spawnSync(command[0], command.slice(1), {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 8 * 1024 * 1024,
  });
  return {
    exitCode: run.status ?? 1,
    durationMs: Date.now() - started,
    output: `${run.stdout ?? ""}${run.stderr ?? ""}${run.error ? `\n${run.error.message}` : ""}`,
    ...(run.error?.code === "ETIMEDOUT" ? { timedOut: true } : {}),
  };
}

export function checkArtifact(row, root, run = runArtifactCommand) {
  const startedAt = new Date().toISOString();
  const started = Date.now();
  let result;
  try {
    if (row.inspect) {
      const observation = row.inspect(root);
      result = {
        exitCode: observation.current ? 0 : 1,
        durationMs: Date.now() - started,
        output: observation.reason ?? "",
      };
    } else result = run(row.check, root, row.timeoutMs);
  } catch (error) {
    result = {
      exitCode: 1,
      durationMs: Date.now() - started,
      output: error.message,
    };
  }
  return {
    ...result,
    name: row.name,
    executed: true,
    startedAt,
    finishedAt: new Date().toISOString(),
  };
}

/** Compile a stale runtime with its own writer before a selection captures
 * its subject, so an ordinary package edit reaches the suites instead of a
 * refusal to run npm run sync first. A root without package sources carries
 * its runtime and has nothing to compile. The build's exit code is reported,
 * never thrown; the structural check still judges the artifact. The
 * installed harness is judged but never written here: live hooks change only
 * through the explicit sync step. Returns one row when it compiled. */
export function compileStaleRuntime(root, { run = runArtifactCommand } = {}) {
  if (isKitRoot(root) || !existsSync(join(root, "packages/skeleton/src")))
    return [];
  const runtime = generatedArtifacts(root).find(
    (row) => row.name === "runtime" && Array.isArray(row.write),
  );
  if (!runtime || checkArtifact(runtime, root, run).exitCode === 0) return [];
  const built = run(runtime.write, root, runtime.timeoutMs ?? 120_000);
  return [{ name: "runtime", exitCode: built.exitCode }];
}

export function checkGenerated(
  root,
  { artifacts = generatedArtifacts(root), run = runArtifactCommand } = {},
) {
  const cases = artifacts.map((row) => checkArtifact(row, root, run));
  const stale = cases
    .filter((row) => row.exitCode !== 0)
    .map((row) => row.name);
  return { exitCode: stale.length ? 1 : 0, stale, cases };
}
