# WO-206 — Source-writer object-store protection: a writer cannot change or delete existing shared repository objects because it writes into a private object store the host imports from after admission, proven against the retained counterexample with crash recovery and concurrent maintenance (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. The source writer's object authority
changes: a private object store per episode, a host-owned import after
admission, and writer access without the shared objects directory; the
writer protocol's commit step keeps its shape. Assigned at activation under
the standing opt-out default.
**Cost:** adds a private object directory per writer episode in
`packages/skeleton/src/source-change-worktree.ts` (created with the
worktree; the shared store reachable read-only through
`GIT_ALTERNATE_OBJECT_DIRECTORIES`), writer access that excludes the shared
`objects/` directory in `packages/skeleton/src/worker-transport.ts`
(`codexWriterAccess` and its Claude counterpart), a host-owned import of the
admitted candidate's objects into the shared store followed by the ref
update in `packages/skeleton/src/source-change-host.ts`, an inventory of the
shared refs and alternates kept as today in `sharedState()`, the retained counterexample
(`docs/evidence/WO-112/shared-object-counterexample.mjs`) run as a case, and
the matrix in
`packages/skeleton/test/source-change-integrity.test.ts`,
`source-change-confinement.test.ts` and `source-change-host.test.ts`.
Removes the boundary WO-112 D033 left: a writer that can write existing
shared objects while the durable observer inventories none of their bytes,
and the narrowed claim (unchanged shared refs and alternates only) that
stands in for shared-repository preservation. Wall-clock: one `git fetch`
from the private store per admitted candidate (measured on the vertical
fixture); the skeleton suite grows by the matrix. Re-mints:
`source-change-worktree.ts`, `source-change-host.ts` and
`worker-transport.ts` are registered evidence sources
(`scripts/lib/evidence-sources.mjs` lines 50, 59 and 88), so the editions
they stale are re-minted deterministically; none is a feedback-judged file,
so no live feedback episode; `worker-transport.ts` is a declared source of
the `harness-fixtures` machinery suite (`scripts/test-runner.mjs` lines 131
and 165), so `npm test -- --review` runs before handoff. Tokens and context
bytes are unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (c) of the
three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`).
Source: WO-112 D033 and the register row FUP-fadd2376e82a909e, whose
followup asks planning to compare a private non-shared writer object store
with host admission against a files-only writer with a host-owned commit;
this order records that comparison in its Design and builds the first. The
executed counterexample (an independent sibling commit's unique blob deleted
by the writer after the candidate completed, with the observer reporting
`observed`) is D033's second evidence item. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: scratch repositories only.
**Depends on:** WO-112 merged (closed: the writer, worktree and host this
order changes); WO-204 and WO-205 in sequence before it (both edit
`source-change-host.ts`; this order rebases on their merges; no typed edge,
since neither is a prerequisite of the design).
**Recommended placement:** alone, after the WO-082/WO-205 pair and before
WO-192 and WO-083: WO-083's activation preflight requires this boundary
disposed by a closed order before the run touches the operator's
repository. This order edits three skeleton sources and three skeleton
tests and writes product 03; no queued order edits them after WO-205. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-112",
    "relation": "satisfied-by-close",
    "reason": "the source writer, worktree and host whose object authority this order changes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports and §Session
lifecycle & resilience (the writer's confinement and recovery);
09-audit-resilience-privacy.md (the record vocabulary the import step's
events join); `docs/evidence/WO-112/decisions.md` D027 (concurrent
shared-repository activity refused), D033 (the boundary, the three rejected
options and the followup), D034 (VER-003 F1, the commit-graph import
hazard); `docs/evidence/WO-112/shared-object-counterexample.mjs` (the
retained probe); `packages/skeleton/src/worker-transport.ts` (`codexWriterAccess` at
line 993 and the Claude writer access beside it);
`packages/skeleton/src/source-change-worktree.ts` (worktree creation and
`sharedState()` at line 239); `packages/skeleton/src/source-change-host.ts`
(admission, `checkIntegrity` at line 661, the publish step);
`packages/skeleton/src/worker-protocol.ts` (the writer's commit step);
`packages/skeleton/test/source-change-integrity.test.ts`,
`source-change-confinement.test.ts` and `source-change-host.test.ts`.

**Objective:** A source writer commits into a private object store created
with its worktree, reading the shared store through a read-only alternate
and holding no write access to the shared `objects/` directory; after
admission (integrity, surfaces, after-tests) the host imports the
candidate's objects into the shared store and only then updates refs; the
retained counterexample (a writer deleting or corrupting an existing shared
blob) fails against the writer's access and the shared blob survives;
candidate commits still publish; a host crash between import and ref
update recovers idempotently; and a concurrent `git gc` or `repack` on the
shared store during an episode neither loses data nor lets the host report
an unjustified success.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`; diagnosed 2026-10-06 in WO-112 D033):**

