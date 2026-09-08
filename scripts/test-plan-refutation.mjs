#!/usr/bin/env node
import assert from "node:assert/strict";
import {
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
import { fileURLToPath, pathToFileURL } from "node:url";
import { authorize } from "../packages/kernel/dist/src/index.js";
import { compilePlanRefuter } from "../packages/skeleton/dist/src/loadouts/plan-refuter.js";
import {
  FakePlanRefutationTransport,
  cannedPlanDrift,
} from "../packages/skeleton/dist/src/plan-refutation-fake.js";
import { runPlanRefutation } from "../packages/skeleton/dist/src/plan-refutation-host.js";
import { validatePlanResult } from "../packages/skeleton/dist/src/plan-refutation-protocol.js";
import {
  ClaudeCliPrintWorkOrderTransport,
  CodexCliExecWorkOrderTransport,
} from "../packages/skeleton/dist/src/worker-transport.js";
import {
  buildPlanSubject,
  PLAN_MAP,
  PLAN_LEDGER,
  planningPasses,
  sha256,
  THESIS_HEADINGS,
} from "./lib/plan-subject.mjs";
import {
  checkPassReceipt,
  checkPlanGate,
  OVERRIDES,
  overridePlanHold,
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
const commit = (repo, label) => {
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
        GIT_AUTHOR_DATE: "2030-01-02T00:00:00Z",
        GIT_COMMITTER_DATE: "2030-01-02T00:00:00Z",
      },
    },
  );
};
const orderPath = (id) => `docs/work-orders/${id}-fixture.md`;
const order = (id) =>
  `# ${id} — Fixture\n\n**Model:** fixture\n**Effort:** executor any; verifier any; reviewer any.\n**Nomination provenance:** PLANNER_NARRATIVE_SENTINEL\n\n**Objective:** Move the shape.\n\n**Design:** PLANNER_NARRATIVE_SENTINEL\n\n**Acceptance criteria (all required)**\n\n1. Evidence confirms a useful shape.\n2. Keep a bounded result.\n\n**Evidence gate:** PLANNER_NARRATIVE_SENTINEL\n\n**Non-goals:** Other shapes.\n\n**Operator-review assumptions**\n\n1. PLANNER_NARRATIVE_SENTINEL\n`;
const makeRepo = (parent, name) => {
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
    "# Ledger\n\n## 2029-01-01 old planning pass\n\nPLANNER_NARRATIVE_SENTINEL\n",
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
  const check = async (label, run) => {
    await run();
    process.stdout.write(`PASS ${label}\n`);
  };
  try {
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
      "direct-session holds retain the three-hold stop and cannot be rerolled by changing review source",
      async () => {
        const repo = makeRepo(parent, "direct-limit");
        const receipts = [];
        for (let i = 0; i < 3; i++) {
          if (i) mutate(repo, orderPath("WO-901"), "useful", `useful-${i}`);
          receipts.push(await writeDirectReceipt(repo, cannedPlanDrift));
        }
        mutate(repo, orderPath("WO-901"), "useful", "useful-final");
        await assert.rejects(
          writeDirectReceipt(repo, passResult, receipts.flatMap(accept)),
          /third consecutive hold/u,
        );
        await assert.rejects(
          writeReceipt(repo, passResult, receipts.flatMap(accept)),
          /third consecutive hold/u,
        );
        assert.equal((await readReceipts(repo)).length, 3);
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
          "For each planned order: thesis-advancing, machinery, or drift?",
          "Which vision thesis or exclusion passage supports that verdict?",
          "Which capability row would the order move or create?",
          "Which of the five UIFA roles gets a surface?",
          "What is the single largest remaining gap to the one-paragraph story?",
          "Does the horizon pass or hold, and which order and criterion must answer each hold?",
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
      "AC5 third consecutive hold stops the pass, including changed sequence labels and pre-dispatch CLI",
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
        await assert.rejects(
          writeReceipt(repo, passResult, receipts.flatMap(accept)),
          /third consecutive hold/u,
        );
        await assert.rejects(
          plan(["refute", "--transport", "fake"], repo),
          /third consecutive hold/u,
        );
        mutate(repo, PLAN_MAP, "First", "first");
        await assert.rejects(
          writeReceipt(repo, passResult, receipts.flatMap(accept)),
          /third consecutive hold/u,
        );
        const third = receipts[2];
        assert.throws(
          () =>
            checkPassReceipt(passFor(repo), third.subject, receipts, [], {
              requireLive: false,
            }),
          /unanswered hold/u,
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
              ? "2.1.263"
              : "0.153.4",
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
          new ClaudeCliPrintWorkOrderTransport(runner, "2.1.263"),
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
  } finally {
    rmSync(parent, { recursive: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
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
