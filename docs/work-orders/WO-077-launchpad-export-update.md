# WO-077 — Launchpad export update: `launchpad export --update <dir>` refreshes an existing export's kit files by manifest, refuses locally modified ones, never touches instance files, and prints the instance actions and the re-emit instruction (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One command mode over the kit manifest.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** WO-033's `--update` item, cut into a bounded
child at the operator's 2026-09-08 correction; the operator's chain made
mechanical (core → starter by this command; starter → forks by ordinary
upstream merge). Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-074 merged (a prior manifest to update from).
**Recommended placement:** after WO-074, in a free lane; it edits
`scripts/launchpad.mjs`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "a prior manifest to update from"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
(the update item and the instance-actions note); 03-architecture.md
§Platform and instance boundary; ADR-0006 Decision 7.

**Objective:** `--update` requires a prior manifest; replaces a kit file only
when its current bytes still match the prior manifest's hash; lists and
refuses to overwrite a kit file the instance modified locally; adds new kit
files; removes kit files the new manifest dropped only when unmodified;
never touches an instance file; rewrites `UPSTREAM.md` and the manifest to
the new commit; prints the dated instance-actions note when the kit carries
one; and prints the re-emit instruction; it refuses without a prior manifest.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Nothing refreshes an export; a fork could take core's improvements only
  by hand.

**Design (scope discipline):**

- Without opt-in the command never applies an instance action; the note is
  the kit's, dated. An instance may opt in through its configuration to
  `--apply`, which performs only the kit-declared mechanical instance
  actions (a renamed root, a new configuration field with its default, a
  changed phrase), records each as an event, and refuses any action the
  kit did not declare; an unapproved update and an opted-in update are
  distinct receipts.
- **Declined alternatives, recorded:** automatic refresh of any fork
  without its opt-in (never); a three-way merge of kit files (refusal is
  the reviewable path).

**Deliverables:** the mode, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. Over a fixture export with one locally modified kit file, one instance
   file, one overlay file, one dropped kit file and one new kit file, the
   update replaces only the unmodified kit files, lists the modified one as
   refused, leaves every instance and overlay file byte-identical, removes
   the dropped file, adds the new one, rewrites the manifest and
   `UPSTREAM.md`, and prints the re-emit instruction.
2. A kit carrying a dated instance-actions note prints it; without a prior
   manifest the command refuses; with the instance's opt-in, `--apply`
   performs the declared mechanical actions as events and refuses an
   undeclared one.
3. A fixture instance with a running fixture resident survives an opted-in
   update: the resident resumes from its log after the update, its derived
   orders keep their identities, and its next cadence fires.
4. Write-backs land: the client README (take upstream updates; opting in),
   ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** any fork's own upstream merge; the overlay (WO-076).

**Operator-review assumptions**

1. Refusing a modified kit file is the right default; the instance resolves
   it by hand.
