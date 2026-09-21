# WO-147 decisions — resident lock contention

Dispatch: `resume: next` on 2026-09-21, Codex executor, model
`gpt-5.6-sol`, effort `xhigh` (`codex-session-readback`). Authority:
`docs/work-orders/WO-147-resident-lock-contention.md`.

## WO-147-D001 — Re-inspect a vanished host lock under the existing guard

```json
{
  "id": "WO-147-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-147 objective and criteria 1 and 4",
  "decision": "Factor the existing host.lock inspection inside WorkerStore.acquire into a local operation and invoke it at most twice: once normally, and once only when lstatSync or readFileSync reports ENOENT. Both inspections run while the existing acquisition guard is held. An absent second observation proceeds; a present lock receives the unchanged live/dead, shape and replay judgments. ResidentStore.transaction keeps its current retry pattern.",
  "evidence": [
    "packages/skeleton/src/worker-store.ts: acquire holds acquireGuard(directory) across host.lock inspection, log inspection and lock publication",
    "docs/evidence/WO-143/decisions.md#wo-143-d004--board-up-a-pre-existing-contention-race-met-during-verification: two-process reproduction on the working tree and released v0.32.0",
    "packages/skeleton/src/resident-store.ts: transaction retries only live-host and recovery-busy refusals",
    "docs/work-orders/WO-147-resident-lock-contention.md: the guard excludes new writers, so a lock that vanishes while it is held was released by the prior holder",
    "Executed mutation 2026-09-21: replacing the try/catch and second inspectLock call with one inspectLock call made the WO-147 contention fixture fail in 193.86 ms on raw ENOENT from lstat(host.lock); restored source passed both WO-147 cases in 4.161 s"
  ],
  "rejected": [
    {
      "option": "Retry any ENOENT in ResidentStore.transaction",
      "reason": "That would also retry a missing event log or another missing required path and weaken fail-conservative refusal."
    },
    {
      "option": "Introduce a retryable error class or a new lifetime mutex",
      "reason": "The existing guard already supplies the required exclusion; a new protocol is larger than the observed race and would add compatibility and crash boundaries."
    },
    {
      "option": "NoOp",
      "reason": "The reproduced race ends a presence command or resident transaction, leaving WO-111's first unattended hour exposed to an ownerless failure."
    }
  ],
  "reopenWhen": "A vanished host.lock still escapes as ENOENT, a second inspection can observe a newly published writer while the guard is held, or a malformed/missing non-lock path begins retrying."
}
```

Mission and critical path: the always-on resident is the current route to an
independently verified source-to-deliverable loop. Removing its reproduced
contention exit advances that outcome directly and removes recurring operator
rescue rather than adding supervision.

System traps, scaled to this patch. Policy resistance is avoided by keeping the
guard and the resident retry policy consistent: only the lock inspection owns
the disappearance race. Rule beating is live, so the fixture must pause a real
contender between observation and read and must fail when the re-inspection is
removed. Drift to low performance is checked by re-measuring the WO-143 lock
cycle. Tragedy of the commons and escalation are bounded to no subagents, no new
gate or dependency, and the order's required repeated runs. Success to the
successful is addressed by comparing the local re-inspection with transaction
retry and a new mutex rather than preferring the invested mechanism without
argument. Shifting the burden favors action because NoOp leaves an intermittent
resident exit for the operator. Seeking the wrong goal is avoided by preserving
event bytes and compatibility rather than treating a passing retry as the
outcome. Naive Interventionism: the smallest reversible intervention is one
bounded re-inspection plus discriminating fixtures; malformed state and other
missing paths continue to refuse. NoOp is rejected above and reopens if the
unattended-hour evidence shows the race is immaterial or the intervention
changes a refusal outside `host.lock`.

## WO-147-D002 — Keep repeated-run evidence transient

