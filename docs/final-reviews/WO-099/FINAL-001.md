# WO-099 FINAL-001 — final review of the mission check

**Verdict: pass.** All five acceptance criteria hold at the reviewed subject, judged against the order exactly as written. The verification sequence is VER-001 through VER-005 (fail) and VER-006 (pass); I judged all six. I confirmed independently that the subject VER-006 passed is byte-for-byte the subject this review publishes, ran the full product gate on the staged tree, and checked each criterion against the artifact it names rather than against the reports that assert it. No finding routes to repair. One defect I met is a harness defect outside this order's surface and is recorded with a named follow-up as [WO-099-D035](../../evidence/WO-099/decisions.md#wo-099-d035).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"unknown","source":"operator-attested"}

The model and effort are the operator's supplied values for this session; this harness exposes no effective-effort readback, so `effort` stays `unknown` rather than being invented.

**Process cost:** entry 84071 tokens; handoff 3017581 tokens; source claude-transcript-message-usage

Scope `dispatch`, cutoff 2026-09-20T23:09:44.549Z. No subagent was planned or launched: count 0 against the `docs/control/budgets.json` cap of 20, `countKind` `exact-observed`, with no unresolved admission and no unlinked child. The whole review ran in one writer session.

## Subject and evidence boundary

The subject is the uncommitted `wo-099` worktree at base `479107530e35304bd2b39a4bfeaa09cd0011b103` (`main`, WO-110). `main` is an ancestor of `HEAD` and has not moved since VER-006, so no integration was required and no retiming followed from one.

The verified subject is preserved at `refs/dotln/checkpoint/WO-099/23` (`251edfa82a9b9e9bd64d05cb8e0b8e47ff889fa5`), the capture VER-006 judged. I checked that the publishable subject is that subject. All tracked source under `packages/`, `scripts/`, `package.json` and `package-lock.json` is identical to that checkpoint. The order's eight implementation files were still untracked at dispatch, so an ordinary `git diff` reports them as deletions and cannot witness them; I compared each one's `git hash-object` against the checkpoint blob instead, and all eight match exactly: `mission-check-protocol.ts`, `mission-check-source.ts`, `mission-check-host.ts`, `loadouts/mission-check.ts`, `sha256.ts`, `test/mission-check.fixture.ts`, `test/mission-check.test.ts` and `scripts/evidence-mission-check.mjs`. Nothing in the reviewed source changed after the passing verification.

I made no implementation or test change in this review. My only writes are this report, the PR body and release notes beside it, decision D035, and the staging and commits the pass authorizes.

## Acceptance results

**Criterion 1 — the four verdicts under doubles: met.** `packages/skeleton/test/mission-check.test.ts` covers an out-of-surface diff and a clause changed mid-episode both yielding `drift` that names the clause, an on-contract diff yielding `on-mission`, and an unavailable verifier yielding `unknown` with a hold. The capsule projection is exercised against the real WO-099 contract, the real `00-vision.md` and a real decisions file rather than fixture text alone.

**Criterion 2 — the correction event, the hold and its clearance: met.** A `drift` verdict appends `MissionDriftObserved` beside the hold, a fixture dispatch during the hold is refused and the refusal names the hold, and both clearance paths are covered: a human answer, and a fresh passing judgment over a capsule whose hash differs from the held one. A clearance that re-judges the same bytes, or that still drifts, is refused.

**Criterion 3 — one operator-run unattended row: met.** `docs/evidence/WO-099/live.json` records it: operator away before and after, a detached parent with no terminal, a Codex `gpt-6-astra` episode at `xhigh`, a planted drift editing `docs/product/00-vision.md` outside `packages/fixture`, verdict `drift` over two findings, the hold raised, one correction recorded, the next dispatch refused naming that hold, and release on the human answer, in 18.8 s. Identifiers are reduced to shapes: `judgmentShape` carries types, not values, and no raw transcript, path or session identity is filed. The row states its own four limits.

**Criterion 4 — the write-backs: met.** All four land. `02-domain-model.md` §Feedback records `MissionDriftObserved` as the first non-operator producer of a correction and states that a host-derived finding wins its key over a judge that restates it. `03-architecture.md` §Operator-presence policy records the mission check and the dispatch hold. The decisions index carries D001 through D035. The capability table's `runtime.resident` row is reassessed under a dated 2026-09-20 heading to **1 — demonstrable, live-evidenced**, with the remaining gate stated plainly: one synthetic worktree, one planted drift, no unattended hour, no repair loop, no dependable-scope claim.

**Criterion 5 — the gates: met.** Recorded below.

## Gates run at this review

`npm test -- --review` on the staged tree: **29 passed, 0 failed, 431.44 s, 73 fresh tasks**. This is the passing product row this review carries into the control event and the PR.

