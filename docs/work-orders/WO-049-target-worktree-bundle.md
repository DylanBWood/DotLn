# WO-049 — Target-worktree harness bundle: emit a governed bundle into a worktree that is not DotLn, importing the launchpad's immutable runtime snapshot by absolute path, as untracked files under the target's local exclude, with hooks for Claude Code and an instruction block for both harnesses (version assigned at activation)

**Model:** any capable model for the emitter and fixtures. The live smoke
(criterion 6) needs the actual harnesses, run by the operator from a
terminal outside the sandbox, and states harness version, model and effort
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any. Recommendations
(WO-132); attestations record what actually ran.
**Release classification:** minor. It adds a second profile kind to the
`harness-v1` lowering, an import-root option and the target emit, check and
remove paths; no unit predicate, hook decision semantics or envelope
semantics change for the Contributor bundle, which stays byte-identical.
Assigned at activation under the standing opt-out default.
**Cost:** adds one profile, one emit/check/remove path and a manifest per
target that WO-052's host writes per episode with no operator step; about
5 s of fixture wall-clock in the compiler and skeleton suites; one
operator-run live smoke of a few minutes, recorded once. Removes nothing that
exists today, because no target flow exists to replace; the justification is
the critical-path gate it unblocks: WO-052, WO-072 and WO-075 hard-depend on
it in the critical-path graph and WO-053 cannot run without it. Context bytes
and tokens are unmeasured; the executor records entry and handoff usage when
available and `unknown` otherwise.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
D1), cut at the operator's same-day correction from WO-033 phase 2, which is
recorded as an umbrella. Redesigned at the mandatory R1 checkpoint by the
2026-09-16 planning pass from the writing-worker record rows C-W3, C-W4,
C-W5, C-W6, C-W7, C-W9, X-W3, X-W4, X-W5, X-W6 and X-W7
([writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md);
[the R1 replan document](../planning/r1-replan-2026-09-16.md) §1).
Planner-synthesized draft; captures and hashes in the ledger sections of
both dates. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-042 merged (a bundle emitted into a target carries an
envelope no support can widen and grants with provenance); WO-044 merged
(the rows above, satisfied at `v0.17.7`); WO-039 merged (`harness emit` and
`check`, satisfied at the `33e2c25` merge). All three are closed.
**Recommended placement:** lane pair with WO-051, whose surfaces are
disjoint (`worker-protocol.ts`, `worker-transport.ts`,
`execution-environment.ts`). After WO-133 in reading order because WO-133
edits the same hook template; this order integrates on WO-133's merge. It
edits `packages/compiler/src/harness.ts`, `scripts/lib/harness.mjs`,
`scripts/harness.mjs`, `packages/skeleton/src/loadouts/contributor.ts` (the
target profiles) and their fixtures. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-042",
    "relation": "satisfied-by-close",
    "reason": "a bundle emitted into a target must carry an envelope no support can widen and grants with provenance"
  },
  {
    "workOrderId": "WO-044",
    "relation": "satisfied-by-close",
    "reason": "the observed rows this bundle is designed from: target hooks and settings apply in Claude print mode, no hook fires in Codex exec mode, and neither sandbox confines a sibling write"
  },
  {
    "workOrderId": "WO-039",
    "relation": "satisfied-by-close",
    "reason": "harness emit, check and the runtime pins it extends"
  },
  {
    "workOrderId": "WO-133",
    "relation": "reference-only",
    "reason": "edits the same generated prelude; this order integrates on its merge"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Harness compiler v1;
03-architecture.md §Platform and instance boundary (a target never sees a
DotLn file in a commit) and §Agent enablement skills; 01-principles.md
Principle 16 (workplace camouflage generalized); 09-audit-resilience-privacy.md
§Privacy and minimization (paths reduce to shapes); 07-execution-guide.md
§Discipline (machinery stand-down: the Contributor's advisory fallback is
that bundle's choice, not a target's); `packages/compiler/src/harness.ts`
(`HarnessProfile.runtime`, the generated prelude and its relative imports at
the `runHarnessHook` line, `lowerToHarness`); `scripts/lib/harness.mjs`
(`harnessInstallation`: the pinned runtime files and the content-addressed
snapshot; `preserveHarnessRuntime`; `emitHarness`; `checkHarness`);
`scripts/harness.mjs` (`--out`); `packages/skeleton/src/harness-host.ts`
(`harnessRoot`, the state directory, `protocolRefusal`);
[writing-worker-smoke-2026-09-14.md](../discovery/writing-worker-smoke-2026-09-14.md)
rows C-W3 to C-W9, X-W2 to X-W7; `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 2 (the umbrella's original wording).

**Objective:** `npm run harness -- emit --target <worktree> --runtime-root <launchpad>`
writes a `target-worker` bundle into a foreign Git worktree: Claude Code
hooks whose imports are absolute `file://` URLs into the launchpad's
immutable runtime snapshot, a `.claude/settings.json` carrying the hook
registration and the deny list, the instruction block as `CLAUDE.local.md`,
and the manifest. Every emitted path is appended to the target's local
exclude, so `git status` never shows it and a `git add -A` never stages it;
no state is written under the target; `harness check --target` verifies the
installed bytes; `harness remove --target` deletes exactly the manifest set;
a target hook whose runtime is unavailable refuses, never delegates; the
Codex profile receives the instruction block and manifest only, its
governance being WO-051's launch profile.

**Observed gap (dated 2026-09-16, `main` at `b7914ed`, v0.22.0):**

- Every generated hook imports `../../<snapshot>/packages/skeleton/dist/src/...`
  relative to its own file (the generated prelude in `harness.ts`), so a
  bundle emitted anywhere but this checkout fails at import.
- `emitHarness(root)` writes the Contributor set (nine hooks, six skills in
  two trees, the manifest and the `CLAUDE.md` block), refuses without the
  hand-written clean-room floor in `CLAUDE.md`, and knows nothing about a
  target's exclude file, a reduced profile or a state root outside the tree.
- After WO-132 the Contributor prelude's catch emits an advisory and
  delegates to the host; a print-mode worker under `--permission-prompts
  none` (C-U2: requests are auto-denied without a terminal) must not
  inherit a fallback that leaves its guard silent.
- The record: C-W3, C-W4, C-W5, C-W7 and C-W9 observed for Claude print
  mode with `--setting-sources project,local` (the probe wrote the deny rule
  to the scratch project's `.claude/settings.json`); X-W3, X-W4, X-W5 and
  X-W10 unavailable for Codex (no hook event fired); C-W6 and X-W6 show
  neither harness sandbox confined a sibling write under the OS temporary
  directory. Containment is therefore the hook's write check, the Codex
  named profile (X-W2) and the host's diff check, never the sandbox.

**Design (scope discipline):**

- A second profile kind in the Contributor loadout, `target-worker-v1`, one
  per harness: the permission guard with the envelope from the compiled
  build and explicit grants (WO-042) and the worktree as its writable
  surface; writer isolation (one writer per target worktree); the attribution
  pre-check on commit commands; `PreToolUse` only, no observers, no `Stop`
  or `SessionStart` obligations, no skills. The Codex profile emits no hooks
  (X-W3, X-W4) and carries the instruction block and manifest.
- `HarnessProfile.runtime.importRoot` is an absolute path supplied at emit
  time and never committed or written into the manifest as a path. When
  present, the prelude imports `new URL("file://…")` for the pinned runtime
  files from the launchpad's content-addressed snapshot
  (`.runtime/harness/<hash>/`), which a launchpad rebuild never changes.
  The Contributor emit keeps relative imports, so the committed bundle is
  byte-identical.
- The target prelude's catch returns `deny` naming the runtime, never an
  advisory.
- State: the target hooks' journal and writer reservation live under the
  launchpad's local lane, `docs/control/local/harness/targets/<id>/`, where
  `<id>` is a digest of the target worktree's real path; nothing is written
  under the target.
- Exclude: each emitted path is appended as an anchored line to the file
  `git rev-parse --git-path info/exclude` names, together with `/.dotln/`
  (the host's scratch directory for WO-051's commit-message file); lines are
  removed by `--remove`. Emit refuses when a path it would write already
  exists and is not manifest-owned, naming the path; merging into a target's
  existing `.claude/settings.json` is not this order's.
- The in-target manifest carries relative paths and hashes only; the
  launchpad-side receipt carries the runtime hashes and the import root
  reduced to a shape. A fixture asserts no absolute path appears in any
  emitted file except the hook import lines, and every emitted file is in
  the exclude set.
- **Declined alternatives, recorded:** copying the runtime into the target
  (the starter's pinned kit runtime, WO-075, is the starter's answer; a
  target must not carry DotLn bytes); committing the bundle to the target
  (camouflage); `npm link` or a published package (publication is a separate
  decision); Codex hooks (unavailable rows); merging into an existing
  settings file (unobserved; refused instead).

**Deliverables:** the profile kind and the import-root option; the target
emit, check and remove paths with exclude handling; the state-root
redirection; fixtures over a scratch non-DotLn repository; the live smoke
record; the write-backs below.

**Acceptance criteria (all required)**

1. A fixture emits into a scratch Git repository outside this checkout, once
   with no `.claude/` directory and once with an unrelated file already
   under it; `git status --porcelain` there is empty before and after; every
   emitted file is listed in the manifest and as one anchored exclude line;
   `harness check --target` passes and refuses a one-byte drift, a missing
   file and a missing exclude line; emit refuses a pre-existing
   `.claude/settings.json` it does not own, naming it.
2. A generated target hook, invoked with a synthetic `PreToolUse` payload,
   imports the launchpad runtime through the absolute snapshot root and
   returns the decision `feedbackBoundary` returns on the same facts: no
   decision for a write inside the worktree, `deny` for a remote effect,
   `deny` for a second writer; with the runtime root removed it returns
   `deny` naming the runtime, never an advisory.
3. `harness remove --target` deletes exactly the manifest-listed files and
   exclude lines; the unrelated file from criterion 1 survives; a before and
   after tree diff proves it.
4. The committed Contributor bundle is byte-identical to the activation base
   (relative imports preserved); `harness check` passes.
5. After a fixture episode of several hook invocations, the target tree
   equals its post-emit state and the journal and reservation appear under
   the launchpad lane keyed by the target; no path under the target carries
   an absolute path except the hook import lines.
6. A recorded live smoke, operator-run outside the sandbox in a scratch
   foreign worktree with the real emitted bundle, `--permission-prompts none`
   and `--setting-sources project,local`, shows the target hook refusing a
   denied effect and admitting the allowed write in Claude print mode, and a
   Codex exec launch that echoes the instruction block with no hook event,
   with paths reduced to shapes.
7. Write-backs land: 02 §Harness compiler v1 (the target profile kind and
   its fail-closed prelude), 03 §Platform and instance boundary (one
   sentence), `scripts/harness.mjs` usage, skeleton README, WO-033's
   umbrella note naming this order as its emit half, the decisions file.
8. `npm test` green; `git diff --check` clean; no new dependency; fresh
   artifact-identity evidence and regenerated pins because the compiler
   moved.

**Evidence gate:** the fixture transcripts; the tree diffs; the live smoke
record; `npm test` once at final review.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** registered repositories, the configuration root, the
launchpad export, overlays and sync (the WO-033 umbrella's other children);
the source-change transport (WO-051); merging into a target's existing
settings; Codex hooks; a `.git/hooks` commit-message install in the target
(attribution is the `PreToolUse` commit-command check); any change to unit
predicates.

**Operator-review assumptions**

1. An absolute path inside a file that is never Git-visible is acceptable;
   manifests and receipts carry only shapes.
2. The live smoke is operator-run outside the sandbox.
3. A target that already carries `.claude/settings.json` is refused by this
   order; merging is later work with its own observed rows.
4. Anchored exclude lines in the repository's shared `info/exclude` are
   acceptable; they name only bundle paths.
