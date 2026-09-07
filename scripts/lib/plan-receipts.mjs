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
  sha256,
} from "./plan-subject.mjs";
import { checkLocalTerms } from "./terms.mjs";
import { containedRegularFile } from "./paths.mjs";
import { runGit } from "./git.mjs";
import { validateAccountLabel } from "./control-actor.mjs";

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
    `Transport: \`${receipt.episode.transport}\`; harness version: \`${receipt.episode.harnessVersion}\`; model: \`${receipt.episode.model}\`; effort: \`${receipt.episode.effort}\`. Selection source: host-launch; effective model and effort: unknown.`,
    "",
    `Dispatched: ${receipt.episode.dispatchedAt}. Completed: ${receipt.episode.completedAt}. Local-terms list: **${receipt.localTerms.status}**.`,
    "",
    "The subject was compiled from committed vision sections, the roles table, capability rows, and order title/objective/criteria/non-goals. Planner narrative, ledger, earlier verdicts, and model tools were excluded. The host created an empty scratch working directory for this one-shot episode.",
    "",
    receipt.subject.orders.some(({ workOrderId }) => workOrderId === "WO-041")
      ? "Self-referential instrument: WO-041 builds this host and is also in its subject. Its order verdict is advisory, never evidence of this mechanism's correctness. Independent executable fixtures and a separate verifier judge the instrument."
      : "This verdict evaluates a planning horizon; it does not verify implementation or confer operator decision authority.",
    "",
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
    "Accepted dispositions name changed criteria; they do not discharge holds. Operator overrides exist only in the append-only planning control log, with actor, date, and an ignored capture's SHA-256. No text in this receipt grants an override. This receipt is immutable; a later attempt creates a new pair of files.",
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
    same(receipt.subject, buildPlanSubject(root, receipt.subject.revision)),
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
    ]) &&
      ["fake", "claude-cli-print", "codex-cli-exec"].includes(e.transport) &&
      text(e.harnessVersion) &&
      /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/u.test(e.model) &&
      ["low", "medium", "high", "xhigh", "max", "unknown"].includes(e.effort) &&
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
const sequenceKey = (receipt) =>
  receipt.subject.orders.map(({ workOrderId }) => workOrderId).join(",");

export function admitReceipt(receipt, history) {
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
  let held = 0;
  for (const item of [...samePass].reverse()) {
    if (
      item.result.planVerdict !== "hold" ||
      sequenceKey(item) !== sequenceKey(samePass.at(-1))
    )
      break;
    held++;
  }
  check(
    held < 3,
    "third consecutive hold stops this planning pass; operator override or next pass required",
  );
  check(
    !samePass.length || samePass.at(-1).subject.hash !== receipt.subject.hash,
    "same subject cannot be re-rolled",
  );
  const used = new Set();
  for (const old of prior.filter(
    (item) => item.result.planVerdict === "hold",
  )) {
    check(
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
  for (const receipt of receipts.sort((a, b) => a.ordinal - b.ordinal)) {
    admitReceipt(receipt, seen);
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
    const history = await readReceipts(root);
    const ordinal = history.length + 1;
    const receiptId = `${episode.completedAt.slice(0, 10)}-${slug}-${String(ordinal).padStart(3, "0")}`;
    const { result: rawResult, ...provenance } = episode;
    const { validatePlanResult } = await protocol();
    const result = validatePlanResult(rawResult, subject);
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
    admitReceipt(receipt, history);
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
    actor,
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
    actorValid(actor);
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
      schemaVersion: 1,
      type: "PlanHoldOverridden",
      recordedAt,
      receiptId,
      receiptHash: receipt.receiptHash,
      holdId,
      reason,
      actor,
      captureHash,
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

export function checkPassReceipt(
  pass,
  subject,
  receipts,
  overrides,
  { requireLive = true } = {},
) {
  const latest = receipts
    .filter(
      (receipt) =>
        receipt.pass.id === pass.id && receipt.pass.kind === "planning",
    )
    .sort((a, b) => a.ordinal - b.ordinal)
    .at(-1);
  check(
    latest && latest.subject.hash === subject.hash,
    `planning pass ${pass.id} needs a receipt matching the current subject`,
  );
  check(
    !requireLive || latest.episode.transport !== "fake",
    "planning gate requires an actual transport",
  );
  for (const hold of latest.holds)
    check(
      overrides.some(
        (event) =>
          event.type === "PlanHoldOverridden" &&
          event.receiptId === latest.receiptId &&
          event.receiptHash === latest.receiptHash &&
          event.holdId === hold.id &&
          event.actor &&
          validDigest(event.captureHash) &&
          timestamp(event.recordedAt) &&
          event.recordedAt >= latest.episode.completedAt,
      ),
      `unanswered hold ${latest.receiptId}:${hold.id}`,
    );
  return latest;
}

export async function checkPlanGate(root) {
  const localTerms = checkLocalTerms(root, []).status;
  const receipts = await readReceipts(root);
  const overrides = readOverrides(root);
  for (const event of overrides)
    check(
      receipts.some(
        (receipt) =>
          receipt.receiptId === event.receiptId &&
          receipt.receiptHash === event.receiptHash &&
          receipt.holds.some(({ id }) => id === event.holdId),
      ),
      "override names missing receipt or hold",
    );
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
  if (!introduction)
    return {
      receipts: receipts.length,
      passes: 0,
      enforcement: "pending introduction commit",
      localTerms,
    };
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
  if (passes.length) {
    const subject = buildPlanSubject(root);
    const observed = buildPlanSubject(root, "HEAD", { workspace: true });
    check(
      subject.hash === observed.hash,
      "planning subject has uncommitted changes; commit it before refutation",
    );
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
    checkPassReceipt(latest.pass, subject, receipts, overrides);
  }
  return {
    receipts: receipts.length,
    passes: passes.length,
    enforcement: at.slice(0, 10),
    localTerms,
  };
}
