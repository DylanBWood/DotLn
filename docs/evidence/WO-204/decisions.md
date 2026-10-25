# WO-204 decisions

## WO-204-D001 — Reproduce the shared-object boundary before changing it

```json
{
  "id": "WO-204-D001",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Execute the selected source-writer containment order in its existing worktree. Preserve unrelated entry records. Use the planned detached worktree and private object store, with host import after admission. Claude's exact Bash allowlist and the emitted outside-write permission hook remain its mechanism; Codex loses shared objects, refs and logs write grants.",
  "evidence": [
    "Canonical status selected active WO-204, and the next dispatch reserved this session as its writer.",
    "Before implementation, the retained WO-112 shared-object-counterexample.mjs reproduced candidate acceptance with the independent sibling blob missing; bounded exit 0, 1.850 seconds, 2026-10-25T01:29:57.824Z.",
    "The new process-level sibling-blob case failed for the base Codex grants: Missing expected rejection. Its deletion occurs inside the writer process under a sandbox-exec profile derived from the emitted grant arguments. The Claude control passed through the emitted permissions hook. Bounded run: one pass, one expected failure, 4.232 seconds, 2026-10-25T01:31:18.700Z.",
    "The new real dotln vertical CLI case passed at the base: killed writer leaves pending source-change, exits 1, and the rerun resolves with two attempts under one command and exactly one commit; bounded 9.982 seconds, 2026-10-25T01:31:46.558Z.",
    "Source reads: source-change-worktree.ts sharedState inventories refs and alternates, not object bytes; worker-transport.ts grants shared objects, refs and logs; WO-112-D033 and the order's Design compare the two object-authority choices."
  ],
  "rejected": [
    { "option": "Files-only writer with a host-owned commit", "reason": "It removes shared-object authority but also moves attribution, commit protocol and interruption recovery into the host. The planned private store retains those contracts and costs one bounded import." },
    { "option": "Inventory every shared object", "reason": "Repository-size scans cannot prevent damage and compete with legitimate repacking." },
    { "option": "NoOp", "reason": "The retained and new process-level counterexamples demonstrate the unfixed boundary the operator explicitly scheduled." }
  ],
  "reopenWhen": "The private-store import proves unsound in a required case, or a live transport cannot enforce the planned object authority. The files-only alternative is reconsidered then."
}
```

The regression's Codex access is a macOS Seatbelt emulation of the emitted
filesystem write roots, not a live Codex qualification. The Claude control
invokes its emitted permission hook before the attempted Write. The live
probes remain separate obligations. Both use synthetic repositories only.

## WO-204-D002 — Preserve recovery while refusing surviving command grants

```json
{
  "id": "WO-204-D002",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Attempt both ordinary owned-file removals independently and tolerate absence. Record each survivor with its path and error code, and record successful revocation as CommandGrantsRevoked. Settlement, the worker result or interruption, and integrity precede that cleanup outcome. A surviving grant returns a typed command-route-live refusal naming its paths while leaving the command pending; a restarted host repeats cleanup before admission. Terminal SourceChangeRefused remains reserved for adjudicated candidates, including writer requests.",
  "evidence": [
    "source-change-command.ts originally unlinked profile then route without absence tolerance.",
    "source-change-host.ts originally called cleanup before the catch path's integrity and WorkerInterrupted records.",
    "source-change-state.ts rejects a SourceChangeObserved event after any SourceChangeRefused. Sealing a cleanup failure there would make the order's required restart admission impossible without adding a new source-slice state.",
    "The order requires persistent cleanup failures to refuse, restart to remove survivors before admission, and no new state in the source-change slice."
  ],
  "rejected": [
    { "option": "Mark commands revoked before removal or swallow errors", "reason": "A live grant could reach admission or after-testing." },
    { "option": "Only check whether the profile exists", "reason": "It misses persistent route failures and loses independent removal evidence." },
    { "option": "Seal cleanup failures as terminal SourceChangeRefused", "reason": "That prevents the required recovery and would force a new replay-state transition." },
    { "option": "Retry removal silently in finally", "reason": "It hides which cleanup outcome barred the current invocation; the recorded restart owns the retry." }
  ],
  "reopenWhen": "A consumer needs to distinguish retryable host cleanup from its generic refused outcome, or a surviving grant is observed after a successful revocation record."
}
```

The failure modes to avoid are an apparent cleanup success that retains
authority, an interruption without its integrity evidence, and a recovery
rule that makes the operator discard a candidate. The pending command and
explicit cleanup records address those traps; a no-op leaves all three.

## WO-204-D003 — Bind detached source writers to the live host route

```json
{
  "id": "WO-204-D003",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "In a target hook only, use the destination branch from the validated live launchpad command route for a detached source writer's exclusive reservation. Keep the compiled writer predicate and ordinary detached-checkout refusal unchanged. The grant must match the private store's branch and base, target, live host PID, expiry, profile and message. Adjacent queue item adjacent-0001 completed within the source host and harness guard paths.",
  "evidence": [
    "The ordinary Claude fixture failed after the private-store change with DOTLN_TARGET_REFUSED: compiled feedback refused target effect. writerIsolationFacts returned detached HEAD before reserving a writer.",
    "Bounded node --test --test-name-pattern=WO-204-target-writer packages/skeleton/dist/test/source-change-host.test.js passed: missing, expired, branch-mismatched and base-mismatched routes denied; a valid route admitted the source writer; a second session denied; the Claude source change was observed. Exit 0, 4.294 seconds, cutoff 2026-10-25T01:47:53.168Z."
  ],
  "rejected": [
    { "option": "Permit every detached worktree", "reason": "That removes the existing named-worktree admission constraint without a host-bound episode." },
    { "option": "Restore a shared branch before the writer runs", "reason": "That restores the shared-ref authority the private store is intended to remove." },
    { "option": "NoOp", "reason": "The required ordinary Claude source episode cannot run." }
  ],
  "reopenWhen": "A detached source writer without a matching live host route is admitted, or the target guard's branch fact is needed by a consumer that requires a physically checked-out branch."
}
```

## WO-204-D004 — Import a protected pack before publishing the episode branch

```json
{
  "id": "WO-204-D004",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Keep the writer detached with a private object directory and the shared store as a read-only alternate. Pack the admitted candidate with the private reader, then index it with a shared-store writer whose object-directory environment is cleared. Protect the imported pack with an owned keep file until the branch exists; verify every candidate object and its tree before and after the ref update. Preserve the private store through receipt persistence and reuse the same CandidateImported record on recovery.",
  "evidence": [
    "Git's current git-index-pack documentation says --stdin writes the pack to the current repository and --keep protects it against a concurrent repack until a ref can make its objects reachable. The git environment documentation identifies GIT_OBJECT_DIRECTORY as the write store and alternates as read sources; retrieved through Context7 /git/htmldocs.",
    "The bounded private-store and recovery cases passed for both transports: before import the detached candidate was readable only from the private store, shared refs were unchanged, and host verify, clean and effect reads succeeded. SIGKILL before and after import recovered with one writer dispatch, one CandidateImported record, one branch reflog entry and identical retained pack bytes. Cutoff 2026-10-25T01:49:48.975Z.",
    "The strengthened sibling-object tests reached the attempted deletion after committing, and both transport mechanisms refused it while preserving the independent blob. Same bounded run and cutoff.",
    "The maintenance cases first exposed Git's safe refusal before import: gc --prune=now and repack -ad exit 128 because worktrees/<episode>/HEAD names a private commit. No shared object was lost. After import both commands succeed. The corrected cases assert the observed refusal, preservation of baseline and candidate objects, verification around publication, and successful maintenance after publication. Bounded 11-case configuration, maintenance and verification run: exit 0, 22.238 seconds, cutoff 2026-10-25T01:52:08.310Z."
  ],
  "rejected": [
    { "option": "Import directly with the writer's environment on both sides", "reason": "The destination would still be the private store." },
    { "option": "Leave the imported pack unprotected until the branch update", "reason": "Concurrent maintenance could prune an unreachable imported candidate." },
    { "option": "Hide or temporarily rewrite the registered worktree HEAD during maintenance", "reason": "That changes candidate identity and interruption recovery, beyond the required no-object-loss boundary." },
    { "option": "NoOp", "reason": "The original writable common object store permits the reproduced sibling damage." }
  ],
  "reopenWhen": "An import loses objects or fails to preserve the admitted tree, or uninterrupted shared maintenance while a private HEAD exists becomes a required workflow. The latter needs a separate registration or store design; the files-only writer remains the alternative if private import proves unsound.",
  "followup": "Keep shared gc/repack available while a detached source writer's HEAD names private objects. Today both commands safely return 128 until host import, then succeed; qualify a design that preserves the candidate and recovery identity without exposing private objects to the writer's shared-store authority."
}
```

The order's maintenance criterion is object preservation and verification,
not successful maintenance before import. The tests retain the observed
nonzero exit explicitly; they do not relabel it as a passing maintenance run.
The tracked follow-up owns that availability limitation.

## WO-204-D005 — Neutralize auxiliary Git writes and honor writer requests

```json
{
  "id": "WO-204-D005",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Set rerere.enabled=false and maintenance.auto=false through exactly two GIT_CONFIG pairs in both writer launch environments, replacing inherited GIT_CONFIG entries. Keep the commit command, Claude's exact allowlist and Codex's remaining grants unchanged; packed-refs.lock remains ungranted. Treat status other than completed or requiresHuman as the durable writer-requested-attention refusal after integrity and worktree checks, before effect admission or import; the vertical maps this refusal to NeedsHuman and exposes only the typed episode, status and requiresHuman fields.",
  "evidence": [
    "Before the pairs were added, the bounded reproduction failed both desired assertions: Codex's commit exited 128 with the common directory read-only; Claude's commit exited 0 but created rr-cache and started one maintenance child. The config-free Codex control also exited 128. Exit 1, 0.684 seconds, cutoff 2026-10-25T01:51:17.400Z.",
    "After the pairs were added, both commits exited 0 with no rr-cache or maintenance child. Removing the pairs from the Codex table retained the exit-128 control. Canonical shapes pin the private store, no common-store write grants, both object variables and the two pairs; the Claude capture rejects inherited extra pairs. The 11-case bounded run passed at 2026-10-25T01:52:08.310Z.",
    "Before the hold rule, the new Codex commit-blocked case was incorrectly observed and imported. Bounded expected failure: exit 1, 2.589 seconds, cutoff 2026-10-25T01:53:02.336Z."
  ],
  "rejected": [
    { "option": "Grant rr-cache, packed-refs.lock or the common directory", "reason": "It restores shared mutation authority and does not contain detached maintenance." },
    { "option": "Put -c arguments into the commit command", "reason": "That changes Claude's exact allowlist and the writer protocol unnecessarily." },
    { "option": "Supersede a writer's request from its summary", "reason": "Prose supplies no typed fact by which the host can decide the request was answered." },
    { "option": "Add a new resumable held state", "reason": "The existing refusal is durable and every consumer already stops on it." },
    { "option": "NoOp", "reason": "The executed controls reproduce auxiliary shared writes and admission despite an explicit request." }
  ],
  "reopenWhen": "A typed field lets the host verify and resolve the cause of a writer's request, or a consumer must resume that same held episode after an operator answer."
}
```

