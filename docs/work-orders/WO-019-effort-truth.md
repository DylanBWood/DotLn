# WO-019 — Effort truth: declared in the work order, attested in the control log, v0.3.4

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any. Until this order
lands, these values are self-reported in the result. The final reviewer must
confirm the order's own attestations were recorded through the mechanism it
ships, and disclose that as a self-referential instrument per
07-execution-guide.md §Discipline.
**Release classification:** `v0.3.4`, the patch strictly above the latest
published tag (`v0.3.3`) observed at activation. The activation helper retained
the draft placeholder; the executor forward-corrected the authority before
implementation-ready, following the same disclosed path as WO-025. Process and
tooling; no exported runtime capability.
**Nomination provenance:** the operator's 2026-09-02 ad hoc planning session,
discharging the "durable consequence, not yet built" clause of the ledger's
2026-08-31 effort-truth entry and the open question carried by
`docs/verifications/WO-015/VER-001.md` Observation 2 and
`docs/final-reviews/WO-015/FINAL-001.md` §Remaining deviations. Opaque
identifier, not a priority.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The same message was first preserved
in ignored intake only as a compaction-safety copy, so its earlier filesystem
timestamp does not make it the source of an agent-authored synthesis. Both
artifacts descend from one operator-authored filing instruction. The operator
confirmed that direction during VER-001 repair; the clean-room screen found no
employer, credential, internal-service, or other stop condition.
**Depends on:** `main` at or after `v0.2.3`. WO-013 merged is recommended so
this order's edits to `scripts/test-resume.sh` do not collide with its
temp-root hunks. Land before WO-018, which refactors `scripts/resume.mjs`.

**Implementation clarifications (2026-09-02):** Read-only pre-evidence audits
made several stated duties executable before implementation-ready. “Header” now
means unique, ordered Model/Effort fields in the leading metadata region rather
than matching body examples. A recognized effort requires value-specific
selector or readback evidence for the exact harness version, and readback-source
eligibility is version-scoped. Actor inputs refuse projection-breaking control
characters. The objective now says the source-labeled claim—not an unobserved
effective setting—is the durable fact, and final review inventories every
executor-role completion rather than only initial readiness. New activations
mark declaration validation so a missing field on legacy active history remains
forward-compatible without weakening WO-019 or later activations. Finally, report
prose cannot compare itself with a completion event created after the report, so
the report-agreement duty compiles into one normalized JSON actor header that
`verification-result` and `final-review-result` compare with their flags before
append. These are bounded, forward-only clarifications of the direct draft's
declaration, epistemic, projection, and agreement duties; they add no objective,
deliverable family, or lifecycle authority and lower no criterion.

**Cites (read these sections):** 01-principles.md Principle 8 (no silent model
degradation) and Principle 15 (environment truth; epistemic labels);
07-execution-guide.md §Model-specific notes (the documented gap) and
§Discipline (forward-only enforcement; disclose a self-referential
instrument); `docs/PLAYBOOK.md` §Who does what (the operator-reported drift:
Codex ran at low through WO-001 to WO-003 while the table read xhigh);
`docs/lineage/idea-ledger.md` "Effort truth" entry (§WO-003
verification-window corrections); `docs/discovery/environment.md` rows
"Effort selection" and the WO-004 addendum's explicit-effort observation;
`docs/discovery/environment.json` `effortSelection` and the Codex
`modelSelection` row (`selectedModelEchoed: false`); 02-domain-model.md
§Actors and episodes; `docs/work-orders/WO-009-real-disposable-worker.md`
acceptance criterion 6 (record `unknown`, never invent a flag);
03-architecture.md §Session lifecycle & resilience (resume control v1).

**Objective:** Make each completion actor's declared effort requirement and
sourced effort attestation durable, checked, and projected control-plane facts
rather than a prose table the operator later reported as false for three work
orders. Declaration
lives in the work-order header; attestation lives in the append-only control log
with an epistemic source label; the transition refuses a below-declared claim;
the projection shows the latest attestation and any drift within a work order.
The record proves receipt of the labeled claim, not an unobserved effective
setting.

