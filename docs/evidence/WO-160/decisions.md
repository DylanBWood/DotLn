# WO-160 decisions

Dispatch: `resume: next`, 2026-09-25. Executor session readback: codex-cli 0.157.0, gpt-6-astra, ultra effort (normalized xhigh). Root is the sole writer; three read-only inspection agents, no descendants, against cap 20.

Goal alignment: these interfaces remove recurring manual rescue on the route to dependable unattended work. Preserve existing judgments, gate failure status and recoverable bytes (policy resistance, drift and rule beating); bounded fixtures and three inspection agents limit shared compute and attention (commons, escalation). Existing helpers are reused because their tests cover the seam, not because of sunk investment (success bias). Commands replace repeated operator improvisation (burden shifting), with behavioral checks rather than receipt count as the success measure (wrong goal). Naive Interventionism: keep history, publication controls, separate gates and an explicit pruning apply; use temporary repositories to test destructive paths. NoOp retains the nine observed defects and loses to bounded changes; reopen on contrary executable evidence.

## WO-160-D001

```json
{
  "id": "WO-160-D001",
  "kind": "experiment",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Keep the existing seam fixture runners; decline an additional test layer.",
  "question": "Can the nine regressions reuse existing runners without adding a separate test layer?",
  "alternatives": [
    "Extend existing seam fixtures",
    "Create another aggregate fixture framework"
  ],
  "evidence": ["Existing scripts/test-* seam fixtures inspected during entry"],
  "observation": "scripts/test-plan-refutation.mjs, test-entropy-review.mjs, test-release-preparation.mjs, test-worktree-integration.mjs, test-harness.mjs, test-runner.test.mjs and test-process-debt.mjs already exercise these seams.",
  "budget": {
    "wallSeconds": 600
  },
  "execution": "declined",
  "reason": "Existing seam fixtures cover the required behavior; a new framework duplicates them without an observed gap.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": ["none; separate experiment declined"],
    "source": "Declined without a separate trial: zero trial commands/time. Required source inspection is implementation work with unmeasured attribution."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["none; separate experiment declined"],
    "summary": "Keeps one existing suite owner per seam; no measured saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "rejected": [
    {
      "option": "Additional framework",
      "reason": "Duplicates existing fixture setup without an observed missing capability."
    }
  ],
  "reopenWhen": "A regression cannot be exercised through the existing runners."
}
```

## WO-160-D002

