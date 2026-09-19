# WO-142 repair 003 — stable terminal facts and immediate native notice delivery

Dispatch: `resume: fix`. Failure source:
[VER-003](../../verifications/WO-142/VER-003.md), F1 and N1–N2.
Decision: [D019](decisions.md#wo-142-d019--keep-terminal-task-facts-stable-across-later-observations).
Prior reports, repair receipts and evidence editions remain unchanged.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

## Repair and discriminating evidence

| Finding | Result and evidence |
| --- | --- |
| F1 — terminal state demoted by later TaskOutput/TaskStop | The fold keeps the chronologically earliest terminal state/time and independently the earliest dispatch. Nonterminal observations still follow chronology. Four native transcript sequences cover completed/failed → text TaskOutput, completed → failed TaskStop, and killed → successful TaskStop. All 120 append permutations of dispatch, completion, stop, running and unknown observations retain the expected state and duration. |
| N1 — idle native delivery missed before transcript flush | UserPromptSubmit passes its prompt into the existing scoped native-envelope parser. It observes a terminal notice with no transcript available and in the generated hook with an unflushed transcript. Duplicate/later deliveries add nothing. A later-flushed, earlier transcript time is appended once and shortens elapsed; it cannot restart the timer. Prose, quoted envelopes and unsupported statuses establish no task. |
| N2 — earliest dispatch and reconstruction scope unpinned | A multiple-dispatch fixture discriminates earliest from latest while retaining the newer nonterminal state. Phase, order and dispatch-start fixtures separately prove that stale journal aliases and notice identities cannot contaminate reconstruction. |

Executed on Node 26.9.0 / TypeScript 7.0.2:

- `npm run build`: passed. The initial build caught an optional-property type mismatch in prompt forwarding; the conditional property form compiles.
- `node --test scripts/test-observed-facts.mjs`: **41 passed, 0 failed**.
- `node --test --test-name-pattern='VER-003 N1 generated|WO-142 repair B2' scripts/test-harness.mjs`: **2 passed, 0 failed**.
- Before source rebuilding, the eleven new observation tests failed six cases against repair 002's build; the generated prompt test also failed. The unchanged behavior pins correctly passed that subject.
- Deliberate mutations of current built source, loaded only in disposable test processes: latest-dispatch selection fails **1/1** targeted test; removing reconstruction's journal scope fails **3/3**; dropping prompt ingestion fails **1/1**; preventing earlier transcript reconciliation fails **1/1**.
- The existing cost regression remains **8 journal reads and 804 hashes** across two boundaries with 16,636 journal rows and 200 notices. Prompt handling adds no persisted cache or recurring polling.

The retained test source contains the durable synthetic reproductions.
Counterfactual loader scripts and command output are session-local under
`/tmp/wo142-repair003/`; no production source was overwritten for mutations.

## Sanitized local replay

A bounded replay scanned **249** top-level transcript files in local DotLn
project directories, excluding intake-named directories. **185** held recognized
native task envelopes at valid timestamps: **1,195 envelopes**, yielding **647
terminal tasks**. Every replay ingested at least one notice, avoiding VER-003
O3's silent wrong-root result. No subagent transcript directories were scanned.
This is this repair's corpus, not a claim to repeat VER-003's 213-file corpus.

Before writing disposable transcript fixtures, the script retained only native
envelope shapes, allowed tool names, task metadata, timestamps and error flags;
it hashed native task/call identifiers and replaced command, prompt, summary
and output contents. Each fixture's cwd and session metadata named its disposable
root. It ran both the saved entry observer and the repaired observer through
`observationBoundary`, then compared their task facts with the earliest explicit
terminal observation for each key. Disposable roots were removed after reading
the results. No source transcript was changed or copied into the repository.

| Replay subject | Wrong terminal states | Wrong terminal times |
| --- | --- | --- |
| Repair 002 observer | 41: 33 completed → unknown, 3 failed → unknown, 5 killed → stopped | 62 |
| Repair 003 observer | **0** | **0** |

The time comparison includes later terminal observations that leave state
unchanged. Counts describe sanitized reconstruction, not live hook interleaving.
No live Claude task session, product worker or feedback audit was launched.
The generated-hook fixture is the evidence for the pre-flush prompt path.

## Scope, release and retained limits

Only the observer, its prompt caller, their existing tests, current factual
write-backs and generated evidence/projections change in this repair. The
executor is the sole writer; no helpers were spawned. Product 07 documents
terminal chronology and the prompt-time/transcript-time distinction. The new
authority revision **004** records the regenerated 31-surface bundle; authority
003 and the earlier editions retain their bytes. Artifact, verification and
feedback remain selected at revision **002**. Neither changed source belongs
to `FEEDBACK_SOURCE_PATHS`; current evidence checks judge applicability.

`npm run release -- prepare --local` reports **v0.32.0 remains current**. Its
"no files changed" message was inaccurate: the helper rewrote four metrics
lines in the existing PR draft. Source inspection identified its unconditional
process-table refresh. After the gate, only those four generated changes were
undone, preserving the draft's entry bytes. [D020](decisions.md#wo-142-d020--board-up-the-release-preparation-write-reporting-mismatch)
owns the reporting and draft-ownership follow-up. The minor classification and
publication controls remain. No branch commit, retained PR edit, push, publication, settings change or real
prune deletion was performed. VER-003 O5's existing PR draft stays with the
reviewer. O6's operator-run real prune listing remains unobserved; this repair
does not claim it. D018 retains the separately owned shell-word screening
follow-up. Earlier boarded findings and live-schema/probe limits remain as
recorded in repair 002 and VER-003.

The observable terminal-state and timing failures are corrected in the tested
class without additional recurring machinery, supporting D019's stated benefit.
Independent verification and final review remain separate dispatches.

## Final repair evidence

| Check | Result |
| --- | --- |
| `npm test -- --review` | **35 passed, 0 failed; 307.99 s; 79 fresh tasks.** |
| `npm run test:docs`, after final documentation and D020 | **19 passed, 0 failed; 15.34 s; 19 fresh tasks.** Includes authority 004, all other selected evidence, publication, planning, indexes and formatting. |
| Preservation against repair-entry checkpoint 13 | **53** earlier report/evidence files, including the existing PR draft, are byte-identical. Only the current README, rows and decisions surfaces are excluded. |
| Release preparation | Minor **v0.32.0** retained; the helper's four-line draft refresh was undone and its diagnostic mismatch is D020. |
| Follow-up feed | **428 total, 91 pending, 10 untriaged**, versus 427 / 90 / 9 after VER-003 and the planning pass's historical 364-before / zero-after untriaged count. D020 adds the one new action; D019 creates no feed row. |

Working-tree and staged whitespace checks passed. The code and generated
bundle remained unchanged after the integrated gate. Only report/index
completion followed the final document gate. Current changed source and test
ranges and authored prose were read; generated and oversized outputs use their
passing generation/check evidence. Explicit read receipts describe only bytes
actually delivered, with no automatic Codex hook coverage claimed. Earlier
queue dispositions remain intact, with no pending or running queued action.
Usage became available at handoff and remains in the ignored session receipt
and response; cost is unknown. The actual session is gpt-6-astra, xhigh,
codex-cli 0.155.1, from current-session readback.
