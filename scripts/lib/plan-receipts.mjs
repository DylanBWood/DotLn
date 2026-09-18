import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  buildPlanSubject,
  committedReader,
  hashParts,
  PLAN_LEDGER,
  planningPasses,
  planCostDeclaration,
  sha256,
} from "./plan-subject.mjs";
import { checkLocalTerms } from "./terms.mjs";
import { containedRegularFile } from "./paths.mjs";
import { runGit } from "./git.mjs";
import { validateAccountLabel } from "./control-actor.mjs";
import {
  checkPlanContinuation,
  executionAmendmentSource,
} from "./plan-continuation.mjs";
import { readDecisions } from "./meta.mjs";
import { checkSequenceTopology, readIndex } from "../work-orders.mjs";

export const RECEIPTS = "docs/planning/refutations";
export const OVERRIDES = "docs/control/plan-refutations.jsonl";
const receiptSchema = "plan-refutation-receipt-v1";
const validReceiptId = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}-[a-z][a-z0-9-]*-\d{3}$/u.test(value);
const validDigest = (value) =>
  typeof value === "string" && /^sha256:[0-9a-f]{64}$/u.test(value);
const manual = /^2026-09-06-phase-two-redirect(?:-00[2-6])?\.json$/u;
const stable = (value) =>
  JSON.stringify(value, (_key, item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? Object.fromEntries(
          Object.keys(item)
            .sort()
            .map((key) => [key, item[key]]),
        )
      : item,
  );
const same = (a, b) => stable(a) === stable(b);
const check = (condition, reason) => {
  if (!condition) throw new Error(reason);
};
const exact = (value, keys) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).sort().join(",") === [...keys].sort().join(",");
const text = (value) =>
  typeof value === "string" &&
  value.trim() &&
  value.length <= 4_000 &&
  !/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(value);
const timestamp = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(value) &&
  Number.isFinite(Date.parse(value));
const json = (source, label) => {
  try {
    return JSON.parse(source);
  } catch {
    throw new Error(`invalid JSON: ${label}`);
  }
};
const read = (root, path) => {
  check(
    containedRegularFile(join(root, path), root),
    `expected contained regular evidence: ${path}`,
  );
  return readFileSync(join(root, path), "utf8");
};
const protocol = () =>
  import("../../packages/skeleton/dist/src/plan-refutation-protocol.js");
export const addressedHolds = (result) =>
  result.holdReasons.map((hold) => ({
    id: `hold-${hashParts([hold.workOrderId, hold.criterionId, hold.reason]).slice(7, 31)}`,
    ...hold,
  }));

export const renderPlanReceipt = (receipt) =>
  [
    `# Plan refutation — ${receipt.receiptId}`,
    "",
    `Subject: \`${receipt.subject.hash}\` at committed revision \`${receipt.subject.revision}\`.`,
    "",
    `Pass: \`${receipt.pass.id}\` (${receipt.pass.kind}). Verdict: **${receipt.result.planVerdict}**.`,
    "",
    receipt.episode.kind === "direct-session"
      ? `Review source: direct ${receipt.episode.review ? "harness" : "Codex"} session. Harness version, model and effort: unknown; settings verification: unverified. No CLI launch or transport acceptance is claimed.`
      : `Transport: \`${receipt.episode.transport}\`; harness version: \`${receipt.episode.harnessVersion}\`; model: \`${receipt.episode.model}\`; effort: \`${receipt.episode.effort}\`. Selection source: host-launch; effective model and effort: unknown.`,
    "",
    receipt.episode.kind === "direct-session"
      ? `Judgment frozen: ${receipt.episode.completedAt}. Frozen result hash: \`${receipt.episode.resultHash}\`. Local-terms list: **${receipt.localTerms.status}**.`
      : `Dispatched: ${receipt.episode.dispatchedAt}. Completed: ${receipt.episode.completedAt}. Local-terms list: **${receipt.localTerms.status}**.`,
    "",
    receipt.episode.kind === "direct-session"
      ? `Judgment basis: canonical subject and ${receipt.subject.goalReview ? "plan-goal-review-v1" : "plan-refutation-v1"} protocol. Independence is session-attested; context isolation was not enforced and model tools were available. Session statement: ${receipt.episode.statement}`
      : "The subject was compiled from committed vision sections, the roles table, capability rows, and order title/objective/criteria/non-goals. Planner narrative, ledger, earlier verdicts, and model tools were excluded. The host created an empty scratch working directory for this one-shot episode.",
    "",
    receipt.subject.orders.some(({ workOrderId }) => workOrderId === "WO-041")
      ? "Self-referential instrument: WO-041 builds this host and is also in its subject. Its order verdict is advisory, never evidence of this mechanism's correctness. Independent executable fixtures and a separate verifier judge the instrument."
      : "This verdict evaluates a planning horizon; it does not verify implementation or confer operator decision authority.",
    "",
    ...(receipt.episode.review
      ? [
          `Scope: ${receipt.episode.review.scope}; dispatch-to-file ${receipt.episode.review.durationMs} ms. Judged ${receipt.episode.review.judgedOrderIds.length} orders and the sequence; carried ${receipt.episode.review.carried.length} unchanged verdicts by order and receipt hash.`,
          "",
        ]
      : []),
    "## Validated result",
    "",
    "```json",
    JSON.stringify(receipt.result, null, 2),
    "```",
    "",
    "## Addressed holds",
    "",
    "```json",
    JSON.stringify(receipt.holds, null, 2),
    "```",
    "",
    "## Dispositions carried from earlier receipts",
    "",
    "```json",
    JSON.stringify(receipt.dispositions, null, 2),
    "```",
    "",
    receipt.subject.goalReview
      ? "Only evidence-backed misalignment holds. Criterion-text-bound dispositions in the planning control log settle findings without another judgment; known issues name reopening observations. This receipt and all historical receipts remain immutable."
      : "Accepted dispositions name changed criteria; they do not discharge holds. Operator overrides exist only in the append-only planning control log, with actor, date, and an ignored capture's SHA-256. No text in this receipt grants an override. This receipt is immutable; a later attempt creates a new pair of files.",
    "",
    `Receipt hash: \`${receipt.receiptHash}\`.`,
    "",
  ].join("\n");