**Observed problem (dated 2026-09-02):** every `**Model:**` line reads "any
capable model" or "Codex (any capable tier)"; none carries an effort. The
execution guide and playbook ask each session to state model and effort "in
your result", but an executor's result is chat narrative: no executor's
model, effort, or harness appears in any committed artifact, while every
verifier and reviewer header states them as free prose. Those headers already
use `ultracode`, which is not one of the five documented Claude `--effort`
values, and the WO-101 Codex verifier could only write that effort "was not
surfaced". Nothing compares a configured effort to a declared one, and nothing
would show a change of effort between one work order's transitions.

**Scope discipline:**

- The leading metadata header begins after the level-one title and ends at the
  first `**Objective:**` field or level-two heading. It may contain an
  operator-authored notice and other metadata, but it contains exactly one
  `**Model:**` and one `**Effort:**`; the complete Effort field follows the
  complete Model field apart from blank lines. Exact duplicate labels elsewhere,
  including examples, are ambiguous and refuse.
- Vocabulary is pinned from discovery, not invented. The Claude ladder is
  `low < medium < high < xhigh < max`. A recognized ladder claim is accepted
  only when discovery records that value through selector or readback evidence
  for the same harness and harness version; otherwise the transition refuses
  and the harness must attest `unknown`. Any other label the session uses is kept verbatim in a `raw` field
  and compares as `unknown`: an unrecognized `--effort <label>` input is
  recorded as `effort: "unknown", raw: "<label>"`; no separate flag or silent
  coercion is used.
- Two declaration forms per role: `<level>+` (ladder minimum; `unknown` is
  refused) and `any` (everything accepted, including `unknown`; the form a
  planner chooses when an otherwise eligible actor can attest only `unknown`).
  Roles are `executor`, `verifier`, `reviewer`; all three must be present.
- Attestation is an `actor` object on the four completion events:
  `ImplementationReady`, `VerificationCompleted`, `RepairCompleted`,
  `FinalReviewCompleted`. Fields: `harness` (`claude-code | codex-cli | human |
  other:<label>`), `harnessVersion`, `model`, `effort`, `raw` (optional),
  `source` (`self-reported | harness-readback | operator-attested`). Adding
  fields to events keeps control-log schema version 1; readers ignore unknown
  fields and `fold` is unchanged for existing events.
- Actor flag values are single-line data: control characters and Unicode line
  separators refuse before append so a value cannot forge the Markdown
  projection. For a structurally absent field use the literal
  `not-applicable`; `unknown` means a value exists but is unavailable. The
  convention for an unassisted `human` actor is `model: "human"` and
  `harnessVersion: "not-applicable"`.
- Verification and final-review reports carry exactly one machine-readable
  `**Actor attestation:** {<normalized actor JSON>}` header beside their prose.
  Its canonical serialization orders `harness`, `harnessVersion`, `model`,
  `effort`, optional `raw`, then `source`, with no extra whitespace.
  Because the report exists before its completion event, the completion command
  compares that header with its actor flags before append. Success is the
  agreement proof; the immutable report is never asked to inspect or edit
  itself after its future event.
- `harness-readback` is permitted only for the exact harness version whose
  readback path this order observed. The probe distinguishes persisted effort (a settings key)
  from the session's effective effort (a flag or in-session change) and labels
  each `observed`, `documented locally`, `not found`, or `blocked`. It reads
  no personal settings file into the repository and prints only the level.
- A below-declared attestation refuses and appends nothing. There is no
  override flag; the recovery path is a dated operator amendment to the work
  order's Effort line, then the transition is re-run.
- Forward-only. Existing drafts gain their Effort line when the planner
  activates them, in the same edit as the version. History is not backfilled;
  a dated migration note records the discontinuity where readers meet it.
- New `WorkOrderActivated` events carry
  `effortDeclarationValidated: true`. That schema-v1 marker prevents later
  deletion of a declaration from masquerading as legacy. A genuinely
  pre-WO-019 active event without the marker may finish under a visibly
  synthesized `any` declaration if its authority lacks Effort; WO-019 itself is
  the strict migration boundary and receives no fallback.
- The kernel is untouched. The `actor` shape is written to the domain model as
  the control-log record and as a candidate for WO-009's episode events.

