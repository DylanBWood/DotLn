# WO-021 — Beacons for the control plane: dogfood, sweep events, staleness, group composites (version assigned at activation)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: minor.
**Nomination provenance:** nominated by WO-020's write-back duty from the
operator's 2026-09-02 beacon ideation.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The same planning turn was first
preserved in ignored intake as a compaction-safety copy; both artifacts descend
from one operator-authored filing instruction. The operator confirmed that
direction during VER-001 repair; the clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** WO-020 merged; WO-018 merged (the shared helpers and the
anchored disposable classifier this order extends); WO-019 merged (the
attested effort becomes a beacon field). Real-worker liveness stays with
WO-009, which should consume this order's staleness contract.

**Cites (read these sections):** everything WO-020 cites, plus
03-architecture.md §Session lifecycle & resilience (resume control v1; the
host owns lease expiry and cadence firing), 07-execution-guide.md §Operator
resume phrases and §Workflow closeout and releases (clean-worktree and
ignored-material gates), `docs/PLAYBOOK.md` §Concurrency (one writable agent
per worktree), 02-domain-model.md §Events and decisions (Cadence derived from
state; env is a projection of the log), 04-interfaces.md §Agent projection
(the terminal status region).

**Objective:** Drive the car. Every lifecycle transition emits the active work
order's beacon; a single command sweeps every worktree's beacon directory and
prints the constellation; a sweep performed by an agent is itself an event so
perception replays; stale beacons decode as stale by a declared cadence; and
one group beacon per worktree set encodes member counts per phase in its size,
the composite-spectrum reading, where the environment's sparse-file support
makes that cheap.

**Scope discipline:**

- `resume.mjs` writes the work order's host-projected beacon after every
  appended transition into a gitignored, rebuildable directory inside the
  checkout, using WO-020's edge module through the WO-018 shared library. The
  beacon's fields extend codebook v1 to v2: lifecycle phase, latest verdict,
  attested effort of the latest actor (from WO-019), and provenance. v1
  beacons still decode under v1; v2 is a new codebook version, never a
  silent change of meaning (10-ir-compatibility.md).
- Codebook v2 pins finite domains and radices for every added field plus
  `MAX_V2_CODE` and `MAX_V2_LOGICAL_BYTES`. Pure codebook arithmetic uses
  `bigint`; the edge refuses before allocation if a size cannot be represented
  exactly by the host API or exceeds the re-observed filesystem limit. The
  implementation records whether v2 remains densely padded or requires a
  sparse tail, with a bound on allocated blocks. This bounded v2 definition is
  an explicit input to WO-022 rather than an unbounded field product.
- `npm run worktree -- constellation` sweeps the beacon directory of every
  worktree reported by `git worktree list`, decodes with `stat` only, and
  prints one line per beacon plus the group line. It appends nothing.
- A sweep requested by an agent is an Observe intent authorized through the
  guard before any beacon is read or `BeaconObserved` is appended. A refusal
  is recorded and leaves no observation event. The executor chooses between
  extending `authorize` to Observe intents and using an `observe.*` effect
  namespace, then records why the selected form makes the authority boundary
  clearest without making a beacon an authority input.
- An authorized sweep may record `BeaconObserved` with the decoded
  observations and sweep time; the walking skeleton's reactor consumes that
  event to judge staleness with `env.now` from the event, keeping the kernel's
  env a projection of the log.
- Projection directories are separated per audience. The verifier directory
  contains host-projected beacons only—never self-reported claims or an
  implementer's narrative surface. A restricted directory has an unguessable
  name that appears only in the authorized session's `resume -- next`
  briefing; public status projections and shared logs do not disclose it.
- Staleness: a beacon older than a declared `Cadence.After` threshold from
  the sweep time decodes with a `stale` label and renders blurred in the
  glyph grammar; a missing beacon decodes `absent`; a mtime later than the
  sweep time decodes `clock-skew`. None of these change authority.
