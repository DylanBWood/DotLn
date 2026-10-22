# WO-014 — Approval-burden baseline, remediation, and fresh-session acceptance (version assigned at activation)

**Model:** any capable model per harness for the executor; the operator must
witness at least one final interactive run (criterion 15 states its fallback;
the verifier's fresh-session reproduction left the scope with phases 2 and 3,
step 1). State the model and effort actually run for every session that
produces evidence (07-execution-guide.md §Model-specific notes). Harness
authority stays with the operator: this order authorizes no change to
personal settings, and any setting change it finds necessary returns to
the operator as a decision packet.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** evidence
**Release classification:** patch. Documentation, process and test
infrastructure; no exported runtime capability. Assigned at activation
under the standing opt-out default.
**Cost:** phase 1 only: adds the runbook's recorded-posture row and
post-correction paragraph as dated observations with a drift rule,
forward-pointing Amendments entries in ADR-0003 and ADR-0004, the readback
observations and the decisions file with the operator-witnessed run record
(typed, `unknown` where no run exists) and one gate row per harness. The
baseline and final approval-surface matrices, transcripts, synthetic fixture,
invocation fixes, observed-behaviour section and verifier reproduction are
phases 2 and 3, the planning map's boarded candidate (step 1). Removes
nothing; the boundary crossings a baseline would find stay unmeasured until a
host channel reports approval requests.
Re-mints: none planned; a fix to a registered evidence source (among them
`scripts/build.mjs`, `scripts/lib/helpers.mjs`, `git.mjs` and `paths.mjs`)
would owe a deterministic re-mint of each edition it stales, and a fix to
a file the feedback verifier judges one live feedback self-host episode,
which the executor runs on a configuration the operator's 2026-09-28
direction accepts; the baseline decides whether either happens. The witnessed run is a live session of unmeasured cost; the fresh sessions per
harness and the verifier's reproduction belong to the boarded phases. Commands: none added; phase 1
runs the existing `npm run discover -- harness <name>` readback (step 4).
Steps: phase 1 is documents and readback (steps 1 to 5); the fresh sessions
and the verifier's reproduction belong to the scope step 1 boards, and the
witnessed run is a typed record, `unknown` where no run exists (criterion 15);
criteria 3 to 11, 13 and 14 are marked out of scope in place. Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** nominated by the operator during the WO-006 final
review and created under operator direction; see
`docs/final-reviews/WO-006/FINAL-001.md` §Follow-up work-order nominations.
The identifier is an opaque stable reference assigned at creation, not a
priority or an activation decision. It is the separately activated
dedicated work order that WO-006's operator deferral (its paragraph on the operator deferral for the VER-002 repair, in
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
§10). Amended by the 2026-10-13 standard pass under the operator's sizing
direction ([planning document](../planning/standard-pass-2026-10-13.md)
§12): the queue is serial, so the placement names its position, and a
Preflight line is added; and, under the operator's direction of the same
day that roles make every repository change (planning document §12.1),
the settings readback, the witnessed session's mode, the final run's
judgment and any waiver are recorded by a role on the operator's word,
while the witnessing stays the operator's.
**Depends on:** WO-013 merged (its verified result removed the one known
artificial sandbox escape, so the baseline is not dominated by an
already-understood defect; closed, `v0.3.1`); WO-006 merged (the runbook,
ADR-0003 through ADR-0005 and the deferral this order discharges; closed,
`v0.2.3`).
**Recommended placement:** after WO-096 and last in the serial queue (position
18 after the 2026-10-21 pass placed four fork-unblocking orders first; the
operator keeps core's next thirty orders serial, planning document §12.4), because no pass has yet found approval friction recorded
as a constraint under the posture recorded on 2026-09-17 and reaffirmed on
2026-09-25, no host sandbox in Claude Code, Codex or Copilot, the one
finding that moves it up (operator-review assumption 1). It has been last
since the 2026-10-02 planning pass placed it there, so that every open
order has a position and none floats beside the list; the pass that
reaches it re-observes that gap and withdraws the order if it is absent. It edits `docs/AI-HARNESS-SECURITY.md`, the Amendments of ADR-0003 and
ADR-0004 and its evidence directory. A recommendation, not a dependency token.

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
work-order authority — this order grants none), §Model-specific notes and
§Preflight before the full gate (the **Preflight:** line below);
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

