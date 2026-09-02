# WO-022 — Senses: perception as a compiled, authorized, mounted capability (version assigned at activation)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: minor.
**Nomination provenance:** the operator's second question in the 2026-09-02
beacon planning session: whether a role can be required to hold a sense before
it can read another agent's beacons. The local-only
`docs/intake/notes/2026-09-02-beacon-ideation-operator.md` preserves the
original analogy; the later amendment and full WO-022 planning turn are
separate captures beside it in the main checkout.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The planning turn was first written
to ignored intake as a compaction-safety copy; both artifacts descend from one
operator-authored filing instruction. The operator confirmed that direction
during VER-001 repair; the clean-room screen found no employer, credential,
internal-service, or other stop condition.
**Depends on:** WO-021 merged (beacons, sweeps, audiences); WO-008 merged
(support facets, link type-checking, SUPPORT INACTIVE). Consumes WO-009's
execution-environment profile for the mount boundary when it exists; before
that, the path-capability form below is the enforced boundary.
**Activation preflight:** read WO-021's finite v2 field domains and maximum;
re-observe exact sparse-file, atomic-rename, mtime, host-integer, and filesystem
logical-size behavior; arrange a non-repository key; refuse activation if the
v3 maximum cannot be represented and emitted within the bounds below.

**Cites (read these sections):** 04-interfaces.md §RPG / Path-of-Exile view
(helmet = perception; supports declare true cost), §Agent projection (gated
affordances; the sparse twin), §Semantic zoom; 03-architecture.md §Composition
system (step 2: capability requirements and SUPPORT INACTIVE with the exact
missing capability), §Candidate — isolated execution environments (mounts and
writable surfaces), §The agentic communication core (statechart-gated
affordances make illegal actions absent); 02-domain-model.md §Identity and
composition (Support facet, AuthorityEnvelope), §Events and decisions (Intent:
Observe), §Memory and observation (Watcher); 09-audit-resilience-privacy.md
§Privacy and minimization and §Fidelity levels (audiences); 01-principles.md
Principles 5, 10, 11, and 15; ADR-0003 Decision 4; the mechanism hierarchy in
02 §Feedback; `docs/discovery/` probe from WO-020.

**Objective:** Make a sense a thing a loadout equips, an envelope grants, an
environment mounts, and an audit records. A role without the sense cannot
compile a sweep, cannot see the affordance, is refused if it tries anyway, and
leaves a refusal event when it does. A role with the sense learns exactly the
codebook fields and nothing else.

**Observed facts (dated 2026-09-02, macOS APFS, Claude Code sandbox):** the
sandbox's read-deny does not hide metadata (`stat` on a read-denied directory
succeeds), so presence cannot be gated by read-deny between same-user agents;
a directory with search but not read permission allows `stat` by name and
refuses listing; names are 255 bytes and case-insensitive on lookup; symlink
targets are at most 1023 bytes; a 64 KiB xattr is readable and its name and
size appear in `ls -l@`; sub-second mtime keeps microsecond precision; size
and allocated blocks are independent. Re-observe rather than inherit.

**Scope discipline:**

- Three senses, each a support facet on the perception slot with the
  `observe` tag: `Beacon Sight` (codebook v1, v2, and v3 fields), `Fine Spectrum`
  (the sub-second mtime field), `Composition` (group beacons). Each declares
  its capability requirement (the beacon directory mounted or its path
  granted), its context cost (lines per sweep, measured), no authority
  change, and its evidence output (`BeaconObserved`).
- Enforcement lives at the permission and guard rungs. The compile-time
  check and the affordance gate are projections of those grants, never
  substitutes. A codebook is a skill; possession of it grants nothing.
- Path capability form: a restricted audience's beacon directory has an
  unguessable name, is created with search-only permission for scanning
  refusal, and its path is printed only into the authorized session's
  `resume -- next` briefing. Where WO-009's environment profile exists, the
  directory is a declared mount and the profile is the authority record.
- A provenance residue is a new Beacon codebook v3 field; v1 and v2 remain
  byte-for-byte decodable as `unauthenticated-legacy`. A v3 host-projected
  beacon carries an unsigned 8-bit non-secret key epoch plus an exact 16-bit
  keyed authenticator in the codeword, never in the filename or content. Epochs
  begin at zero and increase; rotation at 255 refuses and requires a later
  codebook version rather than wrapping or reusing an epoch. The host holds the
  current key outside the repository; it never enters prompts,
  logs, beacons, or fixtures. A current epoch with a bad authenticator decodes
  `forged-provenance`; a non-current or unknown epoch decodes
  `unverifiable-provenance`; rotation increments the epoch and need not retain
  an old secret key. At this width the residue is only a weak keyed
  host-consistency and error-detection signal: it detects naive or accidental
  false provenance but does not prove authorship or resist enumeration by an
  actor who can reach the path and query the decoder. The labels describe
  residue-check outcomes, not attacker identity. Mounts and the authorization
  guard remain the security boundary, and the domain model says so.
