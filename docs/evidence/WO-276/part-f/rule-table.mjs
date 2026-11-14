// Part F, step F3: the rule-by-role table. Reads the shared rule records
// from the built loadout and the reason for every cell from this file, and
// writes rule-table.md. It fails where a record and a reason disagree (a
// role a record names with a reason that leaves it out, or the reverse),
// where a cell has no reason, or where a reason names a rule or a role no
// record holds, so the table is the records' and cannot drift from them.
//
//   node docs/evidence/WO-276/part-f/rule-table.mjs [--check]
//
// A reason opens with `kept:`, `left out:` or `absent at the base:`. An
// order that adds or edits a rule record edits its row here and runs this.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const { sharedRules, SHARED_RULE_ROLES } = await import(
  pathToFileURL(
    join(root, "packages/skeleton/dist/src/loadouts/contributor.js"),
  ).href
);

const all = (reason) =>
  Object.fromEntries(SHARED_RULE_ROLES.map((role) => [role, reason]));
const ELECTED =
  "kept: an instance that elects `features.desktop-control` gives this role's session the desktop and the operator's own browser at the operator's request, and a rule a role can be configured to reach stays (WO-251 put the sentence in every root for that)";

/** The reason for every cell: rule, then role. */
const REASONS = {
  "operator-controls": {
    ...all(
      "kept: `analysis:` and `operator override:` can be typed in this role's session at any step, and under Codex the role runs `node scripts/operator-control.mjs` itself",
    ),
    "release-close":
      "absent at the base: the release close's compact root never held it (WO-179-D013), and the instruction file's floor, which every session loads, admits both controls; this part adds no rule to a role",
  },
  "browser-verification": {
    executor:
      "kept: verifies the application it changed before its completion, in a browser where a criterion names a page",
    verifier:
      "kept: its probes of a criterion that names a page run in a browser",
    reviewer:
      "kept: reproduces a blocking claim of the verification sequence, which may be an observation in a browser",
    "release-close": ELECTED,
    planner: ELECTED,
    refuter: ELECTED,
  },
  "session-commands": all(
    "kept: `scope expand:` and `conversation only:` can be typed in this role's session at any step",
  ),
  "quality-pass": all(
    "kept: `quality pass:` can be typed in this role's session at any step; Claude's hook delivers the same text at the prefix and Codex has no hook",
  ),
  "artifact-shape": {
    executor:
      "kept: its handoff, its decisions and the write-backs of its order",
    verifier: "kept: the verification report it files",
    reviewer:
      "kept: the final report, the pull request text and the release notes it prepares",
    "release-close": "kept: the record of a close and of a blocker it reports",
    planner: "kept: the pass document and the orders a pass files",
    refuter:
      "kept: its report of scope, elapsed time and result, and the dispositions it records",
  },
  "document-kinds": {
    executor: "kept: its write-backs change standing documents and add records",
    verifier:
      "kept: its report is a record, and it judges the candidate's document changes",
    reviewer:
      "kept: the rule names it: the final reviewer judges each changed standing document's diff",
    "release-close":
      "kept: a `quality pass:` reaches document edits in any session, and the starter refresh the close runs regenerates generated pages",
    planner:
      "kept: the rule names it: a pass writes a pass document and removes or folds a red-tagged standing document",
    refuter:
      "kept: the receipt it files is a record, never rewritten, and a `quality pass:` reaches document edits in any session",
  },
  "expected-data": {
    executor:
      "kept: updates expected data with its change and runs the consistency review the rule describes",
    verifier:
      "kept: judges the candidate's expected-data updates against the cause its decisions record",
    reviewer:
      "kept: a fix at final review can update expected data, and it reads the consistency review's trace",
    "release-close":
      "left out: it holds a closed order, whose decisions take no entry, updates no expected data and runs no review",
    planner:
      "kept: a pass changes control records under the document roots that checks hold the documents to (for one, `docs/control/documents.json`), and names the cause in its pass document",
    refuter:
      "left out: the parent writes nothing but the receipt, through the helper, and runs no review of a change",
  },
  durations: all(
    "kept: reports elapsed time to the operator in its report and its response",
  ),
  "dispatch-bounds": {
    executor:
      "kept: its phase's bounds in `docs/control/budgets.json` stop a complete gate, a probe or a worker past them",
    verifier:
      "kept: its phase's bounds in `docs/control/budgets.json` stop a gate, a probe or a worker past them",
    reviewer:
      "kept: its phase's bounds in `docs/control/budgets.json` stop a complete gate, a probe or a worker past them",
    "release-close":
      "kept: its dispatch can be given a bound in `docs/control/budgets.json` (unset here; an instance may set it), and a rule a role can be configured to reach stays",
    planner:
      "kept: its dispatch can be given a bound in `docs/control/budgets.json` (unset here; an instance may set it), and a rule a role can be configured to reach stays",
    refuter:
      "kept: its dispatch can be given a bound in `docs/control/budgets.json` (unset here; an instance may set it), and a rule a role can be configured to reach stays",
  },
  "off-ramps": {
    executor:
      "kept: the rule names it (the order's executor records no waiver, defect or retraction), and `correct` repairs its own wrong attestation or checkpoint",
    verifier:
      "kept: the rule names it: `defect` is the verifier's record, and `waive` and `retract` are read at its judgment",
    reviewer:
      "kept: the rule names it: `defect` is the reviewer's record too, and `reopen-handoff` returns a widened handoff to its phase",
    "release-close":
      "kept: its own correction sentence sends what an operator override changed to `override-record` from main",
    planner:
      "kept: a pass that sets an order down records `withdraw`, and under Codex an override's record is run from the printed command",
    refuter:
      "kept: an operator override in its session is recorded with `override-record`, which Codex runs from the printed command",
  },
  "amend-order": {
    executor:
      "kept: a scope expansion during execution changes its order's judged text",
    verifier:
      "kept: a scope expansion at its phase changes the judged text it verifies against",
    reviewer: "kept: a scope expansion at final review changes the judged text",
    "release-close":
      "left out: it holds a closed order, whose text and decisions take no further entry, as its own correction sentence says",
    planner:
      "kept: `npm run plan -- amend-order` is a plan command, and a pass meets an order amended outside a pass",
    refuter:
      "kept: its procedure applies operator-authorized overrides to judged text, which this command binds",
  },
  "fan-out": {
    executor: "kept: launches the review ladder's workers",
    verifier: "kept: may launch workers for its probes",
    reviewer: "kept: may launch workers at final review",
    "release-close":
      "left out: its procedure launches no worker: the close runs the printed helper commands itself",
    planner:
      "kept: launches the criteria review, the profile reader and the refuter",
    refuter: "kept: launches the one background refuter",
  },
  "session-readback": {
    executor: "kept: the actor flags of its completion",
    verifier:
      "kept: the actor flags of its result and its report's attestation",
    reviewer: "kept: the actor flags of its result",
    "release-close":
      "kept: an `accept-overrun` it records carries its actor attestation (the dispatch-bounds rule it keeps)",
    planner:
      "kept: an `accept-overrun` it records carries its actor attestation, and its receipts name the worker actually run",
    refuter:
      "kept: the receipt's `--worker-type` and an `accept-overrun` it records name what actually ran",
  },
  "publication-check": {
    executor: "kept: its write-backs edit product documents",
    verifier:
      "kept: the rule names it: the check grants a read-only role no editing authority",
    reviewer: "kept: a fix at final review can edit a product document",
    "release-close":
      "kept: a `quality pass:` on a product document reaches the edit in any session",
    planner: "kept: a pass's synthesis edits product documents",
    refuter:
      "kept: a `quality pass:` on a product document reaches the edit in any session",
  },
  "area-notes": {
    executor:
      "kept: changes a target's paths, under the area notes and the workstream's rules its dispatch briefing names (WO-276, Part L)",
    verifier:
      "kept: judges a target change against the conventions its dispatch briefing names",
    reviewer:
      "kept: reviews a target change against the same notes and rules, which its dispatch briefing names",
    "release-close":
      "left out: it closes a merged order and changes or judges no path of the target",
    planner:
      "left out: no target order's dispatch briefing reaches a planning pass, which reads a target through its own profile reader",
    refuter: "left out: it judges the planning subject and no path of a target",
  },
  "standing-file": {
    executor:
      "kept: the executor's phase is the one an instance paces across days, and it writes the standing a later session's briefing names (WO-276, Part P)",
    verifier: "left out: a verification is short and takes no standing",
    reviewer: "left out: a final review is short and takes no standing",
    "release-close":
      "left out: it closes a merged order in one sitting and leaves no state between sessions but the close's own record",
    planner:
      "left out: a planning pass keeps where it stands in its pass document",
    refuter: "left out: it returns one judgment and holds no state to resume",
  },
  "initiative-layout": {
    executor:
      "left out: it executes an order a pass has filed and lays out no initiative",
    verifier: "left out: it judges one order's candidate and files nothing",
    reviewer: "left out: it reviews one order's change and files nothing",
    "release-close": "left out: it closes a merged order and plans nothing",
    planner:
      "kept: a planning pass lays an initiative out and files its next wave (WO-276, Part O)",
    refuter:
      "left out: it judges the orders a pass filed and their sequence; the layout is argument that no check judges and the refuter is not handed",
  },
  "session-boundaries": all(
    "kept: holds the worktree's writer while it works, awaits the gates and background tasks it starts, and hands back with nothing of its own running",
  ),
  "worker-launch": {
    executor: "kept: launches the review ladder's workers",
    verifier: "kept: launches the workers of its probes",
    reviewer: "kept: launches workers at final review",
    "release-close":
      "left out: its procedure launches no adversary, reviewer, refuter or research worker",
    planner:
      "kept: launches the criteria review, the profile reader and the refuter",
    refuter:
      "kept: launches the one background refuter and names its type on the receipt",
  },
  "worker-no-print": {
    executor:
      "kept: runs as a spawned phase worker under a drive, and briefs the workers it launches",
    verifier:
      "kept: runs as a spawned phase worker under a drive, and briefs the workers it launches",
    reviewer:
      "kept: runs as a spawned phase worker under a drive, and briefs the workers it launches",
    "release-close": "kept: runs as a spawned phase worker under a drive",
    planner: "kept: briefs the workers it launches, which are held to it",
    refuter: "kept: briefs the worker it launches, which is held to it",
  },
  "bounded-probes": {
    executor: "kept: probes single tests while it builds",
    verifier: "kept: attacks each criterion with probes of its own",
    reviewer: "kept: reproduces blocking claims by the bounded probe route",
    "release-close": "kept: a blocker it diagnoses is reproduced by a probe",
    planner:
      "kept: a pass that measures or reproduces does so by a probe (the dispatch-bounds rule admits focused reproductions)",
    refuter:
      "left out: the parent runs the two plan commands and judges nothing itself; the worker it launches takes the probe rule from the worker paragraph and its own definition",
  },
  "own-decisions": {
    executor: "kept: the rule names it, and every phase owns its decisions",
    verifier: "kept: every phase owns its decisions and their record",
    reviewer:
      "kept: every phase owns its decisions, and an operator packet records its safe default",
    "release-close":
      "kept: a close resolves version, regeneration and reinstall questions within its authority",
    planner: "kept: a pass sources and records each decision it makes",
    refuter: "kept: it records the dispositions of its holds",
  },
  "operator-aim": all(
    "kept: an operator message can arrive in this role's session at any step",
  ),
  "operator-words": {
    executor: "kept: commits documents, records and source",
    verifier: "kept: commits its report",
    reviewer: "kept: commits its report, the pull request text and the notes",
    "release-close": "kept: writes the tag's and the Release's text",
    planner: "kept: commits the pass document and the orders",
    refuter: "kept: its statement is committed with the receipt",
  },
  "question-pathways": all(
    "kept: an operator's question can arrive in this role's session at any step; Claude's hook delivers the same text and Codex has no hook",
  ),
  "claims-evidence": all(
    "kept: its report and its response claim causes, blockers and completion",
  ),
  "request-authority": all(
    "kept: a command of its procedure can need authority the host has not yet granted",
  ),
  "blocked-turn": all(
    "kept: a block only the operator can clear can meet any step of its procedure",
  ),
  "prune-own": {
    executor: "kept: its gates and probes leave temporary roots",
    verifier: "kept: its gates and probes leave temporary roots",
    reviewer: "kept: its gates and probes leave temporary roots",
    "release-close":
      "kept: the rule names it: the close prunes the closed order's roots and keeps the fallback for its publish",
    planner:
      "kept: `plan start` runs the routine prune and reports what remains",
    refuter:
      "left out: the parent starts no gate, no probe and no plan start, which are what leave and remove temporary roots",
  },
  "runnable-commands": all(
    "kept: hands the operator a command or a question where its procedure names that fallback",
  ),
  "stale-gate-rows": {
    executor: "kept: its completion consumes gate rows at the current identity",
    verifier: "kept: consumes the executor's rows at the subject's identity",
    reviewer:
      "kept: its result consumes the complete row at the integrated identity",
    "release-close":
      "kept: the helper consumes the committed reviewer's row by code identity",
    planner: "kept: a pass ends on a green `npm run test:docs` row",
    refuter:
      "kept: the rule's second half governs it: the receipt helper runs the plan check, and no check is passed by removing a reviewed fix; it starts no gate, so the first half finds nothing there",
  },
  "stop-monitors": all(
    "kept: can start a background monitor of a run or a worker and records a result",
  ),
  "safeguard-refusals": all(
    "kept: a provider's safeguard can refuse this role's session on either host",
  ),
};