- Group beacon: one host-projected file per swept set uses a separate,
  phase-only additive codebook; individual v2 verdict, effort, and provenance
  fields never enter the group sum. `MAX_MEMBERS` is data, `RADIX` is
  `MAX_MEMBERS + 1`, and phase `i` contributes `RADIX ** i`, so summing member
  contributions is an injective mixed-radix encoding of the per-phase counts
  without carries inside the declared bound. The version/lattice check wraps
  that sum without changing its digits. The file is sparse where the WO-020
  probe observed sparse logical sizes; where it did not, it is padded and the
  worst-case physical-size bound is documented. Decoding returns member counts
  per phase exactly and refuses totals beyond the bound.
- The ignored-material classifiers treat the beacon directory as disposable
  by anchored path; `docs/intake/` handling is unchanged. Closeout gates keep
  refusing everything else.

**Deliverables:** the `resume.mjs` emission hook and codebook v2; the
`constellation` command; `BeaconObserved` in the skeleton reactor with
staleness and skew handling; the authorized Observe-intent/refusal path and
recorded guard-design choice; per-audience projection directories and briefing
disclosure; the group codebook and its decoder; classifier update with tests;
runbook and playbook lines; capability table update.

**Acceptance criteria (all required)**

1. After each transition in `scripts/test-resume.sh`'s lifecycle, the beacon
   decodes to the phase and verdict `current.md` reports; `status` and `next`
   emit no beacon because neither is a transition.
2. `constellation` over a fixture with three worktrees prints three decoded
   lines and one group line in lifecycle order, reading only metadata; a
   beacon with garbage content still decodes.
3. Codebook v1 files decode under the v2 reader with their v1 meaning; a v2
   file under a v1 reader decodes `unknown-codebook`. The v2 field product is
   collision-free, boundary and representative round trips cover every field,
   the computed maximum equals the declared constants, and an unsupported or
   inexact edge size refuses before any file is created. A maximum-size fixture
   proves the declared dense-byte or sparse-block bound.
4. Staleness, absence, and clock skew each decode to their label at the
   declared threshold and render blurred, absent, or flagged in the glyph
   scene. None is passed to or consulted by authorization, and an assertion
   proves the same envelope and intent receive the same authority decision
   regardless of beacon state.
5. A `BeaconObserved` event replays to the same staleness decisions; the
   identity test from WO-016 extends to it.
6. The group codebook exhaustively round-trips every phase-count vector whose
   sum is at most `MAX_MEMBERS`, rejects out-of-bound digits and totals, and has
   no collisions. A fixture of at least twelve members spans all phases and
   its decoded counts equal the members' phases; where sparse files are
   observed, the group file allocates at most one block.
7. Worktree cleanup with a populated beacon directory succeeds; a planted
   `docs/intake/dist/x.md` still refuses cleanup.
8. A sweep without the required observe grant is refused before any `stat`,
   records the refusal, and appends no `BeaconObserved`; an authorized sweep
   appends exactly one. The result names and justifies the selected guard form.
9. Per-audience fixtures prove that the verifier directory contains only
   host-projected beacons and that a restricted directory's unguessable name
   appears only in its authorized `resume -- next` briefing.
10. `npm test` green; `git diff --check` clean; no new dependency. If the
    `observe.*` lowering is selected, the kernel is byte-identical; otherwise
    its diff is limited to the documented Observe authorization branch and its
    binding tests. The result records which form landed and why.

**Evidence gate:** test-resume and test-worktree output; the constellation
transcript; authorized and refused sweep transcripts; verifier-directory and
restricted-briefing assertions; the replay identity output; the group-beacon
block count from `stat`; the v2 numeric and physical-size bound; classifier
negative fixtures.

**Write-back duty:** 03 §Session lifecycle & resilience gains the beacon
emission as part of resume control; 04 §Agent projection names
`constellation` beside the terminal status region; 02 gains the group
codebook and staleness labels; WO-009's draft gains a note that real workers
emit self-reported beacons and the host projects evidenced ones; ledger
entries for the additive codebook (adopted or preserved by evidence) and
sparse-file lowering (observed).

**Non-goals:** leases and heartbeats for real workers (WO-009); network or
cross-machine beacons; xattr and symlink lowerings; a web view; beacons as
inputs to authority; changing any lifecycle transition's legality.