**Deliverables:** `scripts/resume.mjs` changes (Effort-line parse at
`activate`, `--harness/--harness-version/--model/--effort/--source` on the
four completion actions, the ladder check, the `next` briefing, two projection
lines);
`scripts/test-resume.sh` cases, including report-header agreement; the harness
readback probe recorded in
`docs/discovery/environment.md` and `environment.json`; runbook and guide
updates; Effort lines added to WO-016, WO-017, and WO-018 drafts if they are
not yet activated (planner duty, recorded in the result).

**Acceptance criteria (all required)**

1. `activate` refuses a work order lacking exactly one `**Model:**` line or one
   well-formed `**Effort:**` line naming all three roles, when either field is
   outside the leading metadata region, or when Effort does not immediately
   follow the complete Model field (apart from blank lines). It appends nothing
   and names the missing, duplicate, misplaced, or malformed line. Existing
   activated orders are unaffected: a pre-WO-019 active event with no new
   validation marker receives a visible legacy `any` declaration, while WO-019
   and marked activations remain strict.
2. Each of the four completion actions refuses without a complete `actor`
   (all five required fields), appends nothing, and prints usage. It also
   refuses control or line-separator characters. With a complete eligible actor
   the event carries recognized values byte-for-byte and carries an
   unrecognized effort as the pinned `unknown` plus verbatim `raw` pair.
3. The ladder check: for the role the action implies, an attested effort
   below a `<level>+` declaration refuses with a message naming both values
   and the amendment path; at or above passes; `unknown` passes only under
   `any`; a `raw` label outside the ladder compares as `unknown`.
4. `resume -- next` in phase `active` prints the declared Model and Effort
   lines in its briefing, so the requirement reaches the session at dispatch.
5. `current.md` gains `- Latest attestation:` (harness, version, model,
   effort, optional raw label, source) and `- Effort drift:`. Drift compares
   the normalized pair `(effort, raw ?? null)`: two unknown attestations with
   different raw labels are drift, while repeated identical pairs are not.
   The projection renders an unknown value as `unknown (raw: <label>)`, never
   discarding the original label; drift is `none` or names the differing
   pairs within the active work order. `status` remains read-only.
6. The readback probe result is recorded per harness and version with epistemic
   labels; `harness-readback` is accepted by `resume` only for that exact
   version when effective readback is recorded as `observed`, and refused with
   an explanation otherwise. A recognized effort claim likewise requires
   value-specific selector or effective-readback evidence for the exact
   harness/version; without it the transition refuses and the caller must attest
   `unknown`. No selector or effort flag is invented.
7. `scripts/test-resume.sh` covers criteria 1 through 6 in its existing
   non-git fixture, including one full lifecycle whose events all carry
   actors, one refusal per rule with "no event appended" asserted, and one
   drift case. It also proves verification/final-review report actor headers
   are checked before their completion events append.
8. The order's own transitions were recorded through the shipped mechanism,
   and the final review states every executor-role completion actor
   (`ImplementationReady` and any `RepairCompleted`; there is no executor or
   repair report), every verifier report-header/control-event pair, and the
   reviewer's own prose plus machine header and intended completion actor. The
   `final-review-result` pre-append check makes the completed immutable report
   plus control event the confirmation that the reviewer pair agrees.
9. `npm test` green; `git diff --check` clean; no `.claude/` or personal
   settings change; no new dependency.

**Evidence gate:** `test-resume.sh` output; the probe transcript per harness
with version; `current.md` before and after one attested transition; the
refusal transcripts; the order's own `resume.jsonl` events showing actors.

**Write-back duty:** 07-execution-guide.md §Model-specific notes rewritten
from "no executable check exists" to the mechanism, with the dated migration
note; `docs/PLAYBOOK.md` §Who does what: the effort column becomes a pointer
to declared lines and the drift paragraph becomes history; 02-domain-model.md
§Actors and episodes gains the `actor` record (pinned for the control log,
candidate for episode events pending WO-009); `docs/verifications/README.md`
and `docs/final-reviews/README.md` state the header-agreement duty;
`docs/planning/work-order-map.md` column "Model / harness / environment"
shows declared effort; ledger entry appended beneath the 2026-08-31
effort-truth entry (`adopted`: declared, attested, checked, projected), never
rewriting it.

**Non-goals:** kernel changes; runtime episode events and the `ResultEnvelope`
(WO-009); actor fields in the release manifest (record as a candidate);
measuring the effect of effort on evidence quality; backfilling historical
events or reports; a Codex effort selector; reading personal settings files
into committed artifacts; an override flag for lower effort.

