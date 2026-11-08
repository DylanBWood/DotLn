import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { dispatchJournalDirectory } from "../../packages/skeleton/src/dispatch-journal.mjs";
import { journalLane } from "./worktree-removal.mjs";
import { docPath, docRelative } from "./config.mjs";
import { renderRedTagBlock } from "./document-kinds.mjs";
import { mainWorktree, runGit } from "./git.mjs";

/** The branch `plan start` creates: planning/<date>-<slug>. */
export const PLANNING_BRANCH =
  /^planning\/(\d{4}-\d{2}-\d{2})-([a-z][a-z0-9-]*)$/;

/** A pass document is a record of one planning pass: it lives in the
 * planning root's passes directory, named by the branch's slug and date. */
export function planningDocumentPath(
  root,
  branch = runGit(root, ["branch", "--show-current"]),
) {
  const match = PLANNING_BRANCH.exec(branch.trim());
  return match
    ? docRelative(root, "planning", "passes", `${match[2]}-${match[1]}.md`)
    : null;
}

export const RULES_RECORDED_START = "<!-- dotln-rules-recorded:start -->";
export const RULES_RECORDED_END = "<!-- dotln-rules-recorded:end -->";

/** The block a pass names every standing rule in that it writes into a
 * standing document from the operator's words: one JSON array of
 * `{rule, document, section, message: {sessionKey, recordedAt},
 * captureDigest}`, where the message is the journal's row for the operator's
 * message. The operator reads every new rule in one place and strikes one by
 * removing its entry. */
export const renderRulesRecordedBlock = (rules = []) =>
  `${RULES_RECORDED_START}\n\n\`\`\`json\n${JSON.stringify(rules, null, 2)}\n\`\`\`\n\n${RULES_RECORDED_END}\n`;

/** The skeleton `plan start` writes. Its red-tag block names the pass it
 * follows and carries every open tag and this pass's new ones; the pass
 * fills each disposition: removed, or folded into a named standing document,
 * with why. Its rules block starts empty. */
export function planningSkeleton(
  slug,
  date,
  { redTags = { after: null, tags: [] } } = {},
) {
  return (
    `# ${slug.replaceAll("-", " ")} — ${date}\n\n` +
    [
      "Dispatch and capture",
      "Readings",
      "Orders filed and amended",
      "Register",
      "Red tags",
      "NoOps",
      "Sequence",
      "Write-backs",
      "Rules recorded",
      "Process cost",
      "Validation",
    ]
      .map(
        (heading) =>
          `## ${heading}\n\n${heading === "Red tags" ? `${renderRedTagBlock(redTags)}\n` : heading === "Rules recorded" ? `${renderRulesRecordedBlock()}\n` : ""}`,
      )
      .join("")
  );
}

const text = (value) => typeof value === "string" && value.trim().length > 0;

/** The rules a pass document's block records, or null when it has no block.
 * A malformed block refuses with the document's path. */
export function rulesRecordedBlock(source, file) {
  const starts = source.split(RULES_RECORDED_START).length - 1,
    ends = source.split(RULES_RECORDED_END).length - 1;
  if (!starts && !ends) return null;
  if (
    starts !== 1 ||
    ends !== 1 ||
    source.indexOf(RULES_RECORDED_END) < source.indexOf(RULES_RECORDED_START)
  )
    throw new Error(
      `${file}: the rules-recorded block needs one ordered marker pair`,
    );
  const inner = source
    .slice(
      source.indexOf(RULES_RECORDED_START) + RULES_RECORDED_START.length,
      source.indexOf(RULES_RECORDED_END),
    )
    .replace(/^\s*```json\s*\n/u, "")
    .replace(/\n```\s*$/u, "")
    .trim();
  let rules;
  try {
    rules = JSON.parse(inner);
  } catch {
    throw new Error(`${file}: the rules-recorded block holds invalid JSON`);
  }
  if (
    !Array.isArray(rules) ||
    rules.some(
      (entry) =>
        !entry ||
        typeof entry !== "object" ||
        !text(entry.rule) ||
        !text(entry.document) ||
        !text(entry.section) ||
        !entry.message ||
        typeof entry.message !== "object" ||
        !/^[0-9a-f]{64}$/u.test(entry.message.sessionKey ?? "") ||
        !Number.isFinite(Date.parse(entry.message.recordedAt ?? "")) ||
        !/^(?:sha256:)?[0-9a-f]{64}$/u.test(entry.captureDigest ?? "") ||
        (entry.class !== undefined && !text(entry.class)) ||
        (entry.order !== undefined && !/^WO-\d{3}$/u.test(entry.order)),
    )
  )
    throw new Error(
      `${file}: each recorded rule needs a rule, the document and section it is written into, the message's journal reference {sessionKey, recordedAt} and its capture digest; an optional order names the closed order whose retained lane holds the journal`,
    );
  return rules;
}

