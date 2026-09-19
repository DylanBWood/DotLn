# WO-142 repair 002 — VER-002 task, read-admission and non-blocking findings

Dispatch: `resume: fix`, followed by the operator's explicit instruction to
include all N1–N10. Failure source: [VER-002](../../verifications/WO-142/VER-002.md).
Decision: [D016](decisions.md#wo-142-d016--repair-terminal-observations-and-restore-the-admitted-read-class).
The prior failed reports and recorded editions remain unchanged. This is a
repair record; independent verification and final review remain separate.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"ultra","source":"codex-session-readback"}

## Findings and results

| Finding | Repair and evidence |
| --- | --- |
| F1, N1, N2 — background and terminal task facts | Recognize completed/failed/stopped/killed in all native notice envelopes and direct task metadata. A Bash `backgroundTaskId` records automatic timeout backgrounding; a successful statusless TaskStop with returned task metadata records stopped. Errors and unsupported statuses remain unknown. Task facts and invocation lookup are scoped to the current order, phase and dispatch start. Chronological folding keeps an older reconstructed dispatch from replacing a newer terminal state. `scripts/test-observed-facts.mjs` covers envelopes, duplicate deliveries, automatic backgrounding, stop failures, scope and same-scan aliases. |
| N3 — repeated journal work | Build the journal event set and invocation map once per scan, updating both as observations are appended. The committed synthetic regression instruments reads and hashes: two boundaries with 16,636 journal rows and 200 notices use 8 journal reads and 804 hashes. Against the pre-repair build the same test made 408 reads and failed. No new persisted cache or recurring check. |
| F2 — activation read parity | Restore the activation classifier's literal-argument admission for echo/printf/cat/pwd/true/false/ls/head/grep. New programs keep bounded flags; tail admits attached counts. The fixture pins the legacy vocabulary, combined flags, dash data, stdin, unknown literal arguments and all output destinations, while rejecting substitutions and glob expansion. Both B3 tests pass; the parity test fails against the pre-repair build at `echo -`. |
| N4 — Git effects | Correct product 07's claimed prefix guarantee and expand [D012](decisions.md#wo-142-d012--retain-existing-git-admission-with-an-explicit-effects-follow-up). A synthetic Git 2.55.0 probe independently confirmed that prefixed diff can rewrite the index and run a clean filter, and log can run a configured signature program. These enforcement effects remain explicitly owned by D012; this additive read-admission repair does not claim to close them. |
| N5 — stale cold-start evidence | Refresh `harness-context.json` and README/rows prose from current installed bytes: executor 21,176, verifier 18,218, reviewer 19,436 in each root. Headroom is 3,400 / 2,262 / 1,044 bytes; each gained 327 against activation. The JSON's separate historical comparison remains v0.16.0. |
| N6 — TypeScript dependency documents | LEGAL's current inventory and a dated ADR-0002 amendment describe TypeScript 7.0.2, Node 26, Node types 26.6.2 and the native parser consumer. The lockfile records twenty optional TypeScript platform packages as Apache-2.0; Node types, undici-types 8.9.0 and Prettier 3.9.6 are MIT development dependencies. Historical WO-002/WO-011 observations remain dated history. |
| N7 — impossible manual corpus check | The manual generator test pins the original WO-101 toolchain as historical metadata instead of requiring today's process/compiler/OS to match it. Manifest bytes, fixture hashes, seeds and deterministic-generation assertions remain. The documented current-toolchain command passes 5/5 on Node 26.9.0. |
| N8 — unused import | Remove `hashParts` from plan-direct.mjs's import list. Source inspection found no consumer in that module. |
| N9 — release headings | Recognize multiline setext titles, escaped punctuation, dash entities and paired inline decoration. Preserve literal indented code, escaped/unmatched punctuation and quoted fence boundaries. The existing worktree suite contains the reported forms and regressions for the initial repair's quoted-fence/list-continuation mistakes; all pass. This remains a bounded release-notes parser, not a general Markdown renderer. |
| N10 — evidence prose | Correct the semicolon/capitalization and duplicated dispatch sentence in the evidence README; identify repair 002 as current and earlier check records as history. |

Adjacent item `adjacent-0002` corrects terminal lifetime being substituted for
current dispatch age, and Buffer-valued Git diagnostics hiding the original
error behind a `trim` exception. Missing batch objects now appear in their
framing diagnostic. Existing observation and work-order suites pin both.

## Executed checks and causal evidence