```json
{
  "id": "WO-147-D002",
  "date": "2026-09-21",
  "dispatch": "resume: next; equipped Tinkerer — Economy support",
  "kind": "experiment",
  "decision": "Decline a permanent repository command for this order's ten-run evidence protocol and use the existing npm and Node test commands in transient bounded loops.",
  "question": "Would a permanent repository command for WO-147's ten repeated concurrent and isolated runs reduce future executor cost?",
  "alternatives": [
    "Add a versioned script or package command that owns the repeated-run protocol.",
    "Use the existing npm and node test commands in transient bounded loops and record their transcripts."
  ],
  "observation": "WO-147 is the only named consumer of this exact ten-plus-ten protocol, while the repository already exposes npm test and Node's test-name-pattern selection. A permanent wrapper would add a maintained command without an observed second caller.",
  "evidence": [
    "docs/work-orders/WO-147-resident-lock-contention.md criterion 3: one order owns the ten concurrent and ten isolated runs",
    "package.json and scripts/test-runner.mjs: npm test and the skeleton suite already expose the required command surfaces",
    "docs/evidence/WO-150/decisions.md#wo-150-d004: starting experiment history 2026-09-20/0"
  ],
  "rejected": [
    {
      "option": "Add a versioned script or package command",
      "reason": "No second caller is observed, so the command would add maintenance without a measured recurring saving."
    }
  ],
  "budget": { "wallSeconds": 120 },
  "execution": "declined",
  "reason": "The deciding observation was available from the order and package command surface; a timed implementation trial would create the persistent cost being evaluated.",
  "cost": {
    "wallSeconds": 0.1,
    "tokens": null,
    "commands": [
      "rg -n 'ten consecutive runs under|ten times alone|ten consecutive.*alone' docs/work-orders docs/evidence --glob '*.md'"
    ],
    "source": "exec wall_time_seconds for the bounded consumer search; token cost and separately attributable preparation/recording time were unavailable"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "rg -n 'ten consecutive runs under|ten times alone|ten consecutive.*alone' docs/work-orders docs/evidence --glob '*.md'"
    ],
    "summary": "No recurring saving is claimed; existing commands remain the method."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-20",
    "experimentsSinceAdoption": 1
  },
  "reopenWhen": "A second order requires the same repeated concurrent-versus-isolated protocol, or transient orchestration proves error-prone enough to obscure a run count or exit status."
}
```

The starting history is WO-150-D004's carried record:
`lastAdoptedImprovementAt` 2026-09-20 and `experimentsSinceAdoption` 0. This
declined trial changes the latter to 1 and changes no executable behavior.

## WO-147-D003 — Close the retirement inference as not reproduced

```json
{
  "id": "WO-147-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-147 objective and criterion 2",
  "decision": "Record the delayed-claim retirement inference as not reproduced and make no acquireGuard change. In each of 20 attempts the real peer paused the retiring owner's rmSync after host.lock publication and canonical-guard unlink, a delayed peer published a valid hard-link successor claim inside the retired target, and retirement then completed. The delayed peer refused after the canonical link had vanished. No attempt produced ENOTEMPTY or an acquisition failure.",
  "evidence": [
    "packages/skeleton/test/resident.test.ts: WO-147 retirement probe tolerates a delayed claim present when recursive cleanup begins",
    "packages/skeleton/test/fixtures/worker-lock-process.ts: rmSync and linkSync before/after pause points",
    "Executed 2026-09-21: 20 attempts, 20 original acquisitions, 20 delayed refusals, 0 retirement failures, test duration 4.010 s"
  ],
  "rejected": [
    {
      "option": "Add a retry around rmSync despite the negative probe",
      "reason": "No observed failure establishes a safe retry condition, and changing retirement would add cleanup behavior and crash boundaries outside the reproduced contention defect."
    },
    {
      "option": "Ignore the verifier inference without a probe",
      "reason": "WO-147 explicitly requires a deterministic attempt and an exact negative record if the inference does not reproduce."
    }
  ],
  "reopenWhen": "A supported filesystem produces ENOTEMPTY during guarded retirement, host.lock remains published after acquire throws, or a probe that links during native recursive traversal rather than at its paused entry reproduces the inference."
}
```

## WO-147-D004 — Keep the re-inspection bounded to the supported one-release invariant

