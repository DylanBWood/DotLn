# WO-019 — Effort truth: declared in the work order, attested in the control log (version assigned at activation)

**Model:** any capable model.
**Effort:** executor xhigh+; verifier xhigh+; reviewer any. Until this order
lands, these values are self-reported in the result. The final reviewer must
confirm the order's own attestations were recorded through the mechanism it
ships, and disclose that as a self-referential instrument per
07-execution-guide.md §Discipline.
**Release classification:** assigned by the planner at activation. Expected
class: patch. Process and tooling; no exported runtime capability.
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

**Cites (read these sections):** 01-principles.md Principle 8 (no silent model
degradation) and Principle 15 (environment truth; epistemic labels);
07-execution-guide.md §Model-specific notes (the documented gap) and
§Discipline (forward-only enforcement; disclose a self-referential
instrument); `docs/PLAYBOOK.md` §Who does what (the recorded drift: Codex ran
at low through WO-001 to WO-003 while the table read xhigh);
`docs/lineage/idea-ledger.md` "Effort truth" entry (§WO-003
verification-window corrections); `docs/discovery/environment.md` rows
"Effort selection" and the WO-004 addendum's explicit-effort observation;
`docs/discovery/environment.json` `effortSelection` and the Codex
`modelSelection` row (`selectedModelEchoed: false`); 02-domain-model.md
§Actors and episodes; `docs/work-orders/WO-009-real-disposable-worker.md`
acceptance criterion 6 (record `unknown`, never invent a flag);
03-architecture.md §Session lifecycle & resilience (resume control v1).

**Objective:** Make the effort a session actually ran at a declared, attested,
checked, and projected fact of the control plane rather than a prose table
that was silently false for three work orders. Declaration lives in the
work-order header; attestation lives in the append-only control log with an
epistemic source label; the transition refuses a below-declared effort; the
projection shows the latest attestation and any drift within a work order.

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

- Vocabulary is pinned from discovery, not invented. The Claude ladder is
  `low < medium < high < xhigh < max`. A harness with no observed selector
  attests `unknown`. Any other label the session uses is kept verbatim in a
  `raw` field and compares as `unknown`: an unrecognized `--effort <label>`
  input is recorded as `effort: "unknown", raw: "<label>"`; no separate flag
  or silent coercion is used.
- Two declaration forms per role: `<level>+` (ladder minimum; `unknown` is
  refused) and `any` (everything accepted, including `unknown`; the form a
  planner chooses when Codex is a permitted actor). Roles are `executor`,
  `verifier`, `reviewer`; all three must be present.
- Attestation is an `actor` object on the four completion events:
  `ImplementationReady`, `VerificationCompleted`, `RepairCompleted`,
  `FinalReviewCompleted`. Fields: `harness` (`claude-code | codex-cli | human |
  other:<label>`), `harnessVersion`, `model`, `effort`, `raw` (optional),
  `source` (`self-reported | harness-readback | operator-attested`). Adding
  fields to events keeps control-log schema version 1; readers ignore unknown
  fields and `fold` is unchanged for existing events.
- `harness-readback` is permitted only for a harness whose readback path this
  order observed. The probe distinguishes persisted effort (a settings key)
  from the session's effective effort (a flag or in-session change) and labels
  each `observed`, `documented locally`, `not found`, or `blocked`. It reads
  no personal settings file into the repository and prints only the level.
- A below-declared attestation refuses and appends nothing. There is no
  override flag; the recovery path is a dated operator amendment to the work
  order's Effort line, then the transition is re-run.
- Forward-only. Existing drafts gain their Effort line when the planner
  activates them, in the same edit as the version. History is not backfilled;
  a dated migration note records the discontinuity where readers meet it.
- The kernel is untouched. The `actor` shape is written to the domain model as
  the control-log record and as a candidate for WO-009's episode events.

**Deliverables:** `scripts/resume.mjs` changes (Effort-line parse at
`activate`, `--harness/--harness-version/--model/--effort/--source` on the
four completion actions, the ladder check, the `next` briefing, two projection
lines);
`scripts/test-resume.sh` cases; the harness readback probe recorded in
`docs/discovery/environment.md` and `environment.json`; runbook and guide
updates; Effort lines added to WO-016, WO-017, and WO-018 drafts if they are
not yet activated (planner duty, recorded in the result).

**Acceptance criteria (all required)**

1. `activate` refuses a work order lacking a `**Model:**` line or a
   well-formed `**Effort:**` line naming all three roles, appends nothing, and
   names the missing or malformed line. Existing activated orders are
   unaffected.
2. Each of the four completion actions refuses without a complete `actor`
   (all five required fields), appends nothing, and prints usage. With a
   complete actor the event carries recognized values byte-for-byte and
   carries an unrecognized effort as the pinned `unknown` plus verbatim `raw`
   pair.
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
6. The readback probe result is recorded per harness with epistemic labels;
   `harness-readback` is accepted by `resume` only for a harness recorded as
   `observed`, and refused with an explanation otherwise. For Codex the
   recorded result is `unknown` unless a selector was observed; no flag is
   invented.
7. `scripts/test-resume.sh` covers criteria 1 through 6 in its existing
   non-git fixture, including one full lifecycle whose events all carry
   actors, one refusal per rule with "no event appended" asserted, and one
   drift case.
8. The order's own transitions were recorded through the shipped mechanism,
   and the final review states the executor's, verifier's, and reviewer's
   attested values beside the report-header prose, confirming they agree.
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
