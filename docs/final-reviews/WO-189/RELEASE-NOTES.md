## Release overview

This release rewrites the front page once and then puts it under guard. `README.md` is the candidate the operator chose from three complete rewrites scored by fresh readers: a page a visitor can finish, in the voice the old page had at its best, that says what DotLn is, who it is for, what runs today, how to try it in two commands, what is not built and where to read next. The visible changes:
- The page is 13,393 bytes in 235 lines instead of 39,030 bytes in 661; the map names all six packages; the stale statements (three packages of six, a read-only console, a 2026-09-06 plan as the way ahead) are gone.
- The release block between its markers holds only the one line `release prepare` writes; the forty-odd sentences it had accumulated are in the release notes and evidence that already held them.
- "What runs today" is nine one-sentence lines between marker lines with a recorded budget of eleven, written for a reader rather than one line per order.
- The toolchain and test detail moved to `CONTRIBUTING.md` §Toolchain and tests and §Release evidence.
- An order edits the page only when its leading header on `main` carries `**Front page:** README.md`; every other order proposes its sentence in its evidence README, and the document check refuses the change and names the fix.

The release is for the visitor who reads only the front page, and for the executors of the four queued orders that promise it a sentence.

## Read before upgrading

- **A README change is refused by default.** `npm run test:docs` now fails a branch that changes `README.md` outside its generated blocks unless the branch's order declares the page in its leading header on `main`; adding the field on the branch itself declares nothing. The refusal names the diff command and the rule ([D001](../../evidence/WO-189/decisions.md#wo-189-d001)).
- **The release block holds one line.** `npm run release -- prepare` refuses before any write when anything but its version line stands between the markers, and `check-surfaces` fails on it; move other text outside the markers. The two older spellings of the claim still prepare and are rewritten to the current one ([D014](../../evidence/WO-189/decisions.md#wo-189-d014--adjacent-repair-a-current-target-still-rewrites-the-block-as-its-generated-line)).
- **"What runs today" has a shape.** One whole, unwrapped sentence per counted line, nothing but blank lines and generated blocks outside the marker pair under the heading, the section named once among the headings, no raw HTML outside the marker lines, no emoji shortcode, no receipt (identifier, date or version) anywhere outside a generated block, and eleven counted lines at most; the page, the markers and the budget are `main`'s record's, so an order cannot raise its own budget ([D021](../../evidence/WO-189/decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice)).
- **The corpus comes first.** A newly found bypass or a wrongly refused sentence becomes a row of `scripts/fixtures/front-page-corpus.json` before the check changes; a reviewer's own rows run through the same test with `DOTLN_FRONT_PAGE_CORPUS`.
- **Known limits.** Look-alike letters from another script, digit note marks, French spaced guillemets, German ordinals and abbreviations, Thai without a stop, a stop meeting capitals, lowercase sentences inside inline code and a code span splitting a word are stated limits of the receipt, name and sentence rules; a generated block outside the section is judged only by its writer's check; a picture the page embeds can change without touching the page; with no local `main` the comparison is skipped with a notice (FUP-89e29438bd71c524).
- **Queued promises.** WO-095, WO-098 and WO-118 promise three sentences against two lines of headroom, and WO-088 must list its generated block in the record; both are planning items (FUP-5de3c35ef3d05142).
- **Component versions.** Application v0.74.1 is a patch over v0.74.0. No package version changes and no dependency is added.

## Substantive changes

**The front page.** `README.md` is `docs/evidence/WO-189/candidate-1200.md` outside the generated line, with the accuracy corrections the repair record names (the draft order an admitted intent files; the repair budget and the person who decides; the mission check's cadence; typed, versioned logs; the repository built with the same roles; Node 26 and two commands; the board's sources; the interruption policy specified and not yet compiled; the control records). The inventory classes every one of the old page's 131 blocks (90 keep, 1 move, 40 cut) and a check script proves each moved or cut block's facts in their destination; the reader key was committed before any candidate, and each candidate was scored by a reader given that candidate alone, launched outside the repository with tools disabled.

**The release line.** `scripts/lib/release-preparation.mjs` exports `releaseClaimLine` and writes the block as that one line; a second non-empty line or words beside the claim refuse before any write; a current target still rewrites a hand-left block. `scripts/release.mjs` `releaseBlockRule` fails on any content other than the generated line. `scripts/test-release-preparation.mjs` and `scripts/test-release.sh` pin both refusals; the fixture pages of the integration, worktree and concurrent-control suites carry the one-line block, and a new case of `scripts/test-worktree-integration.mjs` merges two versions of that line.

**The guard.** `scripts/docs-check.mjs` gains `frontPageFindings` and the pure `frontPageShapeFindings`; `scripts/lib/front-page-scope.mjs` reads the typed header field through the existing header reader; `scripts/lib/config.mjs` gains `configuredRoots` so the record is found where the merge base's configuration puts the control root; `docs/control/front-page.json` records the page, its generated blocks and the section's markers and budget. `scripts/test-docs-check.mjs` adds thirteen fixture groups (ownership at the merge base, the governing record, the budget and receipts, the one-range rule, rendered sentences and headings across Markdown spellings, the closed inline list, the page GitHub shows, main's record, the bootstrap and no-merge-base paths, the typed field, the 915-row corpus, and the executed comparison against `08845c71`).

**The rules.** `docs/PLAYBOOK.md` §The loop, per work order and product 07 §Documentation freshness and ownership replace the fifteen-sentence write-back with the ownership rule, the proposed-sentence destination and the planning trigger; the maintainer comment is gone from the page.

## Progressive polish

`CONTRIBUTING.md` gains §Toolchain and tests and §Release evidence with the text that left the page; the software-engineer publication source lock is refreshed; the README's release claim reads v0.74.1; the order's own register rows are settled or re-disposed at close, and FUP-84bc6f15abd1e45f (the release block regenerated within its rule) is settled on the one generated line.

## Evidence and compatibility

Application `v0.74.1` is a patch over `v0.74.0`, built from WO-189 integrated with `main` at `d17ce004` by fast-forward over the order's base `c6769090` with no authored conflict ([D025](../../evidence/WO-189/decisions.md#wo-189-d025)). No package version changes and no dependency is added; the new code imports only `node:` built-ins, the pinned `prettier` and local modules. A page without the section markers is brought under guard by the branch that adds them; a repository with no front-page record is not judged.

The verification sequence:
- [VER-001](../../verifications/WO-189/VER-001.md) failed criterion 5: prose below the closing marker, a marker pair above the heading and many sentences on one line passed; repaired by judging the section as one range.
- [VER-002](../../verifications/WO-189/VER-002.md) failed criterion 5: emphasis delimiters hid sentence breaks and an emphasized namesake heading; repaired by judging rendered structure through the pinned parser.
- [VER-003](../../verifications/WO-189/VER-003.md) failed criterion 5: template tags, wiki links and inline math rendered as nothing and a raw HTML heading escaped; repaired by closing raw HTML and the parser's extensions page-wide, reading each line twice and recording every case in the corpus.
- [VER-004](../../verifications/WO-189/VER-004.md) passed: the three earlier probe sources rerun unchanged, 26 new shape cases and 7 ownership cases with no mismatch, 57 fixture groups green, and one evidence follow-up boarded.
- [FINAL-001](FINAL-001.md) passed at the integrated tree: the four probe sources and the three affected suites rerun under the bounded runner, the evidence follow-up reconciled, `npm run test:docs` at 32 of 32 in 113.94 s, and `npm test -- --review` fresh at the integrated identity `ecc2d86a…` (32 suites, 84 tasks, 1655.53 s).

Known limitations:
- The sentence and name rules have the stated orthographic limits above; the ownership refusal is the load-bearing control, and further Unicode rules would refuse more ordinary prose than they catch.
- The readers' stdin and effective user-level instruction loading were not retained, so their isolation beyond the recorded launch settings is unobserved.
- The two alternate candidates need their closing paragraph moved inside the markers before either can replace the page.
- The ten voice restorations one repair record described are not on the page; a later front-page order decides them ([D026](../../evidence/WO-189/decisions.md#wo-189-d026--final-review-pass-at-the-integrated-subject-the-comparison-regenerated-and-the-register-retargeted)).

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-189/decisions.md) and the [handoff](../../evidence/WO-189/handoff.md).
