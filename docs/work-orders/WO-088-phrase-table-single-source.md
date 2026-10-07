# WO-088 — One source for the operator phrase table: `resume.mjs` emits it between markers in the guide, the playbook and the README, and the docs README points at it (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** machinery
**Front page:** README.md
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
**Depends on:** WO-167 merged (closed, v0.53.1). The dated planning deferral until WO-053 is
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
    "reason": "closed at v0.53.1; the fold this order's product 07 write-back followed"
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
- Marker pairs alone grant no exemption, because no product marker
  generator is registered (`docs/control/doc-ceilings.json`;
  `scripts/docs-check.mjs`). Ceilings are planning's since the 2026-10-07
  pass.

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

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

0. Re-observe the gap first: `sed -n 560,568p README.md; sed -n 199,207p docs/README.md; sed -n 546,554p docs/PLAYBOOK.md; sed -n 257,263p docs/product/07-execution-guide.md`
   (line numbers move; find the four copies by their phrases). On 2026-10-07 all four hold
   the same seven phrases, the third pass to find the gap absent. If no copy differs at the
   base, stop and record the order unmet under its assumption 3; the operator may withdraw it
   (the 2026-10-07 pass recommends that).
1. `scripts/lib/phrase-list.mjs` (new): `PHRASE_MARKER = "dotln-resume-phrases"`,
   `phraseStart`, `phraseEnd`, `PHRASE_FILES` (`README.md`, `docs/PLAYBOOK.md`,
   `docs/product/07-execution-guide.md`), `resumeIntents(roles)` (intents starting
   `resume: `, in declaration order: next, fix, status, times, verify, final review, release
   close; decided 2026-10-07), `renderPhraseList(intents)`, `phraseListFindings(root, { roles })`
   (each finding names its file), `writePhraseList(root, { roles })`; the exact-pair rule
   modelled on `historyBlock` in `scripts/lib/release-history.mjs`; roles from
   `contributorRoles` in `packages/skeleton/dist/src/loadouts/contributor.js`. The guide's
   table rows are read from the mdast `table` node docs-check's parser already yields
   (`scripts/docs-check.mjs` line 30), requiring the first cell to be exactly one
   `inlineCode` node (prose-parsing screen). Check: `node --test scripts/test-phrase-list.mjs`.
2. `scripts/resume.mjs` `run` (line 1099): branch `phrases --write|--check` before
   `reportHarnessRuntime` and `readControl`, calling step 1 (the emitter body sits in
   `scripts/lib/` because `resume.mjs` runs `findLaunchpad()` at import, line 127). Check:
   `node scripts/resume.mjs phrases --check` fails before step 4 and passes after.
3. `scripts/test-phrase-list.mjs` (new): "WO-088 list equals the Contributor's seven resume
   intents"; "refuses a changed copy naming the file"; "refuses a missing marker"; "refuses a
   doubled marker"; "refuses an unreadable file"; "refuses a guide row whose phrase the list
   lacks"; "refuses a listed phrase with no guide row"; "write changes only bytes between
   markers".
4. Insert the marker pair in the three files, then `node scripts/resume.mjs phrases --write`.
5. `scripts/test-runner.mjs`: rows
   `node("phrase-list", "scripts/resume.mjs", { args: ["phrases", "--check"], document: true, needsBuild: true })`
   and `nodeTests("phrase-list-fixtures", "scripts/test-phrase-list.mjs", { document: true })`,
   each with a `protects` entry (`scripts/test-runner.test.mjs` line 939). Check:
   `node --test scripts/test-runner.test.mjs`.
6. `scripts/lib/document-gate-stubs.mjs`: add `resume.mjs` and `test-phrase-list.mjs`. Check:
   `node scripts/check-registrations.mjs`.
7. Write-backs: product 07 §"## Operator resume phrases" (the marker pair at column 0 after the
   section's opening paragraph, outside list item 2, so its bytes equal the other copies);
   `docs/PLAYBOOK.md` §"## Resume command surface" (the list becomes the pair); `README.md`
   §"## The repo runs on itself" (the list becomes the pair; this order's `**Front page:**`
   field admits the edit under WO-189's guard); `docs/README.md` §"## Resuming the control
   loop" (one line linking `PLAYBOOK.md#resume-command-surface`);
   `docs/publication/software-engineer-toc.md` `Source lock:` from
   `node scripts/check-publication.mjs --print-locks`; `docs/evidence/WO-088/decisions.md`
   (new); `npm run publication:check`.
8. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-088/handoff.md`; `npm run resume -- implementation-ready <flags>`.

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
   markers and the list, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass); WO-072, WO-073, WO-113, WO-080,
   WO-188, WO-189, WO-190, WO-192 and WO-193 also write 07, WO-192 in
   this same section);
   the decisions file; the publication locks refreshed.
3. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the check's fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/resume.mjs` is a declared source of the harness-fixtures suite
and every file under `scripts/` of the configuration-root suite, and
again at final review. No live row.

**Write-back duty:** as listed in criterion 2.

**Known issues and carry-ins:**

- 2026-10-07 pass: the gap is absent for the third pass (all four copies
  hold the same seven phrases); step 0 says what to do, and the pass
  recommends the operator withdraw the order. Stale and corrected: product
  07's bytes; five phrases map to lifecycle actions since release close
  joined `phraseDispatches` (`09fe5d88`); the evidence gate omitted
  `harness-probe` and `process-debt`, which `resume.mjs` selects; WO-123
  is closed and WO-192 writes the same 07 section.
- Decided by the 2026-10-07 pass: declaration order for the generated
  list; the table rows read from the mdast node (prose-parsing screen);
  the `**Front page:**` field for WO-189's guard. Reopen: a copy diverges.
- Blocked on WO-189 (the README rewrite), WO-192 (the `drive:` row the
  list must ignore) and WO-073 (`resume.mjs` anchors).

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
