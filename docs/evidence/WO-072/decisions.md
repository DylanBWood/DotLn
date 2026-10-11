# WO-072 decisions

## WO-072-D001

```json
{
  "id": "WO-072-D001",
  "date": "2026-10-11",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.75.0, the next minor above the observed release baseline v0.74.3, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.74.3 (local tags)",
    "minor classification declared in docs/work-orders/WO-072-target-worktree-lifecycle.md"
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

## WO-072-D002

```json
{
  "id": "WO-072-D002",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Implement the planned two-worktree shape. The main launchpad's ignored control/local/repository-clones.json maps public repository ids to physical clone roots. Resolve worktreeParent relative to that main launchpad, matching the vertical caller's existing boundary. Both code and records use wo-NNN; control events contain only repositoryId and baseCommit. Keep a target-worktrees.json entry in main for close and in the order launchpad for selection. The latter selects an order only: invoke that launchpad's scripts or name it with DOTLN_LAUNCHPAD. It does not infer a launchpad from cwd. Emit the existing target-worker bundle with main's pinned runtime; the bundle has no role skill.",
  "evidence": [
    "docs/work-orders/WO-072-target-worktree-lifecycle.md execution plan steps 1-4",
    "scripts/lib/config.mjs findLaunchpad and scripts/lib/vertical-runtime.mjs worktreeParent reader",
    "scripts/lib/target-worktrees.mjs and scripts/worktree.mjs",
    "packages/skeleton/src/source-change-worktree.ts: SourceChangeWorktree binds a cmd_ episode, source-change surfaces and a commit message; this operator lifecycle has an order identity and two worktrees",
    "Entry wc -l: scripts/worktree.mjs 867, scripts/resume.mjs 2250, scripts/release.mjs 3121"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves registered repositories disconnected from the operator work-order lifecycle." },
    { "option": "Select the launchpad by walking from the target cwd", "reason": "WO-069-D002 forbids that routing and its copied-script fixtures depend on the scripts' own launchpad." },
    { "option": "Reuse the full source-change episode worktree class", "reason": "It imposes episode identity, source-change contract and recovery semantics that this control-plane operation does not have. Reuse the underlying Git operations and the physical-directory rule without editing edition-registered runtime sources." },
    { "option": "Commit clone paths or DotLn state in the target", "reason": "Local paths belong in ignored state and target commits must contain only target code." }
  ],
  "reopenWhen": "A target order must keep its reports in the target repository, or the existing relative parent cannot identify the required host location. Outside-project targets still require the executing role's containing-root grant; the fixtures use the granted system temporary root."
}
```

WO-071-D001 and D002 were rechecked: public registration and immutable bases
remain sufficient; neither schema reopens. WO-064-D001 and D004 reopen checks
are discharged here: the new clone map supplies local navigation, not an
episode receipt, forge identity or operator publication grant. Their
publication authorization and separate publication-event log remain binding.
Per-repository release policy remains open; this lifecycle closes targets
without creating releases. The earlier ledger duty is discharged by this
decisions file and its generated index row under the executor skill.

## WO-072-D003

```json
{
  "id": "WO-072-D003",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Select foreign target worktrees only through the already-selected launchpad's registry and require the target branch to match its order, including when the launchpad is itself on wo-NNN. Apply that restriction where a target registry or repository registration exists; self-only copied-script invocations preserve their prior resolver. Keep usage, times and all-order status independent of local target state. Preserve repository identity in release's control-state adapter, then take the no-release branch before version/surface/tag handling. Check target containment, cleanliness, bundle ownership and writer state before teardown; preserve unexpected ignored material by refusing. Keep target cleanup separate from launchpad cleanup so its retry logic never interprets a foreign path as a launchpad worktree.",
  "evidence": [
    "scripts/resume.mjs run and scripts/test-resume.sh copied-script/usage fixtures",
    "scripts/release.mjs controlState previously returned only workOrderId, workOrderPath and phase",
    "scripts/lib/target-worktree-close.mjs",
    "scripts/lib/git.mjs removeMergedBranch uses git branch -d after removing an upstream; a clone on another branch can conservatively refuse deletion",
    "scripts/test-target-worktree.mjs criteria 2 and 4"
  ],
  "rejected": [
    { "option": "Trust the launchpad branch before looking at the target", "reason": "An unregistered cwd or changed target branch would silently select the launchpad's order." },
    { "option": "Append target paths to existing cleanup.worktrees", "reason": "The launchpad close reuses those paths as launchpad recovery subjects; mixing repositories misroutes teardown." },
    { "option": "Force-delete a branch or worktree after a failed containment or material check", "reason": "That would discard unmerged or local work, violating the lifecycle boundary." },
    { "option": "Generalize target publication or its release ladder", "reason": "The order explicitly defers per-repository release policy; no-release is the bounded disposition." }
  ],
  "reopenWhen": "A supported target needs automatic publication policy or retained-material reconciliation beyond conservative refusal, or a retry needs recovery of a directory Git has already unregistered. Such a directory stays preserved here."
}
```

Lifecycle reservation remains in the order launchpad, paired with its existing
completion release. The existing target-worker hook uses its separate ignored
target lane; Codex has no hook enforcement for that bundle. The role's
one-writer duty still applies. This order installs no target role skill and
makes no new Codex hook-enforcement claim.

## WO-072-D004

```json
{
  "id": "WO-072-D004",
  "date": "2026-10-11",
  "dispatch": "resume: next",
  "decision": "Repair the carried-in umbrella-start defect in the shared start preflight. Read umbrellaRecord before fetching/creating worktrees and re-read after main fast-forwards. Keep the same successor explanation as activation. Track and test this as adjacent-0001; the initial guard landed with the start-path edit, and its queue announcement/check-in preceded completion of the regression fixture, rather than being claimed as prior evidence.",
  "evidence": [
    "WO-072 carry-in FUP-bd3e66761dc301ed names worktree start creating a branch before activation's umbrella refusal",
    "scripts/worktree.mjs original start path and scripts/resume.mjs activate",
    "scripts/lib/dependencies.mjs umbrellaRecord",
    "scripts/test-target-worktree.mjs umbrella start refusal fixture"
  ],
  "rejected": [
    { "option": "Leave the worktree half to another order", "reason": "The bounded fix shares this order's start path and real-Git checks." },
    { "option": "Repair the kit-seed half too", "reason": "That half remains with the existing follow-up row; this order's allocated carry-in is the worktree half." }
  ],
  "reopenWhen": "The umbrella classifier or the activation eligibility rules change."
}
```

## WO-072-D005

```json
{
  "id": "WO-072-D005",
  "date": "2026-10-11",
  "dispatch": "resume: next; executor self-review",
  "decision": "Fix both P2 design-review findings and the criteria worker's case-alias follow-up inside the target start path. Preflight the target path against the planned launchpad order path as well as existing roots. Refuse case-only sibling names on every host so the plan remains portable to case-insensitive volumes. Before creating either worktree, atomically retain an ignored target-starts.json receipt binding the pair, immutable bases and authority bytes. A repeat of the same start validates that receipt and the current paths, resumes activation/bootstrap/emit/check/registration, and removes the pending entry only after both registries are written. Existing commits and files stay in place; changed identities refuse. Failure output names the same start command as the recovery action.",
  "evidence": [
    "docs/evidence/WO-072/self-review.md: design improver findings 1 and 2 and criteria adversary finding 1",
    "scripts/worktree.mjs originally created the target before the planned launchpad path was checked and registered it only after preparation",
    "scripts/lib/target-worktrees.mjs targetStartPlan and retained target-start helpers",
    "scripts/test-target-worktree.mjs exact/case-only basename collisions and bootstrap/harness failure-and-retry fixtures"
  ],
  "rejected": [
    { "option": "Delete the target and branch after preparation fails", "reason": "That can discard work and violates the preserve-work boundary." },
    { "option": "Tell the operator only to rerun bootstrap", "reason": "Bootstrap does not perform target emit/check or write the two selection registries." },
    { "option": "Adopt arbitrary existing worktrees on retry", "reason": "Only the preflighted receipt, matching authority, matching branch and base ancestry justify continuation." }
  ],
  "reopenWhen": "A failure leaves a directory whose Git registration cannot be proven, or a partial target-bundle write fails the bundle's own ownership check. The same start retains both worktrees and names the condition; it never overwrites unowned output."
}
```

The first canonical target suite passed all five assertions but failed its
product-read guard because the fixture enumerated `packages/`, which also
contains excluded documentation. The fixture now derives its runtime package
list from the tracked lockfile. The corrected canonical run passed; no guard
was disabled and no case was reclassified to bypass it. Initial fixture setup
failures also showed that symlinked package `dist` entries were tracked and
rejected by code identity; the fixture copies built modules and shares the
installed dependency tree from its temporary parent instead. These are fixture
corrections, not new product authority or enforcement claims.

The first full review run also exposed an omitted runner registration field:
the new product suite lacked its `protects` description. The existing
`product suites describe protection` assertion identified `target-worktree`.
The executor stopped that unsuccessful run through the canonical gate stop,
added the concrete protection description and restarted the required checks.
The assertion and product classification remain unchanged; the stopped run
provides no passing full-gate claim.

## WO-072-D006 — Verification: fail on a launchpad-spelling regression; criteria 1 to 6 hold

```json
{
  "id": "WO-072-D006",
  "date": "2026-10-11",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on F1. All six criteria are met at code identity f4fd5f453da41c9bb9d40ba410327a8cdf7bfb5cdefe571f0715fe30cff3dd70, but the new selection check in scripts/resume.mjs breaks behavior main had. In a launchpad whose configuration declares repositories, or that holds a target registry, resume run from the launchpad's own checkout selects no order when the launchpad is spelled other than its physical identity: DOTLN_LAUNCHPAD through a symlink or in another letter case, or the scripts invoked through a case-variant path. At the activation base the same invocations selected the branch's order. F2 is a follow-up in the same surface: the no-selection outcome prints plain text and exits 0 under status --json.",
  "evidence": [
    "F1, base against current: the fixture of scripts/test-target-worktree.mjs, copied into session scratch, run once with this worktree's scripts and once with git archive HEAD scripts (HEAD is the activation base 0aee17a9, with no branch commit). The launchpad declares repositories.target; a non-target WO-999 is started by worktree start. status --json from the order launchpad's own checkout: with no override both select WO-999; with DOTLN_LAUNCHPAD as a symlink alias, as a case variant, or with the order launchpad's scripts called through a case-variant path, the base selects WO-999 and the current scripts print '<cwd> is not a registered target worktree; no order selected' with exit 0. The volume was case-insensitive.",
    "F1, cause: scripts/resume.mjs lines 1171-1186 compare git rev-parse --show-toplevel, which is physical, with repoRoot as findLaunchpad returns it. findLaunchpad resolves DOTLN_LAUNCHPAD lexically (scripts/lib/config.mjs line 800), and TOOL_ROOT keeps the invoked case. registeredOrder compares entry.launchpad with the same unnormalized launchpad (scripts/lib/target-worktrees.mjs line 199).",
    "F1, target route: from the registered target worktree, DOTLN_LAUNCHPAD naming the order launchpad through a symlink prints '<target> is not a registered target worktree; no order selected'. The target is registered, so the message is wrong. The physical spelling, which the start handoff prints, selects WO-999.",
    "F2: each no-selection output above was produced by status --json. stdout was the plain sentence and the exit status 0. harnessControl in packages/skeleton/src/harness-host.ts and packages/compiler/src/codex-continuation.mjs parse status --json with cwd at the launchpad root. Inference from those call sites: they reach this path only through F1's spelling cases. Other JSON callers outside the launchpad were not surveyed.",
    "Not a regression: from an unrelated directory the base also selected WO-999 and the current scripts select no order. Criterion 2 and the order's Design require that outcome, and WO-072-D003 records its scope."
  ],
  "rejected": [
    {
      "option": "Route F1 as a follow-up because every criterion is met and the outcome is fail-safe",
      "reason": "Product 07 §Verification review and attack routes a change that breaks behavior main had as blocking when a probe shows it. The base-against-current probe shows it."
    },
    {
      "option": "Judge criterion 2 unmet because an aliased DOTLN_LAUNCHPAD from the target selects no order",
      "reason": "Both declared routes hold with the launchpad's physical spelling, which the handoff prints. The order refuses variant spellings elsewhere (criterion 3). The defects are the wrong message and the self-launchpad regression, and F1 carries both."
    },
    {
      "option": "Treat the unrelated-directory no-selection as a regression",
      "reason": "Criterion 2 and the Design require an unlisted directory to select no order and say so."
    }
  ],
  "followup": "WO-072 resume: fix. (F1) Compare launchpad identities physically. The launchpad's own checkout selects its branch order whatever spelling DOTLN_LAUNCHPAD or the script path gives it, as at the base. From a registered target worktree, a non-physical spelling of the order launchpad either selects the order by physical identity or refuses naming the spelling. It never reports a registered target as unregistered. Add to scripts/test-target-worktree.mjs: from the launchpad, a symlink-alias DOTLN_LAUNCHPAD, a case-variant DOTLN_LAUNCHPAD and a case-variant script path; from the target, a symlink-alias DOTLN_LAUNCHPAD. Run the case variants only on a case-insensitive volume and record that with t.diagnostic. (F2) Under --json the no-selection outcome emits JSON or exits non-zero, never exit-0 plain text. Checks: npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair changes selection in scripts/resume.mjs or scripts/lib/target-worktrees.mjs, or findLaunchpad starts returning physical paths."
}
```

## WO-072-D007 — Repair launchpad identity and unselected JSON status

```json
{
  "id": "WO-072-D007",
  "date": "2026-10-11",
  "dispatch": "resume: fix; VER-001 F1 and F2",
  "decision": "Compare the selected launchpad's physical directory identity in the self-versus-target selection check and the registered target's launchpad binding. Extract the existing physical-pwd operation into directoryIdentity; retain every exact-spelling refusal in physicalDirectory for worktree creation. Keep findLaunchpad's precedence and document ownership unchanged. For an unregistered foreign directory, status --json now exits 1 with the explanation on stderr and no stdout; human-readable status and dispatch output keep the existing no-selection message. Complete the adjacent F2 repair as adjacent-0002, queue revision 10, after the F1 regression tests passed and an actor-attested steering check-in.",
  "evidence": [
    "docs/verifications/WO-072/VER-001.md F1 and F2; scripts/resume.mjs compared a physical Git top level with the lexical repoRoot, and scripts/lib/target-worktrees.mjs compared entry.launchpad with that same lexical spelling",
    "New bounded launchpad-spelling tests failed 2/2 before the source repair (2026-10-11T22:29:16.202Z): status --json returned the plain no-selection sentence. They passed 2/2 after the identity repair (2026-10-11T22:29:44.854Z).",
    "node scripts/harness.mjs bounded -- node --test scripts/test-target-worktree.mjs: 10 passed, 0 failed, 0 skipped; 27.822 seconds; finished 2026-10-11T22:30:43.512Z. The host exercised case variants and a volume alias. Tests include symlink chains and launchpad/target subdirectories beyond the quoted report cases, a self order with only a registry, aliased lifecycle dispatches with reports in the launchpad, and both no-selection JSON routes with unchanged control bytes.",
    "docs/evidence/WO-162/decisions.md D004 establishes that realpathSync.native alone can retain a volume alias; the existing physicalDirectory already uses /bin/pwd -P to disambiguate it",
    "docs/product/07-execution-guide.md document-resolution paragraph now states physical selection identity and the unregistered foreign-directory output contract"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves the reproduced loss of self-order selection and exit-zero non-JSON output." },
    { "option": "Change findLaunchpad globally or select it by walking from cwd", "reason": "Selection needs identity equality only; global resolution would change unrelated callers and cwd discovery violates the document-ownership boundary." },
    { "option": "Normalize only with realpathSync.native", "reason": "The cited directory observations show it does not remove every volume alias; the new volume-alias fixture exercises the existing physical-pwd rule." },
    { "option": "Relax physicalDirectory to accept aliases on creation", "reason": "This repair concerns navigation. Creation's pre-effect identity and containment checks must retain their exact-spelling refusals." },
    { "option": "Add a new successful null-selection JSON schema", "reason": "A nonzero refusal satisfies the recorded JSON contract and follows the existing selection-error convention without adding another success shape." }
  ],
  "reopenWhen": "Launchpad selection no longer uses physical Git directory identity, or a supported host cannot obtain physical pwd. Never fall back to lexical equality or infer a launchpad from the working directory."
}
```

The correction is specific: the original selection block treated a different
path spelling as a different launchpad. The verified rule is physical identity,
while the target branch and registry binding still select the order. The
repaired code accepts aliases for navigation and continues to refuse them before
worktree creation. Goal alignment matched this boundary; no new resolution
precedence, target role skill, release policy, or component API was introduced.

## WO-072-D008 — Verification: pass; VER-001 F1 and F2 repaired; the target's no-selection message is a follow-up

```json
{
  "id": "WO-072-D008",
  "date": "2026-10-11",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002 at code identity 4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414. All six criteria are met, and the repair closes VER-001 F1 and F2. Board one follow-up in the declared surface that breaks no criterion and no behavior main had. Run from a registered target worktree, main's own scripts (no DOTLN_LAUNCHPAD) print '<target> is not a registered target worktree; no order selected'. That sentence is false: main's target-worktrees.json lists the target, with its order launchpad as entry.launchpad, and the sentence does not name the launchpad that does select it.",
  "evidence": [
    "F1 self route, base against current: the same probe fixture (launchpad declaring repositories.target, non-target WO-999 started by worktree start), run once with this worktree's scripts and once with git archive HEAD scripts (activation base 0aee17a9). status --json from the order launchpad and from a subdirectory of it, with the launchpad given as DOTLN_LAUNCHPAD or as the script path, physical, symlink, chained symlink, trailing slash, upper-case and /System/Volumes/Data spellings: 24 of 24 select WO-999 in both runs, with identical output. The volume was case-insensitive.",
    "F1 target route, current: status --json from the registered target and from a subdirectory of it, with the same six spellings by both routes: 24 of 24 select WO-999. --work-order WO-998 through a symlink alias refuses 'target worktree selects WO-999; --work-order differs'.",
    "F2, current: from the clone's checkout, from a directory outside Git and from the main checkout, status --json exits 1 with empty stdout and the no-selection sentence on stderr, through the order launchpad's scripts and through a symlink DOTLN_LAUNCHPAD. Text status, next, verify and final-review print the sentence with exit 0. The order segment is byte-identical afterwards, and main has no WO-999 segment.",
    "Follow-up reproduction: the target probe fixture after worktree start. Run with cwd at the target, node <main>/scripts/resume.mjs status --json and no DOTLN_LAUNCHPAD: exit 1, '<base>/Targets/target-wo999 is not a registered target worktree; no order selected'. main's local/target-worktrees.json holds the entry; registeredOrder (scripts/lib/target-worktrees.mjs lines 208-210) returns undefined because entry.launchpad is the order launchpad, not main. The same output was possible at VER-001's subject: the repair did not touch that comparison's outcome for a different launchpad.",
    "Not routed: a registry entry hand-edited to record its launchpad in an alias spelling, or as another launchpad, selects no order. That fails safe on forged state, and the code writes only physical spellings (probe: every recorded launchpad and key is physical).",
    "scripts/test-target-worktree.mjs: 10 passed, 0 failed, 0 skipped (case variants and volume alias exercised) under node scripts/harness.mjs bounded, finished 2026-10-11T23:06:36.823Z"
  ],
  "rejected": [
    {
      "option": "Route the follow-up as blocking under VER-001 F1's repair rule ('it never reports a registered target as unregistered')",
      "reason": "That rule was scoped to a non-physical spelling of the order launchpad, and the repair meets it. Main is a different launchpad whose entry exists for close, so non-selection there is the designed outcome (WO-072-D002, D003). Only the sentence is wrong. It breaks no criterion and no behavior main had, so product 07 §Verification review and attack routes it as a follow-up."
    },
    {
      "option": "Treat the product 07 growth (672 added bytes against the order's 'at most 500 bytes' Cost estimate) as a finding",
      "reason": "Product 07 says a figure in an order is the planner's estimate, never a bound, and ceilings are planning's alone. The document check reported no ceiling advisory for product 07."
    }
  ],
  "followup": "WO-072 follow-up (operator flow, output accuracy). In scripts/lib/target-worktrees.mjs registeredOrder and the no-selection branch of scripts/resume.mjs run: when the selected launchpad's registry lists the working directory's Git top level with an entry.launchpad whose physical identity differs from the selected launchpad's, select no order and change nothing, as today, but say the worktree is registered to that launchpad and print the command the start handoff prints (DOTLN_LAUNCHPAD=<order launchpad> node <order launchpad>/scripts/resume.mjs status). Never select through that entry, and never call a listed target unregistered. Keep status --json's nonzero exit. Test from the target with main's scripts and no override. Checks: npm test -- --only target-worktree and npm run test:docs.",
  "reopenWhen": "Launchpad selection or registry entry ownership changes, or main's registry stops recording the order launchpad for close."
}
```

## WO-072-D009

<!-- integration refs/dotln/checkpoint/WO-072/10 -->

```json
{
  "id": "WO-072-D009",
  "date": "2026-10-11",
  "dispatch": "resume: final review; worktree integrate WO-072",
  "decision": "Integration took in nothing: the base and the fetched main are both 0aee17a9bfcf3012586915b5477ec9de19c56e49, origin/main names the same commit, and the branch carries no commit of its own. The helper checkpointed the work, retained its named stash, re-applied it without an authored conflict and regenerated projections only. Every acceptance claim is carried forward unchanged: VER-002's six criterion judgments at code identity 4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414, the repair of VER-001 F1 and F2, and the executor's passing npm test -- --review row at that identity. The identity is the same after integration and after npm run format. Release preparation keeps application v0.75.0 under the order's minor classification; no component package version changes and no edition re-mint is owed.",
  "evidence": [
    "refs/dotln/checkpoint/WO-072/10; named stash 965d6d1912275de3314086ee9bef2762dd557b18 (WO-072 integrate 2026-10-11) retained, never popped or dropped",
    "base 0aee17a9bfcf3012586915b5477ec9de19c56e49; upstream 0aee17a9bfcf3012586915b5477ec9de19c56e49; git ls-remote origin refs/heads/main names the same commit",
    "gateCandidates for npm test and npm run test:docs after integration: identity 4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414, equal to VER-002's and the executor's repair rows; one passing review npm test row, recorded 2026-10-11T22:59:12.601Z",
    "release preparation: WO-072 target v0.75.0 remains current; local tags end at v0.74.3 and origin lists no v0.75.0; package.json, package-lock.json and every packages/*/package.json are unchanged",
    "the order edits none of its named registered sources (scripts/lib/git.mjs, scripts/lib/paths.mjs, packages/skeleton/src/source-change-worktree.ts), so no deterministic re-mint or live feedback episode is owed; npm run publication:check reports both editions CURRENT",
    "affected checks on the integrated tree, 2026-10-11T23:24Z to 23:31Z: npm run publication:check pass; node scripts/harness.mjs check, 34 generated surfaces; npm run release -- check-surfaces --local pass; npm test -- --review 35 passed, 0 failed, 6.24 s, 1 fresh task (format), reusing the 22:59:12.601Z row"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, index and lock bytes as a new subject",
      "reason": "Reports, indexes and release text change no code identity; product 07 §Independent workflows and integration makes integration bookkeeping no finding."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-11. Original base: `0aee17a9bfcf3012586915b5477ec9de19c56e49`.
Fetched main: `0aee17a9bfcf3012586915b5477ec9de19c56e49`. Checkpoint: `refs/dotln/checkpoint/WO-072/10`.
Named stash retained: `965d6d1912275de3314086ee9bef2762dd557b18` (WO-072 integrate 2026-10-11).
Resolved projections: none.
Release preparation: WO-072 target v0.75.0 remains current. Files changed: docs/evidence/WO-072/meta.json, docs/final-reviews/WO-072/PR.md. Meter snapshot: docs/evidence/WO-072/meta.json, 4103 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's six criterion judgments and the repair of VER-001 F1 and F2, all at code identity `4c2df81b…`, which the integrated tree keeps; the executor's passing review row at that identity.
Authored conflicts observed: none.
Affected checks executed on the integrated tree: `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local` and `npm test -- --review`, each passing (the evidence list above has the times).

## WO-072-D010 — Final review: pass FINAL-001; board the target close's ignored-material refusal, which lists every file and names no remedy

```json
{
  "id": "WO-072-D010",
  "date": "2026-10-11",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass final review of WO-072 at code identity 4c2df81b24c0292f38654a02395d4207b3e9e9349301a1d56c5200e04903a414 with no source change. All six criteria hold at the integrated subject, the verification sequence VER-001 (fail), repair, VER-002 (pass) is complete, and this review's own bounded run of scripts/test-target-worktree.mjs passed 10 of 10 with the case variants and the volume alias exercised. Board one follow-up in the declared surface that breaks no criterion and no behavior main had: release close for a target whose worktree holds ignored material outside the bundle manifest refuses, as D003 decided, but the refusal lists every ignored file by path and names no remedy, while git worktree remove removes the same worktree. A target with installed dependencies, the ordinary state of a code repository, cannot close without a hand cleanup the message does not describe.",
  "evidence": [
    "Probe under node scripts/harness.mjs bounded, 2026-10-11T23:26:45Z to 23:26:49Z, built from the suite's own fixture: after worktree start, the target commits a .gitignore ignoring deps/ and holds deps/pkg/a.js, b.js and c.js; git status --porcelain is empty; both wo-999 branches are merged. release close WO-999 --dry-run and --publish each exit 1 with 'target has ignored material; source retained: deps/pkg/a.js, deps/pkg/b.js, deps/pkg/c.js'. Both worktrees, the bundle and the ignored files remain. git -C <clone> worktree remove <target> then exits 0 and removes the worktree.",
    "scripts/lib/target-worktree-close.mjs lines 85 to 96: git ls-files -z --others --ignored --exclude-standard without --directory, filtered by the manifest's owned paths and joined into the error, which names no remedy",
    "WO-072-D003 decided to preserve unexpected ignored material by refusing, reopening on retained-material reconciliation; VER-001 probe D varied tracked dirt (an uncommitted file), and neither verification varied ignored material",
    "Class escape: VER-002 lists the repair diff as target-worktrees.mjs, resume.mjs, the test file and product 07, so this module is unchanged since VER-001's subject and the defect was present in both verified subjects; criterion 4's attack with the real corpus instead of a fixture and the operator-flow lens were in verification's instructed scope"
  ],
  "rejected": [
    {
      "option": "Fail the review and route the message to repair",
      "reason": "Criterion 4 is judged against its declared set and holds, and main had no target close. Product 07 §Verification review and attack routes a defect in the declared surfaces that breaks no criterion as a follow-up."
    },
    {
      "option": "Change the message or the ls-files flags in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it (product 07 §Independent workflows and integration)."
    },
    {
      "option": "Reopen D003 here so the close removes ignored material as Git does",
      "reason": "D003's conservative refusal protects unreviewed local state. Whether a target close may remove ignored material is planning's choice under D003's own reopening condition; the follow-up names both routes."
    }
  ],
  "followup": "WO-072 follow-up (operator flow, teardown refusal). In scripts/lib/target-worktree-close.mjs closeTargetWorktree: when the target holds ignored material outside the bundle manifest, keep D003's refusal and retention, but list an ignored directory once (git ls-files --others --ignored --exclude-standard --directory) and name the remedy: move or remove the listed paths, then rerun npm run release -- close WO-NNN --publish. Planning may instead reopen D003 and let the close remove ignored material as git worktree remove does; record that as its own decision. Reproduce with the target fixture of scripts/test-target-worktree.mjs: commit a .gitignore ignoring deps/ in the target, write files under deps/pkg/, merge both wo-999 branches, run release close WO-999 --publish. Add the case to criterion 4's fixture. Checks: npm test -- --only target-worktree and npm run test:docs.",
  "reopenWhen": "The close's ignored-material rule or the bundle manifest's owned-path set changes, or a real target close refuses on ignored material."
}
```

Register rows whose reopening condition this order met, both re-deferred by
name in FINAL-001's register section: FUP-a5c6ac8cb40bd52a (WO-185-D016),
because the order's design adds the `clone` action to `scripts/worktree.mjs`'s
dispatch with its own argument check, which also runs after
`mainWorktree(toolRoot)`, while the `publish --target` ordering the row names is
unchanged; and FUP-1315c82ef74fb832 (WO-187-D052), because this order edits
`scripts/resume.mjs`, though only the selection block in `run`, and not the
verify briefing's order of operations that item 1 names. A fix for either is
behavioral code the reviewer may not write and certify.

Document gate at the filed report: `npm run format`, then `npm run test:docs`,
passed 35 of 35 with 35 fresh tasks in 100.55 s (2026-10-11T23:41:47Z to
23:43:28Z). Two earlier runs (23:39:22Z and 23:40:20Z) failed `release-surfaces`
on `github-body-profile`: the release notes held two angle-bracket placeholders
in a code span, which the check reads as raw HTML; the placeholders were reworded
in `RELEASE-NOTES.md` and `PR.md`, and the seventeen dependent suites then ran.
The result transition recorded the pass at 23:43:59Z with the tree unchanged
since that run. FINAL-001's Executed checks table still shows that gate row as
pending and criterion 6 says the gate ran inline, because the edit meant to fill
them in was aborted by a shell quoting fault before the transition bound the
report's hash; a filed report is never edited, so this paragraph is the record.
