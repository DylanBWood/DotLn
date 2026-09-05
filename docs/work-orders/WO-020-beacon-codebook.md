# WO-020 — Beacons: metadata-level projection of episode state with an exact codebook (v0.6.0)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor, application target `v0.6.0`, from published
base `v0.5.2` at `45db219a6c7320808c8f25e82a684ffa57884964`. The skeleton
component advances from `0.5.0` to `0.6.0`; other components do not change.
The operator approved the truthful version-banner update: without `--beacons`,
all remaining output stays byte-identical to the base. This completes the
missing activation assignment under the standing automatic-release default.
**Nomination provenance:** operator-directed beacon planning from the
2026-09-02 ad hoc session. The original analogy is preserved in the main
checkout's local-only
`docs/intake/notes/2026-09-02-beacon-ideation-operator.md`; the later exact
planning turns and their separate capture index are preserved beside it. This
order's first evidenced stage remains the write-back and breakout receipt under
07-execution-guide.md §Ideation breakout receipt and verification.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The planning turn was first written
to ignored intake as a compaction-safety copy; both artifacts descend from that
single operator-authored instruction, and the original analogy is a separate
earlier source rather than a reconstructed one. The operator confirmed this
direction during VER-001 repair; the clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** WO-007 merged (the L0 receipt and action-class vocabulary are
the beacon's inputs) and WO-016 merged (one reactor to project from). Consumes
WO-017's authority trace if present.

**Cites (read these sections):** 03-architecture.md §The agentic communication
core (the blackboard option and stigmergy; the three-tier context firewall),
§Session lifecycle & resilience (leases and heartbeats; the operator surface's
always-legible runtime projection; the perception cost hierarchy);
04-interfaces.md §Agent projection (the sparse twin), §Glyph system (canonical
state decides, a pure projection renders; blur is stale, near-transparent is
historical), the round-trip laws in its preamble, and §Physical channel;
02-domain-model.md §Memory and observation (Watcher); 09-audit-resilience-
privacy.md §Fidelity levels, §Canonical audit record as pinned by WO-007, and
§Privacy and minimization (separation of metadata from content);
01-principles.md Principles 1, 2, 5, 10, 11, and 15; 10-ir-compatibility.md
§Separate version axes (the codebook is a versioned artifact); ADR-0002 §3 and
§4; ADR-0003 Decision 4 (discoverability is not authority).

**Objective:** Give every episode a beacon: a file whose byte size is an exact
codeword for its current consequential state, whose mtime is the time of the
event that state was derived from, and whose content is the L0 receipt entry
it summarizes. A reader learns the state of a whole directory of episodes from
one metadata sweep without opening a file. The beacon is a pure projection of
the event log when host-projected, never a second truth; an agent's own
emission is a separate labeled claim beside the host's evidenced projection.

**Shape being carried (from the operator's analogy):** a distant observer
infers composition from emitted light through an exact, published codebook.
Load-bearing content: cheap non-invasive observation, exact decoding, visible
provenance, visible age, and composition readable from a composite signal.
Details of the source domain are not adopted into the ontology.

**Scope discipline:**

- Stage 1 is documentation: the breakout receipt, ledger entries, and the
  write-backs listed below. Stage 2 onward is implementation. Evidence for
  each stage is captured separately, but the worktree is not committed before
  final review.
- Canonical term `Beacon`; presentation names such as "constellation" for the
  listing and "spectrum" for the decoded view are skins and never the only
  name (03-architecture.md §Layer diagram, Naming paragraph).
- The codebook is the declared disclosure surface. Possession of a beacon path
  intentionally reveals exactly the documented codebook fields through size;
  no consequential, status, or codebook state is encoded in its filename; a
  fixed non-state identifier may make the episode addressable. File existence
  and mtime still leak activity and recency to observers that can reach the
  path regardless of whether content reads are allowed. Record that metadata
  leak explicitly; content permissions are not represented as secrecy for
  metadata.
- Codebook v1 fields, in most-significant-first order so a size-sorted listing
  is a lifecycle-sorted listing: latest consequential action class (WO-007's
  seven), its outcome, refusal count capped at three, provenance
  (`host-projected` or `self-reported`), and codebook version. Encoding is
  `size = BASE + code * STRIDE + check` with the check derived from the code
  so that every size not on the lattice, below `BASE`, or beyond the field
  space decodes to `malformed`. All v1 codewords fit under 64 KiB without
  sparse files; the exact constants are data in the domain model, not prose.
- The host fold produces one `BeaconProjectionRecord`: the latest matching L0
  receipt entry plus the episode's fold-derived cumulative refusal count,
  capped at three, host provenance, and codebook version. This record—not the
  L0 entry alone—is the single input to host encoding, so the cumulative field
  has an explicit replayable source.
- A host-projected file contains the padded JSON of the matching L0 receipt
  entry nested in that projection record. A self-reported file instead
  contains a padded, explicitly labeled claim record and is never called an L0
  receipt. Padding is trailing newlines; one encode function derives content,
  size, and mtime inputs from the applicable projection or claim record.
- Host-projected mtime carries the `occurredAt` of the derivation event;
  self-reported mtime carries the claim's `claimedAt` (virtual time in the
  demo; the listing will show 1970-relative dates, which the README states).
- Pure encode and decode live in the skeleton beside the audit folds and do no
  I/O. Filesystem emission and sweeping live in a separate edge module that
  uses temp-file-plus-`rename` for atomicity and reads beacons with `stat`
  only, never with a content read.
- A self-reported beacon is written by the fake executor as its own claim
  before its `CommandResult` exists. It never alters the host-projected
  beacon; the two appear side by side with their provenance decoded.
- A bounded discovery probe records, with Principle 15 labels, which
  observables this environment supports atomically and cheaply: `st_size`,
  mtime via `utimes`, atomic `rename`, sparse logical size via `truncate`,
  directory permissions, filename behavior, symlink target, and xattr. The
  2026-09-02 planning probes reported these findings on a macOS APFS volume and
  Claude Code sandbox: sparse `truncate` reports full logical size with zero
  allocated blocks; logical size and allocated blocks are independent;
  `rename` preserves exact size and mtime; `utimes` sets a virtual mtime
  exactly; sub-second mtime retains microsecond precision; read-deny does not
  hide `stat` metadata; a search-only directory permits `stat` by known name
  while refusing listing; names are limited to 255 bytes and resolve
  case-insensitively; symlink targets are at most 1023 bytes; and a 64 KiB
  xattr is readable while its name and size appear in `ls -l@`. Treat every
  item as a finding to re-observe, not inherited environment truth.
- The beacon directory is an explicit CLI argument, gitignored if inside the
  repository, and never under `docs/intake/`. Without the flag the CLI writes
  nothing. The kernel is untouched.

**Deliverables:** stage-1 write-backs (03 §The agentic communication core
gains the beacon as the cheapest rendering of the shared world; 04 §Agent
projection and §Glyph system gain the constellation row and staleness
rendering; 02 gains `Beacon`, `BeaconCodebook`, and `BeaconObserved` rows; 09
§Fidelity levels gains a named rung below L0 with audience, purpose, access
rule, and omissions; the ledger gains the adopted, transformed, and preserved
entries with provenance); `packages/skeleton/src/beacon.ts` (pure),
`packages/skeleton/src/beacon-fs.ts` (edge), tests, the `--beacons <dir>` CLI
option that emits the demo's beacons and then prints the constellation
decoded from `stat` alone, the probe record in `docs/discovery/`, README.

**Acceptance criteria (all required)**

1. `decode(encode(x)) = x` for every codeword in the v1 field space,
   exhaustively; every integer from 0 to twice the largest codeword that is
   not a codeword decodes to `malformed`; a future codebook version decodes to
   `unknown-codebook`, never to a guessed state.
2. Host-projected beacons derived from the live demo log and from a replayed
   log are byte-identical in size, mtime, and content; the audit projections
   used as inputs are unchanged. The executor's edge-only self-reported claim
   is outside that identity claim and is tested separately.
3. The sweep decodes a beacon whose content has been made unreadable (mode
   000) or replaced with garbage while its size is preserved, proving the
   reader never opens content.
4. A self-reported beacon claiming `verification passed` before any
   `VerificationCompleted` event does not change the host-projected beacon;
   the listing shows both with their provenance decoded.
5. Writing a beacon is atomic: a test that observes the directory during
   emission never sees a size off the lattice or a partially written name.
6. `npm run skeleton -- --beacons <dir>` writes one host-projected beacon per
   episode and one self-reported beacon for the fake executor, then prints a
   constellation decoded from `stat` only, sorted by size, that reads in
   lifecycle order and ends with the demo's terminal state. Without the flag,
   CLI output is byte-identical to `main` except for the assigned package-version banner.
7. The probe record lists each observable with an epistemic label, its
   atomicity and readability inside the sandbox, and the reason size was
   chosen for v1 over symlink target and name; alternatives remain recorded,
   not adopted.
8. The breakout receipt distinguishes the local capture index, the exact
   preserved planning turns, and any distinct earlier analogy source located
   at activation; it also names ledger entries, changed surfaces, unresolved
   choices, and required review. The verifier and final reviewer digest it as
   subject.
9. `npm test` green; `git diff --check` clean; no new dependency; kernel
   byte-identical.

**Evidence gate:** exhaustive round-trip output; the live-versus-replay `cmp`;
the unreadable-content and claim-versus-evidence transcripts; the atomicity
test; captured constellation output; the probe transcript with versions.

**Write-back duty:** as listed under stage 1; capability table gains a
`projection.beacon` row at level 1 with its blocking gate; nominate WO-021 for
the control-plane dogfood, sweep events, staleness, and group composites.

**Non-goals:** real workers or leases (WO-009); reading beacons across
worktrees or emitting them from `resume.mjs` (WO-021); group or additive
codebooks (WO-021 candidate); staleness thresholds; symlink or xattr
lowerings beyond recording them; a keyed provenance residue (WO-022); encoding
any consequential, status, or codebook state in filenames; any UI; treating a
beacon as authority or as canonical state.

## Operator-opened ideation receipt — 2026-09-04

**Authority:** during this order's `resume: next` orientation, the operator
sent one message containing four `ideation:` paragraphs: documentation
freshness and ownership; the Protíno filename; what WO-020/WO-021 will establish
about value; and a readable work-order README that replaces a manually checked
seven-order editor list. Under 07 §Operator-opened ideation mode this authorizes
capture, clean-room synthesis, ledger/product write-back, and the bounded
documentation projection correction described here. The operator did not ask
to continue Beacon implementation after this breakout; that work remains
paused in phase `active`. No Beacon source, test, or probe had been written.

**Raw batch:**
`docs/intake/notes/WO-020-doc-freshness-protino-beacon-payoff-navigation-2026-09-04.md`,
SHA-256 `114e9d9827a9511078239d911d5340f97e421360a7b1a723eee2203221f71cb3`.
This is the exact new four-part message, initially captured in worktree-local
ignored intake, then reconciled byte-for-byte to the main control-plane
checkout's ignored intake and backed up before removing the provisional
duplicate. It is separate from the original Beacon analogy, exact
ready-to-file planning turns, and capture index named in the original scope;
their stage-1 intake review and write-backs remain outstanding.

**Source treatment:** Clean Room's locked employer/credential boundary,
Shape-First Synthesis, public vocabulary, provenance, and breakout review.
The new batch contains no employer, secret, private-identifier, or internal
service material. Its public content is synthesized; no Direct Draft Fidelity
exception applies to this new message. The original work-order draft and prior
ledger entries retain their historical wording.

**Ledger:** the four entries under “WO-020 ideation — current docs, Protíno
paths, beacon value, and a readable sequence (2026-09-04)” in
`docs/lineage/idea-ledger.md`: factual-doc ownership (`adopted`), current
`protino` path (`adopted`), separate evidence for value (`preserved`), and the
editor-checklist replacement (`transformed`).

**Changed surfaces and bounded implementation:**

- `07-execution-guide.md`, `08-publication-compiler.md`, and `docs/PLAYBOOK.md`
  clarify executor ownership, independent verification, final consistency
  review, dedicated publication scope, and the existing generated-refresh duty.
  This adds no lifecycle transition or authority override.
- Current product content moves to `docs/product/11-protino.md`; the earlier
  path retains only compatibility section links. Mutable links in the root
  README, product 00/04/06/10, and publication index follow the current path.
  Historical work orders, reports, release notes, and older ledger entries are
  not rewritten.
- `06-roadmap.md` and `docs/planning/beacon-usefulness-checkpoint.md` preserve a
  proposed comparison after WO-021. No new Beacon acceptance criterion,
  release gate, trial result, runtime telemetry, or queue activation is claimed.
- `docs/planning/work-order-map.md` owns one marked, ordered list with short
  labels. `scripts/work-orders.mjs` validates that block and renders the
  generated README with the proposed checklist first and complete per-order
  evidence below. Progress comes from the existing control fold; checked means
  passing final review, not merge or publication. Missing or malformed blocks,
  duplicate IDs, absent authorities, and escaped paths refuse; conservative
  dependency-reference semantics and recorded local-tag checks remain intact.
- `scripts/test-work-orders.mjs` tests the readable layout and complete retained
  evidence, explicit sequence order, close/failure progress marks, changed
  recommendation detection, invalid/missing/symlinked planning input, refusal
  without output/control/ref mutation, and the earlier release-evidence cases.
  This helper is implementation subject, not an exempt editorial script.
- Publication heading coverage, both audience outlines, and their source locks
  are updated after reviewing the new ownership/value/navigation material.
  No package, kernel, compiler, skeleton, schema, or dependency changes belong
  to this breakout.

**Required independent review:** digest this receipt and all named promoted
surfaces alongside the original order. Inspect and execute the changed index
helper and tests independently; it also generates the index used during this
work, so that self-reference must be disclosed. Verify canonical capture
reconciliation, synthesized provenance, historical citation compatibility,
current source links, the single recommendation source, progress/evidence
distinctions, and that a proposed usefulness trial is not presented as
completed or as a new technical gate. A material correction returns through
repair and a new independent verification under the existing rules.

**Open work:** the original Beacon deliverables and evidence gate remain
unimplemented; the omitted activation release target still needs the normal
classification/base assignment when execution resumes. This receipt is not an
implementation-ready or verification result. No commit, push, PR, release,
account setting, or model launch is authorized by these ideation changes.

**Breakout evidence (2026-09-04 local date):**

- Executor: Codex CLI `0.153.2`, `gpt-6-astra`, `max`,
  `operator-attested` under the dated repository default. This is not effective
  session readback. No lifecycle completion event is recorded for this breakout.
- `npm ci --ignore-scripts --no-audit --no-fund` succeeded using the existing
  lock. `npm test` exited 0: all workflow/publication fixtures, 173 package
  tests, and 8 corpus tests passed. After the final wording and reference-link
  assertion changes, `bash scripts/test-work-orders.sh` passed again.
- Final `npm run format:check --silent`, `npm run publication:check`,
  `npm run work-orders -- index --check`, and `git diff --check` passed.
  Publication covers 202/202 headings; the current audience locks cover 29
  and 44 linked source sections. The historical bootstrap base remains pinned;
  new topics are reached through established document-root source links, whose
  current subtree hashes include the added sections. No checker was weakened
  to admit a source link absent at its declared base.
- Executable comparison against `HEAD` confirmed all older ledger entries and
  the original WO-020 authority are unchanged, the Protíno content between
  “Shape before machinery” and “Unresolved product choices” is byte-identical,
  and all 16 historical heading anchors plus 15 section destinations survive
  in the compatibility file. The changed name/slug prose is separately visible.
- Kernel, compiler, skeleton, package manifest, lockfile, ADR, prior
  verification, final-review, and release surfaces have no diff. The original
  activation's control changes remain intact; this breakout appends no control
  event and creates no commit or remote effect.
- Canonical main capture, provisional capture, and its archived entry were
  byte-identical with the raw-batch SHA-256 above. The main capture and backup
  are mode `600`. Validated main backup:
  `DotLn-intake-20260905T010804Z.zip`, SHA-256
  `1d5b9993d9c58b9918ec67d543eba3d58df1032f866ff2695971b012724478c9`.
  An earlier owner-only provisional archive remains in temporary storage as
  `DotLn-wo020-intake-20260905T010418Z.zip`, SHA-256
  `de4ee7e56bc3ee91f88375bfe29fbee3a0b2a6d6af81a60a02bc7f6486c9838a`;
  it is not the canonical survivor. No reconciliation remains pending for this
  batch. This completes the ideation pipeline, not the original Beacon order.


## Stage 1 — Beacon write-back receipt (2026-09-04)

**Source treatment and provenance:** the distinct earlier operator analogy is
`docs/intake/notes/2026-09-02-beacon-ideation-operator.md` (SHA-256
`3c47127785082c224ff4460b2d63771231e4c0058a1efbdab06ad941ff36b679`). It
was read and clean-room screened; no stop condition was found. The local index
`2026-09-02-beacon-planning-capture-index.md` (SHA-256
`7c7861d735da65e422ce2488bb9dc6f164c95b9447a70dc3c28ea9cc0057b8ca`)
was read as provenance and a locator, not substituted for that analogy.
`WO-020-WO-021-beacon-planning-2026-09-02.md` (SHA-256
`6e1cbc0862d8cac3d07d112d26bbf759fb85a5f0d2c3b2be1f046efd30a72e37`)
and `WO-022-senses-planning-2026-09-02.md` (SHA-256
`73842e708dc3b1e1555ae531e4864fb80bbfd0e3028d1b0e08c4aca9768c9bf5`)
were checked for presence and identity as exact preserved planning turns.
They remain sibling safety captures of direct-filed authorities, not synthesis
sources. All four survive in the main checkout's ignored intake; none is copied
into a committed surface. The earlier four-part ideation receipt is a separate
batch with its own source and evidence boundary.

**Promoted surfaces:** the ledger's three “WO-020 Beacon synthesis” entries
record adopted metadata observation, the transformed signal analogy, and
preserved composites/alternative channels. Product 03 adds Beacon to the
blackboard; 04 adds the constellation and staleness rendering contract; 02 adds
three domain rows and normative v1 codebook data; 09 adds M0 below L0 with its
access, omissions, retention, and metadata leak. The stage precedes Beacon code.

**Resolved implementation choices:** size order groups declared lifecycle
classes, not timestamps; the demo's final receipt remains the existing
`schedule.cancel` observation. Framed future-version tags are the explicit
`unknown-codebook` exception to malformed sizes and reveal no guessed fields.
Only v1's own payload is bounded by v1's field space; future payloads can grow.
No unresolved v1 product decision remains. Host probes and executable evidence
belong to stage 2 and must be observed here, not inherited from planning.

**Required review:** the verifier and final reviewer digest this receipt,
original authority, earlier ideation receipt, and all promoted surfaces as
subject. Check source distinctions, fresh probe labels, exact data/code parity,
unchanged audit/kernel behavior, claims versus evidence, bounded disclosure,
and the absence of WO-021 control/staleness/group implementation. Review the
version-banner normalization against the operator-approved release assignment.


## Automation ideation receipt — 2026-09-04

**Authority and source:** the operator opened another `ideation:` message during
implementation closeout, asking to carry a general automation direction into
this project, followed by two wording corrections. The three exact messages
remain separate in `docs/intake/notes/WO-020-automation-direction-2026-09-04.md`,
SHA-256 `6b605ca1166e5837bfa194150ba2f33f97dd6bc06b6a51e4968683fe71ae8642`.
The raw capture is provisional in this worktree pending canonical reconciliation
and backup. It is ordinary ideation, not a ready-to-file public draft.

**Synthesis and surfaces:** Clean Room's locked floor and Shape-First Synthesis
carry the general preference for automating recurring procedure; no employer
implementation detail, configuration, identifier, internal service, or source
code enters the public synthesis. The ledger adds “Progressively remove
recurring procedure through executable mechanisms” as `adopted`. Product 03's
agentic communication core and 07's execution discipline specify existing-helper
reuse, bounded deterministic increments, observable effects/failures, and a
clear point for judgment. This is a documentation clarification of the current
composition model, not a new primitive, phase, scope grant, or automatic launch.
No package, schema, acceptance, model assignment, or Beacon code changes result
from this batch; no new repository helper is introduced.

**Review and evidence:** the verifier and final reviewer digest the capture
provenance, ledger entry, and both promoted sections alongside the other receipts.
Check that the direction removes repeatable operator work while retaining the
existing scope/authority boundary, and that future automation is not presented
as implemented. No product choice remains unresolved. Publication source locks
must be refreshed for the changed sections; canonical capture/backup identity
and final documentation checks are recorded at implementation closeout.


## Resource-environment ideation receipt — 2026-09-04

**Authority/source treatment:** a further operator `ideation:` message proposed
budget pressure as an environmental influence on the initiation and persistence
of routine activity. The exact local-only capture is
`docs/intake/notes/WO-020-resource-environment-2026-09-04.md`, SHA-256
`0dbd04032d7a7d23ead6421c3bf04ecac5f9c7b77a15912021d483793772f63d`,
provisional here pending canonical reconciliation. Clean Room found no stop
condition. Shape-First Synthesis carries the causal relationship, not literal
physics or raw wording; no Direct Draft Fidelity exception applies.

**Promoted surfaces:** the ledger adds “Budget pressure can make routine activity
harder to initiate and sustain” as `preserved`. Product 03 adds a candidate
resource-pressure policy with explicit base cost, admission modifier/threshold,
remaining capacity, reserves, and start/continue boundaries. Product 02 links it
to the current ResourceModel/AttentionPolicy vocabulary while marking dynamic
execution absent; product 06 distinguishes scheduling from measured efficiency.
The audience index classifies the new section as planned. This introduces no
Beacon, compiler, kernel, event-schema, or acceptance change.

**Open choices/review:** threshold curves, units, budget windows and replenishment,
observation and missingness policy, hysteresis/starvation handling, and the first
consuming experiment/work order remain open. The verifier and final reviewer
check consistency with the separate priority/resource/authority/capability axes,
recorded environment inputs, protected reserves in the personal profile, and
current typed-but-deferred ambient effects. A candidate must not read as
implemented or as a new gate on WO-020. Capture reconciliation, backup, source
locks, and final documentation evidence accompany implementation closeout.


## Budget-window/ladder ideation receipt — 2026-09-04

**Authority and source:** the operator explicitly proposed concentrating useful
usage early to create time away and exploring one or two work-order ladders
with Codex implementation, Opus 5 verification, and Fable final review. The
operator characterized benefit and feasibility as uncertain. Exact local-only
capture: `docs/intake/notes/WO-020-budget-window-parallel-ladders-2026-09-04.md`,
SHA-256 `7ab2e947106494d0738a35b2c90c86a9f7b3efb5ac5d00d91d2744026bd85978`.
Clean Room found no stop condition; Shape-First Synthesis applies, with no
Direct Draft Fidelity exception. Canonical reconciliation/backup remains pending
for this latest capture until the closeout evidence below.

**Promotion:** two new ledger entries distinguish the adopted attention/scheduling
objective from the preserved two-ladder trial. The concrete
`docs/planning/budget-window-work-order-ladders.md` provides the current single
route, a two-lane alternative, phase assignments, dependency/preference facts,
and a bounded feasibility gate. Product 03 refines resource pressure away from
an assumed universal conservation objective; product 06 preserves the proposed
trial. The map links it and nominates a synthetic closeout experiment. The
playbook corrects its unqualified parallel-worktree sentence: file isolation
alone does not establish concurrent control/release semantics. Audience status
and source locks follow the added candidate. No Beacon code, package, schema,
acceptance gate, account setting, release target, or live dispatch changes.

**Evidence and open work:** inspected current authorities and control helpers.
An in-memory synthetic fold (activate WO-901; activate WO-902; mark WO-901 ready)
reported WO-902 as ready, demonstrating the single-current-order assumption.
No production control event was appended. OpenAI Docs and official Claude
usage pages were fetched; the plan cites account-shared usage and documented
reset behavior, while the operator's exact allowance and unexpected resets
remain unverified account observations. Read-only local CLI help established
no account quota. No identity, billing data, credentials, or private account
snapshot was collected. Before a future parallel launch, resolve and test
control reconciliation, ordered integration and distinct release targets,
combined-subject revalidation, actual model/effort availability, and provider
review reserves. The verifier/final reviewer digest these limitations and
source distinctions as part of the current documentation subject; the future
trial is not represented as implemented or guaranteed to be beneficial.

## Concurrent-workflow, compatibility, and contribution ideation receipt — 2026-09-04

**Authority/source:** five operator follow-ups asked for a higher order Fable
planning task, clarified zero to many concurrent work orders with potentially
different steps, delegated compatibility decisions, and identified independent
public contribution tracks plus shared progress/release traceability as useful
outcomes. Exact local-only capture:
`docs/intake/notes/WO-020-concurrent-workflows-compatibility-2026-09-04.md`,
SHA-256 `b6e011c3635b1c91ccbfc8b7b620bcdef0b1551e4ba0d2ec76bb75b6eda2c788`.
Clean Room found no employer implementation or secret stop condition. The
generic tracker analogy is synthesized without its vendor term. Shape-First
Synthesis carries the relationships; Direct Draft Fidelity does not apply.

**Promotion:** three new ledger entries cover independent variable workflows,
case-specific compatibility with optional derived views, and contribution/release
traceability. Product 06 preserves the expanded candidate; product 10 clarifies
delegated compatibility choices and versioned computed/cached mappings under
its existing laws; product 12 adds the contribution scenario and corrects the
reached WO-026 index description to delivered. The ladder document now contains
a concrete Fable planning handoff for bounded enabling work orders and lane
derivation. The map/playbook reflect the required control-model change. The
initial two-lane table remains an example; a fixed phase barrier and a serial-
reconciliation-only alternative are superseded by the later direction. Current
work-order authorities and live control behavior are unchanged.

**Open choices and review:** the planner selects per-order workflow representation,
event/store coordination, dispatch/projection behavior, contribution/group mapping,
release membership, compatibility paths, cache use, and the smallest useful
implementation sequence. No concurrent worker, generator, new schema, storage
engine, account change, or release effect is delivered in this breakout. The
verifier/final reviewer check the candidate status, preservation of existing
evidence/acceptance obligations, traceability to operator intent, and changed
publication sources. No Beacon acceptance gate or package implementation changes.
Canonical capture reconciliation and final documentation evidence follow in
the implementation closeout receipt.

## Tenant-track ideation receipt — 2026-09-04

**Authority/source:** a subsequent operator `ideation:` message extended planned
dependencies and recommended ordering to multi-tenant tracks. Its exact
local-only capture is `docs/intake/notes/WO-020-multi-tenant-tracks-2026-09-04.md`,
SHA-256 `eb87d89c71fb6e7141965e7405835756cf2e65415f254f15a3059470c3548eeb`.
Clean Room found no stop condition; Shape-First Synthesis applies without a
Direct Draft Fidelity exception.

**Promotion/review:** the ledger preserves “Carry dependency and ordering plans
across tenant-scoped tracks.” Products 06/12 and the Fable handoff add per-track
plans, cross-track dependencies/conflicts, changing readiness, and explicit
tenant ownership/visibility/authority/capacity questions. The planner chooses
the tenant/track mapping and bounded schema. Review the distinction between
required dependencies and recommendations, scoped attribution, and planned
behavior; no new runtime, workflow event, Beacon acceptance, or automatic
timing guarantee is introduced. The same final documentation, capture, and
backup evidence below covers this batch.

## Constraint/admission ideation receipt — 2026-09-04

**Authority/source:** an operator `ideation:` message applied a constraint
analogy to monitoring open tracks and limiting or pausing production. Exact
local-only capture: `docs/intake/notes/WO-020-constraint-track-admission-2026-09-04.md`,
SHA-256 `a3cf1e580b54ba734cc145f7065345198c7c719422c974382d92bc5a94709222`. Clean Room found no
stop condition. Shape-First Synthesis carries the operator-described causal
relationship; no book quotation or Direct Draft Fidelity exception applies.

**Promotion/review:** the ledger preserves “Govern track admission and activity
by the limiting step.” Products 03/06 and the Fable handoff distinguish track
existence, admission, active steps, and completed throughput, and call for a
bounded monitor/admission policy with safe pause/resume, reserves, freshness,
fairness, and moving-constraint evidence. The first sensors, thresholds,
algorithm, and work-order allocation remain planning choices. Review candidate
status and consistency with authority, resource policy, and independent evidence;
this adds no Beacon field, acceptance change, or automatic runtime control.
Canonical reconciliation and backup are recorded with the final handoff evidence.

## Stage 2 — implementation and handoff evidence (2026-09-04)

**Delivered subject:** `beacon.ts` folds the existing full audit projection
into one latest receipt per workstream/episode, with cumulative capped denials,
and encodes a single projection or explicitly labeled claim record. The fixed
v1 codebook is data shared with the blueprint by an equality test. The separate
filesystem edge writes padded UTF-8 content and exact derivation mtime before
atomic rename, sweeps metadata only, and keeps staging names outside the
observed directory. The fake executor emits its claim before its result. The
opt-in CLI displays both channels in size order. README, domain/interface/audit
docs, the probe record, and the level-1 `projection.beacon` capability row agree
with this behavior; WO-021 remains the nominated next Beacon slice.

**Executor evidence:** Codex CLI `0.153.2`, `gpt-6-astra`, `max`,
`operator-attested`; model and effort are operator selection, not effective
harness readback. `npm test` passed all workflow fixtures, **187 package tests**
(including 14 new Beacon tests), and **8 corpus tests**. The executable evidence
includes:

- All 104 v1 states round-trip. Every integer from 0 through 102,128 is checked:
  101,292 malformed values, 733 framed future versions with no guessed state,
  and 104 known states. The largest v1 codeword is 51,064 bytes.
- Live/replay files pass `cmp` and byte equality with size 49,764 and exact
  `mtimeNs=1200007000000`; the nested receipt matches the existing L0 projection.
  Append order, full projection scope, multiple episode scopes, refusal cap,
  input non-mutation, and UTF-8/overflow behavior are exercised separately.
- A real mode-000 file refuses content read with `EACCES` while the sweep
  decodes it. Garbage JSON at the preserved 37,216-byte size still decodes.
  A premature executor `verification/passed` claim appears beside host
  `authority-decision/allowed` before both result and verification events;
  host bytes and mtime stay unchanged.
- A worker observes 128 synchronized atomic replacements, seeing both valid
  sizes and no off-lattice size or extra/partial name (2,748 sweeps in the
  recorded implementation run). Destination, alias, record, future-version,
  and non-regular-file cases are tested.
- Default CLI output matches the frozen base executable output except for the
  approved `0.6.0` banner. The opt-in invocation produces exactly the demo's
  one host file and one claim, with this metadata-only constellation:

  ```text
  bytes | mtime (UTC) | state | refusals | provenance | codebook
  37216 | 1970-01-01T00:20:00.001Z | verification/passed | 0 | self-reported | 1
  49764 | 1970-01-01T00:20:00.007Z | external-effect/observed | 1 | host-projected | 1
  ```

  Stable opaque addresses are omitted in this excerpt; the executable CLI test
  captures the full listing. The final host receipt is the demo's existing
  `schedule.cancel` observation. The 1970-relative dates are virtual event time.

**Observed boundary:** the bounded probe re-observed every requested channel
inside this sandbox and records methods, versions, and Principle 15 labels in
`docs/discovery/beacon-probe-2026-09-04.md` and its JSON transcript. Filesystem
identity was not exposed by `diskutil`; no APFS claim is inherited. Node's
seconds-to-time conversion required a measured half-microsecond correction for
some integer-millisecond inputs; the edge checks exact nanosecond metadata and
refuses an unsupported result before publication. Atomicity evidence is per
file, with no multi-file snapshot or durability claim. Real-worker liveness,
authenticated provenance, staleness policy, and operator usefulness remain
outside this implementation's evidence.

**Documentation and source integrity:** the earlier index-generator change is
also implementation subject: its tests cover sequence authority, progress,
complete detail retention, staleness, and refusal without mutation. The helper
generating this subject's work-order index is modified here, so its own passing
check is self-referential evidence to inspect independently. Product/publication
write-backs include all ideation receipts above; speculative workflow and
resource-policy directions remain candidates. Current source locks, heading
coverage, formatting, generated-index freshness, and `git diff --check` are
checked at the final evidence gate. Kernel, compiler, reactor, and audit source
remain byte-identical to base. No dependency is added; only the skeleton
component advances to `0.6.0` under the assigned application target `v0.6.0`.

The final `npm test` invocation exited 0 after the planning write-backs and
source-lock refresh: 187 package tests, 8 corpus tests, and all workflow
fixtures passed. Publication checks cover 205/205 product headings and both
audience locks; format, generated-index, and diff checks pass. An executable
comparison also confirms older ledger entries remain byte-identical and no
provisional WO-020 intake remains in this worktree.

**Capture reconciliation complete:** the earlier provisional language records
the capture state at each breakout. All batches now survive in the main
checkout's ignored intake. For every new capture, canonical file, provisional
file, and archived entry were proven byte-identical against the receipt's
SHA-256; files and archives are mode `600`. Only then were provisional duplicates
removed. The original four-part batch's backup is named in its own receipt.
The automation and resource-environment batches were validated in
`DotLn-intake-20260905T021208Z.zip`, SHA-256
`b8d525aa2d2eea3a975f61cba6bcc575489bb5cca4671527154e3ea0284f1f70`.
The budget-window, concurrent-workflow/compatibility, and tenant-track batches
were validated in `DotLn-intake-20260905T023201Z.zip`, SHA-256
`69fda80df73dde71e2f41973d478a99064ce700c394ebcd0b5529294bb13158c`.
The later constraint/admission batch was validated in
`DotLn-intake-20260905T023845Z.zip`, SHA-256
`47d2f9c7de0f96e5d36ad9fb841a8b15ecdd2fe4935f2ebf4f56291bf677f2ce`.
No reconciliation remains pending for these batches.

**Next evidence boundary:** independent verification digests the full original
authority, implementation, probe, changed helper, and all breakout receipts.
The concurrent-workflow planning handoff is ready for a separate Fable planning
session. No verifier or final-review report is authored by this executor.


## Actor UI ideation receipt — 2026-09-04

**Authority/source:** after the implementation-ready transition, the operator
opened terminology ideation naming the future interface Actor UI (AUI). Exact
local-only capture: `docs/intake/notes/WO-020-actor-ui-2026-09-04.md`, SHA-256
`cf730baee6a0fa818c994285d7dc4956515bc20766a10db9d9452c075be5805d`. Clean Room found no stop condition;
Shape-First Synthesis applies, with no Direct Draft Fidelity exception.

**Promotion/review:** the ledger adopts “Name the future interface Actor UI
(AUI).” Products 00/04 and both audience routes use the name with the existing
Actor definition and interface contracts. The complete AUI stays planned;
agent-specific projections remain valid within it. No new primitive, schema,
UI implementation, or Beacon acceptance change results. The implementation
remains ready for independent verification; this later documentation joins the
current review subject. Publication source locks and documentation checks are
refreshed for it, separately from the already passed implementation suite.
Canonical intake/backup identity follows below.

The canonical main capture and its archived entry were checked byte-identical
against the SHA-256 above, with mode `600`, before removing the provisional
copy. Backup: `DotLn-intake-20260905T024344Z.zip`, SHA-256
`ca5d50f7df6e6dda8d69b4e4da6a55c30f041310fd11ca5bdaea1f111e6032ed`.


## UIFA naming ideation receipt — 2026-09-04

**Authority/source:** the operator followed the Actor UI direction with a
pronounceable-name proposal: UIFA, expanded as User Interfaces for Actors,
with the proposed pronunciation “wee-fuh.” Exact local-only capture:
`docs/intake/notes/WO-020-uifa-name-2026-09-04.md`, SHA-256
`40dfb74a51a13d27c7d173ca239576a5df7db7ccdf06ce68337b45599f5b9534`. Clean Room found no stop condition;
Shape-First Synthesis applies without a Direct Draft Fidelity exception.

**Promotion/review:** the ledger preserves the naming proposal. Products 00/04
and both audience routes use UIFA as a proposed spoken name while retaining
Actor UI as the interface concept. The prior AUI receipt remains historical
context. No product split, implementation, primitive, schema, or acceptance
change results. Independent review includes these later naming write-backs and
the refreshed publication checks; the full implementation suite remains the
already passed evidence. Canonical capture/backup and final documentation
results follow below.


## Naming-sound ideation receipt — 2026-09-04

**Authority/source:** the operator supplied another `ideation:` naming
follow-up. Exact local-only capture:
`docs/intake/notes/WO-020-name-sound-associations-2026-09-04.md`, SHA-256
`e475a96fdf0bb88859d41f50d88bfd82194cdd68737a5df88330711af1386e7e`. Clean Room found no stop condition;
Shape-First Synthesis preserves sound associations without a direct-filing
exception or a demand for literal equivalence of the analogies.

**Promotion/review:** the ledger preserves the UIFA/FIFA rhyme and DotLn's
.NET/Kotlin sound association. Products 00/04 clarify the proposed pronunciation
and retain existing name origin and Actor UI scope. These are later naming
write-backs for the same review subject; there is no implementation, schema,
acceptance, lifecycle, or release change. Refreshed documentation and canonical
capture/backup evidence follow below.

The UIFA proposal and naming-sound captures were reconciled to main and checked
byte-identical with their archived entries and recorded hashes; files and
archive are mode `600`, and provisional copies were removed only afterward.
Validated backup: `DotLn-intake-20260905T024648Z.zip`, SHA-256
`3996bc6ae1afd66e4978fe91098bc0fcfeb7261488c50506ace04b4eba678a4f`.

After the naming write-backs, `format:check`, `publication:check` (205/205
headings, 30 everyday and 45 engineer source sections), generated-index check,
and `git diff --check` all passed. The control state remains
`ready-to-verify`, with no verification report allocated. These documentation
additions are later than the implementation-ready checkpoint and join the
current worktree subject for the independent verifier.
