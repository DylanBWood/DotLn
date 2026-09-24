# WO-153 decisions — Codex session entry advisory

Dispatch: `resume: next` on 2026-09-24, Claude Code executor, model
`claude-opus-5-5[1m]`, effort `xhigh` (`CLAUDE_EFFORT` readback: selected, not
effective). Authority:
`docs/work-orders/WO-153-codex-session-entry-advisory.md`. Sources: WO-149 D001
and D009, the two planning refutation receipts named in the order, and the
code at the activation checkpoint `9b46597e`. `docs/evidence/WO-149/decisions.md`
is not edited.

## WO-153-D001

```json
{
  "id": "WO-153-D001",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-153 objective and design §Scope discipline",
  "decision": "Wrap the begin step of the Codex dispatch branch in scripts/resume.mjs, meaning the dynamic import of the built harness host and the beginHarnessSessionOnce call it exists to make, in one try/catch. On any error that escapes beginHarnessSessionOnce (which already absorbs the exact already-began refusal and returns null), write `DotLn advisory: Codex session entry failed (<error message>); process cost remains unknown; cause no-session.` to stderr and continue, so the dispatch prints its briefing and exits 0 as it does after a successful begin. The unbuilt-runtime branch, the no-thread guard, the dispatch table, the handler and the host adapter are unchanged.",
  "evidence": [
    "scripts/resume.mjs at checkpoint 9b46597e: the begin call (then lines 1207-1214) sat inside the handler's try after the verify, fix and final-review case blocks had appended their transitions, with no catch; the handler rethrows unless releaseExecutorWriter is set, which only implementation-ready (line 947) and repair-complete (line 1054) assign; process.stdout.write(message) follows the try. Line numbers moved from the order's 2026-09-22 read; the structure is as the order describes.",
    "packages/skeleton/src/harness-host.ts beginHarnessSessionOnce (line 1584) absorbs only the error whose message is exactly 'Session already began; do not erase its observations' and rethrows the rest; beginHarnessSession (line 1501) throws 'Invalid harness session' for a role outside its six-role list.",
    "scripts/lib/harness-runtime.mjs currentHarnessSessionReport, codexSessionReport and observedFactsReport already catch their own failures, so after this change nothing between the begin and process.stdout.write refuses on the Codex dispatch path's measurement step.",
    "Executed red check 2026-09-24: with the checkpoint's scripts/resume.mjs restored temporarily, the new WO-153 fixture fails at `next` with exit 1 and `error: Invalid harness session`; with the change restored byte-for-byte (cmp), the fixture passes.",
    "Executed 2026-09-24: `node --test --test-name-pattern='WO-149|WO-153' scripts/test-process-debt.mjs` passes 3/3, and the two WO-149 cases are byte-unchanged in the diff (one added hunk after them).",
    "Inference from harness-host.ts, not observed: beginHarnessSession writes the session JSON before record() appends the observation row, and record() can throw ('Host observation log is not a regular file'). In that partial case the advisory still says cause no-session, while a later `harness usage` readback may measure from the written record and the next dispatch sees an already-began session and stays silent. This order does not change when or how a session begins (non-goal), and the dispatch's exit behavior before this order was worse in the same case."
  ],
  "rejected": [
    {
      "option": "Wrap the beginHarnessSessionOnce call alone, leaving the dynamic import outside the catch",
      "reason": "A present-but-unloadable harness-host.js (a partial or stale build whose import rejects) fails the same way the begin call does: after the transition is appended, the dispatch exits 1 and withholds the briefing. The import exists only to make the begin, D009's follow-up asks to catch every begin failure and names a stale dist bundle as one trigger, and the advisory carries the loader's own message, so D001's visibility requirement still holds. Nothing else is wrapped."
    },
    {
      "option": "Retry the begin",
      "reason": "Declined by the order: a second write to a store that has just refused."
    },
    {
      "option": "Report a graceful unknown without the cause, as Copilot does",
      "reason": "Declined by the order and by WO-099 D035: an unnamed unknown hides an invalid role, a missing identity or an unwritable store, which is what WO-149 D001's rejection protected."
    },
    {
      "option": "Leave the throw (NoOp)",
      "reason": "It withholds the allocated report path after a transition that the role text forbids repeating (WO-149 D009), which refuses lifecycle work over a measurement concern contrary to the WO-132 stand-down."
    },
    {
      "option": "Widen the set of Codex dispatches that begin a session",
      "reason": "A non-goal of this order; receipt 022's separate known issue is to be decided on its own evidence."
    },
    {
      "option": "Route the failure through the handler's 'Completion recorded; final handoff failed' guidance",
      "reason": "That path still exits 1 and suppresses the briefing, and it exists for completions that release the executor writer. None of the five dispatches is a completion."
    }
  ],
  "reopenWhen": "A Codex dispatch is observed exiting non-zero from the session-entry call; a partial begin (session JSON written, observation row refused) is observed and its advisory's cause no-session misleads a receipt; the begin gains another caller that records a transition before it; or the advisory is observed hiding a failure that should refuse the dispatch."
}
```

