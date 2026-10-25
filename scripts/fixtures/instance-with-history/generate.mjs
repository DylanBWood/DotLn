#!/usr/bin/env node
// Rebuild this historical subject only when a newly reported record shape
// needs it. Gates consume the committed bundle and never replay lifecycles.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { activeGateRuns, gateRunLineage } from "../../lib/gate-evidence.mjs";
import { TOOL_ROOT, defaultDocRelative as doc } from "../../lib/config.mjs";
import {
  installTargetPublicationFixture,
  publicationVocabulary,
} from "../../test-target-publication-fixture.mjs";
import {
  copyCore,
  fixtureEnvironment,
  json,
  linkDependencies,
  runner,
  write,
} from "./support.mjs";

assert.equal(
  gateRunLineage().length + activeGateRuns(TOOL_ROOT).length,
  0,
  "instance history generator refuses to run inside or alongside a live gate",
);
const destination = process.argv[2]
  ? resolve(process.argv[2])
  : dirname(fileURLToPath(import.meta.url));
const scratch = realpathSync(
  mkdtempSync(join(tmpdir(), "dotln-history-generate-")),
);
const env = fixtureEnvironment();
const c = runner(env);
const instance = join(scratch, "instance"),
  core = join(scratch, "core"),
  target = join(scratch, "target");
const actor = {
  harness: "human",
  harnessVersion: "fixture",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
};
const flags = Object.entries(actor).flatMap(([key, value]) => [
  `--${key === "harnessVersion" ? "harness-version" : key}`,
  value,
]);
const report = `# Synthetic history judgment\n\n**Actor attestation:** ${JSON.stringify(actor)}\n\n**Process cost:** unknown; cause no-session\n\n**Criterion 1:** met — synthetic history record retained.\n`;
const orderPath = (id) => doc("workOrders", `${id}-history.md`);
const read = (root, path) => readFileSync(join(root, path), "utf8");
const resume = (root, id, ...args) =>
  c.node(root, "resume", ...args, "--work-order", id);
const decision = (root, id, reason) =>
  write(
    root,
    doc("evidence", id, "decisions.md"),
    `# Decisions\n\n## ${id}-D001\n\n\`\`\`json\n${JSON.stringify({ id: `${id}-D001`, date: "2026-10-25", dispatch: "resume: next; synthetic fixture authorization", decision: reason, evidence: ["Synthetic instance history; no live judgment or operator record is copied."], rejected: ["Omitting the shape would not exercise the historical reader."], reopenWhen: "A field report adds another shape." }, null, 2)}\n\`\`\`\n`,
  );
const close = (root, id) => {
  write(
    root,
    doc("evidence", id, "handoff.md"),
    `${report}\nself-review: found 0; fixed 0; recorded 0\n`,
  );
  resume(root, id, "implementation-ready", ...flags);
  resume(root, id, "verify");
  write(root, doc("verifications", id, "VER-001.md"), report);
  resume(root, id, "verification-result", "pass", ...flags);
  resume(root, id, "final-review");
  write(root, doc("finalReviews", id, "FINAL-001.md"), report);
  resume(root, id, "final-review-result", "pass", ...flags);
  assert.equal(
    JSON.parse(resume(root, id, "status", "--json")).phase,
    "closed",
  );
};

