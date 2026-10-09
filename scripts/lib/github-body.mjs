import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";

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

// Links in a stored body are file-relative, the form the document gate
// resolves; on the forge they resolve nowhere. A link is relative when its
// destination carries no scheme and is not protocol-relative; an empty
// destination is relative too, since the forge resolves it to the page itself.
const schemeless = (destination) =>
  !/^[a-z][a-z0-9+.-]*:/iu.test(destination) && !destination.startsWith("//");
const definitionPattern = /^( {0,3}\[[^\]]+\]:[ \t]*)(<[^>]*>|\S+)(.*)$/u;
// A backslash escapes the character after it; an even run of backslashes
// escapes nothing.
const escaped = (text, index) => {
  let backslashes = 0;
  while (index - backslashes > 0 && text[index - backslashes - 1] === "\\")
    backslashes += 1;
  return backslashes % 2 === 1;
};
// The index of the bracket that closes the one before `from`, with nested
// pairs balanced, or -1.
const closingBracket = (text, from, open, close) => {
  let depth = 0;
  for (let index = from; index < text.length; index += 1) {
    if (text[index] === "\\") index += 1;
    else if (text[index] === open) depth += 1;
    else if (text[index] === close) {
      if (depth === 0) return index;
      depth -= 1;
    }
  }
  return -1;
};
// A bare destination runs to the first whitespace or to the parenthesis that
// closes the link; parentheses inside it count only in balanced pairs.
const bareDestinationEnd = (text, from) => {
  let depth = 0;
  for (let index = from; index < text.length; index += 1) {
    const character = text[index];
    if (character === "\\") index += 1;
    else if (/[\s\p{Cc}]/u.test(character)) return index;
    else if (character === "(") depth += 1;
    else if (character === ")") {
      if (depth === 0) return index;
      depth -= 1;
    }
  }
  return -1;
};
const unescapedIndex = (text, from, character) => {
  for (let index = from; index < text.length; index += 1) {
    if (text[index] === "\\") index += 1;
    else if (text[index] === character) return index;
  }
  return -1;
};
const afterSpaces = (text, from) => {
  while (text[from] === " " || text[from] === "\t") from += 1;
  return from;
};
/** Each inline link on one line, with the destination the parser renders for
 * it. The scanner finds the link's extent as CommonMark reads it: an optional
 * `!`, a label whose brackets balance, `(`, optional spaces, a destination in
 * angle brackets or bare with balanced parentheses, an optional title in
 * double quotes, single quotes or parentheses, optional spaces and `)`.
 * Brackets in code and raw HTML are hidden by the caller's masking; the label
 * and title are sliced from the unmasked line. The parser decides whether the
 * sequence renders as a link and what its destination is once backslash
 * escapes and character references are resolved: a sequence the parser does
 * not render as a link at its column, such as the outer brackets around a
 * nested link, keeps its bytes while the scan goes on inside it. A link split
 * across lines is not an inline link here and is left for the parser-backed
 * refusal. */
function* inlineLinks(masked, line, rendered) {
  for (
    let at = masked.indexOf("[");
    at >= 0;
    at = masked.indexOf("[", at + 1)
  ) {
    if (escaped(masked, at)) continue;
    const image = at > 0 && masked[at - 1] === "!" && !escaped(masked, at - 1);
    const start = image ? at - 1 : at;
    const node = rendered.get(start + 1);
    if (!node) continue;
    const labelEnd = closingBracket(masked, at + 1, "[", "]");
    if (labelEnd < 0 || masked[labelEnd + 1] !== "(") continue;
    let cursor = afterSpaces(masked, labelEnd + 2);
    if (masked[cursor] === "<") {
      const end = unescapedIndex(masked, cursor + 1, ">");
      if (end < 0) continue;
      cursor = end + 1;
    } else {
      const end = bareDestinationEnd(masked, cursor);
      if (end < 0) continue;
      cursor = end;
    }
    const titleStart = cursor;
    cursor = afterSpaces(masked, cursor);
    let title = "";
    const closer = { '"': '"', "'": "'", "(": ")" }[masked[cursor]];
    if (cursor > titleStart && closer) {
      const end = unescapedIndex(masked, cursor + 1, closer);
      if (end < 0) continue;
      title = line.slice(titleStart, end + 1);
      cursor = afterSpaces(masked, end + 1);
    }
    if (masked[cursor] !== ")") continue;
    yield {
      index: start,
      length: cursor + 1 - start,
      image: image ? "!" : "",
      text: line.slice(at + 1, labelEnd),
      destination: node.url ?? "",
      title,
    };
    at = cursor;
  }
}
/** The installed Markdown parser is the oracle for what renders as a link and
 * for what is code or raw HTML rather than prose: nested brackets in a label,
 * balanced parentheses in a destination, a label or destination split across
 * lines, images and definitions all count as links, while code spans, code
 * blocks and raw HTML hide theirs. It is loaded on first use because most
 * callers of this module never check or rewrite links. */
