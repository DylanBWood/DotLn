# Native role qualification

Both hosts performed all five roles in the episodes of 2026-10-26 below. The
episodes of 2026-10-31, at the end, repeat them on this order's reviewed code:
Claude completed all five roles, and Codex completed four, with its release
close refused for a reason nobody has seen. This summary does not claim
completion of WO-192 or replace its final complete and document gates.

| Host | Role | Retained evidence | Result |
| --- | --- | --- | --- |
| Claude Code 2.1.310 | Router | [Attempt 39](live-drive-attempt-39.json), [attempt 44](live-drive-attempt-44.json) | The first native router drove implementation through passing final review and stopped for merge. A later native router drove the post-merge close to released. |
| Claude Code 2.1.310 | Executor | [Attempt 39](live-drive-attempt-39.json) | ImplementationReady consumed actual target and passing document gate evidence. The successful attempt followed one provider error before native work. |
| Claude Code 2.1.310 | Verifier | [Attempt 39](live-drive-attempt-39.json) | VerificationCompleted pass consumed both gates. |
| Claude Code 2.1.310 | Reviewer | [Attempt 39](live-drive-attempt-39.json), [integration observation](live-integration-observation-39.json) | FinalReviewCompleted pass consumed both gates; canonical launchpad integration completed. |
| Claude Code 2.1.310 | Release close | [Attempt 44](live-drive-attempt-44.json) | Native worker exit zero; canonical no-release close; target removed, launchpad cleanup clean, no blockers; fixture removed after workers ended. |
| Codex CLI 0.164.0 | Router | [Attempt 45](live-drive-attempt-45.json) | Two native router sessions exited zero: the first drove through passing final review and stopped for merge; the second drove the post-merge close to released. |
| Codex CLI 0.164.0 | Executor | [Attempt 45](live-drive-attempt-45.json) | ImplementationReady consumed actual target and passing document gate evidence. |
| Codex CLI 0.164.0 | Verifier | [Attempt 45](live-drive-attempt-45.json) | VerificationCompleted pass consumed both gates. |
| Codex CLI 0.164.0 | Reviewer | [Attempt 45](live-drive-attempt-45.json) | FinalReviewCompleted pass consumed both gates after canonical launchpad integration and correction of its own publication metadata. |
| Codex CLI 0.164.0 | Release close | [Attempt 45](live-drive-attempt-45.json) | Native worker exit zero; canonical no-release close; target removed, launchpad cleanup clean, no blockers; fixture removed after workers ended. |

The Claude model readback is `claude-opus-5-5`. All roles were supplied xhigh;
successful phase workers reported xhigh through hook input. Router effort is a
selected definition value, not an observed effective-effort claim. Canonical
phase attestations retain an unknown CLI version where their own readback
did not supply it; the outer fixture independently recorded CLI 2.1.310.

Codex roles were supplied `gpt-6.1-sol` and max. Their native JSON stream
did not expose effective model or effort; the canonical phase attestations
therefore retain those supplied values with source `operator-attested`.
The fixture measured CLI 0.164.0. Executor, verifier and reviewer ran in the
registered target worktree; routers and release close ran in main. Both
router sessions and all four phase workers ended with exit zero. The final
router finished at 2026-10-26T16:46:11.697Z. The receipt's earlier top-level
observedAt marks its first episode, not that final cutoff.

Attempt 44 deliberately qualifies only native router and release close.
Its earlier lifecycle events were coordinator-seeded, clearly labeled and
excluded from native completion evidence. Its synthetic local merges and
no-release policy published no real project branch, pull request, tag or
Release. Attempt 39 supplies the actual earlier native lifecycle; its failed
post-merge close is not presented as success.

Claude ran under the operator-approved disposable-fixture policy: sandbox off,
default permission mode and the launcher's declared tools, retaining deny
rules and DotLn hooks. The coordinator restored its verified temporary
settings in ended target/order checkouts before close, preserving main's policy
for the close worker. Production cleanup rules and global settings did not
change. Durable policy selection remains the recorded planning follow-up.

Codex's recorded launch policy was workspace-write with automatic permission
review and network access for native workers and phase tools. Web search was
live for the four phase workers and disabled for the two routers. Native usage commands sometimes returned unavailable-session
diagnostics, which WO-192-D101 later traced: the router sessions recorded no order.
Usage below comes from the retained outer native streams.

Receipts keep router and worker usage separately. The successful Claude
executor observed two subagents as a minimum with unknown remainder; verifier,
reviewer and close observed zero, with unobserved coverage still unknown.
The fixture retains its per-spawner cap of 20 and driven ceiling of 80.
Failed and interrupted attempts remain separate evidence. The early attempt
39 receipt omitted its later router's result, so its usage is not a complete
cost total for that episode. No overall savings or unattended-operation claim
is made.

