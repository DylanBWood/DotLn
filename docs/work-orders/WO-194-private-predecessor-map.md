# WO-194 — An instance keeps a private map from what its predecessors did to what carries it now, and can say when it is at least as capable; core ships the mechanism and never sees a row (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** minor. A kit command with five forms, a row
schema, an instance-owned rows file and an ignored source registry, and
a seed of public generic rows. Assigned at activation under the standing
opt-out default.
**Cost:** adds to the kit `npm run parity -- init|add|check|report|request`
(`scripts/parity.mjs`), a row schema with the six mapping statuses
product 10 proposes, an instance-owned rows file, an ignored registry of
where predecessor material can be read on that host, a seed of the
generic behaviors product 12 and the critical path already state, and a
summary by predecessor generation. Removes: the absence of any place
where an instance records what its predecessors did and whether its own
build does it yet, so that "at least as capable" is a count, not an
impression. Core gains no reader of any instance row: its tests run on
synthetic rows only. Re-mints: unknown until the export orders fix
which kit files are registered sources. Wall-clock, tokens and context
bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, items 15
and 16 (captured in ignored intake; SHA-256 in the ledger section of
that date); product 12 §Replacing a successful but costly workflow
(inventory both existing generations separately; each obligation needs
its own replacement and evidence) and its open choice on where an
instance keeps private state; product 10 §Candidate — external
rule-source import plans (the mapping statuses and read-only discovery);
`docs/decisions/0001-personal-clean-room-build.md`; the 2026-10-02
planning pass's search, which found no order covering a private map
([planning document](../planning/standard-pass-2026-10-02.md) §8).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: applies with force. Every row, fixture and example in this
repository is synthetic or already public generic text. No predecessor
capability, rule, name or structure is described here beyond what
product 12 and the critical path already say, and the executor adds
none. If building this order appears to need a predecessor fact, that
is the stop condition: stop and flag it.
**Depends on:** WO-074 (the kit and its manifest); WO-076 (instance-owned
files that compose over the kit and stay out of the manifest); WO-193
(the request draft an unmapped row can open).
**Recommended placement:** after WO-193 and before WO-118. This order
edits the export's file set, `scripts/parity.mjs` (new), kit templates,
product 10 and product 12. WO-096, queued later, builds core's own
migration rows over the operator's intake; the two share only the
generic vocabulary. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the kit file set and manifest the parity command joins"
  },
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the instance-owned files and emitted build a row's carrier is checked against"
  },
  {
    "workOrderId": "WO-193",
    "relation": "hard",
    "reason": "the request draft that an unmapped row prefills with its generic statement"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `CLAUDE.md` §Clean Room;
`docs/decisions/0001-personal-clean-room-build.md`; product 12
§Replacing a successful but costly workflow and §Open product choices;
product 10 §Candidate — external rule-source import plans; product 04
(the external rule-source mapping preview);
`docs/planning/critical-path-2026-09-08.md` §The destination in the
operator's terms (the parity sentence);
`docs/work-orders/WO-112-core-run-loop-proof.md` (parity measured item by
item in core); `docs/work-orders/WO-096-migration-ledger.md` (core's
shape rows and what it declines);
`docs/work-orders/WO-076-instance-build-overlay.md`;
`docs/work-orders/WO-193-instance-capability-requests.md`; the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§8.

**Objective:** An operator moving a team from an earlier workflow to an
instance can list, privately, each thing the earlier generations did,
point at where it lives, record what in the instance now carries it and
how faithfully, and read one summary that says what is still missing.
What is missing and belongs in core becomes a generic request; nothing
else leaves.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- Product 12 says to inventory the useful behaviors of both existing
  generations separately and to give each obligation its own
  replacement and evidence; it leaves open where an instance keeps
  private state and what parity justifies retiring a step. No order
  builds the inventory.
- Product 10 proposes mapping statuses (exact, adapted, lossy, unmapped,
  blocked, unverified), parity fixtures and read-only discovery of an
  organization's own rule stores, as provisional vocabulary with no
  schema and no command.
- WO-096 builds typed rows in core from the operator's own captured
  notes, with employer-specific shapes present only as counts; it
  declines importing or paraphrasing any predecessor file. WO-112 scores
  the generic parity sentence in core. Neither gives an instance a
  place for its own private rows.
- The kit's manifest already excludes instance files, and the overlay
  is instance-owned; nothing instance-owned yet records predecessor
  capability.

**Design (scope discipline):**

- **What core ships.** A command, a schema, templates and a seed. The
  seed holds only rows this repository already states in public generic
  terms (product 12's table and the parity sentence), each `unverified`.
- **A row.** An identifier; the predecessor generation it belongs to,
  under labels the instance chooses; a kind (capability or rule); a
  generic statement of the behavior in public terms; a private source
  reference (a registry key and a locator); a mapping status; for
  `exact`, `adapted` and `lossy`, the carrier in the instance (a unit or
  support in its emitted build, a profile document, or an instance
  order) and, for `lossy`, what is lost; for `unmapped`, a request
  identifier or a recorded decision not to carry it; for `blocked`, the
  blocker; and the path of the parity evidence, if any.
- **Where things live.** Rows are instance-owned at a path the
  configuration names; the registry of source locations is ignored
  local state; neither is in the kit manifest, and no export, update or
  receipt command reads either. The commands read a source's locator
  and never copy a source's bytes.
- **The check.** `parity check` refuses a row with a missing or unknown
  field for its status, a carrier that the instance's emitted build or
  order set does not contain, and a private field's text appearing in a
  kit file or a request draft. `parity report` prints counts by
  generation, kind and status, and one line per generation: at least as
  capable when it has no `unmapped`, `blocked` or `unverified` row.
- **From a gap to a request.** `parity request <row>` opens a WO-193
  draft holding the row's generic statement and nothing else from the
  row; the draft then passes through that order's screens and the
  operator's ready line like any other.
- **Declined alternatives, recorded:** rows in core for a real
  predecessor (the floor); an importer that reads predecessor rule files
  and proposes rows (product 10's candidate; it needs an observed source
  and an instance's authority, and reopens as an instance order after
  that instance's first order observes its host); a shared map across
  instances (instances are not tracked); reusing WO-096's renderer
  (queued later and built over a different source; the vocabulary is
  shared when it lands).

**Deliverables:** the kit command, schema, templates and seed; the
configuration key for the rows path; fixtures over synthetic rows; the
write-backs below.

**Acceptance criteria (all required)**

1. In an exported instance, `parity init` writes the rows file from the
   seed at the configured path and creates the ignored registry; the
   kit manifest lists the command, schema, templates and seed and
   neither the rows file nor the registry; a second `init` changes
   nothing.
2. `parity add` writes a row and refuses one whose fields do not fit its
   status, naming the field; a table test covers every status.
3. `parity check` refuses, naming the row: a carrier absent from a
   fixture build and order set; a `lossy` row that says nothing is
   lost; an `unmapped` row with neither a request nor a decision; and a
   private field's text found in a kit file or in a request draft.
4. `parity report` over a synthetic set of two generations prints the
   counts and, per generation, whether it is at least as capable, with
   the rows that prevent it.
5. `parity request <row>` writes a WO-193 draft whose body is the row's
   generic statement; a test shows that no other field of the row
   appears in the draft.
6. An update fixture leaves the rows file and the registry byte for
   byte unchanged, and an export from a core checkout that holds a
   synthetic rows file writes none of it into the kit.
7. Every row, fixture and example committed by this order is synthetic
   or quoted from product 12 or the critical path document; the final
   review records the check that found it so.
8. Write-backs: product 12 answers its open choice on where an instance
   keeps this private state and names the report as the parity measure
   an instance uses; product 10's candidate says its mapping statuses
   are in use by the instance map; the kit's client README names the
   command; the decisions file and index; the publication locks
   refreshed.
9. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixtures and table tests of criteria 1 to 6; the
recorded check of criterion 7; `npm test -- --review` before
`implementation-ready` and again at final review. No live row: a real
map exists only in an instance and is never evidence here.

**Write-back duty:** as listed in criterion 8.

**Known issues and carry-ins:**

- The check that a private field does not appear in a kit file or a
  draft compares text; a paraphrase passes it. The request's floor is
  the operator's reading (WO-193).
- An instance that copies predecessor text into its own rows is acting
  inside its own boundary; what this order guarantees is that core's
  commands never carry a row out.
- The file names of the export are fixed by WO-074 and WO-076; this
  order follows them as landed.
- A capability an instance needs and core lacks, such as reading work
  from a tracker other than the forge's issues, is a row with status
  `unmapped` and then a request; the port for an instance-owned source
  adapter is a candidate in the planning map, not this order.

**Non-goals:** any row about a real predecessor in this repository;
reading or importing predecessor material; an adapter for any tracker;
deciding what an instance may retire; tracking instances from core.

**Operator-review assumptions**

1. Core ships mechanism and public seed rows only; the map's content
   exists only in the instance.
2. Generations are labels the instance chooses; this repository keeps
   its own generic terms.
3. "At least as capable" means no row of that generation is unmapped,
   blocked or unverified.
4. The only way anything derived from a row leaves an instance is a
   WO-193 request built from its generic statement.
