# WO-031 — Actor usage projection: read-only elapsed time per harness, model, effort, and phase across every work order, with an opt-in opaque account label whose meaning lives only in an ignored local file (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: patch. It adds one read-only projection and one optional attestation
field; no exported runtime capability.
**Nomination provenance:** the 2026-09-05 planning pass, from the operator's
`ideation:` question whether the recorded timestamps show which models are in
use and for how long, and how to distinguish two provider accounts without
publishing their identities. Planner-synthesized draft; the unedited message is
preserved locally in
`docs/intake/notes/2026-09-05-planning-session-uifa-roles-ideation.md`. Opaque
identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition; the example addresses in
the raw message are placeholders and appear nowhere in this order.
**Depends on:** WO-019 merged (actor attestation; satisfied at `v0.3.4`);
WO-028 merged (`recordedAt`; satisfied at `v0.5.1`); WO-030 merged (the
projection reads every order's segment through the multi-order fold rather
than adding a second reader of the log).
**Recommended placement:** a free lane after WO-030; it conflicts with nothing
else in the horizon. A recommendation, not a dependency token.

**Cites (read these sections):** 02-domain-model.md §Actors and episodes (the
actor attestation shape and its `source` labels); 03-architecture.md §Session
lifecycle & resilience (`recordedAt`, `elapsed`, `times`, and the
public-profile timing choice); 06-roadmap.md §Efficiency as a separate
capability axis (`EfficiencyObservation.resources.elapsedMs`) and
§Counterfactual profiling work orders (whole work orders as the effort-quality
unit); 07-execution-guide.md §Model-specific notes (attestation flags;
`not-applicable` versus `unknown`); 09-audit-resilience-privacy.md §Privacy and
minimization and §Candidate — public Git with a local private evidence lane
(the opt-in account label candidate); `docs/PLAYBOOK.md` §Who does what;
`scripts/lib/control-time.mjs` (`controlTimeProjection`), `scripts/resume.mjs`
(`completionActor`, the actor flag grammar), `scripts/test-resume.sh`.

**Objective:** Answer “which actors did this repository's work, for how long,
in which phases” from the control log alone, and let the operator tell two
accounts of the same harness apart in that answer without ever publishing who
the accounts are.

**Observed gap (dated 2026-09-05, `main` at `v0.6.0`):**

- Since WO-028 every completion event carries `recordedAt`, and since WO-019
  every completion event carries `actor` (`harness`, `harnessVersion`,
  `model`, `effort`, `source`). `status --json` shows elapsed phases for one
  order and `times` lists events; nothing aggregates elapsed time by actor
  across orders, so the operator's question currently needs a spreadsheet.
- The operator runs the same harness under more than one provider account and
  wants to compare their usage windows. The attestation has no field for that,
  and adding an identifying one would publish account identities in a public
  log.
- The privacy candidate in 09 already frames the answer: an opaque public label
  plus a private-lane mapping the tool never reads.

**Design (scope discipline):**

- `npm run resume --silent -- usage [--json]` is read-only. It folds every
  order (legacy segment and per-order segments), pairs each phase start with
  its completion as `controlTimeProjection` does, and groups completed attempts
  by `harness`, `harnessVersion`, `model`, `effort`, `accountLabel`, and phase:
  count, total signed milliseconds, count of `unknown` endpoints, and the list
  of work orders. A second grouping is per work order. Retries stay separate
  attempts. Wall-clock spans include waiting; the output says so.
- `--account-label <label>` is accepted by the four completion commands and
  stored as `actor.accountLabel`. The `DOTLN_ACCOUNT_LABEL` environment
  variable supplies a default per shell so an operator with two terminals does
  not forget; the flag wins. Labels match `^[a-z][a-z0-9-]{0,15}$`; anything
  containing `@`, whitespace, uppercase, or a control or line-separator
  character refuses before append. Absent means `not-applicable` in every
  projection and is never inferred from any other field.
- The meaning of a label lives in an ignored local file. This order adds
  `/docs/control/local/` to `.gitignore`, documents the convention (one line
  per label, whatever the operator uses to recognize the account), and never
  reads that file from any script. Two labels in the public log disclose that
  two accounts exist; the re-identification note in 09 records that choice for
  this public profile and that a stricter profile omits the field.
- `status --json`, `current.md`, and the work-order index show a present label
  beside the attestation. `usage` adds no token, cost, or attention data; those
  remain private-lane candidates.

**Deliverables:** the `usage` command in JSON and text forms; the optional
attestation field with validation; the environment-variable default;
`.gitignore` and the documented local mapping convention; tests in
`scripts/test-resume.sh`; the write-backs below.

**Acceptance criteria (all required)**

1. Over a fixture with three orders, two harnesses, two models, two labels,
   one retry, and one pre-migration endpoint, `usage --json` groups exactly as
   designed, counts the retry as a separate attempt, reports the unknown
   endpoint under `unknown`, and lists each group's work orders; the text form
   renders the same numbers.
2. `usage` appends nothing and rewrites no projection (`cmp` on every segment
   and on `current.md` before and after).
3. Label validation refuses `Test`, `a b`, `x@y`, a 17-character label, and a
   label containing a line separator, each before append; `a1` and `claude-2`
   are accepted; the environment default is used when the flag is absent and
   overridden when it is present.
4. A completion event without a label projects `not-applicable`; nothing
   derives a label from `harness`, `model`, or any other field.
5. `git check-ignore docs/control/local/account-labels.md` succeeds; no script
   opens any path under `docs/control/local/`; the real log at activation
   produces a `usage` report the result echoes.
6. Write-backs land: 07 §Model-specific notes (the flag, the environment
   default, `not-applicable`); 02's attestation paragraph (one sentence); 09
   (the candidate becomes the adopted convention for this profile, with the
   two-accounts disclosure noted); `docs/PLAYBOOK.md` §Who does what (how to
   set the label per terminal); `docs/README.md` (the ignored local
   directory); ledger entry.
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts for criteria 1 through 5; the
real-log `usage` output; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** token, cost, or attention telemetry; reading provider accounts,
billing, or session files; inferring the account from the environment; pricing
or subscription advice inside the tool (the projection informs the operator's
decision and stops there); changing any legality rule; a per-model budget
policy.

**Operator-review assumptions**

1. Publishing an opaque label, and thereby the fact that two accounts exist, is
   acceptable in this repository's public profile.
2. The mapping file is a plain ignored text file the operator maintains by
   hand; no tool reads it.
3. The order waits for WO-030 so the multi-order fold is written once.