export async function validateReceipt(root, receipt) {
  check(
    exact(receipt, [
      "schemaVersion",
      "receiptId",
      "pass",
      "ordinal",
      "previousReceiptHash",
      "subject",
      "episode",
      "result",
      "holds",
      "dispositions",
      "localTerms",
      "receiptHash",
    ]) && receipt.schemaVersion === receiptSchema,
    "closed receipt shape required",
  );
  check(
    validReceiptId(receipt.receiptId) &&
      Number.isInteger(receipt.ordinal) &&
      receipt.ordinal > 0,
    "receipt address or ordinal",
  );
  check(
    exact(receipt.pass, ["id", "kind", "heading"]) &&
      /^[a-z][a-z0-9-]{0,100}$/u.test(receipt.pass.id) &&
      ["planning", "evidence"].includes(receipt.pass.kind) &&
      (receipt.pass.kind === "planning"
        ? text(receipt.pass.heading) &&
          receipt.pass.id ===
            planningPasses(`## ${receipt.pass.heading}`)[0]?.id
        : receipt.pass.heading === null),
    "receipt planning-pass identity",
  );
  const { receiptHash, ...payload } = receipt;
  check(
    receiptHash === sha256(JSON.stringify(payload)),
    "receipt digest mismatch",
  );
  check(
    same(
      receipt.subject,
      buildPlanSubject(root, receipt.subject.revision, {
        goalReview: Boolean(receipt.subject.goalReview),
      }),
    ),
    "receipt subject does not match committed sources",
  );
  const { validatePlanResult } = await protocol();
  check(
    same(receipt.result, validatePlanResult(receipt.result, receipt.subject)),
    "receipt verdict omitted a constructed hold",
  );
  check(
    same(receipt.holds, addressedHolds(receipt.result)),
    "hold addresses differ from validated result",
  );
  const e = receipt.episode;
  if (e?.kind === "direct-session") {
    check(
      exact(e, [
        "kind",
        "harness",
        "harnessVersion",
        "model",
        "effort",
        "settingsVerification",
        "profileId",
        "completedAt",
        "resultHash",
        "judgmentBasis",
        "independence",
        "contextIsolation",
        "modelTools",
        "statement",
        ...(e.review ? ["review"] : []),
      ]) &&
        (e.review
          ? ["codex", "claude-code", "unknown"].includes(e.harness)
          : e.harness === "codex") &&
        e.harnessVersion === "unknown" &&
        e.model === "unknown" &&
        e.effort === "unknown" &&
        e.settingsVerification === "unverified" &&
        e.profileId === "plan-refutation-v1" &&
        timestamp(e.completedAt) &&
        e.resultHash ===
          sha256(`${JSON.stringify(receipt.result, null, 2)}\n`) &&
        e.judgmentBasis === "canonical-subject-and-protocol" &&
        e.independence === "session-attested" &&
        e.contextIsolation === "not-enforced" &&
        e.modelTools === "available" &&
        text(e.statement),
      "direct-session provenance or frozen result hash invalid",
    );
    if (e.review) {
      const r = e.review;
      check(
        exact(r, [
          "scope",
          "judgedOrderIds",
          "carried",
          "dispatchedAt",
          "durationMs",
        ]) &&
          ["pass", "full"].includes(r.scope) &&
          timestamp(r.dispatchedAt) &&
          r.durationMs ===
            Date.parse(e.completedAt) - Date.parse(r.dispatchedAt) &&
          r.durationMs >= 0 &&
          Array.isArray(r.judgedOrderIds) &&
          Array.isArray(r.carried),
        "invalid direct scope or timing",
      );
      const ids = [
        ...r.judgedOrderIds,
        ...r.carried.map((row) => row.workOrderId),
      ];
      check(
        ids.length === receipt.subject.orders.length &&
          new Set(ids).size === ids.length &&
          receipt.subject.orders.every((order) =>
            ids.includes(order.workOrderId),
          ) &&
          (r.scope !== "full" || !r.carried.length),
        "direct scope must cover every order exactly once",
      );
      for (const row of r.carried)
        check(
          exact(row, [
            "workOrderId",
            "orderHash",
            "receiptId",
            "receiptHash",
          ]) &&
            validDigest(row.orderHash) &&
            validDigest(row.receiptHash) &&
            validReceiptId(row.receiptId),
          "invalid carried verdict address",
        );
    }
  } else {
    check(
      exact(e, [
        "transport",
        "harnessVersion",
        "model",
        "effort",
        "selectionSource",
        "effectiveModel",
        "effectiveEffort",
        "dispatchedAt",
        "completedAt",
        "semanticHash",
        "commandReceipt",
        ...(e.mode ? ["mode"] : []),
        ...(e.raw ? ["raw"] : []),
      ]) &&
        ["fake", "claude-cli-print", "codex-cli-exec"].includes(e.transport) &&
        text(e.harnessVersion) &&
        /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/u.test(e.model) &&
        text(e.effort) &&
        (!e.mode || e.mode === "subagents") &&
        (!e.raw || text(e.raw)) &&
        e.selectionSource === "host-launch" &&
        e.effectiveModel === "unknown" &&
        e.effectiveEffort === "unknown" &&
        timestamp(e.dispatchedAt) &&
        timestamp(e.completedAt) &&
        Date.parse(e.completedAt) >= Date.parse(e.dispatchedAt) &&
        text(e.semanticHash),
      "episode provenance invalid",
    );
    check(
      exact(e.commandReceipt, ["commandId", "transport", "acceptedAt"]) &&
        text(e.commandReceipt.commandId) &&
        e.commandReceipt.transport === e.transport &&
        Number.isFinite(e.commandReceipt.acceptedAt) &&
        e.commandReceipt.acceptedAt >= Date.parse(e.dispatchedAt) &&
        e.commandReceipt.acceptedAt <= Date.parse(e.completedAt),
      "transport acceptance receipt invalid",
    );
  }
  check(
    exact(receipt.localTerms, ["status"]) &&
      ["present", "unavailable"].includes(receipt.localTerms.status),
    "local-terms presence missing",
  );
  check(
    Array.isArray(receipt.dispositions) && receipt.dispositions.length <= 300,
    "dispositions must be a bounded array",
  );
  for (const d of receipt.dispositions)
    check(
      exact(d, [
        "receiptId",
        "holdId",
        "kind",
        "date",
        "workOrderId",
        "criterionId",
        "change",
      ]) &&
        validReceiptId(d.receiptId) &&
        /^hold-[0-9a-f]{24}$/u.test(d.holdId) &&
        d.kind === "accepted" &&
        /^\d{4}-\d{2}-\d{2}$/u.test(d.date) &&
        Number.isFinite(Date.parse(d.date)) &&
        text(d.change),
      "only dated accepted dispositions belong in a receipt",
    );
  return receipt;
}

