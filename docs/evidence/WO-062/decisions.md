# WO-062 decisions

## WO-062-D009 — Repair scope and main integration authorization

```json
{
  "id": "WO-062-D009",
  "date": "2026-10-02",
  "dispatch": "resume: fix; scope expand: merge in main as well",
  "decision": "Repair VER-001 F1 and F2 under D008's five rules, and integrate current origin/main through worktree integrate before the repair gates. Preserve the original acceptance criteria, immutable verification report, checkpoint, named stash and intake backup. Reuse D001's existing economy choice; do not start a second experiment.",
  "authorization": "The operator said: scope expand: merge in main as well. This adds upstream integration and its conflict, release and evidence reconciliation; it does not authorize publication or unrelated behavior changes.",
  "evidence": [
    "Canonical status selects WO-062 in needs-fix with VER-001 fail; npm run resume -- fix records repairing and reserves this Codex session's writer",
    "VER-001 F1 and F2 and D008 identify historical text stored as current sections and missing per-comment role-omission records",
    "07 Independent workflows and integration and scripts/lib/worktree-integration.mjs admit the canonical helper in repairing, preserving checkpoints, stash and ignored intake before merging fetched main",
    "D001 already declines a persistent fake-gh service in favor of isolated recorded-shape replay"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Give WO-123 faithful screened external input and a tested integrated branch without recurring operator recovery.",
    "traps": {
      "policyResistance": "Use the canonical repairing integration route and retain the immutable failed report.",
      "tragedyOfTheCommons": "One writer and no subagents; run the final gates once the integrated repair is ready.",
      "driftToLowPerformance": "Pin current-content fidelity and per-item omissions rather than relying only on decodability.",
      "escalation": "Use existing integration, replay and gate procedures; add no approval or process layer.",
      "successToTheSuccessful": "Reconsider the history mapping on observed API evidence despite its earlier passing fixtures.",
      "shiftingTheBurden": "Resolve the owned repair and integration conflicts here before handing the adapter to its consumer.",
      "ruleBeating": "Test realistic full-version history and inspect every persisted file for withheld text.",
      "seekingTheWrongGoal": "The outcome is faithful source input on current main, not a green projection alone."
    },
    "naiveInterventionism": "Preserve source screening, immutable storage and current-content order; record both integration bases and test affected claims. Recovery refs and the named stash keep the change reversible.",
    "noOp": "Leaves the verified defects and ignores the operator's explicit integration request; reject. Reopen the approach only on a concrete integration or contract conflict."
  },
  "rejected": [
    {
      "option": "Manual stash/merge or discard local work",
      "reason": "The canonical helper already preserves the work and handles generated projections."
    },
    {
      "option": "Defer F1/F2 or change their acceptance obligations",
      "reason": "The defects are within this order's existing repair authority and block faithful downstream input."
    }
  ],
  "reopenWhen": "Integration reveals a behavioral conflict that cannot be resolved within the selected order and the authorized upstream merge."
}
```

## WO-062-D001 — Economy choice

```json
{
  "id": "WO-062-D001",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep recorded JSON replay through an inline fake gh in isolated temporary directories; decline a persistent fixture service.",
  "question": "Would a persistent fake-gh service reduce fixture preparation enough to justify another test mechanism?",
  "alternatives": [
    "Inline fake gh replay, following scripts/test-target-publish.mjs",
    "A persistent fixture service behind gh"
  ],
  "observation": "executeGh uses spawnSync for every invocation. The existing suite writes an inline fake gh and isolates scenario state. A service would still require that subprocess boundary and adds lifecycle work without an observed saving.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "The required source reads establish the existing pattern covers the boundary. No service or timing trial was prepared.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": [
      "Read scripts/lib/github-repository.mjs and scripts/test-target-publish.mjs"
    ],
    "source": "No trial execution; required source-reading time was not separately measured."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test packages/skeleton/dist/test/github-issue-source.test.js"
    ],
    "summary": "No measured efficiency improvement claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/lib/github-repository.mjs executeGh uses spawnSync",
    "scripts/test-target-publish.mjs writes inline gh with isolated scenario state"
  ],
  "rejected": [
    {
      "option": "Persistent fixture service",
      "reason": "It retains the subprocess and adds lifecycle work without a measured benefit."
    }
  ],
  "reopenWhen": "Measured fixture setup dominates the assertions and a bounded alternative can preserve process and store isolation."
}
```

## WO-062-D003 — API fields, missing evidence and observed smoke