**Objective:** Phase 1: reconcile the runbook's recorded posture, the startup
evidence and the ADR claims for each harness the runbook records with a
qualified role (Claude Code, Codex CLI and Copilot CLI) at recorded versions,
as dated observations with a drift rule, with settings readback treated as
configuration evidence and never as proof of reduced approval burden. Phases 2
and 3, the planning map's boarded candidate, would make approval behavior an
observable, executable acceptance contract measured by the prompts actually
encountered in fresh sessions and reduce unnecessary boundary crossings by
fixing scripts, paths and invocation structure, never by disabling a sandbox,
enabling unsandboxed fallback or adding a broad or persistent allow rule; they
reopen when a host channel reports approval requests.

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

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. Scope decided by the 2026-10-07 pass: this order is phase 1, documents only. Criteria 3
   to 11, 13 and 14 count approval requests that nothing in the tree observes (the WO-136
   matrix, `docs/discovery/authority-boundary-2026-09-17.md` line 109, says prompt counts
   remain unknown without a host channel; the hooks registered are PreToolUse, PostToolUse, PermissionDenied,
   PostToolUseFailure, UserPromptSubmit, SessionStart and Stop
   (`.claude/settings.json`); none reports an approval request), so they are
   out of this order's scope and recorded as a candidate in the planning map (reopen when a host channel
   reports approval requests). Criteria 1, 2, 12, 17 and 18 remain; 15 and 16 are judged
   on typed records (`predictable` and `bounded` booleans with a note; the gate rows per
   harness) and recorded `unknown` where no run exists.
2. `docs/AI-HARNESS-SECURITY.md` §"## Recorded host posture" (the anchor
   `recorded-host-posture-2026-09-01-with-dated-amendments`, line 510): the row at line 525
   ("no checkout-local allow entries") and the paragraph at lines 537 to 542 ("the count is now
   zero") become dated observations with the drift rule and the count at the base (15
   entries in this checkout's git-ignored `.claude/settings.local.json` on 2026-10-07; the
   count only, never the entries). Check: `npm run test:docs`.
3. `docs/decisions/0003-personal-ai-harness-security.md` §"## Amendments" (line 94) and
   `docs/decisions/0004-claude-sandboxed-bash-auto-allow.md` §"## Amendments" (line 78):
   append the two forward-pointing entries (ADR-0003 Decision 2 to ADR-0004 Decision 1;
   ADR-0004 Decision 4 to ADR-0005 Decision 1). Check: `git diff` shows appends only.
4. Readback: `npm run discover -- harness claude-code`, then `codex-cli` and `copilot-cli`,
   for versions. The pinned axes live in personal settings: the executor reads them, the
   pinned axes alone and sanitized, only on the operator's word granting that
   read, records the word, and writes the result as a dated observation in
   `docs/evidence/WO-014/decisions.md` (step 5); without the word it records
   `unknown` with that reason. Check: the decisions file holds one row per
   pinned axis, or `unknown` with the reason.
