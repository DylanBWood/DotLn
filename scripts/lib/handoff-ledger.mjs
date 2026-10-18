// The executor's handoff ledger (WO-173), handoff.md in the order's directory
// under the configured evidence root. It holds one line per acceptance
// criterion the order declares, in the forms a verification report already
// uses, followed on the same line by the evidence for met or the decision
// that records why for unmet. The two executor completions read it: a
// criterion recorded met that names a gate stands on that gate's passing
// row, and a criterion recorded unmet always records and is shown at the
// next dispatch. A claim the record contradicts may be refused; a handoff
// may not.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { docPath, docRelative } from "./config.mjs";
import { runGitPathList } from "./git.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";
import { criterionJudgments, criterionLineForms } from "./off-ramps.mjs";

// The self-review line has one form: at the start of a line, after an optional
// list marker, `self-review: found <n>; fixed <n>; recorded <n>`; text may
// follow. No other spelling, emphasis or indentation is the line.
const SELF_REVIEW =
  /^(?:(?:[-*+]|\d{1,9}[.)])[ \t]+)?self-review: found \d+; fixed \d+; recorded \d+(?!\w)/u;

/**
 * The numbered acceptance criteria an order's text declares, each with the
 * text of its item (wrapped lines included, up to a blank line), or null
 * when the text holds no such list to check against.
 */