```json
{
  "id": "WO-147-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next; Receipt 022 known issue carried by docs/planning/work-order-map.md",
  "decision": "Keep the work order's one guarded re-inspection. A supported holder can remove host.lock once; the already-held acquisition guard excludes every new conforming writer, so the retry cannot observe another supported lock that then vanishes. A two-vanish fixture would require an out-of-protocol same-user writer, which this order explicitly excludes. The fixed point is therefore absence under the guard, not an expanded transaction retry or unbounded filesystem loop.",
  "evidence": [
    "packages/skeleton/src/worker-store.ts: acquireGuard is held across both inspectLock calls and host.lock publication",
    "docs/work-orders/WO-147-resident-lock-contention.md Design: the guard excludes new writers and specifies one re-inspection",
    "docs/work-orders/WO-147-resident-lock-contention.md Non-goals: no change to dead-owner reclaim writes; fail-conservative scope",
    "docs/planning/work-order-map.md WO-147 Receipt 022 carry-in: the independent refuter's hypothetical second vanish and its requested disposition"
  ],
  "rejected": [
    {
      "option": "Loop on every ENOENT until a fixed point or the resident's 200-attempt budget",
      "reason": "That imports the resident transaction policy into WorkerStore, widens behavior for non-resident callers and addresses a state no conforming writer can create while the guard is held."
    },
    {
      "option": "Add a second-vanish fixture by recreating host.lock behind the guard",
      "reason": "The fixture would prove behavior against a hostile same-user protocol violation, an explicit non-goal, rather than discriminate the reproduced holder-release race."
    }
  ],
  "reopenWhen": "A conforming writer publishes or removes host.lock while another process holds host-lock-recovery, or a supported local filesystem can make the same released directory entry appear present and vanish twice without a new writer."
}
```

## WO-147-D005 — Repair the missed activation label from the observed release baseline

```json
{
  "id": "WO-147-D005",
  "date": "2026-09-21",
  "dispatch": "resume: next; required local release preparation",
  "decision": "Replace the activation placeholder with application v0.39.1, update the README release block and add the roadmap activation record. This is the next patch above the observed local annotated v0.39.0 tag under WO-147's declared patch classification. Stage skeleton 0.34.1 and the console's exact pin through the release helper.",
  "evidence": [
    "git describe --tags --abbrev=0: v0.39.0",
    "git tag --sort=-version:refname: v0.39.0 is the highest local version",
    "docs/work-orders/WO-147-resident-lock-contention.md: exactly one patch release classification",
    "npm run release -- prepare --local refused the activation placeholder before making any edit",
    "packages/skeleton/package.json 0.34.0 and packages/console/package.json exact @dotln/skeleton pin 0.34.0 before preparation"
  ],
  "rejected": [
    {
      "option": "Leave the placeholder and bypass release preparation",
      "reason": "The executor contract requires local release preparation and the helper correctly refuses an unassigned application version."
    },
    {
      "option": "Choose a minor or major target",
      "reason": "That contradicts the order's explicit patch classification and the compatibility-preserving change."
    }
  ],
  "reopenWhen": "A higher local annotated release is integrated before final review, in which case the release helper retimes under the unchanged patch classification."
}
```

## WO-147-D006 — Treat the required repeat count as final-code stability evidence

```json
{
  "id": "WO-147-D006",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-147 criterion 3 and Receipt 022 clarification",
  "decision": "Count ten sequential runs of the named WO-143 boundary case inside `npm test -- --only skeleton` as the runner-concurrent series, and ten sequential direct Node test runs as the isolated series. Count only the final implementation after the path-decoder repair. All twenty passed: 6,880 deterministic crash boundaries, with every just-exited PID asserted dead before and after its use.",
  "evidence": [
    "Runner-concurrent final series: 10/10 pass; per-run wall seconds 260, 266, 264, 264, 263, 264, 262, 261, 313, 297; total 2,714 s; command npm test -- --only skeleton; Node file concurrency 2",
    "Isolated final series: 10/10 pass; per-run wall seconds 157, 158, 157, 194, 210, 158, 157, 154, 160, 156; total 1,661 s; direct --test-name-pattern selection",
    "Each named case reports 344 deterministic SIGKILL boundaries across its eight once/loop, lifetime/append, fresh/reclaim cells; 20 x 344 = 6,880",
    "docs/evidence/WO-147/fixtures.md: commands, run shape, totals and the excluded pre-final observations"
  ],
  "rejected": [
    {
      "option": "Run ten full canonical product gates",
      "reason": "Receipt 022 explicitly says the criterion means ten runs of the named case within the runner's concurrent load, not ten canonical gates."
    },
    {
      "option": "Count the earlier ten isolated passes",
      "reason": "A later source correction restored the path-named decoder invariant, so those runs did not judge the final source bytes."
    },
    {
      "option": "Treat the first runner-loaded failure as a PID result",
      "reason": "The named boundary case passed; the one failure was WO-048's static read inventory and was repaired before the final twenty-run series."
    }
  ],
  "reopenWhen": "The named matrix again observes a supposedly dead PID as live, any final-code run changes a boundary trace, or the runner changes its skeleton file-concurrency shape."
}
```

