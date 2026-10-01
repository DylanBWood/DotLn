import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";

export const withTemporaryBody = (body, operation, filename = "PR.md") => {
  const directory = mkdtempSync(join(tmpdir(), "dotln-body-"));
  const path = join(directory, filename);
  try {
    writeFileSync(path, body, "utf8");
    return operation(path);
  } finally {
    try {
      rmSync(directory, { recursive: true, force: true });
    } catch {
      // Cleanup must not mask whether the remote operation ran.
    }
  }
};

const quoteContent = (line) => {
  let content = line;
  let depth = 0;
  while (true) {
    const marker = /^ {0,3}>[ \t]?/.exec(content);
    if (!marker) return { content, depth };
    content = content.slice(marker[0].length);
    depth += 1;
  }
};

const fenceMarker = (line, allowListIndent = false) => {
  const match = (
    allowListIndent ? /^ *(`{3,}|~{3,})(.*)$/ : /^ {0,3}(`{3,}|~{3,})(.*)$/
  ).exec(line);
  if (!match || (match[1][0] === "`" && match[2].includes("`")))
    return undefined;
  return {
    allowListIndent,
    character: match[1][0],
    length: match[1].length,
  };
};

const closesFence = (line, fence) =>
  new RegExp(
    `^ ${fence.allowListIndent ? "*" : "{0,3}"}${fence.character}{${fence.length},}[ \\t]*$`,
  ).test(line);

const isStructuralLine = (line) =>
  /^ {0,3}#{1,6}(?:[ \t]+|$)/.test(line) ||
  /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/.test(line) ||
  /^ {0,3}(?:=+|-+)[ \t]*$/.test(line) ||
  /^ {0,3}\[[^\]]+\]:/.test(line) ||
  /^ {0,3}\[\^[^\]]+\]:/.test(line) ||
  /^ {0,3}<\/?[A-Za-z][A-Za-z0-9-]*(?:[ \t][^>]*)?\/?>[ \t]*$/.test(line);

const listItem = (line) =>
  /^ {0,}(?:(?:[-+*])|(?:\d{1,9}[.)]))[ \t]+(.*)$/.exec(line);

const explicitHardBreak = (line) => {
  if (/ {2,}$/.test(line)) return true;
  const backslashes = /\\+$/.exec(line)?.[0].length ?? 0;
  return backslashes % 2 === 1;
};

const tableCells = (line) => {
  const trimmed = line.trim();
  const cells = [];
  let cell = "";
  let separators = 0;
  for (let index = 0; index < trimmed.length; index += 1) {
    const character = trimmed[index];
    let backslashes = 0;
    for (let at = index - 1; at >= 0 && trimmed[at] === "\\"; at -= 1)
      backslashes += 1;
    if (character === "|" && backslashes % 2 === 0) {
      cells.push(cell.trim());
      cell = "";
      separators += 1;
    } else {
      cell += character;
    }
  }
  if (separators === 0) return undefined;
  cells.push(cell.trim());
  if (cells[0] === "") cells.shift();
  if (cells.at(-1) === "") cells.pop();
  return cells.length >= 2 ? cells : undefined;
};

const tableLines = (lines) => {
  const indexes = new Set();
  for (let index = 1; index < lines.length; index += 1) {
    const delimiter = tableCells(lines[index].content);
    const header = tableCells(lines[index - 1].content);
    if (
      !delimiter ||
      !header ||
      delimiter.length !== header.length ||
      lines[index].depth !== lines[index - 1].depth ||
      delimiter.some((cell) => !/^:?-{3,}:?$/.test(cell))
    )
      continue;
    indexes.add(index - 1);
    indexes.add(index);
    for (let row = index + 1; row < lines.length; row += 1) {
      if (
        lines[row].depth !== lines[index].depth ||
        !tableCells(lines[row].content)
      )
        break;
      indexes.add(row);
    }
  }
  return indexes;
};

