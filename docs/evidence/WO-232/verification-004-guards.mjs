// VER-004 reproduction: three guards of the Workstream admission that no
// permanent plan-refutation case protects. For each guard, part 1 shows an
// input the subject refuses and the guard's mutant admits; part 2 runs the
// permanent Workstream amendment cases, unchanged, against the subject and the
// mutant. Exits 1 while a mutant passes every permanent case. Writes only to
// system temp.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
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
import { sha256 } from "../../../scripts/lib/plan-subject.mjs";
import * as subject from "../../../scripts/lib/plan-continuation.mjs";
import { fixtureEnvironment } from "../../../scripts/fixtures/instance-with-history/support.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const sourcePath = "scripts/lib/plan-continuation.mjs";
const source = readFileSync(join(root, sourcePath), "utf8");
const guards = {
  "the filed order lacked the field": ["before.indices.length === 0 &&", ""],
  "exactly one added field": [
    "after.indices.length === 1 &&",
    "after.indices.length >= 1 &&",
  ],
  "the field is in the leading header": [
    "index > first && index < end &&",
    "index > first &&",
  ],
};
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-wo232-ver004-")),
);
const result = { matcher: [], permanent: [] };
try {
  cpSync(join(root, "scripts"), join(scratch, "scripts"), {
    recursive: true,
    filter: (path) => !path.endsWith("/instance-with-history/instance.bundle"),
  });
  cpSync(join(root, "docs"), join(scratch, "docs"), {
    recursive: true,
    filter: (path) =>
      !path.includes("/docs/intake") && !path.includes("/docs/control/local"),
  });
  for (const name of ["packages", "node_modules", "package.json"])
    symlinkSync(join(root, name), join(scratch, name));
  const mutants = {};
  for (const [index, [name, [from, to]]] of Object.entries(guards).entries()) {
    assert.ok(source.includes(from), `guard anchor missing: ${from}`);
    const bytes = source.replace(from, to);
    const file = join(
      scratch,
      `scripts/lib/plan-continuation.mutant-${index}.mjs`,
    );
    writeFileSync(file, bytes);
    mutants[name] = { bytes, module: await import(file) };
  }

  // 1. One input per guard, bound by each implementation's own writer.
  const text = readFileSync(
    join(
      root,
      "docs/work-orders/WO-231-final-review-lint-from-the-described-base.md",
    ),
    "utf8",
  ).replace(/ \(v0\.97\.1\)(?=\n)/u, "");
  const label = (t) => t.replace(/^(# [^\n]+)/u, "$1 (v1.2.3)");
  const field = (t, id) =>
    t.replace("**Track:**", `**Workstream:** ${id}\n**Track:**`);
  const criterion = (t) =>
    t.replace(
      "1. In the target-worktree start fixture",
      "1. In the amended target-worktree start fixture",
    );
  const cases = {
    "the filed order lacked the field": (() => {
      const filed = field(text, "WS-001");
      const amended = label(criterion(filed));
      return { filed, amended, after: amended.replace("WS-001", "WS-002") };
    })(),
    "exactly one added field": (() => {
      const amended = label(field(text, "WS-001"));
      return {
        filed: text,
        amended,
        after: amended.replace(
          "**Workstream:** WS-001\n",
          "**Workstream:** WS-002\n**Workstream:** WS-001\n",
        ),
      };
    })(),
    "the field is in the leading header": (() => {
      const amended = label(criterion(text));
      return {
        filed: text,
        amended,
        after: amended.replace(
          "\n2. The two existing cases",
          "\n**Workstream:** WS-001\n2. The two existing cases",
        ),
      };
    })(),
  };
  const bind = (m, filed, amended) => {
    const bound = m.executionAmendmentSource(amended, filed);
    return {
      sourceOrderHash: sha256(m.executionAmendmentSource(filed)),
      orderHash: sha256(bound),
      orderLength: bound.length,
    };
  };
  for (const [guard, { filed, amended, after }] of Object.entries(cases))
    result.matcher.push({
      guard,
      subjectAdmits: subject.matchesExecutionAmendment(
        filed,
        after,
        bind(subject, filed, amended),
      ),
      mutantAdmits: mutants[guard].module.matchesExecutionAmendment(
        filed,
        after,
        bind(mutants[guard].module, filed, amended),
      ),
    });

  // 2. The permanent cases, unchanged, against each implementation.
  writeFileSync(
    join(scratch, "selected.test.mjs"),
    'import { fixtures } from "./scripts/test-plan-refutation.mjs";\nawait fixtures();\n',
  );
  for (const [arm, bytes] of [
    ["subject", source],
    ...Object.entries(mutants).map(([name, { bytes }]) => [name, bytes]),
  ]) {
    writeFileSync(join(scratch, sourcePath), bytes);
    const run = spawnSync(
      process.execPath,
      [
        "--test",
        "--test-name-pattern=^(a field-only Workstream|a previous reader's Workstream|a later leading Workstream|a legacy amendment)",
        join(scratch, "selected.test.mjs"),
      ],
      {
        cwd: scratch,
        env: fixtureEnvironment(),
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      },
    );
    assert.ifError(run.error);
    const output = run.stdout + run.stderr;
    result.permanent.push({
      arm,
      exitCode: run.status,
      pass: Number(output.match(/^ℹ pass (\d+)/mu)?.[1]),
      fail: Number(output.match(/^ℹ fail (\d+)/mu)?.[1]),
    });
    if (arm === "subject") assert.equal(run.status, 0, output.slice(-4000));
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
result.unprotected = result.permanent
  .filter((row) => row.arm !== "subject" && row.exitCode === 0)
  .map((row) => row.arm);
console.log(JSON.stringify(result, null, 2));
assert.ok(
  result.matcher.every((row) => !row.subjectAdmits && row.mutantAdmits),
  "each mutant must change behavior the subject refuses",
);
process.exitCode = result.unprotected.length ? 1 : 0;