## WO-153-D002

```json
{
  "id": "WO-153-D002",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-153 design (fixture) and acceptance criteria 1-3",
  "decision": "Add one case, `WO-153 a Codex dispatch whose session entry fails names the cause and still delivers its briefing`, beside the two WO-149 cases in scripts/test-process-debt.mjs. It forces the failure by rewriting the five values of the copied resume.mjs's codexDispatchRoles table to an invalid role, so the host itself throws 'Invalid harness session'. It then runs next, verify, fix, final-review and release-close in one runtime fixture, reseeding the control segment to each action's phase before its dispatch. For each action it asserts exit 0, the briefing on stdout, the exact advisory line on stderr, the control segment equal to its seed plus exactly the expected transition (none for next and release-close), the briefing's report path equal to the appended event's reportPath, no session record, a `harness usage` readback of `unknown; cause no-session` with null tokens, and judgeCostLine admitting the resulting cost line. With the real table restored, a successful begin and its repeat write no advisory and keep the session bytes identical, and a threadless dispatch writes no session record and no advisory.",
  "evidence": [
    "The order admits either an unwritable session root or an invalid role injected through the fixture's own dispatch table.",
    "The fixture asserts the copied table has exactly five role values before rewriting it, so a renamed or reshaped table fails the case instead of silently removing the forced failure.",
    "Phase seeds follow the existing fixtures' event shapes (ImplementationReady; VerificationRequested/VerificationCompleted fail or pass; FinalReviewRequested/FinalReviewCompleted pass), which the adjacent-queue and release-close fixtures already drive through the real resume.mjs.",
    "CODEX_HOME points at an empty fixture directory and the usage readback runs without a thread identity, as the WO-149 case does, so the case reads no operator transcript.",
    "Executed 2026-09-24: the case passes in 1,229.99 ms; its red check against the checkpoint's resume.mjs fails at next with exit 1."
  ],
  "rejected": [
    {
      "option": "Force the failure with an unwritable session root (chmod)",
      "reason": "A process running as root ignores the mode, a replica's read-only mounts already change modes (the repo() teardown restores them), and other readers of docs/control/local would fail for unrelated reasons, so the case would not isolate the begin. The invalid role is deterministic and still a host-reported error."
    },
    {
      "option": "Replace the fixture's built harness-host.js with a stub whose begin throws",
      "reason": "The same module serves the usage readback the criterion requires, so the stub would have to be swapped back mid-case; the dispatch-table injection is the order's named alternative and touches only the copied script."
    },
    {
      "option": "Edit the WO-149 cases to add the silence assertions",
      "reason": "Criterion 2 requires the two WO-149 cases to pass without edits; the new case carries the silence assertions instead."
    }
  ],
  "reopenWhen": "The dispatch table is restructured so its values are no longer string literals in one object, the host's role validation changes, or a later criterion needs the unwritable-store path specifically."
}
```

## WO-153-D003

