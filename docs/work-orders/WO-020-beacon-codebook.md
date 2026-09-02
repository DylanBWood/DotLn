# WO-020 — Beacons: metadata-level projection of episode state with an exact codebook (version assigned at activation)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: minor. It adds a backwards-compatible projection and CLI option to the
skeleton and changes no existing output unless the new flag is passed.
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
   CLI output is byte-identical to `main`.
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