- `npm run build` passes on Node 26.9.0 / TypeScript 7.0.2.
- `node --test scripts/test-observed-facts.mjs`: 30 passed, 0 failed.
- `node --test --test-name-pattern='WO-142 B3|VER-002 B3' scripts/test-harness.mjs`: 2 passed, 0 failed.
- `bash scripts/test-work-orders.sh`: 20 passed, 0 failed.
- `bash scripts/test-worktree.sh`: passed, including release-notes publication fixtures and 6 embedded tests.
- `node --test corpus/harness/wo101-generators.test.mjs`: 5 passed, 0 failed.
- `node scripts/harness.mjs check`: 31 generated surfaces current.
- `npm run release -- prepare --local`: v0.32.0 remains current; no files changed and no publication.

Before rebuilding the changed observer/guard source, the new regressions ran
against the pre-repair compiled implementation and failed on killed notices,
automatic backgrounding, TaskStop, stale scopes, same-scan aliasing and repeated
journal reads. The guard parity fixture failed on the legacy `echo -` form.
The same retained commands pass after rebuilding. The logs under
`/tmp/wo142-repair002-*` are session-local observations, not committed artifacts;
the regression source above is the durable reproduction. Two independent
read-only rechecks found no remaining defect in the bounded observer/heading
changes after corrections.

An intermediate build refused an insufficient TypeScript narrowing in the
adjacent age calculation; the corrected build passed. A direct Node invocation
of the work-order fixture failed because it omitted the owned temporary root;
the documented shell wrapper supplied that setup and passed. The first
publication/planning checks reported stale projections after authorized edits;
the refreshed projections are checked with the final subject. The first document
run then failed authority-evidence because bundle-diff.json still described the
old hooks (five dependent checks were not run). Authority revision 003 records
the new bundle without editing revision 002; artifact, verification and feedback
remain selected at revision 002.

## Limits and retained observations

No live Claude task probe or product worker/feedback audit was launched in
this repair. Synthetic native
metadata establishes the repaired adapter behavior. The selected feedback
revision 002 is unchanged because none of its declared source inputs changed;
current evidence checks still judge its applicability. B4's live schema
acceptance and worker-host probing remain unobserved (VER-002 L2/L3).

D002, D005, D008, D009, D012 and D015 retain their named follow-ups. D017 owns
the bounded observation improvements and batch-capacity work not taken in this
repair. VER-002 O1's Node timestamp rounding and O3's large-file parser timings
remain the measured limitations of the previously accepted runtime migration.
O6 is corrected in roadmap, playbook and release docs: missing latest-tag
fetching precedes close-path selection. O7 records the existing live edition's provenance; O8's PR draft remains under
final-review ownership. O10 is a historical preview-method qualification;
O11's operator-run preview is still not claimed by this executor. No real
prune deletion occurred. O12 is the existing conservative host boundary.

The root was the sole writer; three read-only helpers were reused, with no
helper descendants. Entry usage counters were unavailable; handoff counters
became available and remain in the ignored receipt and response. Cost and
unobserved agent coverage remain unknown. The passing checks, repaired task facts and lower
journal read/hash counts establish D016's local benefit; later live boundaries
and independent verification still judge durability.


## Final repair evidence

On Node 26.9.0 with TypeScript 7.0.2:

| Check | Result |
| --- | --- |
| `npm test -- --review` | **35 passed, 0 failed; 310.77 s; 79 fresh tasks.** Includes the four-refusal harness fixtures, application packages, release/lifecycle, planning and runner/probe tests. |
| `npm run test:docs` | **19 passed, 0 failed; 15.31 s; 19 fresh tasks.** Current authority revision 003, other selected evidence, publication locks, planning, metadata and formatting pass. |
| Manual corpus generator check | **5 passed, 0 failed.** Historical manifest/toolchain metadata and fixture bytes preserved. |
| Preservation comparison | All **47** prior report/evidence files outside the four mutable README/rows/decisions/context surfaces match repair-entry checkpoint 8 byte-for-byte. |
| Diff checks | Working-tree and staged `git diff --check` pass. |

The feed reports 426 total, 89 pending and 8 untriaged; D017 is the added
explicit follow-up and D016 does not refill the feed. The queued diagnostic
item is completed, and the prior replay deferral remains owned by D005.
Source diffs and current authored prose were reviewed; generated or oversized
surfaces use their passing generation/check evidence. Explicit read receipts
are recorded only for the current-byte ranges delivered through the reader;
no automatic Codex read-hook coverage is claimed. Only report/projection
completion follows these checks. The minor v0.32.0 preparation is retained;
no commit, publication or real prune deletion is claimed.
