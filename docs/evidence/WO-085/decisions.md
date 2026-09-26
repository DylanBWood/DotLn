# WO-085 decisions

Dispatch: `resume: next`, 2026-09-26. Actual session readback: codex-cli
0.157.1, gpt-6-astra, ultra effort (normalized xhigh). One writer; at most two
read-only helpers, no descendants, against the observed cap of 20.

Goal alignment: this bounds recurring documentation maintenance and navigation
cost for the operator and later runtime/export work; it does not implement the
source-to-deliverable loop. Preserve release preparation and immutable records
(policy resistance); reuse heading semantics and batch inspections (commons,
escalation). Exact occurrence baselines and negative fixtures prevent silent
growth and blanket exemptions (drift, rule beating). Reuse is justified by
existing behavior tests, not investment (success to the successful). A document
gate removes repeated manual link scans (shifting the burden); readable errors
and per-document limits serve navigation rather than a prose-quality score
(seeking the wrong goal). Naive Interventionism: preserve existing content,
publication slugs and the product gate; add a reversible document-only check.
NoOp leaves the observed unchecked growth path in WO-085. Outcome is judged
by current-tree and adversarial fixtures, with no claimed runtime benefit.

D007 reopens the parser choice after adversarial evidence. It preserves the
same mission and release boundary (policy resistance), reuses the already
installed parser (commons), replaces repeated parser patches with one AST
boundary (escalation), and counts only rendered structure (drift, rule beating).
Discarding the initial helper extraction avoids defending sunk effort
(success to the successful). Regression fixtures carry future diagnosis
(shifting the burden), while the gate still judges specified shapes rather
than prose quality (seeking the wrong goal). Naive Interventionism favors
leaving the publication checker unchanged; NoOp would retain reproduced
false results. No second economy experiment or recurring saving is claimed.

## WO-085-D001

```json
{
  "id": "WO-085-D001",
  "kind": "experiment",
  "date": "2026-09-26",
  "dispatch": "resume: next; Markdown utility reuse",
  "decision": "Extract the existing publication heading helpers without behavior changes; decline a separate parser experiment.",
  "question": "Can existing Markdown utilities supply link-target headings without another parser?",
  "alternatives": [
    "Reuse publication heading helpers and their regression fixtures",
    "Add an independent parser or a third-party Markdown dependency"
  ],
  "evidence": [
    "scripts/check-publication.mjs existing balanced-link, fence and duplicate-heading logic",
    "scripts/test-publication.sh covers nested link labels, parens, underscores and duplicate suffix collisions",
    "scripts/lib/meta.mjs has a simpler heading parser that does not preserve all those cases"
  ],
  "observation": "Source inspection establishes an existing tested implementation; a separate experiment would duplicate required fixtures. Reuse it and test link extraction separately.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "declined",
  "reason": "Required acceptance and existing publication fixtures directly decide compatibility; no separate probe is needed.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": [
      "none; separate experiment declined"
    ],
    "source": "Inspection is prerequisite implementation work, not an executed trial."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test scripts/test-docs-check.mjs",
      "bash scripts/test-publication.sh"
    ],
    "summary": "No measured recurring saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "rejected": [
    {
      "option": "New dependency",
      "reason": "The order forbids one and existing heading behavior is already tested."
    }
  ],
  "reopenWhen": "Fixtures reveal Markdown behavior the shared helper cannot represent."
}
```

## WO-085-D002

```json
{
  "id": "WO-085-D002",
  "date": "2026-09-26",
  "dispatch": "resume: next; baseline and check boundary",
  "decision": "Use content-specific counted baselines for existing receipt labels and candidate headings, exact file/id/dispatch fingerprints for existing decision records, and explicit source/destination historical link exceptions. Check new decision dispatches lexically for a supported prefix and at most 240 paraphrase characters; human review still judges whether wording quotes the operator.",
  "evidence": [
    "WO-085 Design specifies existing-record baselines, 2% non-exempt byte headroom and document-gate-only execution",
    "WO-090 D007 requires full heading slugs and declared historical exceptions",
    "WO-153 D008 requires a control prefix and paraphrase, with the historical sweep outside this order"
  ],
  "rejected": [
    {
      "option": "Exempt all old files wholesale",
      "reason": "Would permit new receipts or broken links in existing files."
    },
    {
      "option": "Judge semantic paraphrase automatically",
      "reason": "There is no operator-message input or objective prose rule; matching short quotes cannot be inferred from text alone."
    },
    {
      "option": "Move or rewrite historical records",
      "reason": "Explicitly outside this order; consolidation has separate orders."
    }
  ],
  "reopenWhen": "A new admissible Markdown form or a planning decision changes exemptions, ceilings or the dispatch shape."
}
```

## WO-085-D003