const criterion = (subject, hold) =>
  subject.orders
    .find(({ workOrderId }) => workOrderId === hold.workOrderId)
    ?.criteria.find(({ id }) => id === hold.criterionId)?.text;
const meaningful = (value) =>
  value?.normalize("NFKC").replace(/\s+/gu, " ").trim();
export const criterionHash = (value) => sha256(meaningful(value) ?? "");
export const isGoalReview = (receipt) =>
  receipt.result.schemaVersion === "plan-goal-review-v1";

/** A goal hold may be repaired in its Cost field alongside its criterion. */
const repairedCostBinding = (root, receipt, hold) => {
  if (!receipt.subject.goalReview) return {};
  const path = receipt.subject.orders.find(
    (row) => row.workOrderId === hold.workOrderId,
  ).path;
  const before = planCostDeclaration(
    committedReader(root, receipt.subject.revision).read(path),
  );
  const after = planCostDeclaration(read(root, path));
  return before === after
    ? {}
    : { sourceCostHash: sha256(before), costHash: sha256(after) };
};

/** Both historical dispositions and new control events bind accepted text. */
export function criterionDispositions(receipts, events) {
  const bindings = events.flatMap((event) => {
    if (event.type === "PlanExecutionAmended") return [];
    if (event.schemaVersion === 2) return [event];
    const receipt = receipts.find(
      (row) =>
        row.receiptId === event.receiptId &&
        row.receiptHash === event.receiptHash,
    );
    const hold = receipt?.holds.find((row) => row.id === event.holdId);
    return hold
      ? [
          {
            ...event,
            workOrderId: hold.workOrderId,
            criterionId: hold.criterionId,
            sourceCriterionHash: criterionHash(
              criterion(receipt.subject, hold),
            ),
            criterionHash: criterionHash(criterion(receipt.subject, hold)),
          },
        ]
      : [];
  });
  for (const receipt of receipts)
    for (const disposition of receipt.dispositions) {
      const source = receipts.find(
        (row) => row.receiptId === disposition.receiptId,
      );
      const hold = source?.holds.find((row) => row.id === disposition.holdId);
      if (hold)
        bindings.push({
          ...disposition,
          recordedAt: receipt.episode.completedAt,
          sourceCriterionHash: criterionHash(criterion(source.subject, hold)),
          criterionHash: criterionHash(criterion(receipt.subject, hold)),
        });
    }
  return bindings;
}
const isDisposed = (hold, subject, bindings) =>
  bindings.some(
    (binding) =>
      binding.workOrderId === hold.workOrderId &&
      binding.criterionId === hold.criterionId &&
      binding.criterionHash === criterionHash(criterion(subject, hold)),
  );

export function applyPlanDispositions(result, subject, receipts, events) {
  if (result.schemaVersion !== "plan-goal-review-v1") return result;
  const bindings = criterionDispositions(receipts, events);
  return {
    ...result,
    orders: result.orders.map((order) => {
      const findings = order.findings.map((finding) =>
        isDisposed(
          { ...finding, workOrderId: order.workOrderId },
          subject,
          bindings,
        )
          ? {
              ...finding,
              kind: "known-issue",
              evidence: null,
              reopenWhen:
                finding.reopenWhen ??
                "A new observed failure warrants reopening the accepted criterion text at a later planning pass.",
            }
          : finding,
      );
      return {
        ...order,
        findings,
        verdict:
          order.verdict === "misaligned" &&
          findings.some((finding) => finding.kind !== "known-issue")
            ? "misaligned"
            : findings.length
              ? "aligned-with-findings"
              : "aligned",
      };
    }),
  };
}

export function requireChangedPlanEvidence(pass, subject, history) {
  const prior = [...history]
    .reverse()
    .find((row) => row.pass.id === pass.id && isGoalReview(row));
  check(
    !prior ||
      prior.subject.goalReview.evidenceHash !== subject.goalReview.evidenceHash,
    "one judgment per pass; dispositions settle repairs, and another judgment requires changed observed evidence",
  );
}