```json
{
  "id": "WO-153-D003",
  "kind": "experiment",
  "date": "2026-09-24",
  "dispatch": "resume: next; Tinkerer — Economy equipped by default (WO-150)",
  "decision": "Keep the file's current method, one runtime fixture per test() with phases seeded inside it, and reseed the control segment to each action's precondition instead of building a fresh runtime repository per action.",
  "question": "Should the five-action fixture build a fresh repo({runtime:true}) per action (fully independent cases), walk one repository through the real lifecycle, or reseed one repository's control segment to each action's phase?",
  "alternatives": [
    "A fresh runtime repository per action, five constructions",
    "One repository walking next → verify → fix → re-verify → final-review → release-close, each dispatch's transition feeding the next",
    "One repository, control segment reseeded to each action's explicit event prefix before its dispatch"
  ],
  "observation": "Construction cost against one dispatch. If construction is small against the gate but material against the case, one construction is kept; between the two single-repository shapes, reseeding keeps each action's precondition explicit and independent of the previous action succeeding.",
  "budget": { "wallSeconds": 300 },
  "execution": "run",
  "cost": {
    "wallSeconds": 145,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p node --test --test-reporter=spec --test-name-pattern='WO-149' scripts/test-process-debt.mjs",
      "node $DOTLN_SCRATCH/economy.mjs \"$PWD\""
    ],
    "source": "Session transcript timestamps only (no content emitted): the question was announced with the first measuring command at 2026-09-24T15:40:40.9Z and the decision was stated with the next command at 15:41:29.4Z (48.5 s); recording ran from 15:45:15Z until the record was written at 15:46:51Z (96 s), for about 145 s in total, excluding the seconds spent correcting this line from an earlier estimate. Tokens are null because the only counter is cumulative and dispatch-scoped."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test --test-reporter=spec --test-name-pattern='WO-149|WO-153' scripts/test-process-debt.mjs"
    ],
    "summary": "Five timed constructions of the runtime fixture (git init, three copied dist trees, symlinks, commit, script copies and beacon fixture) took 103.1, 108.8, 101.2, 101.0 and 101.6 ms (mean 103.1 ms); one Codex `next` dispatch in it took a mean of 138.6 ms over five runs. Four extra constructions would add about 0.41 s, roughly a third of the delivered 1.23 s case but about 0.1% of a gate measured in minutes. Reseeding avoids it at no loss of per-action independence. Per-order values stay null because suite frequency is not measured here."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-21",
    "experimentsSinceAdoption": 6
  },
  "evidence": [
    "Baseline before any edit: WO-149 cases 458.31 ms and 166.38 ms, 2/2 pass",
    "History derived from the committed experiment records: the latest adopted outcomes are WO-148 and WO-149 (2026-09-21); WO-100, WO-120, WO-151, WO-152 and WO-157 recorded kept-current after them, and this record is the sixth"
  ],
  "rejected": [
    {
      "option": "A fresh runtime repository per action",
      "reason": "About 0.41 s more per suite run for independence that reseeding already gives."
    },
    {
      "option": "Walk one repository through the real lifecycle",
      "reason": "Each action's precondition would depend on the previous dispatch succeeding, so one regression would cascade into four misleading failures; the completion events between dispatches have to be seeded anyway."
    }
  ],
  "reopenWhen": "Runtime-fixture construction grows past the dispatch it serves, or a later criterion needs the dispatches to observe each other's appended transitions."
}
```

## WO-153-D004

```json
{
  "id": "WO-153-D004",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-153 release classification (patch, assigned at activation)",
  "decision": "Assign application `v0.45.1`, the next patch above the observed local `v0.45.0` tag, in the order's heading, the README release claim and a dated activation-completion note in 06-roadmap §Release boundary; bump no component. `npm run release -- prepare --local` then reported the target current and wrote the PR meter block.",
  "evidence": [
    "`git tag -l 'v*' --sort=-v:refname` observed v0.45.0 as the latest local tag; remote tags were not observed (local snapshot only)",
    "Activation left the heading at '(version assigned at activation)' and the README index at 'Application target: unassigned'; `release prepare --local` refused until the heading and the README release block both named one strict version",
    "The change touches scripts/resume.mjs and scripts/test-process-debt.mjs only; no package under packages/ changes, so no compiler, kernel, skeleton or console version moves",
    "WO-149 and WO-157 recorded their assignments the same way (06-roadmap activation-completion notes)"
  ],
  "rejected": [
    {
      "option": "Leave the version unassigned for final review to set",
      "reason": "The executor duty is to prepare the classified release; final review retimes an assigned target against main rather than choosing one."
    }
  ],
  "reopenWhen": "A sibling order publishes v0.45.1 first (final review retimes under the same patch classification) or the change grows into a package."
}
```

## WO-153-D005

