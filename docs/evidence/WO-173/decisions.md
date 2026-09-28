# WO-173 decisions

## WO-173-D001 — economy experiment: how a completion reads the review selection

```json
{
  "id": "WO-173-D001",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "At an executor completion, read the current review selection by spawning the runner's own listing (node scripts/test-runner.mjs --review --list) and parsing the suite names it prints, rather than importing scripts/test-runner.mjs into the resume process. The spawn is the public interface a fixture can stand a stub in for, and on the operator's host it costs about 20 ms more per call than the import.",
  "question": "Does spawning the runner's listing at each completion that claims the review form cost enough wall-clock, against importing the runner module in-process, to justify coupling resume.mjs to the runner's module graph and losing a replaceable interface?",
  "alternatives": [
    "Spawn node scripts/test-runner.mjs --review --list at the completion and parse the names it prints: one short process per completion, the same selection the gate itself computes, and a stub runner in a fixture.",
    "Import scripts/test-runner.mjs into the resume process and call changedMachinery directly: no process, but the runner's import graph and Git reads run inside every completion and a fixture cannot replace them."
  ],
  "observation": "Wall-clock of three runs of each command on the operator's checkout at 2026-09-28T19:31Z under /usr/bin/time -p: the listing 0.05, 0.04 and 0.05 s; the bare import 0.03, 0.03 and 0.03 s. The import would be adopted only if the listing cost more than 2 s per call.",
  "budget": { "wallSeconds": 300 },
  "execution": "run",
  "cost": {
    "wallSeconds": 90,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p node scripts/test-runner.mjs --review --list (three runs)",
      "/usr/bin/time -p node --input-type=module -e 'await import(\"./scripts/test-runner.mjs\")' (three runs)"
    ],
    "source": "The shell clock around the six commands (2026-09-28T19:31:12Z to 19:31:13Z) and the writing of this record; tokens belong to the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": 0.04,
    "tokensPerOrder": null,
    "commands": [
      "npm run resume -- implementation-ready <actor flags>",
      "npm run resume -- repair-complete <actor flags>"
    ],
    "summary": "The spawn costs about 0.02 s more than the import per completion that claims the review form, about 0.04 s for an order with one implementation-ready and one repair-complete. No saving is claimed: the spawn is kept for the interface it shares with the gate and for the stub the off-ramps fixture stands in for it."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-25",
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/lib/handoff-ledger.mjs reviewSelection: spawns the runner with --review --list and reads `<name> — protects:` lines",
    "scripts/test-off-ramps.mjs: the WO-102 gate fixtures plant a stub scripts/test-runner.mjs whose listing names a suite an untracked declared script selects",
    "docs/evidence/WO-171/decisions.md WO-171-D001 names WO-159-D012 (2026-09-25) as the latest adopted experiment; no single source counts the experiments since, so the count stays null"
  ],
  "rejected": [
    {
      "option": "Import scripts/test-runner.mjs into the resume process",
      "reason": "It saves about 20 ms per completion and binds resume.mjs to the runner's import graph, which the off-ramps fixture (a copied scripts/lib without the runner) could not load or replace."
    }
  ],
  "reopenWhen": "The listing exceeds 2 s on the operator's host, or a completion needs the review selection where the runner cannot be spawned but could be imported."
}
```

## WO-173-D002 — The handoff ledger: one line per declared criterion, read at both executor completions

