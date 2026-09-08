# WO-049 — Target-worktree harness bundle: emit a governed bundle into a worktree that is not DotLn, importing the launchpad's pinned runtime by absolute path, under the target's local exclude (version assigned at activation)

**Model:** any capable model for the emitter and fixtures. The live refusal
smoke needs the actual harness, run by the operator from a terminal outside
the sandbox, and must state harness version, model and effort
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds an emit option and a profile field
to the `harness-v1` lowering and the `harness` command; no unit, hook
predicate or envelope semantics change. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
D1), cut at the operator's same-day correction; it carves the target-worktree
emit half out of WO-033 phase 2, which is recorded as an umbrella. Planner-
synthesized draft; captures and hashes in the ledger section of that date.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-042 merged (a bundle emitted into a target must carry an
envelope no support can widen and grants with provenance); WO-044 merged (the
observed rows for hooks, settings and instruction surfaces in a foreign
worktree under the worker's launch mode); WO-039 merged (`harness emit` and
`check`; satisfied at the `33e2c25` merge).
**Recommended placement:** after WO-044's record and the replan checkpoint it
triggers; it edits `packages/compiler/src/harness.ts`, `scripts/lib/harness.mjs`,
`scripts/harness.mjs` and their fixtures. A recommendation, not a dependency
token.

**Cites (read these sections):** 02-domain-model.md §Harness compiler v1;
03-architecture.md §Platform and instance boundary (a target never sees a
DotLn file in a commit) and §Agent enablement skills; 01-principles.md
Principle 16 (workplace camouflage generalized); 09-audit-resilience-privacy.md
§Privacy and minimization (paths reduce to shapes); `packages/compiler/src/harness.ts`
(`HarnessProfile.runtime`, the hook text's relative imports, `lowerToHarness`);
`scripts/lib/harness.mjs` (`emitHarness`, `checkHarness`), `scripts/harness.mjs`
(`--out`); `docs/discovery/writing-worker-smoke-<date>.md` (WO-044's rows);
`docs/work-orders/WO-033-compiled-starter-export.md` §Phase 2 (the umbrella's
original wording).

**Objective:** `npm run harness -- emit --out <target-worktree> --runtime-root <launchpad>`
writes the build's hooks, settings, skills and marked block into a foreign
worktree so that the hooks import the launchpad's pinned built runtime by an
absolute `file://` path, every emitted file sits under the target worktree's
local exclude (never Git-visible), the manifest records the runtime files'
hashes and the root as a shape, `harness check --out` verifies the installed
bytes there, and removing the worktree leaves the target repository clean.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Every generated hook imports `../../packages/skeleton/dist/src/...`
  relative to its own file (`harness.ts:348`), so a bundle emitted anywhere
  but this checkout fails closed with "built adapter unavailable".
- `harness emit --out <dir>` exists (`scripts/harness.mjs:62-72`) but writes
  the relative imports and knows nothing about a target's exclude file or
  instruction surface.
- WO-033 phase 2 planned this inside a four-phase epic behind a configuration
  root and registered repositories that the first external source change
  does not need.

**Design (scope discipline):**

- `HarnessProfile.runtime` gains an optional `importRoot` (absolute path,
  supplied at emit time, never committed); when present, the hook text
  imports `new URL(<file url>)` strings for the five pinned runtime files and
  `assertHarnessRuntime` reads the pins from that root. The Contributor emit
  into this repository keeps relative imports, so the committed bundle is
  byte-identical.
- `emitHarness` into a target writes under `.claude/` and the instruction
  surface WO-044 observed, appends every emitted path to
  `.git/info/exclude` (or the worktree's local exclude), and writes the
  manifest beside them; `checkHarness --out` compares; a `--remove` option
  deletes only manifest-listed files and their exclude lines.
- The manifest records `importRoot` as `<launchpad>` and the runtime files'
  hashes; a fixture asserts no absolute path appears in any file the target
  could commit.
- **Declined alternatives, recorded:** copying the runtime into the target
  (the starter's pinned kit runtime, WO-075, is the starter's answer; a target
  must not carry DotLn bytes); committing the bundle to the target (camouflage); `npm link`
  or a published package (publication is a separate decision).

**Deliverables:** the profile field and emitter changes; the exclude and
remove handling; fixtures over a scratch non-DotLn repository; the live
refusal smoke record; the write-backs below.

**Acceptance criteria (all required)**

1. A fixture emits into a scratch Git repository outside this checkout;
   `git status --porcelain` there is empty before and after; every emitted
   file is listed in the manifest and the local exclude; `harness check --out`
   passes and refuses a one-byte drift and a missing file.
2. A generated hook in the target, invoked with a synthetic payload, imports
   the launchpad runtime through the absolute root and returns the same
   decision `feedbackBoundary` returns on the same facts; with the runtime
   root removed it fails closed.
3. `--remove` deletes exactly the manifest-listed files and exclude lines and
   nothing else, proven by a before/after tree diff.
4. The committed Contributor bundle is byte-identical to the activation base
   (relative imports preserved); `harness check` passes.
5. A recorded live smoke, run by the operator in a scratch foreign worktree,
   shows the target's generated hook refusing a denied effect in the launch
   mode WO-044 observed, with paths reduced to shapes.
6. Write-backs land: 02 §Harness compiler v1 (the target emit), 03
   §Platform and instance boundary (one sentence), `scripts/harness.mjs`
   usage, ledger entry; WO-033's umbrella note names this order as its
   phase-2 emit half.
7. `npm test` green; `git diff --check` clean; no new dependency; fresh
   artifact-identity evidence if the compiler package moved.

**Evidence gate:** the fixture transcripts; the tree diffs; the live smoke
record; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** registered repositories, the configuration root, the
launchpad export, overlays and sync (the WO-033 umbrella's other children);
the source-change transport (WO-051); any change to unit predicates.

**Operator-review assumptions**

1. An absolute path inside a file that is never Git-visible is acceptable;
   the manifest and receipts carry only shapes.
2. The live smoke is operator-run outside the sandbox.
