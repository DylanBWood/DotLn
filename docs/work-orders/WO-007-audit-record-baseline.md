# WO-007 — Audit-record baseline (three projections), v0.3.0

**Model:** any capable model.
**Release classification:** `v0.3.0` minor — adds backwards-compatible audit
record and projection capability to the `v0.2.x` source application.
**Depends on:** WO-003 complete (its 13-step demo's JSONL log is the
fixture).

**Cites (read these sections):** 09-audit-resilience-privacy.md (the concern
table, §Canonical audit record, §Fidelity levels, §Persistence and recovery
classes, §Bootstrap sequence — steps 1–3 are this order's scope);
02-domain-model.md (EventEnvelope, Event store, Watcher); 03-architecture.md
§Platform and instance boundary (audit compiles through a shared record
vocabulary).

**Objective:** Bootstrap steps 1–3 of the audit map, against the walking
skeleton's real event log: enumerate the demo's consequential actions and the
questions an operator/verifier must answer about each; pin a minimal
AuditRecord envelope for WorkOrder dispatch, authority decision, external
effect, result, verification, and recovery — as references into the event
store, never a second truth; and produce three projections from the demo log:
an L0 receipt, a causal timeline, and governed raw JSON.

**Scope discipline (one step at a time):**
- Projections are pure folds over the JSONL log, disposable and rebuildable
  (09's projection persistence class). The harness may read the file; the
  folds do no I/O.
- Required properties per action class only — a refusal needs more detail
  than a NoOp; nothing populates every field (09 says so explicitly).
- Steps 4–7 of the bootstrap sequence are explicitly deferred: no access
  control, no crash-ambiguity simulation (that machinery is v0.5.0's), no
  backup/restore exercise, no dashboards.

**Constraints:** zero new runtime dependencies; lives beside or inside the
skeleton package (smallest coherent layout, noted in the result); kernel
untouched.

**Acceptance criteria (all required)**
1. The consequential-action enumeration exists, with the question each record
   answers, per audience (operator and verifier at minimum).
2. The minimal AuditRecord type compiles, and every record references
   canonical ids (eventId/commandId/episodeId) instead of copying payloads.
3. The three projections run over the WO-003 demo log: L0 receipt (outcome,
   scope, time, actor, evidence link), causal timeline ordered by
   correlation/causation, governed raw JSON; each lossy view names its
   omissions and links one level down (09's fidelity rule).
4. Step 9's structural refusal appears in the receipt and timeline with its
   authority decision visible.
5. Re-running the projections over a replayed log yields identical output.

**Write-back duty:** the pinned minimal envelope and its action classes go
back into 09-audit-resilience-privacy.md (candidate → pinned for this rung);
the roadmap's v0.3.0 line already points here; ledger duty applies.

**Evidence gate:** captured projection outputs over the real demo log; every
criterion mapped to a named test or captured output.

**Non-goals:** bootstrap steps 4–7 (access enforcement, crash-ambiguity
reconciliation, restore exercise, dashboards); privacy/retention/redaction
machinery; SQLite; signed export packages; operational logging/metrics (the
concern table keeps them distinct).

## `προτείνω` application ideation breakout receipt — 2026-09-02

The operator opened the complete `ideation:` pipeline after WO-007 reached
`ready-to-verify`, then clarified a standing shape-first interpretation rule for
all earlier and future operator analogies. This receipt expands the independent
verifier's documentation subject. It adds no runtime implementation, changes
none of WO-007's acceptance criteria or existing evidence, allocates no
`VER-NNN`, and does not move the control phase or resume execution.

- **Authority:** the operator named `προτείνω` as DotLn's prospective first-party
  flagship application and described a prose-steered simulated community,
  inspectable influence, counterfactual outcome comparison, pattern experiments,
  deep activity affordances, and replayable surprise. The follow-up explicitly
  directs synthesis to preserve the shape of situations and analogies, then work
  backward to progressively lower technical abstractions.
- **Raw intake batch:** local-only
  `docs/intake/notes/WO-007-expanded-ideation-2026-09-02-proteino-killer-app.md`;
  committed surfaces synthesize it without copying raw text or importing
  private/employer material. The clean-room pass found only personal ideation and
  public model, research, media, and game references; no stop condition.
- **Ledger/product surfaces:** `docs/lineage/idea-ledger.md` §WO-007 post-ready
  ideation — `προτείνω` flagship shape; new `docs/product/11-proteino.md`;
  bounded positioning and cross-links in `docs/product/00-vision.md`,
  `docs/product/04-interfaces.md`, `docs/product/06-roadmap.md`,
  `docs/product/10-ir-compatibility.md`, and `docs/README.md`; and the durable
  shape-first synthesis instruction in `docs/product/07-execution-guide.md`.
  `docs/publication/audience-status-index.md` classifies the new sections, and
  source locks in `docs/publication/everyday-ai-user-toc.md` and
  `docs/publication/software-engineer-toc.md` are refreshed after review of
  their linked source subtrees; neither outline changes its audience selection
  or source-base revision. The current recapture is appended to
  `docs/publication/staleness-demonstration.md` without rewriting its earlier
  evidence.
- **Source check:** the intended small-town research reference was checked
  against the primary
  [Generative Agents paper](https://arxiv.org/abs/2304.03442). Game and media
  references are recorded as operator-experience shapes rather than unsupported
  product or engine history.
- **Implementation and evidence boundary:** AuditRecord v1, projections, CLI,
  tests, captured evidence, release target, and WO-007 criteria remain
  unchanged. This breakout creates no simulator, resident model, interface host,
  runtime adapter, evaluator, executable tool, dependency, package, or work-order
  allocation.
- **Decision/schema/runtime effects:** no ADR, canonical actor kind,
  `EventEnvelope` or `AuditRecord` field, pattern schema, intervention enum,
  authority rule, world model, exact causal-proof threshold/schema/algorithm,
  persistence policy, or release scope is pinned. The product docs do pin an
  evidence ladder and limits on causal language; future `προτείνω` evidence may
  consume or propose extensions to current audit primitives through separately
  bounded work. This receipt does not claim AuditRecord v1 already supplies the
  richer intervention chain.
- **Unresolved choices:** canonical technical slug; first world and resident
  boundary; operator role; recipient-selection, comparison-subject, and
  intervention grammar; treatment of coercive or manipulative acts;
  temporary-mechanic representation and promotion; model, seed, replication,
  and nondeterminism policy; causal
  confidence and interpretation-diff semantics; outcome definitions and
  independent evaluators; specialized-activity composition; discovery versus
  mechanics inspection; privacy and retention; accessibility; release and
  work-order allocation; and evidence that the application is compelling in
  use.
- **Required review:** inspect the local source for intent coverage and
  clean-room rewriting; confirm platform, application, UI host, model, harness,
  simulated resident, and domain actor do not collapse; confirm an analogy's
  shape survives without accidental source details becoming architecture;
  speech force cannot widen authority; correlation is not relabeled as
  causation; counterfactual and latent social metrics are not presented as
  real-world facts; surprise does not hide truth from replay or audit; named
  sources are framed at their actual evidence level; speculative mechanics
  remain visibly unsettled; existing WO-007 implementation evidence is
  untouched; and raw intake remains ignored.

## Clean Room active-gem ideation breakout receipt — 2026-09-02

During repair of VER-001, the operator clarified the provenance of several
planning captures, directed that Clean Room become an active gem with
context-sensitive and thoroughness-sensitive supports, warned against naive
intervention in safe intentional prose, and explicitly authorized this session
to continue the repair after the breakout.

- **Raw intake batch:** main-checkout single-copy
  `docs/intake/notes/WO-007-expanded-ideation-2026-09-02-clean-room-active-gem.md`.
  It preserves the operator's wording and continuation authority. The
  clean-room pass found personal product/process material only and no employer,
  credential, internal-service, or other stop condition.
- **Effective manual loadout:** the locked personal-project employer/secret
  floor; Shape-First Synthesis for the new mechanic; public-destination
  vocabulary and provenance review; and a Naive Interventionism countercheck
  against gratuitous rewriting. Direct Draft Fidelity applies to the earlier
  operator-authored ready-to-file planning drafts whose identical local copies
  existed to survive compaction.
- **Ledger/product surfaces:** a new ledger section records the active mechanic,
  direct-draft provenance rule, counterweight relationship, and unresolved
  support catalog. `CLAUDE.md` and 07 record the operational floor and saved
  loadout; 03 records composition and conflict behavior; 04 records the loadout
  and inspector projection; 05 pins Clean Room as the active while leaving its
  schema and support versions open. WO-023 now treats its existing hard guard
  as the active's minimum enforcement rather than the complete future mechanic.
- **Settled boundary:** this extends composition without reopening ADR-0001.
  Employer material, private infrastructure details, credentials, and secrets
  remain non-promotable. Supports may choose treatment, add evidence, or narrow
  promotion; they never widen authority or turn a blocked source into clearance.
  Rewrite, shape-first synthesis, and exact direct filing conflict unless a
  future explicit pipeline is justified.
- **Implementation and evidence boundary:** no runtime, kernel, audit schema,
  dependency, compiler, UI, guard, or test is added by this breakout. AuditRecord
  v1 and WO-007's acceptance evidence remain frozen. A future bounded work order
  must exercise the active and support family before pinning executable types.
- **Unresolved choices:** stable support names and versions; destination-profile
  and disposition schemas; whether a strategy pipeline is ever useful; how an
  operator marks semantically load-bearing spans without granting direct filing;
  deterministic versus independent review; semantic-loss and false-assurance
  measures; review-shopping prevention; implementation order and release rung.
- **Required review:** compare the local source with this synthesis; confirm the
  hard boundary is never socketed as optional; confirm exact filing requires
  explicit operator authorship and authority; confirm assurance supports only
  add evidence or narrow promotion; inspect the Naive Interventionism link for
  both under-screening and destructive over-scrubbing; verify no runtime claim
  or ADR supersession is implied; and confirm intake remains ignored and
  single-copy in the main checkout.

## Root README direct-draft scope expansion receipt — 2026-09-02

The operator explicitly expanded WO-007's documentation subject and supplied a
complete replacement `README.md` as public-draft text. This is direct filing
authority, not a request to infer a README from raw intake.

- **Effective Clean Room strategy:** Direct Draft Fidelity under the locked
  employer/secret floor, followed by repository fact-check and publication
  review. No compaction-safety intake mirror was created because the committed
  README itself is the requested durable surface.
- **Bounded editorial handling:** the supplied voice and section order are
  preserved. Leading chat indentation was normalized so Markdown renders as
  prose, and a duplicated pair of Map bullets was collapsed. Evidence review
  then narrowed present-tense claims about replay, worker independence,
  absence policy, checkpoint availability, future interfaces, corpus coverage,
  and soft-influence composition; qualified crash recovery to the fake adapter;
  restored the supplied final clean-room paragraph exactly; and linked the
  current release index. These are truthfulness corrections, not a new pitch.
- **Scope and compatibility:** this replaces only the root README and adds no
  runtime behavior, package, dependency, release, work-order allocation, or
  change to WO-007's audit criteria. Statements about current and future
  capability remain evidence claims and enter the verifier's subject.
- **Required review:** compare the operator-supplied draft with `README.md` for
  fidelity; verify every current-capability, release, platform, test-suite, and
  active-slot claim against executable or durable evidence; check links and
  Markdown rendering; confirm the prose uses only public generic descriptions
  of the predecessor and contains no clean-room stop material; and ensure the
  two deliberate normalizations and truthfulness corrections did not change the
  intended voice.

## VER-001 repair receipt — 2026-09-02

`resume: fix` dispatched this document-only repair against
`docs/verifications/WO-007/VER-001.md`. The operator then clarified the source
provenance, opened the Clean Room ideation breakout, authorized direct
continuation, and expanded the documentation subject to include a supplied root
README draft. Those additions are recorded in the receipts above and are part
of the next verifier's subject.

- **Frozen audit subject:** repair did not change the WO-007 audit
  implementation, its tests, or the CLI integration captured at checkpoint 3.
  Current blob hashes match that checkpoint: `audit.ts`
  `9ef5b4e067554fbeccd2b2303a8465a58f83504f`, `audit.test.ts`
  `3bb723bc02620fb4d4968ea8bbf2cab5a0c6a20d`, and `cli.ts`
  `2223480d595dd896d53be9fafd3035302630bb9e`.
- **F1 — resolved by reviewed provenance:** WO-016 through WO-022 each record
  that the operator supplied a complete public ready-to-file draft and used the
  matching intake note as a compaction-safety copy. The operator confirmed that
  direction during repair. `CLAUDE.md`, the execution guide, work-order map,
  and idea ledger now distinguish authorized Direct Draft Fidelity from normal
  intake synthesis without weakening the hard clean-room screen.
- **F2 — resolved by single-copy reconciliation:** the raw 2026-09-02 notes now
  live only in the main checkout's ignored `docs/intake/notes/`. The WO-007
  worktree retains only the three tracked `.gitkeep` files. The earlier beacon
  analogy was preserved, while the later same-named planning index was retained
  under `2026-09-02-beacon-planning-capture-index.md` rather than overwriting it.
  Reconciled backups were written to
  `/Users/dylanwood/Projects/DotLn-intake-20260902T081653Z.zip` (100 files) and
  `/Users/dylanwood/Projects/DotLn-intake-20260902T150248Z.zip` (101 files).
- **F3 — resolved:** WO-023 makes definitions plus the pure compiler
  authoritative, permits exactly one tracked generated `RESIDUE.md` projection,
  forbids a separately authored tracked prompt, and byte-compares regeneration.
  Generation precedes the read-only review baseline, so its filesystem criterion
  no longer contradicts the deliverable.
- **F4 — resolved:** WO-109 now has only WO-007 as a hard dependency. Intake
  location, narrow access, image-harness readiness, budget, yield, and release
  posture are activation preflight; duplicate or wrong-location intake refuses
  activation, while a genuinely missing or unreadable item after successful
  preflight may enter the bounded partial census.
- **F5 — resolved:** WO-021 pins finite v2 radices, logical-size bounds, bigint
  arithmetic, edge representability, and dense-versus-sparse allocation rules.
  WO-022 re-observes those host premises and pins finite v3 fields, an 8-bit
  non-wrapping epoch, exact 16-bit authenticator, logical and physical bounds,
  sparse-only emission, and refusal before allocation when a premise fails. Its
  acceptance evidence now exercises algebraic injectivity, boundary values,
  representative authenticator values, maximum sparse size, and unsupported-host
  refusal without a file.
- **F6 — resolved:** WO-018 consumes only WO-017 as a hard dependency. WO-013 is
  recommended sequencing for overlapping shell-fixture hunks, with activation
  reconciliation if it has not landed; the work-order map says the same.
- **Additional authorized documentation:** the Clean Room active-gem synthesis
  and supplied root README are documentation-only expansions. They add no
  runtime behavior, package, dependency, release, authority grant, or change to
  AuditRecord v1. Their own receipts above name their provenance, boundaries,
  unresolved choices, and fresh-review duties.

Final repair evidence on this working tree: `npm test` passes all 77 tests;
`npm run skeleton` ends with `verified=true candidates=1`; `npm run skeleton --
--audit` renders all three projections and ends with the same receipt;
`npm run publication:check -- --print-locks` reports 149/149 index coverage, 27
everyday and 42 software-engineer linked source sections, and both edition locks
CURRENT; and `git diff --check` is clean. This receipt does not convert the
failed report into a pass. The next step is a fresh independent verification
with a new immutable report number over the entire repaired and expanded
subject.