`git diff --cached --check`: clean.

No new dependency. The only `package.json` movement is the internal component bump `@dotln/skeleton` 0.32.0 to 0.33.0 and its matching pin in `packages/console/package.json`; no dependency was added, removed or re-ranged.

The regenerated bundle pins and a fresh feedback evidence edition are present, as criterion 5 requires because runtime source changed: `docs/evidence/current.json` moves the `feedback` edition to WO-099 revision 005 and the `authority` edition to WO-099 revision 004, each with its own captured edition directory.

The release target is `v0.37.0`, free at review time, over the published baseline `v0.36.0`. The roadmap records the collision retiming from the unpublished `v0.36.0` target under the order's existing minor classification; the component version is a separate namespace and is unaffected.

## The verification sequence

Six judgments, converging, each one reproducing its predecessor's findings as repaired before adding its own. VER-001 failed on command binding, automatic clearance, the ordinary diff bound, historical identity and stale evidence. VER-002 failed on a host-proved drift discarded when the model episode fails, and on a symlink copying outside-worktree bytes into the capsule. VER-003 failed on capsule overflow breaking resident observation before a hold is recorded, and on an unreadable decision history silently replaced by an empty one. VER-004 failed on ignored work never reaching the capsule while the judge is told the path list is complete, and on a judge replacing the host's own reason in the hold. VER-005 failed on a defect living entirely in the fourth repair's new code: the ignored-entry baseline counted the project's own build output as out-of-surface work, so one ordinary `npm run build` turned the supervisor into a hold nothing could retire. VER-006 passed, confirming that repair reaches the prior failure mechanism, that the real worktree reproduces it, and that every earlier mission-check regression stays green.

The sequence is coherent: no finding was closed by assertion, each repair carried its own regression, and VER-005's finding is correctly recorded as new code rather than a five-round miss, which the checkpoint comparison in that report establishes directly.

## The defect I met and did not fix

Four of this order's six verification reports carry `**Process cost:** unknown; cause no-session`. I checked why rather than accepting it, and the cause is structural, not incidental: `measureHarnessUsage` throws `"Begin the harness session before measuring usage"` unless a begun session record exists, the Claude hooks write that record at dispatch, and no Codex path calls `harness begin` at all. Repository-wide the split is exact and without exception — `claude-code` 13 real readings and 0 unknown, `codex-cli` 0 real readings and 8 unknown. On this order the four Codex-run verifications record unknown and the two Claude-run ones record real counters.

The recorded `no-session` code is accurate, not a mislabel: it asserts that no session record was found, which is exactly what the tool's own message proves. The reports are honest about a real gap.

I did not repair it. The order's non-goals exclude any source change, and editing `harness-host.ts` or the Codex dispatch would invalidate the passing gate row this review has to cite. It is recorded as [D035](../../evidence/WO-099/decisions.md#wo-099-d035) with a named follow-up: call `harness begin` from the Codex dispatch path, or give Codex the graceful branch Copilot already has in the same function. It needs its own work order. This is its third recorded sighting, after `r1-replan-2026-09-16.md` and WO-121 VER-002.

## Limits and disposition

**What the pass claims.** A read-only cadence-driven judge over the active contract and the vision theses, whose four verdicts, hold, correction event and both clearance paths are established against doubles, and which has produced one live unattended drift judgment end to end.

**What it does not claim.** Not a dependable-scope capability, not an unattended hour, not automatic repair, and not verification of the work it judges. A judgment is an observation about a diff. The live evidence is a single 18.8 s observation on one synthetic worktree with one planted drift, and the structural finding in that run was host-derived; WO-111, WO-055 and WO-100 carry the rest.

**Cost evidence.** The order's own `**Cost:**` declaration is a legacy unavailable line, and no reduction is claimed for it. That missing cost evidence remains the next planning refutation's subject, as the order states.

**Goal alignment.** Mission and critical path: this is the first judgment the resident makes about the work it is running, and it lands as a typed protocol with a fail-conservative hold rather than as a prompt. Rule beating was the live trap across this sequence — a model's claimed pass is not a judgment, a complete-looking path list is not a complete capsule, and a judge's prose is not the host's proof — and the verification sequence caught all three, which is why five rounds failed before one passed. Drift: I report the n=1 magnitude and the host-derived finding beside the met criteria. Escalation: this review adds no check, hook or receipt; D035 is a nomination in an existing channel. Shifting the burden: the hold refuses unattended dispatch and waits for a human rather than widening anything. Commons: one gate run, no live inference, zero subagents. Naive Interventionism: I changed no source, no product document and no closed report, and the one defect I met is boarded up rather than fixed under a review's authority. NoOp: declining over the single live observation would leave a verified supervisor unmerged while every dated claim already carries its reopening condition.
