# WO-142 repair 001

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.0","model":"gpt-6-astra","effort":"ultra","source":"codex-session-readback"}

The operator requested `resume: fix`, expanded scope to Node 26 and TypeScript 7,
and requested integration of the parallel main merge. This repair addresses
[VER-001](../../verifications/WO-142/VER-001.md), preserves its failed verdict,
and prepares v0.32.0 for independent re-verification. The amended work order and
[D010–D014](decisions.md#wo-142-d010--integrate-main-and-upgrade-node-and-typescript)
record authority, tradeoffs and claim corrections. No commit or publication was made.

## Repairs and integration

| Finding | Current change and evidence |
| --- | --- |
| F1 / A4 | Historical control and annotated-tag blobs are read in validated Git batches. Every changing transition refreshes the index; non-transitioning `next` refreshes `current.md` without refreshing the index. The 62-tag/40-ms-per-Git fixture completes changing dispatch within 12 seconds; the unrepaired version times out. On a real index comparison, Git calls fell from 374 to 68, output stayed byte-identical, and measured elapsed time fell from 1.60 s to 0.43 s (single paired observation). |
| F2 / B2 | Bash uses native `backgroundTaskId`; terminal notices admit queue enqueue/content and queued-command attachment/prompt envelopes. Removal, pre-start, invalid-time and unrelated records are ignored. Invocation aliases join hashed task IDs; duplicate deliveries retain the first completion time. The generated PostToolUse fixture proves the active repair scope reaches the real observer. |
| F3 / B3 | Restore harmless grep, head, ls and cat flag forms while retaining redirect destinations and unsafe-option refusals. Generated hook fixtures exercise classification during a live synthetic gate. Git's safe no-lock/no-fsmonitor prefix is additive; the older metadata-admission limitation remains explicitly deferred in D012. |
| F4 / B14 | Restore the exact pre-existing nested-state assertion beside the new AST alias/destructuring checks. Nested `.state.policy`, computed fields and nonstandard receiver names remain rejected; typed driver exceptions remain bounded. |
| N1–N4 | Remove the unused worktree import; correct no-publish close/tag wording; recognize setext and list-prefixed reserved headings; retain plural ledger references and refresh the work-order index when meta runs after an order’s first decisions file is written. |
| N5–N6 | Deduplicate identical advisories across hook kinds. Normalize only live version literals in version.ts, remove dead masks, and declare that file in evidence and machinery inventories. Tests prove release-only changes are ignored while nonliteral behavior selects all eight consumers; `.env` reads must produce the sensitive-read advisory. |
| N8–N11 | Protect the native Claude session environment key during prune. Pin the driver module/re-export boundary. Normalize effort aliases case-insensitively while preserving raw spelling. Update kernel full-candidate append and compiler bare-wildcard documentation. |
| N12–N14 | Distinguish dated temporary-helper observations from committed regressions; correct A16/B2/B3/B14 claims. Generated role contracts explicitly require structured JSON `followup` or `reopens` for unfixed defects. |

The WO-142 worktree integrated `origin/main` by fast-forwarding from `cb932c84` to `c5b2b0e7` (WO-084). The named
pre-integration stash and checkpoint remain intact. Follow-up entries and both
histories were unioned; WO-084's ledger and immutable reports were preserved.
Release preparation confirms the existing minor target v0.32.0 remains current.

## Node 26 and TypeScript 7

`.node-version` pins 26.9.0; all package engines support Node major 26. Compiler
and runtime parser dependencies are exactly TypeScript 7.0.2, with Node types
26.6.2 and lockfile platform dependencies. `npm install --ignore-scripts` completed
with zero reported vulnerabilities. Kernel and compiler runtime dependencies
remain empty. The staged atomic build passes with the native compiler. Discovery check
subprocesses disable Node's binary compile cache, preventing npm from creating
binary runtime artifacts in the bounded reference corpus while preserving its
binary-file refusal. The unchanged profile/default regression passes with this
setting and fails when it is reverted.

Three test consumers and the product's source-comment boundary use native virtual
projects. The boundary batches before/after sources, protects contextual string,
regex, template and JSX spans, and closes native resources. Parser loading is lazy.
Feedback regression parsing explicitly requests TAP because Node 26 defaults to
another reporter. Beacon publication admits readback only in
`[targetNs, targetNs + 1000ns)`, with one bounded retry, preserving encoded integer
milliseconds and failed-publication bytes/inode/time. Raw nanoseconds, age/skew
rules and same-host replay remain unchanged; cross-runtime nanosecond identity
is not asserted. This intentionally replaces the old exact-nanosecond contract
and resolves D007 for the declared Node 26 runtime.

## Validation

Executed under Node v26.9.0 and TypeScript 7.0.2. Focused validation passed:
35 native compiler/API/feedback checks; 55 beacon/senses/worker/edition/reactor
checks; 19 work-order fixtures; 19 selected harness/gate checks; and the three
final native-notice/inventory regressions. These are separate selections with
possible overlap, not an aggregate unique-test count.

All four current evidence kinds select immutable WO-142 revision 002. Original
editions and the first repair revision 001 retain their bytes. The replacement live feedback audit used
`codex-cli-exec`, `gpt-6-astra`, `xhigh`; it completed every acceptance row,
recorded ten passing mechanisms and ten removal failures, and measured 1,192
fewer instruction bytes in the matched projection. The selfhost recorder passed;
all five console fixtures match JSON, terminal and HTML after repinning the
selfhost input. Raw worker receipts remain ignored locally.

The first integrated gate completed 79 fresh tasks in 296.93 seconds: 30 suites
passed and five failed. The failures and subsequent changes are preserved in
D014. The full skeleton selection then passed **366/366** under Node 26, the
resume shell fixture passed, and the external worktree fixture passed after
resolving its Node executable path. The runner's four affected selection,
inventory and machine-reporter cases passed. The real process dispatch/briefing
fixture passed after extracting observed facts before removing only its exact
optional beacon warning. Further integrated gate results follow below. Publication
locks currently pass (272 indexed headings, 30/45 linked sections); release
preparation remains local. Planning and metadata projections are refreshed
before the integrated run.

## Limits and retained follow-ups

The Git optional-index/fsmonitor exception is retained with its concrete effects
and next planning action in D012 (N7). D002's resident NoOp identity and D005's
append-serialization divergence retain their replay-scoped follow-ups. D008's
historical mutation-tool reproduction and D009's two out-of-row lexical entry
guards remain recorded follow-ups. The repair does not relabel those as fixed.
Temporary counterfactual helpers are not committed artifacts; the commands below
identify retained fixtures and exact reverted behavior for reproducible comparisons.

The root was the only worktree writer. Three reused read-only helpers performed
grouped spot-checks, and two independent live feedback verifiers ran (five agents
against cap 20; unobserved counts remain unknown). Entry token and cost counters
were unavailable. Final usage stays in local receipts and the handoff response.
Independent verification and final review are still separate workflow steps.

## Independent repair spot-check — F2, N5, N6, N8, N14

Executed under Node 26.9.0 in an isolated copy of the repair subject. Copy contained tracked/public worktree files and the current compiled packages, excluded intake and local control data, and used fresh synthetic fixtures. Root checkout was never mutated. Each counterfactual changed only the isolated copy, ran the same named check, then restored its bytes. No live worker or transcript content was read.

Positive baseline commands:

- `node --test --test-name-pattern='WO-142 B2' scripts/test-observed-facts.mjs`: 4 passed, 0 failed.
- `node --test --test-name-pattern='WO-142 repair B1|WO-142 repair B2|WO-142 repair D1|WO-142 B6|WO-142 B17' scripts/test-harness.mjs`: 5 passed, 0 failed.
- `node --test --test-name-pattern='evidence compares component|immutable evidence' packages/skeleton/dist/test/evidence-editions.test.js`: 2 passed, 0 failed.
- After root retained the negative F2 cases and corrected inventory selection: `node --test --test-name-pattern='review selection ignores release-only|F2 queue remove|F2 mixed native' scripts/test-runner.test.mjs scripts/test-observed-facts.mjs`: 3 passed, 0 failed.

Counterfactuals, all nonzero as expected:

| Finding | Reverted behavior in isolated compiled subject | Discriminating result |
| --- | --- | --- |
| F2(a) | Remove `backgroundTaskId` from background tool ID projection | All three Bash/native-notice fixtures fail because dispatch observation is null. |
| F2(b), queue | Disable queue enqueue/content adapter | Queue fixture stays `dispatched`, expected `completed`; 1 fail. |
| F2(b), attachment | Read queued attachment `.content` instead of observed `.prompt` | Attachment fixture stays `dispatched`, expected `completed`; 1 fail. |
| F2(b), stream | Separately remove queue and attachment row admission from the transcript reader | Respective native-envelope fixture fails in each run. |
| F2(c) | Remove PostToolUse `workOrder` and `phase` stamp | Real generated-hook regression gets `undefined`, expected `WO-999`; 1 fail. |
| N5 | Restore hook kind inside advisory identity | Second hook emits identical advisory instead of staying quiet; 1 fail. |
| N6, live mask | Disable `version.ts` release-literal normalization | Content comparison and immutable-edition fixture both fail; 2 fail. |
| N6, inventories | Separately remove `version.ts` from common evidence sources and from the first direct harness machinery source list | Current runner selection fixture fails in each run; baseline passes and also verifies nonliteral behavior selects all eight consumers. |
| N6, credentials | Remove `.env` from `permissionEffect`'s native path classifier | Explicit output-read pin has no `credentials.access` advisory; 1 fail. |
| N8 | Remove `CLAUDE_CODE_SESSION_ID` fallback | Current-session marker with a stale owner becomes a prune candidate; 1 fail. |
| N14 | Restore prose-only `named follow-up` wording | Generated role test fails explicit structured `followup`/`reopens` contract; 1 fail. |

Additional independent F2 probes passed 2/2. The first asserts no task is created from queue removal for a previously unseen task, a pre-start notice, unrelated attachment type, invalid timestamp, wrong message role, or nonterminal status. The second mixes queue, attachment and user deliveries for one invocation alias, requiring one hashed task, one terminal journal row, original 60-second elapsed time, repair scope and no retained synthetic payload. Removing the startedAt filter fails the first probe; restoring position-based notice IDs fails the second (180,000 ms instead of 60,000 ms). Root retained these exact cases in `scripts/test-observed-facts.mjs`; their two counterfactuals were rerun against that retained test file and failed identically.

The first attempt at the N6 credentials counterfactual changed only `harness-command`'s classifier and survived. This was not accepted as evidence: `outputReadCommand` routes the request through the native Read classifier first. The corrected counterfactual above changes that exercised native path.

The initial N6 inventory counterfactual was discarded because its positive baseline still contained the obsolete assertion that version.ts belonged to no machinery inventory. Root corrected that test; the final positive baseline passed and both independently reverted inventory additions failed, as recorded above.

Independent review found no F2 implementation defect in the typed native-envelope paths, hashed join/dedup, valid-time filtering or scope stamp. No claim of a live Claude task observation is made by these synthetic checks.

## Final repair check record

Measured on 2026-09-19 on the integrated Node 26.9.0 / TypeScript 7.0.2 subject.
The remaining edits after these runs are report, follow-up disposition and index
projections; product source and selected evidence retain the passing identity.

| Check | Observed result |
| --- | --- |
| `npm run test:docs` | **19 passed, 0 failed; 15.24 s; 19 fresh tasks.** Includes WO-084 lineage checks, current publication locks, planning, formatting, metadata and all selected evidence checks. |
| `npm test -- --review` | **35 passed, 0 failed; 307.65 s; 79 fresh tasks.** Includes harness 137.27 s, process-debt 57.37 s, resume 22.89 s, worktree 62.84 s, skeleton 62.88 s, all other application packages and the complete release fixture inventory. |
| Corrective runtime selection | Full skeleton **366/366 passed** before the final gate; the integrated gate then independently passed that suite again. The separate resume run used the gate's `suiteEnvironment`; a preceding direct shell run inherited session metadata and was not a valid isolated fixture invocation. |
| Corrective runner checks | TAP output is explicit in every declared Node test command. The preserved historical-command inventory ignores only the presentation flag; all four affected inventory/selection tests passed before the final runner suite passed. |
| Local release preparation | v0.32.0 remains the current minor target; no publication. |
| Current evidence | All four kinds select immutable revision 002. The independent live audit and recorder passed; all five console fixture projections match. Revision 001 and original editions remain intact. |
| Diff validation | Working-tree and staged `git diff --check` pass. No unmerged paths remain. |

The Node 26 beacon follow-up D007 is settled in the existing register with
D011/D014 and the passing gate as evidence. The integrated register now has
424 total rows, 87 pending and 6 untriaged, compared with 364 untriaged before
the planning settlement and zero immediately after that historical settlement.
The retained untriaged actions are not a claim that ordinary decisions refill
the feed; the next planning pass remains the benefit test.

Current installed instruction plus role bytes, compared with activation
`cb932c84`, are 21,176 executor, 18,218 verifier and 19,436 reviewer: each +327
bytes in both harness roots, within its existing ceiling. The other three roles
have zero delta; refuter's ceiling remains unset. These measurements exclude
task documents and do not estimate tokens. The repaired index's measured Git
call reduction, current runtime compatibility and retained guard regressions
support the intended maintenance benefit. The additional failed gate and live
revision are explicit execution costs, not omitted from that judgment.