let markdownParser;
const parsedNodes = (markdown, types) => {
  markdownParser ??= createRequire(import.meta.url)("prettier/plugins/markdown")
    .parsers.markdown;
  const found = [];
  const visit = (node) => {
    if (types.includes(node.type)) found.push(node);
    for (const child of node.children ?? []) visit(child);
  };
  visit(markdownParser.parse(markdown));
  return found;
};
const renderedLinks = (markdown) =>
  parsedNodes(markdown, ["link", "image", "definition"]).map((node) => ({
    line: node.position.start.line,
    href: node.url ?? "",
  }));
// A line ends at a newline, at a carriage return and newline, or at a lone
// carriage return, the three line endings Markdown recognizes, and the parser
// counts lines the same way; its columns count UTF-16 code units from the
// start of such a line, as string indexes do, and a leading byte-order mark is
// outside its count. Each line keeps the ending that followed it, so a body
// is reassembled byte-for-byte.
const sourceLines = (markdown) => {
  const bom = markdown.startsWith("﻿") ? "﻿" : "";
  const parts = markdown.slice(bom.length).split(/(\r\n|\r|\n)/u);
  const lines = [];
  for (let index = 0; index < parts.length; index += 2)
    lines.push({ text: parts[index], ending: parts[index + 1] ?? "" });
  return { bom, lines };
};
// Visit each line with its text, the same text with every range the parser
// renders as code or raw HTML replaced by spaces, and the links and the
// definition the parser renders starting on it, so a link-shaped sequence
// inside a code span (whatever its backtick runs, and across lines), a fenced
// or indented code block or a raw HTML tag or block is never read as a link
// and keeps its bytes, and a link is rewritten only where the parser renders
// one. The parser's line and column address the same lines as the inventory,
// whichever line ending each line uses.
const proseLines = (markdown, visit) => {
  const { bom, lines } = sourceLines(markdown);
  const masked = lines.map((line) => line.text);
  const rendered = lines.map(() => ({ links: new Map(), definition: null }));
  for (const node of parsedNodes(markdown.slice(bom.length), [
    "inlineCode",
    "code",
    "html",
    "link",
    "image",
    "definition",
  ])) {
    const { start, end } = node.position;
    if (node.type === "link" || node.type === "image")
      rendered[start.line - 1].links.set(start.column, node);
    else if (node.type === "definition")
      rendered[start.line - 1].definition = node;
    else
      for (let line = start.line; line <= end.line; line += 1) {
        const text = masked[line - 1];
        const from = line === start.line ? start.column - 1 : 0;
        const to = line === end.line ? end.column - 1 : text.length;
        masked[line - 1] =
          text.slice(0, from) + " ".repeat(to - from) + text.slice(to);
      }
  }
  return (
    bom +
    lines
      .map(
        (line, index) =>
          (visit(line.text, masked[index], rendered[index]) ?? line.text) +
          line.ending,
      )
      .join("")
  );
};
/** Every link the parser renders with a relative destination, in document
 * order, each with the line it starts on. */
export const relativeLinkFailures = (markdown) =>
  renderedLinks(markdown)
    .filter((link) => schemeless(link.href))
    .map((link) => ({ ...link, kind: "relative-link" }));
/** Rewrite each link the parser renders with a relative destination in a
 * stored body to the repository at the reviewed revision, from the body's own
 * repository path; a destination that escapes the repository, a bare fragment,
 * an empty destination, or a body with no GitHub target becomes the link's
 * text. Images keep rendering through the raw form. The destination is the one
 * the parser renders, its backslash escapes and character references resolved,
 * and the rewritten path encodes parentheses too, so the destination reads the
 * same to a renderer that balances them and to one that does not. A rendered
 * relative link this line scanner cannot see is left as it is for the profile
 * check to refuse. */