```json
{
  "id": "WO-062-D003",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Read named GraphQL issue/comment fields and their userContentEdits, paginating every connection independently. Include first edit pages in the source query and request further pages only when pageInfo says more. Bracket the read with equal issue/discussion snapshots before storage. As corrected by D008/D011, diff carries full versions in the observed API, newest first with the newest equal to current text. Screen versions without storing their text; record text-free history and conservative whole retained subject spans in current coordinates. Keep only current title/body/comments in sections and discussion. Preserve inline image markup and spans from retained current text, with image-byte hashes unavailable. Name each comment omitted for an undetermined role in the receipt and stop the result.",
  "evidence": [
    "Context7 library lookup selected /websites/cli_github_manual (high reputation, 1443 snippets, 85.25 score); docs query returned https://cli.github.com/manual/gh_api for hostname, raw/typed variables and connection cursors",
    "Installed gh issue view --help lists body, comments, author and updatedAt but no edit-history field",
    "The GitHub GraphQL Users reference describes nullable UserContentEdit.diff as a summary. That wording does not establish a shortened description: VER-001 observed 11/11 edited subjects and history-observation.json observed 14/14 with full newest-version text equal to the current body. Earlier versions are full text. D008 records the original misread and D011 repairs it.",
    "The operator named one public issue and its comment in this session. A read-only metadata query confirms public=true, revisionPresent=true and 100 comments; the public smoke's record reduces identifiers to shapes",
    "fixture-tests.txt: 11 tests pass, including all ten WO-060 shape/form cases in bodies, comments and history; failed reads produce no store; independent pagination, changed snapshots, canonical bytes and immutable storage are exercised",
    "smoke.json: two live fetches hashStable=true, receiptStable=true, bundleDecodes=true, namedCommentObserved=true, 79 retained comments, 47 screen findings and 181 resolved spans. status=stopped preserves the omissions instead of claiming complete input.",
    "Repair: repair-fixture-tests.txt pins current-only content and per-comment omissions on the observed full-version shape; smoke-repair.json records stable repaired bundles and receipts. Earlier fixture/smoke counts below describe the superseded pre-repair subject only."
  ],
  "rejected": [
    {
      "option": "issue view JSON alone or one request for every first edit page",
      "reason": "The CLI fields omit history; inline connections supply it with less unnecessary remote work."
    },
    {
      "option": "Hash image URLs as image contents, download outside-forge images, or compute precise historical diff offsets in this order",
      "reason": "The API supplies no verified image-byte hash and the allowlist is forge-only. Full prior text exists, but exact current-coordinate change mapping is unnecessary for these obligations; conservative whole retained subject spans are chosen explicitly."
    },
    {
      "option": "Hide unavailable fields or treat omissions as ready",
      "reason": "Would create unsupported source completeness and author-role claims."
    }
  ],
  "reopenWhen": "A downstream consumer requires verified image contents or finer current-coordinate change coverage, GitHub changes observed version semantics or a declared field, or a changing discussion escapes the snapshot check."
}
```

## WO-062-D004 — Corrections before final gates

```json
{
  "id": "WO-062-D004",
  "kind": "correction",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Correct the initial type narrowing and the incomplete economy decision schema; refresh the two source locks after the authorized Ports edit. Keep the existing decoder and publication checks.",
  "misread": "The initial implementation assumed a never-returning arrow call narrowed both an unknown array and the decoder union. The economy record supplied alternatives but omitted the evidence and rejected fields the meter requires.",
  "meant": "Use explicit return from the never path for TypeScript's narrowing, and provide the established decision fields. A changed linked product section needs refreshed publication source locks.",
  "changed": "Added the two return statements, D001 evidence/rejected choices and current lock identities. Missing issue-author review also now omits undetermined human roles, with a fixture assertion.",
  "evidence": [
    "First npm run build failed with TS2488 at pageNodes and TS2339 at result.findings; the corrected build exits 0",
    "First release prepare --local refused D001's incomplete decision schema before writing any release assignment",
    "publication:check after the Ports edit reports exactly two stale source locks and no missing indexed heading"
  ],
  "rejected": [
    {
      "option": "Suppress type errors, weaken the meter or skip publication freshness",
      "reason": "The small implementation/record corrections satisfy existing contracts."
    }
  ],
  "reopenWhen": "The relevant build, meter or publication check finds another unsupported assumption."
}
```

## WO-062-D002 — Contract and exposure boundary