## WO-147-D007 — Preserve filesystem codes through the path-named decoder

```json
{
  "id": "WO-147-D007",
  "date": "2026-09-21",
  "dispatch": "resume: next; encountered WO-048 invariant during criterion 3",
  "decision": "Keep readFileSync(host.lock) inside atPath and copy the underlying Node filesystem error code onto StorePathError. WorkerStore.acquire can therefore distinguish ENOENT for its one guarded re-inspection while every disk/JSON read remains in the established path-named decoder and every other diagnostic keeps its prior wrapped message.",
  "evidence": [
    "First npm test -- --only skeleton observation: 409/410 pass in 259.71 s; WO-048 failed with 'worker-store.ts: readFileSync must be within a path-named decoder'",
    "packages/skeleton/test/worker-read-inventory.test.ts: static inventory requirement",
    "Targeted rebuilt result: WO-048 inventory and WO-147 contention tests both pass; 39 selected file/test results, 0 failed, 1.857 s"
  ],
  "rejected": [
    {
      "option": "Leave the read outside atPath and weaken the inventory test",
      "reason": "That would discard a path-attributed host-read invariant to accommodate the patch rather than preserve both behaviors."
    },
    {
      "option": "Match ENOENT from the wrapped error message",
      "reason": "String matching is platform-sensitive and would make the retry depend on diagnostic wording instead of the filesystem code."
    }
  ],
  "reopenWhen": "A wrapped filesystem error loses its code, a non-ENOENT path error enters the retry, or the read inventory no longer recognizes the host.lock read."
}
```

## WO-147-D008 — Verifier correction: VER-001 passed a subject whose evidence editions are stale