try {
  copyCore(core, c);
  c.node(core, "launchpad", "export", instance);
  c.configure(instance);
  linkDependencies(instance);
  write(
    instance,
    doc("control", "local/terms.txt"),
    "SyntheticForbiddenHistoryTerm\n",
  );
  c.init(target);
  write(target, "source.txt", "Synthetic initial base.\n");
  const targetBase = c.commit(target, "test: initial target base");
  const origin = join(scratch, "instance.git"),
    targetOrigin = join(scratch, "target.git");
  for (const path of [origin, targetOrigin])
    c.git(scratch, "init", "--bare", "-q", "-b", "main", path);
  installTargetPublicationFixture(scratch, env, [
    { url: "https://github.com/dotln-fixture/history.git", origin },
    {
      url: "https://github.com/dotln-fixture/target.git",
      origin: targetOrigin,
    },
  ]);
  c.git(
    instance,
    "remote",
    "add",
    "origin",
    "https://github.com/dotln-fixture/history.git",
  );
  c.git(
    target,
    "remote",
    "add",
    "origin",
    "https://github.com/dotln-fixture/target.git",
  );
  c.git(target, "push", "-qu", "origin", "main");
  write(instance, "dotln.config.json", {
    ...json(instance, "dotln.config.json"),
    version: 1,
    kit: { applyInstanceActions: true },
    classes: { fixture: { checks: [], supports: [] } },
    repositories: {
      target: {
        baseBranch: "main",
        worktreeParent: "../targets",
        repositoryClass: "fixture",
        authorityProfile: {
          authorityEnvelopeId: "fixture.history",
          allowedEffects: ["repo.read", "repo.write", "repo.test"],
          deniedEffects: ["repo.push"],
          resourceLimits: {},
          requiredEvidence: [],
          expiresAt: Number.MAX_SAFE_INTEGER,
          revocationEventTypes: [],
        },
        gate: {
          commands: {
            test: {
              argv: [
                "node",
                "-e",
                "if (!require('node:fs').existsSync('source.txt')) process.exit(1)",
              ],
              timeoutMs: 5000,
            },
          },
          plain: ["test"],
          review: ["test"],
        },
      },
    },
  });
  write(
    instance,
    doc("control", "outward-vocabulary.json"),
    publicationVocabulary,
  );
  // Replace the never-activated export seed with four ordinary fixture orders.
  rmSync(join(instance, doc("workOrders", "WO-001-environment-truth.md")));
  for (const id of ["WO-001", "WO-002", "WO-003", "WO-004"]) {
    write(
      instance,
      orderPath(id),
      `# ${id} — Synthetic history\n\n**Model:** any.\n**Effort:** executor any; verifier any; reviewer any.\n${["WO-003", "WO-004"].includes(id) ? `**Repository:** target @ ${targetBase}\n` : ""}**Cost:** one synthetic record.\n**Depends on:** nothing\n\n**Objective:** Retain the original history shape.\n\n**Acceptance criteria (all required)**\n\n1. Retain the synthetic history record.\n\n**Non-goals:** Live effects or live model judgments.\n`,
    );
  }
  write(
    instance,
    doc("planning", "sequence.md"),
    `# Synthetic sequence\n\n<!-- dotln-work-order-sequence:start -->\n${[1, 2, 3, 4].map((i) => `- WO-00${i} — Synthetic history`).join("\n")}\n<!-- dotln-work-order-sequence:end -->\n`,
  );
  const ledger = doc("lineage", "idea-ledger.md");
  write(
    instance,
    ledger,
    read(instance, ledger) +
      "\n## 2026-10-25 synthetic history planning pass\n\nSynthetic judgments for a deterministic compatibility fixture.\n",
  );
  c.node(instance, "worktree", "clone", "target", target);
  c.node(instance, "work-orders", "index");
  c.node(instance, "meta");
  c.node(instance, "lineage", "index");
  c.commit(instance, "test: synthetic history plan");
  c.node(instance, "meta", "--plan-cost");
  c.commit(instance, "test: record planning cost observations");
  const prompt = JSON.parse(c.node(instance, "refute-plan", "refute"));
  write(instance, doc("control", "local/fixture-result.json"), {
    schemaVersion: "plan-goal-review-v1",
    orders: prompt.subject.orders.map(({ workOrderId }) => ({
      workOrderId,
      verdict: "aligned",
      criticalPathAndNoOp: "Synthetic fixture; no live outcome is claimed.",
      systemTraps: "Synthetic fixture considers all eight system traps.",
      removalBalance: "Unknown synthetic process cost.",
      failureBehavior: "Preserve synthetic records.",
      findings: [],
    })),
    planVerdict: "aligned",
    holdReasons: [],
  });
  write(
    instance,
    doc("control", "local/fixture-statement.txt"),
    "Synthetic deterministic fixture; no independent live judgment is claimed.\n",
  );
  c.node(
    instance,
    "refute-plan",
    "receipt",
    doc("control", "local/fixture-result.json"),
    "--statement",
    doc("control", "local/fixture-statement.txt"),
  );
  for (const id of ["WO-001", "WO-003"]) {
    decision(
      instance,
      id,
      "Authorize the bounded synthetic history amendment.",
    );
    write(
      instance,
      orderPath(id),
      read(instance, orderPath(id)).replace(
        "original history shape",
        "approved history shape",
      ),
    );
    c.node(
      instance,
      "refute-plan",
      "amend-order",
      id,
      `${id}-D001`,
      "Synthetic authorization of the history amendment",
    );
  }
  for (const id of ["WO-001", "WO-002"]) {
    resume(instance, id, "activate", id, orderPath(id));
    close(instance, id);
  }
  for (const script of ["meta", "lineage", "work-orders"])
    c.node(
      instance,
      script,
      ...(["lineage", "work-orders"].includes(script) ? ["index"] : []),
    );
  c.commit(instance, "test: closed self history with bound amendment");
  c.git(instance, "push", "-qu", "origin", "main");
  mkdirSync(join(scratch, "targets"));
  c.node(instance, "worktree", "start", "WO-003", orderPath("WO-003"));
  const orderRoot = `${instance}-wo003`,
    targetWorktree = join(scratch, "targets/target-wo003");
  write(
    orderRoot,
    doc("control", "local/terms.txt"),
    "SyntheticForbiddenHistoryTerm\n",
  );
  write(targetWorktree, "delivered.txt", "Synthetic target delivery.\n");
  c.commit(targetWorktree, "test: deliver target history");
  c.node(orderRoot, "target-gate", "WO-003", "--review");
  close(orderRoot, "WO-003");
  resume(orderRoot, "WO-003", "target-records", ...flags);
  assert.equal(
    existsSync(join(orderRoot, doc("evidence", "WO-003/decisions.md"))),
    false,
  );
  c.node(orderRoot, "sync");
  c.commit(orderRoot, "test: move target history records");
  c.git(instance, "merge", "--ff-only", "wo-003");
  c.git(target, "merge", "--ff-only", "wo-003");
  c.git(instance, "worktree", "remove", "--force", orderRoot);
  c.git(target, "worktree", "remove", "--force", targetWorktree);
  c.git(instance, "push", "-q", "origin", "main");
  c.git(target, "push", "-q", "origin", "main");
  c.node(instance, "worktree", "start", "WO-004", orderPath("WO-004"));
  const activeRoot = `${instance}-wo004`;
  c.commit(activeRoot, "test: record target activation at earlier base");
  c.git(instance, "merge", "--ff-only", "wo-004");
  c.git(instance, "worktree", "remove", "--force", activeRoot);
  c.git(
    target,
    "worktree",
    "remove",
    "--force",
    join(scratch, "targets/target-wo004"),
  );
  write(
    target,
    "later.txt",
    "The target main has passed the activation base.\n",
  );
  const targetTip = c.commit(target, "test: advance target main");
  c.git(target, "push", "-q", "origin", "main");

  // Membership is added after the self orders closed. Only WO-001 retains
  // its older binding; the other changed declarations are explicitly bound.
  for (const id of ["WO-001", "WO-002", "WO-004"])
    write(
      instance,
      orderPath(id),
      read(instance, orderPath(id)).replace(
        "**Model:**",
        "**Workstream:** WS-001\n**Model:**",
      ),
    );
  write(
    instance,
    doc("workstreams", "WS-001-history.md"),
    `# WS-001 — Synthetic history\n\n<!-- dotln-workstream:start -->\n${JSON.stringify(
      {
        id: "WS-001",
        members: [
          { workOrderId: "WO-001", repositoryId: "self" },
          { workOrderId: "WO-002", repositoryId: "self" },
          { workOrderId: "WO-004", repositoryId: "target" },
        ],
        edges: [],
      },
      null,
      2,
    )}\n<!-- dotln-workstream:end -->\n`,
  );
  for (const id of ["WO-002", "WO-004"]) {
    decision(instance, id, "Authorize the synthetic workstream declaration.");
    write(
      instance,
      orderPath(id),
      read(instance, orderPath(id)).replace(
        "original history shape",
        "grouped history shape",
      ),
    );
    c.node(
      instance,
      "refute-plan",
      "amend-order",
      id,
      `${id}-D001`,
      "Synthetic authorization of workstream grouping",
    );
  }
  c.node(instance, "sync");
  c.ok(c.run(instance, "npm", ["run", "format"]), "format fixture");
  c.node(instance, "sync");
  // Retain the observations judged before execution. Measuring the completed
  // lifecycles here would change the evidence beneath that planning receipt.
  c.node(instance, "docs-check");
  c.commit(instance, "test: later workstream field on closed amended order");
  c.node(instance, "refute-plan", "check");
  // One bundle carries two independent histories, without a nested repository
  // or any machine-specific clone mapping in either committed tree.
  c.git(instance, "fetch", "--quiet", target, "main:refs/heads/fixture-target");
  mkdirSync(destination, { recursive: true });
  const bundle = join(destination, "instance.bundle");
  c.git(
    instance,
    "bundle",
    "create",
    bundle,
    "refs/heads/main",
    "refs/heads/fixture-target",
  );
  const manifest = {
    schemaVersion: 1,
    synthetic: true,
    generatedAt: new Date().toISOString(),
    generator: "node scripts/fixtures/instance-with-history/generate.mjs",
    source: {
      coreCommit: c.git(TOOL_ROOT, "rev-parse", "HEAD"),
      kitCommit: json(instance, "KIT-MANIFEST.json").commit,
    },
    bundle: {
      file: "instance.bundle",
      bytes: statSync(bundle).size,
      sha256: createHash("sha256").update(readFileSync(bundle)).digest("hex"),
    },
    refs: { instance: c.git(instance, "rev-parse", "main"), target: targetTip },
    shapes: [
      {
        id: "closed-amendment-field",
        order: "WO-001",
        path: orderPath("WO-001"),
        fieldReport:
          "2026-10-24 standard pass, section 2: closed WO-011 and WO-012 amendments refused after the Workstream field",
      },
      {
        id: "closed-self-workstream",
        path: doc("workstreams", "WS-001-history.md"),
        selfOrders: ["WO-001", "WO-002"],
        targetOrder: "WO-004",
        fieldReport:
          "2026-10-24 workstream update and WO-080-D015: closed self members on an update branch",
      },
      {
        id: "moved-amendment-decision",
        order: "WO-003",
        decision: "WO-003-D001",
        fieldReport:
          "2026-10-20 and 2026-10-23 update passes: moved WO-004 decisions and bound moved WO-006 decisions refused",
      },
      {
        id: "target-base-behind",
        order: "WO-004",
        base: targetBase,
        tip: targetTip,
        fieldReport:
          "2026-10-24 standard pass, section 2: WO-013 at a provisional target base",
      },
    ],
  };
  write(destination, "manifest.json", manifest);
  console.log(JSON.stringify(manifest, null, 2));
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