```json
{
  "id": "WO-160-D002",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 1",
  "decision": "Append hash-bound withdrawals, report unmatched surviving amendment rows, preserve superseded rows and prior judgments.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs and plan-continuation.mjs; WO-111 D019; row 22"
  ],
  "rejected": [
    {
      "option": "Rewrite the immutable row",
      "reason": "The authorization calls for an append, and historical evidence must survive."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D003

```json
{
  "id": "WO-160-D003",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 2",
  "decision": "Select consumable reviews from EntropyReviewFiled events; retain and validate pre-mechanism bytes.",
  "evidence": [
    "unconsumedReview selects files by kind but legacy receipts have no receiptId; WO-151 D005"
  ],
  "rejected": [
    {
      "option": "Delete legacy receipts",
      "reason": "Their historical evidence remains useful."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D004

```json
{
  "id": "WO-160-D004",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 3",
  "decision": "Report every actually changed file, including the PR meter; skip identical writes.",
  "evidence": [
    "scripts/release.mjs prepare unconditionally writes PR.md but describes only plan.edits; WO-111 D012"
  ],
  "rejected": [
    {
      "option": "Keep the plan.edits-only message",
      "reason": "It gives an incorrect account of effects."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D005

```json
{
  "id": "WO-160-D005",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 4",
  "decision": "Declare non-envelope evidence streams beside the order, constrain declarations to that directory, and teach both censuses the same format.",
  "evidence": [
    "check-registrations.mjs and packages/kernel/test/store-history.test.ts independently enumerate JSONL; WO-111 VER-001 F3b"
  ],
  "rejected": [
    {
      "option": "Keep evidence paths in the kernel fixture registry",
      "reason": "Every evidence order would still require a package fixture edit."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D006

```json
{
  "id": "WO-160-D006",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 5",
  "decision": "Keep checkpoint and stash recovery; let the helper make hookless preservation and merge commits with recorded phase and identities, and recover its own stranded stash.",
  "evidence": [
    "worktree-integration.mjs; product 07 Independent workflows; cited hookless and repair-phase cases"
  ],
  "rejected": [
    {
      "option": "Require manually typed hookless commits",
      "reason": "That is the recurring rescue this order removes."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D007

```json
{
  "id": "WO-160-D007",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 6",
  "decision": "Rerun failed document checks against the explicit revision or merge base with main and label observed failures introduced or inherited; preserve failure status.",
  "evidence": [
    "test-runner.mjs; WO-052 FINAL-001 F1; WO-135 FINAL-001"
  ],
  "rejected": [
    {
      "option": "Treat every inherited failure as a repair finding",
      "reason": "The base rerun observes failure recurrence and grants no repair authority."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D008

```json
{
  "id": "WO-160-D008",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 7",
  "decision": "List only origin-published integration stashes as deletion candidates; inventory Git blob bytes before any explicit apply and retain unowned or unpublished stashes.",
  "evidence": [
    "harness-prune.mjs already verifies origin publication before lane pruning; work order criterion 7"
  ],
  "rejected": [
    {
      "option": "Drop a stash at integration time",
      "reason": "Recovery must remain until publication."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D009

```json
{
  "id": "WO-160-D009",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 8",
  "decision": "Count byte-bound observations of the session own writes as reads; never infer last authorship from an ever-authored path and a later snapshot.",
  "evidence": [
    "lifecycle-evidence.mjs; harness-host.ts observeAuthorship updates beforeOutputs on read-only shell calls as well"
  ],
  "rejected": [
    {
      "option": "Trust authoredPaths plus beforeOutputs alone",
      "reason": "Another writer can change the bytes before the snapshot refresh."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D010

```json
{
  "id": "WO-160-D010",
  "date": "2026-09-25",
  "dispatch": "resume: next; WO-160 item 9",
  "decision": "Record the document gate result and inspect its latest current-tree row during executor completion, emitting an advisory for absent or failed evidence.",
  "evidence": [
    "test-runner currently records only the product aggregate; lifecycle-evidence has no document row check"
  ],
  "rejected": [
    {
      "option": "Add the document suites to npm test or block completion",
      "reason": "The order explicitly retains separate gates and advisory completion semantics."
    }
  ],
  "reopenWhen": "Executable evidence contradicts this behavior or a consumer needs a broader contract."
}
```

## WO-160-D011

```json
{
  "id": "WO-160-D011",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator authorized the observer fix and required evidence refresh",
  "decision": "Expand item 8 only to record write-time hashes in packages/skeleton/src/harness-host.ts, add its regression, bump the changed skeleton component compatibly and refresh affected generated harness/evidence surfaces. Keep all other scope and acceptance intact.",
  "evidence": [
    "Operator response: Authorize the observer fix and required evidence refresh (recommended)",
    "observeAuthorship keeps path names and a rolling beforeOutputs snapshot but no byte-bound record of own writes; a later read-only tool call refreshes the snapshot after a foreign edit",
    "docs/control/local/wo160/own-write-proposal.patch: concrete observer change reviewed before authorization"
  ],
  "rejected": [
    {
      "option": "Treat the rolling snapshot as last-authorship evidence",
      "reason": "Would erase the required foreign-writer advisory."
    },
    {
      "option": "Defer item 8",
      "reason": "The operator selected the bounded source repair."
    }
  ],
  "reopenWhen": "The affected checks show a semantic evidence change that requires a broader live episode."
}
```

D011 goal assessment: write-time evidence directly removes false reread warnings while preserving foreign-write warnings (rule beating, drift, wrong goal). The smallest observer change reuses its existing change calculation and receipt shape; generated pins and affected evidence are refreshed rather than bypassed (policy resistance). This adds deterministic validation cost but avoids a parallel observer or repeated manual rescue (commons, escalation, burden shifting). Retaining the existing observer follows measured capability, not sunk cost (success bias). NoOp leaves item 8 unsupported; the reversible change and its negative regression bound intervention.

## Implementation outcome and bounded choices

The nine behaviors now have executable evidence; the final full source gate
passes 36 suites/80 fresh tasks, and the first document gate passes 21 suites.
See [the implementation record](README.md) for commands, subject identity,
the fixture correction and the final document-gate observation procedure.
The eight-trap/NoOp judgment remains: these commands remove the observed
manual recovery steps while retaining failure status, history, explicit
publication authority and recoverable work. No measured per-order saving is
claimed. The declined economy trial remains kept-current; its regression and
attributed future savings remain unknown rather than borrowed from this gate.

D002 refinement: only the latest surviving amendment may satisfy an
idempotent authorization request. Reusing an older superseded approval would
leave the current gate rejecting a reapproved source; the A/B/A fixture
establishes the correction. Withdrawing the latest event does not revive an
older event. A later judged source may absorb an approved amendment; a missing
file alone cannot.

D007 implementation choice: use a temporary base clone with base workspace
packages and build outputs, sharing only installed external dependencies.
This avoids rebuilding the comparison from current workspace code or
introducing a dependency-install/network step. The comparison observes
failure recurrence, not causation; missing setup is unknown. Reopen if
dependency-version changes must become part of the comparison contract.

D008 implementation choice: remove the exact inventoried stash under Git's
files-backend ref, reflog and packed-ref locks. A selector looked up before
`git stash drop` can shift under a sibling stash operation, so that unlocked
sequence was rejected. Preserve a flushed byte inventory and ref/reflog
snapshot first, retain unsupported backends/ambiguous identities, and never
remove another actor's lock. The update is not crash-atomic; explicit recovery
may need the snapshot after interruption. Reopen for another ref backend or
a Git-supported transaction spanning the ref and reflog. The destructive
path was exercised only in disposable fixture repositories, including the
last-stash branch.

2026-09-25 correction: the extended foreign-edit range fixture initially
crossed the existing read-byte cap (68,000 versus 65,536), so it tested a check
obligation instead of partial reading. Equal-size changed bytes (52,000)
restore the intended test, which now passes with the full harness suite.

## WO-160-D012

```json
{
  "id": "WO-160-D012",
  "date": "2026-09-25",
  "dispatch": "resume: verify; independent VER-001",
  "decision": "Fail the current subject and route four reproduced defects through WO-160 repair. F1 (criterion 7): integration-stash pruning cannot remove anything while refs/stash is packed, which is the real repository's current state, yet the preview lists those stashes as removable. F2 (criterion 8): the own-write read credit absorbs another writer's change made inside the session's tool window or between explicit observations. F3 (criterion 1 regression): the legacy match branch reports WO-159 row 23 unmatched after an admitted execution appendix. F4 (criterion 9 regression): an unreadable per-tree gate archive now blocks implementation-ready. A verifier does not change the implementation it judges. The findings reopen D008, D009 and D011, D002, and D010.",
  "evidence": [
    "Real common dir, read-only: .git/refs/stash is absent and packed-refs line 977 holds caf830d5bcf7569d05af801e866c41ef287399cf refs/stash. `node scripts/harness.mjs prune` (preview) listed nine WO-NNN integrate stashes (WO-158, WO-111, WO-156, WO-154, WO-100, WO-151, WO-120, WO-147, WO-138) as candidates and retained ten others as unnamed or unrecognized.",
    "Disposable repository with two published WO-NNN integrate stashes after git pack-refs --all: the preview listed both and retained none. --apply threw 'stash prune requires regular loose stash ref and reflog', removed neither and left one inventory file for an unremoved stash. After an unrelated git stash push recreated the loose ref, the same apply removed both.",
    "Loose-ref control from a linked worktree: the rewritten reflog and ref were byte-identical to git reflog delete --updateref --rewrite, and git fsck was clean, so the drop mechanism itself is sound.",
    "Probe A (Claude hook path, test-process-debt helpers in a disposable copy): the session writes own.txt, and another writer changes it during a later read-only Bash window. Advisories were [] at WO-160 and ['Outputs not read at current bytes: own.txt'] at 852861d3.",
    "Probe B (explicit observe, the Codex/Copilot path): another writer creates foreign.txt after the session begins, then observeHarnessSession runs. Advisories were [] at WO-160 and ['Outputs not read at current bytes: foreign.txt'] at 852861d3. packages/skeleton/src/harness-host.ts:1490-1502 credits every path changed in the window as host:observed-output-write.",
    "Disposable copy: appending '## Execution record' to docs/work-orders/WO-159-codex-episode-isolation.md makes plan check exit 1 with 'unmatched execution amendment WO-159 row 23' at WO-160, and exit 0 with an execution-record update at 852861d3. Row 23 is the only surviving amendment matched solely by the new exact-equality legacy branch (scripts/lib/plan-continuation.mjs:100-107).",
    "Disposable repository with an invalid docs/control/local/harness/check-history/<tree>.json: requireLifecycleEvidence('implementation-ready') throws a JSON SyntaxError at WO-160 (scripts/lib/lifecycle-evidence.mjs:53, outside any try) and returns advisories at 852861d3. A corrupt checks.json already blocked completion before this order."
  ],
  "alternatives": [
    "Pass on the green gates and fixtures, which use loose refs and foreign writes only between tool calls",
    "Edit the implementation during verification and attest the changed bytes in this report",
    "File a failed verification with bounded reproductions and route repair to a fresh verification"
  ],
  "rejected": [
    {
      "option": "Pass on the green gates and fixtures",
      "reason": "Disposable probes reproduced behavior that the fixtures never reach. The real repository's packed ref leaves observed gap 7 open, and the criterion-8 negative clause fails against the baseline."
    },
    {
      "option": "Edit the implementation during verification",
      "reason": "Independent verification judges its recorded subject; a repair changes that subject and requires a new report."
    }
  ],
  "followup": "WO-160 resume: fix. F1: make integration-stash pruning work when refs/stash is packed, or retain such stashes with a reason so the preview never lists a candidate --apply cannot remove, and write no inventory for an unremoved stash; add a packed-ref regression. F2: credit own-write reads only for writes attributable to the session, so a change by another writer inside a tool window or between explicit observations still advises; add the Probe A and B regressions. F3: restore the pre-WO-160 admission for legacy-normalized activation rows under admitted appendices, with a WO-159-shaped regression. F4: make an unreadable gate-row archive an advisory at implementation-ready and repair-complete. Rerun the affected suites and both gates, then request a fresh VER.",
  "reopenWhen": "A repair supplies bounded regressions for F1-F4 and a new verification judges all ten criteria on its recorded subject."
}
```

## WO-160-D013

```json
{
  "id": "WO-160-D013",
  "date": "2026-09-25",
  "dispatch": "resume: verify; independent VER-001",
  "decision": "Board the nineteen non-blocking observations in VER-001 (O1-O19) instead of leaving them as report prose. None makes a criterion unmet. The repair pass may address those inside its repaired seams within the boy-scout bound; every other one becomes a named follow-up at close.",
  "evidence": [
    "VER-001 section 'Observations (non-blocking)' lists each observation with its criterion, severity and source (reproduced, reviewer reading or suspected).",
    "Reproduced directly: O2 (two successive local prepares in a disposable copy each rewrote PR.md; only the Observation cutoff line differed), O9 (a bare --against prints the runner usage), O12 (the real preview reports 341,856,696 to 403,748,766 bytes per stash, which is the full worktree and index trees)."
  ],
  "rejected": [
    {
      "option": "Route every observation into the blocking repair",
      "reason": "They do not falsify a criterion; the repair should stay bounded to F1-F4 and adjacent low-risk cleanup."
    }
  ],
  "followup": "WO-160 resume: fix may address O1-O19 inside the repaired seams within the boy-scout bound; each remaining item is nominated through the adjacent queue at close with its VER-001 observation id.",
  "reopenWhen": "An observation is shown to falsify a criterion, or a later order meets one of them in use."
}
```

## WO-160-D014

```json
{
  "id": "WO-160-D014",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F1-F4",
  "decision": "Repair all four reproduced findings in the existing seams: prune files-backend packed stash refs under locks with recovery bytes and mode preservation; credit own-write reads only for changed destinations named by a tool with no explicit failure; admit a legacy-normalized amendment followed by a strict execution appendix; and turn an unreadable document-gate archive into one completion advisory.",
  "evidence": [
    "VER-001 F1-F4 and WO-160-D012; real refs/stash is packed while the old preview named nine candidates",
    "Focused packed and loose stash fixtures pass, including last-entry removal, retained entries, failed-lock inventory cleanup and packed-file mode",
    "Focused process-debt fixtures pass for a named own write, foreign writes during a read-only tool and explicit observe, an explicitly failed Write, and an opaque output discharged by delivered read",
    "The WO-159-shaped legacy amendment and corrupt document archive fixtures pass"
  ],
  "alternatives": [
    "Retain all packed stashes with a preview reason",
    "Keep snapshot-only own-write credit",
    "Withdraw WO-159 row 23 or make the document row a blocking gate",
    "Repair the four seams with bounded fixtures"
  ],
  "rejected": [
    {
      "option": "Retain all packed stashes with a preview reason",
      "reason": "It would make the preview truthful but leave the actual repository's cleanup outcome unavailable; the files backend can update the packed entry with locked recovery."
    },
    {
      "option": "Keep snapshot-only own-write credit",
      "reason": "A changed path does not identify its writer; both VER-001 foreign-write probes lost the advisory."
    },
    {
      "option": "Withdraw the legacy amendment or block completion on document evidence",
      "reason": "The amendment is valid after an allowed appendix, and the document row is explicitly advisory."
    }
  ],
  "reopenWhen": "A verifier reproduces a false credit on a named same-path race or a packed-ref recovery failure; that stronger authorship case needs evidence beyond before/after snapshots."
}
```

2026-09-25 correction to D008: the first implementation treated a files-backend
stash as necessarily having a loose ref. VER-001 inspected the real packed
`refs/stash` and reproduced an apply failure after a candidate preview. The
repair now removes the packed entry under its lock, preserves its original
mode, saves the prior packed bytes with the ref and reflog, and exercises both
intermediate and last-stash removal in disposable repositories. The operation
remains recoverable rather than crash-atomic; no real stash was removed here.

2026-09-25 correction to D009: a post-tool output delta was described as an
own write even when the tool only read or the explicit adapter had no tool.
VER-001's two foreign-write probes show that attribution was unsupported. The
repair grants automatic read credit only when a tool with no explicit failure names the
changed destination; opaque writes use `read-output` and `delivered`. A
foreign overwrite of that same named path inside the same tool window cannot
be distinguished by these snapshots. The decision does not claim otherwise;
that observation is boarded below for a future provenance mechanism.

Goal assessment at repair: F1 and F2 are the direct operability and evidence
integrity gaps, while F3 and F4 prevent avoidable operator rescue on the
critical path. Keeping the existing locks, recovery proof, strict appendix
validator and advisory completion guards against policy resistance and rule
beating. Four targeted regressions and two read-only reviewers cover the seams
without a new framework, containing commons cost and escalation. Actual behavior
on packed refs and foreign writes is the standard, avoiding drift and the
wrong goal of green fixtures alone. Existing helpers were retained because
their seams were exercised, not because of prior investment. NoOp leaves the
VER failures; the chosen bounded changes remove recurring manual rescue.
Under Naive Interventionism, the packed-ref edit is the highest-risk change:
the byte snapshot, locks, preserved mode and disposable last-entry probe
bound it, and real stashes remain untouched until an explicit `--apply`.
The D001 economy trial remains declined; this repair starts no second trial.

## WO-160-D015

```json
{
  "id": "WO-160-D015",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 observations",
  "decision": "Treat O14 as covered by the new packed-ref fixture. Record O1-O13, O15-O19 and the same-target F2 authorship limit as nineteen individually named adjacent items, then defer each to the existing D013 follow-up FUP-dd20beb6b16ea86c. No queued item remains running or awaiting a start.",
  "evidence": [
    "VER-001 observations O1-O19 and D013 identify the non-blocking subjects",
    "scripts/test-harness.mjs now exercises packed refs, the missing case in O14",
    "npm run adjacent -- list reports revision 38, adjacent-0001 through adjacent-0019 deferred to FUP-dd20beb6b16ea86c, next null"
  ],
  "rejected": [
    {
      "option": "Expand the blocking repair to every observation",
      "reason": "The verifier did not establish these as unmet criteria; several need separate diagnosis or broader authority, and including them would delay the four reproduced repairs."
    },
    {
      "option": "Leave them only in the verification report",
      "reason": "D013 requires a concrete queue disposition for each remaining observation."
    }
  ],
  "reopenWhen": "A queued observation reproduces an unmet WO-160 criterion or a later order encounters it in use."
}
```

## WO-160-D016

```json
{
  "id": "WO-160-D016",
  "date": "2026-09-25",
  "dispatch": "resume: verify; independent VER-002",
  "decision": "Fail the repaired subject and route one reproduced regression through WO-160 repair. F5 (criterion 7): when entries remain, dropInventoriedStash writes a loose refs/stash and also removes the packed refs/stash row. A concurrent git pack-refs --all --prune has already packed and released packed-refs.lock but not yet pruned the loose ref. It then deletes that loose ref after the prune, so refs/stash stops resolving and every retained stash disappears from git stash list in every worktree. Git's own stash drop under the same interleaving keeps the packed row and the retained entries. VER-001 F1-F4 are otherwise repaired. A verifier does not change the implementation it judges. The finding reopens D008 and D014.",
  "evidence": [
    "Git 2.55.0, disposable repository, three stashes with the published WO-901 entry at the bottom and a loose refs/stash, plus 60,000 loose tags so git pack-refs --all --prune prunes tags before refs/stash. After packed-refs.lock was released with the stash row packed and the loose ref present, pruneHarness(--apply) removed the bottom entry without error. When pack-refs exited 0, git rev-parse --verify refs/stash failed, git stash list was empty, the reflog still held the two retained entries, and neither a loose ref nor a packed stash row remained. A second run with 30,000 tags reproduced it. git update-ref refs/stash <last reflog sha> restored the list.",
    "Control, same interleaving: git stash drop stash@{2} instead of the prune. refs/stash still resolved to the retained top, git stash list showed both retained entries, and the packed stash row remained.",
    "The pre-repair subject never rewrote packed-refs; it only locked it. The regression comes from the D014 change at scripts/lib/stash-drop.mjs:143-155, which removes the packed row on the entries-remain path.",
    "Sequential behavior is repaired. 46/46 disposable checks passed: packed-only, loose-over-stale-packed, top, middle and last entries, a linked worktree, a foreign packed-refs.lock with no inventory left, and preserved mode. The stash list, refs/stash and reflog bytes equal git stash drop, and git fsck is clean. A byte copy of the real packed refs/stash and 19-entry reflog, read through alternates, removed the nine published candidates and kept ten, identically to git stash drop. The real packed-refs and stash reflog hashes were unchanged."
  ],
  "alternatives": [
    "Pass because the race needs a concurrent pack-refs",
    "Record the race only as a non-blocking observation",
    "File a failed verification with the reproduced interleaving and route repair to a fresh verification"
  ],
  "rejected": [
    {
      "option": "Pass because the race needs a concurrent pack-refs",
      "reason": "The installed Git 2.55.0 manuals document the trigger. git gc runs git pack-refs by default (git-gc(1), gc.packRefs default true), and pack-refs removes loose refs after packing unless --no-prune is given (git-pack-refs(1)). Porcelain commands start gc --auto, which detaches by default (gc.autoDetach), and maintenance run --auto, since maintenance.auto defaults to true. Several worktrees share this common dir, and D008 admits the locked removal precisely because a sibling Git operation can interleave. Git's own drop survives the reproduced interleaving; the prune does not."
    },
    {
      "option": "Record the race only as an observation",
      "reason": "It makes the stashes criterion 7 requires to be retained unreachable through refs/stash; recovery needs a manual ref update from the reflog or recovery snapshot."
    }
  ],
  "followup": "WO-160 resume: fix. F5: on the entries-remain path, leave the packed refs/stash row in place, as git reflog delete --updateref does, and remove the row only when the last entry is dropped. Alternatively, establish a concurrent-safe equivalent. Add a regression that runs a real git pack-refs --all --prune concurrently with a non-top prune and asserts that refs/stash and the retained entries survive. Keep the sequential, real-state and lock-contention behavior VER-002 reproduced. Rerun the affected suites and both gates, then request a fresh VER.",
  "reopenWhen": "A repair supplies the concurrent pack-refs regression and a new verification judges all ten criteria on its recorded subject."
}
```

## WO-160-D017

```json
{
  "id": "WO-160-D017",
  "date": "2026-09-25",
  "dispatch": "resume: verify; independent VER-002",
  "decision": "Board the nine non-blocking observations in VER-002 (O20-O28) instead of leaving them as report prose. None makes a criterion unmet. The next repair may address those inside the stash-drop seam within the boy-scout bound; every other one is nominated through the adjacent queue under the existing D013 follow-up at close, with its VER-002 observation id.",
  "evidence": [
    "VER-002 section 'Observations (non-blocking)' lists each observation with its criterion, severity and source (reproduced, reading or suspected).",
    "Read-only reviewer pass over the repair diff (checkpoint 4 to 7), with the root verifier checking the cited lines: scripts/lib/stash-drop.mjs:131, 143-180 and scripts/lib/harness-prune.mjs:508, 596-690; packages/skeleton/src/harness-host.ts:1490-1516; scripts/lib/plan-continuation.mjs:294-316.",
    "Reproduced directly: O28. In a disposable copy, a body edit plus an execution appendix on WO-159 fails plan check with a remedy that names withdrawing row 23."
  ],
  "rejected": [
    {
      "option": "Route every observation into the blocking repair",
      "reason": "They do not falsify a criterion; the repair should stay bounded to F5 and adjacent low-risk cleanup."
    }
  ],
  "followup": "FUP-dd20beb6b16ea86c: at close, nominate O20-O28 through the adjacent queue with their VER-002 observation ids, unless the F5 repair resolves one inside the stash-drop seam.",
  "reopenWhen": "An observation is shown to falsify a criterion, or a later order meets one of them in use."
}
```

## WO-160-D018

```json
{
  "id": "WO-160-D018",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-002 F5",
  "decision": "Keep the packed refs/stash row while entries remain, matching Git's own drop behavior; remove it only for the last entry. Add a real concurrent pack-refs regression in the existing harness suite and preserve the sequential, inventory and lock checks.",
  "evidence": [
    "VER-002 F5 reproduced a non-top prune between packing and loose-ref pruning; Git's control retained the packed row and the two surviving entries.",
    "scripts/lib/stash-drop.mjs installs a packed file with refs/stash removed on both branches; scripts/test-harness.mjs incorrectly expects that removal even when a stash remains."
  ],
  "rejected": [
    { "option": "NoOp", "reason": "It leaves retained work unreachable during the reproduced maintenance interleaving." },
    { "option": "Replace the stash transaction or suppress maintenance", "reason": "The observed failure needs one conditional change; a new transaction or global coordination would broaden authority and risk without evidence of necessity." }
  ],
  "reopens": { "decisionId": "WO-160-D014", "observation": "Removing the packed row while entries remain conflicts with the prune phase of a concurrent Git pack-refs operation." },
  "reopenWhen": "Concurrent or sequential executable evidence contradicts retained-stash reachability, recovery bytes or last-entry deletion."
}
```

Goal assessment before the VER-002 repair: retaining saved work makes the
machinery usable on the path to a dependable unattended delivery loop and
removes manual ref rescue (shifting the burden). Preserving Git's packed-row
rule avoids policy resistance. The existing suite and one writer contain
commons cost and escalation. Checking retained entries after real Git exits
guards against drift, rule beating and the wrong goal of removal counts.
Git's behavior is preferred because the verifier's control survives the race,
not because of investment in the current helper (success to the successful).
Naive Interventionism favors the small branch change, preserving inventory,
recovery and lock admission; NoOp retains the reproduced failure. D001's
declined economy experiment remains the sole experiment for this order.

## WO-160-D019

```json
{
  "id": "WO-160-D019",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-002 O20-O28",
  "decision": "Repair O22 in the same stash rewrite seam by starting the kept reflog with a null OID of the existing hash length. Nominate and defer O20-O21 and O23-O28 as adjacent-0020 through adjacent-0028, excluding repaired adjacent-0022, to the existing FUP-dd20beb6b16ea86c.",
  "evidence": [
    "The O22 fixture compares a disposable repository with Git stash drop on an identical copy. Before repair the refs and stash lists agree but the reflog differs: Git starts with a null OID while the helper retains the old non-null predecessor.",
    "VER-002 marks O20-O21 and O23-O28 as non-blocking. The queue records their causes, candidate fixes, paths, checks and individual deferral reasons.",
    "O20/O24 need error-path transaction and fault-injection work; O21 changes retry admission; O23/O26 are suspected and need diagnosis; O25 needs stronger write provenance; O27/O28 are planning-seam changes."
  ],
  "rejected": [
    { "option": "Defer O22 with every observation", "reason": "A real Git control demonstrates the difference and the repair is one initialization in the function already changed by F5." },
    { "option": "Repair every observation now", "reason": "The remaining observations need broader transaction or provenance design, separate diagnosis, or changes outside the repaired seam." }
  ],
  "followup": "FUP-dd20beb6b16ea86c: retain VER-002 O20-O21 and O23-O28 with their adjacent queue specifications; O22 is repaired within WO-160.",
  "reopenWhen": "A deferred observation falsifies an acceptance criterion or a later order encounters its recorded trigger."
}
```

O22 uses the same goal and trap assessment as D018: Git's executable result
sets the compatibility standard; a one-line initialization and a byte comparison
limit intervention cost and avoid a new framework or manual repair procedure.

## WO-160-D020

```json
{
  "id": "WO-160-D020",
  "date": "2026-09-25",
  "dispatch": "resume: fix; local release preparation",
  "decision": "Retime the unpublished application target from v0.50.0 to v0.51.0 under the existing minor classification using the fetched local tag snapshot. Retain skeleton 0.42.1 and its existing pins because this repair changes machinery scripts and fixtures only.",
  "evidence": [
    "npm run release -- prepare --local reported v0.50.0 to v0.51.0 and listed exactly the order, README.md, docs/product/06-roadmap.md and docs/final-reviews/WO-160/PR.md.",
    "VER-002 records that sibling WO-161 published the previously staged v0.50.0; product 07 Independent workflows permits retiming under the recorded classification."
  ],
  "rejected": [
    { "option": "Treat sibling publication as a verification defect", "reason": "It changes the version baseline, not any acceptance behavior." },
    { "option": "Change another component version", "reason": "This repair changes no package source or dependency." }
  ],
  "reopenWhen": "Final-review integration observes a newer release or changes a component's compatibility impact."
}
```

## WO-160-D021

```json
{
  "id": "WO-160-D021",
  "date": "2026-09-25",
  "dispatch": "resume: verify; independent VER-003",
  "decision": "Pass the VER-002 repair. F5 and O22 are repaired and reproduce as fixed against real Git, and all ten criteria are met on the recorded subject. Board the one new non-blocking observation, VER-003 O29, beside O20 under FUP-dd20beb6b16ea86c instead of leaving it only in the report. O29: on the entries-remain path the repair no longer changes packed-refs, yet the error-path rollback still rewrites it in place with its unchanged bytes (scripts/lib/stash-drop.mjs:176-179), which is a needless non-atomic write.",
  "evidence": [
    "Race probe, Git 2.55.0, 60,000 loose tags, no SIGSTOP: repaired prune of the bottom, middle and top entry while git pack-refs --all --prune was still pruning tags. It kept refs/stash, both retained entries and a clean fsck, and its ref, packed row and loose state matched git stash drop under the same interleaving. The checkpoint-9 stash-drop.mjs reproduced F5: refs/stash unresolvable, empty stash list, reflog still two lines.",
    "Sequential probe, deterministic twins: the repaired prune equals git stash drop in 24 of 24 cases (loose-only, packed-only and loose-over-packed; top, middle, bottom and sole entry; main and linked worktree) on stash list, ref, loose bytes, packed bytes and mode, reflog bytes, fsck and residual locks. The checkpoint-9 code diverges on packed bytes in 12 of 24.",
    "O22 probe: after an expired prefix, reflog bytes equal git stash drop for bottom, middle and top; checkpoint-9 code differs in all three.",
    "The repair's race fixture fails on checkpoint-9 code with git rev-parse --verify refs/stash exit 128 and passes, with the other four WO-160 stash fixtures, on the subject in the same mirror.",
    "npm test -- --review: 38 passed, 0 failed, 573.62 s, tree 18cc4c1f84c62723aa82ed5c1b92fd7151075bfd, code identity 60530a6049eefb763b8c1a2dc62aff76950890973e485cb7993be62a05b386e4.",
    "O29 is reading-level: the path needs install(ref) to fail after install(log), which was not fault-injected."
  ],
  "alternatives": [
    "Fail the subject on O29",
    "Leave O29 only in the report",
    "Pass and board O29 beside O20"
  ],
  "rejected": [
    {
      "option": "Fail the subject on O29",
      "reason": "It falsifies no criterion. It needs a rename failure after the reflog install, the bytes written are identical, and it belongs to the error-path transaction design already deferred as O20."
    },
    {
      "option": "Leave O29 only in the report",
      "reason": "A defect met and not fixed must be boarded in this decisions file with a named follow-up."
    }
  ],
  "followup": "FUP-dd20beb6b16ea86c: at close, nominate VER-003 O29 through the adjacent queue with adjacent-0020 (VER-002 O20), so the error-path rollback rewrites packed-refs only when this drop changed it.",
  "reopenWhen": "A fault-injected rollback shows a reader observing partial packed-refs, or a later order meets the rollback path in use."
}
```

Goal assessment at VER-003: the order's outcome is that the next order meeting a
WO-111 defect runs a command instead of improvising. For item 7 that means a
prune that never hides retained work, including while Git maintenance runs. The
judgment rests on retained-entry reachability after real Git exits, compared
with Git's own drop, not on removal counts or green fixtures alone (wrong goal,
rule beating, drift). The same probes run against the pre-repair code show they
can fail. Passing here removes the manual ref rescue F5 would have left to the
operator (burden shifting). Boarding O29 beside O20 keeps the one-writer repair
bounded (escalation, commons) and keeps the sequential and lock behavior that
already matches Git (policy resistance). Git is the standard because its control
survives both interleavings, not because the helper already exists (success to
the successful). Naive Interventionism: the verifier changes no implementation.
NoOp would leave the order in `verifying` with no recorded judgment, which
blocks final review and closes nothing.

## WO-160-D022

<!-- integration refs/dotln/checkpoint/WO-160/14 -->

```json
{
  "id": "WO-160-D022",
  "date": "2026-09-25",
  "dispatch": "resume: final review; worktree integrate WO-160",
  "decision": "Integrate main 6f6aad9a (WO-161, published v0.50.0) into the WO-160 subject at final review and carry every VER-003 claim forward unchanged. The uncommitted branch fast-forwarded from 852861d3 under the helper's named stash; six bookkeeping conflicts were resolved by hand: the skeleton bump is retimed from 0.42.1 to 0.43.1 over main's 0.43.0 as the same compatible bugfix (console pin and lockfile follow), the runner's new --against flag sits beside WO-161's --confined-partial rename with both usage strings merged and no behavior change, the authority edition is re-minted as WO-160/002 on the integrated source while artifact-identity, verification and feedback stay at WO-161/001, and the roadmap keeps both orders' activation notes plus a dated retime note. Application target v0.51.0 remains current. No resolution changed behavior, contracts, authority or acceptance, so no repair or new verification is opened.",
  "evidence": [
    "Integration receipt: phase final-review; preservation commit aa37db33 (refs/dotln/checkpoint/WO-160/14); base 852861d3 -> upstream 6f6aad9a by fast-forward, so mergeCommit is null; stash 0c2a9dee (WO-160 integrate 2026-09-25) retained; intake backup verified against the current three intake files; --continue completed with no pending step",
    "Authored conflicts: docs/evidence/current.json, docs/product/06-roadmap.md, package-lock.json, packages/console/package.json, packages/skeleton/package.json, scripts/test-runner.mjs; main did not touch packages/skeleton/src/harness-host.ts or any other WO-160 source, and scripts/test-process-debt.mjs and scripts/test-runner.test.mjs merged without conflict",
    "Retimed component: @dotln/skeleton 0.43.1 (main holds 0.43.0 from WO-161); compiler 0.19.1, kernel 0.6.0 and console 0.2.0 are main's values, unchanged by this order; product 07 Independent workflows admits retiming a bump upstream consumed under its declared impact",
    "node scripts/authority-evidence.mjs --write --edition WO-160 --revision 002 recorded 34 bundle comparisons; --check verifies it; revision 002 differs from 001 in compilerPackageVersion (0.19.1), compatibility, projections and the bundle files, comparison and support equipment, which is the integrated source plus WO-161's Contributor label",
    "Integrated-tree checks: harness check 31 generated surfaces; release check-surfaces --local pass; plan check exit 0; entropy check status ok and entropy subject names REVIEW-003 with no undefined; publication:check current (30 and 45 linked sections); evidence:artifact, evidence:verification, feedback and evidence:console checks pass at WO-161/001; harness-context --check exit 0; git diff --check clean; npm run test:docs 21 passed, 0 failed, 24.06 s",
    "Product gate on the integrated tree: recorded in FINAL-001 (npm test -- --review after the last source edit)"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Keep skeleton 0.42.1 or take main's 0.43.0 unchanged",
      "reason": "0.42.1 is below the published 0.43.0, and 0.43.0 would ship the observer change with no version movement; the compatible-bugfix step over main preserves the declared impact."
    },
    {
      "option": "Select WO-161/002 as the authority edition",
      "reason": "It was minted without the WO-160 observer change; the edition must describe the integrated bundle."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-25. Original base: `852861d337fefb3f4c42694db237f60a6e9ea5c6`.
Fetched main: `6f6aad9ad5da8a39c170f5472ebb71dd4a8dd08d`. Checkpoint: `refs/dotln/checkpoint/WO-160/14`.
Named stash retained: `0c2a9deee0bf1b6c25609cc2c994d5da62cdf3c6` (WO-160 integrate 2026-09-25).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-160 target v0.51.0 remains current.
Files changed:
  docs/final-reviews/WO-160/PR.md
Tag observation: local snapshot only..
Carried-forward claims: every VER-003 criterion judgment (1 through 10) is carried forward on its original evidence. Main changed no WO-160 source file; the one source file both sides touched, `scripts/test-runner.mjs`, merged WO-161's flag rename with item 6's `--against` parsing, and the runner suite and the product gate on the integrated tree re-establish items 6 and 9 there. Criteria 8 and 10 gain the retimed skeleton label 0.43.1 and the WO-160/002 authority edition as their evidence surfaces; the observer bytes are unchanged since VER-002. The reviewer's own gate, checks and judgment are in [FINAL-001](../../final-reviews/WO-160/FINAL-001.md).
Authored conflicts observed: docs/evidence/current.json, docs/product/06-roadmap.md, package-lock.json, packages/console/package.json, packages/skeleton/package.json, scripts/test-runner.mjs.
Affected checks were run by the reviewer; their results are in the evidence list above and in FINAL-001.
