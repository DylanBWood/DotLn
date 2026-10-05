## Release overview

This release composes DotLn's delivery primitives into one continuation that carries a filed intent from its issue to a pull request. The resident admits a filed intent on its own when a standing `intent` portfolio entry and admitted operator grants cover it, records why that authority supersedes the draft's human-review constraint, and dispatches the first step with no command. `dotln vertical ISSUE --store DIRECTORY` runs the same persisted continuation on demand. Both entries share one admission ledger and budget, resume from durable receipts after a restart or kill, and stop with the step named when anything fails. The composition is proven with external actor doubles and local bare remotes; the live proof is WO-112's.

The release is for operators who run the resident or want a single command from issue to pull request, and for the orders that build on it (WO-112, then WO-118).

## Read before upgrading

- **A new store input.** Both entries read a reviewed `vertical.json` beside `resident.json`. It binds the registered target, forge selector, phase, worktree parent, surface profile, worker transport, model and effort, and for each issue its exact source revision, StoryContract inferences and a reviewed `baselineAssessment`. The skeleton README's §Vertical continuation documents every field.
- **Baseline meaning is supplied, not inferred.** Each executable statement needs a judgment of `existing-failure`, `no-existing-failure` or `unresolved`, bound to the compiled contract and statement identities. A missing or unresolved judgment stops at `baseline` before any snapshot, worker or remote effect. A stale or malformed one holds at `contract`. The runtime parses no English and selects no classifier; a judgment's accuracy is its producer's.
- **The `intent` portfolio class.** A portfolio with `"class": "intent"` declares a registered target with an authority profile (never `self`), the surfaces ceiling, the phase envelope, the budget and exact test commands under `verification.intent`. Remote effects need matching operator grants that contain only remote effects. Existing discovery portfolios decode unchanged.
- **Four resident event types.** The resident log gains `IntentAdmitted`, `IntentHeld`, `IntentStepStarted` and `IntentStepSettled`. A hold is permanent for its filed draft: correct the input and file a new intent.
- **One entry, one draft.** An issue entry without `draftId` selects the one filed draft that references its issue and that no other entry names. When two such drafts exist, the resident holds each undecided one and the command refuses; file a new draft and bind it with `draftId`.
- **Configuration is read with care.** `target` and `worktreeParent` in `vertical.json` must be the directory's physical identity, so an alias spelling is refused when the file is read. A running resident reads `vertical.json` once at start; restart it after editing the file. A target that cannot be read leaves a draft undecided and retried, not held.
- **Path identity is checked before containment.** The source-change guards and the beacon directory guard refuse a path whose spelling differs from the filesystem's identity by letter case, volume alias or Unicode form, and an unreadable identity. The source-change host checks before `git worktree add`, so a refusal leaves no worktree, branch or registration. The beacon guard also refuses symbolic-link aliases such as macOS `/tmp`, which it used to resolve. A read-only beacon sweep refuses only the offending row and names its directory.
- **Smaller behavior changes.** A bounded behavior repair now commits with `fix: address verified behavior finding` instead of `Repair` followed by the finding id. `publishTargetOrder` gains a `preview` option that stops before any lock, push or pull request; its default is unchanged.
- **Component versions.** The skeleton moves 0.52.3 → 0.53.0 and the beacons 0.1.0 → 0.1.1, and the console pins the skeleton exactly. The compiler stays at 0.25.2. No dependency is added.

## Substantive changes

**Admission under standing authority.** `admitIntent` is pure: it decodes the draft, the portfolio entry and the grants, screens the bound issue with WO-060's screen, compiles the contract, derives surfaces with the default threshold and returns an accepted binding or `NeedsHuman` with the reason. The binding's envelope is the intersection of the portfolio, the phase and the grants. The resident records the decision before materializing the executable order or invoking anything; an uncovered, over-ceiling, ambiguous or undecodable input records `IntentHeld` and dispatches nothing. An unavailable forge, an issue edited during the read or an unclean target leaves the draft undecided and retries it with backoff while later drafts take their turn.

**One continuation, fourteen steps.** The continuation runs bundle, contract, surfaces, derived order, baseline, source change, witnesses, verification, review, preparation, lint, publish, observation and resolution, writing one receipt per step under the derived order's identity. A restart or a kill after any durable step resumes at the next step without repeating an effect; a missing receipt projection is restored from its event. The operator and resident entries converge at the accepted binding and its `VerticalOpened` record.

**The composition's own decisions.** The baseline takes the story class from the supplied judgments and records the class and its source; a primitive that classes a failing contract new is a finding, and a defect that does not reproduce stops `NeedsHuman`. A failed review gets one fresh attempt, and a second failure stops with nothing published. Before publication the run writes `delivery-preparation.json` from the contract's open decisions and the host-run evidence of the order's named tests, and publishes only with the deliverable-ready requirement.

## Progressive polish

Product 07 §Derived work and intent describes the admission, the command and the judgment input, and §Declaring a portfolio describes the `intent` class. Product 03 §Operator-presence policy describes the resident's admission, scheduling and return behavior. The skeleton README documents the store inputs, the judgment schema, the hold and recovery rules and the evidence limits. The new `vertical` suite covers admission and its holds, both entries, restarts and real `SIGKILL` at every durable step, typed stops, readiness tampering, review retry, the judgment states and the path variants.

## Evidence and compatibility

Application `v0.67.0` is a minor release over `v0.66.3`, built from WO-123 integrated with `main` at `c44ba6c6`. The skeleton moves to 0.53.0 and the beacons to 0.1.1; the compiler and kernel are unchanged.

The verification sequence:
- [VER-001](../../verifications/WO-123/VER-001.md) to [VER-004](../../verifications/WO-123/VER-004.md) failed on criterion 5. Each found ordinary bug-report wording that the lexical baseline classifier classed new and walked to publication.
- The fourth repair replaced the classifier with reviewed, source-bound judgments, and [VER-005](../../verifications/WO-123/VER-005.md) passed.
- [FINAL-001](FINAL-001.md) passed after the final review integrated `main` and, under the operator's direction, fixed seven defects it reproduced. Among them: two filed drafts for one issue ran twice, the judgment order depended on the host locale, a kill during launch could still start a child, and an unreadable target became a permanent hold. Read-only reviewer subagents checked the fixes.

The final `npm test -- --review` and `npm run test:docs` pass at the reviewed subject, and the feedback evidence was re-minted from a fresh live audit after the last judged-source edit.

Known limitations:
- The composition uses external actor doubles and local bare remotes; no live target run happened (WO-112).
- WO-112's and WO-118's producers must supply `baselineAssessment`; until they do, their runs stop at baseline (FUP-faae1df8f1022634).
- The Claude writer's confined test command can still write `.git` and `claude.local.md` (WO-184 D038 G1, found by code reading); prefer `codex-cli-exec` workers for live runs until that row is settled.
- An external effect that succeeds before its receipt is durable is outside completed-step recovery.
- Retry backoff and the set of finished continuations are process memory.
- Under a `kill` return policy, an operator's return ends the in-flight continuation as `refused` with a host-failure reason; the intent must be refiled.
- A kill between the resolution repair's `git worktree add` and its removal can leave a worktree registration in the target.
- Path-identity evidence covers one case-insensitive APFS volume.

Details are in the [decisions](../../evidence/WO-123/decisions.md) and the [handoff](../../evidence/WO-123/handoff.md).
