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
    ...(run.error || run.signal ? { unavailable: true } : {}),
  };
}

/** Only a check's known difference report authorizes its writer. A crash,
 * unreadable input, failed assertion unrelated to freshness, or empty failure
 * is an unknown artifact, even though all of them have a nonzero exit code. */
function reportedStale(row, result) {
  if (result.exitCode !== 1 || result.timedOut || result.unavailable)
    return false;
  if (result.stale === true) return true;
  const output = result.output ?? "";
  if (output.split("\n").includes(`DOTLN_ARTIFACT_STALE ${row.name}`))
    return true;
  const patterns = {
    format: /^\[warn\] Code style issues found/m,
    meta: /^(?:Decisions index is stale; run npm run meta|.*register is stale; run npm run meta or npm run plan -- followups --sync)$/m,
    lineage:
      /^(?:Stale|Missing) [^\n]+; run node scripts\/lineage\.mjs index$/m,
    index:
      /^[^\n]+(?: is stale at line \d+|: missing or malformed tag snapshot); run npm run work-orders -- index$/m,
    siblings:
      /^[^\n]+(?: is stale at line \d+|: the [^\n]+ entry records manifest hash [^\n]+|: (?:missing|invalid) tag observations|: observations do not match receipt commits|: [a-f0-9]+ records (?:tag|nearest) [^\n]+, which is not a Git tag (?:at|at or below) its receipt commit); run node scripts\/siblings\.mjs index$/m,
    harness: /^harness drift:/m,
    "authority-evidence":
      /stale [^\n]+ evidence: [^\n]+; select a new edition or revision to preserve existing evidence/,
    "artifact-evidence":
      /stale artifact evidence: [^\n]+; select a new edition to preserve the historical evidence/,
    "verification-evidence": /stale verification evidence:/,
    "feedback-evidence":
      /feedback evidence is stale(?:\n|: a compiler release moved the policy hash)|^StaleFeedbackEdition \[Error\]: feedback evidence is stale:/m,
    "console-fixtures":
      /console selfhost fixture must follow the selected feedback edition; run npm run sync|console fixture changed: [^\n]+/,
  };
  if (row.name === "publication") {
    const failures = output
      .split("\n")
      .filter((line) => line.startsWith("FAIL "));
    return (
      failures.length === 1 &&
      /^FAIL \d+ edition\(s\) are stale$/.test(failures[0])
    );
  }
  if (row.name === "release-surfaces") {
    const failures = output
      .split("\n")
      .filter((line) => line.startsWith("FAIL "));
    return (
      failures.length > 0 &&
      failures.every((line) =>
        /^FAIL (?:release-block|workspace-pin)[: ]/.test(line),
      )
    );
  }
  return patterns[row.name]?.test(output) ?? false;
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
        stale: observation.current === false,
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
    stale: reportedStale(row, result),
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
  if (!runtime || !checkArtifact(runtime, root, run).stale) return [];
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
