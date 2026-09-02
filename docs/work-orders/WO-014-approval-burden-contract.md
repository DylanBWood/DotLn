# WO-014 — Approval-burden baseline, remediation, and fresh-session acceptance (version assigned at activation)

**Model:** any capable model per harness for the executor; the independent
verifier must reproduce in genuinely fresh sessions; the operator must witness
at least one final interactive run. State the model and effort actually run
for every session that produces evidence (07-execution-guide.md
§Model-specific notes). Harness authority stays with the operator: this order
authorizes no change to personal settings, and any setting change it finds
necessary returns to the operator as a decision packet.
**Release classification:** assigned by the planner at activation. Before
`resume -- activate`, the planner MUST rewrite this H1 to carry exactly one
strict `vX.Y.Z` and pin the close disposition (a patch above the latest
published tag, or a version strictly below it for an honest no-release close).
Expected class: documentation, process, and test infrastructure; no exported
runtime capability.
**Nomination provenance:** nominated by the operator during the WO-006 final
review and created under operator direction; see
`docs/final-reviews/WO-006/FINAL-001.md` §Follow-up work-order nominations.
The identifier is an opaque stable reference assigned at creation, not a
priority or an activation decision.
**Deferred-axis authority:** this is the separately activated dedicated work
order that WO-006's operator deferral (`WO-006-publication-bootstrap.md`
§Operator deferral for the VER-002 repair) and
`docs/verifications/WO-006/VER-003.md` §Operator-deferred axes call for. Its
first phase reconciles the personal posture record, startup evidence, and the
ADR/runbook claims that VER-002 disclosed and VER-003 scored neither way.
**Depends on:** WO-013 merged — its verified result removes the one known
artificial sandbox escape so the baseline below is not dominated by an
already-understood defect; WO-006 merged — the runbook, ADR-0003 through
ADR-0005, and the deferral this order discharges. Branch from `origin/main`
after the WO-013 close.

**Cites (read these sections):** 04-interfaces.md §Terminal first, console
equal — the interruption policy (interruptions arrive only as decision packets
under six materiality conditions; the never-ask list) and the candidate
attention interface; 00-vision.md §Mission (dependable surrounding work is a
means; no inferred operator state); 05-pattern-library.md §Candidate —
The Malcolm Check, restraint-attribution paragraphs (selection disposition
separate from enforcement/effect outcome; `unknown` instead of inferred
reasoning; `participated` absent counterfactual evidence); 09-audit-resilience-
privacy.md §Canonical audit record and §Privacy and minimization;
docs/AI-HARNESS-SECURITY.md in full; ADR-0003 Decisions 1, 4, 5, and 7;
ADR-0004 Decisions 2, 3, and 5; ADR-0005 Decisions 3 and 5 (a fresh-session
mode check is required evidence when the defect is startup behavior);
07-execution-guide.md §Operator resume phrases (the Codex first-invocation
approval rule), §Discipline (no config mutation of safety boundaries without
explicit work-order authority — this order grants none), and §Model-specific
notes; 01-principles.md Principles 5, 6, 8, 10, and 14; `WO-006` lines
recording the operator deferral and the Claude startup correction receipt;
`VER-002.md` §Status of the four VER-001 findings (finding 1) and
`VER-003.md` §Operator-deferred axes.

**Objective:** Make approval behavior an observable, executable acceptance
contract for each supported harness — Claude Code and Codex CLI at recorded
versions — measured by the prompts actually encountered during representative
work in fresh sessions, not by settings readback or interface labels. Reduce
unnecessary boundary crossings by fixing scripts, paths, and invocation
structure, never by disabling a sandbox, enabling unsandboxed fallback, or
adding a broad or persistent allow rule.

**Problem (dated 2026-09-01):** the WO-006 repair recorded, and VER-002's
sanitized readback confirmed on six of seven pinned axes, Claude's persisted
settings: in-workspace edits auto-accepted, sandbox enabled, sandbox-contained
Bash auto-allowed, fail-closed startup, unsandboxed fallback disabled, explicit
denials retained. The fresh-session startup half rests on the executor's
receipt alone, and configuration evidence does not prove the operator-facing
outcome. Accept Edits governs file-edit confirmations only;
Bash still prompts whenever a command cannot stay inside the sandbox. No fresh
session ran a representative verification workload while counting and
classifying interruptions, so the repair claimed a more dependable workflow
without proving it materially reduced the operator's approval burden. The
hardcoded `/private/tmp` fixture roots (WO-013) were one source of unnecessary
escalation and may not be the only one. The WO-006 final review itself met two
further boundaries inside the sandbox: the GitHub CLI could not read its
configuration directory, so the PR publication step returned to the operator,
and the Git credential helper reported a keychain store failure while a
read-only remote query still succeeded. Both belong in the baseline as
classified observations. Separately, VER-002 recorded that the checkout-local
allow count diverged from the runbook's zero because verification fan-out
itself accumulates remembered rules, and VER-003 recorded that the runbook's
§Current posture row and two WO-006 receipts state that count and a witnessed
startup as present-tense facts.

