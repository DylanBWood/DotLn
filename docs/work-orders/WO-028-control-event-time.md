# WO-028 — Control-event time: `recordedAt` on every appended control event, an elapsed-phase projection, and labeled recovery of historical times from local checkpoint refs, v0.5.1

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.5.1` patch above published `v0.5.0`, assigned
with explicit operator authority on 2026-09-04 after activation omitted the
target. It adds one optional field to a public evidence surface and a
read-only projection; no exported runtime capability. The operator also made
release assignment/update the default unless explicitly opted out; publication
still requires its existing lifecycle dispatch.
**Nomination provenance:** the 2026-09-03 planning pass, which measured the
control log while checking the recent ledger entries for store-or-not-store
consequences. Planner-synthesized draft; the operator's planning messages are
preserved locally as a compaction-safety capture
(`docs/intake/notes/WO-027-WO-028-primitives-and-data-planning-2026-09-03.md`).
Opaque identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** WO-018 merged — `scripts/lib/`, `status --json`, the exported
control-log schema version, and the fold's unknown-type refusal are consumed,
not duplicated; this order must not add another parser of `resume.jsonl`
before that consolidation lands. WO-019 merged (satisfied at `v0.3.4`).
Recommended before WO-026 (so the index can say when an order closed) and
before WO-021 (a control-plane beacon's mtime needs a derivation time; see the
observed gap).

**Cites (read these sections):** 03-architecture.md §Session lifecycle &
resilience (resume control v1: the log is canonical, the Markdown a disposable
projection); 02-domain-model.md §Events and decisions (`EventEnvelope.occurredAt`;
append order versus time) and the WO-019 actor-attestation paragraph;
11-proteino.md §Candidate — time fidelity and bounded future reachability
(world time, engine wall time, observation-availability time, and the
record/ingest milestone with append order are distinct coordinates);
06-roadmap.md §Efficiency as a separate capability axis
(`EfficiencyObservation.resources.elapsedMs`) and §Counterfactual profiling
work orders (whole work orders as the unit of effort-quality comparison);
09-audit-resilience-privacy.md §Privacy and minimization and §Candidate —
public Git with a local private evidence lane; docs/lineage/idea-ledger.md
§WO-019 execution-window ideation ("Event shape is data in the privacy threat
model"; "Whole work orders are the default unit for effort-quality
experiments") and §WO-025 ideation breakout ("The event is a recorded granule,
not a physical quantum"); `docs/work-orders/WO-020-beacon-codebook.md`
("Host-projected mtime carries the `occurredAt` of the derivation event");
`docs/work-orders/WO-018-control-plane-consolidation.md` criteria 3 through 5;
07-execution-guide.md §Discipline ("Recovery point before destruction";
forward-only enforcement; migration notes); `scripts/resume.mjs` (the append
path, `fold`, `render`, and the checkpoint helper).

**Objective:** Make time a recorded fact of the control log instead of a fact
recoverable only from one machine. Every event the lifecycle appends carries
the host's wall-clock `recordedAt`; the fold never reads it; the projection
shows per-phase elapsed time where both endpoints carry it and `unknown`
otherwise; and the times of the events already in the log are recovered once,
labeled by source, from the local checkpoint refs that still hold them.

**Observed gap (dated 2026-09-03, `main` at `v0.3.4`):**

- `docs/control/resume.jsonl` holds 98 events across 12 work orders and not one
  field that names a time. The event kinds are `WorkOrderActivated`,
  `ImplementationReady`, `VerificationRequested`, `VerificationCompleted`,
  `RepairRequested`, `RepairCompleted`, `FinalReviewRequested`, and
  `FinalReviewCompleted`.
- 83 of those events name a `checkpointRef` (85 local refs exist; two are
  named by no event). The committer date of that local
  `refs/dotln/checkpoint/<WO>/<n>` commit is the only record of when the
  transition happened. Those refs are never pushed (`worktree publish` pushes
  only the branch, with `--no-follow-tags`), so a fresh clone or a lost machine
  loses every phase duration the repository has ever had. The 15 events
  without a checkpoint (six `ImplementationReady`, three
  `VerificationRequested`, three `VerificationCompleted`, two
  `RepairRequested`, one `WorkOrderActivated`) have no recoverable time at
  all.
- Three queued consumers need the field: the effort-quality comparison the
  operator wants (whole work orders as the unit; elapsed time is the cheapest
  dimension of the resource vector and is currently unmeasurable); WO-021's
  control-plane beacon, whose host-projected mtime must carry the derivation
  event's time and has none to carry; and WO-026's index, which cannot say
  when an order closed.
- The kernel's own `EventEnvelope` already carries `occurredAt`. The gap is
  specific to the control log, which is not a kernel event log.

**Design (scope discipline):**

- `recordedAt` is an ISO 8601 UTC timestamp with millisecond precision and a
  trailing `Z`, taken from the host clock by the transition command at append.
  It is the record/ingest milestone in 11-proteino's vocabulary, not an
  occurrence claim about anything else; the field name says so. Append order
  stays the canonical order. `recordedAt` is never an ordering or legality
  input, so a log whose timestamps run backwards folds exactly as before.
- Additive and optional. `schemaVersion` stays `1`; readers treat absence as
  pre-migration history, never as a defect. A present value that is not a
  well-formed timestamp refuses at append (nothing is written) and refuses at
  fold with its ordinal, consistent with the unknown-type refusal WO-018 adds.
- Projection: `status --json` gains `recordedAt` for the latest event and an
  `elapsed` object with one entry per completed phase of the active order
  (`implementation`, `verification`, `repair`, `finalReview`) whose value is
  milliseconds when both endpoint events carry the field and `"unknown"`
  otherwise; `current.md` renders the same lines. No new event and no new
  transition.
- Recovery: a read-only `npm run resume -- times` prints one line per event
  with the time and its source label — `recordedAt`,
  `recovered-from-local-checkpoint-ref`, or `unknown` — and refuses if a
  checkpoint ref it needs is missing rather than guessing. The executor runs it
  once against the real log and commits the output as
  `docs/discovery/control-event-times-<date>.json` with the same three labels,
  the count of local refs it read, and the statement that those refs remain
  unpushed. The log itself is never edited; this is a dated observation, not a
  backfill.
- Privacy: timing is a field in the privacy threat model (ledger, 2026-09-02).
  This repository's public profile publishes it deliberately, as it already
  publishes commit dates; the field is optional precisely so a stricter profile
  can omit, bucket, or delay it. Record that choice in the migration note. Add
  no other field — no tokens, no cost, no attention time; those are
  private-lane candidates.

**Deliverables:** the `recordedAt` append and validation; the elapsed
projection in `status --json` and `current.md`; the `times` command; the
committed dated recovery observation; tests in `scripts/test-resume.sh` and
`scripts/test-checkpoint.sh`; the write-backs below.

**Acceptance criteria (all required)**

1. Every transition in a fixture log appends `recordedAt`; a test asserts
   presence and format on each event type the lifecycle can append, and
   asserts the values are non-decreasing across a scripted sequence run in one
   process.
2. The fold is time-blind: a fixture with `recordedAt` removed, reordered, or
   set to values that run backwards folds to the same phase, legal actions,
   and checkpoint advertisement as the untouched fixture (`cmp` on
   `current.md` after masking the elapsed lines). A malformed `recordedAt`
   refuses at fold with its ordinal.
3. `status --json` and `current.md` expose the latest `recordedAt` and the
   elapsed entries; a fixture with one pre-migration endpoint renders
   `unknown` for that phase and a number for a phase whose endpoints both
   carry the field; `worktree.mjs` and `release.mjs` continue to read the JSON
   surface and contain no new parse of `current.md`.
4. `times` against a fixture with three event classes (with `recordedAt`;
   checkpoint only; neither) prints the three labels correctly and appends
   nothing; against the real log at activation it reports counts the result
   echoes, and the committed observation file matches its output byte for
   byte.
5. No checkpoint ref is pushed, moved, or deleted; the checkpoint suite is
   unchanged except for the new assertions; `git for-each-ref refs/dotln/`
   before and after the order's own evidence run differs only by the refs the
   order's transitions legitimately mint.
6. A dated migration note (forward-only from this order; historical events
   lack the field; the recovery observation and its labels; the public-profile
   timing choice) lands in 03 §Session lifecycle & resilience and 07
   §Model-specific notes beside the WO-019 note, and `docs/control/current.md`
   regenerates without a hand edit.
7. `npm test` green; `git diff --check` clean; no new dependency; the line
   count of `scripts/*.mjs` is reported against `main`.

**Evidence gate:** the fixture transcripts for criteria 1 through 4; the
`for-each-ref` pair; the real-log `times` output and the committed
observation; the `cmp` results; `npm test`.

**Write-back duty:** 03-architecture.md §Session lifecycle & resilience
(`recordedAt` and the three time labels); 07-execution-guide.md §Operator
resume phrases (the `times` row) and §Model-specific notes (migration note);
`docs/PLAYBOOK.md` wherever it reads status; 02-domain-model.md's WO-019
actor-attestation paragraph gains one sentence on `recordedAt`;
`docs/planning/work-order-map.md` notes that WO-021 may consume `recordedAt`
(WO-020 and WO-021 are operator-authored drafts and are not edited); ledger
entry (adopted: control events record their append time and the log stays
time-blind for legality; recovered: historical times labeled by source).

**Non-goals:** any resource or attention telemetry (tokens, cost, operator
time) — private-lane candidates, not this order; changing the kernel's
`occurredAt` semantics; pushing or publishing checkpoint refs; editing any
historical event; a release-manifest projection of actors or times
(candidate); a schema-version bump; a `recover` action; ordering the log by
time anywhere.

**Operator-review assumptions**

1. Publishing per-phase timing in the public control log is acceptable for
   this repository, as commit dates already are; the field stays optional for
   other profiles.
2. Recovery is a labeled, dated observation file, not an edit of the log; the
   15 checkpoint-less events stay `unknown` forever.
3. The order follows WO-018 so it edits the consolidated library once; the
   local checkpoint refs preserve the historical times until then, on this
   machine only.
4. WO-021 consumes `recordedAt` for the control-plane beacon; that is a note
   in the map, not an edit to WO-021's operator-authored draft.

## Operator-authorized ideation breakout receipt — 2026-09-04

**Authority and return:** During `resume: next`, the operator opened three
ideation subjects: correct the cumulative-song/context analogy; consider how
successful choices can create future failure and how routine observation could
expose the trend; and explain use of the shipped Entropy Reducer. The operator
explicitly authorized completing the full intake pipeline, returning to this
implementation, and stopping when ready for independent verification. Earlier
steering selected GPT-6 Astra/max for Codex steps and normal release assignment
by default; this order is now the v0.5.1 patch above published v0.5.0.

**Intake and source treatment:** The complete unedited messages are in main's
canonical ignored `docs/intake/notes/WO-028-expanded-ideation-2026-09-04.md`.
Worktree staging, canonical bytes, and the entry in the validated
`DotLn-intake-20260904T195218Z.zip` backup were compared byte for byte; the
archive is mode 0600 and the redundant worktree capture was removed only after
that proof. No reconciliation remains pending. This is ordinary Shape-First
Synthesis, not direct filing of a public draft. The clean-room screen found no
employer code/configuration/identifier, internal service, credential, private
identifier, or other stop condition.

**Promoted surfaces:** README, Principle 4, and `docs/lineage/inspirations.md`
correct the cumulative startup burden; the new idea-ledger section names the
older incorrect entry it supersedes without rewriting it. Vision, the pattern
library's candidate success-under-growth support, and the roadmap's candidate
bounded baseline preserve the proposed review and observation shapes.
`docs/instance/entropy-reducer/README.md`, the pattern library, architecture,
playbook, and docs map document the existing manual entry point. The roadmap,
execution guide, playbook, and bounded environment observation record the
operator's workflow defaults. The planning map retains the still-unallocated
compiled Shape-First correction. Publication index and source locks accompany
these product edits.

**Boundaries and unresolved choices:** The current compiled Shape-First
support's literal-first wording conflicts with the corrected operator intent;
the guide states an explicit dispatch correction, while a future code change
must regenerate and test the typed support. No old ledger, ADR, generated
residue, or review receipt was rewritten. Measurement cadence, thresholds,
retention, privacy lane, first consumer, and whether the post-decision check
becomes an equipped mechanic remain candidates. No scheduler, performance
collector, review launcher, fresh Entropy Reducer episode, dependency, kernel
schema, or additional lifecycle gate is implemented by this breakout. The
existing control-event-time implementation was preserved during it.

**Required review:** The verifier and final reviewer must inspect these
surfaces and this receipt alongside the timestamp implementation. Verify
source fidelity and the corrected analogy, retention of historical lineage,
candidate/current distinctions, the neutral public observation language,
consistency with settled tradeoffs and current Entropy Reducer contracts,
version/publication surfaces, privacy limits, and links. No ad hoc executable
helper was added for the ideation; the usage guide refers to existing compiled
APIs and the existing intake backup mechanism was used.

## Implementation evidence receipt — 2026-09-04

**Executor:** Codex CLI `0.153.2`, `gpt-6-astra`, `max`,
`operator-attested`. The operator selected the model and effort for Codex
steps; bounded discovery observed only the named persisted effort selector,
not effective-session readback. The base is `27e344b`, published `v0.5.0`;
this compatible change prepares `v0.5.1`. This is executor evidence, not an
independent verification or final-review verdict.

**Implementation:** `scripts/resume.mjs` stamps/validates append time and
validates optional historical values with their ordinal. Its lifecycle fold
still derives exactly the same non-temporal state. The separate
`scripts/lib/control-time.mjs` projection uses append order and reports the
latest completed attempt per phase; retries do not sum and signed negative
differences remain visible. `statusProjection(events)` is now the common
structured projection for CLI, worktree, and release readers. Both sibling
scripts retain JSON control consumption and contain no `current.md` parse.
The schema remains `1`, there are no new transitions or dependencies, and
package source/version/lockfile bytes are unchanged.

**Executable evidence:** `npm test` passed all script suites, all 173 package
tests, and the separate eight-test WO-101 corpus, with zero failures or skips.
Publication checks report 175/175 indexed product headings and current locks
for 27 everyday-user and 42 software-engineer source sections. The new
[fixture transcript](../discovery/control-event-time-evidence-2026-09-04/fixture-transcript.txt)
records all eight event types in one process, malformed append/fold refusal,
mixed unknown/numeric timing, retry/reset behavior, and successful masked
`current.md` comparisons for absent, reordered, and backwards timestamps.
Checkpoint fixtures cover all three time labels, missing/mismatched/foreign
and non-commit refs, no partial output, unchanged log/projection/refs, and
recorded times when Git or checkpoint creation is unavailable. Existing
checkpoint assertions are unchanged; the new cases are appended.

**Historical observation:**
[`control-event-times-2026-09-04.json`](../discovery/control-event-times-2026-09-04.json)
is byte-identical to `npm run resume --silent -- times` over the activation
log: 135 events, zero `recordedAt`, 120
`recovered-from-local-checkpoint-ref`, 15 `unknown`, and 120 refs read. Every
recovered time was independently compared with `git show -s --format=%ct`
against the event's recorded checkpoint SHA, using separate UTC conversion.
The observation SHA-256 is
`6fea01da8e80db4a83967a0a138b6b1ac6d6e9aef0e139df7a0518cebdf1b51e`.
After later transitions, reproduce against the first 135 events rather than
pretending the dated observation includes them. Those original JSONL bytes
have SHA-256
`f58fb9fdfaf7b716d2bfd79ad965f33be651f80d087c27383ad7cfc4952dfc18`
and remained unchanged through the evidence run. WO-028's activation predates
the new field, so its implementation duration remains honestly unknown.

**Ref preservation:** The actual `git for-each-ref --format='%(refname) %(objectname)' refs/dotln/` captures
[before](../discovery/control-event-time-evidence-2026-09-04/refs.before.txt)
and [after tests](../discovery/control-event-time-evidence-2026-09-04/refs.after-tests.txt)
are byte-identical: 122 refs, SHA-256
`b633771fe846588cb2b78503788a30400d78154c58437bfb3755a21ebf81c024`.
No ref was pushed, moved, or deleted. The readiness transition may mint its
own next local recovery ref through the existing checkpoint helper.

**Size and remaining work:** top-level `scripts/*.mjs` total 4,395 lines
against 4,378 on `main`, a delta of +17; the new shared time library is 135
additional lines under `scripts/lib/`. Formatting and `git diff --check`
passed. The operator-authorized ideation and missing-target assignment above
are the scope additions. The compiled Shape-First correction and proposed
observation mechanics remain explicitly unallocated. The self-referential
resume helper was exercised through isolated fixtures and independent Git
date/ref observations before it records this implementation's readiness.
Independent verification must digest both the implementation and breakout
receipt; this executor stops at `ready-to-verify`.

**Readiness recorded:** `ImplementationReady` appended as event 136 with
`recordedAt` and the actor above. The first 135 event bytes and branch HEAD
remain unchanged. The
[post-readiness ref capture](../discovery/control-event-time-evidence-2026-09-04/refs.after-readiness.txt)
preserves all 122 prior refs and adds only
`refs/dotln/checkpoint/WO-028/2`. The folded phase is `ready-to-verify`, its
sole legal next action is `verify`, and no verification report was allocated.