/** One journal file's rows; a line that is not JSON is skipped. */
const journalFileRows = (file) => {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
};

/** Where a session's journal can be: the live directory, then the retained
 * lane of every closed order (a close moves the order's journals there), in
 * this checkout and in the main checkout when that is another one. An entry
 * that names an `order` reads that order's lane alone after the live
 * directory. Each place is reported by its display path. */
const journalPlaces = (root, sessionKey, order) => {
  const name = `${sessionKey}.jsonl`;
  const places = [
    {
      display: docRelative(root, "control", "local/harness"),
      file: join(dispatchJournalDirectory(root), name),
    },
  ];
  const bases = [root];
  try {
    const main = mainWorktree(root);
    if (main !== root) bases.push(main);
  } catch {
    // A checkout with no main worktree reads its own lanes alone.
  }
  for (const base of bases) {
    const retained = docPath(base, "control", "local/retained");
    if (!existsSync(retained)) continue;
    for (const lane of readdirSync(retained).sort())
      if (/^WO-\d{3}$/u.test(lane) && (!order || lane === order))
        places.push({
          // The lane the close writes the journals to, by its own helper.
          display: journalLane(base, lane),
          file: join(base, journalLane(base, lane), name),
          order: lane,
        });
  }
  return places;
};

/**
 * A standing rule is written once and in the open: each one the current
 * pass's block names must reference the operator message it came from, and
 * this check reads that message's class from the session journal itself. A
 * missing row, a host's notification, a worker's hand-back, a question, a
 * label that differs from the journal's class and a capture digest that is
 * not the message's all refuse, so the planner's label decides nothing.
 */
export function checkRulesRecorded(
  root,
  document = planningDocumentPath(root),
) {
  if (!document || !existsSync(join(root, document)))
    return { document: null, rules: 0 };
  const rules =
    rulesRecordedBlock(readFileSync(join(root, document), "utf8"), document) ??
    [];
  for (const entry of rules) {
    const { sessionKey, recordedAt } = entry.message;
    const named = `${document}: the rule "${entry.rule.replace(/\s+/gu, " ").slice(0, 160)}"`;
    const at = `session ${sessionKey.slice(0, 12)} at ${recordedAt}`;
    // The row is wherever the kit moved the journal: the live directory or a
    // closed order's retained lane.
    const places = journalPlaces(root, sessionKey, entry.order);
    const row = places
      .flatMap((place) => journalFileRows(place.file))
      .find(
        (candidate) =>
          candidate.typedEvent === "OperatorMessageObserved" &&
          candidate.recordedAt === recordedAt,
      );
    if (!row)
      throw new Error(
        `${named} names no operator message in the session journal (${at}); read ${places.map((place) => place.display).join(", ")}${entry.order && !places.some((place) => place.order === entry.order) ? ` (the entry names ${entry.order}'s lane, which is not retained here)` : ""}; a standing rule is recorded only from an operator message a journal holds`,
      );
    if (
      row.source === "host-task-notification" ||
      row.attribution === "host-task-notification"
    )
      throw new Error(
        `${named} names the host's task notification (${at}), not the operator's words`,
      );
    // A background worker's report, which the host hands back as a prompt,
    // is journaled under its own source and is never the operator's.
    if (row.source === "host-agent-handback" || row.attribution === "host")
      throw new Error(
        `${named} names a background worker's hand-back (${at}; source host-agent-handback), not the operator's words`,
      );
    if (row.class === "question")
      throw new Error(
        `${named} is recorded from an operator question (${at}); a question is answered and records no rule, whatever class the block labels it`,
      );
    if (entry.class !== undefined && entry.class !== row.class)
      throw new Error(
        `${named} is labelled ${entry.class}, but the journal classes its message ${row.class ?? "unclassified"} (${at})`,
      );
    if (entry.captureDigest.replace(/^sha256:/u, "") !== row.digest)
      throw new Error(
        `${named}: its capture digest is not the digest of the message the journal names (${at})`,
      );
  }
  return { document, rules: rules.length };
}