- `codexWriterAccess` (`worker-transport.ts` line 993) grants write access
  to the common objects directory; `sharedState()`
  (`source-change-worktree.ts` line 239) records only the common path, refs
  and the exact alternates bytes, never object bytes.
- The executed counterexample: an independent sibling commit's unique blob,
  deleted by the writer after the candidate completed, left the status
  `observed` and `SourceChangeObserved` recorded while `git cat-file` could
  no longer read the blob (D033, bounded 1.792 s, 2026-10-06T15:40:53Z). The
  probe is retained as `docs/evidence/WO-112/shared-object-counterexample.mjs`;
  this order runs it as a case.
- WO-112 narrowed its claim to unchanged shared refs and alternates; nothing
  claims preservation of existing shared objects today, and WO-083's
  activation preflight requires this boundary disposed by a closed order
  before the operator's repository is touched.
- D027 refuses concurrent shared-repository activity as a recorded tradeoff;
  maintenance concurrency (gc, repack) during an episode has no case.

**Design (scope discipline):**

- **The comparison D033 asked for, recorded here.** A private non-shared
  writer object store with host admission keeps the writer protocol's commit
  step, keeps attribution and crash recovery where they are, removes writer
  authority over existing shared objects by construction (the writer's
  process never holds a writable handle on the shared store), and costs one
  host-side import per admitted candidate. A files-only writer with a
  host-owned commit removes the same authority but moves committing,
  attribution, interruption evidence and recovery into the host, changes the
  writer protocol for both transports, and needs live harness qualification
  (D033's second rejected option). The first is chosen; the second is the
  reopening alternative if the import proves unsound.
- **Private store, read-only alternate.** The worktree is created with
  `GIT_OBJECT_DIRECTORY` set to a private directory under the episode's
  confinement and `GIT_ALTERNATE_OBJECT_DIRECTORIES` naming the shared
  store, whose directory the writer access does not include; the writer's
  commits land in the private store.
- **Host-owned import after admission.** Once admission passes, the host
  runs `git fetch` from the private store into the shared store under the
  host's writer-resistant Git interpretation (WO-205's argument set, with
  the commit graph off so an imported graph cannot steer later reads),
  verifies the imported commit's tree equals the admitted tree, and only
  then updates the refs the publish step moves today. A failed import is a
  typed stop naming the object.
- **Idempotent recovery.** The import is repeatable: a crash after import
  and before the ref update recovers by re-importing (a no-op) and updating
  the ref; a crash before import recovers by importing from the retained
  private store, which the episode's confinement keeps until the receipt is
  written.
- **Maintenance concurrency.** A `git gc --prune=now` or `git repack -ad`
  on the shared store during an episode cannot remove the candidate's
  objects (they are not in the shared store until import) and cannot lose
  existing objects to the writer; after import the host re-verifies the
  admitted commit's objects before success.
- **Inventory stays bounded.** No repository-size object scan (D033's first
  rejected option); `sharedState()` keeps recording the common path, refs
  and alternates.
