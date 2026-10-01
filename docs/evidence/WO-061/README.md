# WO-061 — StoryContract v1

Executor: Codex CLI 0.160.0, gpt-6.1-sol, effort max; source
`codex-session-readback`. Operator dispatch: `resume: next`.

The compiler now derives immutable classified statements, acceptance-criterion
drafts and open decisions from a decoded SourceBundle. Every statement resolves
to UTF-8 source bytes. Structural rules remain separate from supplied inference
doubles; only supplied evidence-bearing entries create answers or supersession.
Unclassified text and unanswered questions stay open.

`revise(contract, newBundle, newInferences?)` returns the new contract and the
old statement, criterion, relation and open-decision IDs it invalidated. A change
to any section or discussion entry retires all items derived from that unit.
An explicit supersession preserves the earlier requirement and draft with
`status: "superseded"`; other dependent semantic claims become invalidated.
Unchanged units preserve their classification, provenance and IDs.

Drafts contain identity, description, behavior/visual claim type and live
evidence source. They omit repository surfaces and required checks; WO-124
supplies those. `[image:<bundle image id>]` is the declared explicit visual
reference. Descriptions replace line breaks with spaces; a description the
existing criterion validator refuses stays open and is never shortened.

Application target `v0.63.0` and compiler `0.23.0` are prepared locally. The
skeleton and console versions remain unchanged; their compiler pins follow.
The new module is registered in all evidence suites. Authority, artifact identity
and verification were re-minted as revision 001; feedback was carried, with no
new live episode, and the console's four self-host fixture files follow it.

Evidence:

- [Handoff](handoff.md): all eight criterion judgments.
- [Compiler transcript](compiler-tests.txt): 138 pass, including nine new tests.
- [Fixture contracts and revision diffs](fixture-contracts.json): synthetic inputs
  and supplied inference doubles; no model episode. Reproduce with
  `node docs/evidence/WO-061/fixtures.mjs --check` after building.
- [Decisions](decisions.md): design, experiment, release, corrections, write-back
  bounds, gate results and the existing planning-register seams.

Required gates passed at code identity
`e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9`:
`npm test -- --review` passed 40 checks in 838.316 seconds (85 fresh tasks);
`npm run test:docs` passed 24 in 39.597 seconds. The initial build/type guard,
NUL fixture and evidence-command failures were corrected before those gates
and are recorded in D006. No new dependency was added.

This is executor evidence awaiting independent verification. The declared
patterns and pinned fixtures bound the classification claim; the compiler
does not establish the semantic correctness of supplied inferences. Baseline
story-kind/waiver and delivery-preparation producers remain planning duties on
the existing FUP-a8ff3066b5663629 and FUP-68937a5651fb775a rows (D009).
Final usage counters stay in the ignored harness receipts and the response.