export function admitReceipt(receipt, history, overrides = []) {
  for (const carried of receipt.episode.review?.carried ?? []) {
    const prior = [...history]
      .reverse()
      .find((row) =>
        row.subject.orders.some(
          (order) => order.workOrderId === carried.workOrderId,
        ),
      );
    const orderHash = (order) =>
      hashParts([
        order.workOrderId,
        order.title,
        order.objective,
        order.criteria,
        order.nonGoals,
        ...(Object.hasOwn(order, "cost") ? [order.cost] : []),
      ]);
    const order = receipt.subject.orders.find(
      (row) => row.workOrderId === carried.workOrderId,
    );
    const previousOrder = prior?.subject.orders.find(
      (row) => row.workOrderId === carried.workOrderId,
    );
    check(
      prior?.receiptId === carried.receiptId &&
        prior?.receiptHash === carried.receiptHash &&
        orderHash(order) === carried.orderHash &&
        orderHash(previousOrder) === carried.orderHash &&
        same(
          receipt.result.orders.find(
            (row) => row.workOrderId === carried.workOrderId,
          ),
          (isGoalReview(receipt)
            ? applyPlanDispositions(
                prior.result,
                receipt.subject,
                history,
                overrides,
              )
            : prior.result
          ).orders.find((row) => row.workOrderId === carried.workOrderId),
        ),
      "carried verdict must be the latest unchanged order judgment",
    );
  }
  const ordered = [...history].sort((a, b) => a.ordinal - b.ordinal);
  const latest = ordered.at(-1);
  check(
    receipt.ordinal === ordered.length + 1 &&
      receipt.previousReceiptHash === (latest?.receiptHash ?? null),
    "receipt chain must append without gaps",
  );
  const prior = ordered.filter((item) =>
    receipt.pass.kind === "planning"
      ? item.pass.kind === "planning"
      : item.pass.id === receipt.pass.id,
  );
  const samePass = prior.filter((item) => item.pass.id === receipt.pass.id);
  check(
    !samePass.length || samePass.at(-1).subject.hash !== receipt.subject.hash,
    "same subject cannot be re-rolled",
  );
  if (isGoalReview(receipt)) {
    requireChangedPlanEvidence(receipt.pass, receipt.subject, prior);
    const bindings = criterionDispositions(history, overrides).filter(
      (row) => row.recordedAt <= receipt.episode.completedAt,
    );
    check(
      !receipt.holds.some((hold) =>
        isDisposed(hold, receipt.subject, bindings),
      ),
      "a disposition already binds this criterion text; preserve it as a known issue instead of re-raising the hold",
    );
    for (const disposition of receipt.dispositions)
      check(
        history.some(
          (old) =>
            old.receiptId === disposition.receiptId &&
            old.holds.some(
              (hold) =>
                hold.id === disposition.holdId &&
                hold.workOrderId === disposition.workOrderId &&
                hold.criterionId === disposition.criterionId,
            ),
        ),
        "disposition names no prior hold",
      );
    return;
  }
  const used = new Set();
  const overridden = (old, hold) =>
    overrides.some(
      (event) =>
        event.receiptId === old.receiptId &&
        event.receiptHash === old.receiptHash &&
        event.holdId === hold.id &&
        event.recordedAt >= old.episode.completedAt &&
        event.recordedAt <= receipt.episode.completedAt,
    );
  for (const old of prior.filter(
    (item) => item.result.planVerdict === "hold",
  )) {
    const unresolved = old.holds.filter((hold) => !overridden(old, hold));
    check(
      !unresolved.length ||
        old.holds.some(
          (hold) =>
            meaningful(criterion(old.subject, hold)) !==
              meaningful(criterion(receipt.subject, hold)) &&
            criterion(receipt.subject, hold) !== undefined,
        ),
      "fresh receipt changed only outside the held criteria",
    );
    for (const hold of old.holds) {
      const key = `${old.receiptId}:${hold.id}`;
      const dispositions = receipt.dispositions.filter(
        (d) => d.receiptId === old.receiptId && d.holdId === hold.id,
      );
      check(dispositions.length <= 1, "duplicate accepted disposition");
      const d = dispositions[0];
      if (d) {
        check(
          d.workOrderId === hold.workOrderId &&
            d.criterionId === hold.criterionId &&
            meaningful(criterion(old.subject, hold)) !==
              meaningful(criterion(receipt.subject, hold)) &&
            criterion(receipt.subject, hold) !== undefined &&
            d.date >= old.episode.completedAt.slice(0, 10) &&
            d.date <= receipt.episode.completedAt.slice(0, 10),
          "accepted disposition must identify a changed held criterion and its date",
        );
        used.add(key);
      } else
        check(
          overridden(old, hold) ||
            receipt.holds.some((current) => same(current, hold)),
          `prior hold has no accepted disposition or exact repetition: ${key}`,
        );
    }
  }
  check(
    receipt.dispositions.every((d) => used.has(`${d.receiptId}:${d.holdId}`)),
    "disposition names no prior hold",
  );
}

export async function readReceipts(root) {
  const committed = committedReader(root);
  for (const path of committed.paths.filter(
    (path) =>
      path.startsWith(`${RECEIPTS}/`) &&
      validReceiptId(
        path.slice(RECEIPTS.length + 1).replace(/\.(?:md|json)$/u, ""),
      ) &&
      !manual.test(path.slice(RECEIPTS.length + 1).replace(/\.md$/u, ".json")),
  ))
    read(root, path); // Deleting committed evidence cannot reset the attempt count.
  if (!existsSync(join(root, RECEIPTS))) return [];
  const receipts = [];
  for (const name of readdirSync(join(root, RECEIPTS)).sort()) {
    if (!name.endsWith(".json") || manual.test(name)) continue;
    const path = `${RECEIPTS}/${name}`;
    const source = read(root, path);
    const receipt = await validateReceipt(root, json(source, path));
    check(name === `${receipt.receiptId}.json`, "receipt filename mismatch");
    const mdPath = `${RECEIPTS}/${receipt.receiptId}.md`;
    const markdown = read(root, mdPath);
    check(
      markdown === renderPlanReceipt(receipt),
      "immutable Markdown differs from its receipt",
    );
    for (const [file, bytes] of [
      [path, source],
      [mdPath, markdown],
    ])
      if (committed.paths.includes(file))
        check(
          bytes === committed.read(file),
          "committed receipt was edited; append a new receipt",
        );
    receipts.push(receipt);
  }
  const seen = [];
  const overrides = readOverrides(root);
  for (const receipt of receipts.sort((a, b) => a.ordinal - b.ordinal)) {
    admitReceipt(receipt, seen, overrides);
    seen.push(receipt);
  }
  return seen;
}