export function declaredCriteria(text) {
  const start = text.search(
    /^(?:\*\*Acceptance criteria\b[^\n]*|#{2,4} Acceptance criteria\b[^\n]*)$/imu,
  );
  if (start < 0) return null;
  const items = [];
  let open = false;
  for (const line of text.slice(start).split(/\r?\n/u).slice(1)) {
    if (/^(?:#{1,4} |\*\*[^*]+(?::\*\*|\*\*$))/u.test(line)) break;
    const item = /^(\d{1,4})\.\s+(.*)$/u.exec(line);
    if (item) {
      items.push({ id: item[1], text: item[2].trim() });
      open = true;
    } else if (!line.trim()) open = false;
    else if (open) items.at(-1).text += ` ${line.trim()}`;
  }
  return items.length ? items : null;
}

/** Read only the Preflight field, including its wrapped continuation lines. */
export function readPreflightSuites(orderText) {
  const field =
    /(?:^|\n)\*\*Preflight:\*\*([^]*?)(?=\n\s*\n|\n\*\*|$)/u.exec(
      orderText,
    )?.[1] ?? "";
  return [
    ...new Set(
      [...field.matchAll(/--only\s+([a-z][a-z0-9:-]*)/gu)].map(
        (match) => match[1],
      ),
    ),
  ];
}

const preflightSuites = (root, state) =>
  state
    ? readPreflightSuites(
        readFileSync(
          workOrderAuthorityPath(root, state.workOrderId, state.workOrderPath),
          "utf8",
        ),
      )
    : [];

const changedDocuments = (root) =>
  [
    ...runGitPathList(root, ["diff", "--name-only", "-z", "HEAD"]),
    ...runGitPathList(root, [
      "ls-files",
      "--others",
      "--exclude-standard",
      "-z",
    ]),
  ].some(
    (path) =>
      /\.md$/iu.test(path) ||
      path.startsWith(docRelative(root, "evidence") + "/"),
  );

/** The launchpad-relative ledger path. */
export const handoffLedgerPath = (root, workOrderId) =>
  docRelative(root, "evidence", `${workOrderId}/handoff.md`);

// The gates a criterion's text names; the review form implies the plain one.
const GATE_NAMES = [
  ["document", /npm run test:docs/u],
  ["review", /npm test\s+--\s+--review/u],
  ["plain", /\bnpm test\b/u],
];
const TARGET_GATE_NAMES = [
  ["review", /\btarget-gate(?:\.mjs)?\b[^`\n]*--review/u],
  ["plain", /\btarget-gate(?:\.mjs)?\b/u],
];

const named = (ids) =>
  `${ids.length === 1 ? "criterion" : "criteria"} ${ids.join(", ")}`;

const readDeclaredCriteria = (root, state) => {
  try {
    return declaredCriteria(
      readFileSync(
        workOrderAuthorityPath(root, state.workOrderId, state.workOrderPath),
        "utf8",
      ),
    );
  } catch {
    return null;
  }
};

const criterionGateClaims = (declared, met, state) => {
  const claims = { document: [], review: [], plain: [] };
  const gates = state.repositoryId
    ? [...GATE_NAMES, ...TARGET_GATE_NAMES]
    : GATE_NAMES;
  for (const { id, text } of declared ?? [])
    if (met.includes(id))
      for (const [gate, pattern] of gates)
        if (pattern.test(text) && !claims[gate].includes(id))
          claims[gate].push(id);
  return claims;
};

/** The verifier's met judgments use the executor's existing gate semantics. */
export function readReportGateClaims(root, state, reportPath) {
  const declared = readDeclaredCriteria(root, state);
  const met = criterionJudgments(readFileSync(join(root, reportPath), "utf8"))
    .filter((judgment) => judgment.met)
    .map((judgment) => judgment.criterionId);
  return {
    checked: declared !== null,
    claims: criterionGateClaims(declared, met, state),
    advisories: [],
  };
}

/**
 * Read the ledger against the order's declared criteria. Throws a refusal
 * that names the identifiers and the accepted forms for an absent ledger, a
 * missing criterion, two lines for one criterion or a line for a criterion
 * the order does not declare. An order whose criteria cannot be read is not
 * checked and returns one advisory, as before this order.
 */
export function readHandoffLedger(root, state, { selfReview = true } = {}) {
  const path = handoffLedgerPath(root, state.workOrderId);
  const readable = containedRegularFile(
    join(root, path),
    docPath(root, "evidence"),
  );
  const text = readable ? readFileSync(join(root, path), "utf8") : "";
  const advisories =
    !selfReview ||
    text.split(/\r\n?|\n/u).some((line) => SELF_REVIEW.test(line))
      ? []
      : [
          `${path} lacks a self-review: line; write a line that starts \`self-review: found <n>; fixed <n>; recorded <n>\` with the fresh review's counts, then the worker or the separate-pass fallback. Completion records all the same.`,
        ];
  const declared = readDeclaredCriteria(root, state);
  if (!declared)
    return {
      checked: false,
      path,
      declared: null,
      met: [],
      unmet: [],
      claims: { document: [], review: [], plain: [] },
      advisories: [
        ...advisories,
        `${state.workOrderPath} declares no numbered acceptance criteria this completion can read; ${path} is not checked.`,
      ],
    };
  const ids = declared.map((criterion) => criterion.id);
  const refuse = (detail) => {
    throw new Error(
      `${path}: ${detail}. Before handoff the executor judges each declared criterion (${ids.join(", ")}) on one line, met followed by its evidence or unmet followed by the decision that says why (criterion lines: ${criterionLineForms}).`,
    );
  };
  if (!readable) refuse("absent");
  const judgments = criterionJudgments(text);
  const seen = new Map();
  const duplicates = [];
  const undeclared = [];
  for (const judgment of judgments) {
    const id = judgment.criterionId;
    if (!ids.includes(id)) {
      if (!undeclared.includes(id)) undeclared.push(id);
    } else if (seen.has(id)) {
      if (!duplicates.includes(id)) duplicates.push(id);
    } else seen.set(id, judgment);
  }
  const missing = ids.filter((id) => !seen.has(id));
  const problems = [
    missing.length && `no line judges ${named(missing)}`,
    duplicates.length && `two lines judge ${named(duplicates)}`,
    undeclared.length &&
      `${named(undeclared)} ${undeclared.length === 1 ? "is" : "are"} not declared by ${state.workOrderPath}`,
  ].filter(Boolean);
  if (problems.length) refuse(problems.join("; "));
  const met = ids.filter((id) => seen.get(id).met);
  const unmet = ids.filter((id) => !seen.get(id).met);
  const claims = criterionGateClaims(declared, met, state);
  return { checked: true, path, declared, met, unmet, claims, advisories };
}

// The suites `npm test -- --review` would run now, read through the runner's
// own listing so the completion and the gate agree on the selection, whether
// or not the runner is this checkout's.
function reviewSelection(root, runner) {
  if (!existsSync(runner))
    return { error: `${relative(root, runner)} is absent` };
  const run = spawnSync(process.execPath, [runner, "--review", "--list"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (run.error) return { error: run.error.message };
  if (run.status !== 0)
    return {
      error: `npm test -- --review --list exited ${run.status ?? "on a signal"}: ${(run.stderr ?? "").trim().split("\n").at(-1) ?? ""}`,
    };
  const names = run.stdout
    .split("\n")
    .map((line) => /^(\S+) — /u.exec(line)?.[1])
    .filter(Boolean);
  return names.length
    ? { names }
    : { error: "npm test -- --review --list named no suite" };
}

const gateFields = (row) => ({
  evidenceRefs: [row.evidenceRef],
  ...Object.fromEntries(
    [
      "checkId",
      "treeHash",
      "codeIdentity",
      "instanceInputDigest",
      "durationMs",
      "evidenceRef",
      "recordedAt",
      "executed",
      "exitCode",
    ]
      .filter((key) => row[key] !== undefined)
      .map((key) => [key, row[key]]),
  ),
});

/**
 * Check the gates the ledger's met criteria name. A criterion that names
 * `npm test` or `npm test -- --review` consumes a passing complete row or
 * the structural and declared Preflight rows at the current code identity; a criterion that names `npm run test:docs`
 * makes the completion run the document gate once, here, after every other
 * check. A failed gate or a missing row refuses the claim and prints the
 * command and the choice; a gate that cannot start prints one advisory and
 * the completion records.
 *
 * For self orders, gate storage this completion cannot read or write leaves
 * one advisory naming the claims as stated. A target claim requires readable
 * passing target evidence, read first: an unreadable or malformed index
 * refuses naming the index file and the target gate rerun, never one
 * advisory. `gateIndexError` is the diff check's failed write to the live
 * index; then no other row is read and the document gate is not run, since
 * its runner could not record a row and would exit as failed.
 */
export async function requireGateClaims(
  root,
  ledger,
  {
    runner = join(root, "scripts/test-runner.mjs"),
    log = console,
    gateIndexError,
    state,
  } = {},
) {
  const advisories = [];
  // One advisory is one line, whatever an error message quotes.
  const advise = (message) => {
    const line = message.replace(/\s+/gu, " ").trim();
    advisories.push(line);
    log.warn(`Advisory: ${line}`);
  };
  const result = { advisories };
  const claims = ledger?.checked
    ? ledger.claims
    : { document: [], review: [], plain: [] };
  const instead = `record the criterion unmet with the reason instead (criterion lines: ${criterionLineForms})`;
  const productClaims = [...new Set([...claims.plain, ...claims.review])];
  if (state?.repositoryId && productClaims.length) {
    const { targetGateEvidence } = await import("./target-gate.mjs");
    result.targetGate = targetGateEvidence(
      root,
      state,
      claims.review.length ? "review" : "plain",
    );
  }
  const stated = (kinds) => {
    const clauses = kinds.map(
      ([gate, ids]) => `the ${gate} claim of ${named(ids)}`,
    );
    return clauses.length
      ? `${clauses.join(" and ")} ${clauses.length === 1 ? "is" : "are"} recorded as stated`
      : "";
  };
  if (gateIndexError) {
    const spared = stated(
      [
        ["npm test", state?.repositoryId ? [] : productClaims],
        ["npm run test:docs", claims.document],
      ].filter(([, ids]) => ids.length),
    );
    advise(
      `Gate index unavailable: ${gateIndexError}; the git diff --check row is not recorded${spared ? `, and ${spared}` : ""}.`,
    );
    return result;
  }
  if (!ledger?.checked) return result;
  // The row lookups load the skeleton's gate index only when a claim needs
  // them, so a control plane without the skeleton still loads this module.
  const { coveringGateCheck, describeGateRow, STRUCTURAL_SUITES } =
    await import("./gate-reuse.mjs");
  // A structural task displaced by a later failed structural run is repaired
  // by regenerating what it found stale, then a passing structural phase.
  const structuralRemedy = (displaced) =>
    displaced.some((name) => STRUCTURAL_SUITES.includes(name))
      ? "; a later structural run failed: run npm run sync, then a passing structural phase (npm test -- --only format)"
      : "";
  // Every self-order read of the index goes through here: an unreadable
  // index is one advisory and an undefined result, never a refusal. A target
  // claim's read above refuses instead.
  const lookup = async (...args) => {
    try {
      return await coveringGateCheck(root, ...args);
    } catch (error) {
      advise(
        `Gate index unavailable: ${error.message}; ${stated([["npm test", productClaims]])}.`,
      );
    }
  };
  let focused;
  if (productClaims.length && !state?.repositoryId) {
    const command = `npm test${claims.review.length ? " -- --review" : ""}`;
    const plain = await lookup("npm test", []);
    if (plain) {
      let complete = plain;
      if (plain.row && claims.review.length) {
        const selection = reviewSelection(root, runner);
        if (selection.error)
          advise(
            `Review selection unavailable (${selection.error}); the npm test -- --review claim of ${named(claims.review)} stands on the plain npm test row (${describeGateRow(plain.row)}).`,
          );
        else
          complete =
            (await lookup("npm test", selection.names, plain.codeIdentity)) ??
            plain;
      }
      if (complete.row) result.productGate = gateFields(complete.row);
      else {
        const { preflightRows } = await import("./gate-reuse.mjs");
        focused = await preflightRows(
          root,
          plain.codeIdentity,
          preflightSuites(root, state),
        );
        if (focused.missing.length)
          throw new Error(
            `${named(productClaims)} recorded met names ${command}, and no passing complete npm test row ${plain.displaced ? `stands at the current code identity ${plain.codeIdentity}: the latest complete row (${describeGateRow(plain.displaced.row)}) names ${plain.displaced.tasks.join(", ")}, whose latest execution there can no longer be carried` : `exists at the current code identity ${plain.codeIdentity}`}. Handoff rows missing or failed: ${focused.missing.map(({ suite, reason, displaced }) => `${suite} (${reason}${displaced.length ? `: ${displaced.join(", ")} displaced` : ""}); run ${displaced.some((name) => STRUCTURAL_SUITES.includes(name)) ? "npm run sync, then " : ""}npm test -- --only ${suite === "structural" ? "format" : suite}`).join("; ")}${complete.missing?.length ? `; current review selection lacks ${complete.missing.join(", ")}` : ""}${structuralRemedy(plain.displaced?.tasks ?? [])}. Run the named Preflight suites, or ${instead}.`,
          );
        result.productGate = {
          codeIdentity: plain.codeIdentity,
          evidenceRefs: focused.rows.map((row) => row.evidenceRef),
          rows: focused.rows.map(gateFields),
        };
      }
    }
  }
  if (focused && (claims.document.length || changedDocuments(root))) {
    const { gateCandidates, completePassingRow } =
      await import("./gate-reuse.mjs");
    const candidates = await gateCandidates(
      root,
      "npm run test:docs",
      focused.codeIdentity,
    );
    const row = candidates.rows.at(-1);
    if (!row || !completePassingRow(row))
      throw new Error(
        `Handoff document row missing or failed at the current code identity ${focused.codeIdentity}; run npm run test:docs before completing.`,
      );
    result.documentGate = gateFields(row);
    result.productGate.rows.push(gateFields(row));
    result.productGate.evidenceRefs.push(row.evidenceRef);
  }
  if (claims.document.length && !focused) {
    const claim = `the npm run test:docs claim of ${named(claims.document)}`;
    if (!existsSync(runner)) {
      advise(
        `Document gate cannot start: ${relative(root, runner)} is absent; ${claim} is recorded as stated.`,
      );
      return result;
    }
    log.log(
      `Running npm run test:docs, which ${named(claims.document)} recorded met names; the completion runs it once, after every other check.`,
    );
    const started = Date.now();
    const run = spawnSync(process.execPath, [runner, "--document"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    if (run.error) {
      advise(
        `Document gate cannot start: ${run.error.message}; ${claim} is recorded as stated.`,
      );
      return result;
    }
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
    const lines = output.trimEnd().split("\n");
    if (run.status !== 0) {
      const failing = lines.filter((line) =>
        /^(?:FAIL |npm run test:docs:|error:|Error:)/u.test(line),
      );
      throw new Error(
        `${named(claims.document)} recorded met names npm run test:docs, and the document gate failed after ${seconds} s (exit ${run.status ?? "on a signal"}):\n${(failing.length ? failing : lines.slice(-20)).map((line) => `  ${line}`).join("\n")}\nRepair and complete again, or ${instead}.`,
      );
    }
    log.log(
      lines.find((line) => line.startsWith("npm run test:docs:")) ??
        `npm run test:docs passed in ${seconds} s`,
    );
    try {
      const { findGateCheck, gateTreeHash } =
        await import("./gate-evidence.mjs");
      const row = findGateCheck(root, "npm run test:docs", gateTreeHash(root));
      if (row) result.documentGate = gateFields(row);
    } catch (error) {
      advise(`Document gate row unavailable after the run: ${error.message}`);
    }
  }
  return result;
}

/** The final review pays for a complete, fresh review run after its dispatch.
 * Target orders keep their own target gate and never acquire this core gate. */
export async function requireFinalReviewGate(
  root,
  ledger,
  { state, since, runner = join(root, "scripts/test-runner.mjs") } = {},
) {
  if (
    state?.repositoryId ||
    !ledger?.checked ||
    !(ledger.claims.plain.length || ledger.claims.review.length)
  )
    return undefined;
  const { coveringGateCheck, STRUCTURAL_SUITES } =
    await import("./gate-reuse.mjs");
  const selection = reviewSelection(root, runner);
  const refuse = (reason) => {
    throw new Error(
      `Final review requires npm test -- --review --again after this review's FinalReviewRequested event: ${reason}.`,
    );
  };
  if (selection.error) refuse(selection.error);
  const found = await coveringGateCheck(root, "npm test", selection.names);
  const dispatched = Date.parse(since);
  // The newest standing fresh review row recorded after the dispatch supplies
  // the claim. A later composed row reuses results, so it neither displaces
  // that row nor supplies the claim; a later failed fresh run displaces it
  // through the shared lookup and leaves no candidate.
  const row = Number.isFinite(dispatched)
    ? found.candidates.findLast(
        (candidate) =>
          candidate.gateSelection === "review" &&
          candidate.reusedSuites === 0 &&
          Date.parse(candidate.recordedAt) > dispatched &&
          selection.names.every((name) =>
            (Array.isArray(candidate.requiredSuites)
              ? candidate.requiredSuites
              : []
            ).includes(name),
          ),
      )
    : undefined;
  if (!row) {
    const displaced = found.displaced?.tasks ?? [];
    refuse(
      `no fresh passing complete review row at the current code identity ${found.codeIdentity}${displaced.length ? ` (the latest complete row names ${displaced.join(", ")}, whose latest execution there can no longer be carried${displaced.some((name) => STRUCTURAL_SUITES.includes(name)) ? "; a later structural run failed: run npm run sync, then a passing structural phase before the fresh review run" : ""})` : ""}`,
    );
  }
  return gateFields(row);
}

/** One line for the completion's own message. */
export const describeHandoff = (ledger) =>
  ledger?.checked
    ? ` Handoff ledger: ${ledger.met.length} met, ${ledger.unmet.length} unmet${ledger.unmet.length ? ` (${named(ledger.unmet)})` : ""}.`
    : "";
