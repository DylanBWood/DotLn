# WO-014 — Approval-burden baseline, remediation, and fresh-session acceptance (version assigned at activation)

**Model:** any capable model per harness for the executor; the independent
verifier must reproduce in genuinely fresh sessions; the operator must
witness at least one final interactive run (criterion 15 states its
fallback). State the model and effort actually run for every session that
produces evidence (07-execution-guide.md §Model-specific notes). Harness
authority stays with the operator: this order authorizes no change to
personal settings, and any setting change it finds necessary returns to
the operator as a decision packet.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Documentation, process and test
infrastructure; no exported runtime capability. Assigned at activation
under the standing opt-out default.
**Cost:** adds the phase-1 reconciliation (the runbook's recorded-posture
row and post-correction paragraph as dated observations with a drift
rule; forward-pointing Amendments entries in ADR-0003 and ADR-0004),
baseline and final approval-surface matrices per harness under
`docs/discovery/` with the sanitized transcripts they cite, a synthetic
approval-surface fixture under `scripts/`, the script, path or invocation
fixes the baseline names with a test each, the runbook's
observed-behaviour section with an approval budget per scenario, the
verifier's reproduction and the operator-witnessed run record. Removes the
unnecessary boundary crossings the baseline finds, unknown until it runs.
Re-mints: none planned; a fix to a registered evidence source (among them
`scripts/build.mjs`, `scripts/lib/helpers.mjs`, `git.mjs` and `paths.mjs`)
would owe a deterministic re-mint of each edition it stales, and a fix to
a file the feedback verifier judges one live feedback self-host episode,
which the executor runs on a configuration the operator's 2026-09-28
direction accepts; the baseline decides whether either happens. The
fresh sessions per harness, the verifier's reproduction and the witnessed
run are live sessions of unmeasured cost. Wall-clock, tokens and context
bytes are unknown until run.
**Nomination provenance:** nominated by the operator during the WO-006 final
review and created under operator direction; see
`docs/final-reviews/WO-006/FINAL-001.md` §Follow-up work-order nominations.
The identifier is an opaque stable reference assigned at creation, not a
priority or an activation decision. It is the separately activated
dedicated work order that WO-006's operator deferral (the paragraph
"Operator deferral for the VER-002 repair" in
`docs/work-orders/WO-006-publication-bootstrap.md`) and
`docs/verifications/WO-006/VER-003.md` §Operator-deferred axes — recorded,
not scored call for; its first phase reconciles the personal posture
record, startup evidence, and the ADR and runbook claims that VER-002
disclosed and VER-003 scored neither way. Amended by the 2026-09-28
planning pass, which re-observed the order on `main` at `5f3849ec`: the
recorded posture runs no host sandbox in any of the three CLIs, so the
criteria that presumed one are stated for each harness's recorded mode,
the two steps the operator witnesses have fallbacks, and the moved rule
and renamed runbook section are cited where they stand
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-013 merged (its verified result removed the one known
artificial sandbox escape, so the baseline is not dominated by an
already-understood defect; closed, `v0.3.1`); WO-006 merged (the runbook,
ADR-0003 through ADR-0005 and the deferral this order discharges; closed,
`v0.2.3`).
**Recommended placement:** last in the sequence (placed there by the
2026-10-02 planning pass, so that every open order has a position and
none floats beside the list). It moves up when a pass finds approval
friction recorded as a constraint under the posture recorded on
2026-09-17 and reaffirmed on 2026-09-25, no host sandbox in Claude Code,
Codex or Copilot (operator-review assumption 1); the pass that reaches
it re-observes that gap and withdraws the order if it is absent. It edits
`docs/AI-HARNESS-SECURITY.md`, the Amendments of ADR-0003 and ADR-0004,
`docs/discovery/`, a synthetic fixture under `scripts/` and the scripts
its baseline names. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-013",
    "relation": "satisfied-by-release",
    "release": "v0.3.1",
    "reason": "the order's own Depends on"
  },
  {
    "workOrderId": "WO-006",
    "relation": "satisfied-by-release",
    "release": "v0.2.3",
    "reason": "the order's own Depends on"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 04-interfaces.md §Terminal first, console
equal — the interruption policy (interruptions arrive only as decision
packets under six materiality conditions; the never-ask list) and the
candidate attention interface; 00-vision.md §Mission — increase the chance
of operator flow (dependable surrounding work is a means; no inferred
operator state); 05-pattern-library.md §Candidate — The Malcolm Check,
restraint-attribution paragraphs (selection disposition separate from
enforcement/effect outcome; `unknown` instead of inferred reasoning;
`participated` absent counterfactual evidence);
09-audit-resilience-privacy.md §Canonical audit record and §Privacy and
minimization; `docs/AI-HARNESS-SECURITY.md` in full, especially §Current
mode choices and settings locations — 2026-09-17, §Recorded host posture
(2026-09-01, with dated amendments), §Authority boundary measurement —
WO-136, 2026-09-17 and §Why recovery checkpoints warn under sandboxed
Codex; ADR-0003 Decisions 1, 4, 5, and 7; ADR-0004 Decisions 2, 3, and 5;
ADR-0005 Decisions 3 and 5 (a fresh-session mode check is required
evidence when the defect is startup behavior), and the three ADRs'
Amendments (the 2026-09-25 entry supersedes the sandbox-on posture);
`docs/PLAYBOOK.md` §Harness safety baseline (the Codex first-invocation
approval rule, moved from product 07 by WO-090 and scoped by WO-161 to the
retained `workspace-write` plus `on-request` mode); 07-execution-guide.md
§Discipline (no config mutation of safety boundaries without explicit
work-order authority — this order grants none) and §Model-specific notes;
01-principles.md Principles 5, 6, 8, 10, and 14;
`docs/work-orders/WO-006-publication-bootstrap.md` (the operator deferral
paragraph and §Claude startup correction receipt — 2026-09-01);
`docs/verifications/WO-006/VER-002.md` §Status of the four VER-001
findings (finding 1) and `docs/verifications/WO-006/VER-003.md`
§Operator-deferred axes — recorded, not scored; `scripts/test-runner.mjs`
(the suites that need the outside and the refusal under a sandbox in
force); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Make approval behavior an observable, executable acceptance
contract for each harness the runbook records with a qualified role —
Claude Code, Codex CLI and Copilot CLI at `5f3849ec` — at recorded
versions and in its recorded mode, measured by the prompts actually
encountered during representative work in fresh sessions, not by settings
readback or interface labels. Reduce unnecessary boundary crossings by
fixing scripts, paths, and invocation structure, never by disabling a
sandbox, enabling unsandboxed fallback, or adding a broad or persistent
allow rule.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-01 and filed at `039788a7`):**