```json
{
  "id": "WO-173-D002",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The executor's ledger is docs/evidence/WO-NNN/handoff.md under the configured evidence root. It holds one line per acceptance criterion the order declares, in the forms criterionJudgments already reads from a report (`**Criterion <id>:** met`, `unmet` or `unmet, waived by <ordinal>`, as a paragraph, a list item or a quotation, never inside a code fence), followed on the same line by the evidence for met or the decision that says why for unmet. implementation-ready and repair-complete read it before any other check: an absent ledger, a criterion with no line, two lines for one criterion and a line for a criterion the order does not declare refuse and append nothing, and the refusal names the identifiers and the accepted forms. A `waived by` line records the criterion unmet, as the report convention does. An order whose numbered criteria cannot be read from its file (no `Acceptance criteria` heading or bold field followed by numbered items) is not checked: the completion prints one advisory and records, as before this order. The completion event carries `unmetCriteria`, the identifiers recorded unmet, only when a ledger was judged; the fold refuses a value that is not an array of criterion ids and projects the list with the ordinal that recorded it, reset at activation; `resume status --json` always carries `unmetCriteria` (empty when none) beside `waivedCriteria`, and current.md prints an `Unmet criteria` line only when there is one. The completion's own message states the ledger's counts. The `next` and `fix` briefings tell the executor to judge each criterion on one line of the ledger before the completion command.",
  "evidence": [
    "scripts/lib/handoff-ledger.mjs declaredCriteria (the numbered items, wrapped lines joined up to a blank line), readHandoffLedger, handoffLedgerPath",
    "scripts/lib/control.mjs unmetCriteria: `invalid <type> unmetCriteria at line N` for a non-array or a non-string id; state.unmetCriteria = [{criterionId, ordinal}] from the latest ImplementationReady or RepairCompleted",
    "scripts/resume.mjs: readHandoffLedger before executorWriterRelease and requireLifecycleEvidence in both completions; describeHandoff in the completion message; unmetCriteria in projectOrder and renderOffRamps; ledgerBriefing in executionBriefing and repairBriefing",
    "scripts/test-off-ramps.mjs: the WO-099 refusals (absent, no line judges criterion 2, two lines judge criterion 2, criterion 3 is not declared, a fenced line is not read), the recorded event's unmetCriteria [\"2\"], status and current.md, the repair's rewritten ledger with the waived form, the WO-105 order without a criteria list (one advisory, no field), the fold's refusal of [\"2\", 3] and its projection of [\"2\"]",
    "scripts/test-resume.sh: the status projection's key set and exact JSON now carry unmetCriteria; scripts/test-derived-orders.mjs: a derived order's `## Acceptance criteria` list is a declared list, so its fixture writes the ledger before each completion",
    "docs/planning/failures-across-phases-2026-09-28.md §5 B: 13 reports whose gap the executor had recorded and handed off; §5 A: 17 findings a re-read of the criterion list would have shown"
  ],
  "rationale": "Mission and critical path: the ledger moves a recurring judge-side rediscovery (cause B) into the handoff itself, and the reader who pays is the executor who already holds the evidence. Rule beating: a line is only a claim, so the gates a met line names are checked against their rows (D003) and everything else stays the judge's; the executor cannot pass a criterion by writing met. Shifting the burden: an unmet line is disclosed at the next dispatch instead of travelling to a verifier who fails it a cycle later. Escalation and policy resistance: no new event type, phase, verdict rule or off-ramp; a handoff is never refused for an unmet criterion. Commons: one file and one read per completion. Naive Interventionism: orders without a numbered list keep today's behaviour with one advisory, and the four fixture families that drive completions with such orders are untouched. NoOp keeps 13 of 96 failed judgments arriving with a gap the executor already knew.",
  "rejected": [
    {
      "option": "Refuse the handoff when a criterion is recorded unmet or a named gate is red",
      "reason": "The 2026-09-15 stand-down removed gate evidence from the transitions; a red gate for a sibling's reason would strand an executor, and the operator's routes (waiver, amendment) need the handoff to happen. The order's declined alternatives record this."
    },
    {
      "option": "A JSON ledger or new event fields per criterion",
      "reason": "A verification report already judges criteria in these line forms; the executor reuses them, the judge reads one vocabulary, and criterionJudgments needs no second parser."
    },
    {
      "option": "Judge the criteria inside the implementation report",
      "reason": "The last six closed orders filed that report under four names and one filed none; a fixed path the completion reads is what makes the check possible."
    },
    {
      "option": "Require the ledger for every order",
      "reason": "Orders and fixtures without a numbered criteria list have nothing to judge against; the advisory keeps them recording as before, and the WO-105 fixture pins that."
    }
  ],
  "reopenWhen": "A completion is observed refusing a handoff while its ledger is complete (the check then falls back to an advisory until repaired, operator-review assumption 1), or two orders in a row hand off with a criterion recorded met that the verifier fails on the evidence the line itself named."
}
```

## WO-173-D003 — A met criterion that names a gate stands on that gate's row

```json
{
  "id": "WO-173-D003",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "A criterion recorded met whose text names `npm run test:docs` makes the completion run the document gate once, inline, after every other check and before it appends; a failure refuses the claim and prints the FAIL lines and the runner's summary, and the executor repairs or records the criterion unmet with the reason. One whose text names `npm test` needs a complete passing `npm test` row at the current code identity, whoever recorded it; one that names `npm test -- --review` needs such a row whose required suites include every suite the runner's own `--review --list` prints now, and the runner's selection now reads untracked files beside the diff against main, so a script an order adds selects its suites before it is staged (WO-169 D007's follow-up). The refusal names the command and the choice: run it, or record the criterion unmet. A gate that cannot start (no runner at scripts/test-runner.mjs, or a spawn failure), a gate index that cannot be read and a review listing that fails each print one advisory and the completion records; a review claim whose listing is unavailable stands on the plain row. The completion event's evidence carries the row a product claim stood on as `productGate` and, when the runner recorded one, the document row as `documentGate`; these are the executor's evidence, and publication keeps reading the reviewer's row from FinalReviewCompleted alone. The former advisory that looked the document gate up by tree hash, which every report write changed, is removed.",
  "evidence": [
    "scripts/lib/handoff-ledger.mjs GATE_NAMES (test:docs, `npm test -- --review`, `npm test`), requireGateClaims, reviewSelection; scripts/lib/gate-reuse.mjs coveringGateCheck and completePassingRow",
    "scripts/test-runner.mjs changedMachinery: git ls-files --others --exclude-standard joins the diff; scripts/test-runner.test.mjs `release shell changes select their inventory guard during review`: an untracked scripts/test-gate-deadlines.mjs selects configuration-root and runner-fixtures",
    "scripts/test-off-ramps.mjs WO-102: refused with no row, a failed row and a partial row at the identity; refused for the review form when the plain row lacks the suite an untracked declared script adds to the stub's listing; refused with `FAIL docs-check 0.20 s` and the summary line when the stub document gate exits 1, the PASS line left out; recorded with the covering row (evidence.productGate host-gate:review:npm test) and the passing stub; WO-103 recorded the same criteria unmet at an identity with no row, no runner and a failing stub with no gate consulted; WO-102 repair-complete recorded with one `Review selection unavailable` and one `Document gate cannot start` advisory, and with one `Gate index unavailable` advisory when an archive under check-history is not JSON",
    "scripts/lib/lifecycle-evidence.mjs: the `Latest npm run test:docs for current tree` advisory is gone; WO-171's RepairCompleted carried `missing` 44 s after a passing document gate and WO-164's first one 37 s after (the order's observed gap)",
    "docs/planning/failures-across-phases-2026-09-28.md §5 A: `npm run test:docs` 10 findings, `npm test` 6, the review selection 6, in 24 reports whose every blocking finding an existing check would have shown"
  ],
  "rationale": "Rule beating is the material lens: a met line for a gate criterion is checked against the one row the publication already relies on, so the evidence cannot pass without the gate having run on this code. Drift to low performance: a failed row, a partial row and a row at another identity never satisfy the check, and the executor may not convert a red gate into a claim; it records the criterion unmet and the judge decides. Commons: the document gate costs 12.8 s on the operator's host and runs once, inside the completion, instead of a tree-hash lookup that was wrong after every report write; the product gate is never run by the completion, only looked up. Policy resistance: reading the review selection through the runner's own listing keeps the completion and `npm test -- --review` on one selection, and the untracked-file rule changes what every review gate selects, which WO-169 D007 declined to do inside a one-row change and left to a decision; this order makes it, because the completion's coverage question cannot be answered without it. Naive Interventionism: the executor event's productGate is informational and no consumer of the reviewer's gate reads it. NoOp keeps 24 judgments failing on checks that were not run.",
  "rejected": [
    {
      "option": "Run npm test inside the completion when a claim lacks a row",
      "reason": "A ten-minute completion, and the executor already has the command; the completion prints it and refuses the claim, or records the criterion unmet."
    },
    {
      "option": "Keep the document gate as a tree-hash lookup and add the ledger beside it",
      "reason": "Every report write changes the tree hash, so the lookup said `missing` at the moment the executor most needed it right (WO-171, WO-164); an inline run judges the bytes that hand off."
    },
    {
      "option": "Read the review selection by importing the runner (D001)",
      "reason": "Twenty milliseconds cheaper and not replaceable in a fixture."
    },
    {
      "option": "Leave changedMachinery on tracked files and have the completion add untracked files itself",
      "reason": "The completion would then demand suites the executor's own `npm test -- --review` never runs until the reviewer stages the file; one selection for both is the only consistent rule."
    }
  ],
  "reopens": {
    "decisionId": "WO-169-D007",
    "observation": "changedMachinery reads untracked files as followups --touching does (WO-173 criterion 2): an untracked scripts/test-gate-deadlines.mjs selects runner-fixtures and configuration-root in the runner fixture, and the completion's review-form check covers the suites an untracked declared script selects."
  },
  "reopenWhen": "A completion refuses a met claim while a covering passing row exists at the current code identity (the check falls back to an advisory until repaired), or an untracked file that no machinery suite declares is reported as selecting one."
}
```

## WO-173-D004 — `npm test` reuses a covering passing row at the same code identity; `--again` runs it

```json
{
  "id": "WO-173-D004",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "`npm test`, with or without `--review`, first looks for a complete passing row of its own command (`npm test`) at the current code identity whose required suites include every suite of the current selection. When one exists the runner prints the row's time, duration, suite count and evidence reference and returns it with `reused: true` and exit 0, before the confinement probe, the build and every suite, and records nothing, so the row publication accepted before stays the row it accepts. `--again` runs the selection. A changed code identity, a failed row, a partial row and a row whose suites lack one the selection now holds never satisfy the lookup, and a plain row does not cover `--review` when the change selects a machinery suite. The lookup applies to the product gate only: `--document` rows are keyed by the tree the documents change, `--machinery`, `--only` and `--confined-partial` record other identities or none.",
  "evidence": [
    "scripts/test-runner.mjs runGateChecks: the lookup after the selection and before outsideOnly; the `--again` flag; scripts/lib/gate-reuse.mjs coveringGateCheck, the same predicate findGateCheck applies plus the requiredSuites comparison",
    "scripts/test-runner.test.mjs `WO-173 npm test reuses a passing complete row …`: a first run records one row and runs two suites; the second run prints the row, starts no suite and records nothing while findGateCheck still returns the first row; --again runs; a plain row under --review with a machinery source changed on the branch runs the gate; the review row then covers both forms; a changed source, a failed row and a partial row at the current identity each run the gate; coveringGateCheck names the missing suite",
    "docs/planning/failures-across-phases-2026-09-28.md §7: a gate run again at a code identity that already held a passing row (344 s in WO-054, 312.54 s in WO-166, two full gates in WO-131, one run the operator stopped, WO-163 D019); the order's observed gap: 2 to 9 product gate runs an order in the last ten"
  ],
  "rationale": "Commons is the material lens: the plain gate is 314 to 322 s and the review selection 612 to 645 s (planning document §13), and the multiplier the record shows is repeated runs at one code identity, not the gate's length. Rule beating: the reused row must be complete, passing, at the same code identity and cover the selection by suite name, which is the same row publication and the executor's claim (D003) stand on; nothing weaker is reused. Success to the successful and drift: per-suite reuse, removed on 2026-09-15, is not restored; this lookup reads the one aggregate row. Shifting the burden: a role that doubts its environment runs --again and says why (operator-review assumption 2) instead of rerunning by default. Naive Interventionism: the printed line names the row and the flag, and the return value carries the row, so a caller that reads exitCode sees a pass and a caller that reads the row sees `reused`. NoOp keeps two verifiers paying 344 s and 312 s for rows that existed.",
  "rejected": [
    {
      "option": "Key the reuse by tree hash",
      "reason": "Every report write changes it; the code identity is the key publication already trusts."
    },
    {
      "option": "Reuse per suite",
      "reason": "Removed by the stand-down for cost that rarely paid; the aggregate row is what the lifecycle consumes."
    },
    {
      "option": "Reuse document-gate rows too",
      "reason": "Documents are outside the code identity and change at every report; the completion runs that gate inline instead (D003)."
    },
    {
      "option": "Never reuse under --review",
      "reason": "A review row at the same identity covers a review selection exactly as a plain row covers a plain one; the suite-name comparison decides, not the flag."
    }
  ],
  "reopenWhen": "A row is reused although the current selection holds a suite the row lacks (the requiredSuites comparison would have to miss it), a reused row hides a real regression that a fresh run at the same code identity would have caught, or after this order an order still pays more than four product gate runs."
}
```

## WO-173-D005 — Three briefing sentences, the ledger sentence and the unmet disclosure

```json
{
  "id": "WO-173-D005",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The `fix` briefing says: `A repair closes the class the finding names: state the rule the repaired code holds and add a case the report did not quote.` The `verify` briefing says: `A finding names its class and the rule a repair must hold; a defect outside what the order's criteria declare is boarded with its reproduction, not failed. A recorded off-ramp whose capture hash matches its operator capture is judged from the record and never put back to the operator.` The `final-review` briefing says the off-ramp sentence. The `next` and `fix` briefings add the ledger sentence (`Before that command` and `Before repair-complete`). The `verify` and `final-review` briefings list what the executor recorded unmet, with the ordinal, the ledger path, the waiver route with its short command form and the amendment route, and say that without either the criterion is judged as it stands. The sentences live in the dispatch output, not the role text, so no cold-start profile grows for them. Measured growth of the fixed text, UTF-8 bytes under the default evidence root: next 254, fix 379, verify 286, final-review 130, each under 400; the disclosure line is per-order content, 440 bytes for one unmet criterion, present only while an unmet criterion is recorded, and its size is the reading this decision gives criterion 5's bound: the bound holds the fixed sentences every dispatch prints, and the disclosure is measured and printed here rather than cut to fit.",
  "evidence": [
    "scripts/resume.mjs repairSentence, verifySentence, offRampSentence, ledgerBriefing, unmetBriefing; verificationBriefing and finalReviewBriefing put the sentences after the cost-line forms on their own line, so the existing `VER-001.md. <cost forms>\\n` pin in scripts/test-resume.sh holds",
    "scripts/test-off-ramps.mjs: the sentences pinned in the verify, fix, final-review and next outputs of WO-099 and WO-101; the byte assertions on each briefing's fixed growth; the disclosure line pinned with the waive command's short form",
    "docs/evidence/WO-163/decisions.md D021 (an authorized, hash-matched waiver put to the operator three times) and docs/evidence/WO-162/decisions.md D013 (the executor stopped the operator for a settled question); docs/planning/failures-across-phases-2026-09-28.md §5 C and D (repairs that closed only the quoted shapes; guards repaired one shape at a time)"
  ],
  "rationale": "Shifting the burden and escalation: the waiver route is offered once, at the dispatch where it is legal, from the record the executor already made, so the operator is not asked again later. Drift to low performance: the fix sentence asks for the rule and an unquoted case, the two things the record shows repairs omitting. Commons: the dispatch output grows by at most 379 bytes of fixed text per briefing and by nothing in the role skills. Rule beating: the sentences are pinned by fixtures, so they cannot silently leave. No ratchet creep: the sentences are sized from their content, and the disclosure's length follows the number of unmet criteria, never a predecessor.",
  "rejected": [
    {
      "option": "Print the full waive usage in the disclosure",
      "reason": "Its 200 bytes of actor flags are already in the legal off-ramps of resume status; the short form names the criterion and the capture flags, which is what a verifier's session needs to act."
    },
    {
      "option": "Put the sentences in the role text",
      "reason": "Three roles' cold-start profiles would grow, and the reviewer's has 178 bytes of headroom after the completion sentence."
    },
    {
      "option": "Drop `and add a case the report did not quote` to shorten the fix briefing",
      "reason": "Cause C's mechanism is a repair covering only the shapes the report quoted; the sentence exists for that clause."
    }
  ],
  "reopenWhen": "A verifier or reviewer routes a hash-matched off-ramp back to the operator after reading the sentence, or a repair that follows the fix briefing still fails on a case of the same class."
}
```

## WO-173-D006 — Ideation breakout receipt: product documents that only grow

```json
{
  "id": "WO-173-D006",
  "date": "2026-09-28",
  "dispatch": "ideation: (two operator messages during resume: next on WO-173, 2026-09-28T20:05:58Z and 20:08:01Z by the prompt hook's clock)",
  "decision": "The operator's ideation about the roadmap and the README was captured, screened and synthesized under product 07 §Operator-opened ideation mode, with no change to WO-173's scope. Raw intake batch: main's ignored docs/intake/notes/WO-173-expanded-ideation-2026-09-28.md (SHA-256 2993746fa51b3d9d903c9e3b39162f7110600b717e4e499abfbd5ecbf78cf71f), both messages unedited with the context the executor observed. Clean-room treatment: Shape-First synthesis of the operator's own words about this repository; nothing employer-derived, no direct-draft filing. Ledger: one section of this date with four entries (two candidate, two preserved). Product surfaces: none edited; the durable rule already stands in product 07 §Documentation freshness and ownership (2026-09-25), and the breakout records why it does not hold. Planning map: one candidates section with three items, harvested into the register by npm run meta. Lineage index regenerated. Unresolved choices, left to a planning pass: whether docs-check refuses a new per-order dated paragraph under a product heading once WO-086 gives the release boundary a generated home; whether release prepare renders the README block; the home of the roadmap's capability-progression and counterfactual-profiling sections. No executable helper was created. Required review: the verifier and the final reviewer digest this receipt, the ledger section and the map section as part of their subject (product 07 §Ideation breakout receipt and verification).",
  "evidence": [
    "docs/intake/notes/WO-173-expanded-ideation-2026-09-28.md in the main control-plane checkout (git worktree list --porcelain: /Users/dylanwood/Projects/DotLn), ignored, SHA-256 2993746fa51b3d9d903c9e3b39162f7110600b717e4e499abfbd5ecbf78cf71f",
    "docs/lineage/idea-ledger.md §2026-09-28 — Ideation during WO-173 execution; docs/planning/work-order-map.md §Candidates — returns from ideation during WO-173 (recorded 2026-09-28)",
    "docs/product/06-roadmap.md: 161,041 bytes on 2026-09-28; §Release boundary lines 21 to 733; WO-173's own activation-completion paragraph added during this dispatch before the ideation; README.md release block lines 94 to 204, 7,251 bytes and about forty sentences against WO-068-D004's fifteen",
    "docs/work-orders/WO-086-generated-release-history.md (objective and non-goals) and WO-087 (the roadmap's candidate sections), both queued; docs/product/07-execution-guide.md §Documentation freshness and ownership and §Discipline (Release assignment is opt-out); the executor role text's activation-target sentence"
  ],
  "rationale": "Shifting the burden is the material lens: the operator paid attention twice to say what a 2026-09-25 rule already says, because the mechanism that contradicts the rule still runs in every order; the breakout names the mechanism and routes it to the pass that can remove it, instead of adding another sentence of prose. Escalation: no new ceremony, no product edit, no scope change to WO-173; two orders already in the queue own the roadmap's two largest sections, and the candidates name what they leave. Correctness over sycophancy: the executor's own two appends in this dispatch are recorded as instances, not excused. Naive Interventionism: the ideation mode's pipeline is followed as written, and speculative mechanisms (a docs-check refusal, a rendered README block) stay candidates.",
  "rejected": [
    {
      "option": "Edit product 06 or the README during this order",
      "reason": "Their fold is WO-086's and WO-087's subject; an ad hoc rewrite inside WO-173 would be the phase-local behaviour the ideation names."
    },
    {
      "option": "Add a sentence to product 07 restating the rule",
      "reason": "The rule is there since 2026-09-25 and did not hold; the mechanism, not the prose, is the candidate."
    },
    {
      "option": "Capture only",
      "reason": "A bare ideation: prefix invokes the complete pipeline, and the operator did not say capture only."
    }
  ],
  "reopenWhen": "A planning pass sequences the roadmap fold or amends WO-086 or WO-087, or the verifier or reviewer finds the synthesis unfaithful to the captured words."
}
```

## WO-173-D007 — Write-backs: product 07, the follow-up procedure, the register advisory and the role sentence

```json
{
  "id": "WO-173-D007",
  "date": "2026-09-28",
  "dispatch": "resume: next; operator direction during the dispatch on the role sentence's byte bound",
  "decision": "Product 07 §Discipline (the `Write once, run once` bullet) now says what the two executor completions check, that a criterion recorded unmet always records and is shown at the next dispatch, and that `npm test` reuses a covering passing row at the current code identity with `--again` to run it; §Retained planning follow-ups says the final review disposes a listed row whose seam the change opened or whose condition occurred and leaves a row it only matched as it is. Product 07 grew from 154,129 to 154,821 bytes (692 added; ceiling 157,212, after the matrix sentence D011 records). docs/planning/followups.md item 2 and the completion advisory in scripts/lib/lifecycle-evidence.mjs carry the same rule. The shared completion sentence of the role text grew from 163 to 390 bytes: `Completion runs git diff --check inline, validates report/attestation presence and reads the executor's docs/evidence/WO-NNN/handoff.md, one line per declared criterion: a met criterion's named gate must hold (test:docs runs inline; npm test needs a passing row at the code identity), an unmet one records and is shown at the next dispatch. Output reads, usage and planning handoffs advise.` The order's design bounded that growth at 150 bytes from the reviewer's 405 bytes of headroom; a 136-byte version dropped which gates are checked and how, and read `shown next`. During the dispatch the operator directed that the bound is a smell and not yet a hard rule, and that a longer sentence which reads better consistently is not to be trimmed to the number. The fuller sentence is kept: every cold-start profile stays within its ceiling and every verdict is unchanged (executor 26,286 to 26,513 of 29,246; verifier 23,089 to 23,316 of 25,151; reviewer 24,171 to 24,398 of 24,576; release-close 15,195, planner 17,343 and refuter 16,918 unchanged; the same in .claude/skills and .agents/skills).",
  "evidence": [
    "docs/product/07-execution-guide.md §Discipline `Write once, run once (WO-132)` and §Retained planning follow-ups; wc -c before 154,129 and after 154,821; docs/control/doc-ceilings.json 07-execution-guide.md ceiling 157,212",
    "docs/planning/followups.md item 2; scripts/lib/lifecycle-evidence.mjs advisory text and its pin in scripts/test-process-debt.mjs `WO-169 completion advises …`",
    "packages/skeleton/src/loadouts/contributor.ts `evidence`; node scripts/harness.mjs emit (31 generated surfaces) and check; node scripts/harness-context.mjs --check before (docs/evidence/WO-173/cold-start-before.json) and after (cold-start-after.json)",
    "The operator's message during resume: next on 2026-09-28: the 150-byte figure should be a smell, not a hard rule yet; if 227 bytes makes this go smoother consistently, trimming has no point"
  ],
  "rationale": "Seeking the wrong goal is the material lens: the ceiling and the unchanged verdicts are the outcome standard, and a byte figure derived from them is a signal, not the standard; cutting content to hit the figure would trade the executor's knowledge of what completion checks for 91 bytes of headroom. Drift to low performance and no ratchet creep: the sentence is sized from its content and the ceiling still binds; a breach would take the standing 2026-09-17 route (raise by one 4 KB step with the rule named), which was not needed. Commons: the reviewer keeps 178 bytes of headroom, recorded here so the next rule sees it. Correctness over sycophancy: the operator's direction was applied where the hard criterion (ceiling and verdict unchanged) admits it; the two acceptance criteria that are byte bounds (400 per briefing, 700 for product 07) are met by cutting filler words, not content.",
  "rejected": [
    {
      "option": "Keep the 136-byte sentence to honour the design's 150-byte figure",
      "reason": "It dropped which gates a met criterion is checked against and how, and `shown next` was ambiguous; the ceiling it protected is not breached by the fuller sentence."
    },
    {
      "option": "Raise the reviewer's ceiling now",
      "reason": "Nothing is breached; the route exists for a reviewed rule that breaches, and pre-emptive raises are the ratchet the rule forbids."
    },
    {
      "option": "Move the completion sentence out of the reviewer's text",
      "reason": "The three roles share it on purpose: a verifier and a reviewer read what the executor's completion checked when they judge its handoff."
    }
  ],
  "reopenWhen": "A reviewed rule needs more than the reviewer's remaining 178 bytes, or a reader of the role text reports the completion sentence as unclear about what the completion checks."
}
```

## WO-173-D011 — Read-only review before handoff: findings and dispositions

```json
{
  "id": "WO-173-D011",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "One read-only reviewer (a general-purpose subagent, no writes, one of the session's cap of 20) read the whole change against the order's criteria while the first review gate ran, and reported nine findings. Three changed the code or a document before handoff: the new modules imported the skeleton's gate-evidence statically, so a copied control plane without the skeleton could not load resume.mjs (beacon-portability; the imports are now lazy, and the suite passes); `--fresh` no longer forced a run once the reuse lookup existed, while scripts/measure-gates.mjs relies on it (both `--fresh` and `--again` now run the selection, with a fixture); a complete passing `npm test` row without a `requiredSuites` field satisfied publication but not the completion's plain claim (an empty requirement is now covered by any complete passing row, a named requirement never by a row that names no suites, with a fixture); product 07 §Discipline still said the acquisition matrix's fixed 240-second deadline was unaffected (now: each lock-matrix cell has its own 120 s deadline). Two are accepted limits, recorded here: a criterion's text that mentions `npm test` in the negative or in the runner's own document spelling is classified as a product claim, because the Design classifies by the name the text uses and a criterion declares its set (WO-172's rule 2); and the review listing includes `registrations` whenever an untracked file under docs/ exists, which holds for every order from activation because its control segment is untracked until final review, so the executor's `npm test -- --review` and the completion read the same selection and no order pays the gate twice for its own ledger. The rest were confirmations or matters already recorded (D005's reading of criterion 5; D007's role sentence; the evidence files written after the gate).",
  "evidence": [
    "The reviewer's report, delivered in this session on 2026-09-28 after 1,148 s and 78 tool uses; it executed nothing and wrote nothing",
    "scripts/test-beacon-portability.mjs and scripts/test-configuration-root.mjs pass on the repaired bytes (docs/evidence/WO-173/fixtures.txt); scripts/lib/gate-reuse.mjs and scripts/lib/handoff-ledger.mjs import ./gate-evidence.mjs and ./gate-reuse.mjs inside the functions that need them",
    "scripts/test-runner.mjs: `--fresh` and `--again` set the same flag; scripts/measure-gates.mjs:168 loops `npm run test:full -- --fresh`; scripts/test-runner.test.mjs: the --fresh run and the bare-row cases in `WO-173 npm test reuses …`",
    "docs/product/07-execution-guide.md §Discipline, the scheduling paragraph; docs-check: product 07 within its ceiling",
    "git ls-files --others --exclude-standard on this worktree lists docs/control/orders/WO-173.jsonl from activation, and scripts/test-runner.mjs machinerySources.registrations declares docs/"
  ],
  "rationale": "Correctness over sycophancy: the reviewer's defects are recorded as defects and fixed before the judge meets them, which is cause A of the failures pass applied to this order's own handoff; the two limits are stated with their reasons rather than argued away. Commons: the fixes cost one more review gate, against a verification cycle each would have cost later. Rule beating: each fix carries a fixture.",
  "rejected": [
    {
      "option": "Board the --fresh and bare-row findings as follow-ups",
      "reason": "Each is a one-line defect inside this order's own deliverable, and cause B of the failures pass is handing off a gap the executor already knows."
    },
    {
      "option": "Narrow the `npm test` classification to exclude negated mentions",
      "reason": "A pattern that reads intent from prose would be a guard repaired one shape at a time (cause D); the criterion's author names the gate or does not."
    }
  ],
  "reopenWhen": "A completion refuses a plain claim while findGateCheck accepts a row at the same code identity, or an order's review listing differs from the selection its own npm test -- --review ran."
}
```

## WO-173-D008 — The lock matrix as eight subtests with a per-cell deadline

```json
{
  "id": "WO-173-D008",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The WO-143 lock matrix is one test with eight subtests, one per cell (once and loop, lifetime and append, fresh and reclaim), each under its own 120,000 ms node:test timeout, so a cell slowed by another lane's load fails alone and by name and the other seven run. The default comes from the measurements this order recorded: alone, the cells took 17.0 to 25.5 s (170.5 s in all); beside the review gate, the cells took 17.54 to 26.25 s a cell, 174.38 s in all (against 17.01 to 25.52 s alone); the four earlier cancellations at the single 240 s budget imply 34 to 40 s a cell under a sibling gate (six or seven of eight cells done at 240 s). 120 s is more than four times the slowest solo cell and about three times the loaded cells the record shows. A fixture may shorten the deadline with DOTLN_LOCK_MATRIX_CELL_TIMEOUT_MS and replace each cell's work with a delay through DOTLN_LOCK_MATRIX_FIXTURE; the deadline fixture runs the matrix test in a child node --test with a 150 ms deadline and a 600 ms delay on loop-append-reclaim and asserts that cell fails with the timeout while the other seven pass. packages/skeleton/src/gate-deadlines.mjs is not edited.",
  "evidence": [
    "packages/skeleton/test/resident.test.ts: lockMatrixCells, lockMatrixCellTimeoutMs, the WO-143 test's t.test per cell, the WO-173 deadline fixture",
    "docs/evidence/WO-173/matrix-durations.json: the alone run (node --test on the built file, 2026-09-28T19:53:34Z to 19:56:24Z, exit 0, uptime load averages 5.51 5.71 4.90 read after it) and the run beside npm test -- --review (2026-09-28T20:14:28Z to 2026-09-28T20:17:22Z, exit 0; 17.54 to 26.25 s a cell, 174.38 s in all)",
    "docs/evidence/WO-159/decisions.md D020 (seven of eight cells at 240 s), docs/evidence/WO-168/decisions.md D013 (six of eight; the case alone 208 s), docs/evidence/WO-115/repair-diagnostics.md (180 s and 174 s alone), docs/evidence/WO-060/decisions.md D009 (two of three review gates)",
    "A node:test probe on Node 26.9.0: a subtest that exceeds its timeout fails with testTimeoutFailure and the parent continues to the next awaited subtest; --test-name-pattern on the parent's name runs its subtests",
    "git status: under packages/skeleton/src only loadouts/contributor.ts changed; packages/skeleton/package.json carries the release label"
  ],
  "rationale": "Drift to low performance and rule beating: no assertion is removed and no cell's budget is raised to make a red gate green; a cell that hangs still fails, and the others still report. Commons: the matrix's total cost is unchanged and a review no longer pays a rerun for a load-induced cancellation of untouched cells. Policy resistance: the per-cell deadline is a plain node:test timeout, not a new deadline family, and gate-deadlines.mjs stays outside the change. Naive Interventionism: the delay fixture exercises the deadline mechanics in about a second instead of rerunning eight real cells. NoOp keeps the matrix failing whole at 240 s whenever two gates share the host (WO-114, WO-159, WO-115, WO-168, WO-060).",
  "rejected": [
    {
      "option": "Raise the single 240 s budget",
      "reason": "WO-115's review declined raising deadlines to obtain green output, and one budget still fails all eight cells for one slow cell."
    },
    {
      "option": "A smaller matrix",
      "reason": "The eight cells are the acquisition boundaries WO-143 proved; dropping cells drops coverage."
    },
    {
      "option": "Scale the cell deadline by the gate's load declaration through deadlineLimit",
      "reason": "The skeleton suite's declared factor is eight, which would allow 200 s a cell; a fixed bound the measurements justify is simpler to read and to reopen."
    }
  ],
  "reopens": {
    "decisionId": "WO-159-D020",
    "observation": "Per-cell budgets landed in WO-173: eight subtests with a 120 s deadline each, measured alone and beside a review gate."
  },
  "reopenWhen": "A cell is cancelled at its own deadline while no sibling gate runs, or the loaded per-cell duration recorded by a later review exceeds 60 s."
}
```

## WO-173-D009 — Release and re-mints

```json
{
  "id": "WO-173-D009",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "Release and re-mints. The order's heading takes v0.53.2, the next patch above the observed local v0.53.1 tag, with the activation-completion paragraph product 07 §Discipline still requires in product 06 §Release boundary and the README block's version line; release prepare --local then wrote the meter snapshot and the PR meter block. Skeleton 0.44.3 to 0.44.4 is a compatible patch for the changed role instruction (the precedent of a27e4c8e); the console pin and the lockfile follow; the host version constant stays at 0.34.0, as the recent skeleton package bumps left it. The harness bundle is re-emitted (31 surfaces) and checked. The authority edition is re-minted deterministically as WO-173 revision 001 and selected in docs/evidence/current.json; the feedback, artifact-identity and verification editions pass their checks at the subject unchanged, so the feedback carry the Cost line predicted is not owed. The gates at the subject: npm test -- --review passed: 37 suites, 640.35 s, recorded 2026-09-28T20:50:02.516Z, code identity 64b907d08ffc7e0c47e0244377c96a913ba2fb33f171912286d16a305d26c29d, host-gate:64b907d08ffc7e0c47e0244377c96a913ba2fb33f171912286d16a305d26c29d:npm test; npm run test:docs passed: 23 tasks, 13.16 s, recorded 2026-09-28T20:52:13.884Z, tree cac41d2e6a0d0b45694fc61308d96f3c5a7f6e38; git diff --check clean. No dependency was added.",
  "evidence": [
    "git tag --list 'v*' | sort -V: v0.53.1 latest; docs/work-orders/WO-173-handoff-states-what-it-knows.md heading; docs/product/06-roadmap.md §Release boundary; README.md `This source prepares DotLn v0.53.2`; npm run release -- prepare --local: `WO-173 target v0.53.2 remains current`, docs/evidence/WO-173/meta.json and docs/final-reviews/WO-173/PR.md written",
    "packages/skeleton/package.json, packages/console/package.json, package-lock.json: 0.44.4; git show a27e4c8e (a role-instruction change advanced the skeleton package); git log -- packages/skeleton/package.json (7a4e1b16 bumped the package without the host constant)",
    "node scripts/harness.mjs emit and check: 31 generated surfaces; node scripts/authority-evidence.mjs --write --edition WO-173 --revision 001, then --check after selecting it in docs/evidence/current.json; feedback, artifact-identity and verification --check pass; node scripts/harness-evidence.mjs passes",
    "docs/control/local/harness/checks.json: npm test passed: 37 suites, 640.35 s, recorded 2026-09-28T20:50:02.516Z, code identity 64b907d08ffc7e0c47e0244377c96a913ba2fb33f171912286d16a305d26c29d, host-gate:64b907d08ffc7e0c47e0244377c96a913ba2fb33f171912286d16a305d26c29d:npm test; npm run test:docs passed: 23 tasks, 13.16 s, recorded 2026-09-28T20:52:13.884Z, tree cac41d2e6a0d0b45694fc61308d96f3c5a7f6e38"
  ],
  "rationale": "Commons: one deterministic re-mint instead of four, because three editions are not stale at the subject and a live episode is owed by none. Rule beating: the gates are recorded from the runner's rows, with their identities, not from a summary. Policy resistance: the release paragraph and the README line are written because the machinery still requires them; the ideation breakout (D006) records that requirement as the mechanism to remove, not something this order may skip.",
  "rejected": [
    {
      "option": "Bump the host version constant as well",
      "reason": "No host behaviour changed; the recent skeleton package bumps left the constant, and changing it would move the runtime pins for nothing."
    },
    {
      "option": "Carry the feedback edition",
      "reason": "Its check passes at the subject; a carry would record a change that did not happen."
    },
    {
      "option": "Skip the release paragraph and README line",
      "reason": "release prepare refuses without the version line and the role text requires the paragraph; the removal is a candidate (D006), not this order's authority."
    }
  ],
  "reopenWhen": "A verifier finds an edition stale at the subject, or the release baseline moves before final review and the label must be retimed."
}
```

## WO-173-D010 — The register rows this change touches

```json
{
  "id": "WO-173-D010",
  "date": "2026-09-28",
  "dispatch": "resume: next",
  "decision": "The register rows the completion advisory names for this change, read through npm run plan -- followups --touching on 2026-09-28 before handoff (17 pending rows matched 48 changed paths and WO-173 when the listing was read; the completion advisory then counted 18, the added row being FUP-1d57cbcb226d8f8a below, which returned to review when D008 reopened WO-159-D020 after the listing), with what this order did for each. Seams this change opened, for the final review to dispose: FUP-b1163d128e371b7f (WO-169-D007: changedMachinery reads untracked files; landed, D003, and the row returned to review when D003 reopened its decision) and FUP-0a5c04cf5c741559 (WO-060-D009: the matrix's fixed 240 s deadline; the eight per-cell deadlines land, D008). Allocated to WO-173 by the 2026-09-28 pass and landed here: FUP-1d57cbcb226d8f8a (WO-159-D020, the per-cell budgets, D008), FUP-756224e6e2cbf35a (WO-163-D021, the off-ramp sentence in the verify and final-review briefings and the disclosure of an unmet criterion with the waiver route, D005), FUP-5a03cc13047c1dc4 (WO-169-D002 in part, the reworded register rule, D007) and FUP-b1163d128e371b7f above. Matched by text only and left as they are: FUP-4f8cd7989607ad3f (resident replay identity; resident.test.ts is edited only in its matrix test), FUP-50cda1c03ecd8ea8 (harness-prune usage retention; matched the new meta.json by name), FUP-51c310284c2fea17 (observed-facts hedge edges; matched resume.mjs), FUP-56b599e15f97e666 (resident-state hold wording; matched product 07), FUP-5e2f4ce16f9e8be1 (WO-110 residue editions; matched the new authority bundle-diff.json by name), FUP-acfe4bfda716d8fb (usage and meta attribution; matched current.md), FUP-b053a956adb84b6a (the verdict rule for unreached cases; names WO-173 as its reopening condition and is the planner's after this order), FUP-b789b81160c008ea (C1 and Unicode separators; matched control.mjs), FUP-ca628adcc713c0b8 (WO-115-D026 fold hardening of the productGate binding; control.mjs gains the unmetCriteria projection beside it, the binding check is untouched), FUP-e55e258d37cb3f20 (namesPath relative links; matched lifecycle-evidence.mjs), FUP-e821aa2ced3aa111 (TAP for node() suites; this order opens test-runner.mjs for the reuse lookup only, outside the row's item), FUP-f1c7a256bec46737 (cold-start ceilings; matched product 07), FUP-fd05316b6030ef73 (Codex dispatch reservation wording; matched README and product 07); FUP-0349c7a91fe63917 (the stale writer reservation self-diagnosis candidate; matched scripts/resume.mjs by text and left as it is); and FUP-cd1a227413938345 (Product documents owned as wholes: this order's own ideation candidate from D006, which names WO-173 as its source and waits for the next planning pass). None is widened into this order.",
  "evidence": [
    "npm run plan -- followups --touching, three pages on 2026-09-28 after the evidence files existed; the completion advisory at implementation-ready prints the same count and command",
    "docs/evidence/WO-173/decisions.md D003 (reopens WO-169-D007), D005, D007, D008 (reopens WO-159-D020)",
    "npm run plan -- followups --show for FUP-1d57cbcb226d8f8a, FUP-756224e6e2cbf35a, FUP-5a03cc13047c1dc4 and FUP-b1163d128e371b7f: allocated to WO-173 by the 2026-09-28 pass with their reopening conditions"
  ],
  "rationale": "The reworded rule this order writes is applied to its own rows: a review disposes a row whose seam the change opened or whose condition occurred and leaves a row it only matched. Naming each row here costs one read per row and spares the final review the sixty re-deferrals the planning document counted.",
  "rejected": [
    {
      "option": "Dispose the rows from this session",
      "reason": "Disposition is the final review's act through the feed; the executor records what it did."
    },
    {
      "option": "Fix FUP-e821aa2ced3aa111 while the runner is open",
      "reason": "Selecting TAP for the node() suites is outside every item of this order and would widen the review selection's meaning; recorded as left."
    }
  ],
  "reopenWhen": "The final review finds a listed row whose seam this change opened beyond the two named, or a row this decision calls a textual match turns out to name a file this order changed in substance."
}
```

## WO-173-D012 — Verification: an unreadable live gate index still blocks both completions

```json
{
  "id": "WO-173-D012",
  "date": "2026-09-28",
  "dispatch": "resume: verify",
  "decision": "Fail VER-001 on criterion 2. Both executor completions call requireLifecycleEvidence before requireGateClaims. Its inline diff-check record calls recordGateChecks, which parses the live checks.json without a fallback. A malformed live index therefore refuses both a met gate claim and an explicitly unmet criterion before the promised gate-index advisory can run. The existing fixture corrupts an archive, so it misses this earlier reader. The verifier leaves implementation unchanged and routes the defect through repair.",
  "evidence": [
    "scripts/resume.mjs implementation-ready and repair-complete: requireLifecycleEvidence precedes requireGateClaims",
    "scripts/lib/lifecycle-evidence.mjs: recordGateChecks runs outside a try/catch; packages/skeleton/src/gate-evidence.mjs recordGateChecks reads checks.json before appending its inline-diff row",
    "Independent disposable CLI fixture on 2026-09-28: write not json followed by a newline to docs/control/local/harness/checks.json, with one declared npm test criterion and a complete ledger. implementation-ready and repair-complete each exited 1 for both met and unmet, printed the JSON parse error, and left the lifecycle event bytes unchanged",
    "scripts/test-off-ramps.mjs exercises malformed check-history/legacy.json; the canonical suite:resume check passed independently in 33.23 s, including build, but that fixture does not corrupt the live index",
    "docs/verifications/WO-173/VER-001.md F1 contains expected behavior, observed behavior and reproduction"
  ],
  "rationale": "Mission and critical path: a handoff must preserve the operator's route when evidence storage is unavailable. Policy resistance and shifting the burden: the earlier evidence writer defeats the new advisory route and would require operator rescue. Rule beating and drift: a passing archive-only fixture cannot establish the declared unreadable-index behavior. Commons: reuse the matching 37-suite product row and reproduce this gap in a disposable fixture instead of rerunning the full gate. Escalation: use the existing repair phase. Success to the successful and seeking the wrong goal: judge the handoff behavior independently of its passing fixture count. Naive Interventionism: preserve the damaged evidence and the whitespace check; no change to gate-evidence.mjs is authorized by this finding. NoOp leaves the handoff blocked under an input criterion 2 expressly covers.",
  "rejected": [
    {
      "option": "Treat every unreadable index as outside the order",
      "reason": "Criterion 2 explicitly requires an unreadable gate index to advise and record, and its fixture already uses malformed JSON as unreadable. The live index is the same class of input."
    },
    {
      "option": "Repair the implementation in the verifier session",
      "reason": "An independent verifier records the defect and preserves the judged subject for the repair and a new verification."
    }
  ],
  "followup": "WO-173 executor, next resume: fix, blocking VER-001 F1: make unreadable gate-index storage advisory across both completion paths, including the preceding diff-evidence write, while preserving the whitespace check and existing evidence. Reproduce malformed live checks.json with met and unmet ledgers in both completions and add another unreadable-storage case beyond this report's literal payload. Keep gate-evidence.mjs outside the implementation diff as the order requires.",
  "reopenWhen": "The repaired completion records with one gate-index advisory in the declared unreadable cases, or new evidence changes the diagnosis."
}
```

## WO-173-D013 — Correction: the operator accepts the briefing byte overage

```json
{
  "id": "WO-173-D013",
  "date": "2026-09-28",
  "dispatch": "resume: verify; operator clarified that the known byte overage is accepted at present",
  "kind": "correction",
  "decision": "Report the briefing growth as an accepted, nonblocking observation. The required sentences and both routes are present. Record the operator's acceptance through CriterionWaived ordinal 4 for criterion 5; its reason limits the accepted gap to the numeric bound. No byte-trimming repair is requested.",
  "misread": "The verifier read the earlier byte-limit direction too narrowly and announced that the 400-byte overage would be a blocking finding. D007 had already recorded the operator's direction against trimming useful role text solely to meet a byte figure. The operator clarified during verification that the briefing overage is known and does not matter at present.",
  "meant": "Keep the measured fact in the report without failing the work or asking the operator to reconfirm their acceptance. Functional briefing requirements remain judged from the implementation and fixtures.",
  "changed": "Removed the proposed blocking byte finding. Captured the two clarifications in ignored intake, recorded the waiver from this verifier session, and marked criterion 5 unmet, waived by 4. F1, the unreadable-index defect, remains independent of this acceptance.",
  "evidence": [
    "docs/intake/notes/WO-173-byte-guidance-2026-09-28.md, SHA-256 2ec56a0b5eb8c6680201f4973d95fccc4e89902095b87a1a37b7b1182e76b8f4; two operator clarifications during this verification",
    "docs/control/orders/WO-173.jsonl CriterionWaived ordinal 4, recorded by the verifier session",
    "Independent evaluation of the current and HEAD briefing functions with identical inputs: no unmet criterion grows verify by 286 and final-review by 130 bytes; one unmet criterion grows them by 726 and 570; two grow them by 738 and 582",
    "scripts/test-off-ramps.mjs pins the required sentences and routes but its size assertion counts only fixed text; D005 explicitly records that interpretation"
  ],
  "rejected": [
    {
      "option": "Require trimming or another operator confirmation",
      "reason": "The operator has accepted the measured overage. Neither act would resolve an outstanding requirement."
    }
  ],
  "followup": "Planner or final reviewer: retain the known total briefing growth (verify +726 bytes and final-review +570 for one unmet criterion) as accepted and nonblocking under CriterionWaived ordinal 4. No trimming is required in WO-173. Revisit the size policy only if the operator reopens the present acceptance or evidence shows a functional readability or context-budget problem; do not request the same acceptance again.",
  "reopenWhen": "The operator changes the present acceptance, or a functional briefing requirement fails."
}
```

## WO-173-D014 — Verification: the matrix measurement points to the wrong companion gate

```json
{
  "id": "WO-173-D014",
  "date": "2026-09-28",
  "dispatch": "resume: verify",
  "decision": "Keep criterion 6 met with a nonblocking evidence-reference correction to make during repair. The executor recorded the required solo and concurrent matrix measurements. The concurrent interval overlaps the first product gate, while matrix-durations.json's besideGate fields name the later passing rerun. Do not describe that later row as the concurrent gate or turn this metadata error into a new runtime finding.",
  "evidence": [
    "docs/evidence/WO-173/matrix-durations.json: concurrent matrix interval 2026-09-28T20:14:28Z to 20:17:22Z, duration 174379 ms; besideGate instead names the row recorded at 20:50:02.516Z with duration 640354 ms",
    "readGateChecks: the first row was recorded at 2026-09-28T20:25:29.740Z, duration 660302 ms, exit 1, code identity 1a453c200e4381887dc408ca684686a77bc029b6b9126283aba56425bcd0d211; subtracting duration gives an inferred start at 20:14:29.438Z, matching the measurement's note",
    "The passing row's inferred start is 20:39:22.162Z, after the matrix measurement finished; the report distinguishes the executor's measurements from the verifier's fresh deadline-fixture execution"
  ],
  "rejected": [
    {
      "option": "Rerun the entire matrix and concurrent product gate to replace the reference",
      "reason": "The required measurements and the overlapping row already exist; the defect is the companion reference."
    }
  ],
  "followup": "WO-173 executor, next resume: fix, nonblocking VER-001 N2: correct matrix-durations.json's besideGate reference to the actual overlapping first gate, preserving its failed verdict separately from the later passing gate. Do not rerun the matrix solely to repair this metadata.",
  "reopenWhen": "The companion reference is corrected, or the underlying measurement interval is disputed by additional evidence."
}
```

## WO-173-D015 — Repair: gate storage a completion cannot read or write never refuses the handoff

```json
{
  "id": "WO-173-D015",
  "date": "2026-09-28",
  "dispatch": "resume: fix (VER-001 F1, N2)",
  "decision": "The rule the repaired code holds: at implementation-ready and repair-complete only git diff --check, the ledger's form, a gate that ran and failed, or a readable gate row that contradicts a met claim refuses; gate storage the completion cannot read or write is one advisory and the completion records. The diff check's row write in requireLifecycleEvidence is guarded, the whitespace check still refuses and the damaged index is left as it is. On a failed write an executor completion hands the error to requireGateClaims, which prints one advisory naming the git diff --check row not recorded and every gate claim it records as stated, reads no row and does not run the inline document gate: the runner records its own row after its tasks and exits 1 when it cannot, so a met npm run test:docs claim would otherwise have been refused as a failed document gate, the case the report did not quote. The error string is taken out before the event is appended. Every read of the index in requireGateClaims, including the review-form read that was unguarded, goes through one lookup that advises once. A verifier's completion, and a reviewer's that records fail, reports the failed write once and records; a passing final review still refuses on an unreadable index (see the rationale). The matrix measurement's companion reference now names the failed gate that overlapped it.",
  "evidence": [
    "docs/verifications/WO-173/VER-001.md F1 and WO-173-D012: a malformed live docs/control/local/harness/checks.json made both completions exit 1 for met and unmet ledgers before the promised advisory, because recordGateChecks ran unguarded before requireGateClaims",
    "scripts/test-runner.mjs: the gate calls recordGateChecks after every task and its main catch sets exit 1, so with an unwritable index the inline document gate exits 1 whatever its tasks did",
    "scripts/lib/lifecycle-evidence.mjs (guarded row write, gateIndexError returned to executor completions only), scripts/lib/handoff-ledger.mjs requireGateClaims (gateIndexError option, lookup), scripts/resume.mjs (both completions destructure gateIndexError out of the evidence they append)",
    "scripts/test-off-ramps.mjs, new cases WO-106 and WO-107: implementation-ready and repair-complete, each with a met and an unmet ledger, under three damaged live indexes (`not json`, a directory where checks.json belongs giving EISDIR, and `{\"rows\":[]}` giving Malformed host gate evidence); each records, prints exactly one `Gate index unavailable` advisory, carries it in the event's advisories, leaves the damaged bytes or directory as they were, carries no gateIndexError and no productGate in the event, and does not run a document stub that would have failed; verification-result under a damaged index records with one advisory. The archive-only case from the implementation still passes with its one advisory",
    "node scripts/test-runner.mjs --only resume: 2 passed, 0 failed, 34.78 s, 2026-09-28 after the last code edit",
    "Negative controls, 2026-09-28, in session scratch: the current scripts/test-off-ramps.mjs over the current scripts and package sources with one file from refs/dotln/checkpoint/WO-173/6. Old scripts/lib/lifecycle-evidence.mjs: exit 1 at `implementation-ready under not json`, printing `error: Unexpected token 'o', \"not json\n\" is not valid JSON`. Old scripts/lib/handoff-ledger.mjs: exit 1 at the same case, `criterion 1 recorded met names npm run test:docs, and the document gate failed`",
    "npm test -- --review: 37 suites, 642.41 s, recorded 2026-09-28T21:45:15.891Z, code identity 605f737de6a1f4e814af0577cfa7593e16687710b7aa4065542d425067c3c056, host-gate:605f737de6a1f4e814af0577cfa7593e16687710b7aa4065542d425067c3c056:npm test",
    "readGateChecks: the first product gate row recorded 2026-09-28T20:25:29.740Z, 660302 ms, exit 1, code identity 1a453c200e4381887dc408ca684686a77bc029b6b9126283aba56425bcd0d211, failed suites beacon-portability, configuration-root, runner-fixtures and process-debt; its start by recorded time minus duration, 20:14:29.438Z, matches the concurrent matrix run (VER-001 N2, WO-173-D014). docs/evidence/WO-173/matrix-durations.json besideGate now names that row and keeps the passing rerun of 20:50:02.516Z as laterPassingGate, not a companion",
    "node scripts/authority-evidence.mjs --check, feedback-evidence.mjs --check, artifact-identity-evidence.mjs --check, verification-evidence.mjs --check, harness-evidence.mjs, harness.mjs check and harness-context.mjs --check all pass at the repaired subject: no edition is stale and none is re-minted",
    "Register rows this repair discharges: FUP-96091899814ccd0c (WO-173-D012) and FUP-c3cabf64e06999db (WO-173-D014); their conditions occurred, and the final review disposes them"
  ],
  "rationale": "Mission and critical path: a handoff is the step the operator's flow depends on, and local evidence storage is bookkeeping around it; this closes the only blocking finding. Policy resistance: the guard sits at the one write that ran before the advisory route, not at each reader, so the two routes can no longer undo each other. Shifting the burden: without it the operator repairs local storage before any executor can hand off. Rule beating: the implementation's fixture damaged an archive and passed while the live index still blocked; the new cases damage the live file three ways, and the document-gate case shows a stub that would fail is not run. Drift: the rule names what may refuse, so a second refusal path is a visible regression. Escalation: no refusal or gate is added. Commons: one product gate at the final code. Success to the successful and seeking the wrong goal: the outcome is a recorded handoff whose advisory says which claims stand unverified, not a silent pass. Naive Interventionism: gate-evidence.mjs and the runner's exit contract are unchanged, the damaged file is preserved, and the change reverses by reverting three functions. NoOp leaves both completions blocked under an input criterion 2 declares. Left as it is: final-review-result with a passing verdict still reads findGateCheck and refuses on an unreadable index; that is the reviewer's publication lookup, outside the executor completions this finding names, and publication needs the row anyway.",
  "rejected": [
    {
      "option": "Make the runner exit 0 when it cannot record its row",
      "reason": "It changes the product gate's contract for every npm test run; a passing exit without its row would look like evidence that does not exist."
    },
    {
      "option": "Run the document gate anyway and read its task lines to tell a failed task from a failed record",
      "reason": "It binds the completion to the runner's output lines, and the run can only end in an exit the completion cannot trust."
    },
    {
      "option": "Probe the index with readGateChecks before the claims",
      "reason": "It reads archives the writer never reads, so a damaged archive would skip a document gate that can run and record its row."
    },
    {
      "option": "Guard the diff row only for the executor completions",
      "reason": "It would keep a refusal on bookkeeping storage at the verifier's and reviewer's completions, which the 2026-09-15 stand-down removed from transitions."
    },
    {
      "option": "Change packages/skeleton/src/gate-evidence.mjs",
      "reason": "A non-goal of the order."
    }
  ],
  "reopenWhen": "A completion refuses on gate storage it cannot read or write, the runner's recording contract changes, or a reviewer's completion is observed refused by damaged local storage while the row it needs exists."
}
```

## WO-173-D016 — Correction: comments labelled with a finding identifier

```json
{
  "id": "WO-173-D016",
  "date": "2026-09-28",
  "dispatch": "resume: fix; the operator's correction during the repair",
  "kind": "correction",
  "decision": "An error of this repair: its first comments labelled code with a report-local finding identifier (`VER-001 F1`) instead of only stating the rule. The label means nothing once the order closes, since every order has a VER-001. The comments now state the rule alone. The same kind of label stands in 45 comment lines across 25 files outside this order's diff; this order does not widen to them and names them for a cleanup pass.",
  "misread": "The executor followed the codebase's habit of tagging a comment with the finding that prompted it and took the label for useful provenance.",
  "meant": "A comment says what the code holds and why. Provenance belongs in the decisions file, which already records it with its source.",
  "changed": "Removed `VER-001 F1` from the new comments in scripts/lib/lifecycle-evidence.mjs, scripts/lib/handoff-ledger.mjs and scripts/test-off-ramps.mjs, and a bare decision label `(D011)` from a fixture comment this order added; rewrote each to state its rule, and rewrote one unclear comment of this repair.",
  "evidence": [
    "The operator's correction during this repair, on the comment `// VER-001 F1:`; the operator then asked that the report mark this comment cruft as an error",
    "grep -rcE '(//|\\*).*(VER|FINAL)-[0-9]{3} F[0-9]' scripts packages/skeleton/src packages/skeleton/test packages/console/src on 2026-09-28 after the edits: 45 lines in 25 files, none in this repair's new comments",
    "This order's own diff keeps `WO-NNN` tags and `WO-NNN-DNNN` citations in comments, the codebase's convention; the operator has not said whether they belong to the same class, and they are left as they are"
  ],
  "rejected": [
    {
      "option": "Remove the labels across scripts/ and packages/ in this repair",
      "reason": "Twenty-five files outside this order's files; the order may not widen, and the class boundary for WO-NNN tags is the operator's to set."
    },
    {
      "option": "Keep the label beside the rule as provenance",
      "reason": "The decisions file already carries the provenance with its source; in code the label is noise that outlives its meaning."
    }
  ],
  "followup": "Planning: remove report-local finding labels (`VER-NNN Fn`, `FINAL-NNN Fn`, bare `Dnnn`) from code comments in scripts/ and packages/, keeping the rule each comment states; 45 lines in 25 files by the grep this decision records, bare decision labels not yet counted. Ask the operator whether `WO-NNN` tags and decision citations in comments are the same class before widening to them.",
  "reopenWhen": "The operator widens or narrows the class, or a later order adds such a label to a comment."
}
```

## WO-173-D017 — Filler removed from the briefing text this order adds

```json
{
  "id": "WO-173-D017",
  "date": "2026-09-28",
  "dispatch": "resume: fix; operator steering during the repair: the byte overage stays waived, and filler may be removed",
  "decision": "Remove filler from the verify and final-review text this order adds, keeping every required sentence, both routes and the full waiver command. The off-ramp sentence drops `its operator capture` (the capture hash already names it). The verify sentence says `the declared criteria` for `what the order's criteria declare`. The unmet disclosure drops the event ordinal (the status projection keeps it) and `the reason is on that line of` (a ledger line always carries its reason), and folds `Two routes spare the cycle` into one clause. The disclosure also leaves out a criterion the record already waives: after a waiver it offered the waiver again, a defect of this order's disclosure met during the repair. The repair and ledger sentences had no filler and are unchanged. Criterion 5 stays unmet, waived by ordinal 4.",
  "evidence": [
    "UTF-8 bytes before and after, one unmet criterion and a two-digit ordinal: disclosure 441 to 388; verify's fixed text 286 to 253; final-review's fixed text 130 to 109; verify with one unmet criterion 726 to 640, final-review 570 to 496, against HEAD",
    "scripts/resume.mjs unmetBriefing reads state.waivedCriteria; scripts/lib/control.mjs folds unmetCriteria without regard to waivers, so the projection is unchanged and only the briefing filters",
    "scripts/test-off-ramps.mjs: the WO-101 final-review briefing after the verifier's waiver carries the off-ramp sentence and no disclosure; WO-103, whose executor recorded criteria 1 to 3 unmet and whose verifier judged them met, gets the disclosure with both routes and the <criterion> form of the command in its final-review briefing; the resume suite passed after the edit",
    "No product document, role text or other fixture quotes the removed words (grep over scripts, packages/skeleton, docs/product, .claude and .agents)"
  ],
  "rationale": "Commons: every verify and final-review dispatch pays these bytes. Rule beating: the pins are exact text, so a removed route or command fails the resume suite. Seeking the wrong goal: the byte figure is waived and is not the aim; only words that carry nothing are removed. The other lenses do not apply to a wording change. NoOp would keep text the operator called removable.",
  "rejected": [
    {
      "option": "Shorten the waiver command to its verb",
      "reason": "The flags are what a verifier needs to record the waiver in one step; they are information, not filler."
    },
    {
      "option": "Trim until the 400-byte bound holds",
      "reason": "The operator waived the bound (ordinal 4) and allowed only filler removal; meeting the number would cut the routes."
    }
  ],
  "reopenWhen": "The operator reopens the waiver of criterion 5, or a verifier cannot act on the disclosure as written."
}
```

## WO-173-D018 — Final review passes and boards a reused row that never ran an untracked file's bytes

```json
{
  "id": "WO-173-D018",
  "date": "2026-09-28",
  "dispatch": "resume: final review",
  "decision": "Pass FINAL-001 and board one defect this review met. The npm test reuse lookup (scripts/test-runner.mjs runGateChecks through scripts/lib/gate-reuse.mjs coveringGateCheck) and the executor completion's npm test claim check (scripts/lib/handoff-ledger.mjs requireGateClaims) key on gateCodeIdentity, which hashes the working-tree bytes of tracked paths only. An order's new source files stay untracked until the final review stages them, so an edit to one after a passing row moves neither the identity nor the gate: npm test prints the old row and exits 0, and a met npm test claim stands on it. Before this order every npm test ran and the identity was read only after staging, so the gap is reachable because of this order. It is boarded, not failed: criterion 4 and operator-review assumption 2 state the rule in terms of the code identity, which the non-goals leave to gate-evidence.mjs; publication is unaffected, since the final review stages the order's files before its gate, which then runs fresh; and this order's own row covers its bytes. The fix changes what every executor's npm test does and is a planning choice.",
  "evidence": [
    "packages/skeleton/src/gate-evidence.mjs gateCodeIdentity without a revision: entries from git ls-files -z, bytes read from the working tree; untracked paths are never hashed",
    "Session-scratch probe on 2026-09-28 through gateCodeIdentity: adding and then editing an untracked scripts/new.mjs left the identity unchanged; editing the tracked scripts/a.mjs changed it",
    "Session-scratch reproduction on 2026-09-28 through the real runGate of scripts/test-runner.mjs in a disposable repository: a tracked product suite imports an untracked scripts/helper.mjs; the first run passed and recorded a row; after helper.mjs was edited to return a wrong value the identity was unchanged and npm test printed the reuse line and exited 0 with no suite started; npm test -- --again then ran the selection and exited 1 with `Error: helper returned 2`",
    "This order's subject: the untracked sources' modification times (scripts/lib/handoff-ledger.mjs 21:29:32Z, scripts/lib/gate-reuse.mjs 20:35:12Z, the role baseline fixture 20:25:58Z) precede the inferred 21:34:33Z start of the 21:45:15.891Z row VER-002 reused; staging them at this review moved the identity from 605f737d… to 702823eb…, and the review gate ran every suite",
    "docs/verifications/WO-173/VER-001.md and VER-002.md each record that the identity does not hash untracked new source; neither routes it"
  ],
  "rationale": "Mission and critical path: a reused row must stand for the bytes a judge is judging, or the reuse moves failures from the executor's gate to the final review's. Rule beating is the lens that finds it: an executor, or a verifier who trusts the reuse, can hold a green row for bytes no suite ran. Shifting the burden: the final review's staged gate catches it before publication, so the cost is a wasted verification cycle, not a shipped regression. Policy resistance and escalation: refusing reuse whenever an untracked source exists would restore a ten-minute gate for every order that adds a file until final review; recording a digest of those files changes the row every consumer reads; either is a gate-contract choice the order fenced. Commons: the saving the lookup brings holds for every order whose new files are unchanged since its last row. Naive Interventionism: a fix at review would change gate behaviour after two verifications and without one. NoOp would leave the gap unrecorded; both verifiers noted the identity's limit and neither boarded it.",
  "rejected": [
    {
      "option": "Fail the review on criterion 4 and route a repair",
      "reason": "Criterion 4 names the cases against the code identity, which the order adopts as the gate's evidence (assumption 2) and whose definition it leaves unedited; the subject meets the criterion as written, and publication is protected by the staged gate."
    },
    {
      "option": "Fix the lookup in this review",
      "reason": "Either repair changes the runner's reuse rule or its row shape; that is not an adjacent cleanup, and it would need its own verification."
    }
  ],
  "followup": "Planner: close the untracked-source gap in npm test reuse. scripts/test-runner.mjs runGateChecks and scripts/lib/handoff-ledger.mjs requireGateClaims reuse or accept a passing npm test row by gateCodeIdentity, which hashes tracked paths only, so before the final review stages an order's new source files an edit to one after a passing row reuses that row. Choose between refusing reuse while an untracked file the identity would hash once staged exists, and recording a digest of those files beside the row and requiring it to match; add a fixture in which an untracked helper a product suite imports regresses after the row. Until then, a role that edited an untracked source file after the latest row runs npm test -- --again and says why.",
  "reopenWhen": "A verifier or reviewer finds a reused npm test row that did not run an untracked file's current bytes, or a planning pass opens the reuse lookup or gate reliability."
}
```
