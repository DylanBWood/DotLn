# Using the Entropy Reducer

In `v0.5.0`, the Entropy Reducer is a compiled review loadout used through a
manual model session. Its shipped actor is **Claude Fable 5.1 at `max` in
Claude Code**. There is no `npm run entropy-reducer` or `resume: entropy`
command. `npm run skeleton` runs the deterministic Repo Gardener demonstration.
The operator's GPT-6 Astra/max default for Codex steps does not silently replace
this loadout's different actor requirement.

Open a separate session with the required actor against the repository, and
dispatch a bounded review, for example:

```text
Run one manual Entropy Reducer review using
docs/instance/entropy-reducer/README.md and RESIDUE.md.
Prepare and identify a frozen subject from the current tracked repository,
including the active work order and its cited product/decision surfaces.
Use the compiled Claude Fable 5.1/max actor requirement and record the actual
harness version, model, effort, and evidence source.
Keep the subject and control plane read-only. Confine probes to an explicitly
named scratch copy and respect the compiled operation and resource limits.
Return validated findings and non-authoritative suggestion payloads, then stop
for operator disposition. Do not fix, file proposals, activate work, or advance
the resume lifecycle. For analogies, extract the intended relationship first;
evaluate a literal detail only if a claim depends on it, recording this dated
operator correction to the shipped Shape-First wording.
```

Name any specific concern in the dispatch, such as accumulated startup context,
fold cost, workflow handoffs, or change fan-out. A concern is a hypothesis to
inspect, not a required finding. A whole-repository census inventories tracked
paths; it does not require putting every file, event, or old report into model
context. A committed subject uses its exact commit. A subject with uncommitted
tracked changes also needs a frozen snapshot and an inventory/hash of those
bytes; its base commit alone does not identify what was reviewed. Raw intake,
settings, credentials, and unrelated untracked files are not review inputs.

The dispatching host and reviewer perform these existing manual steps:

1. Read the execution guide and subject authority, then compile
   `compileReviewerWorkOrder()` from
   [`entropy-reducer.ts`](../../../packages/skeleton/src/loadouts/entropy-reducer.ts)
   against the actual repository/base, a fresh episode ID, dispatch time, and
   finite episode end. Retain its inputs, semantic hash, WorkOrder, authority
   envelope, Program, actor requirement, and residue with the new episode.
   The IDs and times in `runs/REVIEW-001-COMPILED-PROGRAM.json` belong to the
   historical example; they are not a reusable live grant.
2. Follow the compiled manual Program: census, bounded lenses, isolated probes,
   findings, and suggestions. Authorize each operation and thread the returned
   resource envelope. The four-delegate and 32-probe ceilings are maxima, not
   required usage or blanket filesystem permissions. `Program.All` remains
   deferred; a compiled plan does not launch models or enforce a shell sandbox.
3. Validate the output using `validateReviewerOutput()` or
   `prepareReportEmit()` with this episode's exact WorkOrder and episode IDs
   before report emission. Preserve the clean-room result, evidence labels,
   reproductions, and a summary under 200 words. New receipts get new IDs;
   never overwrite `REVIEW-001` or treat old evidence as a fresh run.
4. Dispatch a **fresh blinded** Fable 5.1/max episode using
   [REFUTATION-PLAN.md](REFUTATION-PLAN.md). Supply only the subjects selected by
   `selectFindingsForRefutation()` and the frozen repository, then bind its
   attempts with `buildRefutationReport()`. Refuted, blocked, and unsampled
   findings remain visible; only surviving selected findings advance for
   consideration. This refutation does not replace a work order's independent
   lifecycle verification.
5. Review the surviving findings and choose accept, defer, dismiss with reason,
   or a separately authorized implementation/planning step. The reviewer stops
   at disposition. Suggestion output does not file or activate its own work.

[RESIDUE.md](RESIDUE.md) is generated from the typed loadout, not an editable
skill or the entry point of an automatic scheduler. The
[first run](runs/REVIEW-001.json) and
[refutation](runs/REFUTATION-001.md) demonstrate the manual workflow. Sustain,
recurring observation, a dedicated launcher, and automatic review dispatch are
future capabilities.

**Known wording mismatch (2026-09-04):** the shipped Shape-First support and
generated residue ask for literal weaknesses and fixes before the useful
relation. The operator has corrected that ordering: transfer the relationship
first, and check literal details only when they become load-bearing. The
dispatch above states the correction explicitly. A follow-on correction must
change the typed support, regenerate the residue, and verify both; hand-editing
the generated file or historical run would misrepresent `v0.5.0`.
