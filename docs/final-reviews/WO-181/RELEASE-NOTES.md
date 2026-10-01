## Release overview

A candidate that passes behavior verification can now be judged a second time, by a reviewer that cannot change it. Until this release the behavior verifier was the only judge, so nobody judged whether a working change stayed inside its contract or followed the repository's declared conventions. A `review` episode now runs after behavior passes, in a fresh process with no tools and no implementer narrative. It reads the sealed candidate, the diff, the contract, the baseline and candidate test rows and a declared conventions file when one exists, and returns typed findings as `ReviewCompleted`. Blocking findings route to the existing bounded repair and a fresh re-verification; `should` and `nit` findings are carried as known items and never authorize a change. This release is for the delivery composition (WO-123), which will sequence the episode, and for operators who read verification matrices.

The release also removes a recurring setup interruption: creating a worktree now installs the lockfile-pinned headless Chromium before it prints the launch handoff, so a new work order no longer reaches its first product gate with the browser missing.

## Read before upgrading

- **No migration for existing streams.** Review is opt-in. A stream opened without `reviewConventionsPath` keeps the verification-only path and dispatches no reviewer, and the existing verification suites pass. Behavior findings keep their severities (`blocking`, `major`, `minor`), and a behavior verifier that returns a `class: review` finding is refused.
- **A reviewed stream ends at `reviewed`, not `complete`.** `state.next` gains `review` and `reviewed`. A consumer that waits for `complete` on a stream opened with review will not see it. `reviewed` is not delivery authorization; `routeReview` decides what happens next.
- **Nothing sequences the review yet.** No shipped flow opens a stream with review; WO-123 composes it. What a composition does when the review episode fails or times out is not decided: the host leaves the command pending with no `ReviewCompleted`, and no fixture pins that ([D012](../../evidence/WO-181/decisions.md#wo-181-d012--verification-board-unrecorded-receipt-036-duties)).
- **A behavior verifier can stop the stream before review.** A verifier that passes every criterion and asks for human attention holds the stream, and the reviewer is not dispatched. Two live Claude verifier attempts did this over the very defects the review exists to judge. The composition must decide how the two episodes divide that judgment ([D014](../../evidence/WO-181/decisions.md#wo-181-d014--final-review-pass-and-three-seams-the-composition-inherits)).
- **Conventions must be declared.** The reviewer cites a conventions rule only from a sealed file that is unchanged between base and candidate. This release creates no conventions file. With `reviewConventionsPath: null` the absence is recorded, and the reviewer judges scope and contract fit only.
- **Worktree creation now needs the browser download.** `npm run worktree -- start` runs the pinned Playwright installer after `npm ci`. A first download needs network access, or `PLAYWRIGHT_BROWSERS_PATH` naming a prepared cache. If the install fails, preparation stops before the launch handoff, the checkout is kept, and the message names `node scripts/bootstrap.mjs` as the retry.
- **Existing worktrees are not changed.** A worktree created before this release keeps its current state. If its browser is missing, run the install command in the browser-evidence README, or `node scripts/bootstrap.mjs` once the worktree carries this release.

## Substantive changes

**The review episode.** The driver opens with `reviewConventionsPath` naming an unchanged sealed file, or `null`. When every criterion is verified and the verifier asked for no human attention, the stream moves to `review` and dispatches a fresh physical episode on the existing sealed host. The request carries the original contract, the pinned diff, the base and candidate snapshots with their host-run test rows, the admitted behavior evaluations and the implementer's episode identities. It carries no implementer prose, and the actor has no tools or write mount. Failed or unverified behavior never dispatches a reviewer.

**Findings.** The finding contract gains `class: review` with severities `blocking`, `should` and `nit`. `expected` holds the rule and `observed` the violation. Each finding must cite a rule source (the contract or the declared conventions file) and an observation source (the diff or a sealed file), name a supplied criterion and keep its surfaces inside the sealed files. `ReviewCompleted` records the subject and base revisions, the reviewer, verifier and implementer episode identities, the conventions source, the findings and their counts. Behavior acceptance rows are unchanged by a review.

**Admission.** A review result carrying `edits`, `patch`, `diff`, `files` or `replacements` is refused with `review cannot return edits or diff`. Behavior verdicts, foreign paths, duplicate findings, a missing rule or observation reference, a convention reference when conventions are absent, and a result produced under a verifier's or implementer's episode identity are refused. A forged or edited `ReviewCompleted` fails replay. A cached review result recovers without another model call, and recovery checks the snapshot's bytes and permissions first.

**Routing.** `routeReview` turns a completed review into one of three results. `RepairAndReverify` gives each blocking finding to the existing `RepairHost` with one round, no new grants, the original criteria and the criterion's already named tests; inspection prose never becomes a command. `DeliverableKnownItems` carries `should` and `nit` findings for the later deliverable body (WO-182) and dispatches nothing. `NeedsHuman` is returned when the reviewer asks for attention or a blocking finding names a path outside the original surfaces, so a scope finding cannot widen repair authority. A review is refused against any revision other than the one it judged.

**Worktree preparation.** Bootstrap runs the checkout's own Playwright CLI with `install chromium --only-shell` after dependencies and before the build. It uses the cache the browser suite selects: `.runtime/playwright` in the new worktree by default, or `PLAYWRIGHT_BROWSERS_PATH` when set, passed through unchanged with the new checkout as the installer's base directory. A repeated bootstrap reuses an installed browser without downloading. A missing browser still fails the browser suite with unavailable witnesses; setup never turns it into a pass.

## Progressive polish

Product 03 §VerificationAdapter names the landed episode in place of the earlier statement of intent, and product 07's bootstrap paragraph and the browser-evidence README describe the automatic preparation. The verification state types moved from `reactor.ts` into `verification.ts` with the existing re-exports, and review construction lives in a new `review.ts`, so the reactor stays inside the feedback capsule's 100,000-character file bound ([D004](../../evidence/WO-181/decisions.md#wo-181-d004)). One WO-055 test double now leaves non-verification results untouched. The console's self-host fixture and the Claude Code harness pins were regenerated for the new component versions.

## Evidence and compatibility

Application `v0.61.0` is a minor release over `v0.60.3`, built from WO-181 on `main` at `0ffccab4`. `@dotln/compiler` moves to 0.22.0 and `@dotln/skeleton` to 0.49.0; `@dotln/console` stays at 0.4.0 with its exact pins updated. `@dotln/kernel` 0.6.0, `@dotln/beacons` 0.1.0 and `@dotln/browser-evidence` 0.1.0 are unchanged, and no dependency was added. The authority, artifact-identity, verification and feedback editions are WO-181 revision 002; the feedback edition rests on one live self-host audit on Codex `gpt-6.1-sol` at `max`.

Live rows on WO-056's synthetic repository, with a behavior-correct candidate carrying one naming defect and one out-of-scope README change: [Codex](../../evidence/WO-181/codex-live-002.json) (CLI 0.159.3, `gpt-6.1-sol` at `max`) and [Claude Code](../../evidence/WO-181/claude-live-004.json) (2.1.286, `claude-opus-5-5` at `xhigh`, after a live Codex behavior verifier) each returned both blocking findings with their rules and left the snapshot unchanged. The reviewer, verifier and implementer identities differ in each. Model and effort are launch selections; effective values are unknown. Two earlier Claude attempts stopped before review because their behavior verifier asked for human attention; their receipts are kept ([D005](../../evidence/WO-181/decisions.md#wo-181-d005), [D006](../../evidence/WO-181/decisions.md#wo-181-d006)).

The [bootstrap proof](../../evidence/WO-181/bootstrap-live-001.json) launched Chromium 153.0.8010.12 with Playwright 1.63.0 in three cases: a cold setup in a new worktree, a cached retry with the download host unreachable, and a second new worktree using an explicit cache with npm offline.

The verification sequence:
- [VER-001](../../verifications/WO-181/VER-001.md) passed. It ran seven review probes and a real bootstrap failure and retry, and matched every runtime-source hash in the final receipts.
- [FINAL-001](FINAL-001.md) passed after integrating `main` and running the product gate on the integrated tree.

`npm test -- --review` passed on the integrated tree at code identity `2022b44f5f607d8f5bfc760285930c9e88bee7a0178df7045c60b90520bf069c`: 40 suites, 0 failed, 893.41 s. `npm run test:docs` passes.

Known limitations:
- The implementer in every review proof is a process double and the repository is synthetic.
- Independence is evidenced by host-assigned episode identities on separate fresh processes; native harness session identifiers are not recorded.
- A structurally valid finding is not proof that the reviewer read the rule correctly; judgment accuracy remains the reviewer's.
- The review document cases run on macOS only.
- A new worktree's first browser download needs a reachable download service unless a prepared cache is selected.
- The composition, the deliverable body, a repository conventions document and the consumption of derived surfaces are later work (WO-123, WO-182, WO-073, WO-124).

Details are in the [evidence README](../../evidence/WO-181/README.md) and the [decisions](../../evidence/WO-181/decisions.md).
