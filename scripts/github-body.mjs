import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