- The posture the order was written against is no longer the one in use.
  The runbook records the operator-reported posture of 2026-09-17, Claude
  sandbox off with auto mode on and Codex approval `never` with
  `danger-full-access`, reaffirmed on 2026-09-25 as no host sandbox in
  Claude Code, Codex or Copilot (the ADR-0003 amendment, WO-161); the
  September 1 sandboxed configuration is kept as a reference, and Claude's
  mode is operator-attested, not probed. Several criteria as filed
  presume an enabled host sandbox: scenario C's "documented sandbox";
  criterion 11's denials, where with no filesystem sandbox command rules
  do not stop an arbitrary program from reading a path and DotLn's
  refusals are not confinement; criterion 12 read as a statement about the
  harnesses; and criterion 16's full gate "inside the sandbox", which the
  runner refuses because its skeleton and portfolio suites need the
  outside. Under Codex approval `never` no approval request is raised, so
  scenario D's approve, deny and recover sequence has nothing to exercise
  there. Whether approval friction is still a constraint under this
  posture is not decided here.
- No fresh session has run a representative workload while counting and
  classifying interruptions: no approval-surface matrix exists under
  `docs/discovery/`. Two partial observations exist: a fresh
  noninteractive Claude session ran the unchanged `npm test` without a
  prompt on 2026-09-02 under the sandboxed posture, and the WO-136
  authority matrix of 2026-09-17 is recorded as inconclusive, with
  human-prompt telemetry unavailable.