```json
{
  "id": "WO-153-D005",
  "date": "2026-09-24",
  "dispatch": "resume: verify; VER-001",
  "decision": "Record the independently reproduced partial-begin failure as a criterion 1 defect for repair. The new catch admits the dispatch and prints its briefing, but says cause no-session after the host has written a session JSON and then fails to append its observation row; the later usage readback reports a different cause.",
  "evidence": [
    "At the current subject, packages/skeleton/src/harness-host.ts writes statePath(root, input) before record(root, input). record refuses a non-file observation path with 'Host observation log is not a regular file'.",
    "Verifier isolated probe 2026-09-24: in a temporary Git repository, precreated the SHA-256 session-key .jsonl path as a directory; beginHarnessSessionOnce(root, session, 'verifier') threw 'Host observation log is not a regular file', the session .json existed, and measureHarnessUsage(root, session) returned cause 'session-counters-unavailable' with null totalTokens. The temporary repository was removed; the selected worktree's implementation was not edited.",
    "scripts/resume.mjs catches that error and unconditionally prints 'cause no-session'; the WO-153 fixture injects an invalid role, which throws before statePath is written, and therefore does not cover this path."
  ],
  "rejected": [
    {"option": "Keep no-session for every escaped begin error", "reason": "The reproduced post-write error leaves a readable session and a different usage cause."},
    {"option": "Treat the admitted dispatch alone as criterion 1 passing", "reason": "Criterion 1 also requires the no-session usage readback, and the objective requires a named cause that does not hide the failure."}
  ],
  "followup": "On resume: fix, make a post-write session-entry failure report a truthful closed cause consistent with the subsequent usage readback, or recover the incomplete record so no-session is true; add an executable partial-begin fixture and preserve the admitted dispatch and briefing behavior for the five actions.",
  "reopenWhen": "The repaired path still emits a cause that disagrees with a subsequent usage readback, or a repeated dispatch silently treats an incomplete session as a completed begin."
}
```

## WO-153-D006

```json
{
  "id": "WO-153-D006",
  "date": "2026-09-24",
  "dispatch": "resume: fix; VER-001 F1 and WO-153-D005 (FUP-c02d54c7d663b508); operator scope expansion during the repair (2026-09-24) directing that the needed fix be made rather than deferred",
  "decision": "Fix the partial begin at its source. In packages/skeleton/src/harness-host.ts beginHarnessSession, when record() fails to append the entry observation after writeJson has written the session record, remove that record (unlinkIfPresent) and rethrow the original error. D005's 'recover the incomplete record so no-session is true' then holds for every caller, including `node scripts/harness.mjs begin`. scripts/resume.mjs returns to the bytes VER-001 verified (SHA-256 7fda4bd85ef139f1df39339d0f20c9d30d8b421bfc7fc7234cd2e7745157f86e): its D001 catch prints the host's message and `process cost remains unknown; cause no-session`, which is now true. Skeleton moves 0.38.0 → 0.38.1 (bug fix; src changed since v0.45.0) and the console's exact pin follows; the application target stays v0.45.1 under the patch classification. The operator's scope expansion authorizes the package change that D004 and the order's cost line had excluded; the order's text is not edited.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts beginHarnessSession: the role check and the already-began existence check come first; outputSnapshot and harnessControl run before any write; after writeJson(statePath), initializeSubagentCounter catches its own errors and returns a warning, and harnessSessionScratch only joins a path, so record() is the only step that can throw once the record exists.",
    "measureHarnessUsage throws 'Begin the harness session before measuring usage' only when no record exists, and scripts/harness.mjs maps exactly that to cause no-session; VER-001's probe of a kept partial record read back session-counters-unavailable, which is outside the closed list in scripts/lib/receipt-cost.mjs.",
    "Executed 2026-09-24 after `npm run build`: the WO-153 fixture runs each of the five actions under two forced failures, the D002 invalid role and a partial begin forced by precreating the thread's session-key .jsonl observation path as a directory (VER-001's reproduction through the real dispatch table). For each it asserts exit 0, the briefing and its report path, the advisory naming the host's message and cause no-session, the control segment equal to its seed plus the expected transition, no session record, a usage readback of cause no-session with null tokens, and judgeCostLine admission; a repeat `next` names the failure again and leaves no record; with the obstruction removed, the next dispatch begins silently with an executor record. `node --test --test-reporter=spec --test-name-pattern='WO-149|WO-153' scripts/test-process-debt.mjs` passes 3/3 (WO-153 case 2,675.03 ms); the WO-149 cases are unedited.",
    "Red check 2026-09-24: with HEAD's harness-host.ts restored temporarily and rebuilt, the fixture fails at the partial begin's no-session-record assertion (actual true); the fix was restored (cmp identical) and rebuilt. Against the VER-001 subject, the dispatch printed 'DotLn advisory: Codex session entry failed (Host observation log is not a regular file); process cost remains unknown; cause no-session.' while leaving the record, turning VER-001's inferred stderr into an observation.",
    "`git diff --name-only v0.45.0 HEAD -- packages/skeleton/src` was empty and v0.45.0 carried skeleton 0.38.0, so scripts/release.mjs componentVersionRules requires a different skeleton version once src changes.",
    "Not exercised: an unlink that fails right after the host's rename into the same directory succeeded; that error would replace the original one."
  ],
  "rejected": [
    {
      "option": "Withdraw the record from scripts/resume.mjs, mirroring the host's statePath (the first repair draft, run and passing before the scope expansion)",
      "reason": "It fixed only the dispatch caller, duplicated the host's path key, and left `harness begin` refusing retries as already-began after a failed entry. With the package change authorized, the source fix is smaller and covers both callers."
    },
    {
      "option": "Append the observation row before writing the record",
      "reason": "A retry after a later write failure would append a second entry row for one session; rollback keeps one entry per begun session."
    },
    {
      "option": "Keep the record and report the readback's cause",
      "reason": "The readback's cause depends on counters at readback time and the observed one is outside the closed list; the kept record also makes a repeat dispatch silent (D005's reopening condition)."
    },
    {
      "option": "Retry the begin",
      "reason": "Declined by the order: a second write to a store that has just refused. The next dispatch or `harness begin` retries instead."
    },
    {
      "option": "Board up the host defect as a follow-up",
      "reason": "Superseded by the operator's scope expansion."
    }
  ],
  "reopenWhen": "beginHarnessSession gains a step after the record write whose failure should keep the record; a failed rollback is observed; or a usage readback after a failed begin reports a cause other than no-session."
}
```