```json
{
  "id": "WO-147-D008",
  "date": "2026-09-21",
  "dispatch": "resume: verify, then operator override: authorized recovery after the pass was recorded",
  "decision": "Record that VER-001's pass verdict was recorded before the document gate ran and is wrong on the delivered work, and board the defect it missed for repair. WO-147 changes packages/skeleton/src/worker-store.ts, packages/skeleton/package.json and package-lock.json, all declared authority and feedback evidence sources, without re-minting those editions, so npm run test:docs fails and the review selection's authority-evidence and feedback-evidence rows are red. The verifier makes no implementation change and leaves VER-001's recorded bytes and verdict unchanged; repair belongs to an executor dispatch the operator routes.",
  "evidence": [
    "Executed 2026-09-21: node scripts/authority-evidence.mjs --check fails with 'stale WO-150 revision 001 evidence: bundle-diff.json; select a new edition or revision to preserve existing evidence'",
    "Executed 2026-09-21: node scripts/feedback-evidence.mjs --check fails with 'feedback evidence is stale'",
    "Executed 2026-09-21: npm run test:docs reports 12 passed, 7 failed; authority-evidence and feedback-evidence fail, and plan, plan-refutation-current, console-docs, skeleton-docs and lineage-fixtures each fail at 0.00 s with 'Required preflight or fixture preparation failed ... authority-evidence'",
    "scripts/lib/evidence-sources.mjs commonSources lists packages/skeleton/src/worker-store.ts, packages/skeleton/package.json and package-lock.json; all three are in this order's diff",
    "scripts/authority-evidence.mjs: the preserved branch retains immutable evidence only when sameEvidenceSourceContent holds, which a changed behavior source correctly defeats; the retention message names component release labels as the admitted difference",
    "docs/evidence/current.json pins the authority and feedback editions at WO-150 revision 001",
    "docs/evidence/WO-150/decisions.md#wo-150-d006: the preceding order re-minted exactly these two editions for the same class of change",
    "npm run test:full --list: the review selection contains authority-evidence and feedback-evidence, so final review meets this gate",
    "Executed 2026-09-21: npm test passed 22 suites, 0 failures, 277.31 s, so criterion 6's named gate is green and did not surface the defect"
  ],
  "rejected": [
    {
      "option": "Re-mint the editions in this dispatch",
      "reason": "A verifier that repairs the subject makes its own pass retroactively true; the role forbids editing implementation to turn a verdict green, and the override authorizes recovery, not a change of author."
    },
    {
      "option": "Edit VER-001 to record a fail",
      "reason": "The report is immutable and bound to its verdict checkpoint refs/dotln/checkpoint/WO-147/4; rewriting it would destroy the evidence that the pass was recorded and would defeat the reviewer's byte check."
    },
    {
      "option": "Leave the finding only in the dispatch response",
      "reason": "docs/control/local/harness/checks.json holds no failing row for the document gate, so nothing downstream would carry the defect into final review."
    },
    {
      "option": "Force a repair transition from the verified phase",
      "reason": "resume fix requires needs-fix, which only a fail verdict creates; inventing a transition would falsify the lifecycle record."
    }
  ],
  "followup": "WO-147 repair, routed through final review: from the recorded pass the only legal path to repair is resume: final review, whose fail records needs-fix (scripts/lib/control.mjs FinalReviewCompleted) and admits resume: fix; there is no direct reopen from the verified phase. The repair is to re-mint the authority and feedback evidence editions as WO-147 revision 001 and repoint docs/evidence/current.json at them, as WO-150-D006 did for the same class of change. Commands after a build: node scripts/authority-evidence.mjs --write --edition WO-147 --revision 001 and node scripts/feedback-evidence.mjs --write --edition WO-147 --revision 001, which mint docs/evidence/WO-147/authority/001 and docs/evidence/WO-147/feedback-001 per currentEvidence's suffix rules; --write only creates absent files, which is why a new edition rather than an in-place rewrite is required. Then set the authority and feedback rows of docs/evidence/current.json to workOrder WO-147, revision 001, leaving artifact-identity and verification at WO-146. Check with node scripts/authority-evidence.mjs --check, node scripts/feedback-evidence.mjs --check, npm run test:docs and npm run test:full. Priority: high, because the review gate is red and npm test does not detect it.",
  "reopenWhen": "The authority or feedback edition again records bytes that a later order's behavior-source change invalidates without re-minting, or a verification records a result before the document and review gates have run."
}
```

D008 was written by the verifier after VER-001 was recorded, under an operator
override, and changes no implementation, criterion or staged capability
assessment. It gives the defect VER-001 missed an owner instead of leaving it in
a dispatch response. VER-001's own limits section states that no defect was
encountered and deferred; this decision corrects that sentence and the criterion
6 judgment it rests on. What was misread: criterion 6 names `npm test`, which is
green, and the verifier treated that named gate as the whole gate surface for a
diff that also changes declared evidence sources. What was meant: the order's
changes must leave every repository gate that reads those sources green. What
changed: the defect is now recorded with a named follow-up, and the pass verdict
stands in the record as made, marked wrong here rather than rewritten.

## WO-147-D009 — Integrate main at 452d7e72 and retime the unpublished target to v0.40.1

<!-- integration refs/dotln/checkpoint/WO-147/6 -->