- Three harnesses have qualified roles, Copilot CLI having joined with
  WO-146; the order was written for two.
- The WO-006 repair's settings readback, which VER-002 confirmed on six of
  seven pinned axes, is configuration evidence of the September 1
  posture, and its fresh-session startup half rests on the executor's
  receipt. The WO-006 final review met two further boundaries (the GitHub
  CLI could not read its configuration directory; the Git credential
  helper reported a keychain store failure while a read-only remote query
  still succeeded), which belong in the baseline as classified
  observations. WO-013 removed the hardcoded fixture roots, one source of
  unnecessary escalation; others may remain.
- The runbook section the order called §Current posture is now §Recorded
  host posture (2026-09-01, with dated amendments); its "Remembered
  command rules" row still reads "no checkout-local allow entries", its
  post-correction paragraph keeps its present tense, and no drift rule
  for verification fan-out is stated.
- ADR-0003, ADR-0004 and ADR-0005 carry Amendments with a WO-161 entry of
  2026-09-25; none points ADR-0003 Decision 2 to ADR-0004 Decision 1,
  which partially superseded it, or ADR-0004 Decision 4 to ADR-0005
  Decision 1, which superseded it.
- The Codex first-invocation approval rule left product 07 for the
  playbook's §Harness safety baseline (WO-090) and applies only to the
  retained `workspace-write` plus `on-request` mode (WO-161).
- The formatter has covered code only since 2026-09-13 (WO-130 D008) and
  ignores every `.md`, `.json` and `.jsonl` file, so `.prettierignore` has
  no immutable-evidence category to extend.

**Design (scope discipline):**

- Phase 1, reconcile the deferred posture record: targeted sanitized
  readback of the pinned axes against ADR-0005, recorded as configuration
  evidence; an operator-witnessed fresh, unoverridden session reporting
  its permission mode; the checkout-local allow count as a dated
  observation without rule contents; the runbook's "Remembered command
  rules" row and post-correction paragraph rewritten as dated
  observations with the drift rule that verification fan-out can change
  the count; append-only Amendments entries in ADR-0003 and ADR-0004 that
  point forward to the records that superseded their Decision 2 and
  Decision 4. No ADR body, WO-006 text, verification report or final
  review is edited; the two WO-006 receipts stay historical and the
  runbook records the discontinuity. The auto-mode practice the WO-006
  deferral disclosed now has its superseding record, the 2026-09-25
  ADR-0003 amendment; the runbook says which mode a fresh session starts
  in.
- Phase 2, baseline: before changing anything else, run the scenarios in a
  fresh session per harness, in the harness's recorded mode, and record
  every approval request as structured evidence.
- Phase 3, remediation and final acceptance: inventory triggers from the
  baseline; classify each as contained work that should auto-run, an
  unavoidable boundary crossing to batch and explain, or an operation to
  keep refused; fix the scripts, paths or invocation structure that create
  unnecessary crossings; record observed behaviour and an approval budget
  per scenario in the runbook; add the synthetic fixture; rerun; have an
  independent verifier reproduce; have the operator witness one final
  interactive run.
