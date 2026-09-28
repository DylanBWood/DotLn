# WO-088 — One source for the operator phrase table: `resume.mjs` emits it between markers in the guide, the playbook and the README, and the docs README points at it (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. One generated block. Assigned at
activation under the standing opt-out default.
**Cost:** adds an emitter in `scripts/resume.mjs` that renders the seven
`resume:` phrases the compiled Contributor declares as one fenced list
between marker lines in the README, the playbook and product 07; a check
in the document gate, registered in `scripts/test-runner.mjs`, that
refuses a stale copy; a one-line pointer in `docs/README.md`; at most 250
bytes in product 07. Removes three hand-kept copies of the list and the
fourth that `docs/README.md` holds; none differs in content at
`5f3849ec`, so it removes a drift risk, not an observed defect. Re-mints:
none; `scripts/resume.mjs`, `scripts/test-runner.mjs` and the four
documents are not registered evidence sources, and the emitter reads
`packages/skeleton/src/loadouts/contributor.ts` without editing it
(`scripts/lib/evidence-sources.mjs` at `5f3849ec`). Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** WO-035's phrase-table item, cut into a bounded
child at the operator's 2026-09-08 correction. Planner-synthesized draft.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
Register row FUP-0023, the critical-path plan's deferred documentation
reset, is allocated to WO-084 to WO-090 by the 2026-09-19 cleanup pass,
which held this order with its gap to be re-observed. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the gap is recorded as not reproduced, the emitter reads the
phrases where the Contributor declares them because `resume.mjs` holds
none, and the product 07 write-back waits for the fold and is bounded
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-167 merged (product 07 holds 9 bytes of headroom until
the fold resets its ceiling). The dated planning deferral until WO-053 is
met: WO-053 passed final review on 2026-09-18 (closed, `v0.29.3`).
**Recommended placement:** second to last in the serial run, after WO-095
and before WO-089, under the 2026-09-19 hold that the 2026-09-25 pass
kept: gap to be re-observed, reopened when a phrase copy is observed to
differ (`docs/planning/outstanding-cleanup-2026-09-19.md` §4 and §5;
`docs/planning/standard-pass-2026-09-25.md` §7;
`docs/planning/sequence.md`). This order edits `scripts/resume.mjs`,
`scripts/test-runner.mjs`, product 07, the playbook, the README and
`docs/README.md`. WO-095, before it, edits the README's "What runs today",
a different section; WO-089, last, edits only the capability table. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  },
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "documentation structure is not the product bottleneck",
    "until": "WO-053"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Operator resume
phrases — how you get dispatched (the phrase table; the Contributor source
and the bundle); `docs/PLAYBOOK.md` §Resume command surface; `README.md`
§The repo runs on itself; `docs/README.md` §Resuming the control loop;
`packages/skeleton/src/loadouts/contributor.ts` (the role intents; read,
not edited) and `packages/skeleton/src/harness-host.ts`
(`phraseDispatches`; read, not edited); `scripts/resume.mjs` (the
emitter's home; it holds no phrase list at `5f3849ec`);
`scripts/test-runner.mjs` (suite registration);
`docs/control/doc-ceilings.json` and `scripts/docs-check.mjs`
(`productContent`: marker pairs grant no exemption);
`docs/planning/outstanding-cleanup-2026-09-19.md` §4 and §5; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `resume.mjs` emits the operator-phrase table between marker
lines in the execution guide, the playbook and the README; a check refuses
a stale copy; `docs/README.md`'s copy becomes a pointer.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Four copies exist and each lists the same seven `resume:` phrases: the
  README (§The repo runs on itself) and `docs/README.md` (§Resuming the
  control loop) hold one fenced list, the playbook (§Resume command
  surface) the same seven in another order, and the guide a three-column
  table whose eleven rows are the seven phrases and four further routes
  (waive, withdraw, correct, `operator override: off`). The omission the
  order was filed for is not reproduced now and was not on 2026-09-19.
- `scripts/resume.mjs` holds no phrase list. The phrases are the compiled
  Contributor's role intents
  (`packages/skeleton/src/loadouts/contributor.ts`: the seven `resume:`
  intents and five `planning:` or `ideation:` ones), and four of them map
  to lifecycle actions in `packages/skeleton/src/harness-host.ts`.
- Product 07 has 9 bytes of headroom under its ceiling; marker pairs alone
  grant no exemption, because no product marker generator is registered
  (`docs/control/doc-ceilings.json`; `scripts/docs-check.mjs`). WO-167
  resets the ceiling to the folded guide plus two per cent.

**Design (scope discipline):**

- Generated bytes between markers only; they count against product 07's
  ceiling, and the order registers no marker exemption.
- The emitter reads the phrases where they are declared, the compiled
  Contributor's role intents, and `resume.mjs` renders them; no second
  list is added to `resume.mjs`.
- The generated block is a fenced list of the seven `resume:` phrases, the
  form the README and the playbook hold; in the guide it sits in
  §Operator resume phrases above the table, whose rows stay hand-written
  procedure (operator-review assumption 2).
- The check refuses, naming the file: a copy whose bytes between the
  markers differ from the emitter's output; a missing or doubled marker; a
  file it cannot read; a `resume:` row of the guide's table naming a
  phrase the list does not hold, and a listed phrase with no row.
- **Declined alternatives, recorded:** a phrase list inside `resume.mjs`
  that the Contributor would read (it edits `contributor.ts` and
  `harness-host.ts`, registered sources of the authority, feedback and
  harness inventories, for a deterministic re-mint of each; reopen when a
  planning document moves the vocabulary into the resume script);
  generating the guide's eleven-row table into the README and the
  playbook (it carries guide procedure into two documents that hold only
  the list; reopen when a planning document asks for one table
  everywhere).

**Deliverables:** the emitter, the markers, the check, the write-backs
below.

**Acceptance criteria (all required)**

1. The emitter's list is byte-identical between the markers in the
   README, the playbook and product 07 and equals the seven `resume:`
   intents the compiled Contributor declares. The check refuses, each with
   the file named, a copy changed between its markers, a missing marker,
   an unreadable file and a guide table row for a phrase the list does
   not hold. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
2. Write-backs land: `docs/README.md`'s copy becomes a one-line pointer;
   product 07 §Operator resume phrases — how you get dispatched gains the
   markers and the list, in place with no dated paragraph (at most 250
   bytes added, against 9 bytes of headroom on 2026-09-28, which WO-167's
   fold resets; WO-167, WO-173, WO-172, WO-086, WO-123, WO-072, WO-073,
   WO-113 and WO-080 also write 07, WO-072 and WO-123 in this same
   section, so the executor re-measures the headroom at its base; where
   the bound does not fit, it consolidates the section it edits in the
   same change; a ceiling is raised only by a planning-document decision);
   the decisions file; the publication locks refreshed.
3. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the check's fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/resume.mjs` is a declared source of the harness-fixtures suite
and every file under `scripts/` of the configuration-root suite, and
again at final review. No live row.

**Write-back duty:** as listed in criterion 2.

**Non-goals:** changing any phrase; the `planning:` and `ideation:`
phrases; the procedure columns of the guide's table.

**Operator-review assumptions**

1. The resume script emits the vocabulary and the compiled Contributor
   owns it, where the phrases are declared; the order as filed assumed the
   resume script owned it, and `resume.mjs` holds none.
2. The generated block is the seven-phrase list, and the guide's table
   stays hand-written and checked.
3. The gap was not reproduced on two passes. The order stays second to
   last; the pass that reaches it re-observes the gap first and, if it is
   still absent, takes the order out of the sequence.