```json
{
  "id": "WO-085-D003",
  "date": "2026-09-26",
  "dispatch": "resume: next; operator approved two current link repairs",
  "decision": "Correct only the anchor fragments in product 05 and the Copilot planning document. Declare the current 40 broken-link occurrences in 39 closed evidence/review/verification pairs as historical exceptions; reject added occurrences.",
  "evidence": [
    "Independent read-only scan and scripts/docs-check.mjs agree on 42 unresolved occurrences: 40 historical and two current. No missing files were found.",
    "WO-090 D007 reported 41 unresolved occurrences on 2026-09-20; that dated number is not substituted for current evidence.",
    "The two actual headings include titles after their stable decision identifiers.",
    "The operator selected the offered two-link repair during this dispatch; adjacent-0001 records scope and checks."
  ],
  "rejected": [
    {
      "option": "Exempt all 42 occurrences",
      "reason": "The two current links are a safe and approved bounded repair."
    },
    {
      "option": "Rewrite closed reports to match current targets",
      "reason": "WO-090 D007 and this order preserve immutable historical evidence."
    }
  ],
  "reopenWhen": "A new broken link or duplicate occurrence appears, or an affected historical report is separately reopened."
}
```

## WO-085-D004

```json
{
  "id": "WO-085-D004",
  "date": "2026-09-26",
  "dispatch": "resume: next; carry-in FUP-87ed701db7d7209e",
  "decision": "Deliver the prospective lexical dispatch check here and retarget the remaining historical operator-chat sweep and role-text question to a separate follow-up. Existing dispatches are stored only as fingerprints, not copied into the baseline.",
  "evidence": [
    "WO-085 criterion 4 requires the remaining sweep stay named outside this order.",
    "WO-153 D008 includes both the historical sweep and instruction gap; this order explicitly changes no role text.",
    "A control prefix and length bound cannot establish semantic paraphrase; review still judges that distinction."
  ],
  "rejected": [
    {
      "option": "Mark the original follow-up entirely settled",
      "reason": "Would lose the explicitly deferred historical sweep and instruction question."
    },
    {
      "option": "Perform the sweep here",
      "reason": "It changes closed records and role text outside the authorized check."
    }
  ],
  "followup": "Sweep committed public decision records for operator chat retained verbatim, using WO-153 D008 as provenance; decide the bounded correction route for closed records and the role-text paraphrase instruction. Paths: docs/evidence/*/decisions.md, docs/lineage/decisions-index.md, contributor role-text source. Preserve immutable reports and do not copy original chat into new records. WO-085 has delivered the prospective dispatch prefix/length check; it does not prove paraphrase. Checks: reviewed source-to-paraphrase comparison, npm run meta, npm run test:docs; priority low, next document-maintenance planning pass.",
  "reopenWhen": "The next document-maintenance planning pass allocates the sweep or a new verbatim decision dispatch is observed."
}
```

## WO-085-D005

```json
{
  "id": "WO-085-D005",
  "date": "2026-09-26",
  "dispatch": "resume: next; release and ceiling assignment",
  "decision": "Assign application v0.51.2 as the next patch above observed local v0.51.1, with no component bumps because package sources are unchanged. Record each product document ceiling as ceil(non-exempt UTF-8 bytes at landing times 1.02); later consolidation may lower it, while an increase needs a named planning decision.",
  "evidence": [
    "Local tags include v0.51.1; WO-085 release classification is patch.",
    "release check-surfaces --local passes the application target and all unchanged component-version rows.",
    "WO-085 specifies generated-marker and roadmap Release boundary exclusions and two per cent headroom."
  ],
  "rejected": [
    {
      "option": "Bump a package for repository tooling",
      "reason": "No package source changed; a component bump would misstate compatibility impact."
    },
    {
      "option": "Set a repository-wide ceiling",
      "reason": "The order and reader cost are per document."
    }
  ],
  "reopenWhen": "Another release lands before final review, a package source changes, or a planning decision raises a document ceiling."
}
```

## WO-085-D006

```json
{
  "id": "WO-085-D006",
  "date": "2026-09-26",
  "dispatch": "resume: next; independent coverage inspection",
  "decision": "Repair the independently reproduced Markdown edge cases in the new check and add regression fixtures: indented receipt labels, escaped backticks, multiline reference targets, angle-bracket destinations, real HTML ids, setext headings, indented examples and list continuation links. Require positive safe-integer historical counts and refuse Unicode line separators in dispatches.",
  "evidence": [
    "The read-only coverage helper reproduced bypasses and false positives in isolated probes; all were in newly authored check code.",
    "The focused suite has 16 passing tests after the repairs, including ceiling increases requiring a resolving planning decision.",
    "The existing publication fixture still passes; setext support is opt-in for general link targets, preserving publication heading semantics."
  ],
  "rejected": [
    {
      "option": "Leave the reproduced edge cases as parser limitations",
      "reason": "These ordinary forms can be supported within the selected bounded deliverable without a dependency."
    },
    {
      "option": "Allow arbitrary numeric historical counts",
      "reason": "Fractional or infinite counts silently admit additional broken links."
    }
  ],
  "reopenWhen": "A further rendered Markdown form produces a reproduced false result; add its bounded fixture before changing parsing."
}
```