export const githubBodyProfileFailures = (markdown) => {
  const failures = [];
  const lines = markdown.split("\n");
  const quotedLines = lines.map((rawLine) =>
    quoteContent(rawLine.replace(/\r$/, "")),
  );
  const tableLineIndexes = tableLines(quotedLines);
  let fence;
  let previousProse;

  lines.forEach((_, index) => {
    const lineNumber = index + 1;
    const quoted = quotedLines[index];

    if (fence) {
      if (
        quoted.depth === fence.quoteDepth &&
        closesFence(quoted.content, fence)
      )
        fence = undefined;
      previousProse = undefined;
      return;
    }

    const openingFence = fenceMarker(
      quoted.content,
      previousProse?.listItem === true,
    );
    if (openingFence) {
      fence = { ...openingFence, quoteDepth: quoted.depth };
      previousProse = undefined;
      return;
    }

    if (/^[ \t]*$/.test(quoted.content)) {
      previousProse = undefined;
      return;
    }

    if (tableLineIndexes.has(index)) {
      previousProse = undefined;
      return;
    }

    if (/^(?: {4}|\t)/.test(quoted.content) && !previousProse) {
      previousProse = undefined;
      return;
    }

    const item = listItem(quoted.content);
    if (item) {
      previousProse = item[1].trim()
        ? {
            hardBreak: explicitHardBreak(quoted.content),
            line: lineNumber,
            listItem: true,
            quoteDepth: quoted.depth,
          }
        : undefined;
      return;
    }

    if (isStructuralLine(quoted.content)) {
      previousProse = undefined;
      return;
    }

    if (
      previousProse &&
      (previousProse.quoteDepth === quoted.depth ||
        (previousProse.quoteDepth > 0 && quoted.depth === 0)) &&
      !previousProse.hardBreak
    ) {
      failures.push({
        line: lineNumber,
        previousLine: previousProse.line,
      });
    }

    previousProse = {
      hardBreak: explicitHardBreak(quoted.content),
      line: lineNumber,
      listItem: false,
      quoteDepth: quoted.depth,
    };
  });

  return failures;
};

// Contract text is data: one physical line, with Markdown, mentions and issue
// references neutralized so it renders literally.
const literal = (value) =>
  String(value)
    .replace(/\s+/gu, " ")
    .trim()
    .replace(/[&<>\\*#\[\]`|_~@]/gu, (c) => `&#${c.codePointAt(0)};`);
const commitId = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u;
const contractLines = (value, label) => {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || !item.trim())
  )
    throw new Error(`target pull request: ${label} must be nonempty strings`);
  return value;
};
const outcome = (test, label) => {
  if (Number.isSafeInteger(test?.exitCode)) return `exit ${test.exitCode}`;
  if (typeof test?.signal === "string" && test.signal)
    return `signal ${literal(test.signal)}`;
  throw new Error(`target pull request: ${label} test outcome is missing`);
};
const matrixStatuses = new Set(["verified", "failed", "stale", "incomplete"]);

/** A matrix speaks for a contract only when its criterion descriptions are
 * exactly the contract's acceptance criteria, the compiler's snapshot coverage
 * rule; a matching Git revision identifies bytes, not the criteria a verifier
 * was given (WO-064-D009). Returns each criterion's status in contract order,
 * or null when the two sets differ. */
export const acceptanceStatuses = (criteria, rows) => {
  if (rows.length !== criteria.length) return null;
  const unused = [...rows];
  const statuses = [];
  for (const criterion of criteria) {
    const index = unused.findIndex((row) => row.description === criterion);
    if (index < 0) return null;
    statuses.push(unused.splice(index, 1)[0].status);
  }
  return statuses;
};

const contractFields = [
  "workOrderId",
  "objective",
  "acceptanceCriteria",
  "constraints",
  "nonGoals",
  "requiredEvidence",
];
export const deliveryContractHash = (contract) =>
  createHash("sha256")
    .update(JSON.stringify(contractFields.map((key) => [key, contract?.[key]])))
    .digest("hex");
const diffDigest = (diff) =>
  createHash("sha256")
    .update(diff ?? "")
    .digest("hex");
const hasReference = (artifact) =>
  typeof artifact?.ref === "string" && artifact.ref.trim().length > 0;
const sameContract = (left, right) =>
  deliveryContractHash(left) === deliveryContractHash(right);

/** @typedef {{id: string, item: string, status: 'evidenced'|'absent'|'not-applicable', evidenceRefs: string[], reason: string|null}} DeliverableReadyRow */

/** Pure over host-read artifacts, never supplied readiness verdicts. Each input
 * is {ref, value}; refs are logical store aliases, Git objects or body anchors.
 * The host replays producer logs before supplying baseline/review/verification.
 * Preparation inventories ambiguity, selects actual check evidence and assigns
 * future PR monitoring; it cannot supply verification or review judgments. */