- Scenarios, per harness, fresh session each: A, read-only inspection
  (navigation, file reads, status and diff, deterministic documentation
  checks; zero approvals expected). B, a bounded in-workspace edit in a
  disposable synthetic fixture (read, edit, format and diff one
  authorized file, run a targeted test; zero edit confirmations and zero
  Bash approvals). C, the unchanged project verification command (zero
  approvals while its effects stay within the boundary the recorded mode
  documents: a host sandbox where one is in force, the host permission
  mode and DotLn's refusals where none is). D, one legitimate boundary
  crossing, such as a lifecycle checkpoint under the retained sandboxed
  Codex mode or a GitHub CLI preflight (one decision-ready request for the
  smallest useful operation; approval succeeds; denial leaves recoverable
  state; no persistent allow rule); a mode that raises no approval request
  is recorded as such. E, a prohibited operation on synthetic fixtures
  only: a throwaway directory the fixture declares denied, an unrelated
  filesystem location, a name in the reserved `.invalid` domain; never a
  real credential file or a real external connection.
- Evidence record, one row per approval request: harness and version;
  mode; scenario and command or action class; classification (file-edit
  confirmation, containment failure, explicit policy decision, protected
  Git-metadata write, network request, connector action, or `unknown`,
  allowed and visible, never inferred away); requested scope and stated
  reason; whether expected; operator disposition; whether denial was
  recoverable; whether requests could have been batched; prompt count and
  operator interventions per scenario. No credentials, private paths,
  secret-bearing commands or hidden reasoning. Matrices are dated files
  under `docs/discovery/`, one per harness and run, with transcripts
  sanitized before commit. The refusal vocabulary is restraint
  attribution's: guard refusal, operator denial, harness-policy denial,
  attested OS-sandbox denial; a generic permission error is never proof
  that a sandbox intervened.
- A prohibited fixture that the recorded mode does not refuse is recorded
  as not refused, with the mode, and returns to the operator as a decision
  packet; the order changes no setting to refuse it.
- **Declined alternatives, recorded:** extending `.prettierignore` for
  the matrices (the formatter ignores their formats since 2026-09-13;
  reopen if the format gate covers `.md` or `.json` again).

**Deliverables:** the phase-1 reconciliation edits (runbook, two ADR
amendments); baseline and final approval-surface matrices per harness under
`docs/discovery/`; the sanitized fresh-session transcripts those matrices
cite; script, path or invocation fixes that remove unnecessary crossings,
each with its own test; the runbook's observed-behavior section and
approval budget per scenario; a repeatable synthetic approval-surface
fixture that observes, from inside a harness session, the boundary its
recorded mode enforces, using synthetic paths and reporting refusal
classes without touching real credentials or external hosts; the
verifier's fresh-session reproduction; the operator-witnessed final run
record.

**Acceptance criteria (all required)**

1. Phase 1 is complete: readback matches ADR-0005 on every pinned axis or
   the divergence is recorded as a dated observation; a fresh,
   unoverridden session was witnessed by the operator and its displayed
   mode is recorded; the runbook's "Remembered command rules" row is a
   dated observation with the drift rule; ADR-0003 and ADR-0004 carry
   append-only Amendments entries pointing forward; no decision body,
   WO-006 text or numbered record was edited. If the witnessed session has
   not happened by handoff, the executor records this criterion unmet with
   the command the operator runs (a fresh launch of each harness with no
   mode override); the other criteria are judged; the criterion closes by
   the operator's run or by a recorded waiver.
2. Settings readback is treated as configuration evidence, not proof of
   reduced approval burden, in every document this order writes.
3. A fresh-session baseline and a final run exist for each harness the
   runbook records with a qualified role at the order's base (three at
   `5f3849ec`), with harness versions, the recorded mode and sanitized
   effective settings.
4. Every observed approval is classified; `unknown` remains allowed and
   visible.
5. Scenario A completes with zero approvals on each harness.
6. Scenario B completes with zero approvals on each harness.
7. Scenario C completes without approval in each harness's recorded mode
   while its effects stay within the boundary that mode documents; any
   remaining prompt is recorded as an accepted exception with its boundary
   named, or as a defect with a fix.