## WO-085-D007

```json
{
  "id": "WO-085-D007",
  "date": "2026-09-26",
  "dispatch": "resume: next; adversarial parser and exemption corrections",
  "decision": "Supersede D001's helper extraction and D006's incremental parsing approach with the Markdown AST exported by the already installed, lockfile-pinned Prettier package. Leave the publication implementation unchanged. Apply generated-marker exemptions only to standalone top-level HTML nodes and the release-boundary exemption only to the canonical product-relative 06-roadmap.md. Add two previously missed activation receipts from HEAD to the baseline.",
  "evidence": [
    "The two read-only helpers reproduced ordinary parenthesized titles, nested brackets, list and quoted fences, quoted headings and HTML entities that the handwritten scanner mishandled.",
    "The coverage helper showed hidden comment headings, indented marker examples and a nested file named 06-roadmap.md could change exemptions incorrectly.",
    "Prettier's public plugin documentation recommends importing a plugin's exported parsers and calling parse(text); the installed markdown parser returns a synchronous root AST with source positions. Source: https://github.com/prettier/prettier/blob/main/website/blog/2023-07-05-3.0.0.md, verified through Context7 and local package inspection.",
    "The AST discovers two product 07 list-paragraph receipts omitted by the original scanner; both labels and their Discipline heading are identical in HEAD and the working tree. Correcting the activation inventory yields 87 shapes without exempting new work.",
    "The earlier product gate was explicitly stopped before these source edits; its partial run is not a passing result. Fresh document and product gates will judge the final implementation."
  ],
  "rejected": [
    {
      "option": "Keep extending the handwritten block and link grammar",
      "reason": "Repeated counterexamples show a higher correctness and maintenance cost than using the parser already present."
    },
    {
      "option": "Add a new Markdown dependency or refactor publication parsing",
      "reason": "Neither is needed for this document gate; package and publication behavior can remain unchanged."
    }
  ],
  "reopenWhen": "A dependency update changes the exported parser contract or a regression fixture reproduces an unsupported rendered Markdown form."
}
```

## WO-085-D008

```json
{
  "id": "WO-085-D008",
  "date": "2026-09-26",
  "dispatch": "resume: verify; independent VER-001",
  "decision": "Fail the recorded subject and route five reproduced findings through WO-085 repair. F1 (criterion 1): a docs/-prefixed link in any final-review PR.md is resolved from the repository root, so 308 links in 24 closed PR bodies that are broken in the repository view and on the GitHub PR page pass silently, outside the declared historical inventory, and a new one passes too. F2 (criterion 1): any author-written top-level <!-- name:start --> / <!-- name:end --> pair exempts its contents from the byte ceiling and from receipt and candidate detection, although no generator writes a marker block into a product document. F3 (routed, criteria otherwise met): the generated work-order index links the allocated verification or final-review report before it exists, so docs-check fails, and as a preflight skips eight document suites, in every verifying and final-review window. F4 (routed): a leading U+FEFF shifts the parser offsets and disables receipt and candidate detection for that document. F5 (routed, criterion 3 entry point): docs/README.md says published PR bodies resolve repository-root links, which the check does only for docs/ paths and GitHub does not do at all. A verifier does not change the implementation it judges. The findings reopen D002, D003, D006 and D007.",
  "evidence": [
    "Plain grep: 308 '](docs/...)' links in 24 docs/final-reviews/*/PR.md files. An independent scanner and two refuters found all 308 missing relative to their file; linkFailures() reports none of them (scripts/docs-check.mjs:247-259). gh api body_html of the WO-070 pull request keeps href=\"docs/evidence/WO-070/decisions.md#wo-070-d003\"; resolved against the pull-request URL it redirects to a new-pull-request page, and the blob-view resolution beside PR.md returns 404. The baseline declares 39 pairs / 40 occurrences, all 'missing anchor'.",
    "Fixture at a document's exact ceiling: appending <!-- notes:start --> ... <!-- notes:end --> holding '**WO-999 receipt (2026-09-27):**', '## Candidate — smuggled' and 5.8 KB of prose gives failures [] with exemptBytes 5822; the same text without markers gives an over-ceiling failure, a new receipt and a new candidate. A refuter reproduced it on a copy of product 07 with the real controls (exemptBytes 5716, failures []). grep finds no ':start --' marker in docs/product, and no script writes one there.",
    "node scripts/docs-check.mjs on the post-dispatch tree: 'FAIL docs/work-orders/README.md:89: missing file: ../../docs/verifications/WO-085/VER-001.md'; npm run test:docs at 04:17:24Z: 14 passed, 9 failed, the other eight 'Required preflight ... failed ... docs-check'. At checkpoint refs/dotln/checkpoint/WO-085/3 (4068d8e4), where the index still reads ready-to-verify, checkDocs returns no failure. scripts/work-orders.mjs:436-438 and 527-528 link any allocated report path; scripts/lib/control.mjs sets the verification and final-review paths at their Requested events.",
    "Copy of product 07 with the real controls: adding a dated receipt and a Candidate heading fails twice without a BOM and returns failures [] with a leading U+FEFF; the parser places '## Candidate — y' at offset 5 while the raw slice begins with the newline. prettier --check accepts and keeps the BOM (*.md is prettier-ignored).",
    "Fixture PR.md: [x](README.md) and [y](scripts/tool.mjs) fail as missing files while [z](docs/a.md) passes; docs/README.md line 75."
  ],
  "alternatives": [
    "Pass on the executor's fixtures and the green recorded-subject scan",
    "Edit the check during verification and attest the changed bytes",
    "File a failed verification with bounded reproductions and route repair to a fresh verification"
  ],
  "rejected": [
    {
      "option": "Pass on the executor's fixtures and the green recorded-subject scan",
      "reason": "The scan is green only because an undeclared rule admits 308 broken links, and a marker pair defeats the three product checks the Objective names; D002 itself rejects wholesale exemptions."
    },
    {
      "option": "Edit the check during verification",
      "reason": "Independent verification judges its recorded subject; a repair changes it and needs a new report."
    }
  ],
  "followup": "WO-085 resume: fix. F1: judge links in final-review PR.md like any other file, or record a planning decision for a different rule; declare the existing 308 occurrences as counted historical exceptions if they are kept; correct D003's 'No missing files were found' through a dated correction and the README sentences; note that no relative link form resolves in both the repository view and the PR page. F2: exempt only marker names registered for a named generator (none in docs/product today) and add a hand-written-marker negative fixture. F3: render an allocated but unwritten report as plain text in the index, or admit exactly the report path canonical control state marks pending, with a verifying and final-review index fixture. F4: strip or refuse a leading BOM before parsing, with a fixture. F5: correct docs/README.md. Rerun the focused fixtures, npm run test:docs and npm test, then request a fresh VER.",
  "reopenWhen": "A repair supplies bounded regressions for F1-F5 and a new verification judges all five criteria on its recorded subject."
}
```

