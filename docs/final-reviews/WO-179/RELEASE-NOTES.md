## Release overview

Every DotLn role now starts with the corrections the operator had to give more than once. WO-172's survey found 303 episodes in which the operator corrected a role or told it to record a failure. Twelve of its themes ended in a next step that was one shared sentence or one briefing line, and none had been written. This release writes them into the text each role reads at cold start, in both the Claude Code and Codex roots, with each rule's theme and episodes recorded. It also stops a verifier from rerunning a full product gate that the executor already recorded green at the same code identity: the verifier consumes that row, and `verification-result` refuses a met gate claim that has no row behind it.

## Read before upgrading

- **The verifier no longer runs the product gate by default.** It consumes the executor's passing `npm test` row when the code identity matches, and runs the gate only to reproduce a finding or on a changed identity, saying which. The reviewer still runs its gate.
- **`verification-result` can now refuse.** A verification report that judges a criterion met when that criterion names `npm test` or `npm test -- --review` needs a passing complete row at the current code identity (for `--review`, one covering the current selection). Without it the completion refuses and names the criterion, and nothing is appended. A met `npm run test:docs` criterion makes the completion run the document gate inline. This applies to `pass` and `fail` verdicts alike, and an unreadable gate index stays an advisory.
- **Release close has a ceiling of 21,266 cold-start bytes.** It now measures 17,170 bytes and crossed its former 16,384 ceiling. The dated acceptance in `docs/control/budgets.json` names the rules it carries. Every other role is within its existing ceiling.
- **Versions and evidence.** Skeleton moves to 0.49.2 and harness runtime to 0.34.2, and the console's skeleton pin follows. The authority evidence edition is now WO-179 revision 002, and earlier editions are unchanged. No dependency is added.

## Substantive changes

**Ten rules in every role.** Settle routine version, waiver-route, live-episode, regeneration and reinstall questions within existing authority, and ask only when the answer changes scope or authority. State the aim of an operator message in one line before acting on it. A claim of cause, blocker, unreachable service or finished work names its command and output, and a partial search names its boundary. Request authority through the host permission flow rather than handing the operator a command, unless a named fallback applies. Commands given to the operator are copy-paste runnable, and questions say what they decide. A stale gate row is answered by running the gate at the current identity, never by restoring bytes, and a reviewed fix is never removed to pass a check. A role stops the background monitors it started before recording its result. After a second consecutive provider safeguard refusal, a role stops retrying, records the stop and resumes in a fresh session. A wait on a gate or background task uses its completion signal and does bounded work or stays quiet. `unknown` is written only after naming the source tried, and an unfiled report is corrected in place.

**Briefings.** The verify and final-review briefings say that a repairable defect inside the order's declared surfaces is repaired in the order and may fail a criterion it breaks, while one outside both the criteria and the surfaces is boarded with its reproduction. A question, complaint or stale operator message is not an instruction to stop, narrow or widen the work. A met criterion naming a gate stands on that gate's row or an inline run.

**Release close and executor.** Release close reports a cleanup blocker or host denial once with the exact remedy (`release close --material`, the `!` prefix or a `/permissions` retry). It then finishes what remains without repeating publication, and never moves, copies, deletes or preserves material by its own decision. The executor declares each scratch repository it creates with `npm run worktree -- material` before completion.

## Progressive polish

The execution guide's Adjacent Repair rule now states the same repair boundary as the briefings, and §Discipline carries the routine-question rule, both in place. A new test lowers every Contributor profile to its emitted skills, in both economy settings, and checks that each shared rule appears exactly once in every role along with each role's own assignment. It catches the class of omission the first verification found, where a compact role projection dropped assigned text. The verifier gate-claim fixture covers missing, failed, partial and stale rows, row consumption and the inline document gate.

## Evidence and compatibility

Application `v0.63.1` is a patch release over `v0.63.0`, built from WO-179 integrated onto `main` at `aa770898`. The order was executed on `v0.61.3` (`855450ea`). WO-182 and WO-061 merged meanwhile, and the final review integrated them and retimed the target.

The verification sequence:
- [VER-001](../../verifications/WO-179/VER-001.md) failed criterion 1: the release-close root lacked its blocker/denial remedy and eight shared rules.
- The repair ([D013](../../evidence/WO-179/decisions.md#wo-179-d013--repair-the-emitted-role-assignment-not-only-the-source-table)) fixed the projection and added the emitted-role test.
- [VER-002](../../verifications/WO-179/VER-002.md) passed, re-deriving every assignment from the emitted roots.
- [FINAL-001](FINAL-001.md) passed on the integrated tree.

`npm test -- --review` passed on the integrated tree: 39 suites, 0 failed, 897.62 s, at code identity `005044189e4dd3c32a56b5547f021f6c022cc77777d41089b25198bafa8df6b4`. `npm run test:docs` passes.

Known limitations:
- The rules are instructions, not enforcement. Only the `verification-result` claim check refuses anything. Whether the operator's interventions on these themes fall is not yet measured.
- A worktree's review selection follows the moving `origin/main`, so a sibling's merge can require a full review rerun at an unchanged identity. It fails safe, and it is routed to the next order that edits the runner's selection ([D015](../../evidence/WO-179/decisions.md#wo-179-d015--verification-a-siblings-merge-widens-the-review-selection-at-an-unchanged-identity)).
- The verifier role no longer carries the host-confinement fallback sentences; the runner prints the confined command itself.
- Each role's cold start grew by 1,082 to 1,585 bytes over `v0.63.0`.

Details are in the [decisions](../../evidence/WO-179/decisions.md), the [handoff](../../evidence/WO-179/handoff.md) and the [evidence summary](../../evidence/WO-179/README.md).