8. In each mode that raises approval requests, each scenario-D crossing
   produces no more than one narrowly scoped, decision-ready request; a
   mode that raises none is recorded with its mode and not scored.
9. Repeated commands arising from one known boundary are batched where the
   harness safely permits it, and the batching is shown in the matrices.
10. In each mode that raises approval requests, denying a scenario-D
    request leaves the workstream recoverable, with no repeated request
    for the same operation, no silent fallback to a broader mode and no
    authority wider than before the denial; reproduced and recorded. The
    criterion is judged against the declared set; a case outside it is a
    follow-up, not a failure.
11. Each scenario-E fixture (the declared denied directory, the unrelated
    filesystem location, the `.invalid` name) is refused by the boundary
    the recorded mode documents, or is recorded as not refused, with the
    mode, and returned to the operator as a decision packet; none is
    transformed into an approval request. The criterion is judged against
    the declared set; a case outside it is a follow-up, not a failure.
12. This order disables no sandbox, enables no unsandboxed fallback and
    adds no broad or persistent allow rule in any harness; personal
    settings are unchanged by this order unless the operator separately
    decides otherwise and records it.
13. The final evidence reports approval counts by scenario and compares
    them with the baseline.
14. An independent verifier reproduces the representative workflow in
    genuinely fresh sessions and records its own counts.
15. The operator witnesses at least one final interactive run and records
    whether the remaining interruptions are predictable and materially
    bounded. If that run has not happened by handoff, the executor records
    this criterion unmet with the command the operator runs; the other
    criteria are judged; the criterion closes by the operator's run or by
    a recorded waiver.
16. The full, unchanged `npm test` passes in each harness's recorded mode;
    where a host sandbox is in force the runner refuses the full selection,
    because the skeleton and portfolio suites need the outside, so the
    full gate runs outside it. The synthetic fixture passes in each
    harness session where automation can observe it.
17. Write-backs land: `docs/AI-HARNESS-SECURITY.md` §Recorded host posture
    (2026-09-01, with dated amendments), its row and paragraph as dated
    observations, and the observed-behavior section with the approval
    budget per scenario; the ADR-0003 and ADR-0004 Amendments entries; the
    planning map's row for this order at close; one line in
    `docs/README.md` §Config log only if a `.claude/` or `CLAUDE.md` change
    occurs, which this order does not expect; the decisions file, which
    records any genuinely new mechanism remediation surfaces, and in that
    case the relevant product document gains it in place, bounded by that
    document's headroom at the base.
18. `npm test -- --review` and `npm run test:docs` green; `git diff
    --check` clean; no new dependency.

**Evidence gate:** baseline and final approval-surface matrices; sanitized
fresh-session transcripts; exact harness versions, modes and sanitized
effective settings; the denial-and-recovery reproduction; the full
unchanged `npm test` result; the independent verifier's result; the
operator-witnessed count and disposition, or the unmet criteria and their
commands; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because the fixture and the fixes land under
`scripts/`, every file of which is a declared source of the
configuration-root suite, and again at final review. The live rows are the
fresh sessions per harness, the verifier's reproduction and the
operator-witnessed run.

**Write-back duty:** as listed in criterion 17.

**Non-goals:** eliminating approval for genuine network, credential,
account, deployment, publication, or unrelated-filesystem effects;
disabling or weakening any sandbox; adding broad command allowlists;
treating operator frustration or flow as inferred telemetry or claiming
anything about the operator's psychological state; modifying WO-006, its
verification reports, or its final review; claiming cross-harness parity
where the products expose different boundaries; changing the interruption
policy in 04-interfaces.md or the never-ask list; changing a harness's
recorded mode; scoring scenario D in a mode that raises no approval
request.

**Operator-review assumptions**

1. The order stays outside the sequence, as the planning map keeps it,
   until a correction or a decision records approval prompts interrupting
   an ordinary session under the recorded posture; the pass that finds
   one sequences it.