## WO-085-D009

```json
{
  "id": "WO-085-D009",
  "date": "2026-09-26",
  "dispatch": "resume: verify; independent VER-001",
  "decision": "Board the fourteen non-blocking observations in VER-001 (O1-O14) instead of leaving them as report prose. None makes a criterion unmet. O1 and O2 are gaps in the order's Design, not the implementation: the specified receipt shape matches 28 of 102 dated bold paragraphs outside roadmap Release boundary, and the specified candidate shape matches 59 of the 64 Candidate headings the order counted. O3: the Release boundary exemption has no retirement duty in WO-086. O4: the control-file guards are HEAD-relative or absent. The repair may address observations inside its repaired seams within the boy-scout bound; the rest go to planning.",
  "evidence": [
    "VER-001 section 'Observations (non-blocking)' lists each observation with its source.",
    "Receipt coverage: an AST count finds 192 dated bold-led paragraphs, 90 inside 06 Release boundary; productContent matches 28 of the other 102, equal to the baseline's 28 receipts; ten existing non-matching forms added anew are not refused.",
    "Candidate coverage: grep finds 64 Candidate headings; 59 have the '## Candidate —' or '### Candidate —' form the Design names and equal the baseline's 59; '#### Candidate —', '### Candidate role —', '### Candidate extension —', '## Candidate first' and setext forms pass.",
    "Release boundary: docs-check.mjs:98-114 exempts it unconditionally; doc-ceilings.json's policy string names WO-086, but WO-086's order text never names retiring the exemption and removing the 545 exempt lines leaves 06's counted bytes at 90,074, so its criterion 4 ceiling cannot fall.",
    "Controls: a raise of ceiling and nonExemptBytesAtLanding is refused uncommitted and passes once committed; doc-baseline.json entries added in the same change admit a new receipt, an unprefixed dispatch and a broken link; a renamed or new product document gets a fresh ceiling from its own declared size."
  ],
  "rejected": [
    {
      "option": "Route every observation into the blocking repair",
      "reason": "They do not falsify a criterion; O1 and O2 follow the Design's literal shapes, and O3 and O4 need a planning decision rather than an executor judgment."
    }
  ],
  "followup": "Planning, next document-maintenance pass: decide whether the receipt and candidate shapes widen to the populations the order counted (O1, O2); add a duty to WO-086 or a register row to retire docs-check's Release boundary exemption when the handwritten notes leave (O3); decide whether ceiling and baseline growth is compared with the integration base (O4); decide the link scope for Markdown outside docs/ and the root (O5). WO-085 resume: fix may address O6-O12 inside its repaired seams within the boy-scout bound. O13 (console watch timing) is nominated for the adjacent queue if it recurs.",
  "reopenWhen": "An observation is shown to falsify a criterion, a planning pass allocates one of them, or a later order meets one in use."
}
```

