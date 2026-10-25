// VER-002 reproduction: a judged order whose only change from its filed bytes
// is one added leading Workstream field, with no active amendment. The base
// readers bind it with amend-order; exit 1 while the subject leaves the plan
// gate refusing that change with no execution route.
import { execFileSync } from "node:child_process";
import {
  appendFileSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const baseline = "a81561976c8629834a5a18623b097fa4d7d8681a";
const readers = [
  "scripts/lib/plan-continuation.mjs",
  "scripts/lib/work-order-workstream.mjs",
  "scripts/work-orders.mjs",
];
const baseBytes = (path) =>
  execFileSync("git", ["-C", root, "show", `${baseline}:${path}`]);
const { runner, linkDependencies, fixtureEnvironment } = await import(
  join(root, "scripts/fixtures/instance-with-history/support.mjs")
);
const bundle = join(
  root,
  "scripts/fixtures/instance-with-history/instance.bundle",
);
const result = { baseline, orders: {} };
const refusal = (text) =>
  text
    .split("\n")
    .filter((line) => /amendment|changed|refus|must|Error/u.test(line))
    .at(-1) ?? null;

// WO-002 is a closed self member; WO-004 is an open target member, which the
// workstream check requires to declare the field. Both are judged by the
// bundle's only planning receipt.
for (const id of ["WO-002", "WO-004"]) {
  result.orders[id] = {};
  // base: v0.97.1's readers throughout; subject: this checkout's readers;
  // base-bound: v0.97.1 binds, then this checkout's readers check the record;
  // control: this checkout's readers over the filed bytes without the field.
  for (const arm of ["base", "subject", "base-bound", "control"]) {
    const scratch = realpathSync(
      mkdtempSync(join(tmpdir(), "dotln-wo232-ver002-")),
    );
    const steps = [];
    result.orders[id][arm] = steps;
    try {
      const c = runner(fixtureEnvironment());
      const instance = join(scratch, "instance"),
        target = join(scratch, "target");
      c.git(scratch, "clone", "-q", "--branch", "main", bundle, instance);
      c.git(
        scratch,
        "clone",
        "-q",
        "--branch",
        "fixture-target",
        bundle,
        target,
      );
      c.git(target, "branch", "-m", "main");
      for (const clone of [instance, target]) c.configure(clone);
      c.node(instance, "worktree", "clone", "target", target);
      linkDependencies(instance, root);
      const install = (which) => {
        for (const path of readers)
          writeFileSync(
            join(instance, path),
            which === "base" ? baseBytes(path) : readFileSync(join(root, path)),
          );
      };
      const step = (name, args) => {
        const run = c.run(instance, process.execPath, args);
        steps.push({
          step: name,
          command: `node ${args.join(" ")}`,
          exitCode: run.status,
          refusal:
            run.status === 0 ? null : refusal(`${run.stdout}${run.stderr}`),
        });
      };
      const rows = readFileSync(
        join(instance, "docs/control/plan-refutations.jsonl"),
        "utf8",
      )
        .trim()
        .split("\n")
        .map(JSON.parse);
      const ordinal =
        rows.findIndex(
          (row) =>
            row.type === "PlanExecutionAmended" && row.workOrderId === id,
        ) + 1;
      const { receiptId } = rows[ordinal - 1];
      const { revision } = JSON.parse(
        readFileSync(
          join(instance, `docs/planning/refutations/${receiptId}.json`),
          "utf8",
        ),
      ).subject;
      const path = `docs/work-orders/${id}-history.md`;
      install(["subject", "control"].includes(arm) ? "subject" : "base");
      // Leave the order without an active binding, at its filed bytes plus
      // the one field.
      step("withdraw the order's amendment", [
        "scripts/refute-plan.mjs",
        "amend-order",
        id,
        "--withdraw",
        String(ordinal),
        "VER-002 probe: no active amendment",
      ]);
      const filed = `${c.git(instance, "show", `${revision}:${path}`)}\n`;
      writeFileSync(
        join(instance, path),
        arm === "control"
          ? filed
          : filed.replace("**Model:**", "**Workstream:** WS-001\n**Model:**"),
      );
      steps.push({
        step:
          arm === "control"
            ? "filed bytes"
            : "filed bytes plus one leading field",
        filedLacksField: !/^\*\*Workstream:\*\*/mu.test(filed),
      });
      if (arm === "control") {
        // An open member without the field refuses, so the ungrouped control
        // also leaves the document.
        const stream = join(instance, "docs/workstreams/WS-001-history.md");
        const [head, rest] = readFileSync(stream, "utf8").split(
          "<!-- dotln-workstream:start -->\n",
        );
        const [block, tail] = rest.split("\n<!-- dotln-workstream:end -->");
        const parsed = JSON.parse(block);
        parsed.members = parsed.members.filter(
          (member) => member.workOrderId !== id,
        );
        writeFileSync(
          stream,
          `${head}<!-- dotln-workstream:start -->\n${JSON.stringify(parsed, null, 2)}\n<!-- dotln-workstream:end -->${tail}`,
        );
      }
      appendFileSync(
        join(instance, `docs/evidence/${id}/decisions.md`),
        `\n## ${id}-D009\n\n\`\`\`json\n${JSON.stringify(
          {
            id: `${id}-D009`,
            date: "2026-10-25",
            dispatch: "resume: verify; synthetic probe authorization",
            decision: `Group ${id} under WS-001 by its Workstream field.`,
            evidence: ["Synthetic verification probe."],
            rejected: ["Omitting the probe."],
            reopenWhen: "Never; scratch only.",
          },
          null,
          2,
        )}\n\`\`\`\n`,
      );
      c.commit(instance, "probe: group the order by its field");
      step("plan check before amend-order", [
        "scripts/refute-plan.mjs",
        "check",
      ]);
      if (arm === "control") continue;
      step("amend-order (field only)", [
        "scripts/refute-plan.mjs",
        "amend-order",
        id,
        `${id}-D009`,
        "VER-002 probe: field-only grouping",
      ]);
      if (arm === "base-bound") install("subject");
      c.commit(instance, "probe: after amend-order");
      step("plan check after amend-order", [
        "scripts/refute-plan.mjs",
        "check",
      ]);
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  }
}
// The base arm's own plan check also refuses this bundle's unrelated WO-001
// binding, which the subject's writer made; its amend-order step and the
// base-bound arm show the route main had.
const exit = (steps, name) => steps.find((row) => row.step === name)?.exitCode;
result.regression = Object.values(result.orders).some(
  (arms) =>
    exit(arms.base, "amend-order (field only)") === 0 &&
    exit(arms["base-bound"], "plan check after amend-order") === 0 &&
    exit(arms.control, "plan check before amend-order") === 0 &&
    exit(arms.subject, "plan check after amend-order") !== 0,
);
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.regression ? 1 : 0;