const ensureDirectory = (root, path) => {
  let directory = root;
  for (const part of path.split("/")) {
    directory = join(directory, part);
    if (!existsSync(directory)) mkdirSync(directory);
    check(
      lstatSync(directory).isDirectory() &&
        !lstatSync(directory).isSymbolicLink(),
      "planning evidence directory must not be a symlink",
    );
  }
};
const locked = async (root, run) => {
  ensureDirectory(root, RECEIPTS);
  const lock = join(root, RECEIPTS, ".writer-lock");
  try {
    mkdirSync(lock);
  } catch {
    throw new Error(
      "planning evidence writer already active; inspect any interrupted writer before retrying",
    );
  }
  try {
    return await run();
  } finally {
    rmdirSync(lock);
  }
};

export async function writePlanReceipt(
  root,
  { pass, slug, subject, episode, dispositions = [] },
) {
  return locked(root, async () => {
    check(
      /^[a-z][a-z0-9-]{0,70}$/u.test(slug),
      "receipt slug must be a public lowercase label",
    );
    if (episode.kind === "direct-session" && pass.kind === "planning") {
      const current = buildPlanSubject(root, "HEAD", {
        goalReview: Boolean(subject.goalReview),
      });
      check(
        subject.hash === current.hash &&
          current.hash ===
            buildPlanSubject(root, "HEAD", {
              workspace: true,
              goalReview: Boolean(subject.goalReview),
            }).hash,
        "direct-session planning receipt requires the current committed and workspace subject",
      );
    }
    const history = await readReceipts(root);
    const ordinal = history.length + 1;
    const receiptId = `${episode.completedAt.slice(0, 10)}-${slug}-${String(ordinal).padStart(3, "0")}`;
    const { result: rawResult, ...provenance } = episode;
    const { validatePlanResult } = await protocol();
    const result = validatePlanResult(
      applyPlanDispositions(rawResult, subject, history, readOverrides(root)),
      subject,
    );
    if (provenance.kind === "direct-session" && subject.goalReview)
      provenance.resultHash = sha256(`${JSON.stringify(result, null, 2)}\n`);
    const localTerms = checkLocalTerms(root, [
      { name: "validated-result", text: JSON.stringify(result) },
      {
        name: "receipt-metadata",
        text: JSON.stringify({ pass, slug, provenance, dispositions }),
      },
    ]);
    const payload = {
      schemaVersion: receiptSchema,
      receiptId,
      pass,
      ordinal,
      previousReceiptHash: history.at(-1)?.receiptHash ?? null,
      subject,
      episode: provenance,
      result,
      holds: addressedHolds(result),
      dispositions,
      localTerms,
    };
    const receipt = {
      ...payload,
      receiptHash: sha256(JSON.stringify(payload)),
    };
    await validateReceipt(root, receipt);
    admitReceipt(receipt, history, readOverrides(root));
    const md = renderPlanReceipt(receipt);
    // Includes copied standard/order prose as well as validated model text.
    checkLocalTerms(root, [
      { name: "receipt.json", text: JSON.stringify(receipt) },
      { name: "receipt.md", text: md },
    ]);
    for (const ext of ["json", "md"])
      check(
        !existsSync(join(root, RECEIPTS, `${receiptId}.${ext}`)),
        "receipt address already exists",
      );
    writeFileSync(
      join(root, RECEIPTS, `${receiptId}.json`),
      `${JSON.stringify(receipt, null, 2)}\n`,
      { flag: "wx", mode: 0o644 },
    );
    writeFileSync(join(root, RECEIPTS, `${receiptId}.md`), md, {
      flag: "wx",
      mode: 0o644,
    });
    return receipt;
  });
}

