import { spawnSync, execFileSync } from "node:child_process";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import {
  canonicalStringify,
  feedbackMaturity,
  type CompiledFeedback,
  type FeedbackObservation,
} from "@dotln/compiler";
import { feedbackContentHash } from "./feedback-boundary.js";

export const FEEDBACK_SOURCE_PATHS = [
  "package-lock.json",
  "packages/skeleton/package.json",
  "packages/compiler/src/feedback.ts",
  "packages/compiler/src/artifact-identity.ts",
  "packages/compiler/src/verification.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/feedback-audit.ts",
  "packages/skeleton/src/feedback-selfhost.ts",
  "packages/skeleton/src/reactor.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/worker-transport.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/test/feedback-fixtures.test.ts",
  "scripts/feedback-commit-msg.mjs",
] as const;
export function readFeedbackSource(root: string) {
  const physical = realpathSync(root);
  const gitRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: physical,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 5000,
  }).trim();
  if (realpathSync(gitRoot) !== physical)
    throw new Error("feedback requires the Git root");
  const files = FEEDBACK_SOURCE_PATHS.map((path) => {
    const absolute = resolve(physical, path);
    if (realpathSync(absolute) !== absolute || !lstatSync(absolute).isFile())
      throw new Error("feedback source must be a contained regular file");
    return { path, contents: readFileSync(absolute, "utf8") };
  });
  return { files, subject: feedbackContentHash(canonicalStringify(files)) };
}
export function feedbackContextAccounting(
  program: CompiledFeedback,
  baseline: {
    readonly files: readonly {
      readonly lines: number;
      readonly bytes: number;
    }[];
  },
) {
  const size = (value: string) => ({
    files: 1,
    lines: value.split("\n").length - 1,
    bytes: Buffer.byteLength(value, "utf8"),
  });
  const prose =
    program.units.map((unit) => unit.proseEquivalent).join("\n") + "\n";
  const residue = `Feedback policy ${program.policyHash} is enforced by the host; refusals identify unmet conditions.\n`;
  const commonBaseline = {
    files: baseline.files.length,
    lines: baseline.files.reduce((sum, file) => sum + file.lines, 0),
    bytes: baseline.files.reduce((sum, file) => sum + file.bytes, 0),
  };
  const proseEquivalent = size(prose),
    compiledResidue = size(residue);
  return {
    method:
      "WO-004 UTF-8 instruction-file bytes and physical lines; matched common baseline plus one task-local projection",
    baselineRef:
      "docs/discovery/environment.json#claudeCode.startupContext.files",
    commonBaseline,
    proseEquivalent,
    compiledResidue,
    beforeBytes: commonBaseline.bytes + proseEquivalent.bytes,
    afterBytes: commonBaseline.bytes + compiledResidue.bytes,
    savedBytes: proseEquivalent.bytes - compiledResidue.bytes,
    limits:
      "Counterfactual instruction projection, not effective-session tokens or total workflow cost. Verifier source/evidence context and tool schemas are outside this matched comparison.",
  };
}
export function runFeedbackRegressions(
  root: string,
  program: CompiledFeedback,
) {
  const source = readFeedbackSource(root);
  const fixture = "packages/skeleton/dist/test/feedback-fixtures.test.js";
  const run = (unitId: string, removed: boolean) => {
    const name = `WO-011 regression ${unitId}`;
    const env = { ...process.env };
    delete env.DOTLN_FEEDBACK_ABLATE;
    // An independent test subprocess must not inherit its parent's test-runner IPC mode.
    delete env.NODE_TEST_CONTEXT;
    if (removed) env.DOTLN_FEEDBACK_ABLATE = unitId;
    const args = ["--test", `--test-name-pattern=^${name}$`, fixture];
    const result = spawnSync(process.execPath, args, {
      cwd: root,
      env,
      encoding: "utf8",
      timeout: 30_000,
      maxBuffer: 1_000_000,
    });
    if (result.error || result.signal)
      throw new Error("feedback regression subprocess unavailable");
    const output = result.stdout;
    const passed = Number(output.match(/^# pass (\d+)$/mu)?.[1] ?? -1);
    const failed = Number(output.match(/^# fail (\d+)$/mu)?.[1] ?? -1);
    const expected = removed
      ? result.status === 1 &&
        passed === 0 &&
        failed === 1 &&
        output.includes(`- ${name}`) &&
        /code: 'ERR_ASSERTION'/u.test(output)
      : result.status === 0 && passed === 1 && failed === 0;
    if (!expected)
      throw new Error(
        `feedback fixture gate failed: ${unitId} ${removed ? "removed" : "present"}`,
      );
    return {
      command: `node ${args.join(" ")}`,
      mechanism: removed ? "removed" : "present",
      exitCode: result.status,
      passed,
      failed,
      captured: output
        .split("\n")
        .filter(
          (line) =>
            new RegExp(`^(?:not )?ok \\d+ - ${name}$`, "u").test(line) ||
            /^\s+(?:code: 'ERR_ASSERTION'|operator: )/u.test(line) ||
            /^# (?:pass|fail) /u.test(line),
        ),
    };
  };
  const fixtures = program.units.map((unit) => ({
    unitId: unit.unitId,
    present: run(unit.unitId, false),
    removed: run(unit.unitId, true),
  }));
  if (readFeedbackSource(root).subject !== source.subject)
    throw new Error("feedback source changed during audit");
  const baseline = JSON.parse(
    readFileSync(resolve(root, "docs/discovery/environment.json"), "utf8"),
  );
  const context = feedbackContextAccounting(
    program,
    baseline.claudeCode.startupContext,
  );
  if (context.savedBytes <= 0)
    throw new Error("feedback context did not decrease");
  const observations: FeedbackObservation[] = fixtures.map((fixture) => ({
    unitId: fixture.unitId,
    episodeId: `regression_${fixture.unitId}`,
    source: "fixture",
    activated: true,
    prevented: true,
    falseActivation: false,
    overridden: false,
  }));
  return {
    contractVersion: "feedback-audit-v1",
    policyHash: program.policyHash,
    subject: source.subject,
    fixtures,
    context,
    maturityMethod:
      "One isolated causal regression episode per unit, established by its present/removal pair. Counters describe those selected prevention episodes only; internal assertions and separate false-positive probes are not a population estimate.",
    maturity: feedbackMaturity(program, observations),
  };
}
export type FeedbackAuditReport = ReturnType<typeof runFeedbackRegressions>;