/** @returns {DeliverableReadyRow[]} */
export function deliverableReady(artifacts = {}) {
  const {
    contract,
    current,
    implementation,
    scope,
    baseline,
    verification,
    review,
    preparation,
    body,
  } = artifacts;
  const order = contract?.value;
  const head = implementation?.value?.revision;
  const base = implementation?.value?.baseCommit;
  const matrix = verification?.value;
  const subject = matrix?.subject;
  const witnessed = baseline?.value;
  const reviewed = review?.value;
  const prepared = preparation?.value;
  const contractPresent =
    hasReference(contract) &&
    typeof order?.objective === "string" &&
    order.objective.trim() &&
    Array.isArray(order.acceptanceCriteria) &&
    order.acceptanceCriteria.length > 0 &&
    order.acceptanceCriteria.every(
      (criterion) => typeof criterion === "string" && criterion.trim(),
    );
  const implementationPresent =
    hasReference(implementation) &&
    commitId.test(head ?? "") &&
    commitId.test(base ?? "") &&
    head !== base &&
    Array.isArray(implementation.value.files) &&
    implementation.value.files.length > 0;
  const matrixBound =
    contractPresent &&
    implementationPresent &&
    hasReference(verification) &&
    matrix.subjectRevision === head &&
    subject?.revision === head &&
    subject.baseCommit === base &&
    sameContract(subject.snapshot?.contract, order) &&
    diffDigest(subject.diff) === implementation.value.diffHash &&
    Array.isArray(matrix.rows) &&
    acceptanceStatuses(
      order.acceptanceCriteria,
      matrix.rows.map((row) => ({
        description: row.criterion?.description,
        status: row.status,
      })),
    ) !== null;
  const evidence = matrixBound ? (matrix.evidence ?? []) : [];
  const passed = (row) =>
    row.status === "verified" &&
    row.evaluations?.some(
      (evaluation) =>
        evaluation.verdict === "pass" &&
        !evaluation.stale &&
        evaluation.subjectRevision === head &&
        evaluation.provenance?.kind === "host-admitted-verifier" &&
        evaluation.evidenceRefs?.length > 0 &&
        evaluation.evidenceRefs.every((ref) =>
          evidence.some(
            (entry) =>
              entry.evidenceId === ref &&
              entry.subjectRevision === head &&
              entry.outcome === "pass",
          ),
        ),
    );
  const allAccepted =
    matrixBound &&
    ["complete", "reviewed"].includes(matrix.phase) &&
    matrix.rows.every(passed);
  const livePassed = (entry) =>
    entry?.subjectRevision === head &&
    entry.outcome === "pass" &&
    entry.source === "live";
  const reviewBound =
    allAccepted &&
    hasReference(review) &&
    reviewed.result?.subjectRevision === head &&
    reviewed.result.baselineRevision === base &&
    reviewed.subject?.revision === head &&
    reviewed.subject.baseCommit === base &&
    sameContract(reviewed.subject.snapshot?.contract, order) &&
    diffDigest(reviewed.subject.diff) === implementation.value.diffHash &&
    JSON.stringify(reviewed.subject.files) === JSON.stringify(subject.files);
  const reviewClear =
    reviewBound &&
    reviewed.result.counts?.blocking === 0 &&
    !reviewed.result.requiresHuman &&
    reviewed.result.findings?.every(
      (finding) => finding.severity !== "blocking",
    );
  const verifierEpisodes = allAccepted
    ? [
        ...new Set(
          matrix.rows.flatMap((row) =>
            row.evaluations
              .filter(
                (evaluation) =>
                  evaluation.verdict === "pass" &&
                  !evaluation.stale &&
                  evaluation.subjectRevision === head,
              )
              .map((evaluation) => evaluation.episodeId),
          ),
        ),
      ]
    : [];
  const implementerEpisodes = implementation?.value?.episodeIds ?? [];
  const independent =
    reviewClear &&
    verifierEpisodes.length > 0 &&
    implementerEpisodes.length > 0 &&
    implementerEpisodes.every(
      (id) =>
        matrix.implementerEpisodes?.includes(id) &&
        reviewed.result.implementerEpisodeIds?.includes(id),
    ) &&
    verifierEpisodes.every(
      (id) =>
        !implementerEpisodes.includes(id) &&
        reviewed.result.verifierEpisodeIds?.includes(id) &&
        id !== reviewed.result.reviewerEpisodeId,
    ) &&
    !implementerEpisodes.includes(reviewed.result.reviewerEpisodeId);
  const preparationBound =
    contractPresent &&
    implementationPresent &&
    hasReference(preparation) &&
    prepared.schemaVersion === 1 &&
    prepared.workOrderId === order.workOrderId &&
    prepared.subjectRevision === head &&
    prepared.contractHash === deliveryContractHash(order) &&
    prepared.diffHash === implementation.value.diffHash;
  const rows = [];
  const row = (id, item, valid, refs, reason) =>
    rows.push({
      id,
      item,
      status: valid ? "evidenced" : "absent",
      evidenceRefs: valid ? refs : [],
      reason: valid ? null : reason,
    });
  row(
    "source-revision",
    "Current source revision",
    implementationPresent &&
      hasReference(current) &&
      current.value.revision === head &&
      current.value.expectedRevision === head,
    [current?.ref],
    "Current source revision guard is missing or differs from the candidate.",
  );
  row(
    "contract",
    "Explicit contract",
    contractPresent,
    [contract?.ref],
    "Explicit contract is missing.",
  );
  row(
    "ambiguity",
    "No unresolved material ambiguity",
    preparationBound &&
      Array.isArray(prepared.unresolvedMaterialAmbiguities) &&
      prepared.unresolvedMaterialAmbiguities.length === 0,
    [`${preparation?.ref}#/unresolvedMaterialAmbiguities`],
    "Material ambiguity inventory is missing, stale or has unresolved items.",
  );
  row(
    "baseline",
    "Reproduced baseline",
    contractPresent &&
      implementationPresent &&
      hasReference(baseline) &&
      witnessed.capsule?.subject?.revision === base &&
      witnessed.capsule.subject.baseCommit === base &&
      sameContract(witnessed.capsule.subject.snapshot?.contract, order) &&
      Number.isFinite(baseline.occurredAt) &&
      Number.isFinite(implementation.value.startedAt) &&
      baseline.occurredAt < implementation.value.startedAt &&
      ["reproduced", "walked"].includes(witnessed.outcome) &&
      witnessed.limitation === null &&
      witnessed.evidenceIds?.length > 0,
    [baseline?.ref],
    "BaselineWitnessed is missing, unrelated or did not reproduce/walk the baseline.",
  );
  row(
    "repo-native",
    "Repo-native implementation",
    independent &&
      typeof reviewed.result.conventionsPath === "string" &&
      reviewed.subject.files.some(
        (file) => file.path === reviewed.result.conventionsPath,
      ),
    [review?.ref],
    "ReviewCompleted against declared repository conventions is missing or has blocking findings.",
  );
  row(
    "scope",
    "No unexplained scope",
    independent &&
      hasReference(scope) &&
      Array.isArray(scope.value.surfaces) &&
      implementation.value.files.every((file) =>
        scope.value.surfaces.some(
          (surface) =>
            file.path === surface || file.path.startsWith(`${surface}/`),
        ),
      ),
    [scope?.ref, review?.ref],
    "Changed paths lack declared scope or a clear ReviewCompleted.",
  );
  const checks = prepared?.checks;
  row(
    "checks",
    "Tests/build/lint",
    preparationBound &&
      allAccepted &&
      ["tests", "build", "lint"].every(
        (kind) =>
          Array.isArray(checks?.[kind]) &&
          checks[kind].length > 0 &&
          checks[kind].every((id) =>
            evidence.some(
              (entry) =>
                entry.evidenceId === id &&
                livePassed(entry) &&
                entry.hostTest?.origin === "host" &&
                entry.hostTest.exitCode === 0,
            ),
          ),
      ),
    [`${preparation?.ref}#/checks`, verification?.ref],
    "Passing host-run tests/build/lint evidence is missing or stale.",
  );
  row(
    "live-behavior",
    "Live behavior walked",
    allAccepted &&
      matrix.rows.every((entry) =>
        entry.criterion.requiredChecks.every((check) =>
          evidence.some(
            (witness) =>
              witness.criterionId === entry.criterion.criterionId &&
              witness.checkId === check &&
              livePassed(witness),
          ),
        ),
      ),
    [verification?.ref],
    "Passing live behavior witnesses are missing or stale.",
  );
  const visual = matrixBound
    ? matrix.rows.filter((entry) => entry.criterion.claimType === "visual")
    : null;
  if (visual?.length === 0)
    rows.push({
      id: "visual",
      item: "Visual claims visually inspected",
      status: "not-applicable",
      evidenceRefs: [verification.ref],
      reason: "The declared criteria contain no visual claims.",
    });
  else
    row(
      "visual",
      "Visual claims visually inspected",
      allAccepted &&
        visual?.every(
          (entry) =>
            passed(entry) &&
            entry.evaluations.some(
              (evaluation) =>
                evaluation.verdict === "pass" &&
                !evaluation.stale &&
                evaluation.subjectRevision === head &&
                evaluation.evidenceRefs.some((id) =>
                  evidence.some(
                    (witness) =>
                      witness.evidenceId === id &&
                      witness.criterionId === entry.criterion.criterionId &&
                      livePassed(witness) &&
                      witness.witness?.kind === "screenshot",
                  ),
                ),
            ),
        ),
      [verification?.ref],
      "Declared visual claim types or passing screenshot inspection evidence are missing.",
    );
  row(
    "acceptance",
    "Every acceptance criterion evidenced",
    allAccepted,
    [verification?.ref],
    "A current, contract-matched passing acceptance matrix is missing.",
  );
  row(
    "independent",
    "Independent verification and review",
    independent,
    [verification?.ref, review?.ref],
    "Independent verification and ReviewCompleted for this candidate are missing or blocked.",
  );
  row(
    "final-diff",
    "Final diff read",
    independent,
    [review?.ref],
    "ReviewCompleted over the final sealed diff is missing or blocked.",
  );
  row(
    "grounded-body",
    "Grounded body",
    contractPresent &&
      implementationPresent &&
      hasReference(body) &&
      sameContract(body.value.workOrder, order) &&
      body.value.diff?.headCommit === head &&
      body.value.diff.baseCommit === base &&
      JSON.stringify(body.value.diff.files) ===
        JSON.stringify(implementation.value.files) &&
      body.value.tests?.before &&
      body.value.tests?.after,
    [body?.ref, contract?.ref, implementation?.ref],
    "Generated body inputs are missing or differ from the candidate artifacts.",
  );
  const monitoring = prepared?.monitoring;
  row(
    "monitoring",
    "Monitored loop",
    preparationBound &&
      typeof monitoring?.owner === "string" &&
      monitoring.owner.trim().length > 0 &&
      monitoring.repositoryId === implementation.value.repositoryId &&
      monitoring.headRevision === head &&
      monitoring.command === "worktree resolve-pr" &&
      monitoring.ciFailure === "classify-before-repair" &&
      monitoring.reviewComments === "triage-by-type" &&
      monitoring.sourceDrift === "stop" &&
      monitoring.terminalState === "human-controlled",
    [`${preparation?.ref}#/monitoring`],
    "Post-publication monitoring owner and stop policies are missing or stale.",
  );
  return rows;
}