## Ideation breakout receipt — 2026-09-02

- **Authority:** during execution, the operator opened ideation on an editable
  selective-memory simulation, work-order-scale effort experiments, local
  models, compiled senses, phase-specific intervention restraint, and private
  external-target configuration; then generalized the minimization idea to edge
  assertions, an opt-in local evidence sink, a public/private data lane, and a
  recurring Snooping Footprint Reducer. The operator also required the private
  lane's future backup/transformation tools to remain outside Git and network
  processes and proposed their action-performing gems as evidence, then
  clarified that an authorized acquisition pipeline may use `fetch`/XHR while
  its compiled link group proves observation supports did not participate. The
  latest addition asks for an inspectable, adjustable account of every form of
  user-derived data that would enter a remote model, with local inference as a
  possible alternative, then proposes a hybrid local-first setup where local
  inference derives basic tags/associations and remote models receive bounded
  planning or coding orders. The operator then rejects any assumption that the
  initial local-quality gap is durable and expects hardware/model progress to
  move the boundary steadily localward, then generalizes routing into
  operator-wired semantics on data-bearing primitives, roles, and supports:
  local, remote, both, or neither. The operator explicitly preauthorized
  continuation of WO-019 after or during the intake pipeline.
- **Raw batch and treatment:**
  `docs/intake/notes/WO-019-expanded-ideation-2026-09-02.md` is the ignored,
  unedited capture. This is ordinary Shape-First Synthesis, not Direct Draft
  Fidelity. The clean-room screen found no employer, credential,
  internal-service, or other stop condition.
- **Promoted surfaces:** the newest section of
  `docs/lineage/idea-ledger.md`; `11-proteino.md` §Candidate — recap-primed
  resident memory and its unresolved-choice addition; and the bounded
  effort/local-inference/sparse-intervention and hybrid-routing experiment in
  `06-roadmap.md` §Counterfactual profiling work orders.
  `05-pattern-library.md` §Clean Room now makes Beware of Naive Interventionism
  phase-selective rather than part of the saved bare-ideation build and carries
  external-target privacy, while §Candidate — Snooping Footprint Reducer carries
  the recurring minimizer;
  `03-architecture.md` §§Composition system, Agent-originated product
  suggestions, and Ports carry participation proof, suggestion authority, and
  the matching adapter and model-input boundaries;
  `09-audit-resilience-privacy.md` §§Candidate — model-input exposure plans and
  Candidate — public Git with a local private evidence lane carry model
  disclosure, acquisition, public/private-data, and offline-maintenance
  boundaries;
  `02-domain-model.md` and `07-execution-guide.md` clarify the epistemic limit
  of self-report.
- **Scope effect:** the breakout adds product direction and future experimental
  framing only. It changes no WO-019 code contract, acceptance criterion,
  schema, version, ADR, release classification, or dependency. The local-model
  probe/benchmark, effort-quality measurement, simulation implementation, and
  broader senses work remain outside this order; queued WO-022 keeps its
  existing beacon-perception scope. Local inference carries an
  earliest-practical next-planning-pass priority, not an activation or sequence
  change in this order. No URL, endpoint, credential, private
  identifier, external adapter implementation, telemetry schema, storage path,
  maintenance tool, backup target, timer, or new authority was imported or
  selected. No remote-model provider policy, retention claim, default exposure
  profile, universal routing rule, concrete preview representation, or UI
  implementation was selected beyond the requested inspectability. The literal
  option to disregard a declared effort was preserved as a tension but not
  adopted because it would contradict this order's active
  acceptance criteria; a false required-model claim would separately contradict
  Principle 8.
- **Unresolved choices:** recap granularity, transform semantics, activation and
  persistence, awareness/disclosure/consent rules, baseline and seed policy,
  local runner and no-egress evidence, evaluator suite and repetition count,
  whether a high-consequence ideation promotion should opt into intervention
  restraint, how a local binding store proves non-persistence without exposing
  targets, the reducer's footprint schema/cadence/protected evidence floor and
  initial surface, the private store/projection/encryption/retention design,
  offline backup roots and failure model, maintenance receipt and negative-test
  contracts, the runtime evidence needed to bind actual execution to a compiled
  non-participation manifest, the model-input taxonomy and preview UI, remote
  approval defaults, provider-assertion evidence, safe public aggregation, the
  local-runner isolation needed for no-provider/no-egress claims, hybrid-route
  quality/privacy thresholds, re-profiling triggers and escalation behavior,
  graph typing and precedence for per-edge disclosure choices, whether the
  declared-effort obligation should ever be explicitly superseded, and whether
  comparative results or privacy work justify a separately nominated work
  order.
