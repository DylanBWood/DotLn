# WO-061

Before this change, nothing turned a tracked-work artifact into requirements. A SourceBundle (WO-060) was decoded text with no statements, no criteria and no rule for what a later edit makes stale. The only story contract the runtime read was a hand-written file. This pull request lands WO-061. `compileStoryContract(bundle, inferences?)` in `@dotln/compiler` derives a StoryContract v1. Every meaningful statement gets one of twelve classes, a resolving UTF-8 provenance span and an origin: `rule` when declared markup decided it, `inferred` when a supplied entry did. The contract also holds one criterion draft per requirement and the decisions that remain open. `revise(contract, newBundle, inferences?)` retires exactly what a changed section or discussion entry, or an explicit `supersedes` relation, touched. It keeps every other item and its ID.

- **Rules decide only markup.** Struck spans are `struck`, a section under an out-of-scope heading is `non-requirement`, a discussion entry ending in `?` is a `question`, and image references are `visual annotation`. The patterns are exported data (`STORY_RULE_PATTERNS`). The next entry by another role after a question is only a `follows` fact, never an answer.
- **Everything else is supplied or open.** Class entries and `answers`/`supersedes` relation entries come from a caller (a fixture double here, a model episode in WO-112). They are recorded `inferred` with their rationale and never promoted. A class entry that overlaps a rule-decided byte refuses and names both spans. A relation needs evidence spans. Text no rule decides and no entry classifies becomes `open decision`, and an unanswered question is listed as open.
- **Criterion drafts.** Each requirement yields `criterionId`, `description`, `claimType` and `evidenceSource: "live"`. The type is `visual` when the text names a bundle image as `[image:ID]`, otherwise `behavior`. Line breaks become spaces. A description the existing verification validator would refuse (over 2,000 characters, or carrying a control character) stays an open decision rather than being truncated. Surfaces and checks are WO-124's to derive, so the compile emits no placeholder.
- **Revision.** Each item's ID carries the fingerprint of its whole source unit. An edit to any byte of a section or entry therefore invalidates everything derived from it, and nothing else. A new supersession must be supplied: decision text alone retires nothing.
- **Release obligations.** `@dotln/compiler` 0.22.1 → 0.23.0 with the skeleton and console pins. The module is registered in `commonSources`. Authority, artifact-identity and verification are re-minted as WO-061 revision 001, feedback is carried with no live episode, and the console's four self-host fixture files follow the compiler label, as WO-162 D012 permits. Product 12 gains 167 bytes and product 06 93 bytes, in place.

**Version.** The order was executed on `v0.62.0` (`3a4aa82a`), and `main` has not moved, so no integration was needed. Application `v0.63.0` is a minor release. No dependency is added.

**Validation.** `npm test -- --review` passed: 40 suites, 0 failed, 838.32 s, at code identity `e584634cbd5b2c85d81c245ed16946397924e37ae5628c1bce546aa73d9408b9`, which the final review re-confirmed unchanged. `npm run test:docs` passes. [VER-001](../../verifications/WO-061/VER-001.md) passed with its own probes, including chained revisions. [FINAL-001](FINAL-001.md) passed after rerunning the WO-061 tests, the fixture-diff reproduction and the edition, console, harness and publication checks.

**Known limits** ([D010](../../evidence/WO-061/decisions.md#wo-061-d010--verification-a-same-role-entry-between-a-question-and-its-reply-leaves-no-follows-fact), [D011](../../evidence/WO-061/decisions.md#wo-061-d011--final-review-pass-and-four-compile-seams-outside-the-declared-fixtures)). All of these are outside the order's fixtures and routed to WO-124, the next order that edits the module.
- **Inline strikes fragment statements.** A requirement containing a strike, such as "shows ~~10~~ 20 rows", cannot be classified whole. Split around the strike, it derives fragment drafts. A question with a strike becomes two question statements.
- **Whitespace image references throw.** A bundle whose image reference covers only whitespace decodes, but `compileStoryContract` then throws.
- **Duplicates and same-ID changes.** Two identical relation entries yield duplicate relation IDs. A superseded item, or a draft whose type changed with an image in another unit, keeps its ID and is listed as invalidated.
- **Follows needs an adjacent reply.** `follows` is recorded only when the entry immediately after a question has another role.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T23:13:08.616Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-181 | 6,364,541 (Δ unavailable) / 3 | 1,788,507 (Δ unavailable) | 4 (Δ unavailable) / 45,954 (Δ unavailable) | 40,317,429 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 1 (Δ unavailable) |
| WO-105 | 9,351,472 (Δ 2,986,931) / 3 | 4,580,821 (Δ 2,792,314) | 3 (Δ -1) / 19,100 (Δ -26,854) | 44,067,562 (Δ 3,750,133) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 3 (Δ 2) |
| WO-178 | 12,691,894 (Δ 3,340,422) / 6 | 2,740,715 (Δ -1,840,106) | 4 (Δ 1) / 87,371 (Δ 68,271) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -3) |
| WO-177 | 2,898,257 (Δ -9,793,637) / 3 | 421,171 (Δ -2,319,544) | 4 (Δ 0) / 36,300 (Δ -51,071) | 14,343,231 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-182 | 5,812,601 (Δ 2,914,344) / 3 | 1,677,566 (Δ 1,256,395) | 3 (Δ -1) / 16,668 (Δ -19,632) | 18,764,996 (Δ 4,421,765) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-061 | 4,243,928 (Δ -1,568,673) / 2 | 838,316 (Δ -839,250) | 4 (Δ 1) / 40,444 (Δ 23,776) | 24,874,201 (Δ 6,109,205) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-061/executor | 3,797,115 (731,192) | unavailable (unavailable) | unavailable (unavailable) | 12,097,568 (4,710,580) | 77 (17) | unavailable (unavailable) / 1,019 |
| WO-061/verifier | 446,813 (-763,749) | 61,514 (20,484) | 43 (-26) | 6,722,029 (-4,572,830) | 54 (-28) | unavailable (unavailable) / unavailable |
| WO-061/reviewer | 550,409 (-985,707) | 41,106 (27,048) | 57 (19) | 6,054,604 (5,971,455) | 60 (19) | unavailable (unavailable) / unavailable |
| WO-061/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-061/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-061/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
