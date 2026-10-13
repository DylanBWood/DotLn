# WO-205 — Writer-resistant Git interpretation: hidden index flags and writer-controlled Git configuration cannot change the bytes the source host after-tests or the commit the verification judges, proven for modified, deleted and executable files, replace refs and commit graphs, with ordinary recovery intact (version assigned at activation)

**Umbrella record (2026-10-13):** superseded whole by WO-204, which carries this order's obligations under the operator's 2026-10-13 order-size direction ([the 2026-10-13 standard pass](../planning/standard-pass-2026-10-13.md), §12.3); not activatable. The text below is this order's last committed form, kept as the record of what WO-204 absorbed.

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** patch. A defect repair in the source-change
worktree's clean check and the verification worktree's Git reads; no
contract, schema or command changes. Assigned at activation under the
standing opt-out default.
**Cost:** adds a committed-tree comparison in place of the porcelain clean
check in `packages/skeleton/src/source-change-worktree.ts`, refusals of
`skip-worktree` and `assume-unchanged` entries, the host's writer-resistant
Git argument set applied to the local Git helper of
`packages/skeleton/src/verification-worktree.ts`, and the cases in
`packages/skeleton/test/verification-worktree.test.ts` and
`source-change-host.test.ts` with their fixtures. Removes the boundary
WO-112 D044 left: a clean porcelain status taken as proof of committed
worktree bytes before after-tests, and verification reads that a writer's
Git configuration, replace refs or commit graph could steer. Wall-clock: the
skeleton suite grows by the cases (duration recorded against its 289.9 s
thirty-day median). Re-mints: `source-change-worktree.ts` and
`verification-worktree.ts` are registered evidence sources
(`scripts/lib/evidence-sources.mjs` lines 59 and 86), so the editions they
stale are re-minted deterministically; neither is a feedback-judged file,
so no live feedback episode; `npm test -- --review` runs before handoff as
the machinery-source rule requires for the skeleton's declared sources.
Tokens and context bytes are unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (c) of the
three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`).
Source: WO-112 D044 and the register row FUP-7777b9f12644e560 (VER-004's
lower F4), with VER-004's executed probe (skip-worktree set, empty status,
different bytes) and VER-003's F1 (a writer-planted commit graph showed the
host an honest tree) as the observed counterexamples. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: scratch repositories
only.
**Depends on:** WO-112 merged (closed: the worktree and verification code
this order repairs). No queued order; WO-204 precedes it in the sequence
because both edit `source-change-host.ts`.
**Recommended placement:** the machinery lane beside WO-082, after WO-080
and WO-204. WO-082 adds a real-Git fixture suite and its runner row and
writes product 12; this order edits two skeleton sources and their tests
and writes product 03. Disjoint files and no edge between them. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-204",
    "relation": "superseded",
    "reason": "2026-10-13 planning merge: this order's obligations are carried by WO-204.",
    "by": "WO-204"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports (the source
revision guard and the verification contract) and §Session lifecycle &
resilience; `docs/evidence/WO-112/decisions.md` D022 (replace refs), D034
(VER-003 F1, the commit graph), D040 and D044;
`docs/verifications/WO-112/VER-004.md` F4;
`packages/skeleton/src/source-change-worktree.ts` (`HOST_GIT`, exported at
line 37; `clean()` at line 395; `sharedState()` at line 239); `packages/skeleton/src/source-change-host.ts`
(the focused after-test call);
`packages/skeleton/src/verification-worktree.ts` (`assertWorktreeSnapshot`
at line 126, `prepareWorktreeVerification` at line 392,
`prepareInterruptibleWorktreeVerification` at line 405, its local Git
helper); `packages/skeleton/test/verification-worktree-fixture.ts` and
`verification-worktree.test.ts`.

**Objective:** Before the source host's focused after-tests, the worktree is
judged against the committed tree: any `skip-worktree` or `assume-unchanged`
index entry refuses with a typed reason naming the path, and every tracked
file's bytes and mode are compared with the committed blob without restoring
any candidate file; the verification worktree's Git reads use the host's
writer-resistant argument set (hooks off, fsmonitor off, replace refs
ignored, commit graph off) so a writer-planted configuration, replace ref or
commit graph cannot change the commit, tree or blob the verification judges;
hidden modified, deleted and executable-bit files never reach after-testing
or publication, and ordinary recovery stays valid.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`; diagnosed 2026-10-06 in WO-112 D044):**

- `SourceChangeWorktree.clean()` (`source-change-worktree.ts` line 395) uses
  `status --porcelain --untracked-files=all`; the source host runs its
  focused after-tests after that check. VER-004's probe set `skip-worktree`
  on a modified file and observed an empty status with different bytes.
- `prepareWorktreeVerification` (`verification-worktree.ts` line 392)
  compares every admitted worktree file's bytes and mode with its committed
  blob and refuses drift before publication; its local Git helper uses no
  `HOST_GIT` flags, so hooks, fsmonitor, replace refs and the commit graph
  are a writer's to configure there.
- VER-003 F1 (D034): a writer-planted commit graph showed the host's Git an
  honest tree while the real tree changed a file outside the declared
  surfaces; the host-side repair set `core.commitGraph=false` for the host's
  reads, not for the verification helper.
