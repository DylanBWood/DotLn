// VER-001 reproduction: an amendment the previous release bound over an order
// that gained a leading Workstream line together with a non-append change.
// Exit 1 while the subject refuses a binding the base reader admits.
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
const { sha256 } = await import(join(root, "scripts/lib/plan-subject.mjs"));
const { runner, linkDependencies, fixtureEnvironment } = await import(
  join(root, "scripts/fixtures/instance-with-history/support.mjs")
);
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo232-ver001-")),
);
const result = { baseline, unit: [], instance: [] };
try {
  // Arm 1: the readers themselves. The base module resolves its imports from
  // this checkout; plan-continuation.mjs is the only one the subject changes.
  writeFileSync(
    join(scratch, "base-plan-continuation.mjs"),
    baseBytes("scripts/lib/plan-continuation.mjs")
      .toString("utf8")
      .replaceAll('from "./', `from "${join(root, "scripts/lib")}/`)
      .replace(
        'from "prettier/plugins/markdown.mjs"',
        `from "${join(root, "node_modules/prettier/plugins/markdown.mjs")}"`,
      ),
  );
  const base = await import(join(scratch, "base-plan-continuation.mjs"));
  const head = await import(join(root, "scripts/lib/plan-continuation.mjs"));
  const filed =
    "# WO-013 — Synthetic order\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n**Cost:** one record.\n**Depends on:** nothing\n\n**Objective:** Retain the original shape.\n\n**Acceptance criteria (all required)**\n\n1. Retain the record.\n\n**Non-goals:** none.\n";
  const field = (text) =>
    text.replace("**Model:**", "**Workstream:** WS-001\n**Model:**");
  const objective = (text) => text.replace("original shape", "approved shape");
  // amendPlanOrder's binding, computed by the given release's reader.
  const bind = (reader, current) => {
    const amended = reader.executionAmendmentSource(current, filed);
    return {
      sourceOrderHash: sha256(reader.executionAmendmentSource(filed)),
      orderHash: sha256(amended),
      orderLength: amended.length,
    };
  };
  for (const [name, bound, current] of [
    [
      "field and objective bound by the base reader",
      field(objective(filed)),
      field(objective(filed)),
    ],
    ["field alone bound by the base reader", field(filed), field(filed)],
    [
      "objective bound by the base reader, field added later",
      objective(filed),
      field(objective(filed)),
    ],
  ]) {
    const row = bind(base, bound);
    result.unit.push({
      case: name,
      base: base.matchesExecutionAmendment(filed, current, row),
      subject: head.matchesExecutionAmendment(filed, current, row),
    });
  }

  // Arm 2: the committed history instance, emulated at the base readers,
  // binds WO-004's field and objective with amend-order and then takes the
  // subject's readers. WO-001 and WO-002 return to their bound bytes and leave
  // WS-001 so the base workstream reader can read the document.
  const c = runner(fixtureEnvironment());
  const bundle = join(
    root,
    "scripts/fixtures/instance-with-history/instance.bundle",
  );
  const instance = join(scratch, "instance"),
    target = join(scratch, "target");
  c.git(scratch, "clone", "-q", "--branch", "main", bundle, instance);
  c.git(scratch, "clone", "-q", "--branch", "fixture-target", bundle, target);
  c.git(target, "branch", "-m", "main");
  for (const clone of [instance, target]) c.configure(clone);
  c.node(instance, "worktree", "clone", "target", target);
  linkDependencies(instance, root);
  const install = (arm) => {
    for (const path of readers)
      writeFileSync(
        join(instance, path),
        arm === "base" ? baseBytes(path) : readFileSync(join(root, path)),
      );
  };
  const edit = (path, from, to) =>
    writeFileSync(
      join(instance, path),
      readFileSync(join(instance, path), "utf8").replace(from, to),
    );
  const step = (name, args) => {
    const run = c.run(instance, process.execPath, args);
    result.instance.push({
      step: name,
      command: `node ${args.join(" ")}`,
      exitCode: run.status,
      refusal:
        `${run.stdout}${run.stderr}`
          .split("\n")
          .find((line) => /unmatched execution amendment/u.test(line)) ?? null,
    });
    return run.status;
  };
  install("base");
  for (const id of ["WO-001", "WO-002"])
    edit(`docs/work-orders/${id}-history.md`, "**Workstream:** WS-001\n", "");
  const stream = "docs/workstreams/WS-001-history.md";
  const block = JSON.parse(
    readFileSync(join(instance, stream), "utf8")
      .split("<!-- dotln-workstream:start -->\n")[1]
      .split("\n<!-- dotln-workstream:end -->")[0],
  );
  block.members = block.members.filter(
    ({ workOrderId }) => workOrderId === "WO-004",
  );
  writeFileSync(
    join(instance, stream),
    `# WS-001 — Synthetic history\n\n<!-- dotln-workstream:start -->\n${JSON.stringify(block, null, 2)}\n<!-- dotln-workstream:end -->\n`,
  );
  appendFileSync(
    join(instance, "docs/evidence/WO-004/decisions.md"),
    `\n## WO-004-D002\n\n\`\`\`json\n${JSON.stringify(
      {
        id: "WO-004-D002",
        date: "2026-10-25",
        dispatch: "resume: next; synthetic fixture authorization",
        decision:
          "Bind the field and the grouped objective under the base reader.",
        evidence: ["Synthetic verification reproduction."],
        rejected: ["Omitting the reproduction."],
        reopenWhen: "Never; scratch only.",
      },
      null,
      2,
    )}\n\`\`\`\n`,
  );
  step("amend-order WO-004 under the base readers", [
    "scripts/refute-plan.mjs",
    "amend-order",
    "WO-004",
    "WO-004-D002",
    "Synthetic binding under the base readers",
  ]);
  c.commit(instance, "probe: bind under the base readers");
  step("plan check under the base readers", [
    "scripts/refute-plan.mjs",
    "check",
  ]);
  install("head");
  step("plan check under the subject's readers", [
    "scripts/refute-plan.mjs",
    "check",
  ]);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
const [amend, before, after] = result.instance;
result.regression =
  result.unit.some((row) => row.base && !row.subject) ||
  (amend?.exitCode === 0 && before?.exitCode === 0 && after?.exitCode !== 0);
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.regression ? 1 : 0;