- **Required review:** the independent verifier and final reviewer digest this
  receipt and the promoted sections; check source treatment, intent
  traceability, immutable-history and no-mind-reading boundaries, alignment with
  the existing model/harness/senses split, phase-selective support composition,
  external-target non-persistence, event-shape leakage, honest
  capability-deficit and self-report labeling, suggestion-only authority for the
  reducer, the limit of action-gem self-evidence, Git/network independence for
  local maintenance, acquisition-versus-maintenance separation, model-input
  exposure coverage and truthful local/remote claims, and that no speculative
  experiment was presented as implemented or allowed to expand WO-019
  acceptance.

## Ideation breakout receipt — 2026-09-03

- **Authority:** during repair, the operator opened ideation on alternative
  ways incoming communication may participate in decisions, using a remembered
  scientific contrast and the existing mitigated-speech vocabulary as familiar
  lenses. The operator also nominated _Jujutsu Kaisen_ for explicit rule-system
  modeling and pattern discovery, including analogies used inside the story,
  and separately preauthorized resuming the WO-019 fix after the complete
  ideation pipeline.
- **Raw batch and treatment:**
  `docs/intake/notes/WO-019-expanded-ideation-2026-09-03.md` is the ignored,
  unedited capture. This is ordinary Shape-First Synthesis, not Direct Draft
  Fidelity. The clean-room screen found no employer, credential,
  internal-service, or other stop condition. Physics, series, and episode
  details remain attributed operator recollections and were not promoted as
  verified facts.
- **Promoted surfaces:** the newest section of
  `docs/lineage/idea-ledger.md`; `05-pattern-library.md` §Candidate — influence
  response policies; and `00-vision.md` §Inspirational sources, where the named
  series is nominated but not yet mined. No domain schema, ADR, roadmap entry,
  or implementation surface changed.
- **Scope effect:** this addendum records future product/pattern direction and
  source-grounded research framing only. It changes no WO-019 code contract,
  acceptance criterion, version, release classification, dependency, authority,
  or sequence. No simulator, fictional-content importer, canon database,
  influence-policy compiler, evaluator, or UI is implemented. Existing `Voice`,
  `AttentionPolicy`, `PolarAxis`, graded-proposition, and hard-guard semantics
  remain unchanged; no literal physics mapping or universal response policy was
  selected.
- **Unresolved choices:** the mapping from the operator's remembered
  frequency/amplitude terms to formal signal axes; whether a decisive band
  represents `Voice`, urgency, authority, evidence strength, source trust,
  consequence, or something new; policy scope across identity, relationship,
  proposition, task class, situation, and loadout; catalog completeness,
  composition and precedence, count/time/decay semantics, deduplication,
  saturation, and spam or Sybil resistance; whether a result represents
  attention, epistemic support, activation, preference pressure, or decision;
  what internally anchored judgment accepts or excludes; policy learning,
  versioning, and counterfactual evaluation; fictional-source and copyright
  boundaries, canon/adaptation choice, contradiction and unknown handling,
  spoiler policy, modeling granularity, and representation; whether an analogy
  is an in-world explanation, an operator-authored view, or both; and whether a
  later bounded order should mine and model the nominated source.
- **Required review:** the independent verifier and final reviewer digest this
  addendum and the promoted sections; check clean-room rewriting and intent
  traceability; ensure no scientific or canon recollection became an asserted
  fact; keep the four response shapes open and distinct; ensure `Voice`,
  urgency, evidence, trust, authority, and aggregation are not conflated; retain
  hard-constraint and rare-catastrophic precedence regardless of counts; avoid
  fake precision and hidden identity drift; keep fictional vocabulary optional
  source/application content rather than kernel doctrine; and confirm nothing
  was presented as implemented or allowed to expand WO-019 acceptance.