## WO-204-D006

```json
{
  "id": "WO-204-D006",
  "date": "2026-10-25",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.98.0, the next minor above the observed release baseline v0.97.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.97.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-204-source-writer-cleanup-revocation.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-204-D007 — Stop the repeated provider-refusal loop

```json
{
  "id": "WO-204-D007",
  "date": "2026-10-25",
  "dispatch": "resume: next; operator reports four repeated provider safeguard refusals and requests a different approach",
  "decision": "Stop this Astra executor run without another attempt at the blocked probe. Preserve the unfinished implementation and resume in a fresh supported session. No implementation-ready event or passing gate is claimed. The selected work order remains active.",
  "evidence": [
    "The operator reported three consecutive content-withheld messages naming Daybreak availability for Astra, then reported a fourth. These are operator reports; this record does not infer undisclosed safeguard reasons.",
    "The executor skill requires stopping after two consecutive provider safeguard refusals, recording the phase and model, and resuming in a fresh session. The current role is executor, phase active, model gpt-6-astra at max, CLI 0.164.0 by session readback. Continuing after the reported threshold was an execution error.",
    "OpenAI Help Center article 20001326 recommends limiting a permitted request to the defensive outcome and necessary context. Article 20001258 says Daybreak Blue reduced refusals support GPT-6 Sol and GPT-6 Luna, while Astra and GPT-6.1-Sol retain standard safeguards under Blue. Account approval and enabled access remain unverified.",
    "Latest completed integrity and qualification-helper run: 26 tests passed, bounded exit 0, 67.248 seconds, cutoff 2026-10-25T02:08:37.983Z. The retained vertical recovery probe passed, bounded exit 0, 6.849 seconds, cutoff 2026-10-25T02:09:05.117Z.",
    "Two Codex sandbox attempts allowed add and commit, refused the three forbidden writes, and recorded network EPERM versus an unsandboxed timeout. Both failed the required denial-reader calibration; no live writer episode has run. A diagnostic showed that the installed CLI prints concise denial lines of the form (process) operation path, which the original parser does not accept. The unified-log reader still needs qualification.",
    "Two fresh read-only workers ran on gpt-6.1-sol/max with no descendants. The criteria adversary returned two findings and the design improver one. No reviewer wrote files or ran probes. The private-object integrity concern has not yet been executed or repaired; the authority-probe fixture must be migrated to the new detached/private-store contract. The preparation-interruption concern overlaps the existing documented inspection boundary and requires an explicit disposition, not an invented passing check.",
    "Release preparation assigned v0.98.0 in D006. The changed skeleton component is staged at 0.69.0, with the console dependency and lockfile aligned; the new object authority and attention refusal justify the minor impact. The release parser requires a period after the minor classification; only that metadata and its line wrapping were corrected."
  ],
  "rejected": [
    {
      "option": "Repeat the same blocked attempt",
      "reason": "The operator has reported four refusals and the executor stop rule already applies."
    },
    {
      "option": "Reroute the blocked content through another worker without resolving the access and task boundary",
      "reason": "A different worker is not evidence that the request has appropriate access or that a safeguard no longer applies."
    },
    {
      "option": "Mark the order implementation-ready",
      "reason": "Live qualifications, review repairs, evidence remints and the complete/document gates remain outstanding."
    }
  ],
  "reopenWhen": "A fresh supported session resumes the authorized defensive implementation with the operator-selected model and appropriate account access. It must recheck current commands, writer ownership and the worktree before continuing; do not replay the prior dispatch blindly."
}
```

## WO-204-D008 — Requalify the live denial reader after the first Codex episode

```json
{
  "id": "WO-204-D008",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Use the second and final permitted Codex writer episode after changing the unified-log reader to retain only denials under the scratch target. Keep the first episode's successful writer and host observations as evidence, but do not count it as a passing qualification because its denial reader was unavailable. Record the reader's overflow and termination facts if the second attempt fails.",
  "evidence": [
    "The first real Codex episode on CLI 0.164.0 ran gpt-6.1-sol/max, recorded one git commit -F exit 0, a completed writer with requiresHuman false, a private-only candidate, CandidateImported before SourceChangeObserved, and focused after-test exit 0. Its record reports denials.available false, so criterion 22 is still unmet (codex-writer-qualification.json live episode 1, 2026-10-25T03:13:29.745Z).",
    "The first reader buffered an unfiltered global unified-log stream with a 32 MiB cap and did not record whether it overflowed. Overflow is a plausible cause, not an observed fact. The revised reader parses each line as it arrives and retains only the scratch target's paths, with bounded partial-line and row counts.",
    "The installed CLI's --log-denials control lines use concise (process) operation path syntax. The project's sandbox phase passed only after its independent reader used the Codex source's stream predicate for the kernel and com.apple.sandbox.reporting streams; the calibrated three write controls appeared in both sources. Source: https://github.com/openai/codex/blob/main/codex-rs/cli/src/debug_sandbox/seatbelt.rs (read 2026-10-25)."
  ],
  "rejected": [
    { "option": "Treat the first episode as a pass", "reason": "The required reader observation was unavailable." },
    { "option": "NoOp", "reason": "It leaves the live transport qualification unresolved despite the first episode's otherwise passing observations." }
  ],
  "reopenWhen": "The bounded reader remains unavailable or reports a repository denial other than packed-refs.lock; stop at the two-episode budget and record the actual cause."
}
```

## WO-204-D009 — Correct the probe setup before the final writer episode

```json
{
  "id": "WO-204-D009",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Preserve the failed second invocation as a probe setup failure, not a writer episode. Remove its premature worktree preparation; let SourceChangeHost create the worktree, then attach the reader to the target paths when SourceChangeProcessStarted is recorded. Use the remaining second live episode only after this correction.",
  "evidence": [
    "The failed invocation recorded no SourceChangeProcessStarted, no WorkerAttemptStarted and no usage; codex-writer-qualification.json preserves it under live.setupFailures with attemptedEpisode 2. Its failure kind was Error and no error message was saved, so the exact thrown text is unknown.",
    "The probe had called host.tree.prepare() before host.run(). SourceChangeHost.run() calls tree.assertUnused() before it prepares a new request, and SourceChangeWorktree.assertUnused() rejects an existing path. This is the source-backed explanation for the setup failure; no writer process was launched.",
    "The corrected probe starts the log reader with the known scratch and worktree paths and adds the Git directory and private store paths on SourceChangeProcessStarted. The record was corrected before filing: the zero-attempt invocation remains visible under setupFailures while the two-episode writer budget counts only launches. Irrelevant OS preference paths were removed from the sandbox attempts without changing their pass/fail facts."
  ],
  "rejected": [
    { "option": "Count the setup failure as a live writer episode", "reason": "No writer process started, so it did not test the launch environment or consume a model episode." },
    { "option": "Hide the invocation", "reason": "It is an execution mistake and must remain visible in the evidence record." },
    { "option": "NoOp", "reason": "The premature preparation would fail before every later writer launch." }
  ],
  "reopenWhen": "The corrected invocation still fails before SourceChangeProcessStarted or the final live episode fails criterion 22; stop and record that cause without an additional writer episode."
}
```

## WO-204-D010 — Codex writer requalified at the installed CLI

```json
{
  "id": "WO-204-D010",
  "date": "2026-10-25",
  "dispatch": "resume: next; live Codex qualification",
  "decision": "Accept the second live Codex episode as the installed-CLI requalification of the private-store writer and narrow Git grants. Keep the first episode and the setup failure in the probe record. The passing sandbox and live records answer WO-112-D017's reopening at CLI 0.164.0 only.",
  "evidence": [
    "codex-writer-qualification.json sandbox passed at CLI 0.164.0: add and commit exited 0, the configuration-free commit exited 128, three synthetic forbidden writes were denied, network returned EPERM where its unsandboxed control timed out, and the live unified-log reader matched all three deliberate --log-denials write controls (2026-10-25T03:12:23.062Z).",
    "The second real Codex episode ran gpt-6.1-sol/max and passed in 47.554 seconds: one git commit -F command exited 0, the candidate was private-only before import, the host recorded CandidateImported before SourceChangeObserved, the focused after-test exited 0, and the calibrated reader found one expected packed-refs.lock denial and no other repository denial (2026-10-25T03:16:30.792Z).",
    "The live transport usage callback reported 136535 total tokens, including 116864 cached input and 1212 output; dollar cost was unavailable. All stored paths are relative tokens, and the first failed reader episode remains visible."
  ],
  "rejected": [
    { "option": "Grant shared refs, objects, logs, rr-cache or packed-refs.lock", "reason": "The live writer committed without those grants; granting them would restore shared mutation authority." },
    { "option": "NoOp", "reason": "The earlier live Codex writers reported commit exit 128, which this qualification now resolves at the installed CLI." }
  ],
  "reopenWhen": "An installed CLI upgrade changes grant interpretation, a live writer's commit fails, or the calibrated reader observes a repository denial beyond packed-refs.lock."
}
```

## WO-204-D011 — Claude writer requalified with the private store and Git configuration

```json
{
  "id": "WO-204-D011",
  "date": "2026-10-25",
  "dispatch": "resume: next; live Claude qualification",
  "decision": "Accept the installed Claude writer's first live episode as requalification of its launch environment. The exact command allowlist remains in force; the private object variables and the two Git configuration pairs carry the writer's commit without shared Git mutations.",
  "evidence": [
    "claude-writer-qualification.json passed on Claude CLI 2.1.310, claude-opus-5-5/xhigh, in 32.625 seconds (2026-10-25T03:17:14.835Z). The committed candidate was readable only through the private object store at afterResult, before host import.",
    "After a 1000 ms settle interval, the shared Git snapshot had no changed path outside the writer's own administrative directory and no rr-cache. The host recorded CandidateImported and SourceChangeObserved, with the focused after-test exiting 0; the writer returned completed without requiresHuman.",
    "The Claude result envelope reported 79597 total tokens and USD 0.1503556, below the launch's USD 3 cap. The record contains no home-directory path."
  ],
  "rejected": [
    { "option": "Keep Claude's previous ambient Git configuration", "reason": "The executable pre-change control created rr-cache and started maintenance on a writable shared directory." },
    { "option": "Expand Claude's Bash allowlist", "reason": "The existing exact commit command passed; adding a git -c override would weaken the configuration boundary." },
    { "option": "NoOp", "reason": "The private-store and configuration changes altered the launch environment and owed live requalification." }
  ],
  "reopenWhen": "A later CLI changes how its Bash tool inherits the launch environment, or a live writer creates rr-cache, maintenance output or shared objects before host import."
}
```

## WO-204-D012 — Update the authority research fixture to the detached writer contract

```json
{
  "id": "WO-204-D012",
  "date": "2026-10-25",
  "dispatch": "resume: next; focused harness-probe failure",
  "decision": "Create the authority research fixture's linked target detached and give it the host's recorded private object store. Preserve the matrix's existing local-push and workflow questions; the explicit push still targets refs/heads/probe.",
  "evidence": [
    "The focused test-authority-probe.mjs run had 25 passes and one failure: sourceChangeCommandEffect could not validate its old checked-out probe branch under the new private-store route (bounded exit 1, 12.544 seconds, 2026-10-25T03:17:48.577Z).",
    "scripts/lib/authority-probe.mjs previously created that worktree with -b probe and no dotln-source.json. SourceChangeWorktree and sourceChangeGrant now require a detached worktree with a recorded private store.",
    "After creating the fixture with --detach and prepareSourceObjectStore, the named real target guard test passed (bounded exit 0, 0.913 seconds, 2026-10-25T03:18:38.709Z)."
  ],
  "rejected": [
    { "option": "Relax sourceChangeGrant for the old fixture", "reason": "That would admit a checked-out branch without the production source writer's private-store binding." },
    { "option": "NoOp", "reason": "The declared harness-probe suite would remain red." }
  ],
  "reopenWhen": "The complete harness-probe suite or a later live authority matrix finds that this fixture change altered a question rather than only its source-writer route setup."
}
```

## WO-204-D013 — Give future executor review workers distinct briefs

```json
{
  "id": "WO-204-D013",
  "date": "2026-10-25",
  "dispatch": "resume: next; operator correction during executor self-review",
  "decision": "Permanently separate the two executor worker briefs. The criteria adversary owns counterexamples, criterion verdicts and missing regression tests. The design improver owns simpler structure, coupling, error handling and maintainability. Transfer cross-lane discoveries instead of asking both workers to duplicate a review. Mint a new linked role oracle for both harness roots and economy-support settings; leave historical snapshots byte-exact.",
  "evidence": [
    "The operator reported overlapping reviewer roles across four work orders and explicitly requested a permanent workflow correction.",
    "This order's initial worker briefs both invited a broad review; both workers independently identified the private-object shadowing attack before their roles were narrowed. The criteria worker then focused on attacks and acceptance coverage, and the improver focused on design and maintenance.",
    "packages/skeleton/src/loadouts/contributor.ts is the authoritative generated executor role source; docs/product/07-execution-guide.md describes the procedure. The updated role and its executor-supports assertion name nonoverlapping scopes."
  ],
  "rejected": [
    { "option": "Clarify only the two live workers", "reason": "That would leave the same ambiguous instruction for every future executor session." },
    { "option": "Edit only generated SKILL.md files", "reason": "The next harness emit would overwrite the correction." },
    { "option": "Rewrite a historical role oracle", "reason": "It would erase the byte-exact record of the previous instruction." }
  ],
  "reopenWhen": "A later executor still gives overlapping briefs or the linked role oracle cannot verify both generated roots."
}
```

## WO-204-D014 — Verify private object bytes before semantic admission

```json
{
  "id": "WO-204-D014",
  "date": "2026-10-25",
  "dispatch": "resume: next; criteria adversary finding",
  "decision": "Run strict Git fsck on the candidate graph with the private object directory as primary before semantic admission in SourceChangeWorktree.verify. A hash-mismatched private object returns the typed private-object-integrity admission refusal, before import or branch publication. Name the candidate head explicitly so unrelated shared refs do not enter the check.",
  "evidence": [
    "Both read-only workers independently found that a private loose object can shadow a shared object under the same OID; the private reader then sees the forged bytes while import excludes base-reachable objects.",
    "A bounded synthetic Git probe showed --no-full --strict fsck succeeds on the clean private store and fails after shadowing a shared OID with different bytes.",
    "The new process-level test plants a pre-existing shared malicious test blob, amends the candidate to reference it, forges the private base tree under its original OID, and shows the private diff reports only fixture.txt. Host admission then refuses private-object-integrity, with no CandidateImported, SourceChangeObserved or branch. Targeted test exit 0, 1.402 seconds.",
    "The first full source-host run had 95 passes and one failure: bare fsck also judged an intentionally invalid independent shared symbolic ref in WO-112 F1. An isolated Git probe showed bare fsck exits 2 for that ref while fsck with an explicit HEAD exits 0. The corrected candidate-head invocation passed both the private-shadow attack and the independent-ref case in a bounded two-case run, exit 0, 8.847 seconds, 2026-10-25T03:39:18.861Z."
  ],
  "rejected": [
    { "option": "Trust only the candidate tree OID after import", "reason": "That does not compare private base objects with the trusted shared base used after import." },
    { "option": "Compare only declared diff paths", "reason": "The forged base tree is specifically constructed to hide an out-of-surface candidate path from that diff." }
  ],
  "reopenWhen": "A private object store passes strict fsck while an object under an existing shared OID returns different bytes, or the check causes a valid private candidate to fail."
}
```

## WO-204-D015 — Keep a vertical source command pending for cleanup retry

```json
{
  "id": "WO-204-D015",
  "date": "2026-10-25",
  "dispatch": "resume: next; criteria adversary finding",
  "decision": "Translate the source host's command-route-live refusal into a retryable vertical boundary. Leave the vertical command pending without a terminal receipt, then invoke the same source host on the next vertical run to revoke surviving grants before admission.",
  "evidence": [
    "SourceChangeHost deliberately leaves a failed cleanup pending, but the vertical primitive had translated that refusal into a terminal refused receipt; VerticalHost skips terminal runs.",
    "The new vertical test injects a one-time route unlink EACCES, observes a pending source-change command with no import, reruns once, and observes CommandGrantsRevoked and CandidateImported with a single WorkerAttemptStarted. Bounded test exit 0, 5.721 seconds, 2026-10-25T03:29 UTC."
  ],
  "rejected": [
    { "option": "Treat a failed cleanup as a final vertical refusal", "reason": "The operator cannot use the source host's recorded retry path through the ordinary vertical command." },
    { "option": "Immediately retry in the same vertical invocation", "reason": "It would conceal the cleanup failure and remove the explicit restart boundary required by the source host." }
  ],
  "reopenWhen": "A restarted vertical command launches a second writer or proceeds to admission while a command grant remains live."
}
```

## WO-204-D016 — Calibrate the denial reader against every printed control denial

```json
{
  "id": "WO-204-D016",
  "date": "2026-10-25",
  "dispatch": "resume: next; criteria adversary finding",
  "decision": "Capture the sandbox phase's full unified denial stream in memory, calibrate against every --log-denials line printed by its controls, and publish only relative or redacted denial summaries. The earlier three-target calibration was too narrow for criterion 21.",
  "evidence": [
    "The first sandbox record's calibration filtered printed controls down to three touch targets; its configuration-free commit also printed packed-refs.lock and rr-cache denials. D010's description of the three deliberate write controls did not establish the criterion's every-control requirement.",
    "A first widened calibration attempt failed and exposed incidental system-read denials, showing the old reader filter was insufficient. The reader now retains the full stream for sandbox calibration and redacts a ByHost preference filename in the public summary.",
    "The corrected bounded sandbox phase passed at Codex CLI 0.164.0 in 16.641 seconds, 2026-10-25T03:28:33 UTC; the printed and observed summaries include Git's packed-refs.lock and rr-cache denials as well as all other printed control denials."
  ],
  "rejected": [
    { "option": "Keep the three-target filter", "reason": "A reader that omitted Git control denials could still pass." },
    { "option": "Persist raw unified log lines", "reason": "Those lines can contain unrelated home paths and process details; counts and sanitized paths suffice for the calibration claim." }
  ],
  "reopenWhen": "A later CLI or macOS build prints a control denial the unified reader cannot match, or a saved probe record contains an unredacted private path."
}
```

## WO-204-D017 — Board probe setup failure recording

```json
{
  "id": "WO-204-D017",
  "date": "2026-10-25",
  "dispatch": "resume: next; design improver finding",
  "decision": "Record a follow-up for both live qualification scripts to include fixture creation, CLI version lookup and host construction in their failure-recording and disposal lifecycle. Their successful WO-204 episodes are already durable; changing either live script after the two-episode Codex limit would leave its evidence at a different source identity.",
  "evidence": [
    "The design worker identified setup before try/finally in claude-writer-qualification.mjs and codex-writer-qualification.mjs. A setup exception can leave scratch and no JSON failure row.",
    "The Codex record already retains one setup failure discovered during this order. Both live qualifications subsequently passed and are not being replayed solely to refactor their error path."
  ],
  "followup": "Next qualification-probe maintenance: enclose fixture creation, CLI version lookup and host construction in a failure-recording and cleanup lifecycle in both Claude and Codex live probes. Record a stable setup-stage failure without counting an episode until a writer process starts; add a fault-injected fixture that verifies scratch disposal and a JSON failure row.",
  "rejected": [
    { "option": "Rerun the live writer to validate a probe-only refactor here", "reason": "The order caps Codex at two launched episodes, both already used, and no current live setup failure remains." }
  ],
  "reopenWhen": "A probe setup failure recurs before the next maintenance order or an existing live record cannot be read."
}
```

## WO-204-D018 — Board batched imported-object presence checks

```json
{
  "id": "WO-204-D018",
  "date": "2026-10-25",
  "dispatch": "resume: next; design improver finding",
  "decision": "Keep the existing per-object presence checks for this order's bounded candidate sizes; record a performance follow-up to batch each checkpoint's query without reducing the prepublication and postpublication checks.",
  "evidence": [
    "The design worker counted one Git child per object in verifyImported, invoked at import and around publication. The current fixture and both live qualifications passed with that implementation.",
    "Batching is a performance and maintenance improvement; no acceptance criterion or observed candidate outcome fails at the current bound."
  ],
  "followup": "Next source-change import maintenance: batch imported-object presence checks into one bounded Git query per checkpoint, preserving every object's presence requirement and the checks before and after branch publication; measure process count and add a multi-object recovery fixture.",
  "rejected": [
    { "option": "Remove repeated checks", "reason": "The import and branch-publication boundaries require a fresh presence judgment." }
  ],
  "reopenWhen": "The current per-object checks breach a documented deadline or fail to detect a missing object."
}
```

## WO-204-D019 — Preserve the partial authority edition and select a complete re-mint

```json
{
  "id": "WO-204-D019",
  "date": "2026-10-25",
  "dispatch": "resume: next; deterministic evidence re-mint",
  "decision": "Preserve WO-204 authority revision 001, which an earlier sync started before the final source and role edits. After rebuilding and emitting the current harness, write and select revision 002. Select WO-204 revision 001 for artifact identity, verification and live feedback after their own records exist.",
  "evidence": [
    "The first authority --write --edition WO-204 --revision 001 after the final edit refused immutable bytes; authority/001 already contained authority.ref.json and bundle-diff.json from the earlier sync attempt.",
    "npm run harness -- emit and -- check both passed at 35 generated surfaces. authority --write --edition WO-204 --revision 002 then recorded 38 bundle comparisons and the expected synthetic denials. artifact-identity and verification --write at WO-204/001 recorded four files each.",
    "docs/evidence/current.json selects authority 002 and the other three WO-204/001 editions; their checks are required before handoff."
  ],
  "rejected": [
    { "option": "Overwrite authority revision 001", "reason": "Evidence editions are immutable, and it was minted against an earlier source identity." },
    { "option": "Leave the selected authority at revision 001", "reason": "Its recorded bundle comparison does not judge the final role and source bytes." }
  ],
  "reopenWhen": "Any selected edition check is stale at the handoff identity or the generated harness drifts after synchronization."
}
```

## WO-204-D020 — Run the required live feedback self-host on the final judged source

```json
{
  "id": "WO-204-D020",
  "date": "2026-10-25",
  "dispatch": "resume: next; live feedback evidence",
  "decision": "Select the new WO-204 feedback revision 001 after one native Codex verifier episode on the formatted final judged source. Keep the earlier WO-220 feedback edition intact.",
  "evidence": [
    "After npm run format and build, evidence:feedback --write --edition WO-204 --revision 001 recorded ten passing regressions, ten removal failures and 1192 fewer instruction bytes.",
    "The bounded DOTLN_LIVE_WORKERS=1 dotln feedback-audit episode used codex-cli-exec with selected gpt-6.1-sol/max and exited 0 at 2026-10-25T03:41:20.546Z after 32.081 seconds: phase complete, ten fixtures, 1192 saved bytes. Effective model and effort were not independently read back.",
    "feedback-evidence --record-selfhost stored the audit and a 73524-byte reference projection of 2935955 verifier-stream bytes; --check reported that WO-204/feedback-001 judged the current source."
  ],
  "rejected": [
    { "option": "Carry WO-220's audit", "reason": "The feedback check identified changed judged source files, so a new live episode is required." },
    { "option": "Use the synthetic evidence generation alone", "reason": "It does not supply the independent live verifier stream required for a changed judged implementation." }
  ],
  "reopenWhen": "A later judged-source edit makes WO-204/feedback-001 stale, or its recorded verifier stream cannot be reconstructed and checked."
}
```

## WO-204-D021 — Align the portfolio writer fixture with detached private objects

```json
{
  "id": "WO-204-D021",
  "date": "2026-10-25",
  "dispatch": "resume: next; complete review gate failure",
  "decision": "Update the portfolio writer double to stage and commit through the writer's private object environment and report the branch recorded by sourceWriterState. Keep the production source host detached during writer execution.",
  "evidence": [
    "The first npm test -- --review gate ended at 2026-10-25T03:49:52 UTC after 377.694 seconds. The portfolio suite passed one test and failed two because its writer double called git symbolic-ref --short HEAD on a detached writer worktree; downstream suites were skipped after that failure.",
    "The corrected scripts/test-portfolio.mjs uses sourceObjectEnvironment for the fixture's Git writes and sourceWriterState for its observed branch. A bounded portfolio run passed all three tests in 22.429 seconds at 2026-10-25T03:51:12 UTC."
  ],
  "rejected": [
    { "option": "Reattach the production writer HEAD", "reason": "That would undo the private detached candidate boundary implemented for this order." },
    { "option": "Treat the portfolio failure as a skip", "reason": "The fixture must exercise the current production writer contract in the complete gate." }
  ],
  "reopenWhen": "The complete review gate still fails in the portfolio suite or another writer fixture assumes an attached HEAD or shared object writes."
}
```

## WO-204-D022 — Repair detached writer and confinement test fixtures

```json
{
  "id": "WO-204-D022",
  "date": "2026-10-25",
  "dispatch": "resume: next; second complete review gate failure",
  "decision": "Use the host-recorded source writer branch in the repair fixture, and allow the gate's exact product-read observer log in the Codex confinement fixture's synthetic sandbox profile. Retain the shared-object deletion denial as the confinement assertion.",
  "evidence": [
    "The second npm test -- --review gate ran 1142.067 seconds and ended with 36 passed and six failed task rows. The target-publish and skeleton failures traced to repair-fixture.ts invoking git symbolic-ref --short HEAD in a detached writer worktree, plus one WO-204 Codex confinement case whose synthetic sandbox denied writes to the gate's product-read observer log before it reached the deletion probe.",
    "After the fixture changes and a successful build, all eight repair tests passed, the focused WO-204 Codex sibling-blob case passed both directly and with the gate's product-read observer installed, and all target-publish tests passed in 111.779 seconds. The complete gate must still pass at the final identity."
  ],
  "rejected": [
    { "option": "Attach the production writer HEAD", "reason": "The new source boundary deliberately keeps the candidate detached while the host records its intended branch." },
    { "option": "Remove product-read observation from the gate", "reason": "The exact observer log can be admitted in the test-only sandbox profile without granting the writer access to the sibling's shared object." }
  ],
  "reopenWhen": "The complete review gate reports another failure or the observer-log allowance conceals a shared-object write in the confinement case."
}
```

## WO-204-D023 — Judge an exhausted recovery with no published branch

```json
{
  "id": "WO-204-D023",
  "date": "2026-10-25",
  "dispatch": "resume: next; third complete review gate failure",
  "decision": "In the exhausted vertical recovery fixture, require the intended fix branch to be absent and main to retain its original commit. Keep the one-commit assertion for completed recovery paths.",
  "evidence": [
    "The third npm test -- --review gate ended with 41 passed and one failed task row after 2827.132 seconds, including 1018 seconds waiting for lanes held by another checkout. The sole failure was resident survives source actor death: exhausted in scripts/test-vertical.recovery.mjs.",
    "Its old rev-list --count main..fix/intent-* assertion failed because that branch does not exist after the private candidate is exhausted. The focused exhausted recovery case passed after the assertion was changed; a final complete gate remains required."
  ],
  "rejected": [
    { "option": "Publish a zero-change branch on exhaustion", "reason": "An exhausted source writer must leave its candidate private and the shared branch untouched." },
    { "option": "Skip the branch assertion", "reason": "The absence of a published fix branch and unchanged main are the observable refusal outcome." }
  ],
  "reopenWhen": "The complete review gate reports another recovery failure or an exhausted source writer publishes a branch."
}
```

## WO-204-D024 — Select the final authority edition and passing complete gate

```json
{
  "id": "WO-204-D024",
  "date": "2026-10-25",
  "dispatch": "resume: next; final implementation evidence",
  "decision": "Keep immutable earlier authority editions and select WO-204/003 after fixture and harness synchronization. Use the final complete review row at code identity 4b6bd718d06649dae535243bd90a422acf164165635a9716b2732d9c714f7ccd for the implementation handoff.",
  "evidence": [
    "npm run sync selected authority WO-204/003 after the detached-writer fixture corrections and left the artifact-identity, verification and feedback WO-204/001 editions current.",
    "npm test -- --review passed 42 suites, zero failed, 108 fresh tasks and no unrun tasks in 1811.378 seconds, with unchanged code identity and build output. The subsequent authority, artifact-identity, verification, feedback, publication and git diff --check commands each exited 0."
  ],
  "rejected": [
    { "option": "Overwrite an earlier authority edition", "reason": "Its immutable bytes judge an earlier generated harness." },
    { "option": "Use the failed complete rows as completion evidence", "reason": "They preceded the repaired fixture assertions and have nonzero exit status." }
  ],
  "reopenWhen": "The final document row fails, a selected edition check becomes stale, or a judged code edit changes the complete gate identity."
}
```

## WO-204-D025 — Bind the release header correction and repair a detached review fixture

```json
{
  "id": "WO-204-D025",
  "date": "2026-10-25",
  "dispatch": "resume: next; final document gate failure",
  "authorization": "The operator's resume: next authorized executing WO-204, whose step 4 requires local release preparation. This decision binds only the release classification formatting required by that step and adds no scope or criterion.",
  "decision": "Record an execution amendment for the order's minor classification header: retain minor as the release type and place its existing explanation in the following paragraph so release preparation parses the header. Update the older WO-181 review fixture to read the host-recorded branch from a detached source writer.",
  "evidence": [
    "The first final npm run test:docs ended with 23 passed and four failed task rows after 1545.135 seconds, including 1351.2 seconds waiting for lanes held by another checkout. Plan refutation reported existing work-order bytes changed; the WO-204 diff shows only the assigned v0.98.0 label and minor classification formatting. The release-title label is admitted by planning continuation, while the classification explanation split needs an amendment.",
    "The skeleton document failure was WO-181 AC3: its repair double ran git symbolic-ref --short HEAD on a detached writer worktree. After using sourceWriterState(request.cwd).branch, the focused WO-181 AC3 case passed in 3.628 seconds."
  ],
  "rejected": [
    { "option": "Restore the unparseable release header", "reason": "Local release preparation requires a period after the classification, and the selected minor impact is unchanged." },
    { "option": "Reattach the source writer HEAD for the older fixture", "reason": "That would weaken WO-204's private candidate boundary to satisfy a test double." },
    { "option": "Treat the failed document row as passing", "reason": "It did not check the final authored tree successfully." }
  ],
  "reopenWhen": "The execution amendment does not bind the exact release-format edit, the final document gate fails, or a later order edit changes accepted scope."
}
```

## WO-204-D026 — The committed-tree check must judge symlinks and gitlinks by their committed type

```json
{
  "id": "WO-204-D026",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails criterion 7. SourceChangeWorktree.cleanAgainstCommit refuses every tracked HEAD entry that is not a regular 100644 or 100755 file whose path is its own realpath. A target whose baseline tracks an unchanged symlink (120000) or gitlink (160000) therefore throws committed-tree-drift at the host's baseline clean check, before WorkerAttemptStarted, for both transports, so no source change on such a target can start. At the base the same clean candidate is observed. The order's Design refuses an index flag or a byte or mode that differs from the committed blob, not a tracked entry type. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-204/verification-001-clean-entries.mjs on the subject (code identity 4b6bd718): the control target is observed for Codex and Claude; with a tracked symlink link.txt the host throws 'source-change committed tree is dirty: link.txt; committed-tree-drift:link.txt', and with a gitlink vendor/sub it throws the same for vendor/sub, for both transports. Bounded exit 1, 10.039 s, cutoff 2026-10-25T11:58:01.438Z.",
    "The same probe against base 0027d9c1, exported with git archive into the verifier's scratch and compiled there with the worktree's TypeScript: all six cases observed. Bounded exit 0, 12.891 s.",
    "source-change-worktree.ts cleanAgainstCommit requires lstat to report a regular file, realpath to equal the path, type blob and mode 100644 or 100755; a symlink entry fails isFile and a gitlink fails the type check.",
    "This repository tracks AGENTS.md as a 120000 symlink (git ls-files -s), so ordinary target repositories carry such entries."
  ],
  "rejected": [
    { "option": "Pass criterion 7 on its fixture", "reason": "The fixture target tracks only regular files; 'a clean candidate passes' fails for any target tracking a symlink or gitlink, which main admitted." },
    { "option": "Return to status --porcelain alone", "reason": "That reopens WO-112 D044's skip-worktree counterexample." }
  ],
  "followup": "WO-204 repair: cleanAgainstCommit judges each tracked HEAD entry by its committed type and refuses only an index flag or a difference. A 120000 entry must be a symlink in the worktree whose unfollowed target equals the blob bytes; a 160000 gitlink is judged as the base judged it, through status, rather than refused; regular files keep the byte and mode comparison. A worktree path whose type differs from its committed type still refuses naming the path. Cases for both transports: a clean candidate in a target tracking an unchanged symlink and a gitlink is observed, and a changed symlink target refuses before any after-test; verification-001-clean-entries.mjs exits 0.",
  "reopenWhen": "verification-001-clean-entries.mjs exits 0 on the repaired subject and an independent re-verification confirms criterion 7 with symlink and gitlink entries."
}
```

## WO-204-D027 — An unimported candidate must leave the shared repository's Git and its own inspection working

```json
{
  "id": "WO-204-D027",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-001 records a blocking reproduced regression. The writer's detached worktree registers <common>/worktrees/<id>/HEAD in the shared Git directory, and after the writer commits that HEAD names a commit present only in the episode's private store. The host removes the worktree only in finish() after an observed receipt, so an outcome that leaves the candidate unimported leaves the shared repository holding a per-worktree ref Git cannot resolve. The probe observed this after an admission refusal and after the writer-requested-attention hold; by inference from the same source it also follows a pending command-route-live cleanup or an interruption after the writer's commit. git log --all, git rev-list --all, git repack -ad and git gc --prune=now then exit 128 and git fsck exits 10 there, and git log in the preserved worktree exits 128 ('bad object HEAD') unless the operator supplies the private environment. At the base all of these exit 0. Correction to D004: its premise that gc and repack 'return 128 until host import, then succeed' holds only for an admitted candidate. A refused or held candidate is never imported, so the failure lasts until the operator removes the worktree, and it also breaks log --all, rev-list --all, fsck and inspection. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-204/verification-001-unimported-candidate.mjs on the subject: after commit-wide (refused outside the declared surfaces) and after commit-blocked (refused writer-requested-attention), the shared repository's log --all, rev-list --all, repack -ad and gc --prune=now exit 128, fsck exits 10, and log -1 in the worktree exits 128; the held candidate is absent from the shared store, as criterion 17 requires. Bounded exit 1, 3.062 s, cutoff 2026-10-25T11:58:11.273Z.",
    "The same probe against the base 0027d9c1 build in the verifier's scratch: after the commit-wide refusal every command exits 0; commit-blocked is admitted at the base, which has no hold, and every command exits 0.",
    "Git's own messages name the cause: 'fatal: bad object worktrees/<id>/HEAD' and 'error: worktrees/<id>/HEAD: invalid sha1 pointer <oid>'.",
    "SourceChangeWorktree creates the worktree with worktree add --detach and prepareSourceObjectStore; SourceChangeHost.finish(), which calls tree.finish() and worktree remove, requires a persisted receipt and observation; the vertical's source-change step returns held(...) for the hold without finish."
  ],
  "rejected": [
    { "option": "Leave it under D004's follow-up", "reason": "D004's premise was inaccurate for refused and held candidates, and the NeedsHuman hold this order adds sends the operator to exactly this repository state." },
    { "option": "Import a held candidate so reachability resolves", "reason": "Criterion 17 keeps a held candidate's objects out of the shared store." }
  ],
  "followup": "WO-204 repair: when an episode's outcome leaves its candidate unimported, the shared repository's ordinary reachability commands (git log --all, git rev-list --all, git fsck, git repack -ad, git gc --prune=now) exit as at the base, a held candidate's objects stay out of the shared store, and the preserved candidate stays inspectable, either with plain Git in its worktree or with a command its refusal record names. The writer gains no write authority over the shared objects, refs or logs, and restart recovery can still re-judge a pending candidate. The live window between the writer's commit and the host import stays under D004's follow-up. Cases cover an admission refusal, the hold and a pending cleanup for both transports; verification-001-unimported-candidate.mjs exits 0. If no repair within the declared surfaces meets this rule together with criteria 12 and 17, record that here and stop for the operator. The safe default is that WO-204 does not close; the Design's recorded reopening alternative, a files-only writer with a host-owned commit, is the candidate the operator weighs.",
  "reopenWhen": "verification-001-unimported-candidate.mjs exits 0 on the repaired subject and an independent re-verification confirms the shared repository after a refusal and a hold, or the operator records a decision on the reopening alternative."
}
```

## WO-204-D028 — Refuse an alternates entry inside the private object store

```json
{
  "id": "WO-204-D028",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "A non-blocking hardening item within the declared surfaces, found in VER-001. The private store is <gitdir>/dotln-objects, inside the writer's own gitdir, which the Codex writer's access grants for write. Git follows $GIT_OBJECT_DIRECTORY/info/alternates. The host's pre-import reads, its strict fsck and its pack-objects run with GIT_OBJECT_DIRECTORY set to that store, while sharedState() inventories only the shared store's alternates. An alternates file in the private store would therefore add object sources to the host's own reads and import beyond the single read-only alternate the Design names. No criterion requires refusing it and main had no private store, so it does not block. The verifier did not construct or run an attack.",
  "evidence": [
    "Verifier scratch check at git 2.55.0: a blob written in an unrelated repository is unreadable from a second repository (cat-file -e exit 1) and readable once GIT_OBJECT_DIRECTORY names a store whose info/alternates lists the first repository's objects (exit 0).",
    "source-change-worktree.ts sourceObjectEnvironment places the store under the gitdir; worker-transport.ts codexWriterAccess grants the gitdir and the store for write; no check in source-change-worktree.ts reads the private store's info directory."
  ],
  "rejected": [
    { "option": "Block the order on it", "reason": "It breaks no criterion and no behavior main had; the defensive repair is small and local." }
  ],
  "followup": "WO-204 repair, as Adjacent Repair, or the next source-change confinement order: before any host read under the private environment, refuse admission with a typed reason when the private store holds info/alternates or any entry other than loose objects and packs, so that the only alternate is the environment's shared store; add a planted case for both transports.",
  "reopenWhen": "A planted private-store alternates entry is refused before any host read, or such an entry is observed reaching a host read."
}
```

## WO-204-D029 — Record the Known-issue durations and per-check costs at handoff

```json
{
  "id": "WO-204-D029",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "A non-blocking record omission found in VER-001. The order's Known issues ask the handoff to record the skeleton suite's and the vertical task's durations against their recorded medians, and to measure on the vertical fixture the clean check's per-path cat-file cost and the import's cost per admitted candidate, naming the cause of any above one second. handoff.md records only the complete gate's 1,811.378 s, and no decision carries the other four. From the passing complete row the verifier read skeleton at 419.774 s, 1.45 times its 289.9 s median and under the two-times threshold. The vertical files now run as separate tasks, the longest test-vertical-judgment.mjs at 498.589 s, against WO-199's single 725.851 s task. Neither value owes a threshold decision. The two per-check costs remain unmeasured.",
  "evidence": [
    "docs/control/local/harness/checks.json, npm test at code identity 4b6bd718 recorded 2026-10-25T05:36:42.670Z, taskTimeline: skeleton 419,774 ms; vertical:file:test-vertical-judgment.mjs 498,589 ms; vertical:file:test-vertical.mjs:statements 362,053 ms; vertical:file:test-vertical.recovery.mjs 325,297 ms; vertical:file:test-vertical.mjs:workflow 273,231 ms.",
    "handoff.md and decisions D001 to D025 contain no cat-file or import cost measurement."
  ],
  "rejected": [
    { "option": "Treat the omission as blocking", "reason": "No criterion names these records and the observed durations are under the order's threshold." }
  ],
  "followup": "WO-204 repair handoff: record the skeleton and vertical durations at the repaired subject against their medians, and measure on the vertical fixture the clean check's per-path cat-file cost and the import's cost per admitted candidate, recording the cause of any above one second.",
  "reopenWhen": "The repaired handoff records the four values, or a duration exceeds twice its median."
}
```

## WO-204-D030

<!-- integration refs/dotln/checkpoint/WO-204/6 -->

```json
{
  "id": "WO-204-D030",
  "date": "2026-10-25",
  "dispatch": "resume: fix; worktree integrate WO-204",
  "decision": "The operator explicitly requested scope expand: integrate latest main during resume: fix. Integrate fetched main at 28cc4882 through the canonical preservation procedure, with no authored conflict. Preserve VER-001 and its original subject; its symlink, gitlink and unimported-candidate findings still select this repair. Retiming the unpublished release from 0.98.0 to 0.99.0 preserves the minor classification. Skeleton remains 0.69.0 above main's 0.68.0, with the matching console dependency. No acceptance claim is inferred from the merge.",
  "evidence": [
    "refs/dotln/checkpoint/WO-204/6",
    "base 0027d9c1e574d161b6215d43b80061eccda37340",
    "upstream 28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9",
    "release preparation: Retimed WO-204: v0.98.0 → v0.99.0 above the observed release baseline v0.98.0. Files changed: docs/work-orders/WO-204-source-writer-cleanup-revocation.md, README.md, docs/evidence/WO-204/meta.json. Meter snapshot: docs/evidence/WO-204/meta.json, 3599 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-25. Original base: `0027d9c1e574d161b6215d43b80061eccda37340`.
Fetched main: `28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9`. Checkpoint: `refs/dotln/checkpoint/WO-204/6`.
Named stash retained: `aef3b06bdcf17d6f21a55a791c296dfba0c401f5` (WO-204 integrate 2026-10-25).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/siblings/README.md, docs/work-orders/HISTORY.md, docs/work-orders/README.md.
Release preparation: Retimed WO-204: v0.98.0 → v0.99.0 above the observed release baseline v0.98.0. Files changed: docs/work-orders/WO-204-source-writer-cleanup-revocation.md, README.md, docs/evidence/WO-204/meta.json. Meter snapshot: docs/evidence/WO-204/meta.json, 3599 bytes. Tag observation: local snapshot only.
Carried-forward evidence: the unchanged writer transport arguments and environment retain the recorded Codex and Claude qualifications. The complete gate and declared evidence editions must judge the repaired integrated source before handoff. Final review remains independent.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-204-D031 — Judge committed entries by their type

```json
{
  "id": "WO-204-D031",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 by comparing unfollowed symlink-target bytes to the committed blob and leaving gitlink cleanliness to Git status. Regular files retain byte, mode and index-flag checks. Reject changed types without changing the candidate.",
  "evidence": [
    "The 18-case bounded regression run at 2026-10-25T17:00:43.145Z passed for both transports, including clean dangling symlinks, clean gitlinks, changed symlink targets and both directions of file/symlink type drift. This closes the regular-file-only assumption; the complete gate is still owed."
  ],
  "rejected": [
    {
      "option": "Return to porcelain status alone",
      "reason": "It would reopen hidden-byte drift through index flags."
    }
  ],
  "reopenWhen": "A target with an unchanged committed entry is refused, or changed bytes or types reach after-testing."
}
```

## WO-204-D032 — Retain unimported candidates without broken shared reachability

```json
{
  "id": "WO-204-D032",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F2 after worker settlement by locking the owned worktree administration against pruning and atomically saving its gitdir backlink as dotln-retained-gitdir. Preserve HEAD, index, objects and files verbatim. SourceChangeCandidateRetained records the private-environment inspection command beside the refusal or pending cleanup. On successful import and publication, restore the backlink and remove only the host-owned lock. Existing writer grants, launch paths and environment are unchanged. A killed host before settlement remains within D004's recorded live-window limitation.",
  "evidence": [
    "Context7 /git/htmldocs git-worktree and gitrepository-layout identify per-worktree administration, the gitdir backlink and the locked pruning guard.",
    "Bounded Git 2.55.0 comparison at 2026-10-25T16:56:27.455Z: original registered private HEAD made log --all, rev-list --all, fsck, repack -ad and gc --prune=now fail; saving the backlink with a lock made all five pass. Moving the full administration also passed, at the cost of changed object-directory paths.",
    "The 18-case regression run passed admission refusal, attention hold and pending cleanup for both transports. Shared Git and explicit worktree prune succeed, candidate objects remain private, the recorded inspection command works, HEAD/index bytes are retained, and cleanup recovery admits once with the same writer then finishes normally.",
    "The existing verifier reproduction now accepts the durable inspection command as expressly allowed by VER-001 F2, retaining its shared-Git and private-object assertions. The filed VER-001 report is unchanged."
  ],
  "rejected": [
    {
      "option": "Import a held candidate",
      "reason": "Criterion 17 forbids it."
    },
    {
      "option": "Move the administration directory",
      "reason": "It changes object paths and complicates recovery while preserving the same reachable result."
    },
    {
      "option": "Rewrite HEAD or the index to the base",
      "reason": "It alters the preserved candidate."
    },
    {
      "option": "NoOp",
      "reason": "It leaves five ordinary Git operations failing after a refusal."
    }
  ],
  "reopenWhen": "Git changes backlink enumeration or lock-pruning behavior, the retained candidate cannot be inspected or recovered, or a live unsettled writer must keep shared reachability available."
}
```

## WO-204-D033 — Refuse private-store metadata before host reads

```json
{
  "id": "WO-204-D033",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Fix VER-001 F3 as adjacent-0002 by validating the private object directory before constructing any host Git read environment. Admit only canonical ordinary loose-object and pack directories, ordinary single-link files with object/pack names, and an empty conventional info directory. Refuse auxiliary metadata and symlinked storage with private-object-layout; preserve it for inspection. This changes host admission only, not writer grants or launch arguments.",
  "evidence": [
    "SourceChangeWorktree.environment is evaluated before every execFileSync using the private environment; sourceGit clears that environment for shared reads.",
    "The bounded 14-case run at 2026-10-25T17:04:22.095Z passed planted alternates, commit graphs and symlinked info directories for both transports. Each stopped with the typed refusal before import, retained the planted data, and left shared fsck successful. It also passed both transports interruption-after-commit recovery with no redispatch."
  ],
  "rejected": [
    {
      "option": "Rely only on fsck",
      "reason": "Git can consult private alternates before fsck judges the candidate."
    },
    {
      "option": "Remove the planted metadata",
      "reason": "That would change the rejected candidate and hide the finding."
    },
    {
      "option": "Defer the hardening",
      "reason": "The bounded layout guard uses the same declared surfaces and executable checks as this repair."
    }
  ],
  "reopenWhen": "Git writes a legitimate object layout this allowlist refuses, or auxiliary private metadata reaches a host Git read."
}
```

## WO-204-D034 — Measure clean and import costs on the vertical fixture

```json
{
  "id": "WO-204-D034",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Measure the omitted per-check costs on the actual synthetic vertical source-change step, and report repaired skeleton and vertical task durations from the forthcoming complete gate. The import is pack-objects plus index-pack and per-object verification, not the originally proposed fetch; measure that implemented operation. Preserve the full per-path measurements rather than sampling.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-204/repair-costs.mjs passed at 2026-10-25T17:05:50.925Z. The step completed and imported one three-object candidate.",
    "repair-costs.json: five complete clean checks over three tracked blobs each, maximum 78.677 ms. Fifteen separately timed cat-file reads ranged from 9.049 to 12.244 ms. One import took 94.412 ms. No measured operation crossed one second."
  ],
  "rejected": [
    {
      "option": "Report only the whole-gate duration",
      "reason": "It does not answer the order's per-check cost questions."
    },
    {
      "option": "Infer the check cost from another fixture",
      "reason": "The order names the vertical fixture."
    }
  ],
  "reopenWhen": "A clean check or import exceeds one second on the measured target, or skeleton/vertical task growth crosses the order's recorded threshold."
}
```

## WO-204-D035 — Refresh the feedback audit and correct its scratch path

```json
{
  "id": "WO-204-D035",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Refresh the feedback evidence in immutable revision 002 after the repaired source, preserving revision 001 and its original audit. Run the required native feedback verifier with the established Codex gpt-6.1-sol/max selection. The initial CLI run and a diagnostic re-entry stopped locally before WorkerAttemptStarted: the supplied system-temp path used /var instead of its canonical /private/var spelling. Correct the invocation to a fresh canonical store and retain the incomplete store; this is not a provider refusal or a completed live episode. No transport argument or writer authority changed, so the original successful writer requalifications remain their evidence.",
  "evidence": [
    "The failed store ends at CommandPersisted with no WorkerAttemptStarted, CommandReceipt or provider response.",
    "Direct bounded diagnostic: feedback verifier mount alias, at feedback-selfhost.ts canonical mount check; exit 1 at 2026-10-25T17:10:06.911Z.",
    "feedback-evidence --write --edition WO-204 --revision 002 passed ten regressions and ten removals with 1192 fewer instruction bytes.",
    "The canonical-store live feedback audit completed at 2026-10-25T17:11:19.811Z in 43.325 seconds: phase complete, ten fixtures, 1192 saved instruction bytes, codex-cli-exec with selected gpt-6.1-sol/max. Effective provider model/effort readback is unavailable."
  ],
  "rejected": [
    {
      "option": "Change or bypass the canonical mount check",
      "reason": "Use the physical path the existing safety check requires."
    },
    {
      "option": "Reuse the old live audit after judged source changes",
      "reason": "It did not judge the repaired source."
    },
    {
      "option": "Overwrite revision 001",
      "reason": "Its filed verification cites that immutable subject."
    }
  ],
  "reopenWhen": "The fresh audit fails or does not judge the current source; preserve its cause and reassess before another attempt."
}
```

## WO-204-D036 — Keep imported receipt recovery registered

```json
{
  "id": "WO-204-D036",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Correct the retention condition to cover unimported candidates only. Code review during the first complete gate found that a post-receipt exception could save the registration backlink even though import had succeeded; receipt replay does not call publishCandidate and therefore would not restore that registration. Stop the gate before changing inputs, reproduce the failure for both transports, and use the durable CandidateImported record to leave already imported administration registered. Preserve both the stopped gate and feedback revision 002; revision 003 will judge the corrected source.",
  "evidence": [
    "The complete gate was stopped through evidence --stop at 2026-10-25T17:14:30.933Z after 58.411 seconds; it supplies no passing claim.",
    "The new saved-receipt cases failed for both transports at 2026-10-25T17:14:57.013Z: receipt replay reported observed, but finish failed because Git could not find the hidden worktree.",
    "With the durable import check in place, both saved-receipt cases pass and finish removes the observed worktree with one writer dispatch; bounded exit 0, 7.529 seconds, cutoff 2026-10-25T17:15:26.710Z.",
    "Feedback revision 003 regenerated ten regressions and ten removals with 1192 saved instruction bytes. Its independent native verifier completed with both criteria passing and no findings on the corrected source; record-selfhost preserved its event streams at 2026-10-25T17:20:31.159Z. Selection remains Codex gpt-6.1-sol/max; effective provider settings are unobserved."
  ],
  "rejected": [
    {
      "option": "Treat absence of SourceChangeObserved as proof of no import",
      "reason": "Receipt persistence and import precede that event."
    },
    {
      "option": "Change receipt replay to redispatch or import again",
      "reason": "The saved accepted receipt already binds the candidate and must replay without a new writer."
    }
  ],
  "reopenWhen": "An unimported candidate remains registered after settlement, or an imported candidate cannot finish after receipt recovery."
}
```

## WO-204-D037 — Pin early graph refusal and symlink recovery

```json
{
  "id": "WO-204-D037",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Update the older forged commit-graph attack to require the earlier private-object-layout refusal. Keep both forged-tree and forged-parent controls proving that the planted cache changes ordinary Git results; also require zero admitted effect reads, no import or observation, and preserved graph bytes. Strengthen the retained-candidate matrix with a tracked symlink through cleanup and interruption recovery for both transports, covering VER-001 criterion 9 at the repaired entry type. Production behavior is unchanged.",
  "evidence": [
    "The complete review at code identity 0efbd294bff0856db06609cd83912dda8c7bb8d1d67e3fa25bab36df0088b2cf failed at 2026-10-25T17:29:20.783Z after 453.820 seconds. Skeleton took 419.07 seconds; its sole failure was the older graph test expecting committed-tree-drift or an outside-surface refusal, while the host correctly returned private-object-layout. Remaining suites were not started. This row supplies no passing claim.",
    "The first bounded two-file check started before re-emitting the newly built harness snapshot. Parallel test children collided creating that snapshot (ENOTEMPTY); the graph case and seven retention cases passed, while one retention case stopped in setup. Emit the current harness before the next check and run the bounded files sequentially. No product runtime change was made in response.",
    "After harness emit, the bounded sequential nine-case check passed both forged-graph variants and all eight retained-candidate cases with an unchanged tracked symlink, including cleanup and interruption recovery for both transports. Exit 0, 24.540 seconds, cutoff 2026-10-25T17:31:47.610Z."
  ],
  "rejected": [
    {
      "option": "Relax the layout guard to allow the planted graph",
      "reason": "That would reopen F3 instead of judging the earlier refusal."
    },
    {
      "option": "Accept any thrown error",
      "reason": "The regression must pin the intended refusal and preserved candidate."
    }
  ],
  "reopenWhen": "A planted graph reaches admission, the typed refusal changes unintentionally, or a retained symlink target cannot recover without another writer."
}
```

## WO-204-D038 — Hand off the integrated repair with measured costs

```json
{
  "id": "WO-204-D038",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Hand off the repaired, integrated source for fresh independent verification. Consume the complete review at the current code identity and record the four omitted cost measures. Keep the filed VER-001 report and all failed or stopped rows as historical evidence. Preserve the earlier live-window, probe-setup and batched-import follow-ups; no criterion is waived. Final document evidence and RepairCompleted are still required after these authored records.",
  "evidence": [
    "npm test -- --review passed 43 suites, 109 fresh tasks, no reused or unrun tasks, at 2026-10-25T18:05:59.222Z; 1952.522 seconds including 0.991 seconds waiting for host lanes. Code identity b2d8653a7f8444a0a3ea4fcdb7e6b1fc93eda249f784d6e343e4e4bd9857c5a6; both code and build output remained unchanged.",
    "skeleton: 418.632 seconds, exit 0.",
    "vertical:file:test-vertical.mjs:workflow: 263.217 seconds, exit 0.",
    "vertical:file:test-vertical.mjs:statements: 355.611 seconds, exit 0.",
    "vertical:file:test-vertical-judgment.mjs: 503.398 seconds, exit 0.",
    "vertical:file:test-vertical.recovery.mjs: 302.87 seconds, exit 0.",
    "Skeleton is 1.444 times the order's 289.9-second thirty-day median, below twice that median. The longest vertical task is 503.398 seconds against the order's recorded prior single-task reference of 725.851 seconds; that reference is not relabeled as a median.",
    "repair-costs.json records every measured blob read on the synthetic vertical fixture: fifteen cat-file calls of 9.049–12.244 ms, five whole clean checks with maximum 78.677 ms, and one three-object import of 94.412 ms. No measured check or import crossed one second.",
    "Regeneration checked authority WO-204/006, artifact-identity WO-204/001, verification WO-204/001 and feedback WO-204/003 current. The test-only correction did not change feedback judged behavior. The selected native feedback audit finished at 2026-10-25T17:17:28.346Z with both criteria passing and no findings.",
    "VER-001 has the same Git blob identity as checkpoint 5. The canonical integration retained checkpoint 6 and its named stash, advanced HEAD to fetched main 28cc4882, and bound the authorized v0.99.0 retiming through D030."
  ],
  "rejected": [
    {
      "option": "Reuse the old failed verification or earlier passing gate as the repaired verdict",
      "reason": "They judge different source; this repair needs its own gate and independent verification."
    },
    {
      "option": "Trim cases to reduce duration",
      "reason": "The specified coverage passed without breaching the recorded skeleton threshold."
    }
  ],
  "reopenWhen": "Independent verification finds a failed criterion or regression, the measured check/import cost exceeds one second, or a required task breaches its recorded cost threshold."
}
```

## WO-204-D039 — Retention must not replace a settled outcome

```json
{
  "id": "WO-204-D039",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "A non-blocking hardening item within the declared surfaces, found in VER-002. SourceChangeHost.run() calls SourceChangeWorktree.retainUnimported() in the finally block that guards the whole run, including a replayed refusal. When retention throws, its error replaces the outcome the run had already settled. With the registration backlink <gitdir>/gitdir already absent when a commit-blocked writer settles (the Codex writer's access grants that gitdir for write), the run throws ENOENT for that path instead of returning refused writer-requested-attention, and every rerun throws the same. The durable SourceChangeRefused record still carries the hold, nothing is imported or admitted, one writer launch is recorded, and the five shared reachability commands exit 0. The result is fail-closed but untyped: the vertical cannot map it to NeedsHuman. Criterion 17's fixtures do not tamper with Git administration, and the trigger requires a writer acting outside its prompt, so this does not block.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-204/verification-002-retention.mjs, case absent-backlink-at-settlement, both transports: first and rerun 'threw:ENOENT: no such file or directory, lstat <scratch>/target/.git/worktrees/<id>/gitdir'; SourceChangeRefused reason writer-requested-attention; launches 1; log --all, rev-list --all, fsck, repack -ad and gc --prune=now exit 0 (2026-10-25T19:27:59.740Z).",
    "source-change-host.ts lines 1205-1235 (retention in the outer finally); source-change-worktree.ts lines 652-693 (retainUnimported reads the backlink through ordinaryFile and throws on its absence or drift)."
  ],
  "rejected": [
    { "option": "Block the order on it", "reason": "No criterion's fixture reaches it, it fails closed with the hold durably recorded, and the defensive repair is local." },
    { "option": "Swallow every retention error", "reason": "A silent failure would hide a drifted registration; the failure needs its own record." }
  ],
  "followup": "The next source-change confinement order: an error while retaining an unimported candidate never replaces the outcome the run settled. run() returns the settled refusal, or rethrows the original error, and a typed record names the retention failure and its path. An absent backlink with no saved one counts as already unregistered. Cases for both transports: a commit-blocked writer whose backlink is gone at settlement returns refused writer-requested-attention on the run and on its rerun, with one launch and shared Git usable.",
  "reopenWhen": "A retention failure is observed replacing a settled outcome in a live or vertical run, or the follow-up's cases pass."
}
```

## WO-204-D040 — Record a retained candidate's removal and its reachability window

```json
{
  "id": "WO-204-D040",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "A non-blocking record and operability item found in VER-002. A retained candidate is hidden from ordinary worktree management: git worktree list does not show it, git worktree remove --force fails with 'is not a working tree', and git worktree prune keeps its locked administration. At main the same refused worktree is registered, listed and removable. SourceChangeCandidateRetained names only an inspection command, and the vertical's NeedsHuman receipt carries neither it nor a removal step. Git-native removal works: git worktree repair <path>, git worktree unlock <path>, then git worktree remove --force <path>. Between the repair and the removal, the five reachability commands fail again. Separately, product 03 and D032 bound the broken-reachability window at abrupt death before settlement. In fact a host killed after settlement but before the run's finally (at WorkerResultObserved or SourceChangeRefused) also leaves the five commands failing until the next run of that command, which then retains and heals. No criterion names worktree removal, the repository is not damaged, and the five commands pass after every settled outcome, so this does not block.",
  "evidence": [
    "verification-002-retention.mjs case retained-worktree-ordinary-git, both transports (2026-10-25T19:27:59.740Z): listed false; remove --force exit 128; prune exit 0 with the lock kept; repair exit 0, after which log --all, rev-list --all, repack -ad and gc --prune=now exit 128 and fsck 10; unlock exit 0; remove --force exit 0; then all five exit 0. Its plain-worktree-control row: an ordinary linked worktree is listed and remove --force exits 0.",
    "Same probe, case crash-then-rerun, both transports: a SIGKILL at WorkerResultObserved or SourceChangeRefused leaves the five commands at 128 (fsck 10). The rerun returns refused writer-requested-attention with one launch and one SourceChangeCandidateRetained, and all five exit 0. A SIGKILL at SourceChangeCandidateRetained leaves them at 0.",
    "docs/product/03-architecture.md §Session lifecycle & resilience, 'Abrupt death before settlement still requires recovery.'"
  ],
  "rejected": [
    { "option": "Block the order on it", "reason": "VER-001 F2's rule asked for reachability, inspection and recovery, which hold; removal and listing are operability, with a Git-native route observed." },
    { "option": "Keep the worktree registered", "reason": "That reopens VER-001 F2." }
  ],
  "followup": "The next source-change order that touches retention: SourceChangeCandidateRetained, product 03 and the skeleton README name the removal procedure beside the inspection command (repair, unlock, remove --force, in that order). Product 03's sentence says shared reachability stays broken from the writer's commit until the host's next run of that command settles and retains it. The vertical's NeedsHuman value may carry the inspection command.",
  "reopenWhen": "An operator cannot discover or remove a retained candidate, or the follow-up's records land."
}
```

## WO-204-D041 — integrate main at the repair's base with nothing taken in

<!-- integration refs/dotln/checkpoint/WO-204/11 -->

```json
{
  "id": "WO-204-D041",
  "date": "2026-10-25",
  "dispatch": "resume: final review; worktree integrate WO-204",
  "decision": "Integrate main at 28cc4882, the commit the repaired branch already stands on since D030: a no-op merge that took nothing in and met no authored conflict. Every acceptance claim of VER-002 is carried forward unchanged with its original evidence, because the integrated code identity equals the identity the repair handed off and VER-002 judged, and the passing complete review row at that identity is the row the result consumes; no fresh complete run is owed. Component versions and evidence editions are unchanged by the integration, and v0.99.0 remains the current target above the published v0.98.0.",
  "evidence": [
    "refs/dotln/checkpoint/WO-204/11, preservation commit 07d67b191c85e7f01e5a75cc1864329d9fe210e1, no merge commit",
    "base 28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9",
    "upstream 28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9",
    "release preparation: WO-204 target v0.99.0 remains current. Files changed: docs/evidence/WO-204/meta.json. Meter snapshot: docs/evidence/WO-204/meta.json, 4125 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity read b2d8653a7f8444a0a3ea4fcdb7e6b1fc93eda249f784d6e343e4e4bd9857c5a6 at entry, after the integration and after the checks and probes: the identity of the complete review row recorded 2026-10-25T18:05:59.222Z (npm test --review, exit 0, 43 required suites, 109 fresh tasks, none unrun, identity and build output unchanged, 1,952.522 s) and of VER-002's subject.",
    "Affected checks at the integrated tree, each exit 0 one at a time under node scripts/harness.mjs bounded --: npm run publication:check (255 of 255 headings; both editions current), node scripts/harness.mjs check (35 generated surfaces), npm run release -- check-surfaces --local, npm run meta -- --check (the five standing budget breaches, 0 reopen candidates); git diff --check clean and npm run format:check pass before and after the integration.",
    "Local main, origin main and HEAD are 28cc4882; the newest annotated tag is v0.98.0 locally, so v0.99.0 collides with nothing. Skeleton 0.69.0 above main's 0.68.0 with the matching console pin is the repair's bump, retained; compiler 0.31.0, kernel 0.8.0, console 0.5.0, beacons 0.1.1 and browser-evidence 0.2.0 are unchanged.",
    "Named stash 5e611fed6928583e62473682daa40c756252dfed retained; intake backup DotLn-wo204-intake-20261025T194659Z.zip (3 files) in the DotLn session scratch; no authored conflict and no resolved projection."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Run a fresh npm test -- --review after the integration",
      "reason": "The identity, not the dispatch time, says what was tested; it is unchanged, so the repair's passing complete row covers the integrated tree (product 07 §Preflight before the full gate)."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-25. Original base: `28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9`.
Fetched main: `28cc4882d24b573b7d809bc2d9a427a9fdc2b7d9`. Checkpoint: `refs/dotln/checkpoint/WO-204/11`.
Named stash retained: `5e611fed6928583e62473682daa40c756252dfed` (WO-204 integrate 2026-10-25).
Resolved projections: none.
Release preparation: WO-204 target v0.99.0 remains current. Files changed: docs/evidence/WO-204/meta.json. Meter snapshot: docs/evidence/WO-204/meta.json, 4125 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 25 as VER-002 judged them, at the unchanged code identity `b2d8653a…`; FINAL-001 reran the three verification probes, the retained WO-112 recovery probe, the two qualification helper tests and the four edition checks, and this order's 93 named skeleton cases and 4 vertical cases, under the bounded wrapper at the integrated tree, with the same outcomes.
Authored conflicts observed: none.
Affected checks: run at the integrated tree, each exit 0 (the evidence list above).

## WO-204-D042 — final review pass at the integrated identity

```json
{
  "id": "WO-204-D042",
  "date": "2026-10-25",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-204 at code identity b2d8653a7f8444a0a3ea4fcdb7e6b1fc93eda249f784d6e343e4e4bd9857c5a6 with no finding of its own. VER-002's two findings keep their follow-up route and are reproduced here at the integrated tree by its own probe: F1 (D039), an error inside retention replacing the settled refusal when the writer's gitdir backlink is absent at settlement, fail-closed with the hold recorded and shared Git usable; F2 (D040), a retained worktree hidden from ordinary worktree management with a Git-native removal route no record names, and the five reachability commands failing after a host killed between settlement and retention until the next run heals them. Neither breaks a criterion or behavior main had. This review repairs neither: a reviewer never writes a behavioral fix and certifies it, and a source edit would move the identity the complete row and VER-002 judged. Their register rows FUP-3556f78540a5f22e and FUP-30cee01e368d4a23, untriaged since VER-002, are deferred to the owners D039 and D040 name with their reopening conditions. Three rows whose reopening conditions this order met are deferred with the new measurement: FUP-957602bc42e32e1d (WO-217-D053) and FUP-e08668268dea62b1 (WO-219-D009), because D013's operator-directed executor brief grew the executor role by 343 bytes to 29,827 against the unchanged 29,246 ceiling (headroom -581; the reviewer unchanged at 29,584 against 28,884), recorded in wo204-role-baseline.json with FUP-e08668268dea62b1 as its boarding row; and FUP-eed385be08e5bdd9 (WO-226-D022), because this order touches scripts/test-gate-followups.mjs and re-mints the oracle while the test already asserts the recorded headroom as ceiling minus installed bytes and keeps the historical 256-byte inequality on the earliest chained baseline. The eight rows the change only matched by path or by the order's name stay as they are. Planning receipt 055 judged the order aligned with no known issue; the order's own known issues are judged in the report, none blocking. The integrated identity is unchanged, so the repair's passing complete review row is the row the result consumes; the affected checks, the three verification probes, the retained WO-112 recovery probe, the qualification helper tests, the four edition checks, and this order's 93 named skeleton cases and 4 vertical cases were rerun at the integrated tree with the same outcomes. One process failure of this review is recorded: a mis-quoted runner spec started node's default test discovery twice in place of the five named files, each run loading 482 tests with 110 failures that judge nothing about the subject, and a discovered test recorded two composed plain npm test rows with their structural rows at the unchanged identity (2026-10-25T19:56:13.435Z and 20:01:40.555Z, exit 0, six always-fresh suites each); the tree and identity did not change, the stray logs were overwritten by the corrected rerun before the failing names were extracted, and none of those rows or results is relied on.",
  "evidence": [
    "docs/final-reviews/WO-204/FINAL-001.md: criterion judgments, the known-issue judgments, the executed-check table and the findings block.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-204/verification-001-clean-entries.mjs (exit 0, 16.3 s), verification-001-unimported-candidate.mjs (exit 0, 2.8 s) and verification-002-retention.mjs (exit 0, 29.4 s) at the integrated tree, 2026-10-25T19:49:20Z to 19:50:08Z; docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs exit 0 (7.6 s); the two qualification helper tests 7 of 7; authority (38 bundle comparisons), artifact-identity (4 files), verification (4 files) and feedback (feedback-003 judged the current source) checks exit 0.",
    "node --test --test-concurrency=1 over the five WO-204 skeleton test files, name-filtered to this order's cases, the private-shadow case and the private forged-graph case: 93 passed, 0 failed, 223.4 s (20:06:00Z to 20:09:43Z); scripts/test-vertical.mjs and test-vertical.recovery.mjs name-filtered to this order's cases: 4 passed, 25.8 s (20:09:43Z to 20:10:09Z); both under the bounded wrapper, serially.",
    "docs/evidence/WO-112/shared-object-counterexample.mjs at the integrated tree exits 0 and prints its known-gap line: its deletion runs from the host's own afterResult with the probe's full permissions, outside any writer access, so it reproduces by construction and is not criterion 10's case; the committed cases with each transport's emulated access passed in the complete row and in this review's rerun.",
    "packages/skeleton/fixtures/wo204-role-baseline.json startupCost: executor beforeBytes 29484, bytes 29827, ceiling 29246, growthBytes 343, headroomBytes -581; reviewer 29584 against 28884, headroom -700, growth 0; decision WO-204-D013, followup FUP-e08668268dea62b1. npm run meta -- --check: 5 budget breaches, coldStartBytes 29,827, 0 reopen candidates.",
    "npm run plan -- followups --touching at register revision 336a0932…: 13 matched rows over two pages; one followups --apply batch of five deferrals moved the register to 1344e6164fb0ae1c2a49e59d970adf750eb4e281fca3e47ebe35f68c108ffa7f.",
    "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it; §Verification review and attack: a finding outside the criteria that breaks no behavior main had is a follow-up by rule; WO-232-D019 is the precedent for deferring a verifier-minted row to its named owner and leaving a path-matched row alone."
  ],
  "rejected": [
    {
      "option": "Repair D039 or D040 here within the Boy Scout bound",
      "reason": "A source edit moves the code identity and owes a fresh complete run over bytes no verifier judged; both are bounded repairs for the owners the decisions name."
    },
    {
      "option": "List VER-002's F1 and F2 in this review's findings block",
      "reason": "The block counts the final review's own findings and its classes measure what escaped verification; both were found and boarded by verification, so they are judged in prose and the block is empty."
    },
    {
      "option": "Treat D013's role change as unauthorized scope",
      "reason": "It is an operator correction recorded with its evidence and byte cost, outside the criteria, breaking no behavior main had, pinned by the role oracle and passing in the complete row; the byte-headroom rule asks for measurement and boarding, which the oracle and the deferred rows record."
    },
    {
      "option": "Treat the retained WO-112 probe's known-gap line as a failed criterion 10",
      "reason": "The probe never modelled writer access; the criterion's case does, and passes."
    },
    {
      "option": "Resolve the two verifier-minted rows as settled",
      "reason": "By the operator's 2026-10-17 direction a boarded row is resolved by a work order; a final review may only defer it with its owner and reopening condition."
    }
  ],
  "reopenWhen": "A retention failure replaces a settled outcome in a live or vertical run, or an operator cannot discover or remove a retained candidate (D039 and D040); a live writer's commit lands in the shared store, creates rr-cache or fails under the grants (D010 and D011); or a role grows past its pin without the oracle changing."
}
```
