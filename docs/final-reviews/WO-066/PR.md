# WO-066

After DotLn opened a pull request, nothing acted on what came back. WO-065 records the failing checks and review comments, and this pull request lands WO-066, which works through them. `npm run worktree -- resolve-pr --request <file>` takes each unresolved automated review comment or failing check in the latest recorded observation and ends it one of three ways: repaired, verified, pushed and observed resolved; rejected with evidence on its thread; or left for a human with the reason. WO-112 will run the loop live, and WO-123 composes it into the source-to-deliverable vertical.

- **One item at a time, as a persisted program.** Each item runs triage, then repair, push, thread disposition and a fresh observation, and every step is a recorded command and result in the store's `publication/` log. An interrupted run resumes from that log with the same request. The fixture kills the loop after a recorded push and shows one worker launch, one push and one resolve mutation after the resume ([D001](../../evidence/WO-066/decisions.md#wo-066-d001)).
- **The repair is WO-055's.** An accepted item enters `deriveRepairOrder` as a blocking finding whose evidence is the host-recorded item: the comment's id, path and line, or the check's name and its mapped test. It replaces only the verifier's adverse witness. The contract, surfaces, named tests and authority stay the original's, and each item gets one round (`RepairOriginal.roundLimit: 1`). A fresh worker makes the change and the original criteria are verified on the repaired head before anything is pushed.
- **Remote effects need their own operator grant.** The push goes to the branch the recorded `PullRequestOpened` names, under `repo.push`, and refuses a head that does not descend from the recorded one or has no fully verified acceptance matrix. A thread is resolved, or answered with a structured rejection and its evidence references and then resolved, under the new `pr.thread.resolve` effect. Without the grant each refuses before any `gh` call.
- **Resolution is observed, never assumed.** An item is resolved only when a later `observe-pr` event at the repaired head shows the thread resolved or the mapped check passing. A double that returns a resolved flag without a recorded observation ends the item as needing a human.
- **Human control.** A human reviewer's comment is never dispatched or disposed. A comment outside the order's surfaces, a check the mapping does not name and a missing judgment each end as needing a human with the reason. A comment the screen refused stops the loop with a typed stop naming it. `PullRequestReviewLoopStopped` records `resolved`, `needs-human` or `refused`.
- **Triage is supplied.** Accept and reject judgments arrive in the request with evidence references. Here they are labeled doubles; the model episode that produces them belongs to WO-112.

The order also carried three hardening items due before the first target publication.

- **Host Git reads ignore the target's signature settings.** Every Git read the publication host runs in a target's root now sets `log.showSignature=false` and neutralises `gpg.program` and `gpg.ssh.program`, beside the existing hook and fsmonitor overrides. The fixture plants a signature program, shows it running on an ordinary `git log`, and shows it not running during publication.
- **Publication is bound to a named repository.** A target publish request must now carry `repositoryId` as canonical `HOST/OWNER/REPO`. An origin URL that names another repository is refused before any remote call.
- **The focused test runs confined.** The source-change host runs the named test under `sandbox-exec` with the discovery profile, and the Claude writer is admitted only that confined spelling; the raw command is denied. A fixture shows a network connection, a write into the common Git directory and a read outside the worktree each refused, after an unconfined run in which all three succeed ([D003](../../evidence/WO-066/decisions.md#wo-066-d003), [D009](../../evidence/WO-066/decisions.md#wo-066-d009)).

**Read before merging.** Two changes break existing use. A target publish request without `repositoryId` now fails until the field is added. On a host other than macOS the focused test reports `confinement-unavailable` and the writer's confined command cannot be built, so a source-change writer cannot run its named test there.

**Validation.** `npm test -- --review` has a complete passing row at this code identity (39 suites, from the verifier's fresh run; main added documents only, so the final review's run reused it), and `npm run test:docs` passes fresh on the integrated tree. [VER-001](../../verifications/WO-066/VER-001.md) passed all ten criteria with its own reproductions, and [FINAL-001](FINAL-001.md) records this review. The loop's evidence is fixtures over real local Git, a fake `gh` and labeled worker doubles. The only live evidence is the feedback self-host episode and the Claude launch reading, which showed the user settings and project-registry digests unchanged across two launches.

**Known limits, each a recorded follow-up.** These fail closed for the item: nothing is pushed or disposed.

- The loop can stop `resolved` while an item is `needs-human`, when a mapped check is still running on the repaired head. A kill between the observer's append and the stage result makes the resumed item `needs-human` although the observation shows it resolved ([D011](../../evidence/WO-066/decisions.md#wo-066-d011)).
- An accepted automated comment with no line, as the forge reports for an outdated or file-level comment, makes the loop throw at the repair stage and leaves the item pending, so reruns throw again ([D014](../../evidence/WO-066/decisions.md#wo-066-d014), [reproduction](../../evidence/WO-066/final-review-reproduction.txt)).
- Claude's native allowlist rule for the confined command contains wildcards, so the host permission hook is what enforces the exact spelling ([D012](../../evidence/WO-066/decisions.md#wo-066-d012)).
- A rejection reply can be posted twice if the process dies between the reply and its receipt.
- On real pull requests WO-065's screen refuses many bot comments, and one refused comment stops the loop.

Application target v0.57.0, a minor release over v0.56.4. Skeleton moves 0.45.2 to 0.46.0 and the console's pin follows. The authority, artifact-identity, verification and feedback editions are re-minted at WO-066/002, the harness is re-emitted and the console's selfhost fixture is re-pinned. No external dependency is added. The final review restored `source revision guard` to the roadmap's pipeline sentence, which the write-back had dropped.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-30T07:46:30.233Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-117 | 7,286,980 (Δ unavailable) / 3 | 1,762,820 (Δ unavailable) | 4 (Δ unavailable) / 60,947 (Δ unavailable) | 42,707,375 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 3 (Δ unavailable) | 1 (Δ unavailable) |
| WO-086 | 15,692,236 (Δ 8,405,256) / 7 | 1,554,281 (Δ -208,539) | 4 (Δ 0) / 80,694 (Δ 19,747) | 127,809,215 (Δ 85,101,840) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -2) | 4 (Δ 3) |
| WO-172 | 55,766,398 (Δ 40,074,162) / 11 | 4,036,347 (Δ 2,482,066) | 3 (Δ -1) / 28,017 (Δ -52,677) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 5) | 15 (Δ 11) |
| WO-087 | 5,168,783 (Δ -50,597,615) / 3 | 376,615 (Δ -3,659,732) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 13,325,126 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -6) | 1 (Δ -14) |
| WO-057 | 4,030,373 (Δ -1,138,410) / 3 | 409,734 (Δ 33,119) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 4,032,819 (Δ -9,292,307) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ -1) |
| WO-066 | 8,485,692 (Δ 4,455,319) / 2 | 1,378,543 (Δ 968,809) | 4 (Δ unavailable) / 53,758 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-066/executor | 7,084,369 (4,981,824) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-066/verifier | 1,401,323 (418,624) | 291,006 (unavailable) | 128 (unavailable) | 18,044,670 (unavailable) | 190 (unavailable) | unavailable (unavailable) / unavailable |
| WO-066/reviewer | 8,734 (-936,395) | 161,129 (unavailable) | 32 (unavailable) | 86,097 (unavailable) | 50 (unavailable) | unavailable (unavailable) / unavailable |
| WO-066/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-066/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-066/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