5. `docs/evidence/WO-014/decisions.md` (new): the scope decision, the
   observations, the witnessed-run record `{ predictable, bounded, note }`
   (criterion 15; both booleans `unknown` until a role records the run), one
   typed gate row per harness (criterion 16), the later partial observations
   the gap did not name (`docs/discovery/copilot-cli-2026-09-20.json` line
   9451; `docs/discovery/writing-worker-smoke-2026-09-14.md` rows C-U2 and
   X-U2; Claude's typed `HostPermissionDenied` events since `09fe5d88`;
   `docs/evidence/WO-221/host-qualification.md`: the Claude Code row's "No
   prompt observed", its known issue recording an auto-mode classifier denial
   of an executor's edits, and the Codex row's recorded launch mode `Auto
   (workspace-write, on-request approvals, network off)`, which differs from
   the runbook's 2026-09-17 Codex mode); `npm run meta`;
   `docs/planning/work-order-map.md` row at close.
6. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-014/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the phase-1 reconciliation edits (the runbook row and
paragraph, two ADR amendments), the readback observations and the decisions
file with the witnessed-run record and the per-harness gate rows; the rest
(matrices, transcripts, fixes, the observed-behaviour section, the synthetic
fixture, the verifier's reproduction) is out of scope (step 1).

**Acceptance criteria (all required)**

1. Phase 1 is complete: readback matches ADR-0005 on every pinned axis, the
   divergence is recorded as a dated observation, or, without the operator's
   word granting the read, `unknown` is recorded with that reason (step 4); a fresh,
   unoverridden session was witnessed by the operator and a role records
   its displayed mode on the operator's word; the runbook's "Remembered
   command rules" row is a dated observation with the drift rule; ADR-0003 and ADR-0004 carry
   append-only Amendments entries pointing forward; no decision body,
   WO-006 text or numbered record was edited. If the witnessed session has
   not happened by handoff, the executor records this criterion unmet with
   the launch the operator would witness (a fresh launch of each harness
   with no mode override, which changes no repository); the other criteria
   are judged; the criterion closes when a role records that witnessed
   launch on the operator's word, or by a waiver a role records on the
   operator's word.
2. Settings readback is treated as configuration evidence, not proof of
   reduced approval burden, in every document this order writes.
3. Out of scope (step 1, 2026-10-07 pass): approval requests have no observing channel in the tree; recorded as the planning map's candidate 7 (WO-014 phases 2 and 3); not judged.
4. Out of scope (step 1): as criterion 3; not judged.
5. Out of scope (step 1): as criterion 3; not judged.
6. Out of scope (step 1): as criterion 3; not judged.
7. Out of scope (step 1): as criterion 3; not judged.
8. Out of scope (step 1): as criterion 3; not judged.
9. Out of scope (step 1): as criterion 3; not judged.
10. Out of scope (step 1): as criterion 3; not judged.
11. Out of scope (step 1): as criterion 3; not judged.
12. This order disables no sandbox, enables no unsandboxed fallback and
    adds no broad or persistent allow rule in any harness; personal
    settings are unchanged by this order unless the operator separately
    decides otherwise, a decision a role records on the operator's word.
13. Out of scope (step 1): as criterion 3; not judged.
14. Out of scope (step 1): as criterion 3; not judged.
15. A role records, on the operator's word, `{ predictable, bounded, note }` for the witnessed final run in `docs/evidence/WO-014/decisions.md`. If that run has not happened by handoff, both booleans are `unknown` and the executor records this criterion unmet with the run the operator would witness; the other criteria are judged; the criterion closes when a role records the witnessed run on the operator's word, or by a waiver a role records on the operator's word.
16. The decisions file records one typed gate row per harness the runbook records with a qualified role: harness, version, recorded mode, the gate command run and its result, or `unknown` where no run exists in that harness. The executor's own handoff run stands as its harness's row. The synthetic fixture is out of scope (step 1).
17. Write-backs land: `docs/AI-HARNESS-SECURITY.md` §Recorded host posture
    (2026-09-01, with dated amendments), its row and paragraph as dated
    observations, and no observed-behaviour section (out of scope, step 1;
    reopen when a host channel reports approval requests); the ADR-0003 and ADR-0004 Amendments entries; the
    planning map's row for this order at close; one line in
    `docs/README.md` §Config log only if a `.claude/` or `CLAUDE.md` change
    occurs, which this order does not expect; the decisions file, which
    records any genuinely new mechanism remediation surfaces, and in that
    case the relevant product document gains it in place, bounded by that
    document's headroom at the base.
18. `npm test -- --review` and `npm run test:docs` green; `git diff
    --check` clean; no new dependency.

**Preflight:** `npm test -- --only meta` for step 5, and
`npm run test:docs` when a document changes (steps 2, 3 and 5), each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate). Phase 1 changes
documents only; a script, path or invocation fix the remaining scope would
add names its own suite when that scope is reopened.

**Evidence gate:** the phase-1 reconciliation edits and readback observations;
the witnessed-run record or its `unknown`; the per-harness gate rows; `npm run
test:docs`; `npm test -- --review` before `implementation-ready` and again at
final review. The one live row is the operator-witnessed run.

**Write-back duty:** as listed in criterion 17.

**Known issues and carry-ins:**
- 2026-10-07 pass: no later order met any criterion; the counting the
  order needs has no channel in the tree, so the order is narrowed to
  phase 1 (step 1) and the rest is a candidate. Stale and corrected: the
  order sits last in the sequence; five suite rows declare
  `needs: outside-sandbox`; three later partial observations exist.
- Decided by the 2026-10-07 pass: the allow-entry count may be committed
  as a dated observation (count only); criteria 15 and 16 are typed
  records (prose-parsing screen). Reopen: a host channel reports approval
  requests, which unboards phases 2 and 3.
- WO-219 (step 5, row FUP-33173b7f87004a9c) may write and WO-192 writes
  `docs/AI-HARNESS-SECURITY.md` before this order (WO-188 did, closed
  `v0.71.0`); the executor re-measures the lines at the base. - Receipt 045
  (2026-10-13), criterion 3: whether approval friction is still a constraint
  under the current posture is undecided, yet the criteria committed to
  baseline and final runs on three harnesses, a verifier reproduction and a
  witnessed run, and the Cost line named no removal; the observed gap is dated
  2026-09-28 at `5f3849ec` and was not restated at `6dbd8771`. The 2026-10-21
  pass marked criteria 3 to 11, 13 and 14 out of scope in place and narrowed
  the Objective, Cost, Deliverables and Evidence gate to phase 1. Reopen when
  phase 1's fresh sessions on the current posture record zero approvals in
  scenarios A to C on every harness, or the operator records approval friction
  as a current constraint.

- Receipt 038: the order commits to baselines, final runs on three
  harnesses, a verifier reproduction and two witnessed runs before any
  baseline shows a burden to remove, under a posture it was not written
  for. The pass that reaches it re-observes the gap first. Reopen its
  remaining scope if the baseline matrices record no approval in
  scenarios A to C on all three harnesses with scenario D unscored.

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

1. The order sits last in the sequence (the 2026-10-07 pass corrected the
   earlier statement that it stayed outside it),
   until a correction or a decision records approval prompts interrupting
   an ordinary session under the recorded posture; the pass that finds
   one sequences it.