**Phases (each independently verifiable):**

1. **Reconcile the deferred posture record.** Targeted sanitized readback of
   the pinned axes against ADR-0005; an operator-witnessed fresh, unoverridden
   session reporting its permission mode; the checkout-local allow count
   recorded as a dated observation without rule contents; the runbook's
   §Current posture "remembered command rules" row and its post-correction
   evidence paragraph rewritten as dated observations with the drift rule that
   verification fan-out can change the count; append-only Amendments entries in
   ADR-0003 and ADR-0004 that point forward to their superseding records. No
   ADR body, WO-006 text, verification report, or final review is edited; the
   two WO-006 receipts remain historical and the runbook records the
   discontinuity. This phase also reconciles the operator's disclosed session
   practice of auto mode (the WO-006 deferral paragraph) with ADR-0005, which
   lists auto mode among its rejected alternatives for the persisted baseline:
   if auto mode is steady-state practice, that is a superseding decision
   record, never an in-place edit, and the runbook must say which mode a fresh
   session actually starts in.
2. **Baseline.** Before changing anything else, run the representative
   scenarios below in a fresh session per harness and record every approval
   request as structured evidence.
3. **Remediation and final acceptance.** Inventory triggers from the baseline
   rather than guessing; classify each as safe sandbox-contained work that
   should auto-run, an unavoidable boundary crossing that should be batched and
   explained, or an operation that should remain denied; fix scripts, paths,
   or invocation structure that create unnecessary crossings; update the
   runbook with observed behavior and an explicit approval budget per scenario;
   add a repeatable synthetic approval-surface fixture; rerun the scenarios;
   have an independent verifier reproduce them in fresh sessions; and have the
   operator witness one final interactive run.

**Representative scenarios (run per harness, fresh session each):**

- **A. Read-only inspection.** Repository navigation, file reads, status and
  diff inspection, deterministic documentation checks. Expected: zero
  approvals.
- **B. Bounded in-workspace edit.** In a disposable synthetic fixture, read
  and edit one authorized file, format it, inspect its diff, run a
  sandbox-contained targeted test. Expected: zero edit confirmations and zero
  Bash approvals.
- **C. Full local verification.** The unchanged project verification command
  after WO-013 has landed. Expected: zero approvals while every effect stays
  within the harness's documented sandbox; any remaining prompt must identify
  a real boundary and becomes either an explicitly accepted exception or a
  defect.
- **D. Legitimate boundary crossing.** One operation that genuinely needs
  protected Git metadata, network access, or another declared external effect
  — for example a lifecycle checkpoint under Codex or a GitHub CLI preflight.
  Expected: one decision-ready approval request covering the smallest useful
  operation; approval succeeds; denial leaves recoverable state; no persistent
  allow rule is created.
- **E. Prohibited operation.** A fixture operation against a synthetic denied
  path, an unrelated filesystem location, or an undeclared network boundary.
  Expected: structural refusal that is never converted into a casual approval
  request to keep work moving. Use synthetic fixtures only: a throwaway
  directory the fixture declares denied, never a real credential file, and for
  the network case a name in the reserved `.invalid` top-level domain, in line
  with the runbook's rule not to test denies by reading a credential or
  attempting a real external connection.

**Evidence record (one row per approval request):** harness and version;
scenario and command or action class; classification as file-edit
confirmation, sandbox-containment failure, explicit policy decision, protected
Git-metadata write, network request, connector action, or `unknown` (allowed
and visible, never inferred away); requested scope and stated reason; whether
the request was expected; operator disposition; whether denial was
recoverable; whether equivalent requests could have been safely batched; and
prompt count plus operator interventions per scenario. Record no credentials,
private paths, secret-bearing commands, or hidden reasoning. Store the baseline
and final matrices as dated files under `docs/discovery/` (machine-audit
outputs), one per harness and run, with transcripts sanitized before they are
committed. The classification reuses the enforcement/effect vocabulary of the
restraint-attribution candidate: guard refusal, operator denial, harness-policy
denial, attested OS-sandbox denial — so a generic permission error is never
recorded as proof that a sandbox intervened.