```json
{
  "id": "WO-147-D009",
  "date": "2026-09-21",
  "dispatch": "resume: final review; worktree integrate WO-147",
  "decision": "Integrate main at 452d7e72 (WO-148, published v0.40.0) into the commit-less wo-147 branch by fast-forward with the WO-079 helper, retime the unpublished target from v0.39.1 to v0.40.1 under the order's unchanged patch classification, and carry every VER-001 acceptance claim forward unchanged: no byte under packages/, package.json or package-lock.json differs between the verification checkpoint and the integrated tree; main changed no file this order changed except docs/product/03-architecture.md, where Git merged WO-148's three added paragraphs beside this order's edited WO-143 paragraph without conflict; and the skeleton 0.34.1 bump collides with nothing because main still carries 0.34.0.",
  "evidence": [
    "refs/dotln/checkpoint/WO-147/6: the pre-integration working state, untracked paths included",
    "base c84db382efd665e52f20927b3885f4019c879f43",
    "upstream 452d7e72fda0ecaa4aad8f03f261602f18f51f7a; git rev-parse HEAD equals it after the fast-forward, and git log HEAD..main is empty",
    "Named stash WO-147 integrate 2026-09-21 (82d21f0addeeee1fad24b4858dc2cc75f9b8dc4b), retained",
    "git diff --stat refs/dotln/checkpoint/WO-147/4 -- packages package.json package-lock.json: empty at the integrated tree, so the subject VER-001 completed against is the subject reviewed",
    "git diff --stat refs/dotln/checkpoint/WO-147/6 -- packages .claude docs/product/03-architecture.md docs/planning/capability-table.md: only main's 58 added lines in product 03 and 17 in packages/skeleton/README.md",
    "docs/verifications/WO-147/VER-001.md byte-identical to its checkpoint 6 copy",
    "release prepare --local: Retimed WO-147: v0.39.1 to v0.40.1; updated its heading, README claim and dated roadmap note; latest local annotated tag v0.40.0; component versions skeleton 0.34.1 against main's 0.34.0 with the console pin following, compiler 0.17.0, kernel 0.6.0 and console 0.1.7 unchanged",
    "Integrated-tree checks, executed 2026-09-21: publication:check 273/273 headings and both editions current; harness check 31 generated surfaces; release check-surfaces --local every surface PASS; plan check exit 0 with this order's release-assignment update classified; work-orders index --check current; format:check clean; git diff --check and git diff --cached --check clean"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the moved base, the retime or the changed whole-tree hash as a finding",
      "reason": "Product 07 §Independent workflows and integration names each as bookkeeping; no authored conflict arose and no acceptance claim depends on a byte main changed."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-21. Original base: `c84db382efd665e52f20927b3885f4019c879f43`.
Fetched main: `452d7e72fda0ecaa4aad8f03f261602f18f51f7a`. Checkpoint: `refs/dotln/checkpoint/WO-147/6`.
Named stash retained: `82d21f0addeeee1fad24b4858dc2cc75f9b8dc4b` (WO-147 integrate 2026-09-21).
Resolved projections: README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-147: v0.39.1 → v0.40.1; updated its heading, README claim, and dated roadmap note.
Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 6 as VER-001 judged them at checkpoint 3 and completed at checkpoint 4 carry forward unchanged, because the integrated tree holds the same bytes under `packages/`, `package.json` and `package-lock.json`, main's WO-148 work touched no registered evidence source and no file this order changed except the merged product 03 section, and the retime moves only the application label. The product gate on the integrated tree is FINAL-001's and is recorded there.
Authored conflicts observed: none.
Affected checks executed on the integrated tree: the four printed checks (the product gate in FINAL-001, publication:check, harness check, release check-surfaces --local) plus plan check, work-orders index --check, format:check and both whitespace checks; every one passed.

## WO-147-D010 — Final review: re-mint the stale authority and feedback editions inside this review instead of failing the order into repair

```json
{
  "id": "WO-147-D010",
  "date": "2026-09-21",
  "dispatch": "resume: final review; D008's boarded defect",
  "decision": "Discharge D008's follow-up inside this review: mint the authority and feedback evidence editions as WO-147 revision 001 on the integrated tree, record one live claude-cli-print self-host audit, repoint docs/evidence/current.json at both, re-pin the console's self-host case, and run the review gate on the result; leave VER-001's recorded verdict and D008's text as written. Route nothing to repair: the code is unchanged since verification, the authority edition is deterministic, and the feedback edition differs from WO-150's in exactly one field, the subject hash.",
  "evidence": [
    "Executed 2026-09-21 before any edit: npm run test:docs on the integrated tree fails authority-evidence (stale WO-150 revision 001 evidence: bundle-diff.json) and feedback-evidence (feedback evidence is stale), with plan, plan-refutation-current, console-docs, skeleton-docs and lineage-fixtures blocked behind authority-evidence at 0.00 s: 12 passed, 7 failed",
    "scripts/lib/evidence-sources.mjs commonSources: package-lock.json, package.json, packages/skeleton/package.json and packages/skeleton/src/worker-store.ts are registered sources of both editions and all four are in this order's diff; main's WO-148 changed none of the registered sources, so the staleness is wholly this order's",
    "Why authority went stale, established before regenerating: authority.json is identical in every top-level field between WO-150 revision 001 and WO-147 revision 001; bundle-diff.json differs only in its comparison label and the after-hashes of the 14 generated bundle files that embed the skeleton version and the worker-store hash; deterministic, no live run",
    "Why feedback went stale, established before regenerating: the newly generated feedback.json differs from WO-150 revision 001 in exactly one field, subject (sha256:e6f60a33… to sha256:497d0fd0…); policyHash, all ten fixtures, the context projection, the maturity method and the maturity table are byte-identical, so feedback behavior is unchanged and only the audited source identity moved; validateSelfhost asserts the live log's subject equals the current source subject, so the WO-150 logs could not be carried forward",
    "Executed 2026-09-21: DOTLN_LIVE_WORKERS=1 dotln feedback-audit --store .runtime/feedback-audit-wo147-r001 --transport claude-cli-print --model claude-sonnet-5 --effort max: audit phase complete, 10 fixtures, 1192 saved instruction bytes, verifier claude-cli-print; the verifier episode ep_verifier_1_attempt_1 ran 320.6 s from WorkerAttemptStarted to WorkerCompleted (harness 2.1.278, effective model and effort unknown, limits 600 s and USD 3.00) and returned completed with both criteria passing; command wall clock 323 s; no token or dollar counter is exposed in the store, so the episode cost is unknown; then node scripts/feedback-evidence.mjs --record-selfhost .runtime/feedback-audit-wo147-r001 --edition WO-147 --revision 001 recorded both streams and --check passed",
    "docs/final-reviews/WO-047/FINAL-001.md: that order's reviewer re-minted stale authority and feedback editions on the integrated tree with a fresh live audit after establishing why each was stale, which is the precedent this decision follows; docs/evidence/WO-150/decisions.md#wo-150-d006 and docs/evidence/WO-143/decisions.md#wo-143-d002 are the executor-side precedents for the same class of change",
    "docs/product/07-execution-guide.md §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it; git diff --stat refs/dotln/checkpoint/WO-147/4 -- packages package.json package-lock.json is empty at every point of this review",
    "Checks after minting: node scripts/authority-evidence.mjs --check and node scripts/feedback-evidence.mjs --check pass; npm run test:docs and npm test -- --review are recorded in FINAL-001"
  ],
  "rejected": [
    {
      "option": "Fail this review so an executor re-mints under resume: fix, then VER-002 and FINAL-002 (the route D008's follow-up names)",
      "reason": "It spends three dispatches and a second product gate on a regenerated evidence document over unchanged code, and the independent check a VER-002 would add is the same mechanical --check the review gate runs; product 07 asks that bookkeeping not create a failed FINAL or a repair event, and the WO-047 review established that a reviewer may re-mint editions once the reason each is stale is shown to be identity-only."
    },
    {
      "option": "Relax or bypass the staleness checks, or copy the WO-150 self-host logs into the new edition",
      "reason": "The check is what stops a source change from inheriting an older live audit, and the old logs record a different subject hash."
    },
    {
      "option": "Leave the finding only in this report",
      "reason": "The review gate would stay red and the defect would keep no owner in a structured record."
    }
  ],
  "followup": "Planner: an order that edits packages/skeleton/src/worker-store.ts or any other registered evidence source (scripts/lib/evidence-sources.mjs) carries one live feedback self-host episode in its Cost line and its dispatch dimensions; WO-143 D002 met this miss in flight and this order met it at verification, so the catalog row's 'no live model' is wrong for that class of order. Priority: low.",
  "reopenWhen": "A later order changes a registered evidence source without minting the next edition before verification, or a reviewer re-mints an edition whose staleness cannot be shown to be identity-only."
}
```

D008 expected the repair to arrive through a failing final review and `resume:
fix`. This review discharges the same follow-up itself, for the reasons in the
rejected options, and records the disagreement here rather than editing D008;
D008's register row is planning's to settle, since disposition is a planning
act. The live audit is a paid model episode and is the one admission this
review made against the 20-agent budget. Nothing under `packages/` changed:
the editions record the reviewed source, they do not alter it.
