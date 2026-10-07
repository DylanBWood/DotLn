## Release overview

This release lets `dotln vertical` take a GitHub issue to a reviewed pull request without anyone tending it, and records the first witnessed run that shows it. On a personal scratch repository, two issues went from intake to a generated pull request, through the automated reviewer's comments, to a terminal state with every automated item resolved and nothing merged: one scenario ran every episode on Claude, the other every episode on Codex. The visible changes:
- An issue configured with `intake: "model"` is classified by the vertical's own model episode instead of a supplied classification.
- Automated review comments are triaged by a model episode: an inline suggestion is accepted, repaired and re-verified, or rejected with evidence, and its thread resolved; a review summary is acknowledged or left to a human.
- `awaitChecks` makes the vertical wait for named review check runs after the pull request opens, so a reviewer triggered automatically is observed without anyone dispatching it.
- The Codex writer now commits inside Codex's own sandbox, and every source writer's effect on the shared repository is checked before its commit is accepted.

The release is for operators running the vertical on their own repositories and for WO-118, the next proof on that path. It claims no efficiency gain: tokens, cost and human time were not measured.

## Read before upgrading

- **Interrupting a vertical during its writer step is not recoverable yet.** A writer launched by `dotln vertical` keeps running after a Ctrl-C, SIGTERM or closed terminal (WO-112 D060). A writer launched through the vertical records no process group, so after a crash or interrupt the next run seals the issue `refused`, even when the writer finished cleanly (D065). Clearing that run's state by hand is the only way to rerun the issue. Both are boarded follow-ups that the operator passed under `operator override:`; WO-118 should repair them before it relies on stopping and rerunning.
- **The Codex writer has new grants.** It reads its toolchain, the user's Git identity and the shared repository metadata, and writes its own gitdir and the shared `objects`, `refs` and `logs`. It refuses a main checkout and needs a linked worktree. It runs without `--sandbox` so the named `dotln-writer` profile applies; the network stays off. Existing shared object bytes are not protected from it (D033); unexplained ref and alternates changes are refused.
- **The host refuses more.** A source change is refused when the shared repository's refs, symbolic targets or alternates changed during the writer's run, when the effect is not one commit with the host's message, or when recovery cannot establish that the prior writer's process group has ended. The repository must use Git's files ref backend. Unexplained changes are preserved for inspection, never restored over.
- **Stored records are not readable by older releases.** A vertical store may now hold `ReviewBodyJudged` events and baseline assessments whose producer is `double`; an older DotLn refuses such a store. Earlier stores replay unchanged.
- **Judgment episodes cost money on retry.** An intake or triage episode that fails retryably is relaunched with capped backoff; one that fails identically every time, for example by exhausting its $2 budget, is relaunched without a count (D061).
- **`vertical.json` gains two optional fields.** An issue binding may say `intake: "model"` in place of `inferences` and `revisionId`; `awaitChecks` lists distinct check-run names. Existing configurations are unchanged.
- **Component versions.** The skeleton moves 0.53.1 → 0.54.0 and the console pins it exactly. No dependency is added.

## Substantive changes

**Unaided intake and triage.** Intake and triage are tool-less vertical-judgment episodes on the configured worker selection, each under a $2 budget and its own deadline. The host splits the compiler's own undecided gaps into exact spans, and the model returns a class for each; a return that does not judge exactly the spans it was sent, or changes a span the compiler already classed, is refused, and the instructions tell the model that a title or heading is never a non-goal. Discussion by anyone but the issue's reporter is never offered to the model. A triage verdict must cite only evidence it was sent, at least one reference unless it leaves the item to a human, and an accepted item must name the contract criterion it serves. Each verdict is published exclusively and bound to the subject it judged, so a replay reuses it and a changed review body or head is judged again. Supplied classifications and verdicts still win, and an episode run by any transport other than a native model CLI is labelled a double.