- Codebook v3 inherits WO-021's finite v2 domains and declares every new radix,
  field order, `MAX_V3_CODE`, and `MAX_V3_LOGICAL_BYTES` as data. Pure arithmetic
  uses `bigint`. The edge converts a size only after proving it is exact for the
  host API, no greater than `Number.MAX_SAFE_INTEGER`, and within the re-observed
  filesystem limit. V3 is sparse-required: its versioned content contract is
  the same JSON prefix followed by a logical zero tail whose holes survive the
  temp-file/mtime/rename path; it does not inherit v1's dense newline padding.
  `MAX_V3_ALLOCATED_BLOCKS` bounds physical allocation. If any sparse, numeric,
  or filesystem premise fails, v3 emission refuses before allocation and the
  order returns to planning rather than silently padding a huge file or changing
  channels.
- The kernel changes only where the guard needs an Observe branch and only if
  WO-021 did not already choose the `observe.*` effect namespace; the choice
  is recorded.

**Deliverables:** the three support definitions and their compile fixtures;
the sweep affordance gate in the sparse twin projection; the path-capability
directory creation in the host; the keyed residue in the codebook with its
explicitly weak verification path; tests; write-backs.

**Acceptance criteria (all required)**

1. A loadout equipping `Beacon Sight` without the mount or path grant compiles
   SUPPORT INACTIVE naming the missing capability and the concrete correction;
   with the grant it compiles active and emits its declared context cost.
2. The sparse twin for a loadout without the sense renders no sweep
   affordance; with the sense it renders exactly one.
3. A sweep intent from an envelope lacking the observe grant is refused by
   the guard with a trace naming the envelope; the refusal is an event; no
   beacon is read.
4. A sweep with the grant appends `BeaconObserved` whose observations equal
   the codebook fields and nothing else; a test proves the sense cannot return
   content, names beyond the beacon set, or xattrs.
5. A verifier loadout with `Beacon Sight` completes a verification episode in
   the walking skeleton while its environment excludes the implementer's
   narrative surfaces; blinding is asserted by a test that the verifier's
   inputs contain no implementer prose.
6. A search-only beacon directory refuses listing and permits `stat` by
   name; a self-reported v3 beacon written with the current epoch and forged
   host-projected provenance fails the keyed check and decodes
   `forged-provenance`; v1 and v2 decode as `unauthenticated-legacy`.
7. `Fine Spectrum` and `Composition` decode their fields only when equipped;
   without them the same sweep returns the coarse fields and labels the finer
   ones `not-sensed`, never `absent`.
8. The keyed residue survives replay: v3 beacons re-derived from the log
   verify under the same key and epoch; rotating the key increments the epoch
   and marks earlier beacons `unverifiable-provenance` rather than invalid,
   without retaining their old secret key. A beacon carrying an epoch never
   observed by the host also decodes `unverifiable-provenance`; the tests
   distinguish that case from a bad residue under the current epoch. Rotation
   at epoch 255 refuses without reusing an epoch or modifying a beacon.
9. Algebraic injectivity is proved over the bounded v2 × epoch × authenticator
   field product; boundary and representative round trips include zero and the
   declared maximum, every authenticator value for representative states, and
   malformed sizes around lattice and field boundaries. The computed maximum
   equals the declared constants. A maximum-size filesystem fixture stays
   within `MAX_V3_ALLOCATED_BLOCKS`, preserves its hole through atomic rename,
   and never constructs a dense buffer; unsupported-host fixtures refuse before
   creating a file.
10. `npm test` green; `git diff --check` clean; no new dependency; the key
   appears in no committed file, prompt, log, or fixture.

**Evidence gate:** compile fixtures output; affordance projection captures;
the refusal transcript; the blinding assertion output; the forged-provenance
transcript; the directory permission transcript; replay verification output.
The v3 evidence also records field cardinalities and maxima, numeric and
filesystem limits, maximum logical bytes and allocated blocks, hole preservation
through rename, malformed-boundary results, epoch exhaustion, and the
unsupported-host no-file refusal.

**Write-back duty:** 04 §RPG view gains the three senses as the first
perception supports; 03 §Composition system gains perception as a capability
requirement example; 02 gains the sense rows and the provenance residue's weak
signal property rather than an authorship proof; 09 §Privacy and minimization
gains the metadata-leak note
(existence and mtime) and the mount as the boundary; ledger entries (adopted:
sense as compiled, authorized, mounted capability; recovered: read-deny does
not hide metadata; preserved: separate-user isolation as the only stronger
boundary on a personal machine).

**Non-goals:** hiding metadata from same-user processes without a mount or a
second user (recorded as impossible here); encrypting beacon state; network or
cross-machine senses; senses over content, transcripts, or artifacts; any UI;
changing who may merge, verify, or release.