/** Pure over artifacts: the host commit message, the WorkOrder contract, the
 * host's test observations, the Git diff summary and, when supplied, the
 * acceptance matrix for the published head and this contract's criteria.
 * There is no free-text input. */
export const generateTargetPullRequest = ({
  commitMessage,
  workOrder,
  tests,
  diff,
  matrix = null,
  readinessArtifacts = {},
}) => {
  const title =
    typeof commitMessage === "string"
      ? commitMessage.split("\n")[0].trim()
      : "";
  if (!title) throw new Error("target pull request: commit subject is empty");
  if (typeof workOrder?.objective !== "string" || !workOrder.objective.trim())
    throw new Error("target pull request: objective is empty");
  const criteria = contractLines(
    workOrder.acceptanceCriteria,
    "acceptance criteria",
  );
  const nonGoals = contractLines(workOrder.nonGoals, "non-goals");
  if (
    !commitId.test(diff?.baseCommit ?? "") ||
    !commitId.test(diff?.headCommit ?? "") ||
    !Array.isArray(diff.files) ||
    !diff.files.length ||
    diff.files.some(
      (file) =>
        typeof file?.path !== "string" ||
        !file.path ||
        [file.added, file.deleted].some(
          (count) => count !== null && !Number.isSafeInteger(count),
        ),
    )
  )
    throw new Error("target pull request: invalid diff summary");
  let rows;
  let verification;
  if (matrix === null) {
    rows = criteria.map((criterion) => [
      criterion,
      "not independently verified",
    ]);
    verification =
      "Independent verification: no acceptance matrix was supplied for this head.";
  } else {
    if (
      matrix.subjectRevision !== diff.headCommit ||
      !Array.isArray(matrix.rows) ||
      !matrix.rows.length ||
      matrix.rows.some(
        (row) =>
          typeof row?.description !== "string" ||
          !row.description.trim() ||
          !matrixStatuses.has(row.status),
      )
    )
      throw new Error(
        "target pull request: the acceptance matrix must describe the published head",
      );
    const statuses = acceptanceStatuses(criteria, matrix.rows);
    if (statuses === null)
      throw new Error(
        "target pull request: the acceptance matrix criteria must be the WorkOrder's acceptance criteria",
      );
    rows = criteria.map((criterion, index) => [criterion, statuses[index]]);
    const count = (status) =>
      matrix.rows.filter((row) => row.status === status).length;
    verification = `Independent verification: acceptance matrix for ${diff.headCommit}: ${[...matrixStatuses].map((status) => `${count(status)} ${status}`).join(", ")}.`;
  }
  const count = (value) => (value === null ? "binary" : String(value));
  const readiness = deliverableReady({
    ...readinessArtifacts,
    contract: readinessArtifacts.contract ?? {
      ref: "#contract",
      value: workOrder,
    },
    implementation: readinessArtifacts.implementation ?? {
      ref: "#change",
      value: {
        revision: diff.headCommit,
        baseCommit: diff.baseCommit,
        files: diff.files,
      },
    },
    body: { ref: "#acceptance", value: { workOrder, tests, diff, matrix } },
  });
  const missing = readiness.filter((row) => row.status === "absent");
  const knownItems =
    readiness.find((row) => row.id === "independent").status === "evidenced"
      ? (readinessArtifacts.review?.value?.result?.findings ?? []).filter(
          (finding) => ["should", "nit"].includes(finding.severity),
        )
      : [];
  const body = [
    "## Contract",
    "",
    `**Objective:** ${literal(workOrder.objective)}`,
    "",
    `**Non-goals:** ${nonGoals.length ? nonGoals.map(literal).join("; ") : "none declared"}`,
    "",
    "## Acceptance",
    "",
    "| Criterion | Status |",
    "| --- | --- |",
    ...rows.map(
      ([criterion, status]) => `| ${literal(criterion)} | ${status} |`,
    ),
    "",
    verification,
    "",
    `Focused test observed by the host: ${outcome(tests?.before, "before")} before the change, ${outcome(tests?.after, "after")} after it.`,
    "",
    "## Change",
    "",
    "| Path | Added | Removed |",
    "| --- | ---: | ---: |",
    ...diff.files.map(
      (file) =>
        `| ${literal(file.path)} | ${count(file.added)} | ${count(file.deleted)} |`,
    ),
    "",
    `${diff.files.length} ${diff.files.length === 1 ? "file" : "files"} changed from base ${diff.baseCommit} to head ${diff.headCommit}.`,
    "",
    "## Deliverable-ready",
    "",
    `Deliverable-ready: ${missing.length ? `not ready; ${missing.length} ${missing.length === 1 ? "item" : "items"} absent` : "ready; every applicable item is evidenced"}.`,
    "",
    "| Item | Status | Evidence or reason |",
    "| --- | --- | --- |",
    ...readiness.map(
      (row) =>
        `| ${row.item} | ${row.status} | ${literal(row.evidenceRefs.length ? `${row.evidenceRefs.join("; ")}${row.reason ? `; ${row.reason}` : ""}` : row.reason)} |`,
    ),
    "",
    ...(knownItems.length
      ? [
          "Known review items (recorded without expanding scope):",
          "",
          "| Severity | Observation | Expected | Evidence |",
          "| --- | --- | --- | --- |",
          ...knownItems.map(
            (finding) =>
              `| ${finding.severity} | ${literal(finding.observed)} | ${literal(finding.expected)} | ${literal(finding.evidenceRefs.join("; "))} |`,
          ),
          "",
        ]
      : []),
  ].join("\n");
  return { title, body };
};

export const assertGitHubBodyProfile = (markdown, displayPath) => {
  const failures = githubBodyProfileFailures(markdown);
  if (failures.length === 0) return;
  const first = failures[0];
  throw new Error(
    `${displayPath}: accidental GitHub prose soft wrap between lines ${first.previousLine} and ${first.line}; keep each prose paragraph or list-item paragraph on one physical line and use blank lines or explicit Markdown hard breaks only for intentional rendered breaks`,
  );
};