**The post-pull-request loop.** After publication the vertical waits, within a bound, for the declared review checks to finish before it observes the review. An accepted inline item is repaired, re-verified against the original criteria and pushed, and its thread resolved; a rejected one gets a reply citing its evidence and is resolved without a change. A review body is acknowledged with evidence or left to a human while the other items finish. One invocation judges at most eight review bodies and then names the unjudged one.

**Source-writer integrity.** Before launch the host persists the test, request, leases, shared refs with their symbolic targets, and alternates. After the writer stops, and again after the host's own test, it compares them; any unexplained difference refuses the episode and is preserved. Host Git runs with replace refs and the commit graph disabled, so a writer cannot hide part of its commit from the host's diff. Native writers run in their own process group, and recovery of an attempt with no saved receipt requires that group to have ended. A saved receipt that matches Git is replayed, including from logs written before this release.

**The resident.** A retryable triage failure defers that continuation with the capped backoff intake already uses, and the resident keeps running. While a continuation is deferred, a tick prepares no draft it cannot admit. A host-side intake fault keeps its reason and is held after three tries instead of retrying forever. Recovering a resolution checkout removes only that checkout's own Git worktree registration.

**Harness and planning.** The host guard observes each repository once per sample, so a repository removed between two reads no longer retires the registration that held its history. The test runner retries a census that missed a held launcher instead of reporting it as the task's exit. The planning gate re-binds a decision corrected in place when a later amendment of the same order and decision exists, and still fails an edit nobody re-bound.

## Progressive polish

The vertical fixtures resolve the real `git` once and refuse to invoke their own double, so nested fixtures no longer recurse until the process group is killed. The entropy worker no longer declares a named Codex profile that its `--sandbox` flag overrode. The vertical suite runs its judgment cases in a second file within the same deadline. The harness bundle and manifest are re-emitted against the new skeleton, the evidence editions are re-minted for the changed sources, the console's self-hosted fixture follows the new feedback edition, and the publication locks are refreshed.

## Evidence and compatibility

Application `v0.68.0` is a minor release over `v0.67.1`, built from WO-112 on `main` at `8218616b`. The skeleton moves 0.53.1 → 0.54.0 and the console's exact pin follows. Compiler, kernel, beacons and browser-evidence are unchanged, and no dependency was added.

The live proof ([receipt](../../evidence/WO-112/README.md)): the representative, issue 3 on Claude, took 389,816 ms over nine native episodes and accepted, repaired and resolved one inline suggestion; the control, issue 4 on Codex, took 185,555 ms over seven episodes and rejected the planted incorrect suggestion with evidence. Both ended `resolved` with nothing merged. The outward lint and a tree scan found no DotLn vocabulary in either pull request, for the declared set.

The verification sequence:
- [VER-001](../../verifications/WO-112/VER-001.md) failed criterion 3: intake classes and triage verdicts were executor-scripted inputs labelled as model judgments. The operator's scope expansion put the missing episodes in the composition, and new runs re-earned parity.
- [VER-002](../../verifications/WO-112/VER-002.md) to [VER-006](../../verifications/WO-112/VER-006.md) failed on defects in the new host integrity checks, recovery and judgment paths, each repaired in turn.
- [VER-007](../../verifications/WO-112/VER-007.md) passed at the operator's override, with D060 boarded.
- [FINAL-001](FINAL-001.md) passed at the operator's override, with D065 and D066 boarded.

A fresh `npm test -- --review` at the reviewed code identity passed 38 of 38 suites with 88 fresh tasks in 1,860 s, and `npm run test:docs` passes.

Known limitations:
- Interrupted or crashed vertical writer steps end the issue `refused` (D060, D065).
- Shared object bytes are writable by the Codex writer (D033).
- Repeated identical judgment failures are retried at full cost (D061); the preparation retry clock is undecided (D053).
- Host admission refusals after a writer's result are recorded as transport failures (D066).
- General reviewer coverage, visual criteria and efficiency are unproven; the proof covers two scratch scenarios.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-112/decisions.md) and the [handoff](../../evidence/WO-112/handoff.md).
