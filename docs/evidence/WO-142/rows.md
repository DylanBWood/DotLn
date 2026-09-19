# WO-142 row dispositions

Observed from the activated worktree at `cb932c845354ec871fd34e14dec859bb869776ef`,
2026-09-19. There are 51 row groups (A1–A23, B1–B17, C1–C10, D1).
B12 is shown as its two independently scoped obligations because only (a)
is starred: (a) is fixed and (b) is returned under the explicit replay fence.
No starred obligation is returned. A7 was not reproduced before edits.

The table distinguishes repository fixtures from source inspection. The
[counterfactual record](counterfactuals.md), [package record](package-counterfactuals.md)
and [A15 record](a15-transcripts.md) describe dated disposable-helper observations;
their `/tmp` paths are session-local, not committed reproduction commands.
A16, A19, A20(a)(b)(d) and A22's non-baseline portions have source-inspection
evidence, not committed regression assertions for every structural detail.
[VER-001](../../verifications/WO-142/VER-001.md) found four material defects in
the first implementation; [VER-002](../../verifications/WO-142/VER-002.md)
found the residual task/read-admission failures in repair 001. The corrected
claims below and [repair 003](repair-003.md) address VER-003's remaining
terminal-state and prompt-delivery findings while preserving the failed reports
and earlier repair receipts and editions.
The root remained the only repository writer. Historical reports, planning
receipts and recorded runs were not rewritten.