export const absoluteBodyLinks = (markdown, { from, repository, revision }) => {
  const base = from.includes("/") ? from.slice(0, from.lastIndexOf("/")) : "";
  const resolved = (destination, image) => {
    if (!repository?.selector || !revision) return null;
    const at = destination.indexOf("#");
    const path = at >= 0 ? destination.slice(0, at) : destination;
    const fragment = at >= 0 ? destination.slice(at) : "";
    if (!path || path.startsWith("/")) return null;
    const parts = [];
    for (const part of `${base}/${path}`.split("/")) {
      if (part === "" || part === ".") continue;
      if (part === "..") {
        if (!parts.length) return null;
        parts.pop();
      } else parts.push(part);
    }
    const encoded = encodeURI(parts.join("/")).replace(
      /[()]/gu,
      (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
    );
    return `https://${repository.selector}/blob/${revision}/${encoded}${image ? "?raw=true" : ""}${fragment}`;
  };
  return proseLines(markdown, (line, masked, rendered) => {
    const definition = rendered.definition && definitionPattern.exec(masked);
    if (definition) {
      const destination = rendered.definition.url ?? "";
      if (!schemeless(destination)) return line;
      const target = resolved(destination, false);
      return target === null ? "" : `${definition[1]}${target}${definition[3]}`;
    }
    let output = "";
    let cursor = 0;
    for (const link of inlineLinks(masked, line, rendered.links)) {
      output += line.slice(cursor, link.index);
      const { image, text, destination, title } = link;
      const original = line.slice(link.index, link.index + link.length);
      if (!schemeless(destination)) output += original;
      else {
        const target = resolved(destination, image === "!");
        output +=
          target === null ? text : `${image}[${text}](${target}${title})`;
      }
      cursor = link.index + link.length;
    }
    return output + line.slice(cursor);
  });
};
export const githubBodyProfileFailures = (markdown, { links = false } = {}) => {
  const failures = [];
  const { lines } = sourceLines(markdown);
  const quotedLines = lines.map((line) => quoteContent(line.text));
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

  if (links) failures.push(...relativeLinkFailures(markdown));
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
  const notApplicableChecks = ["build", "lint"].filter(
    (kind) =>
      checks?.[kind]?.status === "not-applicable" &&
      typeof checks[kind].reason === "string" &&
      checks[kind].reason.trim(),
  );
  row(
    "checks",
    "Tests/build/lint",
    preparationBound &&
      allAccepted &&
      ["tests", "build", "lint"].every(
        (kind) =>
          notApplicableChecks.includes(kind) ||
          (Array.isArray(checks?.[kind]) &&
            checks[kind].length > 0 &&
            checks[kind].every((id) =>
              evidence.some(
                (entry) =>
                  entry.evidenceId === id &&
                  livePassed(entry) &&
                  entry.hostTest?.origin === "host" &&
                  entry.hostTest.exitCode === 0,
              ),
            )),
      ),
    [`${preparation?.ref}#/checks`, verification?.ref],
    "Passing host-run tests/build/lint evidence is missing or stale.",
  );
  if (rows.at(-1).status === "evidenced" && notApplicableChecks.length)
    rows.at(-1).reason = notApplicableChecks
      .map((kind) => `${kind} not-applicable: ${checks[kind].reason.trim()}`)
      .join("; ");
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

export const assertGitHubBodyProfile = (markdown, displayPath, options) => {
  const failures = githubBodyProfileFailures(markdown, options);
  if (failures.length === 0) return;
  const first = failures[0];
  if (first.kind === "relative-link")
    throw new Error(
      `${displayPath}:${first.line}: relative link ${first.href || "with an empty destination"}; a published body links absolute to the repository at the reviewed revision or writes plain text`,
    );
  throw new Error(
    `${displayPath}: accidental GitHub prose soft wrap between lines ${first.previousLine} and ${first.line}; keep each prose paragraph or list-item paragraph on one physical line and use blank lines or explicit Markdown hard breaks only for intentional rendered breaks`,
  );
};