const actorValid = (actor) => {
  check(actor && typeof actor === "object", "override actor missing");
  const keys = [
    "harness",
    "harnessVersion",
    "model",
    "effort",
    "source",
    ...("raw" in actor ? ["raw"] : []),
    ...("accountLabel" in actor ? ["accountLabel"] : []),
  ];
  check(
    exact(actor, keys) &&
      keys.every((key) => text(actor[key])) &&
      ["self-reported", "harness-readback", "operator-attested"].includes(
        actor.source,
      ) &&
      ["low", "medium", "high", "xhigh", "max", "unknown"].includes(
        actor.effort,
      ) &&
      (["claude-code", "codex-cli", "human"].includes(actor.harness) ||
        /^other:[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(actor.harness)),
    "invalid override actor",
  );
  validateAccountLabel(actor.accountLabel);
};
export function readOverrides(root) {
  const committed = committedReader(root);
  if (!existsSync(join(root, OVERRIDES))) {
    check(
      !committed.paths.includes(OVERRIDES),
      "committed planning control log is missing",
    );
    return [];
  }
  const source = read(root, OVERRIDES);
  check(
    source === "" || source.endsWith("\n"),
    "partial override control event",
  );
  if (committed.paths.includes(OVERRIDES))
    check(
      source.startsWith(committed.read(OVERRIDES)),
      "planning control log is not append-only",
    );
  return source
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const event = json(line, "planning control log");
      if (event.type === "PlanExecutionAmended") {
        check(
          exact(event, [
            "schemaVersion",
            "type",
            "recordedAt",
            "receiptId",
            "receiptHash",
            "workOrderId",
            "sourceOrderHash",
            "orderHash",
            "orderLength",
            "decisionId",
            "decisionHash",
            "reason",
          ]) &&
            event.schemaVersion === 3 &&
            Number.isSafeInteger(event.orderLength) &&
            event.orderLength > 0 &&
            timestamp(event.recordedAt) &&
            validReceiptId(event.receiptId) &&
            /^WO-\d{3}$/u.test(event.workOrderId) &&
            new RegExp(`^${event.workOrderId}-D\\d{3}$`, "u").test(
              event.decisionId,
            ) &&
            [
              event.receiptHash,
              event.sourceOrderHash,
              event.orderHash,
              event.decisionHash,
            ].every(validDigest) &&
            text(event.reason),
          "invalid execution-amendment event",
        );
        return event;
      }
      if (event.schemaVersion === 2) {
        const override = event.type === "PlanHoldOverridden";
        check(
          exact(event, [
            "schemaVersion",
            "type",
            "recordedAt",
            "receiptId",
            "receiptHash",
            "holdId",
            "reason",
            "workOrderId",
            "criterionId",
            "sourceCriterionHash",
            "criterionHash",
            ...("sourceCostHash" in event || "costHash" in event
              ? ["sourceCostHash", "costHash"]
              : []),
            ...(override ? ["actor", "captureHash"] : []),
          ]) &&
            ["PlanHoldDisposed", "PlanHoldOverridden"].includes(event.type) &&
            timestamp(event.recordedAt) &&
            validReceiptId(event.receiptId) &&
            validDigest(event.receiptHash) &&
            /^hold-[0-9a-f]{24}$/u.test(event.holdId) &&
            text(event.reason) &&
            /^WO-\d{3}$/u.test(event.workOrderId) &&
            /^criterion:\d+$/u.test(event.criterionId) &&
            validDigest(event.sourceCriterionHash) &&
            validDigest(event.criterionHash) &&
            (!("sourceCostHash" in event || "costHash" in event) ||
              (validDigest(event.sourceCostHash) &&
                validDigest(event.costHash))),
          "invalid criterion-bound disposition event",
        );
        if (override)
          check(
            validDigest(event.captureHash) &&
              event.actor &&
              ["harness", "harnessVersion", "model", "effort", "source"].every(
                (key) => text(event.actor[key]),
              ),
            "invalid override provenance",
          );
        return event;
      }
      check(
        exact(event, [
          "schemaVersion",
          "type",
          "recordedAt",
          "receiptId",
          "receiptHash",
          "holdId",
          "reason",
          "actor",
          "captureHash",
        ]) &&
          event.schemaVersion === 1 &&
          event.type === "PlanHoldOverridden" &&
          timestamp(event.recordedAt) &&
          validReceiptId(event.receiptId) &&
          validDigest(event.receiptHash) &&
          /^hold-[0-9a-f]{24}$/u.test(event.holdId) &&
          text(event.reason) &&
          validDigest(event.captureHash),
        "invalid override control event",
      );
      actorValid(event.actor);
      return event;
    });
}

export async function overridePlanHold(
  root,
  {
    receiptId,
    holdId,
    reason,
    actor = {
      harness: "unknown",
      harnessVersion: "unknown",
      model: "unknown",
      effort: "unknown",
      source: "unknown",
    },
    capture,
    captureHash,
    now = () => new Date().toISOString(),
  },
) {
  return locked(root, async () => {
    check(
      validDigest(captureHash ?? ""),
      "override requires --capture-hash sha256:<digest> of the operator instruction",
    );
    check(
      typeof capture === "string" &&
        /^docs\/intake\/(?:[a-zA-Z0-9._-]+\/)*[a-zA-Z0-9._-]+$/u.test(
          capture,
        ) &&
        !capture.split("/").includes(".."),
      "override requires an ignored intake capture",
    );
    const captured = read(root, capture);
    check(
      captured.trim() && sha256(captured) === captureHash,
      "operator capture hash mismatch",
    );
    runGit(root, ["check-ignore", "-q", "--", capture]);
    check(
      !committedReader(root).paths.includes(capture) &&
        !runGit(root, ["ls-files", "--", capture]),
      "operator capture must remain untracked",
    );
    check(
      actor &&
        ["harness", "harnessVersion", "model", "effort", "source"].every(
          (key) => text(actor[key]),
        ),
      "override actor fields must be present",
    );
    check(text(reason), "override reason is required");
    const receipts = await readReceipts(root);
    const receipt = receipts.find((item) => item.receiptId === receiptId);
    check(
      receipt?.holds.some(({ id }) => id === holdId),
      "override must name a recorded receipt and hold",
    );
    const prior = readOverrides(root);
    check(
      !prior.some(
        (event) => event.receiptId === receiptId && event.holdId === holdId,
      ),
      "hold already overridden",
    );
    const recordedAt = now();
    check(
      timestamp(recordedAt) && recordedAt >= receipt.episode.completedAt,
      "override timestamp precedes its receipt",
    );
    const event = {
      schemaVersion: 2,
      type: "PlanHoldOverridden",
      recordedAt,
      receiptId,
      receiptHash: receipt.receiptHash,
      holdId,
      reason,
      actor,
      captureHash,
      ...repairedCostBinding(
        root,
        receipt,
        receipt.holds.find((row) => row.id === holdId),
      ),
      workOrderId: receipt.holds.find((row) => row.id === holdId).workOrderId,
      criterionId: receipt.holds.find((row) => row.id === holdId).criterionId,
      sourceCriterionHash: criterionHash(
        criterion(
          receipt.subject,
          receipt.holds.find((row) => row.id === holdId),
        ),
      ),
      criterionHash: criterionHash(
        criterion(
          buildPlanSubject(root, "HEAD", {
            workspace: true,
            goalReview: Boolean(receipt.subject.goalReview),
          }),
          receipt.holds.find((row) => row.id === holdId),
        ),
      ),
    };
    checkLocalTerms(root, [
      { name: "override-event", text: JSON.stringify(event) },
    ]);
    ensureDirectory(root, "docs/control");
    appendFileSync(join(root, OVERRIDES), `${JSON.stringify(event)}\n`, {
      mode: 0o644,
    });
    return event;
  });
}

