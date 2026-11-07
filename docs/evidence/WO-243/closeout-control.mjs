// The paired control for the closeout selection: one target-only and one
// mixed fixture order, each read through the checks its arm's own readers
// name at closeout. An arm is a launchpad source tree: the base revision,
// where no selection exists, or the candidate. The executor's step text is
// read from the arm's emitted executor skill; the integrate helper's list
// from the arm's own helper after an integration that took in a main change
// to launchpad machinery; the briefing's closeout block where the arm prints
// one. The arm exits 1 when a target-only order is still told to run the
// complete launchpad run or a mixed order is not, and 0 otherwise.
//
// usage: node closeout-control.mjs <arm-root> <arm-label>
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

const [armRoot, label] = process.argv.slice(2);
const { withFixture, git } = await import(
  join(armRoot, "scripts/lib/target-worktree-fixture.mjs")
);
const { write } = await import(join(armRoot, "scripts/lib/helpers.mjs"));

const kinds = (commands) =>
  commands.map((command) =>
    /target-gate\.mjs'? WO-\d{3} --review$/u.test(command)
      ? "target gate --review"
      : /target-gate\.mjs'? WO-\d{3}$/u.test(command)
        ? "target gate"
        : /test-runner\.mjs'? --review$|^npm test -- --review$/u.test(command)
          ? "complete run"
          : /test-runner\.mjs'? --document$|^npm run test:docs$/u.test(command)
            ? "document gate"
            : /^npm test$/u.test(command)
              ? "complete run (plain)"
              : command,
  );
const block = (text, heading) => {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.startsWith(heading));
  if (start < 0) return null;
  let end = start + 1;
  while (lines[end]?.startsWith("  ")) end++;
  return kinds(lines.slice(start + 1, end).map((line) => line.trim()));
};
const skill = readFileSync(
  join(armRoot, ".claude/skills/dotln-executor/SKILL.md"),
  "utf8",
);
// The executor's numbered closeout step: the one that names the complete run.
const roleStep = skill
  .split("\n")
  .find((line) => /^\d+\. .*`npm test -- --review`/u.test(line));

const run = (mixed) =>
  withFixture((f) => {
    write(
      f.main,
      f.order,
      `# WO-999 — target lifecycle fixture\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Repository:** target @ ${f.baseCommit}\n\n**Acceptance criteria (all required)**\n\n1. The registered target gate passes: \`node scripts/target-gate.mjs WO-999 --review\`.\n2. \`npm run test:docs\` is green.\n`,
    );
    write(
      f.main,
      "package.json",
      '{"private":true,"scripts":{"build":"node -e 0"}}\n',
    );
    write(f.main, "records/planning/work-order-map.md", "# Work-order map\n");
    write(
      f.main,
      "records/planning/sequence.md",
      "# Fixture sequence\n\n<!-- dotln-work-order-sequence:start -->\n- WO-999 — target lifecycle fixture\n<!-- dotln-work-order-sequence:end -->\n",
    );
    const commitMain = (message) => {
      git(f.main, "add", "-A");
      git(f.main, "-c", "maintenance.auto=false", "commit", "-qm", message);
    };
    commitMain("Order with gate criteria");
    git(f.main, "push", "-q", "origin", "main");
    f.mapClone();
    f.start();
    write(f.target, "source.txt", "target change\n");
    write(f.orderRoot, "records/evidence/WO-999/decisions.md", "# Decisions\n");
    if (mixed)
      write(
        f.orderRoot,
        "scripts/lib/fixture-local.mjs",
        "export const local = 1;\n",
      );
    write(f.main, "scripts/lib/fixture-kit.mjs", "export const kit = 1;\n");
    commitMain("Main takes a kit change");
    const integration = f.call(f.target, f.orderRoot, "worktree", [
      "integrate",
      "WO-999",
    ]);
    const started = performance.now();
    const briefing = f.resume(["briefing"]);
    const briefingMs = Math.round(performance.now() - started);
    const owed = block(integration.stdout, "Owed by this order");
    // Without an owed list, the one list the helper prints is what an
    // executor reads as the order's checks.
    const helper =
      owed ?? block(integration.stdout, "Affected checks (not run)");
    const briefed = block(
      briefing.stdout,
      "Closeout checks owed as the order stands",
    );
    return {
      case: mixed ? "mixed" : "target-only",
      integrationExitCode: integration.status,
      helperList: owed ? "owed by this order" : "affected checks",
      helper,
      briefing: briefed,
      briefingExitCode: briefing.status,
      briefingMs,
    };
  });

const cases = [run(false), run(true)];
// An order is told to run the complete launchpad run when a reader it acts
// on names that run: the briefing's selection where printed, otherwise the
// executor's step text and the helper's list.
const toldComplete = (row) =>
  row.briefing
    ? row.briefing.includes("complete run")
    : Boolean(roleStep) ||
      (row.helper ?? []).some((kind) => kind.startsWith("complete run"));
const expected = { "target-only": false, mixed: true };
const rows = cases.map((row) => ({
  ...row,
  completeRunRequested: toldComplete(row),
}));
const exitCode = rows.every(
  (row) => row.completeRunRequested === expected[row.case],
)
  ? 0
  : 1;
console.log(
  JSON.stringify({
    arm: label,
    roleStep: roleStep?.replace(/^(\d+\. [^.]*\.).*$/u, "$1") ?? null,
    exitCode,
    cases: rows,
  }),
);
process.exitCode = exitCode;
