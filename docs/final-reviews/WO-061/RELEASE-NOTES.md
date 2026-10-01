## Release overview

DotLn can now read a tracked-work artifact as requirements, not just as text. Until this release, a SourceBundle held an issue's sections, discussion and image references, but nothing derived statements, acceptance criteria or a staleness rule from it. The one story contract the runtime read was typed by hand. The compiler now turns a bundle into a StoryContract v1. Every meaningful statement is classified, points back to the exact bytes it came from, and says whether declared markup decided it or a supplied inference did. Each requirement becomes a draft acceptance criterion, and whatever is still undecided is listed openly. When the source changes, a revision retires exactly the statements and drafts derived from the edited section or discussion entry, plus anything an explicit supersession names, and keeps everything else. This release is the prerequisite for WO-124, which completes the drafts with repository surfaces and checks, and for the source-to-deliverable runs that follow it.

## Read before upgrading

- **New public contract in `@dotln/compiler` 0.23.0.** The package exports `compileStoryContract`, `revise`, `STORY_CONTRACT_VERSION` (`story-contract-v1`), `STORY_STATEMENT_CLASSES`, `STORY_RULE_PATTERNS` and their types. Nothing existing changes shape: the mission check's `MissionStoryContract` and the story file it reads are untouched.
- **Drafts are not complete criteria.** A draft carries identity, description, claim type and `evidenceSource: "live"`, but no `codeSurfaces` or `requiredChecks`. It passes the existing criterion validator only once a later step supplies those. The compile never invents a placeholder.
- **The compile refuses some caller input.** A supplied class entry that overlaps any byte of a rule-decided span refuses and names both spans. So does a relation entry without evidence, an `answers` entry whose target is not a question, or an entry whose span does not resolve on a character boundary.
- **Evidence editions and pins move.** Authority, artifact-identity and verification are re-minted as WO-061 revision 001, and feedback is carried as WO-061 feedback-001 with no new live episode. The skeleton and console now pin compiler 0.23.0, and the console self-host fixtures follow the new compiler label. No dependency is added and no other component version changes.

## Substantive changes

**Classification.** The twelve classes are fixed: requirement, non-requirement, struck, example, question, answer, visual annotation, current-behavior observation, inference, assumption, contradiction and open decision. Rules decide only declared markup. A `~~struck~~` span is `struck`. A section whose heading reads as out of scope, non-goals or not in scope is `non-requirement`. A discussion entry ending in a question mark is a `question`. A Markdown image or a bundle-declared image reference is a `visual annotation`. Every other span is classified only by a supplied entry, recorded `inferred` with its rationale, or it stays `open decision`. The compile never assigns a class by default.

**Relations.** Position alone records only `follows`: the next discussion entry by another role after a question. `answers` and `supersedes` exist only when a supplied entry with evidence spans names them, and they are recorded `inferred`. A question with no supplied answer is listed as unanswered.

**Criterion drafts.** Each requirement statement yields one draft. Its description is the statement with each line break replaced by one space. It is typed `visual` when the text references a bundle image as `[image:ID]`, and `behavior` otherwise. A description the verification validator would refuse stays an open decision with its full text and is never truncated.

**Revision.** `revise(contract, newBundle, inferences?)` returns the new contract and the old statement, draft, relation and open-decision IDs it invalidated. Supplied inferences are kept only while every source unit they depend on is unchanged. An explicit supersession keeps the earlier requirement and its draft, marked `superseded`, and invalidates the semantic relations that relied on it. Compiling the same bundle with the same inference list is byte-identical.

## Progressive polish

Product 12 §What exists and what must be proved now names the compile from a bundle to classified statements and criterion drafts. The pipeline sentence of product 06 now says what the source revision guard invalidates. Synthetic fixtures cover struck text, an out-of-scope heading, interleaved and unanswered questions, quoted earlier planning, a later reversal, a superseding decision and all twelve classes. The retained fixture contracts and both revision diffs can be reproduced with `node docs/evidence/WO-061/fixtures.mjs --check`.

## Evidence and compatibility

Application `v0.63.0` is a minor release over `v0.62.0`, built from WO-061 on `main` at `3a4aa82a`. `main` did not move during the order, so no integration was needed. `@dotln/compiler` moves from 0.22.1 to 0.23.0. The skeleton and console change only their pins and label-driven fixtures.

The verification sequence:
- [VER-001](../../verifications/WO-061/VER-001.md) passed on all eight criteria. It ran its own probes, including chained revisions, and boarded one rule gap ([D010](../../evidence/WO-061/decisions.md#wo-061-d010--verification-a-same-role-entry-between-a-question-and-its-reply-leaves-no-follows-fact)).
- [FINAL-001](FINAL-001.md) passed, and boarded four compile seams found by probes outside the order's fixtures ([D011](../../evidence/WO-061/decisions.md#wo-061-d011--final-review-pass-and-four-compile-seams-outside-the-declared-fixtures)).

`npm test -- --review` passed: 40 suites, 0 failed, 838.32 s, at code identity `e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9`. `npm run test:docs` passes.

Known limitations:
- A requirement or question containing an inline strike cannot be one statement. Classifying around the strike yields fragment drafts, and a question becomes two question statements.
- A bundle whose image reference covers only whitespace is admitted by the decoder, but the compile throws on it.
- Two identical relation entries yield duplicate relation IDs in one contract.
- A superseded item, or a draft whose claim type changes when an image in another unit is added or removed, keeps its ID and is listed as invalidated. Consumers should read the invalidated lists, not diff by ID alone.
- `follows` is recorded only when the entry immediately after a question has another role.
- Classification quality beyond the declared patterns, and the semantic correctness of supplied inferences, are not established. No model episode ran.

Details are in the [decisions](../../evidence/WO-061/decisions.md), the [handoff](../../evidence/WO-061/handoff.md) and the [evidence summary](../../evidence/WO-061/README.md).