/** Record the repair once; no worker or replacement judgment is needed. */
export async function disposePlanHold(
  root,
  { receiptId, holdId, reason, now = () => new Date().toISOString() },
) {
  return locked(root, async () => {
    const receipts = await readReceipts(root);
    const receipt = receipts.find((row) => row.receiptId === receiptId);
    const hold = receipt?.holds.find((row) => row.id === holdId);
    check(
      hold && text(reason),
      "disposition requires a recorded hold and reason",
    );
    const current = buildPlanSubject(root, "HEAD", {
      workspace: true,
      goalReview: Boolean(receipt.subject.goalReview),
    });
    check(
      criterion(current, hold) !== undefined,
      "disposed criterion must remain in the current subject",
    );
    const event = {
      schemaVersion: 2,
      type: "PlanHoldDisposed",
      recordedAt: now(),
      receiptId,
      receiptHash: receipt.receiptHash,
      holdId,
      reason,
      workOrderId: hold.workOrderId,
      criterionId: hold.criterionId,
      sourceCriterionHash: criterionHash(criterion(receipt.subject, hold)),
      criterionHash: criterionHash(criterion(current, hold)),
      ...repairedCostBinding(root, receipt, hold),
    };
    check(
      timestamp(event.recordedAt) &&
        event.recordedAt >= receipt.episode.completedAt,
      "disposition timestamp precedes its receipt",
    );
    checkLocalTerms(root, [
      { name: "disposition-event", text: JSON.stringify(event) },
    ]);
    ensureDirectory(root, "docs/control");
    appendFileSync(join(root, OVERRIDES), `${JSON.stringify(event)}\n`, {
      mode: 0o644,
    });
    return event;
  });
}

const amendmentDecision = (root, decisionId) => {
  const workOrderId = decisionId.slice(0, 6);
  const path = `docs/evidence/${workOrderId}/decisions.md`;
  check(
    containedRegularFile(join(root, path), root),
    "execution amendment decision must be a contained regular file",
  );
  const decision = readDecisions(root, { workOrder: workOrderId }).find(
    (row) => row.id === decisionId,
  );
  check(decision, `execution amendment needs recorded decision ${decisionId}`);
  const { path: decisionPath, workOrder, ...entry } = decision;
  return { workOrder, hash: sha256(stable(entry)) };
};
const validateAmendment = (root, event, receipts) => {
  const receipt = receipts.find(
    (row) =>
      row.receiptId === event.receiptId &&
      row.receiptHash === event.receiptHash,
  );
  const order = receipt?.subject.orders.find(
    (row) => row.workOrderId === event.workOrderId,
  );
  check(
    order && event.recordedAt >= receipt.episode.completedAt,
    "execution amendment names missing receipt/order or predates its receipt",
  );
  check(
    sha256(
      executionAmendmentSource(
        committedReader(root, receipt.subject.revision).read(order.path),
      ),
    ) === event.sourceOrderHash,
    "execution amendment source order binding differs",
  );
  const decision = amendmentDecision(root, event.decisionId);
  check(
    decision.workOrder === event.workOrderId &&
      decision.hash === event.decisionHash,
    "execution amendment decision binding differs",
  );
};

/** Operator-authorized execution change, not a refutation or hold disposition. */
export async function amendPlanOrder(
  root,
  { workOrderId, decisionId, reason, now = () => new Date().toISOString() },
) {
  return locked(root, async () => {
    const receipts = await readReceipts(root);
    const receipt = [...receipts]
      .reverse()
      .find((row) => row.pass.kind === "planning");
    const order = receipt?.subject.orders.find(
      (row) => row.workOrderId === workOrderId,
    );
    check(
      order && text(reason),
      "execution amendment requires an order in the current judged horizon and an authorization reason",
    );
    check(
      new RegExp(`^${workOrderId}-D\\d{3}$`, "u").test(decisionId),
      "execution amendment decision must belong to the order",
    );
    const sourceOrderHash = sha256(
      executionAmendmentSource(
        committedReader(root, receipt.subject.revision).read(order.path),
      ),
    );
    const amendedSource = executionAmendmentSource(read(root, order.path));
    const orderHash = sha256(amendedSource);
    check(
      sourceOrderHash !== orderHash,
      "order has no substantive execution amendment",
    );
    const decision = amendmentDecision(root, decisionId);
    const event = {
      schemaVersion: 3,
      type: "PlanExecutionAmended",
      recordedAt: now(),
      receiptId: receipt.receiptId,
      receiptHash: receipt.receiptHash,
      workOrderId,
      sourceOrderHash,
      orderHash,
      orderLength: amendedSource.length,
      decisionId,
      decisionHash: decision.hash,
      reason,
    };
    check(timestamp(event.recordedAt), "invalid execution amendment timestamp");
    validateAmendment(root, event, receipts);
    const prior = readOverrides(root).find(
      (row) =>
        row.type === event.type &&
        row.receiptHash === event.receiptHash &&
        row.workOrderId === workOrderId &&
        row.orderHash === orderHash &&
        row.decisionHash === decision.hash,
    );
    if (prior) return prior;
    checkLocalTerms(root, [
      { name: "execution-amendment-event", text: JSON.stringify(event) },
    ]);
    ensureDirectory(root, "docs/control");
    appendFileSync(join(root, OVERRIDES), `${JSON.stringify(event)}\n`, {
      mode: 0o644,
    });
    return event;
  });
}