## WO-153-D007

```json
{
  "id": "WO-153-D007",
  "date": "2026-09-24",
  "dispatch": "resume: fix; the operator chose to keep the host fix after being shown its re-mint cost (a live self-host episode, and overlap with the re-mint WO-154 plans)",
  "decision": "Re-mint the two evidence editions that the host change made stale, as WO-153 revision 001, selected in docs/evidence/current.json: authority, and feedback with one live claude-cli-print self-host episode (claude-sonnet-5 at xhigh, WO-157's selection). Artifact identity and verification stay at WO-157 revision 001 because their checks pass unchanged, and the console self-host evidence already matches. Regenerate the 31 harness surfaces for the new pinned runtime snapshot.",
  "evidence": [
    "The first gate after the host change failed in preflight for two reasons. One was harness drift: harness-host.js is a pinned runtime file in scripts/lib/harness.mjs harnessInstallation, so the snapshot path moved. The other was 'feedback evidence is stale'. A scratch probe over evidenceSources(root).feedback (132 sources) with evidenceSourceContent found exactly one changed source, packages/skeleton/src/harness-host.ts; the version bump is normalized away. authority-evidence --check reported a stale WO-157 revision 002 bundle-diff.json. The harness-evidence, artifact-identity-evidence and verification-evidence checks passed.",
    "Order of work on 2026-09-24: npm run build; harness emit (31 surfaces) and harness check --loadout contributor; harness-context --check; current.json repointed (authority and feedback to WO-153 revision 001); authority-evidence --write and --check; evidence:feedback --write; the live episode; feedback-evidence --record-selfhost and --check; evidence:console --check (all five views match); harness-evidence.",
    "What changed in each edition against WO-157 revision 002: authority.json is byte-identical; bundle-diff.json moves only 42 role-bundle hash values and its comparison label; feedback.json differs only in subject (sha256:a20f72f2… to sha256:addffbb8…).",
    "The live episode: `DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --store .runtime/feedback-audit-wo153-r001 --transport claude-cli-print --model claude-sonnet-5 --effort xhigh`, started 2026-09-24T16:27:37Z on Claude Code 2.1.281. It printed phase complete, ten fixtures, 1,192 saved instruction bytes and verifier claude-cli-print. The verification stream records one WorkerAttemptStarted, no WorkerInterrupted, one WorkerCompleted and 94 WorkerHeartbeat events (2,121,554 bytes). Its usage row in docs/control/local/process/usage.jsonl: 97,756 ms, 967,008 tokens (11,546 output), USD 1.5319758. Effective model and effort are unknown; the store records the selection made at launch."
  ],
  "rejected": [
    {
      "option": "Ship the resume.mjs-only repair and defer the host fix",
      "reason": "Offered as the recommendation; the operator chose the host fix."
    },
    {
      "option": "Also re-mint artifact identity and verification",
      "reason": "Their checks pass against the current sources; a re-mint would move only labels."
    },
    {
      "option": "Leave the re-mint to WO-154",
      "reason": "The gate refuses the current subject until the editions match it, and repair-complete needs current evidence."
    }
  ],
  "reopenWhen": "WO-154 or another sibling integrates its own re-mint first (final review then retimes, and the later branch re-mints over the integrated sources), or a registered evidence source changes after this mint."
}
```