- No index-flag or configuration counterexample has reached these paths in a
  live run (the row's reopening observation); the defects are known from
  the executed probes of VER-003 and VER-004.
- WO-083's activation preflight requires this boundary disposed by an order
  (WO-083 criterion 1, amended 2026-10-11).

**Design (scope discipline):**

- Refuse, never repair: a flagged index entry or a byte or mode that differs
  from the committed blob is a typed refusal naming the path; no candidate
  file is restored and no flag is cleared (D044's first rejected option).
- One Git interpretation for both consumers: the writer-resistant argument
  set `HOST_GIT`, already exported by `source-change-worktree.ts` (line 37)
  and used by its own Git calls, is imported by the verification worktree's
  helper as well, so a
  planted `core.hooksPath`, `core.fsmonitor`, replace ref or commit graph
  changes neither judgment.
- The clean check is `git ls-files -v` for the flags plus a byte-and-mode
  comparison against `HEAD`'s tree for every tracked path (deleted files
  included), under the shared argument set; untracked files keep today's
  rule.
- The verification helper's commit, tree and blob reads are audited against
  the argument set and asserted by cases that plant each interpretation and
  show the judged commit hash unchanged.
- Ordinary recovery (an unreceipted prior attempt, a clean worktree) is
  asserted to stay valid under the new check.
- **Declined alternatives, recorded (D044's, carried):** clearing index
  flags or restoring files (changes the candidate; can discard work);
  rejecting `skip-worktree` alone (`assume-unchanged` and the helper's own
  interpretation need their cases); widening into every Git consumer (one
  bounded qualification of the source and verification byte binding, not a
  universal claim).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `packages/skeleton/src/verification-worktree.ts`: import `HOST_GIT` from
   `./source-change-worktree.js` (exported at line 37); no behavior change
   yet. Check: `npm run build`.
2. `packages/skeleton/src/source-change-worktree.ts`: `clean()` (line 395)
   becomes `cleanAgainstCommit()`: run `git ls-files -v` under the argument
   set and refuse any `S` or `h` entry naming the path; compare each tracked
   path's bytes and mode with `git cat-file` of `HEAD`'s blob (deleted paths
   refuse); keep the untracked-files rule; no write to the worktree. Check:
   cases in `packages/skeleton/test/source-change-host.test.ts` planting a
   `skip-worktree` modified file, an `assume-unchanged` deleted file and an
   executable-bit change, each refused before any after-test runs.
3. `packages/skeleton/src/verification-worktree.ts`: the local Git helper
   takes the shared argument set; `assertWorktreeSnapshot` (line 126),
   `prepareWorktreeVerification` (line 392) and
   `prepareInterruptibleWorktreeVerification` (line 405) read commit, tree
   and blob through it. Check: cases in
   `packages/skeleton/test/verification-worktree.test.ts` planting a replace
   ref, a commit graph and a hooks path and asserting the judged commit,
   tree and blob hashes equal those read with `--no-replace-objects
   -c core.commitGraph=false` in a clean clone.
4. `packages/skeleton/test/verification-worktree-fixture.ts`: helpers that
   plant each interpretation and each hidden file state. Check: the fixture's
   self-test.
5. Recovery: a case that runs an unreceipted prior attempt's recovery and a
   clean candidate through the new check and passes; the vertical's recovery
   probe `node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`
   passes at the repaired subject.
6. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Ports (what keeps work-flavored verticals pluggable)": one clause on
   the source revision guard's byte binding (the worktree is judged against
   the committed tree under the host's Git interpretation), in place;
   `docs/evidence/WO-205/decisions.md`; the deterministic re-mints of the
   editions the two sources stale; `node scripts/lineage.mjs index --check`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
7. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-205/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the shared argument set; the committed-tree clean check;
the verification helper's writer-resistant reads; the planted cases; the
write-backs below.

**Acceptance criteria (all required)**

1. A `skip-worktree` or `assume-unchanged` index entry on a modified,
   deleted or executable-bit-changed tracked file refuses before any focused
   after-test runs, with a typed reason naming the path; no candidate file
   is restored and no flag is cleared (fixture, each case).
2. A tracked file whose bytes or mode differ from the committed blob without
   any index flag refuses the same way; a clean candidate passes (fixture).
3. With a replace ref, a commit graph or a hooks path planted by the writer,
   the commit, tree and blob hashes the verification worktree judges equal
   those read in a clean clone with replace refs and the commit graph
   disabled; publication of such a candidate is refused when its real tree
   differs from the judged tree (fixture).
4. Ordinary recovery of an unreceipted prior attempt passes under the new
   check, and the vertical's recovery probe passes at the repaired subject.
5. Write-backs land, each in place with no dated paragraph: product 03 §Ports
   (one clause); the decisions file; the deterministic re-mints recorded;
   the publication locks refreshed. No byte figure binds these write-backs.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the planted cases under `node --test`; the recovery
probe; `npm run test:docs`; `npm test -- --review` before
`implementation-ready` and again at final review.

**Write-back duty:** as listed in criterion 5.

**Known issues and carry-ins:**

- FUP-7777b9f12644e560 (WO-112 D044) is allocated here at the operator's
  direction; its reopening observation (an index-flag or configuration
  counterexample reaching these paths live) has not occurred and the planted
  cases stand in for it.
- The byte comparison costs one `cat-file` per tracked path at each clean
  check; the executor records the check's duration on the vertical fixture
  and, above one second, records the cause rather than sampling paths.
- WO-206 edits `source-change-host.ts` and `source-change-worktree.ts` after
  this order; it rebases on this order's merge.

**Non-goals:** cleanup revocation (WO-204); shared-object protection
(WO-206); qualifying every Git consumer in the repository; restoring or
repairing a writer's candidate; changing what a verification judges beyond
its Git interpretation.

**Operator-review assumptions**

1. Refusing a flagged or drifted candidate, rather than repairing it, is the
   accepted behavior; the writer re-runs.
2. One shared argument set serves both consumers; a consumer that needs a
   different interpretation is a new decision, not an exception here.
