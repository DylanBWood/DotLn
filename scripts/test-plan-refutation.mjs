#!/usr/bin/env node
import { isMainModule } from "./lib/paths.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { authorize } from "../packages/kernel/dist/src/index.js";
import { compilePlanRefuter } from "../packages/skeleton/dist/src/loadouts/plan-refuter.js";
import {
  FakePlanRefutationTransport,
  cannedPlanDrift,
  cannedGoalReview,
} from "../packages/skeleton/dist/src/plan-refutation-fake.js";
import { runPlanRefutation } from "../packages/skeleton/dist/src/plan-refutation-host.js";
import {
  validatePlanResult,
  planResultSchema,
} from "../packages/skeleton/dist/src/plan-refutation-protocol.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
} from "../packages/skeleton/dist/src/worker-transport.js";
import {
  buildPlanSubject,
  committedReader,
  PLAN_MAP,
  PLAN_LEDGER,
  planningPasses,
  sha256,
  THESIS_HEADINGS,
  planOrderHash,
  carriedOrderHashMatches,
} from "./lib/plan-subject.mjs";
import {
  checkPassReceipt,
  checkPlanGate,
  OVERRIDES,
  overridePlanHold,
  disposePlanHold,
  amendPlanOrder,
  criterionDispositions,
  readOverrides,
  readReceipts,
  RECEIPTS,
  renderPlanReceipt,
  validateReceipt,
  writePlanReceipt,
} from "./lib/plan-receipts.mjs";
import { checkLocalTerms } from "./lib/terms.mjs";
import { fold, parseControlEvents } from "./lib/control.mjs";
import { runGit } from "./lib/git.mjs";
import { main as plan } from "./refute-plan.mjs";
import {
  beginDirectRefutation,
  fileDirectRefutation,
  planJudgmentScope,
  latestPlanningPass,
} from "./lib/plan-direct.mjs";
import {
  capabilityHistoryRepair,
  executionAmendmentSource,
  reassessments,
} from "./lib/plan-continuation.mjs";
import {
  checkSequenceTopology,
  parseSequenceGroups,
  readIndex,
  main as workOrders,
} from "./work-orders.mjs";
import { projectDependencies } from "./lib/dependencies.mjs";
import { LEGACY_COST_HEADER } from "./lib/legacy-cost.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const now = () => Date.parse("2030-01-02T12:00:00.000Z");
const actor = {
  harness: "human",
  harnessVersion: "fixture",
  model: "human",
  effort: "unknown",
  source: "operator-attested",
  accountLabel: "fixture",
};
const write = (repo, path, source) => {
  mkdirSync(dirname(join(repo, path)), { recursive: true });
  writeFileSync(join(repo, path), source);
};
const read = (repo, path) => readFileSync(join(repo, path), "utf8");
const commit = (repo, label, date = "2030-01-02T00:00:00Z") => {
  runGit(repo, ["add", "--all"]);
  runGit(
    repo,
    [
      "-c",
      "user.name=Plan Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-qm",
      label,
    ],
    {
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: date,
        GIT_COMMITTER_DATE: date,
      },
    },
  );
};
const orderPath = (id) => `docs/work-orders/${id}-fixture.md`;
const order = (id) =>
  `# ${id} — Fixture\n\n**Model:** fixture\n**Effort:** executor any; verifier any; reviewer any.\n**Nomination provenance:** PLANNER_NARRATIVE_SENTINEL\n\n**Objective:** Move the shape.\n\n**Design:** PLANNER_NARRATIVE_SENTINEL\n\n**Acceptance criteria (all required)**\n\n1. Evidence confirms a useful shape.\n2. Keep a bounded result.\n\n**Evidence gate:** PLANNER_NARRATIVE_SENTINEL\n\n**Non-goals:** Other shapes.\n\n**Operator-review assumptions**\n\n1. PLANNER_NARRATIVE_SENTINEL\n`;
const makeRepo = (parent, name, oldDate = "2029-01-01") => {
  const repo = join(parent, name);
  mkdirSync(repo);
  runGit(repo, ["init", "-q"]);
  assert.equal(runGit(repo, ["rev-parse", "--show-toplevel"]), repo);
  write(repo, ".gitignore", "docs/intake/**\ndocs/control/local/**\n");
  write(
    repo,
    PLAN_MAP,
    "# Fixture map\n\nPLANNER_NARRATIVE_SENTINEL\n\n<!-- dotln-work-order-sequence:start -->\n- WO-901 — First\n- WO-902 — Second\n<!-- dotln-work-order-sequence:end -->\n",
  );
  write(
    repo,
    PLAN_LEDGER,
    `# Ledger\n\n## ${oldDate} old planning pass\n\nPLANNER_NARRATIVE_SENTINEL\n`,
  );
  write(
    repo,
    "docs/product/00-vision.md",
    `# Vision\n\n${THESIS_HEADINGS.map(([, heading]) => `## ${heading}\n\nEvidence describes the shape.\n\n`).join("")}## What DotLn is not\n\n- Not a fixture-shaped dead end.\n- Not a compulsory doctrine.\n\n## Other narrative\n\nPLANNER_NARRATIVE_SENTINEL\n`,
  );
  write(
    repo,
    "docs/product/13-uifa-roles.md",
    `# Roles\n\n## The five roles\n\n| Role | Owns |\n| --- | --- |\n${["product lead", "showrunner", "engineer", "tester", "devops"].map((role) => `| **UIFA ${role}** | A useful shape. |`).join("\n")}\n\n### Extra\n\nPLANNER_NARRATIVE_SENTINEL\n`,
  );
  write(
    repo,
    "docs/planning/capability-table.md",
    "# Capabilities\n\n| Capability | Level | Narrative |\n| --- | --- | --- |\n| `fixture.first` | **0 — latent** | PLANNER_NARRATIVE_SENTINEL |\n",
  );
  write(
    repo,
    "docs/product/07-execution-guide.md",
    "# Fixture guide\n\n## Goal-aligned decisions\n\nConsider all eight system traps and observed operator flow.\n\n## Platform-first\n\n" +
      read(root, "docs/product/07-execution-guide.md").match(
        /the point is to create a platform,[\s\S]*?before a later pass pays it again\./u,
      )[0] +
      "\n",
  );
  write(
    repo,
    "docs/planning/critical-path-2026-09-08.md",
    "# Fixture critical path\n\n## The critical path\n\nGate R delivers an independently verified runtime loop.\n",
  );
  for (const id of ["WO-901", "WO-902"]) write(repo, orderPath(id), order(id));
  commit(repo, "before mechanism");
  write(repo, "scripts/refute-plan.mjs", "// fixture introduction marker\n");
  commit(repo, "introduce mechanism");
  write(
    repo,
    PLAN_LEDGER,
    `${read(repo, PLAN_LEDGER)}\n## 2030-01-02 fixture planning pass\n\nNew pass.\n`,
  );
  commit(repo, "planning pass");
  return repo;
};
const passFor = (repo) => {
  const pass = planningPasses(read(repo, PLAN_LEDGER)).at(-1);
  return { id: pass.id, kind: "planning", heading: pass.heading };
};
const passResult = (subject) => ({
  ...cannedPlanDrift(subject),
  orders: subject.orders.map((order) => ({
    workOrderId: order.workOrderId,
    verdict: "thesis-advancing",
    thesis: subject.standard.theses[0].id,
    capabilityRow: "fixture.first",
    rolesServed: [subject.standard.roles[0]],
    reason: "The first criterion advances the named thesis.",
  })),
  planVerdict: "pass",
  holdReasons: [],
});
const episode = (subject, result = cannedPlanDrift) =>
  runPlanRefutation(
    subject,
    new FakePlanRefutationTransport(result),
    "fixture",
    "max",
    now,
  );
const writeReceipt = async (
  repo,
  result = cannedPlanDrift,
  dispositions = [],
) => {
  const subject = buildPlanSubject(repo);
  return writePlanReceipt(repo, {
    pass: passFor(repo),
    slug: "fixture",
    subject,
    episode: await episode(subject, result),
    dispositions,
  });
};
const directEpisode = (result) => ({
  kind: "direct-session",
  harness: "codex",
  harnessVersion: "unknown",
  model: "unknown",
  effort: "unknown",
  settingsVerification: "unverified",
  profileId: "plan-refutation-v1",
  completedAt: new Date(now()).toISOString(),
  resultHash: sha256(`${JSON.stringify(result, null, 2)}\n`),
  judgmentBasis: "canonical-subject-and-protocol",
  independence: "session-attested",
  contextIsolation: "not-enforced",
  modelTools: "available",
  statement: "Synthetic direct-session attestation for deterministic fixtures.",
  result,
});
const writeDirectReceipt = (repo, result = passResult, dispositions = []) => {
  const subject = buildPlanSubject(repo);
  return writePlanReceipt(repo, {
    pass: passFor(repo),
    slug: "direct-fixture",
    subject,
    episode: directEpisode(validatePlanResult(result(subject), subject)),
    dispositions,
  });
};
const rehash = (receipt) => {
  const { receiptHash: _hash, ...payload } = receipt;
  return { ...payload, receiptHash: sha256(JSON.stringify(payload)) };
};
const accept = (receipt) =>
  receipt.holds.map((hold) => ({
    receiptId: receipt.receiptId,
    holdId: hold.id,
    kind: "accepted",
    date: "2030-01-02",
    workOrderId: hold.workOrderId,
    criterionId: hold.criterionId,
    change: "The named criterion now requires the missing behavior.",
  }));
const mutate = (repo, path, from, to) => {
  const before = read(repo, path);
  assert.ok(before.includes(from));
  write(repo, path, before.replace(from, to));
  commit(repo, "criterion or standard change");
};