```json
{
  "id": "WO-062-D002",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Implement the first SourceAdapter as a skeleton module using the kit-relative bridge to executeGh and parseGitHubTarget. Keep WO-060's declared screen and its forge-host allowlist. Store a consumable omission receipt with the canonical bundle and return a typed stop when an item was refused. Keep ModelInputPlan outside this adapter's contract: it performs deterministic reads and local storage and invokes no model.",
  "evidence": [
    "WO-062 objective, design, six criteria and non-goals; WO-060 contract and WO-065's per-comment screen",
    "ADR-0002 Decision 2 makes work-shaped verticals ports and keeps the enterprise tracker outside core",
    "dotln.ts imports script modules relative to the installed kit rather than the caller's cwd; executeGh removes GH_REPO and GH_HOST",
    "09 Privacy and minimization requires text-free omission metadata; 09 Candidate — model-input exposure plans concerns invocation boundaries",
    "FUP-0113's latest disposition reopens at WO-062 activation; the planning map's WO-062 known issue requires the omission receipt to stay consumable across WO-123's stop",
    "Product 03 at entry is 174319 UTF-8 bytes against ceiling 176132, leaving 1813 bytes. The order permits at most 300 bytes in the SourceAdapter bullet."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Supply immutable screened tracked-work input for WO-123's source-to-deliverable loop, replacing hand-written source input without claiming the composed loop.",
    "traps": {
      "policyResistance": "Reuse the helper and existing screen rather than competing target or privacy rules.",
      "tragedyOfTheCommons": "One writer, no subagents, fixture-only tests and one on-demand live smoke; record observed cost.",
      "driftToLowPerformance": "Unreadable fields refuse with their paths and no stored output; missing declared fields remain explicit.",
      "escalation": "No daemon, polling, new gate or approval ceremony.",
      "successToTheSuccessful": "Considered direct REST and script-side placement; the selected port is consumed in process by the skeleton and reuses the existing CLI boundary.",
      "shiftingTheBurden": "Typed results and omission receipts make downstream stops machine-readable rather than dependent on operator interpretation.",
      "ruleBeating": "Replay through a real fake-gh process, inspect persisted bytes, and run the real read-only public smoke twice.",
      "seekingTheWrongGoal": "The interface and stable input are the outcome; transcript volume is evidence only."
    },
    "naiveInterventionism": "The additive module preserves current compiler/helper behavior, uses the declared screen unchanged and adds no remote mutation. Smallest probe is recorded JSON before the public issue read.",
    "noOp": "Leaves the external-source prerequisite absent; action wins because the bundle contract and read helper already exist."
  },
  "rejected": [
    {
      "option": "Direct REST or ensureGh",
      "reason": "The order selects executeGh; ensureGh requires a local checkout and frames remote mutation."
    },
    {
      "option": "Keep rejected text or claim complete input without its receipt",
      "reason": "Violates the privacy boundary and hides an omission from consumers."
    },
    {
      "option": "Implement ModelInputPlan now",
      "reason": "No model invocation exists in this adapter and the order explicitly excludes it."
    }
  ],
  "registerReading": {
    "id": "FUP-0113",
    "observation": "WO-062 activation occurred. Deterministic read/store needs no ModelInputPlan; reopen the existing candidate at the first consuming model invocation or proposed private-material reader, without claiming that future boundary implemented."
  },
  "reopenWhen": "WO-123 consumes the adapter, a model/private-material boundary is proposed, a declared screen misses stored credential material, or the omission receipt is bypassed."
}
```

## WO-062-D005

