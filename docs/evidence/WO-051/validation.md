# WO-051 executor validation

Subject: separate source-change request/profile and CLI dispatch, preserving
inspection behavior. All writer episodes here use local process doubles in
scratch Git repositories. No live source-change worker was launched.

| Obligation | Executable evidence |
| --- | --- |
| Inspection request, validator, parser, prompt and complete CLI argument arrays retain their bytes | `writer.test.ts` activation baseline fixture; existing `worker.test.ts` suite |
| Local authority and exact-command validation; writable mount and unsupported-row refusals | New writer refusal tests, including C-W1/X-U2/X-W3, remote effects, conflicting denials and metacharacters |
| One canonical Git worktree within the configured parent and outside the launchpad | Real scratch Git worktree test plus plain directory, subdirectory, ancestor, prefix lookalike and symlink escape cases |
| Host-observed commits, denial count and unchanged-HEAD outcomes | Claude/Codex subprocess doubles execute the test and either commit with the host message or leave edits uncommitted; C-W8/X-W8-shaped synthetic tapes |
| Strict writer results and durable retry identity | Malformed/spoofed/failed-wire refusals, stored envelope validation, retry with producing episode preserved and request drift refusal |
| Product/runbook/security write-backs and operator ideation | Ports, security posture, skeleton runbook, decisions and the [breakout receipt](ideation-local-models.md); publication index and locks refreshed |
| Release and current generated evidence | v0.24.0, skeleton 0.20.0, regenerated harness bundle, fresh authority and deterministic feedback editions; artifact/verification checks pass unchanged |

Executed before the complete gate: build passed; 32 combined worker tests passed;
after the two audit corrections the focused writer suite passed 9/9 in 4.28 s.
The [focused transcript](writer-tests.tap) is process-double evidence, not a live
model transcript. `git diff --check` and publication checks passed at this cutoff.
After moving filesystem/Git preflight to the host boundary, the corrected writer
and reactor checks passed all 36 tests. Their
[transcript](corrected-tests.tap) preserves that later subject. The full product
gate passed: 19 suites, 0 failures, 63 fresh tasks, 259.41 seconds. The first gate
had exposed the purity regression and native fixture sandbox requirement; D003
records both the correction and the outside-sandbox final run.

The final document gate passed all 17 suites, 0 failures, in 101.40 seconds.
Earlier document runs identified a stale generated work-order index and bold
execution-record labels that resembled new order requirements. Regenerate the
index and use ordinary prose for those labels; the decision and review scope
remain unchanged. The passing gate includes current planning, publication,
release, authority, verification, artifact and live-feedback evidence checks.

The fresh feedback report records ten passing equipped regressions and ten
expected removal failures. Its matched instruction projection saves 1,192 bytes;
that figure is not session-token or total workflow savings. The established live
read-only feedback audit completed successfully using `codex-cli-exec`, GPT-6
Astra and ultra. Its selfhost and independent verifier event streams are filed
in [feedback revision 002](feedback-002/feedback.json), now selected as current.
D003 records the executor's decision under the operator's direction to decide
and log routine workflow choices. The earlier pending interpretation in D002 is
historical. No live source-change worker was launched.

Actor selection: GPT-6 Astra, operator-attested ultra (xhigh + workflows), updated
by the operator during execution; effective readback unavailable. Local CLI
version command reports Codex CLI 0.154.0. Entry token/cost counters were
unavailable; handoff token counters became available from the Codex transcript.
Final counters, source, scope and cutoff belong in the ignored usage receipt
and response; dollar cost remains unknown.

Limits: launch arrays specialize observed rows to the declared commands but do
not prove target confinement or correctness. Temporal authorization, worktree
ownership, private-path exclusions, commit-message creation, host diff checks
and episode orchestration belong to the later host/live proof. The fixed profile
keeps exactly three Bash patterns; whether the live worker can satisfy all prompt
instructions under that shape remains WO-053's evidence obligation. The guided
operator-work and local-model experiment write-backs are planning candidates.