export async function fixtures() {
  const parent = realpathSync(
    mkdtempSync(join(tmpdir(), "dotln-plan-fixtures-")),
  );
  const check = (label, run) => test(label, run);
  try {
    await check(
      "WO-134 both refutation paths select the gate's missing same-day pass independent of ledger order",
      async () => {
        for (const transport of ["direct", "fake"]) {
          for (const newestFirst of [false, true]) {
            const repo = makeRepo(
              parent,
              `same-day-${transport}-${newestFirst}`,
            );
            const first = passFor(repo);
            const original = read(repo, PLAN_LEDGER);
            assert.deepEqual(await latestPlanningPass(repo), first);
            write(repo, PLAN_LEDGER, `# Ledger\n\n## ${first.heading}\n`);
            assert.deepEqual(await latestPlanningPass(repo), first);
            write(repo, PLAN_LEDGER, original);
            const resultPath = "docs/control/local/result.json";
            const statementPath = "docs/control/local/statement.txt";
            const subject = buildPlanSubject(repo, "HEAD", {
              goalReview: true,
            });
            write(repo, resultPath, JSON.stringify(cannedGoalReview(subject)));
            write(
              repo,
              statementPath,
              "Synthetic same-day regression judgment; canonical fixture subject only.",
            );
            let prior, priorRequest;
            if (transport === "direct") {
              await plan(["refute", "--direct", "--scope", "full"], repo);
              const pointer = JSON.parse(
                read(repo, "docs/control/local/plan/current-direct.json"),
              );
              priorRequest = {
                path: pointer.path,
                bytes: read(repo, pointer.path),
              };
              // Requests saved before pass-specific filenames remain fileable.
              const legacyPath = pointer.path.replace(`-${first.id}`, "");
              write(repo, legacyPath, priorRequest.bytes);
              write(
                repo,
                "docs/control/local/plan/current-direct.json",
                JSON.stringify({ path: legacyPath }),
              );
              await fileDirectRefutation(repo, resultPath, statementPath, {
                commit: false,
              });
              prior = (await readReceipts(repo)).at(-1);
            } else {
              prior = await writeDirectReceipt(repo);
            }
            commit(repo, "first planning receipt");
            const priorBytes = read(
              repo,
              `${RECEIPTS}/${prior.receiptId}.json`,
            );
            const heading = "2030-01-02 second planning pass";
            const second = {
              id: planningPasses(`## ${heading}`)[0].id,
              kind: "planning",
              heading,
            };
            const section = `\n## ${heading}\n\nAnother pass.\n`;
            const ledgers = [
              original + section,
              `# Ledger\n${section}${original.slice(original.indexOf("## "))}`,
            ];
            for (const ledger of ledgers) {
              write(repo, PLAN_LEDGER, ledger);
              await assert.rejects(checkPlanGate(repo), (error) =>
                error.message.includes(
                  `planning pass ${second.id} needs a receipt`,
                ),
              );
              assert.deepEqual(await latestPlanningPass(repo), second);
              assert.equal(
                buildPlanSubject(repo, "HEAD", {
                  workspace: true,
                  goalReview: true,
                }).hash,
                subject.hash,
              );
            }
            write(repo, PLAN_LEDGER, ledgers[Number(newestFirst)]);
            commit(repo, "second same-day planning pass");
            if (transport === "direct") {
              await plan(["refute", "--direct", "--scope", "full"], repo);
              const pointer = JSON.parse(
                read(repo, "docs/control/local/plan/current-direct.json"),
              );
              assert.deepEqual(
                JSON.parse(read(repo, pointer.path)).pass,
                second,
              );
              assert.notEqual(pointer.path, priorRequest.path);
              assert.equal(read(repo, priorRequest.path), priorRequest.bytes);
              const result = await fileDirectRefutation(
                repo,
                resultPath,
                statementPath,
                { commit: false },
              );
              assert.equal(result.gate.passes, 2);
            } else {
              const result = await plan(
                ["refute", "--transport", "fake"],
                repo,
              );
              const receipt = JSON.parse(
                read(repo, result.receipt.replace(/\.md$/u, ".json")),
              );
              assert.deepEqual(receipt.pass, second);
            }
            for (const ledger of ledgers) {
              write(repo, PLAN_LEDGER, ledger);
              assert.deepEqual(await latestPlanningPass(repo), second);
            }
            // A later evidence receipt cannot supersede the planning chain.
            await plan(
              ["refute", "--transport", "fake", "--evidence-only"],
              repo,
            );
            assert.deepEqual(await latestPlanningPass(repo), second);
            assert.equal(
              read(repo, `${RECEIPTS}/${prior.receiptId}.json`),
              priorBytes,
            );
            const laterHeading = "2030-01-03 later planning pass";
            write(
              repo,
              PLAN_LEDGER,
              `${original}${section}\n## ${laterHeading}\n`,
            );
            assert.equal(
              (await latestPlanningPass(repo)).heading,
              laterHeading,
            );
          }
        }
        for (const oldDate of ["2030-01-02", "2031-01-01"]) {
          const repo = makeRepo(parent, `exempt-${oldDate}`, oldDate);
          const current = passFor(repo);
          await assert.rejects(checkPlanGate(repo), (error) =>
            error.message.includes(
              `planning pass ${current.id} needs a receipt`,
            ),
          );
          assert.deepEqual(await latestPlanningPass(repo), current);
          await writeDirectReceipt(repo);
          assert.equal((await checkPlanGate(repo)).passes, 1);
          assert.deepEqual(await latestPlanningPass(repo), current);
        }
        const repo = makeRepo(parent, "same-day-ambiguous");
        const original = read(repo, PLAN_LEDGER);
        const section = "\n## 2030-01-02 unjudged planning pass\n";
        for (const ledger of [original + section, section + original]) {
          write(repo, PLAN_LEDGER, ledger);
          await assert.rejects(
            latestPlanningPass(repo),
            /ambiguous planning passes on 2030-01-02/u,
          );
          await assert.rejects(
            plan(["refute"], repo),
            /ambiguous planning passes/u,
          );
          await assert.rejects(
            plan(["refute", "--transport", "fake"], repo),
            /ambiguous planning passes/u,
          );
        }
        write(repo, PLAN_LEDGER, "# No planning headings\n");
        await assert.rejects(
          latestPlanningPass(repo),
          /no dated planning-pass ledger heading/u,
        );
      },
    );
    await check(
      "WO-132 goal review preserves hypothetical findings without holding and requires observed evidence",
      async () => {
        const repo = makeRepo(parent, "goal-findings");
        const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const input = cannedGoalReview(subject);
        input.orders[0].verdict = "misaligned";
        input.orders[0].findings = [
          {
            criterionId: "criterion:1",
            kind: "observed-failure",
            reason: "A constructed failure could happen.",
            evidence: null,
            reopenWhen: "A recorded run exhibits the failure.",
          },
        ];
        input.planVerdict = "misaligned";
        input.holdReasons = [
          {
            workOrderId: "WO-901",
            criterionId: "criterion:1",
            reason: "The hypothetical must hold.",
          },
        ];
        const known = validatePlanResult(input, subject);
        assert.equal(known.planVerdict, "aligned-with-findings");
        assert.equal(known.orders[0].findings[0].kind, "known-issue");
        assert.equal(known.holdReasons.length, 0);
        input.orders[0].findings[0] = {
          ...input.orders[0].findings[0],
          kind: "vision-contradiction",
          evidence: subject.standard.exclusions[0].id,
        };
        assert.equal(
          validatePlanResult(input, subject).planVerdict,
          "misaligned",
        );
        assert.equal(
          validatePlanResult(cannedGoalReview(subject), subject).planVerdict,
          "aligned",
          "missing Cost produces no structural hold",
        );
        const prompt = JSON.parse(
          await beginDirectRefutation(repo, {
            now: () => "2030-01-02T12:00:00.000Z",
          }),
        );
        assert.equal(
          prompt.subject.goalReview.platformStandard,
          subject.goalReview.platformStandard,
        );
        assert.match(
          prompt.subject.goalReview.platformStandard,
          /^the point is to create a platform,/u,
        );
        assert.match(prompt.outputInstructions, /all eight system traps/u);
        assert.equal(
          prompt.resultSchema.properties.planVerdict.enum.join(","),
          "aligned,aligned-with-findings,misaligned",
        );
      },
    );
    await check(
      "WO-132 legacy holds accept bound criterion repairs without replacing their immutable receipt",
      async () => {
        const repo = makeRepo(parent, "legacy-disposition-repair");
        const held = await writeDirectReceipt(repo, (subject) => ({
          ...passResult(subject),
          planVerdict: "hold",
          holdReasons: [
            {
              workOrderId: "WO-901",
              criterionId: "criterion:1",
              reason: "Recorded fixture behavior needs repair.",
            },
          ],
        }));
        commit(repo, "immutable legacy judgment");
        const originals = Object.fromEntries(
          ["json", "md"].map((extension) => [
            extension,
            read(repo, `${RECEIPTS}/${held.receiptId}.${extension}`),
          ]),
        );
        const path = orderPath("WO-901");
        write(
          repo,
          path,
          read(repo, path).replace(
            "Evidence confirms a useful shape.",
            "Evidence confirms the repaired useful shape.",
          ),
        );
        await disposePlanHold(repo, {
          receiptId: held.receiptId,
          holdId: held.holds[0].id,
          reason: "The criterion now requires the repaired behavior.",
          now: () => "2030-01-02T12:01:00.000Z",
        });
        const dirty = await checkPlanGate(repo);
        assert.ok(
          dirty.continuation.workspaceUpdates.some(
            (row) => row.kind === "disposed-criterion",
          ),
        );
        assert.deepEqual(dirty.continuation.committedUpdates, []);
        commit(repo, "record only criterion repair and disposition");
        const committed = await checkPlanGate(repo);
        assert.deepEqual(
          committed.continuation.committedUpdates,
          dirty.continuation.workspaceUpdates,
        );
        assert.equal((await readReceipts(repo)).length, 1);
        for (const extension of ["json", "md"])
          assert.equal(
            read(repo, `${RECEIPTS}/${held.receiptId}.${extension}`),
            originals[extension],
          );
        write(
          repo,
          path,
          read(repo, path).replace(
            "Keep a bounded result.",
            "Change a different criterion.",
          ),
        );
        await assert.rejects(
          checkPlanGate(repo),
          /changed criterion has no text-bound disposition/u,
        );
        commit(repo, "unrelated criterion edit is still refused");
        await assert.rejects(
          checkPlanGate(repo),
          /changed criterion has no text-bound disposition/u,
        );
      },
    );
    await check(
      "WO-132 goal dispositions and overrides bind only the exact repaired Cost declaration",
      async () => {
        for (const [label, beforeCost, afterCost, override] of [
          [
            "replace",
            "**Cost:** Adds one check.\n\n",
            "**Cost:** Removes two recurring checks for one addition.\n\n",
            false,
          ],
          ["add", "", "**Cost:** Removes the recurring gate.\n\n", true],
          ["remove", "**Cost:** Adds one check.\n\n", "", false],
        ]) {
          const repo = makeRepo(parent, `goal-cost-disposition-${label}`);
          const path = orderPath("WO-901");
          write(
            repo,
            path,
            order("WO-901").replace("**Model:**", `${beforeCost}**Model:**`),
          );
          if (beforeCost) commit(repo, "goal Cost subject");
          const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
          const result = cannedGoalReview(subject);
          result.orders[0].verdict = "misaligned";
          result.orders[0].findings = [
            {
              criterionId: "criterion:1",
              kind: "vision-contradiction",
              reason: "The Cost promise conflicts with the fixture vision.",
              evidence: subject.standard.theses[0].id,
              reopenWhen: null,
            },
          ];
          const held = await writePlanReceipt(repo, {
            pass: passFor(repo),
            slug: "cost",
            subject,
            episode: directEpisode(validatePlanResult(result, subject)),
          });
          commit(repo, "immutable goal judgment");
          const originals = Object.fromEntries(
            ["json", "md"].map((extension) => [
              extension,
              read(repo, `${RECEIPTS}/${held.receiptId}.${extension}`),
            ]),
          );
          const repaired = order("WO-901")
            .replace("**Model:**", `${afterCost}**Model:**`)
            .replace(
              "Evidence confirms a useful shape.",
              label === "replace"
                ? "Evidence confirms the repaired useful shape."
                : "Evidence confirms a useful shape.",
            );
          write(repo, path, repaired);
          commit(repo, "repair only the Cost field");
          await assert.rejects(
            beginDirectRefutation(repo),
            /one judgment per pass/u,
          );
          const args = {
            receiptId: held.receiptId,
            holdId: held.holds[0].id,
            reason: "Accept the exact repaired Cost declaration.",
            now: () => "2030-01-02T12:01:00.000Z",
          };
          let event;
          if (override) {
            const capture = "docs/intake/operator.md",
              bytes = "Operator accepts this fixture Cost repair.\n";
            write(repo, capture, bytes);
            event = await overridePlanHold(repo, {
              ...args,
              capture,
              captureHash: sha256(bytes),
            });
          } else event = await disposePlanHold(repo, args);
          assert.equal(event.sourceCostHash, sha256(beforeCost));
          assert.equal(event.costHash, sha256(afterCost));
          const accepted = await checkPlanGate(repo);
          assert.ok(
            accepted.continuation.workspaceUpdates.some(
              (row) => row.kind === "disposed-cost",
            ),
          );
          assert.equal(
            accepted.continuation.workspaceUpdates.some(
              (row) => row.kind === "disposed-criterion",
            ),
            label === "replace",
          );
          assert.equal((await readReceipts(repo)).length, 1);
          for (const extension of ["json", "md"])
            assert.equal(
              read(repo, `${RECEIPTS}/${held.receiptId}.${extension}`),
              originals[extension],
            );
          commit(repo, "record Cost disposition without another judgment");
          assert.ok(
            (await checkPlanGate(repo)).continuation.committedUpdates.some(
              (row) => row.kind === "disposed-cost",
            ),
          );
          write(
            repo,
            path,
            repaired
              .replace(
                "**Model:**",
                "**Cost:** An unrelated replacement.\n\n**Model:**",
              )
              .replace(afterCost, ""),
          );
          await assert.rejects(
            checkPlanGate(repo),
            /changed Cost declaration has no text-bound disposition/u,
          );
          write(
            repo,
            path,
            repaired.replace(
              "Keep a bounded result.",
              "Change a different criterion.",
            ),
          );
          await assert.rejects(
            checkPlanGate(repo),
            /changed criterion has no text-bound disposition/u,
          );
          write(
            repo,
            path,
            repaired.replace(
              "**Objective:** Move the shape.",
              "**Objective:** An unrelated objective.",
            ),
          );
          await assert.rejects(
            checkPlanGate(repo),
            /existing work-order bytes changed/u,
          );
        }
      },
    );
    await check(
      "WO-132 one judgment survives a disposed criterion repair and later findings cannot reopen its text",
      async () => {
        const repo = makeRepo(parent, "goal-disposition");
        const tablePath = "docs/planning/cost-table.json";
        const table = {
          rows: [{ workOrder: "WO-901", metrics: { gateMs: 605000 } }],
          traps: [],
        };
        write(repo, tablePath, JSON.stringify(table));
        commit(repo, "observed gate row");
        const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const heldResult = cannedGoalReview(subject);
        heldResult.orders[0].verdict = "misaligned";
        heldResult.orders[0].findings = [
          {
            criterionId: "criterion:1",
            kind: "observed-failure",
            reason: "The recorded gate exceeded the target.",
            evidence: subject.goalReview.observations[0].id,
            reopenWhen: "A later gate still exceeds the target.",
          },
        ];
        const validated = validatePlanResult(heldResult, subject);
        const held = await writePlanReceipt(repo, {
          pass: passFor(repo),
          slug: "goal",
          subject,
          episode: directEpisode(validated),
        });
        await assert.rejects(checkPlanGate(repo), /unanswered hold/u);
        const beforeBytes = read(repo, `${RECEIPTS}/${held.receiptId}.json`);
        mutate(
          repo,
          orderPath("WO-901"),
          "Evidence confirms a useful shape.",
          "Evidence confirms a useful shape in under six minutes.",
        );
        await assert.rejects(
          beginDirectRefutation(repo),
          /one judgment per pass/u,
        );
        await disposePlanHold(repo, {
          receiptId: held.receiptId,
          holdId: held.holds[0].id,
          reason: "The criterion now sets the observed operator target.",
          now: () => "2030-01-02T12:01:00.000Z",
        });
        const gate = await checkPlanGate(repo);
        assert.ok(
          gate.continuation.workspaceUpdates.some(
            (row) => row.kind === "disposed-criterion",
          ),
        );
        assert.equal((await readReceipts(repo)).length, 1);
        assert.equal(
          read(repo, `${RECEIPTS}/${held.receiptId}.json`),
          beforeBytes,
        );
        table.rows[0].observedAt = "2030-01-02T12:01:30.000Z";
        write(repo, tablePath, JSON.stringify(table));
        commit(repo, "observation timestamp only");
        await assert.rejects(
          beginDirectRefutation(repo),
          /one judgment per pass/u,
        );
        assert.equal(
          (await checkPlanGate(repo)).passes,
          1,
          "timestamp refresh keeps the original judgment",
        );
        // A new recorded observation, rather than the criterion edit, permits a new judgment.
        table.rows[0].metrics.gateMs = 610000;
        write(repo, tablePath, JSON.stringify(table));
        commit(repo, "new observed gate row");
        const prompt = JSON.parse(
          await beginDirectRefutation(repo, {
            now: () => "2030-01-02T12:02:00.000Z",
          }),
        );
        const next = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const repeated = cannedGoalReview(next);
        repeated.orders = repeated.orders.filter((row) =>
          prompt.subject.orders.some(
            (order) => order.workOrderId === row.workOrderId,
          ),
        );
        repeated.orders[0].verdict = "misaligned";
        repeated.orders[0].findings = heldResult.orders[0].findings;
        write(repo, "docs/control/local/result.json", JSON.stringify(repeated));
        write(
          repo,
          "docs/control/local/statement.txt",
          "Reviewed the changed recorded observation.",
        );
        const filed = await fileDirectRefutation(
          repo,
          "docs/control/local/result.json",
          "docs/control/local/statement.txt",
          { commit: false, now: () => "2030-01-02T12:05:00.000Z" },
        );
        assert.equal(filed.verdict, "aligned-with-findings");
        const latest = (await readReceipts(repo)).at(-1);
        assert.equal(latest.holds.length, 0);
        assert.equal(latest.result.orders[0].findings[0].kind, "known-issue");
      },
    );
    await check(
      "WO-132 override command accepts capture authority without actor flags",
      async () => {
        const repo = makeRepo(parent, "goal-override");
        const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const input = cannedGoalReview(subject);
        input.orders[0].verdict = "misaligned";
        input.orders[0].findings = [
          {
            criterionId: "criterion:1",
            kind: "vision-contradiction",
            reason: "The criterion contradicts the supplied exclusion.",
            evidence: subject.standard.exclusions[0].id,
            reopenWhen: null,
          },
        ];
        const result = validatePlanResult(input, subject);
        const receipt = await writePlanReceipt(repo, {
          pass: passFor(repo),
          slug: "override",
          subject,
          episode: {
            ...directEpisode(result),
            completedAt: "2020-01-02T12:00:00.000Z",
          },
        });
        const capture = "docs/intake/notes/override.md";
        write(repo, capture, "The fixture operator accepts this criterion.\n");
        const event = await plan(
          [
            "override",
            receipt.receiptId,
            receipt.holds[0].id,
            "Accept the criterion.",
            "--capture",
            capture,
            "--capture-hash",
            sha256(read(repo, capture)),
          ],
          repo,
        );
        assert.equal(event.actor.model, "unknown");
        assert.equal((await checkPlanGate(repo)).passes, 1);
        write(
          repo,
          PLAN_LEDGER,
          read(repo, PLAN_LEDGER) +
            "\n## 2030-01-03 next planning pass\n\nOne changed order.\n",
        );
        write(
          repo,
          orderPath("WO-902"),
          order("WO-902").replace("useful shape", "another useful shape"),
        );
        commit(repo, "next pass carries accepted criterion");
        const prompt = JSON.parse(
          await beginDirectRefutation(repo, {
            now: () => "2030-01-03T12:00:00.000Z",
          }),
        );
        assert.deepEqual(
          prompt.subject.orders.map((row) => row.workOrderId),
          ["WO-902"],
        );
        const next = cannedGoalReview(
          buildPlanSubject(repo, "HEAD", { goalReview: true }),
        );
        next.orders = next.orders.filter((row) => row.workOrderId === "WO-902");
        write(repo, "docs/control/local/result.json", JSON.stringify(next));
        write(
          repo,
          "docs/control/local/statement.txt",
          "Judged only the changed order.",
        );
        const filed = await fileDirectRefutation(
          repo,
          "docs/control/local/result.json",
          "docs/control/local/statement.txt",
          { commit: false, now: () => "2030-01-03T12:00:01.000Z" },
        );
        assert.equal(filed.carried, 1);
        assert.equal(filed.verdict, "aligned-with-findings");
        assert.equal(
          (await readReceipts(repo)).at(-1).result.orders[0].findings[0].kind,
          "known-issue",
        );
      },
    );
    await check(
      "direct-session frozen result round-trips and gates without invented launch provenance",
      async () => {
        const repo = makeRepo(parent, "direct-pass");
        const receipt = await writeDirectReceipt(repo);
        assert.deepEqual(await readReceipts(repo), [receipt]);
        assert.equal((await checkPlanGate(repo)).passes, 1);
        const markdown = read(repo, `${RECEIPTS}/${receipt.receiptId}.md`);
        assert.equal(markdown, renderPlanReceipt(receipt));
        assert.match(markdown, /direct Codex session/u);
        assert.match(markdown, /settings verification: unverified/u);
        assert.match(markdown, /Independence is session-attested/u);
        assert.match(markdown, /model tools were available/u);
        assert.doesNotMatch(markdown, /Selection source: host-launch/u);
        assert.doesNotMatch(markdown, /Dispatched:|empty scratch/u);
        for (const key of [
          "transport",
          "commandReceipt",
          "dispatchedAt",
          "semanticHash",
          "selectionSource",
        ])
          assert.equal(key in receipt.episode, false);
        assert.throws(
          () =>
            checkPassReceipt(
              passFor(repo),
              receipt.subject,
              [{ ...receipt, episode: { transport: "fake" } }],
              [],
            ),
          /requires an actual/u,
        );
        // Committed receipt bytes, including the legacy rendering in other
        // fixtures, still pass through the same immutable-history reader.
        commit(repo, "direct receipt");
        write(repo, `${RECEIPTS}/${receipt.receiptId}.md`, `${markdown}\n`);
        await assert.rejects(readReceipts(repo), /immutable Markdown/u);
        write(repo, `${RECEIPTS}/${receipt.receiptId}.md`, markdown);
        await assert.rejects(writeDirectReceipt(repo), /same subject/u);
        assert.deepEqual(await readReceipts(repo), [receipt]);
      },
    );
    await check(
      "direct-session closed provenance rejects launch claims, verified settings and changed frozen results",
      async () => {
        const repo = makeRepo(parent, "direct-shape");
        const receipt = await writeDirectReceipt(repo);
        for (const change of [
          { kind: "other" },
          { harness: "other" },
          { harnessVersion: "claimed-version" },
          { model: "claimed-model" },
          { effort: "max" },
          { settingsVerification: "verified" },
          { profileId: "other" },
          { completedAt: "not-a-timestamp" },
          { resultHash: sha256("other") },
          { judgmentBasis: "planner-narrative" },
          { independence: "host-verified" },
          { contextIsolation: "enforced" },
          { modelTools: "disabled" },
          { statement: "" },
          { transport: "codex-cli-exec" },
          { commandReceipt: { acceptedAt: now() } },
          { dispatchedAt: new Date(now()).toISOString() },
          { semanticHash: "invented-build" },
          { selectionSource: "host-launch" },
        ])
          await assert.rejects(
            validateReceipt(
              repo,
              rehash({
                ...receipt,
                episode: { ...receipt.episode, ...change },
              }),
            ),
            /provenance/u,
          );
        const changed = structuredClone(receipt);
        changed.result.orders[0].reason =
          "A different judgment after freezing.";
        await assert.rejects(
          validateReceipt(repo, rehash(changed)),
          /frozen result hash/u,
        );
        const forgedSubject = structuredClone(receipt);
        forgedSubject.subject.orders[0].objective = "An uncommitted objective.";
        await assert.rejects(
          validateReceipt(repo, rehash(forgedSubject)),
          /committed sources/u,
        );
        const incomplete = structuredClone(receipt);
        incomplete.result.orders.pop();
        incomplete.episode = directEpisode(incomplete.result);
        delete incomplete.episode.result;
        await assert.rejects(
          validateReceipt(repo, rehash(incomplete)),
          /one result per subject order/u,
        );
      },
    );
    await check(
      "direct-session publication rejects dirty or stale planning subjects and screens session metadata",
      async () => {
        const repo = makeRepo(parent, "direct-inputs");
        const subject = buildPlanSubject(repo);
        const input = {
          pass: passFor(repo),
          slug: "direct-inputs",
          subject,
          episode: directEpisode(passResult(subject)),
        };
        write(repo, orderPath("WO-901"), `${order("WO-901")}\n`);
        await assert.rejects(
          writePlanReceipt(repo, input),
          /current committed and workspace subject/u,
        );
        commit(repo, "changed source bytes");
        await assert.rejects(
          writePlanReceipt(repo, input),
          /current committed and workspace subject/u,
        );
        write(repo, "docs/control/local/terms.txt", "Synthetic Forbidden\n");
        const current = buildPlanSubject(repo);
        await assert.rejects(
          writePlanReceipt(repo, {
            ...input,
            subject: current,
            episode: {
              ...directEpisode(passResult(current)),
              statement: "Synthetic Forbidden",
            },
          }),
          /local-terms list present; refused/u,
        );
        assert.deepEqual(await readReceipts(repo), []);
        assert.deepEqual(readdirSync(join(repo, RECEIPTS)), []);
      },
    );
    await check(
      "direct-session receipts retain structural and addressed holds and cannot freeze an omitted hold as pass",
      async () => {
        for (const condition of [
          "drift",
          "machinery",
          "uncovered-gap",
          "addressed-gap",
        ]) {
          const repo = makeRepo(parent, `direct-${condition}`);
          const subject = buildPlanSubject(repo);
          const result = passResult(subject);
          if (condition === "drift") {
            result.orders[0] = cannedPlanDrift(subject).orders[0];
          } else if (condition === "machinery") {
            result.orders = result.orders.map((item) => ({
              ...item,
              verdict: "machinery",
              thesis: null,
              capabilityRow: null,
            }));
          } else if (condition === "uncovered-gap") {
            result.largestGap.thesis = subject.standard.theses[1].id;
          } else {
            result.holdReasons = [
              {
                workOrderId: subject.orders[0].workOrderId,
                criterionId: subject.orders[0].criteria[0].id,
                reason: "A concrete unresolved gap within the touched thesis.",
              },
            ];
          }
          await assert.rejects(
            writePlanReceipt(repo, {
              pass: passFor(repo),
              slug: "omitted",
              subject,
              episode: directEpisode(result),
            }),
            /frozen result hash/u,
          );
          assert.deepEqual(await readReceipts(repo), []);
          const receipt = await writeDirectReceipt(repo, () => result);
          assert.equal(receipt.result.planVerdict, "hold");
          assert.ok(receipt.holds.length > 0);
          await assert.rejects(checkPlanGate(repo), /unanswered hold/u);
        }
      },
    );
    await check(
      "direct-session and CLI histories share held-criterion repair and disposition requirements",
      async () => {
        const repo = makeRepo(parent, "direct-chain");
        const held = await writeReceipt(repo);
        await assert.rejects(writeDirectReceipt(repo), /same subject/u);
        mutate(repo, orderPath("WO-902"), "useful shape", "different shape");
        await assert.rejects(
          writeDirectReceipt(repo, passResult, accept(held)),
          /outside the held criteria/u,
        );
        mutate(repo, orderPath("WO-901"), "useful shape", "repaired shape");
        await assert.rejects(
          writeDirectReceipt(repo),
          /no accepted disposition/u,
        );
        const repaired = await writeDirectReceipt(
          repo,
          passResult,
          accept(held),
        );
        assert.equal(repaired.previousReceiptHash, held.receiptHash);
        assert.equal(repaired.ordinal, 2);
        assert.equal((await checkPlanGate(repo)).receipts, 2);
      },
    );
    await check(
      "historical direct-session receipts retain identities without a third-hold stop",
      async () => {
        const repo = makeRepo(parent, "direct-limit");
        const receipts = [];
        for (let i = 0; i < 3; i++) {
          if (i) mutate(repo, orderPath("WO-901"), "useful", `useful-${i}`);
          receipts.push(await writeDirectReceipt(repo, cannedPlanDrift));
        }
        mutate(repo, orderPath("WO-901"), "useful", "useful-final");
        const repaired = await writeDirectReceipt(
          repo,
          passResult,
          receipts.flatMap(accept),
        );
        assert.equal(repaired.result.planVerdict, "pass");
        assert.equal((await readReceipts(repo)).length, 4);
      },
    );
    await check(
      "AC1 committed-only deterministic subject; narrative blinding; all five hash inputs",
      async () => {
        const repo = makeRepo(parent, "subject");
        const base = buildPlanSubject(repo);
        assert.deepEqual(base, buildPlanSubject(repo));
        assert.equal(base.orders[0].criteria.length, 2);
        assert.equal(
          JSON.stringify(base).includes("PLANNER_NARRATIVE_SENTINEL"),
          false,
        );
        write(
          repo,
          orderPath("WO-901"),
          read(repo, orderPath("WO-901")).replace(
            "useful shape",
            "different shape",
          ),
        );
        assert.equal(buildPlanSubject(repo).hash, base.hash);
        assert.notEqual(
          buildPlanSubject(repo, "HEAD", { workspace: true }).hash,
          base.hash,
        );
        await assert.rejects(
          plan(["refute", "--transport", "fake"], repo),
          /commit the planning subject/u,
        );
        write(repo, orderPath("WO-901"), order("WO-901"));
        for (const [path, from, to] of [
          [PLAN_MAP, "First", "first"],
          [orderPath("WO-901"), "useful shape.", "useful shape!"],
          [
            "docs/product/00-vision.md",
            "Evidence describes",
            "evidence describes",
          ],
          [
            "docs/product/13-uifa-roles.md",
            "A useful shape.",
            "A useful shape!",
          ],
          ["docs/planning/capability-table.md", "**0", "**1"],
        ]) {
          const prior = buildPlanSubject(repo);
          mutate(repo, path, from, to);
          assert.notEqual(buildPlanSubject(repo).hash, prior.hash);
          assert.deepEqual(buildPlanSubject(repo, prior.revision), prior);
        }
        const before = buildPlanSubject(repo);
        mutate(
          repo,
          PLAN_MAP,
          "PLANNER_NARRATIVE_SENTINEL",
          "REWRITTEN_NARRATIVE",
        );
        assert.equal(buildPlanSubject(repo).hash, before.hash);
        mutate(
          repo,
          "docs/planning/capability-table.md",
          "PLANNER_NARRATIVE_SENTINEL",
          "REWRITTEN_NARRATIVE",
        );
        assert.equal(buildPlanSubject(repo).hash, before.hash);
        // Whole order bytes are hashed even though its narrative is never sent.
        mutate(
          repo,
          orderPath("WO-901"),
          "PLANNER_NARRATIVE_SENTINEL",
          "CHANGED_ORDER_NARRATIVE",
        );
        assert.notEqual(buildPlanSubject(repo).hash, before.hash);
        assert.equal(
          JSON.stringify(buildPlanSubject(repo)).includes(
            "CHANGED_ORDER_NARRATIVE",
          ),
          false,
        );
      },
    );
    await check(
      "AC2 compiled identity, mask, lens, pinned questions, one-shot cadence and authority refusals",
      async () => {
        const compiled = compilePlanRefuter("fixture", now());
        assert.deepEqual(compiled.program.workOrder.acceptanceCriteria, [
          "For each order, which critical-path gate does it unblock and what is the NoOp cost in the records?",
          "How do all eight system traps apply to the order's own process cost?",
          "Does the Cost line name a removal larger than the addition?",
          "Does failure of the mechanism degrade to the old behavior rather than refusing?",
        ]);
        assert.equal(compiled.mask.mask, "Contra-Auguste");
        assert.equal(compiled.lens, "architecture-and-semantics");
        assert.deepEqual(compiled.cadence, { kind: "Once", at: now() });
        const context = {
          now: now(),
          actorId: "entropy-reducer",
          workstreamId: "ws_test",
          episodeId: "ep_test",
          decisionIndex: 0,
          intentIndex: 0,
          evidence: [],
          revokedBy: [],
        };
        for (const effect of [
          "repo.write.file",
          "git.mutate.commit",
          "remote.push",
          "settings.edit",
          "decision.edit",
          "decision.override",
          "unknown.effect",
        ])
          assert.equal(
            authorize(
              { kind: "Act", effect, payload: {} },
              compiled.program.authorityEnvelope,
              context,
            ).authorized,
            false,
            effect,
          );
        for (const effect of ["repo.read", "repo.read.file", "report.emit"])
          assert.equal(
            authorize(
              { kind: "Act", effect, payload: {} },
              compiled.program.authorityEnvelope,
              context,
            ).authorized,
            true,
            effect,
          );
        assert.equal(
          authorize(
            { kind: "Act", effect: "report.emit", payload: {} },
            compiled.program.authorityEnvelope,
            { ...context, now: compiled.program.authorityEnvelope.expiresAt },
          ).authorized,
          false,
        );
      },
    );
    await check(
      "AC3 closed schema, exhaustive ids, verdict construction, row-less exclusion drift and gap deferrals",
      async () => {
        const repo = makeRepo(parent, "schema");
        const subject = buildPlanSubject(repo);
        const valid = passResult(subject);
        assert.equal(validatePlanResult(valid, subject).planVerdict, "pass");
        for (const bad of [
          { ...valid, extra: true },
          { ...valid, orders: [] },
          { ...valid, orders: [valid.orders[0], valid.orders[0]] },
          { ...valid, largestGap: { ...valid.largestGap, extra: true } },
          {
            ...valid,
            holdReasons: [
              { ...cannedPlanDrift(subject).holdReasons[0], extra: true },
            ],
          },
          ...[
            { extra: true },
            { workOrderId: "WO-999" },
            { thesis: "unknown" },
            { capabilityRow: null },
            { rolesServed: ["unknown"] },
            { rolesServed: ["UIFA tester", "UIFA tester"] },
            { reason: "" },
          ].map((change) => ({
            ...valid,
            orders: [{ ...valid.orders[0], ...change }, valid.orders[1]],
          })),
        ])
          assert.throws(() => validatePlanResult(bad, subject));
        const drift = {
          ...cannedPlanDrift(subject),
          planVerdict: "pass",
          holdReasons: [],
        };
        const held = validatePlanResult(drift, subject);
        assert.equal(held.planVerdict, "hold");
        assert.equal(held.orders[0].capabilityRow, null);
        assert.deepEqual(validatePlanResult(held, subject), held);
        const machinery = {
          ...valid,
          orders: valid.orders.map((item) => ({
            ...item,
            verdict: "machinery",
            thesis: null,
            capabilityRow: null,
          })),
        };
        assert.equal(
          validatePlanResult(machinery, subject).planVerdict,
          "hold",
        );
        const uncovered = {
          ...valid,
          largestGap: {
            ...valid.largestGap,
            thesis: subject.standard.theses[1].id,
          },
        };
        assert.equal(
          validatePlanResult(uncovered, subject).planVerdict,
          "hold",
        );
        mutate(
          repo,
          orderPath("WO-901"),
          "**Non-goals:** Other shapes.",
          "**Non-goals:** Other shapes.\n<!-- dotln-plan-defer: the-core-bet -> WO-902 -->",
        );
        assert.equal(
          validatePlanResult(uncovered, buildPlanSubject(repo)).planVerdict,
          "pass",
        );
        assert.equal(
          validatePlanResult(
            {
              ...valid,
              orders: [
                {
                  ...valid.orders[0],
                  verdict: "machinery",
                  thesis: null,
                  capabilityRow: null,
                },
                valid.orders[1],
              ],
            },
            subject,
          ).planVerdict,
          "pass",
        );
      },
    );
    await check(
      "AC3/5 deferrals require a later sequence member; outside, closed, self, earlier and missing orders refuse",
      async () => {
        const repo = makeRepo(parent, "deferrals");
        for (const id of ["WO-900", "WO-903"])
          write(repo, orderPath(id), order(id));
        const closedLog = "docs/control/orders/WO-900.jsonl";
        write(
          repo,
          closedLog,
          [
            {
              type: "WorkOrderActivated",
              workOrderPath: orderPath("WO-900"),
            },
            { type: "ImplementationReady", actor },
            {
              type: "VerificationRequested",
              verificationId: "VER-001",
              reportPath: "docs/verifications/WO-900/VER-001.md",
            },
            {
              type: "VerificationCompleted",
              verificationId: "VER-001",
              verdict: "pass",
              actor,
            },
            {
              type: "FinalReviewRequested",
              finalReviewId: "FINAL-001",
              reportPath: "docs/final-reviews/WO-900/FINAL-001.md",
            },
            {
              type: "FinalReviewCompleted",
              finalReviewId: "FINAL-001",
              verdict: "pass",
              actor,
            },
          ]
            .map((event) =>
              JSON.stringify({
                schemaVersion: 1,
                workOrderId: "WO-900",
                ...event,
              }),
            )
            .join("\n") + "\n",
        );
        commit(repo, "outside-sequence draft and closed order");
        assert.equal(
          fold(parseControlEvents(read(repo, closedLog))).phase,
          "closed",
        );
        for (const [from, to, thesis] of [
          ["WO-901", "WO-903", "the-core-bet"],
          ["WO-902", "WO-900", "the-core-bet"],
          ["WO-901", "WO-901", "the-core-bet"],
          ["WO-902", "WO-901", "the-core-bet"],
          ["WO-901", "WO-999", "the-core-bet"],
          ["WO-901", "WO-902", "unknown-thesis"],
        ]) {
          for (const id of ["WO-901", "WO-902"])
            write(repo, orderPath(id), order(id));
          write(
            repo,
            orderPath(from),
            order(from).replace(
              "**Non-goals:** Other shapes.",
              `**Non-goals:** Other shapes.\n<!-- dotln-plan-defer: ${thesis} -> ${to} -->`,
            ),
          );
          assert.throws(
            () => buildPlanSubject(repo, "HEAD", { workspace: true }),
            /invalid named later-order deferral/u,
            `${from} -> ${to} (${thesis}), workspace`,
          );
          commit(repo, "invalid deferral fixture");
          assert.throws(
            () => buildPlanSubject(repo),
            /invalid named later-order deferral/u,
            `${from} -> ${to} (${thesis}), committed`,
          );
          await assert.rejects(
            checkPlanGate(repo),
            /invalid named later-order deferral/u,
          );
        }
      },
    );
    await check(
      "AC3 local-terms phrases across separators and lines, private diagnostics, and atomic receipt refusal",
      async () => {
        const repo = makeRepo(parent, "terms");
        const subject = buildPlanSubject(repo);
        assert.deepEqual(checkLocalTerms(repo, []), { status: "unavailable" });
        write(
          repo,
          "docs/control/local/terms.txt",
          "# Synthetic fixture terms only\nSyntheticForbidden\nWibble Sprocket Cloud\nBig Fizzle Widget Cloud\n",
        );
        assert.deepEqual(
          checkLocalTerms(repo, [
            {
              name: "fixture",
              text: "ordinary text; Wibble Sprocket Clouds; PreSyntheticForbidden",
            },
            { name: "first", text: "Wibble" },
            { name: "second", text: "Sprocket Cloud" },
          ]),
          { status: "present" },
        );
        for (const [text, line] of [
          ["Synthetic-Forbidden", 1],
          ["Synthetic\nForbidden", 1],
          ["Synthetic For bid den", 1],
          ["Wibble Sprocket Cloud", 1],
          ["wibbleSprocketCloud", 1],
          ["ＷＩＢＢＬＥ－ＳＰＲＯＣＫＥＴ　ＣＬＯＵＤ", 1],
          ["prefix\nWibble\r\nSprocket Cloud", 2],
          ["Big Fizzle Widget Cloud", 1],
          ["Big Fizzle-\nWidget\tCloud", 1],
        ]) {
          assert.throws(
            () => checkLocalTerms(repo, [{ name: "fixture", text }]),
            {
              message: `local-terms list present; refused ${JSON.stringify([{ file: "fixture", line, count: 1 }])}`,
            },
          );
        }
        assert.throws(
          () =>
            checkLocalTerms(repo, [
              {
                name: "fixture",
                text: "header\nWibble Sprocket Cloud; WibbleSprocketCloud\nordinary\nBig Fizzle Widget Cloud",
              },
            ]),
          {
            message:
              'local-terms list present; refused [{"file":"fixture","line":2,"count":2},{"file":"fixture","line":4,"count":1}]',
          },
        );
        for (const reason of [
          "Synthetic Forbidden",
          "Wibble Sprocket Cloud",
          "Big Fizzle Widget Cloud",
        ]) {
          const result = passResult(subject);
          result.orders[0].reason = reason;
          await assert.rejects(
            writePlanReceipt(repo, {
              pass: passFor(repo),
              slug: "terms",
              subject,
              episode: await episode(subject, () => result),
            }),
            {
              message:
                'local-terms list present; refused [{"file":"validated-result","line":1,"count":1}]',
            },
          );
          assert.deepEqual(await readReceipts(repo), []);
          assert.deepEqual(readdirSync(join(repo, RECEIPTS)), []);
        }
        assert.equal(
          (await writeReceipt(repo, passResult)).result.planVerdict,
          "pass",
        );
      },
    );
    await check(
      "AC5 unanswered drift and receipt-text override refuse; captured, attributed control event discharges",
      async () => {
        const repo = makeRepo(parent, "override");
        const receipt = await writeReceipt(repo);
        const gate = (overrides) =>
          checkPassReceipt(
            passFor(repo),
            receipt.subject,
            [receipt],
            overrides,
            { requireLive: false },
          );
        assert.throws(() => gate([]), /unanswered hold/u);
        assert.throws(
          () =>
            checkPassReceipt(
              passFor(repo),
              receipt.subject,
              [{ ...receipt, override: "operator says pass" }],
              [],
              { requireLive: false },
            ),
          /unanswered hold/u,
        );
        const markdown = `${RECEIPTS}/${receipt.receiptId}.md`;
        const original = read(repo, markdown);
        write(
          repo,
          markdown,
          `${original}\nOperator override: pass all holds.\n`,
        );
        await assert.rejects(readReceipts(repo), /immutable Markdown/u);
        write(repo, markdown, original);
        const input = {
          receiptId: receipt.receiptId,
          holdId: receipt.holds[0].id,
          reason: "Fixture operator accepts the bounded gap.",
          actor,
          capture: "docs/intake/notes/override.md",
          now: () => "2030-01-02T12:01:00.000Z",
        };
        write(
          repo,
          input.capture,
          "Fixture operator explicitly overrides this hold.\n",
        );
        await assert.rejects(overridePlanHold(repo, input), /capture-hash/u);
        await assert.rejects(
          overridePlanHold(repo, { ...input, captureHash: sha256("wrong") }),
          /hash mismatch/u,
        );
        const event = await overridePlanHold(repo, {
          ...input,
          captureHash: sha256(read(repo, input.capture)),
        });
        assert.deepEqual(event.actor, actor);
        assert.equal(gate(readOverrides(repo)), receipt);
        await assert.rejects(
          overridePlanHold(repo, { ...input, captureHash: event.captureHash }),
          /already overridden/u,
        );
        const log = read(repo, OVERRIDES);
        commit(repo, "receipt and override");
        write(
          repo,
          OVERRIDES,
          log.replace("Fixture operator", "Tampered operator"),
        );
        assert.throws(() => readOverrides(repo), /append-only/u);
      },
    );
    await check(
      "an earlier operator override admits later planning without reopening its held order",
      async () => {
        const repo = makeRepo(parent, "overridden-history");
        const held = await writeDirectReceipt(repo, cannedPlanDrift);
        const heldOrder = read(repo, orderPath("WO-901"));
        mutate(repo, orderPath("WO-902"), "useful shape", "different shape");
        await assert.rejects(
          writeDirectReceipt(repo, cannedPlanDrift),
          /outside the held criteria/u,
        );
        const capture = "docs/intake/notes/override.md";
        write(repo, capture, "Fixture operator accepts the existing holds.\n");
        for (const hold of held.holds)
          await overridePlanHold(repo, {
            receiptId: held.receiptId,
            holdId: hold.id,
            reason: "Fixture operator accepts this existing hold.",
            actor,
            capture,
            captureHash: sha256(read(repo, capture)),
            now: () => "2030-01-02T12:01:00.000Z",
          });
        // A later override cannot retroactively authorize an earlier receipt.
        await assert.rejects(
          writeDirectReceipt(repo, cannedPlanDrift),
          /outside the held criteria/u,
        );
        const subject = buildPlanSubject(repo);
        const fresh = await writePlanReceipt(repo, {
          pass: passFor(repo),
          slug: "after-override",
          subject,
          episode: {
            ...directEpisode(
              validatePlanResult(cannedPlanDrift(subject), subject),
            ),
            completedAt: "2030-01-02T12:02:00.000Z",
          },
        });
        assert.equal(read(repo, orderPath("WO-901")), heldOrder);
        assert.equal(fresh.dispositions.length, 0);
        assert.equal(fresh.result.planVerdict, "hold");
        commit(repo, "receipts and attributed override");
        assert.deepEqual(await readReceipts(repo), [held, fresh]);
        assert.equal(
          checkPassReceipt(
            passFor(repo),
            fresh.subject,
            [held, fresh],
            readOverrides(repo),
          ),
          fresh,
        );
      },
    );
    await check(
      "a partial historical override preserves accepted repairs and repeated holds",
      async () => {
        const repo = makeRepo(parent, "partly-overridden-history");
        const twoHolds = (subject) => {
          const result = cannedPlanDrift(subject);
          return {
            ...result,
            holdReasons: [
              ...result.holdReasons,
              {
                workOrderId: "WO-901",
                criterionId: "criterion:2",
                reason: "The second criterion still has a bounded gap.",
              },
            ],
          };
        };
        const held = await writeDirectReceipt(repo, twoHolds);
        const capture = "docs/intake/notes/override.md";
        write(repo, capture, "Fixture operator accepts only the first hold.\n");
        await overridePlanHold(repo, {
          receiptId: held.receiptId,
          holdId: held.holds[0].id,
          reason: "Fixture operator accepts only this first hold.",
          actor,
          capture,
          captureHash: sha256(read(repo, capture)),
          now: () => "2030-01-02T12:01:00.000Z",
        });
        mutate(repo, orderPath("WO-901"), "useful shape", "repaired shape");
        const subject = buildPlanSubject(repo);
        const fresh = await writePlanReceipt(repo, {
          pass: passFor(repo),
          slug: "partial-override",
          subject,
          episode: {
            ...directEpisode(validatePlanResult(twoHolds(subject), subject)),
            completedAt: "2030-01-02T12:02:00.000Z",
          },
          dispositions: [accept(held)[0]],
        });
        commit(repo, "historical partial override and accepted repair");
        assert.deepEqual(await readReceipts(repo), [held, fresh]);
      },
    );
    await check(
      "AC5 pass after held criterion repair; elsewhere and whitespace edits cannot re-roll",
      async () => {
        const repo = makeRepo(parent, "repair");
        const held = await writeReceipt(repo);
        await assert.rejects(
          writeReceipt(repo, passResult, accept(held)),
          /same subject/u,
        );
        mutate(repo, orderPath("WO-902"), "useful shape", "different shape");
        await assert.rejects(
          writeReceipt(repo, passResult, accept(held)),
          /outside the held criteria/u,
        );
        mutate(repo, orderPath("WO-901"), "useful shape", "useful  shape");
        await assert.rejects(
          writeReceipt(repo, passResult, accept(held)),
          /outside the held criteria/u,
        );
        mutate(
          repo,
          orderPath("WO-901"),
          "useful  shape",
          "useful repaired shape",
        );
        await assert.rejects(
          writeReceipt(repo, passResult),
          /no accepted disposition/u,
        );
        const fresh = await writeReceipt(repo, passResult, accept(held));
        assert.equal(
          checkPassReceipt(passFor(repo), fresh.subject, [held, fresh], [], {
            requireLive: false,
          }),
          fresh,
        );
        assert.equal((await readReceipts(repo)).length, 2);
        assert.throws(
          () =>
            checkPassReceipt(passFor(repo), fresh.subject, [held], [], {
              requireLive: false,
            }),
          /matching the current subject/u,
        );
      },
    );
    await check(
      "historical holds remain addressed and immutable after removing the third-hold stop",
      async () => {
        const repo = makeRepo(parent, "limit");
        const receipts = [await writeReceipt(repo)];
        for (let i = 2; i <= 3; i++) {
          mutate(repo, orderPath("WO-901"), "useful", `useful-${i}`);
          receipts.push(
            await writeReceipt(repo, cannedPlanDrift, receipts.flatMap(accept)),
          );
        }
        mutate(repo, orderPath("WO-901"), "useful", "useful-final");
        // Old receipts remain immutable, but a fourth attempt has no count gate.
        const third = receipts[2];
        assert.equal(
          checkPassReceipt(passFor(repo), third.subject, receipts, [], {
            requireLive: false,
          }),
          third,
          "accepted dispositions bind the repaired criterion even when a later old-format receipt repeats its hold",
        );
        assert.equal((await readReceipts(repo)).length, 3);
        write(
          repo,
          PLAN_LEDGER,
          `${read(repo, PLAN_LEDGER)}\n## 2030-01-02 subsequent planning pass\n\nRepair the held horizon.\n`,
        );
        commit(repo, "next planning pass");
        const repaired = await writeReceipt(
          repo,
          passResult,
          receipts.flatMap(accept),
        );
        assert.equal(repaired.ordinal, 4);
        assert.equal(repaired.result.planVerdict, "pass");
        assert.equal((await readReceipts(repo)).length, 4);
        commit(repo, "immutable receipts");
        const path = join(repo, RECEIPTS, `${receipts[0].receiptId}.json`);
        renameSync(path, `${path}.hidden`);
        await assert.rejects(readReceipts(repo), /contained regular evidence/u);
        renameSync(`${path}.hidden`, path);
      },
    );
    await check(
      "AC2/4 transport adapters keep fixed schema, empty cwd and no model tools; host rejects a mismatched receipt",
      async () => {
        const repo = makeRepo(parent, "transport");
        const subject = buildPlanSubject(repo);
        const launches = [];
        for (const [Transport, wire] of [
          [
            ClaudeCliPrintWorkOrderTransport,
            (result) =>
              JSON.stringify({
                type: "result",
                subtype: "success",
                structured_output: result,
              }),
          ],
          [
            CodexCliExecWorkOrderTransport,
            (result) =>
              `${JSON.stringify({ type: "item.completed", item: { type: "agent_message", text: JSON.stringify(result) } })}\n${JSON.stringify({ type: "turn.completed" })}\n`,
          ],
        ]) {
          const runner = (launch) => {
            launches.push(launch);
            assert.ok(
              existsSync(join(launch.cwd, ".git")),
              "scratch cwd is a repository",
            );
            assert.equal(
              launch.input.includes("PLANNER_NARRATIVE_SENTINEL"),
              false,
            );
            return {
              accepted: Promise.resolve(),
              completed: Promise.resolve({
                stdout: wire(passResult(subject)),
                stderr: "",
                exitCode: 0,
              }),
              alive: () => false,
              kill: () => {},
            };
          };
          const transport = new Transport(
            runner,
            Transport === ClaudeCliPrintWorkOrderTransport
              ? "2.1.270"
              : "0.154.0",
          );
          const output = await runPlanRefutation(
            subject,
            transport,
            "fixture-model",
            Transport === ClaudeCliPrintWorkOrderTransport ? "max" : "unknown",
            now,
          );
          assert.equal(output.result.planVerdict, "pass");
          assert.equal(output.selectionSource, "host-launch");
        }
        assert.ok(launches[0].args.includes("--strict-mcp-config"));
        assert.equal(
          launches[0].args[launches[0].args.indexOf("--tools") + 1],
          "",
        );
        assert.ok(launches[1].args.includes("--ignore-user-config"));
        assert.ok(launches[1].args.includes("project_doc_max_bytes=0"));
        assert.notEqual(launches[0].cwd, repo);
        const fake = new FakePlanRefutationTransport();
        const original = fake.dispatch.bind(fake);
        fake.dispatch = (request, clock) => ({
          ...original(request, clock),
          receipt: Promise.resolve({
            commandId: "wrong",
            transport: "fake",
            acceptedAt: clock(),
          }),
        });
        await assert.rejects(
          runPlanRefutation(subject, fake, "fixture", "max", now),
        );
      },
    );
    await check(
      "WO-142 B4 rejected paid return and statement survive in local lane",
      async () => {
        const repo = makeRepo(parent, "rejected-plan-return");
        const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const bad = cannedGoalReview(subject);
        bad.orders[0].findings = [
          {
            criterionId: subject.orders[0].criteria[0].id,
            kind: "known-issue",
            reason: "Synthetic issue",
            evidence: null,
            reopenWhen: null,
          },
        ];
        const statement = "Synthetic worker statement preserved exactly.";
        const transport = new ClaudeCliPrintWorkOrderTransport(
          () => ({
            accepted: Promise.resolve(),
            completed: Promise.resolve({
              stdout: JSON.stringify({
                type: "result",
                subtype: "success",
                structured_output: bad,
                result: statement,
              }),
              stderr: "",
              exitCode: 0,
            }),
            alive: () => false,
            kill: () => {},
          }),
          "2.1.270",
        );
        const lane = join(repo, "docs/control/local/refutations");
        await assert.rejects(
          runPlanRefutation(subject, transport, "fixture", "max", now, lane),
          /known issue requires a reopening observation; rejected result and statement retained at/,
        );
        const retained = join(lane, readdirSync(lane)[0]);
        assert.deepEqual(
          JSON.parse(readFileSync(join(retained, "result.json"), "utf8")),
          bad,
        );
        assert.equal(
          readFileSync(join(retained, "statement.txt"), "utf8"),
          statement,
        );
        assert.ok(existsSync(join(retained, "wire.jsonl")));
        const branches =
          planResultSchema(subject).properties.orders.items.properties.findings
            .items.anyOf;
        const known = branches.find((branch) =>
          branch.properties.kind.enum?.includes("known-issue"),
        );
        assert.equal(known.properties.reopenWhen.type, "string");
        assert.equal(known.properties.reopenWhen.minLength, 1);
        for (const branch of branches.filter((branch) => branch !== known)) {
          assert.equal(branch.properties.evidence.type, "string");
          assert.ok(branch.properties.evidence.enum.length > 0);
        }
      },
    );
    await check(
      "WO-125 plan CLI accepts Codex GPT-6 Astra/max and records only a launch claim",
      async () => {
        const repo = makeRepo(parent, "codex-effort-cli");
        const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const bin = join(repo, "bin");
        mkdirSync(bin);
        const argsPath = join(repo, "codex-args.json");
        const wire =
          [
            {
              type: "item.completed",
              item: {
                type: "agent_message",
                text: JSON.stringify(cannedGoalReview(subject)),
              },
            },
            {
              type: "turn.completed",
              usage: { input_tokens: 10, output_tokens: 5 },
            },
          ]
            .map((row) => JSON.stringify(row))
            .join("\n") + "\n";
        writeFileSync(
          join(bin, "codex"),
          `#!/usr/bin/env node
const fs = require("node:fs");
if (process.argv[2] === "--version") console.log("codex-cli 0.154.0");
else {
  fs.readFileSync(0, "utf8");
  fs.writeFileSync(${JSON.stringify(argsPath)}, JSON.stringify(process.argv.slice(2)));
  process.stdout.write(${JSON.stringify(wire)});
}
`,
          { mode: 0o755 },
        );
        const previousPath = process.env.PATH;
        try {
          process.env.PATH = `${bin}:${previousPath ?? ""}`;
          const result = await plan(
            [
              "refute",
              "--transport",
              "codex-cli-exec",
              "--model",
              "gpt-6-astra",
              "--effort",
              "max",
            ],
            repo,
          );
          assert.equal(result.verdict, "aligned");
        } finally {
          if (previousPath === undefined) delete process.env.PATH;
          else process.env.PATH = previousPath;
        }
        const args = JSON.parse(readFileSync(argsPath, "utf8"));
        assert.equal(args[args.indexOf("--model") + 1], "gpt-6-astra");
        assert.deepEqual(args.slice(-3), [
          "-c",
          'model_reasoning_effort="max"',
          "-",
        ]);
        assert.ok(args.includes("--ignore-user-config"));
        const receipt = (await readReceipts(repo))[0];
        assert.equal(receipt.episode.model, "gpt-6-astra");
        assert.equal(receipt.episode.effort, "max");
        assert.equal(receipt.episode.selectionSource, "host-launch");
        assert.equal(receipt.episode.effectiveEffort, "unknown");
      },
    );
    await check(
      "WO-139 source-bound execution amendments admit only authorized bytes and preserve receipt/hold semantics",
      async () => {
        const laterHeading = "intro\n# Later (v1.2.3)\n";
        assert.equal(
          executionAmendmentSource(laterHeading),
          laterHeading.trimEnd(),
        );
        assert.equal(
          executionAmendmentSource("# First (v1.2.3)\n"),
          "# First (version assigned at activation)",
        );
        const repo = makeRepo(parent, "execution-amendment");
        const path = orderPath("WO-901");
        mutate(
          repo,
          path,
          "# WO-901 — Fixture",
          "# WO-901 — Fixture (version assigned at activation)",
        );
        const receipt = await writeDirectReceipt(repo);
        commit(repo, "record reviewed plan");
        const receiptBytes = read(
          repo,
          `${RECEIPTS}/${receipt.receiptId}.json`,
        );
        const decision = {
          id: "WO-901-D001",
          date: "2030-01-02",
          dispatch:
            "scope expand: operator authorizes bounded execution repair",
          decision: "Repair the observed fixture defect within the order",
          evidence: ["operator direction; reproduced failure"],
          rejected: ["NoOp retains a failing check"],
          reopenWhen: "A distinct defect changes scope",
        };
        const decisionPath = "docs/evidence/WO-901/decisions.md";
        write(
          repo,
          decisionPath,
          `# Decisions\n\n\`\`\`json\n${JSON.stringify(decision)}\n\`\`\`\n`,
        );
        write(
          repo,
          path,
          read(repo, path).replace("useful shape", "repaired useful shape"),
        );
        write(
          repo,
          path,
          read(repo, path).replace(
            "Other shapes.",
            "Other shapes except the authorized repair.",
          ),
        );
        await assert.rejects(
          checkPlanGate(repo),
          /work-order bytes changed|no text-bound disposition/,
        );
        write(
          repo,
          path,
          read(repo, path) +
            "\n## Execution record\n\nExisting approved evidence.\n",
        );
        const event = await amendPlanOrder(repo, {
          workOrderId: "WO-901",
          decisionId: decision.id,
          reason: "Operator authorized the bounded repair",
          now: () => "2030-01-02T13:00:00.000Z",
        });
        assert.equal(event.type, "PlanExecutionAmended");
        assert.deepEqual(
          criterionDispositions([receipt], [event]),
          [],
          "amendments are never hold dispositions",
        );
        const log = read(repo, OVERRIDES);
        assert.deepEqual(
          await amendPlanOrder(repo, {
            workOrderId: "WO-901",
            decisionId: decision.id,
            reason: "Repeat same authorization",
            now: () => "2030-01-02T14:00:00.000Z",
          }),
          event,
        );
        assert.equal(read(repo, OVERRIDES), log);
        assert.equal(
          (await checkPlanGate(repo)).continuation.workspaceUpdates[0].kind,
          "authorized-execution-amendment",
        );
        for (const field of [
          "receiptHash",
          "sourceOrderHash",
          "orderHash",
          "decisionHash",
        ]) {
          write(
            repo,
            OVERRIDES,
            JSON.stringify({ ...event, [field]: sha256("wrong") }) + "\n",
          );
          await assert.rejects(
            checkPlanGate(repo),
            /execution amendment|planning pass needs a receipt matching/,
          );
        }
        write(
          repo,
          OVERRIDES,
          JSON.stringify({ ...event, orderLength: event.orderLength + 1 }) +
            "\n",
        );
        await assert.rejects(
          checkPlanGate(repo),
          /planning pass needs a receipt matching/,
        );
        write(repo, OVERRIDES, log);
        write(
          repo,
          decisionPath,
          read(repo, decisionPath).replace(
            "Repair the observed",
            "Change the observed",
          ),
        );
        await assert.rejects(checkPlanGate(repo), /decision binding differs/);
        write(
          repo,
          decisionPath,
          `# Decisions\n\n\`\`\`json\n${JSON.stringify(decision)}\n\`\`\`\n`,
        );
        const approved = read(repo, path);
        write(
          repo,
          path,
          approved.replace(
            "Existing approved evidence.",
            "Rewritten evidence.",
          ),
        );
        await assert.rejects(checkPlanGate(repo));
        write(repo, path, approved);
        const decisionBytes = read(repo, decisionPath);
        const outside = join(parent, "outside-decision.md");
        writeFileSync(outside, decisionBytes);
        rmSync(join(repo, decisionPath));
        symlinkSync(outside, join(repo, decisionPath));
        await assert.rejects(checkPlanGate(repo), /contained regular file/);
        rmSync(join(repo, decisionPath));
        write(repo, decisionPath, decisionBytes);
        write(
          repo,
          path,
          approved.replace("bounded result", "unbounded result"),
        );
        await assert.rejects(
          checkPlanGate(repo),
          /work-order bytes changed|no text-bound disposition/,
        );
        write(
          repo,
          path,
          approved.replace("(version assigned at activation)", "(v1.2.3)") +
            "\n## Execution record\n\nVerified bounded repair.\n",
        );
        assert.equal(
          (await checkPlanGate(repo)).continuation.workspaceUpdates[0].kind,
          "authorized-execution-amendment",
        );
        commit(repo, "authorized execution repair");
        assert.equal(
          (await checkPlanGate(repo)).continuation.committedUpdates[0].kind,
          "authorized-execution-amendment",
        );
        assert.equal(
          read(repo, `${RECEIPTS}/${receipt.receiptId}.json`),
          receiptBytes,
        );
        write(repo, OVERRIDES, "");
        assert.throws(() => readOverrides(repo), /append-only/);
        write(repo, OVERRIDES, log);
      },
    );
    await check(
      "WO-139 execution amendments do not discharge an independent hold",
      async () => {
        const repo = makeRepo(parent, "execution-amendment-held");
        const receipt = await writeDirectReceipt(repo, cannedPlanDrift);
        commit(repo, "held plan");
        const decision = {
          id: "WO-901-D001",
          date: "2030-01-02",
          dispatch: "scope expand: authorized repair",
          decision: "Repair the fixture",
          evidence: ["operator direction"],
          rejected: [],
          reopenWhen: "More evidence",
        };
        write(
          repo,
          "docs/evidence/WO-901/decisions.md",
          `# Decisions\n\n\`\`\`json\n${JSON.stringify(decision)}\n\`\`\`\n`,
        );
        mutate(repo, orderPath("WO-901"), "useful shape", "repaired shape");
        await amendPlanOrder(repo, {
          workOrderId: "WO-901",
          decisionId: decision.id,
          reason: "Authorized repair, no hold waiver",
          now: () => "2030-01-02T13:00:00.000Z",
        });
        assert.deepEqual(
          criterionDispositions([receipt], readOverrides(repo)),
          [],
        );
        await assert.rejects(
          checkPlanGate(repo),
          /hold|unaddressed|unanswered/,
        );
      },
    );
    await check(
      "WO-139 inherited capability rows can be restored only with exact dated preservation",
      async () => {
        const repo = makeRepo(parent, "capability-history-repair");
        const path = "docs/planning/capability-table.md";
        write(
          repo,
          path,
          read(repo, path) +
            "| `fixture.second` | **0 — latent** | Second fixture observation. |\n",
        );
        commit(repo, "two capability rows");
        const receipt = await writeDirectReceipt(repo);
        commit(repo, "record reviewed plan");
        const original = read(repo, path);
        const changed = original.replace("**0", "**1");
        assert.notEqual(changed, original);
        const changedRows = changed
          .split("\n")
          .filter((line, index) => line !== original.split("\n")[index]);
        const appendix =
          "\n\n## WO-901 dated reassessment (2030-01-02)\n\n" +
          "| Capability | Observation | Evidence |\n| --- | --- | --- |\n" +
          changedRows.join("\n") +
          "\n";
        const repaired = original.trimEnd() + appendix;
        const proof = (head, workspace = repaired) =>
          capabilityHistoryRepair(original, head, workspace, receipt.subject);
        assert.equal(proof(changed).kind, "pending-capability-history-repair");
        for (const [head, workspace] of [
          [changed, original],
          [changed, repaired.replace("**1", "**2")],
          [changed, repaired.replace("**0", "**2")],
          [changed.replace("`fixture.first`", "`fixture.other`"), repaired],
          [changed + "extra\n", repaired],
          [changed.replace(/^# /u, "# Changed "), repaired],
        ])
          assert.throws(
            () => proof(head, workspace),
            /matching the current subject/u,
          );
        // More than one inherited edit must preserve every changed row.
        const two = original.replaceAll("**0", "**1");
        assert.notEqual(two, changed);
        assert.throws(() => proof(two), /every changed committed row/u);
        const secondRow = two
          .split("\n")
          .find((line) => line.includes("`fixture.second`"));
        assert.equal(proof(two, repaired + secondRow + "\n").ids.length, 2);
        write(repo, path, changed);
        commit(repo, "inherited overwritten observation");
        await assert.rejects(
          checkPlanGate(repo),
          /matching the current subject/u,
        );
        write(repo, path, original);
        await assert.rejects(
          checkPlanGate(repo),
          /matching the current subject/u,
        );
        write(repo, path, repaired);
        const pending = await checkPlanGate(repo);
        assert.equal(
          pending.continuation.committedUpdates[0].kind,
          "pending-capability-history-repair",
        );
        assert.equal(
          pending.continuation.workspaceUpdates[0].kind,
          "dated-capability-reassessment",
        );
        commit(repo, "restore history and preserve dated observation");
        const completed = await checkPlanGate(repo);
        assert.equal(
          completed.continuation.committedUpdates[0].kind,
          "dated-capability-reassessment",
        );
        assert.deepEqual(
          completed.continuation.committedUpdates,
          completed.continuation.workspaceUpdates,
        );
        assert.equal(
          (await readReceipts(repo))[0].receiptHash,
          receipt.receiptHash,
        );
      },
    );
    await check(
      "WO-042 continuation admits required execution metadata before and after commit without rewriting the receipt",
      async () => {
        const repo = makeRepo(parent, "execution-continuation");
        mutate(
          repo,
          orderPath("WO-901"),
          "# WO-901 — Fixture",
          "# WO-901 — Fixture (version assigned at activation)",
        );
        const receipt = await writeDirectReceipt(repo);
        commit(repo, "record reviewed plan");
        const receiptJson = read(repo, `${RECEIPTS}/${receipt.receiptId}.json`);
        const source = read(repo, orderPath("WO-901"));
        write(
          repo,
          orderPath("WO-901"),
          source.replace("(version assigned at activation)", "(v1.2.3)") +
            "\n## Execution record\n\nThe required evidence and its independent review are recorded separately.\n",
        );
        write(
          repo,
          "docs/planning/capability-table.md",
          read(repo, "docs/planning/capability-table.md") +
            "\n## WO-901 dated reassessment (2030-01-02)\n\n| Capability | Observation | Evidence |\n| --- | --- | --- |\n| `fixture.first` | **1 — demonstrable** | Executed fixture; pending independent verification. |\n",
        );
        const dirty = await checkPlanGate(repo);
        assert.deepEqual(
          dirty.continuation.workspaceUpdates.map(({ kind }) => kind),
          [
            "release-assignment",
            "execution-record",
            "dated-capability-reassessment",
          ],
        );
        assert.deepEqual(dirty.continuation.committedUpdates, []);
        assert.equal(dirty.continuation.judgedSubject, receipt.subject.hash);
        assert.notEqual(
          dirty.continuation.workspaceSubject,
          receipt.subject.hash,
        );
        await assert.rejects(
          writeDirectReceipt(repo),
          /current committed and workspace subject/u,
        );
        commit(repo, "required executor observations");
        const committed = await checkPlanGate(repo);
        assert.deepEqual(
          committed.continuation.committedUpdates,
          dirty.continuation.workspaceUpdates,
        );
        assert.deepEqual(
          committed.continuation.workspaceUpdates,
          dirty.continuation.workspaceUpdates,
        );
        assert.equal(
          read(repo, `${RECEIPTS}/${receipt.receiptId}.json`),
          receiptJson,
        );
        assert.deepEqual(await readReceipts(repo), [receipt]);
      },
    );
    await check(
      "WO-135 admits only the exact evidence-only release-header format correction",
      async () => {
        for (const axis of ["patch", "minor", "major"]) {
          const repo = makeRepo(parent, `release-header-${axis}`);
          const path = orderPath("WO-901");
          const legacy = `**Release classification:** ${axis}, evidence-only. A probe extension under the existing contract.`;
          const canonical = `**Release classification:** ${axis}. Evidence-only: a probe extension under the existing contract.`;
          const source = read(repo, path).replace(
            "# WO-901 — Fixture\n",
            `# WO-901 — Fixture (version assigned at activation)\n\n${legacy}\n`,
          );
          write(repo, path, source);
          commit(repo, "legacy release declaration subject");
          const receipt = await writeDirectReceipt(repo);
          commit(repo, "judge the legacy release declaration");
          const receiptJson = read(
            repo,
            `${RECEIPTS}/${receipt.receiptId}.json`,
          );
          const corrected = source
            .replace(legacy, canonical)
            .replace("(version assigned at activation)", "(v1.2.3)");
          write(repo, path, corrected);
          const result = await checkPlanGate(repo);
          assert.deepEqual(
            result.continuation.workspaceUpdates.map(({ kind }) => kind),
            ["release-classification-format", "release-assignment"],
          );
          for (const invalid of [
            corrected.replace(
              `${axis}. Evidence-only:`,
              `${axis === "patch" ? "minor" : "patch"}. Evidence-only:`,
            ),
            corrected.replace("the existing contract", "a changed contract"),
            corrected.replace("Evidence-only: a", "A"),
            corrected.replace("Evidence-only: a", "Evidence-only: another"),
          ]) {
            write(repo, path, invalid);
            await assert.rejects(
              checkPlanGate(repo),
              /existing work-order bytes changed/u,
            );
          }
          write(repo, path, corrected);
          commit(repo, "canonical release declaration and assigned version");
          assert.deepEqual(
            (await checkPlanGate(repo)).continuation.committedUpdates,
            result.continuation.workspaceUpdates,
          );
          assert.equal(
            read(repo, `${RECEIPTS}/${receipt.receiptId}.json`),
            receiptJson,
          );
        }
        const repo = makeRepo(parent, "release-header-without-legacy");
        const path = orderPath("WO-901");
        write(
          repo,
          path,
          read(repo, path) +
            "\n**Release classification:** patch. A probe extension under the existing contract.\n",
        );
        commit(repo, "release declaration without legacy prefix");
        await writeDirectReceipt(repo);
        commit(repo, "judge a declaration without evidence-only status");
        mutate(repo, path, "patch. A probe", "patch. Evidence-only: a probe");
        await assert.rejects(
          checkPlanGate(repo),
          /existing work-order bytes changed/u,
        );
      },
    );
    await check(
      "WO-135 replays the actual WO-068/WO-052 additions against receipts 014/015",
      () => {
        const receipts = readdirSync(join(root, RECEIPTS))
          .filter((name) => /-01[456]\.json$/.test(name))
          .map((name) => JSON.parse(read(root, `${RECEIPTS}/${name}`)))
          .sort((a, b) => a.ordinal - b.ordinal);
        assert.deepEqual(
          receipts.map((row) => row.ordinal),
          [14, 15, 16],
        );
        for (const [index, workOrderId, id] of [
          [0, "WO-068", "runtime.resident"],
          [1, "WO-052", "worker.source-change"],
        ]) {
          const judged = receipts[index].subject;
          const before = committedReader(root, judged.revision).read(
            "docs/planning/capability-table.md",
          );
          const later = committedReader(
            root,
            receipts[index + 1].subject.revision,
          ).read("docs/planning/capability-table.md");
          const section = later.match(
            new RegExp(
              `^## ${workOrderId} dated addition[^\n]*\n[\\s\\S]*?(?=^## |$(?![\\s\\S]))`,
              "m",
            ),
          )?.[0];
          assert.ok(section, `${workOrderId} historical section`);
          assert.equal(
            judged.standard.capabilities.some((row) => row.id === id),
            false,
          );
          const snapshot = JSON.stringify(judged);
          assert.deepEqual(
            reassessments(
              before,
              before.trimEnd() + "\n\n" + section,
              judged,
            ).map(({ kind, ids }) => ({ kind, ids })),
            [{ kind: "dated-capability-addition", ids: [id] }],
          );
          assert.equal(JSON.stringify(judged), snapshot);
        }
      },
    );
    await check(
      "WO-135 historical sequence failures reach both gates and original pair separators are pinned",
      async () => {
        const path = "docs/planning/sequence.md";
        const prior = committedReader(
          root,
          "ec502c991ca5cde39b131fdbb6432644328cc22f",
        ).read(path);
        const corrected = committedReader(
          root,
          "45765940a9715c8aee52215c3bfbed74de0ce838",
        ).read(path);
        const grouped = (source) =>
          parseSequenceGroups(source).map((group) =>
            group.map((row) => row.id),
          );
        const expectedPairs = [
          ["WO-135", "WO-136"],
          ["WO-053", "WO-139"],
          ["WO-054", "WO-137"],
          ["WO-055", "WO-140"],
          ["WO-056", "WO-110"],
          ["WO-099", "WO-079"],
          ["WO-069", "WO-138"],
          ["WO-071", "WO-120"],
          ["WO-063", "WO-100"],
          ["WO-064", "WO-111"],
          ["WO-114", "WO-070"],
          ["WO-115", "WO-060"],
          ["WO-116", "WO-065"],
          ["WO-117", "WO-066"],
        ];
        assert.equal(grouped(corrected)[0].length, 24);
        assert.deepEqual(grouped(corrected).slice(1, -1), expectedPairs);
        assert.equal(grouped(corrected).at(-1).length, 36);
        const lost = corrected.replace(/(^- WO-136[^\n]*\n)\n/m, "$1");
        const added = corrected.replace(/(^- WO-135[^\n]*\n)/m, "$1\n");
        assert.notDeepEqual(grouped(lost), grouped(corrected));
        assert.notDeepEqual(grouped(added), grouped(corrected));
        assert.doesNotThrow(() => checkSequenceTopology(readIndex(root, [])));
        const repo = makeRepo(parent, "historical-topology");
        write(repo, PLAN_MAP, corrected);
        const frozen = committedReader(
          root,
          "45765940a9715c8aee52215c3bfbed74de0ce838",
        );
        for (const path of frozen.paths.filter((path) =>
          /^docs\/work-orders\/WO-\d{3}-[^/]+\.md$/.test(path),
        ))
          write(repo, path, frozen.read(path));
        // Freeze satisfaction at the original pass; future closes cannot erase the failures.
        for (const [path, source] of (
          await import("./lib/control-store.mjs")
        ).readControl(root, frozen.revision).sources)
          write(repo, path, source);
        const groups = parseSequenceGroups(corrected);
        assert.doesNotThrow(() =>
          checkSequenceTopology({
            ...readIndex(repo, []),
            groups,
            sequence: groups.flat(),
          }),
        );
        commit(repo, "frozen corrected planning fixture");
        await writeDirectReceipt(repo);
        commit(repo, "record historical fixture receipt");
        workOrders(["index"], repo);
        assert.doesNotThrow(() => workOrders(["index", "--check"], repo));
        await assert.doesNotReject(plan(["check"], repo));
        write(repo, PLAN_MAP, prior);
        const failures = ["WO-114 -> WO-120 (hard)", "WO-115 -> WO-100 (hard)"];
        const diagnostic = (error) => {
          for (const failure of failures)
            assert.ok(error.message.includes(failure), error.message);
          return true;
        };
        assert.throws(() => workOrders(["index", "--check"], repo), diagnostic);
        await assert.rejects(plan(["check"], repo), diagnostic);
      },
    );
    await check(
      "WO-135 dated additions are execution updates in plan check, with unchanged refusal messages",
      async () => {
        const repo = makeRepo(parent, "capability-additions");
        const receipt = await writeDirectReceipt(repo);
        commit(repo, "record reviewed plan");
        const path = "docs/planning/capability-table.md";
        const before = read(repo, path);
        for (const heading of ["addition", "reassessment"]) {
          const appended = `\n## WO-901 dated ${heading} (2030-01-02)\n\n| Capability | Observation |\n| --- | --- |\n| \`fixture.new\` | **1 — demonstrable** |\n`;
          write(repo, path, before + appended);
          const result = await plan(["check"], repo);
          assert.match(JSON.stringify(result), /dated-capability-addition/);
          assert.deepEqual(
            reassessments(before, before + appended, receipt.subject)[0].ids,
            ["fixture.new"],
          );
          assert.throws(
            () =>
              reassessments(
                before,
                before + appended.replace("**1 — demonstrable**", ""),
                receipt.subject,
              ),
            /missing capability observation fixture.new/,
          );
          assert.throws(
            () =>
              reassessments(
                before,
                before + appended + "\n## Stray\n",
                receipt.subject,
              ),
            /capability additions must be appended dated reassessment sections/,
          );
        }
        write(
          repo,
          path,
          before +
            "\n## WO-901 dated addition (2030-01-02)\n\n| `fixture.first` | 1 |\n",
        );
        assert.equal(
          (await checkPlanGate(repo)).continuation.workspaceUpdates[0].kind,
          "dated-capability-reassessment",
        );
        assert.deepEqual(await readReceipts(repo), [receipt]);
      },
    );
    await check(
      "WO-135 both current gates refuse dependency reversals and pairs using typed satisfaction",
      async () => {
        const repo = makeRepo(parent, "sequence-topology");
        const block = (entries) =>
          `\n<!-- dotln-dependencies:start -->\n${JSON.stringify(entries)}\n<!-- dotln-dependencies:end -->\n`;
        const sequence = (groups) =>
          `<!-- dotln-work-order-sequence:start -->\n${groups.map((group) => group.map((id) => `- ${id} — Fixture`).join("\n")).join("\n\n")}\n<!-- dotln-work-order-sequence:end -->\n`;
        const edge = {
          workOrderId: "WO-902",
          relation: "hard",
          reason: "Fixture prerequisite",
        };
        write(
          repo,
          orderPath("WO-901"),
          order("WO-901").replace(
            "**Objective:**",
            block([edge]) + "\n**Objective:**",
          ),
        );
        workOrders(["index"], repo);
        const bothRefuse = async () => {
          await assert.rejects(
            plan(["check"], repo),
            /WO-901 -> WO-902 \(hard\)/,
          );
          assert.throws(
            () => workOrders(["index", "--check"], repo),
            /WO-901 -> WO-902 \(hard\)/,
          );
        };
        await bothRefuse();
        write(repo, PLAN_MAP, sequence([["WO-902", "WO-901"]]));
        await bothRefuse(); // Ordered, but the pair cannot execute independently.
        write(repo, orderPath("WO-903"), order("WO-903"));
        write(repo, PLAN_MAP, sequence([["WO-902", "WO-901", "WO-903"]]));
        assert.doesNotThrow(() => checkSequenceTopology(readIndex(repo, [])));
        write(repo, PLAN_MAP, sequence([["WO-901", "WO-902", "WO-903"]]));
        await bothRefuse();
        for (const relation of [
          "hard",
          "satisfied-by-close",
          "satisfied-by-release",
          "planning-deferral",
        ]) {
          const entry = {
            ...edge,
            relation,
            ...(relation === "satisfied-by-release"
              ? { release: "v1.0.0" }
              : {}),
            ...(relation === "planning-deferral"
              ? { workOrderId: "WO-999", until: "WO-902" }
              : {}),
          };
          const groups = parseSequenceGroups(sequence([["WO-901", "WO-902"]]));
          const view = (closed, releases) => ({
            groups,
            sequence: groups.flat(),
            rows: [
              {
                id: "WO-901",
                dependencies: projectDependencies(
                  { source: "typed", entries: [entry] },
                  closed,
                  releases,
                ),
              },
            ],
          });
          assert.throws(
            () => checkSequenceTopology(view(new Map(), new Set())),
            (error) => error.message.includes(`WO-901 -> WO-902 (${relation})`),
          );
          assert.doesNotThrow(() =>
            checkSequenceTopology(
              view(new Map([["WO-902", "pass"]]), new Set(["v1.0.0"])),
            ),
          );
        }
      },
    );
    await check(
      "WO-043 continuation admits only the reviewed dependency transcription and preserves receipt bytes",
      async () => {
        const repo = makeRepo(parent, "dependency-continuation");
        renameSync(
          join(repo, orderPath("WO-901")),
          join(repo, orderPath("WO-043")),
        );
        write(
          repo,
          orderPath("WO-043"),
          read(repo, orderPath("WO-043"))
            .replaceAll("WO-901", "WO-043")
            .replace(
              "Keep a bounded result.",
              "Every open order carries a typed block matching docs/planning/critical-path-2026-09-08.json.",
            ),
        );
        write(
          repo,
          PLAN_MAP,
          read(repo, PLAN_MAP)
            .replace("WO-901", "WO-043")
            .replace(
              "<!-- dotln-work-order-sequence:end -->",
              "- WO-033 — Umbrella\n- WO-036 — Later umbrella\n- WO-102 — Corpus\n<!-- dotln-work-order-sequence:end -->",
            ),
        );
        const metadata = (source, value) =>
          source.replace("**Objective:**", `${value}\n\n**Objective:**`);
        write(
          repo,
          orderPath("WO-033"),
          metadata(
            order("WO-033"),
            "**Umbrella record (2026-09-08):** superseded whole by WO-902; not activatable. WO-039 supplied earlier evidence.",
          ),
        );
        write(
          repo,
          orderPath("WO-036"),
          metadata(
            order("WO-036"),
            "**Umbrella record (2026-09-09):** superseded whole by WO-126 criterion 6; not activatable.",
          ),
        );
        write(
          repo,
          orderPath("WO-102"),
          metadata(
            order("WO-102"),
            "**Depends on:** WO-004 merged; independent of WO-101.",
          ),
        );
        const seedPath = "docs/planning/critical-path-2026-09-08.json";
        const seed = JSON.stringify({
          nodes: [{ id: "WO-033", supersededBy: { workOrderIds: ["WO-902"] } }],
          edges: [
            {
              from: "WO-902",
              to: "WO-043",
              relation: "hard",
              reason: "Required baseline.",
            },
            {
              from: "WO-036",
              to: "WO-018",
              relation: "satisfied-by-release",
              release: "v0.4.1",
              reason: "Earlier baseline.",
            },
          ],
        });
        write(repo, seedPath, seed);
        commit(repo, "reviewed dependency migration authority");
        const receipt = await writeDirectReceipt(repo);
        commit(repo, "record reviewed dependency plan");
        const receiptBytes = read(
          repo,
          `${RECEIPTS}/${receipt.receiptId}.json`,
        );
        const entries = new Map([
          ["WO-043", []],
          [
            "WO-902",
            [
              {
                workOrderId: "WO-043",
                relation: "hard",
                reason: "Required baseline.",
              },
            ],
          ],
          [
            "WO-033",
            [
              {
                workOrderId: "WO-902",
                relation: "superseded",
                by: "WO-902",
                reason: "Reviewed umbrella successor.",
              },
            ],
          ],
          [
            "WO-036",
            [
              {
                workOrderId: "WO-126",
                relation: "superseded",
                by: "WO-126",
                reason: "Later reviewed successor.",
              },
            ],
          ],
          [
            "WO-102",
            [
              {
                workOrderId: "WO-004",
                relation: "satisfied-by-close",
                reason: "Merged baseline.",
              },
              {
                workOrderId: "WO-101",
                relation: "reference-only",
                reason: "Independent corpus.",
              },
            ],
          ],
        ]);
        const originals = new Map(
          [...entries.keys()].map((id) => [id, read(repo, orderPath(id))]),
        );
        const migrate = (id, relations) =>
          metadata(
            originals.get(id),
            `<!-- dotln-dependencies:start -->\n${JSON.stringify(relations, null, 2)}\n<!-- dotln-dependencies:end -->`,
          );
        for (const [id, relations] of entries)
          write(repo, orderPath(id), migrate(id, relations));
        const dirty = await checkPlanGate(repo);
        assert.equal(dirty.continuation.workspaceUpdates.length, entries.size);
        assert.ok(
          dirty.continuation.workspaceUpdates.every(
            ({ kind }) => kind === "typed-dependency-migration",
          ),
        );
        for (const relations of [
          [],
          [
            {
              workOrderId: "WO-043",
              relation: "reference-only",
              reason: "Required baseline.",
            },
          ],
          [
            {
              workOrderId: "WO-043",
              relation: "waived",
              date: "2030-01-02",
              reason: "Unreviewed waiver.",
            },
          ],
        ]) {
          write(repo, orderPath("WO-902"), migrate("WO-902", relations));
          await assert.rejects(
            checkPlanGate(repo),
            /does not transcribe the reviewed relations/u,
          );
        }
        write(
          repo,
          orderPath("WO-902"),
          migrate("WO-902", entries.get("WO-902")).replace(
            "Move the shape.",
            "Change the objective.",
          ),
        );
        await assert.rejects(
          checkPlanGate(repo),
          /existing work-order bytes changed/u,
        );
        write(
          repo,
          orderPath("WO-902"),
          migrate("WO-902", entries.get("WO-902")),
        );
        write(repo, seedPath, seed + "\n");
        await assert.rejects(checkPlanGate(repo), /changed its reviewed seed/u);
        write(repo, seedPath, seed);
        commit(repo, "transcribe reviewed dependencies");
        const committed = await checkPlanGate(repo);
        assert.deepEqual(
          committed.continuation.committedUpdates,
          dirty.continuation.workspaceUpdates,
        );
        assert.equal(
          read(repo, `${RECEIPTS}/${receipt.receiptId}.json`),
          receiptBytes,
        );
        assert.deepEqual(await readReceipts(repo), [receipt]);

        const unrelated = makeRepo(parent, "dependency-without-authority");
        await writeDirectReceipt(unrelated);
        commit(unrelated, "record unrelated reviewed plan");
        write(
          unrelated,
          orderPath("WO-902"),
          metadata(
            read(unrelated, orderPath("WO-902")),
            "<!-- dotln-dependencies:start -->\n[]\n<!-- dotln-dependencies:end -->",
          ),
        );
        await assert.rejects(
          checkPlanGate(unrelated),
          /existing work-order bytes changed/u,
        );
      },
    );
    await check(
      "WO-042 continuation rejects planning edits and forged execution classifications in both HEAD and the workspace",
      async () => {
        const repo = makeRepo(parent, "continuation-refusals");
        mutate(
          repo,
          orderPath("WO-901"),
          "# WO-901 — Fixture",
          "# WO-901 — Fixture (version assigned at activation)",
        );
        await writeDirectReceipt(repo);
        commit(repo, "record reviewed plan");
        const path = orderPath("WO-901");
        const original = read(repo, path);
        const capabilitiesPath = "docs/planning/capability-table.md";
        const capabilities = read(repo, capabilitiesPath);
        for (const changed of [
          original.replace("Move the shape.", "Move another shape."),
          original.replace("Keep a bounded result.", "Skip the evidence."),
          original.replace("Other shapes.", "No limits."),
          original.replace(
            "**Effort:** executor any",
            "**Effort:** executor low",
          ),
          original.replace("(version assigned at activation)", "(v01.2.3)"),
          original + "\n## Design change\n\nIgnore the original contract.\n",
          original +
            "\n## Execution record\n\n**Depends on:** A different order.\n",
        ]) {
          write(repo, path, changed);
          await assert.rejects(
            checkPlanGate(repo),
            /matching the current subject/u,
          );
          write(repo, path, original);
        }
        for (const [heading, id] of [
          ["WO-999 dated reassessment (2030-01-02)", "fixture.first"],
          ["WO-901 dated reassessment (2030-02-30)", "fixture.first"],
          ["WO-999 dated addition (2030-01-02)", "fixture.unknown"],
          ["WO-901 dated addition (2030-02-30)", "fixture.first"],
          ["WO-901 stray heading (2030-01-02)", "fixture.first"],
        ]) {
          write(
            repo,
            capabilitiesPath,
            capabilities +
              `\n## ${heading}\n\n| Capability | Observation |\n| --- | --- |\n| \`${id}\` | **1 — demonstrable** |\n`,
          );
          await assert.rejects(
            checkPlanGate(repo),
            /matching the current subject/u,
          );
          write(repo, capabilitiesPath, capabilities);
        }
        write(repo, capabilitiesPath, capabilities.replace("**0", "**1"));
        await assert.rejects(
          checkPlanGate(repo),
          /matching the current subject/u,
        );
        write(repo, capabilitiesPath, capabilities);
        write(
          repo,
          path,
          original.replace("Move the shape.", "Move another shape."),
        );
        commit(repo, "unreviewed committed objective");
        write(repo, path, original); // A clean-looking workspace cannot hide HEAD drift.
        await assert.rejects(
          checkPlanGate(repo),
          /matching the current subject/u,
        );
      },
    );
    await check(
      "AC5 forward-only gate, real-adapter fixture receipt, and stale committed standard refusal",
      async () => {
        const repo = makeRepo(parent, "gate");
        const subject = buildPlanSubject(repo);
        await assert.rejects(checkPlanGate(repo), /needs a receipt/u);
        const runner = () => ({
          accepted: Promise.resolve(),
          completed: Promise.resolve({
            stdout: JSON.stringify({
              type: "result",
              subtype: "success",
              structured_output: passResult(subject),
            }),
            stderr: "",
            exitCode: 0,
          }),
          alive: () => false,
          kill: () => {},
        });
        const output = await runPlanRefutation(
          subject,
          new ClaudeCliPrintWorkOrderTransport(runner, "2.1.270"),
          "fixture-model",
          "max",
          now,
        );
        await writePlanReceipt(repo, {
          pass: passFor(repo),
          slug: "gate",
          subject,
          episode: output,
        });
        commit(repo, "commit receipt");
        assert.equal((await checkPlanGate(repo)).passes, 1); // 2029 pass is pre-mechanism.
        for (const [path, from, to] of [
          [PLAN_MAP, "First", "first"],
          [orderPath("WO-901"), "useful shape", "useful Shape"],
          [
            "docs/product/00-vision.md",
            "Evidence describes",
            "evidence describes",
          ],
          ["docs/product/13-uifa-roles.md", "A useful shape", "a useful shape"],
          ["docs/planning/capability-table.md", "**0", "**1"],
        ]) {
          mutate(repo, path, from, to);
          await assert.rejects(
            checkPlanGate(repo),
            /matching the current subject/u,
          );
        }
      },
    );
    await check(
      "receipt source symlinks refuse and CLI override retains the acting account label",
      async () => {
        const repo = makeRepo(parent, "cli");
        const receipt = await writeReceipt(repo);
        const capture = "docs/intake/notes/dispatch.md";
        write(repo, capture, "Fixture operator instruction.\n");
        const args = [
          "override",
          receipt.receiptId,
          receipt.holds[0].id,
          "Fixture override",
          "--capture",
          capture,
          "--harness",
          "human",
          "--harness-version",
          "fixture",
          "--model",
          "human",
          "--effort",
          "unknown",
          "--source",
          "operator-attested",
          "--account-label",
          "fixture",
        ];
        await assert.rejects(plan(args, repo), /capture-hash/u);
        // Keep this fixture's clock in the past for the real CLI clock read.
        const subject = buildPlanSubject(repo);
        const liveTime = await runPlanRefutation(
          subject,
          new FakePlanRefutationTransport(),
          "fixture",
          "max",
        );
        const secondPass = {
          id: "evidence-cli",
          kind: "evidence",
          heading: null,
        };
        const cliReceipt = await writePlanReceipt(repo, {
          pass: secondPass,
          slug: "cli",
          subject,
          episode: liveTime,
        });
        args[1] = cliReceipt.receiptId;
        args[2] = cliReceipt.holds[0].id;
        const response = await plan(
          [...args, "--capture-hash", sha256(read(repo, capture))],
          repo,
        );
        assert.equal(response.actor.accountLabel, "fixture");
        const invalid = join(repo, "docs/work-orders/WO-903-fixture.md");
        symlinkSync(orderPath("WO-901"), invalid);
        commit(repo, "symlink fixture");
        mutate(repo, PLAN_MAP, "WO-902", "WO-903");
        assert.throws(() => buildPlanSubject(repo), /committed regular file/u);
      },
    );

    await check(
      "WO-126 direct command files an immutable committed receipt, rejects bad input and carries unchanged verdicts",
      async () => {
        const repo = makeRepo(parent, "direct-command");
        runGit(repo, ["config", "user.name", "Direct Fixture"]);
        runGit(repo, ["config", "user.email", "fixture@example.invalid"]);
        await assert.rejects(
          plan(["refute", "--model", "fixture"], repo),
          /explicit --transport/u,
        );
        const prompt = await plan(["refute"], repo);
        assert.ok(typeof prompt === "string");
        assert.ok(JSON.parse(prompt).resultSchema);
        assert.ok(!prompt.includes("PLANNER_NARRATIVE_SENTINEL"));
        const subject = buildPlanSubject(repo, "HEAD", { goalReview: true });
        const resultPath = "docs/control/local/result.json",
          statementPath = "docs/control/local/statement.txt";
        write(repo, resultPath, "{}");
        write(
          repo,
          statementPath,
          "Synthetic direct judgment; canonical prompt only.",
        );
        await assert.rejects(
          plan(["receipt", resultPath, "--statement", statementPath], repo),
          /plan-goal-review-v1/,
        );
        write(repo, resultPath, JSON.stringify(cannedGoalReview(subject)));
        write(
          repo,
          orderPath("WO-901"),
          read(repo, orderPath("WO-901")).replace(
            "useful shape",
            "changed shape",
          ),
        );
        await assert.rejects(
          plan(["receipt", resultPath, "--statement", statementPath], repo),
          /stale/,
        );
        write(repo, orderPath("WO-901"), order("WO-901"));
        const first = await plan(
          ["receipt", resultPath, "--statement", statementPath],
          repo,
        );
        assert.equal(first.scope, "pass");
        assert.equal(first.verdict, "aligned");
        assert.equal(runGit(repo, ["status", "--porcelain"]), "");
        assert.match(
          runGit(repo, ["log", "-1", "--format=%s"]),
          /^Record planning refutation /,
        );
        await assert.rejects(
          plan(["refute", "--direct"], repo),
          /one judgment per pass/,
        );
        write(
          repo,
          PLAN_LEDGER,
          read(repo, PLAN_LEDGER) +
            "\n## 2030-01-03 next planning pass\n\nPLANNER_NARRATIVE_SENTINEL\n",
        );
        write(
          repo,
          orderPath("WO-901"),
          order("WO-901").replace("useful shape", "new useful shape"),
        );
        write(
          repo,
          orderPath("WO-902"),
          read(repo, orderPath("WO-902")).replace(
            "# WO-902 — Fixture",
            "# WO-902 — Fixture (v1.2.3)",
          ),
        );
        commit(repo, "one-order pass");
        const nextSubject = buildPlanSubject(repo, "HEAD", {
          goalReview: true,
        });
        const scope = await planJudgmentScope(
          repo,
          nextSubject,
          await latestPlanningPass(repo),
        );
        assert.deepEqual(scope.judgedOrderIds, ["WO-901"]);
        assert.equal(scope.carried[0].workOrderId, "WO-902");
        const currentOrder = nextSubject.orders.find(
          (row) => row.workOrderId === "WO-902",
        );
        const previousOrder = subject.orders.find(
          (row) => row.workOrderId === "WO-902",
        );
        assert.equal(planOrderHash(currentOrder), planOrderHash(previousOrder));
        assert.ok(
          carriedOrderHashMatches(
            currentOrder,
            previousOrder,
            planOrderHash(previousOrder, { legacy: true }),
          ),
        );
        assert.equal(
          carriedOrderHashMatches(
            { ...currentOrder, objective: "changed substantive objective" },
            previousOrder,
            planOrderHash(previousOrder, { legacy: true }),
          ),
          false,
        );
        const secondPrompt = await plan(["refute", "--direct"], repo);
        assert.ok(!secondPrompt.includes("PLANNER_NARRATIVE_SENTINEL"));
        const schema = JSON.parse(secondPrompt).resultSchema;
        assert.equal(schema.properties.orders.minItems, 1);
        assert.equal(schema.properties.orders.maxItems, 1);
        assert.deepEqual(
          schema.properties.orders.items.properties.workOrderId.enum,
          ["WO-901"],
        );
        const nextResult = cannedGoalReview(nextSubject);
        nextResult.orders = nextResult.orders.filter(
          (row) => row.workOrderId === "WO-901",
        );
        write(repo, resultPath, JSON.stringify(nextResult));
        const second = await plan(
          ["receipt", resultPath, "--statement", statementPath],
          repo,
        );
        assert.equal(second.carried, 1);
        assert.equal(second.verdict, "aligned");
        const receipts = await readReceipts(repo);
        assert.deepEqual(
          receipts[1].result.orders[1],
          receipts[0].result.orders[1],
        );
        assert.equal(receipts[1].episode.review.scope, "pass");
        assert.ok(receipts[1].episode.review.durationMs >= 0);
        assert.equal((await checkPlanGate(repo)).passes, 2);
      },
    );
    await check(
      "WO-126 planning start requires clean main and full scope retains every judgment",
      async () => {
        const repo = makeRepo(parent, "planning-start");
        runGit(repo, ["branch", "-M", "main"]);
        write(repo, "dirty.txt", "uncommitted");
        await assert.rejects(plan(["start", "fixture"], repo), /clean main/);
        commit(repo, "fixture input");
        const started = await plan(["start", "fixture"], repo);
        assert.match(started.branch, /^planning\/\d{4}-\d{2}-\d{2}-fixture$/);
        await assert.rejects(plan(["start", "second"], repo), /clean main/);
        const prompt = await plan(
          ["refute", "--direct", "--scope", "full"],
          repo,
        );
        assert.equal(JSON.parse(prompt).subject.scope, "full");
        const subject = buildPlanSubject(repo);
        const scope = await planJudgmentScope(
          repo,
          subject,
          await latestPlanningPass(repo),
          "full",
        );
        assert.deepEqual(scope.judgedOrderIds, ["WO-901", "WO-902"]);
        assert.deepEqual(scope.carried, []);
      },
    );
    await check(
      "WO-126 legacy cost adoption preserves receipts and refuses any substantive authority edit",
      async () => {
        const repo = makeRepo(parent, "legacy-cost-adoption");
        renameSync(
          join(repo, orderPath("WO-901")),
          join(repo, orderPath("WO-126")),
        );
        write(
          repo,
          orderPath("WO-126"),
          read(repo, orderPath("WO-126"))
            .replaceAll("WO-901", "WO-126")
            .replace(
              "Keep a bounded result.",
              "Keep a bounded result with a **Cost:** declaration.",
            ),
        );
        write(
          repo,
          PLAN_MAP,
          read(repo, PLAN_MAP).replaceAll("WO-901", "WO-126"),
        );
        commit(repo, "legacy reviewed cost contract");
        const receipt = await writeDirectReceipt(repo);
        commit(repo, "immutable legacy judgment");
        const receiptBytes = read(
          repo,
          `${RECEIPTS}/${receipt.receiptId}.json`,
        );
        write(
          repo,
          "docs/control/budgets.json",
          JSON.stringify({
            ...JSON.parse(read(root, "docs/control/budgets.json")),
            // This synthetic history has no operator budget exceptions.
            acceptances: [],
          }),
        );
        for (const id of ["WO-126", "WO-902"])
          write(
            repo,
            orderPath(id),
            read(repo, orderPath(id)).replace(
              /^(# [^\n]+\n)/,
              `$1\n${LEGACY_COST_HEADER}`,
            ),
          );
        commit(repo, "adopt unavailable cost declarations");
        const basis = buildPlanSubject(repo, "HEAD", { costTable: false });
        write(
          repo,
          "docs/planning/cost-table.json",
          JSON.stringify({
            schemaVersion: 1,
            observedAt: "2030-01-02T01:00:00.000Z",
            subjectRevision: basis.revision,
            subjectSourceHash: basis.costTable.subjectSourceHash,
            acceptances: [],
            rows: basis.orders.map((order) => ({
              workOrder: order.workOrderId,
              metrics: null,
            })),
            traps: [],
          }),
        );
        commit(repo, "bind current cost observation");
        const accepted = await checkPlanGate(repo);
        assert.ok(
          accepted.continuation.committedUpdates.some(
            (row) => row.kind === "cost-contract-adoption",
          ),
        );
        assert.equal(
          read(repo, `${RECEIPTS}/${receipt.receiptId}.json`),
          receiptBytes,
        );
        const original = read(repo, orderPath("WO-902"));
        write(
          repo,
          orderPath("WO-902"),
          original.replace(
            "Keep a bounded result.",
            "Skip the required evidence.",
          ),
        );
        await assert.rejects(
          checkPlanGate(repo),
          /matching the current subject|stale/,
        );
        write(
          repo,
          orderPath("WO-902"),
          original.replace(
            LEGACY_COST_HEADER,
            LEGACY_COST_HEADER.replace(
              "No reduction is claimed",
              "A reduction is claimed",
            ),
          ),
        );
        await assert.rejects(
          checkPlanGate(repo),
          /matching the current subject|stale/,
        );
      },
    );
    await check(
      "WO-126 cost input holds missing or unbalanced additions and refuses stale subject evidence",
      async () => {
        const repo = makeRepo(parent, "planning-cost");
        const budgets = {
          ...JSON.parse(read(root, "docs/control/budgets.json")),
          acceptances: [],
        };
        write(repo, "docs/control/budgets.json", JSON.stringify(budgets));
        write(
          repo,
          orderPath("WO-901"),
          order("WO-901").replace(
            "**Model:**",
            "**Cost:** Adds one process check; removes nothing.\n\n**Model:**",
          ),
        );
        commit(repo, "cost-bearing subject");
        const basis = buildPlanSubject(repo, "HEAD", { costTable: false });
        const table = {
          schemaVersion: 1,
          observedAt: "2030-01-02T01:00:00.000Z",
          subjectRevision: basis.revision,
          subjectSourceHash: basis.costTable.subjectSourceHash,
          acceptances: [],
          rows: basis.orders.map((order) => ({
            workOrder: order.workOrderId,
            metrics: null,
          })),
          traps: [],
        };
        const tablePath = "docs/planning/cost-table.json";
        write(repo, tablePath, JSON.stringify(table));
        commit(repo, "cost observation");
        const observationRevision = runGit(repo, ["rev-parse", "HEAD"]);
        const originalOrder = read(repo, orderPath("WO-901"));
        write(
          repo,
          orderPath("WO-901"),
          originalOrder + "\n## Execution record\n\nChecks passed.\n",
        );
        commit(repo, "later execution record", "2030-01-03T00:00:00Z");
        assert.equal(
          buildPlanSubject(repo).costTable.subjectSourceHash,
          table.subjectSourceHash,
        );
        const branch = runGit(repo, ["branch", "--show-current"]);
        runGit(repo, ["switch", "-c", "integration-side", observationRevision]);
        write(repo, "integration.txt", "unrelated integration bytes\n");
        commit(repo, "integration side", "2030-01-04T00:00:00Z");
        runGit(repo, ["switch", branch]);
        runGit(
          repo,
          [
            "-c",
            "user.name=Plan Fixture",
            "-c",
            "user.email=fixture@example.invalid",
            "merge",
            "--no-ff",
            "integration-side",
            "-m",
            "merge unchanged cost projection",
          ],
          {
            env: {
              ...process.env,
              GIT_AUTHOR_DATE: "2030-01-05T00:00:00Z",
              GIT_COMMITTER_DATE: "2030-01-05T00:00:00Z",
            },
          },
        );
        assert.equal(
          buildPlanSubject(repo).costTable.subjectSourceHash,
          table.subjectSourceHash,
        );
        write(
          repo,
          tablePath,
          JSON.stringify({
            ...table,
            acceptances: [
              { date: "2030-01-02", reason: "mismatched acceptance" },
            ],
          }),
        );
        assert.throws(
          () => buildPlanSubject(repo, "HEAD", { workspace: true }),
          /stale/,
        );
        write(
          repo,
          tablePath,
          JSON.stringify({ ...table, subjectRevision: "missing-revision" }),
        );
        assert.throws(
          () => buildPlanSubject(repo, "HEAD", { workspace: true }),
          /revision|argument|object/,
        );
        runGit(repo, ["switch", "-c", "unmerged-cost-revision"]);
        write(repo, "unmerged.txt", "not an ancestor\n");
        commit(repo, "unmerged cost revision", "2030-01-06T00:00:00Z");
        const unmergedRevision = runGit(repo, ["rev-parse", "HEAD"]);
        runGit(repo, ["switch", branch]);
        write(
          repo,
          tablePath,
          JSON.stringify({ ...table, subjectRevision: unmergedRevision }),
        );
        assert.throws(
          () => buildPlanSubject(repo, "HEAD", { workspace: true }),
          /ancestor|merge-base/,
        );
        write(repo, tablePath, JSON.stringify(table));
        let subject = buildPlanSubject(repo),
          result = validatePlanResult(passResult(subject), subject);
        assert.equal(result.planVerdict, "hold");
        assert.ok(
          result.holdReasons.some(
            (row) => row.workOrderId === "WO-901" && /removal/.test(row.reason),
          ),
        );
        assert.ok(
          result.holdReasons.some(
            (row) =>
              row.workOrderId === "WO-902" && /Missing Cost/.test(row.reason),
          ),
        );
        const acceptance = {
          date: "2030-01-02",
          metric: "process",
          scope: "WO-901",
          ceiling: 1,
          dispatch: "Synthetic operator",
          reason: "Accepted fixture cost",
        };
        const accepted = {
          ...subject,
          costTable: { ...subject.costTable, acceptances: [acceptance] },
          orders: subject.orders.map((row) =>
            row.workOrderId === "WO-902"
              ? { ...row, cost: "Adds no process." }
              : row,
          ),
        };
        assert.equal(
          validatePlanResult(passResult(accepted), accepted).planVerdict,
          "pass",
        );
        const balanced = {
          ...subject,
          orders: subject.orders.map((row) => ({
            ...row,
            cost: "Adds one check; removes two repeated commands.",
          })),
        };
        assert.equal(
          validatePlanResult(passResult(balanced), balanced).planVerdict,
          "pass",
        );
        await beginDirectRefutation(repo, {
          now: () => "2030-01-02T12:00:00.000Z",
        });
        const pointer = JSON.parse(
          read(repo, "docs/control/local/plan/current-direct.json"),
        );
        await beginDirectRefutation(repo, {
          now: () => "2030-01-02T12:05:00.000Z",
        });
        assert.equal(
          JSON.parse(read(repo, pointer.path)).dispatchedAt,
          "2030-01-02T12:00:00.000Z",
          "repeating the prompt must not reset the dispatch clock",
        );
        const goalSubject = buildPlanSubject(repo, "HEAD", {
          goalReview: true,
        });
        write(
          repo,
          "docs/control/local/result.json",
          JSON.stringify(cannedGoalReview(goalSubject)),
        );
        write(
          repo,
          "docs/control/local/statement.txt",
          "Synthetic canonical-only judgment.",
        );
        const filed = await fileDirectRefutation(
          repo,
          "docs/control/local/result.json",
          "docs/control/local/statement.txt",
          { commit: false, now: () => "2030-01-02T12:02:00.001Z" },
        );
        assert.equal(filed.durationMs, 120001);
        assert.equal(filed.verdict, "aligned");
        assert.equal(
          (await readReceipts(repo)).length,
          1,
          "elapsed time is recorded without a budget refusal",
        );
        write(
          repo,
          tablePath,
          JSON.stringify({ ...table, observedAt: "2029-01-01T00:00:00.000Z" }),
        );
        commit(repo, "stale fixture date");
        assert.throws(() => buildPlanSubject(repo), /predates/);
        write(repo, tablePath, JSON.stringify(table));
        write(
          repo,
          orderPath("WO-901"),
          read(repo, orderPath("WO-901")).replace(
            "Adds one process",
            "Adds two process",
          ),
        );
        commit(repo, "changed cost input");
        assert.throws(() => buildPlanSubject(repo), /stale/);
      },
    );
  } finally {
    rmSync(parent, { recursive: true });
  }
}

if (isMainModule(import.meta.url)) {
  try {
    if (!process.argv.includes("--check-only")) await fixtures();
    if (!process.argv.includes("--fixtures-only"))
      process.stdout.write(
        `Plan gate: ${JSON.stringify(await checkPlanGate(root))}\n`,
      );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