## WO-153-D008

```json
{
  "id": "WO-153-D008",
  "date": "2026-09-24",
  "dispatch": "resume: fix; operator correction during the repair about operator chat copied word for word into committed records, and the operator's choice of a separate follow-up",
  "decision": "Correct this order's record and defer the wider cleanup. D006's dispatch field had copied the operator's scope-expansion message word for word; it now paraphrases it, and the regenerated decisions index carries no copy. The earlier committed occurrences, and the instruction gap that produces them, go to planning as a follow-up, as the operator chose.",
  "evidence": [
    "What was misread: the executor procedure's duty to name the operator dispatch in decision records was taken as licence to quote the operator's message. What was meant: record the control prefix and a paraphrase; the Clean Room section of CLAUDE.md allows exact operator wording only for a public draft explicitly marked ready to file. What changed: D006's dispatch field, and docs/lineage/decisions-index.md through `npm run meta`; the quote was never committed.",
    "`git grep` over committed docs outside docs/intake on 2026-09-24 found operator message text recorded in decision dispatch fields, at least in docs/evidence/WO-099/decisions.md (WO-099-D028) and docs/evidence/WO-049/decisions.md (line 176). The search covered control-prefix patterns only and is not a complete inventory.",
    "The executor skill says decisions name 'the operator dispatch' and that `scope expand:` adds scope and a receipt; neither says to paraphrase operator chat, and the Clean Room synthesis rule is written about docs/intake material."
  ],
  "rejected": [
    {
      "option": "Sweep the older records and change the role text within WO-153",
      "reason": "The operator chose a separate follow-up; the sweep edits closed orders' decision records and the generated skills."
    },
    {
      "option": "Correct only this order, with no follow-up",
      "reason": "The operator reports that this has happened before, and the cause remains in the role text."
    }
  ],
  "followup": "Sweep committed docs outside docs/intake for operator chat recorded word for word and paraphrase each occurrence; add a role-text rule that decision dispatch fields name the control prefix and a paraphrase, never the operator's message text; add a check that flags quoted operator messages in decision records.",
  "reopenWhen": "Another operator message is found recorded word for word in a record this order wrote."
}
```

## Goal alignment

This is process tooling on the operator-flow path, not the source-to-deliverable
critical path. It removes one way a lifecycle dispatch can strand an allocated
report path; it claims no product-feature progress. Scaled to a one-catch patch:

- **Policy resistance.** The catch keeps D001's intent, that no failure is
  hidden, by printing the host's own message rather than overriding it.
- **Tragedy of the commons.** No shared resource grows: one stderr line appears
  only on failure, and the gate step count is unchanged (one `test()` in an
  existing file).
- **Drift to low performance.** An unknown process cost stays an explicit
  `cause no-session`, never an unnamed unknown.
- **Escalation.** Bounded to one branch in one command and one fixture.
- **Success to the successful.** Four alternatives were compared (D001) instead
  of extending the handler's existing completion path by default.
- **Shifting the burden to the intervenor.** The operator no longer has to
  rescue a dispatch that recorded its transition and printed no path.
- **Rule beating.** The fixture asserts the appended transition, the report path
  in the briefing, the exact advisory and the usage readback, not merely exit 0.
- **Seeking the wrong goal.** The goal is an admitted dispatch that names its
  measurement gap. A green fixture alone is not the goal, and no live row is
  claimed; the reopening observation is a live Codex dispatch that exits
  non-zero at entry.
- **Naive Interventionism.** The smallest durable act: one catch and one case.
  Retries, hooks and role-text changes are declined.
- **NoOp.** Rejected in D001 because it withholds the report path after a
  recorded transition.

**Repair (VER-001 F1, D006).** The same process-tooling path. Rule beating and
drift were the finding's risk: an advisory claiming `no-session` while a record
existed. The fix removes the contradiction at its source instead of adding a
second guard in the caller, so the receipt's cause, the readback and a retry
agree. Escalation is bounded by the operator's scope expansion to one rollback
in one host function, one patch bump and the existing fixture. NoOp keeps F1's
false cause and the silent repeat, so it is rejected.