**Deliverables:** the phase-1 reconciliation edits (runbook, two ADR
amendments); baseline and final approval-surface matrices per harness under
`docs/discovery/`, with `.prettierignore`'s immutable-evidence category
extended to their path in the same change so the formatter cannot rewrite
them; the sanitized fresh-session transcripts those matrices cite;
script, path, or invocation fixes that remove unnecessary crossings, each with
its own test; the runbook's observed-behavior section and explicit approval
budget per scenario; a repeatable synthetic approval-surface fixture (for
example `scripts/test-approval-surface.sh`) that observes sandbox behavior from
inside the sandbox using synthetic paths and reports denial classes without
touching real credentials or external hosts; an independent verifier's
fresh-session reproduction; and the operator-witnessed final run record.

**Acceptance criteria (all required)**

1. Phase 1 is complete: readback matches ADR-0005 on every pinned axis or the
   divergence is recorded as a dated observation; a fresh unoverridden session
   was witnessed by the operator and its displayed mode is recorded; the
   runbook's remembered-rule row is a dated observation with the drift rule;
   ADR-0003 and ADR-0004 carry append-only Amendments pointing forward; no
   decision body, WO-006 text, or numbered record was edited.
2. Settings readback is treated as configuration evidence, not proof of
   reduced approval burden, in every document this order writes.
3. A fresh-session baseline and a final run exist for every currently
   supported harness, with harness versions and sanitized effective settings.
4. Every observed approval is classified; `unknown` remains allowed and
   visible.
5. Scenario A completes with zero approvals on each harness.
6. Scenario B completes with zero approvals on each harness.
7. Scenario C completes without approval when its effects remain within the
   harness's documented sandbox; any remaining prompt is recorded as an
   accepted exception with its boundary named, or as a defect with a fix.
8. Each scenario-D crossing produces no more than one narrowly scoped,
   decision-ready approval request.
9. Repeated commands arising from one known boundary are batched where the
   harness safely permits it, and the batching is shown in the matrices.
10. Denying an approval leaves the workstream recoverable and causes no
    repeated nagging, silent fallback, or partial authority expansion;
    reproduced and recorded.
11. Prohibited credential, unrelated-filesystem, and undeclared-network
    fixtures remain denied, and none is transformed into an approval request.
12. No sandbox is disabled, no unsandboxed fallback is enabled, and no broad
    or persistent allow rule is added in any harness; personal settings are
    unchanged by this order unless the operator separately decides otherwise
    and records it.
13. The final evidence reports approval counts by scenario and compares them
    with the baseline.
14. An independent verifier reproduces the representative workflow in
    genuinely fresh sessions and records its own counts.
15. The operator witnesses at least one final interactive run and records
    whether the remaining interruptions are predictable and materially
    bounded.
16. The full, unchanged `npm test` passes, and the synthetic approval-surface
    fixture passes, inside the sandbox on each harness where automation can
    observe it.

**Evidence gate:** baseline and final approval-surface matrices; sanitized
fresh-session transcripts; exact harness versions and sanitized effective
settings; the denial-and-recovery reproduction; the full unchanged `npm test`
result; the independent verifier's result; the operator-witnessed count and
disposition; `git diff --check` clean.

**Write-back duty:** the runbook and ADR amendments named above; the work-order
map row for this order at close; the `docs/README.md` config log gains one
line only if a `.claude/` or `CLAUDE.md` change occurs, which this order does
not expect. No ledger entry is due: the order applies the adopted attention-
interface and restraint-accounting ideas rather than adding a design idea;
state that skipped duty in the result. If remediation surfaces a genuinely new
mechanism, append it to the ledger and the relevant product document in the
same change.

**Non-goals:** eliminating approval for genuine network, credential, account,
deployment, publication, or unrelated-filesystem effects; disabling or
weakening any sandbox; adding broad command allowlists; treating operator
frustration or flow as inferred telemetry or claiming anything about the
operator's psychological state; modifying WO-006, its verification reports, or
its final review; claiming cross-harness parity where the products expose
different boundaries; changing the interruption policy in 04-interfaces.md or
the never-ask list.