Attempt 45 records 2,590,627 router tokens across its two router sessions.
Each phase worker retains input, cached input, output and reasoning counters
separately; USD cost is unavailable. Its four phase admissions form an
observed minimum of four against the driven ceiling of 80. Each worker's
native collaboration stream observed zero descendant admissions, with the
unobserved remainder explicitly unknown; this is not proof of zero actual
descendants. The per-spawner cap remained 20 and the optional phase clock,
token and USD ceilings were null.

Both hosts exercised synthetic local merges and the target's no-release
policy. Real remote publication was not part of these native fixtures;
publication behavior is covered by the deterministic repository checks.

These native episodes predate D069's final paired reviewer Git adapter repair.
The repaired path is exercised through actual generated target hooks and the
passing complete review 18; [driver-regressions.json](driver-regressions.json)
records the focused coverage. It is not attributed to a new native episode.

The episodes also predate D075's validation split, under which the synthetic
lifecycle fixtures run as a product preflight and the record comparisons stay in
the document gate, and the final generated procedure text. Deterministic runner
and procedure regressions judge that correction; the episodes of
2026-10-26 are not evidence of a repeated episode under those later instructions.

## Episodes of 2026-10-31, on the reviewed code

Criterion 17 asks both hosts to drive live again on the final code. These ran after
the review rounds of WO-192-D094 to D099. Criterion 17's last clause is **not met** for
Codex's release close; WO-192-D102 explains why and whose decision that is.

| Host | Roles | Retained evidence | Result |
| --- | --- | --- | --- |
| Claude Code 2.1.314 | Router, executor, verifier, reviewer, release close | [Attempt 48](live-drive-attempt-48.json) | Reached closed and released with every phase exiting 0 and no repair. Verification and final review passed first time. Workers $36.10, routers $0.87, 84 minutes. Both routers' usage commands failed; WO-192-D101 repairs that. |
| Codex CLI 0.166.0 | Router, executor, verifier, reviewer | [Attempt 49](live-drive-attempt-49.json) | The router drove the order through passing final review and every phase exited 0. Router usage commands failed in no row. USD cost is unavailable. |
| Codex CLI 0.166.0 | Release close | Attempts 49 and [50](live-drive-attempt-50.json) | Not completed: the close was declined. A third run's capture was not retained. |
| Claude Code 2.1.314 | Router, release close | [Attempt 51](live-drive-attempt-51.json) | Reached released with no failed router usage row. Worker $0.91, router $0.24. Earlier phases were coordinator-seeded. |

**Codex's release close.** The receipts show one shell command with status `declined`,
empty output and no reason. Their command shape masks its words. A temporary local
capture in a third run showed it was the canonical close,
`release.mjs close WO-999 --publish`; that capture and run left no retained receipt, so
the command's identity and the count of three rest on the session's statement in
WO-192-D102. Codex launches under `--approve-for-me`, which routes approval requests
through automatic review, so a decline by that review is an inference; nothing retained
names the decider. Attempt 45 completed this phase on CLI 0.164.0 under the same launch
policy. Since then the CLI version, the role text, the worker notes and the driver have
all changed, and which of them matters is unknown. `--publish` is what completes any
close, so no other spelling exists.

The top-level `outcome: failed` and `ENOENT` on `release-close.json` in receipts 49 and
50 are the fixture failing to read a close record that was never written. The worker
row's `native-permission-refused` and the drive's stop, `dispatch-refused`, are the
actual stop.

**What this means in use.** On this version a driven Codex order reaches a passing final
review and then stops. The drive refuses to change host on re-entry, so such an order
cannot be finished by switching the drive to Claude, and the stop names no next step.
Running the phrase by hand in an attended session is the route left, and it was not
exercised here.

**Unlike conditions.** Claude's runs had the sandbox off under fixture settings and an
allow rule for the driver. Codex's ran in its workspace-write sandbox under automatic
review. So five roles on one host and four on the other is not a like comparison, and
Claude's close was never judged by an equivalent review.

**What each run saw.** No receipt carries a code identity, so this rests on file times.
Attempt 48 predates WO-192-D101 and the wider program list in `commandShape`; attempt 49
predates that list. Attempts 50 and 51 ran after both. Those later changes are a router
session's order and diagnostic labels, so Claude's full lifecycle stands on attempts 48
and 51 together. No full lifecycle ran on the final bytes on either host.

**Limits.** Only the fixture's Codex router runs `harness begin` with its order; an
operator's own Codex drive session does not, so its usage stays unknown, which blocks
nothing. Attempt 49's executor shows two collaboration calls against a sub-agent count
of 0, and the receipt cannot say what they were, so the three-reviewer duty is unshown on
Codex. Hosted merges were not exercised: these fixtures merge locally and regressions
cover the remote base. The self-order lane was not driven live.