```json
{
  "id": "WO-062-D005",
  "date": "2026-10-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.64.0, the next minor above the observed release baseline v0.63.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.63.1 (local tags)",
    "minor classification declared in docs/work-orders/WO-062-github-issue-source-adapter.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-062-D006 — Final implementation and bounded write-backs

```json
{
  "id": "WO-062-D006",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Keep the additive adapter and its typed omission stop. Reject duplicate source/edit IDs even when text is omitted, using the source ID field's path, and order revisions by declared edit timestamps with node-ID tie breaks. Bump only the skeleton from 0.49.2 to 0.50.0 for the new exported adapter interface, updating the console pin and lockfile. Keep the compiler, kernel, console and harness-host component versions. Refresh the bounded SourceAdapter bullet and both publication locks. No registered behavioral source imports the new module, so no evidence edition is re-minted.",
  "evidence": [
    "Read-own-output review found duplicate IDs were checked only when adding retained text; the fixture now checks the actual comments.nodes[1].id path, and the read checks IDs independently of retention",
    "The interleaved pagination fixture includes an issue edit after a comment's edits; history and revisions are pinned to 10:01, 10:04, 10:05, 10:06 rather than connection traversal order",
    "fixture-tests.txt after the review changes: all 11 tests pass; no test relies on the network",
    "smoke-002.json after the final build: both live fetches hashStable=true, receiptStable=true, namedCommentObserved=true and bundleDecodes=true; 100 source comments, 79 retained, 40 edit records, 11 image references and 181 resolved spans. All 47 findings are scheme-authority refusals; no fields are absent. The first smoke record is preserved",
    "Product 03 measures 174319 bytes at base and 174525 now: +206 against the order's +300 bound, ceiling 176132, remaining 1607; no ceiling changes",
    "publication:check passes 253 indexed headings and current 29/45 linked-section locks after refreshing exactly the two lock lines",
    "The dependency diff changes exactly the skeleton component version and console's existing skeleton pin in package manifests/lockfile; no dependency added",
    "scripts/lib/evidence-sources.mjs registers explicit import closures; no registered source imports github-issue-source.ts. Existing edition package-label normalization makes these version-only manifest changes non-behavioral",
    "release prepare --local assigned v0.64.0 above local v0.63.1 and recorded D005; publication controls remain private and release check-surfaces retains their refusals. The final surface check runs after staging the new source so it is compared."
  ],
  "rejected": [
    {
      "option": "Retain traversal order as chronological history or locate a duplicate ID at a body field",
      "reason": "Neither is supported by the declared edit timestamps or the API field holding the ID."
    },
    {
      "option": "Bump every component, register an unconsumed module or re-mint unchanged behavior",
      "reason": "Only the skeleton interface changes; extra labels/editions would add churn without a changed judged consumer."
    }
  ],
  "reopenWhen": "A registered source begins consuming the adapter, a declared criterion fails, a downstream consumer needs another image/history contract, or integration changes the release baseline."
}
```

## WO-062-D007 — Executor outcome and handoff

```json
{
  "id": "WO-062-D007",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Record all six bounded criteria met and hand the adapter to independent verification. Keep its explicit omission stop and unavailable image/hash/history evidence; do not claim the downstream source-to-deliverable loop. Complete reports and index preparation before the ImplementationReady event.",
  "evidence": [
    "Canonical npm test row recorded 2026-10-02T00:40:02.345Z: exit 0, 29 suites passed, no failed cases, 74 fresh tasks, 421672 ms; main process also exited 0",
    "Canonical npm run test:docs row recorded 2026-10-02T00:32:39.643Z: exit 0, 24 suites passed, no failed cases, 24 fresh tasks, 39464 ms",
    "Both rows and the current gateCodeIdentity bind bb3431d1ecd623b10bcf90a31586173ab6062b78597f7fd2443efa046f522115; gate-summary.json records the selected canonical rows rather than inferred completion",
    "fixture-tests.txt passes all 11 focused tests; smoke-002.json reproduces both live hashes, resolves 181 spans and explicitly stops on its 47 declared URL findings",
    "The six criterion judgments in handoff.md cite their executable evidence. implementation.md records consumer obligations and API limits; D002 records FUP-0113's existing reopening boundary",
    "npm run adjacent --silent -- list observes revision 0 with no items; collaboration inventory contains only the root coding agent"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The external-source prerequisite now exists as immutable screened input for WO-123. No composed product outcome is claimed before that consumer executes.",
    "traps": {
      "policyResistance": "Existing helper and screen remain unchanged; fixtures establish the selected forge host is the sole allowlist.",
      "tragedyOfTheCommons": "One writer and no subagents; fresh product/document gate durations and live-smoke time are recorded. USD and unmeasured savings remain unknown.",
      "driftToLowPerformance": "Malformed fields refuse at their actual paths, absent fields are explicit and fixture store searches establish omitted text is not persisted.",
      "escalation": "No daemon or new gate was introduced. The existing canonical wait ended with a passing row and process exit; no background monitor remains.",
      "successToTheSuccessful": "The kit-relative existing CLI boundary proved adequate in fake and public reads; no additional service or dependency was adopted without evidence.",
      "shiftingTheBurden": "The public smoke stops on omissions and the consumer guard names the incomplete item, preserving the downstream obligation in machine-readable form.",
      "ruleBeating": "Both required gates ran fresh at the current code identity; two actual public fetches and persisted-byte fixture assertions support the claims.",
      "seekingTheWrongGoal": "Stable external input is delivered, while unavailable image-byte hashes and precise prior-content reconstruction are explicit limits rather than invented completeness."
    },
    "naiveInterventionism": "The bounded additive port and +206-byte Ports edit meet the recorded contract without changing existing decoder/helper behavior or invoking a model.",
    "noOp": "Would leave WO-123 without a tracked-work source; the measured fixture/live evidence supports the implemented prerequisite. Independent verification remains necessary for the next phase."
  },
  "rejected": [
    {
      "option": "Repeat the passing product gate after report-only writes",
      "reason": "Reports and indexes do not change the code identity; completion checks the final document bytes inline."
    },
    {
      "option": "Claim ready input for the public smoke or declare the downstream loop complete",
      "reason": "The recorded omissions require a stop and no downstream episode ran."
    }
  ],
  "reopenWhen": "Independent verification finds a criterion failure, a consumer bypasses the omission receipt, registered behavior begins importing the adapter, or integration changes the judged subject."
}
```

## WO-062-D008 — Verification: edit history carries full versions, so the mapping is repaired in the order

```json
{
  "id": "WO-062-D008",
  "kind": "correction",
  "date": "2026-10-02",
  "dispatch": "resume: verify",
  "decision": "Fail VER-001 so that WO-062 repairs its edit-history mapping in the order. This applies the operator's rule that a repairable defect inside an order's declared surfaces is fixed in the order (WO-179 item 15). All six criteria are met on their stated properties. GitHub's UserContentEdit.diff holds the full text of each version, and the newest one equals the current text. The adapter stores each retained diff as a document-order section. As a result the bundle duplicates current text, presents prior full versions as current sections, and keeps a withheld comment's current text through its newest edit. A second, lower finding: when the issue author is unavailable, the receipt does not name the human comments the adapter leaves out.",
  "misread": "D003's evidence, implementation.md, the handoff and the module comments read UserContentEdit.diff as 'a summary, not full prior content'. That reading came from the documentation's description of the field. The replay fixture encodes it with short change summaries.",
  "meant": "Observed through gh api graphql on a public repository: 11 of 11 sampled edited subjects (5 issue bodies, 6 comments) list userContentEdits newest first. In each, the newest diff equals the current body exactly, and the older diffs have whole-version lengths and no diff markers.",
  "changed": "This record and VER-001 only. No source, fixture or earlier record changed; the repair belongs to the order's fix dispatch.",
  "evidence": [
    "docs/verifications/WO-062/VER-001.md",
    "Read-only gh api graphql (gh 2.98.0) on the public cli/cli repository: 5 of 5 issue bodies and 6 of 6 comments with at least two string diffs list userContentEdits newest first, and the newest diff equals the current body. The older diffs have whole-version lengths, for example 17219, 16796, 16171 and 16163 characters for one body, and none carries diff hunk markers",
    "packages/skeleton/src/github-issue-source.ts lines 581-593 add each non-null diff as a section edit:<id> through add(). Lines 631-657 leave out a comment whose role cannot be determined but still run readHistory on its edits. The comments at lines 21-23 and 600-601 describe the diffs as summaries",
    "Realistic-shape replay through the order's fake gh against packages/skeleton/dist at code identity bb3431d1ecd623b10bcf90a31586173ab6062b78597f7fd2443efa046f522115. The bundle decodes, spans resolve and the hash is stable. The sections hold a copy of the current body, a copy of an edited comment's current text, and a prior full body. A comment with an unavailable author keeps its current text in the store. A refused current body leaves the prior full body as a section",
    "Live run of the order's docs/evidence/WO-062/smoke.mjs against a public cli/cli issue: two fetches, hashStable and receiptStable true, bundle decodes. Of its 4 retained edit sections, 2 equal current comment text and 2 are prior comment versions",
    "Fixture with the issue author set to null: both human comments are left out, and the receipt's only entry is $.data.repository.issue.author, reason unavailable"
  ],
  "reopens": {
    "decisionId": "WO-062-D003",
    "observation": "D003 kept edit summaries as screened sections. It also rejected reconstructing change offsets because the API did not establish prior full content. The API does supply each version's full text, so both the section placement and the rejection rest on a misread premise."
  },
  "rejected": [
    {
      "option": "Pass and board the defect for WO-123",
      "reason": "The defect sits in the adapter, its fixture and its records, which are all declared surfaces of this order. WO-179 item 15 routes such a defect to repair in the order. Boarding it would hand WO-123 a misleading input on the critical path."
    },
    {
      "option": "Judge criterion 1 unmet because the fixture is invented rather than recorded",
      "reason": "The criterion's stated properties hold on the fixture, on a realistic-shape replay and on two live public reads: the bundle decodes, its spans resolve, its hash is stable and the forge link is kept. The fixture's fidelity is named in the repair rule instead."
    },
    {
      "option": "Repair the mapping during verification",
      "reason": "A verifier does not edit implementation to turn its own verdict green."
    }
  ],
  "goalAlignment": "Mission and critical path: WO-062 supplies WO-123's source input on the route to the first real external source change. Repairing the bundle shape while this order owns its surfaces costs one fix cycle and one re-verification, which is less than WO-123 diagnosing stale sections. Policy resistance: this follows WO-179's reconciled rule rather than the older 'board, do not fail' text, so the two do not undo each other. Commons: no gate was rerun, because the executor's passing npm test row is at the unchanged code identity; the live reads were a handful of read-only queries. Drift to low performance: a recorded claim that executable evidence contradicts is corrected, not normalized. Escalation: no new gate or rule. Success to the successful: the verdict rests on observed API output, not on the executor's reading of the documentation or on the met criterion lines. Shifting the burden: the order that owns the defect repairs it, rather than WO-123's consumer. Rule beating: criteria met on their properties do not license a mapping that misstates the source. Seeking the wrong goal: the outcome is a faithful screened input, not green criterion lines. Naive Interventionism: the verifier edits no source. NoOp: passing would carry false records and a misleading bundle shape into final review and WO-123.",
  "followup": "Executor, in WO-062's repair (resume: fix after VER-001). The repair must hold five rules. (1) The bundle's sections and discussion hold only the issue's current title, body and comments. No prior version and no copy of current text appears as a section or entry. Edit history is expressed through revisions and the text-free receipt history. The executor chooses and records the change spans: either conservative whole-subject spans or spans computed between consecutive versions. (2) Text withheld from the bundle, by a screen refusal or by an undetermined author role, appears in no stored file, including through an edit version. (3) The receipt names each comment left out because its role cannot be determined, by local id or API path and a reason, without its text. (4) The replay fixture's userContentEdits follows the observed gh shape: newest first, the newest diff equal to the current text, the older diffs full versions. Tests pin rules (1) to (3) on that shape. (5) D003, implementation.md, the handoff and the module comments state the observed field semantics. Priority: before final review.",
  "reopenWhen": "GitHub changes the semantics of UserContentEdit.diff, or the repair finds a WO-060 contract slot for historical text that a consumer needs."
}
```

## WO-062-D010

<!-- integration refs/dotln/checkpoint/WO-062/6 -->

```json
{
  "id": "WO-062-D010",
  "date": "2026-10-02",
  "dispatch": "resume: fix; worktree integrate WO-062",
  "decision": "Integrate fetched main during the operator-authorized repair: fast-forward from a3da7127 to 2bae7d40, then reapply preserved local work. No authored conflict or integration-specific behavioral resolution was needed. Retain recovery checkpoint and named stash. Carry the original acceptance obligations forward, repair F1/F2 separately under D011, and rerun product/document gates on the integrated result. Application minor target retimed to v0.65.0; skeleton minor target retimed to 0.51.0 because upstream independently published 0.50.0.",
  "evidence": [
    "refs/dotln/checkpoint/WO-062/6",
    "base a3da7127b0c52c110e3f48e34cbfe0e3cd1a2570",
    "upstream 2bae7d407af2d5d07d16c5b15dc63134e277eabd",
    "release preparation: Retimed WO-062: v0.64.0 → v0.65.0 above the observed release baseline v0.64.0. Files changed: docs/work-orders/WO-062-github-issue-source-adapter.md, README.md, docs/evidence/WO-062/meta.json, docs/final-reviews/WO-062/PR.md. Meter snapshot: docs/evidence/WO-062/meta.json, 3578 bytes. Tag observation: local snapshot only.",
    "Main adds WO-124 compiler impact-surface derivation and snapshot-index support with its evidence; it does not alter github-issue-source.ts or the SourceBundle decoder. Product 03 retains both additive SourceAdapter statements. Package dependency changes from main are retained; the adapter adds no dependency.",
    "docs/control/local/integration.json records complete=true, stage=applied, authored=[], preservation checkpoint /6 and mergeCommit=null (fast-forward). The original VER-001 judges only its recorded pre-integration subject; fresh verification is still required for this repair."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-02. Original base: `a3da7127b0c52c110e3f48e34cbfe0e3cd1a2570`.
Fetched main: `2bae7d407af2d5d07d16c5b15dc63134e277eabd`. Checkpoint: `refs/dotln/checkpoint/WO-062/6`.
Named stash retained: `84bbc500d5ac4c3d31414e68ab8fead76319d1a4` (WO-062 integrate 2026-10-02).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-062: v0.64.0 → v0.65.0 above the observed release baseline v0.64.0. Files changed: docs/work-orders/WO-062-github-issue-source-adapter.md, README.md, docs/evidence/WO-062/meta.json, docs/final-reviews/WO-062/PR.md. Meter snapshot: docs/evidence/WO-062/meta.json, 3578 bytes. Tag observation: local snapshot only.
Carried-forward obligations: all six original criteria are unchanged. F1/F2 change history mapping and omission receipts and receive new fixture/live evidence. The integrated product/document gates and release preflights judge the combined tree; the original VER-001 is preserved and is not a verdict on these new bytes. Final review remains separate.
Authored conflicts observed: none.
Affected checks and their executed results are recorded in the repair handoff and gate snapshot.

## WO-062-D011 — Current text only; explicit role omissions

```json
{
  "id": "WO-062-D011",
  "kind": "correction",
  "date": "2026-10-02",
  "dispatch": "resume: fix",
  "decision": "Store only current title, body and discussion text. Screen each full historical version in memory and retain only its id, timestamp, subject id and text-free refusal metadata. Express revisions as conservative whole retained subject spans in current coordinates, with no historical text or summarySpan. Add one omitted receipt entry per comment whose role is undetermined, and have the consumer guard name it. Retiming the skeleton's already-declared minor bump to 0.51.0 preserves the new adapter interface above main's 0.50.0; only its existing console pin and lockfile follow.",
  "misread": "D003 interpreted UserContentEdit.diff as a summary and treated each version as current document content. Its rejection of precise offsets incorrectly claimed prior full text was unavailable. The omission receipt named a missing issue author but not each human comment thereby withheld.",
  "meant": "The observed API returns full versions, newest first. Historical text must not enter current sections or restore an omitted subject. A role omission needs its own local id, API path and reason.",
  "changed": "Separate screening from retained-content insertion; remove summarySpan and historical sections; retain chronological revision metadata; add omitted entries with undetermined-role; align replay history to current/full older versions and pin persisted bytes, spans and per-comment omissions.",
  "evidence": [
    "VER-001 F1/F2 and D008's five repair rules",
    "history-observation.json: read-only gh api graphql on public cli/cli sampled 30 issues, up to 10 comments and 3 versions; all 14 edited subjects have newest-first versions and newest diff equal to current body. This is observed behavior, not a universal API guarantee",
    "Context7 library GitHub resolved /github/docs, but its docs query returned unrelated project-field material and no evidence for UserContentEdit. Direct https://docs.github.com/en/graphql/reference/users#object-usercontentedit still describes diff as a summary; executable read-only observations establish the full-version interpretation.",
    "SourceBundle.sections is document order, discussion is thread order, and changedSpans must resolve against retained current sections or entries; empty change spans are allowed",
    "worktree integrate completed without authored conflicts at main 2bae7d40; upstream advanced skeleton 0.49.2 to 0.50.0 independently and application baseline to v0.64.0"
  ],
  "goalAlignment": "D009's mission, eight trap comparisons, Naive Interventionism and NoOp comparison apply. Conservative coverage keeps the existing invalidation behavior while removing misleading text. Exact diffs are credible because full versions exist, but need an additional mapping into current coordinates across later edits and missing versions; they do not improve these repair obligations. The smallest useful probe is full-version replay with unknown roles, refused current bodies and historical-only edits. No new process or dependencies are added.",
  "rejected": [
    {
      "option": "Compute precise historical diffs",
      "reason": "Not needed for these obligations; current-coordinate conservative spans remain correct coverage, including incomplete history. Reopen if a consumer needs finer invalidation."
    },
    {
      "option": "Keep screened historical text as sections or receipt payload",
      "reason": "Misrepresents current content and can restore text withheld for role or screening reasons."
    },
    {
      "option": "Ignore historical version contents entirely",
      "reason": "Preserve the declared per-version screen and malformed-field refusal while retaining no historical text."
    },
    {
      "option": "Reuse main's 0.50.0 for the new adapter",
      "reason": "That version now describes upstream behavior without this additive interface."
    }
  ],
  "reopens": {
    "decisionId": "WO-062-D003",
    "observation": "D008's observed full-version semantics replace the summary premise; D003 is corrected in place during this repair."
  },
  "reopenWhen": "A consumer requires precise current-coordinate change coverage, GitHub changes observed version semantics, or upstream consumes the newly staged component version before publication."
}
```

## WO-062-D012 — Repair outcome and handoff

```json
{
  "id": "WO-062-D012",
  "date": "2026-10-02",
  "dispatch": "resume: fix",
  "decision": "Record the repair complete against all six original acceptance criteria and all five D008 repair rules on integrated main. Preserve VER-001 and prior subject evidence, and hand off this repaired subject for fresh independent verification. Release the writer through repair-complete after final output and usage observations.",
  "evidence": [
    "repair-fixture-tests.txt: all 14 focused tests pass, including current-only sections/discussion, persisted withheld-text absence, per-comment unknown-role receipts, conservative resolving spans, historical images and malformed historical text",
    "smoke-repair.json: two actual public reads produce equal bundle and receipt hashes, currentSectionsOnly=true, historyTextFree=true, a decoding bundle and eight resolving spans; status ready",
    "repair-gate-summary.json: npm test with --review passes 30 suites, zero failed, 508994 ms, 75 fresh tasks, recorded 2026-10-02T01:26:13.028Z; npm run test:docs passes 24 suites, zero failed, 37919 ms, recorded 2026-10-02T01:27:07.809Z; both at d05ff078d87f0b3f0c6846e57d48815d360dbe1e34509e8749a2b82ab6c26966",
    "git diff --check and git diff --cached --check clean; release check-surfaces --local, publication:check (253 headings, 29/45 current locks), harness check (32 surfaces) and plan check all pass",
    "Canonical worktree integration is complete without authored conflicts at main 2bae7d40; original VER-001 bytes match checkpoint /6; only the release label in the order changed and plan check classifies it as release-assignment",
    "The repair follow-ups FUP-516f42831f87de8a and FUP-817d50c71c3d3c53 are settled through the canonical register; the adjacent queue is empty at revision 0"
  ],
  "goalAlignment": "The D009/D011 comparisons hold on executable evidence: historical versions no longer compete with current content or restore omissions, and every role-withheld comment is named. This reduces downstream WO-123 rescue without new services, dependencies, gates or scope. Main integration and the same existing gate checked the combined tree. One writer and no subagents were used; D001 is reused without a second experiment. The actual benefit is faithful screened external input; no composed source-to-deliverable outcome, exact historical diff or efficiency saving is claimed. Independent verification remains the next phase.",
  "rejected": [
    {
      "option": "Repeat the passing product gate after report-only writes",
      "reason": "Current code identity is unchanged; repair-complete checks the final document bytes inline."
    },
    {
      "option": "Treat the earlier failed report as a verdict on the repaired integrated tree",
      "reason": "VER-001 retains its own subject and findings; fresh verification judges this repair."
    }
  ],
  "reopenWhen": "Fresh verification identifies a violated repair rule, a declared criterion fails, the API changes its observed semantics, or subsequent integration changes the tested behavior."
}
```

## WO-062-D013 — Final review: main integrated, every claim carried forward

<!-- integration refs/dotln/checkpoint/WO-062/11 -->

```json
{
  "id": "WO-062-D013",
  "date": "2026-10-02",
  "dispatch": "resume: final review; worktree integrate WO-062",
  "decision": "Integrate main from 2bae7d40 to dee4b2df by fast-forward with no authored conflict, and carry all six criteria forward. Upstream brought only WO-107's evidence lane: corpus/ files, its own control, evidence, verification and final-review records, generated indexes, the README release line and one entry in packages/kernel/test/fixtures/jsonl-protocols.json. None of it touches the adapter, its tests or fixture, the skeleton or compiler sources, product 03 or the SourceBundle decoder, so criteria 1 to 5 keep their original evidence. Criterion 6 is re-judged on the integrated tree by a fresh npm test -- --review row and the inline npm run test:docs. Keep v0.65.0 and skeleton 0.51.0: no version collides.",
  "evidence": [
    "refs/dotln/checkpoint/WO-062/11",
    "base 2bae7d407af2d5d07d16c5b15dc63134e277eabd",
    "upstream dee4b2dfa40d98210f0f1a8db3964ca822f8ee77",
    "release preparation: WO-062 target v0.65.0 remains current. Files changed: docs/evidence/WO-062/meta.json, docs/final-reviews/WO-062/PR.md. Meter snapshot: docs/evidence/WO-062/meta.json, 4125 bytes. Tag observation: local snapshot only.",
    "git diff --stat 2bae7d40 dee4b2df: 29 files, all under corpus/, WO-107's docs, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/work-orders/README.md, README.md and the one kernel fixture line",
    "git ls-remote --tags origin: newest tag v0.64.1, so the minor target v0.65.0 does not collide. main's packages keep skeleton 0.50.0, compiler 0.24.0, kernel 0.6.0 and console 0.4.0; this order's skeleton 0.51.0 and the console pin stay above them",
    "No evidence edition changes: the adapter is outside every registered import closure (D006), and upstream changes no registered evidence source",
    "npm test -- --review after staging: 30 suites passed, 0 failed, 410.06 s, 75 fresh tasks, recorded 2026-10-02T03:19:57.219Z at code identity 8618ab9329bdbf3f3292fe3751e6fa91d7d7e14a9c8c3b877235435c3651c0e8",
    "npm run publication:check (253/253 headings; 29 and 45 linked sections current), node scripts/harness.mjs check (32 surfaces), npm run release -- check-surfaces --local (exit 0), npm run plan -- check (exit 0), git diff --check and git diff --cached --check all pass on the integrated tree"
  ],
  "goalAlignment": "D009's mission and trap comparisons still apply. Integration preserves the reviewed bytes, so the reviewer's choice is only whether to carry claims forward or to re-verify. Re-verifying unchanged claims would spend a verification on bookkeeping, which 07 Independent workflows and integration rules out. The fresh product gate re-judges the claim the new base could affect, criterion 6. NoOp would publish a branch behind main; the canonical helper is the smallest reversible step, and checkpoint /11, the named stash and the intake backup keep it recoverable.",
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Request a new verification for the integrated tree",
      "reason": "A new base with no change to this order's surfaces is bookkeeping, not a finding (07 Independent workflows and integration). The product gate re-ran on the integrated tree."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-02. Original base: `2bae7d407af2d5d07d16c5b15dc63134e277eabd`.
Fetched main: `dee4b2dfa40d98210f0f1a8db3964ca822f8ee77`. Checkpoint: `refs/dotln/checkpoint/WO-062/11`.
Named stash retained: `21b357d3da0d9e70868f4b4d0ef3912d664b5bf0` (WO-062 integrate 2026-10-02).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/work-orders/README.md.
Release preparation: WO-062 target v0.65.0 remains current. Files changed: docs/evidence/WO-062/meta.json, docs/final-reviews/WO-062/PR.md. Meter snapshot: docs/evidence/WO-062/meta.json, 4125 bytes. Tag observation: local snapshot only.
Carried-forward claims: `git diff --cached refs/dotln/checkpoint/WO-062/8` (VER-002's subject) lists only upstream's WO-107 files, the one kernel fixture line and lifecycle records; `packages/`, `scripts/`, product 03, the manifests and this order's smoke, fixture and observation evidence are byte-identical. Criteria 1–5 carry forward on VER-002's evidence. Criterion 6's product gate ran again on the integrated tree, and `npm run test:docs` runs at the result transition ([FINAL-001](../../final-reviews/WO-062/FINAL-001.md)).
Authored conflicts observed: none.
Affected checks: publication check, harness check, local release surfaces, plan check and both whitespace checks exit 0 on the integrated tree; the product gate result is in FINAL-001.
