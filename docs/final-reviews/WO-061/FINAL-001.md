# WO-061 — FINAL-001

**Verdict:** pass. All eight criteria are met against the original order. The evidence is VER-001, my own reading of the full diff, a rerun of the WO-061 tests and the fixture-diff reproduction on a fresh build, direct edition, console, harness and publication checks, and the passing product row at the unchanged code identity. `main` has not moved past the executor's base (`v0.62.0`, `3a4aa82a`), so no integration was needed and `v0.63.0` stays the target. My probes found four compile seams outside the order's fixtures, and I board them in [D011](../../evidence/WO-061/decisions.md#wo-061-d011--final-review-pass-and-four-compile-seams-outside-the-declared-fixtures). The one that matters most for the runs ahead: a requirement containing an inline strike can only be classified in fragments, because criterion 2 refuses any class entry that overlaps a rule-decided byte.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 38865 tokens; handoff 8465807 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-061 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage 4786b507-ffd4-44d7-81e8-b16cf2226c15`. The entry sample was observed at 2026-10-01T23:02:42.335Z and the handoff sample at 2026-10-01T23:14:13.345Z (64 steps, 61 commands), before this report was filed. Both are cumulative transcript counters; 8,254,902 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer. No full product gate ran in this review, because the code identity was unchanged (see Executed checks).

## Subject and evidence

The verified subject is the uncommitted worktree over base `3a4aa82a25cd2f99924bd67a15354100600c003f`, at code identity `e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-061/VER-001.md) passed, and no repair followed. No ideation breakout receipt applies: the evidence folder holds none, and `docs/intake/` holds only `.gitkeep` files. The order's text changed only in its title, where the version placeholder became `v0.63.0` (D004). No scope expansion was recorded. `npm run plan -- check` exits 0.

Integration. `git fetch` shows `origin/main` at `3a4aa82a`, which is the executor's base and the commit tag `v0.62.0` names. No upstream change exists to integrate. `npm run release -- prepare` against origin tags reports `WO-061 target v0.63.0 remains current`, and it refreshed the PR meter and the order's meter snapshot.

I reviewed:
- the order, and its cited sources: product 12 §One outcome from request to return, §Replacing a successful but costly workflow and §What exists and what must be proved; the source revision guard in product 06's pipeline sentence; the idea ledger's statement classification taxonomy (eleven classes, with `open decision` added by the order); `source-bundle.ts` for span semantics, roles and `resolveSourceSpan`; `verification.ts` for `verificationLine`, `copyCriterion` and `CLAIM_TYPES` (which includes `visual`); WO-154 D011 and WO-162 D012; planning document §10.1; product 08 §PRs and commits; and product 07 §Goal-aligned decisions and §Ideation breakout receipt and verification;
- the handoff, the evidence README, D001–D010 and VER-001 in full;
- the full diff:
  - `packages/compiler/src/story-contract.ts`: the contract types, `STORY_RULE_PATTERNS`, `copyInference`, `ruleSpans` with its specificity-ordered subtraction, the overlap refusals, gap statements, `follows`, supplied relations, supersession, drafts, open decisions, and `revise`'s retention and invalidation diff;
  - `packages/compiler/test/story-contract.test.ts` and `packages/compiler/fixtures/wo061-story-contracts.json`;
  - the index export, the compiler version label, the three package pins and the lockfile;
  - the `commonSources` registration, `docs/evidence/current.json`, the console manifest and three self-host outputs, and the 32 regenerated harness surfaces (compiler label, snapshot path and hashes only);
  - the product 12 and 06 write-backs, the README release line and the generated index, register and decisions rows.

The diff matches the order's design. The compile is pure: it reads no clock, randomness, I/O or model, it copies its inputs, and it freezes only its own output. Rules decide only declared markup, and their patterns are exported as data. Every class entry is checked against every rule span before any statement is emitted. Text no rule or entry decides becomes `open decision`. Statement, relation and draft IDs carry the fingerprint of their whole source unit, and that fingerprint includes the unit's own image references. So an edit to any byte of a section or entry changes the IDs derived from it and nothing else, and inserting a section elsewhere changes none (probe P5). Drafts carry no surfaces or checks. `revise` keeps a supplied inference only while every unit it depends on is unchanged, then diffs old against new by ID and canonical value.

The registration and re-mints follow WO-154 D011 and WO-162 D012. The compiler label moves the policy hash, so feedback is carried with no live episode. The console's diff is confined to the manifest and the three self-host outputs, and every changed line is the label, the edition path, its digest or the policy hash.

Code quality. The module is compact and legible. The decisions file lists its records out of numeric order (D008, D009, D006, …), which the index absorbs; harmless. A supplied class entry may use a rule class such as `struck` on unmarked text. VER-001 observed this, and it stays distinguishable because its origin is `inferred`. An inferred `open decision` entry is listed with reason `unclassified`, which reads oddly but follows the order's rule that every `open decision` statement is listed.

Clean-room screen: I searched the diff to `packages`, `scripts`, `README.md` and the product documents, the new fixture, the WO-061 evidence Markdown and script, and VER-001. The search covered user paths, account identities, URLs, token and key shapes, and private keys. The only match is the fixture's synthetic image URL on `github.com/synthetic`, the bundle's declared allowed host. The fixture text is synthetic. No lint or type suppression directive was added.

## Probes

I built the compiler from the staged subject and ran these against `packages/compiler/dist`:
- **P1. Whitespace image reference.** Section text `Panel text.   More text.` with an image whose `referencedBy` is bytes 11–14 (three spaces). `decodeSourceBundle` admits it, then `compileStoryContract` throws `story contract: span must resolve to nonempty text`.
- **P2. Duplicate relation entry.** One supplied `answers` entry passed twice yields two `answers` relations with the same `relationId`. Identical class entries refuse as overlapping, and `revise` removes duplicates.
- **P3. Inline strike.** A requirement entry over `The panel shows ~~10~~ 20 rows.` refuses, naming the strike span. Entries over `The panel shows` and `20 rows.` derive two fragment drafts. The entry `Should we ~~drop~~ keep it?` compiles to two question statements around the strike, and two `unanswered` open decisions.
- **P4. ID kept on a changed value.** A requirement `Match the layout in [image:img].` derives a `visual` draft from an image referenced by another section. Removing that image keeps `criterion:354b3951ccde02a9`, now `behavior`, and lists the same ID in `invalidated.criteria`. The criterion 3 test already asserts that a superseded statement keeps its ID. The type comment saying "replacement items have fresh IDs" is therefore inaccurate. The invalidated lists are correct.
- **P5. Position independence.** Inserting a new section before two unchanged sections invalidates nothing.

None of P1–P4 occurs in the bundles criterion 1 enumerates or the fixtures criterion 4 is judged against. P3 follows from criterion 2's refusal itself. D011 records all four, with a follow-up for WO-124, the next order that edits the module (register row `FUP-2534f4dc631f5ebc`, untriaged).

## Criteria

**Criterion 1:** met. The fixture holds a struck span (`s-old`), an `Out of scope` heading (`s-excluded`), interrogative entries, an image reference (`s-visual`) and requirements. My rerun of the nine WO-061 tests on a fresh build passes. They pin the class projection of the three classification fixtures and the rule classes of WO-060's six valid bundles. They also resolve every statement span through `resolveSourceSpan`, and check that recompiling with the same or a reversed inference list gives the same bytes. Together the fixtures emit all twelve classes.

**Criterion 2:** met. The test attacks every rule statement in the core fixture with a one-byte class entry, and each attempt refuses with a message naming both spans. A touching span is admitted, and one crossing a strike boundary refuses. In source, `compileStoryContract` checks every class entry against every rule span before emitting anything. An `answers` entry with evidence attaches to a ruled question, is recorded `inferred` with its rationale, and leaves the question's origin `rule`. An entry without evidence refuses. Every statement a supplied entry decided carries origin `inferred` and its rationale.

**Criterion 3:** met. `node docs/evidence/WO-061/fixtures.mjs --check` reproduces the retained 50,353-byte contracts and both revision diffs. Editing `s-change` invalidates exactly its two statements and two drafts, and leaves the other units' statements and drafts identical. A new decision entry with a supplied `supersedes` relation retires the unedited `s-keep` requirement and its draft. It also invalidates the `answers` relation that cites `s-keep` as evidence. Without the supplied relation, the decision text retires nothing. P4 shows a cross-unit case beyond the fixtures, where the invalidation is still correct.

**Criterion 4:** met against the order's fixtures. The thread fixture pins `follows` for e-q2→e-q1 and e-a1→e-q2 as `rule`. The only `answers` and `supersedes` relations are the two supplied ones, both `inferred`. Without supplied relations, only `follows` remains and all three questions are listed `unanswered`. `s-unknown` is listed `unclassified`. VER-001's F1, the adjacency reading of `follows`, is outside the fixtures and routed by D010.

**Criterion 5:** met. Every fixture draft's `criterionId` and `description` pass `verificationLine`. Completed with one fixture surface and one fixture check, every draft passes `copyCriterion` whole, including the one `visual` draft. No draft carries `codeSurfaces` or `requiredChecks`. All five line-break forms become single spaces. A 2,001-character one-line requirement derives no draft and is listed `criterion-description` with its full text, while a 2,000-character one derives a draft.

**Criterion 6:** met. Measured against the base with byte lengths, product 12 gains 167 bytes in §What exists and what must be proved (limit 200), and product 06 gains 93 bytes in the pipeline sentence of §Application version pending — Source-to-deliverable vertical (limit 150). Both edits are in place, with no dated paragraph. D007 records the ceilings: 193 and 126 bytes of headroom remain. The decisions file and its index rows are present. `npm run publication:check` passes, with both source locks current (29 and 45 linked sections).

**Criterion 7:** met. `story-contract.ts` is registered in `commonSources`, and `test-evidence-sources.mjs` passes. `docs/evidence/current.json` selects WO-061 revision 001 for all four editions. I ran the authority, artifact-identity, verification and feedback `--check` scripts myself, and each exits 0. `console-fixtures.mjs --check` matches all five cases, and `harness-evidence.mjs --check` exits 0. D005 and D007 record each re-mint, the carry and the console re-pin.

**Criterion 8:** met. `npm test -- --review` in this review found a complete passing row at the unchanged code identity (see Executed checks). `npm run test:docs` passes with this review's records in place. `git diff --check` and `git diff --cached --check` are clean. `package-lock.json` changes only the compiler version and its two consumer pins, so no dependency was added.

## Register

`npm run plan -- followups --touching --work-order WO-061` matched 10 pending rows at register revision `28536fe6…`, before D011 was indexed.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-aa6dbe9c5ad79995 | `story-contract.ts`, VER-001, WO-061 | left untriaged | D010's `follows` reading belongs to the next order that edits the module. This review changed no source. |
| FUP-a8ff3066b5663629 | WO-061 | left untriaged | WO-180-D013's BaselineStory class source and waiver are composition duties, routed before WO-123. The twelve-class contract chooses no story kind. D009 recorded that WO-061's activation met its reopening condition. |
| FUP-68937a5651fb775a | WO-061 | left untriaged | WO-182-D006 names WO-061's contract only as a future source of the ambiguity inventory, and its producer belongs to the composition. |
| FUP-56b599e15f97e666 | `scripts/lib/evidence-sources.mjs` | left | The registration line changes no `resident-state.ts` behavior. |
| The other six | evidence, generated, README or control files | left | Textual matches only, as D009 records. |

`npm run meta` then synced D011, which created the untriaged row `FUP-2534f4dc631f5ebc`.

## Executed checks

- Base: `git fetch`; `origin/main` = `HEAD` = `3a4aa82a`, at tag `v0.62.0`. No integration was needed.
- Build and focused tests: `node scripts/build.mjs` in `packages/compiler` exits 0. `node --test dist/test/story-contract.test.js` passes 9 of 9.
- `node docs/evidence/WO-061/fixtures.mjs --check`: the contracts and revision diffs match (50,353 bytes).
- Probes P1–P5 (above), from a scratch script against the built `dist`.
- After `npm run build`, each of these exits 0: `authority-evidence.mjs --check`, `artifact-identity-evidence.mjs --check`, `verification-evidence.mjs --check`, `feedback-evidence.mjs --check`, `console-fixtures.mjs --check` (5 of 5 cases), `harness-evidence.mjs --check` and `test-evidence-sources.mjs`.
- `node scripts/harness.mjs check`: exit 0, 32 generated surfaces.
- `npm run publication:check`: pass, both tables of contents current.
- `npm run release -- check-surfaces --local`: exit 0.
- `npm run release -- prepare`: target `v0.63.0` remains current.
- Product row: `npm test -- --review` exits 0 and starts no suite. It reports the complete passing row at code identity `e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9`: 40 suites, 838.32 s, recorded 2026-10-01T22:29:05.059Z (`host-gate:e584634c…:npm test`). I added no source in review, so the row still binds the subject. The three new staged source files are tracked, so the identity covers them.
- `npm run test:docs`: 24 passed, 0 failed, 37.98 s, 24 fresh tasks, with this report, PR.md, RELEASE-NOTES.md and D011 in place. The result transition runs it again inline.
- `npm run plan -- check`: exit 0. `npm run meta`: D011 indexed; health line `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at earlier closes).
- `git diff --check` and `git diff --cached --check`: clean.

Not re-run: a fresh full product gate (`--again`). The identity is unchanged, and a rerun would spend about 14 minutes of shared compute without testing anything new. VER-001's chained-revision probe was also not re-run; it reads the same bytes.

## Judgment and publication

D001 and D011 compare their choices with the mission, the eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- A bundle now compiles reproducibly into classified, provenance-bearing statements and criterion drafts.
- Markup-decided facts are kept apart from supplied inferences, and undecided meaning stays open.
- A revision retires exactly what an edited unit or an explicit supersession touched, in the fixtures and in my cross-unit probe.
- The cost was one review dispatch and no product-gate rerun.

The benefit is still partial where D011 points. Real artifacts with inline strikes will yield fragment drafts until a planning decision lets a statement enclose a struck span. A degenerate image reference can stop a bundle from compiling.

Result route: `final-review-result pass`.