| Row | State | Observation before change → result | Named check or evidence |
| --- | --- | --- | --- |
| A1 ★ | fixed | Every decision was harvested → only an explicit follow-up or observed reopening creates a new action; prior entries/history remain. | `scripts/test-process-debt.mjs`: “only named actions and observed reopenings”; `npm run meta -- --check`. |
| A2 ★ | fixed | Title stamp changed carried hash → shared normalization excludes only the release suffix and admits compatible legacy hashes. | `scripts/test-plan-refutation.mjs`: stamped carried-order fixture, substantive-change rejection. |
| A3 | fixed | Bare-ID links missed titled headings → full heading/duplicate anchors; existing meta check resolves every index fragment. | A1 fixture’s titled/duplicate headings; `npm run meta -- --check`. |
| A4 ★ | fixed | Only executor completion refreshed index → every changing transition refreshes it. | `bash scripts/test-work-orders.sh`: lifecycle/index check plus 62 annotated tags with 40 ms Git-call latency and a 12 s dispatch limit; batched Git reads preserve validation. |
| A5 | fixed | Links pointed to absent decisions and duty predicates differed → existence-gated links and one shared predicate. | work-orders fixture “unassigned product versions and inherited decision links”; decision-duty process fixture. |
| A6 | fixed | Product v1 token made an unassigned order malformed → activation placeholder takes precedence. | Same work-orders fixture. |
| A7 | not-reproduced | All five helpers already had owning evidence references before edits; no deletion justified. | References listed below, read before editing. |
| A8 ★ | fixed | Disposable control entries were parsed as events → existing disposable basenames skipped, every other stray refused. | `bash scripts/test-resume.sh`: embedded control-segments disposable/stray pair. |
| A9 | fixed | Later heading normalized; length unpinned and oversized length clamped → first heading only, explicit length bound, rejection matchers and 24-entry pin. | source-bound execution-amendment and leading-group fixtures in `scripts/test-plan-refutation.mjs`. |
| A10 | fixed | Final-review repair completion named latest VER → records the requesting failure source in the existing field. | Resume FINAL-002/VER-003 mismatch fixture; reader audit below. |
| A11 | fixed | Diagnostics omitted dependency, ordinal or recovery subject → scoped messages and trimmed progress. | runner cascade/progress fixtures; control/resume ordinals; work-order stale-temp fixture. |
| A12 | fixed | Unquoted title placeholder and ignored extra words → quoted placeholder and surplus-argument refusal. | Resume handoff pin; worktree surplus-title fixture. |
| A13 | fixed | Lexical module guards skipped symlink entry → shared realpath helper. | work-orders “symlinked script entry” fixture; changed scripts parse. |
| A14 | fixed | Bad baseline tag threw, untracked omission silent, headings partly guarded, fetch overclaimed → FAIL line, qualifier, six-level guards, accurate local-fetch prose. | release `--case surfaces`; worktree reserved-heading fixture; PLAYBOOK/release README. |
| A15 | fixed | Named negative/positive controls were missing or vacuous → all items have causal fixtures. | [Per-item commands and twelve failing subjects](a15-transcripts.md). |
| A16 | fixed | Duplicate body/quote/effort helpers and dead exports → one definition each; dead exports/imports removed. | Resume, worktree and release fixtures plus dated source inspection; no committed source-definition count assertion is claimed. VER-001 N1 and VER-002 N8 remove the missed unused imports in worktree.mjs and plan-direct.mjs. |
| A17 | fixed | Runtime basename regex omitted capitals/digits/underscore and two exercised files lacked inventory → accepted basename fixture and skeleton source inventory. | process runtime `Version_2.js`; runner source/protection fixture. |
| A18 | fixed | DCO email match was case-sensitive and gave no remedy → email-only case folding and signoff hint. | `node --test scripts/test-license-surfaces.mjs`, including uppercase email and refusal cases. |
| A19 | fixed | Four tie-breaks used locale order → code-unit comparisons. | Control/release/publication checks and unchanged audit goldens; source counterfactual. |
| A20 | fixed | Missing console workspace dependencies; destructive workspace build scripts; no exact-pin check or engine floor → declared pins, staged builds, equality assertion; E1 now pins Node 26.9.0 and supports major 26. | Build, release surfaces exact/caret pin pair, lockfile source check; official Node flag introduction evidence in decisions. |
| A21 | fixed | Process table omitted observation context → source and cutoff caption, including unknown fallback. | process table caption fixture. |
| A22 | fixed | Four flags absent, temp literals, missing closing baseline, invented execution label and incomplete usage → all corrected. | `node scripts/probe-worker-hosts.mjs`; mutation selftest closing-baseline pair; source assertions. |
| A23 | fixed | Generic protection text and undocumented aliases → specific suite descriptions and documented aliases. | runner protection fixture; document counterfactual; runner `--list`. |
| B1 ★ | fixed | Ordinary advisories shared classification; outside read errors untyped → identity-specific markers and typed observer input. Current Stop silence itself was not reproduced: WO-141’s facts prefix already bypassed suppression. | Generated two-identity/20-repeat test; observer journal test; existing distinct-advisory fixtures and four-refusal tests. |
| B2 ★ | fixed | Native background and terminal forms were incomplete → automatic Bash backgrounding, completed/failed/stopped/killed notices, successful TaskStop, scoped facts retaining the earliest terminal and dispatch times, immediate native prompt delivery before transcript flush, and one journal lookup per scan. | `scripts/test-observed-facts.mjs` includes VER-003 sequences, 120 append orders, dispatch/scope regressions and prompt/transcript reconciliation; B2 generated hook fixtures; subagent-budget tests; [repair 003 replay](repair-003.md). |
| B3 | fixed | Initial allowlist narrowed harmless literal arguments → restored all activation arguments for nine legacy read programs; new programs retain bounded flags, and redirections still expose destinations. | Activation-vocabulary parity and read/write pairs; added-program unknown-option and existing live-gate denial tests. Product 07 and D012 state the Git-effects limitation. |
| B4 | fixed | Paid rejected output deleted; schema allowed invalid reopening; Codex scratch lacked Git → rejected bytes retained locally, matching schema, empty scratch Git initialized. | Planning B4 retained-return/schema fixtures and scratch transport assertion. No extra live refutation purchased. |
| B5 | fixed | Child/resume/cap race behavior lacked pins → generated live child-counter, retry, missing identity, known/unknown resume and cap1/cap3 race fixtures. | harness B5 and skeleton subagent-budget tests; source mutant removes known-resume exemption. |
| B6 | fixed | Dead gate export, weak current-version masking and no-throw tests → dead export removed, current version path masked, concrete values and sensitive-read delegation pinned. | evidence-editions/worker tests; B6 `.env` observer fixture; source counterfactual. |
| B7 ★ | fixed | Parser bound absent from schema/prompt → 320-character bound declared and bounded refusal diagnostic. | verification 320/321 schema/parser/prompt fixture. |
| B8 | fixed | Console lockfile version was treated as external, discovery CLI absent from inventories → linked workspace projection preserves external metadata; source registered in all required lists. | feedback-audit-source projection/inventory fixtures; original-source failures. |
| B9 | fixed | Shape-First and residue renderer were literal-first → version2 relationship-first; current residue, compiler graph/identity and console input regenerated. | Entropy support/residue tests; artifact and authority checks prove exact authorized migration while reproducing historical hashes and preserving authority. |
| B10 | fixed | Other-attempt loop ran zero times → fixture adds a distinct expired attempt and asserts the loop ran. | console board AC2 fixture using the new live edition; reverted second-attempt subject. |
| B11 | fixed | Appended envelope unvalidated; kind absent from exception → validate full candidate log and name invalid kind. | kernel append-invalid-envelope and WO-017 default-kind tests. |
| B12(a) ★ | fixed | changeSize overwrote same-key budget → minimum wins. | resident colliding-budget refusal fixture. |
| B12(b) | returned | Correct phase/generation identity requires changing the replay fold; private host state would forget on restart. | [WO-142-D002](decisions.md#wo-142-d002--preserve-replay-behavior-when-returning-resident-noop-identity), explicit follow-up and reopening tests. |
| B13 | fixed | Driver remained inside 750-line scenario → extracted driver with compatible exports, unchanged bound/behavior. | scenario complete Decision-byte/oracle tests; reactor-slices source boundary; extraction counterfactual. |
| B14 | fixed | Initial AST replacement dropped nested-state coverage → restored the exact original assertion beside alias/destructure AST checks and added nested-access regressions. | kernel/worker AST tripwires; positive typed-driver exception; audit, F-00005/6/7 and presence fixtures; ten counterfactual failures. |
| B15 | fixed | Missing path/cause and ignored invalid CLI/loadout behavior → diagnostics retain subjects, healthy builds survive, unknown argv refuses, staging classified, test-only adapter moved. | process writer-lock/Beacon fixture; worker receipt/effort tests; console factory/cause tests; CLI rejection; verification tests. |
| B16 ★ | fixed | Broad lens scopes, claim-free bare wildcard and Assisted-by trailer accepted → all refuse; human coauthor remains admitted. | seven exact unsafe scopes; compiler active/support wildcard cases; attribution positive/negative fixtures. |
| B17 ★ | fixed | Unfixed defects could remain report prose → all three roles explicitly require structured JSON `followup` or `reopens`. | Generated role-text fixture; refreshed [cold-start measurement](harness-context.json): 21,176 / 18,218 / 19,436 bytes for executor/verifier/reviewer in both roots, within ceilings. |
| C1 | fixed | Release block exceeded bound/said three refusals → thirteen sentences/four refusals; freshness rule requires rewrite. | Documentation counterfactual; README release block sentence count. |
| C2 | fixed | Package headers/compiler example named old versions → version-free text. | Documentation counterfactual and component READMEs. |
| C3 | fixed | Two-refusal playbook and reviewer-only gate → four refusals, planning write/cap/amendment descriptions, any live gate. | Documentation counterfactual; product02 and PLAYBOOK. |
| C4 | fixed | Closed orders shown pending → recorded outcomes and owning evidence links. | Documentation counterfactual; product02/03/06 and skeleton README. |
| C5 | fixed | WO-033 sync attribution and dead clean-room anchor → planned WO-079 and live anchor. | Documentation counterfactual and link resolution. |
| C6 | fixed | Inaccurate overlap/amendment/cap observation prose and duplicate conjunction → exact observed scope, no invented deny probe. | Documentation counterfactual; product07/security guide. |
| C7 | fixed | Planning README omitted amendment event → paragraph documents PlanExecutionAmended. | Documentation counterfactual. |
| C8 | fixed | Runbook versions stale → dated version-only observation: Claude2.1.278, Codex0.155.0; no requalification claim. | Local version/help readback; documentation counterfactual. |
| C9 | fixed | Closed-order downtime instructions presented live → marked historical with date. | Documentation counterfactual. |
| C10 | fixed | Probe-path rule, HOME/TMPDIR, two corpus tests and label undocumented → path-based probe admitted and current behavior documented. | Documentation counterfactual; guide, skeleton/corpus README, environment label. |
| E1 | fixed | Operator expanded scope to Node 26 and TypeScript 7 → runtime range, exact compiler/types pins, native parser migration, TAP reporter and bounded timestamp precision. | [Repair validation](repair-001.md); contextual parser, beacon, package and integrated gate checks. |
| E2 | fixed | Operator merged parallel WO-084 → fast-forward to `c5b2b0e7`, restore preserved work, union follow-up histories, refresh generated projections. | Retained named stash/checkpoint; planning, metadata, publication and release checks. |
| D1 | fixed | Unbounded ignored residue/no prune → preview-only default, explicit apply, installed-target and live-owner protection, published-lane durable inventory. | D1 temporary-root fixtures, target-pin mutant, [real preview](prune-preview.json). No real deletion. |

A7’s pre-edit retained-tool references: authority mutation in
`docs/evidence/WO-042/README.md`; build publication benchmark in
`docs/evidence/WO-126/repair-001.md` and `decisions.md`; Beacon probe in
`docs/evidence/WO-022/README.md` (origin WO-020); Codex effort probe in
`docs/evidence/WO-125/README.md`; target-worker smoke in
`docs/evidence/WO-049/implementation.md`. These already name the owning work.

A10’s exhaustive source search found `sourceVerificationId` only in the
completion writer and its new assertion (other occurrences are historical
report/order prose). The control fold reads failure-source request/verdict
fields, so no runtime reader needed migration.