## WO-085-D010

<!-- integration refs/dotln/checkpoint/WO-085/6 -->

```json
{
  "id": "WO-085-D010",
  "date": "2026-09-26",
  "dispatch": "scope expand: integrate main before WO-085 repair",
  "decision": "Integrate fetched main before repairing, as the operator authorized during resume: fix. Preserve both roadmap note groups, the checkpoint and named stash; refresh generated projections and retime the unpublished patch from v0.51.2 to v0.52.2. No acceptance wording or component version is changed by this integration.",
  "evidence": [
    "refs/dotln/checkpoint/WO-085/6",
    "base f73b7e184b38de9cab97b4e86c718b6006f6b19d",
    "upstream 6a5c323df4e2db298ec3ec0b16be61c6374b9cb8"
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

Integration date: 2026-09-26. Original base: `f73b7e184b38de9cab97b4e86c718b6006f6b19d`.
Fetched main: `6a5c323df4e2db298ec3ec0b16be61c6374b9cb8`. Checkpoint: `refs/dotln/checkpoint/WO-085/6`.
Named stash retained: `aabda54a70336b2cf4a902ffb2257b7bd4c9f477` (WO-085 integrate 2026-09-26).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-085: v0.51.2 → v0.52.2.
Files changed:
  docs/work-orders/WO-085-spec-receipt-boundary.md
  README.md
  docs/product/06-roadmap.md
  docs/final-reviews/WO-085/PR.md
Tag observation: local snapshot only.
Carried-forward claims: VER-001 remains the immutable failed judgment of the original subject. Its F1-F5 repair obligations carry forward; this repair will run fresh checks on the integrated subject and request independent re-verification. The roadmap resolution retains both additive note groups. No branch implementation commit or publication was made.
Authored conflicts observed: docs/product/06-roadmap.md.
Affected checks: npm test -- --review, publication:check, harness check, and release check-surfaces --local. Results will be recorded in the repair receipt after execution.

Repair goal comparison: keep the documented inflow boundary useful during real
lifecycle transitions (policy resistance, shifting the burden). Two read-only
helpers share the five findings with no descendants (commons); keep one check
and existing index lifecycle signals (escalation). Source-relative navigation
and no unregistered marker exemptions test the intended behavior (drift, rule
beating). Removing the PR special case and the unused marker parser rejects
sunk implementation cost (success to the successful). Gate correctness and
usable navigation remain the goal, not a green inventory count (seeking the
wrong goal). Naive Interventionism: preserve closed reports and recovery refs,
change only the check/index seams and their fixtures. NoOp retains reproduced
bypasses and a document-gate failure during verification. D001 is the existing
economy decision, later superseded by D007; no second experiment is started.

## WO-085-D011

```json
{
  "id": "WO-085-D011",
  "date": "2026-09-26",
  "dispatch": "resume: fix; repair VER-001 F1-F5",
  "decision": "Judge relative links from the repository file, including PR bodies. Remove the unjustified PR docs/ root-resolution rule. No product marker generator exists, so marker pairs grant no exemption; register a real producer and exact product path before introducing one. Normalize consecutive leading BOMs for parser offsets while counting their original UTF-8 bytes. Render pending verification and final-review report IDs as plain text until a verdict is recorded; keep completed links so missing completed reports still fail. Correct docs/README.md and the implementation receipt.",
  "evidence": [
    "VER-001 F1-F5 and direct source inspection of scripts/docs-check.mjs and scripts/work-orders.mjs.",
    "Same-day correction to D003: the earlier claim that no missing files were found was wrong because the scanner applied an unsupported PR-root rule. The intended claim is file-relative resolution; VER-001 found 308 missed occurrences on its subject. Recount the integrated committed subject and declare only exact historical exceptions. No closed report is rewritten.",
    "No product document has a generated marker block; the only release note writer uses the explicit roadmap section exception.",
    "The repair helper reproduced a residual offset bypass with two leading BOMs after the first implementation stripped only one. The repair normalizes the full leading run and fixtures cover one, two and three BOMs, with all original bytes charged.",
    "VerificationRequested resets latestVerdict and FinalReviewRequested resets finalReviewVerdict; those events provide a stable pending signal without observing report-file existence."
  ],
  "rejected": [
    {
      "option": "Continue PR-root resolution or exempt entire historical files",
      "reason": "Both hide new broken navigation; counted source/destination exceptions preserve history without admitting additions."
    },
    {
      "option": "Maintain a configurable marker escape hatch with no real producer",
      "reason": "It adds authority and code solely to preserve an exploitable unused path."
    },
    {
      "option": "Hide all missing report links based on filesystem existence",
      "reason": "It would hide a missing report even after recorded completion."
    }
  ],
  "reopenWhen": "A real product generator requires a bounded exemption, a publication workflow defines a different link context, or a lifecycle fixture demonstrates a pending/completed mismatch."
}
```

## WO-085-D012

```json
{
  "id": "WO-085-D012",
  "date": "2026-09-26",
  "dispatch": "scope expand: reconcile the initial inventory with integrated main",
  "decision": "Finalize the still-uncommitted landing ceilings against the integrated product bytes, changing only products 04 and 07, whose source changed upstream. Add historical dispatch fingerprints and link occurrences only when their source bytes are already committed in integrated HEAD and the owning order is closed; preserve the existing baseline entries and do not baseline current repair violations.",
  "evidence": [
    "worktree integrate completed f73b7e184b38de9cab97b4e86c718b6006f6b19d to 6a5c323df4e2db298ec3ec0b16be61c6374b9cb8 before behavioral repair.",
    "git diff of those bases changes only product 04, roadmap release notes and product 07. Current product 04 equals HEAD; product 07 retains only the original WO-085 check-binding edit over HEAD.",
    "Initial non-exempt product 04 bytes changed from 51582 to 59662; product 07 from 182346 to 184704. The controls have not landed in HEAD. Criterion 2 sets each initial ceiling to ceil(landing bytes * 1.02).",
    "The first integrated scan also exposes WO-115-D016 and WO-165-D007 dispatches and WO-115 release-note links imported from committed main. The repair-owned D010 dispatch is corrected, not baselined."
  ],
  "rejected": [
    {
      "option": "Keep the pre-integration initial ceiling or rewrite upstream content to fit it",
      "reason": "It would fail the integrated subject or remove independently reviewed main content before this check has landed."
    },
    {
      "option": "Rebaseline all working-tree failures",
      "reason": "Would hide repair mistakes and new violations; admission is restricted to identical committed closed-order source."
    }
  ],
  "reopenWhen": "A later change raises a landed ceiling; that requires the planning decision specified by the check. Further main integration before landing requires another explicit inventory comparison."
}
```

## WO-085-D013

```json
{
  "id": "WO-085-D013",
  "date": "2026-09-26",
  "dispatch": "resume: fix; bounded integration dispatch producer repair",
  "decision": "Repair the adjacent integration decision producer so it emits resume: fix or resume: final review from its recorded phase, followed by the operation. Use the existing two-phase real-Git integration fixture to verify the generated decision selected by checkpoint ref. Adjacent queue item adjacent-0002 records scope, announcement and check-in.",
  "evidence": [
    "After authorized main integration, docs-check rejected the newly generated WO-085-D010 command-shaped dispatch. Both read-only helpers confirmed the same generator would fail on later integrations.",
    "integrateWorktree already admits only repairing and final-review and stores that phase in its receipt; no new state input is needed."
  ],
  "rejected": [
    {
      "option": "Fix only this draft decision or baseline the new invalid dispatch",
      "reason": "Would leave every later integration generating a record the gate rejects."
    },
    {
      "option": "Change role text or the dispatch-prefix rule",
      "reason": "The generator can satisfy the existing contract with its recorded phase; broader authority changes are unnecessary."
    }
  ],
  "reopenWhen": "Another decision producer emits an unsupported dispatch or the integration phase model changes."
}
```

## WO-085-D014

```json
{
  "id": "WO-085-D014",
  "date": "2026-09-26",
  "dispatch": "resume: fix; repair imported configured-root regression",
  "decision": "Replace the WO-165 route-migration source literal in scripts/authority-evidence.mjs with its existing docRelative workOrders helper. The full integrated review gate exposed the failure. This is a bounded adjacent source-path repair under the executor support, queued as adjacent-0003; no package, authority envelope or published evidence is changed. Reproduce existing authority snapshots directly and remint only if their check becomes stale.",
  "evidence": [
    "npm test -- --review completed 32 passed and 1 failed (configuration-root), 77 fresh tasks, 607.04 seconds. Its only failing child names the literal docs/work-orders/WO-165-entropy-review-route-agreement.md at scripts/authority-evidence.mjs:606.",
    "The upstream diff from f73b7e1 to integrated 6a5c323d introduced that literal; adjacent migration records already call docRelative(root, workOrders, filename).",
    "Read-only helper ran authority-evidence --check before editing: it passed without the retained-evidence fallback. The proposed helper returns the identical string in this checkout. The generator is a registered authority evidence source; product 07 requires remint for editions whose check becomes stale, not for an equal output."
  ],
  "rationale": "Configuration-root portability and a passing integrated gate serve the current order. Policy resistance and rule beating reject disabling the scanner; reuse the existing helper to limit commons cost and escalation. Fix the observed contract rather than normalize failure (drift), do not defend the imported literal (success to the successful), and remove recurring operator rescue (shifting the burden). Navigation and executable behavior, not a green exception, are the goal. Naive Interventionism favors one reversible expression with unchanged default-layout output; NoOp would preserve a required gate failure.",
  "rejected": [
    {
      "option": "Ignore or suppress the inherited configuration-root failure",
      "reason": "Its imported origin does not discharge the required passing gate, and the default-root literal violates an existing contract."
    },
    {
      "option": "Create a new evidence edition preemptively",
      "reason": "The current edition reproduces exactly; change only the source path expression and let the direct check establish whether remint is necessary."
    }
  ],
  "reopenWhen": "The post-edit authority check becomes stale, configured-root fixtures fail, or another imported literal reaches this seam."
}
```

## WO-085-D015

```json
{
  "id": "WO-085-D015",
  "date": "2026-09-26",
  "dispatch": "resume: verify; independent VER-002",
  "decision": "Pass the repaired subject: all five criteria are met at checkpoint refs/dotln/checkpoint/WO-085/8, VER-001 F1-F5 reproduce as fixed on copies of the real documents with the real controls, and the document gate is green on a live verifying window before the report exists. Board the ten new non-blocking observations V1-V10 here instead of leaving them as report prose; none makes a criterion unmet, and each sits on a seam D009 already sends to planning or is a zero-occurrence variant of a boarded class. The verifier changed no implementation.",
  "evidence": [
    "npm run test:docs on the verifying tree before VER-002 existed: 23 passed, 0 failed, 30.73 s; npm test: 28 passed, 0 failed, 333.30 s, 72 fresh tasks; node --test scripts/test-docs-check.mjs 24/24; test-work-orders 23/23; test-worktree-integration 9/9; test-configuration-root 13/13; authority-evidence --check and publication:check pass.",
    "Independent byte count: all fifteen nonExemptBytesAtLanding equal the files, every ceiling equals ceil(bytes*1.02); linkFailures() yields 412 failures under exactly the 368 declared (file, href, reason) keys with identical counts; 743 dispatch fingerprints, 0 stale; baseline shapes byte-identical to checkpoint 4.",
    "V1 (O11 class): an invisible prefix before the bold label (U+200B, U+2060, U+200D, U+00AD, NBSP, &nbsp;, a mid-file U+FEFF) or inline HTML before it makes the paragraph's first child a text or html node, so a dated receipt passes; two ASCII spaces, a tab or an NBSP between Candidate and the dash, or U+2011 hyphens in the date, pass as new shapes. Reproduced on a copy of product 07; no occurrence in docs/product. The Design's shapes are literal and D002 leaves paraphrase and evasion to review.",
    "V2 (O3 class): demoting or blockquoting the heading that terminates 06 Release boundary extends the exemption over lines 848-1202 (23,150 bytes) and reclassifies five baselined shapes; the printed table shows the exempt-bytes jump but nothing refuses it.",
    "V3 (O4 class, dormant until landing): planningDecision() accepts any resolving anchor under docs/planning, including an untracked, gitignored or symlinked file and an unrelated heading; markdownFiles() elsewhere excludes ignored files. No raise guard runs on the current tree because doc-ceilings.json is untracked at HEAD and every ceiling equals the formula.",
    "V4 (O7 class, weight raised): unused historical link exceptions are not reported; the inventory grew from 39 pairs to 368 pairs and 412 occurrences, all exact today, so a later deletion or rewrite of a closed report would leave a silent admission.",
    "V5: the sixteen closed orders since WO-147 wrote PR bodies with root-style docs/ links, which the repaired rule refuses in a new body; no writer-side text names the file-relative form, only docs/README.md. WO-085's own final review is the first affected window; the refusal names the file and line.",
    "V6 (O6 class): a link to an ignored or private file without a fragment passes when the file exists locally; a root-absolute /docs/... href resolves against the repository root, matching GitHub's blob view but not the docs/README.md sentence; zero occurrences of either.",
    "V7: the order's Cost and Design still describe an exemption for generated marker blocks; the repaired check has none because no generator writes into docs/product. The byte count is identical today. WO-086's generated roadmap history is the likely first producer and D011's reopening condition covers it.",
    "V8: the repaired subject retains no fixture transcript; fixtures.txt and docs-check.txt describe the pre-verification subject and say so, and the 24-test result is a README table row. The verifier reran the suite live.",
    "V9: the generated index shows only the latest verification, so VER-001 is no longer linked there once VER-002 is allocated (pre-existing at HEAD; the evidence README and D008 link it); the executor edited docs/evidence/WO-085/README.md 30 s after its last document gate, which the RepairCompleted advisory records.",
    "V10: main at 6a5c323d fails its own configuration-root machinery suite on the WO-165 literal that D014 repairs; npm test is unaffected because that suite is machinery, and the reviewer's integration carries the one-line fix to main."
  ],
  "rejected": [
    {"option": "Route V1-V3 to repair as criterion 1 or 2 failures", "reason": "Criterion 1 asks that the check fail for the Design's literal shapes on fixtures and pass on the tree, which holds; criterion 2's four clauses hold at landing; each variant is an author evasion on a seam D009 already sends to planning, and the check is an inflow guard with review judging, not an adversarial gate."},
    {"option": "Leave the observations as report sentences", "reason": "A defect met and not fixed is boarded with a named follow-up, as VER-001 did in D009."}
  ],
  "followup": "Planning, next document-maintenance pass, together with D009's items: decide whether the receipt and candidate recognizers normalize invisible prefixes, inline HTML and internal whitespace before matching (V1); pin the Release boundary exemption to the terminating heading's identity or retire it with WO-086 (V2); require the raise anchor to be a tracked, non-ignored, non-symlink planning file (V3); report unused exception counts (V4); write the file-relative PR-body link form into the reviewer's contract in product 08 §PRs and commits or the reviewer skill (V5); decide whether ignored targets are navigation and document the root-absolute rule (V6); register a marker exemption only when WO-086 or another generator first writes into docs/product (V7). Paths: scripts/docs-check.mjs, docs/control/doc-ceilings.json, docs/control/doc-baseline.json, docs/product/08-publication-compiler.md, .claude/skills/dotln-reviewer. Checks: node --test scripts/test-docs-check.mjs, npm run test:docs. Priority low; nothing fails today.",
  "reopenWhen": "An observation is shown to falsify a criterion, a planning pass allocates one of them, a generator writes a marker block into docs/product, or a final review's PR body is refused by the link rule."
}
```

## WO-085-D016

```json
{
  "id": "WO-085-D016",
  "date": "2026-09-26",
  "dispatch": "resume: final review; FINAL-001 judgment and one planning observation",
  "decision": "Pass the reviewed subject without correction: main is unchanged since the repair's D010 integration, so no integration ran; the review reproduced the control-file counts and ceilings, the docs check, the focused suite and both gates on the final-review window, and every VER-002 observation stays boarded in D015. Route one reopened planning observation: receipt 030's third known issue is met on its scope half, because the link scan covers root and configured-document Markdown only, so the generated skills' heading citations, written as inline code, are judged by nothing; WO-167 criterion 2 must not cite this check as proof that they survive the fold.",
  "evidence": [
    "git fetch origin main; main, origin/main and the merge base are all 6a5c323df4e2db298ec3ec0b16be61c6374b9cb8; git log HEAD..main is empty.",
    "Independent count without the check's parser: 87 baseline shapes, 368 link pairs with 412 occurrences, 743 dispatch fingerprints; fifteen ceilings equal ceil(bytes * 1.02) of an independent byte count with 06 Release boundary (lines 21-847) excluded.",
    "npm run test:docs on the final-review window before FINAL-001 existed: 23 passed, 0 failed, 29.97 s; the generated index rendered FINAL-001 (pending) as plain text.",
    "npm test -- --review on the staged subject: 34 passed, 0 failed, 594.62 s, 78 fresh tasks, exit 0; code identity 26c200f1af7836611825290bfa9834b1efa179bda07da53f4f529527267aacd2 at tree 4728e33853a333ac0ba2b5c6f3531b4ca43b33b2.",
    "scripts/docs-check.mjs markdownFiles(): root-level Markdown plus the configured document roots; .claude/skills is outside both, and .claude/skills/dotln-reviewer/SKILL.md line 9 cites docs/product/07-execution-guide.md#Goal-aligned decisions inside backticks, which the parser reads as inline code.",
    "docs/work-orders/WO-167-execution-guide-folded.md criterion 2: every heading cited by a role skill resolves after the fold and check-publication and the docs check report zero broken anchors; docs/planning/refutations/2026-09-25-planning-c93346fb3a92bb7f-030.json result.orders[3].findings[2] reopens when the check's file scope excludes generated skills while WO-167 criterion 2 cites it as the proof."
  ],
  "rejected": [
    {
      "option": "Widen the link scan to .claude/skills or to heading-text citations in this review",
      "reason": "Scope is a planning decision D009 already sends to the next document-maintenance pass (O5); inline code is not navigation under the order's Design, and the change would need its own verification."
    },
    {
      "option": "Correct the order's Cost text that still describes a generated-marker exemption (V7)",
      "reason": "An order's text changes only through an authorized amendment; the criteria do not depend on the exemption and D015 boards it."
    }
  ],
  "followup": "Planning, at WO-167 activation or the next document-maintenance pass: WO-167 criterion 2 relies on the docs check to prove the role skills' citations of product 07 headings survive the fold, but the check scans root and configured-document Markdown only and the skills cite headings as inline code, so the check reports zero broken anchors whatever the skills say; decide whether the check gains the skills' files and a heading-text citation form, or WO-167 names another proof. Paths: scripts/docs-check.mjs, .claude/skills/*/SKILL.md, docs/work-orders/WO-167-execution-guide-folded.md. Checks: node --test scripts/test-docs-check.mjs, npm run test:docs. Priority: before WO-167 activates.",
  "reopenWhen": "WO-167 activates with criterion 2 unchanged, or a skill's heading citation breaks without a docs-check refusal."
}
```