- **Declined alternatives, recorded:** hashing every loose and packed object
  (unbounded, fights repack); moving committing into the host now (the
  comparison above; reopen if the import is unsound); keeping the broad
  shared-state claim with a NoOp (the operator's direction is the action).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. Counterexample first: run the retained probe at the base,
   `node scripts/harness.mjs bounded -- node docs/evidence/WO-112/shared-object-counterexample.mjs`,
   and record its result; then `packages/skeleton/test/source-change-integrity.test.ts`
   gains the same scenario as a case (an independent sibling commit, a
   writer episode that deletes the sibling's unique blob after the candidate
   completes, assertion that the blob survives and the episode does not
   report `observed`); it fails at the base. Check: `npm run build && node
   --test packages/skeleton/dist/test/source-change-integrity.test.js`.
2. `packages/skeleton/src/source-change-worktree.ts`: worktree creation sets
   the private `GIT_OBJECT_DIRECTORY` under the episode's confinement and
   `GIT_ALTERNATE_OBJECT_DIRECTORIES` to the shared store; the private
   store's path joins the worktree's recorded state; `sharedState()`
   unchanged. Check: a case that commits in the worktree and finds the
   objects in the private store and not in the shared one.
3. `packages/skeleton/src/worker-transport.ts`: `codexWriterAccess` (line
   993) and the Claude writer access exclude the shared `objects/` directory
   and include the private store; the confinement cases in
   `source-change-confinement.test.ts` assert a write to the shared store
   from the writer is refused. Check: `node --test
   packages/skeleton/dist/test/source-change-confinement.test.js`.
4. `packages/skeleton/src/source-change-host.ts`: after admission, import
   with `git fetch <private-store-worktree> <candidate>` under the
   writer-resistant argument set, verify the imported tree equals the
   admitted tree, record `CandidateImported { commit, objects }`, then the
   existing ref update; a failed import is `SourceChangeRefusal("import",
   object)`. Check: the publish cases in `source-change-host.test.ts` pass
   with the import step, and the counterexample case of step 1 passes.
5. Recovery: cases for a crash after import before the ref update
   (re-import is a no-op, the ref is updated once) and a crash before import
   (import from the retained private store), using the host's existing
   recovery entry (`recoverTermination`, `checkIntegrity`). Check: `node
   --test packages/skeleton/dist/test/source-change-host.test.js`.
6. Maintenance concurrency: cases that run `git gc --prune=now` and `git
   repack -ad` on the shared store between the writer's commit and the
   import, and between the import and the ref update, asserting no object
   loss and no success without the re-verification passing. Check: the same
   suite.
7. The vertical's recovery probe passes at the repaired subject:
   `node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`;
   the two transports' confinement cases pass.
8. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Session lifecycle & resilience": the writer's object authority (a
   private store, a host-owned import after admission), replacing the
   narrowed shared-state sentence WO-112 left, in place;
   `docs/evidence/WO-206/decisions.md` (the comparison recorded as a
   decision with the reopening alternative); the deterministic re-mints of
   the editions the three sources stale; `node scripts/lineage.mjs index
   --check`; `node scripts/check-publication.mjs --print-locks`;
   `npm run publication:check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-206/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the committed counterexample; the private object store;
the writer access without the shared store; the host-owned import and its
record; the recovery and maintenance cases; the write-backs below.

**Acceptance criteria (all required)**

1. The D033 counterexample, committed as a case, fails at the base and
   passes at the repaired subject: the independent sibling blob survives the
   writer's deletion attempt, which is refused by the writer's access, and
   the episode does not report `observed`.
2. A writer's commits land in the private object store and not in the shared
   one; a write to the shared `objects/` directory from the writer is
   refused for both transports (confinement cases).
3. After admission the host imports the candidate's objects, verifies the
   imported tree equals the admitted tree and records `CandidateImported`
   before updating any ref; an import whose tree differs is a typed stop
   naming the object and moves no ref; the candidate publishes as before.
4. A crash after import and before the ref update, and a crash before
   import, each recover with one ref update and no duplicate import record
   (fixture).
5. `git gc --prune=now` and `git repack -ad` on the shared store during an
   episode lose no object and produce no success without the
   re-verification passing (fixture); the vertical's recovery probe passes.
6. Write-backs land, each in place with no dated paragraph: product 03
   §Session lifecycle & resilience (the object-authority sentence); the
   decisions file, with the design comparison recorded; the deterministic
   re-mints recorded; the publication locks refreshed. No byte figure binds
   these write-backs.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the counterexample and matrix under `node --test`; the
confinement cases for both transports; the recovery probe;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(a declared machinery source changes) and again at final review.

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:**

- FUP-fadd2376e82a909e (WO-112 D033) is allocated here at the operator's
  direction; the row's followup asked for the design comparison, which the
  Design records and the decisions file binds.
- The import costs one `git fetch` per admitted candidate; the executor
  records it on the vertical fixture and names the cause if it exceeds one
  second.
- D027's refusal of concurrent shared-repository activity stays as recorded;
  maintenance concurrency is the case this order adds, not a change to that
  refusal.
- The files-only writer with a host-owned commit is the reopening
  alternative, recorded in the decisions with its trigger: the import proves
  unsound in a case this order cannot make pass.

**Non-goals:** a repository-size object inventory; moving committing into
the host; changing the writer protocol's commit step for either transport;
cleanup revocation (WO-204) or Git interpretation (WO-205) beyond reusing
WO-205's argument set; any claim about repositories the writer never
touches.

**Operator-review assumptions**

1. A private object store with a host-owned import is the accepted
   mechanism; the files-only alternative waits for evidence that the import
   is unsound.
2. The retained probe is the counterexample; the test case reproduces its
   scenario inside the skeleton suite so the gate carries it.