const failures = [];
const known = new Set(sharedRules.map((rule) => rule.id));
for (const id of Object.keys(REASONS))
  if (!known.has(id)) failures.push(`a reason names no record: ${id}`);
const cell = (rule, role) => {
  const reason = REASONS[rule.id]?.[role];
  if (!reason) {
    failures.push(`no reason: ${rule.id} for ${role}`);
    return "";
  }
  const kept = reason.startsWith("kept: ");
  if (
    !kept &&
    !reason.startsWith("left out: ") &&
    !reason.startsWith("absent at the base: ")
  )
    failures.push(`a reason opens with no verdict: ${rule.id} for ${role}`);
  if (kept !== rule.roles.includes(role))
    failures.push(
      `the record and the reason disagree: ${rule.id} for ${role} (the record ${rule.roles.includes(role) ? "names" : "leaves out"} the role)`,
    );
  return reason;
};
for (const rule of sharedRules) {
  if (!rule.roles.length) failures.push(`a record names no role: ${rule.id}`);
  for (const role of Object.keys(REASONS[rule.id] ?? {}))
    if (!SHARED_RULE_ROLES.includes(role))
      failures.push(
        `a reason names no role of the records: ${rule.id} for ${role}`,
      );
}
const sections = sharedRules.map((rule) => {
  const opening = rule.text.split(/(?<=[.:;]) /u)[0].slice(0, 110);
  return [
    `## \`${rule.id}\``,
    "",
    `Opens: "${opening}${opening.length < rule.text.length ? " …" : ""}" (${Buffer.byteLength(rule.text) + 1} bytes with its line end).`,
    "",
    "| Role | Reason |",
    "| --- | --- |",
    ...SHARED_RULE_ROLES.map(
      (role) => `| ${role} | ${cell(rule, role).replaceAll("|", "\\|")} |`,
    ),
    "",
  ].join("\n");
});
const left = sharedRules.flatMap((rule) =>
  SHARED_RULE_ROLES.filter((role) => !rule.roles.includes(role)).map(
    (role) => `\`${rule.id}\` (${role})`,
  ),
);
const page = [
  "# WO-276 Part F: the shared rules, role by role",
  "",
  "<!-- Generated by docs/evidence/WO-276/part-f/rule-table.mjs from the rule records of packages/skeleton/src/loadouts/contributor.ts and the reasons that script holds; edit a reason there and run it. -->",
  "",
  `The ${sharedRules.length} shared rules of the role roots, in the order a root holds them, each with the reason every role keeps it or is left without it. The roles are the six a record can name; the router's root is written whole and is no composition of these. A role keeps a rule when its procedure reaches the command, the phase or the host the rule governs, or can be configured to; a rule a role keeps is whole in its root, once. The cells that leave a role out: ${left.join(", ")}.`,
  "",
  ...sections,
].join("\n");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
const path = join(here, "rule-table.md");
if (process.argv.includes("--check")) {
  if (readFileSync(path, "utf8") !== page) {
    console.error("rule-table.md differs from the records and the reasons");
    process.exit(1);
  }
} else writeFileSync(path, page);
console.log(
  `${sharedRules.length} rules, ${SHARED_RULE_ROLES.length} roles, ${left.length} cells that leave a role out`,
);
