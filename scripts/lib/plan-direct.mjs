import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runGit } from "./git.mjs";
import {
  buildPlanSubject,
  hashParts,
  PLAN_LEDGER,
  planningPasses,
  sha256,
} from "./plan-subject.mjs";
import {
  readReceipts,
  writePlanReceipt,
  checkPlanGate,
  RECEIPTS,
} from "./plan-receipts.mjs";
import { containedRegularFile } from "./paths.mjs";
import { readBudgets } from "./process-budget.mjs";

const local = "docs/control/local/plan";
export const planOrderHash = (order) =>
  hashParts([
    order.workOrderId,
    order.title,
    order.objective,
    order.criteria,
    order.nonGoals,
    ...(Object.hasOwn(order, "cost") ? [order.cost] : []),
  ]);
export function latestPlanningPass(root) {
  const passes = planningPasses(readFileSync(join(root, PLAN_LEDGER), "utf8"));
  const pass = passes.sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!pass) throw new Error("no dated planning-pass ledger heading");
  return { id: pass.id, kind: "planning", heading: pass.heading };
}
export async function planJudgmentScope(root, subject, pass, scope = "pass") {
  if (!["pass", "full"].includes(scope))
    throw new Error("Refutation scope must be pass or full");
  const history = await readReceipts(root);
  let changed = new Set(subject.orders.map((row) => row.workOrderId));
  if (scope === "pass") {
    const introduced = runGit(root, [
      "log",
      "--reverse",
      "--format=%H",
      `-S## ${pass.heading}`,
      "HEAD",
      "--",
      PLAN_LEDGER,
    ])
      .split("\n")
      .find(Boolean);
    if (introduced) {
      try {
        const before = buildPlanSubject(root, `${introduced}^`, {
          costTable: false,
        });
        changed = new Set(
          subject.orders
            .filter(
              (order) =>
                planOrderHash(order) !==
                planOrderHash(
                  before.orders.find(
                    (row) => row.workOrderId === order.workOrderId,
                  ) ?? { criteria: [], nonGoals: "" },
                ),
            )
            .map((row) => row.workOrderId),
        );
      } catch {
        /* Initial horizon has no earlier subject: every order is new. */
      }
    }
  }
  const carried = [];
  for (const order of subject.orders.filter(
    (row) => !changed.has(row.workOrderId),
  )) {
    const prior = [...history]
      .reverse()
      .find((receipt) =>
        receipt.subject.orders.some(
          (row) => row.workOrderId === order.workOrderId,
        ),
      );
    if (
      !prior?.subject.orders.some(
        (row) =>
          row.workOrderId === order.workOrderId &&
          planOrderHash(row) === planOrderHash(order),
      )
    ) {
      changed.add(order.workOrderId);
      continue;
    }
    carried.push({
      workOrderId: order.workOrderId,
      orderHash: planOrderHash(order),
      receiptId: prior.receiptId,
      receiptHash: prior.receiptHash,
    });
  }
  return {
    scope,
    judgedOrderIds: subject.orders
      .filter((row) => changed.has(row.workOrderId))
      .map((row) => row.workOrderId),
    carried,
  };
}
export async function carryPlanResult(root, subject, review, value) {
  if (
    !value ||
    !Array.isArray(value.orders) ||
    value.orders.length !== review.judgedOrderIds.length ||
    value.orders.some(
      (row) => !review.judgedOrderIds.includes(row.workOrderId),
    ) ||
    new Set(value.orders.map((row) => row.workOrderId)).size !==
      value.orders.length
  )
    throw new Error("One direct result per judged order required");
  const history = await readReceipts(root),
    carriedOrders = [],
    carriedHolds = [];
  for (const item of review.carried) {
    const prior = history.find(
      (row) =>
        row.receiptId === item.receiptId &&
        row.receiptHash === item.receiptHash,
    );
    const order = subject.orders.find(
      (row) => row.workOrderId === item.workOrderId,
    );
    if (
      !prior ||
      !order ||
      planOrderHash(order) !== item.orderHash ||
      !prior.subject.orders.some(
        (row) =>
          row.workOrderId === item.workOrderId &&
          planOrderHash(row) === item.orderHash,
      )
    )
      throw new Error("Carried verdict source or current order hash changed");
    carriedOrders.push(
      prior.result.orders.find((row) => row.workOrderId === item.workOrderId),
    );
    carriedHolds.push(
      ...prior.result.holdReasons.filter(
        (row) => row.workOrderId === item.workOrderId,
      ),
    );
  }
  return {
    ...value,
    orders: subject.orders.map((order) =>
      [...value.orders, ...carriedOrders].find(
        (row) => row.workOrderId === order.workOrderId,
      ),
    ),
    holdReasons: [...(value.holdReasons ?? []), ...carriedHolds],
  };
}
export async function beginDirectRefutation(
  root,
  { scope = "pass", now = () => new Date().toISOString() } = {},
) {
  const subject = buildPlanSubject(root),
    pass = latestPlanningPass(root);
  if (buildPlanSubject(root, "HEAD", { workspace: true }).hash !== subject.hash)
    throw new Error(
      "commit the planning subject before refutation; committed subject differs from workspace",
    );
  const history = await readReceipts(root);
  if (
    history.some(
      (row) => row.pass.id === pass.id && row.subject.hash === subject.hash,
    )
  )
    throw new Error("same subject cannot be re-rolled");
  const review = await planJudgmentScope(root, subject, pass, scope);
  const path = `${local}/direct-${subject.hash.slice(7)}-${scope}.json`;
  const pending = existsSync(join(root, path))
    ? JSON.parse(readFileSync(join(root, path), "utf8"))
    : {
        schemaVersion: 1,
        revision: subject.revision,
        subjectHash: subject.hash,
        pass,
        review,
        dispatchedAt: now(),
      };
  if (
    pending.subjectHash !== subject.hash ||
    JSON.stringify(pending.review) !== JSON.stringify(review)
  )
    throw new Error(
      "Pending direct refutation differs from current subject; retain its evidence",
    );
  mkdirSync(join(root, local), { recursive: true });
  if (!existsSync(join(root, path)))
    writeFileSync(join(root, path), JSON.stringify(pending, null, 2) + "\n", {
      flag: "wx",
    });
  writeFileSync(
    join(root, local, "current-direct.json"),
    JSON.stringify({ path }) + "\n",
  );
  const { compilePlanRefuter } =
    await import("../../packages/skeleton/dist/src/loadouts/plan-refuter.js");
  const { planPrompt } =
    await import("../../packages/skeleton/dist/src/plan-refutation-protocol.js");
  const compiled = compilePlanRefuter(
    subject.revision,
    Date.parse(pending.dispatchedAt),
  );
  return planPrompt({
    workOrder: compiled.program.workOrder,
    subject: { ...subject, judgment: review },
  });
}
export async function fileDirectRefutation(
  root,
  resultPath,
  statementPath,
  {
    dispositions = [],
    now = () => new Date().toISOString(),
    commit = true,
  } = {},
) {
  for (const path of [resultPath, statementPath])
    if (!containedRegularFile(join(root, path), root))
      throw new Error(
        "Direct result and statement must be contained regular files",
      );
  const pointer = JSON.parse(
    readFileSync(join(root, local, "current-direct.json"), "utf8"),
  );
  if (
    !new RegExp(`^${local}/direct-[a-f0-9]{64}-(?:pass|full)\\.json$`).test(
      pointer.path,
    )
  )
    throw new Error("Invalid direct refutation pointer");
  const pending = JSON.parse(readFileSync(join(root, pointer.path), "utf8"));
  const subject = buildPlanSubject(root);
  if (
    subject.hash !== pending.subjectHash ||
    buildPlanSubject(root, "HEAD", { workspace: true }).hash !== subject.hash
  )
    throw new Error("Direct refutation subject is stale");
  const completedAt = now(),
    durationMs = Date.parse(completedAt) - Date.parse(pending.dispatchedAt);
  if (!Number.isFinite(durationMs) || durationMs < 0)
    throw new Error("Invalid direct refutation duration");
  const budget = readBudgets(root);
  if (
    pending.review.scope === "pass" &&
    budget &&
    durationMs > budget.limits.passRefutationMs &&
    !budget.acceptances.some(
      (row) => row.metric === "passRefutationMs" && durationMs <= row.ceiling,
    )
  )
    throw new Error(
      `Pass refutation exceeded ${budget.limits.passRefutationMs} ms; a dated acceptance or new full-scope dispatch is required`,
    );
  const { validatePlanResult } =
    await import("../../packages/skeleton/dist/src/plan-refutation-protocol.js");
  const raw = JSON.parse(readFileSync(join(root, resultPath), "utf8"));
  const result = validatePlanResult(
    await carryPlanResult(root, subject, pending.review, raw),
    subject,
  );
  const statement = readFileSync(join(root, statementPath), "utf8").trim();
  const episode = {
    kind: "direct-session",
    harness: "unknown",
    harnessVersion: "unknown",
    model: "unknown",
    effort: "unknown",
    settingsVerification: "unverified",
    profileId: "plan-refutation-v1",
    completedAt,
    resultHash: sha256(`${JSON.stringify(result, null, 2)}\n`),
    judgmentBasis: "canonical-subject-and-protocol",
    independence: "session-attested",
    contextIsolation: "not-enforced",
    modelTools: "available",
    statement,
    review: {
      ...pending.review,
      dispatchedAt: pending.dispatchedAt,
      durationMs,
    },
    result,
  };
  if (commit && runGit(root, ["diff", "--cached", "--name-only"]))
    throw new Error("Direct receipt commit refuses an unrelated staged change");
  const receipt = await writePlanReceipt(root, {
    pass: pending.pass,
    slug: pending.pass.id,
    subject,
    episode,
    dispositions,
  });
  if (commit) {
    const paths = ["json", "md"].map(
      (ext) => `${RECEIPTS}/${receipt.receiptId}.${ext}`,
    );
    runGit(root, ["add", "--", ...paths]);
    runGit(root, [
      "commit",
      "-m",
      `Record planning refutation ${receipt.receiptId}`,
      "--",
      ...paths,
    ]);
  }
  const gate = await checkPlanGate(root);
  return {
    receipt: `${RECEIPTS}/${receipt.receiptId}.md`,
    scope: pending.review.scope,
    durationMs,
    verdict: receipt.result.planVerdict,
    carried: pending.review.carried.length,
    gate,
  };
}