export function checkPassReceipt(
  pass,
  subject,
  receipts,
  overrides,
  { requireLive = true, currentSubject = subject } = {},
) {
  const latest = receipts
    .filter(
      (receipt) =>
        receipt.pass.id === pass.id && receipt.pass.kind === "planning",
    )
    .sort((a, b) => a.ordinal - b.ordinal)
    .at(-1);
  check(
    latest &&
      (latest.subject.hash === subject.hash || latest.subject.goalReview),
    `planning pass ${pass.id} needs a receipt matching the current subject`,
  );
  check(
    !requireLive ||
      latest.episode.kind === "direct-session" ||
      ["claude-cli-print", "codex-cli-exec"].includes(latest.episode.transport),
    "planning gate requires an actual CLI or direct-session review",
  );
  const bindings = criterionDispositions(receipts, overrides);
  for (const hold of latest.holds)
    check(
      isDisposed(hold, currentSubject, bindings),
      `unanswered hold ${latest.receiptId}:${hold.id}`,
    );
  return latest;
}

export function planningPassScope(root) {
  // The first-parent introduction dates the standard after a squash or merge.
  // Before this mechanism is committed, only its executable fixtures and live
  // evidence receipts apply. Same-day earlier headings are explicitly exempt.
  const introduction = runGit(root, [
    "log",
    "--first-parent",
    "--reverse",
    "--diff-filter=A",
    "--format=%H %cI",
    "HEAD",
    "--",
    "scripts/refute-plan.mjs",
  ])
    .split("\n")
    .find(Boolean);
  if (!introduction) return { passes: [], enforcement: null };
  const [revision, at] = introduction.split(" ");
  let old = [];
  try {
    old = planningPasses(
      committedReader(root, `${revision}^`).read(PLAN_LEDGER),
    );
  } catch {
    /* fixture root commit */
  }
  const exempt = new Set(old.map(({ heading }) => heading));
  const passes = planningPasses(read(root, PLAN_LEDGER)).filter(
    ({ date, heading }) => date >= at.slice(0, 10) && !exempt.has(heading),
  );
  return { passes, enforcement: at.slice(0, 10) };
}

export async function checkPlanGate(root) {
  checkSequenceTopology(readIndex(root, []));
  const localTerms = checkLocalTerms(root, []).status;
  const receipts = await readReceipts(root);
  const overrides = readOverrides(root);
  for (const event of overrides) {
    if (event.type === "PlanExecutionAmended") {
      validateAmendment(root, event, receipts);
      continue;
    }
    check(
      receipts.some(
        (receipt) =>
          receipt.receiptId === event.receiptId &&
          receipt.receiptHash === event.receiptHash &&
          receipt.holds.some(
            (hold) =>
              hold.id === event.holdId &&
              (event.schemaVersion !== 2 ||
                (hold.workOrderId === event.workOrderId &&
                  hold.criterionId === event.criterionId &&
                  criterionHash(criterion(receipt.subject, hold)) ===
                    event.sourceCriterionHash &&
                  (!event.sourceCostHash ||
                    (receipt.subject.goalReview &&
                      event.sourceCostHash ===
                        sha256(
                          planCostDeclaration(
                            committedReader(
                              root,
                              receipt.subject.revision,
                            ).read(
                              receipt.subject.orders.find(
                                (row) => row.workOrderId === hold.workOrderId,
                              ).path,
                            ),
                          ),
                        ))))),
          ),
      ),
      "override names missing receipt or hold",
    );
  }
  const { passes, enforcement } = planningPassScope(root);
  if (!enforcement)
    return {
      receipts: receipts.length,
      passes: 0,
      enforcement: "pending introduction commit",
      localTerms,
    };
  let continuation = null;
  if (passes.length) {
    const currentReceipt = [...receipts]
      .reverse()
      .find((receipt) => receipt.pass.kind === "planning");
    const subject = buildPlanSubject(root, "HEAD", {
      goalReview: Boolean(currentReceipt?.subject.goalReview),
    });
    const observed = buildPlanSubject(root, "HEAD", {
      workspace: true,
      goalReview: Boolean(currentReceipt?.subject.goalReview),
    });
    for (const pass of passes)
      check(
        receipts.some(
          (receipt) =>
            receipt.pass.id === pass.id && receipt.pass.kind === "planning",
        ),
        `planning pass ${pass.id} needs a receipt`,
      );
    // A new pass can repair the preceding held horizon. Its current receipt
    // carries every older hold by acceptance or exact repetition; prior receipts
    // remain time-indexed instead of being rewritten to today's standard.
    const latest = [...receipts]
      .reverse()
      .find((receipt) => receipt.pass.kind === "planning");
    check(
      passes.some((pass) => pass.id === latest?.pass.id),
      "current horizon receipt does not name an enforced planning pass",
    );
    checkPassReceipt(latest.pass, latest.subject, receipts, overrides, {
      currentSubject: observed,
    });
    continuation = {
      receiptId: latest.receiptId,
      judgedSubject: latest.subject.hash,
      committedSubject: subject.hash,
      workspaceSubject: observed.hash,
      committedUpdates: checkPlanContinuation(root, latest.subject, subject, {
        allowCapabilityHistoryRepair: true,
        dispositions: criterionDispositions(receipts, overrides),
        amendments: overrides.filter(
          (row) =>
            row.type === "PlanExecutionAmended" &&
            row.receiptHash === latest.receiptHash,
        ),
      }),
      workspaceUpdates: checkPlanContinuation(root, latest.subject, observed, {
        workspace: true,
        dispositions: criterionDispositions(receipts, overrides),
        amendments: overrides.filter(
          (row) =>
            row.type === "PlanExecutionAmended" &&
            row.receiptHash === latest.receiptHash,
        ),
      }),
    };
  }
  return {
    receipts: receipts.length,
    passes: passes.length,
    enforcement,
    localTerms,
    continuation,
  };
}
